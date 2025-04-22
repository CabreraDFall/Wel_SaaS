import http from './httpService';
import { apiUrl } from '../../config.json';

const apiEndpoint = apiUrl + '/labels';

export const getLabelsByPurchaseOrderAndProduct = async (purchaseOrder, productId) => {
  try {
    const { data } = await http.get(`${apiEndpoint}?purchase_order=${purchaseOrder}&product_id=${productId}`);
    return data;
  } catch (error) {
    console.error('Error fetching labels:', error);
    throw error;
  }
};

export const generateLabels = async (purchaseOrder, productId) => {
  try {
    const { data } = await http.post(`${apiEndpoint}/generate`, { purchase_order: purchaseOrder, product_id: productId });
    return data;
  } catch (error) {
    console.error('Error generating labels:', error);
    throw error;
  }
};

export default {
  getLabelsByPurchaseOrderAndProduct,
  generateLabels,
};
