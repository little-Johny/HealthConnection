const boom = require('@hapi/boom');
const { models } = require('../libs/sequelize');

const checkRole = (roles) => (req, res, next) => {
    const { user } = req;

    if (!user || !user.role) {
        return next(boom.unauthorized('No se encuentra el rol del usuario'));
    }

    if (!roles.includes(user.role)) {
        return next(boom.unauthorized(`Acceso denegado para ${user.role}`));
    }

    next();
};

const resolveUserRole = async (req, res, next) => {
    try {
        const { sub: userId, role } = req.user;

        if (role === 'patient') {
            const patient = await models.Patient.findOne({ where: { userId } });
            if (!patient) throw boom.notFound('Paciente no encontrado');
            req.user.patientId = patient.id;
        } else if (role === 'doctor') {
            const doctor = await models.Doctor.findOne({ where: { userId } });
            if (!doctor) throw boom.notFound('Doctor no encontrado');
            req.user.doctorId = doctor.id;
        }

        next();
    } catch (error) {
        next(error);
    }
};

module.exports = { checkRole, resolveUserRole };
