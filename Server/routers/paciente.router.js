const express = require('express');
const boom = require('@hapi/boom');

const authentication = require('../middlewares/authentication.handler');
const validatorHandler = require('../middlewares/validation.handler');

const checkPermission = require('../middlewares/permission.handler');
const { pacienteUpload } = require('../middlewares/files.handler');
const ResponseHandler = require('../middlewares/response.handler');

const {
    createPacienteSchema,
    updatePacienteSchema,
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
            ResponseHandler.success({
                res,
                message: 'Paciente registrado exitosamente.',
                data: result,
                status: 201,
            });
        } catch (error) {
            next(error);
        }
    }
);

// Ruta para desactivar paciente
router.patch(
    '/deactivate/:documento',
    authentication,
    checkPermission('administrador', 'asistente'),
    async (req, res, next) => {
        try {
            const { documento } = req.params;
            const result = await service.deactivatePaciente(documento);
            ResponseHandler.success({
                res,
                message: 'Paciente desactivado exitosamente.',
                data: result,
            });
        } catch (error) {
            next(error);
        }
    }
);

// Ruta para obtener pacientes activos
router.get(
    '/getActive',
    authentication,
    checkPermission('administrador', 'asistente'),
    async (req, res, next) => {
        try {
            const result = await service.getActivePacientes();
            ResponseHandler.success({
                res,
                message: 'Pacientes activos obtenidos exitosamente.',
                data: result,
            });
        } catch (error) {
            next(error);
        }
    }
);

// Endpoint para obtener un paciente por documento
router.get(
    '/pacienteDocument/:documento', 
    authentication,
    checkPermission('administrador','asistente'),
    async (req, res, next) => {
        try {
            const { documento } = req.params;

            // Llamar al servicio para obtener el paciente
            const result = await service.findByDocumento(documento);

            ResponseHandler.success({
                res,
                message: 'Paciente obtenido exitosamente.',
                data: result,
            });
        } catch (error) {
            next(error);
        }
    }
);

// encontrar paciente logueado
router.get(
    '/profile',
    authentication, // Middleware de autenticación
    async (req, res, next) => {
        try {
            const id = req.user.userId; 
            const result = await service.findById(id);

            // No necesitas verificar permisos aquí porque el ID viene directamente del token
            return ResponseHandler.success({
                res,
                message: 'Perfil obtenido exitosamente.',
                data: result,
            });
        } catch (error) {
            next(error); // Manejar errores con el middleware global
        }
    }
);

//Actualizando perfil propio
router.patch(
    '/editProfile',
    authentication,  // Asegúrate de que authHandler esté correctamente configurado
    validatorHandler(updatePacienteSchema, 'body'),
    pacienteUpload.single('foto'),
    async (req, res, next) => {
        try {
            const id = req.user.userId;  // Obtienes el ID del usuario logueado
            const result = await service.findById(id);  // Obtienes el paciente
            if (!result) {
                return next(boom.notFound('Paciente no encontrado.'));
            }
            
            const documento = result.paciente.numero_documento;  // Suponiendo que el resultado tiene paciente.numero_documento
            const body = req.body;

            // Si se sube una foto, la agregas al cuerpo
            if (req.file) {
                body.foto = `http://localhost:3000/Uploads/pacientes/${req.file.filename}`;
            }

            // Actualizas el paciente usando el documento
            const updatedUser = await service.updatePaciente(documento, body);

            // Respuesta de éxito
            ResponseHandler.success({
                res,
                message: 'Paciente actualizado exitosamente.',
                data: updatedUser,  // Asegúrate de devolver los datos actualizados
            });
        } catch (error) {
            next(error);  // Pasa el error al middleware global
        }
    }
);


// Ruta para actualizar paciente
router.patch(
    '/updatePaciente/:documento',
    authentication,
    checkPermission('administrativo', 'asistente'),
    pacienteUpload.single('foto'),
    validatorHandler(updatePacienteSchema, 'body'),
    async (req, res, next) => {
        try {
            const { documento } = req.params;
            let updates = { ...req.body };

            // Si se sube una foto, se asigna la URL al campo 'foto' de los datos
            if (req.file) {
                updates.foto = `http://localhost:3000/Uploads/pacientes/${req.file.filename}`;
            }

            const result = await service.updatePaciente(documento, updates);

            ResponseHandler.success({
                res,
                message: 'Paciente actualizado exitosamente.',
                data: result,
            });
        } catch (error) {
            next(error);
        }
    }
);

// Ruta para eliminar paciente
router.delete(
    '/deletePaciente/:documento',
    authentication,
    checkPermission('administrativo'),
    async (req, res, next) => {
        try {
            const { documento } = req.params;

            const result = await service.deletePaciente(documento);

            ResponseHandler.success({
                res,
                message: 'Paciente eliminado exitosamente.',
                data: result,
            });
        } catch (error) {
            next(error);
        }
    }
);

module.exports = router;
