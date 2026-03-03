/*-configurações padrões---------------------------------------------------------------------------------------------*/

//Importa o módulo fs e path para lidar com arquivos e caminhos
const fs = require('fs');
const path = require('path');


//Importa a conexão com o banco de dados
const { connection } = require('../db/db');

//Define as rotas do aplicativo
function rota_index(app) {

    /*---login/index/logout---------------------------------------------------------------------------------------*/

    // Rota para a página inicial
    app.get('/', (req, res) => {
        const filePath = path.join(__dirname, '..', 'views', 'auth', 'login.html');
        res.sendFile(filePath);
        // Remove o cookie de autenticação
        res.clearCookie('userAuthenticated');
        res.clearCookie('adminAuthenticated');
    });

    app.get('/alterarSenha', (req, res) => {
        const filePath = path.join(__dirname, '..', 'views', 'alterarSenha.html');
        res.sendFile(filePath);
    });

    // Rota para processar o login
    app.post('/login', (req, res) => {
        // Obtém o login e senha enviados no corpo da requisição
        const login = req.body.login;
        const senha = req.body.senha;
		
		

        // Consulta o banco de dados para verificar se o login e senha são válidos e se o usuário está ativo
        connection.query('SELECT * FROM usuarios WHERE login = ? AND senha = ?', [login, senha], (error, results, fields) => {
            if (error) {
                // Envia uma mensagem de erro se houver um erro na consulta
                res.redirect('/?mensagem=Erro ao executar a consulta.');
                return;
            }

            // Verifica se foram encontrados resultados na consulta
            if (results.length > 0) {
                // Verifica se o usuário está ativo
                if (results[0].ativo_inativo === 0) {
                    // Se o usuário não estiver ativo, redireciona para a página inicial com a mensagem de erro
                    res.redirect('/?mensagem=Seu login não está ativo. Entre em contato com o administrador.');
                    return;
                }

                // Verifica o grupo de acesso do usuário
                if (results[0].fk_tipo_perfil == 1) {
                    // Define a autenticação de administrador como válida na sessão
                    req.session.adminAuthenticated = true;
                    // Define um cookie de autenticação para administrador
                    res.cookie('adminAuthenticated', 'true', { httpOnly: false });
                    // Redireciona para a página de administração
                    res.redirect('/consulta');
                    return;
                } else {
                    //Define a autenticação de usuário comum como válida na sessão
                    req.session.userAuthenticated = true;
                    req.session.fk_mse = results[0].fk_mse
                    // Define um cookie de autenticação para usuário comum
                    res.cookie('userAuthenticated', 'true', { httpOnly: false });
                    // Redireciona para a página de usuário comum
                    res.redirect('/home');
                    return;
                }
            } else {
                //Se o login for inválido, redireciona para a página inicial com a mensagem de erro
                res.redirect('/?mensagem=Login ou senha incorretos.');
                return;
            }
        });
    });


    // Rota para logout
    app.get('/logout', (req, res) => {
        // Limpa os dados da sessão
        req.session.destroy((err) => {
            if (err) {
                console.error('Erro ao limpar a sessão:', err);
                res.status(500).send('Erro ao fazer logout.');
                return;
            }

            // Remove os cookies de autenticação
            res.clearCookie('userAuthenticated');
            res.clearCookie('adminAuthenticated');

            // Redireciona para a página de login
            res.redirect('/');
        });
    });

    

    

}

// Exporta a função de configuração das rotas
module.exports = rota_index;