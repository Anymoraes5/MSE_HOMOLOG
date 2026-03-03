/*-configurações padrões---------------------------------------------------------------------------------------------*/

//Importa o módulo fs e path para lidar com arquivos e caminhos
const fs = require('fs');
const path = require('path');

//Importa a conexão com o banco de dados
const { connection } = require('../db/db');

/*importa os arquivos individuais de rotas para centralizar na função setupRoutes*/
// const rota_adolescente = require('./adolescente')
const rota_adminCadastraPessoa = require('./AdminGroup_CadastrarAdolescente');
const rota_adminEditaPessoa = require('./adminGroup_EditarAdolescente');
const rota_cadastro = require('./adminGroup_Usuario');
const rota_cadastroPessoas = require('./userGroup_CadastrarAdolescente');
const rota_consulta = require('./adminGroup_ConsultarUsuario');
const rota_editar = require('./adminGroup_Usuario');
const rota_editarPessoas = require('./userGroup_EditarAdolescente');
const rota_home = require('./userGroup_ConsultarAdolescente');
const rota_index = require('./login');
const rota_listasCargaSelects = require('./rota_listasCargaSelects');
const rota_verPessoas = require('./adminGroup_ConsultarAdolescente');

//Define as rotas do aplicativo para irem ao server.js
function setupRoutes(app) {
     rota_index(app);
     rota_verPessoas(app);
     rota_home(app);
     rota_consulta(app);
     // rota_adolescente(app);
     rota_adminCadastraPessoa(app);
     rota_adminEditaPessoa(app);
     rota_cadastro(app);
     rota_cadastroPessoas(app);
     rota_editar(app);
     rota_editarPessoas(app);
     rota_listasCargaSelects(app);
}

// Exporta a função de configuração das rotas
module.exports = { setupRoutes };