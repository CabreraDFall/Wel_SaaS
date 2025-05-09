const BASE_URL = 'http://localhost:3000/api';

class HttpService {
    async get(endpoint) {
        try {
            const token = localStorage.getItem('token');
            const headers = {
                'Content-Type': 'application/json',
                ...(token ? { 'Authorization': `Bearer ${token}` } : {})
            };
            const response = await fetch(`${BASE_URL}${endpoint}`, {
                headers: headers
            });
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            return await response.json();
        } catch (error) {
            throw this.handleError(error);
        }
    }

    async post(endpoint, data) {
        try {
            const token = localStorage.getItem('token');
            const response = await fetch(`${BASE_URL}${endpoint}`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify(data),
            });

            if (!response.ok) {
                const errorData = await response.json();
                console.error('Server response:', errorData);
                throw new Error(errorData.message || `HTTP error! status: ${response.status}`);
            }
            return await response.json();
        } catch (error) {
            if (error.message.includes('401') || error.message.includes('403')) {
                window.location.href = '/login';
                return;
            }
            throw this.handleError(error);
        }
    }

    async put(endpoint, data) {
        try {
            const token = localStorage.getItem('token');
            const response = await fetch(`${BASE_URL}${endpoint}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify(data),
            });
            if (!response.ok) {
                 if (response.status === 401 || response.status === 403) {
                    window.location.href = '/login';
                    return;
                }
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            return await response.json();
        } catch (error) {
            if (error.message.includes('401') || error.message.includes('403')) {
                window.location.href = '/login';
                return;
            }
            throw this.handleError(error);
        }
    }

    async delete(endpoint) {
        try {
            const token = localStorage.getItem('token');
            const headers = {
                'Content-Type': 'application/json',
                ...(token ? { 'Authorization': `Bearer ${token}` } : {})
            };
            const response = await fetch(`${BASE_URL}${endpoint}`, {
                method: 'DELETE',
                headers: headers
            });
            if (!response.ok) {
                 if (response.status === 401 || response.status === 403) {
                    window.location.href = '/login';
                    return;
                }
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            return true;
        } catch (error) {
             if (error.message.includes('401') || error.message.includes('403')) {
                window.location.href = '/login';
                return;
            }
            throw this.handleError(error);
        }
    }

    handleError(error) {
        // Aquí puedes personalizar el manejo de errores
        console.error('API Error:', error);
        return error;
    }

    async logout() {
        try {
            const response = await fetch(`${BASE_URL}/auth/logout`, {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                }
            });

            if (!response.ok) {
                 if (response.status === 401 || response.status === 403) {
                    window.location.href = '/login';
                    return;
                }
                throw new Error(`HTTP error! status: ${response.status}`);
            }

            localStorage.removeItem('token');
            localStorage.removeItem('isLoggedIn');
            return true;
        } catch (error) {
             if (error.message.includes('401') || error.message.includes('403')) {
                window.location.href = '/login';
                return;
            }
            throw this.handleError(error);
        }
    }

    async patch(endpoint, data) {
        try {
            const token = localStorage.getItem('token');
            const response = await fetch(`${BASE_URL}${endpoint}`, {
                method: 'PATCH',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify(data),
            });
            if (!response.ok) {
                 if (response.status === 401 || response.status === 403) {
                    window.location.href = '/login';
                    return;
                }
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            return await response.json();
        } catch (error) {
             if (error.message.includes('401') || error.message.includes('403')) {
                window.location.href = '/login';
                return;
            }
            throw this.handleError(error);
        }
    }
}

export const httpService = new HttpService();
