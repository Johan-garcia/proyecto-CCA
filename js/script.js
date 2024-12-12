// Variables globales
let cinta = [];         // Representa la cinta
let posicionCabezal = 0;  // Posición del cabezal en la cinta (índice del arreglo)
let estadoActual = "q0";
let transiciones = {};  // Objeto que almacena las transiciones
let ejecutando = false;
let cintaInicial = [];
let estadoInicial = "q0";
let simboloBlanco = "#";
let elementoCinta = document.getElementById("cinta");

// Cargar botones
document.getElementById("cargarCinta").addEventListener("click", cargarCinta);
document.getElementById("cargarTransiciones").addEventListener("click", cargarTransiciones);
document.getElementById("iniciar").addEventListener("click", iniciarMaquina);
document.getElementById("pasoAPaso").addEventListener("click", pasoMaquina);
document.getElementById("reiniciar").addEventListener("click", reiniciarMaquina);

function cargarCinta() {
    const entrada = document.getElementById("entradaCinta").value;
    cinta = entrada.split('');
    for (let i = 0; i < 10; i++) { cinta.unshift(simboloBlanco); }
    for (let i = 0; i < 10; i++) { cinta.push(simboloBlanco); }
    cintaInicial = cinta.slice();
    posicionCabezal = 10;
    estadoActual = estadoInicial;
    actualizarCinta();
    document.getElementById("estadoActual").textContent = estadoActual;
}

function cargarTransiciones() {
    const carguedetransicion = document.getElementById("funcionesTransicion").value;
    transiciones = {};

    const lineas = carguedetransicion.split('\n').map(linea => linea.trim()).filter(linea => linea.length > 0);
    for (let linea of lineas) {
        const partes = linea.split('->').map(p => p.trim());
        if (partes.length !== 2) continue;
        const izquierda = partes[0];
        const derecha = partes[1];

        const coincidenciaIzquierda = izquierda.match(/\(([^,]+),\s*([^)]+)\)/);
        const coincidenciaDerecha = derecha.match(/\(([^,]+),\s*([^,]+),\s*([^)]+)\)/);

        if (coincidenciaIzquierda && coincidenciaDerecha) {
            const desdeEstado = coincidenciaIzquierda[1].trim();
            const simboloLectura = coincidenciaIzquierda[2].trim();
            const haciaEstado = coincidenciaDerecha[1].trim();
            const simboloEscritura = coincidenciaDerecha[2].trim();
            const direccion = coincidenciaDerecha[3].trim();

            if (!transiciones[desdeEstado]) {
                transiciones[desdeEstado] = {};
            }
            transiciones[desdeEstado][simboloLectura] = { haciaEstado, simboloEscritura, direccion };
        }
    }

    console.log("Transiciones cargadas:", transiciones);
}

function actualizarCinta() {
    elementoCinta.innerHTML = "";
    cinta.forEach((simbolo, indice) => {
        const celda = document.createElement("div");
        celda.classList.add("tape-cell");
        celda.textContent = simbolo;

        if (indice === posicionCabezal) {
            const marcadorCabezal = document.createElement("div");
            marcadorCabezal.classList.add("head");
            celda.appendChild(marcadorCabezal);
            celda.classList.add("highlight");
        }

        elementoCinta.appendChild(celda);
    });

    const anchoCelda = 40;
    elementoCinta.style.transform = `translateX(-${(posicionCabezal * anchoCelda) - (window.innerWidth / 2) + 20}px)`;
}

function pasoMaquina() {
    if (!transiciones[estadoActual]) {
        alert("No hay transiciones definidas para el estado actual: " + estadoActual);
        return;
    }

    const simboloActual = cinta[posicionCabezal];
    const posible = transiciones[estadoActual][simboloActual];
    if (!posible) {
        alert("No hay transición definida para (" + estadoActual + "," + simboloActual + "). La máquina se detuvo.");
        ejecutando = false;
        return;
    }

    estadoActual = posible.haciaEstado;
    cinta[posicionCabezal] = posible.simboloEscritura;
    if (posible.direccion === "R") posicionCabezal++;
    else if (posible.direccion === "L") posicionCabezal--;

    document.getElementById("estadoActual").textContent = estadoActual;
    actualizarCinta();

    if (estadoActual === "q2") {
        alert("Cadena aceptada!");
        ejecutando = false;
    }
}

function iniciarMaquina() {
    ejecutando = true;
    const intervalo = setInterval(() => {
        if (!ejecutando) {
            clearInterval(intervalo);
            return;
        }
        pasoMaquina();
    }, 1000);
}

function reiniciarMaquina() {
    cinta = cintaInicial.slice();
    estadoActual = estadoInicial;
    posicionCabezal = 10;
    ejecutando = false;
    actualizarCinta();
    document.getElementById("estadoActual").textContent = estadoActual;
}
