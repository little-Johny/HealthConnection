const Joi = require('joi');

const id = Joi.number().integer().positive();
const userId = Joi.number().integer().positive();
const specialityId = Joi.number().integer().positive();
const licenseNumber = Joi.string().alphanum().min(5).max(20);
const consultationFee = Joi.number().precision(2).positive();
const startDate = Joi.date().iso();
const endDate = Joi.date().iso().greater(Joi.ref('startDate'));
const limit = Joi.number().integer().positive().default(10);
const offset = Joi.number().integer().min(0).default(0);

const createDoctorSchema = Joi.object({
    userId: userId.required(),
    specialityId: specialityId.required(),
    licenseNumber: licenseNumber.required(),
    consultationFee: consultationFee.required(),
});

const updateDoctorSchema = Joi.object({
    userId: userId.optional(),
    specialityId: specialityId.optional(),
    licenseNumber: licenseNumber.optional(),
    consultationFee: consultationFee.optional(),
});

const getDoctorSchema = Joi.object({
    id: id.required(),
});

const getQueryDoctorSchema = Joi.object({
    id: id.optional(),
    userId: userId.optional(),
    specialityId: specialityId.optional(),
    licenseNumber: licenseNumber.optional(),
    startDate: startDate.optional(),
    endDate: endDate.optional(),
    limit: limit.optional(),
    offset: offset.optional(),
}).and('startDate', 'endDate');

module.exports = {
    createDoctorSchema,
    updateDoctorSchema,
    getDoctorSchema,
    getQueryDoctorSchema,
};
