import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';

/**
 * Componente de ruta privada
 * Redirige a /login si el usuario no está autenticado
 */
function PrivateRoute({ children }) {
  const { isAuthenticated, loading } = useAuth();

  // Mostrar loading mientras se verifica la autenticación
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-surface-light dark:bg-background-dark">
        <div className="text-center">
          <span className="material-symbols-outlined animate-spin text-4xl text-gray-400">progress_activity</span>
          <p className="mt-4 text-sm text-gray-500">Verificando autenticación...</p>
        </div>
      </div>
    );
  }

  // Redirigir a login si no está autenticado
  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  // Renderizar children si está autenticado
  return children;
}

export default PrivateRoute;
