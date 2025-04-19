const boom = require('@hapi/boom');
const { Op, Sequelize } = require('sequelize');
const path = require('path');
const fs = require('fs');
const { models } = require('./../libs/sequelize');
const sequelize = require('./../libs/sequelize');

class UserService {
    async create(data) {
        const transaction = await sequelize.transaction();

        try {
            const existingUser = await models.User.findOne({
                where: {
                    numberDocument: data.numberDocument,
                    role: data.role,
                },
            });

            if (existingUser) {
                throw boom.conflict(`Ya existe un usuario con el documento ${data.numberDocument} y el rol ${data.role}.`);
            }

            const newUser = await models.User.create(data);
            await transaction.commit();
            delete newUser.dataValues.password;
            return newUser;
        } catch (error) {
            await transaction.rollback();
            if (error.name === 'SequelizeUniqueConstraintError') {
                throw boom.conflict(`El username ${data.username} ya existe, intenta con otro`);
            }
            throw error;
        }
    };
    
    async find(query) {
        const options = {
            where: {},
            include: [],
            attributes: { exclude: ['password'] },
        };
    
        const {
            limit, offset, startDate, endDate, search, city, address, birthdate,
            speciality, licenseNumber, consultationFee, ...filters
        } = query;
    
        const filterableFields = ['email', 'phone', 'username', 'role', 'typeDocument', 'numberDocument', 'gender'];
        let filterMessages = [];
    
        if (limit) {
            options.limit = parseInt(limit) || 10;
        }
    
        if (offset) {
            options.offset = parseInt(offset) || 0;
        }
    
        // Filtros específicos de Patient
        if (address || city || birthdate) {
            const patientFilter = {};
            if (address) patientFilter.address = { [Op.iLike]: `%${address}%` };
            if (city) patientFilter.city = { [Op.iLike]: `%${city}%` };
            if (birthdate) patientFilter.birthdate = birthdate;
    
            options.include.push({
                model: models.Patient,
                as: 'patient',
                where: patientFilter,
                required: true,
                attributes: [],
            });
        }
    
        // Filtros específicos de Doctor
        if (speciality || licenseNumber || consultationFee) {
            const doctorFilter = {};
            if (licenseNumber) doctorFilter.licenseNumber = licenseNumber;
            if (consultationFee) doctorFilter.consultationFee = consultationFee;
    
            if (speciality) {
                const spec = await models.Speciality.findOne({ where: { name: speciality } });
                if (spec) {
                    doctorFilter.specialityId = spec.id;
                } else {
                    throw boom.notFound(`No se encontró la especialidad: ${speciality}`);
                }
            }
    
            options.include.push({
                model: models.Doctor,
                as: 'doctor',
                where: doctorFilter,
                required: true,
                attributes: [],
            });
        }
    
        // Búsqueda flexible en múltiples campos
        if (search) {
            options.where[Op.or] = [
                { name: { [Op.iLike]: `%${search}%` } },
                { lastName: { [Op.iLike]: `%${search}%` } },
                { email: { [Op.iLike]: `%${search}%` } },
                { username: { [Op.iLike]: `%${search}%` } }
            ];
            filterMessages.push(`que coincidan con: ${search}`);
        }
    
        // Aplicar otros filtros específicos
        for (const field of filterableFields) {
            if (filters[field]) {
                options.where[field] = filters[field];
                filterMessages.push(`con ${field}: ${filters[field]}`);
            }
        }
    
        // Filtrado por rango de fechas
        if (startDate && endDate) {
            options.where.createdAt = {
                [Op.between]: [new Date(startDate), new Date(endDate)],
            };
            filterMessages.push(`creado entre ${startDate} y ${endDate}`);
        }
    
        // Obtener los usuarios con los filtros aplicados
        const { rows, count } = await models.User.findAndCountAll(options);
    
        // Si no se encuentran usuarios
        if (count === 0) {
            throw boom.notFound(`No se encuentra ningún usuario ${filterMessages.join(', ')}`);
        }
    
        return {
            data: rows,         // Usuarios encontrados
            meta: {
                totalCount: count,  // Total de usuarios que cumplen con los filtros
                totalPages: Math.ceil(count / (limit || 10)), // Páginas totales
                currentPage: Math.ceil((offset || 0) / (limit || 10)) + 1, // Página actual
                perPage: limit || 10  // Elementos por página
            }
        };
    }
    
    
    async findOne(id) {
        const user = await models.User.findByPk(id, {
            attributes: { exclude: ['password'] },
            include: [
                {
                    model: models.Doctor,
                    as: 'doctor',
                    required: false,
                },
                {
                    model: models.Patient,
                    as: 'patient',
                    required: false,
                }
            ]
        });
    
        if (!user) {
            throw boom.notFound(`No se encuentra usuario con ID ${id}`);
        }
        /* console.log(`User:`);
        console.log(user); */
        
    
        return user;
    };

