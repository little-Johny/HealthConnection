const boom = require('@hapi/boom');
const { models } = require('./../libs/sequelize');
const ClinicalHistoryService = require('./clinicalHistory.service');
const DoctorService = require('./doctor.service');
const clinicalHistoryService = new ClinicalHistoryService();
const doctorService = new DoctorService();

class Observation {
    async create(data) {
        await doctorService.findOne(data.doctorId);
        await clinicalHistoryService.findOne(data.clinicalHistoryId);

        const newObservation = await models.Observation.create(data);
        return newObservation;
    };

    async find(query) {
        const { doctorId, clinicalHistoryId } = query;
        const options = {
            where: {},
            include: ['clinical_history', 'doctor'],
        };
    
        if (doctorId) {
            options.where.doctorId = doctorId;
        }
    
        if (clinicalHistoryId) {
            options.where.clinicalHistoryId = clinicalHistoryId;
        }
    
        const observations = await models.Observation.findAll(options);
    
        if (observations.length === 0) {
            throw boom.notFound('No se encontraron observaciones con los filtros proporcionados');
        }
    
        return observations;
    }
    

    async findOne(id) {
        const observation = await models.Observation.findByPk(id);

        if (!observation) {
            throw boom.notFound(`No se encuentra observacion con ID ${id}`);
        };

        return observation;
    };

    async update(id, changes) {
        const observation = await this.findOne(id);
    
        const allowedFields = ['diagnosis', 'treatment', 'notes'];
        const updates = {};
    
        for (const field of allowedFields) {
            if (changes[field] !== undefined) {
                updates[field] = changes[field];
            }
        }
    
        if (Object.keys(updates).length === 0) {
            throw boom.badRequest('No hay campos válidos para actualizar');
        }
    
        const updatedObservation = await observation.update(updates);
        return updatedObservation;
    }
    

    async delete(id) {
        const observation = await this.findOne(id);
        const deletedObservation = await observation.destroy();
        return deletedObservation;
    };
};

module.exports = Observation;