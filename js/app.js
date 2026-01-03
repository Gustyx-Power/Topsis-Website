// HOMEPAGE LOGIC (index.html)
let currentPhones = [...smartphoneData];
let comparisonList = JSON.parse(localStorage.getItem('comparisonList')) || [];

// DEVICE ANIMATION MANAGER
const DeviceAnimation = {
  elements: {},

  init() {
    this.elements = {
      mockup: document.querySelector('.device-mockup'),
      bootScreen: document.querySelector('.device-boot-screen'),
      lockscreen: document.querySelector('.device-lockscreen'),
      pinScreen: document.querySelector('.device-pin-screen'),
      homeScreen: document.querySelector('.device-home'),
      weatherApp: document.querySelector('.device-app-weather-view'),
      settingsApp: document.querySelector('.device-app-settings-view'),
      searchOverlay: document.querySelector('.device-search-overlay'),
      powerMenu: document.querySelector('.device-power-menu'),
      pinDots: document.querySelectorAll('.pin-dot'),
      pinKeys: document.querySelectorAll('.pin-key')
    };

    if (!this.elements.mockup) return;

    // Start with Boot Sequence
    setTimeout(() => this.seqBoot(), 1000);
  },

  // 1. BOOT SEQUENCE
  seqBoot() {
    this.resetAll();
    // Show Boot Screen
    this.elements.bootScreen.classList.add('active');

    // Simulating Boot Time
    setTimeout(() => {
      this.elements.bootScreen.classList.remove('active');
      this.seqLockscreen();
    }, 4000);
  },

  // 2. LOCKSCREEN SEQUENCE
  seqLockscreen() {
    console.log('Starting Lockscreen Sequence');
    this.elements.lockscreen.classList.remove('unlocked'); // Ensure locked
    this.elements.lockscreen.classList.add('active'); // Make Visible (Fix)
    console.log('Lockscreen classes:', this.elements.lockscreen.className);

    // Wait then Swipe Up
    setTimeout(() => {
      this.elements.lockscreen.classList.add('unlocked'); // Swipe up effect

      // Show PIN Screen
      setTimeout(() => this.seqPin(), 600);
    }, 2000);
  },

  // 3. PIN UNLOCK SEQUENCE
  seqPin() {
    this.elements.pinScreen.classList.add('active');

    // Type PIN: 1 - 1 - 1 - 1
    const typePin = (index) => {
      if (index > 4) {
        // Success - Unlock
        setTimeout(() => {
          this.elements.pinScreen.classList.remove('active');
          this.seqHome();
        }, 500);
        return;
      }

      setTimeout(() => {
        // Highlight Key '1'
        const key1 = this.elements.pinKeys[0]; // '1' is first
        key1.classList.add('active');
        setTimeout(() => key1.classList.remove('active'), 200);

        // Fill Dot
        if (this.elements.pinDots[index - 1]) {
          this.elements.pinDots[index - 1].classList.add('filled');
        }

        typePin(index + 1);
      }, 600);
    };

    // Start typing after delay
    setTimeout(() => typePin(1), 800);
  },

  // 4. HOME & APPS SEQUENCE
  seqHome() {
    this.resetPin();

    // 4.1 Weather
    setTimeout(() => {
      this.openApp('weather');
      setTimeout(() => {
        this.closeApp('weather');

        // 4.2 Settings
        setTimeout(() => {
          this.openApp('settings');
          setTimeout(() => {
            this.closeApp('settings');

            // 4.3 Search
            setTimeout(() => {
              this.openApp('search');
              setTimeout(() => {
                this.closeApp('search');

                // 5. POWER MENU
                setTimeout(() => this.seqPowerMenu(), 1500);
              }, 3000);
            }, 1000);
          }, 3000);
        }, 1000);
      }, 3000);
    }, 1000);
  },

  // 5. POWER & REBOOT SEQUENCE
  seqPowerMenu() {
    // Show Power Menu
    this.elements.powerMenu.classList.add('active');

    // Select Restart
    setTimeout(() => {
      const restartBtn = this.elements.powerMenu.querySelector('.restart');
      restartBtn.classList.add('active'); // Simulate press

      setTimeout(() => {
        // Fade out everything -> Boot
        this.elements.powerMenu.classList.remove('active');
        this.seqBoot();
      }, 1000);
    }, 2000);
  },

  openApp(appName) {
    console.log('Opening App:', appName);
    if (appName === 'weather' && this.elements.weatherApp) this.elements.weatherApp.classList.add('active');
    if (appName === 'settings' && this.elements.settingsApp) this.elements.settingsApp.classList.add('active');
    if (appName === 'search' && this.elements.searchOverlay) this.elements.searchOverlay.classList.add('active');
  },

  closeApp(appName) {
    if (appName === 'weather') this.elements.weatherApp.classList.remove('active');
    if (appName === 'settings') this.elements.settingsApp.classList.remove('active');
    if (appName === 'search') this.elements.searchOverlay.classList.remove('active');
  },

  resetPin() {
    this.elements.pinDots.forEach(dot => dot.classList.remove('filled'));
  },

  resetAll() {
    this.elements.weatherApp?.classList.remove('active');
    this.elements.settingsApp?.classList.remove('active');
    this.elements.searchOverlay?.classList.remove('active');
    this.elements.pinScreen?.classList.remove('active');
    this.elements.powerMenu?.classList.remove('active');
    this.elements.bootScreen?.classList.remove('active');
    this.elements.lockscreen?.classList.remove('unlocked');
    this.elements.lockscreen?.classList.remove('active'); // Ensure strictly reset
    this.resetPin();
  }
};

