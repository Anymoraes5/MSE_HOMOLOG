/*-----AUTENTICAÇÃO---------------------------------------------------------------------------------------------------------*/

// Verifica se o usuário está autenticado usando o cookie de user
var isAuthenticated = document.cookie.indexOf('userAuthenticated=true') !== -1;
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
    // Cria um novo objeto Date com a string de data
    var date = new Date(data);
    // Retorna a data formatada usando toLocaleDateString()
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

//função para padronizar numero do processo
document.addEventListener('DOMContentLoaded', function() {
    const nProcessoInput = document.getElementById('n_processo');
    const formato = '0000000-00.0000.0.00.0000';

    nProcessoInput.addEventListener('input', function() {
        let valorDigitado = this.value.replace(/[^\d]/g, ''); // Remove tudo que não é dígito
        let valorFormatado = '';
        let indiceFormato = 0;
        let indiceDigitado = 0;

        while (indiceDigitado < valorDigitado.length && indiceFormato < formato.length) {
            const caractereFormato = formato[indiceFormato];
            const caractereDigitado = valorDigitado[indiceDigitado];

            if (/[0-9]/.test(caractereFormato)) {
                if (caractereDigitado) {
                    valorFormatado += caractereDigitado;
                    indiceDigitado++;
                }
                indiceFormato++;
            } else {
                valorFormatado += caractereFormato;
                indiceFormato++;
            }
        }

        this.value = valorFormatado;

        // Trunca o valor se exceder o tamanho da máscara
        if (this.value.length > formato.length) {
            this.value = this.value.slice(0, formato.length);
        }
    });
});

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
validarCaracteresPermitidos("nis", "0123456789");
validarCaracteresPermitidos("n_processo", "01234.-56789");
validarCaracteresPermitidos("nome", "qwertyuiopçlkjhgfdsazxcvbnm QWERTYUIOPÇLKJHGFDSAZXCVBNM");
validarCaracteresPermitidos("nome_social", "qwertyuiopçlkjhgfdsazxcvbnm QWERTYUIOPÇLKJHGFDSAZXCVBNM");
validarCaracteresPermitidos("nome_da_mae", "qwertyuiopçlkjhgfdsazxcvbnm QWERTYUIOPÇLKJHGFDSAZXCVBNM");

//converte letras para maisusculo e impede espaços extras
document.addEventListener('DOMContentLoaded', function() {
    const nome = document.getElementById('nome');
    const nome_social = document.getElementById('nome_social');
    const nome_da_mae = document.getElementById('nome_da_mae');
    const nome_do_pai = document.getElementById('nome_do_pai');
    const nome_responsavel = document.getElementById('nome_responsavel');
    const bairro = document.getElementById('bairro');
    const rua = document.getElementById('rua');
    const complemento = document.getElementById('complemento');
    const nome_do_contato = document.getElementById('nome_do_contato');

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

    formatarNome(nome);
    formatarNome(nome_social);
    formatarNome(nome_da_mae);
});

/*-----FUNÇÃO DE ATIVAÇÃO E DESLIGAMENTO DE USUÁRIOS----------------------------------------------------------------------------------------------------------*/

// Função para ativar/desativar o usuário
function toggleAtivacao(ID, ativo) {
    // Define a mensagem de confirmação com base no estado de ativação/desligamento
    var confirmMessage = ativo ? 'Tem certeza que deseja desligar esta pessoa?' : 'Tem certeza que deseja ativar esta pessoa?';
    // Se o usuário confirmar a ação
    if (confirm(confirmMessage)) {
        // Determina a ação com base no estado de ativação/desligamento
        var action = ativo ? 'desligar' : 'ativar';
        // Realiza uma requisição fetch para ativar/desligar a pessoa
        fetch(`/pessoaAtiva/${action}/${ID}`, {
            method: 'POST'
        })
        .then(response => response.json())
        .then(data => {
            // Recarrega os dados após a operação ser concluída
            carregarDados();
        })
        .catch(error => {
            // Registra um erro caso ocorra algum problema na requisição
            console.error(`Erro ao ${action} pessoa:`, error);
        });
    }
}

