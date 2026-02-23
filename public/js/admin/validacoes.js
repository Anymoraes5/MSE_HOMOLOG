//Validação do campo de telefone
document.addEventListener('DOMContentLoaded', function () {

    function aplicarMascaraTelefone(valor) {
        valor = valor.replace(/\D/g, '');

        if (valor.length <= 10) {
            return valor
                .replace(/^(\d{2})(\d)/, '($1) $2')
                .replace(/(\d{4})(\d)/, '$1-$2')
                .replace(/(-\d{4})\d+?$/, '$1');
        } else {
            return valor
                .replace(/^(\d{2})(\d)/, '($1) $2')
                .replace(/(\d{5})(\d)/, '$1-$2')
                .replace(/(-\d{4})\d+?$/, '$1');
        }
    }
    function telefoneCompleto(valor) {
        const fixo = /^\(\d{2}\) \d{4}-\d{4}$/;
        const celular = /^\(\d{2}\) \d{5}-\d{4}$/;
        return fixo.test(valor) || celular.test(valor);
    }

    document.querySelectorAll('.telefone-br').forEach(input => {

        // Máscara
        input.addEventListener('input', function () {
            this.value = aplicarMascaraTelefone(this.value);
        });

        // Validação ao sair do campo
        input.addEventListener('blur', function () {
			if (this.value && !telefoneCompleto(this.value)) {
				alert("Informe um telefone completo. Ex: (11) 91234-5678");
				this.value = "";

				// FORÇA REAVALIAÇÃO DA OBRIGATORIEDADE
				this.dispatchEvent(new Event('change'));
				this.dispatchEvent(new Event('input'));

				this.focus();
			}
		});
    });
    // Validação final no submit (para TODOS)
        const form = document.querySelector('form');
        if (form) {
            form.addEventListener('submit', function (e) {
                let erro = false;
    
                document.querySelectorAll('.telefone-br').forEach(input => {
                    if (input.value && !telefoneCompleto(input.value)) {
                        erro = true;
                        input.focus();
                    }
                });
    
                if (erro) {
                    e.preventDefault();
                    alert("Existe telefone incompleto no formulário.");
                }
            });
        }
});
