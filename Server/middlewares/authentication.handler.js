const jwt = require('jsonwebtoken');
const boom = require('@hapi/boom');

function authentication(req, res, next) {
    const authHeader = req.headers.authorization;

    // Verificar si el encabezado de autorización existe
    if (!authHeader) {
        return next(boom.unauthorized('El header de autorización no se encuentra.'));
    }

    // Verificar que el formato sea correcto (Bearer <token>)
    if (!authHeader.startsWith('Bearer ')) {
        return next(boom.unauthorized('Formato de autorización inválido. Se espera: "Bearer <token>".'));
    }

    // Extraer el token luego del prefijo "Bearer "
    const token = authHeader.split(' ')[1];
    if (!token) {
        return next(boom.unauthorized('Token no encontrado en el encabezado de autorización.'));
    }

    try {
        // Verificar y decodificar el token
        const decoded = jwt.verify(token, process.env.JWT_SECRET);

        // Agregar datos del usuario decodificado al objeto `req`
        req.user = decoded;

        // Continuar con el siguiente middleware
        next();
    } catch (error) {
        // Manejo de errores específicos de JWT
        if (error.name === 'TokenExpiredError') {
            return next(boom.unauthorized('El token ha expirado.'));
        } else if (error.name === 'JsonWebTokenError') {
            return next(boom.unauthorized('Token inválido.'));
        } else {
            // Cualquier otro error inesperado
            return next(boom.unauthorized('Error de autenticación.'));
        }
    }
}

module.exports = authentication;
