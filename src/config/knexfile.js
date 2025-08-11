const path = require('path');
require("dotenv").config({ path: path.join(__dirname, '../.env') });
const fs = require('fs');

console.log('Environment variables loaded:');
console.log('DB_HOST:', process.env.DB_HOST);
console.log('DB_USER:', process.env.DB_USER);
console.log('DB_SSL:', process.env.DB_SSL);

module.exports = {
  development: {
    client: process.env.DB_CLIENT || "pg",
    connection: {
      host: process.env.DB_HOST,
      port: parseInt(process.env.DB_PORT) || 5432,
      user: process.env.DB_USER,
      password: process.env.DB_PASSWORD,
      database: process.env.DB_NAME,
      ssl: process.env.DB_SSL === 'true' ? {
        rejectUnauthorized: true,
        ca: process.env.DB_CA_PATH ? fs.readFileSync(path.join(__dirname, '../', process.env.DB_CA_PATH)).toString() : undefined
      } : false
    },
    migrations: {
      directory: "./migration",
    },
    seeds: {
      directory: "./seeds",
    },
  },

  production: {
    client: process.env.DB_CLIENT || "pg",
    connection: {
      host: process.env.DB_HOST,
      port: parseInt(process.env.DB_PORT) || 5432,
      user: process.env.DB_USER,
      password: process.env.DB_PASSWORD,
      database: process.env.DB_NAME,
      ssl: process.env.DB_SSL === 'true' ? {
        rejectUnauthorized: true,
        ca: process.env.DB_CA_PATH ? fs.readFileSync(path.join(__dirname, '../', process.env.DB_CA_PATH)).toString() : undefined
      } : false
    },
    migrations: {
      directory: "./migration",
    },
    seeds: {
      directory: "./seeds",
    },
  }
};
