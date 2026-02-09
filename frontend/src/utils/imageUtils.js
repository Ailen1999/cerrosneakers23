/**
 * Obtiene la URL completa para una imagen de producto
 * @param {string} imagePath - Ruta de la imagen (puede ser relativa o absoluta)
 * @returns {string} - URL completa de la imagen
 */
export function getImageUrl(imagePath) {
  if (!imagePath) {
    return null;
  }

  // Si ya es una URL completa (http://, https://, blob:, data:), devolverla tal cual
  if (imagePath.startsWith('http://') || 
      imagePath.startsWith('https://') ||
      imagePath.startsWith('blob:') ||
      imagePath.startsWith('data:')) {
    return imagePath;
  }

  // Si la ruta ya incluye localhost, devolverla tal cual
  if (imagePath.includes('localhost')) {
    return imagePath;
  }

  // Si es una ruta relativa, agregar el prefijo del backend
  const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:8080';
  
  // Asegurar que la ruta comience con /
  const path = imagePath.startsWith('/') ? imagePath : `/${imagePath}`;
  
  return `${API_URL}${path}`;
}

/**
 * Obtiene la primera imagen de un producto o null si no hay imágenes
 * @param {Object} product - Objeto producto
 * @returns {string|null} - URL completa de la primera imagen o null
 */
export function getProductImage(product) {
  if  (product?.imagenes && product.imagenes.length > 0) {
    return getImageUrl(product.imagenes[0]);
  }
  return null;
}
