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
        semestre TEXT,
        corte TEXT,
        "codigoModulo" TEXT,
        created_at TIMESTAMPTZ DEFAULT NOW()
      )
    `);
      await database.query(`
        ALTER TABLE registros
        ADD COLUMN IF NOT EXISTS modalidad TEXT
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
      SELECT id, salon, profesor, carrera, modulo, "horarioClase", "nombreModulo", semestre, corte, "codigoModulo", modalidad, created_at
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
        INSERT INTO registros (salon, profesor, carrera, modulo, "horarioClase", "nombreModulo", semestre, corte, "codigoModulo", modalidad)
        VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10)
      `, [registro.salon, registro.profesor, registro.carrera, registro.modulo, registro.horarioClase, registro.nombreModulo, registro.semestre || null, registro.corte || null, registro.codigoModulo || null, registro.modalidad || null]);
    }
    await client.query('COMMIT');
  } catch (error) {
    await client.query('ROLLBACK').catch(() => {});
    throw error;
  } finally {
    client.release();
  }
}

module.exports = { initTable, loadData, saveData };