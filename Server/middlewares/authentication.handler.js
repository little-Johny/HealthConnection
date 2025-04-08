const boom = require('@hapi/boom');

const checkRole = (roles) => {
    return (req, res, next) => {
        const user = req.user;

        if (!user || !user.role) {
            return next(boom.unauthorized('No se encuentra el rol del usuario'));
        };

        if (!roles.includes(user.role)) {
            return next(boom.unauthorized(`Acceso denegado para ${user.role}`));
        };

        next();
    };
};


module.exports = { checkRole };
