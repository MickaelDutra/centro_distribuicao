// Seleção de iframes e controle de rotação automática
const iframes = document.querySelectorAll("iframe");

// 🔹 Nomes personalizados para cada iframe
const nomes = [
    "Avisos",
    "WMS - Gerencial",
    "WMS - Geral",
    "WMS - Gráficos",
    "Não embarcados",
    "Separação",
];

const seletor = document.getElementById("seletor");
const botaoPausa = document.getElementById("togglePausa");

let indiceAtual = 0;
let intervalo;
let pausado = false;

// Preenche o seletor com os nomes
iframes.forEach((frame, i) => {
    const option = document.createElement("option");
    option.value = i;
    option.textContent = nomes[i] || `Tela ${i + 1}`;
    seletor.appendChild(option);
});

function mostrarIframe(index) {
    iframes.forEach((frame, i) => {
        frame.classList.toggle("ativo", i === index);
    });
    seletor.value = index;
    indiceAtual = index;
}


function trocarIframe() {
    indiceAtual = (indiceAtual + 1) % iframes.length;
    mostrarIframe(indiceAtual);
}


function iniciarRotacao() {
    intervalo = setInterval(trocarIframe, 20000); // 20s
}

botaoPausa.addEventListener("click", () => {
    if (pausado) {
        iniciarRotacao();
        botaoPausa.textContent = "⏸️ Pausar";
        botaoPausa.classList.remove("pausado");
    } else {
        clearInterval(intervalo);
        botaoPausa.textContent = "▶️ Retomar";
        botaoPausa.classList.add("pausado");
    }
    pausado = !pausado;
});

seletor.addEventListener("change", (e) => {
    clearInterval(intervalo);
    mostrarIframe(parseInt(e.target.value));
    if (!pausado) iniciarRotacao();
});

// Inicialização
mostrarIframe(indiceAtual);
iniciarRotacao();