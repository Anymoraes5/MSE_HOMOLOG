document.addEventListener("DOMContentLoaded", async function () {

    const response = await fetch("js/components/formcad.html");
    const html = await response.text();
    document.getElementById("form").innerHTML = html;
    document.dispatchEvent(new Event("formReady"));

    const id = new URLSearchParams(window.location.search).get("id");


    if (id) {
        carregarDadosDoUsuario(id);
    }

});