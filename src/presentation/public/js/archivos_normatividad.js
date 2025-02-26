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

document.getElementById('uploadButton').addEventListener('click', async () => {
    const fileInput = document.getElementById('fileInput');
    const file = fileInput.files[0];
    
    if (!file) {
        alert('Por favor, selecciona un archivo antes de subir.');
        return;
    }

    const formData = new FormData();
    formData.append('file', file);

    try {
        const response = await fetchWithToken('http://10.19.60.237:3000/api/admin/upload-archivo-normatividad', {
            method: 'POST',
            body: formData,
        });        

        if (response.ok) {
            const data = await response.json();
            document.getElementById('contenido').innerHTML = data.content || '<p class="text-danger">No se recibió contenido del servidor.</p>';
        } else {
            const errorData = await response.json();
            alert(errorData.message || 'Error al procesar el archivo.');
        }
    } catch (error) {
        console.error('Error al comunicarse con el servidor:', error);
        alert(`Hubo un error al intentar subir el archivo: ${error.message || error}`);
    }
});

