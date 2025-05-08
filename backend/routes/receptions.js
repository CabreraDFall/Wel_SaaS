const express = require('express');
const router = express.Router();
const pool = require('../index');

// GET - Obtener todas las recepciones
router.get('/', async (req, res) => {
  try {
    const result = await pool.query('SELECT id, reception_date, vehicle, items, purchase_order, status, notes, created_by, completed_at, inactive, Inactive_by, deleted_at FROM receptions ORDER BY reception_date DESC');
    res.json(result.rows);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// GET - Obtener una recepción específica
router.get('/:id', async (req, res) => {
  try {
    const result = await pool.query('SELECT id, reception_date, vehicle, items, purchase_order, status, notes, created_by, completed_at, inactive, Inactive_by, deleted_at FROM receptions WHERE id = $1', [req.params.id]);
    if (result.rows.length === 0) {
      return res.status(404).json({ message: 'Recepción no encontrada' });
    }
    res.json(result.rows[0]);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// GET - Obtener recepciones por fecha
router.get('/date/:date', async (req, res) => {
  try {
    const date = req.params.date;
    const result = await pool.query(
      "SELECT id, reception_date, vehicle, items, purchase_order, status, notes, created_by, completed_at, inactive, Inactive_by, deleted_at FROM receptions WHERE DATE(reception_date) = DATE($1) ORDER BY reception_date DESC",
      [date]
    );
    res.json(result.rows);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// POST - Crear una nueva recepción
router.post('/', async (req, res) => {
  const { vehicle, items, purchase_order, status = 'en camino', reception_date = new Date(), notes, created_by, inactive = false, Inactive_by = null } = req.body;

  try {
    const result = await pool.query(
      'INSERT INTO receptions (reception_date, vehicle, items, purchase_order, status, notes, created_by, inactive, Inactive_by) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9) RETURNING *',
      [reception_date, vehicle, items, purchase_order, status, notes, created_by, inactive, Inactive_by]
    );
    res.status(201).json(result.rows[0]);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// PATCH - Actualizar una recepción
router.patch('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const { vehicle, items, purchase_order, status, reception_date, inactive, Inactive_by } = req.body;

    // Construir la consulta dinámica
    let updates = [];
    let values = [];
    let paramCount = 1;

    if (vehicle) {
      updates.push(`vehicle = $${paramCount}`);
      values.push(vehicle);
      paramCount++;
    }
    if (items !== undefined) {
      updates.push(`items = $${paramCount}`);
      values.push(items);
      paramCount++;
    }
    if (purchase_order) {
      updates.push(`purchase_order = $${paramCount}`);
      values.push(purchase_order);
      paramCount++;
    }
    if (status) {
      updates.push(`status = $${paramCount}`);
      values.push(status);
      paramCount++;
    }
    if (reception_date) {
      updates.push(`reception_date = $${paramCount}`);
      values.push(reception_date);
      paramCount++;
    }
    if (inactive !== undefined) {
      updates.push(`inactive = $${paramCount}`);
      values.push(inactive);
      paramCount++;
    }
    if (Inactive_by) {
      updates.push(`Inactive_by = $${paramCount}`);
      values.push(Inactive_by);
      paramCount++;
    }

    if (updates.length === 0) {
      return res.status(400).json({ message: 'No se proporcionaron datos para actualizar' });
    }

    values.push(id);
    const query = `
      UPDATE receptions
      SET ${updates.join(', ')}
      WHERE id = $${paramCount}
      RETURNING *
    `;

    const result = await pool.query(query, values);

    if (result.rows.length === 0) {
      return res.status(404).json({ message: 'Recepción no encontrada' });
    }

    res.json(result.rows[0]);
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
    const result = await pool.query(
      'SELECT COUNT(*) FROM receptions WHERE purchase_order = $1',
      [purchase_order]
    );
    res.json({ count: parseInt(result.rows[0].count, 10) });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

module.exports = router;
