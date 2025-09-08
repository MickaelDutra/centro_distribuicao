// expedicao

// script.js

async function carregarDados() {
    showLoading();
    try {
        const resposta = await fetch('http://10.0.6.185:3000/expedicao/dados');
        if (!resposta.ok) {
            throw new Error(`Erro na requisição: ${resposta.status}`);
        }

        const dados = await resposta.json();

        if (dados.tarefasPorHora && typeof dados.tarefasPorHora === 'object') {
            preencherTarefas(dados);
        }

        // Atualiza gráficos com base nos inputs atuais (incluindo metaTotal, etc)
        atualizarGrafico();

    } catch (erro) {
        console.error('Erro ao carregar dados:', erro);
    }
    hideLoading();
}

function preencherTarefas(dados) {
    const agora = new Date();
    const horaAtual = agora.getHours(); // só a hora inteira

    const inputsHoras = document.querySelectorAll('#tarefasPorHora input');
    inputsHoras.forEach((input) => {
        const horaInputStr = input.getAttribute('data-hora'); // ex: "17:00"
        const [horaInput] = horaInputStr.split(':').map(Number);

        // 
        if (horaInput < horaAtual) {
            const valor = dados.tarefasPorHora[horaInputStr] ?? 0;
            input.value = valor === 0 ? "" : valor; // se 0 deixa vazio
        } else {
            input.value = ""; // hora futura = vazio
        }
    });
}


window.addEventListener('load', () => {
    carregarDados();

    // Atualiza a cada 1 hora (3600000 ms)
    setInterval(carregarDados, 3600000);
});

async function carregarConfig() {
    const res = await fetch("http://10.0.6.185:3000/expedicao/config");
    const config = await res.json();
    document.getElementById('metaTotal').value = config.metaTotal;
    document.getElementById('horaInicio').value = config.horaInicio;
    document.getElementById('horaFim').value = config.horaFim;

    gerarCamposHoras(); // gera os inputs
    atualizarGrafico();
}

// Auto-save
function salvarConfig() {
    const metaTotal = document.getElementById('metaTotal').value;
    const horaInicio = document.getElementById('horaInicio').value;
    const horaFim = document.getElementById('horaFim').value;

    fetch("http://10.0.6.185:3000/expedicao/config", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ metaTotal, horaInicio, horaFim })
    })
        .then(res => res.json())
        .then(data => console.log(data))
        .catch(err => console.error(err));
}

// Eventos
document.getElementById('metaTotal').addEventListener('change', salvarConfig);
document.getElementById('horaInicio').addEventListener('change', salvarConfig);
document.getElementById('horaFim').addEventListener('change', salvarConfig);

// Ao iniciar a página
window.onload = async () => {
    await carregarConfig();  // gera os inputs (com base em horaInicio/horaFim)
    await carregarDados();   // preenche os inputs com os dados do JSON
};

let chartLine
let chartBar
let isLineChartVisible = true

window.onload = () => {
    // Buscar configs do servidor
    fetch("http://10.0.6.185:3000/expedicao/config")
        .then((res) => res.json())
        .then((data) => {
            document.getElementById("metaTotal").value = data.metaTotal
            document.getElementById("horaInicio").value = data.horaInicio
            document.getElementById("horaFim").value = data.horaFim
            gerarCamposHoras()
            atualizarGrafico()
        })

    function salvarConfig() {
        fetch("http://10.0.6.185:3000/expedicao/config", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
                metaTotal: document.getElementById("metaTotal").value,
                horaInicio: document.getElementById("horaInicio").value,
                horaFim: document.getElementById("horaFim").value,
            }),
        })
    }

    document.getElementById("metaTotal").addEventListener("change", salvarConfig)
    document.getElementById("horaInicio").addEventListener("change", salvarConfig)
    document.getElementById("horaFim").addEventListener("change", salvarConfig)
}

//function de loading
function showLoading() {
    document.getElementById("loadingOverlay").style.display = "flex"
}

function hideLoading() {
    document.getElementById("loadingOverlay").style.display = "none"
}

