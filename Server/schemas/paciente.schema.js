const Joi = require('joi');
const DOC_TYPE = ['c.c', 't.i', 'c.e', 'rc' ];
const GENERO = [ 'masculino', 'femenino' ];

const id = Joi.number().integer().positive();
const nombres = Joi.string().min(3).max(100);
const apellidos = Joi.string().min(3).max(100);
const foto = Joi.string().allow('');
const tipo_documento = Joi.string().valid(...DOC_TYPE);
const numero_documento = Joi.string().min(8).pattern(/^[^a-zA-Z]*$/).messages({'string.pattern.base':'El número de documento debe estar compuesto de minimo 8 digitos'});
const fecha_nacimiento = Joi.date().min('1-1-1800').max('now').iso();
const genero = Joi.string().valid(...GENERO);
const telefono = Joi.string().pattern(/^[+]?[\d]{10,15}$/).messages({'string.pattern.base': 'El número telefónico debe ser válido y contener entre 10 y 15 dígitos.'});
const correo = Joi.string().email();
const direccion = Joi.string().min(10).max(255);
const ciudad = Joi.string().min(4).max(255);
const username = Joi.string().alphanum().min(5).max(50);
const password = Joi.string().alphanum().pattern(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)[A-Za-z\d]{8,12}$/).messages({'string.pattern.base':'La contraseña debe contener al menos una letra minúscula, una mayúscula, un dígito y tener una longitud mínima de 8 caracteres y maxima de 12 caracteres.'});
const rol = Joi.string().default('paciente');
const activo = Joi.boolean().default(true);

const createPacienteSchema = Joi.object({
    username: username.required(),
    password: password.required(),
    rol,
    activo,
    correo: correo.optional(),
    nombres: nombres.required(),
    apellidos: apellidos.required(),
    foto: foto.optional().empty(),
    tipo_documento: tipo_documento.required(),
    numero_documento: numero_documento.required(),
    fecha_nacimiento: fecha_nacimiento.required(),
    genero: genero.required(),
    telefono: telefono.required(),
    direccion: direccion.required(),
    ciudad: ciudad.required(),
});

const updatePacienteSchema = Joi.object({
    foto: foto.allow(''),
    nombres: nombres.allow(''),
    apellidos: apellidos.allow(''),
    tipo_documento: tipo_documento.allow(''),
    numero_documento: numero_documento.allow(''),
    telefono: telefono.allow(''),
    correo: correo.allow(''),
    direccion: direccion.allow(''),
    ciudad: ciudad.allow(''),
});

const getPacienteSchema = Joi.object({
    id: id.required(),
});

module.exports={
    createPacienteSchema,
    updatePacienteSchema,
    getPacienteSchema
};