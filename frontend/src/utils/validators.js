/**
 * Validates product form data
 * @param {Object} data - Product data to validate
 * @returns {Object} - Errors object (empty if valid)
 */
export function validateProduct(data) {
  const errors = {};

  // Name validation (nombre)
  if (!data.nombre || data.nombre.trim() === '') {
    errors.nombre = 'El nombre del producto es requerido';
  } else if (data.nombre.length < 3) {
    errors.nombre = 'El nombre debe tener al menos 3 caracteres';
  }

  // Category validation (categoria)
  if (!data.categoria || data.categoria.trim() === '') {
    errors.categoria = 'La categoría es requerida';
  }

  // Price validation (precio - cash price)
  if (data.precio === undefined || data.precio === null || data.precio === '') {
    errors.precio = 'El precio en efectivo es requerido';
  } else if (parseFloat(data.precio) <= 0) {
    errors.precio = 'El precio debe ser mayor a 0';
  }

  // Price lista validation (optional, but if provided must be > 0)
  if (data.precio_lista !== undefined && data.precio_lista !== null && data.precio_lista !== '') {
    if (parseFloat(data.precio_lista) <= 0) {
      errors.precio_lista = 'El precio debe ser mayor a 0';
    }
  }

  // Stock validation
  if (data.stock === undefined || data.stock === null) {
    errors.stock = 'El stock es requerido';
  } else if (parseInt(data.stock) < 0) {
    errors.stock = 'El stock no puede ser negativo';
  }

  return errors;
}

/**
 * Validates search query
 * @param {string} query - Search query
 * @returns {boolean}
 */
export function validateSearchQuery(query) {
  return query && query.trim().length >= 2;
}

/**
 * Formats price for display
 * @param {number} price
 * @returns {string}
 */
export function formatPrice(price) {
  if (price === null || price === undefined) return '-';
  return `$${parseFloat(price).toFixed(2)}`;
}

/**
 * Debounce function for search input
 * @param {Function} func - Function to debounce
 * @param {number} wait - Wait time in milliseconds
 * @returns {Function}
 */
export function debounce(func, wait = 300) {
  let timeout;
  return function executedFunction(...args) {
    const later = () => {
      clearTimeout(timeout);
      func(...args);
    };
    clearTimeout(timeout);
    timeout = setTimeout(later, wait);
  };
}
