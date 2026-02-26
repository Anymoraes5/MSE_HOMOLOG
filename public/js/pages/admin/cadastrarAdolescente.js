import { $,$$, on, somenteLetras, somenteNumeros, upperTrim, validarObrigatoriosAutomatico, limparCampos, validarDocumento } from "../../admin/helpers.js";
import { toggleCampo } from "../../admin/formRules.js";
import { aplicarMascaraCEP, aplicarMascaraProcesso } from "../../admin/mascaras.js";
import { 
    validarCPF, 
    validaCartao_sus, 
    validaNis, 
    validarNome, 
    validarEmail, 
    validarData, 
    validarTelefone,
    verificarComprimentoNProcesso,
} from "../../admin/validacoes.js";


console.log("JS CARREGADO");

//=======================função para validar se está nulo============================
function validarObrigatorio(id, mensagem) {  
    const el = $(id);  
    if (!el || !el.value.trim()) {  
        alert(mensagem);  
        el?.focus();  
        return false;  
    }  
    return true;  
}

/*-----AUTENTICAÇÃO---------------------------------------------------------------------------------------------------------*/

// Verifica se o usuário está autenticado usando o cookie de admin
var isAuthenticated = document.cookie.indexOf('adminAuthenticated=true') !== -1;
if (!isAuthenticated) {
    // Redireciona para a página de login se não estiver autenticado
    window.location.href = '/'; // Supondo que a página de login esteja em '/'
}

/*---------menu lateral : ajuste de posição da tela ao clicar no link -------------------------*/

// Script para ajustar o scroll quando um link do menu lateral é clicado
document.querySelectorAll('#menu-lateral a').forEach(anchor => {
    anchor.addEventListener('click', function(e) {
        e.preventDefault();

        // Obter o ID do conteúdo correspondente ao link clicado
        const targetId = this.getAttribute('href').substring(1);
        const targetElement = $(targetId);

        if (targetElement) {
            // Calcular a altura do menu principal
            const menuPrincipalHeight = $('menu-principal').offsetHeight;

            // Calcular a posição do topo do elemento alvo
            const targetTop = targetElement.offsetTop - menuPrincipalHeight;

            // Scroll para a posição correta
            window.scrollTo({
                top: targetTop,
                behavior: 'smooth'
            });
        }
    });
});

//Limpar campos se o CEP for alterado
on("cep_unidade", "change", function() {
    $("tipo_logradouro").value = "";
    $("logradouro_unidade").value = "";
    $("bairro_unidade").value = "";
	$("numero_unidade").value = "";
	$("complemento_unidade").value = "";

    bloquearCamposEndereco(false);
});

//Função para bloquear edição manual após escolha de CEP
function bloquearCamposEndereco(bloquear = true) {
    $("tipo_logradouro").disabled = bloquear;
    $("logradouro_unidade").readOnly = bloquear;
    $("bairro_unidade").readOnly = bloquear;
}
document.addEventListener('DOMContentLoaded', function() {
    //chama os validar 
    const cpfInput = $("cpf");
    cpfInput.addEventListener("blur", function () {
        if (!validarCPF(this.value)) {
            alert("CPF inválido");
            this.focus();
        }
    });

    const emailInput = $("email");
    emailInput.addEventListener("blur", function () {
        if (!validarEmail(this.value)) {
            alert("Email inválido");
            this.focus();
        }
    });

    const nisInput = $("nis");
    nisInput.addEventListener("blur", function () {
        if (!validarNis(this.value)) {
            alert("nis inválido");
            this.focus();
        }
    });

    const cartaoSusInput = $("cartao_sus");
    cartaoSusInput.addEventListener("blur", function () {
        if (!validarCartaosus(this.value)) {
            alert("Cartão SUS inválido");
            this.focus();
        }
    });
    const telefoneInput = $("email");
    telefoneInput.addEventListener("blur", function () {
        if (!validarEmail(this.value)) {
            alert("Email inválido");
            this.focus();
        }
    });

    const nomeInput = $("email");
    telefoneInput.addEventListener("blur", function () {
        if (!validarEmail(this.value)) {
            alert("Email inválido");
            this.focus();
        }
    });









});
//converte letras para maisusculo e impede espaços extras
document.addEventListener('DOMContentLoaded', function() {
    const nome = $('nome');
    const nome_social = $('nome_social');
    const nome_da_mae = $('nome_da_mae');
    const nome_do_pai = $('nome_do_pai');
    const nome_responsavel = $('nome_responsavel');
	const responsavel_unidade = $('responsavel_unidade');
    const bairro = $('bairro');
    const rua = $('rua');
    const complemento = $('complemento');
    const nome_do_contato = $('nome_do_contato');

		aplicarMascaraCEP("cep_unidade");
		aplicarMascaraCEP("cep");

		
	
	
    function formatarNome(inputElement) {
        if (!inputElement) return; // ← proteção

        inputElement.addEventListener('input', function() {
            let valor = this.value;

            valor = valor.replace(/\s+/g, ' ');
            valor = valor.toUpperCase();

            this.value = valor;
        });

        inputElement.addEventListener('blur', function() {
            this.value = this.value.trim();
        });
    }

    formatarNome(nome);
    formatarNome(nome_social);
    formatarNome(nome_da_mae);
    formatarNome(nome_do_pai);
    formatarNome(nome_responsavel);
	formatarNome(responsavel_unidade);
    formatarNome(bairro);
    formatarNome(rua);
    formatarNome(complemento);
    formatarNome(nome_do_contato);
});

