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

document.addEventListener('DOMContentLoaded', async () => {
    const token = localStorage.getItem('token');
    const apiUrl = 'http://localhost:3000/api/empleado/empleados';
    const dropDown = document.getElementById('selectUser');
    const employeeForm = document.getElementById('employeeForm');
    const loadingIndicator = document.getElementById('loadingIndicator'); // Agrega un indicador de carga en tu HTML

    if (!dropDown) {
        console.error('El elemento dropDown no existe en el DOM');
        return;
    }

    // Llenar el dropdown con los empleados
    try {
        const response = await fetch(apiUrl);

        if (!response.ok) {
            throw new Error('Error al obtener los datos del servidor');
        }

        const data = await response.json();

        if (!Array.isArray(data)) {
            throw new Error('La respuesta de la API no es un array');
        }

        dropDown.innerHTML = '<option selected>Seleccione un empleado</option>';
        data.forEach(empleado => {
            const option = document.createElement('option');
            const nombreCompleto = `${empleado.nombre} ${empleado.primer_apellido} ${empleado.segundo_apellido}`;
            option.value = empleado.idempleado; // Asignar el idempleado como value
            option.textContent = nombreCompleto; // Asignar el nombre completo como texto visible
            dropDown.appendChild(option);
        });
    } catch (error) {
        console.error('Error al cargar los empleados:', error);
        alert('Ocurrió un error al cargar los empleados. Por favor, inténtalo de nuevo más tarde.');
    } finally {
        // Ocultar indicador de carga
        //loadingIndicator.style.display = 'none';
    }

    // Manejar el cambio de selección en el dropdown
    dropDown.addEventListener('change', async () => {
        const id = dropDown.value;
        if (id && id !== "Seleccione un empleado") {
            try {
                const response = await fetchWithToken(`http://localhost:3000/api/empleado/get-empleado/${id}`);
                if (!response.ok) {
                    throw new Error('Error al obtener los datos del empleado');
                }

                const data = await response.json();
                document.getElementById('nombre').value = data.nombre;
                document.getElementById('primerApellido').value = data.primer_apellido;
                document.getElementById('segundoApellido').value = data.segundo_apellido;
                document.getElementById('curp').value = data.curp;
                document.getElementById('empresa').value = data.entidad;
                document.getElementById('domicilioTrabajador').value = data.domicilio;
                document.getElementById('domicilioEmpresa').value = data.domicilio_empresa;
                document.getElementById('correo').value = data.correo;
                //document.getElementById('contrasena').value = data.contraseña;
                document.getElementById('fechaIngresoEmpresa').value = data.fecha_ingreso_empresa;
                document.getElementById('fechaIngresoSindicato').value = data.fecha_ingreso_sindicato;
                document.getElementById('dependientes').value = data.dependientes;
                document.getElementById('fechaNacimiento').value = data.fecha_nacimiento;
                document.getElementById('puesto').value = data.puesto;
                document.getElementById('nivelTabular').value = data.nivelTabular;
                document.getElementById('dedicacion').value = data.dedicacion;
            } catch (error) {
                console.error('Error al cargar los datos del empleado:', error);
                alert('Ocurrió un error al cargar los datos del empleado. Por favor, inténtalo de nuevo más tarde.');
            }
        }
    });

    // Manejar el envío del formulario
    employeeForm.addEventListener('submit', async (e) => {
        e.preventDefault();

        // Verificar si se seleccionó un empleado
        const selectedEmpleadoId = dropDown.value;
        if (selectedEmpleadoId === "Seleccione un empleado") {
            alert('Por favor, selecciona un empleado antes de modificar.');
            return;
        }

        // Obtener los datos del formulario
        const formData = new FormData(employeeForm);
        const formValues = Object.fromEntries(formData.entries());

        // Filtrar los campos vacíos
        const filteredValues = {};
        for (const key in formValues) {
            if (formValues[key]) {
                filteredValues[key] = formValues[key];
            }
        }

        // Validar que al menos un campo haya sido llenado
        if (Object.keys(filteredValues).length === 0) {
            alert('Por favor, llena al menos un campo para modificar.');
            return;
        }

        try {
            const response = await fetchWithToken(`http://localhost:3000/api/empleado/update-empleado/${selectedEmpleadoId}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(filteredValues),
            });

            const result = await response.json();
            if (response.ok) {
                alert('Datos del empleado actualizados correctamente.');
                location.reload(); // Recargar la página para reflejar los cambios
            } else {
                if (result.errors) {
                    const errorMessages = result.errors.map(error => error.msg).join('\n');
                    alert(`Errores de validación:\n${errorMessages}`);
                } else {
                    alert(`Error: ${result.message}`);
                }
            }
        } catch (error) {
            console.error('Error al actualizar los datos del empleado:', error);
            alert('Ocurrió un error al actualizar los datos del empleado.');
        }
    });
});