/*-----AUTENTICAÇÃO---------------------------------------------------------------------------------------------------------*/

// Verifica se o usuário está autenticado usando o cookie de admin
var isAuthenticated = document.cookie.indexOf('adminAuthenticated=true') !== -1;
if (!isAuthenticated) {
    // Redireciona para a página de login se não estiver autenticado
    window.location.href = '/'; // Supondo que a página de login esteja em '/'
}

/*-----VALIDAÇÕES----------------------------------------------------------------------------------------------------------*/

// Obtém a data atual
var hoje = new Date();
// Formata a data no formato YYYY-MM-DD
var dd = String(hoje.getDate()).padStart(2, '0');
var mm = String(hoje.getMonth() + 1).padStart(2, '0'); // Janeiro é 0!
var yyyy = hoje.getFullYear();
// Define o valor do atributo max para a data atual
document.getElementById("dt_nasc").max = yyyy + '-' + mm + '-' + dd;

// Função para validar os campos de nomes
function validarNome(inputNome) {
    var nome = inputNome.value.trim().toUpperCase();
    if (/^[A-ZÀ-ÿ\s'-]{2,100}$/.test(nome)) {
        return nome;
    } else {
        return false;
    }
}
/*
// Função para validar o campo de CPF
function cpf(cpf) {
    cpf = cpf.replace(/[^\d]/g, '');
    if (cpf.length !== 11 || /^(\d)\1{10}$/.test(cpf)) return false;
    var result = true;
    [9, 10].forEach(function (j) {
        var soma = 0, r; 
        cpf.split(/(?=)/).splice(0, j).forEach(function (e, i) {
            soma += parseInt(e) * ((j + 2) - (i + 1));
        });
        r = soma % 11;
        r = r < 2 ? 0 : 11 - r; 
        if (r != cpf.substring(j, j + 1)) result = false;
    });
    return result;
}
*/
document.addEventListener('DOMContentLoaded', function() {
    var cpfInput = document.getElementById('cpf');
    var errorMessage = document.getElementById('error-message');
    var cadastrarButton = document.getElementById('cadastrar');

    cpfInput.addEventListener('input', function () {
        var cpfValue = this.value;
        var cpfValido = validarCPF(cpfValue);

        if (!cpfValido) {
            // Exibir uma mensagem de erro
            errorMessage.textContent = 'CPF inválido. Por favor, verifique e tente novamente.';
            cadastrarButton.disabled = true; // Desativar botão se CPF for inválido
            cadastrarButton.title = 'cpf inválido';
        } else {
            // Limpar a mensagem de erro se o CPF for válido
            errorMessage.textContent = '';
            cadastrarButton.disabled = false; // Ativar botão se CPF for válido
            cadastrarButton.title = '';
        }
    });

    cadastrarButton.addEventListener('mouseover', function(event) {
        if (cadastrarButton.disabled) {
            // Prevenir a ação padrão de um botão desabilitado (caso tenha sido reabilitado via código)
            event.preventDefault();
            // Colocar o foco no campo CPF
            cpfInput.focus();
        }
    });
});

function validarCPF(cpf) {
    // Remover caracteres não numéricos do CPF
    cpf = cpf.replace(/[^\d]/g, '');

    if(cpf.length == '') return true
    // Verificar se o CPF tem 11 dígitos ou se é uma sequência de dígitos repetidos
    if (cpf.length !== 11 || /^(\d)\1{10}$/.test(cpf)) return false;

    var soma = 0;
    var r;
    var i;

    // Verificar o primeiro dígito verificador
    for (i = 0; i < 9; i++) {
        soma += parseInt(cpf.charAt(i)) * (10 - i);
    }
    r = (soma * 10) % 11;
    if (r === 10 || r === 11) r = 0;

    if (r !== parseInt(cpf.charAt(9))) return false;

    // Verificar o segundo dígito verificador
    soma = 0;
    for (i = 0; i < 10; i++) {
        soma += parseInt(cpf.charAt(i)) * (11 - i);
    }
    r = (soma * 10) % 11;
    if (r === 10 || r === 11) r = 0;

    if (r !== parseInt(cpf.charAt(10))) return false;

    return true;
}

// Função para validar o email utilizado no login
function validarEmail(email) {
    if (!email.trim()) {
        return false;
    }
    var regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!regex.test(email)) {
        return false;
    }
    return email.trim();
}

// Função para validar senha
function validarSenha(senha) {
    if (senha.length < 6 || senha.length > 18) {
        return false;
    }
    return senha;
}

