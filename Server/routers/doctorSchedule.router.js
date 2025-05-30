const express = require('express');
const { DateTime } = require('luxon');
const passport = require('passport');
const {
    checkRole,
    resolveUserRole,
} = require('../middlewares/authentication.handler');
const validatorHandler = require('../middlewares/validation.handler');
const ResponseHandler = require('../middlewares/response.handler');
const {
    createDoctorScheduleSchema,
    createDoctorBlockSchema,
    getScheduleByDoctorIdSchema,
    getDoctorScheduleSchema,
    updateDoctorScheduleSchema,
} = require('../schemas/doctoSchedule.schema');
const ScheduleService = require('../services/schedule.service');

const service = new ScheduleService();
const router = express.Router();

// Crear horario
router.post(
    '/',
    passport.authenticate('jwt', { session: false }),
    checkRole(['doctor', 'admin']),
    validatorHandler(createDoctorScheduleSchema, 'body'),
    resolveUserRole,
    async (req, res, next) => {
        try {
            const body = { ...req.body };
            const { role, doctorId: userDoctorId } = req.user;
            if (role === 'doctor') {
                req.body.doctorId = userDoctorId;
            }
            const newSchedule = await service.create(body);
            ResponseHandler.success({
                res,
                req,
                message: `Horario del doctor ${body.doctorId} para el ${body.dayOfWeek} creado exitosamente`,
                data: newSchedule,
                statusCode: 201,
            });
        } catch (error) {
            next(error);
        }
    },
);

// Crear bloqueo en el horario
router.post(
    '/block',
    passport.authenticate('jwt', { session: false }),
    checkRole(['doctor', 'admin']),
    resolveUserRole,
    validatorHandler(createDoctorBlockSchema, 'body'),
    async (req, res, next) => {
        try {
            const body = { ...req.body };
            const { role, doctorId: userDoctorId } = req.user;
            const { doctorId } = body;
            if (role === 'doctor') {
                req.body.doctorId = userDoctorId;
            }
            const newBlock = await service.blockSchedule(doctorId, body);

            if (newBlock.requireConfirmation) {
                return res.status(200).json(newBlock);
            }

            ResponseHandler.success({
                res,
                req,
                message: `Bloqueo para el dia ${DateTime.fromISO(body.date, { zone: 'America/Bogota' }).toFormat('EEEE')} ${body.date} desde ${body.startTime} a las ${body.endTime} creado exitosamente.`,
                data: newBlock,
                statusCode: 201,
            });
        } catch (error) {
            next(error);
        }
    },
);

// Obtener horario por id de doctor
router.get(
    '/doc/:doctorId',
    passport.authenticate('jwt', { session: false }),
    resolveUserRole,
    validatorHandler(getScheduleByDoctorIdSchema, 'params'),
    async (req, res, next) => {
        try {
            const { doctorId } = req.params;
            const { role, doctorId: userDoctorId } = req.user;
            if (role === 'doctor') {
                req.params.doctorId = userDoctorId;
            }
            const schedule = await service.findByDoctorId(doctorId);
            ResponseHandler.success({
                res,
                req,
                message: `Horario del doctor ${doctorId} encontrado`,
                data: schedule,
            });
        } catch (error) {
            next(error);
        }
    },
);

// Obtener horario por su id
router.get(
    '/:id',
    passport.authenticate('jwt', { session: false }),
    checkRole(['doctor', 'admin']),
    validatorHandler(getDoctorScheduleSchema, 'params'),
    async (req, res, next) => {
        try {
            const { id } = req.params;
            const schedule = await service.findOne(id);
            ResponseHandler.success({
                res,
                req,
                message: `Horario ${id} encontrado`,
                data: schedule,
            });
        } catch (error) {
            next(error);
        }
    },
);

// Obtener horario disponible/ocupado de doctor
router.get(
    '/provision/:doctorId',
    passport.authenticate('jwt', { session: false }),
    validatorHandler(getScheduleByDoctorIdSchema, 'params'),
    resolveUserRole,
    async (req, res, next) => {
        try {
            const { doctorId } = req.params;
            const { date, status } = req.query;
            const { role, doctorId: userDoctorId } = req.user;
            if (role === 'doctor') {
                req.params.doctorId = userDoctorId;
            }
            const doctorProvision = await service.findSchedule(
                status,
                doctorId,
                date,
            );
            ResponseHandler.success({
                res,
                req,
                message: `Horario del doctor ${doctorId}`,
                data: doctorProvision,
            });
        } catch (error) {
            next(error);
        }
    },
);

// actualizar parcialmente un horario
router.patch(
    '/:id',
    passport.authenticate('jwt', { session: false }),
    checkRole(['doctor', 'admin']),
    validatorHandler(getDoctorScheduleSchema, 'params'),
    validatorHandler(updateDoctorScheduleSchema, 'body'),
    async (req, res, next) => {
        try {
            const { id } = req.params;
            const changes = { ...req.body };

            const originalSchedule = await service.findOne(id);

            const updatedSchedule = await service.update(id, changes);

            const updatedFields = Object.keys(changes).map(
                (key) => `${key}: '${originalSchedule[key]}' → '${updatedSchedule[key]}'`,
            );

            ResponseHandler.success({
                res,
                req,
                message: `Horario actualizado exitosamente, Cambios ${updatedFields.join(', ')}`,
                data: updatedSchedule,
            });
        } catch (error) {
            next(error);
        }
    },
);

// Eliminar horario de un dia por su id
router.delete(
    '/:id',
    passport.authenticate('jwt', { session: false }),
    checkRole(['doctor', 'admin']),
    validatorHandler(getDoctorScheduleSchema, 'params'),
    async (req, res, next) => {
        try {
            const { id } = req.params;
            await service.delete(id);
            ResponseHandler.success({
                res,
                req,
                message: 'Horario eliminado exitosamente',
                data: id,
            });
        } catch (error) {
            next(error);
        }
    },
);

// Remover bloqueo
router.delete(
    '/unblock/:id',
    passport.authenticate('jwt', { session: false }),
    checkRole(['doctor', 'admin']),
    validatorHandler(getDoctorScheduleSchema, 'params'),
    async (req, res, next) => {
        try {
            const { id } = req.params;
            const unblocked = await service.unblockSchedule(id);
            ResponseHandler.success({
                res,
                req,
                message: 'Bloqueo retirado',
                data: unblocked,
            });
        } catch (error) {
            next(error);
        }
    },
);

module.exports = router;
