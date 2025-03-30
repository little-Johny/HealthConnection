const boom = require('@hapi/boom');
const { models } = require('./../libs/sequelize');
const PatientService = require('./patient.service');
const patientService = new PatientService();

class ClinicalHistoryService {
    async create(data) {
        await patientService.findOne(data.patientId);
        const newClinicalHistory = await models.ClinicalHistory.create(data);
        return newClinicalHistory;
    };

    async findOne(id) {
        const clinicalHistory = await models.ClinicalHistory.findByPk(id, {
            include: [
                {
                    model: models.Patient,
                    as: 'patient',
                }
            ]
        });
        if (!clinicalHistory) {
            throw boom.notFound(`No se encuentra el historial clinico con ID ${id}`);
        }
        return clinicalHistory;
    }

    async update(id, changes) {
        const clinicalHistory = await this.findOne(id);
        const clinicalHistoryUpdated = await clinicalHistory.update(changes, {
            fields: Object.keys(changes).filter(field => field !== 'id' && field !== 'patientId'),
        });
        return clinicalHistoryUpdated;
    };
};

module.exports = ClinicalHistoryService; 