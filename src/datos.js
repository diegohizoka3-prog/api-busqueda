const CAMPOS = [
  'salon',
  'horarioClase',
  'carrera',
  'modalidad',
  'semestre',
  'corte',
  'modulo',
  'nombreModulo'
];

const CAMPOS_REQUERIDOS = ['salon', 'carrera', 'horarioClase', 'nombreModulo'];

const ENCABEZADOS_IMPORTACION = [
  'AULA',
  'HORARIO',
  'PROGRAMA',
  'MODALIDAD',
  'SEMESTRE',
  'CORTE #',
  'MÓDULO',
  'NOMBRE DEL MÓDULO'
];

const MAPEO_IMPORTACION = {
  'AULA': 'salon',
  'HORARIO': 'horarioClase',
  'PROGRAMA': 'carrera',
  'MODALIDAD': 'modalidad',
  'SEMESTRE': 'semestre',
  'CORTE #': 'corte',
  'MÓDULO': 'modulo',
  'NOMBRE DEL MÓDULO': 'nombreModulo'
};

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
  lista.forEach(validarRegistro);
  return lista.map(crearRegistro);
}

function prepararImportacion(headers, rows, firstDataRow = 2) {
  if (!Array.isArray(headers) || !headers.every((header) => typeof header === 'string')) {
    throw new Error('Los encabezados del archivo deben ser una lista de texto.');
  }
  if (!Array.isArray(rows) || !rows.every(Array.isArray)) {
    throw new Error('Las filas del archivo deben ser una lista de filas.');
  }

  const encabezadosFaltantes = ENCABEZADOS_IMPORTACION.filter((header) => !headers.includes(header));
  if (encabezadosFaltantes.length) {
    throw new Error(`Los encabezados deben ser exactamente: ${ENCABEZADOS_IMPORTACION.join(', ')}. Tu archivo tiene: ${headers.join(', ')}.`);
  }

  const registrosImportados = [];
  const filasOmitidas = [];
  rows.forEach((row, rowIndex) => {
    const registro = {};
    for (const [header, campo] of Object.entries(MAPEO_IMPORTACION)) {
      const value = row[headers.indexOf(header)];
      registro[campo] = value == null ? '' : String(value);
    }

    const faltantes = CAMPOS_REQUERIDOS.some((campo) => !registro[campo].trim());
    if (faltantes) {
      filasOmitidas.push(firstDataRow + rowIndex);
    } else {
      registrosImportados.push(registro);
    }
  });

  return { registros: registrosImportados, filasOmitidas };
}

function registrarImportados(lista, ids = null) {
  if (!Array.isArray(lista)) throw new Error('El cuerpo debe ser un array de registros.');
  lista.forEach(validarRegistro);
  if (ids !== null && (!Array.isArray(ids) || ids.length !== lista.length)) {
    throw new Error('La cantidad de IDs persistidos no coincide con los registros importados.');
  }

  const agregados = lista.map((datos, index) => {
    const id = ids === null ? siguienteId : Number(ids[index]);
    if (!Number.isSafeInteger(id) || id < 1) throw new Error('La base de datos devolvió un ID inválido.');
    const registro = { id };
    for (const campo of CAMPOS) registro[campo] = typeof datos[campo] === 'string' ? datos[campo].trim() : '';
    siguienteId = Math.max(siguienteId, id + 1);
    return registro;
  });
  registros.push(...agregados);
  return agregados;
}

function cargarRegistros(lista) {
  if (!Array.isArray(lista)) throw new Error('Los registros cargados deben ser una lista.');
  lista.forEach(validarRegistro);

  const cargados = lista.map((datos) => {
    const id = Number(datos.id);
    if (!Number.isSafeInteger(id) || id < 1) throw new Error('La base de datos devolvió un ID inválido.');
    const registro = { id };
    for (const campo of CAMPOS) registro[campo] = typeof datos[campo] === 'string' ? datos[campo].trim() : '';
    return registro;
  });
  registros = cargados;
  siguienteId = cargados.reduce((maximo, registro) => Math.max(maximo, registro.id + 1), 1);
}

module.exports = {
  CAMPOS,
  crearRegistro,
  obtenerRegistros,
  obtenerPorId,
  actualizarRegistro,
  eliminarRegistro,
  importarRegistros,
  prepararImportacion,
  registrarImportados,
  cargarRegistros
};