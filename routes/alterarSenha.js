const express = require('express');
const db = require('../db/db'); // Certifique-se de que o caminho está correto para o arquivo db.js

const router = express.Router();



router.post('/alterarSenha', async (req, res) => {

    const { email, senhaAtual, novaSenha, confirmarSenha } = req.body;

    if (novaSenha !== confirmarSenha) {
        return res.send(`<script>alert("A nova senha e a confirmação não coincidem.");
                              window.history.back();
                             </script>`);
    }

    try {
        // Consulta para verificar se o usuário existe
        db.connection.query('SELECT * FROM usuarios WHERE login = ?', [email], (err, results) => {
            if (err) {
                console.error('Erro ao buscar usuário:', err);
                return res.send(`<script>alert("Erro interno do servidor.");
                                  window.history.back();
                                 </script>`);
            }

            if (results.length === 0) {
                return res.send(`<script>alert("Usuário não encontrado.");
                                  window.history.back();
                                 </script>`);
            }

            const user = results[0];

            // Verifica se a senha atual está correta
            if (senhaAtual !== user.senha) {
                return res.send(`<script>alert("Senha atual incorreta.");
                                  window.history.back();
                                 </script>`);
            }

            // Atualiza a senha no banco de dados
            db.connection.query(
                'UPDATE usuarios SET senha = ? WHERE login = ?',
                [novaSenha, email],
                (updateErr) => {
                    if (updateErr) {
                        console.error('Erro ao atualizar a senha:', updateErr);
                        return res.send(`<script>alert("Erro ao atualizar a senha.");
                                          window.history.back();
                                         </script>`);
                    }

                    // Exibe mensagem de sucesso e redireciona
                    res.send(`<script>alert("Senha atualizada com sucesso!");
                                      window.location.href = '/';
                                     </script>`);
                }
            );
        });
    } catch (error) {
        console.error('Erro inesperado:', error);
        res.send(`<script>alert("Erro ao processar a solicitação.");
                          window.history.back();
                         </script>`);
    }
});

module.exports = router;
