
const aniversariantes = [
    { nome: "Teste", data: "03/09" },
    { nome: "Teste 2", data: "12/09" },
    { nome: "Teste 3", data: "27/09" }
];

const lista = document.getElementById("listaAniversariantes");
aniversariantes.forEach(pessoa => {
    const li = document.createElement("li");
    li.className = "list-group-item";
    li.textContent = `${pessoa.data} - ${pessoa.nome}`;
    lista.appendChild(li);
});
