import { httpService } from './httpService';

class SupplierService {
  async getSuppliers() {
    return await httpService.get('/suppliers');
  }

  async createSupplier(supplier) {
    return await httpService.post('/suppliers', supplier);
  }
}

export const supplierService = new SupplierService();
