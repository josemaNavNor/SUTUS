
let mesActual = new Date().getMonth();
let añoActual = new Date().getFullYear();

function generarCalendario(mes, año) {
  const diasDelMes = new Date(año, mes + 1, 0).getDate(); // Número de días en el mes
  const primerDia = new Date(año, mes, 1).getDay(); // Día de la semana del primer día del mes
  const calendario = document.getElementById('calendario');
  const mesAño = document.getElementById('mes-año');
  
  // Limpiar el calendario antes de generar uno nuevo
  calendario.innerHTML = '';
  
  // Crear los días de la semana dinámicamente
  const diasSemana = ['Do', 'Lu', 'Ma', 'Mi', 'Jue', 'Vie', 'Sab'];
  const filaDiasSemana = document.createElement('div');
  filaDiasSemana.classList.add('row');

  
  // Generamos las celdas para los días de la semana
  diasSemana.forEach(dia => {
    const header = document.createElement('div');
    header.classList.add('header', 'border');
    header.innerText = dia;
    header.style.flex = '1'; // Asegurar que los días de la semana ocupen un espacio igual
    filaDiasSemana.appendChild(header);
  });
  
  calendario.appendChild(filaDiasSemana);
  
  // Crear las celdas vacías antes del primer día del mes
  let fila = document.createElement('div');
  fila.classList.add('row');
  
  // Agregar celdas vacías al principio del mes si el primer día no es domingo
  for (let i = 0; i < primerDia; i++) {
    const celdaVacia = document.createElement('div');
    celdaVacia.classList.add('text-center', 'border');
    celdaVacia.classList.add('celdavacia');
    celdaVacia.style.flex = '1'; // Asegurar que las celdas vacías ocupen el mismo espacio
    fila.appendChild(celdaVacia);
  }
  
  // Agregar los días del mes a las celdas
  for (let dia = 1; dia <= diasDelMes; dia++) {
    const celda = document.createElement('div');
    celda.classList.add('text-center', 'dia', 'border');
    celda.innerText = dia;
    celda.style.flex = '1'; // Asegurar que cada día ocupe un espacio igual
    fila.appendChild(celda);
    
    // Si la fila tiene 7 celdas, se añade al calendario y se comienza una nueva fila
    if (fila.children.length === 7) {
      calendario.appendChild(fila);
      fila = document.createElement('div');
      fila.classList.add('row');
    }
  }

  if (fila.children.length > 0 && fila.children.length < 7) {
    const diasFaltantes = 7 - fila.children.length;
  
    // Agregar las celdas vacías
    for (let i = 0; i < diasFaltantes; i++) {
      const celdaVacia = document.createElement('div');
      celdaVacia.classList.add('text-center', 'border');
      celdaVacia.classList.add('celdavacia');
      celdaVacia.style.flex = '1'; // Asegurar que las celdas vacías tengan el mismo tamaño
      fila.appendChild(celdaVacia);
    }
  
    // Agregar la fila completa (con las celdas vacías) al calendario
    calendario.appendChild(fila);
  }
  
  // Actualizar el título con el mes y el año
  mesAño.innerText = `${new Intl.DateTimeFormat('es-ES', { month: 'long' }).format(new Date(año, mes))} ${año}`;
}

// Cambiar de mes al hacer clic en los botones de "prev" o "next"
function cambiarMes(incremento) {
  mesActual += incremento;
  if (mesActual > 11) {
    mesActual = 0;
    añoActual++;
  } else if (mesActual < 0) {
    mesActual = 11;
    añoActual--;
  }
  generarCalendario(mesActual, añoActual);
}

// Inicializar el calendario al cargar la página
generarCalendario(mesActual, añoActual);





