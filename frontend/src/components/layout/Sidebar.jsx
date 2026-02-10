import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import { useConfig } from '../../contexts/ConfigContext';

function Sidebar({ isOpen, onClose }) {
  const location = useLocation();
  const navigate = useNavigate();
  const { user, logout } = useAuth();
  const { config } = useConfig();

  const isActive = (path) => location.pathname === path;

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <>
      {/* Mobile Overlay */}
      {isOpen && (
        <div 
          className="fixed inset-0 bg-black/50 z-40 md:hidden"
          onClick={onClose}
        />
      )}

      {/* Sidebar */}
      <aside className={`
        w-72 bg-black text-white flex-shrink-0 flex flex-col h-full border-r border-gray-800
        fixed md:relative z-50
        transition-transform duration-300 ease-in-out
        ${isOpen ? 'translate-x-0' : '-translate-x-full md:translate-x-0'}
      `}>
      {/* Header */}
      <div className="h-20 flex items-center justify-between px-8 border-b border-gray-800">
        <a href="/" target="_blank" rel="noopener noreferrer" className="flex items-center gap-3 group">
          {config?.logo_url ? (
            <img 
              src={config.logo_url} 
              alt={config.store_name} 
              className="h-10 w-auto object-contain transition-transform group-hover:scale-105" 
            />
          ) : (
            <span className="text-xl font-bold">{config?.store_name || 'Tienda'}</span>
          )}
          <span className="text-gray-500 text-[10px] font-sans tracking-[0.2em] uppercase mt-2">ADMIN</span>
        </a>
        {/* Close button for mobile */}
        <button 
          onClick={onClose}
          className="md:hidden text-gray-400 hover:text-white"
        >
          <span className="material-symbols-outlined notranslate">close</span>
        </button>
      </div>

      {/* Navigation */}
      <nav className="flex-1 py-8 px-4 space-y-1 overflow-y-auto">
        <p className="px-4 text-[10px] uppercase tracking-[0.2em] text-gray-500 font-bold mb-4">
          Principal
        </p>
        
        <Link
          to="/admin"
          className={`flex items-center gap-4 px-4 py-3 transition-all rounded-sm group ${
            isActive('/') || isActive('/admin')
              ? 'text-white bg-white/10 border-l-2 border-white'
              : 'text-gray-400 hover:text-white hover:bg-white/10'
          }`}
        >
          <span className="material-symbols-outlined notranslate text-[20px] group-hover:scale-110 transition-transform">
            dashboard
          </span>
          <span className="text-sm font-medium tracking-wide">Dashboard</span>
        </Link>

        <Link
          to="/admin/products"
          className={`flex items-center gap-4 px-4 py-3 transition-all rounded-sm ${
            isActive('/admin/products') || location.pathname.startsWith('/admin/products')
              ? 'text-white bg-white/10 border-l-2 border-white'
              : 'text-gray-400 hover:text-white hover:bg-white/10'
          }`}
        >
          <span className="material-symbols-outlined notranslate text-[20px]">checkroom</span>
          <span className="text-sm font-medium tracking-wide">Productos</span>
        </Link>
        
        <Link
          to="/admin/carousel"
          className={`flex items-center gap-4 px-4 py-3 transition-all rounded-sm ${
            isActive('/admin/carousel') || location.pathname.startsWith('/admin/carousel')
              ? 'text-white bg-white/10 border-l-2 border-white'
              : 'text-gray-400 hover:text-white hover:bg-white/10'
          }`}
        >
          <span className="material-symbols-outlined notranslate text-[20px]">view_carousel</span>
          <span className="text-sm font-medium tracking-wide">Carousel</span>
        </Link>

        <Link
          to="/admin/orders"
          className={`flex items-center gap-4 px-4 py-3 transition-all rounded-sm group ${
            isActive('/admin/orders')
              ? 'text-white bg-white/10 border-l-2 border-white'
              : 'text-gray-400 hover:text-white hover:bg-white/10'
          }`}
        >
          <span className="material-symbols-outlined notranslate text-[20px] group-hover:scale-110 transition-transform">
            shopping_bag
          </span>
          <span className="text-sm font-medium tracking-wide">Pedidos</span>

        </Link>



        <div className="my-6 border-t border-gray-800"></div>

        <p className="px-4 text-[10px] uppercase tracking-[0.2em] text-gray-500 font-bold mb-4">
          Sistema
        </p>

        <Link
          to="/admin/config"
          className={`flex items-center gap-4 px-4 py-3 transition-all rounded-sm group ${
            isActive('/admin/config')
              ? 'text-white bg-white/10 border-l-2 border-white'
              : 'text-gray-400 hover:text-white hover:bg-white/10'
          }`}
        >
          <span className="material-symbols-outlined notranslate text-[20px] group-hover:scale-110 transition-transform">
            settings
          </span>
          <span className="text-sm font-medium tracking-wide">Configuración</span>
        </Link>
      </nav>

      {/* User Profile with Logout */}
      <div className="p-4 border-t border-gray-800 bg-black">
        <button 
          onClick={handleLogout}
          className="w-full flex items-center gap-3 p-2 rounded-sm hover:bg-white/5 cursor-pointer transition-colors group"
        >
          <div className="h-10 w-10 rounded-full bg-gray-700 flex items-center justify-center text-white font-display font-bold notranslate">
            {user?.username?.substring(0, 2).toUpperCase() || 'AD'}
          </div>
          <div className="flex-1 text-left">
            <p className="text-sm font-medium text-white">{user?.username || 'Admin'}</p>
            <p className="text-xs text-gray-500">Cerrar sesión</p>
          </div>
          <span className="material-symbols-outlined ml-auto text-gray-500 group-hover:text-white transition-colors notranslate">logout</span>
        </button>
      </div>
    </aside>
    </>
  );
}

export default Sidebar;
