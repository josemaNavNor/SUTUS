document.addEventListener('DOMContentLoaded', async () => {
    const token = localStorage.getItem('token');
    const apiUrl = 'http://localhost:3000/api/empleado/empleados';
    const employeeTableBody = document.getElementById('employeeTableBody');

    if (!employeeTableBody) {
        console.error('El elemento tbody no existe en el DOM');
        return;
    }

    // Llenar la tabla con los empleados
    try {
        const response = await fetch(apiUrl, {
            headers: {
                'Authorization': `Bearer ${token}`
            }
        });

        if (!response.ok) {
            throw new Error('Error al obtener los datos del servidor');
        }

        const data = await response.json();

        if (!Array.isArray(data)) {
            throw new Error('La respuesta de la API no es un array');
        }

        data.forEach(empleado => {
            const row = document.createElement('tr');
            row.innerHTML = `
                <td>${empleado.nombre}</td>
                <td>${empleado.primer_apellido}</td>
                <td>${empleado.segundo_apellido}</td>
                <td>${empleado.curp}</td>
                <td><button class="btn btn-danger" data-id="${empleado.idempleado}">Eliminar</button></td>
            `;
            employeeTableBody.appendChild(row);
        });
    } catch (error) {
        console.error('Error al cargar los empleados:', error);
        alert('Ocurrió un error al cargar los empleados. Por favor, inténtalo de nuevo más tarde.');
    }

    // Manejar el clic en el botón de eliminar
    employeeTableBody.addEventListener('click', async (e) => {
        if (e.target.classList.contains('btn-danger')) {
            const id = e.target.getAttribute('data-id');
            if (confirm('¿Estás seguro de que deseas eliminar este empleado?')) {
                try {
                    const response = await fetchWithToken(`http://localhost:3000/api/empleado/delete-empleado/${id}`, {
                        method: 'DELETE',
                    });

                    if (!response.ok) {
                        throw new Error('Error al eliminar el empleado');
                    }

                    alert('Empleado eliminado correctamente.');
                    location.reload(); // Recargar la página para reflejar los cambios
                } catch (error) {
                    console.error('Error al eliminar el empleado:', error);
                    alert('Ocurrió un error al eliminar el empleado. Por favor, inténtalo de nuevo más tarde.');
                }
            }
        }
    });
});

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