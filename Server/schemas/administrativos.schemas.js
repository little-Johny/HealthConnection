const Joi = require('joi');
const DOC_TYPE = [ 'pasaporte', 'c.c', 't.i', 'c.e', 'rc' ];
const GENERO = [ 'masculino', 'femenino' ];

const id = Joi.number().integer().positive();
const usuario_id = Joi.number().integer().positive();
const nombres = Joi.string().min(3).max(100);
const apellidos = Joi.string().min(3).max(100);
const foto = Joi.string();
const tipo_documento = Joi.string().valid(...DOC_TYPE);
const numero_documento = Joi.string().min(8).pattern(/^[^a-zA-Z]*$/).messages({'string.pattern.base':'el numero de documento debe estar compuesto de minimo 8 digitos'});
const genero = Joi.string().valid(...GENERO);
const telefono = Joi.string().alphanum().min(10).pattern(/^[^a-zA-Z]*$/).messages({'string.pattern.base': 'el numero telefonico no debe contener espacios y debe tener minimo 10 digitos'});
const correo = Joi.string().email();
const horario = Joi.string();
const fecha_contratacion = Joi.date().max('now');
const username = Joi.string().alphanum().min(5).max(50);
const password = Joi.string().alphanum().pattern(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)[A-Za-z\d]{8,12}$/).messages({'string.pattern.base':'La contraseña debe contener al menos una letra minúscula, una mayúscula, un dígito y tener una longitud mínima de 8 caracteres y maxima de 12 caracteres.'});
const rol = Joi.string().default('paciente');
const activo = Joi.boolean().default(true);

const createAdministrativoSchema = Joi.object({
    username: username.required(),
    password: password.required(),
    rol,
    activo,
    nombres: nombres.required(),
    apellidos: apellidos.required(),
    foto: foto.optional(),
    tipo_documento: tipo_documento.required(),
    numero_documento: numero_documento.required(),
    genero: genero.required(),
    telefono: telefono.required(),
    correo: correo.required(),
    horario: horario.required(),
    fecha_contratacion
});

const updateAdministrativoSchema = Joi.object({
    foto: foto.optional(),
    tipo_documento: tipo_documento.optional(),
    numero_documento: numero_documento.optional(),
    telefono: telefono.optional(),
    correo: correo.optional(),
    horario: horario.optional(),
});

const getAdministrativoSchema = Joi.object({
    id: id.required(),
});

module.exports = {
    createAdministrativoSchema,
    updateAdministrativoSchema,
    getAdministrativoSchema,
};