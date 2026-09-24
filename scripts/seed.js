const fs = require('fs');
const path = require('path');
const { importarRegistros } = require('../src/datos');
const { estado } = require('../src/rutas');
const { saveData } = require('../src/persistencia');

async function main() {
  const archivo = path.join(__dirname, 'seed-data.json');
  const lista = JSON.parse(fs.readFileSync(archivo, 'utf8'));
  const registros = importarRegistros(lista);

  await saveData(estado);
  console.log(`${registros.length} registros cargados`);
}

main().catch((error) => {
  console.error('No se pudieron cargar los datos de prueba:', error.message);
  process.exitCode = 1;
});