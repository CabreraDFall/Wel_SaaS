// frontend/src/services/barcodeService.js
import { httpService } from './httpService';

const apiEndpoint = '/labels';

class BarcodeService {
  async generateBarcode(warehouseNumber, productCode, separatorDigit = 1, format, productId, purchase_order, quantity, warehouse_id) {
    try {
      const { data } = await httpService.post(`${apiEndpoint}/generate`, {
        warehouseNumber,
        productCode,
        separatorDigit,
        format,
        product_id: productId,
        purchase_order: purchase_order,
        quantity: quantity,
        warehouse_id: warehouse_id,
        created_by: "0b88979e-e7d4-48e4-8905-a459c97b8ea6"
      });
      return data;
    } catch (error) {
      console.error('Error generating barcode:', error);
      throw error;
    }
  }
}

export default new BarcodeService();
