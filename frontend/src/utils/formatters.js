/**
 * Format a number as currency (Chilean Peso format)
 * @param {number} amount - The amount to format
 * @returns {string} Formatted price string (e.g., "$30.000")
 */
export function formatPrice(amount) {
  if (amount == null || isNaN(amount)) {
    return '$0';
  }
  
  // Convert to integer (remove decimals)
  const intAmount = Math.floor(amount);
  
  // Format with thousands separator (dot)
  const formatted = intAmount.toString().replace(/\B(?=(\d{3})+(?!\d))/g, '.');
  
  return `$${formatted}`;
}

/**
 * Format a price range
 * @param {number} minPrice - Minimum price
 * @param {number} maxPrice - Maximum price
 * @returns {string} Formatted price range
 */
export function formatPriceRange(minPrice, maxPrice) {
  if (minPrice === maxPrice) {
    return formatPrice(minPrice);
  }
  return `${formatPrice(minPrice)} - ${formatPrice(maxPrice)}`;
}
