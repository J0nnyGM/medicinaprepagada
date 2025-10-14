document.addEventListener('DOMContentLoaded', () => {

    // --- Lógica del carrusel de tarjetas de planes ---
    const container = document.querySelector('.cards-container');
    const slideLeftButton = document.getElementById('slideLeft');
    const slideRightButton = document.getElementById('slideRight');

    if (container && slideLeftButton && slideRightButton) {
        const cards = Array.from(container.children);
        cards.forEach(card => {
            const clone = card.cloneNode(true);
            container.appendChild(clone);
        });

        const firstCard = container.querySelector('.plan-card');
        if (firstCard) {
            const gap = parseFloat(window.getComputedStyle(container).getPropertyValue('gap')) || 0;
            const scrollAmountPerCard = firstCard.offsetWidth + gap;
            const autoScrollSpeed = 0.5;
            let animationFrameId;

            function animationLoop() {
                container.scrollLeft += autoScrollSpeed;
                const scrollWidth = container.scrollWidth;
                const loopThreshold = scrollWidth / 2;
                if (container.scrollLeft >= loopThreshold) {
                    container.scrollLeft -= loopThreshold;
                }
                animationFrameId = requestAnimationFrame(animationLoop);
            }

            function startAutoScroll() {
                if (!animationFrameId) {
                    animationFrameId = requestAnimationFrame(animationLoop);
                }
            }

            function stopAutoScroll() {
                cancelAnimationFrame(animationFrameId);
                animationFrameId = null;
            }

            let restartTimer;
            function handleManualScroll() {
                stopAutoScroll();
                clearTimeout(restartTimer);
                restartTimer = setTimeout(startAutoScroll, 5000);
            }

            slideRightButton.addEventListener('click', () => {
                container.scrollBy({ left: scrollAmountPerCard, behavior: 'smooth' });
                handleManualScroll();
            });

            slideLeftButton.addEventListener('click', () => {
                container.scrollBy({ left: -scrollAmountPerCard, behavior: 'smooth' });
                handleManualScroll();
            });

            container.addEventListener('mouseenter', stopAutoScroll);
            container.addEventListener('mouseleave', startAutoScroll);

            startAutoScroll();
        }
    }

    // --- Lógica para el Slider del Hero Section ---
    const slides = document.querySelectorAll('.hero-slider .slide');
    const dotsContainer = document.querySelector('.slider-dots');

    if (slides.length > 0 && dotsContainer) {
        let currentSlide = 0;
        let slideInterval;

        slides.forEach((slide, index) => {
            const dot = document.createElement('div');
            dot.classList.add('dot');
            dot.addEventListener('click', () => {
                showSlide(index);
                resetInterval();
            });
            dotsContainer.appendChild(dot);
        });

        const dots = document.querySelectorAll('.slider-dots .dot');

        function showSlide(index) {
            currentSlide = index;
            slides.forEach(slide => slide.classList.remove('active'));
            slides[index].classList.add('active');
            dots.forEach(dot => dot.classList.remove('active'));
            dots[index].classList.add('active');
        }

        function nextSlide() {
            let next = (currentSlide + 1) % slides.length;
            showSlide(next);
        }

        function resetInterval() {
            clearInterval(slideInterval);
            slideInterval = setInterval(nextSlide, 7000);
        }

        showSlide(0);
        resetInterval();
    }

    // --- Lógica para el Header Transformable ---
    const mainHeader = document.querySelector('header');
    const heroSection = document.querySelector('.hero-section');

    if (mainHeader && heroSection) {
        const heroStyle = window.getComputedStyle(heroSection);
        const heroBgImage = heroStyle.getPropertyValue('background-image');

        // Si la propiedad 'background-image' es 'none', significa que no hay imagen.
        if (heroBgImage === 'none') {
            mainHeader.classList.add('header-solid-default');
        }
    }


    const header = document.querySelector('header');
    if (header) {
        function handleHeaderState() {
            const scrollThreshold = 50;
            if (window.scrollY > scrollThreshold) {
                header.classList.add('header-scrolled');
            } else {
                header.classList.remove('header-scrolled');
            }
        }
        window.addEventListener('scroll', handleHeaderState);
        handleHeaderState();
    }

    // --- Lógica para el Menú de Hamburguesa ---
    const hamburger = document.querySelector('.hamburger-menu');
    const navLinks = document.querySelector('.nav-links');
    if (hamburger && navLinks) {
        hamburger.addEventListener('click', () => {
            navLinks.classList.toggle('active');
            const icon = hamburger.querySelector('i');
            if (navLinks.classList.contains('active')) {
                icon.classList.remove('fa-bars');
                icon.classList.add('fa-times');
            } else {
                icon.classList.remove('fa-times');
                icon.classList.add('fa-bars');
            }
        });
    }


});