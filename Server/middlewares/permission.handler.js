const boom = require('@hapi/boom');

function checkPermission(allowedRoles) {
    return (req, res, next) => {
        const userRol = req.user.rol;
        console.log('User role:', userRol);  // Verifica el rol del usuario

        if (!allowedRoles.includes(userRol)) {
            return next(boom.forbidden('No tienes permiso para realizar esta acción.'));
        }

        next();
    };
}

module.exports = checkPermission;
