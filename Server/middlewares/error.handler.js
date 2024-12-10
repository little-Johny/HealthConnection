//Capturador de errores 
function logError(error, req, res, next) {
    console.log(`LogErrors`);
    console.error(error);
    next(error);
};

//Mostrar el error en un formato legible
function errorHandler(error, req, res, next) {
    console.log(`ErrorHandler`);
    res.status(500).json({
        message: error.message,
        stack: error.stack
    });
    next();
};

//Errores tipo boom
function boomErrorHandler(error, req, res, next) {
    //validar si el error es creado por la libreria boom
    if (error.isBoom) {
        const { output } = error;
    //estatus code dinamico y json leidos desde el output de boom
        res.status(output.statusCode).json(output.payload);
    } else {
    //si no es un errore de tipo boom ira a ejecutar un middleware de errores normales
        next(error);
    }
};

module.exports = {
    logError,
    errorHandler,
    boomErrorHandler
};
