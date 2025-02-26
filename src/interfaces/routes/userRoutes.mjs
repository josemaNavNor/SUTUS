import express from 'express';
import upload from '../middlewares/upload.mjs';
import { validateRoleAssignment } from '../middlewares/validateRoleAssignment.mjs';
import configureDependencies from '../../infrastructure/config/dependencies.mjs';
import { validateDataRequest } from '../middlewares/validateDataRequest.mjs';
import { isTokenCorrect, verifyRole } from '../middlewares/Auth.mjs';

const router = express.Router();
const {userController} = configureDependencies();

router.put('/update-password/:id', isTokenCorrect, verifyRole(['administrador', 'usuario']),
(req, res) => userController.update(req, res)
);

router.put('/update-email/:id', isTokenCorrect, verifyRole(['administrador', 'usuario']), 
(req, res) => userController.update(req, res)
);

router.post('/login', (req, res) => userController.login(req, res));

router.post('/refresh-token', (req, res) => userController.refreshToken(req, res));

router.get('/get-folio', isTokenCorrect, verifyRole(['administrador', 'usuario']), 
(req, res) => userController.getFolio(req, res)
);

router.post('/solicitud', isTokenCorrect, verifyRole(['administrador', 'usuario']), upload.fields([{ name: 'pdf', maxCount: 1 }, { name: 'archivo_adicional', maxCount: 1 }]),validateDataRequest, async (req, res) => {
    try{
        userController.createRequest(req, res);
    }catch(error){
        res.status(500).json({ message: error.message });
    }
});

router.get('/solicitudes-usuario/:id', isTokenCorrect, verifyRole(['administrador', 'usuario']), 
(req, res) => userController.listAllRequestByUser(req, res)
);

router.put('/update-request/:id', isTokenCorrect, verifyRole(['administrador', 'usuario']),
 (req, res) => userController.updateRequestUser(req, res)
);

// router.post('/refresh-token', (req, res) => authController.refreshToken(req, res));

export default router;
