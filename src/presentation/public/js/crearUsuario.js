/* Solución provicional*/
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

document.getElementById('employeeForm').addEventListener('submit', async function(event) {
    event.preventDefault();

    const token = localStorage.getItem('token');
    const formData = new FormData(event.target);
    const data = {};
    formData.forEach((value, key) => {
        data[key] = value;
    });

    try {
        const response = await fetchWithToken('http://10.19.60.237:3000/api/empleado/create-empleado', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`
            },
            body: JSON.stringify(data)
        });

        if (!response.ok) {
            const errorData = await response.json();
            if (errorData.errors) {
              let errorMessages = errorData.errors.map(error => `${error.param}: ${error.msg}`).join('\n');
              alert(`Errores en el formulario:\n${errorMessages}`);
              return;
            }
            throw new Error('Error desconocido');
        }

        const result = await response.json();
        alert('Empleado añadido exitosamente');
    } catch (error) {
        console.error('Error:', error);
        alert(`Hubo un error al añadir el empleado: ${error.message}`);
    }
});