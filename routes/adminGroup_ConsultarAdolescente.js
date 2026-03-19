/*-configurações padrões---------------------------------------------------------------------------------------------*/

//Importa o módulo fs e path para lidar com arquivos e caminhos
const fs = require('fs');
const path = require('path');

//Importa a conexão com o banco de dados
const { connection } = require('../db/db');

//Define as rotas do aplicativo
function rota_verPessoas(app) {
/*-----verPessoas---------------------------------------------------------------------------------------------------*/


    app.get('/verPessoas', (req, res) => {
        // Verifica se o usuário está autenticado
        if (req.session.adminAuthenticated) {
            const filePath = path.join(__dirname, '..', 'views', 'adminGroup_ConsultarAdolescente.html');
            res.sendFile(filePath);
        } else {
            res.redirect('/');
        }
    });

    // Rota para obter todos os usuários do banco de dados com base no mse armazenado em seção
    app.get('/todasPessoas', (req, res) => {
        // Verifica se o usuário está autenticado como administrador
        if (req.session.adminAuthenticated) {
            // Consulta SQL modificada para incluir a condição do fk_mse
            connection.query(`SELECT
                                P.ID,
                                P.cpf,
                                PRO.n_processo,
                                P.nome,
                                P.nome_social,
                                P.nome_da_mae,
                                P.dt_nasc,
                                P.ativo_inativo,
                                M.descricao AS 'mse',
                                U.nome AS 'tec_ref'
                            FROM pessoas P
                            LEFT JOIN processos PRO ON PRO.ID = P.fk_processos
                            LEFT JOIN mse M ON M.ID = P.fk_mse
                            LEFT JOIN usuarios U ON U.ID = P.fk_tec_ref
                            WHERE P.ativo_inativo = 1`, (error, results, fields) => {
                if (error) {
                    console.error('Erro ao consultar dados:', error);
                    res.status(500).send('Erro ao consultar dados.');
                    return;
                }
                //console.log('Resultados da consulta:', results);
                res.json(results); // Envia os resultados da consulta como resposta
            });
        } else {
            // Se o usuário não estiver autenticado ou não tiver um fk_mse na sessão, redirecione para a página inicial
            res.redirect('/');
        }
    });

    // Rota para filtrar usuários
    app.post('/filtro', (req, res) => {
        const { ID, cpf, n_processo, nome, nome_social, nome_da_mae, dt_nasc, ativo_inativo, mse, tec_ref} = req.body;
        let query = `
            SELECT
            P.ID,
            P.cpf,
            PRO.n_processo,
            P.nome,
            P.nome_social,
            P.nome_da_mae,
            P.dt_nasc,
            P.ativo_inativo,
            M.descricao AS 'mse',
            U.nome AS 'tec_ref'
            FROM pessoas P
            LEFT JOIN processos PRO ON PRO.ID = P.fk_processos
            LEFT JOIN mse M ON M.ID = P.fk_mse
            LEFT JOIN usuarios U ON U.ID = P.fk_tec_ref
            WHERE 1=1
            `;
        const queryParams = []; // Parâmetros da consulta

        if (ID) {
            query += ` AND P.ID = ?`;
            queryParams.push(ID);
        }

        if (cpf) {
            query += ` AND P.cpf = ?`;
            queryParams.push(cpf);
        }

        // if (nis) {
        //     query += ` AND P.nis = ?`;
        //     queryParams.push(nis);
        // }

        if (n_processo) {
            query += ` AND PRO.n_processo = ?`;
            queryParams.push(n_processo);
        }

        if (nome) {
            query += ` AND P.nome LIKE ?`;
            queryParams.push(`%${nome}%`);
        }

        if (nome_social) {
            query += ` AND P.nome_social LIKE ?`;
            queryParams.push(`%${nome_social}%`);
        }

        if (nome_da_mae) {
            query += ` AND P.nome_da_mae LIKE ?`;
            queryParams.push(`%${nome_da_mae}%`);
        }

        if (dt_nasc) {
            query += ` AND P.dt_nasc = ?`;
            queryParams.push(dt_nasc);
        }

        if (ativo_inativo !== undefined && ativo_inativo !== "") {
            query += ` AND U.ativo_inativo = ?`;
            queryParams.push(ativo_inativo);
        }

        if (mse) {
            query += ` AND P.fk_mse = ?`;
            queryParams.push(mse);
        }
        
        if (tec_ref) {
            query += ` AND P.fk_tec_ref = ?`;
            queryParams.push(tec_ref);
        }

        // Executa a consulta no banco de dados
        connection.query(query, queryParams, (error, results, fields) => {
            if (error) {
                console.error('Erro ao consultar dados:', error);
                res.status(500).send('Erro ao consultar dados.');
                return;
            }

            console.log('Resultados da consulta:', results); // Verifica os resultados da consulta

            res.json(results); // Envia os resultados da consulta como resposta
        });
    });

    // Rota para ativar ou desativar uma pessoa
    app.post('/pessoaAtiva/:action/:ID', (req, res) => {
        const ID = req.params.ID;
        const action = req.params.action;

        var ativo = 0;
        var dt_desligamento = null;

        let dataAtual = new Date();
        // Extrair ano, mês e dia
        let ano = dataAtual.getFullYear();
        let mes = String(dataAtual.getMonth() + 1).padStart(2, '0'); // adiciona um zero à esquerda se for necessário
        let dia = String(dataAtual.getDate()).padStart(2, '0'); // adiciona um zero à esquerda se for necessário
        var dt_atualizacao = `${ano}-${mes}-${dia}`;

        if (action === 'ativar') {
            ativo = 1;
            dt_desligamento = null;
        } 
        
        if (action === 'desligar') {
            dt_desligamento = dt_atualizacao
        }

        connection.query('UPDATE pessoas SET ativo_inativo = ?, dt_atualizacao = ?, dt_desligamento = ? WHERE ID = ?', [ativo, dt_atualizacao, dt_desligamento, ID], (error, results, fields) => {
            if (error) {
                res.status(500).send('Erro ao executar a atualização.');
                return;
            }
            res.status(200).send({ ID: ID, ativo: ativo });
        });
    });
}

// Exporta a função de configuração das rotas
module.exports = rota_verPessoas;