const path = require('path');
const multer = require('multer');
const nodemailer = require('nodemailer');

const upload = multer({
    dest: 'uploads/'
});

function rota_faleConosco(app) {
    app.get('/faleConosco', (req, res) => {
        if (req.session.adminAuthenticated || req.session.userAuthenticated) {
            res.sendFile(path.join(__dirname, '..', 'views', 'faleConosco.html'));
        } else {
            res.redirect('/');
        }
    });

    app.post('/faleConosco', upload.single('termo'), async (req, res) => {
        try {
            const { assunto, tipo, mensagem } = req.body;

            if (!assunto || !tipo || !mensagem) {
                return res.status(400).json({ error: 'Preencha todos os campos obrigatórios.' });
            }

            if (tipo === 'solicitacao_acesso' && !req.file) {
                return res.status(400).json({ error: 'O termo de responsabilidade é obrigatório.' });
            }

            let destinatario = '';

            if (tipo === 'solicitacao_acesso') {
                destinatario = process.env.EMAIL_ACESSO;
            } else if (tipo === 'problema_sistema') {
                destinatario = process.env.EMAIL_SUPORTE;
            } else {
                return res.status(400).json({ error: 'Tipo inválido.' });
            }

            const transporter = nodemailer.createTransport({
                host: process.env.SMTP_HOST,
                port: Number(process.env.SMTP_PORT),
                secure: false,
                auth: {
                    user: process.env.SMTP_USER,
                    pass: process.env.SMTP_PASS
                }
            });

            const mailOptions = {
                from: process.env.SMTP_USER,
                to: destinatario,
                subject: `[Fale Conosco] ${assunto}`,
                text:
`Assunto principal: ${assunto}
Tipo: ${tipo}
Usuário: ${req.session.nome || 'Não identificado'}
MSE: ${req.session.mse || 'Não informado'}

Mensagem:
${mensagem}`,
                attachments: []
            };

            if (tipo === 'solicitacao_acesso' && req.file) {
                mailOptions.attachments.push({
                    filename: req.file.originalname,
                    path: req.file.path
                });
            }

            await transporter.sendMail(mailOptions);

            return res.status(200).json({ message: 'E-mail enviado com sucesso.' });
        } catch (error) {
            console.error('Erro ao enviar fale conosco:', error);
            return res.status(500).json({ error: 'Erro ao enviar e-mail.' });
        }
    });
}

module.exports = rota_faleConosco;
