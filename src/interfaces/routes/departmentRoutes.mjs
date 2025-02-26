import express from 'express';
import configureDependencies from '../../infrastructure/config/dependencies.mjs';
import { isTokenCorrect, verifyRole } from '../middlewares/Auth.mjs';

const router = express.Router();
const{Departmentcontroller} = configureDependencies();

router.post('/create-departamento', isTokenCorrect, verifyRole(['administrador']), (req, res) => Departmentcontroller.create(req, res));
router.get('/departamentos', isTokenCorrect, verifyRole(['administrador']), (req, res) => Departmentcontroller.listAllDeparments(req, res));
router.get('/departamento/:id', isTokenCorrect, verifyRole(['administrador']), (req, res) => Departmentcontroller.listDeparment(req, res));

export default router;