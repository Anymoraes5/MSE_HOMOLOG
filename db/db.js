// Importa o módulo mysql para interagir com o banco de dados MySQL
const mysql = require('mysql2');
const { DB_HOST } = process.env;
const { DB_USER } = process.env;
const { DB_PASS } = process.env;
const { DB_NAME } = process.env;

// Cria a conexão com o banco de dados MySQL
const connection = mysql.createConnection({
    host: DB_HOST,
    user: DB_USER,
    password: DB_PASS,
    database: DB_NAME,
    connectTimeout: 10000 // 10 segundos de timeout para evitar travamentos de conexão
});

// Função para gerenciar reconexões automáticas
function handleDisconnect() {
  connection.connect((err) => {
    if (err) {
      console.error('Erro ao conectar ao MySQL, tentando reconectar...', err);
      setTimeout(handleDisconnect, 2000); // Tenta reconectar após 2 segundos
    } else {
      console.log('Banco conectado:', process.env.DB_NAME);
      console.log('Conectado ao MySQL via mysql2');
    }
  });

  connection.on('error', (err) => {
    if (err.code === 'PROTOCOL_CONNECTION_LOST') {
      console.log('Conexão perdida, tentando reconectar...');
      handleDisconnect(); // Tenta reconectar quando a conexão for perdida
    } else {
      throw err;
    }
  });
}

// Inicia a conexão e gerencia reconexões
handleDisconnect();


// Exporta a conexão para ser usada em outros arquivos
module.exports = { connection };
