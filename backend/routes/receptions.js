const express = require('express');
const router = express.Router();
const pool = require('../config/db');

// GET - Obtener todas las recepciones
router.get('/', async (req, res) => {
  try {
    const result = await pool.query('SELECT * FROM receptions ORDER BY fecha_recepcion DESC');
    res.json(result.rows);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// GET - Obtener una recepción específica
router.get('/:id', async (req, res) => {
  try {
    const result = await pool.query('SELECT * FROM receptions WHERE id = $1', [req.params.id]);
    if (result.rows.length === 0) {
      return res.status(404).json({ message: 'Recepción no encontrada' });
    }
    res.json(result.rows[0]);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// POST - Crear una nueva recepción
router.post('/', async (req, res) => {
  const { vehiculo, items, ordenCompra, estatus = 'en camino' } = req.body;
  
  try {
    const result = await pool.query(
      'INSERT INTO receptions (vehiculo, items, orden_compra, estatus) VALUES ($1, $2, $3, $4) RETURNING *',
      [vehiculo, items, ordenCompra, estatus]
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
    const { vehiculo, items, ordenCompra, estatus } = req.body;
    
    // Construir la consulta dinámica
    let updates = [];
    let values = [];
    let paramCount = 1;
    
    if (vehiculo) {
      updates.push(`vehiculo = $${paramCount}`);
      values.push(vehiculo);
      paramCount++;
    }
    if (items !== undefined) {
      updates.push(`items = $${paramCount}`);
      values.push(items);
      paramCount++;
    }
    if (ordenCompra) {
      updates.push(`orden_compra = $${paramCount}`);
      values.push(ordenCompra);
      paramCount++;
    }
    if (estatus) {
      updates.push(`estatus = $${paramCount}`);
      values.push(estatus);
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

module.exports = router;
