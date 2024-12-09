const express = require('express');
const router = express.Router();
const PersonalAdministrativoService = require('../services/administrativos.service');
const boom = require('@hapi/boom');
const validatorHandler = require('../middlewares/validation.handler')
const {createAdministrativoSchema, updateAdministrativoSchema, getAdministrativoSchema} = require('../schemas/administrativos.schemas')
const {administrativoUpload} = require('../middlewares/files.handler');
const ResponseHandler = require('../middlewares/response.handler');

// Instanciar el servicio
const personalService = new PersonalAdministrativoService();

// Endpoint para registrar un nuevo personal administrativo
router.post(
    '/registerAdministrativo',
    administrativoUpload.single('foto'),
    validatorHandler(createAdministrativoSchema, 'body'), 
    async (req, res, next) => {
    try {
        const body = req.body;

        // Si se cargó un archivo, agrega su URL al cuerpo
        if (req.file) {
            body.foto = `http://localhost:3000/Uploads/administrativos/${req.file.filename}`;
        }

        const result = await personalService.registerPersonalAdministrativo(body);
        ResponseHandler.success({
            res,
            message: 'Personal Administrativo registrado exitosamente.',
            data: result,
            status: 201,
        });
    } catch (error) {
        next(error); // Pasar el error al manejador de errores global
    }
});

// Ruta para desactivar administrativo
router.patch(
    '/deactivate/:documento',
    async (req, res, next) => {
        try {
            const { documento } = req.params;
            const result = await personalService.deactivatePersonal(documento);
            ResponseHandler.success({
                res,
                message: 'Administrativo desactivado exitosamente.',
                data: result,
            });
        } catch (error) {
            next(error);
        }
    }
);

// Endpoint para obtener todos los personal administrativo activos
router.get('/getActive', async (req, res, next) => {
    try {
        const result = await personalService.getActivePersonal();
        res.status(200).json(result);
    } catch (error) {
        next(error);
    }
});

// Endpoint para buscar personal administrativo por número de documento
router.get(
    '/administrativoDocument/:documento', 
    async (req, res, next) => {
        try {
            const { documento } = req.params;

            const result = await personalService.findByDocumento(documento);
            
            ResponseHandler.success({
                res,
                message: 'Administrativo obtenido exitosamente.',
                data: result,
            });
        } catch (error) {
            next(error);
        }
    }
);

// Endpoint para actualizar los datos del personal administrativo de manera parcial
router.patch(
    '/updateAdministrativo/:documento', 
    administrativoUpload.single('foto'), 
    validatorHandler(updateAdministrativoSchema, 'body'),
    async (req, res, next) => {
        try {
            const { documento } = req.params;
            let updates = { ...req.body };  // Copia de los datos enviados en el cuerpo de la solicitud

            // Si se sube una foto, se asigna la URL al campo 'foto' de los datos
            if (req.file) {
                updates.foto = `http://localhost:3000/Uploads/administrativos/${req.file.filename}`;
            }

            const result = await personalService.updatePersonal(documento, updates);
            
            ResponseHandler.success({
                res,
                message: 'Administrativo actualizaso exitosamente.',
                data: result,
            });
        } catch (error) {
            next(error);
        }
    }
);

// Endpoint para eliminar un personal administrativo
router.delete(
    '/deleteAdministrativo/:documento', 
    async (req, res, next) => {
        try {
            const { documento } = req.params;

            const result = await personalService.deletePersonal(documento);
            
            ResponseHandler.success({
                res,
                message: 'Administrativo eliminado exitosamente.',
                data: result,
            });
        } catch (error) {
            next(error);
        }
    }
);

module.exports = router;
