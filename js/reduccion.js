document.addEventListener('DOMContentLoaded', () => {
    document.getElementById('reduceAutomatonBtn').addEventListener('click', () => {
        const inputJSON = document.getElementById('automatonJSON').value;

        try {
            const automaton = JSON.parse(inputJSON);

            // Visualizar el autómata original
            visualizeAutomaton(automaton, 'originalAutomatonNetwork');

            // Reducir el autómata
            const reducedAutomaton = reduceAutomaton(automaton);

            // Visualizar el autómata reducido
            visualizeAutomaton(reducedAutomaton, 'reducedAutomatonNetwork');
        } catch (error) {
            alert('Error: JSON inválido. Por favor, verifica el formato.');
        }
    });

    function visualizeAutomaton(automaton, containerId) {
        const nodes = new vis.DataSet(
            automaton.states.map(state => ({
                id: state,
                label: state,
                color: automaton.accepting.includes(state) ? 'lightgreen' : 'lightblue'
            }))
        );

        const edges = new vis.DataSet(
            Object.entries(automaton.transitions).flatMap(([from, transitions]) =>
                Object.entries(transitions).map(([symbol, to]) => ({
                    from,
                    to,
                    label: symbol
                }))
            )
        );

        const container = document.getElementById(containerId);
        const network = new vis.Network(container, { nodes, edges }, {});
    }

    function reduceAutomaton(automaton) {
        const { states, alphabet, initial, accepting, transitions } = automaton;

        // Inicializar particiones: estados de aceptación y no aceptación
        let partitions = [
            new Set(accepting),
            new Set(states.filter(state => !accepting.includes(state)))
        ];

        let isPartitionChanged = true;

        while (isPartitionChanged) {
            isPartitionChanged = false;
            const newPartitions = [];

            for (const partition of partitions) {
                const groups = new Map();

                for (const state of partition) {
                    const key = JSON.stringify(
                        Array.from(alphabet).map(symbol => {
                            const target = transitions[state]?.[symbol] || null;
                            return partitions.findIndex(part => part.has(target));
                        })
                    );

                    if (!groups.has(key)) {
                        groups.set(key, new Set());
                    }
                    groups.get(key).add(state);
                }

                newPartitions.push(...groups.values());
            }

            if (newPartitions.length !== partitions.length) {
                isPartitionChanged = true;
            }

            partitions = newPartitions;
        }

        // Generar el autómata reducido
        const stateMap = new Map();
        partitions.forEach((part, index) => {
            const representative = Array.from(part)[0];
            stateMap.set(representative, `P${index}`);
        });

        const reducedStates = Array.from(stateMap.values());
        const reducedTransitions = {};

        partitions.forEach(part => {
            const representative = Array.from(part)[0];
            const newState = stateMap.get(representative);
            reducedTransitions[newState] = {};

            for (const symbol of alphabet) {
                const target = transitions[representative]?.[symbol] || null;
                if (target) {
                    const targetState = Array.from(partitions).find(part => part.has(target));
                    if (targetState) {
                        reducedTransitions[newState][symbol] = stateMap.get(Array.from(targetState)[0]);
                    }
                }
            }
        });

        const reducedInitial = stateMap.get(partitions.find(part => part.has(initial)).values().next().value);
        const reducedAccepting = partitions
            .filter(part => Array.from(part).some(state => accepting.includes(state)))
            .map(part => stateMap.get(Array.from(part)[0]));

        return {
            states: reducedStates,
            alphabet,
            initial: reducedInitial,
            accepting: reducedAccepting,
            transitions: reducedTransitions
        };
    }
});
