import { $,$$, on, somenteLetras, somenteNumeros, upperTrim, validarObrigatoriosAutomatico, limparCampos, validarDocumento } from "../../admin/helpers.js";
import { toggleCampo } from "../../admin/formRules.js";
import { aplicarMascaraCEP, aplicarMascaraProcesso } from "../../admin/mascaras.js";
import { 
    validarCPF, 
    validaCartao_sus, 
    validarNome, 
    validarEmail, 
    validarData, 
    validarTelefone,
    verificarComprimentoNProcesso,
} from "../../admin/validacoes.js";

import { buscarCep } from "../../admin/formRules.js";
import { popularSelect } from "../../admin/fetchSelects.js";



console.log("JS CARREGADO");
console.log("carregarDados vai rodar?");
console.log("popularSelect:", popularSelect);

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
    if(cpfInput){
        cpfInput.addEventListener("blur", function () {
        if (!validarCPF(this.value)) {
            alert("CPF inválido");
            this.focus();
            }
        });
    }
    
    const emailInput = $("email");
    if(emailInput){
        emailInput.addEventListener("blur", function () {
            if (!validarEmail(this.value)) {
                alert("Email inválido");
                this.focus();
            }
        });
    }

    // const nisInput = $("nis");
    // nisInput.addEventListener("blur", function () {
    //     if (!validarNis(this.value)) {
    //         alert("nis inválido");
    //         this.focus();
    //     }
    // });

    const cartaoSusInput = $("cartao_sus");
    if(cartaoSusInput){
        cartaoSusInput.addEventListener("blur", function () {
            if (!validaCartao_sus(this.value)) {
                alert("Cartão SUS inválido");
                this.focus();
            }
        });
    }

    const telefoneInput = $("telefone");
    if(telefoneInput){
        telefoneInput.addEventListener("blur", function () {
            if (!validarTelefone(this.value)) {
                alert("Telefone inválido");
                this.focus();
            }
        });
    }

    const nomeInput = $("nome");
    if(nomeInput){
    nomeInput.addEventListener("blur", function () {
        if (!validarNome(this.value)) {
            alert("Nome inválido");
            this.focus();
        }
        });
    }

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
const nProcessoInput = $('n_processo');
console.log("nProcessoInput:", nProcessoInput);
aplicarMascaraProcesso(nProcessoInput);


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
    "horas_psc",
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
    $("medicamentos_controlados")?.addEventListener("change", checkMedicamentosControlados);
    $("faz_uso_de_medicamentos")?.addEventListener("change", checkMedicamentos);
    $("possui_demanda_saude")?.addEventListener("change", checkDemandaSaude);
    $("possui_demanda_saude_mental")?.addEventListener("change", checkDemandaSaudeMental);
    $("tec_ref")?.addEventListener("change", checkTecRef);

    checkSexo();
    checkDeficiencia();
    checkMedicamentos();
    checkMedicamentosControlados();
    checkCurso();

});

function checkSexo() {
    const sexo = document.getElementById("sexo")?.value;
    console.log("valor sexo:", sexo);

    if (!sexo) return;

    if (sexo === "F") {
        toggleCampo("sexo", "gestante", "F", true);
        toggleCampo("sexo", "lactante", "F", true);

        // desativa parceiro gestante
        const parceiro = $("parceira_gestante");
        parceiro.value = "";
        parceiro.disabled = true;
        parceiro.required = false;

    } else if (sexo === "M") {
        toggleCampo("sexo", "parceira_gestante", "M", true);

        // desativa gestante/lactante
        ["gestante", "lactante"].forEach(id => {
            const campo = $(id);
            campo.value = "";
            campo.disabled = true;
            campo.required = false;
        });
    }

}

function checkDeficiencia() {
    toggleCampo("possui_deficiencia", "deficiencia", "1", true);
}

function checkMedicamentos() {
    toggleCampo("faz_uso_de_medicamentos", "medicamentos", "1", true);
}

function checkMedicamentosControlados() {
    toggleCampo("medicamentos_controlados", "medicamentos_controlado", "1", true)
}

function checkDemandaSaude() {
    toggleCampo("possui_demanda_saude", "saude", "1", true);
}

