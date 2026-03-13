import { $ } from "./helpers.js";

//====================função generica para check campos===========================
export function toggleCampo(selectId, campoId, valorAtivar = "1", usarRequired = false) {
    const select = $(selectId);
    const campo = $(campoId);

    if (!select || !campo) return;

    // Busca o label associado ao campo (pelo atributo 'for')
    const label = document.querySelector(`label[for="${campoId}"]`);
    const asterisco = label?.querySelector(".red-asterisk");

    if (select.value === valorAtivar) {
        campo.disabled = false;
        if (usarRequired) {
            campo.setAttribute("required", "required");
            if (asterisco) asterisco.style.display = "inline"; // ← mostra *
        }
    } else {
        campo.value = "";
        campo.disabled = true;
        if (usarRequired) {
            campo.removeAttribute("required");
            if (asterisco) asterisco.style.display = "none"; // ← esconde *
        }
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
export async function buscarCepGenerico({ cepId, ruaId, bairroId }) {

    const cepInput = document.getElementById(cepId);
    if (!cepInput) return;

    const cep = cepInput.value.replace(/\D/g, "");

    if (cep.length !== 8) {
        alert("CEP inválido");
        return;
    }

    try {
        const response = await fetch(`https://viacep.com.br/ws/${cep}/json/`);
        const data = await response.json();

        if (data.erro) {
            alert("CEP não encontrado");
            return;
        }

        const campoRua = document.getElementById(ruaId);
        const campoBairro = document.getElementById(bairroId);

        if (campoRua) campoRua.value = data.logradouro || "";
        if (campoBairro) campoBairro.value = data.bairro || "";

    } catch (error) {
        console.error("Erro ao buscar CEP:", error);
    }
}