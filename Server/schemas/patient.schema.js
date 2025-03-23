const Joi = require('joi');

const id = Joi.number().integer().positive();
const userId = Joi.number().integer().positive();
const birthdate = Joi.date().iso().max('now').messages({
    'date.max': 'La fecha de nacimiento debe ser en el pasado.',
});
const address = Joi.string().min(5).max(100);
const city = Joi.string().min(2).max(50);
const startDate = Joi.date().iso();
const endDate = Joi.date().iso().greater(Joi.ref('startDate'));
const limit = Joi.number().integer().positive().default(10);
const offset = Joi.number().integer().min(0).default(0);

const createPatientSchema = Joi.object({
    userId: userId.required(),
    birthdate: birthdate.required(),
    address: address.required(),
    city: city.required(),
});

const updatePatientSchema = Joi.object({
    userId: userId.optional(),
    birthdate: birthdate.optional(),
    address: address.optional(),
    city: city.optional(),
});

const getPatientSchema = Joi.object({
    id: id.required(),
});

const getQueryPatientSchema = Joi.object({
    id: id.optional(),
    userId: userId.optional(),
    birthdate: birthdate.optional(),
    address: address.optional(),
    city: city.optional(),
    startDate: startDate.optional(),
    endDate: endDate.optional(),
    limit: limit.optional(),
    offset: offset.optional(),
}).and('startDate', 'endDate');

module.exports = {
    createPatientSchema,
    updatePatientSchema,
    getPatientSchema,
    getQueryPatientSchema,
};
