import ProductStatusBadge from './ProductStatusBadge';
import ProductActions from './ProductActions';
import { formatPrice } from '../../utils/formatters';
import { useConfig } from '../../contexts/ConfigContext';
import { getProductImage } from '../../utils/imageUtils';

function ProductTableRow({ product, isSelected, onSelect, onEdit, onDelete }) {
  const { config } = useConfig();
  
  // Calculate dynamic list price
  const surchargePercentage = config?.credit_card_surcharge || 15;
  const listPrice = product.precio * (1 + surchargePercentage / 100);
  // Determine status based on stock
  const getStatus = () => {
    if (!product.stock || product.stock === 0) return 'out-of-stock';
    if (product.stock < 10) return 'low-stock';
    return 'in-stock';
  };

  return (
    <tr className={`table-row-hover transition-colors group ${isSelected ? 'bg-black/5 dark:bg-white/5' : ''}`}>
      {/* Checkbox */}
      <td className="p-5 w-12">
        <input
          type="checkbox"
          checked={isSelected}
          onChange={() => onSelect(product.id)}
          className="w-4 h-4 rounded border-gray-300 text-black focus:ring-black dark:border-gray-700 dark:bg-gray-800 dark:checked:bg-white dark:checked:border-white"
        />
      </td>

      {/* Image */}
      <td className="p-5 w-24">
        <div className="h-16 w-12 bg-gray-100 overflow-hidden rounded-sm relative border border-gray-100 dark:border-gray-700">
          {getProductImage(product) ? (
            <img
              src={getProductImage(product)}
              alt={product.nombre}
              className="w-full h-full object-cover"
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center text-gray-400">
              <span className="material-symbols-outlined text-[20px]">image</span>
            </div>
          )}
        </div>
      </td>

      {/* Name & SKU - Using Playfair Display */}
      <td className="p-5">
        <div className="font-display text-lg text-black dark:text-white font-medium">
          {product.nombre || 'Sin nombre'}
        </div>
      </td>

      {/* Category */}
      <td className="p-5">
        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-200">
          {product.categoria || 'Sin categoría'}
        </span>
      </td>

      {/* Price Cash (Efectivo) */}
      <td className="p-5 text-right font-medium text-black dark:text-white font-sans">
        {formatPrice(product.precio)}
      </td>

      {/* Price Card (Lista) */}
      <td className="p-5 text-right font-sans">
        <span className="text-gray-500">{formatPrice(listPrice)}</span>
      </td>

      {/* Status */}
      <td className="p-5 text-center">
        <ProductStatusBadge status={getStatus()} />
      </td>

      {/* Actions */}
      <td className="p-5 text-right">
        <ProductActions onEdit={onEdit} onDelete={onDelete} />
      </td>
    </tr>
  );
}

export default ProductTableRow;
