import { httpService } from './httpService';

class UserService {
  async getUsers() {
    return await httpService.get('/users');
  }

  async createUser(user) {
    return await httpService.post('/auth/register', user);
  }
}

export const userService = new UserService();
