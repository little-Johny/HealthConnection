const express = require('express');

const userRouter = require('./user.router');
const patientRouter = require('./patient.router');
const clinicalHistoryRouter = require('./clinicalHistory.router');

function routerApi(app) {
    const router = express.Router();

    app.use('/health_connection/v2', router);
    router.use('/user', userRouter);
    router.use('/patient', patientRouter);
    router.use('/clinical-history', clinicalHistoryRouter);
}  

module.exports = routerApi;