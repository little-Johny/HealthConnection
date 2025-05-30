const express = require('express');
const passport = require('passport');
const AuthService = require('../services/auth.service');
const ResponseHandler = require('../middlewares/response.handler');
const validatorHandler = require('../middlewares/validation.handler');
const {
    LoginSchema,
    RecoverySchema,
    ChangePasswordSchema,
} = require('../schemas/auth.schema');

const service = new AuthService();
const router = express.Router();

// Loguear usuarios
router.post(
    '/login',
    validatorHandler(LoginSchema, 'body'),
    passport.authenticate('local', { session: false }),
    async (req, res, next) => {
        try {
            const { user } = req;
            const signature = service.signToken(user);
            ResponseHandler.success({
                res,
                req,
                message: 'Inicio de sesion exitoso',
                data: signature.token,
            });
        } catch (error) {
            next(error);
        }
    },
);

// Recuperacion de contraseña
router.post(
    '/recovery',
    validatorHandler(RecoverySchema, 'body'),
    async (req, res, next) => {
        try {
            const data = req.body || {};
            data.ipAddress = req.ip || req.headers['x-forwarded-for'];
            data.userAgent = req.headers['user-agent'];
            const mailSent = await service.sendRecoveryPassword(data);
            ResponseHandler.success({
                res,
                req,
                message: 'Correo de recuperacion enviado correctamente',
                data: mailSent,
            });
        } catch (error) {
            next(error);
        }
    },
);

// Cambio de contraseña
router.post(
    '/change-password',
    validatorHandler(ChangePasswordSchema, 'body'),
    async (req, res, next) => {
        try {
            const { token, newPassword } = req.body;
            const changedPassword = await service.changePassword(token, newPassword);
            ResponseHandler.success({
                res,
                req,
                message: changedPassword.message,
            });
        } catch (error) {
            next(error);
        }
    },
);

module.exports = router;
