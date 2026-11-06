/*
  Sistema de Reservas de Cine
  Matriz 8x10: 0 = libre (L) | 1 = ocupado (X)
*/

const FILAS = 8;
const COLUMNAS = 10;

// Inicializa la sala con todos los asientos libres (0)
function crearSala(): number[][] {
  var sala: number[][] = [];
  for (var i = 0; i < FILAS; i++) {
    var fila: number[] = [];
    for (var j = 0; j < COLUMNAS; j++) {
      fila.push(0);
    }
    sala.push(fila);
  }
  return sala;
}

// Muestra la matriz con L (libre) y X (ocupado), con numeros de fila y columna
function mostrarSala(sala: number[][]): void {
  console.log("");
  console.log("=================================");
  console.log("       ESTADO DE LA SALA");
  console.log("=================================");
  console.log("");

  // Cabecera: numeros de columna
  var cabecera = "     ";
  for (var col = 0; col < COLUMNAS; col++) {
    if (col + 1 < 10) {
      cabecera = cabecera + "  " + (col + 1) + " ";
    } else {
      cabecera = cabecera + " " + (col + 1) + " ";
    }
  }
  console.log(cabecera);

  // Linea separatoria superior
  var separador = "    -";
  for (var col = 0; col < COLUMNAS; col++) {
    separador = separador + "----";
  }
  console.log(separador);

  // Filas
  for (var fila = 0; fila < FILAS; fila++) {
    var linea = "";
    if (fila + 1 < 10) {
      linea = "  " + (fila + 1) + " |";
    } else {
      linea = " " + (fila + 1) + " |";
    }
    for (var col = 0; col < COLUMNAS; col++) {
      if (sala[fila][col] === 1) {
        linea = linea + "  X ";
      } else {
        linea = linea + "  L ";
      }
    }
    linea = linea + "|";
    console.log(linea);
  }

  // Linea separatoria inferior
  console.log(separador);
  console.log("");
  console.log("  L = Libre    X = Ocupado");
  console.log("");
}

// Marca un asiento como ocupado. Valida limites y disponibilidad.
function ocuparAsiento(sala: number[][], fila: number, columna: number): boolean {
  if (fila < 0 || fila >= FILAS || columna < 0 || columna >= COLUMNAS) {
    console.log("RESERVA RECHAZADA - Fuera de rango: La fila " + (fila + 1) + " o columna " + (columna + 1) + " no es valida (1-" + FILAS + " filas, 1-" + COLUMNAS + " columnas).");
    return false;
  }
  if (sala[fila][columna] === 1) {
    console.log("RESERVA RECHAZADA - Asiento ocupado: El asiento Fila " + (fila + 1) + ", Columna " + (columna + 1) + " ya esta ocupado.");
    return false;
  }
  sala[fila][columna] = 1;
  console.log("RESERVA CONFIRMADA: Asiento Fila " + (fila + 1) + ", Columna " + (columna + 1) + " reservado con exito.");
  return true;
}

// Cuenta y muestra asientos libres y ocupados
function resumenSala(sala: number[][]): void {
  var libres = 0;
  var ocupados = 0;
  for (var i = 0; i < FILAS; i++) {
    for (var j = 0; j < COLUMNAS; j++) {
      if (sala[i][j] === 1) {
        ocupados++;
      } else {
        libres++;
      }
    }
  }
  var total = FILAS * COLUMNAS;
  var porcentaje = (ocupados * 100) / total;
  console.log("--- RESUMEN DE OCUPACION ---");
  console.log("  Capacidad total:    " + total + " asientos");
  console.log("  Asientos libres:    " + libres);
  console.log("  Asientos ocupados:  " + ocupados);
  console.log("  Porcentaje ocupado: " + porcentaje + "%");
  console.log("");
}

// Busca dos asientos libres contiguos horizontalmente en la misma fila
// Devuelve un array [fila, col1, col2] si encuentra, o null si no hay
function buscarContiguos(sala: number[][]): number[] | null {
  for (var fila = 0; fila < FILAS; fila++) {
    for (var col = 0; col < COLUMNAS - 1; col++) {
      if (sala[fila][col] === 0 && sala[fila][col + 1] === 0) {
        return [fila, col, col + 1];
      }
    }
  }
  return null;
}

// Rellena la sala de forma aleatoria hasta alcanzar un porcentaje dado
function llenarSalaAleatoria(sala: number[][], porcentaje: number): void {
  var total = FILAS * COLUMNAS;
  var objetivos = Math.floor((total * porcentaje) / 100);
  var puestos = 0;

  console.log("[Sistema] Ocupando aleatoriamente " + objetivos + " asientos para alcanzar el " + porcentaje + "%...");

  while (puestos < objetivos) {
    var fila = Math.floor(Math.random() * FILAS);
    var columna = Math.floor(Math.random() * COLUMNAS);
    if (sala[fila][columna] === 0) {
      sala[fila][columna] = 1;
      puestos++;
    }
  }

  console.log("[Sistema] " + puestos + " asientos ocupados aleatoriamente.");
  console.log("");
}

