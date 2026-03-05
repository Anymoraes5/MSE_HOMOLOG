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
// export async function buscarCep() {

//     const cepInput = document.getElementById("cep_unidade");
//     if (!cepInput) return;

//     const cep_unidade = cepInput.value.replace(/\D/g, ""); // remove máscara

//     console.log("CEP LIMPO:", cep);

//     if (cep_unidade.length !== 8) {
//         alert("CEP inválido");
//         return;
//     }

//     try {
//         const response = await fetch(`https://viacep.com.br/ws/${cep_unidade}/json/`);
//         const data = await response.json();

//         console.log(data);

//         if (data.erro) {
//             alert("CEP não encontrado");
//             return;
//         }

//         console.log("CEP válido ✅");

//     } catch (error) {
//         console.error("Erro ao buscar CEP:", error);
//     }
// }
//================================buscar cep pessoa============================
// export async function buscarCepPessoa() {

//     const cepInput = document.getElementById("cep");
//     if (!cepInput) return;

//     const cep = cepInput.value.replace(/\D/g, "");

//     if (cep.length !== 8) {
//         alert("CEP inválido. Digite um CEP com 8 números.");
//         return;
//     }

//     try {

//         const response = await fetch(`https://viacep.com.br/ws/${cep}/json/`);
//         const data = await response.json();

//         if (!data || data.erro) {
//             alert("CEP não encontrado.");
//             return;
//         }

//         if (data.localidade !== "São Paulo" || data.uf !== "SP") {

//             alert("Este CEP não pertence à cidade de São Paulo.");

//             const rua = document.getElementById("rua");
//             const bairro = document.getElementById("bairro");

//             if (rua) rua.value = "";
//             if (bairro) bairro.value = "";

//             bloquearCamposEndereco(false);
//             return;
//         }

//         const rua = document.getElementById("rua");
//         const bairro = document.getElementById("bairro");

//         if (rua) rua.value = data.logradouro || "";
//         if (bairro) bairro.value = data.bairro || "";

//         bloquearCamposEndereco(true);

//     } catch (error) {

//         console.error("Erro ao buscar CEP:", error);
//         alert("Erro ao buscar o CEP.");

//     }
// }
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