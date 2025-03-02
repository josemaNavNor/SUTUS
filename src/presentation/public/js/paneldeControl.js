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
        //const refreshResponse = await fetch("http://10.19.60.237:3000/api/usuario/refresh-token", {
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

document.addEventListener('DOMContentLoaded', async () => {
    //const apiUrl = 'http://10.19.60.237:3000/api/admin/solicitudes';
    const apiUrl = 'http://localhost:3000/api/admin/solicitudes';
    const tbody = document.getElementById('tbody-content');
    const selectAllCheckbox = document.getElementById('selectAllRequests');
    const acceptButton = document.getElementById('acceptButton');
    const rejectButton = document.getElementById('rejectButton');

    try {
        const response = await fetchWithToken(apiUrl,{
            method: 'GET',
        });

        if (!response.ok) {
            throw new Error('Error al obtener los datos del servidor');
        }

        const data = await response.json();

        data.forEach(item => {
            const row = document.createElement('tr');

            // Checkbox celda
            const checkboxCell = document.createElement('td');
            const checkboxDiv = document.createElement('div');
            const checkboxInput = document.createElement('input');
            checkboxInput.type = 'checkbox';
            checkboxInput.classList.add('form-check-input');
            checkboxInput.dataset.id = item.idsolicitudes_prestaciones;
            checkboxInput.dataset.userId = item.id_usuario;
            checkboxInput.dataset.tipoSolicitud = item.nombre_tipo_solicitud;
            checkboxInput.dataset.documentoSolicitado = item.documento_solicitado;
            checkboxInput.dataset.archivoAdicional = item.archivo_adicional;
            checkboxDiv.appendChild(checkboxInput);
            checkboxCell.appendChild(checkboxDiv);
            checkboxCell.classList.add('text-center', 'align-middle');

            // Empleado celda
            const empleadoCell = document.createElement('td');
            empleadoCell.textContent = item.nombre_empleado;
            empleadoCell.classList.add('text-center', 'align-middle');

            // Fecha celda
            const fechaCell = document.createElement('td');
            fechaCell.textContent = item.fecha_solicitud;
            fechaCell.classList.add('text-center', 'align-middle');

            // Estado celda
            const estadoCell = document.createElement('td');
            estadoCell.textContent = item.estado;
            estadoCell.classList.add('text-center', 'align-middle');

            // Tipo celda
            const tipoCell = document.createElement('td');
            tipoCell.textContent = item.nombre_tipo_solicitud;
            tipoCell.classList.add('text-center', 'align-middle');

            // Documento celda
            const documentoCell = document.createElement('td');
            const documentoLink = document.createElement('a');
            //documentoLink.href = `http://10.19.60.237:3000/Solicitudes/${item.documento_solicitado}`;
            documentoLink.href = `http://localhost:3000/Solicitudes/${item.documento_solicitado}`;
            documentoLink.textContent = item.documento_solicitado;
            documentoLink.target = '_blank'; // Abre el enlace en una nueva pestaña
            documentoCell.appendChild(documentoLink);
            documentoCell.classList.add('text-center', 'align-middle');

            // Archivo celda
            const archivoCell = document.createElement('td');
            const archivoLink = document.createElement('a');
            //archivoLink.href = `http://10.19.60.237:3000/Solicitudes/${item.archivo_adicional}`;
            archivoLink.href = `http://localhost:3000/Solicitudes/${item.archivo_adicional}`;
            archivoLink.textContent = item.archivo_adicional;
            archivoLink.target = '_blank'; // Abre el enlace en una nueva pestaña
            archivoCell.appendChild(archivoLink);
            archivoCell.classList.add('text-center', 'align-middle');

            // Agregar celdas a la fila
            row.appendChild(checkboxCell);
            row.appendChild(empleadoCell);
            row.appendChild(fechaCell);
            row.appendChild(estadoCell);
            row.appendChild(tipoCell);
            row.appendChild(documentoCell);
            row.appendChild(archivoCell);

            // Agregar fila al elemento tbody
            tbody.appendChild(row);
        });

        // Event listener for select all checkbox
        selectAllCheckbox.addEventListener('change', function() {
            const checkboxes = tbody.querySelectorAll('input[type="checkbox"]');
            checkboxes.forEach(checkbox => {
                checkbox.checked = selectAllCheckbox.checked;
            });
            toggleButtons();
        });

        // Event listener for individual checkboxes
        tbody.addEventListener('change', function(event) {
            if (event.target.type === 'checkbox') {
                toggleButtons();
            }
        });
    } catch (error) {
        console.error('Error al cargar los datos:', error);
        alert(`Hubo un error al cargar los datos: ${error.message}`);
    }
});

function toggleButtons() {
    const checkboxes = document.querySelectorAll('#tbody-content input[type="checkbox"]');
    const anyChecked = Array.from(checkboxes).some(checkbox => checkbox.checked);
    acceptButton.disabled = !anyChecked;
    rejectButton.disabled = !anyChecked;
}



