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



module.exports = router;
