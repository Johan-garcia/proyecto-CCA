document.getElementById('simulatePDA').addEventListener('click', () => {
    const transitionsText = document.getElementById('transitions').value.trim();
    const inputWord = document.getElementById('inputWord').value.trim();
    const resultDiv = document.getElementById('pdaResult');
    
    resultDiv.innerHTML = '';

    try {
        const transitions = Transiciones(transitionsText);
        const steps = simulatePDA(transitions, inputWord);
        Simulacion(steps, resultDiv);
    } catch (error) {
        resultDiv.textContent = `Error: ${error.message}`;
    }
});



function Transiciones(text) {
    const lines = text.split('\n'); 
    const transitions = [];
    const regex = /\((.+),\s*(.+),\s*(.+)\)\s*->\s*\((.+),\s*(.+)\)/;

    for (const line of lines) {
        const match = regex.exec(line.trim()); 
        if (!match) {
            throw new Error(`Formato de transición inválido: ${line}`);
        }

        transitions.push({
            from: match[1].trim(), 
            input: match[2].trim() === '#' ? '' : match[2].trim(), 
            stackTop: match[3].trim(), 
            to: match[4].trim(), 
            stackReplace: match[5].trim() === 'E' ? '' : match[5].trim() 
        });
    }

    return transitions;
}


function simulatePDA(transitions, inputWord) {
    const stack = ['Z']; 
    const steps = []; 
    let currentState = transitions[0].from; 
    let input = inputWord.split(''); 

    while (true) {
        const currentInput = input[0] || ''; 
        const stackTop = stack[stack.length - 1] || ''; 

        // Busca una transición válida
        const transition = transitions.find(t =>
            t.from === currentState &&
            t.stackTop === stackTop &&
            (t.input === currentInput || t.input === '') 
        );

        if (!transition) {
            throw new Error(
                `Error: No se encontro una transicion valida para el estado: ${currentState}, Entrada: ${currentInput || '#'}, Tope de Pila: ${stackTop || 'E'}`
            );
        }

        steps.push({
            state: currentState,
            input: input.join('') || '#',
            stack: [...stack], 
            transition: transition
        });

        // Aplica la transición
        currentState = transition.to;

        if (transition.stackReplace === 'X') {
            stack.push(transition.stackReplace); 
        } else if (transition.stackReplace === '') {
            stack.pop(); 
        }

        if (transition.input) {
            input.shift(); 
        }

        if (
            input.length === 0 && 
            stack.length === 1 && 
            stack[0] === 'Z' &&
            currentState === 'qf' 
        ) {
            steps.push({
                state: currentState,
                input: '#',
                stack: [...stack],
                transition: null
            });
            break; 
        }
    }

    return steps;
}


// Funcion para visualizar con iconos las pilas
function symbolToIcon(symbol) {
    switch (symbol) {
        case 'Z':
            return `<span style="color: blue;">🔵</span>`; 
        case 'X':
            return `<span style="color: #b8e994;">🟢</span>`; 
        default:
            return symbol; 
    }
}

function Simulacion(steps, container) {
    container.innerHTML = ''; 

    steps.forEach((step, index) => {
        const stackRepresentation = step.stack.map(symbolToIcon).join(', '); 

        const stepDiv = document.createElement('div');
        stepDiv.innerHTML = `
            <strong>Paso ${index + 1}:</strong><br>
            Estado: ${step.state}<br>
            Entrada restante: ${step.input}<br>
            Pila: [${stackRepresentation}]<br>
            ${step.transition
                ? `Transición aplicada: (${step.transition.from}, ${step.transition.input || '#'}, ${step.transition.stackTop}) -> (${step.transition.to}, ${step.transition.stackReplace || 'E'})`
                : 'Estado final alcanzado.'}
        `;
        container.appendChild(stepDiv);
    });
}