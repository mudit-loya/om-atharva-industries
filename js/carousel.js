// Testimonial Data
const testimonialData = [
    {
        id: 1,
        text: "I am very glad to see professionally managed and well maintained manufacturing facility for such a commodity.",
        author: "Diego Carraro",
        role: "Chairmen",
        company: "Mecc Alte Group",
        country: "Italy"
    },
    {
        id: 2,
        text: "I am glad to see in time completion of infrastructural set up as per commitment and standing by your word! Great Confidence and Creditability.",
        author: "Rajiv Sahay",
        role: "Managing Director",
        company: "Mecc Alte Group",
        country: "India"
    },
    {
        id: 3,
        text: "Such well organized set up can be only established through professional approach. I appreciate consistent efforts of Om Atharva team to achieve this stage.",
        author: "Kevan Simon",
        role: "Global Technical Head",
        company: "Cummins",
        country: ""
    },
    {
        id: 4,
        text: "A very professional operation that should be complimented on its operations, particularly its cleanliness. Something to be maintained as we ramp up the volumes...Many Thanks...!!",
        author: "Neil Harrison",
        role: "CGT Purchasing & Business Continuity Director",
        company: "Cummins",
        country: ""
    },
    {
        id: 5,
        text: "It is my pleasure to review fantastic progress you making in terms of expansion & growth, I am very pleased to see that you value your people & their development as a key part of your future success. Keep up the good work!",
        author: "David Champion",
        role: "Global SQIE head",
        company: "Cummins",
        country: ""
    },
    {
        id: 6,
        text: "First impressions are very good & this continues throughout the whole factory. Great to see your Engineers being put to proper & important use. Had a great reception & I feel this company has a great future. Many thanks for your Hospitality..",
        author: "Shaun Green",
        role: "Mechanical Design Specialist",
        company: "Cummins",
        country: ""
    }
];

// DOM Elements (queried lazily after components are loaded)
let testimonialContainer = null;
let dotsContainer = null;

let currentIndex = 0;
let isAnimating = false;

// Initialize Carousel
function initCarousel() {
    testimonialContainer = document.getElementById('testimonial-container');
    dotsContainer = document.getElementById('carousel-dots');
    if (!testimonialContainer || !dotsContainer) return;
    testimonialData.forEach((_, index) => {
        const dot = document.createElement('button');
        dot.classList.add('dot');
        if (index === 0) dot.classList.add('active');
        dot.setAttribute('aria-label', 'Go to slide ' + (index + 1));
        dot.addEventListener('click', () => {
            if (!isAnimating && index !== currentIndex) {
                goToSlide(index, index > currentIndex ? 'forward' : 'backward');
            }
        });
        dotsContainer.appendChild(dot);
    });

    renderSlide(currentIndex);
    testimonialContainer.classList.add('slide-active');

    // Arrow button clicks
    const leftArrow  = document.getElementById('left-arrow');
    const rightArrow = document.getElementById('right-arrow');
    if (leftArrow) {
        leftArrow.addEventListener('click', () => {
            if (!isAnimating) goToSlide((currentIndex - 1 + testimonialData.length) % testimonialData.length, 'backward');
        });
    }
    if (rightArrow) {
        rightArrow.addEventListener('click', () => {
            if (!isAnimating) goToSlide((currentIndex + 1) % testimonialData.length, 'forward');
        });
    }

    initSwipe();
}

// Render Slide Content
function renderSlide(index) {
    const d = testimonialData[index];
    const companyLine = d.country ? d.company + ' \u2022 ' + d.country : d.company;
    testimonialContainer.innerHTML =
        '<div class="quote-icon"><span data-icon="quotation" class="icon-img icon-2xl icon-orange"></span></div>' +
        '<p class="testimonial-text">\u201c' + d.text + '\u201d</p>' +
        '<div class="author-row">' +
            '<div class="author-avatar">\uD83C\uDDFA\uD83C\uDDF8</div>' +
            '<div class="author-info">' +
                '<p class="author-name">' + d.author + '</p>' +
                '<p class="author-title">' + d.role + '</p>' +
                '<p class="author-company">' + companyLine + '</p>' +
            '</div>' +
        '</div>';
}

// Handle Slide Transition
function goToSlide(newIndex, direction) {
    if (isAnimating) return;
    isAnimating = true;

    // Default direction: forward = left, backward = right
    const goingForward = direction !== undefined
        ? direction === 'forward'
        : newIndex > currentIndex || (currentIndex === testimonialData.length - 1 && newIndex === 0);

    const outClass = goingForward ? 'slide-out-left' : 'slide-out-right';
    const inClass  = goingForward ? 'slide-in-left'  : 'slide-in-right';

    // Step 1: slide current card out
    testimonialContainer.classList.add(outClass);

    setTimeout(() => {
        // Step 2: swap content, set entry position (no transition)
        testimonialContainer.style.transition = 'none';
        testimonialContainer.classList.remove(outClass, 'slide-active');
        testimonialContainer.classList.add(inClass);

        currentIndex = newIndex;
        renderSlide(currentIndex);
        updateDots(currentIndex);

        // Step 3: force reflow, then animate to centre
        testimonialContainer.getBoundingClientRect();
        testimonialContainer.style.transition = '';
        testimonialContainer.classList.remove(inClass);
        testimonialContainer.classList.add('slide-active');

        setTimeout(() => { isAnimating = false; }, 400);
    }, 300);
}

// Update Active Dot
function updateDots(activeIndex) {
    document.querySelectorAll('.dot').forEach((dot, index) => {
        dot.classList.toggle('active', index === activeIndex);
    });
}

// Carousel is initialized by js/loader.js after testimonials component loads

// Touch / swipe support
function initSwipe() {
    let touchStartX = 0;
    let touchStartY = 0;

    testimonialContainer.addEventListener('touchstart', (e) => {
        touchStartX = e.touches[0].clientX;
        touchStartY = e.touches[0].clientY;
    }, { passive: true });

    testimonialContainer.addEventListener('touchend', (e) => {
        const dx = e.changedTouches[0].clientX - touchStartX;
        const dy = e.changedTouches[0].clientY - touchStartY;
        // Only trigger if horizontal swipe is dominant and long enough
        if (Math.abs(dx) < 40 || Math.abs(dx) < Math.abs(dy)) return;
        if (isAnimating) return;
        if (dx < 0) {
            goToSlide((currentIndex + 1) % testimonialData.length, 'forward');
        } else {
            goToSlide((currentIndex - 1 + testimonialData.length) % testimonialData.length, 'backward');
        }
    }, { passive: true });
}