const pausas = [
    { inicio: "12:00", fim: "13:00" },
    { inicio: "20:00", fim: "21:00" },
]

// converte "HH:MM" para minutos
function horaParaMinutos(hora) {
    const [h, m] = hora.split(":").map(Number)
    return h * 60 + m
}

// verifica se um horário está dentro de uma pausa
function estaNaPausa(horaLabel) {
    const minutos = horaParaMinutos(horaLabel)
    return pausas.some((pausa) => {
        const inicio = horaParaMinutos(pausa.inicio)
        const fim = horaParaMinutos(pausa.fim)
        return minutos >= inicio && minutos < fim
    })
}

// cria os horários
function gerarCamposHoras() {
    const horaInicio = document.getElementById("horaInicio").value
    const horaFim = document.getElementById("horaFim").value

    const [inicioHora, inicioMin] = horaInicio.split(":").map(Number)
    const [fimHora, fimMin] = horaFim.split(":").map(Number)

    const inicioTurno = new Date()
    inicioTurno.setHours(inicioHora, inicioMin, 0, 0)

    const fimTurno = new Date(inicioTurno)
    fimTurno.setHours(fimHora, fimMin, 0, 0)
    if (fimTurno <= inicioTurno) fimTurno.setDate(fimTurno.getDate() + 1)

    const tarefasDiv = document.getElementById("tarefasPorHora")
    tarefasDiv.innerHTML = ""

    let horaAtual = new Date(inicioTurno)
    while (horaAtual < fimTurno) {
        const proximaHora = new Date(horaAtual.getTime() + 3600000)
        const horaLabel = horaAtual.toTimeString().slice(0, 5)
        const label = `${horaLabel} - ${proximaHora.toTimeString().slice(0, 5)}`

        // só cria input se não estiver em pausa
        if (!estaNaPausa(horaLabel)) {
            tarefasDiv.innerHTML += `
                <div class="hora-input">
                    <label>${label}</label>
                    <input type="number" data-hora="${horaLabel}" value="">
                </div>
            `
        }

        horaAtual = proximaHora
    }

    // listeners
    const inputsHoras = document.querySelectorAll("#tarefasPorHora input")
    inputsHoras.forEach((input) => {
        input.addEventListener("change", salvarDados)
        input.addEventListener("change", atualizarGrafico)
    })
}

