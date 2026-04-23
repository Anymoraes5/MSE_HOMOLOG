/*-configurações padrões---------------------------------------------------------------------------------------------*/

//Importa o módulo fs e path para lidar com arquivos e caminhos
const fs = require('fs');
const path = require('path');

//Importa a conexão com o banco de dados
const { connection } = require('../db/db');

//Define as rotas do aplicativo
function rota_consulta(app) {
 /*-----consulta, filtro inicial, desativando usuarios-------------------------------------------------------------------------------------*/
    
    // Rota para a página de consulta
    app.get('/consulta', (req, res) => {
        // Verifica se o usuário está autenticado
        if (req.session.adminAuthenticated) {
            const filePath = path.join(__dirname, '..', 'views', 'adminGroup_ConsultarUsuario.html');
            res.sendFile(filePath);
        } else {
            res.redirect('/');
        }
    });

    // Rota para obter todos os usuários do banco de dados
    app.get('/todosUsuarios', (req, res) => {
        connection.query(`SELECT 
                            U.ID, 
                            U.cpf, 
                            U.nome, 
                            U.login, 
                            U.dt_nasc, 
                            U.ativo_inativo, 
                            M.descricao AS "mse", 
                            P.descricao AS "perfil" 
                        FROM usuarios U 
                        LEFT JOIN mse M ON M.ID = U.fk_mse 
                        LEFT JOIN perfil P ON P.ID = U.fk_tipo_perfil 
                        WHERE 1 = 1`, (error, results, fields) => {
            if (error) {
                console.error('Erro ao consultar dados:', error);
                res.status(500).send('Erro ao consultar dados.');
                return;
            }

            res.json(results); // Envia os resultados da consulta como resposta
        });
    });

    //rota para executar a filtragem com base nos parâmetros passados no corpo
    app.post('/usuarios/filtro', (req, res) => {
        console.log("BODY:", req.body);
        const {  cpf, nome, login, ativo_inativo, dt_nasc, mse, perfil } = req.body;

        
        
    
        let query = `SELECT
                        U.ID,
                        U.cpf, 
                        U.nome, 
                        U.login, 
                        U.dt_nasc, 
                        U.ativo_inativo, 
                        M.descricao AS "mse", 
                        P.descricao AS "perfil" 
                     FROM 
                        usuarios U 
                     LEFT JOIN 
                        mse M 
                     ON 
                        M.ID = U.fk_mse 
                     LEFT JOIN 
                        perfil P 
                     ON 
                        P.ID = U.fk_tipo_perfil 
                     WHERE 1=1`; // Inicia a consulta com uma cláusula verdadeira
        
        const queryParams = [];
    
    
        if (cpf) {
            query += ` AND U.cpf = ?`;
            queryParams.push(cpf);
        }
    
        if (nome) {
            query += ` AND U.nome LIKE ?`;
            queryParams.push(`%${nome}%`);
        }
    
        if (login) {
            query += ` AND U.login LIKE ?`;
            queryParams.push(`%${login}%`);
        }
    
        if (ativo_inativo !== undefined && ativo_inativo !== null && ativo_inativo !== "")  {
            query += ` AND U.ativo_inativo = ?`;
            queryParams.push(Number(ativo_inativo));
            }
    
        if (dt_nasc) {
            query += ` AND U.dt_nasc = ?`;
            queryParams.push(dt_nasc);
        }
    
        if (mse) {
            query += ` AND U.fk_mse = ?`;
            queryParams.push(mse);
        }
    
        if (perfil) {
            query += ` AND U.fk_tipo_perfil = ?`;
            queryParams.push(perfil);
        }   

        console.log("QUERY:", query);
        console.log("PARAMS:", queryParams);
        
        // Executa a consulta no banco de dados com os parâmetros
        connection.query(query, queryParams, (error, results, fields) => {
            if (error) {
                console.error('Erro ao consultar dados:', error);
                res.status(500).send('Erro ao consultar dados.');
                return;
            }
    
            res.json(results); // Envia os resultados da consulta como resposta
        });
    });
    

    // Rota para ativar ou desativar um usuário
    app.post('/usuarios/:action/:ID', (req, res) => {
        const ID = req.params.ID;
        const action = req.params.action;

        let ativo = 0;
        if (action === 'ativar') {
            ativo = 1;
        }

        connection.query('UPDATE usuarios SET ativo_inativo = ? WHERE ID = ?', [ativo, ID], (error, results, fields) => {
            if (error) {
                res.status(500).send('Erro ao executar a atualização.');
                return;
            }
            res.status(200).send({ ID: ID, ativo: ativo });
        });
    });

}

// Exporta a função de configuração das rotas
module.exports = rota_consulta;