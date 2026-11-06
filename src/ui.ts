/*
  Interfaz visual para el Sistema de Reservas de Cine
  Usa el mismo arreglo bidimensional que la version de consola.
  Los datos adicionales de reserva se guardan en formato JSON.
  Sin objetos, sin clases. Solo arrays, for, if/else y funciones sencillas.
*/

// --- Constantes (mismas que en main.ts) ---
var FILAS = 8;
var COLUMNAS = 10;

// --- Arreglo bidimensional de asientos (0 = libre, 1 = ocupado) ---
var sala: number[][] = [];

// --- Historial de reservas en formato JSON ---
// Cada reserva se guarda como un string JSON con los datos de la operacion
var historialJSON: string[] = [];

// --- Asiento actualmente seleccionado (null si no hay) ---
var seleccionFila: number = -1;
var seleccionColumna: number = -1;

// --- Inicializar sala (misma logica que crearSala en main.ts) ---
function inicializarSala(): void {
  sala = [];
  for (var i = 0; i < FILAS; i++) {
    var fila: number[] = [];
    for (var j = 0; j < COLUMNAS; j++) {
      fila.push(0);
    }
    sala.push(fila);
  }
  seleccionFila = -1;
  seleccionColumna = -1;
}

// --- Contar ocupados y libres ---
function contarOcupados(): number[] {
  var ocupados = 0;
  for (var i = 0; i < FILAS; i++) {
    for (var j = 0; j < COLUMNAS; j++) {
      if (sala[i][j] === 1) {
        ocupados++;
      }
    }
  }
  return [ocupados, FILAS * COLUMNAS - ocupados];
}

// --- Actualizar panel de resumen en el DOM ---
function actualizarResumen(): void {
  var total = FILAS * COLUMNAS;
  var ocupados = 0;
  for (var i = 0; i < FILAS; i++) {
    for (var j = 0; j < COLUMNAS; j++) {
      if (sala[i][j] === 1) {
        ocupados++;
      }
    }
  }
  var libres = total - ocupados;
  var porcentaje = (ocupados * 100) / total;

  var elLibres = document.getElementById("total-libres");
  var elOcupados = document.getElementById("total-ocupados");
  var elPorcentaje = document.getElementById("porcentaje-ocupacion");

  if (elLibres !== null) { elLibres.textContent = String(libres); }
  if (elOcupados !== null) { elOcupados.textContent = String(ocupados); }
  if (elPorcentaje !== null) { elPorcentaje.textContent = porcentaje + "%"; }
}

// --- Actualizar el panel de reserva (informacion del asiento seleccionado) ---
function actualizarPanelReserva(): void {
  var panel = document.getElementById("panel-reserva");
  var boton = document.getElementById("btn-confirmar") as HTMLButtonElement;

  if (panel === null || boton === null) { return; }

  if (seleccionFila === -1 || seleccionColumna === -1) {
    panel.innerHTML = "<p class='text-gray-400'>Haz clic en un asiento</p><p class='text-gray-400'>para seleccionarlo</p>";
    boton.disabled = true;
    return;
  }

  var fila = seleccionFila + 1;
  var columna = seleccionColumna + 1;

  if (sala[seleccionFila][seleccionColumna] === 1) {
    panel.innerHTML =
      "<p class='text-red-400 font-semibold'>Fila " + fila + ", Columna " + columna + "</p>" +
      "<p class='text-red-500'>Este asiento ya esta ocupado</p>";
    boton.disabled = true;
    return;
  }

  panel.innerHTML =
    "<p class='text-green-400 font-semibold'>Fila " + fila + ", Columna " + columna + "</p>" +
    "<p class='text-green-500'>Asiento disponible</p>";
  boton.disabled = false;
}

