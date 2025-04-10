const express = require('express');
const passport = require('passport');
const validatorHandler = require('../middlewares/validation.handler');
const { userUpload, getUploadedFileURL } = require('./../middlewares/files.handler');
const ResponseHandler = require('./../middlewares/response.handler');
const { checkRole } = require('./../middlewares/authentication.handler');
const UserService = require('../services/user.service');
const { createUserSchema, getQueryUserSchema, getUserSchema, updateUserSchema } = require('../schemas/user.schema');
const router = express.Router();
const service = new UserService();

// Función para procesar datos del usuario
const processUserData = (req) => {
    let data = { ...req.body };
    if (req.file) {
        data.photo = getUploadedFileURL('users', req.file.filename);
    }
    console.log({...req.body}, data)
    return data;
};

// Crear usuario
router.post(
    '/',
    userUpload.single('photo'),
    validatorHandler(createUserSchema, 'body'),
    async (req, res, next) => {
        try {
            const userData = processUserData(req);
            const newUser = await service.create(userData);
            ResponseHandler.success({
                res,
                req,
                message: 'Usuario creado exitosamente',
                data: newUser,
                statusCode: 201
            });
        } catch (error) {
            next(error);
        }
    }
);

// Obtener usuarios con filtros
router.get(
    '/',
    passport.authenticate('jwt', { session: false }),
    validatorHandler(getQueryUserSchema, 'query'),
    async (req, res, next) => {
        try {
            const users = await service.find(req.query);
            ResponseHandler.success({
                res,
                req,
                message: 'Usuarios encontrados',
                data: users,
            });
        } catch (error) {
            next(error);
        }
    }
);

// obtener todos los usuarios incluso los eliminados
router.get(
    '/all',
    passport.authenticate('jwt', { session: false }),
    checkRole(['admin']),
    async (req, res, next) => {
        try {
            const users = await service.findAll();
            ResponseHandler.success({
                res,
                req,
                message: `Usuarios encontrados`,
                data: users,
            });
        } catch (error) {
            next(error);
        }
    }
);

// Obtener el usuario loggeado
router.get(
    '/profile',
    passport.authenticate('jwt', { session: false }),
    async (req, res, next) => {
        try {
            const user = await service.findOne(req.user.sub);
            ResponseHandler.success({
                res,
                req,
                message: `Ingresando al perfil de ${user.username}`,
                data: user,
            });
        } catch (error) {
            next(error);
        }
    }
);

// Obtener un usuario por ID
router.get(
    '/:id',
    passport.authenticate('jwt', { session: false }),
    checkRole(['doctor', 'admin', 'staff']),
    validatorHandler(getUserSchema, 'params'),
    async (req, res, next) => {
        try {
            const { id } = req.params;
            const user = await service.findOne(id);
            ResponseHandler.success({
                res,
                req,
                message: `Usuario con ID ${id} encontrado`,
                data: user,
            });
        } catch (error) {
            next(error);
        }
    }
);


// Actualizar parcialmente un usuario
router.patch(
    '/:id',
    passport.authenticate('jwt', { session: false }),
    userUpload.single('photo'),
    validatorHandler(getUserSchema, 'params'),
    validatorHandler(updateUserSchema, 'body'),
    async (req, res, next) => {
        try {
            const { id } = req.params;
            const changes = processUserData(req);

            const originalUser = await service.findOne(id);
            await service.update(id, changes);
            const updatedUser = await service.findOne(id); // Asegurar que los datos sean frescos

            // Mensaje de respuesta con los campos actualizados
            const updatedFields = Object.keys(changes).map((key) => {
                let originalValue = originalUser[key] ?? null;
                let updatedValue = updatedUser[key] ?? null;

                // Verificar si el campo pertenece a patient o doctor
                if (originalUser.role === 'patient' && originalUser.patient) {
                    originalValue = originalUser.patient[key] ?? originalValue;
                    updatedValue = updatedUser.patient ? updatedUser.patient[key] ?? updatedValue : updatedValue;
                }
                if (originalUser.role === 'doctor' && originalUser.doctor) {
                    originalValue = originalUser.doctor[key] ?? originalValue;
                    updatedValue = updatedUser.doctor ? updatedUser.doctor[key] ?? updatedValue : updatedValue;
                }

                return `${key}: '${originalValue}' → '${updatedValue}'`;
            });

            ResponseHandler.success({
                res,
                req,
                message: `Usuario actualizado exitosamente. Cambios: ${updatedFields.join(', ')}`,
                data: updatedUser
            });
        } catch (error) {
            next(error);
        }
    }
);




// Eliminar usuario por ID
router.delete(
    '/:id',
    passport.authenticate('jwt', { session: false }),
    checkRole(['admin']),
    validatorHandler(getUserSchema, 'params'),
    async (req, res, next) => {
        try {
            const { id } = req.params;
            await service.delete(id);
            ResponseHandler.success({
                res,
                req,
                message: 'Usuario eliminado exitosamente',
                data: id 
            });
        } catch (error) {
            next(error);
        }
    }
);

// Restaurar un usuario
router.patch(
    '/restore/:id',
    passport.authenticate('jwt', { session: false }),
    checkRole(['admin']), 
    validatorHandler(getUserSchema, 'params'),
    async (req, res, next) => {
        try {
            const { id } = req.params;
            const restoredUser = await service.restore(id);
            ResponseHandler.success({
                res,
                req,
                message: 'Usuario restaurado exitosamente',
                data: restoredUser
            });
        } catch (error) {
            next(error);
        }
    }
);

// Eliminacion definitiva de un usuario
router.delete(
    '/force/:id',
    passport.authenticate('jwt', { session: false }),
    checkRole(['admin']),
    validatorHandler(getUserSchema, 'params'),
    async (req, res, next) => {
        try {
            const { id } = req.params;
            const fullDelete = await service.forceDelete(id);
            ResponseHandler.success({
                req,
                res,
                message: fullDelete.message,
                data: id,
            });
        } catch (error) {
            next(error);
        }
    }
);


module.exports = router;
