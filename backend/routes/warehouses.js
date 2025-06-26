const router = require('express').Router();
const supabase = require('../config/db');

// Get all warehouses
router.get('/', async (req, res) => {
    try {
        const { data, error } = await supabase
            .from('warehouses')
            .select('*')
            .order('warehouse_number');

        if (error) throw error;
        res.json(data);
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

        const { data, error } = await supabase
            .from('warehouses')
            .insert([{ warehouse_name, warehouse_number }])
            .select()

        if (error) {
            console.error(error.message);
            if (error.code === '23505') { // Unique violation
                return res.status(400).json({ error: 'El número de almacén ya existe' });
            } else {
                return res.status(500).json({ error: 'Error al crear almacén' });
            }
        }

        res.json(data[0]);

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

        const { data, error } = await supabase
            .from('warehouses')
            .update({ warehouse_name, warehouse_number })
            .eq('id', id)
            .select()

        if (error) {
            console.error(error.message);
            if (error.code === '23505') { // Unique violation
                res.status(400).json({ error: 'El número de almacén ya existe' });
            } else {
                res.status(500).json({ error: 'Error al actualizar almacén' });
            }
        }

        if (!data || data.length === 0) {
            return res.status(404).json({ error: 'Almacén no encontrado' });
        }

        res.json(data[0]);
    } catch (err) {
        console.error(err.message);
        res.status(500).json({ error: 'Error al actualizar almacén' });
    }
});

// Delete a warehouse
router.delete('/:id', async (req, res) => {
    try {
        const { id } = req.params;
        const { data, error } = await supabase
            .from('warehouses')
            .delete()
            .eq('id', id)
            .select()

        if (error) {
            console.error(error.message);
            res.status(500).json({ error: 'Error al eliminar almacén' });
        }

        if (!data || data.length === 0) {
            return res.status(404).json({ error: 'Almacén no encontrado' });
        }

        res.json({ message: 'Almacén eliminado exitosamente' });
    } catch (err) {
        console.error(err.message);
        res.status(500).json({ error: 'Error al eliminar almacén' });
    }
});

module.exports = router;
