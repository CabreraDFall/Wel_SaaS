require('dotenv').config();

const { Pool } = require('pg');
const dbConfig = require('./config/db');

const pool = new Pool(dbConfig); // Status: Inicialización de la conexión a la base de datos

module.exports = pool;
