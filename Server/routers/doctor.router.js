const express = require('express');
const validatorHandler = require('../middlewares/validation.handler');
const { userUpload, getUploadedFileURL } = require('../middlewares/files.handler');
const ResponseHandler = require('../middlewares/response.handler');
const {
    createDoctorSchema,
    getDoctorSchema,
} = require('../schemas/doctor.schema');
const DoctorService = require('../services/doctor.service');
const router = express.Router();
const service = new DoctorService();

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
    validatorHandler(createDoctorSchema, 'body'),
    async (req, res, next) => {
        try {
            const fullData = processUserData(req);
            const newDoctor = await service.create(fullData);
            ResponseHandler.success({
                res,
                req,
                message: 'Doctor creado exitosamente con un usuario asociado',
                data: newDoctor,
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
    validatorHandler(getDoctorSchema, 'params'),
    async (req, res, next) => {
        try {
            const { id } = req.params;
            const doctor = await service.findOne(id);
            ResponseHandler.success({
                res,
                req,
                message: `Doctor con ID ${id} encontrado`,
                data: doctor,
            });
        } catch (error) {
            next(error);
        }
    }
);

module.exports = router;