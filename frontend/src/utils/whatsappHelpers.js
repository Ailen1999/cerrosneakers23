import { formatPrice } from './formatters';

/**
 * Generate WhatsApp message for a product
 * @param {Object} product - Product object
 * @returns {string} WhatsApp URL with pre-filled message
 */
export function generateWhatsAppURL(product) {
  const phoneNumber = import.meta.env.VITE_WHATSAPP_NUMBER || '5491134567890'; // Default number
  
  const message = `Hola! Me interesa el *${product.nombre}*

¿Está disponible?`;

  const encodedMessage = encodeURIComponent(message);
  return `https://wa.me/${phoneNumber}?text=${encodedMessage}`;
}

/**
 * Opens WhatsApp with a pre-filled message for a product inquiry
 * @param {Object} product - Product object with details
 * @param {string} phoneNumber - WhatsApp number to send message to
 */
export function openWhatsApp(product, phoneNumber) {
  const targetNumber = phoneNumber || import.meta.env.VITE_WHATSAPP_NUMBER || '5491166204042';
  
  const message = `Hola! Me interesa este producto:

Producto: ${product.nombre}

¿Está disponible?`;

  const encodedMessage = encodeURIComponent(message);
  const whatsappUrl = `https://wa.me/${targetNumber}?text=${encodedMessage}`;
  
  window.open(whatsappUrl, '_blank');
}

export default {
  generateWhatsAppURL,
  openWhatsApp
};
