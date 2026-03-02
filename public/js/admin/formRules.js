import { $ } from "./helpers.js";

//====================função generica para check campos===========================
export function toggleCampo(selectId, campoId, valorAtivar = "1", usarRequired = false) {
    const select = $(selectId);
    const campo = $(campoId);

    if (!select || !campo) return; 

    if (select.value === valorAtivar) {
        campo.disabled = false;
        if (usarRequired) campo.setAttribute("required", "required");
    } else {
        campo.value = "";
        campo.disabled = true;
        if (usarRequired) campo.removeAttribute("required");
    }
}
//==================check campos de multiplos========================================
export function toggleCampoPorMultiplos(controladores, campoId) {
    const campo = document.getElementById(campoId);
    if (!campo) return;

    const algumAtivo = controladores.some(ctrl => {
        const el = document.getElementById(ctrl.id);
        if (!el) return false;

        if (ctrl.tipo === "igual") {
            return el.value === ctrl.valor;
        }

        if (ctrl.tipo === "diferente") {
            return el.value !== "" && el.value !== ctrl.valor;
        }

        return false;
    });

    if (algumAtivo) {
        campo.disabled = false;
        campo.required = true;
    } else {
        campo.value = "";
        campo.disabled = true;
        campo.required = false;
    }
}
//================================buscar cep unidade acolhedora============================
export async function buscarCep(cep) {
    const response = await fetch(`https://viacep.com.br/ws/${cep}/json/`);

    if (!response.ok) {
        throw new Error("Erro na requisição");
    }

    const data = await response.json();

    if (!data || data.erro) {
        throw new Error("CEP não encontrado");
    }

    return data;
}