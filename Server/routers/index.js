const express = require('express');

const userRouter = require('./user.router');
const patientRouter = require('./patient.router');
const doctorRouter = require('./doctor.router');
const specialityRouter = require('./speciality.router');
const clinicalHistoryRouter = require('./clinicalHistory.router');
const scheduleRouter = require('./doctorSchedule.router');
const appointmentRouter = require('./appointment.router');
const observationRouter = require('./observation.router');
const postRouter = require('./post.router');
const authRouter = require('./auth.router');

function routerApi(app) {
    const router = express.Router();

    app.use('/health_connection/v2', router);
    router.get('/ping', (req, res) => {
        res.json({ message: 'Backend en línea ✅' });
        console.log('✔️ Ping recibido: Backend en línea');
    });
    router.use('/user', userRouter);
    router.use('/patient', patientRouter);
    router.use('/doctor', doctorRouter);
    router.use('/speciality', specialityRouter);
    router.use('/clinical-history', clinicalHistoryRouter);
    router.use('/doctor-schedule', scheduleRouter);
    router.use('/appointment', appointmentRouter);
    router.use('/observation', observationRouter);
    router.use('/post', postRouter);
    router.use('/auth', authRouter);
}

module.exports = routerApi;
