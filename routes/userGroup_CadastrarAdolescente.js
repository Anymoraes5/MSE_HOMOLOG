/*-configurações padrões---------------------------------------------------------------------------------------------*/

//Importa o módulo fs e path para lidar com arquivos e caminhos
let fs = require('fs');
let path = require('path');
let IdDescricaoRepository = require('../repository/IdDescricaoRepository');
let utils = require('../utils/validacoes');

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

        // Extrair ano, mês e dia
        let ano = dataAtual.getFullYear();
        let mes = String(dataAtual.getMonth() + 1).padStart(2, '0'); // adiciona um zero à esquerda se for necessário
        let dia = String(dataAtual.getDate()).padStart(2, '0'); // adiciona um zero à esquerda se for necessário

        // Montar a data no formato desejado (aaaa-mm-dd)
        let dt_atualizacao = `${ano}-${mes}-${dia}`;
        let dt_cadastro = `${ano}-${mes}-${dia}`;

        let cpf = req.body.cpf.replace(/[.-]/g, '');

        let cpfValido = utils.validarCPF(cpf);
        if (!cpfValido.valido) {
            return res.status(500).send('<script>alert("cpf inválido");window.location.href = "/cadastroPessoas";</script>');
        } else {
            console.log("CPF válido:", cpfValido.cpf);
            cpf = cpfValido.cpf;
        }

        // let nis = req.body.nis.replace(/[.-]/g, '');
        let cartao_sus = req.body.cartao_sus.replace(/[.-]/g, '');
        let cep = req.body.cep.replace(/-/g, "")
        let telefone = req.body.telefone.replace(/\D/g, '')

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
            ativo_inativo,    //: ativo_inativo, 
            creas_atual,    //: creas_atual, 
            mse,    //: mse, 
            tec_ref,    //: tec_ref,
            ubs,    //: ubs, 
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
            ensinoModalidade, //: ensinoModalidade,
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
            bairro,    //: bairro, 
            rua,    //: rua, 
            numero,    //: numero, 
            complemento,    //: complemento, 
            tipo_de_contato,    //: tipo_de_contato, 
            nome_do_contato,    //: nome_do_contato, 
            email,    //: email 
        } = req.body;

        var dt_desligamento
        if (ativo_inativo == 0){
            dt_desligamento = `${ano}-${mes}-${dia}`;
        } else {
            dt_desligamento = null
        }
		
		// remove qualquer coisa que não seja número do CEP
		const cep_unidade_limpo = cep_unidade
			? cep_unidade.replace(/\D/g, '')
			: null;
		
		// transforma array de dias em string
		const dias_semana = Array.isArray(dias) ? dias.join(',') : null;

       /* let dt_desligamento
        if (ativo_inativo == 0){
            dt_desligamento = `${ano}-${mes}-${dia}`;
        } else {
            dt_desligamento = null
        }*/
		
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

		// ===============================
		// VALIDAÇÃO DO TIPO DE LOGRADOURO
		// ===============================
		const tiposLogradouroValidos = [
			"Acesso",
			"Alameda",
			"Avenida",
			"Beco",
			"Caminho",
			"Caminho particular",
			"Caminho de pedestre",
			"Complexo viário",
			"Espaço livre",
			"Esplanada",
			"Estrada",
			"Escadaria",
			"Estrada particular",
			"Estacionamento",
			"Galeria",
			"Jardim",
			"Ladeira",
			"Largo",
			"Passarela",
			"Praça",
			"Praça de retorno",
			"Passagem de pedestres",
			"Parque",
			"Passagem",
			"Passagem particular",
			"Passagem subterrânea",
			"Pátio",
			"Ponte",
			"Pontilhão",
			"Rua",
			"Rua particular",
			"Rua projetada",
			"Rodovia",
			"Servidão",
			"Túnel",
			"Travessa projetada",
			"Travessa",
			"Travessa particular",
			"Via de circulação de pedestres",
			"Viaduto",
			"Viela",
			"Via elevada",
			"Viela particular",
			"Vereda",
			"Viela sanitária",
			"Via",
			"Vila",
			"Vila particular",
			"Via de pedestre"

		];

		// só valida se tiver valor
		if (tipo_logradouro && !tiposLogradouroValidos.includes(tipo_logradouro)) {
			return res.send(`
				<script>
					alert("Tipo de logradouro inválido D.");
					window.history.back();
				</script>
			`);
		}

        // Declara as variáveis globais para armazenar os respectivos ID
        let idCreasAtual;
        let idCreasOrigem;
        let idDeficiencia;
        let idDistritoServico;
        let idUbs;
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
        let idsProgramasSociais = [];

        // Consulta para obter o ID do Creas atual
        IdDescricaoRepository.getIdByDescricaoCadastro('creas', creas_atual, (error, id) => {
            if (error) {
                console.error('Erro ao obter ID do creas atual:', error);
                return;
            }
            if (id) {
                idCreasAtual = id; // Armazena o ID na variável global
            } else {
                console.log(`Creas não encontrado: ${creas_atual}`);
            }
        });

        // Consulta para obter o ID do Creas de origem
        IdDescricaoRepository.getIdByDescricaoCadastro('creas', creas_origem, (error, id) => {
            if (error) {
                console.error('Erro ao obter ID do creas atual:', error);
                return;
            }
            if (id) {
                idCreasOrigem = id; // Armazena o ID na variável global
            } else {
                console.log(`Creas não encontrado: ${creas_origem}`);
            }
        });

        // Consulta para obter a ID da deficiência

        if (utils.verificar_campos(deficiencia) == null) {
            idDeficiencia = null

        } else {

            IdDescricaoRepository.getIdByDescricaoCadastro('deficiencia', deficiencia, (error, id) => {
                if (error) {
                    console.error('Erro ao obter ID da deficiência:', error);
                    return;
                }
                if (id) {
                    idDeficiencia = id; // Armazena o ID na variável global
                } else {
                    console.log(`Deficiencia não encontrada: ${deficiencia}`);
                }
            });

        }

        // Consulta para obter o ID do distrito de serviço
        IdDescricaoRepository.getIdByDescricaoCadastro('distrito', distrito_servico, (error, id) => {
            if (error) {
                console.error('Erro ao buscar ID do distrito do serviço:', error);
                return;
            }
            if (id) {
                idDistritoServico = id; // Armazena o ID na variável global
            } else {
                console.log(`Distrito não encontrado: ${distrito_servico}`);
            }
        });

        // Consulta para obter o ID do ubs
        IdDescricaoRepository.getIdByDescricaoCadastro('ubs', ubs, (error, id) => {
            if (error) {
                console.error('Erro ao buscar ID do Ubs:', error);
                return;
            }
            if (id) {
                idUbs = id; // Armazena o ID na variável global
            } else {
                console.log(`UBS não encontrado: ${ubs}`);
            }
        });

        // Consulta para obter o ID do distrito da pessoa
        IdDescricaoRepository.getIdByDescricaoCadastro('distrito', distrito_pessoa, (error, id) => {
            if (error) {
                console.error('Erro ao buscar ID do distrito da pessoa:', error);
                return;
            }
            if (id) {
                idDistritoPessoa = id; // Armazena o ID na variável global
            } else {
                console.log(`Distrito não encontrado: ${distrito_pessoa}`);
            }
        });

        // Consulta para obter o ID do Tipo Escola
        if (utils.verificar_campos(tipoEscola) == null) {
            idTipoEscola = null
        } else {

            IdDescricaoRepository.getIdByDescricaoCadastro('tipoEscola', tipoEscola, (error, id) => {
                if (error) {
                    console.error('Erro ao buscar ID do Tipo Escola:', error);
                    return;
                }
                if (id) {
                    idTipoEscola = id; // Armazena o ID na variável global
                } else {
                    console.log(`Tipo escola não encontrado: ${tipoEscola}`);
                }
            });

        }

        // Consulta para obter o ID do Ensino Modalidade
        if (utils.verificar_campos(ensinoModalidade) == null) {
            idEnsinoModalidade = null
        } else {

            IdDescricaoRepository.getIdByDescricaoCadastro('ensinoModalidade', ensinoModalidade, (error, id) => {
                if (error) {
                    console.error('Erro ao buscar ID do ensinoModalidade:', error);
                    return;
                }
                if (id) {
                    idEnsinoModalidade = id; // Armazena o ID na variável global
                } else {
                    console.log(`EnsinoModalidade não encontrado: ${ensinoModalidade}`);
                }
            });
        }

        if (utils.verificar_campos(cicloEstudo) == null) {
            idCicloEstudo = null

        } else {

        // Consulta para obter o ID do ciclo estudo
        IdDescricaoRepository.getIdByDescricaoCadastro('cicloEstudo', cicloEstudo, (error, id) => {
            if (error) {
                console.error('Erro ao buscar ID do ciclo estudo:', error);
                return;
            }
            if (id) {
                idCicloEstudo = id; // Armazena o ID na variável global
            } else {
                console.log(`Ciclo estudo não encontrado: ${cicloEstudo}`);
            }
        });

        }

        // Consulta para obter o ID do Parou de Estudar
        if (utils.verificar_campos(paroudeEstudar) == null) {
            idParouEstudar = null

        } else {

            IdDescricaoRepository.getIdByDescricaoCadastro('paroudeEstudar', paroudeEstudar, (error, id) => {
                if (error) {
                    console.error('Erro ao buscar ID Parou de Estudar:', error);
                    return;
                }
                if (id) {
                    idParouEstudar = id; // Armazena o ID na variável global
                } else {
                    console.log(`Parou de Estudar não encontrado: ${paroudeEstudar}`);
                }
            });

        }

        // Consulta para obter o ID do estado civil
        IdDescricaoRepository.getIdByDescricaoCadastro('estado_civil', estado_civil, (error, id) => {
            if (error) {
                console.error('Erro ao buscar ID estado civil:', error);
                return;
            }
            if (id) {
                idEstadoCivil = id; // Armazena o ID na variável global
            } else {
                console.log(`Estado civil não encontrado: ${estado_civil}`);
            }
        });

        // Consulta para obter o ID do gênero
        IdDescricaoRepository.getIdByDescricaoCadastro('genero', genero, (error, id) => {
            if (error) {
                console.error('Erro ao buscar ID do gênero:', error);
                return;
            }
            if (id) {
                idGenero = id; // Armazena o ID na variável global
            } else {
                console.log(`Gênero não encontrado: ${genero}`);
            }
        });

        // Consulta para obter o ID das medidas MSE
        IdDescricaoRepository.getIdByDescricaoCadastro('medidas_mse', medidas_mse, (error, id) => {
            if (error) {
                console.error('Erro ao buscar ID das medidas MSE:', error);
                return;
            }
            if (id) {
                idMedidasMse = id; // Armazena o ID na variável global
            } else {
                console.log(`Medidas MSE não encontrado: ${medidas_mse}`);
            }
        });

        // Consulta para obter o ID do MSE
        IdDescricaoRepository.getIdByDescricaoCadastro('mse', mse, (error, id) => {
            if (error) {
                console.error('Erro ao buscar ID do MSE:', error);
                return;
            }
            if (id) {
                idMse = id; // Armazena o ID na variável global
            } else {
                console.log(`MSE não encontrado: ${mse}`);
            }
        });

         // Defina a função de callback para tratar o resultado da consulta
         function handleQueryResult(error, result) {
            if (error) {
                console.error('Erro na consulta:', error);
                return;
            }
            if (result !== null) {
                idTecRef = result; // Armazena o ID na variável
                console.log('ID encontrado e armazenado em idTecRef:', idTecRef);
            } else {
                console.log('Nenhum ID encontrado');
            }
        }

        // Defina e execute a consulta
        const query = `SELECT ID FROM usuarios WHERE nome = ?`;

        connection.query(query, [tec_ref], (error, results) => {
            if (error) {
                console.error('Erro ao executar a consulta:', error); // Log adicional para o erro
                handleQueryResult(error, null);
            } else {
                console.log('Resultados da consulta:', results); // Verifica os resultados retornados
                const id = results.length > 0 ? results[0].ID : null;
                handleQueryResult(null, id); // Passa o ID para a função de callback
            }
        });

        // Consulta para obter o ID da nacionalidade
        IdDescricaoRepository.getIdByDescricaoCadastro('nacionalidade', nacionalidade, (error, id) => {
            if (error) {
                console.error('Erro ao buscar ID da nacionalidade:', error);
                return;
            }
            if (id) {
                idNacionalidade = id; // Armazena o ID na variável global
            } else {
                console.log(`Nacionalidade não encontrada: ${nacionalidade}`);
            }
        });

        // Consulta para obter o ID da orientação sexual
        IdDescricaoRepository.getIdByDescricaoCadastro('orientacao_sexual', orientacao_sexual, (error, id) => {
            if (error) {
                console.error('Erro ao buscar ID da orientação sexual:', error);
                return;
            }
            if (id) {
                idOrientacaoSexual = id; // Armazena o ID na variável global
            } else {
                console.log(`Orientação sexual não encontrada: ${orientacao_sexual}`);
            }
        });

        // Consulta para obter o ID da orientação sexual
        IdDescricaoRepository.getIdByDescricaoCadastro('orientacao_sexual', orientacao_sexual, (error, id) => {
            if (error) {
                console.error('Erro ao buscar ID da orientação sexual:', error);
                return;
            }
            if (id) {
                idOrientacaoSexual = id; // Armazena o ID na variável global
            } else {
                console.log(`Orientação sexual não encontrada: ${orientacao_sexual}`);
            }
        });

        // Consulta para obter o ID da raça
        IdDescricaoRepository.getIdByDescricaoCadastro('raca', raca, (error, id) => {
            if (error) {
                console.error('Erro ao buscar ID da raça:', error);
                return;
            }
            if (id) {
                idRaca = id; // Armazena o ID na variável global
            } else {
                console.log(`Raça não encontrada: ${raca}`);
            }
        });

        // Consulta para obter o ID da religião
        IdDescricaoRepository.getIdByDescricaoCadastro('trabalho', trabalho, (error, id) => {
            if (error) {
                console.error('Erro ao buscar ID da raça:', error);
                return;
            }
            if (id) {
                idTrabalho = id; // Armazena o ID na variável global
            } else {
                console.log(`Religião não encontrada: ${trabalho}`);
            }
        });

        // Consulta para obter o ID da SAS
        IdDescricaoRepository.getIdByDescricaoCadastro('sas', sas, (error, id) => {
            if (error) {
                console.error('Erro ao buscar ID da SAS:', error);
                return;
            }
            if (id) {
                idSas = id; // Armazena o ID na variável global
            } else {
                console.log(`SAS não encontrada: ${sas}`);
            }
        });

        // Consulta para obter o ID da ServicoFamilia
        IdDescricaoRepository.getIdByDescricaoCadastro('servico_familia', servico_familia, (error, id) => {
            if (error) {
                console.error('Erro ao buscar ID da Servico_familia:', error);
                return;
            }
            if (id) {
                idServicoFamilia = id; // Armazena o ID na variável global
            } else {
                console.log(`Servico Familia não encontrada: ${servico_familia}`);
            }
        });

        // Consulta para obter o ID de alcool ou drogas
        IdDescricaoRepository.getIdByDescricaoCadastro('alcool_ou_drogas', alcool_ou_drogas, (error, id) => {
            if (error) {
                console.error('Erro ao buscar ID de alcool ou drogas:', error);
                return;
            }
            if (id) {
                idAlcoolOuDrogas = id; // Armazena o ID na variável global
            } else {
                console.log(`Opcao Alcool ou drogas não encontrada: ${alcool_ou_drogas}`);
            }
        });

        // Consulta para obter o ID da situação do processo
        IdDescricaoRepository.getIdByDescricaoCadastro('situacao_do_processo', situacao_do_processo, (error, id) => {
            if (error) {
                console.error('Erro ao buscar ID da situação do processo:', error);
                return;
            }
            if (id) {
                idSituacaoProcesso = id; // Armazena o ID na variável global
            } else {
                console.log(`Situação do processo não encontrada: ${situacao_do_processo}`);
            }
        });

        // Consulta para obter o ID da vara da infancia
        IdDescricaoRepository.getIdByDescricaoCadastro('vara_da_infancia', vara_da_infancia, (error, id) => {
            if (error) {
                console.error('Erro ao buscar ID da vara da infancia:', error);
                return;
            }
            if (id) {
                idVaraDaInfancia = id; // Armazena o ID na variável global
            } else {
                console.log(`Vara da infancia não encontrada: ${vara_da_infancia}`);
            }
        });

        // Consulta para obter o ID do tipo de contato
        IdDescricaoRepository.getIdByDescricaoCadastro('tipo_de_contato', tipo_de_contato, (error, id) => {
            if (error) {
                console.error('Erro ao buscar ID do tipo de contato:', error);
                return;
            }
            if (id) {
                idTipoDeContato = id; // Armazena o ID na variável global
            } else {
                console.log(`Tipo de contato não encontrado: ${tipo_de_contato}`);
            }
        });

        // alteração realizada para caso o usuário inclua um container mas não selecione uma opção o sistema ignore.
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
        if (utils.verificar_campos(creas_origem) == null) {
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

        connection.beginTransaction(function(err){
            if (err) {
                throw err;
            }
            // Realiza a inserção na tabela processos

            connection.query(`
                INSERT INTO processos
                    (n_processo, 
                    n_processo_apuracao, 
                    n_pt, 
                    fk_vara_da_infancia, 
                    resumo_do_caso, 
                    fk_situacao, 
                    dt_interpretacao_medida, 
                    dt_ultimo_relatorio_enviado) 
                VALUES (
                    ?, /* n_processo */
                    ?, /* n_processo_apuracao */
                    ?, /* n_pt */
                    ?, /* fk_vara_da_infancia */
                    ?, /* resumo_do_caso */
                    ?, /* fk_situacao */
                    ?, /* dt_interpretacao_medida */
                    ?  /* dt_ultimo_relatorio_enviado */
                )`,
                [
                    n_processo, 
                    n_processo_apuracao, 
                    n_pt, 
                    idVaraDaInfancia, 
                    resumo_do_caso, 
                    idSituacaoProcesso, 
                    dt_interpretacao_medida, 
                    dt_ultimo_relatorio_enviado
                ],
                (errorUpdate, resultsResults, fieldsUpdate) => {
                    if (errorUpdate) {
                        console.error('Erro ao atualizar dados do processo:', errorUpdate);
                        return res.status(500).send('<script>alert("erro de processo duplicado"); window.location.href = "/home";</script>');
                    }

                let novoIDProcesso = resultsResults.insertId;

            // Realiza a inserção na tabela pessoas

            connection.query(`
                INSERT INTO pessoas  
                    (fk_processos,
                    fk_creas_atual, 
                    fk_mse, 
                    fk_tec_ref,
                    fk_sas, 
                    fk_servico_familia,
                    fk_distrito_servico,
                    fk_ubs, 
                    fk_creas_origem, 
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
                    fk_raca, 
                    fk_nacionalidade, 
                    fk_genero, 
                    fk_orientacao_sexual, 
                    fk_estado_civil, 
                    matriculado, 
                    alfabetizado, 
                    fk_cicloEstudo, 
                    numeroRa, 
                    fk_tipoEscola, 
                    fk_ensinoModalidade,
                    frequenciaAula, 
                    concluiuCurso, 
                    fk_paroudeEstudar, 
                    possui_deficiencia, 
                    fk_deficiencia, 
                    fk_trabalho, 
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
                    fk_alcool_ou_drogas,  
                    caps,
                    curso,
                    fk_distrito_pessoa, 
                    cep, 
                    bairro, 
                    rua, 
                    numero, 
                    complemento, 
                    ativo_inativo, 
                    fk_medidas,
                    dt_cadastro, 
                    dt_atualizacao,
                    dt_desligamento,
                    listar_cursos) 
                VALUES (
                    ?, /* fk_processos */
                    ?, /* fk_creas_atual */
                    ?, /* fk_mse */
                    ?, /* fk_tec_ref */
                    ?, /* fk_sas */
                    ?, /* fk_servico_familia */
                    ?, /* fk_distrito_servico */
                    ?, /* fk_ubs */
                    ?, /* fk_creas_origem */
                    ?, /* nome */
                    ?, /* nome_social */
                    ?, /* dt_nasc */
                    ?, /* cpf */
                    ?, /* nis */
                    ?, /* cartao_sus */
                    ?, /* nome_da_mae */
                    ?, /* nome_do_pai */
                    ?, /* nome_responsavel */
                    ?, /* sexo */
                    ?, /* fk_raca */
                    ?, /* fk_nacionalidade */
                    ?, /* fk_genero */
                    ?, /* fk_orientacao_sexual */
                    ?, /* fk_estado_civil */
                    ?, /* matriculado */
                    ?, /* alfabetizado */
                    ?, /* fk_cicloEstudo */
                    ?, /* numeroRa */
                    ?, /* fk_tipoEscola */
                    ?, /* ensinoModalidade */
                    ?, /* frequenciaAula */
                    ?, /* concluiuCurso */
                    ?, /* fk_paroudeEstudar */
                    ?, /* possui_deficiencia */
                    ?, /* fk_deficiencia */
                    ?, /* fk_trabalho */
                    ?, /* necessita_cuidados_terceiros */
                    ?, /* possui_demanda_saude */
                    ?, /* saude */
                    ?, /* possui_demanda_saude_mental */
                    ?, /* saude_mental */
                    ?, /* acompanhamento_saude */
                    ?, /* faz_uso_de_medicamentos */
                    ?, /* medicamentos */
                    ?, /* faz_uso_de_medicamentos_controlados */
                    ?, /* medicamentos_controlados */
                    ?, /* possui_trabalho */
                    ?, /* possui_familia_em_servico */
                    ?, /* gestante */
                    ?, /* parceira_gestante */
                    ?, /* lactante */
                    ?, /* possui_filhos */
                    ?, /* responsavel_por_pcd */
                    ?, /* adolescente_com_trajetoria_de_acolhimento */
                    ?, /* fk_alcool_ou_drogas */
                    ?, /* caps */
                    ?, /* curso */
                    ?, /* fk_distrito_pessoa */
                    ?, /* cep */
                    ?, /* bairro */
                    ?, /* rua */
                    ?, /* numero */
                    ?, /* complemento */
                    ?, /* ativo_inativo */
                    ?, /* fk_medidas */
                    ?, /* dt_cadastro */
                    ?, /* dt_atualizacao */
                    ?, /* dt_desligamento */
                    ?  /* listar_cursos */
                )`, 
                [
                    novoIDProcesso, 
                    idCreasAtual, 
                    idMse, 
                    idTecRef,
                    idSas, 
                    idServicoFamilia,
                    idDistritoServico, 
                    idUbs,
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
                    listar_cursos
                ], 
                (errorUpdate, resultsUpdate, fieldsUpdate) => {
                    if (errorUpdate) {
                        console.error('Erro ao inserir dados da pessoa:', errorUpdate);
                        return res.status(400).send('<script>alert("erro de processo duplicado"); window.location.href = "/home";</script>');
                    }

                let novoIDPessoa = resultsUpdate.insertId;

                // Realizando a inserção na tabela programas sociais pessoas
			
                for (let i = 0; i < programas_sociais.length; i++) {

                    if (programas_sociais[i] == '') {
                        console.log("************************************************************************")
                        console.log("Não foram enviados programas sociais no formulário.")
                        console.log("PARTE DO INSERT")
        
                    } else {

                        for (let i = 0; i < idsProgramasSociais.length; i++) {
                            connection.query(`
                                INSERT IGNORE INTO programas_sociais_pessoas (fk_id_pessoa, fk_programa_social_id)
                                VALUES (?, ?)`,
                                [novoIDPessoa, idsProgramasSociais[i]],
                                (error) => {
                                    if (error) {
                                        console.error(`Erro ao inserir programa social ID ${idsProgramasSociais[i]} para a pessoa ${novoIDPessoa}:`, error);
                                    } else {
                                        console.log(`Programa social ID ${idsProgramasSociais[i]} inserido com sucesso para a pessoa ${novoIDPessoa}.`);
                                    }
                                }
                            );
                        }
                    }
                }
				
                
                // Inserção de novos dados de contato
                connection.query(`INSERT INTO contatos (telefone, nome, email) VALUES (?, ?, ?);`, [telefone, nome_do_contato, email], (errorInsert, resultsInsert, fieldsInsert) => {
                    if (errorInsert) {
						return connection.rollback(() => {
							console.error('Erro ao inserir dados de contato:', errorInsert);
							res.status(500).send('Erro ao inserir dados de contato.');
						});
					}

                    
                    // Obter o ID do novo contato inserido
                    let novoIDContato = resultsInsert.insertId;

                    // Inserção de nova relação entre contato e pessoa
                    connection.query(`INSERT INTO contatos_pessoas (fk_id_contatos, fk_id_pessoas, fk_tipo_de_contato) VALUES (?, ?, ?);`, [novoIDContato, novoIDPessoa, idTipoDeContato], (errorInsertRel, resultsInsertRel, fieldsInsertRel) => {
                        if (errorInsertRel) {
							return connection.rollback(() => {
								console.error('Erro ao inserir relação entre contato e pessoa:', errorInsertRel);
								res.status(500).send('Erro ao inserir relação entre contato e pessoa.');
							});
						}

                     
                    });
                });
				
				const sqlUnidade = `
				INSERT INTO unidade_acolhedora (
					nome,
					tipo_local,
					atividade,
					tipo_logradouro,
					logradouro_unidade,
					numero,
					complemento,
					bairro,
					cep,
					telefone,
					responsavel,
					horario_inicio,
					horario_fim,
					dias_semana,
					horas_psc,
					ativo_inativo
				) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`;

				
				  connection.query(
				  sqlUnidade,
				  [
					nome_unidade,
					tipo_local,
					atividade_unidade,
					tipo_logradouro,
					logradouro_unidade,
					numero_unidade,
					complemento_unidade,
					bairro_unidade,
					cep_unidade_limpo,
					telefone_unidade,
					responsavel_unidade,
					horario_inicio_unidade,
					horario_fim_unidade,
					dias_semana,
					horas_psc,
					1
				  ],
				  (err, resultUnidade) => {
					if (err) {
					  return connection.rollback(() => {
						console.error('Erro ao inserir unidade acolhedora:', err);
						res.status(500).send('Erro ao salvar unidade acolhedora');
					  });
					}

					const idUnidadeAcolhedora = resultUnidade.insertId;
					console.log('Unidade acolhedora criada ID:', idUnidadeAcolhedora);

					const sqlVinculo = `
					  INSERT INTO adolescente_unidade_acolhedora (
						fk_pessoa,
						fk_unidade_acolhedora
					  ) VALUES (?, ?)
					`;

					connection.query(
					  sqlVinculo,
					  [novoIDPessoa, idUnidadeAcolhedora],
					  (err) => {
						if (err) {
						  return connection.rollback(() => {
							console.error('Erro ao criar vínculo:', err);
							res.status(500).send('Erro ao criar vínculo');
						  });
						}

						connection.commit((err) => {
						  if (err) {
							return connection.rollback(() => {
							  console.error('Erro no commit final:', err);
							  res.status(500).send('Erro ao finalizar cadastro');
							});
						  }

						  req.session.save(() => {
								res.send('<script>alert("Cadastro realizado com sucesso"); window.location.href="/home";</script>');
							});

						});

					  }
					);
				  }
				);				
            })
        })
    });
});

}

// Exporta a função de configuração das rotas
module.exports = rota_cadastroPessoas;