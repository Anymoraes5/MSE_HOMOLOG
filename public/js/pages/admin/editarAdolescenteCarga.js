
console.log("JS CARREGANDO EDITAR CARGA");
/*-----AUTENTICAÇÃO---------------------------------------------------------------------------------------------------------*/

// Verifica se o usuário está autenticado usando o cookie de admin
var isAuthenticated = document.cookie.indexOf('adminAuthenticated=true') !== -1;
if (!isAuthenticated) {
    // Redireciona para a página de login se não estiver autenticado
    window.location.href = '/'; // Supondo que a página de login esteja em '/'
}
/*-----VALIDAÇÕES----------------------------------------------------------------------------------------------------------*/
async function popularSelect({
    url,
    selectId,
    valueKey = "descricao",
    textKey = "descricao",
    addDefault = false,
    defaultText = "",
    filterFn = null,
    sortFn = null
}) {


    try {
        const response = await fetch(url);

        let dados = await response.json();

        if (filterFn) dados = dados.filter(filterFn);
        if (sortFn) dados.sort(sortFn);

        const select = document.getElementById(selectId);

        if (!select) {
            console.warn("Select não encontrado:", selectId);
            return;
        }

        select.innerHTML = "";

        if (addDefault) {
            const option = document.createElement("option");
            option.value = "";
            option.textContent = defaultText;
            select.appendChild(option);
        }

        dados.forEach(item => {
            const option = document.createElement("option");
            option.value = item[valueKey] ?? "";
            option.textContent = item[textKey] ?? "";
            select.appendChild(option);
        });

    } catch (error) {
        console.error("Erro ao carregar:", url, error);
    }
}

function formatarData(data) {
    // Extrai apenas a parte da data (sem a parte da hora e do fuso horário)
    const partesData = data.split('T')[0].split('-');
    const ano = partesData[0];
    const mes = partesData[1];
    const dia = partesData[2];
    return `${ano}-${mes}-${dia}`;
}

function checkSexo() {
    var sexo = document.getElementById("sexo").value;
    var gestante = document.getElementById("gestante");
    var lactante = document.getElementById("lactante");

    if (sexo === "M") { // Masculino
        gestante.value = "0";
        lactante.value = "0";
        gestante.disabled = true;
        lactante.disabled = true;
    } else if (sexo === "F") { // Feminino
        gestante.disabled = false;
        lactante.disabled = false;
    }
}

function checkDeficiencia() {
    var possui_deficiencia = document.getElementById("possui_deficiencia").value;
    var deficiencia = document.getElementById("deficiencia");

    if (possui_deficiencia === "0") { // Não
        deficiencia.value = "";
        deficiencia.disabled = true;
    } else if (possui_deficiencia === "1") { //  Sim
        deficiencia.disabled = false;
    }
}

function checkMedicamentos() {
    var faz_uso_de_medicamentos = document.getElementById("faz_uso_de_medicamentos").value;
    var medicamentos = document.getElementById("medicamentos");

    if (faz_uso_de_medicamentos === "0") { // Não
        medicamentos.value = "";
        medicamentos.disabled = true;
        medicamentos.removeAttribute("required"); // Remove o atributo required
    } else if (faz_uso_de_medicamentos === "1") { //  Sim
        medicamentos.disabled = false;
        medicamentos.setAttribute("required", "required"); // Adiciona novamente o atributo required, se necessário
    }
}

function checkMedicamentosControlados() {
    var faz_uso_de_medicamentos_controlados = document.getElementById("faz_uso_de_medicamentos_controlados").value;
    var medicamentos_controlados = document.getElementById("medicamentos_controlados");

    if (faz_uso_de_medicamentos_controlados === "0") { // Não
        medicamentos_controlados.value = "";
        medicamentos_controlados.disabled = true;
        medicamentos_controlados.removeAttribute("required"); // Remove o atributo required
    } else if (faz_uso_de_medicamentos_controlados === "1") { //  Sim
        medicamentos_controlados.disabled = false;
        medicamentos_controlados.setAttribute("required", "required"); // Adiciona novamente o atributo required, se necessário
    }
}

function checkDemandaSaude() {
    var possui_demanda_saude = document.getElementById("possui_demanda_saude").value;
    var saude = document.getElementById("saude");
    //var acompanhamento_saude = document.getElementById("acompanhamento_saude");

    if (possui_demanda_saude === "0") { // Não
        saude.value = "";
        saude.disabled = true;
        //acompanhamento_saude.value = "";
        //acompanhamento_saude.disabled = true;
    } else if (possui_demanda_saude === "1") { //  Sim
        saude.disabled = false;
        //acompanhamento_saude.disabled = false;
    }
}

function checkDemandaSaudeMental() {
    var possui_demanda_saude_mental = document.getElementById("possui_demanda_saude_mental").value;
    var saude_mental = document.getElementById("saude_mental");

    if (possui_demanda_saude_mental === "0") { // Não
        saude_mental.value = "";
        saude_mental.disabled = true
    } else if (possui_demanda_saude_mental === "1") { //  Sim
        saude_mental.disabled = false;
    }
}

