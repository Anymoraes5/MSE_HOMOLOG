import { toggleCampo, toggleCampoPorMultiplos } from "../../shared/formRules.js";
import { aplicarMascaraCEP, iniciarMascaraTelefone } from "../../shared/mascaras.js";
import { $ } from "../../shared/helpers.js";

console.log("JS CARREGANDO EDITAR EDIÇÃO");

// Script para ajustar o scroll quando um link do menu lateral é clicado
document.querySelectorAll('#menu-lateral a').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();
        const targetId = this.getAttribute('href').substring(1);
        const targetElement = document.getElementById(targetId);
        if (targetElement) {
            const menuPrincipalHeight = document.getElementById('menu-principal').offsetHeight;
            const targetTop = targetElement.offsetTop - menuPrincipalHeight;
            window.scrollTo({ top: targetTop, behavior: 'smooth' });
        }
    });
});

/*-----VALIDAÇÕES----------------------------------------------------------------------------------------------------------*/

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
        input.addEventListener('input', function () {
            this.value = aplicarMascaraTelefone(this.value);
        });
        input.addEventListener('blur', function () {
            if (this.value && !telefoneCompleto(this.value)) {
                alert("Informe um telefone completo. Ex: (11) 91234-5678");
                this.value = "";
                this.dispatchEvent(new Event('change'));
                this.dispatchEvent(new Event('input'));
                this.focus();
            }
        });
    });

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

// Limpar campos se o CEP da unidade for alterado
const cepUnidade = document.getElementById("cep_unidade");
if (cepUnidade) {
    let valorInicial = cepUnidade.value;
    cepUnidade.addEventListener("input", function () {
        if (this.value === valorInicial) return;
        document.getElementById("logradouro_unidade").value = "";
        document.getElementById("bairro_unidade").value = "";
        document.getElementById("numero_unidade").value = "";
        document.getElementById("complemento_unidade").value = "";
        bloquearCamposEndereco(false);
    });
}

function bloquearCamposEndereco(bloquear = true) {
    const tipoLogradouro = document.getElementById("tipo_logradouro");
    const logradouro    = document.getElementById("logradouro_unidade");
    const bairro        = document.getElementById("bairro_unidade");
    if (tipoLogradouro) tipoLogradouro.disabled = bloquear;
    if (logradouro)     logradouro.readOnly = bloquear;
    if (bairro)         bairro.readOnly = bloquear;
}

document.addEventListener('DOMContentLoaded', function () {
    const camposNome = [
        'nome', 'nome_social', 'nome_da_mae', 'nome_do_pai',
        'nome_responsavel', 'bairro', 'rua', 'complemento', 'nome_do_contato'
    ];

    function formatarNome(inputElement) {
        if (!inputElement) return;
        inputElement.addEventListener('input', function () {
            this.value = this.value.replace(/\s+/g, ' ').toUpperCase();
        });
        inputElement.addEventListener('blur', function () {
            this.value = this.value.trim();
        });
    }

    camposNome.forEach(id => formatarNome(document.getElementById(id)));
});

