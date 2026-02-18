/*-----AUTENTICAÇÃO---------------------------------------------------------------------------------------------------------*/

// Verifica se o usuário está autenticado usando o cookie de admin
var isAuthenticated = document.cookie.indexOf('adminAuthenticated=true') !== -1;
if (!isAuthenticated) {
    // Redireciona para a página de login se não estiver autenticado
    window.location.href = '/'; // Supondo que a página de login esteja em '/'
}

/*-----VALIDAÇÕES----------------------------------------------------------------------------------------------------------*/

// Espera até que o DOM esteja completamente s
document.addEventListener('DOMContentLoaded', function() {
    var cpfInput = document.getElementById('cpf');
    var errorMessage = document.getElementById('error-message');

    cpfInput.addEventListener('input', function () {
        var cpfValue = this.value;
        var cpfValido = validaCpf(cpfValue);

        if (!cpfValido) {
            // Exibir uma mensagem de erro
            errorMessage.textContent = 'CPF inválido. Por favor, verifique e tente novamente.';
            event.preventDefault();
        } else {
            // Limpar a mensagem de erro se o CPF for válido
            errorMessage.textContent = '';
        }
    });

});

// Função para validar o campo de CPF
function validaCpf(cpf) {
    // Verificar se o CPF é nulo ou uma string vazia
    if (!cpf) return true;
    // Remover caracteres não numéricos do CPF
    cpf = cpf.replace(/[^\d]/g, '');
    // Verificar se o CPF tem 11 dígitos ou se é uma sequência de dígitos repetidos
    if (cpf.length !== 11 || /^(\d)\1{10}$/.test(cpf)) return false;
    // Verificar se o CPF tem 11 dígitos após a remoção de caracteres não numéricos
    if (cpf.length !== 11 || !/^\d+$/.test(cpf)) return false;
    // Inicializar resultado como verdadeiro
    var result = true;
    // Iterar sobre os pesos 9 e 10
    [9, 10].forEach(function (j) {
        var soma = 0,
            r; 
        // Calcular a soma ponderada dos dígitos
        cpf.split(/(?=)/).splice(0, j).forEach(function (e, i) {
            soma += parseInt(e) * ((j + 2) - (i + 1));
        }); 
        // Calcular o dígito verificador
        r = soma % 11;
        r = r < 2 ? 0 : 11 - r; 
        // Verificar se o dígito verificador calculado coincide com o CPF
        if (r != cpf.substring(j, j + 1)) result = false;
    });
    var regex = /[.*+?^${}()|[\]\\]/g;
    if (regex.test(result)) {
        alert("Caracteres inválidos detectados!");
        return false;
    }
    // Retornar o resultado da validação
    return result;
}
// Função genérica para validação de caracteres permitidos em campos de entrada
function validarCaracteresPermitidos(elementId, allowedCharacters) {
    var element = document.getElementById(elementId);

    element.setAttribute('autocomplete', 'off');

    // Ouvinte de evento para o evento de "paste" (colar)
    element.addEventListener('paste', function(e) {
        var clipboardData, pastedData;

        // Pega o texto colado do evento
        clipboardData = e.clipboardData || window.clipboardData;
        pastedData = clipboardData.getData('text');

        // Remove caracteres não permitidos
        pastedData = pastedData.replace(new RegExp('[^' + allowedCharacters + ']', 'g'), '');

        // Define o texto colado modificado no campo de entrada
        document.execCommand("insertText", false, pastedData);

        // Previne a ação padrão de colar
        e.preventDefault();
    });

    // Ouvinte de evento para o evento de "keypress"
    element.addEventListener('keypress', function(e) {
        var chr = String.fromCharCode(e.which);
        if (allowedCharacters.indexOf(chr) < 0) {
            e.preventDefault();
        }
    });
}

validarCaracteresPermitidos("cpf", "0123456789");


/*-----CADASTRAR----------------------------------------------------------------------------------------------------------*/

// Adiciona um listener para o evento de clique no botão "cadastrar"
document.getElementById('cadastrar').addEventListener('click', function() {
    if (!confirm("Tem certeza que deseja cadastrar a pessoa?")) {
        alert("Operação cancelada");
        event.preventDefault()
        return; // Encerra a função se o usuário cancelar
    } else {
        
        // Obtém os valores dos campos do formulário e verifica se está vazio

        var cpfValue = document.getElementById('cpf').value.replace(/[^\d]/g, '');
        var cpfValido = cpf(cpfValue);
        if (!cpfValido) {
            // Se o CPF não for válido, interrompe o processo de cadastro
            alert('CPF inválido. Por favor, verifique e tente novamente.');
            return;
        }
        
                
          // Envia uma requisição POST para a rota /cadastro com os dados do formulário
        fetch('/adminCadastraPessoaTeste', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                cpf: cpfValue, 
            })
        })
        .then(response => response.json())
        .then(data => {
            alert('Pessoa cadastrada com sucesso!');
            // Redireciona para a página home após o cadastro
            window.location.href = '/verPessoas';
        })
        .catch(error => {
            if (error.code === 'ER_DUP_ENTRY') {
                console.error('Erro ao atualizar dados:', error.code);
                alert('Erro: O número de processo já existe. Verifique os dados e tente novamente.');
                window.history.back();
            } else {
                console.error('O número de processo já existe:', error.code);
                window.history.back(); // Volta para a página anterior em caso de erro
                alert('O número de processo já existe.');
            }
        });
    }
});

/*-----PREENCHIMENTO INICIAL DA PÁGINA--------------------------------------------------------------------------------------*/

//Ao carregar a página preenche com os dados padrão
window.onload = function carregarDados() {

    // // Busca as opções Raca
    // fetch('/opcoesRaca')
    // .then(response => response.json())
    // .then(opcoesRaca => {
    //     // Preenche o select com as opções Raca
    //     var selectRaca = document.getElementById('raca');
    //     opcoesRaca.forEach(opcao => {
    //         var option = document.createElement('option');
    //         option.text = opcao.descricao;
    //         selectRaca.appendChild(option);
    //     });
    // })
    // .catch(error => {
    //     console.error('Erro ao buscar opções raca:', error);
    // });

}

/*-----CANCELAR----------------------------------------------------------------------------------------------------------*/

document.getElementById('cancelar').addEventListener('click', function() {
    window.location.href = '/verPessoas'; // Redireciona para a página de consulta ao clicar em Cancelar
});

/*-----CONFIRMAÇÃO DE LOGOUT----------------------------------------------------------------------------------------------------------*/

// Função para confirmar logout
function confirmLogout() {
    if (confirm("Tem certeza que deseja encerrar a sessão?")) {
        window.location.href = '/logout'; // Redireciona para a rota de logout se o usuário confirmar
    } else {
        // Se o usuário cancelar, não faz nada
        // Você pode adicionar algum feedback aqui se preferir
    }
}
