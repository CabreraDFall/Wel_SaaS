const router = require('express').Router();
const pool = require('../config/db');
const { generateBarcode } = require('../utils/barcodeGenerator');

// Get all labels
router.get('/', async (req, res) => {
    try {
        const allLabels = await pool.query(
            'SELECT * FROM labels ORDER BY created_at DESC'
        );
        res.json(allLabels.rows);
    } catch (err) {
        console.error(err.message);
        res.status(500).json('Server error');
    }
});

// Get a single label
router.get('/:id', async (req, res) => {
    try {
        const { id } = req.params;
        const label = await pool.query(
            'SELECT * FROM labels WHERE id = $1',
            [id]
        );
        
        if (label.rows.length === 0) {
            return res.status(404).json('Label not found');
        }
        
        res.json(label.rows[0]);
    } catch (err) {
        console.error(err.message);
        res.status(500).json('Server error');
    }
});

// Create a label
router.post('/', async (req, res) => {
    try {
        const { barcode, product_id, warehouse_id, quantity, created_by } = req.body;

        const newLabel = await pool.query(
            'INSERT INTO labels (barcode, product_id, warehouse_id, quantity, created_by) VALUES ($1, $2, $3, $4, $5) RETURNING *',
            [barcode, product_id, warehouse_id, quantity, created_by]
        );

        res.json(newLabel.rows[0]);
    } catch (err) {
        console.error(err.message);
        if (err.code === '23505') { // Unique violation
            res.status(400).json('Barcode already exists');
        } else {
            res.status(500).json('Server error');
        }
    }
});

// Update a label
router.put('/:id', async (req, res) => {
    try {
        const { id } = req.params;
        const { barcode, product_code, product_name, udm, format } = req.body;

        // Validate barcode format
        const barcodeRegex = /^\d{2}-\d{12}$/;
        if (!barcodeRegex.test(barcode)) {
            return res.status(400).json('Invalid barcode format. Must be in format: XX-XXXXXXXXXXXX');
        }

        // Validate format value
        if (!['fijo', 'variable'].includes(format)) {
            return res.status(400).json('Format must be either "fijo" or "variable"');
        }

        const updateLabel = await pool.query(
            'UPDATE labels SET barcode = $1, product_code = $2, product_name = $3, udm = $4, format = $5 WHERE id = $6 RETURNING *',
            [barcode, product_code, product_name, udm, format, id]
        );

        if (updateLabel.rows.length === 0) {
            return res.status(404).json('Label not found');
        }

        res.json(updateLabel.rows[0]);
    } catch (err) {
        console.error(err.message);
        if (err.code === '23505') { // Unique violation
            res.status(400).json('Barcode already exists');
        } else {
            res.status(500).json('Server error');
        }
    }
});

// Delete a label
router.delete('/:id', async (req, res) => {
    try {
        const { id } = req.params;
        const deleteLabel = await pool.query(
            'DELETE FROM labels WHERE id = $1 RETURNING *',
            [id]
        );

        if (deleteLabel.rows.length === 0) {
            return res.status(404).json('Label not found');
        }

        res.json('Label deleted successfully');
    } catch (err) {
        console.error(err.message);
        res.status(500).json('Server error');
    }
});

module.exports = router;