// Padronizar número do processo
document.addEventListener('DOMContentLoaded', function () {
    const nProcessoInput = document.getElementById('n_processo');
    if (!nProcessoInput) return;

    const formato = '0000000-00.0000.0.00.0000';
    nProcessoInput.addEventListener('input', function () {
        let valorDigitado = this.value.replace(/[^\d]/g, '');
        let valorFormatado = '';
        let indiceFormato = 0;
        let indiceDigitado = 0;

        while (indiceDigitado < valorDigitado.length && indiceFormato < formato.length) {
            const caractereFormato  = formato[indiceFormato];
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

        this.value = valorFormatado.slice(0, formato.length);
    });
});

// Validação de caracteres permitidos (IIFE)
(function inicializarValidacao() {
    const regrasPorCampo = new Map();
    const teclasEspeciais = new Set([
        'Backspace', 'Delete', 'ArrowLeft', 'ArrowRight',
        'ArrowUp', 'ArrowDown', 'Tab', 'Enter', 'Home', 'End'
    ]);

    document.addEventListener('keydown', function (e) {
        const regra = regrasPorCampo.get(e.target.id);
        if (!regra) return;
        if (e.ctrlKey || e.metaKey || e.altKey) return;
        if (teclasEspeciais.has(e.key)) return;
        if (!regra.has(e.key)) e.preventDefault();
    });

    document.addEventListener('input', function (e) {
        const regra = regrasPorCampo.get(e.target.id);
        if (!regra) return;

        const el       = e.target;
        const original = el.value;
        const cursor   = el.selectionStart;

        let limpo = [...original].filter(c => regra.has(c)).join('');
        if (regra.has(' ')) limpo = limpo.replace(/ {2,}/g, ' ');

        if (limpo !== original) {
            const removidosAntesCursor = [...original.slice(0, cursor)]
                .filter(c => !regra.has(c)).length;
            el.value = limpo;
            const novoCursor = Math.max(0, cursor - removidosAntesCursor);
            el.setSelectionRange(novoCursor, novoCursor);
        }
    });

    window.validarCaracteresPermitidos = function (elementId, allowedCharacters) {
        regrasPorCampo.set(elementId, new Set(allowedCharacters));
    };
})();

// Limites de data
var hoje = new Date();
var dd   = String(hoje.getDate()).padStart(2, '0');
var mm   = String(hoje.getMonth() + 1).padStart(2, '0');
var yyyy = hoje.getFullYear();
var dataMaxima = `${yyyy}-${mm}-${dd}`;

const dtNasc = document.getElementById("dt_nasc");
if (dtNasc) dtNasc.max = dataMaxima;

const dtInterpretacao = document.getElementById("dt_interpretacao_medida");
if (dtInterpretacao) dtInterpretacao.max = dataMaxima;

const dtUltimo = document.getElementById("dt_ultimo_relatorio_enviado");
if (dtUltimo) dtUltimo.max = dataMaxima;

// Validações de campo
function validarNome(inputNome) {
    var nome = inputNome.value.trim().toUpperCase();
    return /^[A-ZÀ-ÿ\s'()-]{2,100}$/.test(nome) ? nome : false;
}

function validarCPF(cpf) {
    cpf = cpf.replace(/[^\d]/g, '');
    if (cpf === null || cpf.trim() === '') return true;
    if (cpf.length !== 11 || /^(\d)\1{10}$/.test(cpf)) return false;

    var soma = 0, r, i;
    for (i = 0; i < 9; i++) soma += parseInt(cpf.charAt(i)) * (10 - i);
    r = (soma * 10) % 11;
    if (r === 10 || r === 11) r = 0;
    if (r !== parseInt(cpf.charAt(9))) return false;

    soma = 0;
    for (i = 0; i < 10; i++) soma += parseInt(cpf.charAt(i)) * (11 - i);
    r = (soma * 10) % 11;
    if (r === 10 || r === 11) r = 0;
    return r === parseInt(cpf.charAt(10));
}

document.addEventListener('DOMContentLoaded', function () {
    var cpfInput    = document.getElementById('cpf');
    var errorMessage = document.getElementById('error-message');
    if (!cpfInput || !errorMessage) return;

    cpfInput.addEventListener('input', function () {
        errorMessage.textContent = validarCPF(this.value)
            ? ''
            : 'CPF inválido. Por favor, verifique e tente novamente.';
    });
});

function verificarComprimentoNProcesso() {
    const nProcessoInput = document.getElementById('n_processo');
    if (!nProcessoInput) {
        console.warn("Elemento 'n_processo' não encontrado.");
        return false;
    }
    return nProcessoInput.value.length === 25;
}

document.addEventListener('DOMContentLoaded', function () {
    var nProcessoInput  = document.getElementById('n_processo');
    var errorMsgProcesso = document.getElementById('error-message-processo');
    if (!nProcessoInput || !errorMsgProcesso) return;

    nProcessoInput.addEventListener('input', function () {
        errorMsgProcesso.textContent = verificarComprimentoNProcesso()
            ? ''
            : 'Processo inválido. Por favor, verifique e tente novamente.';
    });
});

function validaCartao_sus(cartao_sus) {
    if (!cartao_sus) return true;
    cartao_sus = cartao_sus.replace(/[^\d]/g, '');
    if (cartao_sus.length !== 15 || /^(\d)\1{10}$/.test(cartao_sus)) return false;
    return true;
}

function validarData(data) {
    if (!data) return false;
    var dataSelecionada = new Date(data);
    var dataMinima      = new Date('1900-01-01');
    if (dataSelecionada < dataMinima) {
        alert('Por favor, selecione uma data posterior a 01 de janeiro de 1900.');
        return false;
    }
    if (dataSelecionada > new Date()) {
        alert('Por favor, selecione uma data igual ou anterior à data atual.');
        return false;
    }
    return formatarData(data);
}

function validarEmail(email) {
    if (!email.trim()) { alert('E-mail não pode ser vazio'); return false; }
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) { alert('Formato de e-mail inválido'); return false; }
    return email.trim();
}

function validarTelefone(telefone) {
    return telefone.replace(/\D/g, '');
}

function validarCaracteresPermitidos(elementId, allowedCharacters) {
    const element = document.getElementById(elementId);
    if (!element) return;
    element.setAttribute('autocomplete', 'off');
    if (element.dataset.validacaoAtiva) return;
    element.dataset.validacaoAtiva = 'true';

    element.addEventListener('paste', function (e) {
        const clipboardData = e.clipboardData || window.clipboardData;
        let pastedData = clipboardData.getData('text')
            .replace(new RegExp('[^' + allowedCharacters + ']', 'g'), '');
        e.preventDefault();
        document.execCommand('insertText', false, pastedData);
    });

    element.addEventListener('keypress', function (e) {
        if (!allowedCharacters.includes(String.fromCharCode(e.which))) e.preventDefault();
    });
}

// Sets de caracteres permitidos
const letras = "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ" +
               "àáâãäéêëíîïóôõöúüçñÀÁÂÃÄÉÊËÍÎÏÓÔÕÖÚÜÇÑ";
const letrasComEspaco            = letras + " ";
const letrasComParentesesEEspaco = letras + "() ";
const numeros                    = "0123456789";
const numerosComParenteses       = numeros + "()-";

["nome", "nome_social", "nome_da_mae", "nome_do_pai",
 "nome_responsavel", "responsavel_unidade", "nome_do_contato"
].forEach(id => validarCaracteresPermitidos(id, letrasComEspaco));

["medicamentos", "medicamentos_controlados"]
    .forEach(id => validarCaracteresPermitidos(id, letrasComParentesesEEspaco + numerosComParenteses));

["logradouro_unidade", "saude", "bairro", "bairro_unidade", "rua"]
    .forEach(id => validarCaracteresPermitidos(id, letrasComParentesesEEspaco));

["cpf", "cartao_sus", "numero_unidade", "cep_unidade",
 "horas_psc", "numeroRa", "n_processo", "n_processo_apuracao",
 "numero", "n_pt"
].forEach(id => validarCaracteresPermitidos(id, numeros));

["telefone_unidade", "telefone"]
    .forEach(id => validarCaracteresPermitidos(id, numerosComParenteses));

// Recalcula idade ao mudar dt_nasc
const dtNascChange = document.getElementById('dt_nasc');
if (dtNascChange) dtNascChange.addEventListener('change', calculaIdade);

/*-----BOTÃO SALVAR----------------------------------------------------------------------------------------------------------*/

const btnSalvarMouse = document.getElementById('salvar');
if (btnSalvarMouse) {
    btnSalvarMouse.addEventListener('mouseover', function () {
        const cpfInput      = document.getElementById('cpf');
        const nProcessoInput = document.getElementById('n_processo');

        if (!validarCPF(cpfInput.value)) {
            alert('CPF inválido. Por favor, verifique e tente novamente.');
            cpfInput.focus();
        } else if (!verificarComprimentoNProcesso()) {
            alert('Processo de execução inválido. Por favor, verifique e tente novamente.');
            nProcessoInput.focus();
        }
    });
}

const btnSalvar = document.getElementById('salvar');
if (btnSalvar) {
    btnSalvar.addEventListener('click', function (event) {

        // Habilita campos desabilitados para incluir no envio
        document.querySelectorAll("input:disabled, select:disabled").forEach(el => {
            el.disabled = false;
        });

        if (!confirm("Tem certeza que deseja salvar as alterações?")) {
            alert("Operação cancelada");
            event.preventDefault();
            return;
        }

        var urlParams = new URLSearchParams(window.location.search);
        var ID = urlParams.get('ID');

        // --- Validações ---

        var ativo_inativo = document.getElementById('ativo_inativo').value;
        if (!ativo_inativo) {
            alert('Status inválido. Por favor, verifique e tente novamente.');
            return;
        }

        var dt_cadastro = validarData(formatarData(document.getElementById('dt_cadastro').value));
        if (!dt_cadastro) {
            alert('Data de cadastro inválida. Por favor, verifique e tente novamente.');
            return;
        }

        var dt_atualizacao = validarData(formatarData(document.getElementById('dt_atualizacao').value));
        if (!dt_atualizacao) {
            alert('Data de atualização inválida. Por favor, verifique e tente novamente.');
            return;
        }

        // CORREÇÃO: dt_desligamento só é validada quando ativo_inativo === "0"
        var dt_desligamento = null;
        if (ativo_inativo === "0") {
            var dtDesligamentoRaw = document.getElementById('dt_desligamento').value;
            if (dtDesligamentoRaw) {
                dt_desligamento = validarData(formatarData(dtDesligamentoRaw));
                if (!dt_desligamento) {
                    alert('Data de desligamento inválida. Por favor, verifique e tente novamente.');
                    return;
                }
            }
        }

        var creas_atual = document.getElementById('creas_atual').value;
        if (!creas_atual) {
            alert('CREAS atual inválido. Por favor, verifique e tente novamente.');
            return;
        }

        var mse = document.getElementById('mse').value;
        if (!mse) {
            alert('MSE inválido. Por favor, verifique e tente novamente.');
            return;
        }

        var tec_ref = document.getElementById('tec_ref').value;
        if (!tec_ref) {
            alert('Técnico de referência inválido. Por favor, verifique e tente novamente.');
            return;
        }

        var sas = document.getElementById('sas').value;
        if (!sas) {
            alert('SAS inválida. Por favor, verifique e tente novamente.');
            return;
        }

        var servico_familia = document.getElementById('servico_familia').value;
        var distrito_servico = document.getElementById('distrito_servico').value;
        if (!distrito_servico) {
            alert('Distrito do serviço inválido. Por favor, verifique e tente novamente.');
            return;
        }

        var creas_origem = document.getElementById('creas_origem').value;

        var nome = validarNome(document.getElementById('nome'));
        if (!nome) {
            alert('Nome inválido. Por favor, verifique e tente novamente.');
            return;
        }

        var nome_social = validarNome(document.getElementById('nome_social'));

        var dt_nasc = validarData(formatarData(document.getElementById('dt_nasc').value));
        if (!dt_nasc) {
            alert('Data de nascimento inválida. Por favor, verifique e tente novamente.');
            return;
        }

        var cpfValue = document.getElementById('cpf').value;
        if (!validarCPF(cpfValue)) {
            alert('CPF inválido. Por favor, verifique e tente novamente.');
            return;
        }

        var cartao_susValue = document.getElementById('cartao_sus').value.replace(/[^\d]/g, '');
        if (!validaCartao_sus(cartao_susValue)) {
            alert('N° do SUS inválido. Por favor, verifique e tente novamente.');
            return;
        }

        var medidas_mse = document.getElementById('medidas_mse').value;
        if (!medidas_mse) {
            alert('Medidas inválida. Por favor, verifique e tente novamente.');
            return;
        }

        var nome_da_mae = validarNome(document.getElementById('nome_da_mae'));
        if (!nome_da_mae) {
            alert('Nome da mãe inválido. Por favor, verifique e tente novamente.');
            return;
        }

        var nome_do_pai      = validarNome(document.getElementById('nome_do_pai'));
        var nome_responsavel = validarNome(document.getElementById('nome_responsavel'));
        if (!nome_responsavel) {
            alert('Nome do responsável inválido. Por favor, verifique e tente novamente.');
            return;
        }

        var sexo = document.getElementById('sexo').value;
        if (!sexo) {
            alert('Sexo inválido. Por favor, verifique e tente novamente.');
            return;
        }

        var gestante          = document.getElementById('gestante').value;
        var parceira_gestante = document.getElementById('parceira_gestante').value;
        if (!parceira_gestante) {
            alert('Parceira(o) gestante inválido. Por favor, verifique e tente novamente.');
            return;
        }

        var lactante     = document.getElementById('lactante').value;
        var raca         = document.getElementById('raca').value;
        if (!raca) {
            alert('Raça inválida. Por favor, verifique e tente novamente.');
            return;
        }

        var nacionalidade = document.getElementById('nacionalidade').value;
        if (!nacionalidade) {
            alert('Nacionalidade inválida. Por favor, verifique e tente novamente.');
            return;
        }

        var genero           = document.getElementById('genero').value;
        var orientacao_sexual = document.getElementById('orientacao_sexual').value;
        var estado_civil      = document.getElementById('estado_civil').value;
        if (!estado_civil) {
            alert('Estado civil inválido. Por favor, verifique e tente novamente.');
            return;
        }

        var matriculado = document.getElementById('matriculado').value;
        if (!matriculado) {
            alert('Matriculado inválido. Por favor, verifique e tente novamente.');
            return;
        }

        var alfabetizado = document.getElementById('alfabetizado').value;
        if (!alfabetizado) {
            alert('Alfabetizado inválido. Por favor, verifique e tente novamente.');
            return;
        }

        var cicloEstudo       = document.getElementById('cicloEstudo').value;
        var numeroRa          = document.getElementById('numeroRa').value;
        var tipoEscola        = document.getElementById('tipoEscola').value;
        var ensinoModalidade  = document.getElementById('ensinoModalidade').value;
        var frequenciaAula    = document.getElementById('frequenciaAula').value;
        var concluiuCurso     = document.getElementById('concluiuCurso').value;
        var paroudeEstudar    = document.getElementById('paroudeEstudar').value;

        var possui_deficiencia = document.getElementById('possui_deficiencia').value;
        if (!possui_deficiencia) {
            alert('Campo "é pessoa com deficiência" inválido. Por favor, verifique e tente novamente.');
            return;
        }

        var deficiencia               = document.getElementById('deficiencia').value;
        var trabalho                  = document.getElementById('trabalho').value;
        var necessita_cuidados_terceiros = document.getElementById('necessita_cuidados_terceiros').value;
        if (!necessita_cuidados_terceiros) {
            alert('Necessita de cuidados de terceiros inválido. Por favor, verifique e tente novamente.');
            return;
        }

        var possui_demanda_saude = document.getElementById('possui_demanda_saude').value;
        if (!possui_demanda_saude) {
            alert('Possui demanda de saúde inválido. Por favor, verifique e tente novamente.');
            return;
        }

        var saude                       = document.getElementById('saude').value;
        var possui_demanda_saude_mental = document.getElementById('possui_demanda_saude_mental').value;
        if (!possui_demanda_saude_mental) {
            alert('Possui demanda de saúde mental inválido. Por favor, verifique e tente novamente.');
            return;
        }

        var saude_mental          = document.getElementById('saude_mental').value;
        var acompanhamento_saude  = document.getElementById('acompanhamento_saude').value;

        var faz_uso_de_medicamentos = document.getElementById('faz_uso_de_medicamentos').value;
        if (!faz_uso_de_medicamentos) {
            alert('Faz uso de medicamentos inválido. Por favor, verifique e tente novamente.');
            return;
        }

        var medicamentos = document.getElementById('medicamentos').value;

        var faz_uso_de_medicamentos_controlados = document.getElementById('faz_uso_de_medicamentos_controlados').value;
        if (!faz_uso_de_medicamentos_controlados) {
            alert('Faz uso de medicamentos controlados inválido. Por favor, verifique e tente novamente.');
            return;
        }

        var medicamentos_controlados = document.getElementById('medicamentos_controlados').value;

        var possui_trabalho = document.getElementById('possui_trabalho').value;
        if (!possui_trabalho) {
            alert('Possui trabalho inválido. Por favor, verifique e tente novamente.');
            return;
        }

        var possui_familia_em_servico = document.getElementById('possui_familia_em_servico').value;
        if (!possui_familia_em_servico) {
            alert('Possui família em serviço inválido. Por favor, verifique e tente novamente.');
            return;
        }

        var possui_filhos = document.getElementById('possui_filhos').value;
        if (!possui_filhos) {
            alert('Possui filhos inválido. Por favor, verifique e tente novamente.');
            return;
        }

        var responsavel_por_pcd = document.getElementById('responsavel_por_pcd').value;
        if (!responsavel_por_pcd) {
            alert('Responsável por PCD inválido. Por favor, verifique e tente novamente.');
            return;
        }

        var adolescente_com_trajetoria_de_acolhimento = document.getElementById('adolescente_com_trajetoria_de_acolhimento').value;
        if (!adolescente_com_trajetoria_de_acolhimento) {
            alert('Adolescente com trajetória de acolhimento inválido. Por favor, verifique e tente novamente.');
            return;
        }

        var alcool_ou_drogas = document.getElementById('alcool_ou_drogas').value;
        if (!alcool_ou_drogas) {
            alert('Álcool ou drogas inválido. Por favor, verifique e tente novamente.');
            return;
        }

        var caps = document.getElementById('caps').value;
        if (!caps) {
            alert('CAPS inválido. Por favor, verifique e tente novamente.');
            event.preventDefault();
            return;
        }

        var curso = document.getElementById('curso').value;
        if (!curso) {
            alert('Curso profissionalizante inválido. Por favor, verifique e tente novamente.');
            event.preventDefault();
            return;
        }

        var n_processo = document.getElementById('n_processo').value;
        if (!verificarComprimentoNProcesso()) {
            alert('Processo de execução inválido. Por favor, verifique e tente novamente.');
            return;
        }

        var n_processo_apuracao = document.getElementById('n_processo_apuracao').value;
        if (!n_processo_apuracao || n_processo_apuracao.length < 20) {
            alert('Número do processo de apuração inválido. Por favor, verifique e tente novamente.');
            event.preventDefault();
            return;
        }

        var n_pt = document.getElementById('n_pt').value;
        var vara_da_infancia = document.getElementById('vara_da_infancia').value;

        var dt_interpretacao_medida = formatarData(document.getElementById('dt_interpretacao_medida').value);
        if (!dt_interpretacao_medida) {
            alert('Data de interpretação da medida inválida. Por favor, verifique e tente novamente.');
            return;
        }

        var dt_ultimo_relatorio_enviado = formatarData(document.getElementById('dt_ultimo_relatorio_enviado').value);
        if (!dt_ultimo_relatorio_enviado) {
            alert('Data do último relatório enviado inválida. Por favor, verifique e tente novamente.');
            return;
        }

        var resumo_do_caso = document.getElementById('resumo_do_caso').value;
        if (!resumo_do_caso) {
            alert('Resumo do caso inválido. Por favor, verifique e tente novamente.');
            return;
        }

        var listar_cursos       = document.getElementById('listar_cursos').value;
        var situacao_do_processo = document.getElementById('situacao_do_processo').value;
        if (!situacao_do_processo) {
            alert('Situação do processo inválida. Por favor, verifique e tente novamente.');
            return;
        }

        var distrito_pessoa = document.getElementById('distrito_pessoa').value;
        if (!distrito_pessoa) {
            alert('Distrito da pessoa inválido. Por favor, verifique e tente novamente.');
            return;
        }

        var ubs  = document.getElementById('ubs').value;
        var cep  = document.getElementById('cep').value;

        var bairro = validarNome(document.getElementById('bairro'));
        if (!bairro) {
            alert('Bairro inválido. Por favor, verifique e tente novamente.');
            return;
        }

        var rua = validarNome(document.getElementById('rua'));
        if (!rua) {
            alert('Rua inválida. Por favor, verifique e tente novamente.');
            return;
        }

        var numero = document.getElementById('numero').value;
        if (!numero) {
            alert('Número inválido. Por favor, verifique e tente novamente.');
            return;
        }

        var complemento = document.getElementById('complemento').value;

        var tipo_de_contato = document.getElementById('tipo_de_contato').value;
        if (!tipo_de_contato) {
            alert('Tipo de contato inválido. Por favor, verifique e tente novamente.');
            return;
        }

        var nome_do_contato = document.getElementById('nome_do_contato').value;
        if (!nome_do_contato) {
            alert('Nome do contato inválido. Por favor, verifique e tente novamente.');
            return;
        }

        var telefone = validarTelefone(document.getElementById('telefone').value.replace(/\D/g, ''));
        if (!telefone) {
            alert('Telefone inválido. Por favor, verifique e tente novamente.');
            return;
        }

        var email = validarEmail(document.getElementById('email').value);
        if (!email) {
            alert('E-mail inválido. Por favor, verifique e tente novamente.');
            return;
        }

        var ID_contatos = document.getElementById('ID_contatos').value;

        // Coleta programas sociais
        const selects = document.querySelectorAll('select[name="programas_sociais[]"]');
        const programasSociaisSelecionados = [];
        selects.forEach(select => {
            if (select.value) programasSociaisSelecionados.push(select.value);
        });

        // Dados da unidade acolhedora
        var nome_unidade         = document.getElementById('nome_unidade').value;
        var tipo_local           = document.getElementById('tipo_local').value;
        var atividade_unidade    = document.getElementById('atividade_unidade').value;
        var tipo_logradouro      = document.getElementById('tipo_logradouro').value;
        var logradouro_unidade   = document.getElementById('logradouro_unidade').value;
        var numero_unidade       = document.getElementById('numero_unidade').value;
        var complemento_unidade  = document.getElementById('complemento_unidade').value;
        var bairro_unidade       = document.getElementById('bairro_unidade').value;
        var telefone_unidade     = document.getElementById('telefone_unidade').value;
        var responsavel_unidade  = document.getElementById('responsavel_unidade').value;
        var horario_inicio_unidade = document.getElementById('horario_inicio_unidade').value;
        var horario_fim_unidade  = document.getElementById('horario_fim_unidade').value;
        var cep_unidade          = document.getElementById('cep_unidade').value;
        var cad_unico            = document.getElementById('cad_unico').value;

        var dias_semana = Array
            .from(document.querySelectorAll('input[name="dias[]"]:checked'))
            .map(el => el.value)
            .join(',');

        // CORREÇÃO: URL alinhada com o backend (/editandoPessoas/:ID)
        fetch(`/editandoPessoas/${ID}`, {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                nome_unidade,
                tipo_local,
                cep_unidade,
                atividade_unidade,
                tipo_logradouro,
                logradouro_unidade,
                numero_unidade,
                complemento_unidade,
                bairro_unidade,
                telefone_unidade,
                responsavel_unidade,
                horario_inicio_unidade,
                horario_fim_unidade,
                dias_semana,
                ativo_inativo,
                dt_cadastro,
                dt_atualizacao,
                creas_atual,
                mse,
                tec_ref,
                sas,
                servico_familia,
                distrito_servico,
                creas_origem,
                nome,
                nome_social,
                dt_nasc,
                cpf: cpfValue,
                cad_unico,
                cartao_sus: cartao_susValue,
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
                programas_sociais: programasSociaisSelecionados,
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
                ubs,
                cep,
                bairro,
                rua,
                numero,
                complemento,
                ID_contatos,
                tipo_de_contato,
                nome_do_contato,
                telefone,
                email,
                dt_desligamento,
            })
        })
        .then(response => {
            if (!response.ok) return response.json().then(err => Promise.reject(err));
            return response.json();
        })
        .then(() => {
            alert('Dados atualizados com sucesso!');
            window.location.href = '/home';
        })
        .catch(error => {
            console.error('Erro ao atualizar:', error);
            if (error && error.code === 'ER_DUP_ENTRY') {
                alert('Erro: O número de processo já existe. Verifique os dados e tente novamente.');
            } else {
                alert('Erro ao salvar os dados. Tente novamente.');
                window.history.back();
            }
        });
    });
}

