const knex = require('knex');
require('dotenv').config();

console.log('Environment variables loaded:');
console.log('DB_HOST:', process.env.DB_HOST);
console.log('DB_USER:', process.env.DB_USER);
console.log('DB_SSL:', process.env.DB_SSL);

const config = {
  client: 'pg',
  connection: {
    host: process.env.DB_HOST,
    port: parseInt(process.env.DB_PORT) || 5432,
    database: process.env.DB_NAME,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    ssl: process.env.DB_SSL === 'true' ? { rejectUnauthorized: false } : false
  },
  pool: {
    min: 2,
    max: 10,
    acquireTimeoutMillis: 30000,
    idleTimeoutMillis: 30000
  }
};

console.log('Initializing database connection...');
console.log('DB Config:', {
  host: config.connection.host,
  database: config.connection.database,
  ssl: config.connection.ssl
});

const db = knex(config);

async function testConnection() {
  try {
    console.log('Testing database connection...');
    await db.raw('SELECT NOW()');
    console.log('✅ Database connected successfully');
    return true;
  } catch (error) {
    console.error('❌ Database connection failed:', error.message);
    return false;
  }
}

module.exports = db;
module.exports.testConnection = testConnection;