export function aplicarMascaraCEP(idCampo) {
		const campo = $(idCampo);
		if (!campo) return;

		campo.addEventListener("input", function () {
			let v = this.value.replace(/\D/g, '');

			if (v.length > 5) {
				v = v.replace(/^(\d{5})(\d)/, "$1-$2");
			}

			this.value = v.slice(0, 9);
	});
}

//--------------------------------mascara processo--------------------
export function aplicarMascaraProcesso(input){
    const formato = '0000000-00.0000.0.00.0000';

    input.addEventListener('input', function(){
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
    }
)};

        