/*-----INICIALIZAÇÃO----------------------------------------------------------------------------------------------------------*/

document.addEventListener("DOMContentLoaded", function () {
    checkSexo();
    checkDeficiencia();
    checkMedicamentos();
    checkMedicamentosControlados();
    checkDemandaSaude();
    checkDemandaSaudeMental();
    checkCurso();
    checkTrabalho();
    checkFamiliar();
    checkCaps();
    checkMatriculado();
    checkTecRef();
    checkDtDesligamento();

    document.dispatchEvent(new Event("formReady"));
});

document.dispatchEvent(new Event("formReady"));
aplicarMascaraCEP("cep_unidade");
aplicarMascaraCEP("cep");
iniciarMascaraTelefone("telefone");
iniciarMascaraTelefone("telefone_unidade");

$("sexo")?.addEventListener("change", checkSexo);
$("possui_deficiencia")?.addEventListener("change", checkDeficiencia);
$("matriculado")?.addEventListener("change", checkMatriculado);
$("curso")?.addEventListener("change", checkCurso);
$("possui_trabalho")?.addEventListener("change", checkTrabalho);
$("possui_familia_em_servico")?.addEventListener("change", checkFamiliar);
$("faz_uso_de_medicamentos_controlados")?.addEventListener("change", checkMedicamentosControlados);
$("faz_uso_de_medicamentos")?.addEventListener("change", checkMedicamentos);
$("possui_demanda_saude")?.addEventListener("change", checkDemandaSaude);
$("possui_demanda_saude_mental")?.addEventListener("change", checkDemandaSaudeMental);
$("tec_ref")?.addEventListener("change", checkTecRef);
$("alcool_ou_drogas")?.addEventListener("change", checkCaps);
$("ativo_inativo")?.addEventListener("change", checkDtDesligamento);

