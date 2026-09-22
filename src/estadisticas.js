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
    totalSalones: new Set(registros.map((registro) => registro.salon)).size,
    totalProfesores: new Set(registros.map((registro) => registro.profesor)).size,
    totalCarreras: new Set(registros.map((registro) => registro.carrera)).size,
    totalModulos: new Set(registros.map((registro) => registro.modulo)).size,
    distribucion: Object.fromEntries(CAMPOS.map((campo) => [campo, contarValores(campo, registros)]))
  };
}

module.exports = { obtenerEstadisticas };