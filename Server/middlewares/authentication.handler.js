const jwt = require('jsonwebtoken');
const boom = require('@hapi/boom');

function authentication(req, res, next) {
    const authHeader = req.headers.authorization;

    if (!authHeader) {
        return next(boom.unauthorized('El header de autorización no se encuentra.'));
    }

    if (!authHeader.startsWith('Bearer ')) {
        return next(boom.unauthorized('Formato de autorización inválido. Se espera: "Bearer <token>".'));
    }

    const token = authHeader.split(' ')[1];
    if (!token) {
        return next(boom.unauthorized('Token no encontrado en el encabezado de autorización.'));
    }

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        console.log('Decoded JWT:', decoded); // Depurar el contenido del token

        req.user = decoded;

        next();
    } catch (error) {
        if (error.name === 'TokenExpiredError') {
            return next(boom.unauthorized('El token ha expirado.'));
        } else if (error.name === 'JsonWebTokenError') {
            return next(boom.unauthorized('Token inválido.'));
        } else {
            return next(boom.unauthorized('Error de autenticación.'));
        }
    }
}


module.exports = authentication;
