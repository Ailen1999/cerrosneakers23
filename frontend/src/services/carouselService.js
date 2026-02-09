// carouselService.js - Servicio para consumir API de carousel
import axios from '../utils/axiosConfig';

export const carouselService = {
  /**
   * Obtener slides activos para el carousel (customer facing)
   * @returns {Promise<Array>} Lista de slides activos
   */
  async getActiveSlides() {
    try {
      const response = await axios.get('/api/carousel-slides');
      const data = response.data;
      // El backend devuelve { slides: [...], total: N }
      return data.slides || []; // Asegurar que siempre devuelve un array
    } catch (error) {
      console.error('Error fetching active slides:', error);
      // Retornar array vacío para no romper la UI
      return [];
    }
  },

  /**
   * Obtener slide por ID (admin/detalle)
   * @param {number} id 
   */
  async getSlideById(id) {
    try {
      const response = await axios.get(`/api/carousel-slides/${id}`);
      return response.data;
    } catch (error) {
      console.error(`Error fetching slide ${id}:`, error);
      throw error;
    }
  },

  /**
   * Crear nuevo slide (admin)
   * @param {Object} slideData 
   */
  async createSlide(slideData) {
    try {
      const response = await axios.post('/api/carousel-slides', slideData);
      return response.data;
    } catch (error) {
      console.error('Error creating slide:', error);
      throw error;
    }
  },

  /**
   * Actualizar slide existente (admin)
   * @param {number} id 
   * @param {Object} slideData 
   */
  async updateSlide(id, slideData) {
    try {
      const response = await axios.put(`/api/carousel-slides/${id}`, slideData);
      return response.data;
    } catch (error) {
      console.error(`Error updating slide ${id}:`, error);
      throw error;
    }
  },

  /**
   * Eliminar slide (admin)
   * @param {number} id 
   */
  async deleteSlide(id) {
    try {
      await axios.delete(`/api/carousel-slides/${id}`);
      return true;
    } catch (error) {
      console.error(`Error deleting slide ${id}:`, error);
      throw error;
    }
  }
};

export default carouselService;
