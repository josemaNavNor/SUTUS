/* Solución provisional */
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
        const refreshResponse = await fetch("http://localhost:3000/api/usuario/refresh-token", {
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

const id = localStorage.getItem('id');

async function obtenerEmpleado(id) {
    const token = localStorage.getItem('token');

    try {
        const response = await fetchWithToken(`http://localhost:3000/api/empleado/get-empleado/${id}`, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`
            }
        });

        if (!response.ok) {
            throw new Error('Error al obtener la información del empleado');
        }

        const empleado = await response.json();
        document.getElementById('nombre').textContent = empleado.nombre;
        document.getElementById('primerApellido').textContent = empleado.primer_apellido;
        document.getElementById('segundoApellido').textContent = empleado.segundo_apellido;
        document.getElementById('domicilioTrabajador').textContent = empleado.domicilio;
        document.getElementById('correo').textContent = empleado.correo;
        document.getElementById('fechaNacimiento').textContent = empleado.fecha_nacimiento;
    } catch (error) {
        console.error('Error:', error);
        alert(`Hubo un error al obtener la información del empleado: ${error.message}`);
    }
}

document.addEventListener('DOMContentLoaded', function() {
    obtenerEmpleado(id);
});