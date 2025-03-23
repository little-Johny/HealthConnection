const Joi = require('joi');

const id = Joi.number().integer().positive();
const clinicalHistoryId = Joi.number().integer().positive().required();
const doctorId = Joi.number().integer().positive().required();
const diagnosis = Joi.string().min(5).max(1000).required();
const treatment = Joi.string().min(5).max(1000).optional().allow(null, '');
const notes = Joi.string().min(5).max(1000).optional().allow(null, '');
const startDate = Joi.date().iso();
const endDate = Joi.date().iso().greater(Joi.ref('startDate'));
const limit = Joi.number().integer().positive().default(10);
const offset = Joi.number().integer().min(0).default(0);

const createObservationSchema = Joi.object({
    clinicalHistoryId,
    doctorId,
    diagnosis,
    treatment,
    notes,
});

const updateObservationSchema = Joi.object({
    clinicalHistoryId: clinicalHistoryId.optional(),
    doctorId: doctorId.optional(),
    diagnosis: diagnosis.optional(),
    treatment: treatment.optional(),
    notes: notes.optional(),
});

const getObservationSchema = Joi.object({
    id: id.required(),
});

const getQueryObservationSchema = Joi.object({
    id: id.optional(),
    clinicalHistoryId: clinicalHistoryId.optional(),
    doctorId: doctorId.optional(),
    startDate: startDate.optional(),
    endDate: endDate.optional(),
    limit: limit.optional(),
    offset: offset.optional(),
}).and('startDate', 'endDate');

module.exports = {
    createObservationSchema,
    updateObservationSchema,
    getObservationSchema,
    getQueryObservationSchema,
};
