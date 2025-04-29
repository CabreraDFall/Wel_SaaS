require('dotenv').config();
const express = require('express');
const cors = require('cors');
const cookieParser = require('cookie-parser');
const { verifyJWT } = require('./controllers/authController');
const { Pool } = require('pg');
const dbConfig = require('./config/db');

const pool = new Pool(dbConfig); // Status: Inicialización de la conexión a la base de datos

const app = express();

module.exports = pool;

// Middleware
app.use(cors({
  origin: 'http://localhost:5174',
  credentials: true
}));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
//Status: Agregado middleware para analizar las cookies
app.use(cookieParser());

// Routes
app.use('/api/products', require('./routes/products'));
app.use('/api/receptions', require('./routes/receptions'));
app.use('/api/labels', require('./routes/labels'));
app.use('/api/warehouses', require('./routes/warehouses'));
app.use('/api/uom_master', require('./routes/uom'));
app.use('/api/suppliers', require('./routes/suppliers'));
app.use('/api/uom_categories', require('./routes/uom_categories'));
app.use('/api/users', require('./routes/users')); // Agregar la ruta de usuarios
app.use('/api/auth', require('./routes/auth'));

//Status: Agregada ruta de prueba para verificar el token JWT
app.get('/api/test', verifyJWT, (req, res) => {
  res.status(200).json({ message: 'Welcome to the protected route' });
});

app.get('/', (req, res) => {
  res.send('Welcome to the API');
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});

//Status: Configurado el middleware cors para permitir el acceso solo desde el dominio del frontend
