import { httpService } from './httpService';

class SupplierService {
  async getSuppliers() {
    return await httpService.get('/suppliers');
  }
}

export const supplierService = new SupplierService();