// --- Agregar entrada al historial JSON ---
function agregarAlHistorial(fila: number, columna: number, estado: string): void {
  var fecha = new Date();
  var dia = String(fecha.getDate());
  var mes = String(fecha.getMonth() + 1);
  var anio = fecha.getFullYear();
  var hora = String(fecha.getHours());
  var min = String(fecha.getMinutes());

  // Asegurar dos digitos manualmente (sin padStart)
  if (dia.length < 2) { dia = "0" + dia; }
  if (mes.length < 2) { mes = "0" + mes; }
  if (hora.length < 2) { hora = "0" + hora; }
  if (min.length < 2) { min = "0" + min; }
  var fechaStr = anio + "-" + mes + "-" + dia + " " + hora + ":" + min;

  // Estructura de datos en formato JSON
  var reserva = {
    tipo: "reserva",
    fila: fila + 1,
    columna: columna + 1,
    fecha: fechaStr,
    estado: estado,
    sala: "Sala 1",
    asiento: "F" + (fila + 1) + "-C" + (columna + 1)
  };

  historialJSON.push(JSON.stringify(reserva, null, 2));
  actualizarHistorialJSON();
}

// --- Actualizar la visual del historial JSON en el DOM ---
function actualizarHistorialJSON(): void {
  var pre = document.getElementById("json-output");
  if (pre === null) { return; }

  if (historialJSON.length === 0) {
    pre.textContent = "[]";
    return;
  }

  var salida = "[\n";
  for (var i = 0; i < historialJSON.length; i++) {
    salida = salida + historialJSON[i];
    if (i < historialJSON.length - 1) {
      salida = salida + ",";
    }
    salida = salida + "\n";
  }
  salida = salida + "]";
  pre.textContent = salida;
}

// --- Renderizar el mapa visual de asientos en el DOM ---
function renderizarMapa(): void {
  var contenedor = document.getElementById("mapa-asientos");
  if (contenedor === null) { return; }
  contenedor.innerHTML = "";

  for (var fila = 0; fila < FILAS; fila++) {
    // Crear una fila visual
    var filaDiv = document.createElement("div");
    filaDiv.className = "flex items-center gap-1";

    // Etiqueta de numero de fila
    var etiqueta = document.createElement("span");
    etiqueta.className = "w-6 text-xs text-gray-500 text-right mr-1";
    etiqueta.textContent = String(fila + 1);
    filaDiv.appendChild(etiqueta);

    for (var col = 0; col < COLUMNAS; col++) {
      var asientoBtn = document.createElement("button");
      var estaOcupado = sala[fila][col] === 1;
      var estaSeleccionado = (fila === seleccionFila && col === seleccionColumna);

      // Clases base
      var clases = "w-8 h-8 rounded text-xs font-bold transition cursor-pointer ";

      if (estaOcupado) {
        clases = clases + "bg-red-600 border border-red-400 text-red-200 cursor-not-allowed";
      } else if (estaSeleccionado) {
        clases = clases + "bg-yellow-500 border border-yellow-300 text-gray-900 ring-2 ring-yellow-300";
      } else {
        clases = clases + "bg-green-600 border border-green-400 text-green-200 hover:bg-green-500";
      }

      asientoBtn.className = clases;

      // Mostrar L (libre) o X (ocupado)
      if (estaOcupado) {
        asientoBtn.textContent = "X";
      } else if (estaSeleccionado) {
        asientoBtn.textContent = "L";
      } else {
        asientoBtn.textContent = "L";
      }

      // Almacenar posicion como atributos data
      asientoBtn.setAttribute("data-fila", String(fila));
      asientoBtn.setAttribute("data-columna", String(col));

      // Evento click
      if (!estaOcupado) {
        asientoBtn.onclick = function(f: number, c: number) {
          return function() {
            if (sala[f][c] === 1) { return; }
            if (seleccionFila === f && seleccionColumna === c) {
              // Deseleccionar
              seleccionFila = -1;
              seleccionColumna = -1;
            } else {
              seleccionFila = f;
              seleccionColumna = c;
            }
            renderizarMapa();
            actualizarPanelReserva();
          };
        }(fila, col);
      }

      filaDiv.appendChild(asientoBtn);
    }

    contenedor.appendChild(filaDiv);
  }
}

