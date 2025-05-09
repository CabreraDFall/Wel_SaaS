import { httpService } from './httpService';

class UserService {
  async getUsers() {
    return await httpService.get('/users');
  }

  async createUser(user) {
    return await httpService.post('/auth/register', user);
  }

  async getCurrentUser() {
    // Obtener el token del localStorage
    const token = localStorage.getItem('token');

    // Decodificar el token para obtener el ID del usuario
    if (token) {
      const decodedToken = JSON.parse(atob(token.split('.')[1]));
      const userId = decodedToken.id;

      // Usar el ID del usuario para obtener la información del usuario
      return await httpService.get(`/users/${userId}`);
    } else {
      return null;
    }
  }
}

export const userService = new UserService();
