import { useState } from 'react';

function Header({ pageTitle = 'Dashboard' }) {
  const toggleDarkMode = () => {
    document.documentElement.classList.toggle('dark');
  };

  return (
    <header className="h-20 bg-white dark:bg-[#121212] border-b border-border-light dark:border-border-dark flex items-center justify-between px-8 flex-shrink-0 z-10">
      <div className="flex items-center gap-4">
        <button 
          className="md:hidden text-gray-500 hover:text-black dark:hover:text-white"
        >
          <span className="material-symbols-outlined notranslate">menu</span>
        </button>
        <h1 className="font-display text-2xl font-bold text-black dark:text-white">
          {pageTitle}
        </h1>
      </div>

      <div className="flex items-center gap-6">
        {/* Dark Mode Toggle */}
        <button
          onClick={toggleDarkMode}
          className="text-gray-500 hover:text-black dark:hover:text-white transition-colors"
        >
          <span className="material-symbols-outlined notranslate">contrast</span>
        </button>
      </div>
    </header>
  );
}

export default Header;
