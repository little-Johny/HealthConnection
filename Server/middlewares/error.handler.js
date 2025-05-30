const ResponseHandler = require('./response.handler');

// Capturador de errores
function logError(error, req, res, next) {
    console.error(error);
    next(error);
}

// Manejo de errores generales
function errorHandler(error, req, res, next) {
    ResponseHandler.error({
        res,
        req,
        message: 'Error interno del servidor',
        error: process.env.NODE_ENV === 'development' ? error : null,
        statusCode: 500,
    });
}

// Manejo de errores tipo Boom
function boomErrorHandler(error, req, res, next) {
    if (error.isBoom) {
        const { output } = error;

        ResponseHandler.error({
            res,
            req,
            message: output.payload.message,
            error, // Opcional: puedes incluir el error completo si estás en desarrollo
            statusCode: output.statusCode,
        });

        return; // ⛔ Detenemos la ejecución para que no llame a next(error)
    }

    next(error);
}

module.exports = {
    logError,
    errorHandler,
    boomErrorHandler,
};
