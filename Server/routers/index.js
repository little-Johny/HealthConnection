const express = require('express');

const pacienteRouter = require('../routers/paciente.router');

function routerApi(app) {
    const router = express.Router();

    app.use('/health_connection/v1', router);
    router.use('/paciente', pacienteRouter);
    
}  

module.exports = routerApi;