document.addEventListener("DOMContentLoaded", async function () {

    // 1️⃣ Carrega o form
    const response = await fetch("js/components/formcad.html");
    const html = await response.text();
    document.getElementById("form").innerHTML = html;

    // 2️⃣ Agora o form existe
    const id = new URLSearchParams(window.location.search).get("id");

    // 3️⃣ Se for edição, carrega dados
    if (id) {
        carregarDadosDoUsuario(id);
    }

});