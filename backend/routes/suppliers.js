const express = require('express');
const router = express.Router();
const supabase = require('../config/db');

// @desc    Get all suppliers
// @route   GET /api/suppliers
// @access  Public
router.get('/', async (req, res) => {
  try {
    const { data, error } = await supabase
      .from('suppliers')
      .select('*')
      .order('created_at', { ascending: false });

    if (error) {
      throw error;
    }

    res.json(data);
  } catch (error) {
    res.status(500).json({ message: 'Server Error', error: error.message });
  }
});

// @desc    Get single supplier by ID
// @route   GET /api/suppliers/:id
// @access  Public
router.get('/:id', async (req, res) => {
  try {
    const { data, error } = await supabase
      .from('suppliers')
      .select('*')
      .eq('id', req.params.id)
      .single();

    if (error) {
      if (error.code === 'PGRST116') { // No rows found
        return res.status(404).json({ message: 'Supplier not found' });
      }
      throw error;
    }

    res.json(data);
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

    const { data, error } = await supabase
      .from('suppliers')
      .insert([
        { supplier_name, contact_name, contact_email, contact_phone, description }
      ])
      .select('*')
      .single();

    if (error) {
      throw error;
    }

    res.status(201).json(data);
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
    const { data: existingSupplier, error: fetchError } = await supabase
      .from('suppliers')
      .select('id')
      .eq('id', req.params.id)
      .single();

    if (fetchError || !existingSupplier) {
       if (fetchError && fetchError.code !== 'PGRST116') { // Ignore "No rows found" error for existence check
         throw fetchError;
       }
      return res.status(404).json({ message: 'Supplier not found' });
    }

    const updatePayload = {};
    if (supplier_name !== undefined) updatePayload.supplier_name = supplier_name;
    if (contact_name !== undefined) updatePayload.contact_name = contact_name;
    if (contact_email !== undefined) updatePayload.contact_email = contact_email;
    if (contact_phone !== undefined) updatePayload.contact_phone = contact_phone;
    if (description !== undefined) updatePayload.description = description;

    const { data, error } = await supabase
      .from('suppliers')
      .update(updatePayload)
      .eq('id', req.params.id)
      .select('*')
      .single();

    if (error) {
      throw error;
    }

    res.json(data);
  } catch (error) {
    res.status(500).json({ message: 'Server Error', error: error.message });
  }
});

// @desc    Delete a supplier
// @route   DELETE /api/suppliers/:id
// @access  Private
router.delete('/:id', async (req, res) => {
  try {
    const { data, error } = await supabase
      .from('suppliers')
      .delete()
      .eq('id', req.params.id)
      .select('*')
      .single(); // Use single to check if a row was deleted

    if (error) {
       if (error.code === 'PGRST116') { // No rows found
        return res.status(404).json({ message: 'Supplier not found' });
      }
      throw error;
    }

    // If data is null, it means no row was found with that ID
    if (!data) {
       return res.status(404).json({ message: 'Supplier not found' });
    }

    res.json({ message: 'Supplier removed' });
  } catch (error) {
    res.status(500).json({ message: 'Server Error', error: error.message });
  }
});

module.exports = router;
