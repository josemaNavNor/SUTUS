document.addEventListener('DOMContentLoaded', function() {
    // document.getElementById('toggleClausulas').addEventListener('click', function() {
    //     var clausulas = document.getElementById('clausulas');
    //     clausulas.classList.toggle('show');
    // });

    // document.getElementById('toggleCapitulos').addEventListener('click', function() {
    //     var capitulos = document.getElementById('capitulos');
    //     capitulos.classList.toggle('show');
    // });

    // document.getElementById('toggleTransitorios').addEventListener('click', function() {
    //     var transitorios = document.getElementById('transitorios');
    //     transitorios.classList.toggle('show');
    // });
    
    // //Función para buscar los capítulos del documento 
    // document.getElementById('filtrarBtn').addEventListener('click', function () {  
    //     const selectedCapitulo = document.querySelector('input[name="listGroupRadio"]:checked');
    //     const selectedClausula = document.querySelector('input[name="listClauRadio"]:checked');

    //     if (selectedCapitulo) {
    //         const targetId = selectedCapitulo.value;
    //         const targetSection = document.getElementById(targetId);
    //         if (targetSection) {
    //             targetSection.scrollIntoView({ behavior: 'smooth' });
    //         }
    //     }else if(selectedClausula){
    //         const targetId = selectedClausula.value;
    //         const targetSection = document.getElementById(targetId);
    //         if (targetSection) {
    //             targetSection.scrollIntoView({ behavior: 'smooth' });
    //         }
    //     }else{
    //         alert('Porfavor, seleccione un elemento dentro de la lista')
    //     }
    // });

    // Función para alternar la visibilidad de las secciones
    function toggleSection(buttonId, sectionId) {
    document.getElementById(buttonId).addEventListener("click", function () {
        const section = document.getElementById(sectionId);
        section.classList.toggle("show");
    });
    }

    // Llamar a la función para cada sección
    toggleSection("toggleCapitulos", "capitulos");
    toggleSection("toggleClausulas", "clausulas");
    toggleSection("toggleTransitorios", "transitorios");
    
    // function toggleSectionByClass(buttonClass){
    //     const buttons = document.querySelectorAll(`.${buttonClass}`);
    //     buttons.forEach(button => {
    //         button.addEventListener("click", function (){
    //             const targetSelector = button.getAttribute("data-bs-target");

    //             if (targetSelector) {
    //                 const targetSection = document.querySelector(targetSelector);
    //                 if (targetSection) {
    //                     targetSection.classList.toggle("show");
    //                 }
    //             }else{
    //                 console.warn("No se encontró el atributo data-bs-target en el botón:", button);
    //             }
    //         });
    //     });
    // }

    function toggleSectionByClass(buttonClass) {
        let lastActiveButton = null; // Guardará el último botón activo
        
        const buttons = document.querySelectorAll(`.${buttonClass}`);
        buttons.forEach(button => {
            button.addEventListener("click", function () {
                const targetSelector = button.getAttribute("data-bs-target"); // Obtenemos el selector de la sección
                if (targetSelector) {
                    const targetSection = document.querySelector(targetSelector);
    
                    if (targetSection) {
                        // Si ya hay un botón activo y no es el actual, ocultamos su sección
                        if (lastActiveButton && lastActiveButton !== button) {
                            const lastTargetSelector = lastActiveButton.getAttribute("data-bs-target");
                            const lastTargetSection = document.querySelector(lastTargetSelector);
                            if (lastTargetSection) {
                                lastTargetSection.style.opacity = "0"; // Ocultamos suavemente
                                setTimeout(() => lastTargetSection.classList.remove("show"), 10); // Esperamos para remover la clase 'show'
                            }
                        }
    
                        // Alternamos la visibilidad de la sección actual
                        if (targetSection.classList.contains("show")) {
                            targetSection.style.opacity = "0"; // Ocultamos suavemente
                            setTimeout(() => targetSection.classList.remove("show"), 10); // Esperamos para remover la clase 'show'
                        } else {
                            targetSection.classList.add("show");
                            targetSection.style.opacity = "1"; // Mostramos suavemente
                        }
    
                        lastActiveButton = button; // Actualizamos el botón activo
                    }
                } else {
                    console.warn("No se encontró el atributo data-bs-target en el botón:", button);
                }
            });
        });
    }
    

    toggleSectionByClass("toggleClausulas");

    document.getElementById('filtrarBtn').addEventListener('click', function () {
        // Buscar los radios seleccionados de ambos grupos
        const selectedCapitulo = document.querySelector('input[name="listGroupRadio"]:checked');
        const selectedClausula = document.querySelector('input[name="listClauRadio"]:checked');
    
        // Dar prioridad a la cláusula si está seleccionada
        const selectedRadio = selectedClausula || selectedCapitulo;
    
        if (selectedRadio) {
            // Obtener el valor del radio seleccionado
            const targetId = selectedRadio.value;
            const targetSection = document.getElementById(targetId);
    
            if (targetSection) {
                // Desplazar la vista hacia la sección objetivo
                targetSection.scrollIntoView({ behavior: "smooth" });
            } else {
                alert("El elemento seleccionado no tiene una sección válida.");
            }
        } else {
            alert("Por favor, seleccione un elemento dentro de la lista.");
        }
    });

        // Agrupar todos los radio buttons de los diferentes grupos
    const radiosGroup1 = document.querySelectorAll('input[name="listGroupRadio"]');
    const radiosGroup2 = document.querySelectorAll('input[name="listClauRadio"]');

    // Función para deseleccionar radios del otro grupo
    function handleRadioChange(event) {
        // Determinar el grupo actual
        const currentGroupName = event.target.name;

        // Desactivar todos los radios del otro grupo
        if (currentGroupName === 'listGroupRadio') {
            radiosGroup2.forEach(radio => (radio.checked = false));
        } else if (currentGroupName === 'listClauRadio') {
            radiosGroup1.forEach(radio => (radio.checked = false));
        }
    }

    // Asignar el evento change a todos los radios de ambos grupos
    [...radiosGroup1, ...radiosGroup2].forEach(radio => {
        radio.addEventListener('change', handleRadioChange);
    });

});
