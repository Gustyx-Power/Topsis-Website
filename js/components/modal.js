// ============================================
// MODAL COMPONENT
// Material Design 3 Style
// ============================================

const ModalComponent = {
  activeModal: null,
  activeBackdrop: null,

  // Open modal
  open(content, options = {}) {
    const {
      size = 'default', // default, lg, xl, fullscreen, sm
      type = 'center',  // center, bottom
      closeOnBackdrop = true
    } = options;

    // Create backdrop as separate element
    const backdrop = document.createElement('div');
    backdrop.className = 'modal-backdrop';
    document.body.appendChild(backdrop);

    // Create modal structure (without backdrop inside)
    const modal = document.createElement('div');
    modal.className = `modal ${type === 'bottom' ? 'modal-bottom' : ''} ${size === 'lg' ? 'modal-lg' : ''} ${size === 'xl' ? 'modal-xl' : ''} ${size === 'sm' ? 'modal-sm' : ''} ${size === 'fullscreen' ? 'modal-fullscreen' : ''}`;
    modal.innerHTML = `
      <div class="modal-box">
        ${content}
      </div>
    `;

    document.body.appendChild(modal);
    document.body.style.overflow = 'hidden';

    // Animate in
    requestAnimationFrame(() => {
      backdrop.classList.add('active');
      modal.classList.add('active');
    });

    // Close on backdrop click
    if (closeOnBackdrop) {
      backdrop.addEventListener('click', () => {
        this.close(modal, backdrop);
      });
    }

    // Close button handler
    modal.querySelectorAll('[data-close-modal], .modal-close').forEach(btn => {
      btn.addEventListener('click', (e) => {
        e.preventDefault();
        e.stopPropagation();
        this.close(modal, backdrop);
      });
    });

    // Close on Escape key
    const escHandler = (e) => {
      if (e.key === 'Escape') {
        this.close(modal, backdrop);
        document.removeEventListener('keydown', escHandler);
      }
    };
    document.addEventListener('keydown', escHandler);

    this.activeModal = modal;
    this.activeBackdrop = backdrop;
    return modal;
  },

  // Close modal
  close(modal = this.activeModal, backdrop = this.activeBackdrop) {
    if (!modal) return;

    modal.classList.remove('active');
    if (backdrop) {
      backdrop.classList.remove('active');
    }

    setTimeout(() => {
      modal.remove();
      if (backdrop) {
        backdrop.remove();
      }
      document.body.style.overflow = '';
    }, 300);

    this.activeModal = null;
    this.activeBackdrop = null;
  },

  // Close all modals
  closeAll() {
    document.querySelectorAll('.modal').forEach(modal => {
      modal.remove();
    });
    document.querySelectorAll('.modal-backdrop').forEach(backdrop => {
      backdrop.remove();
    });
    document.body.style.overflow = '';
    this.activeModal = null;
    this.activeBackdrop = null;
  },

  // Render phone detail modal content
  renderPhoneDetail(phone) {
    const categoryConfig = {
      'Low-End': { badge: 'badge-low-end', icon: 'fa-coins' },
      'Mid-Range': { badge: 'badge-mid-range', icon: 'fa-star' },
      'Flagship': { badge: 'badge-flagship', icon: 'fa-crown' }
    };

    const config = categoryConfig[phone.kategori] || { badge: 'badge-outlined', icon: 'fa-mobile' };

    return `
      <div class="modal-header">
        <div>
          <h3 class="modal-title">${phone.nama}</h3>
          <span class="badge ${config.badge} mt-sm">
            <i class="fas ${config.icon}"></i>
            ${phone.kategori}
          </span>
        </div>
        <button class="modal-close" data-close-modal>
          <i class="fas fa-times"></i>
        </button>
      </div>

      <div class="modal-body">
        <div class="detail-grid">
          <!-- Main Specs -->
          <div class="detail-section">
            <h4 class="detail-section-title">
              <i class="fas fa-microchip"></i>
              Spesifikasi Utama
            </h4>
            <div class="detail-row">
              <span class="detail-label"><i class="fas fa-tag"></i> Harga</span>
              <span class="detail-value price">${formatCurrency(phone.harga)}</span>
            </div>
            <div class="detail-row">
              <span class="detail-label"><i class="fas fa-microchip"></i> Processor</span>
              <span class="detail-value">${phone.processor}</span>
            </div>
            <div class="detail-row">
              <span class="detail-label"><i class="fas fa-gauge-high"></i> CPU Clock</span>
              <span class="detail-value">${phone.cpuGhz} GHz</span>
            </div>
            <div class="detail-row">
              <span class="detail-label"><i class="fas fa-atom"></i> Process Node</span>
              <span class="detail-value">${phone.nanometer} nm</span>
            </div>
            <div class="detail-row">
              <span class="detail-label"><i class="fas fa-memory"></i> RAM</span>
              <span class="detail-value">${phone.ram} GB</span>
            </div>
            <div class="detail-row">
              <span class="detail-label"><i class="fas fa-database"></i> Storage</span>
              <span class="detail-value">${phone.memori} GB</span>
            </div>
            <div class="detail-row">
              <span class="detail-label"><i class="fas fa-camera"></i> Kamera</span>
              <span class="detail-value">${phone.kamera} MP</span>
            </div>
            <div class="detail-row">
              <span class="detail-label"><i class="fas fa-battery-full"></i> Baterai</span>
              <span class="detail-value">${formatNumber(phone.baterai)} mAh</span>
            </div>
            <div class="detail-row">
              <span class="detail-label"><i class="fas fa-bolt"></i> Charging</span>
              <span class="detail-value">${phone.charging} W</span>
            </div>
          </div>

          <!-- Alternative Info -->
          <div class="detail-section">
            <h4 class="detail-section-title">
              <i class="fas fa-info-circle"></i>
              Info Alternatif
            </h4>
            <div class="detail-row">
              <span class="detail-label">Kode</span>
              <span class="detail-value" style="font-family: monospace;">${phone.alternatif}</span>
            </div>
            <div class="detail-row">
              <span class="detail-label">Kategori</span>
              <span class="badge ${config.badge} badge-sm">
                <i class="fas ${config.icon}"></i>
                ${phone.kategori}
              </span>
            </div>
            <div class="detail-row">
              <span class="detail-label">Range Harga</span>
              <span class="detail-value">${phone.rangeHarga}</span>
            </div>
            <div class="detail-row">
              <span class="detail-label">ID Dataset</span>
              <span class="detail-value text-muted">${phone.id}</span>
            </div>

            <div class="alert alert-info mt-md">
              <i class="fas fa-database"></i>
              <span class="body-small">Data berdasarkan GSMArena & sumber resmi</span>
            </div>
          </div>
        </div>
      </div>

      <div class="modal-actions">
        <button class="btn btn-filled" onclick="addToComparison('${phone.alternatif}'); ModalComponent.close();">
          <i class="fas fa-plus"></i>
          Tambah ke Perbandingan
        </button>
        <button class="btn btn-ghost" data-close-modal>Tutup</button>
      </div>
    `;
  },

  // Show phone detail modal
  showPhoneDetail(phone) {
    const content = this.renderPhoneDetail(phone);
    this.open(content, { size: 'lg' });
  },

  // Confirm dialog
  confirm(message, options = {}) {
    return new Promise((resolve) => {
      const {
        title = 'Konfirmasi',
        icon = 'fa-question-circle',
        confirmText = 'Ya',
        cancelText = 'Tidak',
        confirmClass = 'btn-filled',
        dangerous = false
      } = options;

      const content = `
        <div class="modal-body text-center py-xl">
          <i class="fas ${icon} modal-icon" style="font-size: 48px; color: var(--md-${dangerous ? 'error' : 'primary'});"></i>
          <h3 class="title-large mt-md mb-sm">${title}</h3>
          <p class="body-medium text-muted">${message}</p>
        </div>
        <div class="modal-actions justify-center">
          <button class="btn btn-ghost" data-action="cancel">
            ${cancelText}
          </button>
          <button class="btn ${dangerous ? 'btn-error' : confirmClass}" data-action="confirm">
            ${confirmText}
          </button>
        </div>
      `;

      const modal = this.open(content, { size: 'sm', closeOnBackdrop: false });
      modal.classList.add('modal-confirm');

      // Store backdrop reference for this modal
      const backdrop = this.activeBackdrop;

      modal.querySelector('[data-action="confirm"]').addEventListener('click', (e) => {
        e.preventDefault();
        e.stopPropagation();
        this.close(modal, backdrop);
        resolve(true);
      });

      modal.querySelector('[data-action="cancel"]').addEventListener('click', (e) => {
        e.preventDefault();
        e.stopPropagation();
        this.close(modal, backdrop);
        resolve(false);
      });
    });
  },

  // Alert dialog
  alert(message, options = {}) {
    return new Promise((resolve) => {
      const {
        title = 'Info',
        icon = 'fa-info-circle',
        buttonText = 'OK'
      } = options;

      const content = `
        <div class="modal-body text-center py-xl">
          <i class="fas ${icon} modal-icon" style="font-size: 48px; color: var(--md-primary);"></i>
          <h3 class="title-large mt-md mb-sm">${title}</h3>
          <p class="body-medium text-muted">${message}</p>
        </div>
        <div class="modal-actions justify-center">
          <button class="btn btn-filled" data-action="ok">
            ${buttonText}
          </button>
        </div>
      `;

      const modal = this.open(content, { size: 'sm' });
      const backdrop = this.activeBackdrop;

      modal.querySelector('[data-action="ok"]').addEventListener('click', (e) => {
        e.preventDefault();
        e.stopPropagation();
        this.close(modal, backdrop);
        resolve();
      });
    });
  }
};

// Export for module usage
if (typeof module !== 'undefined' && module.exports) {
  module.exports = ModalComponent;
}

// Global function for backward compatibility
function renderPhoneDetailModal(phone) {
  return ModalComponent.renderPhoneDetail(phone);
}
