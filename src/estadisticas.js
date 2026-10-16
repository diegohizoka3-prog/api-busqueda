const { CAMPOS, obtenerRegistros } = require('./datos');

function contarValores(campo, registros) {
  return registros.reduce((conteo, registro) => {
    conteo[registro[campo]] = (conteo[registro[campo]] || 0) + 1;
    return conteo;
  }, {});
}

function obtenerEstadisticas() {
  const registros = obtenerRegistros();
  return {
    totalRegistros: registros.length,
    totalAulas: new Set(registros.map((registro) => registro.salon)).size,
    totalProgramas: new Set(registros.map((registro) => registro.carrera)).size,
    totalModulos: new Set(registros.map((registro) => registro.modulo)).size,
    distribucion: Object.fromEntries(CAMPOS.map((campo) => [campo, contarValores(campo, registros)]))
  };
}

module.exports = { obtenerEstadisticas };