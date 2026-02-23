//=====================atalhos DOM================
export const $ = (id) => document.getElementById(id);

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