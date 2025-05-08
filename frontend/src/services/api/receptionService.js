import { httpService } from './httpService';

class ReceptionService {
    async getAllReceptions() {
        return await httpService.get('/receptions');
    }

    async createReception(receptionData) {
        return await httpService.post('/receptions', receptionData);
    }

    async updateReception(id, receptionData) {
        return await httpService.put(`/receptions/${id}`, receptionData);
    }

    async deleteReception(id) {
        return await httpService.delete(`/receptions/${id}`);
    }

    async getReceptionsByDate(date) {
        return await httpService.get(`/receptions/date/${date}`);
    }

    async getReceptionByOrder(orderNumber) {
        return await httpService.get(`/receptions/order/${orderNumber}`);
    }
}

export const receptionService = new ReceptionService();

receptionService.getReceptionsCountByPurchaseOrder = async (purchaseOrder) => {
  return await httpService.get(`/receptions/count/${purchaseOrder}`)
    .then(response => response.data);
};