// Oculta asteriscos de campos condicionais no carregamento
const camposCondicionais = [
    "listar_cursos", "deficiencia", "medicamentos", "saude",
    "saude_mental", "servico_familia", "trabalho",
    "gestante", "lactante", "parceira_gestante",
];
camposCondicionais.forEach(campoId => {
    const label    = document.querySelector(`label[for="${campoId}"]`);
    const asterisco = label?.querySelector(".red-asterisk");
    if (asterisco) asterisco.style.display = "none";
});

/*-----FUNÇÕES DE TOGGLE----------------------------------------------------------------------------------------------------------*/

function checkSexo() {
    toggleCampo("sexo", "gestante", "F", true);
    toggleCampo("sexo", "lactante", "F", true);
    const sexo = $("sexo")?.value;
    if (sexo !== "F") {
        const gestante = $("gestante");
        const lactante = $("lactante");
        if (gestante) gestante.value = "0";
        if (lactante) lactante.value = "0";
    }
}

function checkDtDesligamento() {
    toggleCampo("ativo_inativo", "dt_desligamento", "0", true);
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
    toggleCampo("faz_uso_de_medicamentos_controlados", "medicamentos_controlados", "1", true);
}

function checkDemandaSaudeMental() {
    toggleCampo("possui_demanda_saude_mental", "saude_mental", "1", true);
    checkCaps();
}

