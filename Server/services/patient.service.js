const boom = require('@hapi/boom');
const UserService = require('./user.service');
const { models } = require('../libs/sequelize');
const sequelize = require('../libs/sequelize');

const userService = new UserService();

class PatientService {
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
                role: 'patient',
            };

            const patientData = {
                birthdate: data.birthdate,
                address: data.address,
                city: data.city,
            };

            const newUser = await userService.create(userData, { transaction });

            const newPatient = await models.Patient.create(
                { ...patientData, userId: newUser.id },
                { transaction },
            );

            await transaction.commit();

            return newPatient;
        } catch (error) {
            await transaction.rollback();
            console.error(error);
            throw boom.badImplementation('Error al crear el paciente');
        }
    }

    async findOne(id) {
        const patient = await models.Patient.findByPk(id, {
            include: [
                {
                    model: models.User,
                    as: 'user',
                    attributes: { exclude: 'password' },
                },
                {
                    model: models.ClinicalHistory,
                    as: 'clinical_history',
                },
            ],
        });

        if (!patient) {
            throw boom.notFound(`No se encontro ningun paciente con ID ${id}`);
        }

        return patient;
    }
}

module.exports = PatientService;
