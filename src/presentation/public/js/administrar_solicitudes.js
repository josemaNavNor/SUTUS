let notifications = JSON.parse(localStorage.getItem('notifications')) || [];

function updateBadge() {
    const userId = localStorage.getItem('id');
    const notificationBadge = document.getElementById('notificationBadge');
    if (!notificationBadge) return; // Si el elemento no existe, salimos de la función
    const count = notifications.filter(notification => notification.userId === userId).length;
    notificationBadge.textContent = count;
    notificationBadge.style.display = count > 0 ? 'inline-block' : 'none';
}

function addNotification(typeSolicitud, message) {
    const toastContainer = document.querySelector('.toast-container');
    const toast = document.createElement('div');
    toast.classList.add('toast');
    toast.setAttribute('role', 'alert');
    toast.setAttribute('aria-live', 'assertive');
    toast.setAttribute('aria-atomic', 'true');
    toast.innerHTML = `
        <div class="toast-header">
            <strong class="me-auto">Aprobación de solicitud</strong>
            <small class="text-muted">just now</small>
            <button type="button" class="btn-close" data-bs-dismiss="toast" aria-label="Close"></button>
        </div>
        <div class="toast-body">
            ${message}
        </div>
    `;
    toastContainer.appendChild(toast);
    const toastBootstrap = bootstrap.Toast.getOrCreateInstance(toast);
    toastBootstrap.show();
}

function showNotifications() {
    const toastContainer = document.querySelector('.toast-container');
    toastContainer.innerHTML = ''; // Limpiar notificaciones anteriores
    const userId = localStorage.getItem('id');
    notifications.forEach(notification => {
        if (notification.userId === userId) {
            addNotification(notification.typeSolicitud, notification.message);
        }
    });
    updateBadge();
}

function addToNotifications(idRequest, tipoSolicitud, message) {
    const userId = localStorage.getItem('id');
    notifications.push({ idRequest, tipoSolicitud, userId, message });
    localStorage.setItem('notifications', JSON.stringify(notifications));
    updateBadge();
}

function clearNotifications() {
    const userId = localStorage.getItem('id');
    notifications = notifications.filter(notification => notification.userId !== userId);
    localStorage.setItem('notifications', JSON.stringify(notifications));
    updateBadge();
}

async function fetchWithToken(url, options = {}) {
    let token = localStorage.getItem("token");

    const response = await fetch(url, {
        ...options,
        headers: {
            ...options.headers,
            "Authorization": `Bearer ${token}`
        }
    });

    if (response.status === 401) {
        const refreshToken = localStorage.getItem("refreshToken");
        const refreshResponse = await fetch("http://10.19.60.237:3000/api/usuario/refresh-token", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ refreshToken })
        });

        if (!refreshResponse.ok) {
            alert("Sesión expirada, por favor inicia sesión nuevamente.");
            localStorage.removeItem("token");
            localStorage.removeItem("refreshToken");
            window.location.href = "/views/login.html";
            return;
        }

        const { accessToken } = await refreshResponse.json();
        localStorage.setItem("token", accessToken);

        // Reintentar la solicitud original con el nuevo token
        return fetch(url, {
            ...options,
            headers: {
                ...options.headers,
                "Authorization": `Bearer ${accessToken}`
            }
        });
    }

    return response;
}

async function updateRequestStatus(idRequest, newState) {
    const token = localStorage.getItem('token');
    try {
        const response = await fetchWithToken(`http://10.19.60.237:3000/api/admin/solicitudes/${idRequest}/estado`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ estado: newState })
        });

        if (!response.ok) {
            throw new Error('Error al actualizar el estado de la solicitud');
        }

        const result = await response.json();
        return result;
    } catch (error) {
        console.error('Error al actualizar el estado de la solicitud:', error);
        alert(`Hubo un error al actualizar el estado de la solicitud: ${error.message}`);
    }
}

async function aceptarSeleccionados() {
    const checkboxes = document.querySelectorAll('#tbody-content input[type="checkbox"]:checked');
    const selectedRequests = Array.from(checkboxes);

    if (selectedRequests.length === 0) {
        alert('Selecciona al menos una solicitud.');
        return;
    }

    const promises = selectedRequests.map(async checkbox => {
        const idRequest = checkbox.dataset.id;
        const tipoSolicitud = checkbox.dataset.tipoSolicitud;
        await updateRequestStatus(idRequest, 'Aceptada');
        const message = `Su solicitud de ${tipoSolicitud} fue aprobada con éxito!`;
        addToNotifications(idRequest, tipoSolicitud, message);
    });

    await Promise.all(promises);
    alert('Solicitudes aceptadas y notificaciones enviadas');
    location.reload(); // Recargar la página para reflejar los cambios
}

async function rechazarSeleccionados() {
    const messageText = document.getElementById('message-text').value;
    const checkboxes = document.querySelectorAll('#tbody-content input[type="checkbox"]:checked');
    const selectedRequests = Array.from(checkboxes);

    if (selectedRequests.length === 0) {
        alert('Selecciona al menos una solicitud.');
        return;
    }

    const promises = selectedRequests.map(async checkbox => {
        const idRequest = checkbox.dataset.id;
        const tipoSolicitud = checkbox.dataset.tipoSolicitud;
        await updateRequestStatus(idRequest, 'Rechazada');
        const message = `Su solicitud de ${tipoSolicitud} fue rechazada por ${messageText}, favor de volver a subir los archivos correspondientes.`;
        addToNotifications(idRequest, tipoSolicitud, message);
    });

    await Promise.all(promises);
    alert('Solicitudes rechazadas y notificaciones enviadas');
    location.reload(); // Recargar la página para reflejar los cambios
    $('#rechazarModal').modal('hide');
}

document.addEventListener('DOMContentLoaded', () => {
    const notificationButton = document.getElementById('notificationButton');
    const notificationOffcanvas = document.getElementById('notificationOffcanvas');
    if (notificationButton) {
        notificationButton.addEventListener('click', showNotifications);
    }
    if (notificationOffcanvas) {
        notificationOffcanvas.addEventListener('hidden.bs.offcanvas', clearNotifications);
    }
    updateBadge();
});

