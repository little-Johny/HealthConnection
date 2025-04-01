const express = require('express');

const userRouter = require('./user.router');
const patientRouter = require('./patient.router');
const doctorRouter = require('./doctor.router');
const specialityRouter = require('./speciality.router');
const clinicalHistoryRouter = require('./clinicalHistory.router');
const scheduleRouter = require('./doctorSchedule.router');

function routerApi(app) {
    const router = express.Router();

    app.use('/health_connection/v2', router);
    router.use('/user', userRouter);
    router.use('/patient', patientRouter);
    router.use('/doctor', doctorRouter);
    router.use('/speciality', specialityRouter);
    router.use('/clinical-history', clinicalHistoryRouter);
    router.use('/doctor-schedule', scheduleRouter);
}  

module.exports = routerApi;