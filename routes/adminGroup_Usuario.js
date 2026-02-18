/*-configurações padrões---------------------------------------------------------------------------------------------*/

// Importa o módulo fs e path para lidar com arquivos e caminhos
const fs = require('fs');
const path = require('path');
const IdDescricaoRepository = require('../repository/IdDescricaoRepository');
const utils = require('../utils/validacoes');

// Importa a conexão com o banco de dados
const { connection } = require('../db/db');

// Função para executar uma query com rollback em caso de erro
function rollbackAndSendError(res, connection, errorMessage) {
    connection.rollback(() => {
        console.error(errorMessage);
        res.status(500).json({ error: 'Erro ao cadastrar usuário.' });
    });
}

// Função de cadastro e edição de usuários
function cadastrarOuEditarUsuario(req, res, isEdit) {
    const { ID, cpf, nome, login, senha, ativo_inativo, dt_nasc, perfil, mse } = req.body;
    let idPerfil, idMse, idUsuario = ID; // idUsuario será ID se estiver editando, undefined/null se cadastrando

    connection.beginTransaction((err) => {
        if (err) {
            rollbackAndSendError(res, connection, 'Erro ao iniciar transação: ' + err.message);
            return;
        }

        // Primeiro, verifique se o CPF já existe no banco de dados
        let cpfCheckQuery = 'SELECT ID FROM usuarios WHERE cpf = ?';
        let cpfCheckParams = [cpf];

        if (isEdit) {
            // Se estiver editando, verifique se o CPF já existe para outro usuário
            cpfCheckQuery += ' AND ID != ?';
            cpfCheckParams.push(ID); // Adicione o ID do usuário atual para exclusão da verificação
        }

        connection.query(cpfCheckQuery, cpfCheckParams, (errorCpfCheck, resultsCpfCheck) => {
            if (errorCpfCheck) {
                rollbackAndSendError(res, connection, 'Erro ao verificar CPF: ' + errorCpfCheck.message);
                return;
            }

            if (resultsCpfCheck.length > 0) {
                // Se encontrar um CPF duplicado (e não for o próprio usuário sendo editado)
                rollbackAndSendError(res, connection, 'CPF já está cadastrado para outro usuário.'); // Mensagem mais específica
                return;
            }

            // Agora, continue com a lógica de cadastro ou atualização
            if (isEdit) {
                // Lógica de atualização de usuário (já existente)
                console.log('Iniciando atualização de usuário.');

                connection.query('SELECT ID FROM perfil WHERE descricao = ?', [perfil], (errorPerfil, resultsPerfil) => {
                    if (errorPerfil || resultsPerfil.length === 0) {
                        rollbackAndSendError(res, connection, 'Erro ao buscar perfil: ' + (errorPerfil?.message || 'Perfil não encontrado.'));
                        return;
                    }
                    idPerfil = resultsPerfil[0].ID;

                    connection.query('SELECT ID FROM mse WHERE descricao = ?', [mse], (errorMse, resultsMse) => {
                        if (errorMse || resultsMse.length === 0) {
                            rollbackAndSendError(res, connection, 'Erro ao buscar MSE: ' + (errorMse?.message || 'MSE não encontrado.'));
                            return;
                        }
                        idMse = resultsMse[0].ID;

                        connection.query('UPDATE usuarios SET cpf = ?, nome = ?, login = ?, senha = ?, ativo_inativo = ?, dt_nasc = ?, fk_tipo_perfil = ?, fk_mse = ?, dt_atualizacao = NOW() WHERE ID = ?',
                            [cpf, nome, login, senha, ativo_inativo, dt_nasc, idPerfil, idMse, idUsuario],
                            (errorUpdate) => {
                                if (errorUpdate) {
                                    rollbackAndSendError(res, connection, 'Erro ao atualizar usuário: ' + errorUpdate.message);
                                    return;
                                }
                                connection.commit((commitErr) => {
                                    if (commitErr) {
                                        rollbackAndSendError(res, connection, 'Erro ao finalizar transação: ' + commitErr.message);
                                        return;
                                    }
                                    res.status(200).json({ message: 'Usuário atualizado com sucesso!' });
                                });
                            }
                        );
                    });
                });

            } else {
                // Lógica de cadastro de novo usuário (já existente, após a verificação de CPF)
                console.log('Iniciando cadastro de usuário.');

                connection.query('SELECT ID FROM perfil WHERE descricao = ?', [perfil], (errorPerfil, resultsPerfil) => {
                    if (errorPerfil || resultsPerfil.length === 0) {
                        rollbackAndSendError(res, connection, 'Erro ao buscar perfil: ' + (errorPerfil?.message || 'Perfil não encontrado.'));
                        return;
                    }
                    idPerfil = resultsPerfil[0].ID;

                    connection.query('SELECT ID FROM mse WHERE descricao = ?', [mse], (errorMse, resultsMse) => {
                        if (errorMse || resultsMse.length === 0) {
                            rollbackAndSendError(res, connection, 'Erro ao buscar MSE: ' + (errorMse?.message || 'MSE não encontrado.'));
                            return;
                        }
                        idMse = resultsMse[0].ID;

                        connection.query('INSERT INTO usuarios (cpf, nome, login, senha, ativo_inativo, dt_nasc, fk_tipo_perfil, fk_mse, dt_cadastro, dt_atualizacao) VALUES (?, ?, ?, ?, ?, ?, ?, ?, NOW(), NOW())',
                            [cpf, nome, login, senha, ativo_inativo, dt_nasc, idPerfil, idMse],
                            (errorInsert, resultsUsuario) => {
                                if (errorInsert) {
                                    rollbackAndSendError(res, connection, 'Erro ao cadastrar usuário: ' + errorInsert.message);
                                    return;
                                }
                                idUsuario = resultsUsuario.insertId;
                                connection.commit((commitErr) => {
                                    if (commitErr) {
                                        rollbackAndSendError(res, connection, 'Erro ao finalizar transação: ' + commitErr.message);
                                        return;
                                    }
                                    res.redirect('/consulta?mensagem=Usuário cadastrado com sucesso');
                                });
                            }
                        );
                    });
                });
            }
        });
    });
}


