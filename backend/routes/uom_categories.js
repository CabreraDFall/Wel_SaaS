const express = require('express');
const router = express.Router();
const supabase = require('../config/db');


// Rutas para las categorías de unidades de medida (UOM)

// Obtener todas las categorías de UOM
router.get('/', async (req, res) => {
  try {
    const { data: result, error } = await supabase.from('uom_categories').select('*');
    if (error) throw error;
    res.json(result);
  } catch (error) {
    console.error(error.message);
    res.status(500).send('Server Error');
  }
});

// Obtener una categoría de UOM por ID
router.get('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const { data: result, error } = await supabase.from('uom_categories').select('*').eq('id', id).single();

    if (error) {
      if (error.message === 'Not found') {
        return res.status(404).json({ message: 'UOM Category not found' });
      }
      throw error;
    }

    if (!result) {
      return res.status(404).json({ message: 'UOM Category not found' });
    }

    res.json(result);
  } catch (error) {
    console.error(error.message);
    res.status(500).send('Server Error');
  }
});

// Crear una nueva categoría de UOM
router.post('/', async (req, res) => {
  try {
    const { name, description } = req.body;
    const { data: result, error } = await supabase.from('uom_categories').insert([{ name, description }]).select().single();
    if (error) throw error;
    res.json(result);
  } catch (error) {
    console.error(error.message);
    res.status(500).send('Server Error');
  }
});

// Actualizar una categoría de UOM existente
router.put('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const { name, description } = req.body;

    const { data: result, error } = await supabase.from('uom_categories').update({ name, description, updated_at: new Date().toISOString() }).eq('id', id).select().single();

    if (error) {
      if (error.message === 'Not found') {
        return res.status(404).json({ message: 'UOM Category not found' });
      }
      throw error;
    }

    if (!result) {
      return res.status(404).json({ message: 'UOM Category not found' });
    }

    res.json(result);
  } catch (error) {
    console.error(error.message);
    res.status(500).send('Server Error');
  }
});

// Eliminar una categoría de UOM
router.delete('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const { error } = await supabase.from('uom_categories').delete().eq('id', id);

    if (error) {
      throw error;
    }

    res.json({ message: 'UOM Category deleted' });
  } catch (error) {
    console.error(error.message);
    res.status(500).send('Server Error');
  }
});

module.exports = router;
