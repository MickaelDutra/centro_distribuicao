# Sistema de Monitoramento de Produtividade - Centro de Distribuição

## Descrição

Este projeto consiste em uma aplicação backend que realiza a extração de dados de uma URL interna (página web protegida por login), captura informações de produtividade em formato gráfico, e disponibiliza esses dados em formato JSON por meio de uma API REST. 

No frontend, esses dados são consumidos para preencher um formulário dinâmico, que permite acompanhar e atualizar a produtividade, a meta de produção e a previsão de término da jornada no centro de distribuição. O sistema apresenta gráficos interativos que demonstram o desempenho acumulado ao longo do turno, facilitando a tomada de decisões e o acompanhamento em tempo real.

---

## Funcionalidades

- Login automatizado via Puppeteer para acessar a URL protegida.
- Extração dos dados do gráfico usando Cheerio.
- API REST que expõe os dados coletados em JSON.
- Frontend com formulário dinâmico para inserção e visualização da meta e produtividade por hora.
- Cálculo e atualização automática da produtividade média, meta acumulada e previsão de término do turno.
- Visualização gráfica em tempo real com gráficos de linha e barras para melhor análise.

---

## Tecnologias utilizadas

- Node.js
- Express.js
- Puppeteer (automatização do navegador para login e coleta de dados)
- Cheerio (parsing e extração de dados HTML)
- Chart.js (gráficos dinâmicos no frontend)
- HTML/CSS/JavaScript para a interface

---