// Função para formatar data no padrão do banco de dados
function formatarData(data) {
    const partesData = data.split('T')[0].split('-');
    const ano = partesData[0];
    const mes = partesData[1];
    const dia = partesData[2];
    return `${ano}-${mes}-${dia}`;
}

// Função para validar datas
function validarData(data) {
    var dataAtual = new Date();
    var dataSelecionada = new Date(data);
    var dataMinima = new Date('1900-01-01');
    if (dataSelecionada < dataMinima) {
        alert('Por favor, selecione uma data posterior a 01 de janeiro de 1900.');
        return false;
    }
    if (dataSelecionada > dataAtual) {
        alert('Por favor, selecione uma data igual ou anterior à data atual.');
        return false;
    } else {
        return formatarData(data);
    }
}

// Função genérica para validação de caracteres permitidos
function validarCaracteresPermitidos(elementId, allowedCharacters) {
    var element = document.getElementById(elementId);

    element.setAttribute('autocomplete', 'off');

    element.addEventListener('paste', function(e) {
        var clipboardData, pastedData;
        clipboardData = e.clipboardData || window.clipboardData;
        pastedData = clipboardData.getData('text');
        pastedData = pastedData.replace(new RegExp('[^' + allowedCharacters + ']', 'g'), '');
        document.execCommand("insertText", false, pastedData);
        e.preventDefault();
    });

    element.addEventListener('keypress', function(e) {
        var chr = String.fromCharCode(e.which);
        if (allowedCharacters.indexOf(chr) < 0) {
            e.preventDefault();
        }
    });
}

validarCaracteresPermitidos("cpf", "0123456789");
validarCaracteresPermitidos("nome", "qwertyuiopçlkjhgfdsazxcvbnm QWERTYUIOPÇLKJHGFDSAZXCVBNM");

//converte letras para maisusculo e impede espaços extras
document.addEventListener('DOMContentLoaded', function() {
    const nome = document.getElementById('nome');
    const login = document.getElementById('login');

    function formatarNome(inputElement) {
        inputElement.addEventListener('input', function() {
            let valor = this.value;

            // Garante que haja apenas um espaço entre as palavras
            valor = valor.replace(/\s+/g, ' ');

            // Converte para maiúsculas
            valor = valor.toUpperCase();

            this.value = valor;
        });

        // Remove espaços no início e no final quando o campo perde o foco
        inputElement.addEventListener('blur', function() {
            this.value = this.value.trim();
        });
    }

    function formatarLogin(inputElement) {
        inputElement.addEventListener('input', function() {
            let valor = this.value;

            // Garante que haja nenhum espaço entre as palavras
            valor = valor.replace(' ', '');

            // Converte para minusculas
            valor = valor.toLowerCase();

            this.value = valor;
        });
    }

    formatarNome(nome);
    formatarLogin(login);

});


/*-----PREENCHIMENTO INICIAL DA PÁGINA--------------------------------------------------------------------------------------*/

/*
window.onload = function() {
    setTimeout(function() {
        fetch('/opcoesMse')
        .then(response => response.json())
        .then(opcoesMSE => {
            var selectMSE = document.getElementById('mse');
            opcoesMSE.forEach(opcao => {
                var option = document.createElement('option');
                option.text = opcao.descricao;
                selectMSE.appendChild(option);
            });
        })
        .catch(error => {
            console.error('Erro ao buscar opções MSE:', error);
        });

        fetch('/opcoesPerfil')
        .then(response => response.json())
        .then(opcoesPerfil => {
            var selectPerfil = document.getElementById('perfil');
            opcoesPerfil.forEach(opcao => {
                var option = document.createElement('option');
                option.text = opcao.descricao;
                selectPerfil.appendChild(option);
            });
        })
        .catch(error => {
            console.error('Erro ao buscar opções Perfil:', error);
        });

        var urlParams = new URLSearchParams(window.location.search);
        var ID = urlParams.get('ID');

        if (ID) {
            fetch(`/usuarios/${ID}`)
            .then(response => response.json())
            .then(data => {
                if (data) {
                    document.getElementById('cpf').value = data.cpf || '';
                    document.getElementById('login').value = data.login || '';
                    document.getElementById('nome').value = data.nome || '';
                    document.getElementById('ativo_inativo').value = data.ativo_inativo || '';
                    document.getElementById('senha').value = data.senha || ''; 
                    document.getElementById('dt_nasc').value = data.dt_nasc ? formatarData(data.dt_nasc) : '';
                    document.getElementById('perfil').value = data.perfil || '';
                    document.getElementById('mse').value = data.mse || '';
                } else {
                    console.error('Dados do usuário não encontrados.');
                }
            })
            .catch(error => {
                console.error('Erro ao buscar dados do usuário:', error);
            });
        }
    }, 3000);
};
*/