function checkCaps() {
    const saudeMental = $("possui_demanda_saude_mental")?.value;
    const alcool      = $("alcool_ou_drogas")?.value;
    const caps        = $("caps");
    if (!caps) return;

    const ativar = saudeMental === "1" || (alcool && alcool !== "Não");
    if (ativar) {
        caps.disabled = false;
        caps.required = true;
    } else {
        caps.value    = "";
        caps.disabled = true;
        caps.required = false;
    }
}

function checkMatriculado() {
    const campoMatriculado = $("matriculado");
    if (!campoMatriculado) return;

    const matriculado     = campoMatriculado.value;
    const tipoEscola      = $("tipoEscola");
    const ensinoModalidade = $("ensinoModalidade");
    const cicloEstudo     = $("cicloEstudo");
    const frequenciaAula  = $("frequenciaAula");
    const concluiuCurso   = $("concluiuCurso");
    const paroudeEstudar  = $("paroudeEstudar");

    if (!tipoEscola || !ensinoModalidade || !cicloEstudo ||
        !frequenciaAula || !concluiuCurso || !paroudeEstudar) return;

    // Habilita todos primeiro
    [tipoEscola, ensinoModalidade, cicloEstudo, frequenciaAula, concluiuCurso, paroudeEstudar]
        .forEach(el => el.disabled = false);

    if (matriculado === "1") {
        concluiuCurso.value   = "";
        paroudeEstudar.value  = "";
        concluiuCurso.disabled  = true;
        paroudeEstudar.disabled = true;
    } else if (matriculado === "0") {
        tipoEscola.value      = "";
        ensinoModalidade.value = "";
        frequenciaAula.value  = "";
        tipoEscola.disabled      = true;
        ensinoModalidade.disabled = true;
        frequenciaAula.disabled  = true;
    }
}

