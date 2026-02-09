import axios from '../utils/axiosConfig';

export const orderService = {
  /**
   * Obtener pedidos con filtros y paginación
   * @param {Object} params - { page, limit, status, search }
   */
  async getOrders(params = {}) {
    const response = await axios.get('/api/orders', { params });
    return response.data;
  },

  /**
   * Obtener un pedido por ID
   * @param {number} id 
   */
  async getOrderById(id) {
    const response = await axios.get(`/api/orders/${id}`);
    return response.data;
  },

  /**
   * Crear un nuevo pedido
   * @param {Object} orderData 
   */
  async createOrder(orderData) {
    const response = await axios.post('/api/orders', orderData);
    return response.data;
  },

  /**
   * Actualizar estado del pedido
   * @param {number} id 
   * @param {string} status 
   */
  async updateStatus(id, status) {
    const response = await axios.patch(`/api/orders/${id}/status`, { status });
    return response.data;
  },

  /**
   * Actualizar datos del pedido
   * @param {number} id
   * @param {Object} data 
   */
  async updateOrder(id, data) {
    const response = await axios.put(`/api/orders/${id}`, data);
    return response.data;
  },

  /**
   * Eliminar un pedido
   * @param {number} id
   */
  async deleteOrder(id) {
    const response = await axios.delete(`/api/orders/${id}`);
    return response.data;
  }
};