window.onload = async function() {
    try {
        const opcoesMseResponse = await fetch('/opcoesMse');
        if (!opcoesMseResponse.ok) {
            throw new Error(`Erro ao buscar opções MSE: ${opcoesMseResponse.status}`);
        }
        const opcoesMSE = await opcoesMseResponse.json();
        const selectMSE = document.getElementById('mse');
        opcoesMSE.forEach(opcao => {
            const option = document.createElement('option');
            option.text = opcao.descricao;
            selectMSE.appendChild(option);
        });

        const opcoesPerfilResponse = await fetch('/opcoesPerfil');
        if (!opcoesPerfilResponse.ok) {
            throw new Error(`Erro ao buscar opções Perfil: ${opcoesPerfilResponse.status}`);
        }
        const opcoesPerfil = await opcoesPerfilResponse.json();
        const selectPerfil = document.getElementById('perfil');
        opcoesPerfil.forEach(opcao => {
            const option = document.createElement('option');
            option.text = opcao.descricao;
            selectPerfil.appendChild(option);
        });

        const urlParams = new URLSearchParams(window.location.search);
        const ID = urlParams.get('ID');

        if (ID) {
            const usuarioResponse = await fetch(`/usuarios/${ID}`);
            if (!usuarioResponse.ok) {
                throw new Error(`Erro ao buscar dados do usuário: ${usuarioResponse.status}`);
            }
            const data = await usuarioResponse.json();
            console.log(data);
            if (data) {
                document.getElementById('cpf').value = data.cpf || '';
                document.getElementById('login').value = data.login || '';
                document.getElementById('nome').value = data.nome || '';
                //document.getElementById('ativo_inativo').value = data.ativo_inativo || '';
		// Verifica se o usuário está desativado
            	if (data.ativo_inativo === null || data.ativo_inativo === undefined || data.ativo_inativo === false) {
                	document.getElementById('ativo_inativo').value = '0'; // Ou outro valor que represente "desativado" no seu sistema
            	} else {
                	document.getElementById('ativo_inativo').value = data.ativo_inativo;
            	}
                document.getElementById('senha').value = data.senha || '';
                document.getElementById('dt_nasc').value = data.dt_nasc ? formatarData(data.dt_nasc) : '';
                document.getElementById('perfil').value = data.perfil || '';
                document.getElementById('mse').value = data.mse || '';

                document.getElementById('dt_cadastro').value = data.dt_cadastro ? new Date(data.dt_cadastro).toLocaleDateString('pt-BR') : '';
                document.getElementById('dt_atualizacao').value = data.dt_atualizacao ? new Date(data.dt_atualizacao).toLocaleDateString('pt-BR') : '';
            } else {
                console.error('Dados do usuário não encontrados.');
            }
        }
    } catch (error) {
        console.error('Ocorreu um erro:', error);
        alert('Ocorreu um erro ao carregar os dados. Por favor, tente novamente mais tarde.');
    }
};


/*-----EDITAR----------------------------------------------------------------------------------------------------------*/

/*-----EDITAR----------------------------------------------------------------------------------------------------------*/

