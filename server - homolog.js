// Importa o framework Express
const express = require('express');
// Importa o módulo body-parser para processar dados de formulários
const bodyParser = require('body-parser');
// Importa o módulo express-session para gerenciar sessões
const session = require('express-session');
// Importa a função de configuração das rotas
const { setupRoutes } = require('./routes/centralizador_de_rotas');
// Importa a conexão com o banco de dados
const { connection } = require('./db/db');
const { pool } = require('./db/db');
// Importa o módulo https e o módulo fs para trabalhar com o sistema de arquivos
const https = require('https');
const fs = require('fs');
const path = require('path');

const app = express();

// Configuração da sessão
app.use(session({
    secret: 'cookie_utilizado_de_protecao',
    resave: false,
    saveUninitialized: true
}));

// Configura o body-parser para lidar com dados codificados no formato URL
app.use(bodyParser.urlencoded({ extended: true }));

// Configura o body-parser para lidar com dados JSON
// app.use(bodyParser.json());

// Configura o middleware para servir arquivos estáticos
app.use(express.static("public"));
app.use("/components", express.static("views/components"));
app.use(express.static(path.join(__dirname, 'public')));

// Configura as rotas do aplicativo
setupRoutes(app);

const alterarSenhaRoutes = require('./routes/alterarSenha'); // não funciona se deixar no setupRoutes, não faz sentido mas aqui funciona
app.use(alterarSenhaRoutes);


// Estabelece a conexão com o banco de dados
connection.connect();
/*
// Carrega os arquivos do certificado SSL
const httpsOptions = {
    key: fs.readFileSync('C:/Users/x552552/Desktop/MSE HOMOLOG/certificado/mse.prefeitura.sp.gov.br.key'), // ANA: Alterei o caminho para o meu perfil 
    cert: fs.readFileSync('C:/Users/2552552/Desktop/MSE HOMOLOG/certificado/mse.prefeitura.sp.gov.br.pem'),
    ca: fs.readFileSync('C:/Users/x552552/Desktop/MSE HOMOLOG/certificado/chain.crt') // Se necessário
};

// Inicia o servidor HTTPS na porta 3001 com o certificado
https.createServer(httpsOptions, app).listen(3001, () => {
    console.log('Servidor HTTPS rodando na porta 3001');
});
*/
// Inicia o servidor na porta 3001 localhost
app.listen(3001, () => {
    console.log('Servidor rodando na porta 3001');
});