const { Pool } = require('pg');

let pool;

function getPool() {
  if (!process.env.DATABASE_URL) return null;
  if (!pool) pool = new Pool({ connectionString: process.env.DATABASE_URL, ssl: { rejectUnauthorized: false } });
  return pool;
}

async function initTable() {
  const database = getPool();
  if (!database) return;

  try {
    await database.query(`
      CREATE TABLE IF NOT EXISTS registros (
        id SERIAL PRIMARY KEY,
        salon TEXT,
        profesor TEXT,
        carrera TEXT,
        modulo TEXT,
        "horarioClase" TEXT,
        "nombreModulo" TEXT,
        created_at TIMESTAMPTZ DEFAULT NOW()
      )
    `);
  } catch (error) {
    console.warn('No se pudo inicializar PostgreSQL:', error.message);
  }
}

async function loadData(state) {
  const database = getPool();
  if (!database) return;

  try {
    const { rows } = await database.query(`
      SELECT id, salon, profesor, carrera, modulo, "horarioClase", "nombreModulo", created_at
      FROM registros
      ORDER BY id
    `);
    state.cargar(rows);
  } catch (error) {
    console.warn('No se pudieron cargar los registros desde PostgreSQL:', error.message);
  }
}

async function saveData(state) {
  const database = getPool();
  if (!database) return;

  const client = await database.connect();
  try {
    await client.query('BEGIN');
    await client.query('DELETE FROM registros');
    for (const registro of state.obtener()) {
      await client.query(`
        INSERT INTO registros (salon, profesor, carrera, modulo, "horarioClase", "nombreModulo")
        VALUES ($1, $2, $3, $4, $5, $6)
      `, [registro.salon, registro.profesor, registro.carrera, registro.modulo, registro.horarioClase, registro.nombreModulo]);
    }
    await client.query('COMMIT');
  } catch (error) {
    await client.query('ROLLBACK').catch(() => {});
    console.warn('No se pudieron guardar los registros en PostgreSQL:', error.message);
  } finally {
    client.release();
  }
}

module.exports = { initTable, loadData, saveData };