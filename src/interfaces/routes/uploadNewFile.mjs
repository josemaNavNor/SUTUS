import express from "express";
import fs from "fs";
import path from "path";
import multer from "multer";
import { fileURLToPath } from "url";

// Obtener la ruta de directorio actual
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const router = express.Router();

// Configurar multer para manejar la subida de archivos
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    const uploadPath = path.join(__dirname, "../../../src/presentation/public/Solicitudes");
    cb(null, uploadPath);
  },
  filename: (req, file, cb) => {
    // Aquí usamos el nombre original del archivo sin modificaciones.
    cb(null, file.originalname);
  },
});

const upload = multer({ storage });

router.post("/actualizar-archivo", upload.single("nuevoArchivo"), async (req, res) => {
  const { archivoActual } = req.body; // Nombre del archivo actual enviado desde el cliente
  const nuevoArchivo = req.file; // Archivo subido

  if (!archivoActual || !nuevoArchivo) {
    return res.status(400).json({ message: "Se requiere el archivo actual y el nuevo archivo." });
  }

  const uploadPath = path.join(__dirname, "../../../src/presentation/public/Solicitudes");

  try {
    // Ruta completa del archivo actual
    const archivoActualPath = path.join(uploadPath, archivoActual);

    // Verificar si el archivo actual existe antes de intentar eliminarlo
    if (fs.existsSync(archivoActualPath)) {
      console.log(`Eliminando archivo existente: ${archivoActualPath}`);
      fs.unlinkSync(archivoActualPath); // Eliminar el archivo actual
    } else {
      console.warn(`El archivo actual no existe: ${archivoActualPath}`);
    }

    // Mover el nuevo archivo a la ubicación correcta
    const nuevoArchivoPath = path.join(uploadPath, nuevoArchivo.originalname);
    if (fs.existsSync(nuevoArchivo.path)) {
      fs.renameSync(nuevoArchivo.path, nuevoArchivoPath); // Renombrar/mover el nuevo archivo
      console.log(`Archivo reemplazado: ${nuevoArchivoPath}`);
    }

    // Responder con éxito
    res.status(200).json({
      message: "Archivo actualizado correctamente.",
      nuevoArchivo: nuevoArchivo.filename,
    });
  } catch (error) {
    console.error("Error al actualizar el archivo:", error);
    res.status(500).json({ message: "Error al actualizar el archivo.", error: error.message });
  }
});

export default router;
