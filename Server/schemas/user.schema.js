const Joi = require('joi');
const ROLES = ['admin', 'staff', 'doctor', 'patient'];
const DocTypes = ['C.C.', 'T.I', 'Passport'];

const id = Joi.number().integer().positive();
const username = Joi.string().alphanum().min(5).max(50);
const password = Joi.string()
    .alphanum()
    .pattern(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)[A-Za-z\d]{8,12}$/)
    .messages({
        'string.pattern.base': 'La contraseña debe contener al menos una letra minúscula, una mayúscula, un dígito y tener una longitud mínima de 8 caracteres y máxima de 12 caracteres.',
    });
const name = Joi.string();
const lastName = Joi.string();
const photo = Joi.string();
const typeDocument = Joi.string().valid(...DocTypes);
const numberDocument = Joi.string().pattern(/^\d{5,20}$/).optional();
const gender = Joi.string().valid('Male', 'Female');
const email = Joi.string().email();
const phone = Joi.string()
    .pattern(/^\d{10}$/)
    .messages({
        'string.pattern.base': ' El numero debe contener 10 digitos numericos',
    });
const role = Joi.string().valid(...ROLES);
const limit = Joi.number().integer().positive().default(10);
const offset = Joi.number().integer().min(0).default(0);

const createUserSchema = Joi.object({
    username: username.required(),
    password: password.required(),
    name: name.required(),
    lastName: lastName.required(),
    photo: photo.optional(),
    typeDocument: typeDocument.required(),
    numberDocument: numberDocument.required(),
    gender: gender.required(),
    email: email.optional(),
    phone: phone.optional(),
    role: role.required(),
});

const updateUserSchema = Joi.object({
    username: username.optional(),
    password: password.optional(),
    name: name.optional(),
    lastName: lastName.optional(),
    photo: photo.optional(),
    typeDocument: typeDocument.optional(),
    numberDocument: numberDocument.optional(),
    gender: gender.optional(),
    email: email.optional(),
    phone: phone.optional(),
    role: role.optional(),
    birthdate: Joi.date().iso().max('now').messages({
        'date.max': 'La fecha de nacimiento debe ser en el pasado.',
    }),
    address: Joi.string().max(100),
    city: Joi.string().max(50),
    licenseNumber: Joi.string().alphanum().min(5).max(20),
    consultationFee: Joi.number().precision(2).positive(),
    specialityId: Joi.number().integer().positive(),
});

const getUserSchema = Joi.object({
    id: id.required(),
});

const getQueryUserSchema = Joi.object({ 
    username: username.optional(),
    name: name.optional(),
    lastName: lastName.optional(),
    email: email.optional(),
    phone: phone.optional(),
    role: role.optional(),
    typeDocument: typeDocument.optional(),
    numberDocument: numberDocument.optional(),
    gender: gender.optional(),
    startDate: Joi.date().iso().optional(),
    endDate: Joi.date().iso().greater(Joi.ref('startDate')).optional(),
    birthdate: Joi.date().iso().max('now').messages({
        'date.max': 'La fecha de nacimiento debe ser en el pasado.',
    }),
    address: Joi.string().max(100),
    city: Joi.string().max(50),
    licenseNumber: Joi.string().alphanum().max(20),
    consultationFee: Joi.number().precision(2).positive(),
    specialityId: Joi.number().integer().positive(),
    search: Joi.string(),
    limit: limit.optional(),
    offset: offset.optional(),
}).and('startDate', 'endDate');

module.exports = {
    createUserSchema,
    updateUserSchema,
    getUserSchema,
    getQueryUserSchema,
};
