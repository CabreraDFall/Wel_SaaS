const express = require('express');
const router = express.Router();
const pool = require('../index-0');

// @desc    Get all suppliers
// @route   GET /api/suppliers
// @access  Public
router.get('/', async (req, res) => {
  try {
    const result = await pool.query('SELECT * FROM suppliers ORDER BY created_at DESC');
    res.json(result.rows);
  } catch (error) {
    res.status(500).json({ message: 'Server Error', error: error.message });
  }
});

// @desc    Get single supplier by ID
// @route   GET /api/suppliers/:id
// @access  Public
router.get('/:id', async (req, res) => {
  try {
    const result = await pool.query('SELECT * FROM suppliers WHERE id = $1', [req.params.id]);
    
    if (result.rows.length === 0) {
      return res.status(404).json({ message: 'Supplier not found' });
    }
    
    res.json(result.rows[0]);
  } catch (error) {
    res.status(500).json({ message: 'Server Error', error: error.message });
  }
});

// @desc    Create a supplier
// @route   POST /api/suppliers
// @access  Private
router.post('/', async (req, res) => {
  try {
    const { supplier_name, contact_name, contact_email, contact_phone, description } = req.body;

    // Basic validation
    if (!supplier_name || !description) {
      return res.status(400).json({ message: 'Supplier name and description are required' });
    }

    const result = await pool.query(
      'INSERT INTO suppliers (supplier_name, contact_name, contact_email, contact_phone, description) VALUES ($1, $2, $3, $4, $5) RETURNING *',
      [supplier_name, contact_name, contact_email, contact_phone, description]
    );

    res.status(201).json(result.rows[0]);
  } catch (error) {
    res.status(500).json({ message: 'Server Error', error: error.message });
  }
});

// @desc    Update a supplier
// @route   PUT /api/suppliers/:id
// @access  Private
router.put('/:id', async (req, res) => {
  try {
    const { supplier_name, contact_name, contact_email, contact_phone, description } = req.body;

    // Check if supplier exists
    const supplier = await pool.query('SELECT * FROM suppliers WHERE id = $1', [req.params.id]);

    if (supplier.rows.length === 0) {
      return res.status(404).json({ message: 'Supplier not found' });
    }

    const result = await pool.query(
      'UPDATE suppliers SET supplier_name = COALESCE($1, supplier_name), contact_name = COALESCE($2, contact_name), contact_email = COALESCE($3, contact_email), contact_phone = COALESCE($4, contact_phone), description = COALESCE($5, description) WHERE id = $6 RETURNING *',
      [supplier_name, contact_name, contact_email, contact_phone, description, req.params.id]
    );

    res.json(result.rows[0]);
  } catch (error) {
    res.status(500).json({ message: 'Server Error', error: error.message });
  }
});

// @desc    Delete a supplier
// @route   DELETE /api/suppliers/:id
// @access  Private
router.delete('/:id', async (req, res) => {
  try {
    const result = await pool.query('DELETE FROM suppliers WHERE id = $1 RETURNING *', [req.params.id]);

    if (result.rows.length === 0) {
      return res.status(404).json({ message: 'Supplier not found' });
    }

    res.json({ message: 'Supplier removed' });
  } catch (error) {
    res.status(500).json({ message: 'Server Error', error: error.message });
  }
});

module.exports = router;
