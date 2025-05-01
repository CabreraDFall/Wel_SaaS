import { CrudService } from './crudService';
import http from './httpService';
import { apiUrl } from '../../config.json';

const apiEndpoint = apiUrl + '/labels';

class LabelService extends CrudService {
  constructor() {
    super('labels');
  }

  async getLabelsByPurchaseOrderAndProduct(purchaseOrder, productId) {
    try {
      const { data } = await http.get(`${apiEndpoint}?purchase_order=${purchaseOrder}&product_id=${productId}`);
      return data;
    } catch (error) {
      console.error('Error fetching labels:', error);
      throw error;
    }
  }

  async generateLabels(purchaseOrder, productId) {
    try {
      const { data } = await http.post(`${apiEndpoint}/generate`, { purchase_order: purchaseOrder, product_id: productId });
      return data;
    } catch (error) {
      console.error('Error generating labels:', error);
      throw error;
    }
  }
}

export default new LabelService();
