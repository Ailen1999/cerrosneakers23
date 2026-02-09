import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import authService from '../services/authService';

/**
 * Página de Login para administradores
 * Diseño minimalista y elegante con dark mode
 */
function LoginPage() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const navigate = useNavigate();
  const { login } = useAuth();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    const result = await login(username, password);

    if (result.success) {
      // DEBUG: Verificar que el token se guardó
      console.log('✅ Login exitoso - Token guardado:', {
        hasToken: !!authService.getToken(),
        tokenLength: authService.getToken()?.length,
        user: authService.getUser()
      });
      
      // Pequeño delay para asegurar que el token esté disponible
      await new Promise(resolve => setTimeout(resolve, 100));
      
      // Redirigir al dashboard de admin
      navigate('/admin/products');
    } else {
      setError(result.error);
    }

    setLoading(false);
  };

  return (
    <div className="bg-surface-light dark:bg-background-dark text-gray-900 dark:text-gray-100 font-sans transition-colors duration-300 min-h-screen flex flex-col items-center justify-center relative overflow-hidden">
      {/* Background Pattern */}
      <div className="absolute inset-0 z-0 opacity-[0.03] dark:opacity-[0.1] pointer-events-none bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+PGRlZnM+PHBhdHRlcm4gaWQ9ImdyaWQiIHdpZHRoPSI2MCIgaGVpZ2h0PSI2MCIgcGF0dGVyblVuaXRzPSJ1c2VyU3BhY2VPblVzZSI+PHBhdGggZD0iTSAxMCAwIEwgMCAwIDAgMTAiIGZpbGw9Im5vbmUiIHN0cm9rZT0iYmxhY2siIHN0cm9rZS13aWR0aD0iMSIvPjwvcGF0dGVybj48L2RlZnM+PHJlY3Qgd2lkdGg9IjEwMCUiIGhlaWdodD0iMTAwJSIgZmlsbD0idXJsKCNncmlkKSIvPjwvc3ZnPg==')] bg-cover bg-center grayscale contrast-125"></div>

      {/* Login Card */}
      <div className="w-full max-w-[420px] bg-white dark:bg-surface-dark p-10 md:p-12 shadow-2xl border border-gray-100 dark:border-gray-800 z-10 relative flex flex-col items-center">
        <div className="mb-12 text-center">
          <Link to="/" className="inline-block hover:opacity-80 transition-opacity">
            <img 
              src="/logo.png" 
              alt="Cerro Sneakers" 
              className="h-16 w-auto object-contain invert dark:invert-0" 
            />
          </Link>
          <div className="h-0.5 w-8 bg-black dark:bg-white mx-auto mt-6"></div>
        </div>

        {/* Title */}
        <h1 className="font-display text-2xl font-semibold mb-8 text-center w-full">
          Inicio de Sesión Administrador
        </h1>

        {/* Error Message */}
        {error && (
          <div className="w-full mb-6 p-4 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 text-red-600 dark:text-red-400 text-sm">
            {error}
          </div>
        )}

        {/* Login Form */}
        <form className="w-full space-y-8" onSubmit={handleSubmit}>
          {/* Username Field */}
          <div className="group">
            <label
              className="block text-[10px] uppercase tracking-[0.2em] font-bold text-gray-500 mb-2 group-focus-within:text-black dark:group-focus-within:text-white transition-colors"
              htmlFor="username"
            >
              Usuario Administrador
            </label>
            <input
              className="w-full border-0 border-b border-gray-300 dark:border-gray-700 bg-transparent px-0 py-3 text-sm focus:border-black dark:focus:border-white focus:ring-0 transition-all placeholder-gray-300 dark:placeholder-gray-600"
              id="username"
              placeholder="admin"
              type="text"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              required
              autoComplete="username"
              disabled={loading}
            />
          </div>

          {/* Password Field */}
          <div className="group">
            <label
              className="block text-[10px] uppercase tracking-[0.2em] font-bold text-gray-500 mb-2 group-focus-within:text-black dark:group-focus-within:text-white transition-colors"
              htmlFor="password"
            >
              Contraseña
            </label>
            <div className="relative">
              <input
                className="w-full border-0 border-b border-gray-300 dark:border-gray-700 bg-transparent px-0 py-3 text-sm focus:border-black dark:focus:border-white focus:ring-0 transition-all placeholder-gray-300 dark:placeholder-gray-600 pr-10"
                id="password"
                placeholder="••••••••••••"
                type={showPassword ? 'text' : 'password'}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                autoComplete="current-password"
                disabled={loading}
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-0 bottom-3 text-gray-400 hover:text-black dark:hover:text-white transition-colors"
                disabled={loading}
              >
                <span className="material-symbols-outlined text-sm">
                  {showPassword ? 'visibility_off' : 'visibility'}
                </span>
              </button>
            </div>
          </div>

          {/* Submit Button */}
          <div className="pt-4">
            <button
              className="w-full bg-black dark:bg-white text-white dark:text-black py-4 text-xs font-bold uppercase tracking-[0.25em] hover:bg-gray-800 dark:hover:bg-gray-200 transition-colors duration-300 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
              type="submit"
              disabled={loading}
            >
              {loading ? (
                <span className="flex items-center justify-center gap-2">
                  <span className="material-symbols-outlined animate-spin text-sm">progress_activity</span>
                  <span>Iniciando...</span>
                </span>
              ) : (
                <span>Iniciar Sesión</span>
              )}
            </button>
          </div>
        </form>
      </div>

      {/* Back to Store Link */}
      <Link
        to="/"
        className="absolute bottom-8 text-xs text-gray-400 hover:text-black dark:hover:text-white transition-colors uppercase tracking-widest z-10 flex items-center gap-2"
      >
        <span className="material-symbols-outlined text-sm">arrow_back</span>
        Volver a la tienda
      </Link>

      {/* Dark Mode Toggle */}
      <button
        className="fixed top-6 right-6 opacity-40 hover:opacity-100 transition-opacity z-20 p-2"
        onClick={() => document.documentElement.classList.toggle('dark')}
        aria-label="Toggle dark mode"
      >
        <span className="material-symbols-outlined">contrast</span>
      </button>
    </div>
  );
}

export default LoginPage;
