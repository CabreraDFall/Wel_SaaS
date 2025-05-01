const pool = require('../config/db');

/**
 * Generates a barcode by combining warehouse number, separator digit, and product code
 * @param {number} warehouseNumber - The warehouse number (must be a number)
 * @param {number} productCode - The product code (must be a number)
 * @param {1|8} separatorDigit - The separator digit (must be either 1 or 8)
 * @param {string} format - The format type ('fijo' or 'variable')
 * @returns {string} The generated barcode
 * @throws {Error} If separatorDigit is not 1 or 8
 * @throws {Error} If warehouseNumber or productCode are not numbers
 */
async function generateBarcode(warehouseNumber, productCode, separatorDigit = 1, format) {
    // Validate that inputs are numbers
    if (typeof warehouseNumber !== 'number' || isNaN(warehouseNumber)) {
        throw new Error('Warehouse number must be a number');
    }

    if (warehouseNumber <= 0 || !Number.isInteger(warehouseNumber)) {
        throw new Error('Warehouse number must be a positive integer');
    }

    if (typeof productCode !== 'number' || isNaN(productCode)) {
        throw new Error('Product code must be a number');
    }

    if (productCode <= 0 || !Number.isInteger(productCode)) {
        throw new Error('Product code must be a positive integer');
    }

    // Validate separator digit
    if (separatorDigit !== 1 && separatorDigit !== 8) {
        throw new Error('Separator digit must be either 1 or 8');
    }

    // Validate format
    if (!['fijo', 'variable'].includes(format)) {
        throw new Error('Format must be either "fijo" or "variable"');
    }

    // Convert numbers to strings without decimals
    const warehouse = Math.floor(warehouseNumber).toString();
    const separator = String(separatorDigit);
    const product = Math.floor(productCode).toString();

    // Generate base barcode
    const baseBarcode = `${warehouse}${separator}-${product}`;

    // Add suffix based on format
    if (format === 'fijo') {
        return `${baseBarcode}0000`;
    } else {
        // Get and increment counter for variable format
        try {
            const result = await pool.query(
                'INSERT INTO barcode_counters (barcode_base, counter) VALUES ($1, 1) ' +
                'ON CONFLICT (barcode_base) DO UPDATE SET counter = barcode_counters.counter + 1 ' +
                'RETURNING counter',
                [baseBarcode]
            );
            const counter = result.rows[0].counter;
            return `${baseBarcode}${counter.toString().padStart(4, '0')}`;
        } catch (err) {
            console.error('Error managing barcode counter:', err);
            throw new Error('Failed to generate variable barcode');
        }
    }
}

module.exports = {
    generateBarcode
};
