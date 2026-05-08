document.addEventListener('DOMContentLoaded', () => {
    // 1. Dynamic Age Calculation
    const birthDate = new Date('2004-01-07');
    const currentDate = new Date();
    let age = currentDate.getFullYear() - birthDate.getFullYear();
    const m = currentDate.getMonth() - birthDate.getMonth();
    if (m < 0 || (m === 0 && currentDate.getDate() < birthDate.getDate())) {
        age--;
    }
    
    const ageElement = document.getElementById('dynamic-age');
    if (ageElement) {
        ageElement.textContent = age;
    }

    // 2. Current Year for Footer
    const yearElement = document.getElementById('current-year');
    if (yearElement) {
        yearElement.textContent = currentDate.getFullYear();
    }

    // 3. Theme Toggle Logic
    const themeToggleBtn = document.getElementById('themeToggle');
    const htmlElement = document.documentElement;
    
    // Check local storage or system preference
    const savedTheme = localStorage.getItem('theme');
    if (savedTheme) {
        htmlElement.setAttribute('data-theme', savedTheme);
    } else if (window.matchMedia && window.matchMedia('(prefers-color-scheme: light)').matches) {
        htmlElement.setAttribute('data-theme', 'light');
    }

    themeToggleBtn.addEventListener('click', () => {
        const currentTheme = htmlElement.getAttribute('data-theme');
        const newTheme = currentTheme === 'dark' ? 'light' : 'dark';
        
        htmlElement.setAttribute('data-theme', newTheme);
        localStorage.setItem('theme', newTheme);
    });

    // 4. Header Scroll Effect
    const header = document.getElementById('header');
    window.addEventListener('scroll', () => {
        if (window.scrollY > 50) {
            header.classList.add('scrolled');
        } else {
            header.classList.remove('scrolled');
        }
    });

    // 5. GSAP Animations
    gsap.registerPlugin(ScrollTrigger);

    // Initial setup for fade-up elements
    gsap.set('.fade-up', { y: 50, autoAlpha: 0 });
    
    // Animate reveal text
    gsap.utils.toArray('.reveal-text').forEach(text => {
        gsap.from(text, {
            scrollTrigger: {
                trigger: text,
                start: "top 85%",
                toggleActions: "play none none reverse"
            },
            y: 30,
            autoAlpha: 0,
            duration: 0.8,
            ease: "power3.out"
        });
    });

    // Batch animate fade-up elements
    ScrollTrigger.batch(".fade-up", {
        interval: 0.15,
        batchMax: 3,
        onEnter: batch => gsap.to(batch, {autoAlpha: 1, y: 0, stagger: 0.15, duration: 0.8, ease: "power3.out"}),
        onLeave: batch => gsap.set(batch, {autoAlpha: 0, y: -50}),
        onEnterBack: batch => gsap.to(batch, {autoAlpha: 1, y: 0, stagger: 0.15, duration: 0.8, ease: "power3.out"}),
        onLeaveBack: batch => gsap.set(batch, {autoAlpha: 0, y: 50}),
        start: "top 85%"
    });

    // Parallax effect on the Mobil-inn background
    gsap.to('.mobil-inn-bg', {
        yPercent: 30,
        ease: "none",
        scrollTrigger: {
            trigger: ".experience-card",
            start: "top bottom", 
            end: "bottom top",
            scrub: true
        }
    });
    
    // Subtle float animation for the SVGs in projects
    gsap.utils.toArray('.svg-container').forEach(svg => {
        gsap.to(svg, {
            y: -10,
            duration: 2,
            repeat: -1,
            yoyo: true,
            ease: "sine.inOut"
        });
    });

    // 6. Modal Logic for Projects
    const modal = document.getElementById('projectModal');
    const iframe = document.getElementById('projectIframe');
    const closeBtn = document.querySelector('.close-modal');
    const modalBtns = document.querySelectorAll('.project-modal-btn');

    function openModal(url) {
        iframe.src = url;
        modal.classList.add('show');
        document.body.style.overflow = 'hidden'; // Prevent scrolling on main page
    }

    function closeModal() {
        modal.classList.remove('show');
        document.body.style.overflow = '';
        setTimeout(() => {
            iframe.src = ''; // Clear iframe to save memory after animation ends
        }, 300);
    }

    modalBtns.forEach(btn => {
        btn.addEventListener('click', (e) => {
            e.preventDefault();
            const url = btn.getAttribute('data-project-url');
            openModal(url);
        });
    });

    closeBtn.addEventListener('click', closeModal);

    // Close when clicking outside of modal content
    modal.addEventListener('click', (e) => {
        if (e.target === modal) {
            closeModal();
        }
    });

    // Close on Escape key
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape' && modal.classList.contains('show')) {
            closeModal();
        }
    });
});
