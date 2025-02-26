import express from 'express';
import configureDependencies from '../../infrastructure/config/dependencies.mjs';
import { isTokenCorrect, verifyRole } from '../middlewares/Auth.mjs';

const router = express.Router();
const{Rolcontroller} = configureDependencies();

router.post('/', (req, res) => Rolcontroller.create(req, res));
router.get('/roles', isTokenCorrect, verifyRole(['administrador']), (req, res) => Rolcontroller.listRoles(req, res));
router.get('/rol/:id', isTokenCorrect, verifyRole(['administrador']), (req, res) => Departmentcontroller.listRol(req, res));

export default router;