const express = require('express');
const passport = require('passport');
const AuthService = require('./../services/auth.service');
const ResponseHandler = require('./../middlewares/response.handler');
const service = new AuthService();
const router = express.Router();


// Loguear usuarios
router.post(
    '/login',
    passport.authenticate('local', { session: false }),
    async (req, res, next) => {
        try {
            const user = req.user;
            const signature =  service.signToken(user);
            ResponseHandler.success({
                res,
                req,
                message: `Inicio de sesion exitoso`,
                data: signature.token
            });
        } catch (error) {
            next(error);
        }
    }
);

// Recuperacion de contraseña
router.post(
    '/recovery',
    async (req, res, next) => {
        try {
            const { email } = req.body;
            const mailSent = await service.sendRecoveryPassword(email);
            ResponseHandler.success({
                res,
                req,
                message: `Correo de recuperacion enviado correctamente`,
                data: mailSent,
            });
        } catch (error) {
            next(error);
        }
    }
)


// Cambio de contraseña 
router.post(
    '/change-password',
    async (req, res, next) => {
        try {
            const { token, newPassword } = req.body;
            const changedPassword = await service.changePassword(token, newPassword);
            ResponseHandler.success({
                res,
                req,
                message: changedPassword,
            });
        } catch (error) {
            next(error);
        }
    }
);

module.exports = router;