import { CrudService } from './crudService';
import { httpService } from './httpService';

const apiEndpoint = '/labels';

class LabelService extends CrudService {
  constructor() {
    super('labels');
  }

  async getLabelsByPurchaseOrderAndProduct(purchaseOrder, productId) {
    try {
      const { data } = await httpService.get(`${apiEndpoint}?purchase_order=${purchaseOrder}&product_id=${productId}`);
      return data;
    } catch (error) {
      console.error('Error fetching labels:', error);
      throw error;
    }
  }

  async generateLabels(purchaseOrder, productId) {
    try {
      const { data } = await httpService.post(`${apiEndpoint}/generate`, { purchase_order: purchaseOrder, product_id: productId });
      return data;
    } catch (error) {
      console.error('Error generating labels:', error);
      throw error;
    }
  }
}

export default new LabelService();
