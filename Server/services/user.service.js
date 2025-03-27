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
            const newUser = await models.User.create(data);
            await transaction.commit();
            return newUser;
        } catch (error) {
            await transaction.rollback();
            if (error.name === 'SequelizeUniqueConstraintError') {
                throw boom.conflict(`El username ${data.username} ya existe, intenta con otro`);
            }
            throw error;
        }
    }
    

    async find(query) {
        const options = {
            where: {},
            attributes: { exclude: ['password']}
        };

        const { limit, offset, endDate, startDate, ...filters } = query;

        const filterableFields = ['email', 'phone', 'username', 'role', 'typeDocument', 'numberDocument', 'gender'];

        let filterMessages = [];

        if (limit) {
            options.limit = parseInt(limit) || 10;
        }

        if (offset) {
            options.offset = parseInt(offset) || 0;
        }

        for (const field of filterableFields) {
            if (filters[field]) {
                options.where[field] = filters[field];
                filterMessages.push(`con ${field}:  ${filters[field]}`);
            }
        }

        if (startDate && endDate) {
            options.where.createdAt = {
                [Op.between]: [new Date(startDate),new Date(endDate)],
            };
            filterMessages.push(`creado entre ${startDate} y ${endDate}`);
        }

        const users = await models.User.findAll(options);
        const message = filterMessages.length ? `${filterMessages.join(', ')}` : '';
        if (users.length === 0) {
            throw boom.notFound(`no se encuentra ningun usuario ${message}`)
        };

        return users;
    };

    async findOne(id) {
        const user = await models.User.findByPk(id, { attributes: { exclude: ['password'] } });

        if (!user) {
            throw boom.notFound(`No se encuentra usuario con ID ${id}`);
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
    }

    async update(id, changes) {
        const transaction = await sequelize.transaction();

        try {
            const user = await this.findOne(id);
    
            if (changes.username) {
                const existingUser = await models.User.findOne({ where: { username: changes.username } });
                if (existingUser && existingUser.id !== id) {
                    throw boom.conflict(`El username ${changes.username} ya está en uso.`);
                }
            }

            if (changes.photo) {
                await this.unlinkUserPhoto(user.photo);
            }
        
            const userUpdated = await user.update(changes, {
                fields: Object.keys(changes).filter(field => field !== 'id' && field !== 'password')
            });
            
            await transaction.commit();
            return userUpdated;
        } catch (error) {
            await transaction.rollback();
            throw error;
        }
    }

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
    }
    
    async unlinkUserPhoto(photo) {
        const filePath = path.join(__dirname, '../../Uploads/users', path.basename(photo));

        if (fs.existsSync(filePath)) {
            fs.unlinkSync(filePath);
        }

        return;
    }
};

module.exports = UserService;
