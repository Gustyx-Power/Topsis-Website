// ============================================
// FOOTER COMPONENT
// Material Design 3 Style
// ============================================

const FooterComponent = {
  render(containerId = 'footer') {
    const container = document.getElementById(containerId);
    if (!container) return;

    container.innerHTML = `
      <footer class="footer footer-accent">
        <div class="footer-container">
          <div class="footer-brand">
            <div class="phone-logo">
              <div class="phone-logo-screen">
                <div class="phone-logo-camera"></div>
                <div class="phone-logo-content">T</div>
              </div>
            </div>
            <span class="footer-brand-text">Smartphone TOPSIS</span>
          </div>

          <p class="footer-description">
            Sistem Pendukung Keputusan Pemilihan Smartphone<br>
            Menggunakan Metode TOPSIS untuk analisis multi-kriteria (8 Kriteria)
          </p>

          <nav class="footer-nav">
            <a href="index.html" class="footer-link">
              <i class="fas fa-th-large"></i>
              Katalog
            </a>
            <a href="comparison.html" class="footer-link">
              <i class="fas fa-code-compare"></i>
              Perbandingan
            </a>
            <a href="ranking.html" class="footer-link">
              <i class="fas fa-chart-line"></i>
              Ranking
            </a>
          </nav>

          <div class="footer-divider"></div>

          <p class="footer-copyright">
            © 2025 Sistem Pendukung Keputusan | Kelompok 2 | Universitas Pelita Bangsa
          </p>
        </div>
      </footer>
    `;
  }
};

// Export for module usage
if (typeof module !== 'undefined' && module.exports) {
  module.exports = FooterComponent;
}

// Global render function for backward compatibility
function renderFooter() {
  FooterComponent.render();
}
