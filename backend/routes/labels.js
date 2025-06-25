const router = require('express').Router();
const pool = require('..');
const { generateBarcode } = require('../utils/barcodeGenerator');

// Generate barcode
router.post('/generate', async (req, res) => {
    console.log("creando barcode");
    try {
        const { product_id, warehouse_id, quantity, active, created_by, warehouseNumber, productCode, separatorDigit = 1, format, purchase_order, labelCount } = req.body;

        // Ensure warehouseNumber and productCode are numbers
        const warehouseNumberNum = Number(warehouseNumber);
        const productCodeNum = Number(productCode);

        if (isNaN(warehouseNumberNum)) {
            return res.status(400).json('Warehouse number must be a number');
        }

        if (isNaN(productCodeNum)) {
            return res.status(400).json('Product code must be a number');
        }

        // Generate barcode
        const barcode = await generateBarcode(warehouseNumberNum, productCodeNum, separatorDigit, format, labelCount);
        console.log('Generated barcode:', barcode);

        // Create label object
        const labelData = {
            barcode: barcode,
            product_id: product_id,
            warehouse_id: warehouse_id,
            quantity: quantity,
            created_by: created_by,
            purchase_order: purchase_order
        };

        // Save label to database
        const newLabel = await pool.query(
            'INSERT INTO labels (barcode, product_id, warehouse_id, quantity, created_by, purchase_order) VALUES ($1, $2, $3, $4, $5, $6) RETURNING *',
            [labelData.barcode, labelData.product_id, labelData.warehouse_id, labelData.quantity, labelData.created_by, purchase_order]
        );

        // Increment reception items
        if (purchase_order) {
            try {
                const reception = await pool.query(
                    'SELECT id, items FROM receptions WHERE purchase_order = $1',
                    [purchase_order]
                );

                if (reception.rows.length > 0) {
                    const receptionId = reception.rows[0].id;
                    const currentItems = reception.rows[0].items;
                    const newItems = currentItems + 1;

                    await pool.query(
                        'UPDATE receptions SET items = $1 WHERE id = $2',
                        [newItems, receptionId]
                    );
                } else {
                    console.log(`Reception not found for purchase order: ${purchase_order}`);
                }
            } catch (err) {
                console.error('Error incrementing reception items:', err.message);
            }
        }

        res.json(newLabel.rows[0]);

    } catch (err) {
        console.error(err.message);
        res.status(500).json('Server error: ' + err.message);
    }
});

// Get all labels
router.get('/', async (req, res) => {
    try {
        const { purchase_order } = req.query;
        let query = `
            SELECT 
                labels.*,
                products.product_name,
                products.code AS product_code,
                COALESCE(uom_master.name, 'N/A') AS udm,
                COALESCE(uom_master.code, 'N/A') AS uom_code,
                products.format
            FROM labels
            JOIN products ON labels.product_id = products.id
            LEFT JOIN uom_master ON products.uom_id = uom_master.id
        `;

        let params = [];
        if (purchase_order) {
            query += ` WHERE labels.purchase_order = $1`;
            params.push(purchase_order);
        }

        const { product_id } = req.query;
        if (product_id) {
            query += params.length > 0 ? ` AND labels.product_id = $${params.length + 1}` : ` WHERE labels.product_id = $${params.length + 1}`;
            params.push(product_id);
        }

        query += ` ORDER BY labels.created_at DESC`;

        const allLabels = await pool.query(query, params);
        res.json(allLabels.rows);
    } catch (err) {
        console.error(err.message);
        res.status(500).json('Server error: ' + err.message);
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
        res.status(500).json('Server error: ' + err.message);
    }
});

// Create a label
router.post('/', async (req, res) => {
    try {
        const { barcode, product_id, warehouse_id, quantity, created_by, purchase_order } = req.body;

        const newLabel = await pool.query(
            'INSERT INTO labels (barcode, product_id, warehouse_id, quantity, created_by, purchase_order) VALUES ($1, $2, $3, $4, $5, $6) RETURNING *',
            [barcode, product_id, warehouse_id, quantity, created_by, purchase_order]
        );

        // Increment reception items
        if (purchase_order) {
            try {
                const reception = await pool.query(
                    'SELECT id, items FROM receptions WHERE purchase_order = $1',
                    [purchase_order]
                );

                if (reception.rows.length > 0) {
                    const receptionId = reception.rows[0].id;
                    const currentItems = reception.rows[0].items;
                    const newItems = currentItems + 1;

                    await pool.query(
                        'UPDATE receptions SET items = $1 WHERE id = $2',
                        [newItems, receptionId]
                    );
                } else {
                    console.log(`Reception not found for purchase order: ${purchase_order}`);
                }
            } catch (err) {
                console.error('Error incrementing reception items:', err.message);
            }
        }

        res.json(newLabel.rows[0]);
    } catch (err) {
        console.error(err.message);
        res.status(500).json('Server error: ' + err.message);
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
            return res.status(400).json('Invalid barcode format. Must be in format: XX-XXXXXXXXXXXX');
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
        res.status(500).json('Server error: ' + err.message);
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
        res.status(500).json('Server error: ' + err.message);
    }
});


// Get label print history
router.get('/:id/prints', async (req, res) => {
    try {
        const { id } = req.params;
        const labelPrints = await pool.query(
            'SELECT * FROM label_prints WHERE label_id = $1 ORDER BY printed_at DESC',
            [id]
        );
        res.json(labelPrints.rows);
    } catch (err) {
        console.error(err.message);
        res.status(500).json('Server error: ' + err.message);
    }
});

// Create label print
router.post('/:id/prints', async (req, res) => {
    try {
        const { id } = req.params;
        const { printed_by, quantity } = req.body;

        const newLabelPrint = await pool.query(
            'INSERT INTO label_prints (label_id, printed_by, quantity) VALUES ($1, $2, $3) RETURNING *',
            [id, printed_by, quantity]
        );

        // Update label to is_printed = true
        await pool.query(
            'UPDATE labels SET is_printed = TRUE WHERE id = $1',
            [id]
        );

        res.json(newLabelPrint.rows[0]);
    } catch (err) {
        console.error(err.message);
        res.status(500).json('Server error: ' + err.message);
    }
});

module.exports = router;
