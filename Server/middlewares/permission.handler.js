const boom = require('@hapi/boom');

function checkPermission(allowedRoles) {
    return (req, res, next) => {
        // Extraer el rol del usuario desde la solicitud (debe haberse agregado previamente, por ejemplo, con un middleware de autenticación)
        const userRol = req.user?.rol; 

        // Validar si el rol del usuario está en la lista de roles permitidos
        if (!allowedRoles.includes(userRol)) {
            // Generar un error HTTP 403 (Forbidden) si el rol no tiene permiso
            return next(boom.forbidden('You do not have permission to perform this action'));
        }

        // Si el rol es válido, continuar con el siguiente middleware o controlador
        next();
    };
}

module.exports = checkPermission;