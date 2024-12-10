const express = require('express');

const pacienteRouter = require('../routers/paciente.router');
const doctorRouter = require('../routers/doctor.router');
const administrativosRouter = require('../routers/administrativos.router');
const userRouter = require('../routers/user.router');
const citaRouter = require('../routers/cita.router');

function routerApi(app) {
    const router = express.Router();

    app.use('/health_connection/v1', router);
    router.use('/paciente', pacienteRouter);
    router.use('/administrativos', administrativosRouter);
    router.use('/doctor', doctorRouter);
    router.use('/user', userRouter);
    router.use('/cita',citaRouter);
}  

module.exports = routerApi;