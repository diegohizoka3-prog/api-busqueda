const express = require('express');
const XLSX = require('xlsx');
const { CAMPOS, crearRegistro, obtenerRegistros, obtenerPorId, actualizarRegistro, eliminarRegistro, importarRegistros } = require('./datos');
const { buscar } = require('./buscador');
const { obtenerEstadisticas } = require('./estadisticas');
const { saveData } = require('./persistencia');

const router = express.Router();
const estado = {
  obtener: obtenerRegistros,
  cargar: (registros) => registros.forEach(({ id, created_at, ...datos }) => crearRegistro(datos))
};

function guardarEstado() {
  saveData(estado).catch((error) => console.warn('Persistencia no disponible:', error.message));
}

function listaUnica(campo) {
  return [...new Set(obtenerRegistros().map((registro) => registro[campo]))].sort();
}

function crearExcel(registros) {
  const columnas = ['id', ...CAMPOS];
  const filas = registros.map((registro) => Object.fromEntries(columnas.map((columna) => [columna, registro[columna]])));
  const libro = XLSX.utils.book_new();
  const hoja = XLSX.utils.json_to_sheet(filas, { header: columnas });
  XLSX.utils.book_append_sheet(libro, hoja, 'Registros');
  return XLSX.write(libro, { type: 'buffer', bookType: 'xlsx' });
}

router.get('/health', (req, res) => res.json({
  status: 'ok', service: 'api-busqueda', version: '1.0.0', timestamp: new Date().toISOString()
}));
router.get('/salones', (req, res) => res.json(listaUnica('salon')));
router.get('/profesores', (req, res) => res.json(listaUnica('profesor')));
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

router.post('/registros', (req, res, next) => {
  try {
    const registro = crearRegistro(req.body);
    guardarEstado();
    return res.status(201).json(registro);
  } catch (error) {
    error.status = 400;
    return next(error);
  }
});

router.put('/registros/:id', (req, res, next) => {
  try {
    const registro = actualizarRegistro(req.params.id, req.body);
    if (!registro) return res.status(404).json({ error: 'Registro no encontrado.' });
    guardarEstado();
    return res.json(registro);
  } catch (error) {
    error.status = 400;
    return next(error);
  }
});

router.delete('/registros/:id', (req, res) => {
  const registro = eliminarRegistro(req.params.id);
  if (!registro) return res.status(404).json({ error: 'Registro no encontrado.' });
  guardarEstado();
  return res.json({ mensaje: 'Registro eliminado.', registro });
});

router.post('/importar-excel', (req, res, next) => {
  try {
    const lista = Array.isArray(req.body) ? req.body : req.body.registros;
    const importados = importarRegistros(lista);
    guardarEstado();
    return res.status(201).json({ importados: importados.length });
  } catch (error) {
    error.status = 400;
    return next(error);
  }
});

const parametrosBusqueda = [
  'q', 'salon', 'profesor', 'carrera', 'modulo', 'horarioClase', 'nombreModulo', 'semestre', 'corte'
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
        profesor: 'Ana Lopez',
        carrera: 'Ingenieria',
        modulo: 'Matematicas',
        horarioClase: '08:00-10:00',
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
        type: 'object', required: ['salon', 'carrera', 'modulo', 'horarioClase', 'nombreModulo'],
        properties: { id: { type: 'integer' }, ...Object.fromEntries(CAMPOS.map((campo) => [campo, { type: 'string' }])), semestre: { type: 'string' }, corte: { type: 'string' }, codigoModulo: { type: 'string' } }
      }
    }
  },
  paths: Object.fromEntries([
    ['/health', ['get']], ['/salones', ['get']], ['/profesores', ['get']], ['/carreras', ['get']], ['/modulos', ['get']],
    ['/registros', ['get', 'post']], ['/registros/{id}', ['get', 'put', 'delete']], ['/estadisticas', ['get']],
    ['/buscar', ['get']], ['/exportar-excel', ['get']], ['/importar-excel', ['post']]
  ].map(([path, metodos]) => [path, Object.fromEntries(metodos.map((metodo) => [metodo, {
    summary: `${metodo.toUpperCase()} ${path}`,
    parameters: path === '/buscar' || path === '/exportar-excel' ? parametrosBusqueda : path.includes('{id}') ? [{ name: 'id', in: 'path', required: true, schema: { type: 'integer' } }] : [],
    responses: path === '/buscar' ? { 200: respuestaBusqueda, 400: { description: 'Solicitud invalida' } } : path === '/exportar-excel' ? { 200: respuestaExportacion } : { 200: { description: 'Respuesta correcta' }, 201: { description: 'Registro creado' }, 400: { description: 'Solicitud invalida' }, 404: { description: 'No encontrado' } }
  }]))]))
};

module.exports = { router, swaggerDocument, estado };