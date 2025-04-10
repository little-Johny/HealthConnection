const express = require('express');
const passport = require('passport');
const { checkRole } = require('./../middlewares/authentication.handler');
const validatorHandler = require('./../middlewares/validation.handler');
const ResponseHandler = require('./../middlewares/response.handler');
const SpecialityService = require('./../services/speciality.service');
const { createSpecialitySchema, getQuerySpecialitySchema, getSpecialitySchema, updateSpecialitySchema } = require('./../schemas/speciality.schema');
const router = express.Router();
const service = new SpecialityService();

// crear especialidad
router.post(
    '/',
    passport.authenticate('jwt', { session: false }),
    checkRole(['admin']),
    validatorHandler(createSpecialitySchema, 'body'),
    async (req, res, next) => {
        try {
            const body = { ...req.body };
            const newSpeciality = await service.create(body);
            ResponseHandler.success({
                res,
                req,
                message: `Especialidad creada exitosamente`,
                data: newSpeciality,
                statusCode: 201,
            });
        } catch (error) {
            next(error);
        }
    }
);

// Obtener especialidad con filtros
router.get(
    '/',
    passport.authenticate('jwt', { session: false }),
    checkRole(['admin']),
    validatorHandler(getQuerySpecialitySchema, 'query'),
    async (req, res, next) => {
        try {
            const specialities = await service.find(req.query);
            ResponseHandler.success({
                res,
                req,
                message: 'Especialidades encontradas',
                data: specialities,
            });
        } catch (error) {
            next(error);
        }
    }
);

// Obtener una especialidad por su ID
router.get(
    '/:id',
    passport.authenticate('jwt', { session: false }),
    checkRole(['admin']),
    validatorHandler(getSpecialitySchema, 'params'),
    async (req, res, next) => {
        try {
            const { id } = req.params;
            const speciality = await service.findOne(id);
            ResponseHandler.success({
                res,
                req,
                message: `Especialidad con ID ${id} encontrada`,
                data: speciality,
            });
        } catch (error) {
            next(error);
        }
    }
);

// Actualizar parcialmente una especialidad
router.patch(
    '/:id',
    passport.authenticate('jwt', { session: false }),
    checkRole(['admin']),
    validatorHandler(getSpecialitySchema, 'params'),
    validatorHandler(updateSpecialitySchema, 'body'),
    async (req, res, next) => {
        try {
            const { id } = req.params;
            const changes = { ...req.body };

            const originalSpeciality = await service.findOne(id);

            const updatedSpeciality = await service.update(id, changes);

            //mensaje de respuesta
            const updatedFields = Object.keys(changes).map(
                (key) => `${key}: '${ originalSpeciality[key] }' → '${ updatedSpeciality[key] }'`,
            )

            ResponseHandler.success({
                res,
                req,
                message: `Especialidad actualizada exitosamente. Cambios: ${updatedFields.join(', ')}`,
                data: updatedSpeciality
            });
        } catch (error) {
            next(error);
        }
    }
);

// Eliminar una especialidad por ID
router.delete(
    '/:id',
    passport.authenticate('jwt', { session: false }),
    checkRole(['admin']),
    validatorHandler(getSpecialitySchema, 'params'),
    async (req, res, next) => {
        try {
            const { id } = req.params;
            await service.delete(id);
            ResponseHandler.success({
                res,
                req,
                message: `Especialidad eliminada exitosamente`,
                data: id,
            });
        } catch (error) {
            next(error);
        }
    }
);

module.exports = router;