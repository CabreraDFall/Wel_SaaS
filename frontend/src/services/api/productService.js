import { CrudService } from './crudService';

class ProductService extends CrudService {
    constructor() {
        super('products');
    }

    // Aquí puedes agregar métodos específicos para productos si los necesitas
    // Por ejemplo:
    async getByCategory(category) {
        return await this.httpService.get(`/${this.endpoint}/category/${category}`);
    }
}

export const productService = new ProductService(); 