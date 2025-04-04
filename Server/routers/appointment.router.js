const express = require('express');
const router = express.Router();
const AppointmentService = require('./../services/appointment.service');
const ResponseHandler = require('./../middlewares/response.handler');
const service = new AppointmentService();


// Registrar una nueva cita
router.post(
    '/',
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
    async (req, res, next) => {
        try {
            const { id } = req.params;
            const body = {...req.body};
            const updatedAppointment = await service.update(id, body);

        } catch (error) {
            next(error);
        }
    }
);

module.exports = router;
