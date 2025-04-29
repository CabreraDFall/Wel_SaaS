const express = require('express');
const router = express.Router();
const pool = require('../index');

// Rutas para las categorías de unidades de medida (UOM)

// Obtener todas las categorías de UOM
router.get('/', async (req, res) => {
  try {
    const result = await pool.query('SELECT * FROM uom_categories');
    res.json(result.rows);
  } catch (error) {
    console.error(error.message);
    res.status(500).send('Server Error');
  }
});

// Obtener una categoría de UOM por ID
router.get('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const result = await pool.query('SELECT * FROM uom_categories WHERE id = $1', [id]);

    if (result.rows.length === 0) {
      return res.status(404).json({ message: 'UOM Category not found' });
    }

    res.json(result.rows[0]);
  } catch (error) {
    console.error(error.message);
    res.status(500).send('Server Error');
  }
});

// Crear una nueva categoría de UOM
router.post('/', async (req, res) => {
  try {
    const { name, description } = req.body;
    const result = await pool.query(
      'INSERT INTO uom_categories (name, description) VALUES ($1, $2) RETURNING *',
      [name, description]
    );
    res.json(result.rows[0]);
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

    const result = await pool.query(
      'UPDATE uom_categories SET name = $1, description = $2, updated_at = CURRENT_TIMESTAMP WHERE id = $3 RETURNING *',
      [name, description, id]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ message: 'UOM Category not found' });
    }

    res.json(result.rows[0]);
  } catch (error) {
    console.error(error.message);
    res.status(500).send('Server Error');
  }
});

// Eliminar una categoría de UOM
router.delete('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const result = await pool.query('DELETE FROM uom_categories WHERE id = $1 RETURNING *', [id]);

    if (result.rows.length === 0) {
      return res.status(404).json({ message: 'UOM Category not found' });
    }

    res.json({ message: 'UOM Category deleted' });
  } catch (error) {
    console.error(error.message);
    res.status(500).send('Server Error');
  }
});

module.exports = router;
