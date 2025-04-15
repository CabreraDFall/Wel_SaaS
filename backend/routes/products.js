const express = require('express');
const router = express.Router();
const pool = require('../config/db');

// @desc    Get all products
// @route   GET /api/products
// @access  Public
router.get('/', async (req, res) => {
  try {
    const result = await pool.query('SELECT * FROM products');
    res.json(result.rows);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server Error' });
  }
});

// @desc    Get single product by ID
// @route   GET /api/products/:id
// @access  Public
router.get('/:id', async (req, res) => {
  try {
    const result = await pool.query('SELECT * FROM products WHERE id = $1', [req.params.id]);
    
    if (result.rows.length === 0) {
      return res.status(404).json({ message: 'Product not found' });
    }
    
    res.json(result.rows[0]);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server Error' });
  }
});

// @desc    Create a product
// @route   POST /api/products
// @access  Private
router.post('/', async (req, res) => {
  try {
    const { code, barcode, udm, format, supplier } = req.body;

    // Basic validation
    if (!code || !barcode || !udm || !format || !supplier) {
      return res.status(400).json({ message: 'All fields are required' });
    }

    const result = await pool.query(
      'INSERT INTO products (code, barcode, udm, format, supplier) VALUES ($1, $2, $3, $4, $5) RETURNING *',
      [code, barcode, udm, format, supplier]
    );

    res.status(201).json(result.rows[0]);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server Error' });
  }
});

// @desc    Update a product
// @route   PUT /api/products/:id
// @access  Private
router.put('/:id', async (req, res) => {
  try {
    const { code, barcode, udm, format, supplier } = req.body;

    // Check if product exists
    const product = await pool.query('SELECT * FROM products WHERE id = $1', [req.params.id]);

    if (product.rows.length === 0) {
      return res.status(404).json({ message: 'Product not found' });
    }

    const result = await pool.query(
      'UPDATE products SET code = COALESCE($1, code), barcode = COALESCE($2, barcode), udm = COALESCE($3, udm), format = COALESCE($4, format), supplier = COALESCE($5, supplier) WHERE id = $6 RETURNING *',
      [code, barcode, udm, format, supplier, req.params.id]
    );

    res.json(result.rows[0]);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server Error' });
  }
});

// @desc    Delete a product
// @route   DELETE /api/products/:id
// @access  Private
router.delete('/:id', async (req, res) => {
  try {
    const result = await pool.query('DELETE FROM products WHERE id = $1 RETURNING *', [req.params.id]);

    if (result.rows.length === 0) {
      return res.status(404).json({ message: 'Product not found' });
    }

    res.json({ message: 'Product removed' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server Error' });
  }
});

module.exports = router;
