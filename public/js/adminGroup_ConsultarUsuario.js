/*-----AUTENTICAÇÃO---------------------------------------------------------------------------------------------------------*/

// Verifica se o usuário está autenticado usando o cookie de admin
var isAuthenticated = document.cookie.indexOf('adminAuthenticated=true') !== -1;
if (!isAuthenticated) {
    // Redireciona para a página de login se não estiver autenticado
    window.location.href = '/';
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

// Função para formatar a data no formato dd/mm/aaaa
function formatarData(data) {
    // Cria um novo objeto Date a partir da string de data fornecida
    var date = new Date(data);
    // Retorna a data formatada de acordo com o formato local 'pt-BR'
    return date.toLocaleDateString('pt-BR');
}

// Função para validar datas (ela usa a função de formatar)
function validarData(data) {
    var dataAtual = new Date();
    var dataSelecionada = new Date(data);
    // Verificar se a data é anterior a 01 de janeiro de 1900
    var dataMinima = new Date('1900-01-01');
    if (dataSelecionada < dataMinima) {
        alert('Por favor, selecione uma data posterior a 01 de janeiro de 1900.');
        return false;
    }
    if (dataSelecionada > dataAtual) {
        alert('Por favor, selecione uma data igual ou anterior à data atual.');
        return false;
    } else {
        return data;
    }
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

// Aplicando a validação para cada campo de entrada
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


/*-----FUNÇÃO DE ATIVAÇÃO E DESLIGAMENTO DE USUÁRIOS----------------------------------------------------------------------------------------------------------*/

// Função para ativar/desativar o usuário
function toggleAtivacao(ID, ativo) {
    // Define a mensagem de confirmação com base no estado de ativação/desativação
    var confirmMessage = ativo ? 'Tem certeza que deseja desligar este usuário?' : 'Tem certeza que deseja ativar este usuário?';
    // Se o usuário confirmar a ação
    if (confirm(confirmMessage)) {
        // Determina a ação com base no estado de ativação/desativação
        var action = ativo ? 'desligar' : 'ativar';
        // Realiza uma requisição fetch para ativar/desativar o usuário
        fetch(`/usuarios/${action}/${ID}`, {
            method: 'POST'
        })
        .then(response => response.json())
        .then(data => {
            // Recarrega os dados após a operação ser concluída
            carregarDados();
        })
        .catch(error => {
            // Registra um erro caso ocorra algum problema na requisição
            console.error(`Erro ao ${action} usuário:`, error);
        });
    }
}

/*-----AÇÕES DO BOTÃO DE EDITAR USUÁRIO--------------------------------------------------------------------------------------*/

//Ao clicar em editar envia o ID do respectivo usuário para a requisição
function editUsuario(ID) {
    window.location.href = `/editar.html?ID=${ID}`;
}

/*-----PREENCHIMENTO INICIAL DA PÁGINA--------------------------------------------------------------------------------------*/

//Função que executa as opções padrões ao iniciar a página
window.onload = function() {

    // Carrega os dados ao entrar na página
    carregarDados();

    /*-----AÇÕES DE FILTRAGEM----------------------------------------------------------------------------------------------------------*/

    //filtra de acordo com os parâmetros
    var form = document.getElementById('filtro-form');
    // Adiciona um evento de envio do formulário
    form.addEventListener('submit', function(event) {
        // Previne o comportamento padrão de envio do formulário
        event.preventDefault();
        // Obtém os valores dos campos do formulário
        var cpf = document.getElementById('cpf').value;
        var nome = document.getElementById('nome').value;
        var login = document.getElementById('login').value;
        var ativo_inativo = document.getElementById('ativo_inativo').value;
        var dt_nasc = validarData(document.getElementById('dt_nasc').value);
        var perfil = document.getElementById('perfil').value;
        var mse = document.getElementById('mse').value;
        // Realiza uma requisição fetch para enviar os dados do filtro
        fetch('/filtro', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({  cpf: cpf, nome: nome, login: login, ativo_inativo: ativo_inativo, dt_nasc: dt_nasc, perfil: perfil, mse: mse })
        })
        .then(response => response.json())
        .then(data => {
            // Limpa o conteúdo da tabela de usuários
            var tbody = document.getElementById('tabela-usuarios');
            tbody.innerHTML = '';

    
            // Para cada usuário retornado na resposta
            data.forEach(usuario => {
                // Cria uma nova linha na tabela com os dados do usuário
                var tr = document.createElement('tr');
                tr.innerHTML = `
                    <td>${usuario.cpf}</td>
                    <td>${usuario.nome}</td>
                    <td>${usuario.login}</td>
                    <td>${formatarData(usuario.dt_nasc)}</td>
                    <td>${usuario.perfil}</td>
                    <td>${usuario.mse}</td>
                    <td>
                        <button class="btn btn-success" onclick="editUsuario(${usuario.ID}, true)">Editar</button>
                    </td>
                    <td>
                        <button class="btn btn-${usuario.ativo_inativo ? 'danger' : 'success'}" onclick="toggleAtivacao(${usuario.ID}, ${usuario.ativo_inativo})">${usuario.ativo_inativo ? 'Desligar' : 'Ativar'}</button>
                    </td>
                `;
                // Adiciona a linha à tabela
                tbody.appendChild(tr);
                // Adicione o estilo para a tabela
            });
        })
        .catch(error => {
            // Registra um erro caso ocorra algum problema na requisição
            console.error('Erro:', error);
        });
    });

    /*-----AÇÃO DO BOTÃO DE LIMPEZA DE FILTRO----------------------------------------------------------------------------------------------------------*/

    //Função para limpar os filtros
    document.getElementById('limpar-filtros').addEventListener('click', function() {
        window.location.reload();
    });

};

/*-----VALORES UTILIZADOS NO PREENCHIMENTO INICIAL DA PÁGINA----------------------------------------------------------------------------------------------------------*/

// Função contendo os valores de select padrão e os usuários para iniciar a página
function carregarDados() {
    // Busca opções MSE do servidor e preenche o dropdown
    fetch('/opcoesMse')
    .then(response => response.json())
    .then(opcoesMSE => {
        var selectMSE = document.getElementById('mse');
        var option = document.createElement('option');
        option.text = ''; 
        option.value = '';
        selectMSE.appendChild(option);
        opcoesMSE.forEach(opcao => {
            var option = document.createElement('option');
            option.text = opcao.descricao;
            selectMSE.appendChild(option);
        });
    })
    .catch(error => {
        console.error('Erro ao buscar opções MSE:', error);
    });

    // Busca opções de Perfil do servidor e preenche o dropdown
    fetch('/opcoesPerfil')
    .then(response => response.json())
    .then(opcoesPerfil => {
        var selectPerfil = document.getElementById('perfil');
        var option = document.createElement('option');
        option.text = '';
        option.value = '';
        selectPerfil.appendChild(option);
        opcoesPerfil.forEach(opcao => {
            var option = document.createElement('option');
            option.text = opcao.descricao;
            selectPerfil.appendChild(option);
        });
    })
    .catch(error => {
        console.error('Erro ao buscar opções Perfil:', error);
    });

    // Busca todos os usuários do servidor e preenche a tabela
    var xhr = new XMLHttpRequest();
    xhr.open('GET', '/todosUsuarios', true);
    xhr.onload = function() {
        if (xhr.status >= 200 && xhr.status < 300) {
            var data = JSON.parse(xhr.responseText);
            var tbody = document.getElementById('tabela-usuarios');
            tbody.innerHTML = '';
            data.forEach(function(resultado) {
                var tr = document.createElement('tr');
                tr.innerHTML = `
                    <td>${resultado.cpf}</td>
                    <td>${resultado.nome}</td>
                    <td>${resultado.login}</td>
                    <td>${formatarData(resultado.dt_nasc)}</td>
                    <td>${resultado.perfil}</td>
                    <td>${resultado.mse}</td>
                    <td><button class="btn btn-success" onclick="editUsuario(${resultado.ID})">Editar</button></td>
                    <td><button class="btn btn-${resultado.ativo_inativo ? 'danger' : 'primary'}" onclick="toggleAtivacao(${resultado.ID}, ${resultado.ativo_inativo})">${resultado.ativo_inativo ? 'Desligar' : 'Ativar'}</button></td>
                `;
                tbody.appendChild(tr);
            });
        } else {
            console.error('Erro ao obter os dados do servidor.');
        }
    };
    xhr.onerror = function() {
        console.error('Erro ao obter os dados do servidor.');
    };
    xhr.send();
}

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