const boom = require('@hapi/boom');
const { models } = require('./../libs/sequelize');
const { Op } = require('sequelize');

class SpecialityService {
    async create(data) {
        const newSpeciality = await models.Speciality.create(data);
        return newSpeciality;
    };

    async find(query) {
        const options = {
            where: {}
        };

        const { limit, offset, name, startDate, endDate } = query;

        const message = [];

        if (limit) {
            options.limit = parseInt(limit) || 10;
        };

        if (offset) {
            options.offset = parseInt(offset) || 0;
        };

        if (name) {
            options.where.name = { [Op.iLike]: `%${name}%` };
            message.push(`con el nombre: ${name}`);
        };

        if (startDate && endDate) {
            options.where.createdAt = {
                [Op.between]: [new Date(startDate), new Date(endDate)],
            }
            message.push(`creada entre ${startDate} y ${endDate}`);
        };

        const specialities = await models.Speciality.findAll(options);

        if (specialities.length  === 0) {
            throw boom.notFound(`No se encontro ninguna especialidad ${message.length ? message.join(', ') : '' }`);
        };

        return specialities;
    };

    async findOne(id) {
        const speciality = await models.Speciality.findByPk(id);
        if (!speciality) {
            throw boom.notFound(`No se encuentra ninguna especialidad con ID ${id}`);
        }
        return speciality;
    };

    async update(id, changes) {
        const speciality = await this.findOne(id);
        const updatedSpeciality = await speciality.update(changes);
        return updatedSpeciality;
    };

    async delete(id) {
        const speciality = await this.findOne(id);
        const deletedSpeciality = await speciality.destroy();
        return deletedSpeciality;
    };
};

module.exports = SpecialityService;