
//=============valida cpf=======================
export function validarCPF(cpf) {
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
// Função para validar o campo de NIS
// export function validaNis(nis) {
//     if (!nis) return true;
   
//     nis = nis.replace(/[^\d]/g, '');
//     if (nis.length !== 11 || /^(\d)\1{10}$/.test(nis)) return false;
//     if (nis.length !== 11 || !/^\d+$/.test(nis)) return false;
//     return true;
    
// }

// Função para validar o campo de N° cartão SUS
export function validaCartao_sus(cartao_sus) {
    if (!cartao_sus) return true;
    
    cartao_sus = cartao_sus.replace(/[^\d]/g, '');

    if (cartao_sus.length !== 15) return false;
    if (!/^\d+$/.test(cartao_sus)) return false;
    if (/^(\d)\1{14}$/.test(cartao_sus)) return false;
        return true;
    }

//Função para validar o email utilizado no login
export function validarEmail(email) {
    if (!email.trim()) return false; // Se estiver vazio, retorna falso

    const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return regex.test(email);
}

export function validarTelefone(telefone) {
    // Remove todos os caracteres que não são números
    return telefone.replace(/\D/g, '');
}
// Função para validar datas (ela usa a função de formatar)
export function validarData(data) {
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
export function verificarComprimentoNProcesso() {
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
// Função para validar os campos de nomes
export function validarNome(nome) {
    // Obter o valor do input, remover espaços em branco extras e converter para maiúsculas
    var nome = nome.trim().toUpperCase();
    return /^[A-ZÁÀÂÃÉÊÍÓÔÕÚÜÇÑ\s'()-]{2,100}$/.test(nome);
}



export function validarCep(cep) {
    if (!cep) return false;

    const cepLimpo = cep.replace(/\D/g, '');

    if (cepLimpo.length !== 8) return false;

    if (/^(\d)\1+$/.test(cepLimpo)) return false;

    return true;
}
