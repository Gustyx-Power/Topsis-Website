// ============================================
// NAVBAR COMPONENT
// Material Design 3 Style
// ============================================

const NavbarComponent = {
  render(containerId = 'navbar') {
    const container = document.getElementById(containerId);
    if (!container) return;

    container.innerHTML = `
      <nav class="navbar">
        <div class="navbar-container container">
          <a href="index.html" class="navbar-brand">
            <div class="phone-logo">
              <div class="phone-logo-screen">
                <div class="phone-logo-camera"></div>
                <div class="phone-logo-content">T</div>
              </div>
            </div>
            <span class="navbar-brand-text">Smartphone TOPSIS</span>
          </a>

          <div class="navbar-nav">
            <a href="index.html" class="nav-link ${this.isActivePage('index') ? 'active' : ''}">
              <i class="fas fa-th-large"></i>
              <span class="nav-link-text">Katalog</span>
            </a>
            <a href="comparison.html" class="nav-link ${this.isActivePage('comparison') ? 'active' : ''}">
              <i class="fas fa-code-compare"></i>
              <span class="nav-link-text">Perbandingan</span>
            </a>
            <a href="ranking.html" class="nav-link ${this.isActivePage('ranking') ? 'active' : ''}">
              <i class="fas fa-chart-line"></i>
              <span class="nav-link-text">Ranking</span>
            </a>

            <div class="navbar-divider"></div>

            <button class="theme-toggle" data-theme-toggle title="Toggle Dark Mode">
              <i class="fas fa-moon"></i>
              <i class="fas fa-sun"></i>
            </button>
          </div>
        </div>
      </nav>
    `;
  },

  isActivePage(pageName) {
    const currentPath = window.location.pathname;
    if (pageName === 'index') {
      return currentPath.endsWith('index.html') || currentPath.endsWith('/');
    }
    return currentPath.includes(pageName);
  }
};

// Export for module usage
if (typeof module !== 'undefined' && module.exports) {
  module.exports = NavbarComponent;
}

// Global render function for backward compatibility
function renderNavbar() {
  NavbarComponent.render();
}
