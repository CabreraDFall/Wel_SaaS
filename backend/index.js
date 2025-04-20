const express = require('express');
const cors = require('cors');
const app = express();

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

// Routes
app.use('/api/products', require('./routes/products'));
app.use('/api/receptions', require('./routes/receptions'));
app.use('/api/labels', require('./routes/labels'));
app.use('/api/warehouses', require('./routes/warehouses'));
app.use('/api/uom_master', require('./routes/uom'));
app.use('/api/suppliers', require('./routes/suppliers'));
app.use('/api/uom_categories', require('./routes/uom_categories'));
app.use('/api/users', require('./routes/users')); // Agregar la ruta de usuarios

app.get('/', (req, res) => {
  res.send('Welcome to the API');
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
