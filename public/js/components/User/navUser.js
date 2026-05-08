document.addEventListener("DOMContentLoaded", function () {
  fetch("js/components/User/navUser.html")
    .then(response => response.text())
    .then(data => {
      document.getElementById("navbarUser").innerHTML = data;
                    // ✅ Só busca o nome DEPOIS que a navbar foi inserida no DOM
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