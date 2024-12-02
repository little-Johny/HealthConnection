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
const fecha_nacimiento = Joi.date().min('1-1-1800').max('now').iso();
const genero = Joi.string().valid(...GENERO);
const telefono = Joi.string().alphanum().min(10).pattern(/^[^a-zA-Z]*$/).messages({'string.pattern.base': 'el numero telefonico no debe contener espacios y debe tener minimo 10 digitos'});
const correo = Joi.string().email();
const direccion = Joi.string().min(20).max(255);
const ciudad = Joi.string().min(4).max(255);
const afiliacion_id = Joi.number().integer().positive();

const createPacienteSchema = Joi.object({
    usuario_id: usuario_id.required(),
    nombres: nombres.required(),
    apellidos: apellidos.required(),
    foto: foto.optional(),
    tipo_documento: tipo_documento.required(),
    numero_documento: numero_documento.required(),
    fecha_nacimiento: fecha_nacimiento.required(),
    genero: genero.required(),
    telefono: telefono.required(),
    correo: correo.optional(),
    direccion: direccion.required(),
    ciudad: ciudad.required(),
    afiliacion_id: afiliacion_id.optional(),
});

const updatePacienteSchema = Joi.object({
    foto: foto.optional(),
    tipo_documento: tipo_documento.optional(),
    numero_documento: numero_documento.optional(),
    telefono: telefono.optional(),
    correo: correo.optional(),
    direccion: direccion.optional(),
    ciudad: ciudad.optional(),
    afiliacion_id: afiliacion_id.optional(),
});

const getPacienteSchema = Joi.object({
    id: id.required(),
});

module.exports={
    createPacienteSchema,
    updatePacienteSchema,
    getPacienteSchema
};