//função para padronizar numero do processo
document.addEventListener('DOMContentLoaded', function() {
    const nProcessoInput = $('n_processo');
    aplicarMascaraProcesso(nProcessoInput);
});

// função para resetar os campos do tipo select
function resetSelectField(selectId) {
    var selectField = $(selectId);

    if (!selectField) {
        console.warn('Select não encontrado:', selectId);
        return;
    }

    // Remove todos os itens existentes
    selectField.innerHTML = '';

    // Adiciona uma opção vazia como placeholder
    var placeholderOption = document.createElement('option');
    placeholderOption.value = '';
    placeholderOption.text = '';

    selectField.appendChild(placeholderOption);
}

// Obtém a data atual
var hoje = new Date();
// Formata a data no formato YYYY-MM-DD
var dd = String(hoje.getDate()).padStart(2, '0');
var mm = String(hoje.getMonth() + 1).padStart(2, '0'); // Janeiro é 0!
var yyyy = hoje.getFullYear();
// Define o valor do atributo max para a data atual
// $("dt_nasc").max = yyyy + '-' + mm + '-' + dd;
const dtNasc = $("dt_nasc");
if (dtNasc) {
    dtNasc.max = `${yyyy}-${mm}-${dd}`;
}
const dtInterpretacao= $("dt_interpretacao_medida");
if (dtInterpretacao) {
    dtInterpretacao.max = `${yyyy}-${mm}-${dd}`;
}
const dtUltimoRelatorio = $("dt_ultimo_relatorio_enviado");
if (dtUltimoRelatorio) {
    dtUltimoRelatorio.max = `${yyyy}-${mm}-${dd}`;
}



//função para formatar uma data 
function formatarData(data) {
    // Extrai apenas a parte da data (sem a parte da hora e do fuso horário)
    const partesData = data.split('T')[0].split('-');
    const ano = partesData[0];
    const mes = partesData[1];
    const dia = partesData[2];
    return `${ano}-${mes}-${dia}`;
}



document.addEventListener('DOMContentLoaded', function() {
    var errorMessage = $('error-message');
    var cadastrarButton = $('cadastrar');
    var cpfInput = $('cpf');

    if (!cpfInput || !cadastrarButton || !errorMessage) return;

    if (cpfInput) {
        cpfInput.addEventListener('input', function (){
            var cpfValue = this.value;
        var cpfValido = validarCPF(cpfValue);

        if (!cpfValido) {
            // Exibir uma mensagem de erro
            errorMessage.textContent = 'CPF inválido. Por favor, verifique e tente novamente.';
            cadastrarButton.disabled = true; // Desativar botão se CPF for inválido
            cadastrarButton.title = 'cpf inválido';
        } else {
            // Limpar a mensagem de erro se o CPF for válido
            errorMessage.textContent = '';
            cadastrarButton.disabled = false; // Ativar botão se CPF for válido
            cadastrarButton.title = '';
        }

        });
    }
        
    cadastrarButton.addEventListener('mouseover', function(event) {
        if (cadastrarButton.disabled) {
            // Prevenir a ação padrão de um botão desabilitado (caso tenha sido reabilitado via código)
            event.preventDefault();
            // Colocar o foco no campo CPF
            cpfInput.focus();
        }
    });
});

function checkDrogas() {
    const select = $('alcool_ou_drogas');
    if (!select) return;

    if (select.value === '1') {
        console.log('Usuário informou uso de álcool ou drogas');
    }
}





document.addEventListener('DOMContentLoaded', function() {
    var errorMessage = $('error-message-processo');

    var nProcessoInput = $('n_processo');
    if (nProcessoInput){
        nProcessoInput.addEventListener('input', function(){
            var nProcessoValue = this.value;
            var nProcessoValido = verificarComprimentoNProcesso(nProcessoValue);

            if (!nProcessoValido) {
                // Exibir uma mensagem de erro
                errorMessage.textContent = 'Processo inválido. Por favor, verifique e tente novamente.';
                //event.preventDefault();
            } else {
                // Limpar a mensagem de erro se o CPF for válido
                errorMessage.textContent = '';
            }

        })
    }
});






// Função genérica para validação de caracteres permitidos em campos de entrada
function validarCaracteresPermitidos(elementId, allowedCharacters) {
    var element = $(elementId);
    if (!element) return;

    element.setAttribute('autocomplete', 'off');

    // Ouvinte de evento para o evento de "paste" (colar)
    element.addEventListener('paste', function(e) {
        var clipboardData, pastedData;

        // Pega o texto colado do evento
        clipboardData = e.clipboardData || window.clipboardData;
        pastedData = clipboardData.getData('text');

        // Remove caracteres não permitidos
        pastedData = pastedData.replace(new RegExp('[^' + allowedCharacters + ']', 'g'), '');

        // Define o texto colado modificado no campo de entrada
        document.execCommand("insertText", false, pastedData);

        // Previne a ação padrão de colar
        e.preventDefault();
    });

    // Ouvinte de evento para o evento de "keypress"
    element.addEventListener('keypress', function(e) {
        var chr = String.fromCharCode(e.which);
        if (allowedCharacters.indexOf(chr) < 0) {
            e.preventDefault();
        }
    });
}

