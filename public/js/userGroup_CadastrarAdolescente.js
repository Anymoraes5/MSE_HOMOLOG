/*-----AUTENTICAÇÃO---------------------------------------------------------------------------------------------------------*/

// Verifica se o usuário está autenticado usando o cookie de admin
var isAuthenticated = document.cookie.indexOf('userAuthenticated=true') !== -1;
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
document.getElementById("cep_unidade").addEventListener("input", function () {
    document.getElementById("tipo_logradouro").value = "";
    document.getElementById("logradouro_unidade").value = "";
    document.getElementById("bairro_unidade").value = "";
	document.getElementById("numero_unidade").value = "";
	document.getElementById("complemento_unidade").value = "";

    bloquearCamposEndereco(false);
});

//Função para bloquear edição manual após escolha de CEP
function bloquearCamposEndereco(bloquear = true) {
    document.getElementById("tipo_logradouro").disabled = bloquear;
    document.getElementById("logradouro_unidade").readOnly = bloquear;
    document.getElementById("bairro_unidade").readOnly = bloquear;
}

//converte letras para maisusculo e impede espaços extras
document.addEventListener('DOMContentLoaded', function() {
    const nome = document.getElementById('nome');
    const nome_social = document.getElementById('nome_social');
    const nome_da_mae = document.getElementById('nome_da_mae');
    const nome_do_pai = document.getElementById('nome_do_pai');
    const nome_responsavel = document.getElementById('nome_responsavel');
	const responsavel_unidade = document.getElementById('responsavel_unidade');
    const bairro = document.getElementById('bairro');
    const rua = document.getElementById('rua');
    const complemento = document.getElementById('complemento');
    const nome_do_contato = document.getElementById('nome_do_contato');
	const cepUnidade = document.getElementById("cep_unidade");
	
	cepUnidade.addEventListener("input", function () {
    let v = this.value.replace(/\D/g, '');

    if (v.length > 5) {
        v = v.replace(/^(\d{5})(\d)/, "$1-$2");
    }

    this.value = v.slice(0, 9);
});

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
	formatarNome(responsavel_unidade);
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

//função para resetar os campos do tipo select
function resetSelectField(selectId) {
    var selectField = document.getElementById(selectId);
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
document.getElementById("dt_nasc").max = yyyy + '-' + mm + '-' + dd;
document.getElementById("dt_interpretacao_medida").max = yyyy + '-' + mm + '-' + dd;
document.getElementById("dt_ultimo_relatorio_enviado").max = yyyy + '-' + mm + '-' + dd;

//Função para bloquear edição manual após escolha de CEP
function bloquearCamposEndereco(bloquear = true) {
    document.getElementById("tipo_logradouro").disabled = bloquear;
    document.getElementById("logradouro_unidade").readOnly = bloquear;
    document.getElementById("bairro_unidade").readOnly = bloquear;
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

document.addEventListener('DOMContentLoaded', function() {
    var cpfInput = document.getElementById('cpf');
    var errorMessage = document.getElementById('error-message');
    var cadastrarButton = document.getElementById('cadastrar');

    cpfInput.addEventListener('input', function () {
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

    cadastrarButton.addEventListener('mouseover', function(event) {
        if (cadastrarButton.disabled) {
            // Prevenir a ação padrão de um botão desabilitado (caso tenha sido reabilitado via código)
            event.preventDefault();
            // Colocar o foco no campo CPF
            cpfInput.focus();
        }
    });
});

function validarCPF(cpf) {
    // Remover caracteres não numéricos do CPF
    cpf = cpf.replace(/[^\d]/g, '');

    if(cpf.length == '') return true
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


// Função para validar o campo de NIS
function validaNis(nis) {
    // Verificar se o NIS é nulo ou uma string vazia
    if (!nis) return true;
    // Remover caracteres não numéricos do NIS
    nis = nis.replace(/[^\d]/g, '');
    // Verificar se o NIS tem 11 dígitos ou se é uma sequência de dígitos repetidos
    if (nis.length !== 11 || /^(\d)\1{10}$/.test(nis)) return false;
    // Verificar se o NIS tem 11 dígitos após a remoção de caracteres não numéricos
    if (nis.length !== 11 || !/^\d+$/.test(nis)) return false;
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

// Validação do campo de CEP
document.addEventListener('DOMContentLoaded', function () {

    function aplicarMascaraCEP(valor) {
        valor = valor.replace(/\D/g, '');
        if (valor.length > 5) {
            valor = valor.replace(/^(\d{5})(\d)/, '$1-$2');
        }
        return valor.slice(0, 9);
    }

    document.querySelectorAll('.cep-br').forEach(input => {

        input.addEventListener('input', function () {
            this.value = aplicarMascaraCEP(this.value);
        });

        input.addEventListener('blur', function () {

            // NÃO valida se estiver vazio
            if (!this.value) return;

            if (!cepValido(this.value)) {
                alert("Informe um CEP válido. Ex: 01001-000");
                this.value = "";

                // força reavaliação da obrigatoriedade / asteriscos
                this.dispatchEvent(new Event('input'));
                this.dispatchEvent(new Event('change'));

                this.focus();
            }
        });

    });

});

// Função para validar datas (ela usa a função de formatar)
function validarData(data) {
    // Verificar se a data é vazia
    if (!data) {
        // Se for vazia, retornar false
        return false;
    }
    // Obter a data atual
    var dataAtual = new Date();
    // Converter a data selecionada para o formato de data
    var dataSelecionada = new Date(data);
    // Verificar se a data selecionada é posterior à data atual
    var dataMinima = new Date('1900-01-01');
    if (dataSelecionada < dataMinima) {
        alert('Por favor, selecione uma data posterior a 01 de janeiro de 1900.');
        return false;
    }
    if (dataSelecionada > dataAtual) {
        // Se for, exibir uma mensagem de alerta e retornar false
        alert('Por favor, selecione uma data igual ou anterior à data atual.');
        return false;
    } else {
        // Se não for, retornar a data formatada
        return formatarData(data);
    }
}

//Função para validar o email utilizado no login
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

function validarTelefone(telefone) {
    // Remove todos os caracteres que não são números
    return telefone.replace(/\D/g, '');
}

// Função genérica para validação de caracteres permitidos em campos de entrada
function validarCaracteresPermitidos(elementId, allowedCharacters) {
    var element = document.getElementById(elementId);

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

    const select = document.getElementById("tipo_logradouro");

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
validarCaracteresPermitidos("nome", "qwertyuioplkjhgfdsazxcvbnm QWERTYUIOPLKJHGFDSAZXCVBNM");
validarCaracteresPermitidos("nome_social", "qwertyuioplkjhgfdsazxcvbnm QWERTYUIOPLKJHGFDSAZXCVBNM");
validarCaracteresPermitidos("cpf", "0123456789");
validarCaracteresPermitidos("nis", "0123456789");
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

/*----as funções de check são chamadas dentro da tag html com o evento que verifica mudanças no campo---*/
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
    //var acompanhamento_saude = document.getElementById("acompanhamento_saude");

    if (possui_demanda_saude_mental === "0") { // Não
        saude_mental.value = "";
        saude_mental.disabled = true;
        //acompanhamento_saude.value = "";
        //acompanhamento_saude.disabled = true;
    } else if (possui_demanda_saude_mental === "1") { //  Sim
        saude_mental.disabled = false;
        //acompanhamento_saude.disabled = false;
    }
}

function checkMatriculado() {
    // Obtendo os elementos
    var matriculado = document.getElementById("matriculado").value;
    // var numeroRa = document.getElementById("numeroRa");
    var tipoEscola = document.getElementById("tipoEscola");
    var ensinoModalidade = document.getElementById("ensinoModalidade");
    var cicloEstudo = document.getElementById("cicloEstudo");
    var frequenciaAula = document.getElementById("frequenciaAula");
    var concluiuCurso = document.getElementById("concluiuCurso");
    var paroudeEstudar = document.getElementById("paroudeEstudar");

    // Reativando todos os campos inicialmente
    // numeroRa.disabled = false;
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
        // numeroRa.value = "";
        tipoEscola.value = "";
        ensinoModalidade.value = "";
        //cicloEstudo.value = "";
        frequenciaAula.value = "";
        // numeroRa.disabled = true;
        tipoEscola.disabled = true;
        ensinoModalidade.disabled = true;
        //cicloEstudo.disabled = true;
        frequenciaAula.disabled = true;
     }
}

function checkTecRef() {
    var mse = document.getElementById("mse").value;
    var tec_ref = document.getElementById("tec_ref");

    if (mse == "") { // Não
        tec_ref.value = "";
        tec_ref.disabled = true;
    } else if (mse != "") {
        tec_ref.disabled = false;
    }
}

function checkTrabalho() {
    var possui_trabalho = document.getElementById("possui_trabalho").value;
    var trabalho = document.getElementById("trabalho");

    if (possui_trabalho == "1") {
        trabalho.disabled = false;
    } else {
        trabalho.disabled = true;
        trabalho.value = null
    }
}

function checkFamiliar() {
    var possui_familia_em_servico = document.getElementById("possui_familia_em_servico").value;
    var servico_familia = document.getElementById("servico_familia");

    if (possui_familia_em_servico == "1") {
        servico_familia.disabled = false;
    } else {
        servico_familia.disabled = true;
        servico_familia.value = null
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

/*--------------------------calcular idade----------------------------*/

document.getElementById('dt_nasc').addEventListener('change', function() {
    const birthDate = new Date(this.value);
    const today = new Date();
    let age = today.getFullYear() - birthDate.getFullYear();
    const monthDiff = today.getMonth() - birthDate.getMonth();
    if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthDate.getDate())) {
        age--;
    }
    document.getElementById('idade').value = age;
});

/*-----CADASTRAR----------------------------------------------------------------------------------------------------------*/

document.getElementById('cadastrar').addEventListener('click', function(event) {
    var cpfInput = document.getElementById('cpf');
    var cpfValue = cpfInput.value;
    var cpfValido = validarCPF(cpfValue);

    var nProcessoInput = document.getElementById('n_processo');
    var nProcessoValue = nProcessoInput.value;
    var nProcessoValido = verificarComprimentoNProcesso(nProcessoValue);

    // Se o CPF for inválido
    if (!cpfValido) {
    event.preventDefault();
    alert('CPF inválido. Por favor, verifique e tente novamente.');
    cpfInput.focus();
	}
	else if (!nProcessoValido) {
		event.preventDefault();
		alert('Processo de execução inválido. Por favor, verifique e tente novamente.');
		nProcessoInput.focus();
	}
});

    document.getElementById('editar-form').addEventListener('submit', function(event) {
		if (!validarDiasUnidadeAcolhedora()) {
			event.preventDefault();
			return;
		}
    if (!confirm("Tem certeza que deseja cadastrar a pessoa?")) {
        alert("Operação cancelada");
        event.preventDefault()
        return; // Encerra a função se o usuário cancelar
    } else {
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
        // Se Data de cadastro não for válida, exibe um alerta e retorna
        if (!dt_desligamento) {
            alert('dt_desligamento inválida. Por favor, verifique e tente novamente.');
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
		
		var responsavelUnidade = validarNome(document.getElementById('responsavel_unidade'));
		if (!responsavelUnidade) {
			alert('Nome do responsável da unidade inválido.');
			return;
		}
		
        var nome_social = validarNome(document.getElementById('nome_social')); //sem validação pois é campo opcional

        var dt_nasc = validarData(formatarData(document.getElementById('dt_nasc').value));
        // Se a data de nascimento não for válida, exibe um alerta e retorna
        if (!dt_nasc) {
            alert('Data de nascimento inválida. Por favor, verifique e tente novamente.');
            return;
        }
        
        var cpfValue = document.getElementById('cpf').value.replace(/[^\d]/g, '');
        var cpfValido = validarCPF(cpfValue);
        
        if (!cpfValido) {
            // Se o CPF não for válido, interrompe o processo de cadastro
            alert('CPF inválido. Por favor, verifique e tente novamente.');
            event.preventDefault(); // Evita o envio do formulário
        }

        var nisValue = document.getElementById('nis').value.replace(/[^\d]/g, '');
        var nisValido = validaNis(nisValue);
        if (!nisValido) {
            // Se o NIS não for válido, interrompe o processo de cadastro
            alert('NIS inválido. Por favor, verifique e tente novamente.');
            return;
        }
        if (nisValue.length !== 11 || /^(\d)\1{10}$/.test(nis)) {
            alert('NIS inválido. Por favor, verifique e tente novamente.');
            return;
        } 

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
        
        var genero = document.getElementById('genero').value; //sem validação pois é campo opcional
        var orientacao_sexual = document.getElementById('orientacao_sexual').value; //sem validação pois é campo opcional
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
        
        var paroudeEstudar = document.getElementById('paroudeEstudar').value;
       
        var possui_deficiencia = document.getElementById('possui_deficiencia').value;
        // Se o deficiencia não for válido, exibe um alerta e retorna
        if (!possui_deficiencia) {
            alert('Campo é pessoa com deficiência inválido. Por favor, verifique e tente novamente.');
            return;
        }
        
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
        var programas_sociais = document.getElementById('programas_sociais').value;
        // Se o programas_sociais não for válido, exibe um alerta e retorna
        if (!programas_sociais) {
            alert('Programas sociais inválido. Por favor, verifique e tente novamente.');
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
        // Se o n_processo não for válido, exibe um alerta e retorna
        if (!n_processo) {
            alert('Número do processo inválido. Por favor, verifique e tente novamente.');
            event.preventDefault()
            return;
        }
        var n_processo_apuracao = document.getElementById('n_processo_apuracao').value;
        // Se o n_processo_apuracao não for válido, exibe um alerta e retorna
        if (!n_processo_apuracao) {
            alert('Número do processo de apuração inválido. Por favor, verifique e tente novamente.');
            event.preventDefault()
            return;
        }
        var n_pt = document.getElementById('n_pt').value;//sem validação pois é campo opcional
       
        var vara_da_infancia = document.getElementById('vara_da_infancia').value; //sem validação pois é campo opcional
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
        var cep = validarCEP(document.getElementById('cep')).replace(/-/g, "");
        if (!cep) {
            // Se o cep não for válido, interrompe o processo de cadastro
            alert('CEP inválido. Por favor, verifique e tente novamente.');
            return;
        }
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
            body: JSON.stringify({
                //ID é autoincrement na inserção do banco
				tipo_logradouro: tipo_logradouro,
				logradouro_unidade: logradouro_unidade,
				numero_unidade: numero_unidade,
				bairro_unidade: bairro_unidade,
				cep_unidade: cep_unidade,
				telefone_unidade: telefone_unidade,
				responsavel_unidade: responsavel_unidade,
				horario_inicio_unidade: horario_inicio_unidade,
				horario_fim_unidade: horario_fim_unidade,
				dias_semana: dias_semana,
				atividade_unidade: atividade_unidade,
				horas_psc: horas_psc,
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
                nis: nisValue,
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
                tipo_de_contato: tipo_de_contato, 
                nome_do_contato: nome_do_contato, 
                telefone: telefone, 
                email: email,
                dt_desligamento: dt_desligamento,
            })
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
        
    }
});


/*-----PREENCHIMENTO INICIAL DA PÁGINA--------------------------------------------------------------------------------------*/

//Ao carregar a página preenche com os dados padrão
window.onload = function carregarDados() {
    setTimeout(function() {
    // Busca as opções para o Creas atual
    fetch('/opcoesCreasAtual')
    .then(response => response.json())
    .then(opcoesCreas => {
        // Preenche o select com as opções Creas
        var selectCreas = document.getElementById('creas_atual');
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
        var selectCreas = document.getElementById('creas_origem');
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

    // Busca as opções de Distrito para o serviço
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

    // Busca as opções de Distrito para a pessoa
    fetch('/opcoesDistrito')
    .then(response => response.json())
    .then(opcoesDistrito => {
        // Preenche o select com as opções Distrito
        var selectDistrito = document.getElementById('distrito_pessoa');

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

    // Carrega os tipos de local
	fetch('/opcoesTipoLocal')
		.then(response => response.json())
		.then(opcoes => {
			const select = document.getElementById('tipo_local');
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
				const select = document.getElementById('tipo_logradouro');
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
				const select = document.getElementById('atividade_unidade');
				select.innerHTML = '<option value="">Selecione</option>'; // limpa e adiciona opção padrão
				opcoes.forEach(opcao => {
					const option = document.createElement('option');
					option.value = opcao.descricao; // ou opcao.id se quiser guardar o ID
					option.text = opcao.descricao;
					select.appendChild(option);
				});

			})
			.catch(error => console.error('Erro ao carregar atividades da unidade:', error));
	
	// Função para buscar as opções TecRef com base no mse selecionado
    function buscarTecRefPorMse(mseSelecionado) {
        fetch(`/opcoesTecRef?mse=${encodeURIComponent(mseSelecionado)}`)
            .then(response => response.json())
            .then(opcoesTecRef => {
                var selectTecRef = document.getElementById('tec_ref');
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
    document.getElementById('mse').addEventListener('change', function() {
        var mseSelecionado = this.value; // Obtém o valor selecionado no select mse
        buscarTecRefPorMse(mseSelecionado); // Chama a função para buscar TecRef com base no mse
    });
  
//Buscar CEP 
document.getElementById("buscar_cep").addEventListener("click", function () {
    let cep = document.getElementById("cep_unidade").value.replace(/\D/g, "");

    if (cep.length !== 8) {
        alert("CEP inválido. Digite um CEP com 8 números.");
        return;
    }

    fetch(`https://viacep.com.br/ws/${cep}/json/`)
        .then(response => response.json())
        .then(data => {
            if (data.erro) {
                alert("CEP não encontrado.");
                return;
            }

            // Validação São Paulo
            if (data.localidade !== "São Paulo" || data.uf !== "SP") {
                alert("Este CEP não pertence à cidade de São Paulo.");

                document.getElementById("tipo_logradouro").value = "";
                document.getElementById("logradouro_unidade").value = "";
                document.getElementById("bairro_unidade").value = "";

                bloquearCamposEndereco(false);
                return;
            }

            let resultado = { tipo: "", nome: "" };

			// Só tenta extrair tipo de logradouro se o select existir
			const selectTipo = document.getElementById("tipo_logradouro");

			if (selectTipo && data.logradouro_unidade && data.logradouro_unidade.trim() !== "") {
				resultado = extrairTipoLogradouro(data.logradouro_unidade);
			}

            document.getElementById("tipo_logradouro").value = resultado.tipo || "";
            document.getElementById("logradouro_unidade").value = resultado.nome || "";
            document.getElementById("bairro_unidade").value = data.bairro || "";

            // Aplica formatação já existente
            document.getElementById("logradouro_unidade").dispatchEvent(new Event("input"));
            document.getElementById("bairro_unidade").dispatchEvent(new Event("input"));

            // Bloqueia edição manual
            bloquearCamposEndereco(true);
        })
        .catch(() => {
            alert("Erro ao buscar o CEP.");
        });
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

// Busca as opções de Programas Sociais
fetch('/opcoesProgramasSociais')
    .then(response => response.json())
    .then(opcoesProgramasSociais => {
        var divContainer = document.getElementById('programas_sociais_container');
        var addButton = document.getElementById('add_programa_social');
        var removeButton = document.getElementById('remove_programa_social');

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

    // Busca as opções alcool_drogas
    fetch('/opcoesAlcoolDrogas')
    .then(response => response.json())
    .then(opcoesAlcoolDrogas => {
        // Preenche o select com as opções alcool_drogas
        var selectAlcoolDrogas = document.getElementById('alcool_ou_drogas');
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

    // Busca as opções SituacaoDoProcesso
    fetch('/opcoesSituacaoDoProcesso')
    .then(response => response.json())
    .then(opcoesSituacaoDoProcesso => {
        // Preenche o select com as opções SituacaoDoProcesso
        var selectSituacaoDoProcesso = document.getElementById('situacao_do_processo');

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
        var selectVaraDaInfancia = document.getElementById('vara_da_infancia');

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
        var selectContatos = document.getElementById('tipo_de_contato');

         /*-----gambiarra para arrumar depois---------*/
         // Adiciona a opção padrão ao novo <select>
         var defaultOption = document.createElement('option');
         defaultOption.value = '';
         defaultOption.text = '';
         selectContatos.appendChild(defaultOption);
        /*-----gambiarra para arrumar depois---------*/
        /*dica: fazer uma função e passar o select como parametro, fazer em todas e excluir o resect*/

        opcoesContatos.forEach(opcao => {
            var option = document.createElement('option');
            option.text = opcao.descricao;
            selectContatos.appendChild(option);
            
        });
    })
    .catch(error => {
        console.error('Erro ao buscar opções vulnerabilidades:', error);
    });
        
}, 2000);
}
// Espera até que o DOM esteja completamente s
document.addEventListener('DOMContentLoaded', function() {
    // Define os valores dos campos de seleção como nenhum item selecionado
    resetSelectField('creas_atual');
    resetSelectField('mse');
    resetSelectField('tec_ref');
    resetSelectField('sas');
    resetSelectField('servico_familia');
    resetSelectField('distrito_servico');
    resetSelectField('creas_origem');
    resetSelectField('medidas_mse');
    resetSelectField('raca');
    resetSelectField('nacionalidade');
    resetSelectField('genero');
    resetSelectField('orientacao_sexual');
    resetSelectField('estado_civil');
    resetSelectField('cicloEstudo');
    resetSelectField('tipoEscola');
    resetSelectField('ensinoModalidade');
    resetSelectField('paroudeEstudar');
    resetSelectField('deficiencia');
    resetSelectField('trabalho');
    resetSelectField('alcool_ou_drogas');
    resetSelectField('programas_sociais');
    resetSelectField('situacao_do_processo');
    resetSelectField('distrito_pessoa');
    resetSelectField('vara_da_infancia');
    resetSelectField('tipo_de_contato');
    resetSelectField('ubs');
});

// Validação de obrigatoriedade – Unidade Acolhedora
document.addEventListener('DOMContentLoaded', function () {

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
        document.getElementById("horario_fim_unidade"),
        document.getElementById("horas_psc")
    ].filter(Boolean);

    const complemento = document.getElementById("complemento_unidade");
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

function validarDiasUnidadeAcolhedora() {
    const checkboxes = document.querySelectorAll('#dias_semana input[type="checkbox"]');

    const algumMarcado = Array.from(checkboxes).some(chk => chk.checked);

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
        document.getElementById("horario_fim_unidade"),
        document.getElementById("horas_psc")
    ].filter(Boolean);

    const algumCampoPreenchido = camposUnidade.some(c => c.value && c.value.trim() !== "");

    if (algumCampoPreenchido && !algumMarcado) {
        alert("Selecione pelo menos um dia da semana.");
        return false;
    }

    return true;
}

/*-----CANCELAR----------------------------------------------------------------------------------------------------------*/

document.getElementById('cancelar').addEventListener('click', function() {
    window.location.href = '/home'; // Redireciona para a página de consulta ao clicar em Cancelar
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

//Preenchimento para teste

document.addEventListener("DOMContentLoaded", function () {

    const btnTeste = document.getElementById("btnPreencherTeste");
    if (!btnTeste) return;

    btnTeste.addEventListener("click", function () {

        const form = document.getElementById("editar-form");
        if (!form) {
            alert("Formulário não encontrado");
            return;
        }

        /* =====================================================
           FUNÇÃO AUXILIAR PARA SETAR VALOR + EVENTOS
        ===================================================== */
        function setValor(id, valor) {
            const campo = document.getElementById(id);
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
        const mseSelect = document.getElementById("mse");
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
   