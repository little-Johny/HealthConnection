const Joi = require('joi');

const token = Joi.string();
const password = Joi.string()
    .alphanum()
    .pattern(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)[A-Za-z\d]{8,12}$/)
    .messages({
        'string.pattern.base':
        'La contraseña debe contener al menos una letra minúscula, una mayúscula, un dígito y tener una longitud mínima de 8 caracteres y máxima de 12 caracteres.',
    });
const username = Joi.string()
    .pattern(/^[a-zA-Z0-9 ]+$/)
    .min(5)
    .max(50);
const email = Joi.string().email();

const LoginSchema = Joi.object({
    username: username.required(),
    password: password.required(),
});
const RecoverySchema = Joi.object({
    email: email.required(),
});
const ChangePasswordSchema = Joi.object({
    token: token.required(),
    newPassword: password.required(),
});

module.exports = { LoginSchema, RecoverySchema, ChangePasswordSchema };
