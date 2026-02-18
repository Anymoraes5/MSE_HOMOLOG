// Importa a conexão com o banco de dados
const { connection } = require('../db/db');

// Função para obter o ID baseado na descrição de uma tabela específica
function getIdByDescricao(nome_tabela, descricao) {
    return new Promise((resolve, reject) => {
        const query = `SELECT ID FROM ${nome_tabela} WHERE descricao = ?`;
        connection.query(query, [descricao], (error, results) => {
            if (error) {
                return reject(error);
            }

            if (results.length > 0) {
                resolve(results[0].ID);
            } else {
                resolve(null);
            }
        });
    });
}

// Função para obter o ID baseado na descrição de uma tabela específica
function getIdByDescricaoCadastro(nome_tabela, descricao, callback) {
    const query = `SELECT ID FROM ${nome_tabela} WHERE descricao = ?`;
    connection.query(query, [descricao], (error, results) => {
        if (error) {
            return callback(error, null);
        }

        if (results.length > 0) {
            return callback(null, results[0].ID);
        } else {
            return callback(null, null);
        }
    });
}

module.exports = {
    getIdByDescricao,
    getIdByDescricaoCadastro
}; 