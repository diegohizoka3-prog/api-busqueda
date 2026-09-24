const fs = require('fs');
const path = require('path');
const express = require('express');
const cors = require('cors');
const compression = require('compression');
const helmet = require('helmet');
const rateLimit = require('express-rate-limit');
const swaggerUi = require('swagger-ui-express');
const { importarRegistros } = require('./datos');
const { router, swaggerDocument, estado } = require('./rutas');
const { initTable, loadData } = require('./persistencia');

const app = express();
const port = Number(process.env.PORT) || 3000;
let initializationPromise;

function ensureInitialized() {
  if (!initializationPromise) {
    initializationPromise = (async () => {
      try {
        await initTable();
        await loadData(estado);
        if (!process.env.DATABASE_URL && process.env.NODE_ENV !== 'production' && estado.obtener().length === 0) {
          const seedPath = path.join(__dirname, '..', 'scripts', 'seed-data.json');
          const seed = JSON.parse(fs.readFileSync(seedPath, 'utf8'));
          const registros = importarRegistros(seed);
          console.log(`Cargados ${registros.length} registros de seed (modo desarrollo)`);
        }
      } catch (error) {
        console.warn('Persistencia no disponible; se usara memoria:', error.message);
      }
    })();
  }
  return initializationPromise;
}

app.use(helmet());
app.use(cors());
app.use(compression());
app.use(express.json({ limit: '2mb' }));
app.use(rateLimit({ windowMs: 15 * 60 * 1000, limit: 300, standardHeaders: true, legacyHeaders: false }));
app.use((req, res, next) => {
  ensureInitialized().then(() => next());
});
app.use('/api/v1/docs', swaggerUi.serve, swaggerUi.setup(swaggerDocument));
app.use('/api/v1', router);
app.get('/', (req, res) => {
  res.json({
    name: 'api-busqueda',
    status: 'ok',
    version: process.env.npm_package_version || 'unknown',
    docs: '/api/v1/docs',
    timestamp: new Date().toISOString()
  });
});

app.get('/docs', (req, res) => res.redirect('/api/v1/docs'));

app.use((error, req, res, next) => {
  if (res.headersSent) return next(error);
  return res.status(error.status || 500).json({ error: error.status ? error.message : 'Error interno del servidor.' });
});

if (require.main === module) {
  (async () => {
    await ensureInitialized();
    app.listen(port, () => console.log(`api-busqueda escuchando en el puerto ${port}`));
  })();
}

module.exports = app;