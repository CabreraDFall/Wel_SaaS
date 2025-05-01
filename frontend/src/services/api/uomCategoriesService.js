import { CrudService } from './crudService';

class UomCategoriesService extends CrudService {
    constructor() {
        super('uom_categories');
    }
}

export const uomCategoriesService = new UomCategoriesService();
