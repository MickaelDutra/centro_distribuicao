const express = require("express");
const cors = require("cors");
const puppeteer = require("puppeteer");
const fs = require("fs");
const path = require("path");


const app = express();
const PORT = 3000;

app.use(express.static(path.join(__dirname, "src")));


const LOGIN_URL = "http://129.159.63.229:6042/login";
const GRAFICO_URL = "http://129.159.63.229:6042/graficos/tarefas-por-hora";

// Login
const USER = "login";
const PASS = "senha";


app.use(cors());

// rota principal
app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, "src", "apresentação_expedicao.html"));
});

// rota de dados
app.get("/dados", async (req, res) => {
  const browser = await puppeteer.launch({
    /*
    headless: false,
    slowMo: 50,
    args: ["--start-maximized"],
    defaultViewport: null
    */
   headless: true,
   args: ["--no-sandbox", "--disable-setuid-sandbox"]
  });

  try {
    const page = await browser.newPage();

    // Login
    console.log("Acessando o login...")
    await page.goto(LOGIN_URL, { waitUntil: "networkidle2", timeout: 60000 });
    await page.type('input[name="username"]', USER, { delay: 50 });
    await page.type('input[name="password"]', PASS, { delay: 50 });
    await page.click('button[type="submit"]');
    await page.waitForNavigation({ waitUntil: "networkidle2", timeout: 60000 });

    // Vai para o gráfico
    console.log("Acessando o gráfico...")
    await page.goto(GRAFICO_URL, { waitUntil: "networkidle2", timeout: 60000 });

    // Seleciona tipo de tarefa
    console.log("Selecionando tarefa...")
    const selectors = [
      'input[placeholder="Clique ou digite para pesquisar"]',
      'input[type="text"]',
    ];
    let inputFound = false;
    for (const selector of selectors) {
      try {
        await page.waitForSelector(selector, { timeout: 9000 });
        const input = await page.$(selector);
        await input.click({ clickCount: 3 });
        await input.type("4 - SEPARACAO MANUAL", { delay: 50 });
        await page.waitForSelector('.select2-results__option, .MuiAutocomplete-option', { timeout: 5000 });
        await page.click('.select2-results__option, .MuiAutocomplete-option');
        inputFound = true;
        break;
      } catch {
        continue;
      }
    }
    if (!inputFound) {
      throw new Error("Campo de 'Tipo Tarefa' não encontrado.");
    }

    // Gera gráfico
    console.log("Gerando o gráfico...")
    await page.waitForSelector('button[type="submit"]', { timeout: 1000 });
    await page.click('button[type="submit"]');
    await new Promise(resolve => setTimeout(resolve, 2000)); // espera 2 segundos
    // Aguarda gráfico renderizar
    await page.waitForSelector("g.c3-texts-Quantidade text.c3-text", { timeout: 3000 });

    // Coleta dados diretamente do DOM
    console.log("Coletando dados do DOM...")
    const tarefasPorHora = await page.evaluate(() => {
      const valores = Array.from(document.querySelectorAll("g.c3-texts-Quantidade text.c3-text"))
        .map(el => parseInt(el.textContent.trim() || "0", 10));

      const horas = Array.from(document.querySelectorAll("g.c3-axis-x g.tick tspan"))
        .map(el => el.textContent.trim());

      const resultado = {};
      horas.forEach((hora, i) => {
        resultado[hora + ":00"] = valores[i] ?? 0;
      });

      return resultado;
    });
    console.log("Rodou corretamente!")
    await browser.close();
    return res.json({ tarefasPorHora });

  } catch (e) {
    const pages = await browser.pages();
        console.error("Erro capturado:", e);
    await browser.close();
    return res.status(500).json({ erro: "Falha ao coletar dados.", detalhe: e.message });
  }
});

app.listen(PORT, "0.0.0.0", () => {
  console.log(`Servidor rodando em http://localhost:${PORT}`);
});