function checkTrabalho() {
    var possui_trabalho = document.getElementById("possui_trabalho").value;
    var trabalho = document.getElementById("trabalho");

    if (possui_trabalho == "1") {
        trabalho.disabled = false;
    } else {
        trabalho.value = ''
        trabalho.disabled = true;
    }
}

function checkFamiliar() {
    var possui_familia_em_servico = document.getElementById("possui_familia_em_servico").value;
    var servico_familia = document.getElementById("servico_familia");

    if (possui_familia_em_servico == "1") {
        servico_familia.disabled = false;
    } else {
        servico_familia.disabled = true;
        servico_familia.value = ''
    }
}

function checkCurso() {
    var curso = document.getElementById("curso").value;
    var listar_cursos = document.getElementById("listar_cursos");

    if (curso == "1") {
        listar_cursos.disabled = false;
    } else {
        listar_cursos.disabled = true;
        listar_cursos.value = null
    }
}

function checkMatriculado() {
    // Obtendo os elementos
    var matriculado = document.getElementById("matriculado").value;
    var tipoEscola = document.getElementById("tipoEscola");
    var ensinoModalidade = document.getElementById("ensinoModalidade");
    var cicloEstudo = document.getElementById("cicloEstudo");
    var frequenciaAula = document.getElementById("frequenciaAula");
    var concluiuCurso = document.getElementById("concluiuCurso");
    var paroudeEstudar = document.getElementById("paroudeEstudar");

    // Reativando todos os campos inicialmente
    tipoEscola.disabled = false;
    ensinoModalidade.disabled = false;
    cicloEstudo.disabled = false;
    frequenciaAula.disabled = false;
    concluiuCurso.disabled = false;
    paroudeEstudar.disabled = false;

    // Aplicando a lógica de desativação com base na seleção
    if (matriculado === "1") { 
        concluiuCurso.value = "";
        paroudeEstudar.value = "";
        concluiuCurso.disabled = true;
        paroudeEstudar.disabled = true;
    } else if (matriculado === "0") {
        tipoEscola.value = "";
        ensinoModalidade.value = "";
        frequenciaAula.value = "";
        tipoEscola.disabled = true;
        ensinoModalidade.disabled = true;
        frequenciaAula.disabled = true;
     }
}

function calculaIdade() {
    const birthDate = new Date(document.getElementById('dt_nasc').value);
    const today = new Date();
    let age = today.getFullYear() - birthDate.getFullYear();
    const monthDiff = today.getMonth() - birthDate.getMonth();
    if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthDate.getDate())) {
        age--;
    }
    document.getElementById('idade').value = age;
};

/*-----PREENCHIMENTO INICIAL DA PÁGINA--------------------------------------------------------------------------------------*/

