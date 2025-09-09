async function carregarDados() {
    showLoading();
    console.log("Função carregarDados iniciada"); // <- Adicione isto
    try {
        const response = await fetch("http://10.0.6.185:3000/expedicao/embarques");
        const data = await response.json();

        const tabela = document.querySelector("#tabela-clientes tbody");
        tabela.innerHTML = ""; // Limpa antes de preencher

        data.embarques.forEach(item => {
            const tr = document.createElement("tr");
            tr.innerHTML = `
        <td>${item.cliente}</td>
        <td>${item.qtdUnit}</td>
      `;
            tabela.appendChild(tr);
        });
    } catch (error) {
        console.error("Erro ao carregar dados:", error);
        alert("Falha ao carregar dados do servidor.");
    }
    hideLoading();
}


//function de loading
function showLoading() {
    document.getElementById("loadingOverlay").style.display = "flex"
}

function hideLoading() {
    document.getElementById("loadingOverlay").style.display = "none"
}


window.onload = async () => {
    await carregarDados();   // preenche os inputs com os dados do JSON
};