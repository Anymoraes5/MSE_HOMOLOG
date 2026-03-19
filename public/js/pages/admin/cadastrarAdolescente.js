import { $, $$, on, somenteLetras, somenteNumeros, upperTrim, validarObrigatoriosAutomatico, limparCampos, validarDocumento } from "../../shared/helpers.js";
import { toggleCampo, toggleCampoPorMultiplos } from "../../shared/formRules.js";
import { aplicarMascaraCEP, aplicarMascaraProcesso } from "../../shared/mascaras.js";
import { 
    validarCPF, 
    validaCartao_sus, 
    validarNome, 
    validarEmail, 
    validarData,
    validarCep,
    validarTelefone,
    verificarComprimentoNProcesso,
} from "../../shared/validacoes.js";

import { buscarCepGenerico } from "../../shared/formRules.js";
import { popularSelect } from "../../shared/fetchSelects.js";


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


function validarCaracteresPermitidos(elementId, allowedCharacters) {
    // ← Substitua as chamadas de validarCaracteresPermitidos por isso:
    const camposNome = ["nome", "nome_social", "nome_da_mae", "nome_do_pai",
                        "nome_responsavel", "responsavel_unidade", "nome_do_contato"];

    const letrasPermitidas = "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZàáâãäéêëíîïóôõöúüçñÀÁÂÃÄÉÊËÍÎÏÓÔÕÖÚÜÇÑ '-";

    document.addEventListener('keydown', function(e) {
        if (!camposNome.includes(e.target.id)) return;
        if (e.ctrlKey || e.metaKey || e.altKey) return;
        if (['Backspace','Delete','ArrowLeft','ArrowRight','ArrowUp',
            'ArrowDown','Tab','Enter','Home','End'].includes(e.key)) return;
        if (!letrasPermitidas.includes(e.key)) e.preventDefault();
    });

    document.addEventListener('paste', function(e) {
        if (!camposNome.includes(e.target.id)) return;
        e.preventDefault();
        const texto = (e.clipboardData || window.clipboardData).getData('text');
        const limpo = texto.split('').filter(c => letrasPermitidas.includes(c)).join('');
        document.execCommand('insertText', false, limpo);
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
const letras = "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZàáâãäéêëíîïóôõöúüçñÀÁÂÃÄÉÊËÍÎÏÓÔÕÖÚÜÇÑ '-";
const letrasComParenteses = letras + "()";
const numeros = "0123456789";

// Campos de nome — sem parênteses
["nome", "nome_social", "nome_da_mae", "nome_do_pai",
 "nome_responsavel", "responsavel_unidade", "nome_do_contato"
].forEach(id => validarCaracteresPermitidos(id, letras));

// Campos de endereço/outros — com parênteses
["logradouro_unidade", "saude", "medicamentos",
 "n_pt", "bairro", "bairro_unidade", "rua"
].forEach(id => validarCaracteresPermitidos(id, letrasComParenteses));

[
    "cpf", "cartao_sus", "numero_unidade",
    "telefone_unidade","numero_unidade",
    "cep_unidade", "horas_psc", "numeroRa",
    "n_processo", "n_processo_apuracao",
    "numero", "telefone",
].forEach(id => validarCaracteresPermitidos(id, numeros));

/*----as funções de check são chamadas dentro da tag html com o evento que verifica mudanças no campo---*/
document.addEventListener("formReady", () => {

    $("sexo")?.addEventListener("change", checkSexo);
    // $("cad_unico")?.addEventListener("change", checkCadUnico);
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
    $("alcool_ou_drogas")?.addEventListener("change", checkCaps);

    // Garante que os asteriscos condicionais iniciem ocultos
    const camposCondicionais = [
        "listar_cursos",
        "deficiencia",
        "medicamentos",
        "saude",
        "saude_mental",
        "servico_familia",
        "trabalho",
        "gestante",
        "lactante",
        "parceira_gestante",
    ];

    camposCondicionais.forEach(campoId => {
        const label = document.querySelector(`label[for="${campoId}"]`);
        const asterisco = label?.querySelector(".red-asterisk");
        if (asterisco) asterisco.style.display = "none";
    });

    checkSexo();

    checkDeficiencia();
    checkMedicamentos();
    checkMedicamentosControlados();
    checkDemandaSaude();
    checkCurso();
    checkCaps();

});

function checkSexo() {
    toggleCampo("sexo", "gestante", "F", true);
    toggleCampo("sexo", "lactante", "F", true);
    toggleCampo("sexo", "parceira_gestante", "M", true);
}

function checkDemandaSaude() {
    toggleCampo("possui_demanda_saude", "saude", "1", true);
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

function checkDemandaSaudeMental() {
    toggleCampo("possui_demanda_saude_mental", "saude_mental", "1", true);
    checkCaps();
}

function checkCaps(){
    const saudeMental = $("possui_demanda_saude_mental")?.value;
    const alcool = $("alcool_ou_drogas")?.value;
    const caps = $("caps");

    if (!caps) return;

    const ativar = 
    saudeMental === "1" || (alcool && alcool != "Não") ;

    if (ativar) {
        caps.disabled = false;
        caps.required = true;
    } else {
        caps.value = "";
        caps.disabled = true;
        caps.required = false;
    }

}
// function checkCadUnico() {
//     toggleCampo("cad_unico", "cad_unico", "1", true);
// }
function checkMatriculado() {

    const campoMatriculado = $("matriculado");
    if (!campoMatriculado) return;

    const matriculado = campoMatriculado.value;

    const tipoEscola = $("tipoEscola");
    const ensinoModalidade = $("ensinoModalidade");
    const cicloEstudo = $("cicloEstudo");
    const frequenciaAula = $("frequenciaAula");
    const concluiuCurso = $("concluiuCurso");
    const paroudeEstudar = $("paroudeEstudar");

    if (!tipoEscola || !ensinoModalidade || !cicloEstudo ||
        !frequenciaAula || !concluiuCurso || !paroudeEstudar) return;

    // Habilita tudo primeiro
    tipoEscola.disabled = false;
    ensinoModalidade.disabled = false;
    cicloEstudo.disabled = false;
    frequenciaAula.disabled = false;
    concluiuCurso.disabled = false;
    paroudeEstudar.disabled = false;

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

    const campoMse = $("mse");
    const tec_ref = $("tec_ref");

    if (!campoMse || !tec_ref) return;

    const mse = campoMse.value;

    if (mse === "") {
        tec_ref.value = "";
        tec_ref.disabled = true;
    } else {
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
document.addEventListener('change', function(e) {
    
    if (e.target.id === 'dt_nasc') {
        
        if (!e.target.value) return;

        const birthDate = new Date(e.target.value);
        const today = new Date();

        let age = today.getFullYear() - birthDate.getFullYear();
        const monthDiff = today.getMonth() - birthDate.getMonth();

        if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthDate.getDate())) {
            age--;
        }

        const campoIdade = document.getElementById('idade');
        if (campoIdade) {
            campoIdade.value = age;
        }
    }
});

/*-----CADASTRAR----------------------------------------------------------------------------------------------------------*/


   document.addEventListener("submit", function(event){

    if(event.target && event.target.id === "editar-form"){
        console.log("SUBMIT DISPAROU — MSE no DOM:", document.getElementById('mse').value);
        event.preventDefault();

        document.getElementById('creas_atual')?.removeAttribute('disabled');
        document.getElementById('sas')?.removeAttribute('disabled');
        document.getElementById('mse')?.removeAttribute('disabled');

        

        const form = event.target;
        const formData = new FormData(form);
        
        const data = Object.fromEntries(formData.entries());

        
        data['programas_sociais[]'] = formData.getAll('programas_sociais[]');


        console.log("MSE no data:", data.mse);
        console.log("CREAS no data:", data.creas_atual);
        console.log("SAS no data:", data.sas);

        

        // formData.forEach((value, key) => {

        //     if (data[key]) {
        //         if (!Array.isArray(data[key])) {
        //             data[key] = [data[key]];
        //         }
        //         data[key].push(value);
        //     } else {
        //         data[key] = value;
        //     }

        // });

        //=====================validar idade==================================
        const dt = document.getElementById("dt_nasc")?.value;
        
        if (dt) {

            const birthDate = new Date(dt);
            const today = new Date();

            let age = today.getFullYear() - birthDate.getFullYear();
            const monthDiff = today.getMonth() - birthDate.getMonth();

            if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthDate.getDate())) {
                age--;
            }

            

            if (age < 12 || age > 21) {
                alert("A idade deve estar entre 12 e 21 anos na data do cadastro.");
                document.getElementById("dt_nasc").focus();
                return;
            }
        }
       
        if (!validarDiasUnidadeAcolhedora()) {
			event.preventDefault();
			return;
		}
        //====================valida data de relatorio
        const dtInterpretacao = $("dt_interpretacao_medida")?.value;
        const dtRelatorio = $("dt_ultimo_relatorio_enviado")?.value;

        if (dtInterpretacao && dtRelatorio) {

            const dataInterpretacao = new Date(dtInterpretacao);
            const dataRelatorio = new Date(dtRelatorio);

            if (dataRelatorio <= dataInterpretacao) {
                alert("A data do relatório deve ser posterior à data da interpretação.");
                $("dt_ultimo_relatorio_enviado").focus();
                return;
            }
        }
        //===============================horario inicio e fim ========================
        const inicio = $("horario_inicio_unidade")?.value;
        const fim = $("horario_fim_unidade")?.value;

            if (inicio && fim) {
                const [horaInicio, minInicio] = inicio.split(":").map(Number);
                const [horaFim, minFim] = fim.split(":").map(Number);

                const totalInicio = horaInicio * 60 + minInicio;
                const totalFim = horaFim * 60 + minFim;

                const diferenca = totalFim - totalInicio;

                if (diferenca > 480) { // mais de 8 horas
                    alert("O intervalo entre início e fim da unidade não pode ultrapassar 8 horas.");
                    $("horario_fim_unidade").focus();
                    event.preventDefault();
                    return;
                }

                if (diferenca < 0) { // horário final antes do inicial
                    alert("O horário final não pode ser menor que o horário de início.");
                    $("horario_fim_unidade").focus();
                    event.preventDefault();
                    return;
                }
            
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
        
        //======================pegar campos do form ===================
        


        if (!confirm("Tem certeza que deseja cadastrar a pessoa?")) {
            alert("Operação cancelada");
            event.preventDefault()
            return; // Encerra a função se o usuário cancelar
        } 
        /*-----CANCELAR----------------------------------------------------------------------------------------------------------*/
        const btnCancelar = $('cancelar');
        if(btnCancelar){
            btnCancelar.addEventListener('click', function() {
                window.location.href = '/verPessoas'; // Redireciona para a página de consulta ao clicar em Cancelar
                
            });
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
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(data)
        })
        .then(response => {
            return response.json().then(data => ({ ok: response.ok, status: response.status, body: data }));
        })
        .then(({ ok, status, body }) => {

            if (!ok) {
                const mensagens = {
                    'ER_DUP_ENTRY':                                      'Este número de processo já está cadastrado no sistema.',
                    'CPF inválido.':                                      'O CPF informado é inválido. Verifique e tente novamente.',
                    'Telefone inválido! Deve ter 10 ou 11 dígitos.':      'O telefone informado é inválido. Use 10 ou 11 dígitos.',
                    'CEP inválido! Deve ter 8 dígitos.':                  'O CEP informado é inválido. Deve ter 8 dígitos.',
                    'Nome do responsável inválido.':                      'O nome do responsável contém caracteres inválidos.',
                    'Número do logradouro inválido.':                     'O número do logradouro é inválido.',
                    'Tipo de logradouro inválido.':                       'O tipo de logradouro selecionado é inválido.',
                    'Erro ao verificar processo.':                        'Erro de conexão ao verificar o processo. Tente novamente.',
                    'Erro ao inserir processo.':                          'Erro ao salvar o processo. Tente novamente.',
                    'Erro ao inserir dados de contato.':                  'Erro ao salvar os dados de contato. Tente novamente.',
                    'Erro ao salvar unidade acolhedora.':                 'Erro ao salvar a unidade acolhedora. Tente novamente.',
                    'Erro ao criar vínculo.':                             'Erro ao vincular adolescente à unidade. Tente novamente.',
                    'Erro ao finalizar cadastro.':                        'Erro ao finalizar o cadastro. Tente novamente.',
                };

                const mensagem = mensagens[body.error] || 'Ocorreu um erro inesperado. Tente novamente mais tarde.';
                alert(mensagem);
                return;
            }

            alert('Pessoa cadastrada com sucesso!');
            window.location.href = '/verPessoas';
        })
        .catch(error => {
            console.error('Erro:', error);
            alert('Não foi possível conectar ao servidor. Verifique sua conexão e tente novamente.');
        });

    }
});


document.addEventListener("click", function (e) {

    if (e.target.closest("#buscar_cep_pessoa")) {
        buscarCepGenerico({
            cepId: "cep",
            ruaId: "rua",
            bairroId: "bairro"
        });
    }

    if (e.target.closest("#buscar_cep")) {
        buscarCepGenerico({
            cepId: "cep_unidade",
            ruaId: "logradouro_unidade",
            bairroId: "bairro_unidade"
        });
    }
});

/*-----PREENCHIMENTO INICIAL DA PÁGINA--------------------------------------------------------------------------------------*/
const paginaAtual = window.location.pathname;
const isCadastro = paginaAtual.includes("Cadastra");
const isEdicao = paginaAtual.includes("editar");

//Ao carregar a página preenche com os dados padrão

document.addEventListener("DOMContentLoaded", function() {
    carregarDados();
});

function carregarDados(){
    
    // // Busca as opções para o Creas atual
    popularSelect({ url: "/opcoesCreasAtual", selectId: "creas_atual", valueKey: "ID", textKey: "descricao", addDefault: true, defaultText: "Selecione" });
    // Busca as opções para o Creas de origem
    popularSelect({ url: "/opcoesCreas", selectId: "creas_origem", addDefault: true, defaultText: "Selecione" });
    // Busca as opções deficiência
    popularSelect({ url: "/opcoesDeficiencia", selectId: "deficiencia", addDefault: true, defaultText: "Selecione" });
    // Busca as opções de Distrito para o serviço
    // popularSelect({ url: "/opcoesDistrito", selectId: "distrito_servico", addDefault: true, defaultText: "Selecione" });
    // // Busca as opções de Distrito para a pessoa
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
    popularSelect({ url: "/opcoesSas", selectId: "sas", valueKey: "ID" , textKey: "descricao", addDefault: true, defaultText: "Selecione" });
    



    
   // Busca as opções MSE
   popularSelect({
        url: "/opcoesMse",
        selectId: "mse",
        textKey: "descricao",
        valueKey: "ID", 
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
        valueKey: "descricao",       
        textKey: "descricao",
        defaultText: "Selecione",
        sortFn: (a, b) => {
            if (a.descricao.toUpperCase() === "OUTROS") return 1;
            if (b.descricao.toUpperCase() === "OUTROS") return -1;
            return a.descricao.localeCompare(b.descricao);
        }
    });
			




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
    if (!datalist || !input || !hiddenInput) return;
    
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

        const reencontro_block = "AUXÍLIO REENCONTRO";
        const reencontro_block1 = "AUXÍLIO REENCONTRO FAMÍLIA";

        const BOLSA_TRABALHO = "BOLSA TRABALHO";

        const BLOQUEADOS_COM_BOLSA = [
            "PRIMEIRO EMPREGO",
            "PROGRAMA JOVEM APRENDIZ",
            "PROGRAMA OPERAÇÃO TRABALHO",
            "PROGRAMA TEM SAÍDA - PORTARIA SMTE 25/2018",
            "PROGRAMA TRANSCIDADANIA",
            "RENDA MÍNIMA",
            "TRABALHO NOVO"
        ];

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
                
                const selectedValues = Array
                    .from(divContainer.querySelectorAll('select'))
                    .map(select => select.value)
                    .filter(v => v !== "");

                const valorAtual = newSelect.value;

                
                if (
                    selectedValues.includes(reencontro_block) &&
                    selectedValues.includes(reencontro_block1)
                ) {
                    alert('Auxílio Reencontro não pode ser selecionado com Auxílio Reencontro Família.');
                    newSelect.value = '';
                    return;
                }

                
                const temBolsa = selectedValues.includes(BOLSA_TRABALHO);
                const temBloqueado = selectedValues.some(v => BLOQUEADOS_COM_BOLSA.includes(v));

                if (temBolsa && temBloqueado) {
                    alert('Bolsa de Trabalho não pode ser selecionado com o(s) programa(s) adicionado');
                    newSelect.value = '';
                    return;
                }

                
                if (selectedValues.filter(value => value === valorAtual).length > 1) {
                    alert('Este programa social já foi selecionado.');
                    newSelect.value = '';
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

    
    // Carrega os tipos de local
    popularSelect({
        url: "/opcoesServicoFamilia",
        selectId: "servico_familia",
        addDefault: true,
        defaultText: "Selecione",
        valueKey: "descricao",
        textKey: "descricao"
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
        valueKey: "descricao",              // usa id como value
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
 function buscarTecRefPorMse(idOuDescricao) {
    console.log("FUNÇÃO CHAMADA buscarTecRefPorMse", idOuDescricao);

    fetch(`/opcoesTecRef?mse=${encodeURIComponent(idOuDescricao)}`)
        .then(response => response.json())
        .then(opcoesTecRef => {
            const selectTecRef = document.getElementById('tec_ref');
            if (!selectTecRef) return;
            selectTecRef.innerHTML = '';

            opcoesTecRef.forEach(opcao => {
                const option = document.createElement('option');
                option.text = opcao.nome;
                selectTecRef.appendChild(option);
            });
        })
        .catch(error => {
            console.error('Erro ao buscar opções Técnico de Referência:', error);
        });
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

        console.log("DADOS DO MSE:", dados);

        // // Aguarda o popularSelect do CREAS terminar antes de setar
        // await popularSelect({ 
        //     url: "/opcoesCreasAtual", 
        //     selectId: "creas_atual", 
        //     valueKey: "ID",
        //     textKey: "descricao",
        //     addDefault: true, 
        //     defaultText: "Selecione" 
        // });

        const selectCreas = document.getElementById('creas_atual');
        if (selectCreas && dados.creas_id) {
            selectCreas.value    = dados.creas_id;
            selectCreas.disabled = true;
            console.log("CREAS SETADO PARA:", selectCreas.value);
        }

        const selectSas = document.getElementById('sas');
        if (selectSas && dados.sas_ids.length > 0) {
            selectSas.value    = dados.sas_ids[0];
            selectSas.disabled = true;
            console.log("SAS SETADA PARA:", selectSas.value);
            selectSas.dispatchEvent(new Event('change', { bubbles: true }));
        }

    } catch (err) {
        console.error('Erro ao buscar dados do MSE:', err);
    }
}

// Listener unificado do MSE
document.addEventListener("change", function(e) {
    if (e.target && e.target.id === "mse") {
        const idMse = e.target.value;
        const descricaoMse = e.target.options[e.target.selectedIndex].text; 
        preencherCreasSasPorMse(idMse);
        buscarTecRefPorMse(descricaoMse); 
    }
});
    function carregarDistritoServicoPorSas(idSas) {
        
        if (!idSas) {
            resetSelectField("distrito_servico");
            return;
        }

        popularSelect({ 
            url: `/opcoesDistrito?id_sas=${idSas}`, 
            selectId: "distrito_servico", 
            addDefault: true, 
            defaultText: "Selecione" 
        });
    }
   
document.addEventListener("change", function(e) {
    if (e.target && e.target.id === "sas") {
        carregarDistritoServicoPorSas(e.target.value);
    }
});

// Validação de obrigatoriedade – Unidade Acolhedora
document.addEventListener('DOMContentLoaded', function () {

    const checkboxesDias = document.querySelectorAll('#dias_semana input[type="checkbox"]');

    function getCamposUnidade() {
        return [
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
    }

    function existeAlgumCampoPreenchido() {
        return getCamposUnidade().some(campo => campo.value && campo.value.trim() !== "");
    }

    function existeAlgumDiaSelecionado() {
        return Array.from(checkboxesDias).some(chk => chk.checked);
    }

    function atualizarObrigatoriedadeUnidade() {
        const camposUnidade = getCamposUnidade();
        const obrigatorio = existeAlgumCampoPreenchido() || existeAlgumDiaSelecionado();

        camposUnidade.forEach(campo => campo.required = obrigatorio);

        const complemento = $("complemento_unidade");
        if (complemento) complemento.required = false;

        document.querySelectorAll('.unidade-obrigatorio').forEach(el => {
            el.style.display = obrigatorio ? 'inline' : 'none';
        });
    }

    document.addEventListener('input', function(e) {
        if (e.target.closest('#unidade-acolhedora, [id$="_unidade"], #horas_psc, #tipo_local, #tipo_logradouro, #atividade_unidade')) {
            atualizarObrigatoriedadeUnidade();
        }
    });

    document.addEventListener('change', function(e) {
        if (e.target.closest('[id$="_unidade"], #horas_psc, #tipo_local, #tipo_logradouro, #atividade_unidade, #dias_semana')) {
            atualizarObrigatoriedadeUnidade();
        }
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
document.addEventListener("DOMContentLoaded", function () {

    document.addEventListener("click", function (e) {
        const btnCancelar = e.target.closest("#cancelar");
        if (!btnCancelar) return;

        window.location.href = '/verPessoas'; // Redireciona para a página de consulta ao clicar em Cancelar
        
    });
});
    


//Preenchimento para teste

document.addEventListener("DOMContentLoaded", function () {

    document.addEventListener("click", function (e) {
        const btnTeste = e.target.closest("#btnPreencherTeste");
        if (!btnTeste) return;



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
        setValor("cep_unidade", "05143320");


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


