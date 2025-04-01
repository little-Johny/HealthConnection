const express = require('express');
const validatorHandler = require('../middlewares/validation.handler');
const { userUpload, getUploadedFileURL } = require('../middlewares/files.handler');
const ResponseHandler = require('../middlewares/response.handler');
const {
    createPatientSchema,
    getPatientSchema,
} = require('../schemas/patient.schema');
const PatientService = require('../services/patient.service');
const router = express.Router();
const service = new PatientService();

// Función para procesar datos del usuario
const processUserData = (req) => {
    let data = { ...req.body };
    if (req.file) {
        data.photo = getUploadedFileURL('users', req.file.filename);
    }
    return data;
};

// Crear un paciente con un usuario asociado
router.post(
    '/',
    userUpload.single('photo'),
    validatorHandler(createPatientSchema, 'body'),
    async (req, res, next) => {
        try {
            const fullData = processUserData(req);
            const newPatient = await service.create(fullData);
            ResponseHandler.success({
                res,
                req,
                message: 'Paciente creado exitosamente con un usuario asociado',
                data: newPatient,
                statusCode:201
            });
        } catch (error) {
            next(error);
        }
    }
);

// Encontrar un paciente por su id
router.get(
    '/:id',
    validatorHandler(getPatientSchema, 'params'),
    async (req, res, next) => {
        try {
            const { id } = req.params;
            const patient = await service.findOne(id);
            ResponseHandler.success({
                res,
                req,
                message: `Paciente con ID ${id} encontrado`,
                data: patient,
            });
        } catch (error) {
            next(error);
        }
    }
);

module.exports = router;