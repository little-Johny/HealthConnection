const express = require('express');
const router = express.Router();
const DoctorService = require('../services/doctor.service');
const boom = require('@hapi/boom');
const { doctoresFotoUpload, doctoresTarjetaUpload } = require('../middlewares/files.handler');

// Instanciar el servicio
const doctorService = new DoctorService();

// Registrar un nuevo doctor
router.post(
    '/registerDoctor',
    doctoresFotoUpload.single('foto'),
    async (req, res, next) => {
        try {
            const body = req.body;

            if (req.file) {
                body.foto = `http://localhost:3000/Uploads/doctores/foto/${req.file.filename}`;
            }
            

            const result = await doctorService.registerDoctor(body);
            res.status(201).json(result);
        } catch (error) {
            next(error);
        }
    }
);

// Obtener todos los doctores activos
router.get('/active', async (req, res, next) => {
    try {
        const result = await doctorService.getActiveDoctors();
        res.status(200).json(result);
    } catch (error) {
        next(error);
    }
});

// Buscar doctor por número de documento
router.get('/:numero_documento', async (req, res, next) => {
    try {
        const result = await doctorService.findByDocumento(req.params.numero_documento);
        res.status(200).json(result);
    } catch (error) {
        next(error);
    }
});

// Actualizar doctor
router.patch(
    '/:numero_documento',
    (req, res, next) => {
        // Middleware para manejar las subidas de archivos
        doctoresFotoUpload.single('foto')(req, res, (err) => {
            if (err) return next(err);
            doctoresTarjetaUpload.single('tarjeta_profesional')(req, res, next);
        });
    },
    async (req, res, next) => {
        const { numero_documento } = req.params;
        let updates = { ...req.body };

        if (req.files && req.files['foto']) {
            updates.foto = `http://localhost:3000/Uploads/doctores/fotos/${req.files['foto'][0].filename}`;
        }
        if (req.files && req.files['tarjeta_profesional']) {
            updates.tarjeta_profesional = `http://localhost:3000/Uploads/doctores/tarjetas/${req.files['tarjeta_profesional'][0].filename}`;
        }

        try {
            const result = await doctorService.updateDoctor(numero_documento, updates);
            res.status(200).json(result);
        } catch (error) {
            next(error);
        }
    }
);

// Eliminar doctor
router.delete('/:numero_documento', async (req, res, next) => {
    try {
        const result = await doctorService.deleteDoctor(req.params.numero_documento);
        res.status(200).json(result);
    } catch (error) {
        next(error);
    }
});

module.exports = router;
