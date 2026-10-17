const express = require('express');
const XLSX = require('xlsx');
const { CAMPOS, crearRegistro, obtenerRegistros, obtenerPorId, actualizarRegistro, eliminarRegistro, prepararImportacion, registrarImportados, cargarRegistros } = require('./datos');
const { buscar } = require('./buscador');
const { obtenerEstadisticas } = require('./estadisticas');
const { saveData, insertarRegistros } = require('./persistencia');
const { login, verificarToken, COOKIE_NAME } = require('./auth');

const router = express.Router();
const estado = {
  obtener: obtenerRegistros,
  cargar: cargarRegistros
};

async function guardarEstado() {
  try {
    await saveData(estado);
  } catch (error) {
    console.error('Error al guardar en PostgreSQL:', error.message);
    throw error;
  }
}

function listaUnica(campo) {
  return [...new Set(obtenerRegistros().map((registro) => registro[campo]))].sort();
}

function crearExcel(registros) {
  const encabezados = {
    salon: 'AULA',
    horarioClase: 'HORARIO',
    carrera: 'PROGRAMA',
    modalidad: 'MODALIDAD',
    semestre: 'SEMESTRE',
    corte: 'CORTE #',
    modulo: 'MÓDULO',
    nombreModulo: 'NOMBRE DEL MÓDULO'
  };
  const filas = registros.map((registro) => Object.fromEntries(CAMPOS.map((campo) => [encabezados[campo], registro[campo]])));
  const libro = XLSX.utils.book_new();
  const hoja = XLSX.utils.json_to_sheet(filas, { header: CAMPOS.map((campo) => encabezados[campo]) });
  XLSX.utils.book_append_sheet(libro, hoja, 'Registros');
  return XLSX.write(libro, { type: 'buffer', bookType: 'xlsx' });
}

router.get('/health', (req, res) => res.json({
  status: 'ok', service: 'api-busqueda', version: '1.0.0', timestamp: new Date().toISOString()
}));
router.get('/aulas', (req, res) => res.json(listaUnica('salon')));
router.get('/salones', (req, res) => res.json(listaUnica('salon')));
router.get('/programas', (req, res) => res.json(listaUnica('carrera')));
router.get('/carreras', (req, res) => res.json(listaUnica('carrera')));
router.get('/modulos', (req, res) => res.json(listaUnica('modulo')));
router.get('/registros', (req, res) => res.json(obtenerRegistros()));

router.get('/registros/:id', (req, res) => {
  const registro = obtenerPorId(req.params.id);
  if (!registro) return res.status(404).json({ error: 'Registro no encontrado.' });
  return res.json(registro);
});

router.get('/estadisticas', (req, res) => res.json(obtenerEstadisticas()));
router.get('/buscar', (req, res) => res.json(buscar(req.query)));
router.get('/exportar-excel', (req, res, next) => {
  try {
    const archivo = crearExcel(buscar(req.query));
    const fecha = new Date().toISOString().slice(0, 10);
    res.setHeader('Content-Type', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet');
    res.setHeader('Content-Disposition', `attachment; filename="registros-${fecha}.xlsx"`);
    return res.send(archivo);
  } catch (error) {
    return next(error);
  }
});

router.post('/auth/login', (req, res) => {
  const { usuario, password } = req.body;
  if (!usuario || !password) return res.status(400).json({ error: 'Usuario y password requeridos' });

  const token = login(usuario, password);
  if (!token) return res.status(401).json({ error: 'Credenciales inválidas' });

  res.cookie(COOKIE_NAME, token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
    maxAge: 7 * 24 * 60 * 60 * 1000
  });
  return res.json({ ok: true, user: usuario, token });
});

router.post('/auth/logout', (req, res) => {
  res.clearCookie(COOKIE_NAME);
  return res.json({ ok: true });
});

router.get('/auth/me', verificarToken, (req, res) => res.json({ user: req.admin.user, role: req.admin.role }));

router.post('/registros', verificarToken, async (req, res, next) => {
  try {
    const registro = crearRegistro(req.body);
    await guardarEstado();
    return res.status(201).json(registro);
  } catch (error) {
    error.status = 400;
    return next(error);
  }
});

