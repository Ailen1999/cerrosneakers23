import axios from 'axios';

// Configurar URL base desde variables de entorno
const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:8080';

// Crear instancia de axios con configuración base
const axiosInstance = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Interceptor de peticiones: agregar token JWT a todos los requests
axiosInstance.interceptors.request.use(
  (config) => {
    // Acceder directamente a localStorage para evitar importación circular
    const token = localStorage.getItem('auth_token');
    
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Interceptor de respuestas: manejar errores 401 (no autorizado)
axiosInstance.interceptors.response.use(
  (response) => {
    return response;
  },
  (error) => {
    if (error.response?.status === 401) {
      // Token inválido o expirado - limpiar localStorage
      localStorage.removeItem('auth_token');
      localStorage.removeItem('auth_user');
      
      // Redirigir a login si no estamos ya ahí
      if (window.location.pathname !== '/login') {
        window.location.href = '/login';
      }
    }
    
    return Promise.reject(error);
  }
);

export default axiosInstance;
