/*-configurações padrões---------------------------------------------------------------------------------------------*/

//Importa o módulo fs e path para lidar com arquivos e caminhos
const fs = require('fs');
const path = require('path');

//Importa a conexão com o banco de dados
const { connection } = require('../db/db');

/*-----Rotas para listas suspensas-------------------------------------------------------------------------------------*/

//Define as rotas do aplicativo
function rota_listasCargaSelects(app) {

    //  rotas para preencher o select
    app.get('/opcoesCreas', (req, res) => {
        connection.query('SELECT descricao FROM creas WHERE ativo_inativo = 1 ORDER BY 1', (error, results, fields) => {
            if (error) {
                console.error('Erro ao buscar opções CREAS:', error);
                res.status(500).send('Erro ao buscar opções CREAS.');
                return;
            }

            res.json(results); // Envia as opções MSE como resposta em JSON
        });
    });

    //  rotas para preencher o select
    app.get('/opcoesCreasAtual', (req, res) => {
        connection.query('SELECT ID, descricao FROM creas WHERE ativo_inativo = 1 AND descricao NOT LIKE "%OUTRO MUNICÍPIO%" ORDER BY 1', (error, results, fields) => {
            if (error) {
                console.error('Erro ao buscar opções CREAS:', error);
                res.status(500).send('Erro ao buscar opções CREAS.');
                return;
            }

            res.json(results); // Envia as opções MSE como resposta em JSON
        });
    });

    //  rotas para preencher o select
    app.get('/opcoesCreasOrigem', (req, res) => {
        connection.query('SELECT descricao FROM creas WHERE ativo_inativo = 1 ORDER BY 1', (error, results, fields) => {
            if (error) {
                console.error('Erro ao buscar opções CREAS:', error);
                res.status(500).send('Erro ao buscar opções CREAS.');
                return;
            }

            res.json(results); // Envia as opções MSE como resposta em JSON
        });
    });

    //  rotas para preencher o select
    app.get('/opcoesDeficiencia', (req, res) => {
        connection.query('SELECT descricao FROM deficiencia WHERE ativo_inativo = 1 ORDER BY 1', (error, results, fields) => {
            if (error) {
                console.error('Erro ao buscar opções Deficiência:', error);
                res.status(500).send('Erro ao buscar opções Deficiência.');
                return;
            }

            res.json(results); // Envia as opções MSE como resposta em JSON
        });
    });

    //  rotas para preencher o select
    app.get('/opcoesDistrito', (req, res) => {
        const { id_sas } = req.query;

        let sql;
        let params;

        if (id_sas) {
            // Com filtro de SAS — para distrito_servico
            sql = `
                SELECT DISTINCT d.ID, d.descricao
                FROM distrito d
                INNER JOIN sas_distrito sd ON sd.id_distrito = d.ID
                WHERE sd.id_sas = ?
                AND d.ativo_inativo = 1
                ORDER BY d.descricao
            `;
            params = [id_sas];
        } else {
            // Sem filtro — para distrito_pessoa
            sql = `
                SELECT ID, descricao
                FROM distrito
                WHERE ativo_inativo = 1
                ORDER BY descricao
            `;
            params = [];
        }

        connection.query(sql, params, (err, results) => {
            if (err) return res.status(500).json({ error: err });
            res.json(results);
        });
    });

    //  rotas para preencher o select
    app.get('/opcoesEstadoCivil', (req, res) => {
        connection.query('SELECT descricao FROM estado_civil WHERE ativo_inativo = 1 ORDER BY 1', (error, results, fields) => {
            if (error) {
                console.error('Erro ao buscar opções Estado Civil:', error);
                res.status(500).send('Erro ao buscar opções Estado Civil.');
                return;
            }

            res.json(results); // Envia as opções Perfil como resposta em JSON
        });
    });

    //  rotas para preencher o select
    app.get('/opcoesGenero', (req, res) => {
        connection.query('SELECT descricao FROM genero WHERE ativo_inativo = 1 ORDER BY 1', (error, results, fields) => {
            if (error) {
                console.error('Erro ao buscar opções Genêro:', error);
                res.status(500).send('Erro ao buscar opções Genêro.');
                return;
            }

            res.json(results); // Envia as opções Perfil como resposta em JSON
        });
    });

    //  rotas para preencher o select
    app.get('/opcoesMedidasMse', (req, res) => {
        connection.query('SELECT descricao FROM medidas_mse WHERE ativo_inativo = 1 ORDER BY 1', (error, results, fields) => {
            if (error) {
                console.error('Erro ao buscar opções Medidas:', error);
                res.status(500).send('Erro ao buscar opções Medidas.');
                return;
            }

            res.json(results); // Envia as opções Perfil como resposta em JSON
        });
    });

    app.get('/opcoesMse', (req, res) => {
        connection.query(
            'SELECT ID, descricao FROM mse WHERE ativo_inativo = 1 ORDER BY descricao',
            (error, results) => {
                if (error) {
                    console.error('Erro ao buscar opções MSE:', error);
                    res.status(500).send('Erro ao buscar opções MSE.');
                    return;
                }
                res.json(results);
            }
        );
    });
        app.get('/dadosMse/:id', (req, res) => {
        const idMse = req.params.id;
        console.log("BUSCANDO MSE ID:", idMse);

        connection.query(`
            SELECT 
                m.fk_creas,
                c.descricao AS creas_descricao,
                c.ID        AS creas_id,
                GROUP_CONCAT(ms.id_sas) AS sas_ids
            FROM mse m
            LEFT JOIN creas c ON c.ID = m.fk_creas
            LEFT JOIN mse_sas ms ON ms.id_mse = m.ID
            WHERE m.ID = ?
            GROUP BY m.ID, m.fk_creas, c.descricao, c.ID
        `, [idMse], (error, results) => {
            if (error) {
                console.error('Erro ao buscar dados do MSE:', error);
                return res.status(500).json({ error: 'Erro ao buscar dados do MSE.' });
            }
            if (results.length === 0) {
                return res.json({ creas_id: null, creas_descricao: null, sas_ids: [] });
            }
            const row = results[0];
            res.json({
                creas_id: row.creas_id,
                creas_descricao: row.creas_descricao,
                sas_ids: row.sas_ids ? row.sas_ids.split(',').map(Number) : []
            });
        });
    });

    app.get('/opcoesTecRef', (req, res) => {
        const mseSelecionado = req.query.mse; // Obtém o parâmetro mse da query string
    
        // Adapta a consulta SQL para buscar os TecRef com base no mse selecionado
        const query = `
            SELECT 
                U.nome 
            FROM usuarios U
            JOIN mse M ON U.fk_mse = M.ID
            WHERE U.ativo_inativo = 1 AND M.descricao = ? ORDER BY 1;
        `;
    
        connection.query(query, [mseSelecionado], (error, results, fields) => {
            if (error) {
                console.error('Erro ao buscar opções Técnico de Referência:', error);
                res.status(500).send('Erro ao buscar opções Técnico de Referência.');
                return;
            }
            res.json(results); // Envia as opções filtradas como resposta em JSON
        });
    });
/*
    app.get('/opcoesUbs', (req, res) => {
        const distritoSelecionado = req.query.distrito; // Obtém o parâmetro mse da query string
    
        // Adapta a consulta SQL para buscar os TecRef com base no mse selecionado
        const query = `
            SELECT 
                UBS.descricao
            FROM ubs UBS
            JOIN distrito D ON D.ID = UBS.fk_distrito
            WHERE UBS.ativo_inativo = 1 AND D.descricao = ? ORDER BY 1;
        `;
    
        connection.query(query, [distritoSelecionado], (error, results, fields) => {
            if (error) {
                console.error('Erro ao buscar opções UBS:', error);
                res.status(500).send('Erro ao buscar opções UBS.');
                return;
            }
            res.json(results); // Envia as opções filtradas como resposta em JSON
        });
    });
*/
    //  rotas para preencher o select
    app.get('/opcoesUbs', (req, res) => {
        connection.query('SELECT descricao FROM ubs WHERE ativo_inativo = 1 ORDER BY 1', (error, results, fields) => {
            if (error) {
                console.error('Erro ao buscar opções UBS:', error);
                res.status(500).send('Erro ao buscar opções UBS.');
                return;
            }

            res.json(results); // Envia as opções Perfil como resposta em JSON
        });
    });


    app.get('/opcoesTecSession', (req, res) => {
        const mseSelecionado = req.session.fk_mse; // Obtém o parâmetro mse da query string
    
        // Adapta a consulta SQL para buscar os TecRef com base no mse selecionado
        const query = `
            SELECT 
                U.nome 
            FROM usuarios U
            JOIN mse M ON U.fk_mse = M.ID
            WHERE U.ativo_inativo = 1 AND M.ID = ? ORDER BY 1;
        `;
    
        connection.query(query, [mseSelecionado], (error, results, fields) => {
            if (error) {
                console.error('Erro ao buscar opções Técnico de Referência:', error);
                res.status(500).send('Erro ao buscar opções Técnico de Referência.');
                return;
            }
            res.json(results); // Envia as opções filtradas como resposta em JSON
        });
    });
    
    //  rotas para preencher o select
    app.get('/opcoesNacionalidade', (req, res) => {
        connection.query('SELECT descricao FROM nacionalidade WHERE ativo_inativo = 1 ORDER BY 1', (error, results, fields) => {
            if (error) {
                console.error('Erro ao buscar opções MSE:', error);
                res.status(500).send('Erro ao buscar opções MSE.');
                return;
            }

            res.json(results); // Envia as opções Perfil como resposta em JSON
        });
    });

    //  rotas para preencher o select
    app.get('/opcoesOrientacaoSexual', (req, res) => {
        connection.query('SELECT descricao FROM orientacao_sexual WHERE ativo_inativo = 1 ORDER BY 1', (error, results, fields) => {
            if (error) {
                console.error('Erro ao buscar opções Orientação Sexual:', error);
                res.status(500).send('Erro ao buscar opções Orientação Sexual.');
                return;
            }

            res.json(results); // Envia as opções Perfil como resposta em JSON
        });
    });

    //  rotas para preencher o select
    app.get('/opcoesPerfil', (req, res) => {
        connection.query('SELECT descricao FROM perfil WHERE ativo_inativo = 1 ORDER BY 1', (error, results, fields) => {
            if (error) {
                console.error('Erro ao buscar opções Perfil:', error);
                res.status(500).send('Erro ao buscar opções Perfil.');
                return;
            }

            res.json(results); // Envia as opções Perfil como resposta em JSON
        });
    });

    //  rotas para preencher o select
    app.get('/opcoesProgramasSociais', (req, res) => {
        connection.query('SELECT descricao FROM programas_sociais WHERE ativo_inativo = 1 ORDER BY 1', (error, results, fields) => {
            if (error) {
                console.error('Erro ao buscar opções Programas Sociais:', error);
                res.status(500).send('Erro ao buscar opções Programas Sociais.');
                return;
            }

            res.json(results); // Envia as opções Perfil como resposta em JSON
        });
    });

 

    //  rotas para preencher o select
    app.get('/opcoesRaca', (req, res) => {
        connection.query('SELECT descricao FROM raca WHERE ativo_inativo = 1 ORDER BY 1', (error, results, fields) => {
            if (error) {
                console.error('Erro ao buscar opções Raça:', error);
                res.status(500).send('Erro ao buscar opções Raça.');
                return;
            }

            res.json(results); // Envia as opções Perfil como resposta em JSON
        });
    });

    //  rotas para preencher o select
    app.get('/opcoesTrabalho', (req, res) => {
        connection.query('SELECT descricao FROM trabalho WHERE ativo_inativo = 1 ORDER BY 1', (error, results, fields) => {
            if (error) {
                console.error('Erro ao buscar opções Religião:', error);
                res.status(500).send('Erro ao buscar opções Religião.');
                return;
            }

            res.json(results); // Envia as opções Perfil como resposta em JSON
        });
    });

    //  rotas para preencher o select
    app.get('/opcoesSas', (req, res) => {
        connection.query('SELECT ID, descricao FROM sas WHERE ativo_inativo = 1 ORDER BY 1', (error, results, fields) => {
            if (error) {
                console.error('Erro ao buscar opções SAS:', error);
                res.status(500).send('Erro ao buscar opções SAS.');
                return;
            }

            res.json(results); // Envia as opções Perfil como resposta em JSON
        });
    });

     //  rotas para preencher o select
     app.get('/opcoesServicoFamilia', (req, res) => {
        connection.query('SELECT descricao FROM servico_familia WHERE ativo_inativo = 1 ORDER BY 1', (error, results, fields) => {
            if (error) {
                console.error('Erro ao buscar opções servico_familia:', error);
                res.status(500).send('Erro ao buscar opções servico_familia.');
                return;
            }

            res.json(results); // Envia as opções servico_familia como resposta em JSON
        });
    });


    //  rotas para preencher o select
    app.get('/opcoesSituacaoDoProcesso', (req, res) => {
        connection.query('SELECT descricao FROM situacao_do_processo WHERE ativo_inativo = 1 ORDER BY 1', (error, results, fields) => {
            if (error) {
                console.error('Erro ao buscar opções Situação do processo:', error);
                res.status(500).send('Erro ao buscar opções Situação do processo.');
                return;
            }

            res.json(results); // Envia as opções Perfil como resposta em JSON
        });
    });

    //  rotas para preencher o select
    app.get('/opcoesVaraDaInfancia', (req, res) => {
        connection.query('SELECT descricao FROM vara_da_infancia WHERE ativo_inativo = 1 ORDER BY 1', (error, results, fields) => {
            if (error) {
                console.error('Erro ao buscar opções Vara da infância:', error);
                res.status(500).send('Erro ao buscar opções Vara da infância.');
                return;
            }

            res.json(results); // Envia as opções Perfil como resposta em JSON
        });
    });

    //  rotas para preencher o select tipo de contato
    app.get('/opcoesContatos', (req, res) => {
        connection.query('SELECT descricao FROM tipo_de_contato WHERE ativo_inativo = 1 ORDER BY 1', (error, results, fields) => {
            if (error) {
                console.error('Erro ao buscar opções Contatos:', error);
                res.status(500).send('Erro ao buscar opções Contatos.');
                return;
            }

            res.json(results); // Envia as opções contatos como resposta em JSON
        });
    });

    //  rotas para preencher o select
    app.get('/opcoesAlfabetizado', (req, res) => {
        connection.query('SELECT descricao FROM alfabetizado WHERE ativo_inativo = 1 ORDER BY 1', (error, results, fields) => {
            if (error) {
                console.error('Erro ao buscar opções Alfabetizado:', error);
                res.status(500).send('Erro ao buscar opções Alfabetizado.');
                return;
            }

            res.json(results); // Envia as opções MSE como resposta em JSON
        });
    });

    //  rotas para preencher o select
    app.get('/opcoesCicloEstudo', (req, res) => {
        connection.query('SELECT descricao FROM cicloEstudo WHERE ativo_inativo = 1 ORDER BY 1', (error, results, fields) => {
            if (error) {
                console.error('Erro ao buscar opções Alfabetizado:', error);
                res.status(500).send('Erro ao buscar opções Alfabetizado.');
                return;
            }

            res.json(results); // Envia as opções MSE como resposta em JSON
        });
    });

    //  rotas para preencher o select
    app.get('/opcoesTipoescola', (req, res) => {
        connection.query('SELECT descricao FROM tipoEscola WHERE ativo_inativo = 1 ORDER BY 1', (error, results, fields) => {
            if (error) {
                console.error('Erro ao buscar opções Tipo Escola:', error);
                res.status(500).send('Erro ao buscar opções Tipo Escola.');
                return;
            }

            res.json(results); // Envia as opções MSE como resposta em JSON
        });
    });

    //  rotas para preencher o select
    app.get('/opcoesEnsinoModalidade', (req, res) => {
        connection.query('SELECT descricao FROM ensinoModalidade WHERE ativo_inativo = 1 ORDER BY 1', (error, results, fields) => {
            if (error) {
                console.error('Erro ao buscar opções Ensino Modalidade:', error);
                res.status(500).send('Erro ao buscar opções Ensino Modalidade.');
                return;
            }

            res.json(results); // Envia as opções MSE como resposta em JSON
        });
    });

    //  rotas para preencher o select
    app.get('/opcoesConcluiu', (req, res) => {
        connection.query('SELECT descricao FROM concluiuCurso WHERE ativo_inativo = 1 ORDER BY 1', (error, results, fields) => {
            if (error) {
                console.error('Erro ao buscar opções Conclusão de curso:', error);
                res.status(500).send('Erro ao buscar opções Conclusão de curso.');
                return;
            }

            res.json(results); // Envia as opções MSE como resposta em JSON
        });
    });

    //  rotas para preencher o select
    app.get('/opcoesParoudeestudar', (req, res) => {
        connection.query('SELECT descricao FROM paroudeEstudar WHERE ativo_inativo = 1 ORDER BY 1', (error, results, fields) => {
            if (error) {
                console.error('Erro ao buscar opções Parou de estudar:', error);
                res.status(500).send('Erro ao buscar opções Parou de estudar.');
                return;
            }

            res.json(results); // Envia as opções MSE como resposta em JSON
        });
    });

    //  rotas para preencher o select
    app.get('/opcoesAlcoolDrogas', (req, res) => {
        connection.query('SELECT descricao FROM alcool_ou_drogas WHERE ativo_inativo = 1 ORDER BY 1', (error, results, fields) => {
            if (error) {
                console.error('Erro ao buscar opções Alcool ou Drogas:', error);
                res.status(500).send('Erro ao buscar opções Alcool ou Drogas.');
                return;
            }

            res.json(results); // Envia as opções MSE como resposta em JSON
        });
    });
	
	
	// rota para preencher select tipo_local
		app.get('/opcoesTipoLocal', (req, res) => {
			connection.query('SELECT descricao FROM tipolocal WHERE ativo_inativo = 1 ORDER BY descricao', (error, results) => {
				if (error) {
					console.error('Erro real do MySQL ao buscar opções Tipo de Local:', error); // imprime o erro real
					res.status(500).send('Erro ao buscar opções Tipo de Local.'); 
					return;
				}
				res.json(results); // envia como JSON
			});
		});

		// rota para preencher select tipo_logradouro
		app.get('/opcoesTipoLogradouro', (req, res) => {
			connection.query('SELECT descricao FROM tipologradouro WHERE ativo_inativo = 1 ORDER BY descricao', (error, results) => {
				if (error) {
					console.error('Erro ao buscar opções Tipo de Logradouro:', error);
					res.status(500).send('Erro ao buscar opções Tipo de Logradouro.');
					return;
				}
				res.json(results); // envia como JSON
			});
		});

		// rota para preencher select atividade_unidade
		app.get('/opcoesAtividadeUnidade', (req, res) => {
			connection.query('SELECT descricao FROM atividade WHERE ativo_inativo = 1 ORDER BY descricao', (error, results) => {
				if (error) {
					console.error('Erro ao buscar opções Atividade da Unidade:', error);
					res.status(500).send('Erro ao buscar opções Atividade da Unidade.');
					return;
				}
				res.json(results); // envia como JSON
			});
		});
        


}

// Exporta a função de configuração das rotas
module.exports = rota_listasCargaSelects;