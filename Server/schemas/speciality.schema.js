const Joi = require('joi');

const id = Joi.number().integer().positive();
const name = Joi.string().min(3).max(100).required();
const startDate = Joi.date().iso();
const endDate = Joi.date().iso().greater(Joi.ref('startDate'));
const limit = Joi.number().integer().positive().default(10);
const offset = Joi.number().integer().min(0).default(0);

const createSpecialitySchema = Joi.object({
    name,
});

const updateSpecialitySchema = Joi.object({
    name: name.optional(),
});

const getSpecialitySchema = Joi.object({
    id: id.required(),
});

const getQuerySpecialitySchema = Joi.object({
    id: id.optional(),
    name: name.optional(),
    startDate: startDate.optional(),
    endDate: endDate.optional(),
    limit: limit.optional(),
    offset: offset.optional(),
}).and('startDate', 'endDate');

module.exports = {
    createSpecialitySchema,
    updateSpecialitySchema,
    getSpecialitySchema,
    getQuerySpecialitySchema,
};
