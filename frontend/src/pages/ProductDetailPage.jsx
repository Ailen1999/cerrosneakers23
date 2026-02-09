import { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import CustomerLayout from '../components/common/CustomerLayout';
import ImageLightbox from '../components/shared/ImageLightbox';
import { openWhatsApp } from '../utils/whatsappHelpers';
import productService from '../services/productService';
import { formatPrice } from '../utils/formatters';
import { useConfig } from '../contexts/ConfigContext';
import { getStandardSizes, isSizeAvailable } from '../utils/productHelpers';
import SizeGuideModal from '../components/shared/SizeGuideModal';
import { getImageUrl } from '../utils/imageUtils';

function ProductDetailPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { config } = useConfig();
  const [product, setProduct] = useState(null);
  const [relatedProducts, setRelatedProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Estados para selección (visual)
  const [selectedSize, setSelectedSize] = useState(null);
  const [selectedColor, setSelectedColor] = useState(null);
  
  // Estados para lightbox
  const [lightboxOpen, setLightboxOpen] = useState(false);
  const [lightboxIndex, setLightboxIndex] = useState(0);

  // Estado para guía de talles
  const [sizeGuideOpen, setSizeGuideOpen] = useState(false);

  useEffect(() => {
    loadProduct();
  }, [id]);

  const loadProduct = async () => {
    try {
      setLoading(true);
      setError(null);
      // Cargar producto principal
      const data = await productService.getProduct(id);
      
      if (!data) {
        // Product not found in backend
        throw new Error(`Producto no encontrado (ID: ${id})`);
      }
      setProduct(data);

      // Cargar productos relacionados
      const relatedData = await productService.getProducts({ limit: 4 });
      setRelatedProducts(relatedData.products ? relatedData.products.filter(p => p.id !== data.id).slice(0, 4) : []);

      // Pre-seleccionar primera opción si existe
      if (data.tallas && data.tallas.length > 0) setSelectedSize(data.tallas[0]);
      if (data.colores && data.colores.length > 0) setSelectedColor(data.colores[0]);

    } catch (err) {
      console.error('Error loading product:', err);
      // No redirigir a 404 para poder ver el error
      // navigate('/404');
      setError(err.message || 'No pudimos cargar el producto.');
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <CustomerLayout>
        <div className="container mx-auto px-6 py-32 flex justify-center items-center min-h-screen">
          <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-black dark:border-white"></div>
        </div>
      </CustomerLayout>
    );
  }

  if (error) {
    return (
      <CustomerLayout>
        <div className="container mx-auto px-6 py-32 text-center min-h-screen flex flex-col items-center justify-center">
          <h2 className="text-2xl font-bold mb-4 text-red-600">Error al cargar producto</h2>
          <p className="mb-6 text-gray-600">{error}</p>
          <p className="text-xs text-gray-400 mb-8 font-mono">ID Solicitado: {id}</p>
          <Link to="/" className="bg-black text-white px-6 py-3 text-sm font-bold uppercase tracking-widest hover:opacity-80">
            Volver a la tienda
          </Link>
        </div>
      </CustomerLayout>
    );
  }

  if (!product) return null;

  const images = (product.imagenes || []).map(img => getImageUrl(img));
  const mainImage = images.length > 0 ? images[0] : null;
  const secondaryImages = images.slice(1, 3); // Tomar siguientes 2 imágenes

  // SANITIZATION: Force consistency between global stock and size stock
  // If the product has size configurations, the total stock MUST match the sum of sizes (or 0 if empty)
  // This fixes "Ghost Stock" where database says stock > 0 but no sizes have stock.
  const displayProduct = { ...product };
  if (product.tallas && product.tallas.length > 0) {
      // Default to empty object if null/undefined, and force numeric sum
      const stockMap = product.stock_by_size || {};
      const derivedStock = Object.values(stockMap).reduce((a, b) => a + (parseInt(b) || 0), 0);
      displayProduct.stock = derivedStock;
      
      // Ensure we use the sanitized map for availability checks downstream
      displayProduct.stock_by_size = stockMap;
  }

  const isOutOfStock = displayProduct.stock <= 0;

  // Calculate surcharge
  const surchargePercentage = config?.credit_card_surcharge || 15; // Default to 15% if not set
  const surchargeMultiplier = 1 + (surchargePercentage / 100);

  return (
    <CustomerLayout>
      <main className="container mx-auto px-6 pt-32 pb-20">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 xl:gap-16">
          
          {/* LEFT COLUMN - IMAGES (Leg 7) */}
          <div className="lg:col-span-7 flex flex-col gap-4">
            {/* Main Image */}
            <div className="aspect-[4/5] w-full overflow-hidden bg-surface-light dark:bg-surface-dark relative cursor-pointer group"
              onClick={() => {
                if (mainImage) {
                  setLightboxIndex(0);
                  setLightboxOpen(true);
                }
              }}
            >
              {mainImage ? (
                <img 
                  src={mainImage} 
                  alt={`${product.nombre} - Vista principal`}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                />
              ) : (
                <div className="w-full h-full flex items-center justify-center text-gray-400">
                  <span className="material-symbols-outlined text-6xl">image</span>
                </div>
              )}

              {/* Sold Out Overlay */}
              {isOutOfStock && (
                <div className="absolute inset-0 bg-black/60 flex items-center justify-center z-10">
                   <span className="text-white font-bold tracking-[0.3em] border-4 border-white px-12 py-6 text-4xl md:text-5xl uppercase transform -rotate-12 shadow-2xl bg-black/40 backdrop-blur-sm">
                     Agotado
                   </span>
                </div>
              )}
            </div>

            {/* Secondary Images Grid */}
            {secondaryImages.length > 0 && (
              <div className="grid grid-cols-2 gap-4">
                {secondaryImages.map((img, idx) => (
                  <div 
                    key={idx} 
                    className="aspect-[4/5] w-full overflow-hidden bg-surface-light dark:bg-surface-dark cursor-pointer group"
                    onClick={() => {
                      setLightboxIndex(idx + 1);
                      setLightboxOpen(true);
                    }}
                  >
                    <img 
                      src={img} 
                      alt={`${product.nombre} - Detalle ${idx + 1}`}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                    />
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* RIGHT COLUMN - INFO (Col 5) */}
          <div className="lg:col-span-5 relative">
            <div className="sticky top-28 space-y-8">
              
              {/* Breadcrumbs & Title */}
              <div className="space-y-2">
                <nav className="text-xs text-gray-500 uppercase tracking-widest flex items-center gap-2">
                  <Link to="/" className="hover:text-black dark:hover:text-white transition-colors">Inicio</Link>
                  <span className="text-gray-300">/</span>
                  <Link to="/" className="hover:text-black dark:hover:text-white transition-colors">Tienda</Link>
                  <span className="text-gray-300">/</span>
                  <span className="text-black dark:text-white font-medium">{product.categoria}</span>
                </nav>
                <h1 className="font-display text-4xl md:text-5xl font-bold leading-tight text-black dark:text-white">
                  {product.nombre}
                </h1>
                <p className="text-sm text-gray-500 font-light">Ref. {product.id.toString().padStart(4, '0')}-TX</p>
              </div>

              {/* Price Box */}
              <div className="bg-surface-light dark:bg-surface-dark p-6 border border-gray-100 dark:border-gray-800">
                <div className="flex items-baseline gap-4 mb-2">
                  <span className="text-3xl font-bold text-black dark:text-white">{formatPrice(product.precio)}</span>
                  <span className="text-sm uppercase tracking-wider text-gray-500 dark:text-gray-400 font-medium">Precio Efectivo</span>
                </div>
                <div className="text-sm text-gray-600 dark:text-gray-300 flex items-center gap-2">
                  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 8.25h19.5M2.25 9h19.5m-16.5 5.25h6m-6 2.25h3m-3.75 3h15a2.25 2.25 0 0 0 2.25-2.25V6.75A2.25 2.25 0 0 0 19.5 4.5h-15a2.25 2.25 0 0 0-2.25 2.25v10.5A2.25 2.25 0 0 0 4.5 19.5Z" />
                  </svg>
                  <span>Precio en Cuotas: <span className="font-bold text-black dark:text-white">{formatPrice(product.precio * surchargeMultiplier)}</span> en 6 cuotas de <span className="font-bold text-black dark:text-white">{formatPrice((product.precio * surchargeMultiplier) / 6)}</span></span>
                </div>
              </div>

              {/* Selectors */}
              <div className="space-y-6">
                
                {/* Colors removed as per request */}

                {/* Sizes */}
                {(displayProduct.categoria && (displayProduct.category === 'calzado' || displayProduct.tallas)) && (
                  <div>
                    <div className="flex justify-between items-center mb-3">
                      <h3 className="text-xs font-bold uppercase tracking-widest">Talle</h3>
                      <button 
                        onClick={() => setSizeGuideOpen(true)}
                        className="text-xs text-gray-500 underline hover:text-black dark:hover:text-white transition-colors"
                      >
                        Guía de talles
                      </button>
                    </div>
                    <div className="grid grid-cols-4 gap-2">
                      {getStandardSizes(displayProduct.categoria).map((talla) => {
                        // Use calculated displayProduct for strict availability check
                        const available = isSizeAvailable(talla, displayProduct);
                        
                        return (
                          <button
                            key={talla}
                            onClick={() => available && setSelectedSize(talla)}
                            disabled={!available}
                            className={`
                              h-12 border flex items-center justify-center text-sm font-medium transition-colors relative
                              ${!available 
                                ? 'bg-gray-100 text-gray-400 border-gray-100 dark:bg-gray-800 dark:text-gray-600 dark:border-gray-800 cursor-not-allowed decoration-1 line-through' 
                                : selectedSize === talla
                                  ? 'border-black bg-black text-white dark:bg-white dark:text-black dark:border-white shadow-md font-bold'
                                  : 'border-gray-200 dark:border-gray-700 hover:border-black dark:hover:border-white hover:bg-gray-50 dark:hover:bg-gray-800'
                              }
                            `}
                          >
                            {talla}
                          </button>
                        );
                      })}
                    </div>
                  </div>
                )}
              </div>

              {/* Actions */}
              <div className="pt-4">
                <button
                  onClick={() => openWhatsApp(product, config?.whatsapp_number)}
                  disabled={isOutOfStock}
                  className={`
                    w-full py-4 px-8 text-sm uppercase tracking-[0.15em] font-bold flex items-center justify-center gap-3 transition-all shadow-lg
                    ${isOutOfStock 
                      ? 'bg-gray-300 cursor-not-allowed text-gray-500' 
                      : 'bg-black dark:bg-white text-white dark:text-black hover:bg-gray-900 dark:hover:bg-gray-200 hover:shadow-xl transform hover:-translate-y-0.5'}
                  `}
                >
                  <svg xmlns="http://www.w3.org/2000/svg" fill="currentColor" viewBox="0 0 24 24" className="w-5 h-5">
                     <path d="M12.012 2c-5.506 0-9.989 4.478-9.99 9.985a9.967 9.967 0 0 0 1.503 5.346L2 22l4.825-1.266a9.973 9.973 0 0 0 5.188 1.452h.004c5.505 0 9.988-4.478 9.989-9.986.001-2.668-1.037-5.176-2.924-7.062A9.928 9.928 0 0 0 12.012 2Zm0 0" />
                  </svg>
                  {isOutOfStock ? 'Producto Agotado' : 'Consultar por WhatsApp'}
                </button>
                <p className="text-xs text-center text-gray-500 mt-3 flex items-center justify-center gap-1">
                  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-4 h-4">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75 11.25 15 15 9.75M21 12c0 1.268-.63 2.39-1.593 3.068a3.745 3.745 0 0 1-1.043 3.296 3.745 3.745 0 0 1-3.296 1.043A3.745 3.745 0 0 1 12 21c-1.268 0-2.39-.63-3.068-1.593a3.746 3.746 0 0 1-3.296-1.043 3.745 3.745 0 0 1-1.043-3.296A3.745 3.745 0 0 1 3 12c0-1.268.63-2.39 1.593-3.068a3.745 3.745 0 0 1 1.043-3.296 3.746 3.746 0 0 1 3.296-1.043A3.746 3.746 0 0 1 12 3c1.268 0 2.39.63 3.068 1.593a3.746 3.746 0 0 1 3.296 1.043 3.746 3.746 0 0 1 1.043 3.296A3.745 3.745 0 0 1 21 12Z" />
                  </svg>
                  Compra segura y atención personalizada
                </p>
              </div>

              {/* Accordions */}
              <div className="border-t border-gray-200 dark:border-gray-800 pt-6 space-y-4">
                
                {/* Descripción */}
                <details className="group cursor-pointer" open>
                  <summary className="flex justify-between items-center font-medium text-sm uppercase tracking-wide py-2">
                    Descripción
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5 transition-transform group-open:rotate-180">
                      <path strokeLinecap="round" strokeLinejoin="round" d="m19.5 8.25-7.5 7.5-7.5-7.5" />
                    </svg>
                  </summary>
                  <div className="text-gray-600 dark:text-gray-400 text-sm leading-relaxed mt-2 pb-4">
                    <p>{product.descripcion || 'Sin descripción disponible.'}</p>
                  </div>
                </details>
                
                <div className="border-t border-gray-100 dark:border-gray-800"></div>

                <div className="border-t border-gray-100 dark:border-gray-800"></div>

                {/* Envíos */}
                <details className="group cursor-pointer">
                  <summary className="flex justify-between items-center font-medium text-sm uppercase tracking-wide py-2">
                    Envíos y Devoluciones
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5 transition-transform group-open:rotate-180">
                      <path strokeLinecap="round" strokeLinejoin="round" d="m19.5 8.25-7.5 7.5-7.5-7.5" />
                    </svg>
                  </summary>
                  <div className="text-gray-600 dark:text-gray-400 text-sm leading-relaxed mt-2 pb-4">
                    <p>Envíos a todo el país. Coordinación directa por WhatsApp para métodos de envío y plazos de entrega.</p>
                  </div>
                </details>
              </div>

            </div>
          </div>
        </div>
      </main>

      {/* Cross Selling Section */}
      {relatedProducts.length > 0 && (
        <section className="container mx-auto px-6 py-20 border-t border-gray-100 dark:border-gray-800">
          <div className="flex justify-between items-end mb-12">
            <h2 className="font-display text-3xl font-bold dark:text-white">Completa el Look</h2>
            <Link to="/" className="text-sm font-bold uppercase tracking-widest border-b border-black dark:border-white pb-1 hover:opacity-70 transition-opacity">
              Ver todo
            </Link>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-x-8 gap-y-12">
            {relatedProducts.map((p) => (
              <div key={p.id} onClick={() => navigate(`/producto/${p.id}`)} className="group cursor-pointer">
                <div className="relative bg-surface-light dark:bg-surface-dark mb-4 overflow-hidden aspect-[3/4]">
                  {p.imagenes && p.imagenes.length > 0 ? (
                    <img 
                      src={getImageUrl(p.imagenes[0])} 
                      alt={p.nombre}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center text-gray-400">
                      <span className="material-symbols-outlined text-4xl">image</span>
                    </div>
                  )}
                </div>
                <div className="space-y-1">
                  <h3 className="font-medium text-lg leading-tight dark:text-white group-hover:underline">{p.nombre}</h3>
                  <span className="font-bold text-sm text-black dark:text-white">{formatPrice(p.precio)}</span>
                </div>
              </div>
            ))}
          </div>
        </section>
      )}

    {/* Image Lightbox */}
    {lightboxOpen && product && product.imagenes && product.imagenes.length > 0 && (
      <ImageLightbox
        images={product.imagenes}
        currentIndex={lightboxIndex}
        onClose={() => setLightboxOpen(false)}
        onNext={() => setLightboxIndex((prev) => (prev + 1) % product.imagenes.length)}
        onPrevious={() => setLightboxIndex((prev) => (prev - 1 + product.imagenes.length) % product.imagenes.length)}
        onGoToIndex={(index) => setLightboxIndex(index)}
      />
    )}

    {/* Size Guide Modal */}
    <SizeGuideModal 
      isOpen={sizeGuideOpen}
      onClose={() => setSizeGuideOpen(false)}
    />
    </CustomerLayout>
  );
}

export default ProductDetailPage;