/*-----AÇÕES DO BOTÃO DE EDITAR PESSOA--------------------------------------------------------------------------------------*/

//Acessa a página de editar o usuário com base no ID
function editUsuario(ID) {
    window.location.href = `/editarPessoas?ID=${ID}`;
}

/*-----PREENCHIMENTO INICIAL DA PÁGINA--------------------------------------------------------------------------------------*/

//Função contendo os scripts para executar ao entrar na página
window.onload = function() {
    // Carrega os dados ao entrar na página
    carregarDados();

    /*-----AÇÕES DE FILTRAGEM----------------------------------------------------------------------------------------------------------*/

    // Função para executar os filtros passados no corpo
    var form = document.getElementById('filtro-form');
    form.addEventListener('submit', function(event) {
        // Previne o comportamento padrão de envio do formulário
        event.preventDefault();
        // Obtém os valores dos campos do formulário
        var cpf = document.getElementById('cpf').value;
        var nis = document.getElementById('nis').value;
        var n_processo = document.getElementById('n_processo').value;
        var nome = document.getElementById('nome').value;
        var nome_social = document.getElementById('nome_social').value;
        var nome_da_mae = document.getElementById('nome_da_mae').value;
        var dt_nasc = validarData(document.getElementById('dt_nasc').value);
        var ativo_inativo = document.getElementById('ativo_inativo').value;
        var tec_ref = document.getElementById('tec_ref').value;
        
        // Realiza uma requisição fetch para filtrar as pessoas com base nos dados fornecidos
        fetch('/filtroPessoas', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ cpf: cpf, nis: nis, n_processo: n_processo, nome: nome, nome_social: nome_social, nome_da_mae: nome_da_mae,  dt_nasc: dt_nasc, ativo_inativo: ativo_inativo, tec_ref: tec_ref  })
        })
        .then(response => response.json())
        .then(data => {
            // Limpa o conteúdo da tabela de usuários
            var tbody = document.getElementById('tabela-usuarios');
            tbody.innerHTML = '';
            // Para cada pessoa retornada na resposta
            data.forEach(pessoa => {
                // Cria uma nova linha na tabela com os dados da pessoa
                var tr = document.createElement('tr');
                
                
                /*---------------------*/
                console.log("teste:", pessoa.tec_ref)
                console.log("teste:", pessoa.dt_nasc)
                /*-----------------------*/

                tr.innerHTML = `
                    <td>${pessoa.cpf}</td>
                    <td>${pessoa.nis}</td>
                    <td>${pessoa.n_processo}</td>
                    <td>${pessoa.nome}</td>
                    <td>${pessoa.nome_social}</td>
                    <td>${pessoa.nome_da_mae}</td>
                    <td>${formatarData(pessoa.dt_nasc)}</td>
                    <td>${pessoa.tec_ref}</td>
                    
                    <td>
                        <button class="btn btn-warning" onclick="editUsuario(${pessoa.ID})">Editar</button>
                    </td>
                    <td>
                        <button class="btn btn-${pessoa.ativo_inativo ? 'danger' : 'success'}" onclick="toggleAtivacao(${pessoa.ID}, ${pessoa.ativo_inativo})">${pessoa.ativo_inativo ? 'Desligar' : 'Ativar'}</button>
                    </td>
                `;
                // Adiciona a linha à tabela
                tbody.appendChild(tr);
            });
        })
        .catch(error => {
            // Registra um erro caso ocorra algum problema na requisição
            console.error('Erro:', error);
        });
    });

    /*-----AÇÃO DO BOTÃO DE LIMPEZA DE FILTRO----------------------------------------------------------------------------------------------------------*/

    // Adiciona um evento ao botão de limpar filtros
    document.getElementById('limpar-filtros').addEventListener('click', function() {
        window.location.reload();
    });

};

