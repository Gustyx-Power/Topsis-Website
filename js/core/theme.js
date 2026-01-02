// ============================================
// THEME MANAGER
// Material Design 3 Light/Dark Mode
// ============================================

const ThemeManager = {
    STORAGE_KEY: 'topsis-theme',
    DARK_THEME: 'dark',
    LIGHT_THEME: 'light',
    initialized: false,

    // Initialize theme on page load
    init() {
        if (this.initialized) return;
        this.initialized = true;

        const savedTheme = localStorage.getItem(this.STORAGE_KEY);
        const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;

        // Priority: saved preference > system preference
        const theme = savedTheme || (prefersDark ? this.DARK_THEME : this.LIGHT_THEME);
        this.setTheme(theme, false);

        // Listen for system theme changes
        window.matchMedia('(prefers-color-scheme: dark)').addEventListener('change', (e) => {
            if (!localStorage.getItem(this.STORAGE_KEY)) {
                this.setTheme(e.matches ? this.DARK_THEME : this.LIGHT_THEME, false);
            }
        });

        // Setup toggle buttons (initial)
        this.setupToggleButtons();

        // Re-setup after a delay to catch dynamically rendered buttons
        setTimeout(() => this.setupToggleButtons(), 100);
        setTimeout(() => this.setupToggleButtons(), 500);
    },

    // Set theme
    setTheme(theme, save = true) {
        console.log('Setting theme to:', theme);

        if (theme === this.DARK_THEME) {
            document.documentElement.setAttribute('data-theme', 'dark');
            document.body.classList.add('dark-mode');
            document.body.classList.remove('light-mode');
        } else {
            document.documentElement.removeAttribute('data-theme');
            document.body.classList.add('light-mode');
            document.body.classList.remove('dark-mode');
        }

        if (save) {
            localStorage.setItem(this.STORAGE_KEY, theme);
        }

        // Update toggle buttons
        this.updateToggleButtons(theme);

        // Dispatch event for other components
        window.dispatchEvent(new CustomEvent('themechange', { detail: { theme } }));
    },

    // Get current theme
    getTheme() {
        return document.documentElement.getAttribute('data-theme') === 'dark'
            ? this.DARK_THEME
            : this.LIGHT_THEME;
    },

    // Toggle theme
    toggle() {
        const currentTheme = this.getTheme();
        const newTheme = currentTheme === this.DARK_THEME ? this.LIGHT_THEME : this.DARK_THEME;
        console.log('Toggling theme from', currentTheme, 'to', newTheme);
        this.setTheme(newTheme);
    },

    // Setup toggle buttons - use event delegation for dynamic elements
    setupToggleButtons() {
        // Remove existing listeners first
        document.querySelectorAll('.theme-toggle, [data-theme-toggle]').forEach(btn => {
            // Clone and replace to remove old listeners
            const newBtn = btn.cloneNode(true);
            btn.parentNode.replaceChild(newBtn, btn);
        });

        // Add new listeners
        document.querySelectorAll('.theme-toggle, [data-theme-toggle]').forEach(btn => {
            btn.addEventListener('click', (e) => {
                e.preventDefault();
                e.stopPropagation();
                this.toggle();
            });
        });

        // Update icons based on current theme
        this.updateToggleButtons(this.getTheme());
    },

    // Update toggle button appearance
    updateToggleButtons(theme) {
        document.querySelectorAll('.theme-toggle, [data-theme-toggle]').forEach(btn => {
            const sunIcon = btn.querySelector('.fa-sun');
            const moonIcon = btn.querySelector('.fa-moon');

            if (sunIcon && moonIcon) {
                if (theme === this.DARK_THEME) {
                    sunIcon.style.display = 'inline-block';
                    moonIcon.style.display = 'none';
                } else {
                    sunIcon.style.display = 'none';
                    moonIcon.style.display = 'inline-block';
                }
            }
        });
    }
};

// Auto-initialize on DOMContentLoaded
document.addEventListener('DOMContentLoaded', () => {
    ThemeManager.init();
});

// Also initialize immediately if DOM is already ready
if (document.readyState === 'complete' || document.readyState === 'interactive') {
    ThemeManager.init();
}

// Export for module usage
if (typeof module !== 'undefined' && module.exports) {
    module.exports = ThemeManager;
}
