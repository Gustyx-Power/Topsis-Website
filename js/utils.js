// UTILITY FUNCTIONS

// Format currency to Rupiah
function formatCurrency(value) {
  return new Intl.NumberFormat('id-ID', {
    style: 'currency',
    currency: 'IDR',
    minimumFractionDigits: 0
  }).format(value * 1000000);
}

// Format number with thousand separator
function formatNumber(value) {
  return new Intl.NumberFormat('id-ID').format(value);
}

// Get category badge color
function getCategoryBadge(category) {
  const badges = {
    'Low-End': 'badge-secondary',
    'Mid-Range': 'badge-accent',
    'Flagship': 'badge-info'
  };
  return badges[category] || 'badge-neutral';
}

// Get category color class
function getCategoryColor(category) {
  const colors = {
    'Low-End': 'bg-blue-100 text-blue-800 border-blue-300',
    'Mid-Range': 'bg-purple-100 text-purple-800 border-purple-300',
    'Flagship': 'bg-amber-100 text-amber-800 border-amber-300'
  };
  return colors[category] || 'bg-gray-100 text-gray-800';
}

// Filter smartphones by category
function filterByCategory(phones, category) {
  if (category === 'all') return phones;
  return phones.filter(phone => phone.kategori === category);
}

// Search smartphones by name
function searchPhones(phones, query) {
  if (!query) return phones;
  const q = query.toLowerCase();
  return phones.filter(phone =>
    phone.nama.toLowerCase().includes(q) ||
    phone.alternatif.toLowerCase().includes(q) ||
    phone.kategori.toLowerCase().includes(q)
  );
}

// Sort smartphones
function sortPhones(phones, sortType) {
  const sorted = [...phones];

  switch(sortType) {
    case 'price-asc':
      return sorted.sort((a, b) => a.harga - b.harga);
    case 'price-desc':
      return sorted.sort((a, b) => b.harga - a.harga);
    case 'ram-desc':
      return sorted.sort((a, b) => b.ram - a.ram);
    case 'battery-desc':
      return sorted.sort((a, b) => b.baterai - a.baterai);
    default:
      return sorted;
  }
}

// Validate weights (must sum to 1)
function validateWeights(weights) {
  const sum = Object.values(weights).reduce((a, b) => a + b, 0);
  return Math.abs(sum - 1) < 0.001; // Allow small floating point error
}

// Normalize number to 2 decimal places
function normalizeDecimal(value, decimals = 2) {
  return Number(value.toFixed(decimals));
}

// Get min value from array
function getMinValue(arr) {
  return Math.min(...arr.filter(v => !isNaN(v) && v !== null));
}

// Get max value from array
function getMaxValue(arr) {
  return Math.max(...arr.filter(v => !isNaN(v) && v !== null));
}

// Calculate square root
function sqrt(value) {
  return Math.sqrt(value);
}

// Export for module usage (jika diperlukan)
if (typeof module !== 'undefined' && module.exports) {
  module.exports = {
    formatCurrency,
    formatNumber,
    getCategoryBadge,
    getCategoryColor,
    filterByCategory,
    searchPhones,
    sortPhones,
    validateWeights,
    normalizeDecimal,
    getMinValue,
    getMaxValue,
    sqrt
  };
}
