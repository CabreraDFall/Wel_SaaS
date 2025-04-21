const router = require('express').Router();
const pool = require('../config/db');

// Get all warehouses
router.get('/', async (req, res) => {
    try {
        const warehouses = await pool.query('SELECT * FROM warehouses ORDER BY warehouse_number');
        res.json(warehouses.rows);
    } catch (err) {
        console.error(err.message);
        res.status(500).json({ error: 'Error al obtener almacenes' });
    }
});

// Create a new warehouse
router.post('/', async (req, res) => {
    try {
        const { warehouse_name, warehouse_number } = req.body;

        // Validate warehouse number is a number and is between 0-9
        if (typeof warehouse_number !== 'number' || isNaN(warehouse_number)) {
            return res.status(400).json({ error: 'El número de almacén debe ser un número' });
        }
        if (warehouse_number < 0 || warehouse_number > 9) {
            return res.status(400).json({ error: 'El número de almacén debe estar entre 0 y 9' });
        }

        try {
            const newWarehouse = await pool.query(
                'INSERT INTO warehouses (warehouse_name, warehouse_number) VALUES ($1, $2) RETURNING *',
                [warehouse_name, warehouse_number]
            );

            res.json(newWarehouse.rows[0]);
        } catch (err) {
            console.error(err.message);
            if (err.code === '23505') { // Unique violation
                return res.status(400).json({ error: 'El número de almacén ya existe' });
            } else {
                return res.status(500).json({ error: 'Error al crear almacén' });
            }
        }
    } catch (err) {
        console.error(err.message);
        res.status(500).json({ error: 'Error al crear almacén' });
    }
});

// Update a warehouse
router.put('/:id', async (req, res) => {
    try {
        const { id } = req.params;
        const { warehouse_name, warehouse_number } = req.body;

       // Validate warehouse number is a number and is between 0-9
        if (typeof warehouse_number !== 'number' || isNaN(warehouse_number)) {
            return res.status(400).json({ error: 'El número de almacén debe ser un número' });
        }
        if (warehouse_number < 0 || warehouse_number > 9) {
            return res.status(400).json({ error: 'El número de almacén debe estar entre 0 y 9' });
        }

        const updateWarehouse = await pool.query(
            'UPDATE warehouses SET warehouse_name = $1, warehouse_number = $2 WHERE id = $3 RETURNING *',
            [warehouse_name, warehouse_number, id]
        );

        if (updateWarehouse.rows.length === 0) {
            return res.status(404).json({ error: 'Almacén no encontrado' });
        }

        res.json(updateWarehouse.rows[0]);
    } catch (err) {
        console.error(err.message);
        if (err.code === '23505') { // Unique violation
            res.status(400).json({ error: 'El número de almacén ya existe' });
        } else {
            res.status(500).json({ error: 'Error al actualizar almacén' });
        }
    }
});

// Delete a warehouse
router.delete('/:id', async (req, res) => {
    try {
        const { id } = req.params;
        const deleteWarehouse = await pool.query('DELETE FROM warehouses WHERE id = $1 RETURNING *', [id]);
        
        if (deleteWarehouse.rows.length === 0) {
            return res.status(404).json({ error: 'Almacén no encontrado' });
        }

        res.json({ message: 'Almacén eliminado exitosamente' });
    } catch (err) {
        console.error(err.message);
        res.status(500).json({ error: 'Error al eliminar almacén' });
    }
});

module.exports = router;
