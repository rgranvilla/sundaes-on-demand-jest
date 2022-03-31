/**
 * Format a number as a currency
 * @param {number} amount - The number to format.
 * @returns {string} A formatted currency.
 *
 * @example
 *  formatCurrency(0) // => '$0.00'
 *
 * @example
 *  formatCurrency(1.5) // => '$1.50'
 *
 */
export function formatCurrency(amount) {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    minimumFractionDigits: 2,
  }).format(amount);
}
