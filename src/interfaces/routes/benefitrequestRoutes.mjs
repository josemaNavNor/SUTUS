import express from 'express';
import configureDependencies from '../../infrastructure/config/dependencies.mjs';
import { isTokenCorrect, verifyRole } from '../middlewares/Auth.mjs';

const router = express.Router();
const{BenefitrequestsController} = configureDependencies();

router.post('/', (req, res) => BenefitrequestsController.create(req, res));
router.get('/tipo-de-solicitud/:id', isTokenCorrect, verifyRole(['administrador', 'usuario']), (req, res) => BenefitrequestsController.getTypeOfRequest(req, res));

export default router;