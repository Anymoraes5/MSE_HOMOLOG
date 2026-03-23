/*-configurações padrões---------------------------------------------------------------------------------------------*/

//Importa o módulo fs e path para lidar com arquivos e caminhos
let fs = require('fs');
let path = require('path');
let IdDescricaoRepository = require('../repository/IdDescricaoRepository');
let utils = require('../utils/validacoes');

function normalizarTexto(str) {
    if (!str) return str;
    return str
        .normalize('NFD')
        .replace(/[\u0300-\u036f]/g, '')
        .toUpperCase()
        .replace(/\s+/g, ' ')
        .trim();
}


//Importa a conexão com o banco de dados
let { connection } = require('../db/db');


//Define as rotas do aplicativo
function rota_cadastroPessoas(app) {  
 /*-----user Cadastrando pessoa-------------------------------------------------------------------------------------*/

   // Rota para a página de edição
   app.get('/cadastroAdolescente', (req, res) => {
    console.log('Recebendo requisição de atualização de dados de pessoa:', req.body);
    // Verifica se o usuário está autenticado
    if (req.session.userAuthenticated) {
        const filePath = path.join(__dirname, '..', 'views', 'userGroup_CadastrarAdolescente.html');
        res.sendFile(filePath);
    } else {
        res.redirect('/');
    }
});

    // Rota para atualizar os dados do usuário com base no CPF
    app.post('/cadastroPessoas', (req, res) => {
        
       
               // Obter a data atual
               let dataAtual = new Date();
               let ano = dataAtual.getFullYear();
               let mes = String(dataAtual.getMonth() + 1).padStart(2, '0');
               let dia = String(dataAtual.getDate()).padStart(2, '0');
               let dt_atualizacao = `${ano}-${mes}-${dia}`;
               let dt_cadastro = `${ano}-${mes}-${dia}`;
       
               // Validação do CPF
               let cpf = req.body.cpf.replace(/[.-]/g, '');
               let cpfValido = utils.validarCPF(cpf);
               if (!cpfValido.valido) {
                   return res.status(400).json({ error: 'CPF inválido.' });
               } else {
                   cpf = cpfValido.cpf;
               }
       
               let cartao_sus = req.body.cartao_sus.replace(/[.-]/g, '');
               let cep = req.body.cep.replace(/-/g, "");
               let telefone = req.body.telefone.replace(/\D/g, '');
       
               var {
                   tipo_logradouro,
                   tipo_local,
                   nome_unidade,
                   logradouro_unidade,
                   numero_unidade,
                   complemento_unidade,
                   bairro_unidade,
                   cep_unidade,
                   dias,
                   telefone_unidade,
                   responsavel_unidade,
                   horario_inicio_unidade,
                   horario_fim_unidade,
                   atividade_unidade,
                   horas_psc,
                   cad_unico,
                   ativo_inativo,
                   creas_atual,
                   mse,
                   tec_ref,
                   sas,
                   servico_familia,
                   distrito_servico,
                   ubs,
                   creas_origem,
                   nome,
                   nome_social,
                   dt_nasc,
                   medidas_mse,
                   nome_da_mae,
                   nome_do_pai,
                   nome_responsavel,
                   sexo,
                   gestante,
                   parceira_gestante,
                   lactante,
                   raca,
                   nacionalidade,
                   genero,
                   orientacao_sexual,
                   estado_civil,
                   matriculado,
                   alfabetizado,
                   cicloEstudo,
                   numeroRa,
                   tipoEscola,
                   ensinoModalidade,
                   frequenciaAula,
                   concluiuCurso,
                   paroudeEstudar,
                   possui_deficiencia,
                   deficiencia,
                   trabalho,
                   necessita_cuidados_terceiros,
                   possui_demanda_saude,
                   saude,
                   possui_demanda_saude_mental,
                   saude_mental,
                   acompanhamento_saude,
                   faz_uso_de_medicamentos,
                   medicamentos,
                   faz_uso_de_medicamentos_controlados,
                   medicamentos_controlados,
                   possui_trabalho,
                   ['programas_sociais[]']: programas_sociais,
                   possui_familia_em_servico,
                   possui_filhos,
                   responsavel_por_pcd,
                   adolescente_com_trajetoria_de_acolhimento,
                   alcool_ou_drogas,
                   caps,
                   curso,
                   n_processo,
                   n_processo_apuracao,
                   n_pt,
                   vara_da_infancia,
                   dt_interpretacao_medida,
                   dt_ultimo_relatorio_enviado,
                   resumo_do_caso,
                   listar_cursos,
                   situacao_do_processo,
                   distrito_pessoa,
                   bairro,
                   rua,
                   numero,
                   complemento,
                   tipo_de_contato,
                   nome_do_contato,
                   email,
               } = req.body;
            
               nome            = normalizarTexto(nome);
               nome_social     = normalizarTexto(nome_social);
                nome_da_mae     = normalizarTexto(nome_da_mae);
                nome_do_pai     = normalizarTexto(nome_do_pai);
                nome_responsavel = normalizarTexto(nome_responsavel);
                nome_do_contato = normalizarTexto(nome_do_contato);

       
               
       
               // ================================================
               // VALIDAÇÕES SÍNCRONAS
               // ================================================
       
               telefone = telefone.replace(/\D/g, '');
               if (telefone.length < 10 || telefone.length > 11) {
                   return res.status(400).json({ error: 'Telefone inválido! Deve ter 10 ou 11 dígitos.' });
               }
       
               cep = cep.replace(/\D/g, '');
               if (cep.length !== 8) {
                   return res.status(400).json({ error: 'CEP inválido! Deve ter 8 dígitos.' });
               }
       
               if (!/^[A-Za-zÀ-ÖØ-öø-ÿ ]+$/.test(nome_responsavel)) {
                   return res.status(400).json({ error: 'Nome do responsável inválido.' });
               }
       
               rua = rua.replace(/[^A-Za-zÀ-ÖØ-öø-ÿ0-9\s]/g, '');
       
               numero = numero.replace(/\D/g, '');
               if (numero === '') {
                   return res.status(400).json({ error: 'Número do logradouro inválido.' });
               }
       
               const tiposLogradouroValidos = [
                   "Acesso","Alameda","Avenida","Beco","Caminho","Caminho particular",
                   "Caminho de pedestre","Complexo viário","Espaço livre","Esplanada",
                   "Estrada","Escadaria","Estrada particular","Estacionamento","Galeria",
                   "Jardim","Ladeira","Largo","Passarela","Praça","Praça de retorno",
                   "Passagem de pedestres","Parque","Passagem","Passagem particular",
                   "Passagem subterrânea","Pátio","Ponte","Pontilhão","Rua","Rua particular",
                   "Rua projetada","Rodovia","Servidão","Túnel","Travessa projetada","Travessa",
                   "Travessa particular","Via de circulação de pedestres","Viaduto","Viela",
                   "Via elevada","Viela particular","Vereda","Viela sanitária","Via","Vila",
                   "Vila particular","Via de pedestre"
               ];
       
               if (tipo_logradouro && !tiposLogradouroValidos.includes(tipo_logradouro)) {
                   return res.status(400).json({ error: 'Tipo de logradouro inválido.' });
               }
       
               // ================================================
               // VERIFICAÇÃO DE PROCESSO DUPLICADO (back-end)
               // ================================================
               connection.query(
                   "SELECT 1 FROM processos WHERE n_processo = ? LIMIT 1",
                   [n_processo],
                   (errVerifica, resultVerifica) => {
                       if (errVerifica) {
                           console.error("ERRO NA VERIFICAÇÃO:", errVerifica);
                           return res.status(500).json({ error: 'Erro ao verificar processo.' });
                       }
       
                       console.log("n_processo:", n_processo);
                       console.log("resultVerifica:", resultVerifica);
       
                       if (resultVerifica.length > 0) {
                           return res.status(400).json({ error: 'ER_DUP_ENTRY' });
                       }
       
                       // ================================================
                       // A PARTIR DAQUI: processo não existe, pode salvar
                       // ================================================
       
                       var dt_desligamento = (ativo_inativo == 0) ? `${ano}-${mes}-${dia}` : null;
       
                       const cep_unidade_limpo = cep_unidade ? cep_unidade.replace(/\D/g, '') : null;
                       let dias_semana = null;
       
                       let diasRaw = req.body['dias[]'] || req.body.dias || req.body.dias_semana;
       
                       if (diasRaw) {
                           if (!Array.isArray(diasRaw)) {
                               diasRaw = [diasRaw]; // transforma string em array
                           }
                           dias_semana = diasRaw.join(',');
                       }
       
                       console.log("dias_semana resolvido:", dias_semana);
       
                       // Normaliza campos opcionais para null
                       gestante                    = utils.verificar_campos(gestante)                    ?? null;
                       lactante                    = utils.verificar_campos(lactante)                    ?? null;
                       deficiencia                 = utils.verificar_campos(deficiencia)                 ?? null;
                       medicamentos                = utils.verificar_campos(medicamentos)                ?? null;
                       saude                       = utils.verificar_campos(saude)                       ?? null;
                       medicamentos_controlados    = utils.verificar_campos(medicamentos_controlados)    ?? null;
                       saude_mental                = utils.verificar_campos(saude_mental)                ?? null;
                       acompanhamento_saude        = utils.verificar_campos(acompanhamento_saude)        ?? null;
                       numeroRa                    = utils.verificar_campos(numeroRa)                    ?? null;
                       tipoEscola                  = utils.verificar_campos(tipoEscola)                  ?? null;
                       ensinoModalidade            = utils.verificar_campos(ensinoModalidade)            ?? null;
                       cicloEstudo                 = utils.verificar_campos(cicloEstudo)                 ?? null;
                       frequenciaAula              = utils.verificar_campos(frequenciaAula)              ?? null;
                       concluiuCurso               = utils.verificar_campos(concluiuCurso)               ?? null;
                       paroudeEstudar              = utils.verificar_campos(paroudeEstudar)              ?? null;
                       cpf                         = utils.verificar_campos(cpf)                         ?? null;
                       orientacao_sexual           = utils.verificar_campos(orientacao_sexual)           ?? null;
                       genero                      = utils.verificar_campos(genero)                      ?? null;
                       creas_origem                = utils.verificar_campos(creas_origem)                ?? null;
                       nome_social                 = utils.verificar_campos(nome_social)                 ?? null;
                       cartao_sus                  = utils.verificar_campos(cartao_sus)                  ?? null;
                       nome_do_pai                 = utils.verificar_campos(nome_do_pai)                 ?? null;
                       vara_da_infancia            = utils.verificar_campos(vara_da_infancia)            ?? null;
                       complemento                 = utils.verificar_campos(complemento)                 ?? null;
                       trabalho                    = utils.verificar_campos(trabalho)                    ?? null;
                       servico_familia             = utils.verificar_campos(servico_familia)             ?? null;
                       caps                        = utils.verificar_campos(caps)                        ?? null;
                       curso                       = utils.verificar_campos(curso)                       ?? null;
                       ubs                         = utils.verificar_campos(ubs)                         ?? null;
                       n_pt                        = utils.verificar_campos(n_pt)                        ?? null;
       
                       // ================================================
                       // BUSCA DE IDs (assíncrona — todas em paralelo)
                       // ================================================
       
                       let idCreasAtual, idCreasOrigem, idDeficiencia, idDistritoServico;
                       let idUbs, idDistritoPessoa, idTipoEscola, idEnsinoModalidade;
                       let idCicloEstudo, idParouEstudar, idEstadoCivil, idGenero;
                       let idMedidasMse, idMse, idTecRef, idNacionalidade;
                       let idOrientacaoSexual, idRaca, idTrabalho, idSas;
                       let idServicoFamilia, idAlcoolOuDrogas, idSituacaoProcesso;
                       let idVaraDaInfancia, idTipoDeContato;
                       let idsProgramasSociais = [];
       
                       IdDescricaoRepository.getIdByDescricaoCadastro('creas', creas_atual, (e, id) => { if (id) idCreasAtual = id; });
                       IdDescricaoRepository.getIdByDescricaoCadastro('creas', creas_origem, (e, id) => { if (id) idCreasOrigem = id; });
                       IdDescricaoRepository.getIdByDescricaoCadastro('distrito', distrito_servico, (e, id) => { if (id) idDistritoServico = id; });
                       IdDescricaoRepository.getIdByDescricaoCadastro('ubs', ubs, (e, id) => { if (id) idUbs = id; });
                       IdDescricaoRepository.getIdByDescricaoCadastro('distrito', distrito_pessoa, (e, id) => { if (id) idDistritoPessoa = id; });
                       IdDescricaoRepository.getIdByDescricaoCadastro('estado_civil', estado_civil, (e, id) => { if (id) idEstadoCivil = id; });
                       IdDescricaoRepository.getIdByDescricaoCadastro('genero', genero, (e, id) => { if (id) idGenero = id; });
                       IdDescricaoRepository.getIdByDescricaoCadastro('medidas_mse', medidas_mse, (e, id) => { if (id) idMedidasMse = id; });
                       IdDescricaoRepository.getIdByDescricaoCadastro('mse', mse, (e, id) => { if (id) idMse = id; });
                       IdDescricaoRepository.getIdByDescricaoCadastro('nacionalidade', nacionalidade, (e, id) => { if (id) idNacionalidade = id; });
                       IdDescricaoRepository.getIdByDescricaoCadastro('orientacao_sexual', orientacao_sexual, (e, id) => { if (id) idOrientacaoSexual = id; });
                       IdDescricaoRepository.getIdByDescricaoCadastro('raca', raca, (e, id) => { if (id) idRaca = id; });
                       IdDescricaoRepository.getIdByDescricaoCadastro('trabalho', trabalho, (e, id) => { if (id) idTrabalho = id; });
                       IdDescricaoRepository.getIdByDescricaoCadastro('servico_familia', servico_familia, (e, id) => { if (id) idServicoFamilia = id; });
                       IdDescricaoRepository.getIdByDescricaoCadastro('alcool_ou_drogas', alcool_ou_drogas, (e, id) => { if (id) idAlcoolOuDrogas = id; });
                       IdDescricaoRepository.getIdByDescricaoCadastro('situacao_do_processo', situacao_do_processo, (e, id) => { if (id) idSituacaoProcesso = id; });
                       IdDescricaoRepository.getIdByDescricaoCadastro('vara_da_infancia', vara_da_infancia, (e, id) => { if (id) idVaraDaInfancia = id; });
       
                       if (deficiencia) {
                           IdDescricaoRepository.getIdByDescricaoCadastro('deficiencia', deficiencia, (e, id) => { if (id) idDeficiencia = id; });
                       }
                       if (tipoEscola) {
                           IdDescricaoRepository.getIdByDescricaoCadastro('tipoEscola', tipoEscola, (e, id) => { if (id) idTipoEscola = id; });
                       }
                       if (ensinoModalidade) {
                           IdDescricaoRepository.getIdByDescricaoCadastro('ensinoModalidade', ensinoModalidade, (e, id) => { if (id) idEnsinoModalidade = id; });
                       }
                       if (cicloEstudo) {
                           IdDescricaoRepository.getIdByDescricaoCadastro('cicloEstudo', cicloEstudo, (e, id) => { if (id) idCicloEstudo = id; });
                       }
                       if (paroudeEstudar) {
                           IdDescricaoRepository.getIdByDescricaoCadastro('paroudeEstudar', paroudeEstudar, (e, id) => { if (id) idParouEstudar = id; });
                       }
       
                       idSas = sas ? parseInt(sas) : null;
       
                       connection.query(`SELECT ID FROM usuarios WHERE nome = ?`, [tec_ref], (error, results) => {
                           if (!error && results.length > 0) idTecRef = results[0].ID;
                       });
       
                       const programas_sociais_normalizado = Array.isArray(programas_sociais)
                           ? programas_sociais
                           : programas_sociais ? [programas_sociais] : [];
       
                       for (let i = 0; i < programas_sociais_normalizado.length; i++) {
                           const descricao = programas_sociais_normalizado[i];
                           if (!descricao || descricao === '') continue;
                           IdDescricaoRepository.getIdByDescricaoCadastro('programas_sociais', descricao, (e, id) => {
                               if (id) idsProgramasSociais.push(id);
                           });
                       }
       
                       // ================================================
                       // AGUARDA AS CONSULTAS ASSÍNCRONAS E INICIA TRANSACTION
                       // ================================================
                       setTimeout(() => {
       
                           connection.beginTransaction((err) => {
                               if (err) {
                                   return res.status(500).json({ error: 'Erro ao iniciar transação.' });
                               }
       
                               // INSERT processos
                               connection.query(`
                                   INSERT INTO processos
                                       (n_processo, n_processo_apuracao, n_pt, fk_vara_da_infancia,
                                       resumo_do_caso, fk_situacao, dt_interpretacao_medida, dt_ultimo_relatorio_enviado)
                                   VALUES (?, ?, ?, ?, ?, ?, ?, ?)`,
                                   [n_processo, n_processo_apuracao, n_pt, idVaraDaInfancia,
                                    resumo_do_caso, idSituacaoProcesso, dt_interpretacao_medida, dt_ultimo_relatorio_enviado],
                                   (errProcesso, resProcesso) => {
                                       if (errProcesso) {
                                           return connection.rollback(() => {
                                               return res.status(500).json({ error: 'Erro ao inserir processo.' });
                                           });
                                       }
       
                                       const novoIDProcesso = resProcesso.insertId;
                                       // INSERT pessoas
                                       const colunasInsert = ['fk_processos', 'fk_creas_atual', 'fk_mse', 'fk_tec_ref', 'fk_sas', 'fk_servico_familia',
                                           'fk_distrito_servico', 'fk_ubs', 'fk_creas_origem', 'nome', 'nome_social', 'dt_nasc', 'cpf',
                                           'cartao_sus', 'nome_da_mae', 'nome_do_pai', 'nome_responsavel', 'sexo', 'fk_raca',
                                           'fk_nacionalidade', 'fk_genero', 'fk_orientacao_sexual', 'fk_estado_civil', 'matriculado',
                                           'alfabetizado', 'fk_cicloEstudo', 'numeroRa', 'fk_tipoEscola', 'fk_ensinoModalidade',
                                           'frequenciaAula', 'concluiuCurso', 'fk_paroudeEstudar', 'possui_deficiencia',
                                           'fk_deficiencia', 'fk_trabalho', 'necessita_cuidados_terceiros', 'possui_demanda_saude',
                                           'saude', 'possui_demanda_saude_mental', 'saude_mental', 'acompanhamento_saude',
                                           'faz_uso_de_medicamentos', 'medicamentos', 'faz_uso_de_medicamentos_controlados',
                                           'medicamentos_controlados', 'possui_trabalho', 'possui_familia_em_servico', 'gestante',
                                           'parceira_gestante', 'lactante', 'possui_filhos', 'responsavel_por_pcd',
                                           'adolescente_com_trajetoria_de_acolhimento', 'fk_alcool_ou_drogas', 'caps', 'curso',
                                           'fk_distrito_pessoa', 'cep', 'bairro', 'rua', 'numero', 'complemento', 'cad_unico',
                                           'ativo_inativo', 'fk_medidas', 'dt_cadastro', 'dt_atualizacao', 'dt_desligamento', null, 'listar_cursos'];
       
                                       const valoresInsert = [
                                           novoIDProcesso, idCreasAtual, idMse, idTecRef, idSas, idServicoFamilia,
                                           idDistritoServico, idUbs, idCreasOrigem, nome, nome_social, dt_nasc, cpf,
                                           cartao_sus, nome_da_mae, nome_do_pai, nome_responsavel, sexo, idRaca,
                                           idNacionalidade, idGenero, idOrientacaoSexual, idEstadoCivil, matriculado,
                                           alfabetizado, idCicloEstudo, numeroRa, idTipoEscola, idEnsinoModalidade,
                                           frequenciaAula, concluiuCurso, idParouEstudar, possui_deficiencia,
                                           idDeficiencia, idTrabalho, necessita_cuidados_terceiros, possui_demanda_saude,
                                           saude, possui_demanda_saude_mental, saude_mental, acompanhamento_saude,
                                           faz_uso_de_medicamentos, medicamentos, faz_uso_de_medicamentos_controlados,
                                           medicamentos_controlados, possui_trabalho, possui_familia_em_servico, gestante,
                                           parceira_gestante, lactante, possui_filhos, responsavel_por_pcd,
                                           adolescente_com_trajetoria_de_acolhimento, idAlcoolOuDrogas, caps, curso,
                                           idDistritoPessoa, cep, bairro, rua, numero, complemento, cad_unico,
                                           ativo_inativo, idMedidasMse, dt_cadastro, dt_atualizacao, dt_desligamento, null,  listar_cursos];
       
                                       console.log("COLUNAS:", colunasInsert.length);
                                       console.log("VALORES:", valoresInsert.length);
       
                                       
       
                                       // INSERT pessoas
                                       connection.query(`
                                           INSERT INTO pessoas
                                               (fk_processos, fk_creas_atual, fk_mse, fk_tec_ref, fk_sas, fk_servico_familia,
                                               fk_distrito_servico, fk_ubs, fk_creas_origem, nome, nome_social, dt_nasc, cpf,
                                               cartao_sus, nome_da_mae, nome_do_pai, nome_responsavel, sexo, fk_raca,
                                               fk_nacionalidade, fk_genero, fk_orientacao_sexual, fk_estado_civil, matriculado,
                                               alfabetizado, fk_cicloEstudo, numeroRa, fk_tipoEscola, fk_ensinoModalidade,
                                               frequenciaAula, concluiuCurso, fk_paroudeEstudar, possui_deficiencia,
                                               fk_deficiencia, fk_trabalho, necessita_cuidados_terceiros, possui_demanda_saude,
                                               saude, possui_demanda_saude_mental, saude_mental, acompanhamento_saude,
                                               faz_uso_de_medicamentos, medicamentos, faz_uso_de_medicamentos_controlados,
                                               medicamentos_controlados, possui_trabalho, possui_familia_em_servico, gestante,
                                               parceira_gestante, lactante, possui_filhos, responsavel_por_pcd,
                                               adolescente_com_trajetoria_de_acolhimento, fk_alcool_ou_drogas, caps, curso,
                                               fk_distrito_pessoa, cep, bairro, rua, numero, complemento, cad_unico,
                                               ativo_inativo, fk_medidas, dt_cadastro, dt_atualizacao, dt_desligamento, nis, listar_cursos)
                                           VALUES (?,?,?,?,?,?,?,?,?,?,
                                           ?,?,?,?,?,?,?,?,?,?,
                                           ?,?,?,?,?,?,?,?,?,?,
                                           ?,?,?,?,?,?,?,?,?,?,
                                           ?,?,?,?,?,?,?,?,?,?,
                                           ?,?,?,?,?,?,?,?,?,?,
                                           ?,?,?,?,?,?,?,?,?,?)`,
                                           [
                                               novoIDProcesso, idCreasAtual, idMse, idTecRef, idSas, idServicoFamilia,
                                               idDistritoServico, idUbs, idCreasOrigem, nome, nome_social, dt_nasc, cpf,
                                               cartao_sus, nome_da_mae, nome_do_pai, nome_responsavel, sexo, idRaca,
                                               idNacionalidade, idGenero, idOrientacaoSexual, idEstadoCivil, matriculado,
                                               alfabetizado, idCicloEstudo, numeroRa, idTipoEscola, idEnsinoModalidade,
                                               frequenciaAula, concluiuCurso, idParouEstudar, possui_deficiencia,
                                               idDeficiencia, idTrabalho, necessita_cuidados_terceiros, possui_demanda_saude,
                                               saude, possui_demanda_saude_mental, saude_mental, acompanhamento_saude,
                                               faz_uso_de_medicamentos, medicamentos, faz_uso_de_medicamentos_controlados,
                                               medicamentos_controlados, possui_trabalho, possui_familia_em_servico, gestante,
                                               parceira_gestante, lactante, possui_filhos, responsavel_por_pcd,
                                               adolescente_com_trajetoria_de_acolhimento, idAlcoolOuDrogas, caps, curso,
                                               idDistritoPessoa, cep, bairro, rua, numero, complemento, cad_unico,
                                               ativo_inativo, idMedidasMse, dt_cadastro, dt_atualizacao, dt_desligamento, null, listar_cursos
                                           ],
                                           (errPessoa, resPessoa) => {
                                               if (errPessoa) {
                                                   return connection.rollback(() => {
                                                       console.error("Erro ao inserir pessoa:", errPessoa);
       
                                                       if (errPessoa.code === 'ER_DUP_ENTRY') {
                                                           return res.status(400).json({ error: 'ER_DUP_ENTRY' });
                                                       }
                                                       return res.status(500).json({ error: 'Erro ao inserir pessoa.' });
                                                   });
                                               }
       
                                               const novoIDPessoa = resPessoa.insertId;
       
                                               // INSERT programas sociais
                                               for (let i = 0; i < idsProgramasSociais.length; i++) {
                                                   connection.query(
                                                       `INSERT IGNORE INTO programas_sociais_pessoas (fk_id_pessoa, fk_programa_social_id) VALUES (?, ?)`,
                                                       [novoIDPessoa, idsProgramasSociais[i]],
                                                       (errPS) => {
                                                           if (errPS) console.error(`Erro ao inserir programa social:`, errPS);
                                                       }
                                                   );
                                               }
       
                                               // INSERT contatos
                                               connection.query(
                                                   `INSERT INTO contatos (telefone, nome, email) VALUES (?, ?, ?)`,
                                                   [telefone, nome_do_contato, email],
                                                   (errContato, resContato) => {
                                                       if (errContato) {
                                                           return connection.rollback(() => {
                                                               return res.status(500).json({ error: 'Erro ao inserir dados de contato.' });
                                                           });
                                                       }
       
                                                       const novoIDContato = resContato.insertId;
       
                                                       IdDescricaoRepository.getIdByDescricaoCadastro('tipo_de_contato', tipo_de_contato?.trim(), (errTipo, idTipo) => {
                                                           if (errTipo) {
                                                               return connection.rollback(() => {
                                                                   return res.status(500).json({ error: 'Erro ao buscar tipo de contato.' });
                                                               });
                                                           }
       
                                                           idTipoDeContato = idTipo;
       
                                                           if (!idTipoDeContato) {
                                                               console.log("Tipo de contato não encontrado:", tipo_de_contato);
                                                               // Continua sem vínculo de contato
                                                               inserirUnidade();
                                                               return;
                                                           }
       
                                                           // INSERT contatos_pessoas
                                                           connection.query(
                                                               `INSERT INTO contatos_pessoas (fk_id_contatos, fk_id_pessoas, fk_tipo_de_contato) VALUES (?, ?, ?)`,
                                                               [novoIDContato, novoIDPessoa, idTipoDeContato],
                                                               (errRel) => {
                                                                   if (errRel) {
                                                                       return connection.rollback(() => {
                                                                           return res.status(500).json({ error: 'Erro ao inserir relação contato-pessoa.' });
                                                                       });
                                                                   }
                                                                   inserirUnidade();
                                                               }
                                                           );
                                                       });
                                                   }
                                               );
       
                                               // Função auxiliar para inserir unidade acolhedora
                                               function inserirUnidade() {
                                                   connection.query(`
                                                       INSERT INTO unidade_acolhedora
                                                           (nome, tipo_local, atividade_unidade, tipo_logradouro, logradouro_unidade,
                                                           numero, complemento, bairro, cep_unidade, telefone, responsavel_unidade,
                                                           horario_inicio_unidade, horario_fim_unidade, dias_semana, horas_psc, ativo_inativo)
                                                       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
                                                       [
                                                           nome_unidade, tipo_local, atividade_unidade, tipo_logradouro,
                                                           logradouro_unidade, numero_unidade, complemento_unidade, bairro_unidade,
                                                           cep_unidade_limpo, telefone_unidade, responsavel_unidade,
                                                           horario_inicio_unidade, horario_fim_unidade, dias_semana, horas_psc, 1
                                                       ],
                                                       (errUnidade, resUnidade) => {
                                                           if (errUnidade) {
                                                               return connection.rollback(() => {
                                                                   return res.status(500).json({ error: 'Erro ao salvar unidade acolhedora.' });
                                                               });
                                                           }
       
                                                           const idUnidadeAcolhedora = resUnidade.insertId;
       
                                                           // INSERT adolescente_unidade_acolhedora
                                                           connection.query(
                                                               `INSERT INTO adolescente_unidade_acolhedora (fk_pessoa, fk_unidade_acolhedora) VALUES (?, ?)`,
                                                               [novoIDPessoa, idUnidadeAcolhedora],
                                                               (errVinculo) => {
                                                                   if (errVinculo) {
                                                                       return connection.rollback(() => {
                                                                           return res.status(500).json({ error: 'Erro ao criar vínculo.' });
                                                                       });
                                                                   }
       
                                                                   // COMMIT final
                                                                   connection.commit((errCommit) => {
                                                                       if (errCommit) {
                                                                           return connection.rollback(() => {
                                                                               return res.status(500).json({ error: 'Erro ao finalizar cadastro.' });
                                                                           });
                                                                       }
       
                                                                       return res.json({ success: true }); 
                                                                   });
                                                               }
                                                           );
                                                       }
                                                   );
                                               }
       
                                           }
                                       ); // fim INSERT pessoas
                                   }
                               ); // fim INSERT processos
                           }); // fim beginTransaction
       
                       }, 300); // aguarda consultas de ID assíncronas
       
                   }
               ); // fim verificação duplicata
       
           }); // fim app.post
       
       } // fim rota_adminCadastraPessoa
       


module.exports = rota_cadastroPessoas;