console.log("JS CARREGANDO CONSULTAR USUARIO");

/*-----AUTENTICAÇÃO---------------------------------------------------------------------------------------------------------*/
var isAuthenticated = document.cookie.indexOf('adminAuthenticated=true') !== -1;
if (!isAuthenticated) {
    window.location.href = '/';
}

/*-----VALIDAÇÕES----------------------------------------------------------------------------------------------------------*/

// Define data máxima
document.addEventListener('DOMContentLoaded', () => {
    const hoje = new Date();
    const yyyy = hoje.getFullYear();
    const mm = String(hoje.getMonth() + 1).padStart(2, '0');
    const dd = String(hoje.getDate()).padStart(2, '0');
    document.getElementById("dt_nasc").max = `${yyyy}-${mm}-${dd}`;
});

// Formata data
function formatarData(data) {
    if (!data) return '';
    return new Date(data).toLocaleDateString('pt-BR');
}

// Valida data
function validarData(data) {
    if (!data) return null;

    const dataAtual = new Date();
    const dataSelecionada = new Date(data);
    const dataMinima = new Date('1900-01-01');

    if (dataSelecionada < dataMinima || dataSelecionada > dataAtual) {
        alert('Data inválida.');
        return null;
    }

    return data;
}

// Validação de caracteres
function validarCaracteresPermitidos(elementId, allowedCharacters) {
    const element = document.getElementById(elementId);

    element.addEventListener('keypress', function(e) {
        const chr = String.fromCharCode(e.which);
        if (!allowedCharacters.includes(chr)) {
            e.preventDefault();
        }
    });
}

validarCaracteresPermitidos("cpf", "0123456789");
validarCaracteresPermitidos("nome", "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZçÇ ");

/*-----FORMATAÇÃO DE INPUTS------------------------------------------------------------------------------------------------*/
document.addEventListener('DOMContentLoaded', () => {
    const nome = document.getElementById('nome');
    const login = document.getElementById('login');

    nome.addEventListener('input', () => {
        nome.value = nome.value.toUpperCase().replace(/\s+/g, ' ');
    });

    nome.addEventListener('blur', () => {
        nome.value = nome.value.trim();
    });

    login.addEventListener('input', () => {
        login.value = login.value.toLowerCase().replace(/\s/g, '');
    });
});

/*-----AÇÕES USUÁRIO-------------------------------------------------------------------------------------------------------*/

function toggleAtivacao(ID, ativo) {
    const action = ativo ? 'desligar' : 'ativar';

    if (!confirm(`Deseja ${action} este usuário?`)) return;

    fetch(`/usuarios/${action}/${ID}`, { method: 'POST' })
        .then(() => carregarDados())
        .catch(err => console.error(err));
}

function editUsuario(ID) {
    window.location.href = `/editar.html?ID=${ID}`;
}

/*-----FILTRO--------------------------------------------------------------------------------------------------------------*/

document.addEventListener('DOMContentLoaded', () => {

    carregarDados();

    document.getElementById('filtro-form').addEventListener('submit', async (e) => {
        e.preventDefault();

        const cpf          = document.getElementById('cpf')?.value?.trim()  || null;
        const nome         = document.getElementById('nome')?.value?.trim() || null;
        const login        = document.getElementById('login')?.value?.trim() || null;
        const perfil       = document.getElementById('perfil')?.value        || null;
        const mse          = document.getElementById('mse')?.value           || null;
        const ativo_inativo = document.getElementById('ativo_inativo')?.value || null;

        const dtInput = document.getElementById('dt_nasc')?.value;
        const dt_nasc = dtInput ? validarData(dtInput) : null;

        try {
            const response = await fetch('/usuarios/filtro', {
                method: 'POST',
                headers: {'Content-Type': 'application/json'},
                body: JSON.stringify({
                    cpf, nome, login, ativo_inativo, dt_nasc, perfil, mse
                })
            });

            const data = await response.json();
            renderTabela(data);

        } catch (error) {
            console.error('Erro no filtro:', error);
        }
    });

    document.getElementById('limpar-filtros').addEventListener('click', () => {
        document.getElementById('filtro-form').reset();
        carregarDados();
    });

});

/*-----RENDER--------------------------------------------------------------------------------------------------------------*/

function renderTabela(data) {
    const tbody = document.getElementById('tabela-usuarios');
    tbody.innerHTML = '';

    data.forEach(usuario => {
        const tr = document.createElement('tr');

        tr.innerHTML = `
            <td>${usuario.cpf}</td>
            <td>${usuario.nome}</td>
            <td>${usuario.login}</td>
            <td>${formatarData(usuario.dt_nasc)}</td>
            <td>${usuario.perfil}</td>
            <td>${usuario.mse}</td>
            <td><button class="btn btn-success" onclick="editUsuario(${usuario.ID})">Editar</button></td>
            <td>
                <button class="btn btn-${usuario.ativo_inativo ? 'danger' : 'primary'}"
                    onclick="toggleAtivacao(${usuario.ID}, ${usuario.ativo_inativo})">
                    ${usuario.ativo_inativo ? 'Desligar' : 'Ativar'}
                </button>
            </td>
        `;

        tbody.appendChild(tr);
    });
}

/*-----CARREGAMENTO INICIAL------------------------------------------------------------------------------------------------*/

async function carregarDados() {
    try {
        // MSE
        const mseRes = await fetch('/opcoesMse');
        const mseData = await mseRes.json();
        const selectMSE = document.getElementById('mse');
        selectMSE.innerHTML = '<option value=""></option>';

        mseData.forEach(op => {
            selectMSE.innerHTML += `<option value="${op.ID}">${op.descricao}</option>`;
        });

        // Perfil
        const perfilRes = await fetch('/opcoesPerfil');
        const perfilData = await perfilRes.json();
        console.log('opcoesPerfil:', perfilData); 
        const selectPerfil = document.getElementById('perfil');
        selectPerfil.innerHTML = '<option value=""></option>';

        perfilData.forEach(op => {
            selectPerfil.innerHTML += `<option value="${op.ID}">${op.descricao}</option>`;
        });

        // Usuários
        const userRes = await fetch('/todosUsuarios');
        const users = await userRes.json();
        renderTabela(users);

    } catch (err) {
        console.error('Erro ao carregar dados:', err);
    }
}

/*-----LOGOUT--------------------------------------------------------------------------------------------------------------*/

function confirmLogout() {
    if (confirm("Deseja sair?")) {
        window.location.href = '/logout';
    }
}