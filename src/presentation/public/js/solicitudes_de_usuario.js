document.addEventListener('DOMContentLoaded', async () => {
    const userId = localStorage.getItem('id'); // Obtener el id del usuario desde el almacenamiento local
    const token = localStorage.getItem('token');
    const apiUrl = `http://10.19.60.237:3000/api/usuario/solicitudes-usuario/${userId}`; // URL de la API
    const tbody = document.getElementById('tbody-content'); // Referencia al tbody de la tabla
    const actualizarBtn = document.getElementById('actualizar-btn'); // Botón de actualizar solicitud

    console.log(token);
    console.log(userId);

    // Función para habilitar/deshabilitar los checkboxes
    const handleCheckboxSelection = () => {
        const checkboxes = document.querySelectorAll('input[type="checkbox"]');
        let selectedCheckbox = null;

        // Encontrar el checkbox seleccionado
        checkboxes.forEach(checkbox => {
            if (checkbox.checked) {
                selectedCheckbox = checkbox;
            }
        });

        // Habilitar/deshabilitar los checkboxes según la selección
        checkboxes.forEach(checkbox => {
            if (selectedCheckbox) {
                checkbox.disabled = checkbox !== selectedCheckbox; // Deshabilitar los no seleccionados
            } else {
                checkbox.disabled = false; // Habilitar todos si no hay ninguno seleccionado
            }
        });

        // Habilitar o deshabilitar el botón de actualización
        actualizarBtn.disabled = !selectedCheckbox;
    };

    // Evento para detectar cambios en los checkboxes
    tbody.addEventListener('change', (event) => {
        if (event.target.type === 'checkbox') {
            handleCheckboxSelection(); // Manejar la selección
        }
    });

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
    

    try {
         const response = await fetchWithToken(apiUrl, {method: "GET"});

         /* Implementación antigua implementarse en caso de error */
        // const response = await fetch(apiUrl, {
        //     method: 'GET',
        //     headers: {
        //         'Authorization': `Bearer ${token}` // Asegúrate de que el token esté aquí
        //     }
        // });

        if (!response.ok) {
            throw new Error('Error al obtener los datos del servidor');
        }

        const data = await response.json(); // Recuperar los datos en formato JSON

        // Iterar sobre los datos recibidos para crear las filas de la tabla
        data.forEach(item => {
            const row = document.createElement('tr'); // Crear una nueva fila

            // Celda de checkbox
            const checkboxCell = document.createElement('td');
            const checkboxDiv = document.createElement('div');
            const checkboxInput = document.createElement('input');
            checkboxInput.type = 'checkbox';
            checkboxInput.classList.add('form-check-input');
            checkboxInput.dataset.id = item.idsolicitudes_prestaciones; // Asignamos el id de la solicitud
            checkboxInput.dataset.archivoActual = item.archivo_adicional;
            checkboxDiv.appendChild(checkboxInput);
            checkboxCell.appendChild(checkboxDiv);
            checkboxCell.classList.add('text-center', 'align-middle'); // Centrar el checkbox

            // Celda de nombre del empleado
            const empleadoCell = document.createElement('td');
            empleadoCell.textContent = item.nombre_empleado;
            empleadoCell.classList.add('text-center', 'align-middle');

            // Celda de fecha de solicitud
            const fechaCell = document.createElement('td');
            fechaCell.textContent = item.fecha_solicitud;
            fechaCell.classList.add('text-center', 'align-middle');

            // Celda de estado
            const estadoCell = document.createElement('td');
            estadoCell.textContent = item.estado;
            estadoCell.classList.add('text-center', 'align-middle');

            // Celda de tipo de solicitud
            const tipoCell = document.createElement('td');
            tipoCell.textContent = item.nombre_tipo_solicitud;
            tipoCell.classList.add('text-center', 'align-middle');

            // Celda de documento solicitado
            const documentoCell = document.createElement('td');
            documentoCell.textContent = item.documento_solicitado;
            documentoCell.classList.add('text-center', 'align-middle');

            // Celda de archivo adicional
            const archivoCell = document.createElement('td');
            const archivoInput = document.createElement('input');
            archivoInput.type = 'file';
            archivoInput.classList.add('form-control');
            archivoInput.dataset.id = item.idsolicitudes_prestaciones; // Asignamos el id de la solicitud al input
            archivoCell.classList.add('text-center', 'align-middle');
            archivoCell.appendChild(archivoInput); // Agregamos el input file a la celda

            // Agregar todas las celdas a la fila
            row.appendChild(checkboxCell);
            row.appendChild(empleadoCell);
            row.appendChild(fechaCell);
            row.appendChild(estadoCell);
            row.appendChild(tipoCell);
            row.appendChild(documentoCell);
            row.appendChild(archivoCell);

            // Agregar la fila a la tabla
            tbody.appendChild(row);
        });
        

    } catch (error) {
        console.error('Error al cargar los datos:', error);
        alert(`Hubo un error al cargar los datos: ${error.message}`);
    }

    // Función para manejar la actualización de la solicitud
    actualizarBtn.addEventListener('click', async () => {
        const selectedCheckbox = document.querySelector('input[type="checkbox"]:checked'); // Checkbox seleccionado
    if (!selectedCheckbox) {
        alert('Por favor, selecciona una solicitud');
        return;
    }

    const archivoActual = selectedCheckbox.dataset.archivoActual;
    console.log('Archivo actual:', archivoActual);
    const solicitudId = selectedCheckbox.dataset.id; // Obtener el id de la solicitud seleccionada
    console.log('ID de la solicitud seleccionada:', solicitudId);
    const archivoInput = document.querySelector(`input[type="file"][data-id="${solicitudId}"]`); // Obtener el input file correspondiente
    console.log('Input de archivo encontrado:', archivoInput);
    if (!archivoInput) {
        alert('No se encontró el campo de archivo correspondiente. Por favor, revisa la tabla.');
        return;
    }

    const archivo = archivoInput.files[0]; // Obtener el archivo seleccionado

    if (!archivo) {
        alert('Por favor, selecciona un archivo antes de continuar.');
        return;
    }

    const estado = 'en espera'; // Estado fijo o dinámico según tus necesidades
    const archivoNombre = archivo.name; // Nombre del archivo seleccionado

    try {
        //Enviar el estado y el nombre del archivo como JSON
        
        const updateResponse = await fetchWithToken(`http://10.19.60.237:3000/api/usuario/update-request/${solicitudId}`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                nuevoEstado: estado,
                nuevoArchivo: archivoNombre,
            }),
        });

        const updateResult = await updateResponse.json();
        if (!updateResponse.ok) {
            alert(`Error al actualizar la solicitud: ${updateResult.message}`);
            return;
        }

        //Subir el archivo mediante FormData
        const archivoFormData = new FormData();
        archivoFormData.append('archivoActual', archivoActual); // Enviar el nombre del archivo actual
        archivoFormData.append('nuevoArchivo', archivo); // Agregar el archivo al FormData

        const fileResponse = await fetch('http://10.19.60.237:3000/api/file/actualizar-archivo', {
            method: 'POST',
            body: archivoFormData,
        });

        const fileResult = await fileResponse.json();
        if (fileResponse.ok) {
            alert('Archivo actualizado correctamente');
        } else {
            alert(`Error al actualizar el archivo: ${fileResult.message}`);
        }
    } catch (error) {
        console.error('Error al actualizar la solicitud o archivo:', error);
        alert('Hubo un error al actualizar la solicitud o el archivo.');
    }

    });
});
