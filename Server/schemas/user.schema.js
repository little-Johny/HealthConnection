const Joi = require('joi');
const ROLES = ['administrador', 'doctor', 'paciente', 'secretaria'];

const id = Joi.number().integer().positive();
const username = Joi.string().alphanum().min(5).max(50);
const password = Joi.string().alphanum().pattern(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)[A-Za-z\d]{8,12}$/).messages({'string.pattern.base':'a contraseña debe contener al menos una letra minúscula, una mayúscula, un dígito y tener una longitud mínima de 8 caracteres.'});
const email = Joi.string().email();
const rol = Joi.string().valid(...ROLES);

const createUserSchema = Joi.object({
    username: username.required(),
    password: password.required(),
    email: email.optional(),
    rol: rol.required(),
});

const updateUserSchema = Joi.object({
    username: username.optional(),
    password: password.optional(),
    email: email.optional(),
    rol: rol.optional(),
});

const getUserSchema = Joi.object({
    id: id.required(),
});

module.exports = {
    createUserSchema,
    updateUserSchema,
    getUserSchema
};