// Contenido de firebase-handler.js

// 1. Configuración de Firebase (sin cambios)
const firebaseConfig = {
    apiKey: "AIzaSyBiPCTAvq7Cifb3c2lhJW1tvPxC9aD8pgw",
    authDomain: "clientes-coomeva-marcela.firebaseapp.com",
    projectId: "clientes-coomeva-marcela",
    storageBucket: "clientes-coomeva-marcela.firebasestorage.app",
    messagingSenderId: "781549375889",
    appId: "1:781549375889:web:7c55c0d0bc076568f9ca30",
    measurementId: "G-TK2X8F5EPS"
};

// 2. Inicialización de Firebase (sin cambios)
firebase.initializeApp(firebaseConfig);
const db = firebase.firestore();

// 3. ¡NUEVA FUNCIÓN PARA MOSTRAR LA NOTIFICACIÓN TOAST!
function showToast(message, type) {
    const toast = document.getElementById('toast-notification');
    const toastMessage = document.getElementById('toast-message');
    const toastIcon = document.getElementById('toast-icon');

    if (!toast || !toastMessage || !toastIcon) return;

    // Asignamos el mensaje
    toastMessage.textContent = message;

    // Asignamos el estilo y el icono según el tipo (éxito o error)
    if (type === 'success') {
        toast.className = 'toast show toast--success';
        toastIcon.className = 'fa-solid fa-check-circle';
    } else {
        toast.className = 'toast show toast--error';
        toastIcon.className = 'fa-solid fa-exclamation-circle';
    }

    // Ocultamos la notificación después de 5 segundos
    setTimeout(() => {
        toast.className = toast.className.replace('show', '');
    }, 5000);
}


// 4. Lógica del formulario, ahora usando la nueva notificación
function setupFormSubmit() {
    const contactForm = document.getElementById('contact-form');

    if (contactForm) {
        contactForm.addEventListener('submit', (event) => {
            event.preventDefault();

            const fullName = document.getElementById('fullName').value;
            const email = document.getElementById('email').value;
            const phone = document.getElementById('phone').value;
            const submitButton = contactForm.querySelector('button[type="submit"]');

            // Deshabilitamos el botón para evitar envíos múltiples
            submitButton.disabled = true;

            db.collection("clientes").add({
                nombreCompleto: fullName,
                correo: email,
                telefono: phone,
                fechaRegistro: new Date(),
                // ¡NUEVO CAMPO AÑADIDO!
                paginaSolicitud: document.title // Captura el título de la página actual
            })
                .then((docRef) => {
                    // REEMPLAZAMOS EL ALERT CON EL TOAST DE ÉXITO
                    showToast("¡Gracias! Tus datos han sido enviados.", 'success');
                    contactForm.reset();

                    // ¡AÑADE ESTA LÍNEA PARA ENVIAR LA CONVERSIÓN A GOOGLE ANALYTICS!
                    gtag('event', 'generate_lead', { 'event_category': 'contact', 'event_label': 'form_submission' });
                })
                .catch((error) => {
                    // REEMPLAZAMOS EL ALERT CON EL TOAST DE ERROR
                    console.error("Error al guardar los datos: ", error);
                    showToast("Hubo un error al enviar tus datos.", 'error');
                })
                .finally(() => {
                    // Volvemos a habilitar el botón después del intento
                    submitButton.disabled = false;
                });
        });
    }
}