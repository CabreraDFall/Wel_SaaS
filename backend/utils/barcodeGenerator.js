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
async function generateBarcode(warehouseNumber, productCode, separatorDigit = 1, format, labelCount) {
    // Validate that inputs are numbers and are positive integers
    if (typeof warehouseNumber !== 'number' || isNaN(warehouseNumber)) {
        throw new Error('Warehouse number must be a number');
    }

    if (warehouseNumber <= 0 || !Number.isInteger(warehouseNumber)) {
        throw new Error('Warehouse number must be a positive integer. Value provided was: ' + warehouseNumber);
    }

    if (typeof productCode !== 'number' || isNaN(productCode)) {
        throw new Error('Product code must be a number');
    }

    if (productCode <= 0 || !Number.isInteger(productCode)) {
        throw new Error('Product code must be a positive integer. Value provided was: ' + productCode);
    }

    // Validate separator digit is either 1 or 8
    if (separatorDigit !== 1 && separatorDigit !== 8) {
        throw new Error('Separator digit must be either 1 or 8. Value provided was: ' + separatorDigit);
    }

    // Validate format is either "fijo" or "variable"
    if (!['fijo', 'variable'].includes(format)) {
        throw new Error('Format must be either "fijo" or "variable". Value provided was: ' + format);
    }

    // Convert numbers to strings without decimals, using more descriptive variable names
    const warehouseNumberString = Math.floor(warehouseNumber).toString();
    const separatorDigitString = String(separatorDigit);
    const productCodeString = Math.floor(productCode).toString();

    // Generate base barcode using template literals
    const baseBarcode = `${warehouseNumberString}${separatorDigitString}-${productCodeString}`;

    // Add suffix based on format
    if (format === 'fijo') {
        // Return the base barcode for the fijo format
        return baseBarcode;
    } else if (format === 'variable') {
        // For variable format, add the labelCount to the base barcode
        const formattedLabelCount = String(labelCount).padStart(4, '0');
        return `${baseBarcode}-${formattedLabelCount}`;
    }
}

module.exports = {
    generateBarcode
};
