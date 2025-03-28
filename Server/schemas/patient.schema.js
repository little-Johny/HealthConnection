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
    userId: userId,
    birthdate: birthdate.required(),
    address: address.required(),
    city: city.required(),
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

const updatePatientSchema = Joi.object({
    birthdate: birthdate.optional(),
    address: address.optional(),
    city: city.optional(),
});

const getPatientSchema = Joi.object({
    id: id.required(),
});

const getQueryPatientSchema = Joi.object({
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
