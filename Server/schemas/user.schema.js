const Joi = require('joi');
const ROLES = ['administrador', 'doctor', 'paciente', 'secretaria'];

const id = Joi.number().integer().positive();
const username = Joi.string().alphanum().min(5).max(50);
const password = Joi.string().alphanum().pattern(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)[A-Za-z\d]{8,12}$/).messages({'string.pattern.base':'La contraseña debe contener al menos una letra minúscula, una mayúscula, un dígito y tener una longitud mínima de 8 caracteres y maxima de 12 caracteres.'});
const correo = Joi.string().email();
const rol = Joi.string().valid(...ROLES);
const activo = Joi.boolean().default(true);

const createUserSchema = Joi.object({
    username: username.required(),
    password: password.required(),
    correo: correo.optional(),
    rol: rol.required(),
    activo,
});

const updateUserSchema = Joi.object({
    username: username.optional(),
    password: password.optional(),
    correo: correo.optional(),
    rol: rol.optional(),
    activo: activo.optional(),
});

const getUserSchema = Joi.object({
    id: id.required(),
});

module.exports = {
    createUserSchema,
    updateUserSchema,
    getUserSchema
};