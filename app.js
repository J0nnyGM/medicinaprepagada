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
    const header = document.querySelector('header');
    const heroSection = document.querySelector('.hero-section');

    if (header) {
        // Si es una página de plan (sin .hero-section), establece el fondo sólido inicial.
        if (!heroSection) {
            header.classList.add('header-solid');
        }

        function handleHeaderState() {
            const scrollThreshold = 50;
            if (window.scrollY > scrollThreshold) {
                // Al hacer scroll, se añade tanto el fondo como el tamaño comprimido.
                header.classList.add('header-scrolled');
                header.classList.add('header-solid'); // Aseguramos que el fondo esté en la pág. principal
            } else {
                // Al volver arriba, se quita el tamaño comprimido.
                header.classList.remove('header-scrolled');
                
                // Y solo quitamos el fondo si estamos en la página principal (la que tiene hero-section).
                if (heroSection) {
                    header.classList.remove('header-solid');
                }
            }
        }

        // Ejecutamos la función una vez al cargar para establecer el estado inicial del scroll.
        handleHeaderState();
        
        // Y añadimos el "listener" para que siga funcionando el efecto de scroll en todas las páginas.
        window.addEventListener('scroll', handleHeaderState);
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


        /* --- Lógica para Animación de Transición de Página --- */
    // Seleccionamos todos los enlaces internos (que no van a otras webs ni son anclas)
    const internalLinks = document.querySelectorAll('a[href]:not([href^="http"]):not([href^="#"])');

    internalLinks.forEach(link => {
        link.addEventListener('click', function(event) {
            const destination = this.href;

            // Si el enlace abre en una nueva pestaña, no hacemos nada
            if (this.target === '_blank') {
                return;
            }

            // Prevenimos la navegación inmediata
            event.preventDefault();

            // Aplicamos la animación de salida
            document.body.classList.add('fade-out');

            // Esperamos a que la animación termine (500ms) y luego vamos a la nueva página
            setTimeout(() => {
                window.location.href = destination;
            }, 300);
        });
    });
});