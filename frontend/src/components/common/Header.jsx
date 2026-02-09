import { Link } from 'react-router-dom';
import { useTheme } from '../../hooks/useTheme';
import { useConfig } from '../../contexts/ConfigContext';

function Header() {
  const { isDarkMode, toggleDarkMode } = useTheme();
  const { config } = useConfig();

  return (
    <header className="fixed top-0 left-0 w-full z-50 transition-all duration-300 bg-white/95 backdrop-blur-md border-b border-gray-100 dark:bg-black/95 dark:border-gray-800 text-black dark:text-white">
      <div className="container mx-auto px-6 py-1 grid grid-cols-[1fr_auto_1fr] items-center gap-4">
        {/* Left Navigation */}
          <nav className="hidden md:flex justify-start space-x-8 text-base uppercase tracking-widest font-medium text-gray-600 dark:text-gray-300">
          <Link className="hover:text-black dark:hover:text-white transition-colors" to="/">Inicio</Link>
        </nav>
        
        {/* Mobile Menu Button (Visible only on mobile) */}
        <div className="md:hidden justify-self-start">
           <button className="p-2 -ml-2 hover:text-gray-600 dark:hover:text-gray-300">
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
  );
}

export default Header;
