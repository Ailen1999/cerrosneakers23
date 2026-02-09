// Debug script - Test getImageUrl function

const testCases = [
  '/uploads/1769794747425396900.png',
  'http://localhost:8080/uploads/1769794747425396900.png',
  'https://images.unsplash.com/photo-123',
  'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAUA',
  'blob:http://localhost:5173/abc-123',
  'campera_invierno_negra_1770388716408.png'
];

function getImageUrl(imagePath) {
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
  const API_URL = 'http://localhost:8080';
  
  // Asegurar que la ruta comience con /
  const path = imagePath.startsWith('/') ? imagePath : `/${imagePath}`;
  
  return `${API_URL}${path}`;
}

console.log('Testing getImageUrl function:');
testCases.forEach(test => {
  console.log(`Input: ${test.substring(0, 50)}...`);
  console.log(`Output: ${getImageUrl(test)}`);
  console.log('---');
});
