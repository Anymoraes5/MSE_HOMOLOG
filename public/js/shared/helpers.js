//=====================atalhos DOM================
export function $(id) {
    return document.getElementById(id);
}

export const $$ = (selector) => document.querySelectorAll(selector);

export function on(id, event, callback){
   const el = $(id);
   if (el) el.addEventListener(event, callback);
}
//====================FUNÇÕES TRING=======================
export function somenteNumeros(valor=""){
    return valor.replace(/\D/g, "");
}

export function somenteLetras(valor){
    return valor.replace(/[^a-zA-ZÀ-ÿ\s]/g, "");
}

export function upperTrim(valor){
    return valor.trim().toUpperCase();
}
// ============================validação automatica==================
export function validarObrigatoriosAutomatico() {
    const campos = document.querySelectorAll('[required]');

    for (const campo of campos) {
        if (!campo.value.trim()) {
            alert(`O campo ${campo.name || campo.id} é obrigatório.`);
            campo.focus();
            return false;
        }
    }

    return true;
}
//==============================limpar campos==============================
export function limparCampos(ids){  
    ids.forEach(id => {  
        const el = $(id);  
        if (el) el.value = "";  
    });  
}
//==============================validar documento=========================
export function validarDocumento(id, func, msg, event) {
    const el = document.getElementById(id);
    if (!el) return true;

    const valor = el.value.replace(/\D/g, '');

    // se estiver vazio, deixa o required cuidar disso
    if (!valor) return true;

    if (!func(valor)) {
        alert(msg);
        el.focus();
        event.preventDefault();
        return false;
    }

    return true;
}
