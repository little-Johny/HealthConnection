const express = require('express');
const router = express.Router();
const CitaService = require('../services/cita.service');
const boom = require('@hapi/boom');

// Instanciar el servicio
const citaService = new CitaService();

// Registrar una nueva cita
router.post('/registerCita', async (req, res, next) => {
    try {
        const body = req.body;
        const result = await citaService.registerCita(body);
        res.status(201).json(result);
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