// Função para associar MSE ao usuário na tabela `usuarios_mse`
function inserirUsuarioMse(res, connection, idUsuario, idMse) {
    connection.query('INSERT INTO usuarios_mse (fk_cpf_usuario, fk_mse) VALUES (?, ?)', [idUsuario, idMse], (error) => {
        if (error) {
            rollbackAndSendError(res, connection, 'Erro ao associar MSE ao usuário: ' + error.message);
            return;
        }
        commitTransaction(res, connection, 'Usuário cadastrado com sucesso.');
    });
}

// Função para atualizar MSE do usuário na tabela `usuarios_mse`
function atualizarUsuarioMse(res, connection, idUsuario, idMse) {
    connection.query('UPDATE usuarios_mse SET fk_mse = ? WHERE fk_cpf_usuario = ?', [idMse, idUsuario], (error) => {
        if (error) {
            rollbackAndSendError(res, connection, 'Erro ao atualizar dados do MSE: ' + error.message);
            return;
        }
        commitTransaction(res, connection, 'Usuário atualizado com sucesso.');
    });
}

// Commit da transação
function commitTransaction(res, connection, successMessage) {
    connection.commit((err) => {
        if (err) {
            rollbackAndSendError(res, connection, 'Erro ao fazer commit da transação: ' + err.message);
            return;
        }
        res.status(200).json({ message: successMessage });
    });
}

// Define as rotas do aplicativo
function rota_usuarios(app) {
    // Rota para o cadastro
    app.post('/cadastro', (req, res) => cadastrarOuEditarUsuario(req, res, false));

    // Rota para a edição
    app.put('/usuarios/:ID', (req, res) => {
        req.body.ID = req.params.ID;
        cadastrarOuEditarUsuario(req, res, true);
    });

    // Rota para buscar os dados de um usuário
    app.get('/usuarios/:ID', (req, res) => {
        const ID = req.params.ID;
        connection.query(`SELECT U.ID, U.cpf, U.nome, U.login, U.senha, U.dt_nasc, U.ativo_inativo, M.descricao AS "mse", P.descricao AS "perfil", U.dt_cadastro, U.dt_atualizacao 
                          FROM usuarios U 
                          LEFT JOIN mse M ON M.ID = U.fk_mse 
                          LEFT JOIN perfil P ON P.ID = U.fk_tipo_perfil 
                          WHERE U.ID = ?`, [ID], (error, results) => {
            if (error || results.length === 0) {
                const msg = error ? 'Erro ao buscar dados do usuário.' : 'Usuário não encontrado.';
                res.status(500).json({ error: 'Erro ao cadastrar usuário.' });
                return;
            }
            res.json(results[0]);
        });
    });

    // Rota para exibir a página de cadastro
    app.get('/cadastro', (req, res) => {
        if (req.session.adminAuthenticated) {
            res.sendFile(path.join(__dirname, '..', 'views', 'adminGroup_Usuario.html'));
        } else {
            res.redirect('/');
        }
    });

    // Rota para exibir a página de edição
    app.get('/editar.html', (req, res) => {
        if (req.session.adminAuthenticated) {
            res.sendFile(path.join(__dirname, '..', 'views', 'adminGroup_Usuario.html'));
        } else {
            res.redirect('/');
        }
    });
}

// Exporta a função de configuração das rotas
module.exports = rota_usuarios;