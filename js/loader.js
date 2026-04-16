// Component loader — fetches html/*.html partials and injects them into [data-component] elements
async function loadComponents() {
    const elements = document.querySelectorAll('[data-component]');
    for (const el of elements) {
        const name = el.getAttribute('data-component');
        try {
            const response = await fetch('html/' + name + '.html');
            if (!response.ok) throw new Error('Failed to load: ' + name);
            el.innerHTML = await response.text();
        } catch (err) {
            console.error(err);
        }
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
