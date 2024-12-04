const express = require('express');
const boom = require('@hapi/boom');

const authentication = require('../middlewares/authentication.handler');
const validatorHandler = require('../middlewares/validation.handler');
const {
    logError, 
    errorHandler, 
    boomErrorHandler
} = require('../middlewares/error.handler');
const checkPermission = require('../middlewares/permission.handler');
const {
    pacienteUpload
} = require('../middlewares/files.handler');
const {
    createPacienteSchema,
    updatePacienteSchema,
    getPacienteSchema
} = require('../schemas/paciente.schema');
const UserService = require('../services/user.service');
const PacienteService = require('../services/paciente.service');

const router = express.Router();
const userService = new UserService(); 
const pacienteService = new PacienteService(); 

router.post(
    '/registerPaciente',
    pacienteUpload.single('foto'), // Carga de archivos
    validatorHandler(createPacienteSchema, 'body'), // Validación combinada
    async (req, res, next) => {
        try {
            const body = req.body;

            // Si se cargó un archivo, agrega su URL al cuerpo
            if (req.file) {
                body.foto = `http://localhost:3000/Uploads/pacientes/${req.file.filename}`;
            }

            // Registrar paciente (y usuario asociado)
            const result = await pacienteService.registerPaciente(body);
            res.status(201).json(result);
        } catch (error) {
            next(error); // Manejo de errores
        }
    }
);


module.exports = router;