function checkDemandaSaudeMental() {
    toggleCampo("possui_demanda_saude_mental", "saude_mental", "1", true);
}
// function checkCadUnico() {
//     toggleCampo("cad_unico", "cad_unico", "1", true);
// }
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

document.addEventListener("DOMContentLoaded", () => {
    carregarDados();

});

function carregarDados(){
    console.log("CARREGAR DADOS EXECUTOU");
    // Busca as opções para o Creas atual
    popularSelect({ url: "/opcoesCreasAtual", selectId: "creas_atual", addDefault: true, defaultText: "Selecione" });
    // Busca as opções para o Creas de origem
    popularSelect({ url: "/opcoesCreas", selectId: "creas_origem", addDefault: true, defaultText: "Selecione" });
    // Busca as opções deficiência
    popularSelect({ url: "/opcoesDeficiencia", selectId: "deficiencia", addDefault: true, defaultText: "Selecione" });
    // Busca as opções de Distrito para o serviço
    popularSelect({ url: "/opcoesDistrito", selectId: "distrito_servico", addDefault: true, defaultText: "Selecione" });
    // Busca as opções de Distrito para a pessoa
    popularSelect({ url: "/opcoesDistrito", selectId: "distrito_pessoa", addDefault: true, defaultText: "Selecione"});
    // Busca as opções Ciclo Estudo 
    popularSelect({ url: "/opcoesCicloEstudo", selectId: "cicloEstudo", addDefault: true, defaultText: "Selecione" });
    // Busca as opções Tipo Escola
    popularSelect({ url: "/opcoesTipoescola", selectId: "tipoEscola", addDefault: true, defaultText: "Selecione" });
    // Busca as opções ensinoModalidade
    popularSelect({ url: "/opcoesEnsinoModalidade", selectId: "ensinoModalidade", addDefault: true, defaultText: "Selecione" });
    // Busca as opções de Parou de estudar
     popularSelect({ url: "/opcoesParoudeestudar", selectId: "paroudeEstudar", addDefault: true, defaultText: "Selecione" });
    // Busca as opções EstadoCivil
    popularSelect({ url: "/opcoesEstadoCivil", selectId: "estado_civil", addDefault: true, defaultText: "Selecione"});
    // Busca as opções Genero
    popularSelect({ url: "/opcoesGenero", selectId: "genero", addDefault: true, defaultText: "Selecione"});
    // Busca as opções MedidasMse
    popularSelect({ url: "/opcoesMedidasMse", selectId: "medidas_mse", addDefault: true, defaultText: "Selecione"});
    // Busca as opções Raca
    popularSelect({url: "/opcoesraca", selectId: "raca", addDefault: true, defaultText: "Selecione"});
    // Busca as opções trabalho
    popularSelect({ url: "/opcoesTrabalho", selectId: "trabalho", addDefault: true, defaultText: "Selecione"});
    // Busca as opções alcool_drogas
    popularSelect({ url: "/opcoesAlcoolDrogas", selectId: "alcool_ou_drogas", addDefault: true, defaultText: "Selecione" });
    // Busca as opções Nacionalidade
    popularSelect({url: "/opcoesNacionalidade", selectId: "nacionalidade", addDefault: true, defaultText: "Selecione" });

    // Busca as opções OrientacaoSexual
    popularSelect({url: "/opcoesOrientacaoSexual", selectId: "orientacao_sexual", addDefault: true, defaultText: "Selecione" });

    // Busca as opções Sas
    popularSelect({ url: "/opcoesSas", selectId: "sas",  addDefault: true, defaultText: "Selecione" });
   // Busca as opções MSE
   popularSelect({
        url: "/opcoesMse",
        selectId: "mse",
        textKey: "descricao",
        valueKey: "descricao", // mantém como antes
        addDefault: true,
        defaultText: "Selecione",
        filterFn: opcao => 
            opcao.descricao !== "ADMINISTRADORES DO SISTEMA"
    });
	
	// Carrega os tipos de local
    popularSelect({
        url: "/opcoesTipoLocal",
        selectId: "tipo_local",
        addDefault: true,
        defaultText: "Selecione",
        valueKey: "descricao",
        textKey: "descricao"
    });

	 // Carrega os tipos de logradouro
     popularSelect({
        url: "/opcoesTipoLogradouro",
        selectId: "tipo_logradouro",
        addDefault: true,
        defaultText: "Selecione",
        valueKey: "descricao",
        textKey: "descricao"
    });

	// Carrega as atividades da unidade
	popularSelect({
        url: "/opcoesAtividadeUnidade",
        selectId: "atividade_unidade",
        addDefault: true,        // adiciona option vazia
        valueKey: "id",          // usa id como value
        textKey: "descricao",
        defaultText: "Selecione",
        sortFn: (a, b) => {
            if (a.descricao.toUpperCase() === "OUTROS") return 1;
            if (b.descricao.toUpperCase() === "OUTROS") return -1;
            return a.descricao.localeCompare(b.descricao);
        }
    });
			
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
const btnBuscarCepPessoa = $("buscar_cep_pessoa");

if (btnBuscarCepPessoa) {

    btnBuscarCepPessoa.addEventListener("click", function (e) {
        e.preventDefault();
        

        const inputCep = $("cep");
        console.log("Botão clicado", btnBuscarCepPessoa);

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

                    const rua = $("rua");
                    const bairro_pessoa = $("bairro");

                    if (rua) rua.value = "";
                    if (bairro_pessoa) bairro_pessoa.value = "";

                    bloquearCamposEndereco(false);
                    return;
                }

                

                const campoRua = $("rua");
                const campoBairroPessoa = $("bairro");

                if (campoRua) campoRua.value = data.logradouro || "";
                if (campoBairroPessoa) campoBairroPessoa.value = data.bairro || "";

                if (campoRua) campoRua.dispatchEvent(new Event("input"));
                if (campoBairroPessoa) campoBairroPessoa.dispatchEvent(new Event("input"));

                bloquearCamposEndereco(true);
            })
            .catch(() => {
                alert("Erro ao buscar o CEP.");
            });

    });

}

