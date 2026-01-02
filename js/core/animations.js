// ============================================
// ANIMATIONS MANAGER
// Ripple Effects, Scroll Animations, etc.
// ============================================

const AnimationManager = {
    // Initialize all animations
    init() {
        this.initRippleEffect();
        this.initScrollAnimations();
        this.initNavbarScroll();
    },

    // ==========================================
    // RIPPLE EFFECT
    // ==========================================
    initRippleEffect() {
        // Apply ripple to all buttons and ripple-enabled elements
        document.addEventListener('click', (e) => {
            const target = e.target.closest('.btn, .ripple, .nav-link, .chip');
            if (!target) return;

            this.createRipple(e, target);
        });
    },

    createRipple(event, element) {
        const rect = element.getBoundingClientRect();
        const size = Math.max(rect.width, rect.height);
        const x = event.clientX - rect.left - size / 2;
        const y = event.clientY - rect.top - size / 2;

        const ripple = document.createElement('span');
        ripple.className = 'ripple-effect';
        ripple.style.cssText = `
      width: ${size}px;
      height: ${size}px;
      left: ${x}px;
      top: ${y}px;
    `;

        element.appendChild(ripple);

        ripple.addEventListener('animationend', () => {
            ripple.remove();
        });
    },

    // ==========================================
    // SCROLL ANIMATIONS
    // ==========================================
    initScrollAnimations() {
        // Use Intersection Observer for scroll-based animations
        const observerOptions = {
            root: null,
            rootMargin: '0px 0px -50px 0px',
            threshold: 0.1
        };

        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('visible');

                    // Optionally unobserve after animation
                    if (entry.target.dataset.animateOnce !== 'false') {
                        observer.unobserve(entry.target);
                    }
                } else if (entry.target.dataset.animateOnce === 'false') {
                    entry.target.classList.remove('visible');
                }
            });
        }, observerOptions);

        // Observe all elements with data-animate attribute
        document.querySelectorAll('[data-animate]').forEach(el => {
            observer.observe(el);
        });
    },

    // Refresh scroll animations (call after dynamic content load)
    refreshScrollAnimations() {
        this.initScrollAnimations();
    },

    // ==========================================
    // NAVBAR SCROLL EFFECT
    // ==========================================
    initNavbarScroll() {
        const navbar = document.querySelector('.navbar');
        if (!navbar) return;

        let lastScroll = 0;
        const scrollThreshold = 50;

        window.addEventListener('scroll', () => {
            const currentScroll = window.pageYOffset;

            // Add shadow when scrolled
            if (currentScroll > scrollThreshold) {
                navbar.classList.add('scrolled');
            } else {
                navbar.classList.remove('scrolled');
            }

            // Optional: Hide on scroll down, show on scroll up
            // if (currentScroll > lastScroll && currentScroll > 200) {
            //   navbar.style.transform = 'translateY(-100%)';
            // } else {
            //   navbar.style.transform = 'translateY(0)';
            // }

            lastScroll = currentScroll;
        });
    },

    // ==========================================
    // STAGGER ANIMATION HELPER
    // ==========================================
    staggerAnimate(elements, delay = 50) {
        elements.forEach((el, index) => {
            el.style.animationDelay = `${index * delay}ms`;
            el.classList.add('stagger-item');
        });
    },

    // ==========================================
    // SMOOTH SCROLL TO ELEMENT
    // ==========================================
    scrollTo(elementOrSelector, offset = 80) {
        const element = typeof elementOrSelector === 'string'
            ? document.querySelector(elementOrSelector)
            : elementOrSelector;

        if (!element) return;

        const top = element.getBoundingClientRect().top + window.pageYOffset - offset;
        window.scrollTo({ top, behavior: 'smooth' });
    },

    // ==========================================
    // COUNTER ANIMATION
    // ==========================================
    animateCounter(element, from, to, duration = 1000) {
        const start = performance.now();
        const range = to - from;

        const step = (timestamp) => {
            const progress = Math.min((timestamp - start) / duration, 1);
            const easeProgress = 1 - Math.pow(1 - progress, 3); // Ease out cubic
            const current = Math.floor(from + range * easeProgress);

            element.textContent = current.toLocaleString('id-ID');

            if (progress < 1) {
                requestAnimationFrame(step);
            }
        };

        requestAnimationFrame(step);
    },

    // ==========================================
    // TYPEWRITER EFFECT
    // ==========================================
    typewriter(element, text, speed = 50) {
        return new Promise((resolve) => {
            let i = 0;
            element.textContent = '';

            const timer = setInterval(() => {
                if (i < text.length) {
                    element.textContent += text.charAt(i);
                    i++;
                } else {
                    clearInterval(timer);
                    resolve();
                }
            }, speed);
        });
    },

    // ==========================================
    // SHAKE ANIMATION
    // ==========================================
    shake(element) {
        element.classList.add('shake');
        element.addEventListener('animationend', () => {
            element.classList.remove('shake');
        }, { once: true });
    },

    // ==========================================
    // PULSE ANIMATION
    // ==========================================
    pulse(element, duration = 1000) {
        element.classList.add('pulse');
        setTimeout(() => {
            element.classList.remove('pulse');
        }, duration);
    }
};

// Auto-initialize on DOMContentLoaded
document.addEventListener('DOMContentLoaded', () => {
    AnimationManager.init();
});

// Export for module usage
if (typeof module !== 'undefined' && module.exports) {
    module.exports = AnimationManager;
}
