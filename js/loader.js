// Component loader — fetches html/*.html partials and injects them into [data-component] elements
async function loadComponents() {
    const elements = document.querySelectorAll('[data-component]');
    const tasks = Array.from(elements).map(async el => {
        const name = el.getAttribute('data-component');
        try {
            const response = await fetch('html/' + name + '.html');
            if (!response.ok) throw new Error('Failed to load: ' + name);
            el.innerHTML = await response.text();
        } catch (err) {
            console.error(err);
        }
    });

    await Promise.all(tasks);

    // Prefer WebP when available; fallback to original source if not found.
    document.querySelectorAll('img[src]').forEach(img => {
        const originalSrc = img.getAttribute('src');
        if (!originalSrc || /^https?:\/\//i.test(originalSrc)) return;
        const webpSrc = originalSrc.replace(/\.(png|jpe?g)$/i, '.webp');
        if (webpSrc === originalSrc) return;

        const handleError = () => {
            img.src = originalSrc;
            img.removeEventListener('error', handleError);
        };

        img.addEventListener('error', handleError, { once: true });
        img.src = webpSrc;
    });

    document.querySelectorAll('img').forEach(img => {
        if (!img.hasAttribute('loading')) img.setAttribute('loading', 'lazy');
        if (!img.hasAttribute('decoding')) img.setAttribute('decoding', 'async');
    });

    const navbarLogo = document.querySelector('.navbar img');
    if (navbarLogo) {
        navbarLogo.setAttribute('loading', 'eager');
        navbarLogo.setAttribute('fetchpriority', 'high');
    }

    // Init carousel after all components (including testimonials) are loaded
    if (typeof initCarousel === 'function') {
        initCarousel();
    }
    initScrollSpy();
}

function initScrollSpy() {
    const sections = document.querySelectorAll('section[id]');
    const navLinks = document.querySelectorAll('.nav-links a[href^="#"]');
    if (!sections.length || !navLinks.length) return;

    function setActive(id) {
        navLinks.forEach(a => a.classList.remove('active'));
        const active = document.querySelector(`.nav-links a[href="#${id}"]`);
        if (active) active.classList.add('active');
    }

    function onScroll() {
        let currentId = null;
        sections.forEach(section => {
            if (section.getBoundingClientRect().top <= 100) {
                currentId = section.id;
            }
        });
        if (currentId) setActive(currentId);
    }

    window.addEventListener('scroll', onScroll, { passive: true });
    onScroll();
}

document.addEventListener('DOMContentLoaded', loadComponents);
