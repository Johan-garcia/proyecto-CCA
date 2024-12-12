document.addEventListener('DOMContentLoaded', () => {
    class LanguageProcessor {
        procesarSecuencias(entrada, n, m) {
            const regex = /^([a-zA-Z]\^(\d*[nm])\s*)+$/;
            if (!regex.test(entrada)) {
                return "Formato no válido. Use c, etc.";
            }

            let resultado = "";
            const secuencias = entrada.trim().split(/\s+/);

            for (const secuencia of secuencias) {
                const partes = secuencia.split("^");
                const letra = partes[0];
                const expresion = partes[1];

                let cantidad = 0;

                try {
                    if (expresion.endsWith("n")) {
                        const factor = expresion === "n" ? 1 : parseInt(expresion.replace("n", ""), 10);
                        cantidad = factor * n;
                    } else if (expresion.endsWith("m")) {
                        const factor = expresion === "m" ? 1 : parseInt(expresion.replace("m", ""), 10);
                        cantidad = factor * m;
                    } else {
                        return "Expresión no válida. Use 'n' o 'm' en las expresiones.";
                    }
                } catch (error) {
                    return "Error en el procesamiento de la expresión.";
                }

                resultado += letra.repeat(cantidad);
            }

            return resultado;
        }

        verificarRegularidad(n, m) {
            return n === m ? "Irregular" : "Regular";
        }
    }

    function checkLanguageType() {
        const languageInput = document.getElementById('languageTypeInput').value.trim();
        const nValue = parseInt(document.getElementById('nValue').value, 10);
        const mValue = parseInt(document.getElementById('mValue').value, 10);

        const processor = new LanguageProcessor();

        const processedSequence = processor.procesarSecuencias(languageInput, nValue, mValue);
        const regularityResult = processor.verificarRegularidad(nValue, mValue);

        const resultContainer = document.getElementById('languageResult');
        resultContainer.innerHTML = `
            <p><strong>Secuencia Procesada:</strong> ${processedSequence}</p>
            <p><strong>Tipo de Lenguaje:</strong> ${regularityResult}</p>
        `;
    }

    const checkButton = document.getElementById('checkLanguageTypeBtn');
    if (checkButton) {
        checkButton.addEventListener('click', checkLanguageType);
    }
});
