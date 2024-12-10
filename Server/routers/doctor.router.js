const express = require('express');
const router = express.Router();
const DoctorService = require('../services/doctor.service');
const boom = require('@hapi/boom');
const { doctoresUpload } = require('../middlewares/files.handler');
const validatorHandler = require('../middlewares/validation.handler');
const authentication = require('../middlewares/authentication.handler');
const ResponseHandler = require('../middlewares/response.handler');
const {
    createDoctorSchema,
    updateDoctorSchema,
    getDoctorSchema
} = require('../schemas/doctores.schema');
const responseHandler = require('../middlewares/response.handler');


// Instanciar el servicio
const doctorService = new DoctorService();

// Registrar un nuevo doctor
router.post(
    '/registerDoctor',
    doctoresUpload.single('foto'),
    validatorHandler(createDoctorSchema, 'body'),
    async (req, res, next) => {
        try {
            const body = req.body;

            if (req.file) {
                body.foto = `http://localhost:3000/Uploads/doctores/${req.file.filename}`;
            }
            
            // Registrar doctor (y usuario asociado)
            const result = await doctorService.registerDoctor(body);
            ResponseHandler.success({
                res,
                message: 'Doctor registrado exitosamente.',
                data: result,
                status: 201,
            });
        } catch (error) {
            next(error);
        }
    }
);

//Desactivar doctor
router.patch(
    '/deactivate/:documento',
    async ( req, res, next) => {
        try {
            const { documento } = req.params;
            
            const  result = await doctorService.deactivateDoctor(documento);
            responseHandler.success({
                res,
                message: 'Doctor desactivado exitosamente.',
                data: result,
            });
        } catch (error) {
            next(error);
        }
    }
);

// Obtener todos los doctores activos
router.get(
    '/getActive', 
    async (req, res, next) => {
        try {
            const result = await doctorService.getActiveDoctors();
            ResponseHandler.success({
                res,
                message: 'Doctores activos obtenidos exitosamente.',
                data: result,
            });
        } catch (error) {
            next(error);
        }
    }
);

router.get(
    '/profile',
    authentication, // Middleware de autenticación
    async (req, res, next) => {
        try {
            const id = req.user.userId; 
            const result = await doctorService.findById(id);

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
router.get(
    '/profileDoctor/:id',
    authentication, // Middleware de autenticación
    async (req, res, next) => {
        try {
            const {id} = req.params; 
            const result = await doctorService.findById(id);

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

// Buscar doctor por número de documento
router.get(
    '/doctorDocument/:documento', 
    async (req, res, next) => {
        try {
            const { documento } = req.params;

            const result = await doctorService.findByDocumento(documento);
            ResponseHandler.success({
                res,
                message: 'Doctor obtenido exitosamente.',
                data: result,
            });
        } catch (error) {
            next(error);
        }
    }
);

//obtener todas las especialidades
router.get(
    '/especialidades',
    async (req, res, next) => {
        try {
            const result = await doctorService.getEspecialidades();
            ResponseHandler.success({
                res,
                message: 'Especialidades obtenidas exitosamente.',
                data: result,
            });
        } catch (error) {
            next(error);
        }
    }
)

// Actualizar doctor
router.patch(
    '/updateDoctor/:documento',
    doctoresUpload.single('foto'),
    validatorHandler(updateDoctorSchema, 'body'),
    async (req, res, next) => {
        try {
            const { documento } = req.params;
            let updates = { ...req.body };

            if (req.file) {
                updates.foto = `http://localhost:3000/Uploads/doctores/${req.file.filename}`;
            }

            const result = await doctorService.updateDoctor(documento, updates);
            
            ResponseHandler.success({
                res,
                message: 'Doctor actualizado exitosamente.',
                data: result,
            });
        } catch (error) {
            next(error);
        }
    }
);

// Eliminar doctor
router.delete(
    '/deleteDoctor/:documento', 
    async (req, res, next) => {
        try {
            const { documento } = req.params;

            const result = await doctorService.deleteDoctor(documento);

            ResponseHandler.success({
                res,
                message: 'Doctor eliminado exitosamente.',
                data: result,
            });
        } catch (error) {
            next(error);
        }
    }
);

module.exports = router;