// Prueba un escenario: muestra la sala y busca contiguos
function probarEscenario(titulo: string, sala: number[][]): void {
  console.log("=================================");
  console.log("   " + titulo);
  console.log("=================================");

  mostrarSala(sala);
  resumenSala(sala);

  var par = buscarContiguos(sala);
  console.log("BUSQUEDA DE ASIENTOS CONTIGUOS:");
  if (par !== null) {
    console.log("  >> ASIENTOS CONTIGUOS ENCONTRADOS: Fila " + (par[0] + 1) + ", Columnas " + (par[1] + 1) + " y " + (par[2] + 1) + " (ambos libres)");
  } else {
    console.log("  >> NO HAY ASIENTOS CONTIGUOS DISPONIBLES: No se encontraron dos asientos libres seguidos en ninguna fila.");
  }
  console.log("");
  console.log("---------------------------------");
  console.log("");
}

// Simula la ejecucion de una opcion del menu
function simularOpcion(numero: number, descripcion: string, sala: number[][]): void {
  console.log("");
  console.log("+--------------------------------------------------+");
  console.log("  OPCION " + numero + " - " + descripcion);
  console.log("+--------------------------------------------------+");
  console.log("");
}

// Programa principal - Demo del sistema con las 4 opciones
function main(): void {
  var sala = crearSala();

  console.log("");
  console.log("+==================================================+");
  console.log("|             SISTEMA DE RESERVAS                  |");
  console.log("|                CINEMA GRID                       |");
  console.log("|              8 filas x 10 columnas               |");
  console.log("+==================================================+");
  console.log("");
  console.log("  BIENVENIDO! Estas son las operaciones disponibles:");
  console.log("");

  // --- OPCION 1: Mostrar estado de la sala ---
  simularOpcion("1", "MOSTRAR ESTADO DE LA SALA", sala);
  console.log("  [Sistema] Mostrando la distribucion actual de asientos...");
  console.log("  [Sistema] Leyenda:  L = Asiento LIBRE  |  X = Asiento OCUPADO");
  console.log("");

  mostrarSala(sala);
  resumenSala(sala);

  console.log("  >>> Todos los asientos estan libres. Puedes reservar cualquier asiento.");
  console.log("");

  // --- OPCION 2: Reservar un asiento ---
  simularOpcion("2", "RESERVAR UN ASIENTO", sala);
  console.log("  [Sistema] El usuario solicita reservar varios asientos...");
  console.log("");

  ocuparAsiento(sala, 2, 4);
  ocuparAsiento(sala, 0, 0);
  ocuparAsiento(sala, 4, 7);
  ocuparAsiento(sala, 2, 5);
  ocuparAsiento(sala, 7, 9);
  ocuparAsiento(sala, 5, 2);

  console.log("");

  // --- OPCION 2b: Intentar reserva duplicada ---
  console.log("  [Sistema] El usuario intenta reservar un asiento YA OCUPADO...");
  console.log("");
  ocuparAsiento(sala, 2, 4);

  console.log("");

  // --- OPCION 3: Buscar asientos contiguos ---
  simularOpcion("3", "BUSCAR ASIENTOS CONTIGUOS", sala);

  mostrarSala(sala);

  var par = buscarContiguos(sala);
  console.log("  [Sistema] Buscando dos asientos libres uno al lado del otro...");
  console.log("");
  if (par !== null) {
    console.log("  >> ASIENTOS CONTIGUOS ENCONTRADOS:");
    console.log("     Fila " + (par[0] + 1) + ", Columnas " + (par[1] + 1) + " y " + (par[2] + 1) + " (ambos disponibles)");
    console.log("     Estos dos asientos estan libres y son vecinos.");
  } else {
    console.log("  >> NO HAY ASIENTOS CONTIGUOS DISPONIBLES.");
  }
  console.log("");

  console.log("  [Sistema] Sugerencia: Puedes reservarlos con la Opcion 2.");
  console.log("");

  // --- OPCION 1 nuevamente: Ver estado actualizado ---
  simularOpcion("1", "MOSTRAR ESTADO ACTUALIZADO DE LA SALA", sala);
  console.log("  [Sistema] Despues de las reservas, la sala queda asi:");
  console.log("  [Sistema] Leyenda:  L = Asiento LIBRE  |  X = Asiento OCUPADO");
  console.log("");

  mostrarSala(sala);
  resumenSala(sala);

  // --- OPCION 4: Salir ---
  console.log("+--------------------------------------------------+");
  console.log("  OPCION 4 - SALIR DEL SISTEMA");
  console.log("+--------------------------------------------------+");
  console.log("");
  console.log("  [Sistema] Gracias por usar el Sistema de Reservas Cinema Grid.");
  console.log("  [Sistema] Resumen de la sesion:");
  console.log("");

  // Contar cuantos se reservaron en la demo
  var contados = 0;
  for (var i = 0; i < FILAS; i++) {
    for (var j = 0; j < COLUMNAS; j++) {
      if (sala[i][j] === 1) {
        contados++;
      }
    }
  }
  console.log("  - Se realizaron " + contados + " reservas exitosas.");
  console.log("  - Quedan " + (FILAS * COLUMNAS - contados) + " asientos libres.");
  console.log("  - Se rechazo 1 intento de reserva duplicada.");
  console.log("");
  console.log("+==================================================+");
  console.log("|           SISTEMA FINALIZADO                      |");
  console.log("+==================================================+");
  console.log("");
}

main();

export {};
