const { CAMPOS, obtenerRegistros } = require('./datos');
const { normalizar } = require('./normalizar');

function buscar(filtros = {}) {
  const filtrosActivos = Object.entries(filtros)
    .filter(([campo, valor]) => (campo === 'q' || CAMPOS.includes(campo)) && String(valor).trim())
    .map(([campo, valor]) => [campo, normalizar(valor)]);

  return obtenerRegistros().filter((registro) => filtrosActivos.every(([campo, valor]) => {
    if (campo === 'q') return CAMPOS.some((nombre) => normalizar(registro[nombre]).includes(valor));
    return normalizar(registro[campo]).includes(valor);
  }));
}

module.exports = { buscar };