router.put('/registros/:id', verificarToken, async (req, res, next) => {
  try {
    const registro = actualizarRegistro(req.params.id, req.body);
    if (!registro) return res.status(404).json({ error: 'Registro no encontrado.' });
    await guardarEstado();
    return res.json(registro);
  } catch (error) {
    error.status = 400;
    return next(error);
  }
});

router.delete('/registros/:id', verificarToken, async (req, res, next) => {
  const registro = eliminarRegistro(req.params.id);
  if (!registro) return res.status(404).json({ error: 'Registro no encontrado.' });
  try {
    await guardarEstado();
    return res.json({ mensaje: 'Registro eliminado.', registro });
  } catch (error) {
    error.status = 400;
    return next(error);
  }
});

router.post('/importar-excel', verificarToken, async (req, res, next) => {
  let preparacion;
  try {
    const { headers, rows, firstDataRow } = req.body || {};
    preparacion = prepararImportacion(headers, rows, firstDataRow);
  } catch (error) {
    error.status = 400;
    return next(error);
  }

  try {
    const ids = await insertarRegistros(preparacion.registros);
    const importados = registrarImportados(preparacion.registros, ids);
    return res.status(201).json({
      importados: importados.length,
      omitidos: preparacion.filasOmitidas.length,
      filasOmitidas: preparacion.filasOmitidas
    });
  } catch (error) {
    return next(error);
  }
});

const parametrosBusqueda = [
  'q', ...CAMPOS
].map((nombre) => ({
  name: nombre,
  in: 'query',
  required: false,
  schema: { type: 'string' },
  ...(nombre === 'q' ? { example: 'mate' } : {})
}));

const respuestaBusqueda = {
  description: 'Lista de registros que coinciden con los filtros.',
  content: {
    'application/json': {
      schema: { type: 'array', items: { $ref: '#/components/schemas/Registro' } },
      example: [{
        id: 1,
        salon: 'A-101',
        carrera: 'Ingenieria',
        horarioClase: '08:00-10:00',
        modalidad: 'Presencial',
        semestre: '2026-1',
        corte: 'Corte 1',
        modulo: 'Matematicas',
        nombreModulo: 'Calculo I'
      }]
    }
  }
};

const respuestaExportacion = {
  description: 'Archivo Excel con los registros exportados.',
  content: {
    'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet': {
      schema: { type: 'string', format: 'binary' }
    }
  }
};

const swaggerDocument = {
  openapi: '3.0.0',
  info: { title: 'API Busqueda Academica', version: '1.0.0', description: 'API para buscar en datos academicos.' },
  servers: [{ url: '/api/v1' }],
  components: {
    schemas: {
      Registro: {
        type: 'object', required: ['salon', 'carrera', 'horarioClase', 'nombreModulo'],
        properties: { id: { type: 'integer' }, ...Object.fromEntries(CAMPOS.map((campo) => [campo, { type: 'string' }])) }
      }
    }
  },
  paths: Object.fromEntries([
    ['/health', ['get']], ['/aulas', ['get']], ['/salones', ['get']], ['/programas', ['get']], ['/carreras', ['get']], ['/modulos', ['get']],
    ['/registros', ['get', 'post']], ['/registros/{id}', ['get', 'put', 'delete']], ['/estadisticas', ['get']],
    ['/buscar', ['get']], ['/exportar-excel', ['get']], ['/importar-excel', ['post']]
  ].map(([path, metodos]) => [path, Object.fromEntries(metodos.map((metodo) => [metodo, {
    summary: `${metodo.toUpperCase()} ${path}`,
    parameters: path === '/buscar' || path === '/exportar-excel' ? parametrosBusqueda : path.includes('{id}') ? [{ name: 'id', in: 'path', required: true, schema: { type: 'integer' } }] : [],
    responses: path === '/buscar' ? { 200: respuestaBusqueda, 400: { description: 'Solicitud invalida' } } : path === '/exportar-excel' ? { 200: respuestaExportacion } : { 200: { description: 'Respuesta correcta' }, 201: { description: 'Registro creado' }, 400: { description: 'Solicitud invalida' }, 404: { description: 'No encontrado' } }
  }]))]))
};

module.exports = { router, swaggerDocument, estado };