function extrairTipoLogradouro(logradouroCompleto) {

    // Se não tem valor, NÃO valida (campo não obrigatório)
    if (!logradouroCompleto || logradouroCompleto.trim() === "") {
        return { tipo: "", nome: "" };
    }

    const select = $("tipo_logradouro");

    // Se o select não existe ou está vazio, não valida
    if (!select || !select.value) {
        return { tipo: "", nome: logradouroCompleto.toUpperCase().trim() };
    }

    const tipos = Array.from(select.options)
        .map(opt => opt.value)
        .filter(v => v);

    const logradouroUpper = logradouroCompleto.toUpperCase().trim();

    for (let tipo of tipos) {
        if (logradouroUpper.startsWith(tipo + " ")) {
            return {
                tipo: tipo,
                nome: logradouroUpper.substring(tipo.length).trim()
            };
        }
    }

    // Se não achou tipo, NÃO é erro — apenas retorna nome
    return {
        tipo: "",
        nome: logradouroUpper
    };
}

// Aplicando a validação para cada campo de entrada
const letras = "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ ÀÁÂÃÉÊÍÓÔÕÚÇ()";
const numeros = "0123456789";
[
    "nome",
    "nome_social",
    "nome_da_mae",
    "nome_do_pai",
    "responsavel_unidade",
    "nome_responsavel",
    "logradouro_unidade",
    "saude",
    "medicamentos",
    "n_pt",
    "bairro",
    "bairro_unidade",
    "rua",
    "nome_do_contato",
].forEach(id => validarCaracteresPermitidos(id, letras));

[
    "cpf",
    "nis",
    "cartao_sus",
    "numero_unidade",
    "telefone_unidade",
    "numero_unidade",
    "cep_unidade",
    "horas_ps",
    "numeroRa",
    "n_processo",
    "n_processo_apuracao",
    "numero",
    "telefone",
].forEach(id => validarCaracteresPermitidos(id, numeros));

/*----as funções de check são chamadas dentro da tag html com o evento que verifica mudanças no campo---*/
document.addEventListener("DOMContentLoaded", function () {

    $("sexo")?.addEventListener("change", checkSexo);
    $("cad_unico")?.addEventListener("change", checkCadUnico);
    $("possui_deficiencia")?.addEventListener("change", checkDeficiencia);
    $("matriculado")?.addEventListener("change", checkMatriculado);
    $("curso")?.addEventListener("change", checkCurso);
    $("possui_trabalho")?.addEventListener("change", checkTrabalho);
    $("possui_familia_em_servico")?.addEventListener("change", checkFamiliar);

});

function checkSexo() {
    // toggleCampo("sexo",)
    var sexo = $("sexo").value;
    var gestante = $("gestante");
    var lactante = $("lactante");

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
    toggleCampo("possui_deficiencia", "deficiencia", "1", true);
}

function checkMedicamentos() {
    toggleCampo("faz_uso_de_medicamento", "medicamentos", "1", true);
}

function checkMedicamentosControlados() {
    toggleCampo("faz_uso_de_medicamentos_controlados", "edicamentos_controlado", "1", true)
}

function checkDemandaSaude() {
    toggleCampo("possui_demanda_saude", "saude", "1", true);
}

function checkDemandaSaudeMental() {
    toggleCampo("possui_demanda_saude_mental", "saude_mental", "1", true);
}

function checkMatriculado() {
    // Obtendo os elementos
    var matriculado = $("matriculado").value;
    // var numeroRa = $("numeroRa");
    var tipoEscola = $("tipoEscola");
    var ensinoModalidade = $("ensinoModalidade");
    var cicloEstudo = $("cicloEstudo");
    var frequenciaAula = $("frequenciaAula");
    var concluiuCurso = $("concluiuCurso");
    var paroudeEstudar = $("paroudeEstudar");

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

function checkTecRef() {
    var mse = $("mse").value;
    var tec_ref = $("tec_ref");

    if (mse == "") { // Não
        tec_ref.value = "";
        tec_ref.disabled = true;
    } else if (mse != "") {
        tec_ref.disabled = false;
    }
}

function checkTrabalho() {
    toggleCampo("possui_trabalho", "trabalho", "1", true)
}

function checkFamiliar() {
    toggleCampo("possui_familia_em_servico", "servico_familia", "1", true)
}

function checkCurso() {
    toggleCampo("curso", "listar_cursos", "1", true);
}

/*--------------------------calcular idade----------------------------*/

const dtNascField = $('dt_nasc');
if (dtNascField) {
    dtNascField.addEventListener('change', function() {
        const birthDate = new Date(this.value);
        const today = new Date();
        let age = today.getFullYear() - birthDate.getFullYear();
        const monthDiff = today.getMonth() - birthDate.getMonth();

        if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthDate.getDate())) {
            age--;
        }

        if (age < 12 || age > 21){
            alert("Idade fora do escopo");
            $('idade') && ($('idade').value = "");
        }

        $('idade') && ($('idade').value = age);
    });
}

/*-----CADASTRAR----------------------------------------------------------------------------------------------------------*/