/*-----VALORES UTILIZADOS NO PREENCHIMENTO INICIAL DA PÁGINA----------------------------------------------------------------------------------------------------------*/

// Função para carregar os dados de todas as pessoas com MSE
function carregarDados() {
     fetch('/opcoesTecSession')
     .then(response => response.json())
     .then(opcoesTecRef => {
        var selectTecRef = document.getElementById('tec_ref');
        selectTecRef.innerHTML = ''; // Limpa as opções existentes
        var option = document.createElement('option');
        option.text = ''; 
        option.value = '';
        selectTecRef.appendChild(option);

        opcoesTecRef.forEach(opcao => {
            var option = document.createElement('option');
            option.text = opcao.nome;
            option.value = opcao.nome; // Adiciona o valor da opção
            selectTecRef.appendChild(option);
        });
    })
     .catch(error => {
         console.error('Erro ao buscar opções mse:', error);
     });

    // Cria uma nova requisição XMLHttpRequest
    var xhr = new XMLHttpRequest();
    // Abre uma requisição GET para obter os dados de todas as pessoas com MSE
    xhr.open('GET', '/todasPessoasMse', true);
    // Define o que fazer quando a requisição carregar
    xhr.onload = function() {
        // Verifica se o status da requisição está entre 200 e 299 (sucesso)
        if (xhr.status >= 200 && xhr.status < 300) {
            // Parseia os dados da resposta para JSON
            var data = JSON.parse(xhr.responseText);
            // Obtém a referência ao corpo da tabela de usuários
            var tbody = document.getElementById('tabela-usuarios');
            // Limpa apenas os dados da tabela
            tbody.innerHTML = '';
            // Para cada resultado retornado
            data.forEach(function(resultado) { 
                // Substitui valores NULL por strings vazias ou "--"
                var cpf = resultado.cpf || ' -- ';
                var nis = resultado.nis || ' -- ';
                var n_processo = resultado.n_processo || ' -- ';
                var nome = resultado.nome;
                var nome_social = resultado.nome_social || ' -- ';
                var nome_da_mae = resultado.nome_da_mae;
                var dt_nasc = formatarData(resultado.dt_nasc);
                var tec_ref = resultado.tec_ref;

                // Cria uma nova linha na tabela com os dados do resultado
                var tr = document.createElement('tr');
                tr.innerHTML = `
                    <td>${cpf}</td>
                    <td>${nis}</td>
                    <td>${n_processo}</td>
                    <td>${nome}</td>
                    <td>${nome_social}</td>
                    <td>${nome_da_mae}</td>
                    <td>${dt_nasc}</td>
                    <td>${tec_ref}</td>
                    <td><button class="btn btn-warning" onclick="editUsuario(${resultado.ID})">Editar</button></td>
                    <td><button class="btn btn-${resultado.ativo_inativo ? 'danger' : 'success'}" onclick="toggleAtivacao(${resultado.ID}, ${resultado.ativo_inativo})">${resultado.ativo_inativo ? 'Desligar' : 'Ativar'}</button></td>
                `;
                // Adiciona a linha à tabela
                tbody.appendChild(tr);
            });
        } else {
            // Registra um erro se a requisição falhar
            console.error('Erro ao obter os dados do servidor.');
        }
    };
    // Define o que fazer em caso de erro na requisição
    xhr.onerror = function() {
        console.error('Erro ao obter os dados do servidor.');
    };
    // Envia a requisição
    xhr.send();
}

// Chama a função para carregar os dados ao carregar a página
document.addEventListener('DOMContentLoaded', carregarDados);


/*-----CONFIRMAÇÃO DE LOGOUT----------------------------------------------------------------------------------------------------------*/

// Função para confirmar logout
function confirmLogout() {
    if (confirm("Tem certeza que deseja encerrar a sessão?")) {
        window.location.href = '/logout'; // Redireciona para a rota de logout se o usuário confirmar
    } else {
        // Se o usuário cancelar, não faz nada
    }
}