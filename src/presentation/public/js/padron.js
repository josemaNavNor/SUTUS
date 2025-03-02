
document.addEventListener('DOMContentLoaded', async () => {
    //const apiUrl = 'http://10.19.60.237:3000/api/empleado/empleados';
    const apiUrl = 'http://localhost:3000/api/empleado/empleados';
    const tbody = document.getElementById('employeeTableBody');

    if (!tbody) {
        console.error('El elemento tbody no existe en el DOM');
        return;
    }

    try {
        const response = await fetch(apiUrl);

        if (response.status === 401) {
            alert('No tienes permisos para ver estos datos. Inicia sesión.');
            return;
        }

        if (!response.ok) {
            throw new Error('Error al obtener los datos del servidor');
        }

        const data = await response.json();

        if (!Array.isArray(data)) {
            throw new Error('La respuesta de la API no es un array');
        }

        data.forEach(employee => {
            const row = document.createElement('tr');

            const nombreCell = document.createElement('td');
            nombreCell.textContent = employee.nombre;
            nombreCell.classList.add('text-center', 'align-middle');

            const primerApellidoCell = document.createElement('td');
            primerApellidoCell.textContent = employee.primer_apellido;
            primerApellidoCell.classList.add('text-center', 'align-middle');

            const segundoApellidoCell = document.createElement('td');
            segundoApellidoCell.textContent = employee.segundo_apellido;
            segundoApellidoCell.classList.add('text-center', 'align-middle');

            // const curpCell = document.createElement('td');
            // curpCell.textContent = employee.curp;
            // curpCell.classList.add('text-center', 'align-middle');

            const entidadCell = document.createElement('td');
            entidadCell.textContent = employee.entidad;
            entidadCell.classList.add('text-center', 'align-middle');

            // const domicilioCell = document.createElement('td');
            // domicilioCell.textContent = employee.domicilio;
            // domicilioCell.classList.add('text-center', 'align-middle');

            const domicilioEmpresaCell = document.createElement('td');
            domicilioEmpresaCell.textContent = employee.domicilio_empresa;
            domicilioEmpresaCell.classList.add('text-center', 'align-middle');

            const estadoCell = document.createElement('td');
            estadoCell.textContent = employee.estado;
            estadoCell.classList.add('text-center', 'align-middle');

            const fechaIngresoEmpresaCell = document.createElement('td');
            fechaIngresoEmpresaCell.textContent = employee.fecha_ingreso_empresa.split('T')[0];
            fechaIngresoEmpresaCell.classList.add('text-center', 'align-middle');

            // const fechaIngresoSindicatoCell = document.createElement('td');
            // fechaIngresoSindicatoCell.textContent = employee.fecha_ingreso_sindicato;
            // fechaIngresoSindicatoCell.classList.add('text-center', 'align-middle');

            // const dependientesCell = document.createElement('td');
            // dependientesCell.textContent = employee.dependientes;
            // dependientesCell.classList.add('text-center', 'align-middle');

            // const fechaNacimientoCell = document.createElement('td');
            // fechaNacimientoCell.textContent = employee.fecha_nacimiento;
            // fechaNacimientoCell.classList.add('text-center', 'align-middle');

            // const puestoCell = document.createElement('td');
            // puestoCell.textContent = employee.puesto;
            // puestoCell.classList.add('text-center', 'align-middle');

            // const nivelTabularCell = document.createElement('td');
            // nivelTabularCell.textContent = employee.nivelTabular;
            // nivelTabularCell.classList.add('text-center', 'align-middle');

            // const dedicacionCell = document.createElement('td');
            // dedicacionCell.textContent = employee.dedicacion;
            // dedicacionCell.classList.add('text-center', 'align-middle');

            row.appendChild(nombreCell);
            row.appendChild(primerApellidoCell);
            row.appendChild(segundoApellidoCell);
            // row.appendChild(curpCell);
            row.appendChild(entidadCell);
            // row.appendChild(domicilioCell);
            row.appendChild(domicilioEmpresaCell);
            row.appendChild(estadoCell);
            row.appendChild(fechaIngresoEmpresaCell);
            // row.appendChild(fechaIngresoSindicatoCell);
            // row.appendChild(estadoCell);
            // row.appendChild(dependientesCell);
            // row.appendChild(fechaNacimientoCell);
            // row.appendChild(puestoCell);
            // row.appendChild(nivelTabularCell);
            // row.appendChild(dedicacionCell);

            tbody.appendChild(row);
        });
    } catch (error) {
        console.error('Error al cargar los datos:', error);
        alert(`Hubo un error al cargar los datos: ${error.message}`);
    }
    document.getElementById('downloadPdf').addEventListener('click', function() {
        const { jsPDF } = window.jspdf;
        const doc = new jsPDF();
        doc.autoTable({
            html: '#Tabla-padron',
            startY: 10,
            styles: {
                overflow: 'linebreak',
                fontSize: 10,
                cellPadding: 1,
                halign: 'center',
                valign: 'middle'
            },
            columnStyles: {
                0: { cellWidth: 'auto' },
                1: { cellWidth: 'auto' },
                2: { cellWidth: 'auto' },
                3: { cellWidth: 'auto' },
                4: { cellWidth: 'auto' },
                5: { cellWidth: 'auto' },
                6: { cellWidth: 'auto' },
                7: { cellWidth: 'auto' },
                // 8: { cellWidth: 'auto' },
                // 9: { cellWidth: 'auto' },
                // 10: { cellWidth: 'auto' },
                // 11: { cellWidth: 'auto' },
                // 12: { cellWidth: 'auto' },
                // 13: { cellWidth: 'auto' },
                // 14: { cellWidth: 'auto' }
            },
            bodyStyles: {
                minCellHeight: 10
            },
            headStyles: {
                fillColor: [31, 122, 75],
                textColor: 255
            },
            alternateRowStyles: {
                fillColor: [220, 220, 220]
            }
        });

        const finalY = doc.lastAutoTable.finalY;

        const lineY = finalY + 20;
        const attY = lineY + 6;
        const descriptionY = attY + 5;

        doc.setDrawColor(0, 0, 0);

        doc.line(60, lineY, 150, lineY);
        doc.setFontSize(10);
        doc.text('Atte:', 100, attY);
        doc.text('Secretario General del Sindicato Unico de Trajadores de la Sierra', 50, descriptionY);

        doc.save('tabla.pdf');
    });  
});