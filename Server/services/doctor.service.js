const boom = require('@hapi/boom');
const UserService = require('./user.service');
const { models, sequelize } = require('../libs/sequelize');

const userService = new UserService();

class DoctorService {
    async create(data) {
        const transaction = await sequelize.transaction();
        try {
            const userData = {
                username: data.username,
                password: data.password,
                name: data.name,
                lastName: data.lastName,
                photo: data.photo,
                typeDocument: data.typeDocument,
                numberDocument: data.numberDocument,
                gender: data.gender,
                email: data.email,
                phone: data.phone,
                role: 'doctor',
            };

            const doctorData = {
                specialityId: data.specialityId,
                licenseNumber: data.licenseNumber,
                consultationFee: data.consultationFee,
            };

            const newUser = await userService.create(userData, { transaction });

            const newDoctor = await models.Doctor.create(
                { ...doctorData, userId: newUser.id },
                { transaction },
            );

            await transaction.commit();

            return newDoctor;
        } catch (error) {
            await transaction.rollback();
            throw boom.badImplementation('Error al crear el paciente', error);
        }
    }

    async findOne(id) {
        const doctor = await models.Doctor.findByPk(id, {
            include: [
                {
                    model: models.User,
                    as: 'user',
                    attributes: { exclude: 'password' },
                },
                {
                    model: models.DoctorSchedule,
                    as: 'schedule',
                },
            ],
        });

        if (!doctor) {
            throw boom.notFound(`No se encontro ningun doctor con ID ${id}`);
        }

        return doctor;
    }
}

module.exports = DoctorService;
