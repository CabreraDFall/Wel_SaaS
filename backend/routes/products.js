const express = require('express');
const router = express.Router();
const pool = require('../config/db');

// @desc    Get all products
// @route   GET /api/products
// @access  Public
router.get('/', async (req, res) => {
  try {
    const result = await pool.query(`
      SELECT p.*, m.name as udm_name, s.supplier_name as supplier_name
      FROM products p
      LEFT JOIN uom_master m ON p.uom_id = m.id
      LEFT JOIN suppliers s ON p.supplier_id = s.id
      ORDER BY p.created_at DESC
    `);
    console.log('Products with UOM:', result.rows.map(row => ({ product_id: row.id, uom_id: row.uom_id, udm_name: row.udm_name })));
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
      SELECT p.*, m.name as udm_name, s.supplier_name as supplier_name
      FROM products p
      LEFT JOIN uom_master m ON p.uom_id = m.id
      LEFT JOIN suppliers s ON p.supplier_id = s.id
      WHERE p.id = $1
    `, [req.params.id]);

    if (result.rows.length === 0) {
      return res.status(404).json({ message: 'Product not found' });
    }

    console.log('Product by ID with UOM:', result.rows.map(row => ({ product_id: row.id, uom_id: row.uom_id, udm_name: row.udm_name })));
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
    const { code, product_name, uom_id, udm, format, supplier_id, weight, description } = req.body;

    // Basic validation
    if (!code || !product_name || (!uom_id && !udm) || (typeof udm === 'string' && udm.toUpperCase() === 'N/A') || !format || !supplier_id) {
      console.log('Missing fields:', {
        code: !code,
        product_name: !product_name,
        uom_id: !uom_id,
        udm: !udm,
        format: !format,
        supplier_id: !supplier_id
      });
      let requiredFields = ['code', 'product_name', 'format', 'supplier_id'];
      if (!uom_id && !udm) {
        requiredFields.push('uom_id or udm');
      }
      return res.status(400).json({
        message: 'All fields are required',
        required: requiredFields,
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
    let finalUomId = null;
    if (uom_id) {
      finalUomId = uom_id;
    } else if (udm) {
      // Try to find by id
      console.log('Attempting to find UOM by id:', udm);
      const uomResult = await pool.query('SELECT id FROM uom_master WHERE id = $1', [udm]);
      console.log('UOM result:', uomResult.rows);
      if (uomResult.rows.length > 0) {
        finalUomId = uomResult.rows[0].id;
      } else {
        console.log('UOM not found with id:', udm);
      }
    } else {
      console.log('UDM is null or undefined');
    }

    console.log('UOM ID after processing:', finalUomId);
    console.log('Attempting to insert product:', { code, product_name, uom_id: finalUomId, format, supplier_id, weight });
    const result = await pool.query(
      'INSERT INTO products (code, product_name, uom_id, format, supplier_id, weight, description) VALUES ($1, $2, $3, $4, $5, $6, $7) RETURNING *',
      [code, product_name, finalUomId, format, supplier_id, weight, description]
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
    const { code, product_name, udm, format, supplier_id, description, weight } = req.body;

    // Check if product exists
    const product = await pool.query('SELECT * FROM products WHERE id = $1', [req.params.id]);

    // Basic validation
    if (!code || !product_name || !format || !supplier_id) {
      console.log('Missing fields:', {
        code: !code,
        product_name: !product_name,
        format: !format,
        supplier_id: !supplier_id
      });
      return res.status(400).json({
        message: 'All fields are required',
        required: ['code', 'product_name', 'format', 'supplier_id'],
        received: req.body
      });
    }

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
        } else {
          console.log('UOM not found with code:', udm);
        }
      }
    } else {
      console.log('UDM is null or undefined');
    }

    const result = await pool.query(
      'UPDATE products SET code = COALESCE($1, code), product_name = COALESCE($2, product_name), uom_id = COALESCE($3, uom_id), format = COALESCE($4, format), supplier_id = COALESCE($5, supplier_id), weight = COALESCE($6, weight), description = COALESCE($7, description) WHERE id = $8 RETURNING *',
      [code, product_name, uom_id, format, supplier_id, weight, description, req.params.id]
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
