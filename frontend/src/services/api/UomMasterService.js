import { CrudService } from './crudService';

class UomMasterService extends CrudService {
    constructor() {
        super('uom_master');
    }
}

export const uomMasterService = new UomMasterService();
