function verificar_campos(campo) {
    // Verifica se o campo está vazio ou undefined
    if (!campo) {
        campo = null;
    }

    return campo;
}

// Função para validar o CPF
function validarCPF(cpf) {
    cpf = cpf.replace(/[^\d]/g, ''); // Remove caracteres não numéricos

    // Permite CPF vazio
    if (cpf.length === 0) {
        return { valido: true, cpf: null };
    }

    // Verifica se o CPF tem 11 dígitos e não é composto por números iguais
    if (cpf.length !== 11 || /^(\d)\1+$/.test(cpf)) {
        return { valido: false, mensagem: 'CPF inválido.' };
    }

    let soma = 0;
    let resto;

    // Validação do primeiro dígito
    for (let i = 0; i < 9; i++) {
        soma += parseInt(cpf.charAt(i)) * (10 - i);
    }
    resto = (soma * 10) % 11;
    if (resto === 10 || resto === 11) {
        resto = 0;
    }
    if (resto !== parseInt(cpf.charAt(9))) {
        return { valido: false, mensagem: 'CPF inválido.' };
    }

    // Validação do segundo dígito
    soma = 0;
    for (let i = 0; i < 10; i++) {
        soma += parseInt(cpf.charAt(i)) * (11 - i);
    }
    resto = (soma * 10) % 11;
    if (resto === 10 || resto === 11) {
        resto = 0;
    }
    if (resto !== parseInt(cpf.charAt(10))) {
        return { valido: false, mensagem: 'CPF inválido.' };
    }

    return { valido: true, cpf: cpf };
}



module.exports = {
    verificar_campos,
    validarCPF
};
