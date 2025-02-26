
document.addEventListener('DOMContentLoaded', function () {
    // Selecciona el carrusel por su ID
    const carousel = document.getElementById('timelineCarousel');
    // Inicializa el carrusel de Bootstrap y desactiva el intervalo automático
    const carouselInstance = new bootstrap.Carousel(carousel);

    const totalSlides = document.querySelectorAll('.carousel-item').length; // Obtener el número total de diapositivas

    function selectRadio(className, index) {
        // Desmarcar todos los radios
        document.querySelectorAll('input[type="radio"]').forEach((radio, i) => {
            radio.checked = (i === index);
        });

        // Cambiar el carrusel a la diapositiva correspondiente
        carouselInstance.to(index);

        // Actualiza la barra de progreso
        updateActiveStep(index);
    }

    // Actualiza el paso activo en la barra de progreso
    function updateActiveStep(index) {
        const steps = document.querySelectorAll('.nav-progress-bar li');
        steps.forEach(step => step.classList.remove('active')); // Remover "active" de todos
        steps[index].classList.add('active'); // Agregar "active" al seleccionado

        // Reiniciar si se llegó a la última diapositiva
        if (index >= totalSlides - 1) {
            // Reiniciar el carrusel y la barra de progreso
            setTimeout(() => {
                selectRadio('st1', 0); // Vuelve a la primer diapositiva y radio
            }, 2000); // Esperar un poco antes de reiniciar
        }
    }

    // Añadir evento de click a todos los elementos li
    const steps = document.querySelectorAll('.nav-progress-bar li');
    steps.forEach((step, index) => {
        step.addEventListener('click', function () {
            const className = step.classList[1]; // Obtener la clase correspondiente, st1, st2, st3
            selectRadio(className, index); // Llamar a la función para marcar el radio y cambiar el carrusel
        });
    });

    // Manejar cambios en el radio button
    document.querySelectorAll('input[type="radio"]').forEach((radio, index) => {
        radio.addEventListener('change', function () {
            const className = `st${index + 1}`; // Crear la clase correspondiente, year1,year2,year3,year4
            selectRadio(className, index);
        });
    });

    // Sincronizar radio buttons al cambiar de slide
    carousel.addEventListener('slide.bs.carousel', function (event) {
        const nextIndex = event.to; // Índice del próximo slide
        const radios = document.querySelectorAll('input[type="radio"]');
        radios[nextIndex].checked = true; // Marcar el radio correspondiente
        updateActiveStep(nextIndex); // Actualizar el paso activo
    });

    //Función para esconder las clausulas en el menú de filtros
    document.getElementById('toggleCapitulos').addEventListener('click', function() {
        var capitulos = document.getElementById('capitulos');
        capitulos.classList.toggle('collapse');
    });
});