// --- Confirmar la reserva del asiento seleccionado ---
function confirmarReserva(): void {
  if (seleccionFila === -1 || seleccionColumna === -1) { return; }
  if (sala[seleccionFila][seleccionColumna] === 1) { return; }

  // Marcar como ocupado
  sala[seleccionFila][seleccionColumna] = 1;

  // Mostrar mensaje en panel
  var panel = document.getElementById("panel-reserva");
  if (panel !== null) {
    panel.innerHTML =
      "<p class='text-yellow-400 font-bold'>RESERVA CONFIRMADA</p>" +
      "<p class='text-yellow-300'>Fila " + (seleccionFila + 1) + ", Columna " + (seleccionColumna + 1) + "</p>";
  }

  // Guardar en historial JSON
  agregarAlHistorial(seleccionFila, seleccionColumna, "confirmada");

  // Deseleccionar
  seleccionFila = -1;
  seleccionColumna = -1;

  // Deshabilitar boton
  var boton = document.getElementById("btn-confirmar") as HTMLButtonElement;
  if (boton !== null) { boton.disabled = true; }

  // Actualizar todo
  renderizarMapa();
  actualizarResumen();
}

// --- Buscar el primer par de asientos contiguos libres y seleccionarlos ---
function buscarContiguosUI(): void {
  for (var fila = 0; fila < FILAS; fila++) {
    for (var col = 0; col < COLUMNAS - 1; col++) {
      if (sala[fila][col] === 0 && sala[fila][col + 1] === 0) {
        seleccionFila = fila;
        seleccionColumna = col;

        var panel = document.getElementById("panel-reserva");
        if (panel !== null) {
          panel.innerHTML =
            "<p class='text-blue-400 font-bold'>ASIENTOS CONTIGUOS ENCONTRADOS</p>" +
            "<p class='text-blue-300'>Fila " + (fila + 1) + ", Columnas " + (col + 1) + " y " + (col + 2) + "</p>" +
            "<p class='text-blue-200 text-xs'>Se selecciono el primero. Haz clic en Confirmar.</p>";
        }

        renderizarMapa();
        actualizarPanelReserva();
        return;
      }
    }
  }

  // No se encontraron contiguos
  var panel = document.getElementById("panel-reserva");
  if (panel !== null) {
    panel.innerHTML = "<p class='text-red-400 font-bold'>NO HAY ASIENTOS CONTIGUOS</p><p class='text-red-500'>No se encontraron dos asientos libres seguidos.</p>";
  }
}

// --- Reiniciar la sala ---
function reiniciarSala(): void {
  inicializarSala();
  historialJSON = [];
  seleccionFila = -1;
  seleccionColumna = -1;

  var panel = document.getElementById("panel-reserva");
  if (panel !== null) {
    panel.innerHTML = "<p class='text-gray-400'>Haz clic en un asiento</p><p class='text-gray-400'>para seleccionarlo</p>";
  }

  var boton = document.getElementById("btn-confirmar") as HTMLButtonElement;
  if (boton !== null) { boton.disabled = true; }

  actualizarHistorialJSON();
  renderizarMapa();
  actualizarResumen();
}

// --- Inicializar la aplicacion ---
function iniciarApp(): void {
  inicializarSala();

  // Vincular eventos de botones
  var btnConfirmar = document.getElementById("btn-confirmar");
  if (btnConfirmar !== null) {
    btnConfirmar.onclick = confirmarReserva;
  }

  var btnContiguos = document.getElementById("btn-contiguos");
  if (btnContiguos !== null) {
    btnContiguos.onclick = buscarContiguosUI;
  }

  var btnReiniciar = document.getElementById("btn-reiniciar");
  if (btnReiniciar !== null) {
    btnReiniciar.onclick = reiniciarSala;
  }

  // Renderizar estado inicial
  renderizarMapa();
  actualizarResumen();
  actualizarPanelReserva();
}

// --- Arrancar cuando el DOM este listo ---
if (document.readyState === "loading") {
  document.onreadystatechange = function() {
    if (document.readyState === "interactive") {
      iniciarApp();
    }
  };
} else {
  iniciarApp();
}
