
export function aplicarMascaraCEP(idCampo) {
    const campo = document.getElementById(idCampo); // ← sem #
    console.log("campo encontrado:", campo);
    if (!campo) return;

    campo.addEventListener("input", function () {
        let v = this.value.replace(/\D/g, '');
        if (v.length > 5) {
            v = v.replace(/^(\d{5})(\d)/, "$1-$2");
        }
        this.value = v.slice(0, 9);
    });
}

//--------------------------------mascara processo--------------------
// Recebe o VALOR e retorna o valor formatado
export function aplicarMascaraProcesso(valor) {
    if (!valor) return '';
    
    const formato = '0000000-00.0000.0.00.0000';
    valor = valor.replace(/\D/g, '');
    
    let valorFormatado = '';
    let indiceFormato = 0;
    let indiceDigitado = 0;

    while (indiceDigitado < valor.length && indiceFormato < formato.length) {
        const caractereFormato = formato[indiceFormato];

        if (/[0-9]/.test(caractereFormato)) {
            valorFormatado += valor[indiceDigitado];
            indiceDigitado++;
        } else {
            valorFormatado += caractereFormato;
        }
        indiceFormato++;
    }

    return valorFormatado;
}

// Recebe o ID e conecta o evento ao campo
export function iniciarMascaraProcesso(id) {
    const campo = document.getElementById(id);
    if (!campo) return;

    campo.addEventListener("input", function () {
        this.value = aplicarMascaraProcesso(this.value);
    });
}
//--------------------------------mascara telefone--------------------
export function iniciarMascaraTelefone(id) {
    const campo = document.getElementById(id);
    if (!campo) return;

    campo.addEventListener("input", function () {
        this.value = aplicarMascaraTelefone(this.value);
    });

    campo.addEventListener("blur", function () {
        if (this.value && !telefoneCompleto(this.value)) {
            alert("Informe um telefone completo. Ex: (11) 91234-5678");
            this.value = "";
            this.focus();
        }
    });
}

export function aplicarMascaraTelefone(valor) {
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

export function telefoneCompleto(valor) {
    const fixo = /^\(\d{2}\) \d{4}-\d{4}$/;
    const celular = /^\(\d{2}\) \d{5}-\d{4}$/;
    return fixo.test(valor) || celular.test(valor);
}

        