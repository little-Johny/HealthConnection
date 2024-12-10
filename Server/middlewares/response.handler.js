class ResponseHandler {
    success({ res, req, message = 'Operación exitosa', data = null }) {
        const method = req?.method || 'Solicitud';
        res.json({
            success: true,
            message: `${method} ${message}`,
            data,
        });
    }

    error({ res, req, message = 'Error en la operación', error = null }) {
        const method = req?.method || 'Solicitud';
        res.json({
            success: false,
            message: `${method} ${message}`,
            error: error?.message || null,
        });
    }
}

module.exports = new ResponseHandler();
