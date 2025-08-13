let chartLine;
let chartBar;
let isLineChartVisible = true;

// const do header

// cria os horários
function gerarCamposHoras() {
    const metaTotal = document.getElementById('metaTotal').value;
    const horaInicio = document.getElementById('horaInicio').value;
    const horaFim = document.getElementById('horaFim').value;
    // busca inicio hora e fim hora e splita em dois object
    const [inicioHora, inicioMin] = horaInicio.split(':').map(Number);
    const [fimHora, fimMin] = horaFim.split(':').map(Number);
    // define o inicio do turno e zera os seg e ms
    const inicioTurno = new Date();
    inicioTurno.setHours(inicioHora, inicioMin, 0, 0);
    // define fim do turno e D+1 caso passe a meia noite
    const fimTurno = new Date(inicioTurno);
    fimTurno.setHours(fimHora, fimMin, 0, 0);
    if (fimTurno <= inicioTurno) fimTurno.setDate(fimTurno.getDate() + 1);
    // busca o o id tarefas por hora e limpa ele
    const tarefasDiv = document.getElementById('tarefasPorHora');
    tarefasDiv.innerHTML = '';
    // gera o form das tarefas por hora
    let horaAtual = new Date(inicioTurno);
    while (horaAtual < fimTurno) {
        const proximaHora = new Date(horaAtual.getTime() + 3600000);
        const label = `${horaAtual.toTimeString().slice(0, 5)} - ${proximaHora.toTimeString().slice(0, 5)}`;

        tarefasDiv.innerHTML += `
          <div class="hora-input">
            <label>${label}</label>
            <input type="number"  data-hora="${horaAtual.toTimeString().slice(0, 5)}" value="">
          </div>
        `;

        horaAtual = proximaHora;
    }
}

