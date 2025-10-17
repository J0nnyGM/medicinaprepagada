// ¡NUEVO CÓDIGO AÑADIDO!
// Este detector se asegura de que la página sea visible cuando se usa el botón "Atrás" del navegador.
window.addEventListener('pageshow', function(event) {
    if (event.persisted) {
        document.body.classList.remove('fade-out');
    }
});


// Se envuelve todo el código en una función que podemos llamar más tarde.
function initializeApp() {

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

    // --- Lógica para el Header Transformable (VERSIÓN FINAL Y MÁS CONFIABLE) ---
    const header = document.querySelector('header');
    if (header) {
        // La forma más segura de saber si estamos en la página principal
        // es buscar el ID único que le pusimos al body de esa página.
        const isHomePage = document.body.id === 'home-page';

        const handleHeaderState = () => {
            const scrollThreshold = 50;
            const isScrolled = window.scrollY > scrollThreshold;

            if (isScrolled) {
                // Al hacer scroll, el header siempre es sólido y se encoge.
                header.classList.add('header-solid');
                header.classList.add('header-scrolled');
            } else {
                // Al estar arriba, quitamos el efecto de encogimiento.
                header.classList.remove('header-scrolled');
                
                // Y decidimos sobre la transparencia basándonos en si es la página principal.
                if (isHomePage) {
                    // SOLO en la página principal, el header es transparente arriba.
                    header.classList.remove('header-solid');
                } else {
                    // En TODAS las demás páginas, el header es sólido siempre.
                    header.classList.add('header-solid');
                }
            }
        };

        // Establecemos el estado correcto tan pronto como se carga el script.
        handleHeaderState();
        
        // Y lo actualizamos en cada evento de scroll.
        window.addEventListener('scroll', handleHeaderState);
    }

    // --- Lógica para el Menú de Hamburguesa ---
    const hamburger = document.querySelector('.hamburger-menu');
    const navLinksMobile = document.querySelector('.nav-links-mobile');
    //const header = document.querySelector('header'); // Ya está definido arriba

    // Asegurarnos de que todos los elementos existen
    if (hamburger && navLinksMobile && header) {
        hamburger.addEventListener('click', () => {
            navLinksMobile.classList.toggle('active');
            header.classList.toggle('menu-open'); // Añadimos/quitamos la clase en el header

            const icon = hamburger.querySelector('i');
            if (navLinksMobile.classList.contains('active')) {
                icon.classList.remove('fa-bars');
                icon.classList.add('fa-times');
            } else {
                icon.classList.remove('fa-times');
                icon.classList.add('fa-bars');
            }
        });
    }

    /* --- Lógica para el Acordeón del Menú Móvil --- */
    const accordionHeaders = document.querySelectorAll('.accordion-header');

    accordionHeaders.forEach(header => {
        header.addEventListener('click', () => {
            const content = header.nextElementSibling;
            
            accordionHeaders.forEach(otherHeader => {
                if (otherHeader !== header) {
                    otherHeader.classList.remove('active');
                    otherHeader.nextElementSibling.style.maxHeight = null;
                }
            });

            header.classList.toggle('active');
            if (header.classList.contains('active')) {
                content.style.maxHeight = content.scrollHeight + 'px';
            } else {
                content.style.maxHeight = null;
            }
        });
    });

/* --- Lógica para Animación de Transición de Página (VERSIÓN CORREGIDA) --- */
// Seleccionamos todos los enlaces que tienen un href
const allLinks = document.querySelectorAll('a[href]');

allLinks.forEach(link => {
    link.addEventListener('click', function(event) {
        const destination = this.getAttribute('href');
        const isExternal = this.hostname !== window.location.hostname;

        // Condición para IGNORAR la animación y dejar que el navegador actúe normalmente.
        // Se ignora si:
        // 1. El enlace abre en una nueva pestaña.
        // 2. Es un enlace externo.
        // 3. Es un enlace de ancla, teléfono, correo, etc.
        // 4. Es un enlace especial para modales o scrolls.
        if (
            this.target === '_blank' ||
            isExternal ||
            destination.startsWith('#') ||
            destination.startsWith('mailto:') ||
            destination.startsWith('tel:') ||
            this.classList.contains('privacy-link') ||
            this.classList.contains('privacy-link-form')
        ) {
            return; // No hacemos nada, dejamos que el enlace funcione por defecto.
        }

        // Si llegamos aquí, es un enlace interno que navega a otra página.
        // Entonces, aplicamos la animación.
        event.preventDefault();
        document.body.classList.add('fade-out');
        
        setTimeout(() => {
            window.location.href = destination;
        }, 300);
    });
});

    /* --- LÓGICA PARA LA VENTANA FLOTANTE (MODAL) DE PRIVACIDAD --- */
    const privacyLinks = document.querySelectorAll('.privacy-link, .privacy-link-form');
    const privacyModal = document.getElementById('privacy-modal');
    const closeModalButton = document.getElementById('close-modal-button');

    if (privacyLinks.length > 0 && privacyModal && closeModalButton) {
        
        privacyLinks.forEach(link => {
            link.addEventListener('click', (event) => {
                event.preventDefault();
                privacyModal.classList.add('show');
            });
        });

        closeModalButton.addEventListener('click', () => {
            privacyModal.classList.remove('show');
        });

        privacyModal.addEventListener('click', (event) => {
            if (event.target === privacyModal) {
                privacyModal.classList.remove('show');
            }
        });
    }

    /* --- LÓGICA PARA SCROLL SUAVE AL FORMULARIO DE CONTACTO --- */
    const scrollButtons = document.querySelectorAll('a[href="#contact-section-placeholder"]');
    
    scrollButtons.forEach(button => {
        button.addEventListener('click', function (event) {
            event.preventDefault();
            const targetSection = document.getElementById('contact-section-placeholder');
            if (targetSection) {
                targetSection.scrollIntoView({
                    behavior: 'smooth'
                });
            }
        });
    });
    

    
    /* --- INICIAMOS LA LÓGICA DEL FORMULARIO DE FIREBASE --- */
    setupFormSubmit();

} // Cierre de initializeApp