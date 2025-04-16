import { httpService } from './httpService';

export class CrudService {
    constructor(endpoint) {
        this.endpoint = endpoint;
    }

    async getAll() {
        return await httpService.get(`/${this.endpoint}`);
    }

    async getById(id) {
        return await httpService.get(`/${this.endpoint}/${id}`);
    }

    async create(data) {
        return await httpService.post(`/${this.endpoint}`, data);
    }

    async update(id, data) {
        return await httpService.put(`/${this.endpoint}/${id}`, data);
    }

    async delete(id) {
        return await httpService.delete(`/${this.endpoint}/${id}`);
    }
} 