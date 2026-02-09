import axios from '../utils/axiosConfig';

/**
 * Servicio de autenticación
 * Maneja login, logout y almacenamiento de tokens
 */
const authService = {
  /**
   * Inicia sesión con username y password
   * @param {string} username - Username del administrador
   * @param {string} password - Contraseña del administrador
   * @returns {Promise<{token: string, user: object}>} Token JWT y datos del usuario
   */
  login: async (username, password) => {
    try {
      const response = await axios.post('/api/auth/login', {
        username,
        password,
      });
      return response.data;
    } catch (error) {
      if (error.response?.data?.error) {
        throw new Error(error.response.data.error);
      }
      throw new Error('Error al iniciar sesión. Por favor intenta nuevamente.');
    }
  },

  /**
   * Cierra la sesión del usuario
   */
  logout: () => {
    localStorage.removeItem('auth_token');
    localStorage.removeItem('auth_user');
  },

  /**
   * Obtiene el token almacenado
   * @returns {string|null} Token JWT o null si no existe
   */
  getToken: () => {
    return localStorage.getItem('auth_token');
  },

  /**
   * Almacena el token en localStorage
   * @param {string} token - Token JWT a almacenar
   */
  setToken: (token) => {
    localStorage.setItem('auth_token', token);
  },

  /**
   * Obtiene los datos del usuario almacenados
   * @returns {object|null} Datos del usuario o null si no existe
   */
  getUser: () => {
    const userStr = localStorage.getItem('auth_user');
    return userStr ? JSON.parse(userStr) : null;
  },

  /**
   * Almacena los datos del usuario en localStorage
   * @param {object} user - Datos del usuario
   */
  setUser: (user) => {
    localStorage.setItem('auth_user', JSON.stringify(user));
  },

  /**
   * Verifica si el usuario está autenticado
   * @returns {boolean} true si existe un token válido
   */
  isAuthenticated: () => {
    const token = authService.getToken();
    if (!token) return false;

    // Verificar si el token ha expirado
    try {
      const payload = JSON.parse(atob(token.split('.')[1]));
      const expiry = payload.exp * 1000; // Convertir a milisegundos
      return Date.now() < expiry;
    } catch (error) {
      return false;
    }
  },
};

export default authService;
