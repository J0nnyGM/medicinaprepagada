document.addEventListener('DOMContentLoaded', () => {
    const container = document.querySelector('.cards-container');
    const slideLeftButton = document.getElementById('slideLeft');
    const slideRightButton = document.getElementById('slideRight');

    if (!container || !slideLeftButton || !slideRightButton) {
        console.error("Error: Faltan elementos del carrusel.");
        return;
    }

    // --- Parte 1: Clonar tarjetas para el bucle ---
    const cards = Array.from(container.children);
    cards.forEach(card => {
        const clone = card.cloneNode(true);
        container.appendChild(clone);
    });

    const firstCard = container.querySelector('.plan-card');
    if (!firstCard) return;

    // --- Parte 2: Variables de estado y configuración ---
    const gap = parseFloat(window.getComputedStyle(container).getPropertyValue('gap')) || 0;
    const scrollAmountPerCard = firstCard.offsetWidth + gap;
    const autoScrollSpeed = 0.5; // Ajusta la velocidad del auto-scroll
    let animationFrameId; // Para controlar el bucle de animación

    // --- Parte 3: El bucle de animación con requestAnimationFrame ---
    function animationLoop() {
        // Mueve el scroll
        container.scrollLeft += autoScrollSpeed;

        // Lógica del bucle infinito
        const scrollWidth = container.scrollWidth;
        const loopThreshold = scrollWidth / 2;
        if (container.scrollLeft >= loopThreshold) {
            container.scrollLeft -= loopThreshold;
        }

        // Llama al siguiente fotograma
        animationFrameId = requestAnimationFrame(animationLoop);
    }

    function startAutoScroll() {
        // Evita iniciar múltiples bucles
        if (!animationFrameId) {
            animationFrameId = requestAnimationFrame(animationLoop);
        }
    }

    function stopAutoScroll() {
        cancelAnimationFrame(animationFrameId);
        animationFrameId = null; // Resetea el ID
    }

    // --- Parte 4: Funcionalidad de los botones ---
    let restartTimer;
    function handleManualScroll() {
        stopAutoScroll();
        clearTimeout(restartTimer); // Limpia cualquier temporizador anterior
        restartTimer = setTimeout(() => {
            startAutoScroll();
        }, 5000); // Reanuda después de 5 segundos de inactividad
    }

    slideRightButton.addEventListener('click', () => {
        container.scrollBy({ left: scrollAmountPerCard, behavior: 'smooth' });
        handleManualScroll();
    });

    slideLeftButton.addEventListener('click', () => {
        container.scrollBy({ left: -scrollAmountPerCard, behavior: 'smooth' });
        handleManualScroll();
    });

    // --- Parte 5: Pausar al pasar el mouse ---
    container.addEventListener('mouseenter', stopAutoScroll);
    container.addEventListener('mouseleave', startAutoScroll);

    // --- Iniciar la animación ---
    startAutoScroll();

    // --- Lógica del Navbar Transformable ---
    const navbar = document.querySelector('.navbar');
    const headerBar = document.querySelector('.header-bar');
    const headerBarHeight = headerBar ? headerBar.offsetHeight : 0;

    if (navbar) {
        function handleNavbarState() {
            const scrollThreshold = 50;

            if (window.scrollY > scrollThreshold) {
                navbar.classList.remove('initial-state');
                navbar.style.top = '0';
            } else {
                navbar.classList.add('initial-state');
                navbar.style.top = `${headerBarHeight}px`;
            }
        }
        window.addEventListener('scroll', handleNavbarState);
        handleNavbarState();
    }
    // --- Lógica para el Slider del Hero Section ---
    const slides = document.querySelectorAll('.hero-slider .slide');
    const dotsContainer = document.querySelector('.slider-dots');
    let currentSlide = 0;
    let slideInterval; // Para controlar el intervalo

    if (slides.length > 0 && dotsContainer) {
        // 1. Crear los puntos dinámicamente
        slides.forEach((slide, index) => {
            const dot = document.createElement('div');
            dot.classList.add('dot');
            dot.addEventListener('click', () => {
                showSlide(index); // Permite al usuario cambiar de slide al hacer clic
                resetInterval();
            });
            dotsContainer.appendChild(dot);
        });

        const dots = document.querySelectorAll('.slider-dots .dot');

        // 2. Función para mostrar el slide y actualizar el punto activo
        function showSlide(index) {
            currentSlide = index;

            // Actualiza la clase 'active' en los slides
            slides.forEach(slide => slide.classList.remove('active'));
            slides[index].classList.add('active');

            // Actualiza la clase 'active' en los puntos
            dots.forEach(dot => dot.classList.remove('active'));
            dots[index].classList.add('active');
        }

        // 3. Función para avanzar al siguiente slide
        function nextSlide() {
            let next = (currentSlide + 1) % slides.length;
            showSlide(next);
        }

        // 4. Reiniciar el intervalo automático
        function resetInterval() {
            clearInterval(slideInterval);
            slideInterval = setInterval(nextSlide, 5000); // Ahora dura 8000ms (8 segundos)
        }

        // Iniciar el carrusel
        showSlide(0); // Muestra el primer slide al cargar
        resetInterval(); // Inicia el cambio automático
    }

    // --- Lógica para el Header Transformable ---
    const header = document.querySelector('header');

    if (header) {
        function handleHeaderState() {
            const scrollThreshold = 50;
            const headerBar = document.querySelector('.header-bar'); // Make sure this line is here

            if (window.scrollY > scrollThreshold) {
                header.classList.add('header-scrolled');
                headerBar.classList.add('hidden'); // Add this line
            } else {
                header.classList.remove('header-scrolled');
                headerBar.classList.remove('hidden'); // Add this line
            }
        }
        // Ejecuta la función al cargar y al hacer scroll
        window.addEventListener('scroll', handleHeaderState);
        handleHeaderState();
    }

    // --- Lógica para el Menú de Hamburguesa ---
    const hamburger = document.querySelector('.hamburger-menu');
    const navLinks = document.querySelector('.nav-links');

    if (hamburger && navLinks) {
        hamburger.addEventListener('click', () => {
            navLinks.classList.toggle('active');

            // Cambia el ícono de hamburguesa por una 'X'
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