    async findByUsername(username) {
        const user = await models.User.findOne({
            where: { username },
            include: [
                { model: models.Patient, as: 'patient', required: false },
                { model: models.Doctor, as: 'doctor', required: false }
            ]
        });
    
        if (!user) {
            throw boom.notFound('Usuario no encontrado');
        }
    
        return user;
    };

    
    async findAll() {
        return await models.User.findAll({
            attributes: [...Object.keys(models.User.getAttributes()),
                [Sequelize.literal(`deleted_at IS NOT NULL`), 'isDeleted']
            ],
            paranoid: false,
        });
    };

    async update(id, changes) {
        const transaction = await sequelize.transaction();
    
        try {
            const user = await this.findOne(id);
    
            // Validar si el username ya existe en otro usuario
            if (changes.username) {
                const existingUser = await models.User.findOne({ where: { username: changes.username } });
                if (existingUser && existingUser.id !== id) {
                    throw boom.conflict(`El username ${changes.username} ya está en uso.`);
                }
            }
    
            // Manejo de actualización de pacientes y doctores
            if (user.role === 'patient' && user.patient) {
                await user.patient.update(changes, { transaction });
            }
            
            if (user.role === 'doctor' && user.doctor) {
                await user.doctor.update(changes, { transaction });
            }
    
            // Si el usuario tiene una foto y se actualiza, eliminar la anterior
            if (changes.photo) {
                await this.unlinkUserPhoto(user.photo);
            }
    
            // Actualizar usuario, excluyendo campos no permitidos
            const userUpdated = await user.update(changes, {
                fields: Object.keys(changes).filter(field => field !== 'id' && field !== 'password' && field !== 'patientId' && field !== 'doctorId' ),
                transaction
            });
    
            await transaction.commit();
            return userUpdated;
        } catch (error) {
            await transaction.rollback();
            throw error;
        }
    };    

    async delete(id) {
        const user = await this.findOne(id);
        const userDeleted = await user.destroy();
        return userDeleted;
    };

    async restore(id) {
        const user = await models.User.findOne({
            where: { id },
            paranoid: false // Buscamos incluso si fue eliminado
        });
    
        if (!user) {
            throw boom.notFound(`Usuario con ID ${id} no encontrado`);
        }
    
        await user.restore(); // Restauramos el usuario
    
        return user;
    };

    async forceDelete(id) {
        const user = await models.User.findOne({
            where: { id },
            paranoid: false // Incluir usuarios eliminados
        });
    
        if (!user) {
            throw boom.notFound(`No se encuentra usuario con ID ${id}`);
        }
    
        // Eliminar foto si existe
        if (user.photo) {
            await this.unlinkUserPhoto(user.photo);
        }
    
        // Borrar usuario completamente
        await user.destroy({ force: true });
    
        return { message: `Usuario con ID ${id} eliminado permanentemente` };
    };
    
    async unlinkUserPhoto(photo) {
        const filePath = path.join(__dirname, '../../Uploads/users', path.basename(photo));

        if (fs.existsSync(filePath)) {
            fs.unlinkSync(filePath);
        }

        return;
    };
};

module.exports = UserService;
