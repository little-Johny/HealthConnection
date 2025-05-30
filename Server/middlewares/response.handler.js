class ResponseHandler {
    success({
        res,
        req,
        message = 'Operación exitosa',
        data = null,
        statusCode = 200,
        meta = null,
    }) {
        const response = {
            success: true,
            message: `${message}`,
            data,
        };

        // Solo agrega `meta` si tiene un valor distinto a `null`
        if (meta !== null) {
            response.meta = meta;
        }

        res.status(statusCode).json(response);
    }

    error({
        res,
        req,
        message = 'Error en la operación',
        error = null,
        statusCode = 500,
    }) {
        res.status(statusCode).json({
            success: false,
            message: `${message}`,
            error: error?.message || null,
        });
    }
}

module.exports = new ResponseHandler();
