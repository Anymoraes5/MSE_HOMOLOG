/*-----EXIBIÇÃO DE ERROS----------------------------------------------------------------------------------------------------------*/

// Função para exibir a mensagem de erro temporariamente
function exibirMensagem() {
    // Obtém a mensagem da URL
    const urlParams = new URLSearchParams(window.location.search);
    const mensagem = urlParams.get('mensagem');
    
    // Se houver uma mensagem, exibe temporariamente e remove da URL
    if (mensagem) {
        alert(mensagem);
        history.replaceState(null, null, window.location.pathname);
    }
}

// Chama a função ao carregar a página
window.onload = exibirMensagem;

/*-----VALIDAÇÕES----------------------------------------------------------------------------------------------------------*/

// Função para validar o formulário de login
function validateForm() {
    // Obtém os valores dos campos de login e senha
    var login = document.getElementById('login').value;
    var senha = document.getElementById('senha').value;
    // Verifica se os campos estão vazios após remover os espaços em branco
    if (login.trim() === '' || senha.trim() === '') {
        // Se algum campo estiver vazio, exibe um alerta e retorna falso para interromper o envio do formulário
        alert('Login e senha são obrigatórios');
        return false;
    }
    // Se os campos estiverem preenchidos, retorna verdadeiro para permitir o envio do formulário
    return true;
}

/*-----VISIBILIDADE DA SENHA----------------------------------------------------------------------------------------------------------*/

// Função para alternar a visibilidade da senha
function togglePasswordVisibility() {
    // Obtém o elemento do campo de senha e o ícone do olho
    var senhaInput = document.getElementById('senha');
    var eyeIcon = document.getElementById('eyeIcon');
    // Alterna entre o tipo de input senha e texto e atualiza o ícone do olho
    if (senhaInput.type === "password") {
        senhaInput.type = "text";
        eyeIcon.classList.remove('fa-eye');
        eyeIcon.classList.add('fa-eye-slash');
    } else {
        senhaInput.type = "password";
        eyeIcon.classList.remove('fa-eye-slash');
        eyeIcon.classList.add('fa-eye');
    }
}
/*-------------------------------------------------------------------------------------*/


function handleAlterarSenhaClick() {
    alert("Entre em contato com o E-mail smagi@prefeitura.sp.gov.br fornecendo seu nome, e-mail, CPF e data de nascimento");
}

// Adiciona um ouvinte de evento ao botão

/*-----------------*/

 // Função para alternar a visibilidade da senha
 function togglePasswordVisibility() {
    var senhaInput = document.getElementById('senha');
    var eyeIcon = document.getElementById('eyeIcon');
    if (senhaInput.type === "password") {
        senhaInput.type = "text";
        eyeIcon.classList.remove('fa-eye');
        eyeIcon.classList.add('fa-eye-slash');
    } else {
        senhaInput.type = "password";
        eyeIcon.classList.remove('fa-eye-slash');
        eyeIcon.classList.add('fa-eye');
    }
}

// Função para redirecionar para a página de alteração de senha
function redirectToAlterarSenha() {
    window.location.href = "../alterarSenha";
}

// Função para o alerta de "Esqueci minha senha"
function forgotPasswordAlert() {
    alert("Entre em contato com smagi@prefeitura.sp.gov.br fornecendo CPF, E-mail e nome completo");
}


