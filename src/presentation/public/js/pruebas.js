document.getElementById("prueba").addEventListener("click", async function () {
    try {
      // // Variables con los IDs para buscar datos
      // const userId = localStorage.getItem('id'); // ID del usuario del localStorage
      // const requestId = 1; // ID fijo para la solicitud

      // if (!userId) {
      //     console.error("No se encontró el ID de usuario en localStorage.");
      //     return;
      // }

      // // Obtener los datos del usuario y del tipo de solicitud
      // const [empleadoResponse, tipoSolicitudResponse] = await Promise.all([
      //     fetch(`http://localhost:3000/api/empleado/get-empleado/${userId}`),
      //     fetch(`http://localhost:3000/api/tipo_solicitud/tipo-de-solicitud/${requestId}`)
      // ]);

      // // Convertir las respuestas en JSON
      // const empleadoData = await empleadoResponse.json();
      // const tipoSolicitudData = await tipoSolicitudResponse.json();

      // // Imprimir respuestas completas para depuración
      // console.log("Respuesta completa del empleado:", empleadoData);
      // console.log("Respuesta completa del tipo de solicitud:", tipoSolicitudData);

      // const empleado = empleadoData[0];
      // const tipoSolicitud = tipoSolicitudData[0];

      // // Acceder a los datos y mostrarlos en consola
      // console.log("Datos del Usuario:");
      // console.log(`Nombre: ${empleado.nombre}`);
      // console.log(`Primer Apellido: ${empleado.primer_apellido}`);
      // console.log(`Segundo Apellido: ${empleado.segundo_apellido}`);

      // console.log("Datos del Tipo de Solicitud:");
      // console.log(`Tipo de Solicitud: ${tipoSolicitud.tipo_solicitud}`);

      //Código para probar el archivo dinámico

      const { jsPDF } = window.jspdf;
      const doc = new jsPDF({
        orientation: "portrait",
        unit: "mm",
        format: [210, 297],
      });
      doc.addImage(
        "/Sindicato-Sutus-PaginaWeb/src/presentation/public/img/Comite_ejecutivo_documento_SUTUS.png",
        "PNG",
        8,
        5,
        30,
        250
      );
      doc.setFontSize(12);
      doc.text(
        `Moctezuma, Sonora a ${new Date().toLocaleDateString()}`,
        200,
        15,
        null,
        null,
        "right"
      );
      doc.text(`Oficio SUTUS: 01/25`, 200, 20, null, null, "right");
      doc.text(`Asunto: Solicitud de lentes`, 200, 25, null, null, "right");

      doc.setFont("helvetica", "bold");
      doc.setFontSize(12);
      doc.text("C. Damayra García Mora", 43, 40);
      doc.setFont("helvetica", "normal");
      doc.text("Jefe de Recursos Humanos", 43, 45);
      doc.text("PRESENTE.-", 43, 50);

      const textJustified = (text, x, y) => {
        const pageWidth = doc.internal.pageSize.getWidth();
        const words = doc.splitTextToSize(text, pageWidth - 20);
        words.forEach((word) => doc.text(word, x, y, { align: "justify" }));
        return y + 7.5;
      };

      let yPos = 60;
      doc.setFontSize(12);
      yPos = textJustified(
        "Por medio del presente y con fundamento en lo establecido en el Contrato Colectivo",
        43,
        yPos
      );
      yPos = textJustified(
        "de Trabajo vigente, en mi calidad de Secretario General del Sindicato Unico de",
        43,
        yPos
      );
      yPos = textJustified(
        "Trabajadores de la Universidad de la Sierra, presento la solicitud de apoyo para",
        43,
        yPos
      );

      const addTextWithBoldParts = (textParts, x, y) => {
        let currentX = x;
        textParts.forEach((part) => {
          if (part.bold) {
            doc.setFont("helvetica", "bold");
          } else {
            doc.setFont("helvetica", "normal");
          }
          doc.text(part.text, currentX, y);
          currentX +=
            (doc.getStringUnitWidth(part.text) * doc.getFontSize()) /
            doc.internal.scaleFactor;
        });
        return y + 7.5; // Devolver la posición y actualizada con salto de línea de 1.5
      };

      const parts1 = [
        { text: "anteojos para ", bold: false },
        {
          text: "Jesús Abel Aquino Rivera",
          bold: true,
        },
        { text: " trabajador sindicalizado de la Universidad,", bold: false },
      ];

      yPos = addTextWithBoldParts(parts1, 43, yPos);

      const parts2 = [
        { text: "con folio de trámite interno ", bold: false },
        { text: "01/25", bold: true },
        { text: ". Se anexa documento correspondiente.", bold: false },
      ];

      yPos = addTextWithBoldParts(parts2, 43, yPos);

      yPos = textJustified(
        "Sin más por el momento y agradeciendo su atención a la presente quedo de usted.",
        43,
        yPos
      );

      doc.setFont("helvetica", "bold");
      doc.setFontSize(12);
      doc.text("Atentamente", 105, yPos + 20);

      doc.setFont("helvetica", "normal");
      doc.setFontSize(10);
      doc.text(
        '"Unidad y Equidad en la Educación para el Desarrollo de la Sierra"',
        74,
        yPos + 30
      );

      doc.setFont("helvetica", "bold");
      doc.setFontSize(10);
      doc.text(
        "______________________________________________",
        80,
        yPos + 45
      ); // Línea para la firma

      doc.text("DSC. Ulises Ponce Mendoza", 100, yPos + 50);

      doc.text("Secretario General del SUTUS", 100, yPos + 55);
      
      doc.save('documento_prueba.pdf');

    } catch (error) {
        console.error("Ocurrió un error al obtener los datos:", error);
    }
});
