const express = require('express');
const cors = require('cors');
const app = express();

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

// Routes
app.use('/products', require('./routes/products'));
app.use('/receptions', require('./routes/receptions'));
app.use('/labels', require('./routes/labels'));
app.use('/warehouses', require('./routes/warehouses'));

app.get('/', (req, res) => {
  res.send('Welcome to the API');
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
