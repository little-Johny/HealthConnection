const express = require('express');
const router = express.Router();
const ResponseHandler = require('./../middlewares/response.handler');
const validatorHandler = require('./../middlewares/validation.handler');
const { createAppointmentSchema, getAppointmentSchema, getQueryAppointmentSchema, updateAppointmentSchema, updateStatusAppointmentSchema } = require('./../schemas/appointment.schema');
const AppointmentService = require('./../services/appointment.service'); 
const service = new AppointmentService();


// Registrar una nueva cita
router.post(
    '/',
    validatorHandler(createAppointmentSchema, 'body'),
    async (req, res, next) => {
        try {
            const body = {...req.body};
            const newAppointment = await service.create(body);
            ResponseHandler.success({
                res,
                req,
                message: `Cita creada exitosamente`,
                data: newAppointment,
                statusCode: 201,
            });
        } catch (error) {
            next(error);
        }
    }
);

// Obtener citas con varios filtros
router.get(
    '/',
    validatorHandler(getQueryAppointmentSchema, 'query'),
    async (req, res, next) => {
        try {
            const appointments = await service.find(req.query);
            ResponseHandler.success({
                res,
                req,
                message: `Citas encontradas`,
                data: appointments,
            });
        } catch (error) {
            next(error);
        }
    },
);

// Obtener una cita por su id
router.get(
    '/:id',
    validatorHandler(getAppointmentSchema, 'params'),
    async (req, res, next) => {
        try {
            const { id } = req.params; 
            const appointment = await service.findOne(id);
            ResponseHandler.success({
                res,
                req,
                message: `Cita encontrada`,
                data: appointment,
            });
        } catch (error) {
            next(error);
        }
    }
);

// Actualizar parcialmente una cita
router.patch(
    '/:id',
    validatorHandler(getAppointmentSchema, 'params'),
    validatorHandler(updateAppointmentSchema, 'body'),
    async (req, res, next) => {
        try {
            const { id } = req.params;
            const changes = {...req.body};
            const originalAppointment = await service.findOne(id);

            const updatedAppointment = await service.update(id, changes);
            
            const updatedFields = Object.keys(changes).map(
                (key) => `${key}: '${originalAppointment[key]}' → '${updatedAppointment[key]}'`,
            );
            
            ResponseHandler.success({
                res,
                req,
                message: `Cita actualizada exitosamente. Cambios: ${updatedFields.join(', ')}`,
                data: updatedAppointment,
            });
        } catch (error) {
            next(error);
        }
    }
);

// Eliminar una cita
router.delete(
    '/:id',
    validatorHandler(getAppointmentSchema, 'params'),
    async (req, res, next) => {
        try {
            const { id } = req.params;
            await service.delete(id);
            ResponseHandler.success({
                res,
                req,
                message: `Cita eliminada`,
                data: id,
            });
        } catch (error) {
            next(error);
        }
    }
);

// Cambiar el estado de una cita
router.patch(
    '/:id/status',
    validatorHandler(getAppointmentSchema, 'params'),
    validatorHandler(updateStatusAppointmentSchema, 'body'),
    async (req, res, next) => {
        try {
            const { id } = req.params;
            const { status } = req.body;

            const updatedAppointment = await service.changeState(id, status);

            ResponseHandler.success({
                res,
                req,
                message: `El estado de la cita ahora es ${status}`,
                data: updatedAppointment,
            });
        } catch (error) {
            next(error);
        }
    }
);

module.exports = router;
