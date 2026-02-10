import { useState, useEffect, useRef } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import CustomerLayout from '../components/common/CustomerLayout';
import ProductGrid from '../components/home/ProductGrid';
import HeroCarousel from '../components/home/HeroCarousel';
import FeatureCards from '../components/home/FeatureCards';
import FilterSidebar from '../components/home/FilterSidebar';
import productService from '../services/productService';

function HomePage() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  
  // Estado para paginación y filtros
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [filters, setFilters] = useState({ limit: 12, category: [], gender: [], sizes: [], temporada: [] });
  const productsRef = useRef(null);

  const location = useLocation();
  const navigate = useNavigate();

  const [isFilterOpen, setIsFilterOpen] = useState(false);

  const fetchProducts = async () => {
    try {
      setLoading(true);
      setError(null);
      
      const params = { 
        page, 
        ...filters,
        category: filters.category.join(','),
        gender: filters.gender.join(','),
        sizes: filters.sizes.join(','),
        temporada: filters.temporada.join(',')
      };

      const data = await productService.getProducts(params); 
      setProducts(data.products || []);
      setTotalPages(data.totalPages || 1);
    } catch (err) {
      console.error('Error loading products:', err);
      setError(err.message || 'No pudimos cargar los productos. Intenta más tarde.');
    } finally {
      setLoading(false);
    }
  };

  // Sync filters from URL on mount and update
  useEffect(() => {
    const searchParams = new URLSearchParams(location.search);
    const category = searchParams.get('category');
    const gender = searchParams.get('gender');
    const sizes = searchParams.get('sizes');
    const temporada = searchParams.get('temporada');
    const search = searchParams.get('search');
    
    // Check if we need to update state to match URL
    const urlCategory = category ? category.split(',') : [];
    const urlGender = gender ? gender.split(',') : [];
    const urlSizes = sizes ? sizes.split(',') : [];
    const urlTemporada = temporada ? temporada.split(',') : [];
    const urlSearch = search || '';

    const categorySame = JSON.stringify(urlCategory) === JSON.stringify(filters.category);
    const genderSame = JSON.stringify(urlGender) === JSON.stringify(filters.gender);
    const sizesSame = JSON.stringify(urlSizes) === JSON.stringify(filters.sizes);
    const temporadaSame = JSON.stringify(urlTemporada) === JSON.stringify(filters.temporada);
    const searchSame = urlSearch === (filters.search || '');

    if (!categorySame || !genderSame || !sizesSame || !temporadaSame || !searchSame) {
        setFilters(prev => ({
            ...prev,
            category: urlCategory,
            gender: urlGender,
            sizes: urlSizes,
            temporada: urlTemporada,
            search: urlSearch
        }));
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [location.search]);

  // Clear size filters when switching between incompatible categories (calzado <-> indumentaria)
  useEffect(() => {
    const hasCalzado = filters.category.includes('calzado');
    const hasIndumentaria = filters.category.includes('indumentaria');
    
    // Only clear if we're switching between the two incompatible categories
    // and there are size filters active
    if (filters.sizes.length > 0 && ((hasCalzado && !hasIndumentaria) || (!hasCalzado && hasIndumentaria))) {
      // Check if current sizes are incompatible with the category
      const shoeSizes = ['35', '36', '37', '38', '39', '40', '41', '42', '43', '44', '45'];
      const clothingSizes = ['XS', 'S', 'M', 'L', 'XL', 'XXL'];
      
      const hasShoeSize = filters.sizes.some(size => shoeSizes.includes(size));
      const hasClothingSize = filters.sizes.some(size => clothingSizes.includes(size));
      
      // If calzado is selected but we have clothing sizes, or vice versa, clear sizes
      if ((hasCalzado && hasClothingSize) || (hasIndumentaria && hasShoeSize)) {
        setFilters(prev => ({ ...prev, sizes: [] }));
      }
    }
  }, [filters.category]); // Only run when category changes

  useEffect(() => {
    fetchProducts();
    
    // Update URL when filters change
    const params = new URLSearchParams();
    if (filters.category.length > 0) params.set('category', filters.category.join(','));
    if (filters.gender.length > 0) params.set('gender', filters.gender.join(','));
    if (filters.sizes.length > 0) params.set('sizes', filters.sizes.join(','));
    if (filters.temporada.length > 0) params.set('temporada', filters.temporada.join(','));
    if (filters.search) params.set('search', filters.search);
    if (filters.sort && filters.sort !== 'newest') params.set('sort', filters.sort);
    
    const newSearch = params.toString();
    if (newSearch !== location.search.substring(1)) {
        navigate({ search: newSearch }, { replace: true });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [page, filters]);

  const handleSearch = (e) => {
    if (e.key === 'Enter') {
      handleFilterChange({ search: e.target.value });
    }
  };

  const handleFilterChange = (newFilters) => {
    setFilters(prev => ({ ...prev, ...newFilters }));
    setPage(1); 
  };
  
  const handleClearFilters = () => {
    setFilters({ limit: 12, sort: 'newest', category: [], gender: [], sizes: [], temporada: [], search: '' });
    setPage(1);
  };

  const handlePageChange = (newPage) => {
    if (newPage >= 1 && newPage <= totalPages) {
      setPage(newPage);
      
      if (productsRef.current) {
        const headerOffset = 100;
        const elementPosition = productsRef.current.getBoundingClientRect().top;
        const offsetPosition = elementPosition + window.pageYOffset - headerOffset;

        window.scrollTo({
          top: offsetPosition,
          behavior: 'smooth'
        });
      }
    }
  };

  return (
    <CustomerLayout>
      <HeroCarousel />
      
      {/* Product Grid Section */}
      <main ref={productsRef} className="container mx-auto px-6 py-20">
        <div className="mb-12">
          
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-8 mb-8">
            <h2 className="font-display text-4xl font-semibold dark:text-white uppercase tracking-tight">
                {filters.category.length > 0 || filters. temporada.length > 0 ? [...filters.category, ...filters.temporada].join(' + ').toUpperCase() : 'CERRO SNEAKERS'}
            </h2>
            
            {/* Search Bar */}
            <div className="w-full md:w-auto md:min-w-[300px] relative group">
                <input 
                type="text"
                placeholder="BUSCAR PRODUCTOS"
                className="w-full border-b border-gray-300 dark:border-gray-700 focus:border-black dark:focus:border-white bg-transparent py-2 pl-2 pr-8 focus:outline-none placeholder-gray-400 text-xs uppercase tracking-widest transition-colors dark:text-white"
                defaultValue={filters.search || ''}
                key={filters.search} // Force re-render when search changes
                onKeyDown={handleSearch}
                />
                <span className="absolute right-0 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-black dark:group-focus-within:text-white transition-colors">
                <span className="material-symbols-outlined text-lg">search</span>
                </span>
            </div>
          </div>

          {/* Filter Bar Row */}
          <div className="flex items-center border-t border-b border-gray-100 py-6 relative">
            <div className="flex-1 hidden md:block"></div> {/* Spacer to help centering */}
            
            <nav className="hidden md:flex items-center gap-8 overflow-x-auto no-scrollbar mx-auto">
              {[
                { label: 'VER TODO', value: '', type: 'all' },
                { label: 'CALZADO', value: 'calzado', type: 'category' },
                { label: 'INDUMENTARIA', value: 'indumentaria', type: 'category' },
                { label: 'DEPORTES', value: 'deportes', type: 'category' },
                { label: 'INVIERNO', value: 'invierno', type: 'temporada' },
                { label: 'VERANO', value: 'verano', type: 'temporada' }
              ].map((cat) => (
                <button
                  key={cat.value}
                  onClick={() => {
                    if (cat.type === 'all') {
                      handleClearFilters();
                    } else if (cat.type === 'category') {
                      // Single select for category
                      handleFilterChange({ category: [cat.value], temporada: [] });
                    } else if (cat.type === 'temporada') {
                      // Single select for temporada
                      handleFilterChange({ temporada: [cat.value], category: [] });
                    }
                  }}
                  className={`text-sm font-medium tracking-tight transition-colors hover:text-black dark:hover:text-white whitespace-nowrap ${
                    (cat.type === 'all' && filters.category.length === 0 && filters.temporada.length === 0) || 
                    (cat.type === 'category' && filters.category.includes(cat.value)) ||
                    (cat.type === 'temporada' && filters.temporada.includes(cat.value))
                      ? 'text-black dark:text-white font-bold border-b border-black dark:border-white' 
                      : 'text-gray-600 dark:text-gray-400'
                  }`}
                >
                  {cat.label}
                </button>
              ))}
            </nav>

            <div className="flex-1 flex justify-end">
              <button 
                onClick={() => setIsFilterOpen(true)}
                className="flex items-center gap-3 px-6 py-3 border border-black dark:border-white text-sm font-bold uppercase tracking-widest hover:bg-black hover:text-white dark:hover:bg-white dark:hover:text-black transition-all"
              >
                <span>Filtrar y Ordenar</span>
                <span className="material-symbols-outlined text-lg">tune</span>
              </button>
            </div>
          </div>

        </div>

        <FilterSidebar 
            isOpen={isFilterOpen}
            onClose={() => setIsFilterOpen(false)}
            filters={filters}
            onFilterChange={handleFilterChange}
            onClearFilters={handleClearFilters}
            totalResults={products.length}
        />

        {/* Loading State */}
        {loading && (
          <div className="flex justify-center items-center py-20">
            <div className="text-center">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-black dark:border-white mx-auto mb-4"></div>
              <p className="text-gray-500 dark:text-gray-400">Cargando productos...</p>
            </div>
          </div>
        )}

        {/* Error State */}
        {error && !loading && (
          <div className="text-center py-20">
            <p className="text-red-600 dark:text-red-400 mb-4">{error}</p>
            <button
              onClick={fetchProducts}
              className="bg-black dark:bg-white text-white dark:text-black px-6 py-3 text-sm uppercase tracking-widest font-bold hover:opacity-80 transition-opacity"
            >
              Reintentar
            </button>
          </div>
        )}

        {/* Empty State */}
        {!loading && !error && products.length === 0 && (
          <div className="text-center py-20">
            <p className="text-gray-500 dark:text-gray-400 text-lg mb-4">
              {filters.search || filters.gender.length > 0 || filters.category.length > 0 || filters.temporada.length > 0 ? 'No se encontraron productos con estos filtros' : 'Próximamente nuevos productos'}
            </p>
            {(filters.search || filters.gender.length > 0 || filters.category.length > 0 || filters.temporada.length > 0) && (
                <button
                onClick={() => handleFilterChange({ search: '', gender: '' })}
                className="mt-4 text-sm underline hover:text-black dark:hover:text-white transition-colors"
                >
                Ver todos los productos
                </button>
            )}
          </div>
        )}

        {/* Products Grid */}
        {!loading && !error && products.length > 0 && (
          <ProductGrid products={products} />
        )}

        {/* Pagination */}
        {!loading && !error && totalPages > 1 && (
          <div className="flex justify-center items-center gap-6 mt-16">
            <button 
              onClick={() => handlePageChange(page - 1)}
              disabled={page === 1}
              className="p-3 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-full disabled:opacity-30 disabled:cursor-not-allowed transition-colors text-black dark:text-white"
              aria-label="Página anterior"
            >
              <span className="material-symbols-outlined">chevron_left</span>
            </button>
            
            <span className="text-xs uppercase tracking-widest font-bold text-gray-500 dark:text-gray-400">
              Página <span className="text-black dark:text-white mx-1">{page}</span> de <span className="text-black dark:text-white mx-1">{totalPages}</span>
            </span>

            <button 
              onClick={() => handlePageChange(page + 1)}
              disabled={page === totalPages}
              className="p-3 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-full disabled:opacity-30 disabled:cursor-not-allowed transition-colors text-black dark:text-white"
              aria-label="Página siguiente"
            >
              <span className="material-symbols-outlined">chevron_right</span>
            </button>
          </div>
        )}
      </main>


    </CustomerLayout>
  );
}

export default HomePage;

