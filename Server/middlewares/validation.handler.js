const boom = require('@hapi/boom');

// Middleware para validar los datos de la solicitud contra un esquema definido
function validatorHandler(schema, property) {
    return (req, res, next) => {
        const data = req[property]; // Extrae los datos de la solicitud según la propiedad especificada (body, params, query, etc.)
        const { error } = schema.validate(data, { abortEarly: false }); // Valida los datos con el esquema proporcionado

        if (error) {
            // Si hay errores, crea un error tipo Boom con detalles claros (HTTP 400 - Bad Request)
            next(boom.badRequest(error.details.map(err => err.message).join(', ')));
        } else {
            // Si no hay errores, continúa con el siguiente middleware o controlador
            next();
        }
    };
}

module.exports = validatorHandler;
