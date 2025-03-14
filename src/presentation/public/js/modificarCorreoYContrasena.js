async function fetchWithToken(url, options = {}) {
    let token = localStorage.getItem("token");

    if (!token) {
        alert("No hay un token válido. Inicia sesión nuevamente.");
        window.location.href = "/views/login.html";
        return;
    }

    const response = await fetch(url, {
        ...options,
        headers: {
            ...options.headers,
            "Authorization": `Bearer ${token}`
        }
    });

    if (response.status === 401) { // Token inválido o expirado
        const refreshToken = localStorage.getItem("refreshToken");

        if (!refreshToken) {
            alert("No hay refreshToken disponible. Inicia sesión nuevamente.");
            localStorage.removeItem("token");
            window.location.href = "/views/login.html";
            return;
        }

        const refreshResponse = await fetch("http://localhost:3000/api/usuario/refresh-token", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ refreshToken })
        });

        if (!refreshResponse.ok) {
            console.error("Error al refrescar el token:", await refreshResponse.text());
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

document.addEventListener('DOMContentLoaded', async () => {
    const id = localStorage.getItem('id');
    if (!id) {
        alert("No hay un ID de usuario. Inicia sesión nuevamente.");
        window.location.href = "/views/login.html";
        return;
    }

    const apiUrl = `http://localhost:3000/api/empleado/get-empleado/${id}`;

    try {
        const response = await fetchWithToken(apiUrl);
        if (!response.ok) {
            throw new Error(`Error al obtener datos del empleado: ${response.statusText}`);
        }

        const employeeData = await response.json();

        document.getElementById('correo').value = employeeData.correo || '';

    } catch (error) {
        console.error('Error:', error);
        alert('Hubo un problema al cargar los datos del empleado.');
    }

    const employeeForm = document.getElementById('employeeForm');

    if (!employeeForm) {
        console.error("Formulario no encontrado en el DOM.");
        return;
    }

    // Un único evento submit para manejar ambas actualizaciones
    employeeForm.addEventListener('submit', async (e) => {
        e.preventDefault();

        const formData = new FormData(employeeForm);
        const formValues = Object.fromEntries(formData.entries());

        // Filtrar los campos vacíos
        const filteredValues = {};
        for (const key in formValues) {
            if (formValues[key]) {
                filteredValues[key] = formValues[key];
            }
        }

        if (Object.keys(filteredValues).length === 0) {
            alert('Por favor, llena al menos un campo para modificar.');
            return;
        }

        try {
            let response;
            let successMessage = '';

            if (filteredValues.correo) {
                response = await fetchWithToken(`http://localhost:3000/api/empleado/update-email/${id}`, {
                    method: 'PUT',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ correo: filteredValues.correo }),
                });
                successMessage = 'Correo del usuario actualizado correctamente.';
            }

            if (filteredValues.contrasena) {
                response = await fetchWithToken(`http://localhost:3000/api/empleado/update-password/${id}`, {
                    method: 'PUT',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ password: filteredValues.contrasena }) 
                });
                successMessage = 'Contraseña del usuario actualizada correctamente.';
            }

            const result = await response.json();

            if (response.ok) {
                alert(successMessage);
                location.reload();
            } else {
                console.error("Error en la actualización:", result);
                alert('Ocurrió un error al actualizar los datos.');
            }
        } catch (error) {
            console.error('Error en la actualización:', error);
            alert('Ocurrió un error al actualizar los datos del usuario.');
        }
    });
});