// Buscar CEP
const btnBuscarCep = $("buscar_cep");

if (btnBuscarCep) {
    btnBuscarCep.addEventListener("click", async function (e) {
        e.preventDefault();

        const inputCep = document.getElementById("cep_unidade");
        if (!inputCep) return;

        const cepValido = validarCep(inputCep.value);

        if (!cepValido) {
            alert("CEP inválido. Digite 8 números.");
            return;
        }

        try {
            const data = await buscarCep(cepValido);

            // 🔹 Validação São Paulo
            if (data.localidade !== "São Paulo" || data.uf !== "SP") {
                alert("Este CEP não pertence à cidade de São Paulo.");

                $("tipo_logradouro").value = "";
                $("logradouro_unidade").value = "";
                $("bairro_unidade").value = "";

                bloquearCamposEndereco(false);
                return;
            }

            // 🔹 Preenchimento
            const campoTipo = $("tipo_logradouro");
            const campoLogradouro = $("logradouro_unidade");
            const campoBairro = $("bairro_unidade");

            if (campoTipo) campoTipo.value = data.tipo_logradouro || "";
            if (campoLogradouro) campoLogradouro.value = data.logradouro || "";
            if (campoBairro) campoBairro.value = data.bairro || "";

            bloquearCamposEndereco(true);

        } catch (error) {
            alert(error.message || "Erro ao buscar CEP.");
        }
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
    popularSelect({
        url: "/opcoesSituacaoDoProcesso",
        selectId: "situacao_do_processo",
        addDefault: true
    });

    // Busca as opções VaraDaInfancia
    popularSelect({
        url: "/opcoesVaraDaInfancia",
        selectId: "vara_da_infancia",
        addDefault: true
    });

    //opções de contatos
    popularSelect({
        url: "/opcoesContatos",
        selectId: "tipo_de_contato",
        valueKey: "id",              // usa id como value
        textKey: "descricao",
        addDefault: true,            // adiciona option vazia
        sortFn: (a, b) => {
            // força OUTROS para o final
            if (a.descricao.toUpperCase() === "OUTROS") return 1;
            if (b.descricao.toUpperCase() === "OUTROS") return -1;
            return a.descricao.localeCompare(b.descricao);
        }
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




