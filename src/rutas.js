const express = require('express');
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
    return res.status(201).json({ importados });
  } catch (error) {
    error.status = 400;
    return next(error);
  }
});

const swaggerDocument = {
  openapi: '3.0.0',
  info: { title: 'API Busqueda Academica', version: '1.0.0', description: 'API para buscar en datos academicos.' },
  servers: [{ url: '/api/v1' }],
  components: {
    schemas: {
      Registro: {
        type: 'object', required: CAMPOS,
        properties: { id: { type: 'integer' }, ...Object.fromEntries(CAMPOS.map((campo) => [campo, { type: 'string' }])) }
      }
    }
  },
  paths: Object.fromEntries([
    ['/health', ['get']], ['/salones', ['get']], ['/profesores', ['get']], ['/carreras', ['get']], ['/modulos', ['get']],
    ['/registros', ['get', 'post']], ['/registros/{id}', ['get', 'put', 'delete']], ['/estadisticas', ['get']],
    ['/buscar', ['get']], ['/importar-excel', ['post']]
  ].map(([path, metodos]) => [path, Object.fromEntries(metodos.map((metodo) => [metodo, {
    summary: `${metodo.toUpperCase()} ${path}`,
    parameters: path.includes('{id}') ? [{ name: 'id', in: 'path', required: true, schema: { type: 'integer' } }] : [],
    responses: { 200: { description: 'Respuesta correcta' }, 201: { description: 'Registro creado' }, 400: { description: 'Solicitud invalida' }, 404: { description: 'No encontrado' } }
  }]))]))
};

module.exports = { router, swaggerDocument, estado };