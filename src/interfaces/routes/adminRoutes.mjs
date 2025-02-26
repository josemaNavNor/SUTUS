import express from 'express';
import upload from '../middlewares/multer.mjs';
import configureDependencies from '../../infrastructure/config/dependencies.mjs';
import { isTokenCorrect, verifyRole } from '../middlewares/Auth.mjs';

const router = express.Router();
const {AdminController} = configureDependencies();

router.post('/assign-role/:userId/:roleId', isTokenCorrect, verifyRole(['administrador']), (req, res) => AdminController.assignRole(req, res));
router.get('/solicitudes', isTokenCorrect, verifyRole(['administrador']), (req, res) => AdminController.listAllRequest(req, res));
router.put('/solicitudes/:idRequest/estado', isTokenCorrect, verifyRole(['administrador']), (req, res) => AdminController.updateStatus(req, res));
router.delete('/delete-solicitud/:idRequest', isTokenCorrect, verifyRole(['administrador']), (req, res) => AdminController.discardRequest(req, res));
router.post('/upload-archivo-normatividad', isTokenCorrect, verifyRole(['administrador']), upload.single('file'), (req, res) => AdminController.uploadFileRegulation(req, res));

export default router;
