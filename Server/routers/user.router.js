const express = require('express');
const boom = require('@hapi/boom');

const authentication = require('../middlewares/authentication.handler');
const validatorHandler = require('../middlewares/validation.handler');
const ResponseHandler = require('../middlewares/response.handler');
const checkPermission = require('../middlewares/permission.handler');
const UserService = require('../services/user.service');
const { updateUserSchema } = require('../schemas/user.schema');

const router = express.Router();
const service = new UserService();

router.post(
    '/login',
    async (req, res, next) => {
        try {
            const { username, password } = req.body;
            const result = await service.login(username, password);

            // Enviar una respuesta estructurada
            ResponseHandler.success({
                res,
                message: 'Inicio de sesion exitoso',
                data: result,
                status: 201,
            });
        } catch (error) {
            next(error);  // Manejo de errores
        }
    }
);

router.patch(
    '/desactivacion/:id',
    authentication,
    checkPermission('administrador'), 
    validatorHandler(updateUserSchema, 'body'),
    async (req, res, next) => {
        try {
            const { id } = req.params; 
            const result = await service.deactivateUser(id); 
            res.json(result); 
        } catch (error) {
            next(error); 
        }
    }
);

// Endpoint para obtener la lista de usuarios
router.get('/getAll', async (req, res, next) => {
    try {
        const result = await service.find();
        res.status(200).json(result);
    } catch (error) {
        // Manejo de errores utilizando Boom
        next(error); // Si no es un error Boom, pasa al manejador global
    }
});

module.exports = router;