document.getElementById('cadastrar').addEventListener('click', function(event) {
    // 1. SEMPRE IMPEDE A AÇÃO PADRÃO DO BOTÃO/FORMULÁRIO AO CLICAR
    // Mova este event.preventDefault() para o início do handler, fora de qualquer if/else.
    event.preventDefault(); 

    // 2. Confirmação do usuário
    if (!confirm("Tem certeza que deseja salvar os dados?")) {
        alert("Operação cancelada");
        return; // Retorna para não continuar a execução
    }

    // Coleta os parâmetros da URL
    var urlParams = new URLSearchParams(window.location.search);
    var ID = urlParams.get('ID'); // ID será null/undefined para cadastro, um valor para edição

    // Valida o CPF
    var cpfValue = document.getElementById('cpf').value.replace(/[^\d]/g, '');
    // Cuidado aqui: você tem uma função 'validarCPF' e uma linha comentada 'function cpf'.
    // Certifique-se de que 'cpf' está definida ou use 'validarCPF'.
    // Vou assumir que você quer usar 'validarCPF':
    var cpfValido = validarCPF(cpfValue); 
    if (!cpfValido) {
        alert('CPF inválido. Por favor, verifique e tente novamente.');
        // Não é necessário outro event.preventDefault() aqui, pois já foi chamado no início.
        return;
    }

    // Valida o nome
    var nome = validarNome(document.getElementById('nome'));
    if (!nome) {
        alert('Nome inválido. Por favor, verifique e tente novamente.');
        return;
    }

    // Valida o e-mail
    var login = validarEmail(document.getElementById('login').value);
    if (!login) {
        alert('E-mail inválido. Por favor, verifique e tente novamente.');
        // Não é necessário outro event.preventDefault() aqui.
        return;
    }

    // Valida a senha
    var senha = validarSenha(document.getElementById('senha').value);
    if (!senha) {
        alert('Senha inválida. Por favor, verifique e tente novamente.');
        return;
    }

    // Valida o status
    var ativo_inativo = document.getElementById('ativo_inativo').value;
    if (!ativo_inativo) {
        alert('Status inválido. Por favor, verifique e tente novamente.');
        return;
    }

    // Valida a data de nascimento
    var dt_nasc = validarData(document.getElementById('dt_nasc').value);
    if (!dt_nasc) {
        alert('Data inválida. Por favor, verifique e tente novamente.');
        return;
    }

    // Valida o perfil
    var perfil = document.getElementById('perfil').value;
    if (!perfil) {
        alert('Perfil inválido. Por favor, verifique e tente novamente.');
        return;
    }

    // Valida o MSE
    var mse = document.getElementById('mse').value;
    if (!mse) {
        alert('MSE inválido. Por favor, verifique e tente novamente.');
        return;
    }
	
    // 3. Construa o corpo da requisição
    const requestBody = { 
        ID: ID, // Será null para cadastro, o ID para edição
        cpf: cpfValue, 
        nome: nome, 
        login: login, 
        senha: senha, 
        ativo_inativo: ativo_inativo, 
        dt_nasc: dt_nasc, 
        perfil: perfil, 
        mse: mse 
    };

    // 4. Determine a URL e o método com base na presença do ID
    // Sua rota POST para cadastro é '/cadastro', não '/usuarios'
    const requestUrl = ID ? `/usuarios/${ID}` : '/cadastro'; 
    const requestMethod = ID ? 'PUT' : 'POST';

    // 5. Envia a solicitação de atualização ou criação
    fetch(requestUrl, {
        method: requestMethod,
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(requestBody)
    })
    .then(response => {
        // Se a resposta for um redirecionamento (302) do back-end para o cadastro,
        // o navegador já teria seguido. Se o back-end retornar JSON,
        // isso será tratado aqui.
        if (response.ok) { // Verifica se o status HTTP é 2xx (sucesso)
            alert('Usuário ' + (ID ? 'atualizado' : 'cadastrado') + ' com sucesso.');
            window.location.href = '/consulta'; // Redireciona para a página de consulta
        } else {
            // Tenta ler a mensagem de erro do corpo da resposta, se disponível
            response.json().then(errorData => {
                const errorMessage = errorData.error || 'Erro desconhecido.';
                alert('Erro ao ' + (ID ? 'editar' : 'cadastrar') + ' usuário: ' + errorMessage);
                // Opcional: Redirecionar para consulta mesmo em caso de erro, ou manter na tela
                // window.location.href = '/consulta';
            }).catch(() => {
                // Caso a resposta não seja um JSON válido de erro
                alert('Erro ao ' + (ID ? 'editar' : 'cadastrar') + ' usuário. Resposta inesperada do servidor.');
                // window.location.href = '/consulta';
            });
        }
    })
    .catch(error => {
        console.error('Erro na solicitação de rede ou processamento:', error);
        alert('Ocorreu um erro de conexão. Por favor, tente novamente.');
    });

    // Remova o 'return;' solto no final.
});



document.getElementById('cancelar').addEventListener('click', function() {
    window.location.href = '/consulta';
});

/*-----LOGOUT----------------------------------------------------------------------------------------------------------*/

function confirmLogout() {
    if (confirm("Tem certeza que deseja encerrar a sessão?")) {
        window.location.href = '/logout'; // Redireciona para a rota de logout se o usuário confirmar
    } else {
        // Se o usuário cancelar, não faz nada
        // Você pode adicionar algum feedback aqui se preferir
    }
}
