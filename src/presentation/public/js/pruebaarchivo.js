document.getElementById('uploadButton').addEventListener('click', async () => {
    const fileInput = document.getElementById('fileInput');
    const file = fileInput.files[0];
    
    if (!file) {
        alert('Por favor, selecciona un archivo antes de subir.');
        return;
    }

    const formData = new FormData();
    formData.append('file', file);

    try {
        const response = await fetch('http://192.168.1.69:3000/api/admin/upload-archivo-normatividad', {
            method: 'POST',
            body: formData,
        });        

        if (response.ok) {
            const data = await response.json();
            document.getElementById('contenido').innerHTML = data.content || '<p class="text-danger">No se recibió contenido del servidor.</p>';
        } else {
            const errorData = await response.json();
            alert(errorData.message || 'Error al procesar el archivo.');
        }
    } catch (error) {
        console.error('Error al comunicarse con el servidor:', error);
        alert(`Hubo un error al intentar subir el archivo: ${error.message || error}`);
    }
});

