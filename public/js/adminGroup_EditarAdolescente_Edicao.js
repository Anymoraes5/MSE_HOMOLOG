console.log("JS CARREGANDO EDITAR EDIÇÃO");
// Script para ajustar o scroll quando um link do menu lateral é clicado
document.querySelectorAll('#menu-lateral a').forEach(anchor => {
    anchor.addEventListener('click', function(e) {
        e.preventDefault();

        // Obter o ID do conteúdo correspondente ao link clicado
        const targetId = this.getAttribute('href').substring(1);
        const targetElement = document.getElementById(targetId);

        if (targetElement) {
            // Calcular a altura do menu principal
            const menuPrincipalHeight = document.getElementById('menu-principal').offsetHeight;

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

/*-----VALIDAÇÕES----------------------------------------------------------------------------------------------------------*/

//Validação do campo de telefone
document.addEventListener('DOMContentLoaded', function () {

    function aplicarMascaraTelefone(valor) {
        valor = valor.replace(/\D/g, '');

        if (valor.length <= 10) {
            return valor
                .replace(/^(\d{2})(\d)/, '($1) $2')
                .replace(/(\d{4})(\d)/, '$1-$2')
                .replace(/(-\d{4})\d+?$/, '$1');
        } else {
            return valor
                .replace(/^(\d{2})(\d)/, '($1) $2')
                .replace(/(\d{5})(\d)/, '$1-$2')
                .replace(/(-\d{4})\d+?$/, '$1');
        }
    }

    function telefoneCompleto(valor) {
        const fixo = /^\(\d{2}\) \d{4}-\d{4}$/;
        const celular = /^\(\d{2}\) \d{5}-\d{4}$/;
        return fixo.test(valor) || celular.test(valor);
    }

    document.querySelectorAll('.telefone-br').forEach(input => {

        // Máscara
        input.addEventListener('input', function () {
            this.value = aplicarMascaraTelefone(this.value);
        });

        // Validação ao sair do campo
        input.addEventListener('blur', function () {
			if (this.value && !telefoneCompleto(this.value)) {
				alert("Informe um telefone completo. Ex: (11) 91234-5678");
				this.value = "";

				// FORÇA REAVALIAÇÃO DA OBRIGATORIEDADE
				this.dispatchEvent(new Event('change'));
				this.dispatchEvent(new Event('input'));

				this.focus();
			}
		});

    });

    // Validação final no submit (para TODOS)
    const form = document.querySelector('form');
    if (form) {
        form.addEventListener('submit', function (e) {
            let erro = false;

            document.querySelectorAll('.telefone-br').forEach(input => {
                if (input.value && !telefoneCompleto(input.value)) {
                    erro = true;
                    input.focus();
                }
            });

            if (erro) {
                e.preventDefault();
                alert("Existe telefone incompleto no formulário.");
            }
        });
    }

});

//Limpar campos se o CEP for alterado
const cepUnidade = document.getElementById("cep_unidade");

if (cepUnidade){
    let valorInicial = cepUnidade.value;
    cepUnidade.addEventListener("input", function(){
    
        if (this.value === valorInicial) return;

        document.getElementById("logradouro_unidade").value = "";
        document.getElementById("bairro_unidade").value = "";
        document.getElementById("numero_unidade").value = "";
        document.getElementById("complemento_unidade").value = "";

        bloquearCamposEndereco(false);

    });
}

//Função para bloquear edição manual após escolha de CEP
function bloquearCamposEndereco(bloquear = true) {
    document.getElementById("tipo_logradouro").disabled = bloquear;
    document.getElementById("logradouro_unidade").readOnly = bloquear;
    document.getElementById("bairro_unidade").readOnly = bloquear;
}

document.addEventListener('DOMContentLoaded', function() {
    const nome = document.getElementById('nome');
    const nome_social = document.getElementById('nome_social');
    const nome_da_mae = document.getElementById('nome_da_mae');
    const nome_do_pai = document.getElementById('nome_do_pai');
    const nome_responsavel = document.getElementById('nome_responsavel');
    const bairro = document.getElementById('bairro');
    const rua = document.getElementById('rua');
    const complemento = document.getElementById('complemento');
    const nome_do_contato = document.getElementById('nome_do_contato');
	
	    aplicarMascaraCEP("cep_unidade");
		aplicarMascaraCEP("cep");

		
    function formatarCEP(valor) {
        if (!valor) return "";
        
        let v = valor.replace(/\D/g, '');
        
        if (v.length > 5) {
            v = v.replace(/^(\d{5})(\d)/, "$1-$2");
        }

        return v.substring(0, 9);
    }

    function aplicarMascaraCEP(idCampo) {
        const campo = document.getElementById(idCampo);
        if (!campo) return;

        // 🔹 Sempre que digitar
        campo.addEventListener("input", function () {
            this.value = formatarCEP(this.value);
        });

        // 🔹 Observa mudanças feitas via JS (backend, AJAX, etc.)
        const observer = new MutationObserver(() => {
            campo.value = formatarCEP(campo.value);
        });

        observer.observe(campo, { attributes: true, attributeFilter: ['value'] });

        // 🔹 Pequeno delay para garantir que o valor já foi inserido
        setTimeout(() => {
            campo.value = formatarCEP(campo.value);
        }, 300);
    }




    function formatarNome(inputElement) {
        inputElement.addEventListener('input', function() {
            let valor = this.value;

            // Garante que haja apenas um espaço entre as palavras
            valor = valor.replace(/\s+/g, ' ');

            // Converte para maiúsculas
            valor = valor.toUpperCase();

            this.value = valor;
        });

        // Remove espaços no início e no final quando o campo perde o foco
        inputElement.addEventListener('blur', function() {
            this.value = this.value.trim();
        });
    }

    formatarNome(nome);
    formatarNome(nome_social);
    formatarNome(nome_da_mae);
    formatarNome(nome_do_pai);
    formatarNome(nome_responsavel);
    formatarNome(bairro);
    formatarNome(rua);
    formatarNome(complemento);
    formatarNome(nome_do_contato);
});

//função para padronizar numero do processo
document.addEventListener('DOMContentLoaded', function() {
    const nProcessoInput = document.getElementById('n_processo');
    const formato = '0000000-00.0000.0.00.0000';

    nProcessoInput.addEventListener('input', function() {
        let valorDigitado = this.value.replace(/[^\d]/g, ''); // Remove tudo que não é dígito
        let valorFormatado = '';
        let indiceFormato = 0;
        let indiceDigitado = 0;

        while (indiceDigitado < valorDigitado.length && indiceFormato < formato.length) {
            const caractereFormato = formato[indiceFormato];
            const caractereDigitado = valorDigitado[indiceDigitado];

            if (/[0-9]/.test(caractereFormato)) {
                if (caractereDigitado) {
                    valorFormatado += caractereDigitado;
                    indiceDigitado++;
                }
                indiceFormato++;
            } else {
                valorFormatado += caractereFormato;
                indiceFormato++;
            }
        }

        this.value = valorFormatado;

        // Trunca o valor se exceder o tamanho da máscara
        if (this.value.length > formato.length) {
            this.value = this.value.slice(0, formato.length);
        }
    });
});

// Obtém a data atual
var hoje = new Date();
// Formata a data no formato YYYY-MM-DD
var dd = String(hoje.getDate()).padStart(2, '0');
var mm = String(hoje.getMonth() + 1).padStart(2, '0'); // Janeiro é 0!
var yyyy = hoje.getFullYear();
// Define o valor do atributo max para a data atual
const dtNasc = document.getElementById("dt_nasc");
//novo 
if (dtNasc){
    dtNasc.max = yyyy + '-' + mm + '-' + dd
}

const dtInterpretacao = document.getElementById("dt_interpretacao_medida");
if (dtInterpretacao){
    dtInterpretacao.max = yyyy + '-' + mm + '-' + dd;
}
const dtUltimo = document.getElementById("dt_ultimo_relatorio_enviado");
if (dtUltimo){
    dtUltimo.max = yyyy + '-' + mm + '-' + dd;
}

// Função para validar os campos de nomes
function validarNome(inputNome) {
    // Obter o valor do input, remover espaços em branco extras e converter para maiúsculas
    var nome = inputNome.value.trim().toUpperCase();
    // Verificar se o nome contém apenas letras, espaços, apóstrofos, hifens e parênteses, e tem entre 2 e 100 caracteres
	if (/^[A-ZÀ-ÿ\s'()-]{2,100}$/.test(nome)) {
        // Se o nome for válido, retorná-lo
        return nome;
    } else {
        // Se o nome não for válido, retornar false
        return false;
    }
}

function validarCPF(cpf) {
    // Remover caracteres não numéricos do CPF
    cpf = cpf.replace(/[^\d]/g, '');

     // Permitir CPF null ou vazio
     if (cpf === null || cpf.trim() === '') {
        return true;
    }

    // Verificar se o CPF tem 11 dígitos ou se é uma sequência de dígitos repetidos
    if (cpf.length !== 11 || /^(\d)\1{10}$/.test(cpf)) return false;

    var soma = 0;
    var r;
    var i;

    // Verificar o primeiro dígito verificador
    for (i = 0; i < 9; i++) {
        soma += parseInt(cpf.charAt(i)) * (10 - i);
    }
    r = (soma * 10) % 11;
    if (r === 10 || r === 11) r = 0;

    if (r !== parseInt(cpf.charAt(9))) return false;

    // Verificar o segundo dígito verificador
    soma = 0;
    for (i = 0; i < 10; i++) {
        soma += parseInt(cpf.charAt(i)) * (11 - i);
    }
    r = (soma * 10) % 11;
    if (r === 10 || r === 11) r = 0;

    if (r !== parseInt(cpf.charAt(10))) return false;

    return true;
}

document.addEventListener('DOMContentLoaded', function() {
    var cpfInput = document.getElementById('cpf');
    var errorMessage = document.getElementById('error-message');

    cpfInput.addEventListener('input', function () {
        var cpfValue = this.value;
        var cpfValido = validarCPF(cpfValue);

        if (!cpfValido) {
            // Exibir uma mensagem de erro
            errorMessage.textContent = 'CPF inválido. Por favor, verifique e tente novamente.';
            //event.preventDefault();
        } else {
            // Limpar a mensagem de erro se o CPF for válido
            errorMessage.textContent = '';
        }
    });
});

function verificarComprimentoNProcesso() {
    const nProcessoInput = document.getElementById('n_processo');

    // Verifica se o elemento existe antes de tentar acessar seu valor
    if (nProcessoInput) {
        const valorCampo = nProcessoInput.value;
        const comprimentoEsperado = 25; // O número exato de caracteres esperados

        if (valorCampo.length === comprimentoEsperado) {
            return true; // O campo tem exatamente 25 caracteres
        } else {
            return false; // O campo NÃO tem 25 caracteres
        }
    } else {
        console.warn("Elemento com ID 'n_processo' não encontrado no DOM.");
        return false; // Retorna false se o elemento não for encontrado
    }
}

document.addEventListener('DOMContentLoaded', function() {
    var nProcessoInput = document.getElementById('n_processo');
    var errorMessage = document.getElementById('error-message-processo');

    nProcessoInput.addEventListener('input', function () {
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
    });
});

// // Função para validar o campo de NIS
// function validaNis(nis) {
//     // Verificar se o NIS é nulo ou uma string vazia
//     if (!nis) return true;
//     // Remover caracteres não numéricos do NIS
//     nis = nis.replace(/[^\d]/g, '');
//     // Verificar se o NIS tem 11 dígitos ou se é uma sequência de dígitos repetidos
//     if (nis.length !== 11 || /^(\d)\1{10}$/.test(nis)) return false;
//     // Verificar se o NIS tem 11 dígitos após a remoção de caracteres não numéricos
//     if (nis.length !== 11 || !/^\d+$/.test(nis)) return false;
//     // Inicializar resultado como verdadeiro
//     var result = true;
    
//     var regex = /[.*+?^${}()|[\]\\]/g;
//     if (regex.test(result)) {
//         alert("Caracteres inválidos detectados!");
//         return false;
//     }
//     // Retornar o resultado da validação
//     return result;
// }

		aplicarMascaraCEP("cep_unidade");
		aplicarMascaraCEP("cep");

		function aplicarMascaraCEP(idCampo) {
		const campo = document.getElementById(idCampo);
		if (!campo) return;

		campo.addEventListener("input", function () {
			let v = this.value.replace(/\D/g, '');

			if (v.length > 5) {
				v = v.replace(/^(\d{5})(\d)/, "$1-$2");
			}

			this.value = v.slice(0, 9);
		});
	}

// Função para validar o campo de CEP
/*function validarCEP(cep) {
    // Expressão regular para validar CEP no formato XXXXX-XXX ou XXXXXXXX
    var regexCEP = /^[0-9]{5}-?[0-9]{3}$/;
    if (regexCEP.test(cep.value)) {
        return cep.value.replace(/[^\d]/g, '');
    } else {
        // CEP inválido retorna falso
        return false;
    }
}*/

// Função para validar o campo de N° cartão SUS
function validaCartao_sus(cartao_sus) {
    // Verificar se o N° cartão SUS é nulo ou uma string vazia
    if (!cartao_sus) return true;
    // Remover caracteres não numéricos do N° cartão SUS
    cartao_sus = cartao_sus.replace(/[^\d]/g, '');
    // Verificar se o  tem 15 dígitos ou se é uma sequência de dígitos repetidos
    if (cartao_sus.length !== 15 || /^(\d)\1{10}$/.test(cartao_sus)) return false;
    // Verificar se o N° cartão SUS tem 15 dígitos após a remoção de caracteres não numéricos
    if (cartao_sus.length !== 15 || !/^\d+$/.test(cartao_sus)) return false;
    // Inicializar resultado como verdadeiro
    var result = true;
    
    var regex = /[.*+?^${}()|[\]\\]/g;
    if (regex.test(result)) {
        alert("Caracteres inválidos detectados!");
        return false;
    }
    // Retornar o resultado da validação
    return result;
}

//Função para validar uma data
function validarData(data) {
    // Obtém a data atual
    var dataAtual = new Date();

    // Obtém a data selecionada pelo usuário
    var dataSelecionada = new Date(data);
    var dataMinima = new Date('1900-01-01');
    if (dataSelecionada < dataMinima) {
        alert('Por favor, selecione uma data posterior a 01 de janeiro de 1900.');
        return false;
    }
    // Compara as datas
    if (dataSelecionada > dataAtual) {
        // Se a data selecionada for futura, exibe uma mensagem de erro
        alert('Por favor, selecione uma data igual ou anterior à data atual.');
        return false;
    } else {
        // Se a data for válida, retorna a data formatada
        return formatarData(data);
    }
}

//Função para validar email
function validarEmail(email) {
    // Verifica se o e-mail está vazio
    if (!email.trim()) {
        alert('E-mail não pode ser vazio');
        return false; // Se estiver vazio, retorna falso
    }
    // Expressão regular para validar o formato do e-mail
    var regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    // Verifica se o e-mail corresponde ao formato esperado
    if (!regex.test(email)) {
        alert('Formato de e-mail inválido');
        return false; // Se não corresponder ao formato, retorna falso
    }
    // Se passar por todas as verificações acima, retorna verdadeiro
    return email.trim();
}

//função para tratar um telefone
function validarTelefone(telefone) {
    // Remove todos os caracteres que não são números
    return telefone.replace(/\D/g, '');
}

// Função genérica para validação de caracteres permitidos em campos de entrada
function validarCaracteresPermitidos(elementId, allowedCharacters) {
    const element = document.getElementById(elementId);
    if (!element) return;

    element.setAttribute('autocomplete', 'off');

    if (element.dataset.validacaoAtiva) return;
    element.dataset.validacaoAtiva = 'true';

    element.addEventListener('paste', function (e) {
        const clipboardData = e.clipboardData || window.clipboardData;
        let pastedData = clipboardData.getData('text');

        pastedData = pastedData.replace(
            new RegExp('[^' + allowedCharacters + ']', 'g'),
            ''
        );

        e.preventDefault();
        document.execCommand('insertText', false, pastedData);
    });

    element.addEventListener('keypress', function (e) {
        const chr = String.fromCharCode(e.which);
        if (!allowedCharacters.includes(chr)) {
            e.preventDefault();
        }
    });
}

// Aplicando a validação para cada campo de entrada
validarCaracteresPermitidos("nome", "qwertyuioplkjhgfdsazxcvbnm QWERTYUIOPLKJHGFDSAZXCVBNM");
validarCaracteresPermitidos("nome_social", "qwertyuioplkjhgfdsazxcvbnm QWERTYUIOPLKJHGFDSAZXCVBNM");
validarCaracteresPermitidos("cpf", "0123456789");
// validarCaracteresPermitidos("nis", "0123456789");
validarCaracteresPermitidos("cartao_sus", "0123456789"); 
validarCaracteresPermitidos("nome_da_mae", "qwertyuioplkjhgfdsazxcvbnm QWERTYUIOPLKJHGFDSAZXCVBNM");
validarCaracteresPermitidos("nome_do_pai", "qwertyuioplkjhgfdsazxcvbnm QWERTYUIOPLKJHGFDSAZXCVBNM");
validarCaracteresPermitidos("responsavel_unidade","qwertyuioplkjhgfdsazxcvbnm QWERTYUIOPLKJHGFDSAZXCVBNM");
validarCaracteresPermitidos("numero_unidade", "0123456789");
validarCaracteresPermitidos("telefone_unidade", "0123456789");
validarCaracteresPermitidos("numero_unidade", "0123456789");
validarCaracteresPermitidos("nome_responsavel", "qwertyuioplkjhgfdsazxcvbnm QWERTYUIOPLKJHGFDSAZXCVBNM");
validarCaracteresPermitidos("cep_unidade", "0123456789");
validarCaracteresPermitidos("logradouro_unidade","qwertyuioplkjhgfdsazxcvbnm QWERTYUIOPLKJHGFDSAZXCVBNMÀÁÂÃÉÊÍÓÔÕÚÇàáâãéêíóôõúç");
validarCaracteresPermitidos("horas_psc", "0123456789");
validarCaracteresPermitidos("numeroRa", "01234.-56789");
validarCaracteresPermitidos("saude", "()-qwertyuioplkjhgfdsazxcvbnm QWERTYUIOPLKJHGFDSAZXCVBNM 0123456789/");
validarCaracteresPermitidos("medicamentos", "()-qwertyuioplkjhgfdsazxcvbnm QWERTYUIOPLKJHGFDSAZXCVBNM 0123456789/");
validarCaracteresPermitidos("n_processo", "01234.-56789");
validarCaracteresPermitidos("n_processo_apuracao", "01234.-56789");
validarCaracteresPermitidos("n_pt", "0123456789.qwertyuioplkjhgfdsazxcvbnm-QWERTYUIOPLKJHGFDSAZXCVBNM");
validarCaracteresPermitidos("cep", "0123456789");
validarCaracteresPermitidos("bairro", "qwertyuioplkjhgfdsazxcvbnm QWERTYUIOPLKJHGFDSAZXCVBNM()"); 
validarCaracteresPermitidos("bairro_unidade","abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ ÀÁÂÃÉÊÍÓÔÕÚÇ()");
validarCaracteresPermitidos("rua", "qwertyuioplkjhgfdsazxcvbnm QWERTYUIOPLKJHGFDSAZXCVBNM");
validarCaracteresPermitidos("numero", "0123456789");
validarCaracteresPermitidos("nome_do_contato", "qwertyuioplkjhgfdsazxcvbnm QWERTYUIOPLKJHGFDSAZXCVBNM");
validarCaracteresPermitidos("telefone", "0123456789");

/*---------------verifica se a dt_nasc mudou e altera a idade----------------------*/
const dtNascChange = document.getElementById('dt_nasc');
if (dtNascChange) {
    dtNascChange.addEventListener('change', calculaIdade);
}

/*-----EDITAR DADOS DA PESSOA----------------------------------------------------------------------------------------------------------*/

const btnSalvarMouse = document.getElementById('salvar');
if(btnSalvarMouse){
    btnSalvarMouse.addEventListener('mouseover', function() {
    var cpfInput = document.getElementById('cpf');
    var cpfValue = cpfInput.value;
    var cpfValido = validarCPF(cpfValue);

    var nProcessoInput = document.getElementById('n_processo');
    var nProcessoValue = nProcessoInput.value;
    var nProcessoValido = verificarComprimentoNProcesso(nProcessoValue);

    // Se o CPF for inválido, foca nele
    if (!cpfValido) {
        alert('CPF inválido. Por favor, verifique e tente novamente.');
        cpfInput.focus(); // Move o cursor para o campo CPF
    }
    // Se o CPF for válido, mas o Processo for inválido, foca no processo
    else if (!nProcessoValido) { 
        alert('Processo de execução inválido. Por favor, verifique e tente novamente.');
        nProcessoInput.focus(); // Move o cursor para o campo Processo
    }
});

}
    

//função para salvar os dados editados
const btnSalvar = document.getElementById('salvar');

if(btnSalvar){

    btnSalvar.addEventListener('click', function(event) {
    if (!confirm("Tem certeza que deseja cadastrar o usuário?")) {
        alert("Operação cancelada");
        event.preventDefault()
        return; // Encerra a função se o usuário cancelar
    } else {
        // Obtém o ID do usuário da URL e preenche os campos do formulário com seus dados
        var urlParams = new URLSearchParams(window.location.search);
        var ID = urlParams.get('ID');
        // Obtém os valores dos campos do formulário e verifica se está vazio
        var ativo_inativo = document.getElementById('ativo_inativo').value;
        // Se o status não for válido, exibe um alerta e retorna
        if (!ativo_inativo) {
            alert('Status inválido. Por favor, verifique e tente novamente.');
            return;
        }
        var dt_cadastro = validarData(formatarData(document.getElementById('dt_cadastro').value));
        // Se Data de cadastro não for válida, exibe um alerta e retorna
        if (!dt_cadastro) {
            alert('Data de cadastro inválida. Por favor, verifique e tente novamente.');
            return;
        }
        var dt_atualizacao = validarData(formatarData(document.getElementById('dt_atualizacao').value));
        // Se a Data de atualização não for válida, exibe um alerta e retorna
        if (!dt_atualizacao) {
            alert('Data de atualização inválida. Por favor, verifique e tente novamente.');
            return;
        }
        var dt_desligamento = validarData(formatarData(document.getElementById('dt_desligamento').value));

         // Obtém os valores dos campos do formulário e verifica se está vazio
         var ativo_inativo = document.getElementById('ativo_inativo').value;
         // Se o status não for válido, exibe um alerta e retorna
         if (!ativo_inativo) {
             alert('Status inválido. Por favor, verifique e tente novamente.');
             return;
         }
         var dt_cadastro = validarData(formatarData(document.getElementById('dt_cadastro').value));
         // Se Data de cadastro não for válida, exibe um alerta e retorna
         if (!dt_cadastro) {
             alert('Data de cadastro inválida. Por favor, verifique e tente novamente.');
             return;
         }
 
         var dt_atualizacao = validarData(formatarData(document.getElementById('dt_atualizacao').value));
         // Se a Data de atualização não for válida, exibe um alerta e retorna
         if (!dt_atualizacao) {
             alert('Data de atualização inválida. Por favor, verifique e tente novamente.');
             return;
         }
 
         var creas_atual = document.getElementById('creas_atual').value;
         // Se o creas atual não for válido, exibe um alerta e retorna
         if (!creas_atual) {
             alert('CREAS atual inválido. Por favor, verifique e tente novamente.');
             return;
         }
         var mse = document.getElementById('mse').value;
         // Se o mse não for válido, exibe um alerta e retorna
         if (!mse) {
             alert('MSE inválido. Por favor, verifique e tente novamente.');
             return;
         }
         var tec_ref = document.getElementById('tec_ref').value;
         // Se o tec_ref não for válido, exibe um alerta e retorna
         if (!tec_ref) {
             alert('tec_ref inválido. Por favor, verifique e tente novamente.');
             return;
         }
         var sas = document.getElementById('sas').value;
         // Se a SAS não for válido, exibe um alerta e retorna
         if (!sas) {
             alert('SAS inválida. Por favor, verifique e tente novamente.');
             return;
         }
         var servico_familia = document.getElementById('servico_familia').value;

         var distrito_servico = document.getElementById('distrito_servico').value;
         // Se o distrito do serviço não for válido, exibe um alerta e retorna
         if (!distrito_servico) {
             alert('Distrito do serviço inválido. Por favor, verifique e tente novamente.');
             return;
         }
         var creas_origem = document.getElementById('creas_origem').value; //sem validação pois é campo opcional
 
         var nome = validarNome(document.getElementById('nome'));
         if (!nome) {
             // Se o nome não for válido, exibe um alerta e retorna
             alert('Nome inválido. Por favor, verifique e tente novamente.');
             return;
         }
         var nome_social = validarNome(document.getElementById('nome_social')); //sem validação pois é campo opcional
 
         var dt_nasc = validarData(formatarData(document.getElementById('dt_nasc').value));
         // Se a data de nascimento não for válida, exibe um alerta e retorna
         if (!dt_nasc) {
             alert('Data de nascimento inválida. Por favor, verifique e tente novamente.');
             return;
         }
 
        var cpfValue = document.getElementById('cpf').value
        var cpfValido = validarCPF(cpfValue);
        if (!cpfValido) {
            // Se o CPF não for válido, interrompe o processo de cadastro
            alert('CPF inválido. Por favor, verifique e tente novamente.');
            return;
        }

        //  var nisValue = document.getElementById('nis').value.replace(/[^\d]/g, '');
        //  var nisValido = validaNis(nisValue);
        //  if (!nisValido) {
        //      // Se o NIS não for válido, interrompe o processo de cadastro
        //      alert('NIS inválido. Por favor, verifique e tente novamente.');
        //      return;
        //  }
 
         var cartao_susValue = document.getElementById('cartao_sus').value.replace(/[^\d]/g, '');
         var cartao_susValido = validaCartao_sus(cartao_susValue);
         if (!cartao_susValido) {
             // Se o N° do cartão do SUS não for válido, interrompe o processo de cadastro
             alert('N° do SUS inválido. Por favor, verifique e tente novamente.');
             return;
         }
 
         var medidas_mse = document.getElementById('medidas_mse').value;
         // Se medidas não for válido, exibe um alerta e retorna
         if (!medidas_mse) {
             alert('Medidas inválida. Por favor, verifique e tente novamente.');
             return;
         }
         var nome_da_mae = validarNome(document.getElementById('nome_da_mae'));
         if (!nome_da_mae) {
             // Se o nome não for válido, interrompe o processo de cadastro
             alert('Nome da mãe inválido. Por favor, verifique e tente novamente.');
             return;
         }
         var nome_do_pai = validarNome(document.getElementById('nome_do_pai')); //sem validação pois é campo opcional
         var nome_responsavel = validarNome(document.getElementById('nome_responsavel'));
         if (!nome_responsavel) {
             // Se o nome_responsavel não for válido, exibe um alerta e retorna
             alert('Nome do responsável inválido. Por favor, verifique e tente novamente.');
             return;
         }
         var sexo = document.getElementById('sexo').value;
         // Se o sexo não for válido, exibe um alerta e retorna
         if (!sexo) {
             alert('Sexo inválido. Por favor, verifique e tente novamente.');
             return;
         }
         var gestante = document.getElementById('gestante').value;
         
         var parceira_gestante = document.getElementById('parceira_gestante').value;
         // Se o parceira_gestante não for válido, exibe um alerta e retorna
         if (!parceira_gestante) {
             alert('Parceira(o) gestante inválido. Por favor, verifique e tente novamente.');
             return;
         }
         var lactante = document.getElementById('lactante').value;
        
         var raca = document.getElementById('raca').value;
         // Se a Raça não for válido, exibe um alerta e retorna
         if (!raca) {
             alert('Raça inválida. Por favor, verifique e tente novamente.');
             return;
         }
         var nacionalidade = document.getElementById('nacionalidade').value;
         // Se a nacionalidade não for válido, exibe um alerta e retorna
         if (!nacionalidade) {
             alert('Nacionalidade inválida. Por favor, verifique e tente novamente.');
             return;
         }
         var genero = document.getElementById('genero').value;
         var orientacao_sexual = document.getElementById('orientacao_sexual').value;
         var estado_civil = document.getElementById('estado_civil').value;
         // Se o estado_civil não for válido, exibe um alerta e retorna
         if (!estado_civil) {
             alert('Estado civil inválido. Por favor, verifique e tente novamente.');
             return;
         }
         var matriculado = document.getElementById('matriculado').value;
         // Se o matriculado não for válido, exibe um alerta e retorna
         if (!matriculado) {
             alert('Matriculado inválida. Por favor, verifique e tente novamente.');
             return;
         }
         var alfabetizado = document.getElementById('alfabetizado').value;
         // Se o alfabetizado não for válido, exibe um alerta e retorna
         if (!alfabetizado) {
             alert('Alfabetizado inválida. Por favor, verifique e tente novamente.');
             return;
         }
         var cicloEstudo = document.getElementById('cicloEstudo').value;
         
         var numeroRa = document.getElementById('numeroRa').value;
         
         var tipoEscola = document.getElementById('tipoEscola').value;
         
         var ensinoModalidade = document.getElementById('ensinoModalidade').value;
        
         var frequenciaAula = document.getElementById('frequenciaAula').value;

         var concluiuCurso = document.getElementById('concluiuCurso').value;
         // Se o Concluiu Curso não for válido, exibe um alerta e retorna
         
         var paroudeEstudar = document.getElementById('paroudeEstudar').value;
        
         var possui_deficiencia = document.getElementById('possui_deficiencia').value;
         // Se o deficiencia não for válido, exibe um alerta e retorna
         if (!possui_deficiencia) {
             alert('Campo é pessoa com deficiência inválido. Por favor, verifique e tente novamente.');
             return;
         }
 
         // Se o deficiencia não for válido, exibe um alerta e retorna
         var deficiencia = document.getElementById('deficiencia').value;
        
         var trabalho = document.getElementById('trabalho').value; //sem validação pois é campo opcional
         var necessita_cuidados_terceiros = document.getElementById('necessita_cuidados_terceiros').value;
         // Se o necessita_cuidados_terceiros não for válido, exibe um alerta e retorna
         if (!necessita_cuidados_terceiros) {
             alert('Necessita de cuidados de terceiros inválido. Por favor, verifique e tente novamente.');
             return;
         }
         var possui_demanda_saude = document.getElementById('possui_demanda_saude').value;
        // Se o possui_demanda_saude não for válido, exibe um alerta e retorna
        if (!possui_demanda_saude) {
            alert('possui_demanda_saude inválido. Por favor, verifique e tente novamente.');
            return;
        }
        var saude = document.getElementById('saude').value;

        var possui_demanda_saude_mental = document.getElementById('possui_demanda_saude_mental').value;
        // Se o possui_demanda_saude não for válido, exibe um alerta e retorna
        if (!possui_demanda_saude_mental) {
            alert('possui_demanda_saude_mental inválido. Por favor, verifique e tente novamente.');
            return;
        }
        var saude_mental = document.getElementById('saude_mental').value;
         
         var acompanhamento_saude = document.getElementById('acompanhamento_saude').value;
        
         var faz_uso_de_medicamentos = document.getElementById('faz_uso_de_medicamentos').value;
        // Se o faz_uso_de_medicamentos não for válido, exibe um alerta e retorna
        if (!faz_uso_de_medicamentos) {
            alert('Faz uso de medicamentos inválido. Por favor, verifique e tente novamente.');
            return;
        }
        var medicamentos = document.getElementById('medicamentos').value;

        var faz_uso_de_medicamentos_controlados = document.getElementById('faz_uso_de_medicamentos_controlados').value;
        // Se o faz_uso_de_medicamentos_controlados não for válido, exibe um alerta e retorna
        if (!faz_uso_de_medicamentos_controlados) {
            alert('Faz uso de medicamentos controlados inválido. Por favor, verifique e tente novamente.');
            return;
        }
        var medicamentos_controlados = document.getElementById('medicamentos_controlados').value;
         var possui_trabalho = document.getElementById('possui_trabalho').value;
         // Se o possui_trabalho não for válido, exibe um alerta e retorna
         if (!possui_trabalho) {
             alert('Possui trabalho inválido. Por favor, verifique e tente novamente.');
             return;
         }           
         var possui_familia_em_servico = document.getElementById('possui_familia_em_servico').value;
         // Se o possui_familia_em_servico não for válido, exibe um alerta e retorna
         if (!possui_familia_em_servico) {
             alert('Possui família em serviço inválido. Por favor, verifique e tente novamente.');
             return;
         }
         var possui_filhos = document.getElementById('possui_filhos').value;
         // Se o possui_filhos não for válido, exibe um alerta e retorna
         if (!possui_filhos) {
             alert('Possui filhos inválido. Por favor, verifique e tente novamente.');
             return;
         }
         var responsavel_por_pcd = document.getElementById('responsavel_por_pcd').value;
         // Se o responsavel_por_pcd não for válido, exibe um alerta e retorna
         if (!responsavel_por_pcd) {
             alert('Responsável por PCD inválido. Por favor, verifique e tente novamente.');
             return;
         }
         var adolescente_com_trajetoria_de_acolhimento = document.getElementById('adolescente_com_trajetoria_de_acolhimento').value;
         // Se o adolescente_com_trajetoria_de_acolhimento não for válido, exibe um alerta e retorna
         if (!adolescente_com_trajetoria_de_acolhimento) {
             alert('Adolescente com trajetória de acolhimento inválido. Por favor, verifique e tente novamente.');
             return;
         }
         var alcool_ou_drogas = document.getElementById('alcool_ou_drogas').value;
         // Se o alcool_ou_drogas não for válido, exibe um alerta e retorna
         if (!alcool_ou_drogas) {
             alert('Álcool ou drogas inválido. Por favor, verifique e tente novamente.');
             return;
         }
        var caps = document.getElementById('caps').value;
         if (!caps) {
            alert('CAPS inválido. Por favor, verifique e tente novamente.');
            event.preventDefault()
            return;
        }
         	 
         var curso = document.getElementById('curso').value;
         if (!curso) {
            alert('Curso profissionalizante inválido. Por favor, verifique e tente novamente.');
            event.preventDefault()
            return;
        }

         var n_processo = document.getElementById('n_processo').value;
         var nProcessoValido = verificarComprimentoNProcesso(n_processo);
        if (!nProcessoValido) {
            // Se o CPF não for válido, interrompe o processo de cadastro
            alert('Processo de execução inválido. Por favor, verifique e tente novamente.');
            return;
        }
         var n_processo_apuracao = document.getElementById('n_processo_apuracao').value;
         // Se o n_processo_apuracao não for válido, exibe um alerta e retorna
         if (!n_processo_apuracao|| n_processo_apuracao.length < 20) {
             alert('Número do processo de apuração inválido. Por favor, verifique e tente novamente.');
             event.preventDefault()
             return;
         }
         var n_pt = document.getElementById('n_pt').value; 
        
         var vara_da_infancia = document.getElementById('vara_da_infancia').value;
         var dt_interpretacao_medida = formatarData(document.getElementById('dt_interpretacao_medida').value);
         // Se o dt_interpretacao_medida não for válido, exibe um alerta e retorna
         if (!dt_interpretacao_medida) {
             alert('Data de interpretação da medida inválida. Por favor, verifique e tente novamente.');
             return;
         }
         var dt_ultimo_relatorio_enviado = formatarData(document.getElementById('dt_ultimo_relatorio_enviado').value);
         // Se o dt_ultimo_relatorio_enviado não for válido, exibe um alerta e retorna
         if (!dt_ultimo_relatorio_enviado) {
             alert('Data do último relatório enviado inválida. Por favor, verifique e tente novamente.');
             return;
         }
         var resumo_do_caso = document.getElementById('resumo_do_caso').value;
         // Se o resumo_do_caso não for válido, exibe um alerta e retorna
         if (!resumo_do_caso) {
             alert('Resumo do caso inválido. Por favor, verifique e tente novamente.');
             return;
         }
         var listar_cursos = document.getElementById('listar_cursos').value;
         var situacao_do_processo = document.getElementById('situacao_do_processo').value;
         // Se o Situação do processo não for válido, exibe um alerta e retorna
         if (!situacao_do_processo) {
             alert('Situação do processo inválido. Por favor, verifique e tente novamente.');
             return;
         }
 
         var distrito_pessoa = document.getElementById('distrito_pessoa').value;
         // Se o distrito_pessoa não for válido, exibe um alerta e retorna
         if (!distrito_pessoa) {
             alert('Distrito da pessoa inválido. Por favor, verifique e tente novamente.');
             return;
         }

         var ubs = document.getElementById('ubs').value;
         var cep = document.getElementById('cep').value;
        
		 
        /* var cep = validarCEP(document.getElementById('cep')).replace(/-/g, "");
        if (!cep) {
            // Se o cep não for válido, interrompe o processo de cadastro
            alert('CEP inválido. Por favor, verifique e tente novamente.');
            return;
        }*/
         var bairro = validarNome(document.getElementById('bairro'));
         if (!bairro) {
             // Se o bairro não for válido, interrompe o processo de cadastro
             alert('Bairro inválido. Por favor, verifique e tente novamente.');
             return;
         }
         var rua = validarNome(document.getElementById('rua'));
         if (!rua) {
             // Se o rua não for válido, interrompe o processo de cadastro
             alert('Rua inválida. Por favor, verifique e tente novamente.');
             return;
         }
         var numero = document.getElementById('numero').value;
         // Se o numero não for válido, exibe um alerta e retorna
         if (!numero) {
             alert('Número inválido. Por favor, verifique e tente novamente.');
             return;
         }
         var complemento = document.getElementById('complemento').value; //sem validação pois é campo opcional
 
         var tipo_de_contato = document.getElementById('tipo_de_contato').value;
         // Se o tipo_de_contato não for válido, exibe um alerta e retorna
         if (!tipo_de_contato) {
             alert('Tipo de contato inválido. Por favor, verifique e tente novamente.');
             return;
         }
         var nome_do_contato = document.getElementById('nome_do_contato').value;
         // Se o nome_do_contato não for válido, exibe um alerta e retorna
         if (!nome_do_contato) {
             alert('Nome do contato inválido. Por favor, verifique e tente novamente.');
             return;
         }
         var telefone = validarTelefone(document.getElementById('telefone').value.replace(/\D/g, ''));
         // Se o telefone não for válido, exibe um alerta e retorna
         if (!telefone) {
             alert('Telefone inválido. Por favor, verifique e tente novamente.');
             return;
         }
         var email = validarEmail(document.getElementById('email').value);
         // Se o e-mail não for válido, exibe um alerta e retorna
         if (!email) {
             alert('E-mail inválido. Por favor, verifique e tente novamente.');
             return;
         }
        var ID_contatos = document.getElementById('ID_contatos').value;

        const selects = document.querySelectorAll('select[name="programas_sociais[]"]');
        const programasSociaisSelecionados = [];
        
        // Coleta os valores selecionados, incluindo nulos
        selects.forEach(select => {
            // Adiciona o valor selecionado ou null se não houver seleção
            programasSociaisSelecionados.push(select.value || null);            
        });
       
		var nome_unidade = document.getElementById('nome_unidade').value;
		var tipo_local = document.getElementById('tipo_local').value;
		var atividade_unidade = document.getElementById('atividade_unidade').value;
		var tipo_logradouro = document.getElementById('tipo_logradouro').value;
		var logradouro_unidade = document.getElementById('logradouro_unidade').value;	
		var numero_unidade = document.getElementById('numero_unidade').value;
		var complemento_unidade = document.getElementById('complemento_unidade').value;
		var bairro_unidade = document.getElementById('bairro_unidade').value;
		var telefone_unidade = document.getElementById('telefone_unidade').value;
		var responsavel_unidade = document.getElementById('responsavel_unidade').value;
		var horario_inicio_unidade = document.getElementById('horario_inicio_unidade').value;
		var horario_fim_unidade = document.getElementById('horario_fim_unidade').value;
		var cep_unidade = document.getElementById('cep_unidade').value;

		// dias da semana (checkbox)
		var dias_semana = Array
			.from(document.querySelectorAll('input[name="dias[]"]:checked'))
			.map(el => el.value)
			.join(',');
				
		// Envia uma requisição AJAX para atualizar os dados do usuário
        fetch(`/editandoPessoas/${ID}`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({				
				nome_unidade: nome_unidade,
				tipo_local: tipo_local,
                cep_unidade : cep_unidade,
				atividade_unidade: atividade_unidade,
				tipo_logradouro: tipo_logradouro,
				logradouro_unidade: logradouro_unidade,
				numero_unidade: numero_unidade,
				complemento_unidade: complemento_unidade,
				bairro_unidade: bairro_unidade,
				telefone_unidade: telefone_unidade,
				responsavel_unidade: responsavel_unidade,
				horario_inicio_unidade: horario_inicio_unidade,
				horario_fim_unidade: horario_fim_unidade,
				dias_semana: dias_semana,
                ID: ID,
                ativo_inativo: ativo_inativo, 
                dt_cadastro: dt_cadastro, 
                dt_atualizacao: dt_atualizacao, 
                creas_atual: creas_atual, 
                mse: mse, 
                tec_ref: tec_ref,
                sas: sas, 
                servico_familia: servico_familia,
                distrito_servico: distrito_servico, 
                creas_origem: creas_origem, 
                nome: nome, 
                nome_social: nome_social, 
                dt_nasc: dt_nasc, 
                cpf: cpfValue, 
                // nis: nisValue, 
                cartao_sus: cartao_susValue,
                medidas_mse: medidas_mse, 
                nome_da_mae: nome_da_mae, 
                nome_do_pai: nome_do_pai,
                nome_responsavel: nome_responsavel, 
                sexo: sexo, 
                gestante: gestante, 
                parceira_gestante: parceira_gestante, 
                lactante: lactante, 
                raca: raca, 
                nacionalidade: nacionalidade,  
                genero: genero, 
                orientacao_sexual: orientacao_sexual, 
                estado_civil: estado_civil, 
                matriculado: matriculado,
                alfabetizado: alfabetizado, 
                cicloEstudo: cicloEstudo, 
                numeroRa: numeroRa,
                tipoEscola: tipoEscola,
                ensinoModalidade: ensinoModalidade,
                frequenciaAula: frequenciaAula,
                concluiuCurso: concluiuCurso,
                paroudeEstudar: paroudeEstudar,
                possui_deficiencia: possui_deficiencia,
                deficiencia: deficiencia,
                trabalho: trabalho, 
                necessita_cuidados_terceiros: necessita_cuidados_terceiros, 
                possui_demanda_saude: possui_demanda_saude,
                saude: saude,
                possui_demanda_saude_mental: possui_demanda_saude_mental,
                saude_mental: saude_mental,
                acompanhamento_saude: acompanhamento_saude,
                faz_uso_de_medicamentos: faz_uso_de_medicamentos,
                medicamentos: medicamentos, 
                faz_uso_de_medicamentos_controlados: faz_uso_de_medicamentos_controlados,
                medicamentos_controlados: medicamentos_controlados, 
                possui_trabalho: possui_trabalho, 
                programas_sociais: programasSociaisSelecionados, 
                possui_familia_em_servico: possui_familia_em_servico, 
                possui_filhos: possui_filhos, 
                responsavel_por_pcd: responsavel_por_pcd, 
                adolescente_com_trajetoria_de_acolhimento: adolescente_com_trajetoria_de_acolhimento, 
                alcool_ou_drogas: alcool_ou_drogas, 
                caps: caps,
                curso: curso,
                n_processo: n_processo, 
                n_processo_apuracao: n_processo_apuracao, 
                n_pt: n_pt, 
                vara_da_infancia: vara_da_infancia, 
                dt_interpretacao_medida: dt_interpretacao_medida, 
                dt_ultimo_relatorio_enviado: dt_ultimo_relatorio_enviado, 
                resumo_do_caso: resumo_do_caso, 
                listar_cursos: listar_cursos,
                situacao_do_processo: situacao_do_processo, 
                distrito_pessoa: distrito_pessoa, 
                ubs: ubs,
                cep: cep, 
                bairro: bairro, 
                rua: rua, 
                numero: numero, 
                complemento: complemento, 
                ID_contatos: ID_contatos,
                tipo_de_contato: tipo_de_contato, 
                nome_do_contato: nome_do_contato, 
                telefone: telefone, 
                email: email,
                dt_desligamento: dt_desligamento,
            })
        })
        .then(response => response.json())
        .then(data => {
            alert('Dados atualizados com sucesso!');
            window.location.href = '/verPessoas'; // Redireciona para a página de consulta
        })
        .catch(error => {
            console.error('Erro capturado:', error);
             console.error('Detalhes completos do erro:', JSON.stringify(error, null, 2));
            if (error.code === 'ER_DUP_ENTRY') {
                console.error('Erro ao atualizar dados:', error.code);
                alert('Erro: O número de processo já existe. Verifique os dados e tente novamente.');
            } else {
                console.error('Erro desconhecido', error.code);
                alert('Erro desconhecido.');
                window.history.back(); // Volta para a página anterior em caso de erro
            }
        });
    }
})
};
	
// ================= UNIDADE ACOLHEDORA =================

// Campos da Unidade Acolhedora
const camposUnidade = [
    document.getElementById("tipo_local"),
    document.getElementById("nome_unidade"),
    document.getElementById("responsavel_unidade"),
    document.getElementById("telefone_unidade"),
    document.getElementById("cep_unidade"),
    document.getElementById("tipo_logradouro"),
    document.getElementById("logradouro_unidade"),
    document.getElementById("numero_unidade"),
    document.getElementById("bairro_unidade"),
    document.getElementById("atividade_unidade"),
    document.getElementById("horario_inicio_unidade"),
    document.getElementById("horario_fim_unidade")
];

const checkboxesDias = document.querySelectorAll('#dias_semana input[type="checkbox"]');

function existeAlgumCampoPreenchido() {
    return camposUnidade.some(campo => campo && campo.value.trim() !== '');
}

function existeAlgumDiaSelecionado() {
    return Array.from(checkboxesDias).some(chk => chk.checked);
}

function atualizarObrigatoriedadeUnidade() {
    const obrigatorio = existeAlgumCampoPreenchido() || existeAlgumDiaSelecionado();

    camposUnidade.forEach(campo => {
        if (campo) campo.required = obrigatorio;
    });

    document.querySelectorAll('.unidade-obrigatorio').forEach(el => {
        el.style.display = obrigatorio ? 'inline' : 'none';
    });
}

window.atualizarObrigatoriedadeUnidade = atualizarObrigatoriedadeUnidade;

camposUnidade.forEach(campo => {
    if (campo) {
        campo.addEventListener('input', atualizarObrigatoriedadeUnidade);
        campo.addEventListener('change', atualizarObrigatoriedadeUnidade);
    }
});

checkboxesDias.forEach(chk => {
    chk.addEventListener('change', atualizarObrigatoriedadeUnidade);
});

if (window.atualizarObrigatoriedadeUnidade) {
    window.atualizarObrigatoriedadeUnidade();
}

/*-----CANCELAR----------------------------------------------------------------------------------------------------------*/

const btnCancelar = document.getElementById('cancelar');
if (btnCancelar){
    btnCancelar.addEventListener('click', function() {
    window.location.href = '/verPessoas'; // Redireciona para a página de consulta ao clicar em Cancelar
    })
};

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




// Buscar CEP
const btnBuscarCep = document.getElementById("buscar_cep");

if (btnBuscarCep) {
    btnBuscarCep.addEventListener("click", function () {
        const campoCep = document.getElementById("cep_unidade");
        

        if (!campoCep) return;

        let cep = campoCep.value.replace(/\D/g, "");

        if (cep.length !== 8) {
            alert("CEP inválido. Digite um CEP com 8 números.");
            return;
        }
        console.log(cep)

        fetch(`https://viacep.com.br/ws/${cep}/json/`)
            .then(response => response.json())
            .then(data => {
                if (data.erro === true) {
                    alert("CEP não encontrado.");
                    return;
                }

                // Validação São Paulo
                if (data.localidade.toLowerCase().trim() !== "são paulo" || data.uf.toUpperCase().trim() !== "SP") {
                    alert("Este CEP não pertence à cidade de São Paulo.");

                    const tipo = document.getElementById("tipo_logradouro");
                    const logradouro = document.getElementById("logradouro_unidade");
                    const bairro = document.getElementById("bairro_unidade");

                    if (tipo) tipo.value = "";
                    if (logradouro) logradouro.value = "";
                    if (bairro) bairro.value = "";

                    bloquearCamposEndereco(false);
                    return;
                }

                let resultado = { tipo: "", nome: "" };

                if (data.logradouro && data.logradouro.trim() !== "") {
                    const partes = data.logradouro.trim().split(" ");
                    resultado.tipo = partes[0];
                    resultado.nome = partes.slice(1).join(" ");
                }

                // Só tenta extrair se o select existir
                // const selectTipo = document.getElementById("tipo_logradouro");
                // if (selectTipo && data.logradouro && data.logradouro.trim() !== "") {
                //     resultado = extrairTipoLogradouro(data.logradouro);
                
                // }

                const tipo = document.getElementById("tipo_logradouro");
                const logradouro = document.getElementById("logradouro_unidade");
                const bairro = document.getElementById("bairro_unidade");

                if (tipo) tipo.value = resultado.tipo || "";
                if (logradouro) logradouro.value = resultado.nome || "";
                if (bairro) bairro.value = data.bairro || "";

                if (logradouro) logradouro.dispatchEvent(new Event("input"));
                if (bairro) bairro.dispatchEvent(new Event("input"));

                bloquearCamposEndereco(true);
            })
            .catch(() => {
                alert("Erro ao buscar o CEP.");
            });
    });
} else {
    console.warn("Botão buscar_cep não existe nesta tela (editar).");
}


