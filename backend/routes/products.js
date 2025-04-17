const express = require('express');
const router = express.Router();
const pool = require('../config/db');

// @desc    Get all products
// @route   GET /api/products
// @access  Public
router.get('/', async (req, res) => {
  try {
    const result = await pool.query(`
      SELECT p.*, m.name as udm_name 
      FROM products p
      LEFT JOIN uom_master m ON p.uom_id = m.id
      ORDER BY p.created_at DESC
    `);
    res.json(result.rows);
  } catch (error) {
    res.status(500).json({ message: 'Server Error', error: error.message });
  }
});

// @desc    Get single product by ID
// @route   GET /api/products/:id
// @access  Public
router.get('/:id', async (req, res) => {
  try {
    const result = await pool.query(`
      SELECT p.*, m.name as udm_name 
      FROM products p
      LEFT JOIN uom_master m ON p.uom_id = m.id
      WHERE p.id = $1
    `, [req.params.id]);
    
    if (result.rows.length === 0) {
      return res.status(404).json({ message: 'Product not found' });
    }
    
    res.json(result.rows[0]);
  } catch (error) {
    res.status(500).json({ message: 'Server Error', error: error.message });
  }
});

// @desc    Create a product
// @route   POST /api/products
// @access  Private
router.post('/', async (req, res) => {
  try {
    console.log('Received request body:', req.body);
    const { code, product_name, udm, format, supplier } = req.body;

    // Basic validation
    if (!code || !product_name || !format || !supplier) {
      console.log('Missing fields:', {
        code: !code,
        product_name: !product_name,
        format: !format,
        supplier: !supplier
      });
      return res.status(400).json({ 
        message: 'All fields are required',
        required: ['code', 'product_name', 'format', 'supplier'],
        received: req.body
      });
    }

    // Validate format
    if (!['fijo', 'variable'].includes(format)) {
      return res.status(400).json({ 
        message: 'Format must be either "fijo" or "variable"',
        received: format
      });
    }

    // Find or create UOM
    let uom_id = null;
    if (udm) {
      // Check if udm is numeric (direct ID) or a string (code)
      if (!isNaN(parseInt(udm))) {
        uom_id = parseInt(udm);
      } else {
        // Try to find by code
        const uomResult = await pool.query('SELECT id FROM uom_master WHERE code = $1', [udm]);
        if (uomResult.rows.length > 0) {
          uom_id = uomResult.rows[0].id;
        }
      }
    }

    console.log('Attempting to insert product:', { code, product_name, uom_id, format, supplier });
    const result = await pool.query(
      'INSERT INTO products (code, product_name, uom_id, format, supplier) VALUES ($1, $2, $3, $4, $5) RETURNING *',
      [code, product_name, uom_id, format, supplier]
    );

    // Fetch the complete product with UDM name
    const completeProduct = await pool.query(`
      SELECT p.*, m.name as udm_name 
      FROM products p
      LEFT JOIN uom_master m ON p.uom_id = m.id
      WHERE p.id = $1
    `, [result.rows[0].id]);

    res.status(201).json(completeProduct.rows[0]);
  } catch (error) {
    if (error.code === '23502') { // not null violation
      return res.status(400).json({ 
        message: 'Missing required fields',
        error: error.detail,
        received: req.body
      });
    }
    res.status(500).json({ 
      message: 'Server Error', 
      error: error.message,
      detail: error.detail
    });
  }
});

// @desc    Update a product
// @route   PUT /api/products/:id
// @access  Private
router.put('/:id', async (req, res) => {
  try {
    const { code, product_name, udm, format, supplier } = req.body;

    // Check if product exists
    const product = await pool.query('SELECT * FROM products WHERE id = $1', [req.params.id]);

    if (product.rows.length === 0) {
      return res.status(404).json({ message: 'Product not found' });
    }

    // Validate format if provided
    if (format && !['fijo', 'variable'].includes(format)) {
      return res.status(400).json({ 
        message: 'Format must be either "fijo" or "variable"',
        received: format
      });
    }

    // Process UOM ID
    let uom_id = null;
    if (udm) {
      // Check if udm is numeric (direct ID) or a string (code)
      if (!isNaN(parseInt(udm))) {
        uom_id = parseInt(udm);
      } else {
        // Try to find by code
        const uomResult = await pool.query('SELECT id FROM uom_master WHERE code = $1', [udm]);
        if (uomResult.rows.length > 0) {
          uom_id = uomResult.rows[0].id;
        }
      }
    }

    const result = await pool.query(
      'UPDATE products SET code = COALESCE($1, code), product_name = COALESCE($2, product_name), uom_id = COALESCE($3, uom_id), format = COALESCE($4, format), supplier = COALESCE($5, supplier) WHERE id = $6 RETURNING *',
      [code, product_name, uom_id, format, supplier, req.params.id]
    );

    // Fetch the complete product with UDM name
    const completeProduct = await pool.query(`
      SELECT p.*, m.name as udm_name 
      FROM products p
      LEFT JOIN uom_master m ON p.uom_id = m.id
      WHERE p.id = $1
    `, [result.rows[0].id]);

    res.json(completeProduct.rows[0]);
  } catch (error) {
    if (error.code === '23502') {
      return res.status(400).json({ 
        message: 'Missing required fields',
        error: error.detail,
        received: req.body
      });
    }
    res.status(500).json({ 
      message: 'Server Error', 
      error: error.message,
      detail: error.detail
    });
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
    res.status(500).json({ 
      message: 'Server Error', 
      error: error.message,
      detail: error.detail
    });
  }
});

module.exports = router;
