/* 
Script para crear los tokens de refresco para consultar a la API, remplazar el metodo fetch con fetchWithToken para generar
los tokens actualizados, lo que hace esta función esque obtiene el token de la sesión con ese mismo toke realiza la petición
API agragando ademas el cuerpo de la solicitud, luego verifica si el token ya expiro, si el token y expiro entonces va a 
tratar de actualziar el token con el refreshToken que se almaceno en la sesión, si también el refresh Token no es valido o 
expiro remove el token que se tenia y el refreshToken de local Storage y redirije al usuario a la vista login.html para 
obtener un nuevo token, si todo sale bien se genera el nuevo Token y se almacena en el local Storage, solo es implementar
esta función, no se alcanzo a implmentar por falta de tiempo. 
*/

export async function fetchWithToken(url, options = {}) {
    let token = localStorage.getItem("token");

    const response = await fetch(url, {
        ...options,
        headers: {
            ...options.headers,
            "Authorization": `Bearer ${token}`
        }
    });

    if (response.status === 401) { // Token expirado
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
