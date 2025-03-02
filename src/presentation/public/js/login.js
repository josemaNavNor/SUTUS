
document.getElementById('loginForm').addEventListener('submit', async function(event) {
    event.preventDefault();
    const email = document.getElementById('email').value;
    const password = document.getElementById('password').value;

    // console.log({ email, password }); // Verificar los datos enviados

    const alertContainer = document.getElementById('alertContainer');

    try {
        //const response = await fetch('http://10.19.60.237:3000/api/usuario/login', {
        const response = await fetch('http://localhost:3000/api/usuario/login', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ email, password }),
        });

        if (!response.ok) {
            const errorData = await response.json();
            throw new Error(errorData.message || 'Error en la solicitud');
        }

        const data = await response.json();

        // Almacenar el token, ID y rol en localStorage
        localStorage.setItem('token', data.accessToken);
        localStorage.setItem('refreshToken', data.refreshToken);
        localStorage.setItem('id', data.userId);
        localStorage.setItem('role', data.role);

        alertContainer.innerHTML = `
            <div class="alert alert-success">
                Sesión iniciada correctamente.
            </div>
        `;

        // Redirigir a la página principal después de 2 segundos
        setTimeout(() => {
            window.location.href = '/views/home.html';
        }, 2000);

    } catch (error) {
        alertContainer.innerHTML = `
            <div class="alert alert-danger alert-dismissible fade show" role="alert">
                ${error.message}
                <button type="button" class="btn-close" data-bs-dismiss="alert" aria-label="Close"></button>
            </div>
        `;
    }
});

