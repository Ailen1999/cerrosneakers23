import React, { createContext, useContext, useState, useEffect } from 'react';
import authService from '../services/authService';

const AuthContext = createContext(null);

/**
 * Proveedor de contexto de autenticación
 * Maneja el estado de autenticación global de la aplicación
 */
export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  // Inicializar desde localStorage al montar
  useEffect(() => {
    const initAuth = () => {
      if (authService.isAuthenticated()) {
        const storedUser = authService.getUser();
        setUser(storedUser);
      }
      setLoading(false);
    };

    initAuth();
  }, []);

  // Verificar periodicamente si el token ha expirado
  useEffect(() => {
    const checkTokenValidity = () => {
      if (user && !authService.isAuthenticated()) {
        // Token expirado, cerrar sesión automáticamente
        logout();
      }
    };

    // Verificar cada 5 minutos
    const interval = setInterval(checkTokenValidity, 5 * 60 * 1000);

    return () => clearInterval(interval);
  }, [user]);

  /**
   * Inicia sesión con username y password
   */
  const login = async (username, password) => {
    try {
      const response = await authService.login(username, password);
      
      // Guardar token y usuario
      authService.setToken(response.token);
      authService.setUser(response.user);
      setUser(response.user);

      return { success: true };
    } catch (error) {
      return {
        success: false,
        error: error.message || 'Error al iniciar sesión',
      };
    }
  };

  /**
   * Cierra la sesión del usuario
   */
  const logout = () => {
    authService.logout();
    setUser(null);
  };

  const value = {
    user,
    login,
    logout,
    isAuthenticated: !!user && authService.isAuthenticated(),
    loading,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

/**
 * Hook para usar el contexto de autenticación
 */
export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth debe ser usado dentro de un AuthProvider');
  }
  return context;
};

export default AuthContext;
