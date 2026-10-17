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
        "horarioClase" TEXT,
        carrera TEXT,
        modalidad TEXT,
        semestre TEXT,
        corte TEXT,
        modulo TEXT,
        "nombreModulo" TEXT,
        created_at TIMESTAMPTZ DEFAULT NOW()
      )
    `);
    await database.query('ALTER TABLE registros DROP COLUMN IF EXISTS profesor');
    await database.query('ALTER TABLE registros DROP COLUMN IF EXISTS "codigoModulo"');
    await database.query('ALTER TABLE registros ADD COLUMN IF NOT EXISTS modalidad TEXT');
    await database.query('ALTER TABLE registros ADD COLUMN IF NOT EXISTS semestre TEXT');
    await database.query('ALTER TABLE registros ADD COLUMN IF NOT EXISTS corte TEXT');
    await database.query('ALTER TABLE registros ADD COLUMN IF NOT EXISTS modulo TEXT');
  } catch (error) {
    console.warn('No se pudo inicializar PostgreSQL:', error.message);
  }
}

async function loadData(state) {
  const database = getPool();
  if (!database) return;

  try {
    const { rows } = await database.query(`
      SELECT id, salon, carrera, modulo, "horarioClase", "nombreModulo", semestre, corte, modalidad, created_at
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
        INSERT INTO registros (salon, "horarioClase", carrera, modalidad, semestre, corte, modulo, "nombreModulo")
        VALUES ($1, $2, $3, $4, $5, $6, $7, $8)
      `, [registro.salon, registro.horarioClase, registro.carrera, registro.modalidad || null, registro.semestre || null, registro.corte || null, registro.modulo, registro.nombreModulo]);
    }
    await client.query('COMMIT');
  } catch (error) {
    await client.query('ROLLBACK').catch(() => {});
    throw error;
  } finally {
    client.release();
  }
}

async function insertarRegistros(lista) {
  const database = getPool();
  if (!database) return null;

  const client = await database.connect();
  try {
    await client.query('BEGIN');
    const ids = [];
    for (const registro of lista) {
      const { rows } = await client.query(`
        INSERT INTO registros (salon, "horarioClase", carrera, modalidad, semestre, corte, modulo, "nombreModulo")
        VALUES ($1, $2, $3, $4, $5, $6, $7, $8)
        RETURNING id
      `, [
        registro.salon,
        registro.horarioClase,
        registro.carrera,
        registro.modalidad || null,
        registro.semestre || null,
        registro.corte || null,
        registro.modulo || null,
        registro.nombreModulo
      ]);
      ids.push(rows[0].id);
    }
    await client.query('COMMIT');
    return ids;
  } catch (error) {
    await client.query('ROLLBACK').catch(() => {});
    throw error;
  } finally {
    client.release();
  }
}

module.exports = { initTable, loadData, saveData, insertarRegistros };