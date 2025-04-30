const express = require('express');
const passport = require('passport');
const { checkRole, resolveUserRole } = require('./../middlewares/authentication.handler');
const ResponseHandler = require('./../middlewares/response.handler');
const validatorHandler = require('./../middlewares/validation.handler');
const ObservationService = require('./../services/observation.service');
const { createObservationSchema, getObservationSchema, updateObservationSchema } = require('./../schemas/observation.schema');
const router = express.Router();
const service = new ObservationService();

// Crear observacion
router.post(
    '/',
    passport.authenticate('jwt', { session: false }),
    checkRole(['doctor', 'admin']),
    resolveUserRole,
    validatorHandler(createObservationSchema, 'body'),
    async (req, res, next) => {
        try {
            const body = {...req.body};
            const { role, doctorId: userDoctorId } = req.user;
            if (role === 'doctor') {
                body.doctorId = userDoctorId
            };
            const newObservation = await service.create(body);
            ResponseHandler.success({
                res,
                req,
                message: `Observacion creada exitosamente`,
                data: newObservation,
                statusCode: 201,
            });
        } catch (error) {
            next(error);
        }
    }
);

// Obtener observaciones con filtros
router.get(
    '/',
    passport.authenticate('jwr', { session: false }),
    checkRole(['doctor', 'admin', 'staff']),
    async (req, res, next) => {
        try {
            const observations = await service.find(req.query);
            ResponseHandler.success({
                res,
                req,
                message: `Observaciones encontradas`,
                data: observations,
            });
        } catch (error) {
            next(error);
        }
    }
);

// Obtener observacion por su id
router.get(
    '/:id',
    passport.authenticate('jwt', { session: false }),
    validatorHandler(getObservationSchema, 'params'),
    async (req, res, next) => {
        try {
            const { id } = req.params;
            const observation = await service.findOne(id);
            ResponseHandler.success({
                res,
                req,
                message: `Observacion encontrada`,
                data: observation,
            });
        } catch (error) {
            next(error);
        }
    }
);

// Actualizar parcialmente una observacion
router.patch(
    '/:id',
    passport.authenticate('jwt', { session: false }),
    checkRole(['doctor', 'admin']),
    validatorHandler(getObservationSchema, 'params'),
    validatorHandler(updateObservationSchema, 'body'),
    async (req, res, next) => {
        try {
            const { id } = req.params;
            const changes = req.body;
            const originalObservation = await service.findOne(id);
            const updatedObservation = await service.update(id, changes);
            
            const updatedFields = Object.keys(changes).map(
                (key) => `${key}: '${originalObservation[key]}' → '${updatedObservation[key]}'`
            );

            ResponseHandler.success({
                res,
                req,
                message: `Observacion actualizada exitosamente. Cambios: ${updatedFields.join(', ')}`,
                data: updatedObservation
            });

        } catch (error) {
            next(error);
        }
    }
);

// Eliminar una observacion
router.delete(
    '/:id',
    passport.authenticate('jwt', { session: false }),
    checkRole(['doctor', 'admin']),
    validatorHandler(getObservationSchema, 'params'),
    async (req, res, next) => {
        try {
            const { id } = req.params;
            await service.delete(id);
            ResponseHandler.success({
                res,
                req,
                message: `Observacion eliminada exitosamente`,
                data: id,
            });
        } catch (error) {
            next(error);
        }
    }
);

module.exports = router;