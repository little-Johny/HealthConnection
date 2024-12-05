const express = require('express');
const boom = require('@hapi/boom');

const authentication = require('../middlewares/authentication.handler');
const validatorHandler = require('../middlewares/validation.handler');
const {
    logError, 
    errorHandler, 
    boomErrorHandler
} = require('../middlewares/error.handler');
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
            res.status(200).json({
                success: result.success,
                message: result.message,
                token: result.token,
                role: result.role,
            });
        } catch (error) {
            next(error);  // Manejo de errores
        }
    }
);

router.patch(
    '/desactivacion/:id',
    authentication,
    /* checkPermission('administrador'), */
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

module.exports = router;