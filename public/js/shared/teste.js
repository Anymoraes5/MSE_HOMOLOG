//preenchimento para teste 
document.addEventListener("DOMContentLoaded", function () {

    const btnTeste = $("btnPreencherTeste");
    if (!btnTeste) return;

    btnTeste.addEventListener("click", function () {

        const form = $("editar-form");
        if (!form) {
            alert("Formulário não encontrado");
            return;
        }

        /* =====================================================
           FUNÇÃO AUXILIAR PARA SETAR VALOR + EVENTOS
        ===================================================== */
        function setValor(id, valor) {
            const campo = $(id);
            if (!campo) return;

            campo.value = valor;
            campo.dispatchEvent(new Event("input"));
            campo.dispatchEvent(new Event("change"));
            campo.dispatchEvent(new Event("blur"));
        }

        /* =====================================================
           CAMPOS ESPECÍFICOS (COM MÁSCARA / REGRA)
        ===================================================== */

        // CPF → 905.354.450-08
        setValor("cpf", "90535445008");

        // Cartão SUS
        setValor("cartao_sus", "254354343483434");

        // // NIS
        // setValor("nis", "15435445416");

        // Processo de execução (com máscara automática)
        setValor("n_processo", "34534834534535434834");

        // Processo de apuração
        setValor("n_processo_apuracao", "4533435354387338353463393");

        // Pasta técnica
        setValor("n_pt", "25434");

        // Número do endereço
        setValor("numero", "25");

        // CEP principal
        setValor("cep", "05143320");

        // RA
        setValor("numeroRa", "52482348384");

        // Horas PSC
        setValor("horas_psc", "3");

        // Unidade acolhedora
        setValor("numero_unidade", "45");

        /* =====================================================
           SELECT FIXO DO SMSE-MA
        ===================================================== */
        const mseSelect = $("mse");
        if (mseSelect) {
            mseSelect.value = "SMSE-MA CIAP LAJEADO";
            mseSelect.dispatchEvent(new Event("change"));
        }

        /* =====================================================
           TELEFONES (usa sua validação existente)
        ===================================================== */
        document.querySelectorAll(".telefone-br").forEach(tel => {
            tel.value = "(11) 91234-5678";
            tel.dispatchEvent(new Event("input"));
            tel.dispatchEvent(new Event("blur"));
        });

        /* =====================================================
           PREENCHIMENTO GENÉRICO (SÓ O QUE ESTIVER VAZIO)
        ===================================================== */
        form.querySelectorAll("input").forEach(input => {

            if (input.type === "hidden") return;
            if (input.readOnly) return;
            if (input.value && input.value.trim() !== "") return;

            switch (input.type) {
                case "text":
                    input.value = "Teste";
                    break;
                case "email":
                    input.value = "teste@teste.com";
                    break;
                case "date":
                    input.value = "2008-05-10";
                    break;
                case "time":
                    input.value = "08:00";
                    break;
                case "number":
                    input.value = "1";
                    break;
            }

            input.dispatchEvent(new Event("input"));
            input.dispatchEvent(new Event("change"));
        });

        /* =====================================================
           TEXTAREAS
        ===================================================== */
        form.querySelectorAll("textarea").forEach(textarea => {
            if (textarea.value && textarea.value.trim() !== "") return;
            textarea.value = "Texto de teste automático";
            textarea.dispatchEvent(new Event("input"));
        });

        /* =====================================================
           SELECTS (IGNORA OS VAZIOS / FETCH)
        ===================================================== */
        form.querySelectorAll("select").forEach(select => {

            if (select.options.length <= 1) return;
            if (select.value && select.value !== "") return;

            for (let option of select.options) {
                if (option.value !== "") {
                    select.value = option.value;
                    break;
                }
            }

            select.dispatchEvent(new Event("change"));
        });

        alert("Formulário preenchido automaticamente para teste ✅");
    });
});  