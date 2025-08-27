// script.js

async function carregarDados() {
    try {
        const resposta = await fetch('http://10.0.6.185:3000/dados');
        if (!resposta.ok) {
            throw new Error(`Erro na requisição: ${resposta.status}`);
        }

        const dados = await resposta.json();

        // Preenche tarefas por hora - só os inputs gerados dentro do #tarefasPorHora
        if (dados.tarefasPorHora && typeof dados.tarefasPorHora === 'object') {
            const inputsHoras = document.querySelectorAll('#tarefasPorHora input');
            inputsHoras.forEach((input) => {
                const hora = input.getAttribute('data-hora'); // "07:00"
                const valor = dados.tarefasPorHora[hora];
                if (valor !== undefined && valor !== 0) {
                    input.value = valor;   // mostra só se for diferente de zero
                } else {
                    input.value = "";      // se não existir ou for zero, deixa vazio
                }
            });
        }

        // Atualiza gráficos com base nos inputs atuais (incluindo metaTotal, etc)
        atualizarGrafico();

    } catch (erro) {
        console.error('Erro ao carregar dados:', erro);
    }
}



window.addEventListener('load', () => {
    carregarDados();

    // Atualiza a cada 1 hora (3600000 ms)
    setInterval(carregarDados, 3600000);
});

async function carregarConfig() {
    const res = await fetch("http://10.0.6.185:3000/config");
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

    fetch("http://10.0.6.185:3000/config", {
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
