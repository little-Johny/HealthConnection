const Joi = require('joi');

const id = Joi.number().integer().positive();
const patientId = Joi.number().integer().positive();
const doctorId = Joi.number().integer().positive();
const specialityId = Joi.number().integer().positive();
const date = Joi.date().iso().greater('now').messages({
    'date.greater': 'La fecha de la cita debe ser en el futuro.',
});
const startTime = Joi.string().pattern(/^([01]\d|2[0-3]):([0-5]\d):([0-5]\d)$/).messages({
    'string.pattern.base': 'El formato de la hora de inicio debe ser HH:mm:ss (24h).',
});

const endTime = Joi.string().pattern(/^([01]\d|2[0-3]):([0-5]\d):([0-5]\d)$/).messages({
    'string.pattern.base': 'El formato de la hora de finalización debe ser HH:mm:ss (24h).',
});

const price = Joi.number().precision(2).positive();
const status = Joi.string().valid('pending', 'confirmed', 'completed', 'canceled');
const startDate = Joi.date().iso();
const endDate = Joi.date().iso().greater(Joi.ref('startDate'));
const limit = Joi.number().integer().positive().default(10);
const offset = Joi.number().integer().min(0).default(0);

const createAppointmentSchema = Joi.object({
    patientId: patientId.required(),
    doctorId: doctorId.required(),
    specialityId: specialityId.required(),
    date: date.required(),
    startTime: startTime.required(),
    endTime: endTime.required(),
    price: price,
    status: status,
});

const updateAppointmentSchema = Joi.object({
    patientId: patientId.optional(),
    doctorId: doctorId.optional(),
    specialityId: specialityId.optional(),
    date: date.optional(),
    startTime: startTime.optional(),
    endTime: endTime.optional(),
    price: price.optional(),
    status: status.optional(),
});

const getAppointmentSchema = Joi.object({
    id: id.required(),
});

const getQueryAppointmentSchema = Joi.object({
    patient: Joi.string().optional(),
    doctor: Joi.string().optional(),
    speciality: Joi.string().optional(),
    numberDocument: Joi.string().pattern(/^\d{5,20}$/).optional(),
    date: date.optional(),
    startDate: startDate.optional(),
    endDate: endDate.optional(),
    status: status.optional(),
    limit: limit.optional(),
    offset: offset.optional(),
}).and('startDate', 'endDate');


const updateStatusAppointmentSchema = Joi.object({
    status: status.required()
});

module.exports = {
    createAppointmentSchema,
    updateAppointmentSchema,
    updateStatusAppointmentSchema,
    getAppointmentSchema,
    getQueryAppointmentSchema,
};
