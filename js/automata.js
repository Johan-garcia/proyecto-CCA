document.addEventListener('DOMContentLoaded', () => {
    const nodes = new vis.DataSet([]);
    const edges = new vis.DataSet([]);
    const container = document.getElementById('mynetwork');
    const data = { nodes, edges };
    const options = {};
    const network = new vis.Network(container, data, options);

    // Event handlers
    document.getElementById('addNode').addEventListener('click', () => {
        const nodeId = prompt('Ingrese el ID del nuevo estado:');
        if (nodeId) {
            nodes.add({ id: nodeId, label: nodeId });
        }
    });

    document.getElementById('addEdge').addEventListener('click', () => {
        const from = prompt('Estado de origen:');
        const to = prompt('Estado de destino:');
        const label = prompt('Etiqueta de la transición:');
        if (from && to && label) {
            edges.add({ from, to, label });
        }
    });

    document.getElementById('setInitialState').addEventListener('click', () => {
        const initialState = prompt('Ingrese el estado inicial:');
        if (initialState) {
            nodes.update({ id: initialState, color: { background: 'green' } });
        }
    });

    document.getElementById('setFinalStates').addEventListener('click', () => {
        const finalState = prompt('Ingrese el estado final:');
        if (finalState) {
            nodes.update({ id: finalState, color: { background: 'red' } });
        }
    });

    document.getElementById('processString').addEventListener('click', () => {
        const inputString = prompt('Ingrese la cadena a procesar:');
        alert(`Procesando cadena: ${inputString}`); // Implementa el procesamiento real aquí.
    });

    document.getElementById('showTransitionMatrix').addEventListener('click', () => {
        alert('Matriz de transiciones:'); // Implementa la lógica para mostrar la matriz.
    });
});

