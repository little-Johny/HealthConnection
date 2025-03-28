const express = require('express');
const validatorHandler = require('../middlewares/validation.handler');
const UserService = require('../services/user.service');
const { userUpload, getUploadedFileURL } = require('./../middlewares/files.handler');
const { createUserSchema, getQueryUserSchema, getUserSchema, updateUserSchema } = require('../schemas/user.schema');
const ResponseHandler = require('./../middlewares/response.handler');
const router = express.Router();
const service = new UserService();

// Función para procesar datos del usuario
const processUserData = (req) => {
    let data = { ...req.body };
    if (req.file) {
        data.photo = getUploadedFileURL('users', req.file.filename);
    }
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

// Obtener un usuario por ID
router.get(
    '/:id',
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
    userUpload.single('photo'),
    validatorHandler(getUserSchema, 'params'),
    validatorHandler(updateUserSchema, 'body'),
    async (req, res, next) => {
        try {
            const { id } = req.params;
            const changes = processUserData(req);

            const originalUser = await service.findOne(id);
            
            const updatedUser = await service.update(id, changes);

            //mensaje de respuesta
            const  updatedFields = Object.keys(changes).map(
                (key) =>  `${key}: '${ originalUser[key] }' → '${ updatedUser[key] }'`,
            )
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
    validatorHandler(getUserSchema, 'params'),
    async (req, res, next) => {
        try {
            const { id } = req.params;
            await service.delete(id);
            ResponseHandler.success({
                res,
                req,
                message: 'Usuario eliminado exitosamente',
                data: { id }
            });
        } catch (error) {
            next(error);
        }
    }
);

router.patch(
    '/restore/:id', 
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

router.delete(
    '/force/:id',
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
