const { Pool } = require('pg');
const qerrors = require('qerrors');

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: process.env.NODE_ENV === 'production' ? { rejectUnauthorized: false } : false
});

pool.on('error', (err) => {
  qerrors(err, 'db: unexpected error on idle client');
});

async function query(text, params) {
  const start = Date.now();
  try {
    const res = await pool.query(text, params);
    const duration = Date.now() - start;
    if (process.env.DEBUG_SQL) {
      console.log('Executed query', { text, duration, rows: res.rowCount });
    }
    return res;
  } catch (err) {
    qerrors(err, 'db: query failed', { text, params });
    throw err;
  }
}

async function getClient() {
  return pool.connect();
}

module.exports = { query, getClient, pool };
