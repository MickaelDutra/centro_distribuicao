const app = require('./app');
require('dotenv').config();

const PORT = process.env.PORT || 3333;



app.listen(PORT, "0.0.0.0", () => {
    console.log(`Servidor rodando em http://10.0.6.185:${PORT}`);
});
