const boom = require('@hapi/boom');
const { models } = require('./../libs/sequelize');
const { Op } = require('sequelize');

class UserService {
    async create(data) {
        try {
            const newUser = await models.User.create(data);
            return newUser;
        } catch (error) {
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
        const message = filterMessages.length ? `con ${filterMessages.join(', ')}` : '';
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

    async update(id, changes) {
        const user = await this.findOne(id);
    
        if (changes.username) {
            const existingUser = await models.User.findOne({ where: { username: changes.username } });
            if (existingUser && existingUser.id !== id) {
                throw boom.conflict(`El username ${changes.username} ya está en uso.`);
            }
        }
    
        const userUpdated = await user.update(changes, {
            fields: Object.keys(changes).filter(field => field !== 'id' && field !== 'password')
        });
    
        return userUpdated;
    }
    

    async delete(id) {
        const user = await this.findOne(id);
        const userDeleted = await user.destroy();

        return userDeleted;
    };
};

module.exports = UserService;
