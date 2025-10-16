// app/login.js

// 1. Configuración de Firebase (debe estar en ambos scripts)
const firebaseConfig = {
    apiKey: "AIzaSyBiPCTAvq7Cifb3c2lhJW1tvPxC9aD8pgw",
    authDomain: "clientes-coomeva-marcela.firebaseapp.com",
    projectId: "clientes-coomeva-marcela",
    storageBucket: "clientes-coomeva-marcela.firebasestorage.app",
    messagingSenderId: "781549375889",
    appId: "1:781549375889:web:7c55c0d0bc076568f9ca30"
};

// 2. Inicializamos Firebase y obtenemos el servicio de autenticación
firebase.initializeApp(firebaseConfig);
const auth = firebase.auth();

// 3. Nueva lógica de inicio de sesión
document.getElementById('login-form').addEventListener('submit', function(e) {
    e.preventDefault();
    
    const email = document.getElementById('email').value.trim();
    const password = document.getElementById('password').value.trim();
    const errorMessage = document.getElementById('error-message');

    // 4. Usamos Firebase para iniciar sesión de forma segura
    auth.signInWithEmailAndPassword(email, password)
        .then((userCredential) => {
            // Si el inicio de sesión es exitoso, redirigimos al dashboard
            window.location.href = 'dashboard.html';
        })
        .catch((error) => {
            // Si Firebase devuelve un error, lo mostramos
            errorMessage.textContent = 'Usuario o contraseña incorrectos.';
            console.error("Error de autenticación:", error);
        });
});