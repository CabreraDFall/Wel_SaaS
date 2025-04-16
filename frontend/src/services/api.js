const API_URL = 'http://localhost:3000';

const api = {
  // Products
  getAllProducts: async () => {
    try {
      const response = await fetch(`${API_URL}/products`);
      if (!response.ok) throw new Error('Network response was not ok');
      return await response.json();
    } catch (error) {
      console.error('Error fetching products:', error);
      throw error;
    }
  },

  createProduct: async (productData) => {
    try {
      const response = await fetch(`${API_URL}/products`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(productData),
      });
      if (!response.ok) throw new Error('Network response was not ok');
      return await response.json();
    } catch (error) {
      console.error('Error creating product:', error);
      throw error;
    }
  },

  updateProduct: async (id, productData) => {
    try {
      const response = await fetch(`${API_URL}/products/${id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(productData),
      });
      if (!response.ok) throw new Error('Network response was not ok');
      return await response.json();
    } catch (error) {
      console.error('Error updating product:', error);
      throw error;
    }
  },

  deleteProduct: async (id) => {
    try {
      const response = await fetch(`${API_URL}/products/${id}`, {
        method: 'DELETE',
      });
      if (!response.ok) throw new Error('Network response was not ok');
      return await response.json();
    } catch (error) {
      console.error('Error deleting product:', error);
      throw error;
    }
  },
};

export default api; 