const form = $('editar-form');
if(form){
    form.addEventListener('submit', function(event){
        if (!validarDiasUnidadeAcolhedora()) {
			event.preventDefault();
			return;
		}
        //======================validar documento==============================
        const validacoes = [
            { id: 'cpf', func: validarCPF, msg: 'CPF inválido.' },
            { id: 'nis', func: validaNis, msg: 'NIS inválido.' },
            { id: 'cartao_sus', func: validaCartao_sus, msg: 'Cartão SUS inválido.' }
        ];

        for (const v of validacoes) {
            if (!validarDocumento(v.id, v.func, v.msg, event)) return;
        }
        //======================validar campos obrigatorios================
        if (!validarObrigatoriosAutomatico()) {
            event.preventDefault();
            return;
        }
        //======================pegar campos do form ===================
        const formData = new FormData(form);
        const data = Object.fromEntries(formData.entries());

        if (!confirm("Tem certeza que deseja cadastrar a pessoa?")) {
            alert("Operação cancelada");
            event.preventDefault()
            return; // Encerra a função se o usuário cancelar
        } 
        const selects = document.querySelectorAll('select[name="programas_sociais[]"]');
        const programasSociaisSelecionados = [];
        
        // Coleta os valores selecionados, incluindo nulos
        selects.forEach(select => {
            // Adiciona o valor selecionado ou null se não houver seleção
            programasSociaisSelecionados.push(select.value || null);
        });

          // Envia uma requisição POST para a rota /cadastro com os dados do formulário
        fetch('/adminCadastraPessoa', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(data)			
                
        })
        .then(response => response.json())
        .then(data => {
            alert('Pessoa cadastrada com sucesso!');
            // Redireciona para a página home após o cadastro
            window.location.href = '/verPessoas';
        })

        .catch(error => {
            if (error.code === 'ER_DUP_ENTRY') {
                console.error('Erro ao atualizar dados:', error.code);
                alert('Erro: O número de processo já existe. Verifique os dados e tente novamente.');
                window.history.back();
            } else {
                console.error('O número de processo já existe:', error.code);
                window.history.back(); // Volta para a página anterior em caso de erro
                alert('O número de processo já existe.');
            }
        });

    });
}


/*-----PREENCHIMENTO INICIAL DA PÁGINA--------------------------------------------------------------------------------------*/
const paginaAtual = window.location.pathname;
const isCadastro = paginaAtual.includes("Cadastra");
const isEdicao = paginaAtual.includes("editar");