function checkTecRef() {
    const campoMse = $("mse");
    const tec_ref  = $("tec_ref");
    if (!campoMse || !tec_ref) return;

    if (!campoMse.value) {
        tec_ref.value    = "";
        tec_ref.disabled = true;
    } else {
        tec_ref.disabled = false;
    }
}

function checkTrabalho() {
    toggleCampo("possui_trabalho", "trabalho", "1", true);
}

function checkFamiliar() {
    toggleCampo("possui_familia_em_servico", "servico_familia", "1", true);
}

function checkCurso() {
    toggleCampo("curso", "listar_cursos", "1", true);
}

/*----- UNIDADE ACOLHEDORA ----------------------------------------------------------------------------------------------------------*/

const checkboxesDias = document.querySelectorAll('#dias_semana input[type="checkbox"]');

function getCamposUnidade() {
    return [
        "tipo_local", "nome_unidade", "responsavel_unidade", "telefone_unidade",
        "cep_unidade", "tipo_logradouro", "logradouro_unidade", "numero_unidade",
        "bairro_unidade", "atividade_unidade", "horario_inicio_unidade", "horario_fim_unidade"
    ].map(id => document.getElementById(id)).filter(Boolean);
}

function existeAlgumCampoPreenchido() {
    return getCamposUnidade().some(campo => campo.value.trim() !== '');
}

