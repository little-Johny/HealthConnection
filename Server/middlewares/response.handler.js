class ResponseHandler {
    success({ res, req, message = 'Operación exitosa', data = null, statusCode = 200}) {
        const method = req?.method || 'Solicitud';
        res.status(statusCode).json({
            success: true,
            message: `${method} ${message}`,
            data,
        });
    }

    error({ res, req, message = 'Error en la operación', error = null, statusCode = 500}) {
        const method = req?.method || 'Solicitud';
        res.status(statusCode).json({
            success: false,
            message: `${method} ${message}`,
            error: error?.message || null,
        });
    }
}

module.exports = new ResponseHandler();
