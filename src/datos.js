const CAMPOS = [
  'salon',
  'profesor',
  'carrera',
  'modulo',
  'horarioClase',
  'nombreModulo',
  'semestre',
  'corte',
  'codigoModulo',
  'modalidad'
];

const CAMPOS_REQUERIDOS = ['salon', 'carrera', 'horarioClase', 'nombreModulo'];

let registros = [];
let siguienteId = 1;

function validarRegistro(datos) {
  if (!datos || typeof datos !== 'object' || Array.isArray(datos)) {
    throw new Error('El registro debe ser un objeto JSON.');
  }

  const faltantes = CAMPOS_REQUERIDOS.filter((campo) => typeof datos[campo] !== 'string' || !datos[campo].trim());
  if (faltantes.length) {
    throw new Error(`Faltan campos obligatorios: ${faltantes.join(', ')}.`);
  }
}

function crearRegistro(datos) {
  validarRegistro(datos);
  const registro = { id: siguienteId++ };
  for (const campo of CAMPOS) registro[campo] = typeof datos[campo] === 'string' ? datos[campo].trim() : '';
  registros.push(registro);
  return registro;
}

function obtenerRegistros() {
  return [...registros];
}

function obtenerPorId(id) {
  return registros.find((registro) => registro.id === Number(id));
}

function actualizarRegistro(id, datos) {
  validarRegistro(datos);
  const indice = registros.findIndex((registro) => registro.id === Number(id));
  if (indice === -1) return null;
  const actualizado = { id: registros[indice].id };
  for (const campo of CAMPOS) actualizado[campo] = typeof datos[campo] === 'string' ? datos[campo].trim() : '';
  registros[indice] = actualizado;
  return actualizado;
}

function eliminarRegistro(id) {
  const indice = registros.findIndex((registro) => registro.id === Number(id));
  if (indice === -1) return null;
  return registros.splice(indice, 1)[0];
}

function importarRegistros(lista) {
  if (!Array.isArray(lista)) throw new Error('El cuerpo debe ser un array de registros.');
  return lista.map(crearRegistro);
}

module.exports = {
  CAMPOS,
  crearRegistro,
  obtenerRegistros,
  obtenerPorId,
  actualizarRegistro,
  eliminarRegistro,
  importarRegistros
};