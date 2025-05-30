const Joi = require('joi');

const id = Joi.number().integer().positive();
const patientId = Joi.number().integer().positive();
const bloodType = Joi.string().valid(
    'A+',
    'A-',
    'B+',
    'B-',
    'O+',
    'O-',
    'AB+',
    'AB-',
);
const weight = Joi.number().positive().max(500).optional();
const height = Joi.number().positive().max(3).optional(); // Máx: 3 metros
const chronicDiseases = Joi.alternatives()
    .try(
        Joi.string().allow(null, ''), // Acepta string vacío o nulo
        Joi.array().items(Joi.string().min(2).max(100)), // También puede ser un array
    )
    .optional();
const allergies = Joi.alternatives()
    .try(
        Joi.string().allow(null, ''),
        Joi.array().items(Joi.string().min(2).max(100)),
    )
    .optional();
const startDate = Joi.date().iso();
const endDate = Joi.date().iso().greater(Joi.ref('startDate'));
const limit = Joi.number().integer().positive().default(10);
const offset = Joi.number().integer().min(0).default(0);

const createClinicalHistorySchema = Joi.object({
    patientId: patientId.required(),
    bloodType: bloodType.required(),
    weight: weight.required(),
    height: height.required(),
    chronicDiseases: chronicDiseases.required(),
    allergies: allergies.required(),
});

const updateClinicalHistorySchema = Joi.object({
    bloodType: bloodType.optional(),
    weight: weight.optional(),
    height: height.optional(),
    chronicDiseases: chronicDiseases.optional(),
    allergies: allergies.optional(),
});

const getClinicalHistorySchema = Joi.object({
    id: id.required(),
});

const getQueryClinicalHistorySchema = Joi.object({
    id: id.optional(),
    patientId: patientId.optional(),
    bloodType: bloodType.optional(),
    startDate: startDate.optional(),
    endDate: endDate.optional(),
    limit: limit.optional(),
    offset: offset.optional(),
}).and('startDate', 'endDate');

module.exports = {
    createClinicalHistorySchema,
    updateClinicalHistorySchema,
    getClinicalHistorySchema,
    getQueryClinicalHistorySchema,
};
