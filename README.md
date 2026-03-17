# MSE — Sistema de Medidas Socioeducativas

Sistema web para cadastro e acompanhamento de adolescentes/jovens em cumprimento de medidas socioeducativas (MSE), desenvolvido para uso interno da Prefeitura de São Paulo (SMSE-MA).

---

## Descrição do Projeto

O MSE é uma aplicação web voltada ao registro e gestão de informações de adolescentes em medidas socioeducativas. O sistema permite:

- Cadastro completo de adolescentes/jovens com dados pessoais, de saúde, escolaridade, trabalho e renda
- Registro de informações processuais (número do processo, vara da infância, medidas MSE)
- Cadastro de unidades acolhedoras para prestação de serviço comunitário (PSC)
- Controle de técnicos de referência por SMSE-MA
- Gerenciamento de usuários com autenticação via sessão
- Busca de CEP automática via API externa
- Validações de CPF, Cartão SUS, telefone, e-mail e datas

---

## Tecnologias Usadas

**Backend**
- [Node.js](https://nodejs.org/)
- [Express.js](https://expressjs.com/) — framework web
- [express-session](https://www.npmjs.com/package/express-session) — gerenciamento de sessões
- [body-parser](https://www.npmjs.com/package/body-parser) — parse de requisições
- MySQL — banco de dados relacional

**Frontend**
- HTML5 + CSS3
- JavaScript puro (Vanilla JS)
- Bootstrap — estilização e componentes

**Infraestrutura**
- HTTPS via certificado SSL (`.key`, `.pem`, `.crt`)
- Servidor HTTP/HTTPS na porta `3001`

---

## Estrutura de Pastas

```
MSE/
├── certificado/              # Certificados SSL
│   ├── mse.prefeitura.sp.gov.br.key
│   ├── mse.prefeitura.sp.gov.br.pem
│   └── chain.crt
│
├── db/
│   └── db.js                 # Conexão com o banco de dados (connection + pool)
│
├── public/                   # Arquivos estáticos (CSS, imagens, JS público)
│   └── css/
│       └── global.css
│
├── routes/
│   ├── centralizador_de_rotas.js   # Centraliza todas as rotas da aplicação
│   └── alterarSenha.js             # Rota separada para alteração de senha
│
├── views/
│   ├── components/           # Componentes HTML reutilizáveis
│   └── *.html                # Páginas da aplicação
│
├── shared/                   # Utilitários JavaScript do frontend
│   ├── helpers.js            # Funções auxiliares ($, $$, on, etc.)
│   ├── formRules.js          # Regras de formulário (toggleCampo, buscarCepGenerico)
│   ├── mascaras.js           # Máscaras de input (CEP, processo)
│   ├── validacoes.js         # Validações (CPF, SUS, e-mail, telefone, etc.)
│   └── fetchSelects.js       # Popular selects via fetch
│
├── server.js                 # Ponto de entrada da aplicação
├── package.json
└── README.md
```

---

## Como Instalar e Rodar

### Pré-requisitos

- [Node.js](https://nodejs.org/) v18 ou superior
- MySQL configurado e rodando
- Git

### 1. Clonar o repositório

```bash
git clone <url-do-repositorio>
cd MSE
```

### 2. Instalar dependências

```bash
npm install
```

### 3. Configurar o banco de dados

Crie o banco de dados no MySQL e configure as credenciais no arquivo `db/db.js`.

### 4. Configurar os certificados SSL (opcional)

Caso queira rodar com HTTPS, coloque os arquivos de certificado na pasta `certificado/`:

```
certificado/
├── mse.prefeitura.sp.gov.br.key
├── mse.prefeitura.sp.gov.br.pem
└── chain.crt
```

> Para rodar apenas com HTTP (desenvolvimento), os certificados não são necessários — o bloco HTTPS está comentado no `server.js`.

### 5. Rodar o servidor

```bash
node server.js
```

O servidor estará disponível em:

```
http://localhost:3001
```

---

## Observações

- O sistema utiliza autenticação via cookie de sessão (`adminAuthenticated=true`). Usuários não autenticados são redirecionados para a tela de login.
- A rota de alteração de senha (`alterarSenha.js`) precisa ser registrada fora do `setupRoutes` — comportamento conhecido e documentado no código.
- Para ambientes de produção, ative o bloco HTTPS no `server.js` e certifique-se de que os caminhos dos certificados usam `path.join(__dirname, ...)`.
