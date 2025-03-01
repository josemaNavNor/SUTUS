import express from 'express';
import cors from 'cors';
import userRoutes from './interfaces/routes/userRoutes.mjs';
import employeeRoutes from './interfaces/routes/employeeRoutes.mjs';
import departmentRoutes from './interfaces/routes/departmentRoutes.mjs';
import rolRoutes from './interfaces/routes/rolRoutes.mjs'
import benefitRoutes from './interfaces/routes/benefitrequestRoutes.mjs'
import adminRoutes from './interfaces/routes/adminRoutes.mjs'
import actualizarArchivoRouter from './interfaces/routes/uploadNewFile.mjs'
import path from 'path';
import { fileURLToPath } from 'url';

const app = express();

app.use(express.json());
app.use(cors());

// Obtener el directorio actual
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

/*
app.use('/', express.static(path.join(__dirname, 'presentation', 'public')));

// Ruta para servir archivos estáticos desde la carpeta Solicitudes
app.get('/Solicitudes/:filename', (req, res) => {
    const filePath = path.join(__dirname,'presentation', 'public', 'Solicitudes', req.params.filename);
    res.sendFile(filePath, (err) => {
        if (err) {
            console.error(`Error serving file: ${err.message}`);
            res.status(404).send('File not found');
        }
    });
});

*/

// PROBANDO REPOSITORIO, HOLA REPOSITORIO!

app.use('/', express.static(path.join(__dirname, 'presentation', 'public')));

app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'presentation', 'public', 'views', 'index.html'));
});


app.use('/api/usuario', userRoutes);
app.use('/api/empleado', employeeRoutes);
app.use('/api/departamento', departmentRoutes);
app.use('/api/rol', rolRoutes);
app.use('/api/tipo_solicitud', benefitRoutes);
app.use('/api/admin', adminRoutes);
app.use('/api/file', actualizarArchivoRouter);

export default app;