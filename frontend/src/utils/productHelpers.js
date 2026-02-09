
/**
 * Retorna un array con el rango completo de tallas estándar basado en la categoría.
 * @param {string} category - La categoría del producto.
 * @returns {string[]} - Array de strings con las tallas.
 */
export const getStandardSizes = (category) => {
  const cat = category?.toLowerCase() || '';
  
  // Para calzado, tallas numéricas del 35 al 46
  if (cat === 'calzado' || cat === 'zapatillas' || cat === 'zapatos') {
    return ['35', '36', '37', '38', '39', '40', '41', '42', '43', '44', '45', '46'];
  }
  
  // Para indumentaria y otros, tallas de letras
  return ['XS', 'S', 'M', 'L', 'XL', 'XXL'];
};

/**
 * Verifica si un talle específico está disponible para un producto.
 * @param {string} size - El talle a verificar.
 * @param {object} product - El objeto producto completo.
 * @returns {boolean} - True si está disponible, false si no.
 */
export const isSizeAvailable = (size, product) => {
  if (!product || !product.tallas) return false;

  // Global stock check: if total stock is 0, nothing is available.
  if (!product.stock || product.stock <= 0) return false;

  // Check if size is in the list of offered sizes
  if (!product.tallas.includes(size)) return false;

  // Detailed stock check
  // If we have detailed stock info (non-empty object), use it. 
  // Treat missing keys as 0 stock.
  if (product.stock_by_size && Object.keys(product.stock_by_size).length > 0) {
    const stockForSize = product.stock_by_size[size];
    return (stockForSize || 0) > 0;
  }

  // Fallback: if no detailed stock map, assume available if in tallas (and total stock > 0)
  return true;
};
