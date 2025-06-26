const express = require('express');
const router = express.Router();
const supabase = require('../config/db');

// @desc    Get all UOMs
// @route   GET /api/uom_master
// @access  Public
router.get('/', async (req, res) => {
  try {
    const { data, error } = await supabase
      .from('uom_master')
      .select('*, uom_categories!inner(name)')
      .order('name', { ascending: true });

    if (error) {
      throw error;
    }
    res.json(data);
  } catch (error) {
    res.status(500).json({ message: 'Server Error', error: error.message });
  }
});

// @desc    Get single UOM by ID
// @route   GET /api/uom_master/:id
// @access  Public
router.get('/:id', async (req, res) => {
  try {
    const { data, error } = await supabase
      .from('uom_master')
      .select('*, uom_categories!inner(name)')
      .eq('id', req.params.id)
      .eq('deleted_at', null)
      .single();

    if (error) {
      return res.status(404).json({ message: 'UOM not found', error: error.message });
    }

    res.json(data);
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

    const { data, error } = await supabase
      .from('uom_master')
      .insert([{ code, name, category_id }])
      .select('*');

    if (error) {
      if (error.code === '23505') { // unique violation
        return res.status(400).json({ message: 'UOM code already exists' });
      }
      throw error;
    }

    res.status(201).json(data[0]);
  } catch (error) {
    res.status(500).json({ message: 'Server Error', error: error.message });
  }
});

// @desc    Update a UOM
// @route   PUT /api/uom_master/:id
// @access  Private
router.put('/:id', async (req, res) => {
  try {
    const { code, name, category_id } = req.body;

    const { data, error } = await supabase
      .from('uom_master')
      .update({
        code: code,
        name: name,
        category_id: category_id,
      })
      .eq('id', req.params.id)
      .select('*');

    if (error) {
      if (error.code === '23505') { // unique violation
        return res.status(400).json({ message: 'UOM code already exists' });
      }
      throw error;
    }

    if (!data || data.length === 0) {
      return res.status(404).json({ message: 'UOM not found' });
    }

    res.json(data[0]);
  } catch (error) {
    res.status(500).json({ message: 'Server Error', error: error.message });
  }
});

// @desc    Delete a UOM
// @route   DELETE /api/uom_master/:id
// @access  Private
router.delete('/:id', async (req, res) => {
  try {
    const { error } = await supabase
      .from('uom_master')
      .update({ deleted_at: new Date().toISOString() })
      .eq('id', req.params.id);

    if (error) {
      throw error;
    }

    res.json({ message: 'UOM removed' });
  } catch (error) {
    res.status(500).json({ message: 'Server Error', error: error.message });
  }
});

module.exports = router;
