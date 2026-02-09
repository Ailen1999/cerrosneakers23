import axios from '../utils/axiosConfig';

export const productService = {
  /**
   * Obtener productos con filtros
   * @param {Object} params 
   */
  async getProducts(params = {}) {
    // Convert frontend 'page' to backend 'offset'
    const limit = params.limit || 10;
    const page = params.page || 1;
    const offset = (page - 1) * limit;

    // Create new params object to exclude 'page' and include 'offset'
    const backendParams = {
      ...params,
      limit, // Ensure limit is explicit
      offset
    };
    
    // Remove page from backend params as it's not used
    delete backendParams.page;

    const response = await axios.get('/api/products', { params: backendParams });
    return response.data;
  },

  async getProduct(id) {
    const response = await axios.get(`/api/products/${id}`);
    return response.data;
  },

  async createProduct(data) {
    const response = await axios.post('/api/products', data);
    return response.data;
  },

  async updateProduct(id, data) {
    const response = await axios.put(`/api/products/${id}`, data);
    return response.data;
  },
  
  async partialUpdateProduct(id, data) {
    const response = await axios.patch(`/api/products/${id}`, data);
    return response.data;
  },

  async deleteProduct(id) {
    await axios.delete(`/api/products/${id}`);
  },

  async bulkDeleteProducts(ids) {
    await axios.post('/api/products/bulk-delete', { ids });
  }
};

export default productService;