function existeAlgumDiaSelecionado() {
    return Array.from(checkboxesDias).some(chk => chk.checked);
}

function atualizarObrigatoriedadeUnidade() {
    const obrigatorio = existeAlgumCampoPreenchido() || existeAlgumDiaSelecionado();
    getCamposUnidade().forEach(campo => campo.required = obrigatorio);
    document.querySelectorAll('.unidade-obrigatorio').forEach(el => {
        el.style.display = obrigatorio ? 'inline' : 'none';
    });
}

window.atualizarObrigatoriedadeUnidade = atualizarObrigatoriedadeUnidade;

const idsUnidade = [
    "tipo_local", "nome_unidade", "responsavel_unidade", "telefone_unidade",
    "cep_unidade", "tipo_logradouro", "logradouro_unidade", "numero_unidade",
    "bairro_unidade", "atividade_unidade", "horario_inicio_unidade", "horario_fim_unidade"
];

document.addEventListener('input',  function (e) {
    if (idsUnidade.includes(e.target.id)) atualizarObrigatoriedadeUnidade();
});
document.addEventListener('change', function (e) {
    if (idsUnidade.includes(e.target.id) || e.target.closest('#dias_semana')) {
        atualizarObrigatoriedadeUnidade();
    }
});

atualizarObrigatoriedadeUnidade();

