const express = require('express');
const passport = require('passport');
const validatorHandler = require('../middlewares/validation.handler');
const ResponseHandler = require('../middlewares/response.handler');
const {
    checkRole,
    resolveUserRole,
} = require('../middlewares/authentication.handler');
const {
    createClinicalHistorySchema,
    getClinicalHistorySchema,
    updateClinicalHistorySchema,
} = require('../schemas/clinicalHistory.schema');
const ClinicalHistoryService = require('../services/clinicalHistory.service');

const service = new ClinicalHistoryService();
const router = express.Router();

// Crear historia clinica de paciente
router.post(
    '/',
    passport.authenticate('jwt', { session: false }),
    validatorHandler(createClinicalHistorySchema, 'body'),
    resolveUserRole,
    async (req, res, next) => {
        try {
            const body = { ...req.body };
            const { role, patientId: userPatientId } = req.user;
            if (role === 'patient') {
                body.patientId = userPatientId;
            }
            const newClinicalHistory = await service.create(body);
            ResponseHandler.success({
                res,
                req,
                message: `Historia clinica de paciente ${body.patientId} creado exitosamente`,
                data: newClinicalHistory,
                statusCode: 201,
            });
        } catch (error) {
            next(error);
        }
    },
);

// Obtener una historia clinica por su id
router.get(
    '/:id',
    passport.authenticate('jwt', { session: false }),
    validatorHandler(getClinicalHistorySchema, 'params'),
    async (req, res, next) => {
        try {
            const { id } = req.params;
            const clinicalHistory = await service.findOne(id);
            ResponseHandler.success({
                res,
                req,
                message: 'Historia clinica encontrado',
                data: clinicalHistory,
            });
        } catch (error) {
            next(error);
        }
    },
);

// Actualizar parcialmente una historia clinica
router.patch(
    '/:id',
    passport.authenticate('jwt', { session: false }),
    validatorHandler(getClinicalHistorySchema, 'params'),
    validatorHandler(updateClinicalHistorySchema, 'body'),
    async (req, res, next) => {
        try {
            const { id } = req.params;
            const changes = { ...req.body };

            const originalClinicalHistory = await service.findOne(id);

            const updatedClinicalHistory = await service.update(id, changes);

            const updatedFields = Object.keys(changes).map(
                (key) => `${key}: '${originalClinicalHistory[key]}' → '${updatedClinicalHistory[key]}'`,
            );

            ResponseHandler.success({
                res,
                req,
                message: `Historia clinica acualizada correctamente. Cambios: ${updatedFields.join(', ')}`,
                data: updatedClinicalHistory,
            });
        } catch (error) {
            next(error);
        }
    },
);

module.exports = router;
