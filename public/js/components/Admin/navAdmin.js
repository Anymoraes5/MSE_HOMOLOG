document.addEventListener("DOMContentLoaded", function () {
    fetch("js/components/Admin/navAdmin.html")
        .then(response => response.text())
        .then(data => {
            document.getElementById("navbar").innerHTML = data;

           fetch('/me')
            .then(res => res.json())
            .then(data => {
                document.getElementById('nome-usuario').textContent = 'Olá, ' + (data.nome ?? 'Usuário');
                document.getElementById('mse-usuario').textContent = data.mse ?? '';
            })
            .catch(() => {
                document.getElementById('nome-usuario').textContent = 'Usuário';
                document.getElementById('mse-usuario').textContent = '';
            });
        });
});