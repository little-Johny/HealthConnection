const express = require('express');
const validatorHandler = require('./../middlewares/validation.handler');
const ResponseHandler = require('./../middlewares/response.handler');
const SpecialityService = require('./../services/speciality.service');
const { createSpecialitySchema, getQuerySpecialitySchema, getSpecialitySchema, updateSpecialitySchema } = require('./../schemas/speciality.schema');
const router = express.Router();
const service = new SpecialityService();

// crear especialidad
router.post(
    '/',
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

// Obtener un usuario por su ID
router.get(
    '/:id',
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