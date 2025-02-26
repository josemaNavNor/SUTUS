import express from 'express';
import configureDependencies from '../../infrastructure/config/dependencies.mjs';
import { validateDataCommittee } from '../middlewares/validateDataCommittee.mjs';
import validateEmployeeData from '../middlewares/validateEmployeeData.mjs';
import validateUpdateDataEmployee from '../middlewares/validateUpdateDataEmployee.mjs';
import { isTokenCorrect, verifyRole } from '../middlewares/Auth.mjs';


const router = express.Router();
const {employeeController} = configureDependencies();

router.post('/create-empleado', isTokenCorrect, verifyRole(['administrador']), validateEmployeeData, (req, res) => employeeController.create(req, res));
router.post('/add-empleado-al-comite', isTokenCorrect, verifyRole(['administrador']), validateDataCommittee, async(req, res) =>{
    try{
        employeeController.addcommittee(req, res);
    }catch(error){
        res.status(500).json({ message: error.message });
    }
});

router.get('/empleados', (req, res) => employeeController.listAllEmployeess(req, res));

router.get('/get-empleado/:id', isTokenCorrect, verifyRole(['administrador', 'usuario']), (req, res) => employeeController.listEmployee(req, res));
router.put('/update-empleado/:id', isTokenCorrect, verifyRole(['administrador']), validateUpdateDataEmployee, (req, res) => employeeController.update(req, res));
router.delete('/delete-empleado/:id', isTokenCorrect, verifyRole(['administrador']), (req, res) => employeeController.delete(req, res));
router.put('/update-password/:id', isTokenCorrect, verifyRole(['administrador']), (req, res) => employeeController.generateNewPassword(req, res));
router.put('/update-email/:id', isTokenCorrect, verifyRole(['administrador']), (req, res) => employeeController.generateNewEmail(req, res));

export default router;
