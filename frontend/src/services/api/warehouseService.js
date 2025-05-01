import { CrudService } from './crudService';

class WarehouseService extends CrudService {
    constructor() {
        super('warehouses');
    }
}

export const warehouseService = new WarehouseService();
