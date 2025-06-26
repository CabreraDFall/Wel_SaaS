const router = require('express').Router();
const pool = require('..');
const { generateBarcode } = require('../utils/barcodeGenerator');
const supabase = require('../config/db');

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
        const { data: newLabel, error: labelError } = await supabase
            .from('labels')
            .insert([{ barcode: labelData.barcode, product_id: labelData.product_id, warehouse_id: labelData.warehouse_id, quantity: labelData.quantity, created_by: labelData.created_by, purchase_order: purchase_order }])
            .select('*');

        if (labelError) {
            console.error(labelError);
            return res.status(500).json('Server error: ' + labelError.message);
        }

        // Increment reception items
        if (purchase_order) {
            try {
                const { data: reception, error: receptionError } = await supabase
                    .from('receptions')
                    .select('id, items')
                    .eq('purchase_order', purchase_order)
                    .single();

                if (receptionError) {
                    console.error('Error fetching reception:', receptionError.message);
                }

                if (reception) {
                    const receptionId = reception.id;
                    const currentItems = reception.items;
                    const newItems = currentItems + 1;

                    const { error: updateError } = await supabase
                        .from('receptions')
                        .update({ items: newItems })
                        .eq('id', receptionId);

                    if (updateError) {
                        console.error('Error incrementing reception items:', updateError.message);
                    }
                } else {
                    console.log(`Reception not found for purchase order: ${purchase_order}`);
                }
            } catch (err) {
                console.error('Error incrementing reception items:', err.message);
            }
        }

        res.json(newLabel[0]);

    } catch (err) {
        console.error(err.message);
        res.status(500).json('Server error: ' + err.message);
    }
});

// Get all labels
router.get('/', async (req, res) => {
    console.log('GET /api/labels endpoint hit');
    console.log('Request query:', req.query);
    try {
        const { purchase_order } = req.query;
        let query = supabase
            .from('labels')
            .select(
                `*,
                products!left(id, product_name, code, format, uom_id)` // Select product fields and uom_id, use left join
            )
            .order('created_at', { ascending: false });

        if (purchase_order) {
            query = query.eq('purchase_order', purchase_order);
        }

        const { product_id } = req.query;
        if (product_id) {
            query = query.eq('product_id', product_id);
        }

        const { data: labels, error } = await query; // Rename data to labels

        if (error) {
            console.error(error);
            return res.status(500).json('Server error: ' + error.message);
        }

        // Fetch uom_master data for each product
        const labelsWithUom = await Promise.all(labels.map(async (label) => {
            if (label.products && label.products.uom_id) {
                const { data: uomData, error: uomError } = await supabase
                    .from('uom_master')
                    .select('name as udm, code as uom_code')
                    .eq('id', label.products.uom_id)
                    .single();

                if (uomError) {
                    console.error('Error fetching uom_master:', uomError.message);
                    // Optionally handle the error, e.g., return label without uom data
                    return label;
                }

                // Attach uom data to the product object within the label
                return {
                    ...label,
                    products: {
                        ...label.products,
                        uom_master: uomData // Attach the fetched uom data
                    }
                };
            }
            return label; // Return label as is if no product or uom_id
        }));

        console.log('Response data:', labelsWithUom);
        res.json(labelsWithUom); // Send the modified data

    } catch (err) {
        console.error(err.message);
        res.status(500).json('Server error: ' + err.message);
    }
});

// Get a single label
router.get('/:id', async (req, res) => {
    try {
        const { id } = req.params;
        const { data, error } = await supabase
            .from('labels')
            .select('*')
            .eq('id', id)
            .single();

        if (error) {
            return res.status(404).json('Label not found');
        }

        res.json(data);
    } catch (err) {
        console.error(err.message);
        res.status(500).json('Server error: ' + err.message);
    }
});

// Create a label
router.post('/', async (req, res) => {
    try {
        const { barcode, product_id, warehouse_id, quantity, created_by, purchase_order } = req.body;

        const { data: newLabel, error: labelError } = await supabase
            .from('labels')
            .insert([{ barcode, product_id, warehouse_id, quantity, created_by, purchase_order }])
            .select('*');

        if (labelError) {
            console.error(labelError);
            return res.status(500).json('Server error: ' + labelError.message);
        }

        // Increment reception items
        if (purchase_order) {
            try {
                const { data: reception, error: receptionError } = await supabase
                    .from('receptions')
                    .select('id, items')
                    .eq('purchase_order', purchase_order)
                    .single();

                if (receptionError) {
                    console.error('Error fetching reception:', receptionError.message);
                }

                if (reception) {
                    const receptionId = reception.id;
                    const currentItems = reception.items;
                    const newItems = currentItems + 1;

                    const { error: updateError } = await supabase
                        .from('receptions')
                        .update({ items: newItems })
                        .eq('id', receptionId);

                    if (updateError) {
                        console.error('Error incrementing reception items:', updateError.message);
                    }
                } else {
                    console.log(`Reception not found for purchase order: ${purchase_order}`);
                }
            } catch (err) {
                console.error('Error incrementing reception items:', err.message);
            }
        }

        res.json(newLabel[0]);
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

        const { data, error } = await supabase
            .from('labels')
            .update({ barcode, product_code, product_name, udm, format })
            .eq('id', id)
            .select('*');

        if (error) {
            console.error(error);
            return res.status(500).json('Server error: ' + error.message);
        }

        if (data.length === 0) {
            return res.status(404).json('Label not found');
        }

        res.json(data[0]);
    } catch (err) {
        console.error(err.message);
        res.status(500).json('Server error: ' + err.message);
    }
});

// Delete a label
router.delete('/:id', async (req, res) => {
    try {
        const { id } = req.params;
        const { error } = await supabase
            .from('labels')
            .delete()
            .eq('id', id);

        if (error) {
            console.error(error);
            return res.status(500).json('Server error: ' + error.message);
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
        const { data, error } = await supabase
            .from('label_prints')
            .select('*')
            .eq('label_id', id)
            .order('printed_at', { ascending: false });

        if (error) {
            console.error(error);
            return res.status(500).json('Server error: ' + error.message);
        }
        res.json(data);
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

        const { data: newLabelPrint, error: printError } = await supabase
            .from('label_prints')
            .insert([{ label_id: id, printed_by, quantity }])
            .select('*');

        if (printError) {
            console.error(printError);
            return res.status(500).json('Server error: ' + printError.message);
        }

        // Update label to is_printed = true
        const { error: updateError } = await supabase
            .from('labels')
            .update({ is_printed: true })
            .eq('id', id);

        if (updateError) {
            console.error(updateError);
        }

        res.json(newLabelPrint[0]);
    } catch (err) {
        console.error(err.message);
        res.status(500).json('Server error: ' + err.message);
    }
});

module.exports = router;
