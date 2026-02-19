/*-configurações padrões---------------------------------------------------------------------------------------------*/

//Importa o módulo fs e path para lidar com arquivos e caminhos
let fs = require('fs');
let path = require('path');
let IdDescricaoRepository = require('../repository/IdDescricaoRepository');
let utils = require('../utils/validacoes');

//Importa a conexão com o banco de dados
let { connection } = require('../db/db');

//Define as rotas do aplicativo
function rota_adminEditaPessoa(app) {
 /*-----Admin editando pessoa-------------------------------------------------------------------------------------*/

    // Rota para a página de edição
    app.get('/adminEditaPessoa', (req, res) => {
        // Verifica se o usuário está autenticado
        if (req.session.adminAuthenticated) {
            let filePath = path.join(__dirname, '..', 'views', 'adminGroup_EditarAdolescente.html');
            res.sendFile(filePath);
        } else {
            res.redirect('/');
        }
    });

    // Rota para buscar os dados do usuário com base no CPF
    app.get('/editandoPessoas/:ID', (req, res) => {
        let ID = req.params.ID;

        // Aqui você faz a consulta ao banco de dados para obter os dados do usuário com o CPF especificado
        connection.query(`SELECT
                            P.ativo_inativo,
                            P.ID,
                            P.dt_cadastro,
                            P.dt_atualizacao,
                            CA.descricao AS "creas_atual",
                            M.descricao AS "mse",
                            U.nome AS "tec_ref",
                            S.descricao AS "sas",
                            SF.descricao AS "servico_familia",
                            DS.descricao AS "distrito_servico",
                            CO.descricao AS "creas_origem",
                            P.nome,
                            P.nome_social,
                            P.dt_nasc,
                            P.cpf,
                            P.nis,
                            P.cartao_sus,
                            MM.descricao AS "medidas_mse",
                            P.nome_da_mae,
                            P.nome_do_pai,
                            P.nome_responsavel,
                            P.sexo,
                            P.gestante,
                            P.parceira_gestante,
                            P.lactante,
                            R.descricao AS "raca",
                            N.descricao AS "nacionalidade",
                            G.descricao AS "genero",
                            OS.descricao AS "orientacao_sexual",
                            EC.descricao AS "estado_civil",
                            P.matriculado, 
                            P.alfabetizado, 
                            CE.descricao AS cicloEstudo,
                            P.numeroRa,
                            TE.descricao AS tipoEscola,
                            ME.descricao AS ensinoModalidade,
                            P.frequenciaAula, 
                            P.concluiuCurso, 
                            PE.descricao AS "paroudeEstudar",
                            P.possui_deficiencia,
                            D.descricao AS "deficiencia",
                            REL.descricao AS "trabalho",
                            P.necessita_cuidados_terceiros,
                            P.possui_demanda_saude,
                            P.saude,
                            P.possui_demanda_saude_mental,
                            P.saude_mental,
                            P.acompanhamento_saude,
                            P.faz_uso_de_medicamentos,
                            P.medicamentos,
                            P.faz_uso_de_medicamentos_controlados,
                            P.medicamentos_controlados,
                            P.possui_trabalho,
                            -- PS.descricao AS "programas_sociais",
                            P.possui_familia_em_servico,
                            P.possui_filhos,
                            P.responsavel_por_pcd,
                            P.adolescente_com_trajetoria_de_acolhimento,
                            AD.descricao AS "alcool_ou_drogas",
                            P.caps,
                            P.curso,
                            PRO.n_processo,
                            PRO.n_processo_apuracao,
                            PRO.n_pt,
                            VI.descricao AS "vara_da_infancia",
                            PRO.dt_interpretacao_medida,
                            PRO.dt_ultimo_relatorio_enviado,
                            PRO.resumo_do_caso,
                            SP.descricao AS "situacao_do_processo",
                            DP.descricao AS "distrito_pessoa",
                            UBS.descricao AS "ubs",
                            P.cep,
                            P.bairro,
                            P.rua,
                            P.numero,
                            P.complemento,
                            CP.fk_id_contatos AS "ID_contatos",
                            TDP.descricao AS 'tipo_de_contato', 
                            C.telefone, 
                            C.nome AS 'nome_do_contato', 
                            C.email,
                            P.dt_desligamento,
                            P.listar_cursos,
                            UA.tipo_local,
                            UA.nome AS 'nome_unidade',
                            UA.cep_unidade AS 'cep_unidade',
                            UA.tipo_logradouro,
                            UA.logradouro_unidade,
                            UA.numero AS 'numero_unidade',
                            UA.complemento AS 'complemento_unidade',
                            UA.bairro AS 'bairro_unidade',
                            UA.telefone AS 'telefone_unidade',
                            UA.horario_inicio_unidade,
                            UA.horario_fim_unidade,
                            UA.dias_semana,
                            UA.responsavel_unidade,
                            UA.atividade_unidade                           
                        FROM pessoas P
                        LEFT JOIN creas CA ON CA.ID = P.fk_creas_atual
                        LEFT JOIN mse M ON M.ID = P.fk_mse
                        LEFT JOIN sas S ON S.ID = P.fk_sas
                        LEFT JOIN servico_familia SF ON SF.ID = P.fk_servico_familia
                        LEFT JOIN distrito DS ON DS.ID = P.fk_distrito_servico
                        LEFT JOIN creas CO ON CO.ID = P.fk_creas_origem
                        LEFT JOIN raca R ON R.ID = P.fk_raca
                        LEFT JOIN nacionalidade N ON N.ID = P.fk_nacionalidade
                        LEFT JOIN genero G ON G.ID = P.fk_genero
                        LEFT JOIN orientacao_sexual OS ON OS.ID = P.fk_orientacao_sexual
                        LEFT JOIN estado_civil EC ON EC.ID = P.fk_estado_civil
                        LEFT JOIN deficiencia D ON D.ID = P.fk_deficiencia
                        LEFT JOIN trabalho REL ON REL.ID = P.fk_trabalho
                        LEFT JOIN alcool_ou_drogas AD ON AD.ID = P.fk_alcool_ou_drogas
                        LEFT JOIN processos PRO ON PRO.ID = P.fk_processos
                        LEFT JOIN distrito DP ON DP.ID = P.fk_distrito_pessoa
                        LEFT JOIN vara_da_infancia VI ON VI.ID = PRO.fk_vara_da_infancia
                        LEFT JOIN situacao_do_processo SP ON SP.ID = PRO.fk_situacao
                        LEFT JOIN medidas_mse MM ON MM.ID = P.fk_medidas
                        LEFT JOIN contatos_pessoas CP ON CP.fk_id_pessoas = P.ID
                        LEFT JOIN contatos C ON C.ID = CP.fk_id_contatos
                        LEFT JOIN tipo_de_contato TDP ON TDP.ID = CP.fk_tipo_de_contato
                        LEFT JOIN cicloEstudo CE on CE.ID = P.fk_cicloEstudo
                        LEFT JOIN tipoEscola TE on TE.ID = P.fk_tipoEscola
                        LEFT JOIN ensinoModalidade ME on ME.ID = P.fk_ensinoModalidade
                        LEFT JOIN paroudeEstudar PE ON PE.ID = P.fk_paroudeEstudar
                        LEFT JOIN usuarios U ON U.ID = P.fk_tec_ref
                        LEFT JOIN ubs UBS ON UBS.ID = P.fk_ubs
                        LEFT JOIN adolescente_unidade_acolhedora AUA ON AUA.fk_pessoa = P.ID
                        LEFT JOIN unidade_acolhedora UA ON UA.id = AUA.fk_unidade_acolhedora
						LEFT JOIN programas_sociais_pessoas PSP ON PSP.fk_id_pessoa = P.ID
                        LEFT JOIN programas_sociais PS ON PS.ID = PSP.fk_programa_social_id
                        WHERE P.ID = ?`, [ID], (error, results, fields) => {
            if (error) {
                console.error('Erro ao buscar dados do usuário:', error);
                res.status(500).send('Erro ao buscar dados do usuário.');
                return;
            }

            if (results.length > 0) {
               /* let usuario = results[0];
                res.json(usuario); // Envia os dados do usuário como resposta em JSON*/
				let usuario = results[0];

				// pega todos os programas sociais
				usuario.programas_sociais = results
					.map(r => r.programas_sociais)
					.filter(p => p); // remove null

				res.json(usuario);

            } else {
                res.status(404).send('Usuário não encontrado.');
            }
        });
    });

		 app.get('/editandoPessoasProgramas/:ID', (req, res) => {
			let ID = req.params.ID;

			connection.query(`
				SELECT PS.descricao
				FROM programas_sociais PS
				INNER JOIN programas_sociais_pessoas PSP 
					ON PS.ID = PSP.fk_programa_social_id
				WHERE PSP.fk_id_pessoa = ?`,
				[ID],
				(error, results) => {

					if (error) {
						console.error('Erro ao buscar programas sociais:', error);
						return res.status(500).json([]);
					}

					// Retorna array simples
					const programas = results.map(r => r.descricao);
					res.json(programas);
				}
			);
		});

    // Rota para atualizar os dados do usuário com base no ID
    app.put('/editandoPessoas/:ID', (req, res) => {
        let dataAtual = new Date();

        // Extrair ano, mês e dia
        let ano = dataAtual.getFullYear();
        let mes = String(dataAtual.getMonth() + 1).padStart(2, '0'); // adiciona um zero à esquerda se for necessário
        let dia = String(dataAtual.getDate()).padStart(2, '0'); // adiciona um zero à esquerda se for necessário

        // Montar a data no formato desejado (aaaa-mm-dd)
        let dt_atualizacao = `${ano}-${mes}-${dia}`;
        let ID = req.params.ID;
        var cpf = req.body.cpf.replace(/[.-]/g, '');
        var cpfValido = utils.validarCPF(cpf);
        if (!cpfValido.valido) {
            return res.status(500).send('<script>alert("cpf inválido");window.location.href = "/adminEditaPessoa";</script>');
        } else {
            console.log("CPF válido:", cpfValido.cpf);
            cpf = cpfValido.cpf;
        }

        let nis = req.body.nis.replace(/[.-]/g, '');
        let cartao_sus = req.body.cartao_sus.replace(/[.-]/g, '');
        let cep = req.body.cep.replace(/-/g, "")
        let telefone = req.body.telefone.replace(/\D/g, '')
        var {
			tipo_local,
			nome_unidade,
			cep_unidade,
			tipo_logradouro,
			//logradouro,
			logradouro_unidade,
			numero_unidade,
			complemento_unidade,
			bairro_unidade,
			telefone_unidade,
			horario_inicio_unidade,
			horario_fim_unidade,
			dias_semana,
			responsavel_unidade,
			atividade_unidade, 
            ativo_inativo,    //: ativo_inativo, 
            dt_cadastro,    //: dt_cadastro, 
            creas_atual,    //: creas_atual, 
            mse,    //: mse, 
            tec_ref,    //: tec_ref,
            sas,    //: sas, 
            servico_familia,    //: servico_familia,
            distrito_servico,    //: distrito_servico, 
            creas_origem,    //: creas_origem, 
            nome,    //: nome, 
            nome_social,    //: nome_social, 
            dt_nasc,    //: dt_nasc, 
            medidas_mse,    //: medidas_mse, 
            nome_da_mae,    //: nome_da_mae, 
            nome_do_pai,    //: nome_do_pai,
            nome_responsavel,    //: nome_responsavel, 
            sexo,    //: sexo, 
            gestante,    //: gestante, 
            parceira_gestante,    //: parceira_gestante, 
            lactante,    //: lactante, 
            raca,    //: raca, 
            nacionalidade,    //: nacionalidade, 
            genero,    //: genero, 
            orientacao_sexual,    //: orientacao_sexual, 
            estado_civil,    //: estado_civil, 
            matriculado,    //: matriculado,
            alfabetizado,    //: alfabetizado, 
            cicloEstudo,    //: cicloEstudo, 
            numeroRa,    //: numeroRa,
            tipoEscola,    //: tipoEscola,
            ensinoModalidade,    //: ensinoModalidade,
            frequenciaAula,    //: frequenciaAula,
            concluiuCurso,    //: concluiuCurso,
            paroudeEstudar,    //: paroudeEstudar,
            possui_deficiencia,    //: possui_deficiencia,
            deficiencia,    //: deficiencia,
            trabalho,    //: trabalho, 
            necessita_cuidados_terceiros,    //: necessita_cuidados_terceiros, 
            possui_demanda_saude,    //: possui_demanda_saude,
            saude,    //: saude,
            possui_demanda_saude_mental,    //: possui_demanda_saude,
            saude_mental,    //: saude,
            acompanhamento_saude,    //: acompanhamento_saude,
            faz_uso_de_medicamentos,    //: faz_uso_de_medicamentos,
            medicamentos,    //: medicamentos, 
            faz_uso_de_medicamentos_controlados,    //: faz_uso_de_medicamentos_controlados,
            medicamentos_controlados,    //: medicamentos_controlados, 
            possui_trabalho,    //: possui_trabalho, 
            programas_sociais,    //: programas_sociais, 
            possui_familia_em_servico,    //: possui_familia_em_servico, 
            possui_filhos,    //: possui_filhos, 
            responsavel_por_pcd,    //: responsavel_por_pcd, 
            adolescente_com_trajetoria_de_acolhimento,    //: adolescente_com_trajetoria_de_acolhimento, 
            alcool_ou_drogas,    //: alcool_ou_drogas, 
            caps,   //: caps,
            curso,  //: curso,
            n_processo,    //: n_processo, 
            n_processo_apuracao,    //: n_processo_apuracao, 
            n_pt,    //: n_pt, 
            vara_da_infancia,    //: vara_da_infancia, 
            dt_interpretacao_medida,    //: dt_interpretacao_medida, 
            dt_ultimo_relatorio_enviado,    //: dt_ultimo_relatorio_enviado, 
            resumo_do_caso,    //: resumo_do_caso, 
            listar_cursos,  //: listar_cursos,
            situacao_do_processo,    //: situacao_do_processo, 
            distrito_pessoa,    //: distrito_pessoa, 
            ubs,    //: ubs,
            bairro,    //: bairro, 
            rua,    //: rua, 
            numero,    //: numero, 
            complemento,    //: complemento, 
            ID_contatos,    //:ID_contatos
            tipo_de_contato,    //: tipo_de_contato, 
            nome_do_contato,    //: nome_do_contato, 
            email,    //: email 
        } = req.body;

        console.log("ANTES DO TRATAMENTO:", req.body.cep_unidade);


        if (typeof cep_unidade === "string") {
            console.log("Valor original:", cep_unidade);
            
            cep_unidade = cep_unidade.trim(); // remove espaços invisíveis
            cep_unidade = cep_unidade.replace(/\D/g, '');

            console.log("Após replace:", cep_unidade);
            console.log("Tamanho:", cep_unidade.length);

            if (cep_unidade.length !== 8) {
                console.log("CEP inválido, setando null");
                cep_unidade = null;
            }
        } else {
            cep_unidade = null;
        }

        console.log("DEPOIS DO TRATAMENTO:", cep_unidade);


        var dt_desligamento = req.body.dt_desligamento;
        // Se estiver inativo (ativo_inativo == 0)
        if (ativo_inativo == 0) {
            if (dt_desligamento === undefined || dt_desligamento === null || isNaN(new Date(dt_desligamento).getTime())) {
                dt_desligamento = dt_atualizacao;
                //console.log(dt_desligamento)
            } else {
                // Se uma data foi fornecida, converta para Date e mantenha essa data
                dt_desligamento = new Date(dt_desligamento);
                let dt_desligamento_ano = dt_desligamento.getFullYear();
                let dt_desligamento_mes = String(dt_desligamento.getMonth() + 1).padStart(2, '0'); // Mês com zero à esquerda
                let dt_desligamento_dia = String(dt_desligamento.getDate() + 1).padStart(2, '0'); // Dia com zero à esquerda
                dt_desligamento = `${dt_desligamento_ano}-${dt_desligamento_mes}-${dt_desligamento_dia}`;
                console.log(dt_desligamento)
            }
        } else {
            dt_desligamento = null
        }

		
		// remove qualquer coisa que não seja número do CEP
		/*const cep_unidade_limpo = cep_unidade
			? cep_unidade.replace(/\D/g, '')
			: null;*/
		
		
		// Telefone: remover tudo que não é número e validar se é celular/fixo
		telefone = telefone.replace(/\D/g, ''); 
		if (telefone.length < 10 || telefone.length > 11) {
			return res.send(`<script>alert("Telefone inválido! Deve ter 10 ou 11 dígitos"); window.history.back();</script>`);
		}
		let tipoTelefone = (telefone.length === 11) ? 'Celular' : 'Fixo'; // automático

		// CEP: apenas números
		cep = cep.replace(/\D/g, '');
		if (cep.length !== 8) {
			return res.send(`<script>alert("CEP inválido! Deve ter 8 dígitos."); window.history.back();</script>`);
		}

		// Nome do responsável: apenas letras e espaços
		if (!/^[A-Za-zÀ-ÖØ-öø-ÿ ]+$/.test(nome_responsavel)) {
			return res.send(`<script>alert("Nome do responsável inválido! Apenas letras e espaços são permitidos."); window.history.back();</script>`);
		}

		// Logradouro: remover caracteres inválidos (apenas letras, números, espaços e acentos)
		rua = rua.replace(/[^A-Za-zÀ-ÖØ-öø-ÿ0-9\s]/g, '');

		// Número do logradouro: apenas números
		numero = numero.replace(/\D/g, '');
		if(numero === '') {
			return res.send(`<script>alert("Número do logradouro inválido! Apenas números são permitidos."); window.history.back();</script>`);
		}
       
        // Declara as variáveis globais para armazenar os respectivos ID
        let idCreasAtual;
        let idCreasOrigem;
        let idDeficiencia;
        let idDistritoServico;
        let idDistritoPessoa;
        let idTipoEscola;
        let idEnsinoModalidade;
        let idCicloEstudo;
        let idParouEstudar;
        let idEstadoCivil;
        let idGenero;
        let idMedidasMse;
        let idMse;
        let idTecRef;
        let idNacionalidade;
        let idOrientacaoSexual;
        let idRaca;
        let idTrabalho;
        let idSas;
        let idServicoFamilia;
        let idAlcoolOuDrogas;
        let idSituacaoProcesso;
        let idVaraDaInfancia;
        let idTipoDeContato;
        let idUbs;
        let idsProgramasSociais = [];

    // Função assíncrona para processar os dados e capturar os IDs
    async function processarDados() {
        try {
			 // Captura todos os IDs
            idCreasOrigem = await IdDescricaoRepository.getIdByDescricao('creas', creas_origem);
            idCreasAtual = await IdDescricaoRepository.getIdByDescricao('creas', creas_atual);
            idDeficiencia = await IdDescricaoRepository.getIdByDescricao('deficiencia', deficiencia);
            idDistritoServico = await IdDescricaoRepository.getIdByDescricao('distrito', distrito_servico);
            idDistritoPessoa = await IdDescricaoRepository.getIdByDescricao('distrito', distrito_pessoa);
            idTipoEscola = await IdDescricaoRepository.getIdByDescricao('tipoescola', tipoEscola);
            idEnsinoModalidade = await IdDescricaoRepository.getIdByDescricao('ensinoModalidade', ensinoModalidade);
            idCicloEstudo = await IdDescricaoRepository.getIdByDescricao('cicloestudo', cicloEstudo);
            idParouEstudar = await IdDescricaoRepository.getIdByDescricao('paroudeestudar', paroudeEstudar);
            idEstadoCivil = await IdDescricaoRepository.getIdByDescricao('estado_civil', estado_civil);
            idGenero = await IdDescricaoRepository.getIdByDescricao('genero', genero);
            idMedidasMse = await IdDescricaoRepository.getIdByDescricao('medidas_mse', medidas_mse);
            idMse = await IdDescricaoRepository.getIdByDescricao('mse', mse);
            idNacionalidade = await IdDescricaoRepository.getIdByDescricao('nacionalidade', nacionalidade);
            idOrientacaoSexual = await IdDescricaoRepository.getIdByDescricao('orientacao_sexual', orientacao_sexual);
            idRaca = await IdDescricaoRepository.getIdByDescricao('raca', raca);
            idTrabalho = await IdDescricaoRepository.getIdByDescricao('trabalho', trabalho);
            idSas = await IdDescricaoRepository.getIdByDescricao('sas', sas);
            idServicoFamilia = await IdDescricaoRepository.getIdByDescricao('servico_familia', servico_familia);
            idAlcoolOuDrogas = await IdDescricaoRepository.getIdByDescricao('alcool_ou_drogas', alcool_ou_drogas);
            idSituacaoProcesso = await IdDescricaoRepository.getIdByDescricao('situacao_do_processo', situacao_do_processo);
            idVaraDaInfancia = await IdDescricaoRepository.getIdByDescricao('vara_da_infancia', vara_da_infancia);
            idTipoDeContato = await IdDescricaoRepository.getIdByDescricao('tipo_de_contato', tipo_de_contato);
            idUbs = await IdDescricaoRepository.getIdByDescricao('ubs', ubs);
			
			// Função para obter o ID baseado na descrição de uma tabela específica
            function getIdByDescricaoTec(nome) {
                return new Promise((resolve, reject) => {
                    const query = `SELECT ID FROM usuarios WHERE nome = ?`;
                    connection.query(query, [nome], (error, results) => {
                        if (error) {
                            return reject(error);
                        }

                        if (results.length > 0) {
                            resolve(results[0].ID);
                        } else {
                            resolve(null);
                        }
                    });
                });
            }
            idTecRef = await getIdByDescricaoTec(tec_ref)

			for (let i = 0; i < programas_sociais.length; i++) {
				if (!programas_sociais[i] || programas_sociais[i] === '') {
					console.log("Nenhum programa social selecionado para a entrada " + (i + 1));
					continue; // Pula para o próximo item se não houver seleção
				}

				let descricao = programas_sociais[i]; // Definindo a variável 'descricao'

				IdDescricaoRepository.getIdByDescricaoCadastro('programas_sociais', descricao, (error, id) => {
					if (error) {
						console.error('Erro ao obter ID do programa social:', error);
						return;
					}
					if (id) {
						idsProgramasSociais.push(id);
					} else {
						console.log(`Programa social não encontrado: ${descricao}`);
					}
				});
			}
			
            if (utils.verificar_campos(gestante) == null) {
                gestante = null
            }
            if (utils.verificar_campos(lactante) == null) {
                lactante = null
            }
            if (utils.verificar_campos(deficiencia) == null) {
                deficiencia = null
            }
            if (utils.verificar_campos(medicamentos) == null) {
                medicamentos = null
            }
            if (utils.verificar_campos(saude) == null) {
                saude = null
            }
            if (utils.verificar_campos(medicamentos_controlados) == null) {
                medicamentos_controlados = null
            }
            if (utils.verificar_campos(saude_mental) == null) {
                saude_mental = null
            }
            if (utils.verificar_campos(acompanhamento_saude) == null) {
                acompanhamento_saude = null
            }
            if (utils.verificar_campos(numeroRa) == null) {
                numeroRa = null
            }
            if (utils.verificar_campos(tipoEscola) == null) {
                tipoEscola = null
            }
            if (utils.verificar_campos(ensinoModalidade) == null) {
                ensinoModalidade = null
            }
            if (utils.verificar_campos(cicloEstudo) == null) {
                cicloEstudo = null
            }
            if (utils.verificar_campos(frequenciaAula) == null) {
                frequenciaAula = null
            }
            if (utils.verificar_campos(concluiuCurso) == null) {
                concluiuCurso = null
            }
            if (utils.verificar_campos(paroudeEstudar) == null) {
                paroudeEstudar = null
            }
            if (utils.verificar_campos(cpf) == null) {
                cpf = null
            }
            if (utils.verificar_campos(orientacao_sexual) == null) {
                orientacao_sexual = null
            }
            if (utils.verificar_campos(genero) == null) {
                genero = null
            }
            if (utils.verificar_campos(idCreasOrigem) == null) {
                creas_origem = null
            }
            if (utils.verificar_campos(nome_social) == null) {
                nome_social = null
            }
            if (utils.verificar_campos(nis) == null) {
                nis = null
            }
            if (utils.verificar_campos(cartao_sus) == null) {
                cartao_sus = null
            }
            if (utils.verificar_campos(nome_do_pai) == null) {
                nome_do_pai = null
            }
            if (utils.verificar_campos(vara_da_infancia) == null) {
                vara_da_infancia = null
            }
            if (utils.verificar_campos(complemento) == null) {
                complemento = null
            }
            if (utils.verificar_campos(trabalho) == null) {
                trabalho = null
            }
            if (utils.verificar_campos(programas_sociais) == null) {
                programas_sociais = null
            }
            if (utils.verificar_campos(servico_familia) == null) {
                servico_familia = null
            }
            if (utils.verificar_campos(caps) == null) {
                caps = null
            }
            if (utils.verificar_campos(curso) == null) {
                curso = null
            }
            if (utils.verificar_campos(ubs) == null) {
                ubs = null
            }
 	       if (utils.verificar_campos(n_pt) == null) {
                n_pt = null
            }
                     
            // Todos os IDs foram capturados, agora execute o código de atualização
            atualizarDadosPessoa();

           res.status(200).json({ message: 'Sucesso.' });

        } catch (error) {

            console.error('Erro ao capturar um dos IDs:', error);
        }
    }

    function atualizarDadosPessoa() {
                        
                        // Atualização dos dados do usuário
                        connection.query(`UPDATE pessoas SET 
                            ID = ? , 
                            fk_creas_atual = ? , 
                            fk_mse = ? ,
                            fk_tec_ref = ?, 
                            fk_sas = ? , 
                            fk_servico_familia = ?,
                            fk_distrito_servico = ? , 
                            fk_creas_origem = ? , 
                            nome = ? , 
                            nome_social = ? , 
                            dt_nasc = ? ,
                            cpf = ? , 
                            nis = ? ,
                            cartao_sus = ?,
                            nome_da_mae = ? , 
                            nome_do_pai = ? , 
                            nome_responsavel = ?,
                            sexo = ? , 
                            fk_raca = ? , 
                            fk_nacionalidade = ? , 
                            fk_genero = ? , 
                            fk_orientacao_sexual = ? , 
                            fk_estado_civil = ? , 
                            matriculado = ?,
                            alfabetizado = ?,
                            fk_cicloEstudo = ?,
                            numeroRa = ?,
                            fk_tipoEscola = ?,
                            fk_ensinoModalidade = ?,
                            frequenciaAula = ?,
                            concluiuCurso = ?,
                            fk_paroudeEstudar = ?,
                            possui_deficiencia = ?, 
                            fk_deficiencia = ? , 
                            fk_trabalho = ? , 
                            necessita_cuidados_terceiros = ? ,
                            possui_demanda_saude = ?,
                            saude = ?,
                            possui_demanda_saude_mental = ?,
                            saude_mental = ?,
                            acompanhamento_saude = ?, 
                            faz_uso_de_medicamentos = ? , 
                            medicamentos = ?,
                            faz_uso_de_medicamentos_controlados = ? , 
                            medicamentos_controlados = ?,
                            possui_trabalho = ? , 
                            possui_familia_em_servico = ? , 
                            gestante = ? , 
                            parceira_gestante = ?, 
                            lactante = ? , 
                            possui_filhos = ? , 
                            responsavel_por_pcd = ? , 
                            adolescente_com_trajetoria_de_acolhimento = ? , 
                            fk_alcool_ou_drogas = ? ,  
                            caps = ? ,
                            curso = ? ,
                            fk_distrito_pessoa = ? , 
                            fk_ubs = ?,
                            cep = ? , 
                            bairro = ? , 
                            rua = ? , 
                            numero = ? , 
                            complemento = ? , 
                            ativo_inativo = ? , 
                            fk_medidas = ?,
                            dt_cadastro = ? , 
                            dt_atualizacao = ?,
                            dt_desligamento = ?,
                            listar_cursos = ?
                            WHERE ID = ?;
                            `, [ID, 
                                idCreasAtual, 
                                idMse, 
                                idTecRef,
                                idSas, 
                                idServicoFamilia,
                                idDistritoServico, 
                                idCreasOrigem, 
                                nome, 
                                nome_social, 
                                dt_nasc, 
                                cpf, 
                                nis, 
                                cartao_sus,
                                nome_da_mae, 
                                nome_do_pai, 
                                nome_responsavel, 
                                sexo, 
                                idRaca,  
                                idNacionalidade, 
                                idGenero, 
                                idOrientacaoSexual, 
                                idEstadoCivil, 
                                matriculado,
                                alfabetizado,
                                idCicloEstudo,
                                numeroRa,
                                idTipoEscola,
                                idEnsinoModalidade, 
                                frequenciaAula,
                                concluiuCurso,
                                idParouEstudar,
                                possui_deficiencia, 
                                idDeficiencia, 
                                idTrabalho, 
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
                                possui_familia_em_servico, 
                                gestante, 
                                parceira_gestante, 
                                lactante, 
                                possui_filhos, 
                                responsavel_por_pcd, 
                                adolescente_com_trajetoria_de_acolhimento, 
                                idAlcoolOuDrogas,  
                                caps,
                                curso,
                                idDistritoPessoa, 
                                idUbs,
                                cep, 
                                bairro, 
                                rua, 
                                numero, 
                                complemento,  
                                ativo_inativo, 
                                idMedidasMse, 
                                dt_cadastro, 
                                dt_atualizacao, 
                                dt_desligamento,
                                listar_cursos,
                                ID], 
                                (errorUpdate, resultsUpdate, fieldsUpdate) => {
                                if (errorUpdate) {
                                    console.error('Erro ao atualizar dados da pessoa:', errorUpdate);
                                    res.status(500).send('Erro ao atualizar dados da pessoa.');
                                    return;
                                }
                                
                                // Atualização dos dados do processo
                                connection.query(`UPDATE processos SET
                                n_processo = ? , 
                                n_processo_apuracao = ?,
                                n_pt = ?, 
                                fk_vara_da_infancia = ? , 
                                resumo_do_caso = ? , 
                                fk_situacao = ?,
                                dt_interpretacao_medida = ? , 
                                dt_ultimo_relatorio_enviado = ? 
                                WHERE ID = (
                                            SELECT fk_processos
                                            FROM pessoas
                                            WHERE ID = ?);`,   
                                                [n_processo, 
                                                n_processo_apuracao, 
                                                n_pt, 
                                                idVaraDaInfancia,  
                                                resumo_do_caso, 
                                                idSituacaoProcesso, 
                                                dt_interpretacao_medida, 
                                                dt_ultimo_relatorio_enviado, 
                                                ID], 
                                    (errorUpdate, resultsUpdate, fieldsUpdate) => {
                                    if (errorUpdate) {
                                        console.error('Erro ao atualizar os processos:', errorUpdate);
                                        res.status(500).send('Erro ao atualizar os processos.');
                                        return;
                                    }
									
                                    // console.log("CEP recebido:", req.body.cep_unidade);
                                    // console.log(cep_unidade)
                                    

                                    
									// ATUALIZAÇÃO DIRETA DOS CAMPOS DA UNIDADE ACOLHEDORA
									connection.query(`UPDATE unidade_acolhedora UA
										INNER JOIN adolescente_unidade_acolhedora AUA ON AUA.fk_unidade_acolhedora = UA.id
										SET
											UA.tipo_local = ?,
											UA.nome = ?,
											UA.cep_unidade = ?,
											UA.tipo_logradouro = ?,
											UA.logradouro_unidade = ?,
											UA.numero = ?,
											UA.complemento = ?,
											UA.bairro = ?,
											UA.telefone = ?,
											UA.horario_inicio_unidade = ?,
											UA.horario_fim_unidade = ?,
											UA.dias_semana = ?,
											UA.responsavel_unidade = ?,
											UA.atividade_unidade = ?
										WHERE AUA.fk_pessoa = ?`,
										[
											tipo_local,
											nome_unidade,
											cep_unidade,
											tipo_logradouro,
											logradouro_unidade,
											numero_unidade,
											complemento_unidade,
											bairro_unidade,
											telefone_unidade,
											horario_inicio_unidade,
											horario_fim_unidade,
											dias_semana,
											responsavel_unidade,
											atividade_unidade,
											ID
										],
										(errorUA, result) => {
											if (errorUA) {
												console.error('Erro ao atualizar unidade acolhedora:', errorUA);
											} else {
												console.log('Rows afetadas:', result.affectedRows);
											}
										}

									);
      
                                    // Atualização dos dados do contato
                                    connection.query(`UPDATE contatos C
                                    INNER JOIN contatos_pessoas CP ON CP.fk_id_contatos = C.ID
                                    SET
                                    C.telefone = ?,
                                    C.nome = ?,
                                    C.email = ?
                                    WHERE
                                    CP.fk_id_pessoas = ?
                                    AND C.ID = ?;`, 
                                        [telefone, 
                                        nome_do_contato, 
                                        email, 
                                        ID, 
                                        ID_contatos], 
                                        (errorUpdate, resultsUpdate, fieldsUpdate) => {
                                        if (errorUpdate) {
                                            console.error('Erro ao atualizar dados do processo:', errorUpdate);
                                            res.status(500).send('Erro ao atualizar dados da pessoa.');
                                            return;
                                        }
        
                                        // Atualização dos dados do processo
                                        connection.query(`UPDATE contatos_pessoas CP
                                        SET CP.fk_tipo_de_contato = ?
                                        WHERE
                                        CP.fk_id_pessoas = ?
                                        AND CP.fk_id_contatos = ?;`, 
                                            [idTipoDeContato, 
                                            ID, 
                                            ID_contatos], 
                                            (errorUpdate, resultsUpdate, fieldsUpdate) => {
                                            if (errorUpdate) {
                                                console.error('Erro ao atualizar dados do contato:', errorUpdate);
                                                res.status(500).send('Erro ao atualizar dados do contato.');
                                                return;
                                            }
                                    if (programas_sociais && programas_sociais.length > 0) {

										connection.query(`
											DELETE FROM programas_sociais_pessoas
											WHERE fk_id_pessoa = ?;`,
											[ID],
											(error) => {

												if (error) {
													console.error(`Erro ao deletar programas sociais`, error);
												} else {

													for (let i = 0; i < idsProgramasSociais.length; i++) {
														let programaSocialId = idsProgramasSociais[i];

														if (programaSocialId) {
															connection.query(`
																INSERT IGNORE INTO programas_sociais_pessoas
																(fk_id_pessoa, fk_programa_social_id)
																VALUES (?, ?)`,
																[ID, programaSocialId]
															);
														}
													}
												}
											}
										);

									} else {
										console.log("Nenhum programa social enviado, mantendo os existentes.");
									}

                                    });
                                });
                            });
                        });
	}


    processarDados()

        });
    }

// Exporta a função de configuração das rotas
module.exports = rota_adminEditaPessoa;