//Ao carregar a página preenche com os dados padrão
if (isCadastro){
    document.addEventListener("DOMContentLoaded", function(){
        carregarDados();

    });
}
function carregarDados(){
    // Busca as opções para o Creas atual
    fetch('/opcoesCreasAtual')
    .then(response => response.json())
    .then(opcoesCreas => {
        // Preenche o select com as opções Creas
        var selectCreas = $('creas_atual');
        opcoesCreas.forEach(opcao => {
            var option = document.createElement('option');
            option.text = opcao.descricao;
            selectCreas.appendChild(option);
        });
    })
    .catch(error => {
        console.error('Erro ao buscar opções Creas:', error);
    });

    // Busca as opções para o Creas de origem
    fetch('/opcoesCreas')
    .then(response => response.json())
    .then(opcoesCreas => {
        // Preenche o select com as opções Creas
        var selectCreas = $('creas_origem');
        opcoesCreas.forEach(opcao => {
            var option = document.createElement('option');
            option.text = opcao.descricao;
            selectCreas.appendChild(option);
        });
    })
    .catch(error => {
        console.error('Erro ao buscar opções Creas:', error);
    });

    // Busca as opções deficiência
    fetch('/opcoesDeficiencia')
    .then(response => response.json())
    .then(opcoesDeficiencia => {
        // Preenche o select com as opções Deficiencia
        var selectDeficiencia = $('deficiencia');
        opcoesDeficiencia.forEach(opcao => {
            var option = document.createElement('option');
            option.text = opcao.descricao;
            selectDeficiencia.appendChild(option);
        });
    })
    .catch(error => {
        console.error('Erro ao buscar opções deficiencia:', error);
    });

    // Busca as opções de Distrito para o serviço
    fetch('/opcoesDistrito')
    .then(response => response.json())
    .then(opcoesDistrito => {
        // Preenche o select com as opções Distrito
        var selectDistrito = $('distrito_servico');
        opcoesDistrito.forEach(opcao => {
            var option = document.createElement('option');
            option.text = opcao.descricao;
            selectDistrito.appendChild(option);
        });
    })
    .catch(error => {
        console.error('Erro ao buscar opções distrito:', error);
    });

    // Busca as opções de Distrito para a pessoa
    fetch('/opcoesDistrito')
    .then(response => response.json())
    .then(opcoesDistrito => {
        // Preenche o select com as opções Distrito
        var selectDistrito = $('distrito_pessoa');
      
         // Adiciona a opção padrão ao novo <select>
         var defaultOption = document.createElement('option');
         defaultOption.value = '';
         defaultOption.text = '';
         selectDistrito.appendChild(defaultOption);

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
        var selectCicloEstudo = $('cicloEstudo');
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
        var selectTipoescola = $('tipoEscola');
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
        var selectEnsinoModalidade = $('ensinoModalidade');
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
         var selectParoudeestudar= $('paroudeEstudar');
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
        var selectEstadoCivil = $('estado_civil');
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
        var selectGenero = $('genero');
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
        var selectMedidasMse = $('medidas_mse');
        opcoesMedidasMse.forEach(opcao => {
            var option = document.createElement('option');
            option.text = opcao.descricao;
            selectMedidasMse.appendChild(option);
        });
    })
    .catch(error => {
        console.error('Erro ao buscar opções MedidasMse:', error);
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
        var selectMSE = $('mse');
        opcoesMSE.forEach(opcao => {
            var option = document.createElement('option');
            option.text = opcao.descricao;
            selectMSE.appendChild(option);
        });
    })
    .catch(error => {
        console.error('Erro ao buscar opções mse:', error);
    });
	
	// Carrega os tipos de local
	fetch('/opcoesTipoLocal')
		.then(response => response.json())
		.then(opcoes => {
			const select = $('tipo_local');
			select.innerHTML = '<option value="">Selecione</option>'; // limpa e adiciona opção padrão
			opcoes.forEach(opcao => {
				const option = document.createElement('option');
				option.value = opcao.descricao; // ou opcao.id se quiser guardar o ID
				option.text = opcao.descricao;
				select.appendChild(option);
			});
		})
		.catch(error => console.error('Erro ao carregar tipo de local:', error));

	 // Carrega os tipos de logradouro
		fetch('/opcoesTipoLogradouro')
			.then(response => response.json())
			.then(opcoes => {
				const select = $('tipo_logradouro');
				select.innerHTML = '<option value="">Selecione</option>'; // limpa e adiciona opção padrão
				opcoes.forEach(opcao => {
					const option = document.createElement('option');
					option.value = opcao.descricao;
					option.text = opcao.descricao;
					select.appendChild(option);
				});
			})
			.catch(error => console.error('Erro ao carregar tipo de logradouro:', error));

		// Carrega as atividades da unidade
		fetch('/opcoesAtividadeUnidade')
			.then(response => response.json())
			.then(opcoes => {
				const select = $('atividade_unidade');

                select.innerHTML = '';

                 // adiciona opção padrão
                var defaultOption = document.createElement('option');
                defaultOption.value = '';
                defaultOption.text = '';
                select.appendChild(defaultOption);

                let outros = null;

                opcoes.forEach(opcao=> {
                    if(opcao.descricao.toUpperCase() === 'OUTROS'){
                        outros = opcao;
                    }else{
                        adicionarOpcao(select, opcao);
                    }
                });
                 // adiciona "Outros" por último
                if (outros) {
                    adicionarOpcao(select, outros);
                }

            })
            .catch(error => console.error('Erro ao carregar atividades da unidade:', error));


            function adicionarOpcao(select, opcao) {
                    var option = document.createElement('option');
                    option.value = opcao.id || opcao.descricao;
                    option.text = opcao.descricao;
                    select.appendChild(option);
            }

			
    // Função para buscar as opções TecRef com base no mse selecionado
    function buscarTecRefPorMse(mseSelecionado) {
        fetch(`/opcoesTecRef?mse=${encodeURIComponent(mseSelecionado)}`)
            .then(response => response.json())
            .then(opcoesTecRef => {
                var selectTecRef = $('tec_ref');
                selectTecRef.innerHTML = ''; // Limpa as opções existentes

                opcoesTecRef.forEach(opcao => {
                    var option = document.createElement('option');
                    option.text = opcao.nome;
                    selectTecRef.appendChild(option);
                });
            })
            .catch(error => {
                console.error('Erro ao buscar opções Técnico de Referência:', error);
            });
    }

    // Adiciona um evento change ao select de MSE
    const mseSelect = $('mse');
    if (mseSelect){
        mseSelect.addEventListener('change', function() {
            var mseSelecionado = this.value; // Obtém o valor selecionado no select mse
            buscarTecRefPorMse(mseSelecionado); // Chama a função para buscar TecRef com base no mse
        });
    }


// Buscar CEP
const btnBuscarCep = $("buscar_cep");

if (btnBuscarCep) {

    btnBuscarCep.addEventListener("click", function (e) {
        e.preventDefault();
        

        const inputCep = $("cep_unidade");
        console.log("Botão clicado", btnBuscarCep);

        if (!inputCep) return;

        const cep = inputCep.value.replace(/\D/g, "");

        if (cep.length !== 8) {
            alert("CEP inválido. Digite um CEP com 8 números.");
            return;
        }
        


        fetch(`https://viacep.com.br/ws/${cep}/json/`)
            .then(response => response.json())
            .then(data => {

                if (!data || data.erro) {
                    alert("CEP não encontrado.");
                    return;
                }

                // Validação São Paulo
                if (data.localidade !== "São Paulo" || data.uf !== "SP") {

                    alert("Este CEP não pertence à cidade de São Paulo.");

                    const tipo = $("tipo_logradouro");
                    const logradouro = $("logradouro_unidade");
                    const bairro = $("bairro_unidade");

                    if (tipo) tipo.value = "";
                    if (logradouro) logradouro.value = "";
                    if (bairro) bairro.value = "";

                    bloquearCamposEndereco(false);
                    return;
                }

                let resultado = { tipo: "", nome: "" };

                const selectTipo = $("tipo_logradouro");

                if (selectTipo && data.logradouro?.trim()) {
                    resultado = extrairTipoLogradouro(data.logradouro);
                }

                const campoTipo = $("tipo_logradouro");
                const campoLogradouro = $("logradouro_unidade");
                const campoBairro = $("bairro_unidade");

                if (campoTipo) campoTipo.value = resultado.tipo || "";
                if (campoLogradouro) campoLogradouro.value = resultado.nome || "";
                if (campoBairro) campoBairro.value = data.bairro || "";

                if (campoLogradouro) campoLogradouro.dispatchEvent(new Event("input"));
                if (campoBairro) campoBairro.dispatchEvent(new Event("input"));

                bloquearCamposEndereco(true);
            })
            .catch(() => {
                alert("Erro ao buscar o CEP.");
            });

    });

}


    // Busca as opções UBS
fetch('/opcoesUbs')
.then(response => response.json())
.then(opcoesUbs => {
    const datalist = $('ubs-list');
    const input = $('ubs-input');
    const hiddenInput = $('ubs');
    
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

    // Busca as opções Nacionalidade
    fetch('/opcoesNacionalidade')
    .then(response => response.json())
    .then(opcoesNacionalidade => {
        // Preenche o select com as opções Nacionalidade
        var selectNacionalidade = $('nacionalidade');
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
        var selectOrientacaoSexual = $('orientacao_sexual');
        opcoesOrientacaoSexual.forEach(opcao => {
            var option = document.createElement('option');
            option.text = opcao.descricao;
            selectOrientacaoSexual.appendChild(option);
        });
    })
    .catch(error => {
        console.error('Erro ao buscar opções OrientacaoSexual:', error);
    });

// Busca as opções de Programas Sociais
fetch('/opcoesProgramasSociais')
    .then(response => response.json())
    .then(opcoesProgramasSociais => {
        var divContainer = $('programas_sociais_container');
        var addButton = $('add_programa_social');
        var removeButton = $('remove_programa_social');

        // Função para criar um novo select
        function criarSelect() {
            var container = document.createElement('div');
            container.className = 'programa-social-container';
            container.style.display = 'flex';  // Alinha os itens horizontalmente
            container.style.alignItems = 'center';  // Alinha verticalmente no centro

            var newSelect = document.createElement('select');
            newSelect.name = 'programas_sociais[]';
            newSelect.className = 'form-select mb-2';

            // Adiciona a opção padrão ao novo <select>
            var defaultOption = document.createElement('option');
            defaultOption.value = '';
            defaultOption.text = 'Selecione um programa social';
            newSelect.appendChild(defaultOption);

            // Preenche o novo <select> com as opções de programas sociais
            opcoesProgramasSociais.forEach(opcao => {
                var option = document.createElement('option');
                option.value = opcao.descricao;
                option.text = opcao.descricao;
                newSelect.appendChild(option);
            });

            // Adiciona evento para verificar duplicatas após a seleção
            newSelect.addEventListener('change', function() {
                var selectedValues = Array.from(divContainer.querySelectorAll('select')).map(select => select.value);

                // Verifica se a opção já foi selecionada
                if (selectedValues.filter(value => value === newSelect.value).length > 1) {
                    alert('Este programa social já foi selecionado.');
                    newSelect.value = '';  // Reseta o valor para a opção padrão
                }
            });

            // Botão de remover
            var removeBtn = document.createElement('button');
            removeBtn.type = 'button';
            removeBtn.className = 'btn btn-danger btn-sm ms-2';
            removeBtn.textContent = 'Remover';
            removeBtn.style.backgroundColor = '#8B0000'; // Cor vermelho escuro
            removeBtn.style.borderColor = '#8B0000';
            removeBtn.style.color = 'white';
            removeBtn.style.marginLeft = '10px'; // Espaço entre o select e o botão

            removeBtn.addEventListener('click', function() {
                var selects = divContainer.querySelectorAll('select');
                if (selects.length > 1) {
                    divContainer.removeChild(container);
                    
                    // Esconde o botão de remover se não houver mais selects
                    if (divContainer.children.length <= 1) {
                        removeButton.style.display = 'none';
                    }
                } else {
                    // Se restar apenas um campo, define o valor para a opção padrão
                    var lastSelect = selects[0];
                    lastSelect.value = '';  // Define o valor padrão
                }
            });

            // Adiciona o select e o botão de remover ao container
            container.appendChild(newSelect);
            container.appendChild(removeBtn);
            divContainer.appendChild(container);
        }

        // Criação e preenchimento do primeiro <select>
        criarSelect();

        // Função para adicionar quebra de linha após o botão
        function adicionarQuebraDeLinha(elemento) {
            var br = document.createElement('br');
            elemento.parentNode.insertBefore(br, elemento.nextSibling);
        }

        // Adiciona a funcionalidade do botão para adicionar mais selects
        addButton.addEventListener('click', function(event) {
            event.preventDefault();  // Previne o comportamento padrão do botão
            var lastSelect = divContainer.lastChild.querySelector('select');
            if (lastSelect && lastSelect.value === '') {
                alert('Selecione um programa social antes de adicionar outro.');
            } else {
                criarSelect();

                // Exibe o botão de remover quando um novo select é adicionado
                removeButton.style.display = 'none';

                // Remove a quebra de linha anterior e adiciona a nova
                var br = document.querySelector('#buttons_container + br');
                if (br) {
                    br.remove();
                }
                adicionarQuebraDeLinha(addButton);
            }
        });

        // Adiciona quebra de linha após o botão de remover
        adicionarQuebraDeLinha(removeButton);
    })
    .catch(error => {
        console.error('Erro ao buscar opções programas_sociais:', error);
    });

    // Busca as opções Raca
    fetch('/opcoesRaca')
    .then(response => response.json())
    .then(opcoesRaca => {
        // Preenche o select com as opções Raca
        var selectRaca = $('raca');
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
        var selectTrabalho = $('trabalho');
        opcoesTrabalho.forEach(opcao => {
            var option = document.createElement('option');
            option.text = opcao.descricao;
            selectTrabalho.appendChild(option);
        });
    })
    .catch(error => {
        console.error('Erro ao buscar opções trabalho:', error);
    });

    // Busca as opções alcool_drogas
    fetch('/opcoesAlcoolDrogas')
    .then(response => response.json())
    .then(opcoesAlcoolDrogas => {
        // Preenche o select com as opções alcool_drogas
        var selectAlcoolDrogas = $('alcool_ou_drogas');
        opcoesAlcoolDrogas.forEach(opcao => {
            var option = document.createElement('option');
            option.text = opcao.descricao;
            selectAlcoolDrogas.appendChild(option);
        });
    })
    .catch(error => {
        console.error('Erro ao buscar opções alcool_drogas:', error);
    });

    // Busca as opções Sas
    fetch('/opcoesSas')
    .then(response => response.json())
    .then(opcoesSas => {
        // Preenche o select com as opções Sas
        var selectSas = $('sas');
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
        var selectServicoFamilia = $('servico_familia');
        opcoesServicoFamilia.forEach(opcao => {
            var option = document.createElement('option');
            option.text = opcao.descricao;
            selectServicoFamilia.appendChild(option);
        });
    })
    .catch(error => {
        console.error('Erro ao buscar opções servico_familia:', error);
    });

    // Busca as opções SituacaoDoProcesso
    fetch('/opcoesSituacaoDoProcesso')
    .then(response => response.json())
    .then(opcoesSituacaoDoProcesso => {
        // Preenche o select com as opções SituacaoDoProcesso
        var selectSituacaoDoProcesso = $('situacao_do_processo');
     
         // Adiciona a opção padrão ao novo <select>
         var defaultOption = document.createElement('option');
         defaultOption.value = '';
         defaultOption.text = '';
         selectSituacaoDoProcesso.appendChild(defaultOption);
        
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
        var selectVaraDaInfancia = $('vara_da_infancia');

         var defaultOption = document.createElement('option');
         defaultOption.value = '';
         defaultOption.text = '';
         selectVaraDaInfancia.appendChild(defaultOption);

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
        // Preenche o select com as opções MSE
        var selectContatos = $('tipo_de_contato');
        selectContatos.innerHTML = '';

        /*-----gambiarra para arrumar depois---------*/
         // Adiciona a opção padrão ao novo <select>
         var defaultOption = document.createElement('option');
         defaultOption.value = '';
         defaultOption.text = '';
         selectContatos.appendChild(defaultOption);
        /*-----gambiarra para arrumar depois---------*/
        /*dica: fazer uma função e passar o select como parametro, fazer em todas e excluir o resect*/

        let outros = null;

        opcoesContatos.forEach(opcao=> {
            if(opcao.descricao.toUpperCase() === 'OUTROS'){
                outros = opcao;
            }else{
                adicionarOpcao(selectContatos, opcao)
            }
        });
        if(outros){
            adicionarOpcao(selectContatos, outros)
        }
        function adicionarOpcao(select, opcao) {
            var option = document.createElement('option');
            option.value = opcao.id || opcao.descricao;
            option.text = opcao.descricao;
            select.appendChild(option);
        }
    })
    .catch(error => {
        console.error('Erro ao buscar opções vulnerabilidades:', error);
    });
}

// Validação de obrigatoriedade – Unidade Acolhedora
document.addEventListener('DOMContentLoaded', function () {

    const camposUnidade = [
        $("tipo_local"),
        $("nome_unidade"),
        $("responsavel_unidade"),
        $("telefone_unidade"),
        $("cep_unidade"),
        $("tipo_logradouro"),
        $("logradouro_unidade"),
        $("numero_unidade"),
        $("bairro_unidade"),
        $("atividade_unidade"),
        $("horario_inicio_unidade"),
        $("horario_fim_unidade"),
        $("horas_psc")
    ].filter(Boolean);


    const complemento = $("complemento_unidade");
    const checkboxesDias = document.querySelectorAll('#dias_semana input[type="checkbox"]');

    function existeAlgumCampoPreenchido() {
        return camposUnidade.some(campo => campo.value && campo.value.trim() !== "");
    }

    function existeAlgumDiaSelecionado() {
        return Array.from(checkboxesDias).some(chk => chk.checked);
    }

    function atualizarObrigatoriedadeUnidade() {
       
        const obrigatorio = existeAlgumCampoPreenchido() || existeAlgumDiaSelecionado();

        camposUnidade.forEach(campo => {
            campo.required = obrigatorio;
        });

        if (complemento) complemento.required = false;

        document.querySelectorAll('.unidade-obrigatorio').forEach(el => {
            el.style.display = obrigatorio ? 'inline' : 'none';
        });
    }
  
    camposUnidade.forEach(campo => {
        campo.addEventListener('input', atualizarObrigatoriedadeUnidade);
        campo.addEventListener('change', atualizarObrigatoriedadeUnidade);
    });


    checkboxesDias.forEach(chk => {
        chk.addEventListener('change', atualizarObrigatoriedadeUnidade);
    });

    atualizarObrigatoriedadeUnidade();
});
const inicio = $('horario_inicio_unidade');
const fim = $('horario_fim_unidade');

function validarHoras() {

    if (!inicio.value || !fim.value) return;

    const [horaInicio, minInicio] = inicio.value.split(":").map(Number);
    const [horaFim, minFim] = fim.value.split(":").map(Number);

    const totalInicio = horaInicio * 60 + minInicio;
    const totalFim = horaFim * 60 + minFim;

    const diferenca = totalFim - totalInicio;

    if (diferenca > 480) { // 8h = 480 minutos
        alert("O intervalo não pode ultrapassar 8 horas.");
        fim.value = "";
    }

    if (diferenca < 0) {
        alert("Horário final não pode ser menor que o inicial.");
        fim.value = "";
    }
}
if (inicio && fim) {
    inicio.addEventListener("change", validarHoras);
    fim.addEventListener("change", validarHoras);
}

function validarDiasUnidadeAcolhedora() {
    const checkboxes = document.querySelectorAll('#dias_semana input[type="checkbox"]');

    const algumMarcado = Array.from(checkboxes).some(chk => chk.checked);

    const camposUnidade = [
        $("tipo_local"),
        $("nome_unidade"),
        $("responsavel_unidade"),
        $("telefone_unidade"),
        $("cep_unidade"),
        $("tipo_logradouro"),
        $("logradouro_unidade"),
        $("numero_unidade"),
        $("bairro_unidade"),
        $("atividade_unidade"),
        $("horario_inicio_unidade"),
        $("horario_fim_unidade"),
        $("horas_psc")
    ].filter(Boolean);

    const algumCampoPreenchido = camposUnidade.some(c => c.value && c.value.trim() !== "");

    if (algumCampoPreenchido && !algumMarcado) {
        alert("Selecione pelo menos um dia da semana.");
        return false;
    }

    return true;
}

/*-----CANCELAR----------------------------------------------------------------------------------------------------------*/
const btnCancelar = $('cancelar');
if(btnCancelar){
    btnCancelar.addEventListener('click', function() {
        window.location.href = '/verPessoas'; // Redireciona para a página de consulta ao clicar em Cancelar
    });
}
    
/*-----CONFIRMAÇÃO DE LOGOUT----------------------------------------------------------------------------------------------------------*/

// Função para confirmar logout
function confirmLogout() {
    if (confirm("Tem certeza que deseja encerrar a sessão?")) {
        window.location.href = '/logout'; // Redireciona para a rota de logout se o usuário confirmar
    } else {
        // Se o usuário cancelar, não faz nada
        // Você pode adicionar algum feedback aqui se preferir
    }
}

//Preenchimento para teste

document.addEventListener("DOMContentLoaded", function () {

    const btnTeste = $("btnPreencherTeste");
    if (!btnTeste) return;

    btnTeste.addEventListener("click", function () {

        const form = $("editar-form");
        if (!form) {
            alert("Formulário não encontrado");
            return;
        }

        /* =====================================================
           FUNÇÃO AUXILIAR PARA SETAR VALOR + EVENTOS
        ===================================================== */
        function setValor(id, valor) {
            const campo = $(id);
            if (!campo) return;

            campo.value = valor;
            campo.dispatchEvent(new Event("input"));
            campo.dispatchEvent(new Event("change"));
            campo.dispatchEvent(new Event("blur"));
        }

        /* =====================================================
           CAMPOS ESPECÍFICOS (COM MÁSCARA / REGRA)
        ===================================================== */

        // CPF → 905.354.450-08
        setValor("cpf", "90535445008");

        // Cartão SUS
        setValor("cartao_sus", "254354343483434");

        // NIS
        setValor("nis", "15435445416");

        // Processo de execução (com máscara automática)
        setValor("n_processo", "34534834534535434834");

        // Processo de apuração
        setValor("n_processo_apuracao", "4533435354387338353463393");

        // Pasta técnica
        setValor("n_pt", "25434");

        // Número do endereço
        setValor("numero", "25");

        // CEP principal
        setValor("cep", "05143320");

        // RA
        setValor("numeroRa", "52482348384");

        // Horas PSC
        setValor("horas_psc", "3");

        // Unidade acolhedora
        setValor("numero_unidade", "45");

        /* =====================================================
           SELECT FIXO DO SMSE-MA
        ===================================================== */
        const mseSelect = $("mse");
        if (mseSelect) {
            mseSelect.value = "SMSE-MA CIAP LAJEADO";
            mseSelect.dispatchEvent(new Event("change"));
        }

        /* =====================================================
           TELEFONES (usa sua validação existente)
        ===================================================== */
        document.querySelectorAll(".telefone-br").forEach(tel => {
            tel.value = "(11) 91234-5678";
            tel.dispatchEvent(new Event("input"));
            tel.dispatchEvent(new Event("blur"));
        });

        /* =====================================================
           PREENCHIMENTO GENÉRICO (SÓ O QUE ESTIVER VAZIO)
        ===================================================== */
        form.querySelectorAll("input").forEach(input => {

            if (input.type === "hidden") return;
            if (input.readOnly) return;
            if (input.value && input.value.trim() !== "") return;

            switch (input.type) {
                case "text":
                    input.value = "Teste";
                    break;
                case "email":
                    input.value = "teste@teste.com";
                    break;
                case "date":
                    input.value = "2008-05-10";
                    break;
                case "time":
                    input.value = "08:00";
                    break;
                case "number":
                    input.value = "1";
                    break;
            }

            input.dispatchEvent(new Event("input"));
            input.dispatchEvent(new Event("change"));
        });

        /* =====================================================
           TEXTAREAS
        ===================================================== */
        form.querySelectorAll("textarea").forEach(textarea => {
            if (textarea.value && textarea.value.trim() !== "") return;
            textarea.value = "Texto de teste automático";
            textarea.dispatchEvent(new Event("input"));
        });

        /* =====================================================
           SELECTS (IGNORA OS VAZIOS / FETCH)
        ===================================================== */
        form.querySelectorAll("select").forEach(select => {

            if (select.options.length <= 1) return;
            if (select.value && select.value !== "") return;

            for (let option of select.options) {
                if (option.value !== "") {
                    select.value = option.value;
                    break;
                }
            }

            select.dispatchEvent(new Event("change"));
        });

        alert("Formulário preenchido automaticamente para teste ✅");
    });
});  

