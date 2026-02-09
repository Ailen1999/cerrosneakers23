import { Link } from 'react-router-dom';
import { openWhatsApp } from '../../utils/whatsappHelpers';
import { formatPrice } from '../../utils/formatters';
import { useConfig } from '../../contexts/ConfigContext';
import { getImageUrl } from '../../utils/imageUtils';

function ProductCard({ product }) {
  const { config } = useConfig();

  const handleWhatsAppClick = (e) => {
    e.preventDefault();
    e.stopPropagation();
    const whatsappNumber = config?.whatsapp_number;
    openWhatsApp(product, whatsappNumber);
  };

  // Calculate surcharge
  const surchargePercentage = config?.credit_card_surcharge || 15; // Default to 15% if not set
  const surchargeMultiplier = 1 + (surchargePercentage / 100);
  const cardPrice = product.precio * surchargeMultiplier;

  // SANITIZATION: Force consistency between global stock and size stock
  // Same logic as ProductDetailPage to handle "Ghost Stock"
  let effectiveStock = product.stock;
  if (product.tallas && product.tallas.length > 0) {
    const stockMap = product.stock_by_size || {};
    effectiveStock = Object.values(stockMap).reduce((a, b) => a + (parseInt(b) || 0), 0);
  }

  return (
    <Link to={`/producto/${product.id}`} className="group cursor-pointer block">
      {/* Product Image */}
      <div className="relative bg-surface-light dark:bg-surface-dark mb-4 overflow-hidden aspect-3-4 flex items-center justify-center">
        {product.imagenes && product.imagenes.length > 0 ? (
          <img
            alt={product.nombre}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
            src={getImageUrl(product.imagenes[0])}
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center text-gray-400">
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-10 h-10">
              <path strokeLinecap="round" strokeLinejoin="round" d="m2.25 15.75 5.159-5.159a2.25 2.25 0 0 1 3.182 0l5.159 5.159m-1.5-1.5 1.409-1.409a2.25 2.25 0 0 1 3.182 0l2.909 2.909m-18 3.75h16.5a1.5 1.5 0 0 0 1.5-1.5V6a1.5 1.5 0 0 0-1.5-1.5H3.75A1.5 1.5 0 0 0 2.25 6v12a1.5 1.5 0 0 0 1.5 1.5Zm10.5-11.25h.008v.008h-.008V8.25Zm.375 0a.375.375 0 1 1-.75 0 .375.375 0 0 1 .75 0Z" />
            </svg>
          </div>
        )}
        
        {/* Sold Out Overlay */}
        {effectiveStock <= 0 && (
          <div className="absolute inset-0 bg-black/60 flex items-center justify-center z-10 transition-opacity duration-300">
             <span className="text-white font-bold tracking-[0.2em] border-2 border-white px-4 py-2 text-sm uppercase transform -rotate-12">
               Agotado
             </span>
          </div>
        )}

        {/* WhatsApp Button on Hover */}
        {effectiveStock > 0 && (
          <div className="absolute bottom-4 left-0 right-0 px-4 opacity-0 group-hover:opacity-100 transition-opacity duration-300 z-20">
            <button 
              className="w-full bg-black text-white py-3 text-xs uppercase tracking-widest font-bold flex items-center justify-center gap-2 hover:bg-gray-800"
              onClick={handleWhatsAppClick}
            >
              <svg xmlns="http://www.w3.org/2000/svg" fill="currentColor" viewBox="0 0 24 24" className="w-4 h-4">
                 <path d="M12.012 2c-5.506 0-9.989 4.478-9.99 9.985a9.967 9.967 0 0 0 1.503 5.346L2 22l4.825-1.266a9.973 9.973 0 0 0 5.188 1.452h.004c5.505 0 9.988-4.478 9.989-9.986.001-2.668-1.037-5.176-2.924-7.062A9.928 9.928 0 0 0 12.012 2Zm0 0" />
              </svg>
              Comprar por WhatsApp
            </button>
          </div>
        )}
      </div>

      {/* Product Info */}
      <div className="space-y-1">
        <p className="text-xs text-gray-500 uppercase tracking-wide">{product.categoria}</p>
        <h3 className="font-medium text-lg leading-tight group-hover:underline dark:text-white">
          {product.nombre}
        </h3>
        <div className="flex flex-col gap-1 text-sm mt-1">
          <span className="font-bold text-black dark:text-white">
            {formatPrice(product.precio)} <span className="text-xs font-normal text-gray-500">Efectivo</span>
          </span>
          <span className="text-green-600 text-xs font-medium">
             {formatPrice(cardPrice)} en 6 cuotas de {formatPrice(cardPrice / 6)}
          </span>
        </div>
      </div>
    </Link>
  );
}

export default ProductCard;