// atualização do grafico
function atualizarGrafico() {
    const metaTotal = Number(document.getElementById("metaTotal").value)
    const inputsHoras = document.querySelectorAll("#tarefasPorHora input")

    const horaInicio = document.getElementById("horaInicio").value
    const horaFim = document.getElementById("horaFim").value

    // calcula fimTurno também aqui
    const [inicioHora, inicioMin] = horaInicio.split(":").map(Number)
    const [fimHora, fimMin] = horaFim.split(":").map(Number)

    const inicioTurno = new Date()
    inicioTurno.setHours(inicioHora, inicioMin, 0, 0)

    const fimTurno = new Date(inicioTurno)
    fimTurno.setHours(fimHora, fimMin, 0, 0)
    if (fimTurno <= inicioTurno) fimTurno.setDate(fimTurno.getDate() + 1)

    // quantidade de horas úteis (já sem pausas)
    const horasUteis = inputsHoras.length
    const metaPorHora = horasUteis > 0 ? metaTotal / horasUteis : 0

    // arrays para gráfico
    const horas = []
    const metaAcumulada = []
    const producaoAcumulada = []

    // variáveis de controle
    let acumulado = 0
    let horasTrabalhadas = 0
    let somaInformada = 0
    let totalInformadas = 0

    // calcula soma e quantidade informada
    inputsHoras.forEach((input) => {
        const valor = Number(input.value)
        if (input.value !== "" && valor !== 0) {
            somaInformada += valor
            totalInformadas++
        }
    })

    const mediaEstimada = totalInformadas > 0 ? somaInformada / totalInformadas : 0

    const agora = new Date()
    const horaAtualString = agora.toTimeString().slice(0, 5)
    let horaAtualIndex = -1
    let acumuladoAteAgora = 0

    inputsHoras.forEach((input, index) => {
        const horaLabel = input.getAttribute("data-hora")
        const v = Number(input.value)
        const valor = input.value === "" || v === 0 ? mediaEstimada : v

        acumulado += valor
        horas.push(horaLabel)
        metaAcumulada.push((metaPorHora * (index + 1)).toFixed(0))
        producaoAcumulada.push(acumulado)

        if (input.value !== "" && !Number.isNaN(v) && v !== 0) horasTrabalhadas++

        if (horaParaMinutos(horaLabel) <= horaParaMinutos(horaAtualString)) {
            horaAtualIndex = index
            acumuladoAteAgora = acumulado
        }
    })

    console.log(horasTrabalhadas + " horas de trabalho")

    const tarefasRestantes = metaTotal - acumuladoAteAgora

    if (tarefasRestantes <= 0) {
        // Meta já atingida
        document.getElementById("previsaoSaida").innerText = `✅ Meta atingida! Previsão de término da separação ${horaFim}`
        document.getElementById("alertaAtraso").style.display = "none"
    } else {
        const horasRecentesParaMedia = Math.min(3, totalInformadas) // Usar últimas 3 horas ou menos
        let somaRecente = 0
        let contadorRecente = 0

        // Pegar as últimas horas informadas para uma média mais precisa
        for (let i = inputsHoras.length - 1; i >= 0 && contadorRecente < horasRecentesParaMedia; i--) {
            const input = inputsHoras[i]
            const valor = Number(input.value)
            if (input.value !== "" && valor !== 0) {
                somaRecente += valor
                contadorRecente++
            }
        }

        const mediaRecente = contadorRecente > 0 ? somaRecente / contadorRecente : mediaEstimada

        if (Math.abs(mediaRecente - metaPorHora) < 0.1) {
            // Produtividade está na média necessária, deve terminar no fim do turno
            document.getElementById("previsaoSaida").innerText = `⏰ Previsão de saída: ${horaFim}`
            document.getElementById("alertaAtraso").style.display = "none"
        } else {
            // Produtividade diferente da média, calcular baseado no ritmo atual
            const horasNecessarias = tarefasRestantes / (mediaRecente || 1)
            const minutosNecessarios = horasNecessarias * 60
            const fimEstimado = new Date(agora.getTime() + minutosNecessarios * 60000)

            let tempoComPausas = new Date(fimEstimado)
            pausas.forEach((pausa) => {
                const inicioPausa = horaParaMinutos(pausa.inicio)
                const fimPausa = horaParaMinutos(pausa.fim)
                const agoraMinutos = horaParaMinutos(horaAtualString)
                const estimadoMinutos = horaParaMinutos(tempoComPausas.toTimeString().slice(0, 5))

                // Se a pausa está entre agora e o fim estimado, adicionar o tempo da pausa
                if (inicioPausa > agoraMinutos && inicioPausa < estimadoMinutos) {
                    const duracaoPausa = fimPausa - inicioPausa
                    tempoComPausas = new Date(tempoComPausas.getTime() + duracaoPausa * 60000)
                }
            })

            const horaEstimativa = tempoComPausas.toTimeString().slice(0, 5)
            document.getElementById("previsaoSaida").innerText = `⏰ Previsão de saída: ${horaEstimativa}`

            // se passar do fim do turno, calcula atraso
            if (tempoComPausas > fimTurno) {
                const atrasoMs = tempoComPausas - fimTurno
                const atrasoHoras = Math.floor(atrasoMs / 3600000)
                const atrasoMinutos = Math.floor((atrasoMs % 3600000) / 60000)

                let atrasoTexto = ""
                if (atrasoHoras > 0) atrasoTexto += `${atrasoHoras}h `
                if (atrasoMinutos > 0) atrasoTexto += `${atrasoMinutos}min`

                document.getElementById("alertaAtraso").style.display = "block"
               // document.getElementById("alertaAtraso").innerText = `⚠️ Atraso esperado: ${atrasoTexto}`
            } else {
                document.getElementById("alertaAtraso").style.display = "none"
            }
        }
    }

    const tarefasRestantesTotal = metaTotal - acumulado
    const horasRestantes = horasUteis - horasTrabalhadas
    const produtividadeNecessaria = tarefasRestantesTotal / (horasRestantes || 1)

    const metaSeparacaoHora = metaPorHora.toFixed(1)
    document.getElementById("metaSeparacaoHora").innerText =
        `📊 Meta de separação/hora: ${metaSeparacaoHora} tarefas/hora`

    const produtividadeNecessariaEl = document.getElementById("produtividadeNecessaria")
    produtividadeNecessariaEl.innerText = `📈 Produtividade necessária: ${produtividadeNecessaria.toFixed(1)} tarefas/hora`
    produtividadeNecessariaEl.style.color = acumulado < metaTotal ? "red" : "green"

    const corProducao = acumulado < metaTotal ? "red" : "green"

    // gráfico de linha
    const canvasLine = document.getElementById("graficoMeta")
    if (canvasLine) {
        if (chartLine) chartLine.destroy()
        chartLine = new Chart(canvasLine.getContext("2d"), {
            type: "line",
            data: {
                labels: horas,
                datasets: [
                    {
                        label: "Meta acumulada",
                        data: metaAcumulada,
                        borderColor: "#273dae",
                        tension: 0.3,
                        fill: true,
                    },
                    {
                        label: "Produção real",
                        data: producaoAcumulada,
                        borderColor: corProducao,
                        tension: 0.3,
                        fill: true,
                    },
                ],
            },
            options: {
                responsive: true,
                plugins: {
                    legend: { position: "bottom", labels: { usePointStyle: true } },
                    title: { display: true, text: "Desempenho de Separação por Hora" },
                },
                scales: {
                    y: { beginAtZero: true, title: { display: true, text: "Tarefas acumuladas" } },
                    x: { title: { display: true, text: "Horário" } },
                },
            },
        })
    }

    // gráfico de barras
    const canvasBar = document.getElementById("graficoBarras")
    if (canvasBar) {
        if (chartBar) chartBar.destroy()

        const metaPorHoraArray = []
        const producaoPorHoraArray = []
        const horasFiltradas = []

        inputsHoras.forEach((input) => {
            const horaLabel = input.getAttribute("data-hora")
            const valor = input.value === "" ? null : Number(input.value)

            if (valor !== null && !isNaN(valor)) {
                horasFiltradas.push(horaLabel)
                metaPorHoraArray.push(metaPorHora.toFixed(0))
                producaoPorHoraArray.push(valor)
            }
        })

        chartBar = new Chart(canvasBar.getContext("2d"), {
            type: "bar",
            data: {
                labels: horasFiltradas,
                datasets: [
                    { label: "Meta por hora", data: metaPorHoraArray, backgroundColor: "#3498db" },
                    { label: "Produção realizada", data: producaoPorHoraArray, backgroundColor: "#e74c3c" },
                ],
            },
            options: {
                responsive: true,
                plugins: {
                    legend: { position: "bottom" },
                    title: { display: true, text: "Meta x Realizado por Hora" },
                    tooltip: { callbacks: { label: (tooltipItem) => tooltipItem.raw } },
                },
                scales: {
                    x: { title: { display: true, text: "Horário" } },
                    y: { beginAtZero: true, title: { display: true, text: "Tarefas" } },
                },
            },
        })
    }
}

function toggleFullscreen() {
    if (!document.fullscreenElement) {
        document.documentElement.requestFullscreen();
    } else {
        if (document.exitFullscreen) {
            document.exitFullscreen();
        }
    }
}

function alternarGrafico() {
    isLineChartVisible = !isLineChartVisible
    document.getElementById("graficoMeta").style.display = isLineChartVisible ? "block" : "none"
    document.getElementById("graficoBarras").style.display = !isLineChartVisible ? "block" : "none"
}

setInterval(alternarGrafico, 7000)

document.getElementById("horaInicio").addEventListener("change", gerarCamposHoras)
document.getElementById("horaFim").addEventListener("change", gerarCamposHoras)


const salvarDados = () => {
    console.log("dados salvos")
}