document.addEventListener("DOMContentLoaded", function () {

    // Busca as opções Creas
    fetch('/opcoesCreasAtual')
    .then(response => response.json())
    .then(opcoesCreasAtual => {
        // Preenche o select com as opções MSE
        var selectCreasAtual = document.getElementById('creas_atual');
        opcoesCreasAtual.forEach(opcao => {
            var option = document.createElement('option');
            option.text = opcao.descricao;
            selectCreasAtual.appendChild(option);
        });
    })
    .catch(error => {
        console.error('Erro ao buscar opções Creas:', error);
    });
		
	// Busca as opções de Tipo Atividade da Unidade
	
		fetch('/opcoesAtividadeUnidade')
			.then(response => response.json())
			.then(opcoes => {

				var select = document.getElementById('atividade_unidade');
				if (!select) {
					console.error('Select atividade_unidade não encontrado');
					return;
				}

				opcoes.forEach(opcao => {
					var option = document.createElement('option');
					option.text = opcao.descricao;
					select.appendChild(option);
				});
			})
			.catch(error => {
				console.error('Erro ao buscar opções atividade:', error);
			});
		
	//Busca as opções de Tipo Logradouro
	fetch('/opcoesTipoLogradouro')
    .then(response => response.json())
    .then(opcoes => {
        var select = document.getElementById('tipo_logradouro');

        opcoes.forEach(opcao => {
            var option = document.createElement('option');
            option.text = opcao.descricao;
            select.appendChild(option);
        });
    })
    .catch(error => {
        console.error('Erro ao buscar opções tipo_logradouro:', error);
    });
	
	//Busca as opções de Tipo Local
	fetch('/opcoesTipoLocal')
    .then(response => response.json())
    .then(opcoes => {
        var select = document.getElementById('tipo_local');

        opcoes.forEach(opcao => {
            var option = document.createElement('option');
            option.text = opcao.descricao;
            select.appendChild(option);
        });
    })
    .catch(error => {
        console.error('Erro ao buscar opções tipo_local:', error);
    });

       // Busca as opções MSE
    fetch('/opcoesMse')
    .then(response => response.json())
    .then(opcoesMSE => {
        // Filtra as opções para remover o item com ID específico (assumindo que o ID está presente no objeto)
        var opcoesMSE = opcoesMSE.filter(opcao => {
            return opcao.descricao !== 'ADMINISTRADORES DO SISTEMA'; // Remova a opção com este ID
        });

        // Preenche o select com as opções filtradas
        var selectMSE = document.getElementById('mse');
        opcoesMSE.forEach(opcao => {
            var option = document.createElement('option');
            option.text = opcao.descricao;
            selectMSE.appendChild(option);
        });
    })
    .catch(error => {
        console.error('Erro ao buscar opções mse:', error);
    });
     
      // Busca as opções Sas
      fetch('/opcoesSas')
      .then(response => response.json())
      .then(opcoesSas => {
          // Preenche o select com as opções Sas
          var selectSas = document.getElementById('sas');
          opcoesSas.forEach(opcao => {
              var option = document.createElement('option');
              option.text = opcao.descricao;
              selectSas.appendChild(option);
          });
      })
      .catch(error => {
          console.error('Erro ao buscar opções sas:', error);
      });

      // Busca as opções servico_familia
    fetch('/opcoesServicoFamilia')
    .then(response => response.json())
    .then(opcoesServicoFamilia => {
        // Preenche o select com as opções servico_familia
        var selectServicoFamilia = document.getElementById('servico_familia');
        opcoesServicoFamilia.forEach(opcao => {
            var option = document.createElement('option');
            option.text = opcao.descricao;
            selectServicoFamilia.appendChild(option);
        });
    })
    .catch(error => {
        console.error('Erro ao buscar opções servico_familia:', error);
    });

    // Busca as opções Distrito
    fetch('/opcoesDistrito')
    .then(response => response.json())
    .then(opcoesDistrito => {
        // Preenche o select com as opções Distrito
        var selectDistrito = document.getElementById('distrito_servico');
        opcoesDistrito.forEach(opcao => {
            var option = document.createElement('option');
            option.text = opcao.descricao;
            selectDistrito.appendChild(option);
        });
    })
    .catch(error => {
        console.error('Erro ao buscar opções distrito:', error);
    });

    // Busca as opções Creas
    fetch('/opcoesCreasOrigem')
    .then(response => response.json())
    .then(opcoesCreasOrigem => {
        // Preenche o select com as opções MSE
        var selectCreasOrigem = document.getElementById('creas_origem');
        opcoesCreasOrigem.forEach(opcao => {
            var option = document.createElement('option');
            option.text = opcao.descricao;
            selectCreasOrigem.appendChild(option);
        });
    })
    .catch(error => {
        console.error('Erro ao buscar opções Creas:', error);
    });

    // Busca as opções MSE
    fetch('/opcoesDeficiencia')
    .then(response => response.json())
    .then(opcoesDeficiencia => {
        // Preenche o select com as opções Deficiencia
        var selectDeficiencia = document.getElementById('deficiencia');
        opcoesDeficiencia.forEach(opcao => {
            var option = document.createElement('option');
            option.text = opcao.descricao;
            selectDeficiencia.appendChild(option);
        });
    })
    .catch(error => {
        console.error('Erro ao buscar opções deficiencia:', error);
    });

    // Busca as opções Distrito
    fetch('/opcoesDistrito')
    .then(response => response.json())
    .then(opcoesDistrito => {
        // Preenche o select com as opções Distrito
        var selectDistrito = document.getElementById('distrito_pessoa');
        opcoesDistrito.forEach(opcao => {
            var option = document.createElement('option');
            option.text = opcao.descricao;
            selectDistrito.appendChild(option);
        });
    })
    .catch(error => {
        console.error('Erro ao buscar opções distrito:', error);
    });

        // Busca as opções Ciclo Estudo 
        fetch('/opcoesCicloEstudo')
        .then(response => response.json())
        .then(opcoesCicloEstudo => {
            // Preenche o select com as opções Ciclo Estudo
            var selectCicloEstudo = document.getElementById('cicloEstudo');
            opcoesCicloEstudo.forEach(opcao => {
                var option = document.createElement('option');
                option.text = opcao.descricao;
                selectCicloEstudo.appendChild(option);
            });
        })
        .catch(error => {
            console.error('Erro ao buscar opções Ciclo Estudo:', error);
        });
    
        // Busca as opções Tipo Escola
        fetch('/opcoesTipoescola')
        .then(response => response.json())
        .then(opcoesTipoescola => {
            // Preenche o select com as opções Tipo Escola
            var selectTipoescola = document.getElementById('tipoEscola');
            opcoesTipoescola.forEach(opcao => {
                var option = document.createElement('option');
                option.text = opcao.descricao;
                selectTipoescola.appendChild(option);
            });
        })
        .catch(error => {
            console.error('Erro ao buscar opções Tipo Escola:', error);
        });
    
         // Busca as opções ensinoModalidade
        fetch('/opcoesEnsinoModalidade')
        .then(response => response.json())
        .then(opcoesEnsinoModalidade => {
            // Preenche o select com as opções ensinoModalidade
            var selectEnsinoModalidade = document.getElementById('ensinoModalidade');
            opcoesEnsinoModalidade.forEach(opcao => {
                var option = document.createElement('option');
                option.text = opcao.descricao;
                selectEnsinoModalidade.appendChild(option);
            });
        })
        .catch(error => {
            console.error('Erro ao buscar opções ensinoModalidade:', error);
        });

         // Busca as opções de Parou de estudar
         fetch('/opcoesParoudeestudar')
         .then(response => response.json())
         .then(opcoesParoudeestudar => {
             // Preenche o select com as opções Conclusão de curso
             var selectParoudeestudar= document.getElementById('paroudeEstudar');
             opcoesParoudeestudar.forEach(opcao => {
                 var option = document.createElement('option');
                 option.text = opcao.descricao;
                 selectParoudeestudar.appendChild(option);
             });
         })
         .catch(error => {
             console.error('Erro ao buscar opções Parou de estudar:', error);
         });

    // Busca as opções EstadoCivil
    fetch('/opcoesEstadoCivil')
    .then(response => response.json())
    .then(opcoesEstadoCivil => {
        // Preenche o select com as opções EstadoCivil
        var selectEstadoCivil = document.getElementById('estado_civil');
        opcoesEstadoCivil.forEach(opcao => {
            var option = document.createElement('option');
            option.text = opcao.descricao;
            selectEstadoCivil.appendChild(option);
        });
    })
    .catch(error => {
        console.error('Erro ao buscar opções estado civil:', error);
    });

    // Busca as opções Genero
    fetch('/opcoesGenero')
    .then(response => response.json())
    .then(opcoesGenero => {
        // Preenche o select com as opções Genero
        var selectGenero = document.getElementById('genero');
        opcoesGenero.forEach(opcao => {
            var option = document.createElement('option');
            option.text = opcao.descricao;
            selectGenero.appendChild(option);
        });
    })
    .catch(error => {
        console.error('Erro ao buscar opções genero:', error);
    });

    // Busca as opções MedidasMse
    fetch('/opcoesMedidasMse')
    .then(response => response.json())
    .then(opcoesMedidasMse => {
        // Preenche o select com as opções MedidasMse
        var selectMedidasMse = document.getElementById('medidas_mse');
        opcoesMedidasMse.forEach(opcao => {
            var option = document.createElement('option');
            option.text = opcao.descricao;
            selectMedidasMse.appendChild(option);
        });
    })
    .catch(error => {
        console.error('Erro ao buscar opções MedidasMse:', error);
    });

    // Busca as opções Nacionalidade
    fetch('/opcoesNacionalidade')
    .then(response => response.json())
    .then(opcoesNacionalidade => {
        // Preenche o select com as opções Nacionalidade
        var selectNacionalidade = document.getElementById('nacionalidade');
        opcoesNacionalidade.forEach(opcao => {
            var option = document.createElement('option');
            option.text = opcao.descricao;
            selectNacionalidade.appendChild(option);
        });
    })
    .catch(error => {
        console.error('Erro ao buscar opções Nacionalidade:', error);
    });

    // Busca as opções OrientacaoSexual
    fetch('/opcoesOrientacaoSexual')
    .then(response => response.json())
    .then(opcoesOrientacaoSexual => {
        // Preenche o select com as opções OrientacaoSexual
        var selectOrientacaoSexual = document.getElementById('orientacao_sexual');
        opcoesOrientacaoSexual.forEach(opcao => {
            var option = document.createElement('option');
            option.text = opcao.descricao;
            selectOrientacaoSexual.appendChild(option);
        });
    })
    .catch(error => {
        console.error('Erro ao buscar opções OrientacaoSexual:', error);
    });

    // Busca as opções Raca
    fetch('/opcoesRaca')
    .then(response => response.json())
    .then(opcoesRaca => {
        // Preenche o select com as opções Raca
        var selectRaca = document.getElementById('raca');
        opcoesRaca.forEach(opcao => {
            var option = document.createElement('option');
            option.text = opcao.descricao;
            selectRaca.appendChild(option);
        });
    })
    .catch(error => {
        console.error('Erro ao buscar opções raca:', error);
    });

    // Busca as opções trabalho
    fetch('/opcoesTrabalho')
    .then(response => response.json())
    .then(opcoesTrabalho => {
        // Preenche o select com as opções trabalho
        var selectTrabalho = document.getElementById('trabalho');
        opcoesTrabalho.forEach(opcao => {
            var option = document.createElement('option');
            option.text = opcao.descricao;
            selectTrabalho.appendChild(option);
        });
    })
    .catch(error => {
        console.error('Erro ao buscar opções trabalho:', error);
    });

      // Busca as opções alcool-drogas
      fetch('/opcoesAlcoolDrogas')
      .then(response => response.json())
      .then(opcoesAlcoolDrogas => {
          // Preenche o select com as opções trabalho
          var selectAlcoolDrogas = document.getElementById('alcool_ou_drogas');
          opcoesAlcoolDrogas.forEach(opcao => {
              var option = document.createElement('option');
              option.text = opcao.descricao;
              selectAlcoolDrogas.appendChild(option);
          });
      })
      .catch(error => {
          console.error('Erro ao buscar opções alcool ou drogas:', error);
      });

    // Busca as opções SituacaoDoProcesso
    fetch('/opcoesSituacaoDoProcesso')
    .then(response => response.json())
    .then(opcoesSituacaoDoProcesso => {
        // Preenche o select com as opções SituacaoDoProcesso
        var selectSituacaoDoProcesso = document.getElementById('situacao_do_processo');
        opcoesSituacaoDoProcesso.forEach(opcao => {
            var option = document.createElement('option');
            option.text = opcao.descricao;
            selectSituacaoDoProcesso.appendChild(option);
        });
    })
    .catch(error => {
        console.error('Erro ao buscar opções situacao_do_processo:', error);
    });

    // Busca as opções VaraDaInfancia
    fetch('/opcoesVaraDaInfancia')
    .then(response => response.json())
    .then(opcoesVaraDaInfancia => {
        // Preenche o select com as opções VaraDaInfancia
        var selectVaraDaInfancia = document.getElementById('vara_da_infancia');
        opcoesVaraDaInfancia.forEach(opcao => {
            var option = document.createElement('option');
            option.text = opcao.descricao;
            selectVaraDaInfancia.appendChild(option);
        });
    })
    .catch(error => {
        console.error('Erro ao buscar opções vara_da_infancia:', error);
    });

    fetch('/opcoesContatos')
    .then(response => response.json())
    .then(opcoesContatos => {
        // Preenche o select com as opções Contatos
        var selectContatos = document.getElementById('tipo_de_contato');
        opcoesContatos.forEach(opcao => {
            var option = document.createElement('option');
            option.text = opcao.descricao;
            selectContatos.appendChild(option);
            
        });
    })
    .catch(error => {
        console.error('Erro ao buscar opções Contatos:', error);
    });
	
       // Busca as opções UBS
fetch('/opcoesUbs')
.then(response => response.json())
.then(opcoesUbs => {
    const datalist = document.getElementById('ubs-list');
    const input = document.getElementById('ubs-input');
    const hiddenInput = document.getElementById('ubs');
    
    // Preenche o datalist com todas as opções
    opcoesUbs.forEach(opcao => {
        const option = document.createElement('option');
        option.value = opcao.descricao;
        datalist.appendChild(option);
    });
    
    // Mostra todas as opções quando o input recebe foco
    input.addEventListener('focus', function() {
        this.value = ''; // Limpa o campo ao receber foco
        hiddenInput.value = ''; // Limpa o valor oculto
    });
    
    // Atualiza o campo oculto quando uma opção é selecionada
    input.addEventListener('input', function() {
        const selectedValue = this.value;
        if (opcoesUbs.some(opcao => opcao.descricao === selectedValue)) {
            hiddenInput.value = selectedValue;
        } else {
            hiddenInput.value = '';
        }
    });
    
    // Validação para garantir que apenas valores da lista sejam aceitos
    input.addEventListener('change', function() {
        if (!opcoesUbs.some(opcao => opcao.descricao === this.value)) {
            this.value = '';
            hiddenInput.value = '';
        }
    });
})
.catch(error => {
    console.error('Erro ao buscar opções UBS:', error);
});

/* ----------------------------------------------------------------------------------- */

var urlParams = new URLSearchParams(window.location.search);
var ID = urlParams.get('ID');

// Função para buscar as opções TecRef com base no mse selecionado usando async/await
async function buscarTecRefPorMse(mseSelecionado) {
    try {
        const response = await fetch(`/opcoesTecRef?mse=${encodeURIComponent(mseSelecionado)}`);
        const opcoesTecRef = await response.json();
        var selectTecRef = document.getElementById('tec_ref');
        selectTecRef.innerHTML = ''; // Limpa as opções existentes

        opcoesTecRef.forEach(opcao => {
            var option = document.createElement('option');
            option.text = opcao.nome;
            selectTecRef.appendChild(option);
        });
    } catch (error) {
        console.error('Erro ao buscar opções Técnico de Referência:', error);
    }
}
async function preencherCreasSasPorMse(idMse) {
    if (!idMse) {
        const selectCreas = document.getElementById('creas_atual');
        const selectSas   = document.getElementById('sas');
        if (selectCreas) { selectCreas.value = ''; selectCreas.disabled = false; }
        if (selectSas)   { selectSas.value   = ''; selectSas.disabled   = false; }
        resetSelectField('distrito_servico');
        return;
    }

    try {
        const response = await fetch(`/dadosMse/${idMse}`);
        const dados    = await response.json();

        

        const selectCreas = document.getElementById('creas_atual');
        if (selectCreas && dados.creas_id) {
            selectCreas.value    = dados.creas_id;
            selectCreas.disabled = true;
            
        }

        const selectSas = document.getElementById('sas');
        if (selectSas && dados.sas_ids.length > 0) {
            selectSas.value    = dados.sas_ids[0];
            selectSas.disabled = true;
            
            selectSas.dispatchEvent(new Event('change', { bubbles: true }));
        }

    } catch (err) {
        console.error('Erro ao buscar dados do MSE:', err);
    }
}




// Função assíncrona para carregar os dados do usuário e preencher o formulário
async function carregarDadosDoUsuario(ID) {
    try {
        const response = await fetch(`/editandoPessoas/${ID}`);
        const data = await response.json();

        // Função para formatar data se necessário
        function formatarData(dataString) {
            if (!dataString) return '';
            const data = new Date(dataString);
            if (isNaN(data.getTime())) return ''; // Verifica se a data é válida
            return data.toISOString().split('T')[0]; // Formata a data como YYYY-MM-DD
        }

        // Função auxiliar para tratar valores null ou undefined
        const tratarValor = valor => {
            return valor === null || valor === undefined ? '' : valor.toString();
        };

        // Preenche o mse antes para que a lista de técnicos seja carregada
        var mseSelecionado = data.mse;
        await buscarTecRefPorMse(mseSelecionado); // Aguarda carregar as opções de técnico de referência
        document.getElementById('tec_ref').value = data.tec_ref || '';

        // Lista dos IDs dos elementos e os campos de dados
        const elements = {
			'tipo_local': tratarValor(data['tipo_local']),
			'nome_unidade': data['nome_unidade'] || '',
			'cep_unidade': data['cep_unidade'] || '',
			'tipo_logradouro': tratarValor(data['tipo_logradouro']),
			'logradouro_unidade': data['logradouro_unidade'] || '',
			'numero_unidade': data['numero_unidade'] || '',
			'complemento_unidade': data['complemento_unidade'] || '',
			'bairro_unidade': data['bairro_unidade'] || '',
			'telefone_unidade': data['telefone_unidade'] || '',
			'responsavel_unidade': data['responsavel_unidade'] || '',
			'horario_inicio_unidade': data['horario_inicio_unidade'] || '',
			'horario_fim_unidade': data['horario_fim_unidade'] || '',
			'atividade_unidade': data['atividade_unidade'] || '',			
            'ativo_inativo': tratarValor(data['ativo_inativo']),
            'dt_cadastro': formatarData(data['dt_cadastro']),
            'dt_atualizacao': formatarData(data['dt_atualizacao']),
            'creas_atual': tratarValor(data['creas_atual']),
            'mse': tratarValor(data['mse']),
            'tec_ref': data.tec_ref,
            'sas': tratarValor(data['sas']),
            'servico_familia': tratarValor(data['servico_familia']),
            'distrito_servico': tratarValor(data['distrito_servico']),
            'creas_origem': tratarValor(data['creas_origem']),
            'nome': data['nome'] || '',
            'nome_social': data['nome_social'] || '',
            'dt_nasc': formatarData(data['dt_nasc']),
            'cpf': data['cpf'] || '',
            'cad_unico': tratarValor(data['cad_unico']),
            
            'cartao_sus': data['cartao_sus'] || '',
            'medidas_mse': tratarValor(data['medidas_mse']),
            'nome_da_mae': data['nome_da_mae'] || '',
            'nome_do_pai': data['nome_do_pai'] || '',
            'nome_responsavel': data['nome_responsavel'] || '',
            'raca': tratarValor(data['raca']),
            'sexo': tratarValor(data['sexo']),
            'nacionalidade': tratarValor(data['nacionalidade']),
            'genero': tratarValor(data['genero']),
            'orientacao_sexual': tratarValor(data['orientacao_sexual']),
            'estado_civil': tratarValor(data['estado_civil']),
            'matriculado': tratarValor(data['matriculado']),
            'alfabetizado': tratarValor(data['alfabetizado']),
            'cicloEstudo': tratarValor(data['cicloEstudo']),
            'numeroRa': data['numeroRa'] || '',
            'tipoEscola': tratarValor(data['tipoEscola']),
            'ensinoModalidade': tratarValor(data['ensinoModalidade']),
            'frequenciaAula': tratarValor(data['frequenciaAula']),
            'concluiuCurso': tratarValor(data['concluiuCurso']),
            'paroudeEstudar': tratarValor(data['paroudeEstudar']),
            'possui_deficiencia': tratarValor(data['possui_deficiencia']),
            'deficiencia': tratarValor(data['deficiencia']),
            'trabalho': tratarValor(data['trabalho']),
            'necessita_cuidados_terceiros': tratarValor(data['necessita_cuidados_terceiros']),
            'possui_demanda_saude': tratarValor(data['possui_demanda_saude']),
            'saude': data['saude'] || '',
            'possui_demanda_saude_mental': tratarValor(data['possui_demanda_saude_mental']),
            'saude_mental': data['saude_mental'] || '',
            'acompanhamento_saude': tratarValor(data['acompanhamento_saude']),
            'faz_uso_de_medicamentos': tratarValor(data['faz_uso_de_medicamentos']),
            'medicamentos': data['medicamentos'] || '',
            'faz_uso_de_medicamentos_controlados': tratarValor(data['faz_uso_de_medicamentos_controlados']),
            'medicamentos_controlados': data['medicamentos_controlados'] || '',
            'possui_trabalho': tratarValor(data['possui_trabalho']),
            'possui_familia_em_servico': tratarValor(data['possui_familia_em_servico']),
            'gestante': tratarValor(data['gestante']),
            'parceira_gestante': tratarValor(data['parceira_gestante']),
            'lactante': tratarValor(data['lactante']),
            'possui_filhos': tratarValor(data['possui_filhos']),
            'responsavel_por_pcd': tratarValor(data['responsavel_por_pcd']),
            'adolescente_com_trajetoria_de_acolhimento': tratarValor(data['adolescente_com_trajetoria_de_acolhimento']),
            'alcool_ou_drogas': tratarValor(data['alcool_ou_drogas']),
            'caps': tratarValor(data['caps']),
            'curso': tratarValor(data['curso']) || '',
            'n_processo': data['n_processo'] || '',
            'n_processo_apuracao': data['n_processo_apuracao'] || '',
            'n_pt': data['n_pt'] || '',
            'vara_da_infancia': tratarValor(data['vara_da_infancia']),
            'dt_interpretacao_medida': formatarData(data['dt_interpretacao_medida']),
            'dt_ultimo_relatorio_enviado': formatarData(data['dt_ultimo_relatorio_enviado']),
            'resumo_do_caso': data['resumo_do_caso'] || '',
            'listar_cursos': data['listar_cursos'] || '',
            'situacao_do_processo': tratarValor(data['situacao_do_processo']),
            'distrito_pessoa': tratarValor(data['distrito_pessoa']),
            'ubs-input': data.ubs,
            'ubs': data.ubs,
            'cep': data['cep'] || '',
            'bairro': data['bairro'] || '',
            'rua': data['rua'] || '',
            'numero': data['numero'] || '',
            'complemento': data['complemento'] || '',
            'ID_contatos': data['ID_contatos'] || '',
            'tipo_de_contato': tratarValor(data['tipo_de_contato']),
            'nome_do_contato': data['nome_do_contato'] || '',
            'telefone': data['telefone'] || '',
            'email': data['email'] || '',
            'dt_desligamento': formatarData(data['dt_desligamento']),
        };
        
        
		
        // Preencher os campos do formulário
        Object.keys(elements).forEach(id => {
            const element = document.getElementById(id);
            if (element) {
                element.value = elements[id] ?? ''; // Preenche com o valor ou string vazia
            } else {
                console.error(`Elemento com ID '${id}' não encontrado.`);
            }
        });
		
		

        checkSexo();
        calculaIdade();
        checkMedicamentos();
        checkDemandaSaude();
        checkMedicamentosControlados();
        checkDemandaSaudeMental();
        checkDeficiencia();
        checkMatriculado();
        checkTrabalho();
        checkFamiliar();
        //checkDrogas();
        checkCurso();

        
        if (data.dias_semana) {
            const diasSelecionados = data.dias_semana
                .split(',')
                .map(dia => dia.trim());

            

            document.querySelectorAll('input[name="dias[]"]').forEach(checkbox => {
                checkbox.checked = diasSelecionados.includes(checkbox.value);
                
            });
        }

    } catch (error) {
        console.error('Erro ao buscar dados da pessoa:', error);
    }
}


// Chama a função para carregar os dados do usuário com base no ID fornecido
carregarDadosDoUsuario(ID);

    var urlParams = new URLSearchParams(window.location.search);
    var ID = urlParams.get('ID');
    
    let opcoesProgramasSociais = [];
    
	// Função para carregar as opções de Unidade Acolhedora
	function carregarUnidadesAcolhedoras(valorSelecionado = '') {
		fetch('/opcoesUnidadeAcolhedora')
			.then(response => response.json())
			.then(opcoes => {
				var selectUnidade = document.getElementById('unidade_acolhedora');
				selectUnidade.innerHTML = ''; // Limpa opções existentes

				// Adiciona uma opção padrão
				var defaultOption = document.createElement('option');
				defaultOption.value = '';
				defaultOption.text = 'Selecione uma Unidade Acolhedora';
				selectUnidade.appendChild(defaultOption);

				// Preenche com as opções do backend
				opcoes.forEach(opcao => {
					var option = document.createElement('option');
					option.value = opcao.id; // ou opcao.descricao se preferir
					option.text = opcao.descricao;
					if (valorSelecionado && valorSelecionado == opcao.id) {
						option.selected = true;
					}
					selectUnidade.appendChild(option);
				});
			})
			.catch(error => {
				console.error('Erro ao carregar unidades acolhedoras:', error);
			});
	}
	
	// Busca as opções de Programas Sociais
    fetch('/opcoesProgramasSociais')
        .then(response => response.json())
        .then(opcoesProgramas => {
            opcoesProgramasSociais = opcoesProgramas; // Armazena as opções globais
    
            var divContainer = document.getElementById('programas_sociais_container');
            var addButton = document.getElementById('add_programa_social');
            var removeButton = document.getElementById('remove_programa_social');
    
			fetch(`/editandoPessoasProgramas/${ID}`)
			  .then(response => response.json())
			  .then(programas => {

				  // Limpa tudo antes
				  divContainer.innerHTML = '';

				  // Cria um select para cada programa vindo do banco
				  programas.forEach(programa => {
					  criarSelect(programa);
				  });

				  // Se não tiver nenhum, cria um vazio
				  if (programas.length === 0) {
					  criarSelect();
				  }
			  });
    
    // Função para criar um novo select
	function criarSelect(programa = '') { // Adicione um valor padrão vazio para `programa`
		var divWrapper = document.createElement('div');
		divWrapper.className = 'select-wrapper';
		divWrapper.style.display = 'flex'; // Alinhamento flexível
		divWrapper.style.alignItems = 'center'; // Alinha verticalmente

		var newSelect = document.createElement('select');
		newSelect.name = 'programas_sociais[]';
		newSelect.className = 'form-select mb-2';
		newSelect.style.flex = '1'; // O select ocupa o espaço disponível

		var defaultOption = document.createElement('option');
		defaultOption.value = '';
		defaultOption.text = programa ? programa : 'Selecione um programa social'; // Ajusta o texto do placeholder
		defaultOption.selected = true; // Deixa a opção padrão selecionada inicialmente
		newSelect.appendChild(defaultOption);

		// Adiciona as opções disponíveis de programas sociais
		opcoesProgramasSociais.forEach(opcao => {
			var option = document.createElement('option');
			option.value = opcao.descricao;
			option.text = opcao.descricao;
			// Mantém a seleção se o valor coincidir com o programa atual
			if (opcao.descricao === programa) {
				option.selected = true;
			}
			newSelect.appendChild(option);
		});

    // Evento para evitar duplicatas após a seleção
    newSelect.addEventListener('change', function () {
        var selectedValues = Array.from(divContainer.querySelectorAll('select')).map(select => select.value);

        // Verifica se a opção já foi selecionada
        if (selectedValues.filter(value => value === newSelect.value).length > 1) {
            alert('Este programa social já foi selecionado.');
            newSelect.value = ''; // Reseta para a opção padrão
        }
    });

    // Botão para remover o select
    var removeButton = document.createElement('button');
    removeButton.type = 'button';
    removeButton.textContent = 'Remover';
    removeButton.className = 'btn btn-danger btn-sm';
    removeButton.style.marginLeft = '10px'; // Espaço à esquerda
    removeButton.style.backgroundColor = 'darkred';

    removeButton.addEventListener('click', function () {
        divContainer.removeChild(divWrapper);

        // Se restar apenas um select, esconde o botão de remover
        if (divContainer.querySelectorAll('select').length === 0) {
            removeButton.style.display = 'none';
        }
    });

    divWrapper.appendChild(newSelect);
    divWrapper.appendChild(removeButton);
    divContainer.appendChild(divWrapper);
}
   
            criarSelect();
    
            function adicionarQuebraDeLinha(elemento) {
                var br = document.createElement('br');
                elemento.parentNode.insertBefore(br, elemento.nextSibling);
            }
    
            removeButton.style.display = 'none';
    
            addButton.addEventListener('click', function (event) {
                event.preventDefault();
                var lastSelect = divContainer.lastChild;
                if (lastSelect && lastSelect.querySelector('select').value === '') {
                    alert('Selecione um programa social antes de adicionar outro.');
                } else {
                    criarSelect();
                    removeButton.style.display = 'none';
    
                    var br = document.querySelector('#buttons_container + br');
                    if (br) {
                        br.remove();
                    }
                    adicionarQuebraDeLinha(addButton);
                }
            });
    
            removeButton.addEventListener('click', function (event) {
                event.preventDefault();
    
                var selects = divContainer.querySelectorAll('select');
    
                if (selects.length > 1) {
                    divContainer.removeChild(divContainer.lastChild);
    
                    if (selects.length - 1 === 1) {
                        removeButton.style.display = 'none';
                    }
    
                    var br = document.querySelector('#buttons_container + br');
                    if (br) {
                        br.remove();
                    }
                }
            });
    
            adicionarQuebraDeLinha(removeButton);
        })
        .catch(error => {
            console.error('Erro ao buscar opções programas_sociais:', error);
        });
 
},);

/*-----CONTINUA NO ARQUIVO adminEditaPessoa2--------------------------------------------------------------------------------------*/

