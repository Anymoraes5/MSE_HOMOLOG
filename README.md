function carregarDados(){
    console.log("CARREGAR DADOS EXECUTOU");
    // Busca as opções para o Creas atual
    popularSelect({ url: "/opcoesCreasAtual", selectId: "creas_atual", addDefault: true, defaultText: "Selecione" });
    // Busca as opções para o Creas de origem
    popularSelect({ url: "/opcoesCreas", selectId: "creas_origem", addDefault: true, defaultText: "Selecione" });
    // Busca as opções deficiência
    popularSelect({ url: "/opcoesDeficiencia", selectId: "deficiencia", addDefault: true, defaultText: "Selecione" });
    // Busca as opções de Distrito para o serviço
    popularSelect({ url: "/opcoesDistrito", selectId: "distrito_servico", addDefault: true, defaultText: "Selecione" });
    // Busca as opções de Distrito para a pessoa
    popularSelect({ url: "/opcoesDistrito", selectId: "distrito_pessoa", addDefault: true, defaultText: "Selecione"});
    // Busca as opções Ciclo Estudo 
    popularSelect({ url: "/opcoesCicloEstudo", selectId: "cicloEstudo", addDefault: true, defaultText: "Selecione" });
    // Busca as opções Tipo Escola
    popularSelect({ url: "/opcoesTipoescola", selectId: "tipoEscola", addDefault: true, defaultText: "Selecione" });
    // Busca as opções ensinoModalidade
    popularSelect({ url: "/opcoesEnsinoModalidade", selectId: "ensinoModalidade", addDefault: true, defaultText: "Selecione" });
    // Busca as opções de Parou de estudar
     popularSelect({ url: "/opcoesParoudeestudar", selectId: "paroudeEstudar", addDefault: true, defaultText: "Selecione" });
    // Busca as opções EstadoCivil
    popularSelect({ url: "/opcoesEstadoCivil", selectId: "estado_civil", addDefault: true, defaultText: "Selecione"});
    // Busca as opções Genero
    popularSelect({ url: "/opcoesGenero", selectId: "genero", addDefault: true, defaultText: "Selecione"});
    // Busca as opções MedidasMse
    popularSelect({ url: "/opcoesMedidasMse", selectId: "medidas_mse", addDefault: true, defaultText: "Selecione"});
    // Busca as opções Raca
    popularSelect({url: "/opcoesraca", selectId: "raca", addDefault: true, defaultText: "Selecione"});
    // Busca as opções trabalho
    popularSelect({ url: "/opcoesTrabalho", selectId: "trabalho", addDefault: true, defaultText: "Selecione"});
    // Busca as opções alcool_drogas
    popularSelect({ url: "/opcoesAlcoolDrogas", selectId: "alcool_ou_drogas", addDefault: true, defaultText: "Selecione" });
    // Busca as opções Nacionalidade
    popularSelect({url: "/opcoesNacionalidade", selectId: "nacionalidade", addDefault: true, defaultText: "Selecione" });

    // Busca as opções OrientacaoSexual
    popularSelect({url: "/opcoesOrientacaoSexual", selectId: "orientacao_sexual", addDefault: true, defaultText: "Selecione" });

    // Busca as opções Sas
    popularSelect({ url: "/opcoesSas", selectId: "sas",  addDefault: true, defaultText: "Selecione" });
   // Busca as opções MSE
   popularSelect({
        url: "/opcoesMse",
        selectId: "mse",
        textKey: "descricao",
        valueKey: "descricao", // mantém como antes
        addDefault: true,
        defaultText: "Selecione",
        filterFn: opcao => 
            opcao.descricao !== "ADMINISTRADORES DO SISTEMA"
    });
	
	// Carrega os tipos de local
    popularSelect({
        url: "/opcoesTipoLocal",
        selectId: "tipo_local",
        addDefault: true,
        defaultText: "Selecione",
        valueKey: "descricao",
        textKey: "descricao"
    });

	 // Carrega os tipos de logradouro
     popularSelect({
        url: "/opcoesTipoLogradouro",
        selectId: "tipo_logradouro",
        addDefault: true,
        defaultText: "Selecione",
        valueKey: "descricao",
        textKey: "descricao"
    });

	// Carrega as atividades da unidade
	popularSelect({
        url: "/opcoesAtividadeUnidade",
        selectId: "atividade_unidade",
        addDefault: true,        // adiciona option vazia
        valueKey: "id",          // usa id como value
        textKey: "descricao",
        defaultText: "Selecione",
        sortFn: (a, b) => {
            if (a.descricao.toUpperCase() === "OUTROS") return 1;
            if (b.descricao.toUpperCase() === "OUTROS") return -1;
            return a.descricao.localeCompare(b.descricao);
        }
    });
			
    // Função para buscar as opções TecRef com base no mse selecionado
    function buscarTecRefPorMse(mseSelecionado) {
        console.log("FUNÇÃO CHAMADA", mseSelecionado);

        fetch(`/opcoesTecRef?mse=${encodeURIComponent(mseSelecionado)}`)
            .then(response => response.json())
            .then(opcoesTecRef => {
                var selectTecRef = $('tec_ref');
                selectTecRef.innerHTML = ''; // Limpa as opções existentes

                opcoesTecRef.forEach(opcao => {
                    var option = document.createElement('option');
                    option.text = opcao.nome;
                    selectTecRef.appendChild(option);
                });
            })
            .catch(error => {
                console.error('Erro ao buscar opções Técnico de Referência:', error);
            });
    }

    // Adiciona um evento change ao select de MSE
    document.addEventListener("change", function (e) {
    if (e.target && e.target.id === "mse") {
        buscarTecRefPorMse(e.target.value);
    }
});




    // Busca as opções UBS
fetch('/opcoesUbs')
.then(response => response.json())
.then(opcoesUbs => {
    const datalist = $('ubs-list');
    const input = $('ubs-input');
    const hiddenInput = $('ubs');
    
    // Preenche o datalist com todas as opções
    opcoesUbs.forEach(opcao => {
        const option = document.createElement('option');
        option.value = opcao.descricao;
        datalist.appendChild(option);
    });
    if (!datalist || !input || !hiddenInput) return;
    
    // Mostra todas as opções quando o input recebe foco
    input.addEventListener('focus', function() {
        this.value = ''; // Limpa o campo ao receber foco
        hiddenInput.value = ''; // Limpa o valor oculto
    });
    
    // Atualiza o campo oculto quando uma opção é selecionada
    input.addEventListener('input', function() {
        const selectedValue = this.value;
        if (opcoesUbs.some(opcao => opcao.descricao === selectedValue)) {
            hiddenInput.value = selectedValue;
        } else {
            hiddenInput.value = '';
        }
    });
    
    // Validação para garantir que apenas valores da lista sejam aceitos
    input.addEventListener('change', function() {
        if (!opcoesUbs.some(opcao => opcao.descricao === this.value)) {
            this.value = '';
            hiddenInput.value = '';
        }
    });
})
.catch(error => {
    console.error('Erro ao buscar opções UBS:', error);
});

    

    // Busca as opções de Programas Sociais
    
fetch('/opcoesProgramasSociais')
    .then(response => response.json())
    .then(opcoesProgramasSociais => {
        var divContainer = $('programas_sociais_container');
        var addButton = $('add_programa_social');
        var removeButton = $('remove_programa_social');

        const reencontro_block = "AUXÍLIO REENCONTRO";
        const reencontro_block1 = "AUXÍLIO REENCONTRO FAMÍLIA";

        const BOLSA_TRABALHO = "BOLSA TRABALHO";

        const BLOQUEADOS_COM_BOLSA = [
            "PRIMEIRO EMPREGO",
            "PROGRAMA JOVEM APRENDIZ",
            "PROGRAMA OPERAÇÃO TRABALHO",
            "PROGRAMA TEM SAÍDA - PORTARIA SMTE 25/2018",
            "PROGRAMA TRANSCIDADANIA",
            "RENDA MÍNIMA",
            "TRABALHO NOVO"
        ];

        // Função para criar um novo select
        function criarSelect() {
            var container = document.createElement('div');
            container.className = 'programa-social-container';
            container.style.display = 'flex';  // Alinha os itens horizontalmente
            container.style.alignItems = 'center';  // Alinha verticalmente no centro

            var newSelect = document.createElement('select');
            newSelect.name = 'programas_sociais[]';
            newSelect.className = 'form-select mb-2';

            // Adiciona a opção padrão ao novo <select>
            var defaultOption = document.createElement('option');
            defaultOption.value = '';
            defaultOption.text = 'Selecione um programa social';
            newSelect.appendChild(defaultOption);

            // Preenche o novo <select> com as opções de programas sociais
            opcoesProgramasSociais.forEach(opcao => {
                var option = document.createElement('option');
                option.value = opcao.descricao;
                option.text = opcao.descricao;
                newSelect.appendChild(option);
            });

            // Adiciona evento para verificar duplicatas após a seleção
            newSelect.addEventListener('change', function() {
                
                const selectedValues = Array
                    .from(divContainer.querySelectorAll('select'))
                    .map(select => select.value)
                    .filter(v => v !== "");

                const valorAtual = newSelect.value;

                // 🚫 REGRA 12
                if (
                    selectedValues.includes(reencontro_block) &&
                    selectedValues.includes(reencontro_block1)
                ) {
                    alert('Auxílio Reencontro não pode ser selecionado com Auxílio Reencontro Família.');
                    newSelect.value = '';
                    return;
                }

                // 🚫 REGRA 13
                const temBolsa = selectedValues.includes(BOLSA_TRABALHO);
                const temBloqueado = selectedValues.some(v => BLOQUEADOS_COM_BOLSA.includes(v));

                if (temBolsa && temBloqueado) {
                    alert('Bolsa de Trabalho não pode ser selecionado com o(s) programa(s) adicionado');
                    newSelect.value = '';
                    return;
                }

                // 🚫 DUPLICIDADE (sua regra original)
                if (selectedValues.filter(value => value === valorAtual).length > 1) {
                    alert('Este programa social já foi selecionado.');
                    newSelect.value = '';
                }
            });

            // Botão de remover
            var removeBtn = document.createElement('button');
            removeBtn.type = 'button';
            removeBtn.className = 'btn btn-danger btn-sm ms-2';
            removeBtn.textContent = 'Remover';
            removeBtn.style.backgroundColor = '#8B0000'; // Cor vermelho escuro
            removeBtn.style.borderColor = '#8B0000';
            removeBtn.style.color = 'white';
            removeBtn.style.marginLeft = '10px'; // Espaço entre o select e o botão

            removeBtn.addEventListener('click', function() {
                var selects = divContainer.querySelectorAll('select');
                if (selects.length > 1) {
                    divContainer.removeChild(container);
                    
                    // Esconde o botão de remover se não houver mais selects
                    if (divContainer.children.length <= 1) {
                        removeButton.style.display = 'none';
                    }
                } else {
                    // Se restar apenas um campo, define o valor para a opção padrão
                    var lastSelect = selects[0];
                    lastSelect.value = '';  // Define o valor padrão
                }
            });

            // Adiciona o select e o botão de remover ao container
            container.appendChild(newSelect);
            container.appendChild(removeBtn);
            divContainer.appendChild(container);
        }

        // Criação e preenchimento do primeiro <select>
        criarSelect();

        // Função para adicionar quebra de linha após o botão
        function adicionarQuebraDeLinha(elemento) {
            var br = document.createElement('br');
            elemento.parentNode.insertBefore(br, elemento.nextSibling);
        }

        // Adiciona a funcionalidade do botão para adicionar mais selects
        addButton.addEventListener('click', function(event) {
            event.preventDefault();  // Previne o comportamento padrão do botão
            var lastSelect = divContainer.lastChild.querySelector('select');
            if (lastSelect && lastSelect.value === '') {
                alert('Selecione um programa social antes de adicionar outro.');
            } else {
                criarSelect();

                // Exibe o botão de remover quando um novo select é adicionado
                removeButton.style.display = 'none';

                // Remove a quebra de linha anterior e adiciona a nova
                var br = document.querySelector('#buttons_container + br');
                if (br) {
                    br.remove();
                }
                adicionarQuebraDeLinha(addButton);
            }
        });

        // Adiciona quebra de linha após o botão de remover
        adicionarQuebraDeLinha(removeButton);
    })
    .catch(error => {
        console.error('Erro ao buscar opções programas_sociais:', error);
    });

    

    // Busca as opções servico_familia
    fetch('/opcoesServicoFamilia')
    .then(response => response.json())
    .then(opcoesServicoFamilia => {
        // Preenche o select com as opções servico_familia
        var selectServicoFamilia = $('servico_familia');
        opcoesServicoFamilia.forEach(opcao => {
            var option = document.createElement('option');
            option.text = opcao.descricao;
            selectServicoFamilia.appendChild(option);
        });
    })
    .catch(error => {
        console.error('Erro ao buscar opções servico_familia:', error);
    });

    // Busca as opções SituacaoDoProcesso
    popularSelect({
        url: "/opcoesSituacaoDoProcesso",
        selectId: "situacao_do_processo",
        addDefault: true
    });

    // Busca as opções VaraDaInfancia
    popularSelect({
        url: "/opcoesVaraDaInfancia",
        selectId: "vara_da_infancia",
        addDefault: true
    });

    //opções de contatos
    popularSelect({
        url: "/opcoesContatos",
        selectId: "tipo_de_contato",
        valueKey: "id",              // usa id como value
        textKey: "descricao",
        addDefault: true,            // adiciona option vazia
        sortFn: (a, b) => {
            // força OUTROS para o final
            if (a.descricao.toUpperCase() === "OUTROS") return 1;
            if (b.descricao.toUpperCase() === "OUTROS") return -1;
            return a.descricao.localeCompare(b.descricao);
        }
    });
}