// Initialize page
document.addEventListener('DOMContentLoaded', function () {
  // Render components
  renderNavbar();
  renderFooter();

  // Re-setup theme toggle after navbar is rendered
  if (typeof ThemeManager !== 'undefined') {
    ThemeManager.setupToggleButtons();
  }

  // Render initial data
  renderPhoneGrid(currentPhones);
  updateStats();

  // Initialize Device Animation
  if (typeof DeviceAnimation !== 'undefined') {
    DeviceAnimation.init();
  }
});

// Render phone grid
function renderPhoneGrid(phones) {
  const grid = document.getElementById('phoneGrid');
  const noResults = document.getElementById('noResults');

  if (phones.length === 0) {
    grid.classList.add('hidden');
    noResults.classList.remove('hidden');
    return;
  }

  grid.classList.remove('hidden');
  noResults.classList.add('hidden');

  grid.innerHTML = phones.map(phone => PhoneCardComponent.render(phone)).join('');

  // Refresh scroll animations
  if (typeof AnimationManager !== 'undefined') {
    AnimationManager.refreshScrollAnimations();
  }
}

// Apply filters
function applyFilters() {
  const category = document.getElementById('filterCategory').value;
  const searchQuery = document.getElementById('searchInput').value;
  const sortType = document.getElementById('sortBy').value;

  // Filter by category
  let filtered = filterByCategory(smartphoneData, category);

  // Search
  filtered = searchPhones(filtered, searchQuery);

  // Sort
  filtered = sortPhones(filtered, sortType);

  currentPhones = filtered;
  renderPhoneGrid(currentPhones);

  // Update displayed count
  document.getElementById('totalCount').textContent = filtered.length;
}

// Update statistics
function updateStats() {
  const lowEnd = smartphoneData.filter(p => p.kategori === 'Low-End').length;
  const midRange = smartphoneData.filter(p => p.kategori === 'Mid-Range').length;
  const flagship = smartphoneData.filter(p => p.kategori === 'Flagship').length;

  document.getElementById('totalCount').textContent = smartphoneData.length;
  document.getElementById('lowEndCount').textContent = lowEnd;
  document.getElementById('midRangeCount').textContent = midRange;
  document.getElementById('flagshipCount').textContent = flagship;

  // Animate counters if AnimationManager is available
  if (typeof AnimationManager !== 'undefined') {
    // AnimationManager.animateCounter(document.getElementById('totalCount'), 0, smartphoneData.length);
  }
}

// View phone detail
function viewPhoneDetail(id) {
  const phone = smartphoneData.find(p => p.id === id);
  if (!phone) return;

  // Use modal component
  if (typeof ModalComponent !== 'undefined') {
    ModalComponent.showPhoneDetail(phone);
  }
}

// Add to comparison
async function addToComparison(id) {
  const phone = smartphoneData.find(p => p.id === id);
  if (!phone) return;

  // Check if already in comparison
  if (comparisonList.find(p => p.id === id)) {
    if (typeof ModalComponent !== 'undefined') {
      ModalComponent.alert('Smartphone ini sudah ada di daftar perbandingan!', {
        title: 'Info',
        icon: 'fa-info-circle'
      });
    } else {
      alert('Smartphone ini sudah ada di daftar perbandingan!');
    }
    return;
  }

  // Max 5 phones
  if (comparisonList.length >= 5) {
    if (typeof ModalComponent !== 'undefined') {
      ModalComponent.alert('Maksimal 5 smartphone untuk dibandingkan!', {
        title: 'Batas Tercapai',
        icon: 'fa-exclamation-circle'
      });
    } else {
      alert('Maksimal 5 smartphone untuk dibandingkan!');
    }
    return;
  }

  comparisonList.push(phone);
  localStorage.setItem('comparisonList', JSON.stringify(comparisonList));

  // Ask to go to comparison page
  if (typeof ModalComponent !== 'undefined') {
    const message = `${phone.nama} ditambahkan ke daftar perbandingan!\n\nTotal: ${comparisonList.length} smartphone`;
    const goToComparison = await ModalComponent.confirm(message, {
      title: 'Berhasil Ditambahkan',
      icon: 'fa-check-circle',
      confirmText: 'Lihat Perbandingan',
      cancelText: 'Tetap di Sini'
    });

    if (goToComparison) {
      window.location.href = 'comparison.html';
    }
  } else {
    alert(`${phone.nama} ditambahkan ke daftar perbandingan!\n\nTotal: ${comparisonList.length} smartphone`);
    const goToComparison = confirm('Lihat halaman perbandingan sekarang?');
    if (goToComparison) {
      window.location.href = 'comparison.html';
    }
  }
}
