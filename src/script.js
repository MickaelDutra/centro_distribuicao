// script.js

async function carregarDados() {
    try {
        const resposta = await fetch('http://localhost:3000/dados');
        if (!resposta.ok) {
            throw new Error(`Erro na requisição: ${resposta.status}`);
        }

        const dados = await resposta.json();
        
        // Gera campos por hora de acordo com o turno (baseado nos inputs de horaInicio e horaFim atuais)
        gerarCamposHoras();

        // Preenche tarefas por hora - só os inputs gerados dentro do #tarefasPorHora
        if (dados.tarefasPorHora && typeof dados.tarefasPorHora === 'object') {
            const inputsHoras = document.querySelectorAll('#tarefasPorHora input');
            inputsHoras.forEach((input) => {
                const hora = input.getAttribute('data-hora'); // ex: "07:00"
                if (dados.tarefasPorHora[hora] !== undefined && dados.tarefasPorHora[hora] !== 0) {
                    input.value = dados.tarefasPorHora[hora];
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