// atualização do grafico
function atualizarGrafico() {
    const metaTotal = document.getElementById('metaTotal').value;
    const horaInicio = document.getElementById('horaInicio').value;
    const horaFim = document.getElementById('horaFim').value;
    const inputsHoras = document.querySelectorAll('#tarefasPorHora input');
    // const para criar horas
    const [inicioHora, inicioMin] = horaInicio.split(':').map(Number);
    const [fimHora, fimMin] = horaFim.split(':').map(Number);

    const inicioTurno = new Date();
    inicioTurno.setHours(inicioHora, inicioMin, 0, 0);

    const fimTurno = new Date(inicioTurno);
    fimTurno.setHours(fimHora, fimMin, 0, 0);
    if (fimTurno <= inicioTurno) fimTurno.setDate(fimTurno.getDate() + 1);
    // duração e metas
    const duracaoTurno = (fimTurno - inicioTurno) / 3600000;
    const metaPorHora = metaTotal / duracaoTurno;
    // array de horas e metas
    const horas = [];
    const metaAcumulada = [];
    const producaoAcumulada = [];
    // inicializa as vairaveis
    let acumulado = 0;
    let horasTrabalhadas = 0;
    let somaInformada = 0;
    let totalInformadas = 0;
    // busca inputs diferentes de 0 e vazio para acrescentar na soma e divisão da média
    inputsHoras.forEach((input) => {
        if (input.value !== '' && input.value !== 0) {
            somaInformada += Number(input.value);
            totalInformadas++;
        }
    });
    //media se > 0 retorna soma tarefas / total de inputs
    const mediaEstimada = totalInformadas ? somaInformada / totalInformadas : 0;

    inputsHoras.forEach((input, index) => {
        const horaLabel = input.getAttribute('data-hora');

        // Se o input estiver vazio ou for zero, usa a média estimada
        const valor = (input.value === '' || Number(input.value) === 0)
            ? mediaEstimada
            : Number(input.value);

        acumulado += valor;
        horas.push(horaLabel);
        metaAcumulada.push((metaPorHora * (index + 1)).toFixed(0));
        producaoAcumulada.push(acumulado);

        if (input.value !== '' && input.value !== 0) horasTrabalhadas++;
    });


    const produtividadeMedia = acumulado / inputsHoras.length;
    const novaDuracaoEstimativa = metaTotal / (produtividadeMedia || 1);
// previsão de saída
    const fimEstimado = new Date(inicioTurno.getTime() + novaDuracaoEstimativa * 3600000);
    const horaEstimativa = fimEstimado.toTimeString().slice(0, 5);

    document.getElementById('previsaoSaida').innerText = `⏰ Previsão de saída: ${horaEstimativa}`;

    const tarefasRestantes = metaTotal - acumulado;
    const horasRestantes = duracaoTurno - horasTrabalhadas;
    const produtividadeNecessaria = tarefasRestantes / (horasRestantes || 1);
// metas de separaçao
    const metaSeparacaoHora = metaPorHora.toFixed(1);
    document.getElementById('metaSeparacaoHora').innerText = `📊 Meta de separação/hora: ${metaSeparacaoHora} tarefas/hora`;
// produtividade necessaria
    const produtividadeNecessariaEl = document.getElementById('produtividadeNecessaria');
    if (acumulado < metaTotal) {
        produtividadeNecessariaEl.innerText = `📈 Produtividade necessária: ${produtividadeNecessaria.toFixed(1)} tarefas/hora`;
        produtividadeNecessariaEl.style.color = 'red';
    } else {
        produtividadeNecessariaEl.innerText = `📈 Produtividade necessária: ${produtividadeNecessaria.toFixed(1)} tarefas/hora`;
        produtividadeNecessariaEl.style.color = 'green';
    }

// alerta de atraso
    document.getElementById('alertaAtraso').style.display = fimEstimado > fimTurno ? 'block' : 'none';

    const corProducao = acumulado < metaTotal ? 'red' : 'green';
// grafico
    if (chartLine) chartLine.destroy();
    chartLine = new Chart(document.getElementById('graficoMeta').getContext('2d'), {
        type: 'line',
        data: {
            labels: horas,
            datasets: [
                {
                    label: 'Meta acumulada',
                    data: metaAcumulada,
                    borderColor: '#273dae',

                    tension: 0.3,
                    fill: true
                },
                {
                    label: 'Produção real',
                    data: producaoAcumulada,
                    borderColor: corProducao,
                    tension: 0.3,
                    fill: true
                }
            ]
        },
        options: {
            responsive: true,
            plugins: {
                legend: {
                    position: 'bottom',
                    labels: {
                        usePointStyle: true
                    }
                },
                title: {
                    display: true,
                    text: 'Desempenho de Separação por Hora'
                }
            },
            scales: {
                y: {
                    beginAtZero: true,
                    title: {
                        display: true,
                        text: 'Tarefas acumuladas'
                    }
                },
                x: {
                    title: {
                        display: true,
                        text: 'Horário'
                    }
                }
            }
        }
    });

    if (chartBar) chartBar.destroy();

    const metaPorHoraArray = [];
    const producaoPorHoraArray = [];
    const horasFiltradas = [];

    inputsHoras.forEach((input) => {
        const horaLabel = input.getAttribute('data-hora');
        const valor = input.value === '' ? null : Number(input.value);

        if (valor !== null && !isNaN(valor)) {
            horasFiltradas.push(horaLabel);
            metaPorHoraArray.push(metaPorHora.toFixed(0));
            producaoPorHoraArray.push(valor);
        }
    });

    chartBar = new Chart(document.getElementById('graficoBarras').getContext('2d'), {
        type: 'bar',
        data: {
            labels: horasFiltradas,
            datasets: [
                {
                    label: 'Meta por hora',
                    data: metaPorHoraArray,
                    backgroundColor: '#3498db',
                },
                {
                    label: 'Produção realizada',
                    data: producaoPorHoraArray,
                    backgroundColor: '#e74c3c',
                }
            ]
        },
        options: {
            responsive: true,
            plugins: {
                legend: {
                    position: 'bottom',
                },
                title: {
                    display: true,
                    text: 'Meta x Realizado por Hora'
                },
                tooltip: {
                    callbacks: {
                        label: function (tooltipItem) {
                            return tooltipItem.raw;
                        }
                    }
                }
            },
            scales: {
                x: {
                    title: {
                        display: true,
                        text: 'Horário'
                    }
                },
                y: {
                    beginAtZero: true,
                    title: {
                        display: true,
                        text: 'Tarefas'
                    }
                }
            }
        }
    });
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
    isLineChartVisible = !isLineChartVisible;
    document.getElementById('graficoMeta').style.display = isLineChartVisible ? 'block' : 'none';
    document.getElementById('graficoBarras').style.display = !isLineChartVisible ? 'block' : 'none';
}

setInterval(alternarGrafico, 5000);

document.getElementById('horaInicio').addEventListener('change', gerarCamposHoras);
document.getElementById('horaFim').addEventListener('change', gerarCamposHoras);

window.onload = () => {
    gerarCamposHoras();
    atualizarGrafico();
};