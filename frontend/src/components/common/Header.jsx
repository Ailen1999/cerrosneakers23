import { Link, useNavigate } from 'react-router-dom';
import { useTheme } from '../../hooks/useTheme';
import { useConfig } from '../../contexts/ConfigContext';
import { useState, useRef, useEffect } from 'react';

function Header() {
  const { isDarkMode, toggleDarkMode } = useTheme();
  const { config } = useConfig();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const navigate = useNavigate();
  const menuRef = useRef(null);

  // Close menu when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (menuRef.current && !menuRef.current.contains(event.target) && isMobileMenuOpen) {
        setIsMobileMenuOpen(false);
      }
    };

    if (isMobileMenuOpen) {
      document.addEventListener('mousedown', handleClickOutside);
      document.body.style.overflow = 'hidden';
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
      document.body.style.overflow = 'unset';
    };
  }, [isMobileMenuOpen]);

  const handleCategoryClick = (category, type) => {
    const params = new URLSearchParams();
    if (type === 'category') {
      params.set('category', category);
    } else if (type === 'temporada') {
      params.set('temporada', category);
    }
    navigate(`/?${params.toString()}`);
    setIsMobileMenuOpen(false);
  };

  return (
    <>
      {/* Overlay */}
      {isMobileMenuOpen && (
        <div className="fixed inset-0 bg-black/50 z-40 transition-opacity md:hidden" />
      )}

      {/* Mobile Menu Sidebar */}
      <aside
        ref={menuRef}
        className={`fixed top-0 left-0 h-full w-[300px] max-w-[85vw] bg-white dark:bg-black z-50 transform transition-transform duration-300 ease-in-out flex flex-col md:hidden ${
          isMobileMenuOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-100 dark:border-gray-800">
          <h2 className="text-xl font-bold tracking-wider uppercase font-display text-black dark:text-white">Menú</h2>
          <button onClick={() => setIsMobileMenuOpen(false)} className="p-1 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-full transition-colors">
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
              <path strokeLinecap="round" strokeLinejoin="round" d="M6 18 18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto p-6">
          {/* Categories Section */}
          <div className="mb-8">
            <h3 className="text-[10px] font-bold mb-4 uppercase tracking-widest text-gray-400">Categorías</h3>
            <div className="space-y-2">
              <button
                onClick={() => {
                  navigate('/');
                  setIsMobileMenuOpen(false);
                }}
                className="w-full text-left px-4 py-3 text-sm font-medium uppercase tracking-wider hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors rounded"
              >
                Ver Todo
              </button>
              {[
                { label: 'Calzado', value: 'calzado', type: 'category' },
                { label: 'Indumentaria', value: 'indumentaria', type: 'category' },
                { label: 'Deportes', value: 'deportes', type: 'category' },
              ].map((cat) => (
                <button
                  key={cat.value}
                  onClick={() => handleCategoryClick(cat.value, cat.type)}
                  className="w-full text-left px-4 py-3 text-sm font-medium uppercase tracking-wider hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors rounded"
                >
                  {cat.label}
                </button>
              ))}
            </div>
          </div>

          {/* Seasons Section */}
          <div>
            <h3 className="text-[10px] font-bold mb-4 uppercase tracking-widest text-gray-400">Temporada</h3>
            <div className="space-y-2">
              {[
                { label: 'Invierno', value: 'invierno', type: 'temporada' },
                { label: 'Verano', value: 'verano', type: 'temporada' },
              ].map((season) => (
                <button
                  key={season.value}
                  onClick={() => handleCategoryClick(season.value, season.type)}
                  className="w-full text-left px-4 py-3 text-sm font-medium uppercase tracking-wider hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors rounded"
                >
                  {season.label}
                </button>
              ))}
            </div>
          </div>
        </div>
      </aside>

      <header className="fixed top-0 left-0 w-full z-50 transition-all duration-300 bg-white/95 backdrop-blur-md border-b border-gray-100 dark:bg-black/95 dark:border-gray-800 text-black dark:text-white">
        <div className="container mx-auto px-6 py-1 grid grid-cols-[1fr_auto_1fr] items-center gap-4">
          {/* Left Navigation */}
          <nav className="hidden md:flex justify-start space-x-8 text-base uppercase tracking-widest font-medium text-gray-600 dark:text-gray-300">
            <Link className="hover:text-black dark:hover:text-white transition-colors" to="/">Inicio</Link>
          </nav>
          
          {/* Mobile Menu Button (Visible only on mobile) */}
          <div className="md:hidden justify-self-start">
            <button 
              onClick={() => setIsMobileMenuOpen(true)}
              className="p-2 -ml-2 hover:text-gray-600 dark:hover:text-gray-300"
            >
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
                <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 6.75h16.5M3.75 12h16.5m-16.5 5.25h16.5" />
              </svg>
            </button>
          </div>

          {/* Center Logo */}
          <div className="justify-self-center text-center">
            <Link to="/" className="group block">
              <div className="h-16 flex items-center justify-center transition-all duration-300 group-hover:scale-105">
                <img 
                  src={config?.logo_url || '/logo.png'} 
                  alt={config?.store_name || 'Cerro Sneakers'} 
                  className="h-full w-auto object-contain drop-shadow-md dark:brightness-125" 
                />
              </div>
            </Link>
          </div>

          {/* Right Icons */}
          <div className="flex items-center justify-end space-x-4 md:space-x-6">

            <button 
              className="ml-2 opacity-70 hover:opacity-100 p-1" 
              onClick={toggleDarkMode}
              aria-label="Toggle dark mode"
            >
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5">
                <path strokeLinecap="round" strokeLinejoin="round" d="M21.752 15.002A9.72 9.72 0 0 1 18 15.75c-5.385 0-9.75-4.365-9.75-9.75 0-1.33.266-2.597.748-3.752A9.753 9.753 0 0 0 3 11.25C3 16.635 7.365 21 12.75 21a9.753 9.753 0 0 0 9.002-5.998Z" />
              </svg>
            </button>
          </div>
        </div>
      </header>
    </>
  );
}

export default Header;

