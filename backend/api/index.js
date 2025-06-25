require('dotenv').config();
const express = require('express');
const cors = require('cors');
const cookieParser = require('cookie-parser');

const productsRoute = require('./products');
const { verifyJWT } = require('../controllers/authController');

const app = express();

// Middleware
const allowedOrigin = process.env.FRONTEND_URL || 'http://localhost:5173';

app.use(cors({
  origin: allowedOrigin,
  credentials: true
}));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());

// Routes
app.use('/api/products', verifyJWT, productsRoute);
app.use('/api/receptions', verifyJWT, require('../routes/receptions'));
app.use('/api/labels', verifyJWT, require('../routes/labels'));
app.use('/api/warehouses', verifyJWT, require('../routes/warehouses'));
app.use('/api/uom_master', verifyJWT, require('../routes/uom'));
app.use('/api/suppliers', verifyJWT, require('../routes/suppliers'));
app.use('/api/uom_categories', verifyJWT, require('../routes/uom_categories'));
app.use('/api/users', verifyJWT, require('../routes/users')); // Agregar la ruta de usuarios
app.use('/api/auth', require('../routes/auth'));

//Status: Agregada ruta de prueba para verificar el token JWT
app.get('/api/test', verifyJWT, (req, res) => {
  res.status(200).json({ message: 'Welcome to the protected route' });
});

app.get('/', (req, res) => {
  res.send('API Wel_SaaS funcionando 🚀');
});

module.exports
