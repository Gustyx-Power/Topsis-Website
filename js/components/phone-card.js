// ============================================
// PHONE CARD COMPONENT
// Material Design 3 Style
// ============================================

const PhoneCardComponent = {
  // Category configuration
  categoryConfig: {
    'Low-End': {
      badge: 'badge-low-end',
      icon: 'fa-coins',
      gradient: 'from-amber-500 to-orange-500'
    },
    'Mid-Range': {
      badge: 'badge-mid-range',
      icon: 'fa-star',
      gradient: 'from-purple-500 to-violet-500'
    },
    'Flagship': {
      badge: 'badge-flagship',
      icon: 'fa-crown',
      gradient: 'from-yellow-500 to-amber-500'
    }
  },

  // Render phone card
  render(phone) {
    const config = this.categoryConfig[phone.kategori] || {
      badge: 'badge-outlined',
      icon: 'fa-mobile',
      gradient: 'from-gray-500 to-slate-500'
    };

    return `
      <div class="card card-elevated phone-card" data-animate="slide-up">
        <div class="card-body">
          <!-- Header -->
          <div class="phone-card-header">
            <h3 class="phone-card-name line-clamp-2">${phone.nama}</h3>
            <span class="badge ${config.badge} badge-sm">
              <i class="fas ${config.icon}"></i>
              ${phone.kategori}
            </span>
          </div>

          <!-- Price -->
          <div class="phone-card-price">
            <span class="phone-card-price-label">
              <i class="fas fa-tag"></i>Harga
            </span>
            <span class="phone-card-price-value">${formatCurrency(phone.harga)}</span>
          </div>

          <!-- Processor -->
          <div class="phone-card-processor">
            <i class="fas fa-microchip"></i>
            <span class="truncate">${phone.processor}</span>
          </div>

          <!-- Specs Grid -->
          <div class="phone-card-specs">
            <div class="phone-card-spec">
              <i class="fas fa-memory phone-card-spec-icon ram"></i>
              <span class="phone-card-spec-value">${phone.ram}GB</span>
              <span class="phone-card-spec-label">RAM</span>
            </div>
            <div class="phone-card-spec">
              <i class="fas fa-database phone-card-spec-icon storage"></i>
              <span class="phone-card-spec-value">${phone.memori}GB</span>
              <span class="phone-card-spec-label">Storage</span>
            </div>
            <div class="phone-card-spec">
              <i class="fas fa-camera phone-card-spec-icon camera"></i>
              <span class="phone-card-spec-value">${phone.kamera}MP</span>
              <span class="phone-card-spec-label">Kamera</span>
            </div>
            <div class="phone-card-spec">
              <i class="fas fa-battery-full phone-card-spec-icon battery"></i>
              <span class="phone-card-spec-value">${formatNumber(phone.baterai)}</span>
              <span class="phone-card-spec-label">mAh</span>
            </div>
            <div class="phone-card-spec">
              <i class="fas fa-bolt phone-card-spec-icon charging"></i>
              <span class="phone-card-spec-value">${phone.charging}W</span>
              <span class="phone-card-spec-label">Charging</span>
            </div>
            <div class="phone-card-spec">
              <i class="fas fa-gauge-high phone-card-spec-icon cpu"></i>
              <span class="phone-card-spec-value">${phone.cpuGhz}</span>
              <span class="phone-card-spec-label">GHz</span>
            </div>
          </div>

          <!-- Process Node -->
          <div class="phone-card-node">
            <span><i class="fas fa-atom"></i> Process Node:</span>
            <span class="phone-card-node-value">${phone.nanometer}nm</span>
          </div>

          <!-- Actions -->
          <div class="card-actions justify-between">
            <button class="btn btn-ghost btn-sm" onclick="viewPhoneDetail('${phone.alternatif}')">
              <i class="fas fa-eye"></i> Detail
            </button>
            <button class="btn btn-filled btn-sm" onclick="addToComparison('${phone.alternatif}')">
              <i class="fas fa-plus"></i> Bandingkan
            </button>
          </div>
        </div>
      </div>
    `;
  },

  // Render grid of phone cards
  renderGrid(phones, containerId = 'phoneGrid') {
    const container = document.getElementById(containerId);
    if (!container) return;

    if (phones.length === 0) {
      container.innerHTML = '';
      return;
    }

    container.innerHTML = phones.map(phone => this.render(phone)).join('');

    // Re-initialize scroll animations
    if (typeof AnimationManager !== 'undefined') {
      AnimationManager.refreshScrollAnimations();
    }
  }
};

// Export for module usage
if (typeof module !== 'undefined' && module.exports) {
  module.exports = PhoneCardComponent;
}

// Global render function for backward compatibility
function renderPhoneCard(phone) {
  return PhoneCardComponent.render(phone);
}
