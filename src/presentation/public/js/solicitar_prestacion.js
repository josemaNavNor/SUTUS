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

document.querySelectorAll("button.btn").forEach(button => {
    button.addEventListener("click", async function () {
        try {
            const token = localStorage.getItem('token');
            //Verifica si el usuario esta autenticado atravez de su rol proporcionado con JWT al iniciar sesión
            const role = localStorage.getItem("role");
            //Valida si rol es un correcto con respecto a los roles que se tienen especificados
            if (!role || (role !== "usuario" && role !== "administrador")) {
            //Muestra un elemento  bootstrap modal si el usuario no está autenticado.
            const authModal = new bootstrap.Modal(document.getElementById("authModal"));
            authModal.show();
            return;
            }

            //Obtener el id de del botón que llamo a la función
            const requestId = parseInt(this.id, 10);
            //Se obtiene el id del usuario que esta realizando la solicitud.
            const userId = localStorage.getItem('id');
            if (!userId) throw new Error("El ID de usuario no está en localStorage");

            //Validación para verificar si se subio un archivo: Si se subio un archivo obtiene el primer elemento que encuentre
            // del file input y lo asigna a la variable archivoAdicional y si no encuentra ningun elemento solo asigna null
            //indicando que esa solicitud no requiere de un archivo adicional.
            const fileInput = this.parentElement.querySelector(".archivoAdicional");
            const archivoAdicional = fileInput?.files[0] || null;

            //Validación para comprobar que se esta enviando el tipo de archivo adcional en la solicitud.
            if (archivoAdicional) {
                //Se asigna una variable con los tipos de extensión o tipos de datos permitidos.
                const validFileTypes = ["application/pdf", "image/jpeg", "image/png", "image/webp"];
                //Luego valida si el tipo de archivo adicional enviado es diferente del tipo de archivos permitidos.
                //Si es diferente de los tipos de archivo permitidos manda un alert indicando que el tipo de archivo es incorrecto.
                if (!validFileTypes.includes(archivoAdicional.type)) {
                    alert("Tipo de archivo incorrecto: Solo se admiten archivos PDF e imágenes.");
                    return;
                }
            }
            
            //Se crean promesas JS asegurando que se van a traer los datos del backend y ase asignan en las respectivas variables
            // Se manda a traer los datos desde el backend del empleado y el del tipo de solicitud con el id del boton y el id del usuario.
            //Las respuestas que traigan los enpoints se proceden a convertir en un arreglo de objeto Json para poder manipularlos facilmente.
            const [empleadoData, tipoSolicitudData] = await Promise.all([
                fetchWithToken(`http://10.19.60.237:3000/api/empleado/get-empleado/${userId}`,{
                method: 'GET',      
                }).then(res => res.json()),
                fetchWithToken(`http://10.19.60.237:3000/api/tipo_solicitud/tipo-de-solicitud/${requestId}`,{
                method: 'GET',     
                }).then(res => res.json())
            ]);
            
            //Si no se pudieron traer los datos del usuario y del tipo de solicitud se crea un error.
            if (!empleadoData || !tipoSolicitudData) throw new Error("Error al obtener datos del empleado o tipo de solicitud");
            
            //Se asigna a la variable empleado el primer elemento que se encontro del arreglo de obtejos Json para poder trabajar con esos datos.
            const empleado = empleadoData[0];
            //Se asigna a la varaible tipoSolicitud el primer elemento que se encontro del arreglo de objetos Json.
            const tipoSolicitud = tipoSolicitudData[0];

            //Si no se pudo recuperar ni el nombre del empleado, su primer apellido o el tipo de solicitud desde el backend se
            // crea un error, ya que ocupamos esos datos para generar el PDF de lo contrario en el PDF solo se vera undefined.
            if (!empleado.nombre || !empleado.primer_apellido || !tipoSolicitud.tipo_solicitud) {
                throw new Error("Los datos del empleado o la solicitud no están completos.");
            }

            const folioResponse = await fetchWithToken("http://10.19.60.237:3000/api/usuario/get-folio",{
                method: 'GET',    
            });
            const folioData = await folioResponse.json();

            if (!folioData || !folioData.folio) {
                throw new Error("No se pudo obtener el folio");
            }

            const folio = folioData.folio;

            //Se le asigna a la varaible year el valor del año presente esto nos sirve para generar el nombre del pdf y
            //asignarlo dentro del pdf creado.
            const year = new Date().getFullYear();

            //Se genera el nombre del archivo que se crea dinamicamente con el identificador de la solicitud, el año actual
            // y el tipo de solicitud recuperado desde la base de datos.
            const nombrePdf = `Oficio_${folio}_${year}_${tipoSolicitud.tipo_solicitud}.pdf`;

            //Se genera el pdf con ayuda de la libreria jspdf
            //Se crea una variable que hace referencia a la libreria
            //Luego se crea una nueva instancia de la libreria para poder interactuar y crear el documento PDF.
            const { jsPDF } = window.jspdf;
            const doc = new jsPDF({
                orientation: "portrait",
                unit: "mm",
                format: [210, 297]
            });
            doc.addImage('/img/talonario_SUTUS.png', 'PNG', 8, 5, 30, 250);
            doc.setFontSize(12);
            doc.text(`Moctezuma, Sonora a ${new Date().toLocaleDateString()}`, 200, 15, null, null, 'right');
            doc.text(`Oficio SUTUS: ${folio}/${year}`, 200, 20, null, null, 'right');
            doc.text(`Asunto: ${tipoSolicitud.tipo_solicitud}`, 200, 25, null, null, 'right');

            doc.setFont("helvetica", "bold");
            doc.setFontSize(12);
            doc.text("C. Damayra García Mora", 43, 40);
            doc.setFont("helvetica", "normal");
            doc.text("Jefe de Recursos Humanos", 43, 45);
            doc.text("PRESENTE.-", 43, 50);

            const textJustified = (text, x, y) => {
                const pageWidth = doc.internal.pageSize.getWidth();
                const words = doc.splitTextToSize(text, pageWidth - 20);
                words.forEach(word => doc.text(word, x, y, { align: 'justify' }));
                return y + 7.5;
            };        
            
            let yPos = 60;
            doc.setFontSize(12);
            yPos= textJustified("Por medio del presente y con fundamento en lo establecido en el Contrato Colectivo",43, yPos);
            yPos= textJustified("de Trabajo vigente, en mi calidad de Secretario General del Sindicato Unico de", 43, yPos);
            yPos= textJustified("Trabajadores de la Universidad de la Sierra, presento la solicitud de apoyo para", 43, yPos);

            const addTextWithBoldParts = (textParts, x, y) => {
                let currentX = x;
                textParts.forEach(part => {
                    if (part.bold) {
                        doc.setFont("helvetica", "bold");
                    } else {
                        doc.setFont("helvetica", "normal");
                    }
                    doc.text(part.text, currentX, y);
                    currentX += doc.getStringUnitWidth(part.text) * doc.getFontSize() / doc.internal.scaleFactor;
                });
                return y + 7.5; // Devolver la posición y actualizada con salto de línea de 1.5
            };

            const parts1 = [
                { text: "anteojos para ", bold: false },
                { text: `${empleado.nombre} ${empleado.primer_apellido} ${empleado.segundo_apellido}`, bold: true },
                { text: " trabajador sindicalizado de la Universidad,", bold: false }
            ];

            yPos = addTextWithBoldParts(parts1, 43, yPos);

            const parts2 = [
                { text: "con folio de trámite interno ", bold: false },
                { text: `${folio}/${year}`, bold: true },
                { text: ". Se anexa documento correspondiente.", bold: false }
            ];

            yPos = addTextWithBoldParts(parts2, 43, yPos);


            yPos = textJustified("Sin más por el momento y agradeciendo su atención a la presente quedo de usted.", 43, yPos);

            doc.setFont("helvetica", "bold");
            doc.text("Atentamente", 105, yPos + 20);

            doc.setFont("helvetica", "normal");
            doc.text("\"Unidad y Equidad en la Educación para el Desarrollo de la Sierra\"", 74, yPos + 30);

            doc.setFont("helvetica", "bold");
            doc.setFontSize(10);
            doc.text("_________________________________________________", 80, yPos + 45); // Línea para la firma
        
            doc.text("DSC. Ulises Ponce Mendoza", 100, yPos + 50);
        
            doc.text("Secretario General del SUTUS", 100, yPos + 55);

            // Aqui se manda el documento creado en un archivo tipo Blob para poder almacenarlo en una carpeta en el Servidor.
            const pdfBlob = doc.output("blob");

            // Se Prepara el cuerpo de la solicitud que se mandara al backend.
            const formData = new FormData();
            formData.append("userId", userId);
            formData.append("fecha_solicitud", new Date().toISOString().slice(0, 19).replace("T", " "));
            formData.append("estado", "en espera");
            formData.append("tipo_de_solicitud", tipoSolicitud.tipo_solicitud)
            formData.append("requestid", requestId);
            formData.append("documento_solicitud", nombrePdf);
            if (archivoAdicional) formData.append("archivo_adicional", archivoAdicional);
            formData.append("pdf", new File([pdfBlob], nombrePdf, { type: "application/pdf" }));

            //Se envia la solicitud al backend.
            const response = await fetchWithToken("http://10.19.60.237:3000/api/usuario/solicitud", {
                method: "POST",
                body: formData
            });

            const result = await response.json();
            if (!response.ok) throw new Error(result.message || "Error al enviar la solicitud");

            alert("Solicitud enviada correctamente.");
        } catch (error) {
            console.error(error);
            alert(`Error: ${error.message}`);
        }
    });
});




