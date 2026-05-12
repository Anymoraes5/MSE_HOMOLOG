const tipo = document.getElementById('tipo');
const campoTermo = document.getElementById('campo-termo');
const form = document.getElementById('faleConoscoForm');

tipo.addEventListener('change', () => {
    campoTermo.style.display = tipo.value === 'solicitacao_acesso' ? 'block' : 'none';
});

form.addEventListener('submit', async (e) => {
    e.preventDefault();

    const formData = new FormData(form);

    const response = await fetch('/fale-conosco', {
        method: 'POST',
        body: formData
    });

    if (response.ok) {
        alert('Mensagem enviada com sucesso.');
        form.reset();
        campoTermo.style.display = 'none';
    } else {
        alert('Erro ao enviar mensagem.');
    }
});
