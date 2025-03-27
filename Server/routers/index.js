const express = require('express');

const userRouter = require('../routers/user.router');

function routerApi(app) {
    const router = express.Router();

    app.use('/health_connection/v2', router);
    router.use('/user', userRouter);
}  

module.exports = routerApi;