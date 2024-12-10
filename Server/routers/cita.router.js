const express = require('express');
const router = express.Router();
const CitaService = require('../services/cita.service');
const boom = require('@hapi/boom');
const PacienteService = require('../services/paciente.service');
const ResponseHandler = require('../middlewares/response.handler');
// Instanciar el servicio
const citaService = new CitaService();
const pacienteService = new PacienteService();

// Registrar una nueva cita
router.post('/registerCita/:id', async (req, res, next) => {
    try {
        const {id} = req.params;  // Obtienes el ID del usuario logueado
        const result = await pacienteService.findById(id);  // Obtienes el paciente
        if (!result) {
            return next(boom.notFound('Paciente no encontrado.'));
        }

        pacienteId = result.paciente.id;
        const data = req.body;
        const cita = await citaService.registerCita(data, pacienteId);

       // Respuesta de éxito
        ResponseHandler.success({
            res,
            message: 'Cita creada exitosamente.',
            data: cita,  // Asegúrate de devolver los datos actualizados
        });
    } catch (error) {
        next(error);
    }
});

router.get(
    '/tipoCita',
    async (req, res, next) => {
        try {
            const result = await citaService.getTipoCita();
            ResponseHandler.success({
                res,
                message: 'Tipos de citas obtenidas exitosamente.',
                data: result,
            });
        } catch (error) {
            next(error);
        }
    }
)

//obtener citas de paciente
router.get('/pacienteCita/:id',async ( req, res, next) => {
    try {
        const {id} = req.params;  // Obtienes el ID del usuario logueado
        const citas = await citaService.getCitasByPaciente( id);
        ResponseHandler.success({
            res,
            message: 'Citas obtenidas exitosamente.',
            data: citas,  // Asegúrate de devolver los datos actualizados
        });
    } catch (error) {
        next(error);
    }
});

//obtener citas de doctor
router.get('/doctorCita/:id',async ( req, res, next) => {
    try {
        const {id} = req.params;  // Obtienes el ID del usuario logueado
        const citas = await citaService.getCitasByDoctor( id);
        ResponseHandler.success({
            res,
            message: 'Citas obtenidas exitosamente.',
            data: citas,  // Asegúrate de devolver los datos actualizados
        });
    } catch (error) {
        next(error);
    }
});


// Obtener todas las citas
router.get('/', async (req, res, next) => {
    try {
        const result = await citaService.getAllCitas();
        res.status(200).json(result);
    } catch (error) {
        next(error);
    }
});

// Buscar una cita por ID
router.get('/:id', async (req, res, next) => {
    try {
        const result = await citaService.getCitaById(req.params.id);
        res.status(200).json(result);
    } catch (error) {
        next(error);
    }
});

// Actualizar una cita
router.patch('/:id', async (req, res, next) => {
    try {
        const updates = req.body;
        const result = await citaService.updateCita(req.params.id, updates);
        res.status(200).json(result);
    } catch (error) {
        next(error);
    }
});

// Eliminar una cita
router.delete('/:id', async (req, res, next) => {
    try {
        const result = await citaService.deleteCita(req.params.id);
        res.status(200).json(result);
    } catch (error) {
        next(error);
    }
});

module.exports = router;
