/*-configurações padrões---------------------------------------------------------------------------------------------*/

const fs   = require('fs');
const path = require('path');

const { connection } = require('../db/db');

function rota_home(app) {

    // Rota para a página de consulta
    app.get('/home', (req, res) => {
        if (req.session.userAuthenticated) {
            const filePath = path.join(__dirname, '..', 'views', 'userGroup_ConsultarAdolescente.html');
            res.sendFile(filePath);
        } else {
            res.redirect('/');
        }
    });

    // Rota para obter todos os usuários do banco de dados com base no mse armazenado em sessão
    app.get('/todasPessoasMse', (req, res) => {
        if (req.session.userAuthenticated && req.session.fk_mse) {
            connection.query(`
                SELECT DISTINCT
                    P.ID,
                    P.cpf,
                    P.nis,
                    PRO.n_processo,
                    P.nome,
                    P.nome_social,
                    P.nome_da_mae,
                    P.dt_nasc,
                    P.ativo_inativo,
                    M.descricao        AS mse,
                    U.nome             AS tec_ref,
                    C_origem.descricao AS creas_origem,
                    C_atual.descricao  AS creas_atual
                FROM pessoas P
                LEFT JOIN processos PRO ON PRO.ID = P.fk_processos
                LEFT JOIN mse M         ON M.ID   = P.fk_mse
                LEFT JOIN usuarios U    ON U.ID   = P.fk_tec_ref
                LEFT JOIN (
                    SELECT hp1.*
                    FROM historico_pessoas hp1
                    INNER JOIN (
                        SELECT fk_processos, MAX(ID) AS max_id
                        FROM historico_pessoas
                        GROUP BY fk_processos
                    ) hp2 ON hp1.ID = hp2.max_id
                ) H ON H.fk_processos = P.fk_processos
                LEFT JOIN creas C_origem ON C_origem.ID = H.fk_creas_origem
                LEFT JOIN creas C_atual  ON C_atual.ID  = H.fk_creas_atual
                WHERE P.ativo_inativo = 1
                AND (
                    P.fk_mse = ?
                    OR EXISTS (
                        SELECT 1 FROM historico_pessoas h3
                        WHERE h3.fk_processos = P.fk_processos
                        AND h3.fk_mse = ?
                    )
                )
            `, [req.session.fk_mse, req.session.fk_mse], (error, results) => {
                if (error) {
                    console.error('Erro ao consultar dados:', error);
                    res.status(500).send('Erro ao consultar dados.');
                    return;
                }
                console.log('Resultados da todas pessoas:', results);
                res.json(results);
            });
        } else {
            res.redirect('/');
        }
    });

    // Rota para filtrar usuários
    app.post('/adolescente/filtro', (req, res) => {

        const {
            ID,
            cpf,
            n_processo,
            nome,
            nome_social,
            nome_da_mae,
            dt_nasc,
            ativo_inativo,
            tec_ref,
            transferido
        } = req.body;
        console.log('MSE LOGADO:', req.session.fk_mse);
        // WHERE base sem filtro de MSE — controlado pelo if/else abaixo
        let query = `
            SELECT DISTINCT
                P.ID,
                P.cpf,
                PRO.n_processo,
                P.nome,
                P.nome_social,
                P.nome_da_mae,
                P.dt_nasc,
                P.ativo_inativo,
                M.descricao        AS mse,
                U.nome             AS tec_ref,
                C_origem.descricao AS creas_origem,
                C_atual.descricao  AS creas_atual
            FROM pessoas P
            LEFT JOIN processos PRO ON PRO.ID = P.fk_processos
            LEFT JOIN mse M         ON M.ID   = P.fk_mse
            LEFT JOIN usuarios U    ON U.ID   = P.fk_tec_ref
            LEFT JOIN (
                SELECT hp1.*
                FROM historico_pessoas hp1
                INNER JOIN (
                    SELECT fk_processos, MAX(ID) AS max_id
                    FROM historico_pessoas
                    GROUP BY fk_processos
                ) hp2 ON hp1.ID = hp2.max_id
            ) H ON H.fk_processos = P.fk_processos
            LEFT JOIN creas C_origem ON C_origem.ID = H.fk_creas_origem
            LEFT JOIN creas C_atual  ON C_atual.ID  = H.fk_creas_atual
            WHERE 1=1
        `;

        const queryParams = [];


        if (transferido === '1') {

            query += `
                AND EXISTS (
                    SELECT 1
                    FROM historico_pessoas HT
                    WHERE HT.fk_processos = P.fk_processos
                    AND HT.fk_mse = ?
                )

                AND (
                    SELECT HX.fk_mse
                    FROM historico_pessoas HX
                    WHERE HX.fk_processos = P.fk_processos
                    ORDER BY HX.ID DESC
                    LIMIT 1
                ) != ?
            `;

            queryParams.push(req.session.fk_mse);
            queryParams.push(req.session.fk_mse);
        }

        if (ID) {
            query += ` AND P.ID = ?`;
            queryParams.push(ID);
        }

        if (cpf) {
            query += ` AND P.cpf = ?`;
            queryParams.push(cpf);
        }

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
            query += ` AND P.ativo_inativo = ?`;
            queryParams.push(ativo_inativo);
        }

        if (tec_ref) {
            query += ` AND P.fk_tec_ref = ?`;
            queryParams.push(tec_ref);
        }
        console.log('TRANSFERIDO:', transferido);
        console.log('MSE LOGADO:', req.session.fk_mse);
        console.log('QUERY PARAMS:', queryParams);

        connection.query(query, queryParams, (error, results) => {
            if (error) {
                console.error('Erro ao consultar dados:', error);
                return res.status(500).send('Erro ao consultar dados.');
            }
            console.log('Resultados da consulta:', results);
            res.json(results);
        });
    });

    // Rota para ativar ou desativar uma pessoa
    app.post('/pessoaAtiva/:action/:ID', (req, res) => {
        const ID     = req.params.ID;
        const action = req.params.action;

        let ativo           = 0;
        let dt_desligamento = null;

        const dataAtual    = new Date();
        const ano          = dataAtual.getFullYear();
        const mes          = String(dataAtual.getMonth() + 1).padStart(2, '0');
        const dia          = String(dataAtual.getDate()).padStart(2, '0');
        const dt_atualizacao = `${ano}-${mes}-${dia}`;

        if (action === 'ativar') {
            ativo           = 1;
            dt_desligamento = null;
        }

        if (action === 'desligar') {
            dt_desligamento = dt_atualizacao;
        }

        connection.query(
            'UPDATE pessoas SET ativo_inativo = ?, dt_atualizacao = ?, dt_desligamento = ? WHERE ID = ?',
            [ativo, dt_atualizacao, dt_desligamento, ID],
            (error) => {
                if (error) {
                    res.status(500).send('Erro ao executar a atualização.');
                    return;
                }
                res.status(200).send({ ID: ID, ativo: ativo });
            }
        );
    });
}

module.exports = rota_home;