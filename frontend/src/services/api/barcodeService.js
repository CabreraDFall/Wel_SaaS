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
        created_by: "4f314e72-ebd0-4a2c-bb40-86cc8d54a58f"
      });
      return data;
    } catch (error) {
      console.error('Error generating barcode:', error);
      throw error;
    }
  }
}

export default new BarcodeService();