/*-----CANCELAR----------------------------------------------------------------------------------------------------------*/

const btnCancelar = document.getElementById('cancelar');
if (btnCancelar) {
    btnCancelar.addEventListener('click', function () {
        window.location.href = '/home';
    });
}

/*-----LOGOUT----------------------------------------------------------------------------------------------------------*/

window.confirmLogout = function () {
    if (confirm("Tem certeza que deseja encerrar a sessão?")) {
        window.location.href = '/logout';
    }
};

/*-----BUSCAR CEP PESSOA----------------------------------------------------------------------------------------------------------*/

const btnBuscarCepPessoa = document.getElementById("buscar_cep_pessoa");
if (btnBuscarCepPessoa) {
    btnBuscarCepPessoa.addEventListener("click", function () {
        const campoCep = document.getElementById("cep");
        if (!campoCep) return;

        let cepPessoa = campoCep.value.replace(/\D/g, "");
        if (cepPessoa.length !== 8) {
            alert("CEP inválido. Digite um CEP com 8 números.");
            return;
        }

        fetch(`https://viacep.com.br/ws/${cepPessoa}/json/`)
            .then(r => r.json())
            .then(data => {
                if (data.erro) { alert("CEP não encontrado."); return; }
                if (data.localidade.toLowerCase().trim() !== "são paulo" || data.uf.toUpperCase().trim() !== "SP") {
                    alert("Este CEP não pertence à cidade de São Paulo.");
                    const rua   = document.getElementById("rua");
                    const bairro = document.getElementById("bairro");
                    if (rua)   rua.value   = "";
                    if (bairro) bairro.value = "";
                    bloquearCamposEndereco(false);
                    return;
                }

                let nomeRua = "";
                if (data.logradouro && data.logradouro.trim()) {
                    const partes = data.logradouro.trim().split(" ");
                    nomeRua = partes.slice(1).join(" ");
                }

                const rua   = document.getElementById("rua");
                const bairro = document.getElementById("bairro");
                if (rua)   { rua.value   = nomeRua || ""; rua.dispatchEvent(new Event("input")); }
                if (bairro) { bairro.value = data.bairro || ""; bairro.dispatchEvent(new Event("input")); }

                bloquearCamposEndereco(true);
            })
            .catch(() => alert("Erro ao buscar o CEP."));
    });
} else {
    console.warn("Botão buscar_cep_pessoa não encontrado.");
}

/*-----BUSCAR CEP UNIDADE----------------------------------------------------------------------------------------------------------*/

const btnBuscarCep = document.getElementById("buscar_cep");
if (btnBuscarCep) {
    btnBuscarCep.addEventListener("click", function () {
        const campoCep = document.getElementById("cep_unidade");
        if (!campoCep) return;

        let cep_unidade = campoCep.value.replace(/\D/g, "");
        if (cep_unidade.length !== 8) {
            alert("CEP inválido. Digite um CEP com 8 números.");
            return;
        }

        fetch(`https://viacep.com.br/ws/${cep_unidade}/json/`)
            .then(r => r.json())
            .then(data => {
                if (data.erro) { alert("CEP não encontrado."); return; }
                if (data.localidade.toLowerCase().trim() !== "são paulo" || data.uf.toUpperCase().trim() !== "SP") {
                    alert("Este CEP não pertence à cidade de São Paulo.");
                    const tipo      = document.getElementById("tipo_logradouro");
                    const logradouro = document.getElementById("logradouro_unidade");
                    const bairro    = document.getElementById("bairro_unidade");
                    if (tipo)       tipo.value       = "";
                    if (logradouro) logradouro.value = "";
                    if (bairro)     bairro.value     = "";
                    bloquearCamposEndereco(false);
                    return;
                }

                let tipoRua = "", nomeRua = "";
                if (data.logradouro && data.logradouro.trim()) {
                    const partes = data.logradouro.trim().split(" ");
                    tipoRua  = partes[0];
                    nomeRua  = partes.slice(1).join(" ");
                }

                const tipo      = document.getElementById("tipo_logradouro");
                const logradouro = document.getElementById("logradouro_unidade");
                const bairro    = document.getElementById("bairro_unidade");
                if (tipo)       tipo.value       = tipoRua || "";
                if (logradouro) { logradouro.value = nomeRua || ""; logradouro.dispatchEvent(new Event("input")); }
                if (bairro)     { bairro.value     = data.bairro || ""; bairro.dispatchEvent(new Event("input")); }

                bloquearCamposEndereco(true);
            })
            .catch(() => alert("Erro ao buscar o CEP."));
    });
} else {
    console.warn("Botão buscar_cep não encontrado.");
}