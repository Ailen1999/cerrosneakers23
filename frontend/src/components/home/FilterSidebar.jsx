import { useRef, useEffect } from 'react';

function FilterSidebar({ 
  isOpen, 
  onClose, 
  filters, 
  onFilterChange, 
  onClearFilters,
  totalResults 
}) {
  const sidebarRef = useRef(null);

  // Close when clicking outside on mobile/overlay
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (sidebarRef.current && !sidebarRef.current.contains(event.target) && isOpen) {
        onClose();
      }
    };

    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside);
      // Prevent body scroll when sidebar is open
      document.body.style.overflow = 'hidden';
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
      document.body.style.overflow = 'unset';
    };
  }, [isOpen, onClose]);

  const handleSortChange = (value) => {
    onFilterChange({ sort: value });
  };

  const handleGenderChange = (value) => {
    // If clicking the already selected gender, deselect it (toggle behavior)
    if (filters.gender.includes(value)) {
        onFilterChange({ gender: [] });
    } else {
        onFilterChange({ gender: [value] });
    }
  };

  const handleSizeChange = (value) => {
    const isSelected = filters.sizes.includes(value);
    const newSizes = isSelected 
      ? filters.sizes.filter(s => s !== value)
      : [...filters.sizes, value];
    onFilterChange({ sizes: newSizes });
  };

  const shoeSizes = ['35', '36', '37', '38', '39', '40', '41', '42', '43', '44', '45'];
  const clothingSizes = ['XS', 'S', 'M', 'L', 'XL', 'XXL'];

  const hasCalzado = filters.category.includes('calzado');
  const hasIndumentaria = filters.category.includes('indumentaria');

  return (
    <>
      {/* Overlay */}
      {isOpen && (
        <div className="fixed inset-0 bg-black/50 z-40 transition-opacity" />
      )}

      {/* Sidebar */}
      <aside 
        ref={sidebarRef}
        className={`fixed top-0 right-0 h-full w-[400px] max-w-[85vw] bg-white z-50 transform transition-transform duration-300 ease-in-out flex flex-col ${
          isOpen ? 'translate-x-0' : 'translate-x-full'
        }`}
      >
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-100">
          <h2 className="text-xl font-bold tracking-wider uppercase font-display text-black">Filtrar y Ordenar</h2>
          <div className="flex items-center gap-4">
            <button 
              onClick={onClearFilters}
              className="text-sm font-medium underline text-black hover:text-gray-600 transition-colors"
            >
              Borrar todo
            </button>
            <button onClick={onClose} className="p-1 hover:bg-gray-100 rounded-full transition-colors">
              <span className="material-symbols-outlined text-2xl">close</span>
            </button>
          </div>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto p-6 space-y-8">
          
          {/* Active Filters Display */}
          {(filters.category.length > 0 || filters.temporada.length > 0 || filters.gender.length > 0 || filters.sizes.length > 0) && (
             <div className="mb-6">
                <h3 className="text-[10px] font-bold mb-3 uppercase tracking-widest text-gray-400">Filtros aplicados</h3>
                <div className="flex flex-wrap gap-2">
                    {filters.category.map(cat => (
                        <span key={cat} className="inline-flex items-center gap-2 px-3 py-1.5 bg-black text-white rounded-sm text-[10px] font-bold uppercase tracking-wider">
                            <span onClick={() => onFilterChange({ category: filters.category.filter(c => c !== cat) })} className="cursor-pointer material-symbols-outlined text-xs">close</span>
                            {cat}
                        </span>
                    ))}
                    {filters.temporada.map(temp => (
                        <span key={temp} className="inline-flex items-center gap-2 px-3 py-1.5 bg-black text-white rounded-sm text-[10px] font-bold uppercase tracking-wider">
                            <span onClick={() => onFilterChange({ temporada: filters.temporada.filter(t => t !== temp) })} className="cursor-pointer material-symbols-outlined text-xs">close</span>
                            {temp}
                        </span>
                    ))}
                    {filters.gender.map(gen => {
                        const genderLabels = {
                            'mujer': 'Mujer',
                            'hombre': 'Hombre',
                            'unisex': 'Unisex',
                            'nino': 'Niños'
                        };
                        return (
                            <span key={gen} className="inline-flex items-center gap-2 px-3 py-1.5 bg-black text-white rounded-sm text-[10px] font-bold uppercase tracking-wider">
                                <span onClick={() => onFilterChange({ gender: [] })} className="cursor-pointer material-symbols-outlined text-xs">close</span>
                                {genderLabels[gen] || gen}
                            </span>
                        );
                    })}
                    {filters.sizes.map(size => (
                        <span key={size} className="inline-flex items-center gap-2 px-3 py-1.5 bg-black text-white rounded-sm text-[10px] font-bold uppercase tracking-wider">
                             <span onClick={() => handleSizeChange(size)} className="cursor-pointer material-symbols-outlined text-xs">close</span>
                             Talle: {size}
                        </span>
                    ))}
                </div>
             </div>
          )}


          {/* Sort Section */}
          <div>
            <div className="flex items-center justify-between mb-4 group cursor-pointer">
              <h3 className="text-base font-bold text-black uppercase tracking-widest text-xs">Ordenar por</h3>
              <span className="material-symbols-outlined transform rotate-180 text-gray-400">expand_more</span> 
            </div>
            
            <div className="space-y-4 pl-1">
              {[
                { label: 'Precio (de menor a mayor)', value: 'price_asc' },
                { label: 'Precio (de mayor a menor)', value: 'price_desc' },
              ].map((option) => (
                <label key={option.value} className="flex items-center gap-3 cursor-pointer group">
                  <input 
                    type="radio" 
                    name="sort" 
                    checked={filters.sort === option.value}
                    onChange={() => onFilterChange({ sort: option.value })}
                    className="w-6 h-6 border-[1.5px] border-gray-300 rounded-full checked:border-black checked:bg-white focus:ring-0 cursor-pointer appearance-none relative checked:after:content-[''] checked:after:absolute checked:after:w-3 checked:after:h-3 checked:after:bg-black checked:after:rounded-full checked:after:top-1/2 checked:after:left-1/2 checked:after:-translate-x-1/2 checked:after:-translate-y-1/2 transition-all"
                  />
                  <span className={`text-sm tracking-tight transition-colors ${filters.sort === option.value ? 'font-bold text-black' : 'text-gray-600 group-hover:text-black'}`}>
                    {option.label}
                  </span>
                </label>
              ))}
            </div>
          </div>

          <hr className="border-gray-100" />

          {/* Category Section */}
          <div>
            <div className="flex items-center justify-between mb-4 group cursor-pointer">
              <h3 className="text-base font-bold text-black uppercase tracking-widest text-xs">Categoría</h3>
              <span className="material-symbols-outlined transform rotate-180 text-gray-400">expand_more</span>
            </div>
            
            <div className="space-y-4 pl-1">
              {[
                { label: 'Calzado', value: 'calzado' },
                { label: 'Indumentaria', value: 'indumentaria' },
                { label: 'Deportes', value: 'deportes' },
              ].map((option) => (
                <label key={option.value} className="flex items-center gap-3 cursor-pointer group">
                  <input 
                    type="radio" 
                    name="category" 
                    checked={filters.category.includes(option.value)}
                    onChange={() => {
                      if (filters.category.includes(option.value)) {
                        onFilterChange({ category: [], temporada: [] });
                      } else {
                        onFilterChange({ category: [option.value], temporada: [] });
                      }
                    }}
                    className="w-6 h-6 border-[1.5px] border-gray-300 rounded-full checked:border-black checked:bg-white focus:ring-0 cursor-pointer appearance-none relative checked:after:content-[''] checked:after:absolute checked:after:w-3 checked:after:h-3 checked:after:bg-black checked:after:rounded-full checked:after:top-1/2 checked:after:left-1/2 checked:after:-translate-x-1/2 checked:after:-translate-y-1/2 transition-all"
                  />
                  <span className={`text-sm tracking-tight transition-colors ${filters.category.includes(option.value) ? 'font-bold text-black' : 'text-gray-600 group-hover:text-black'}`}>
                    {option.label}
                  </span>
                </label>
              ))}
            </div>
          </div>

          <hr className="border-gray-100" />

          {/* Season Section */}
          <div>
            <div className="flex items-center justify-between mb-4 group cursor-pointer">
              <h3 className="text-base font-bold text-black uppercase tracking-widest text-xs">Temporada</h3>
              <span className="material-symbols-outlined transform rotate-180 text-gray-400">expand_more</span>
            </div>
            
            <div className="space-y-4 pl-1">
              {[
                { label: 'Invierno', value: 'invierno' },
                { label: 'Verano', value: 'verano' },
              ].map((option) => (
                <label key={option.value} className="flex items-center gap-3 cursor-pointer group">
                  <input 
                    type="radio" 
                    name="temporada" 
                    checked={filters.temporada.includes(option.value)}
                    onChange={() => {
                      if (filters.temporada.includes(option.value)) {
                        onFilterChange({ temporada: [], category: [] });
                      } else {
                        onFilterChange({ temporada: [option.value], category: [] });
                      }
                    }}
                    className="w-6 h-6 border-[1.5px] border-gray-300 rounded-full checked:border-black checked:bg-white focus:ring-0 cursor-pointer appearance-none relative checked:after:content-[''] checked:after:absolute checked:after:w-3 checked:after:h-3 checked:after:bg-black checked:after:rounded-full checked:after:top-1/2 checked:after:left-1/2 checked:after:-translate-x-1/2 checked:after:-translate-y-1/2 transition-all"
                  />
                  <span className={`text-sm tracking-tight transition-colors ${filters.temporada.includes(option.value) ? 'font-bold text-black' : 'text-gray-600 group-hover:text-black'}`}>
                    {option.label}
                  </span>
                </label>
              ))}
            </div>
          </div>

          <hr className="border-gray-100" />

          {/* Sizes Section */}
          {(hasCalzado || hasIndumentaria) && (
            <div>
              <div className="flex items-center justify-between mb-4 group cursor-pointer">
                 <h3 className="text-base font-bold text-black uppercase tracking-widest text-xs">Talles</h3>
                 <span className="material-symbols-outlined transform rotate-180 text-gray-400">expand_more</span>
              </div>
              
              <div className="flex flex-wrap gap-2 pl-1">
                  {(hasCalzado ? shoeSizes : clothingSizes).map((size) => (
                      <button
                        key={size}
                        onClick={() => handleSizeChange(size)}
                        className={`min-w-[44px] h-11 border-[1.5px] text-xs font-bold transition-all uppercase tracking-tight
                          ${filters.sizes.includes(size) 
                            ? 'bg-black border-black text-white' 
                            : 'bg-white border-gray-200 text-gray-500 hover:border-black hover:text-black'}`}
                      >
                        {size}
                      </button>
                  ))}
              </div>
            </div>
          )}

          <hr className="border-gray-100" />

          {/* Gender Section */}
          <div>
            <div className="flex items-center justify-between mb-4 group cursor-pointer">
               <h3 className="text-base font-bold text-black uppercase tracking-widest text-xs">Sexo</h3>
               <span className="material-symbols-outlined transform rotate-180 text-gray-400">expand_more</span>
            </div>
            
            <div className="space-y-4 pl-1">
                {[
                    { label: 'Mujer', value: 'mujer' },
                    { label: 'Hombre', value: 'hombre' },
                    { label: 'Unisex', value: 'unisex' },
                    { label: 'Niños', value: 'nino' },
                ].map((option) => (
                    <label key={option.value} className="flex items-center gap-3 cursor-pointer group">
                      <input 
                        type="radio" 
                        name="gender" 
                        checked={filters.gender.includes(option.value)}
                        onClick={() => handleGenderChange(option.value)} // Use onClick for better toggle support
                        onChange={() => {}} // Controlled input requires onChange, but logic is in onClick
                        className="w-6 h-6 border-[1.5px] border-gray-300 rounded-full checked:border-black checked:bg-white focus:ring-0 cursor-pointer appearance-none relative checked:after:content-[''] checked:after:absolute checked:after:w-3 checked:after:h-3 checked:after:bg-black checked:after:rounded-full checked:after:top-1/2 checked:after:left-1/2 checked:after:-translate-x-1/2 checked:after:-translate-y-1/2 transition-all"
                      />
                      <span className={`text-sm tracking-tight transition-colors ${filters.gender.includes(option.value) ? 'font-bold text-black' : 'text-gray-600 group-hover:text-black'}`}>
                        {option.label}
                      </span>
                    </label>
                ))}
            </div>
          </div>

        </div>

        {/* Footer */}
        <div className="p-6 border-t border-gray-100 bg-white">
          <div className="flex items-center justify-between mb-4">
             <span className="text-sm font-bold">{totalResults} artículos encontrados</span>
          </div>
          <button 
            onClick={onClose}
            className="w-full bg-black text-white font-bold uppercase tracking-widest py-4 hover:bg-gray-800 transition-colors flex items-center justify-between px-6"
          >
            <span>Aplicar</span>
            <span className="material-symbols-outlined">arrow_forward</span>
          </button>
        </div>
      </aside>
    </>
  );
}

export default FilterSidebar;
