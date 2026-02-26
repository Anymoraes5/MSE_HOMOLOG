//====================função generica para check campos===========================
export function toggleCampo(selectId, campoId, valorAtivar = "1", usarRequired = false) {
    var select = $(selectId).value;
    var campo = $(campoId);

    if (select === valorAtivar) {
        campo.disabled = false;
        if (usarRequired) campo.setAttribute("required", "required");
    } else {
        campo.value = "";
        campo.disabled = true;
        if (usarRequired) campo.removeAttribute("required");
    }
}