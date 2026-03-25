document.addEventListener("DOMContentLoaded", () => {
    const links = document.querySelectorAll("#menu-principal a");

    // recupera o último clicado
    const ativoSalvo = localStorage.getItem("menuAtivo");

    if (ativoSalvo) {
        links.forEach(link => {
            if (link.getAttribute("href") === ativoSalvo) {
                link.classList.add("active");
            }
        });
    }

    // adiciona evento de clique
    links.forEach(link => {
        link.addEventListener("click", () => {
            localStorage.setItem("menuAtivo", link.getAttribute("href"));
        });
    });
});