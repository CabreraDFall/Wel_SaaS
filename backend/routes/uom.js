const express = require('express');
const router = express.Router();
const pool = require('../config/db');

// @desc    Get all UOMs
// @route   GET /api/uom_master
// @access  Public
router.get('/', async (req, res) => {
  try {
    const result = await pool.query(`
      SELECT m.*, c.name as category_name 
      FROM uom_master m
      LEFT JOIN uom_categories c ON m.category_id = c.id
      WHERE m.deleted_at IS NULL
      ORDER BY m.name
    `);
    res.json(result.rows);
  } catch (error) {
    res.status(500).json({ message: 'Server Error', error: error.message });
  }
});

// @desc    Get single UOM by ID
// @route   GET /api/uom_master/:id
// @access  Public
router.get('/:id', async (req, res) => {
  try {
    const result = await pool.query(`
      SELECT m.*, c.name as category_name 
      FROM uom_master m
      LEFT JOIN uom_categories c ON m.category_id = c.id
      WHERE m.id = $1 AND m.deleted_at IS NULL
    `, [req.params.id]);
    
    if (result.rows.length === 0) {
      return res.status(404).json({ message: 'UOM not found' });
    }
    
    res.json(result.rows[0]);
  } catch (error) {
    res.status(500).json({ message: 'Server Error', error: error.message });
  }
});

// @desc    Create a UOM
// @route   POST /api/uom_master
// @access  Private
router.post('/', async (req, res) => {
  try {
    const { code, name, category_id } = req.body;

    // Basic validation
    if (!code || !name || !category_id) {
      return res.status(400).json({ 
        message: 'All fields are required',
        required: ['code', 'name', 'category_id'],
        received: req.body
      });
    }

    const result = await pool.query(
      'INSERT INTO uom_master (code, name, category_id) VALUES ($1, $2, $3) RETURNING *',
      [code, name, category_id]
    );

    const completeUOM = await pool.query(`
      SELECT m.*, c.name as category_name 
      FROM uom_master m
      LEFT JOIN uom_categories c ON m.category_id = c.id
      WHERE m.id = $1
    `, [result.rows[0].id]);

    res.status(201).json(completeUOM.rows[0]);
  } catch (error) {
    if (error.code === '23505') { // unique violation
      return res.status(400).json({ message: 'UOM code already exists' });
    }
    res.status(500).json({ message: 'Server Error', error: error.message });
  }
});

// @desc    Update a UOM
// @route   PUT /api/uom_master/:id
// @access  Private
router.put('/:id', async (req, res) => {
  try {
    const { code, name, category_id } = req.body;

    // Check if UOM exists
    const uom = await pool.query('SELECT * FROM uom_master WHERE id = $1', [req.params.id]);

    if (uom.rows.length === 0) {
      return res.status(404).json({ message: 'UOM not found' });
    }

    const result = await pool.query(
      'UPDATE uom_master SET code = COALESCE($1, code), name = COALESCE($2, name), category_id = COALESCE($3, category_id) WHERE id = $4 RETURNING *',
      [code, name, category_id, req.params.id]
    );

    const completeUOM = await pool.query(`
      SELECT m.*, c.name as category_name 
      FROM uom_master m
      LEFT JOIN uom_categories c ON m.category_id = c.id
      WHERE m.id = $1
    `, [result.rows[0].id]);

    res.json(completeUOM.rows[0]);
  } catch (error) {
    if (error.code === '23505') { // unique violation
      return res.status(400).json({ message: 'UOM code already exists' });
    }
    res.status(500).json({ message: 'Server Error', error: error.message });
  }
});

// @desc    Delete a UOM
// @route   DELETE /api/uom_master/:id
// @access  Private
router.delete('/:id', async (req, res) => {
  try {
    // Soft delete
    const result = await pool.query(
      'UPDATE uom_master SET deleted_at = CURRENT_TIMESTAMP WHERE id = $1 RETURNING *', 
      [req.params.id]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ message: 'UOM not found' });
    }

    res.json({ message: 'UOM removed' });
  } catch (error) {
    res.status(500).json({ message: 'Server Error', error: error.message });
  }
});

module.exports = router; 