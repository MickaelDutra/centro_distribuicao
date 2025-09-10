# Centro de Distribuição

## Visão Geral

Este projeto foi desenvolvido para atender às necessidades operacionais
de um **Centro de Distribuição**, oferecendo uma plataforma integrada
para acompanhamento e controle em tempo real das operações.

A aplicação fornece:\
- **Acompanhamento de produtividade em tempo real** dos colaboradores
e processos.\
- **Previsão de saída** de cargas com base em dados de produtividade e
metas.\
-  **Controle de expedição de cargas D-2**, garantindo visibilidade
  de fluxo logístico.\
- **Registro e acompanhamento de erros de sistema**, para suporte e
análise de falhas.\
- **Apresentação automatizada em iFrames**, exibindo informações
pertinentes para a operação em monitores de acompanhamento.\
- **Painel inicial (Hub de acesso)** com links centralizados para
todas as páginas do sistema.

------------------------------------------------------------------------

## 🛠 Tecnologias Utilizadas

### Backend

-   **Node.js** -- Servidor e APIs de integração.\
-   **Express.js** -- Criação de rotas e endpoints.\
-   **MySQL** -- Persistência de dados (produtividade, expedição,
    registros de erros).\
-   **Puppeteer + Cheerio** -- Extração de dados de gráficos e páginas
    do WMS para exibição em tempo real.

### Frontend

-   **HTML5, CSS3 e JavaScript** -- Estrutura e lógica do sistema web.\
-   **Bootstrap** -- Estilização responsiva e rápida.\
-   **Chart.js** -- Exibição de gráficos de produtividade e expedição.

------------------------------------------------------------------------

## 📂 Estrutura do Projeto

    📦 projeto-centro-distribuicao
    ├── backend
    │   ├── app.js          # Servidor Node.js
    │   ├── routes/           # Rotas de API
    │   ├── controllers/      # Regras de negócio
    │   ├── models/           # Conexão e queries MySQL
    │   └── utils/            # Funções auxiliares (scraping, etc.)
    │
    ├── frontend
    │   ├── *.html        # Painel inicial com links
    │   └── css/          # Estilos personalizados
    |   └── Js/           # Arquivos Js frontEnd
    │
    ├── docs
    │   └── README.md         # Documentação do projeto
    │
    ├── package.json
    └── .gitignore

------------------------------------------------------------------------

## ⚙️ Funcionalidades

-   **Dashboard de Produtividade**\
    Gráficos atualizados em tempo real com metas vs realizado por hora.

-   **Previsão de Saída**\
    Algoritmo que estima o horário previsto de saída das cargas com base
    no andamento da separação.

-   **Expedição D-2**\
    Tela dedicada para visualizar os embarques que não foram realizados.

-   **Registro de Erros**\
    Módulo para registrar inconsistências do sistema e acompanhar a
    resolução.

-   **Apresentação Rotativa (iFrames)**\
    Página que alterna automaticamente entre gráficos, indicadores e
    alertas para exibição em monitores.

-   **Painel Inicial (Hub)**\
    Página principal que concentra os acessos às demais funcionalidades.

------------------------------------------------------------------------

## ▶️ Como Executar

### Pré-requisitos

-   Node.js \>= 18\
-   MySQL instalado e configurado

### Passos

``` bash
# Clonar repositório
git clone https://github.com/seu-usuario/projeto-centro-distribuicao.git

# Acessar pasta
cd projeto-centro-distribuicao

# Instalar dependências
npm install

# Configurar (arquivo .env)
descrito em exempla.env

# Rodar servidor
npm start
```

Acesse apenas interno.

------------------------------------------------------------------------

## Próximos Passos / Melhorias

-   Autenticação de usuários (níveis de acesso por setor).\
-   Layout responsivo otimizado para tablets.\
-   Históricos de produtividade e relatórios exportáveis.\
-   Alertas em tempo real via notificações na tela ou e-mail.

------------------------------------------------------------------------

##  Autor

Desenvolvido por **Mickael Dutra** -- Projeto para
acompanhamento operacional em **Centro de Distribuição**.
