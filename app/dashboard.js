// app/dashboard.js

// 1. Configuración de Firebase (sin cambios)
const firebaseConfig = {
    apiKey: "AIzaSyBiPCTAvq7Cifb3c2lhJW1tvPxC9aD8pgw",
    authDomain: "clientes-coomeva-marcela.firebaseapp.com",
    projectId: "clientes-coomeva-marcela",
    storageBucket: "clientes-coomeva-marcela.firebasestorage.app",
    messagingSenderId: "781549375889",
    appId: "1:781549375889:web:7c55c0d0bc076568f9ca30"
};

firebase.initializeApp(firebaseConfig);
const auth = firebase.auth();
const db = firebase.firestore();

// Variables globales para el estado del dashboard
let currentClientsData = []; // Almacenará todos los clientes
let currentStatusFilter = 'Pendiente'; // La pestaña activa por defecto

// 2. Proteger la página y activar la escucha (sin cambios)
auth.onAuthStateChanged(user => {
    if (user) {
        listenForClients();
        setupTabListeners();
    } else {
        window.location.href = 'index.html';
    }
});

// 3. Lógica para cerrar sesión (sin cambios)
document.getElementById('logout-button').addEventListener('click', () => {
    auth.signOut();
});

// 4. Lógica para las pestañas
function setupTabListeners() {
    const tabButtons = document.querySelectorAll('.tab-button');
    tabButtons.forEach(button => {
        button.addEventListener('click', () => {
            // Actualizar el estado del filtro
            currentStatusFilter = button.dataset.status;

            // Actualizar la clase 'active' en la UI
            tabButtons.forEach(btn => btn.classList.remove('active'));
            button.classList.add('active');

            // Volver a renderizar la tabla con los datos ya cargados
            renderTable();
        });
    });
}

// 5. Escucha de datos en tiempo real
function listenForClients() {
    db.collection("clientes")
      .orderBy("fechaRegistro", "desc")
      .onSnapshot((querySnapshot) => {
        // Almacenamos los datos más recientes
        currentClientsData = querySnapshot.docs;
        
        // Renderizamos la tabla con el filtro actual
        renderTable();

        // Actualizamos las estadísticas globales
        updateStats(querySnapshot);
    });
}

// 6. NUEVA FUNCIÓN para renderizar la tabla
function renderTable() {
    const clientsTbody = document.getElementById('clients-tbody');
    clientsTbody.innerHTML = ''; // Limpiamos la tabla

    const filteredClients = currentClientsData.filter(doc => {
        const client = doc.data();
        // Condición especial para "Pendiente": incluye los que no tienen estado
        if (currentStatusFilter === 'Pendiente') {
            return !client.estado || client.estado === 'Pendiente';
        }
        return client.estado === currentStatusFilter;
    });

    filteredClients.forEach(doc => {
        const client = doc.data();
        const row = document.createElement('tr');
        const formattedDate = client.fechaRegistro ? new Date(client.fechaRegistro.seconds * 1000).toLocaleString() : 'Fecha no disponible';

        let pageTitle = client.paginaSolicitud || 'No especificada';
        if (pageTitle.includes(' - ')) {
            pageTitle = pageTitle.split(' - ')[0];
        }

        row.innerHTML = `
            <td>${client.nombreCompleto || ''}</td>
            <td>${client.correo || ''}</td>
            <td>${client.telefono || ''}</td>
            <td>${pageTitle}</td>
            <td>${formattedDate}</td>
            <td>
                <select class="status-select" data-id="${doc.id}">
                    <option value="Pendiente" ${(!client.estado || client.estado === 'Pendiente') ? 'selected' : ''}>Pendiente</option>
                    <option value="Aprobado" ${client.estado === 'Aprobado' ? 'selected' : ''}>Aprobado</option>
                    <option value="Rechazado" ${client.estado === 'Rechazado' ? 'selected' : ''}>Rechazado</option>
                </select>
            </td>
        `;
        clientsTbody.appendChild(row);
    });
    
    // Añadimos los listeners a los nuevos 'select'
    addEventListenersToSelects();
}

// 7. NUEVA FUNCIÓN para actualizar estadísticas
function updateStats(querySnapshot) {
    let todayRegistrations = 0;
    const today = new Date().setHours(0, 0, 0, 0);

    querySnapshot.forEach(doc => {
        const client = doc.data();
        if (client.fechaRegistro && client.fechaRegistro.toDate) {
            const clientDate = client.fechaRegistro.toDate().setHours(0, 0, 0, 0);
            if (clientDate === today) {
                todayRegistrations++;
            }
        }
    });

    document.getElementById('total-clients').textContent = querySnapshot.size;
    document.getElementById('today-clients').textContent = todayRegistrations;
}

// 8. Función para actualizar el estado del cliente (sin cambios)
// NUEVA FUNCIÓN para mostrar la notificación toast
function showDashboardToast(message) {
    const toast = document.getElementById('dashboard-toast');
    if (!toast) return;

    toast.textContent = message;
    toast.classList.add('show');

    // Ocultar el toast después de 3 segundos
    setTimeout(() => {
        toast.classList.remove('show');
    }, 3000);
}

// Función para actualizar el estado del cliente (MODIFICADA)
function updateClientStatus(docId, status) {
    db.collection("clientes").doc(docId).update({
        estado: status
    })
    .then(() => {
        // REEMPLAZAMOS EL CONSOLE.LOG CON LA NOTIFICACIÓN
        showDashboardToast("Estado actualizado correctamente");
    })
    .catch((error) => {
        console.error("Error al actualizar el estado: ", error);
        // Opcional: podrías mostrar un toast de error aquí también
    });
}


// 9. Función para añadir listeners a los 'select' de estado
function addEventListenersToSelects() {
    document.querySelectorAll('.status-select').forEach(select => {
        select.addEventListener('change', (e) => {
            const docId = e.target.dataset.id;
            const newStatus = e.target.value;
            updateClientStatus(docId, newStatus);
        });
    });
}