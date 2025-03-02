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

document.addEventListener('DOMContentLoaded', () => {
    // Cargar datos iniciales
    loadEmployees(); // Para asignar roles
    loadRoles();
    loadEmployeesForComite(); // Para asignar empleados a departamentos
    loadDepartments();

    // Botones
    const assignRoleButton = document.getElementById('assignRoleButton');
    const addToComiteButton = document.getElementById('addToComite');

    if (assignRoleButton) {
        assignRoleButton.disabled = true; // Deshabilitar inicialmente
        assignRoleButton.addEventListener('click', assignRoleToUser);
    }

    if (addToComiteButton) {
        addToComiteButton.disabled = true; // Deshabilitar inicialmente
        addToComiteButton.addEventListener('click', addToComite);
    }

    // Validar los selects para habilitar/deshabilitar los botones
    const selectUser = document.getElementById('selectUser');
    const selectRol = document.getElementById('selectRol');
    const selectEmpleado = document.getElementById('selectEmpleado');
    const selectComite = document.getElementById('selectComite');
    const puestoInput = document.getElementById('puesto');

    [selectUser, selectRol].forEach(el =>
        el.addEventListener('change', toggleAssignRoleButton)
    );

    [selectEmpleado, selectComite, puestoInput].forEach(el =>
        el.addEventListener('input', toggleAddToComiteButton)
    );
});

const token = localStorage.getItem('token');

// Habilitar/deshabilitar botón de asignar rol
function toggleAssignRoleButton() {
    const assignRoleButton = document.getElementById('assignRoleButton');
    const selectUser = document.getElementById('selectUser');
    const selectRol = document.getElementById('selectRol');

    assignRoleButton.disabled = !(selectUser.value && selectRol.value);
}

// Habilitar/deshabilitar botón de añadir al comité
function toggleAddToComiteButton() {
    const addToComiteButton = document.getElementById('addToComite');
    const selectEmpleado = document.getElementById('selectEmpleado');
    const selectComite = document.getElementById('selectComite');
    const puestoInput = document.getElementById('puesto');

    addToComiteButton.disabled = !(
        selectEmpleado.value &&
        selectComite.value &&
        puestoInput.value.trim()
    );
}

// Cargar empleados para asignar roles
async function loadEmployees() {
    try {
        //const response = await fetch('http://10.19.60.237:3000/api/empleado/empleados');
        const response = await fetch('http://localhost/api/empleado/empleados');
        const empleados = await response.json();
        const selectUser = document.getElementById('selectUser');

        empleados.forEach(empleado => {
            const option = document.createElement('option');
            option.value = empleado.idempleado;
            option.textContent = `${empleado.nombre} ${empleado.primer_apellido} ${empleado.segundo_apellido}`;
            selectUser.appendChild(option);
        });
    } catch (error) {
        console.error('Error al cargar empleados:', error);
    }
}


// Cargar roles
async function loadRoles() {
    try {
        //const response = await fetchWithToken('http://10.19.60.237:3000/api/rol/roles',{
        const response = await fetchWithToken('http://localhost:3000/api/rol/roles',{
            method: 'GET',
        });
        const roles = await response.json();
        const selectRol = document.getElementById('selectRol');

        roles.forEach(rol => {
            const option = document.createElement('option');
            option.value = rol.idrol;
            option.textContent = rol.rol;
            selectRol.appendChild(option);
        });
    } catch (error) {
        console.error('Error al cargar roles:', error);
    }
}

// Asignar rol al usuario
async function assignRoleToUser() {
    const selectUser = document.getElementById('selectUser');
    const selectRol = document.getElementById('selectRol');

    const userId = selectUser.value;
    const roleId = selectRol.value;

    if (!userId || !roleId) {
        alert('Por favor, selecciona un empleado y un rol.');
        return;
    }

    try {
        //const response = await fetchWithToken(`http://10.19.60.237:3000/api/admin/assign-role/${userId}/${roleId}`, {
        const response = await fetchWithToken(`http://localhost/api/admin/assign-role/${userId}/${roleId}`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            }
        });

        if (response.ok) {
            alert('Rol asignado exitosamente.');
        } else {
            alert('Error al asignar el rol.');
        }
    } catch (error) {
        console.error('Error al asignar el rol:', error);
    }
}

// Cargar empleados para asignar a departamentos
async function loadEmployeesForComite() {
    try {
        //const response = await fetch('http://10.19.60.237:3000/api/empleado/empleados');
        const response = await fetch('http://localhost:3000/api/empleado/empleados');
        const empleados = await response.json();
        const selectEmpleado = document.getElementById('selectEmpleado');

        empleados.forEach(empleado => {
            const option = document.createElement('option');
            option.value = empleado.idempleado;
            option.textContent = `${empleado.idempleado} - ${empleado.nombre}`;
            selectEmpleado.appendChild(option);
        });
    } catch (error) {
        console.error('Error al cargar empleados:', error);
    }
}

// Cargar departamentos
async function loadDepartments() {
    try {
        //const response = await fetchWithToken('http://10.19.60.237:3000/api/departamento/departamentos',{
        const response = await fetchWithToken('http://localhost:3000/api/departamento/departamentos',{
            method: 'GET',
        });
        const departamentos = await response.json();
        const selectComite = document.getElementById('selectComite');

        departamentos.forEach(departamento => {
            const option = document.createElement('option');
            option.value = departamento.id_departamento;
            option.textContent = `${departamento.id_departamento} - ${departamento.nombre_departamento}`;
            selectComite.appendChild(option);
        });
    } catch (error) {
        console.error('Error al cargar departamentos:', error);
    }
}

// Añadir empleado al comité
async function addToComite() {
    const selectEmpleado = document.getElementById('selectEmpleado');
    const selectComite = document.getElementById('selectComite');
    const puestoInput = document.getElementById('puesto');

    const userId = selectEmpleado.value;
    const departamentoId = selectComite.value;
    const puesto = puestoInput.value.trim();

    if (!userId || !departamentoId || !puesto) {
        alert('Por favor, completa todos los campos.');
        return;
    }

    try {
        //const response = await fetchWithToken('http://10.19.60.237:3000/api/empleado/add-empleado-al-comite', {
        const response = await fetchWithToken('http://localhost:3000/api/empleado/add-empleado-al-comite', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json'},
            body: JSON.stringify({ userId, departamentoId, puesto })
        });

        if (response.ok) {
            alert('Empleado añadido al comité exitosamente.');
            selectEmpleado.value = '';
            selectComite.value = '';
            puestoInput.value = '';
            toggleAddToComiteButton();
        } else {
            alert('Error al añadir el empleado al comité.');
        }
    } catch (error) {
        console.error('Error al añadir al comité:', error);
    }
}

