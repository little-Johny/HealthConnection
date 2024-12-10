const Joi = require('joi');

const id = Joi.number().integer().positive();
const fecha = Joi.date().iso();
const hora = Joi.string().pattern(/^([01]\d|2[0-3]):([0-5]\d)$/).messages({'string.pattern.base': 'La hora debe estar en formato HH:mm.'});
const costo = Joi.number().positive().precision(2);
const requiere_autorizacion = Joi.boolean().default(false);

const createCitaSchema = Joi.object({
    paciente_id: Joi.number().integer().positive().required(),
    doctor_id: Joi.number().integer().positive().required(),
    tipo_cita_id: Joi.number().integer().positive().required().messages({'number.base': 'El tipo de cita debe ser un número válido.'}),
    fecha: fecha.required(),
    hora: hora.required(),
    costo: costo.required(),
    requiere_autorizacion,
});

const updateCitaSchema = Joi.object({
    paciente_id: Joi.number().integer().positive().optional(),
    doctor_id: Joi.number().integer().positive().optional(),
    tipo_cita_id: Joi.number().integer().positive().optional().messages({'number.base': 'El tipo de cita debe ser un número válido.'}),
    fecha: fecha.optional(),
    hora: hora.optional(),
    costo: costo.optional(),
    requiere_autorizacion: Joi.boolean().optional(),
});

const getCitaSchema = Joi.object({
    id: id.required(),
});

module.exports = {
    createCitaSchema,
    updateCitaSchema,
    getCitaSchema
};
