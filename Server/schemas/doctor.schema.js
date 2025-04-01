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
    userId,
    specialityId: specialityId.required(),
    licenseNumber: licenseNumber.required(),
    consultationFee: consultationFee.required(),
    username: Joi.string().min(3).max(30).required(),
    password: Joi.string()
        .alphanum()
        .pattern(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)[A-Za-z\d]{8,12}$/)
        .messages({
            'string.pattern.base': 'La contraseña debe contener al menos una letra minúscula, una mayúscula, un dígito y tener una longitud mínima de 8 caracteres y máxima de 12 caracteres.',
        }),
    name: Joi.string().required(),
    lastName: Joi.string().required(),
    photo: Joi.string().uri().optional(),
    typeDocument: Joi.string().valid('C.C.', 'T.I', 'Passport').required(),
    numberDocument:Joi.string().pattern(/^\d{5,20}$/).optional(),
    gender: Joi.string().valid('Male', 'Female'),
    email: Joi.string().email().required(),
    phone: Joi.string()
    .pattern(/^\d{10}$/)
    .messages({
        'string.pattern.base': ' El numero debe contener 10 digitos numericos',
    }),
    role: Joi.string(),
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
