const express = require('express');
const boom = require('@hapi/boom');

const authentication = require('../middlewares/authentication.handler');
const validatorHandler = require('../middlewares/validation.handler');

const checkPermission = require('../middlewares/permission.handler');
const { pacienteUpload } = require('../middlewares/files.handler');
const {
    createPacienteSchema,
    updatePacienteSchema,
    getPacienteSchema
} = require('../schemas/paciente.schema');

const PacienteService = require('../services/paciente.service');

const router = express.Router();
const service = new PacienteService(); 

// Ruta para registrar paciente
router.post(
    '/registerPaciente',
    pacienteUpload.single('foto'),
    validatorHandler(createPacienteSchema, 'body'),
    async (req, res, next) => {
        try {
            const body = req.body;

            // Si se cargó un archivo, agrega su URL al cuerpo
            if (req.file) {
                body.foto = `http://localhost:3000/Uploads/pacientes/${req.file.filename}`;
            }

            // Registrar paciente (y usuario asociado)
            const result = await service.registerPaciente(body);
            res.status(201).json(result);
        } catch (error) {
            next(error);
        }
    }
);

// Ruta para desactivar paciente
router.patch(
    '/deactivate/:documento',
    authentication, // Middleware de autenticación
    // checkRole('administrador'), // Middleware de roles si se desea control de acceso
    async (req, res, next) => {
        try {
            const { documento } = req.params;
            const result = await service.deactivatePaciente(documento);
            res.json(result);
        } catch (error) {
            next(error);
        }
    }
);

// Ruta para obtener pacientes activos
router.get(
    '/getActive',
    authentication, // Middleware de autenticación
    // checkRole('administrador', 'asistente', 'doctor'), // Control de roles si es necesario
    async (req, res, next) => {
        try {
            const result = await service.getActivePacientes();
            res.json(result);
        } catch (error) {
            next(error);
        }
    }
);

// Endpoint para obtener un paciente por documento
router.get('/pacienteDocument/:documento', async (req, res, next) => {
    const { documento } = req.params;  // Obtener el documento de los parámetros de la URL

    try {
        // Llamar al servicio para obtener el paciente
        const result = await service.findByDocumento(documento);
        
        // Devolver los datos del paciente si se encuentra
        res.json(result);
    } catch (error) {
        next(error);  // Pasar el error al manejador de errores
    }
});

// Ruta para actualizar paciente
router.patch(
    '/updatePaciente/:documento',
    authentication,  // Middleware de autenticación
    pacienteUpload.single('foto'),  // Middleware para manejar la carga de la foto
    validatorHandler(updatePacienteSchema, 'body'),  // Validación de los datos del cuerpo
    async (req, res, next) => {
        const { documento } = req.params;
        let updates = { ...req.body };  // Copia de los datos enviados en el cuerpo de la solicitud

        // Si se sube una foto, se asigna la URL al campo 'foto' de los datos
        if (req.file) {
            updates.foto = `http://localhost:3000/Uploads/pacientes/${req.file.filename}`;
        }

        try {
            // Llamada al servicio para actualizar el paciente
            const result = await service.updatePaciente(documento, updates);
            res.json(result);
        } catch (error) {
            next(error);  // Pasa el error al manejador global
        }
    }
);

// Ruta para eliminar paciente
router.delete(
    '/deletePaciente/:documento', 
    authentication, // Autenticación del usuario
    // checkRole('administrador', 'asistente'), // Control de roles, si es necesario
    async (req, res, next) => {
        const { documento } = req.params;

        try {
            const result = await service.deletePaciente(documento);
            res.json(result);
        } catch (error) {
            next(error);
        }
    }
);

module.exports = router;
