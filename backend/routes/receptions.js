const express = require('express');
const router = express.Router();
const pool = require('..');
const supabase = require('../config/db');

// GET - Obtener todas las recepciones
router.get('/', async (req, res) => {
  try {
    const { data, error } = await supabase
      .from('receptions')
      .select('*')
      .eq('inactive', false)
      .order('reception_date', { ascending: false });

    if (error) {
      return res.status(500).json({ message: error.message });
    }
    res.json(data);
  } catch (error) {
    // TODO: Check Supabase table and column names, API key permissions, and Supabase status.
    console.error('Error fetching receptions:', error);
    res.status(500).json({ message: 'Error interno del servidor al obtener recepciones', error: error.message });
  }
});

// GET - Obtener una recepción específica
router.get('/:id', async (req, res) => {
  try {
    const { data, error } = await supabase
      .from('receptions')
      .select('*')
      .eq('id', req.params.id)
      .single();

    if (error) {
      return res.status(404).json({ message: 'Recepción no encontrada' });
    }
    res.json(data);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// GET - Obtener recepciones por fecha
router.get('/date/:date', async (req, res) => {
  try {
    const date = req.params.date;
    const { data, error } = await supabase
      .from('receptions')
      .select('*')
      .eq('inactive', false)
      .gte('reception_date', date)
      .lte('reception_date', date)
      .order('reception_date', { ascending: false });

    if (error) {
      return res.status(500).json({ message: error.message });
    }
    res.json(data);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// POST - Crear una nueva recepción
router.post('/', async (req, res) => {
  const { vehicle, items, purchase_order, status = 'en camino', reception_date = new Date(), notes, created_by, inactive = false, inactive_by = null } = req.body;

  try {
    // Verificar si el purchase_order ya existe
    const { data: countResult, error: countError } = await supabase
      .from('receptions')
      .select('purchase_order', { count: 'exact' })
      .eq('purchase_order', purchase_order);

    if (countError) {
      console.error(countError);
      return res.status(500).json({ message: 'Server Error', error: countError.message });
    }

    if (countResult && countResult.length > 0) {
      return res.status(400).json({ message: 'El número de orden de compra ya existe' });
    }

    const { data, error } = await supabase
      .from('receptions')
      .insert([{ reception_date, vehicle, items, purchase_order, status, notes, created_by, inactive, inactive_by }])
      .select('*');

    if (error) {
      console.error(error);
      return res.status(400).json({ message: error.message });
    }
    res.status(201).json(data[0]);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// PATCH - Actualizar una recepción
router.patch('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const { vehicle, items, purchase_order, status, reception_date, inactive, inactive_by } = req.body;

    const { data, error } = await supabase
      .from('receptions')
      .update({ vehicle, items, purchase_order, status, reception_date, inactive, inactive_by })
      .eq('id', id)
      .select('*');

    if (error) {
      console.error(error);
      return res.status(400).json({ message: error.message });
    }

    if (data.length === 0) {
      return res.status(404).json({ message: 'Recepción no encontrada' });
    }

    res.json(data[0]);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// DELETE - Eliminar una recepción
router.delete('/:id', async (req, res) => {
  try {
    const result = await pool.query('DELETE FROM receptions WHERE id = $1 RETURNING *', [req.params.id]);
    if (result.rows.length === 0) {
      return res.status(404).json({ message: 'Recepción no encontrada' });
    }
    res.json({ message: 'Recepción eliminada' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// GET - Obtener el número de recepciones por orden de compra
router.get('/count/:purchase_order', async (req, res) => {
  try {
    const { purchase_order } = req.params;
    const { data, error } = await supabase
      .from('receptions')
      .select('purchase_order', { count: 'exact' })
      .eq('purchase_order', purchase_order);

    if (error) {
      return res.status(500).json({ message: error.message });
    }

    res.json({ count: data ? data.length : 0 });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

module.exports = router;
