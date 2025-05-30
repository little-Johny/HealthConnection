const Joi = require('joi');

const id = Joi.number();
const doctorId = Joi.number().required();
const dayOfWeek = Joi.string()
    .valid(
        'Monday',
        'Tuesday',
        'Wednesday',
        'Thursday',
        'Friday',
        'Saturday',
        'Sunday',
    )
    .required();
const startTime = Joi.string()
    .pattern(/^([01]\d|2[0-3]):([0-5]\d):([0-5]\d)$/)
    .messages({
        'string.pattern.base':
      'El formato de la hora de inicio debe ser HH:mm:ss (24h).',
    });

const endTime = Joi.string()
    .pattern(/^([01]\d|2[0-3]):([0-5]\d):([0-5]\d)$/)
    .messages({
        'string.pattern.base':
      'El formato de la hora de finalización debe ser HH:mm:ss (24h).',
    })
    .custom((value, helpers) => {
        const start = helpers.state.ancestors[0].startTime;
        if (start && value <= start) {
            return helpers.error('any.invalid', {
                message:
          'La hora de finalización debe ser mayor que la hora de inicio.',
            });
        }
        return value;
    });
const startDate = Joi.date().iso();
const endDate = Joi.date().iso().greater(Joi.ref('startDate'));
const limit = Joi.number().integer().positive().default(10);
const offset = Joi.number().integer().min(0).default(0);

const createDoctorScheduleSchema = Joi.object({
    doctorId,
    dayOfWeek,
    startTime: startTime.required(),
    endTime: endTime.required(),
});

const createDoctorBlockSchema = Joi.object({
    doctorId,
    date: Joi.date().iso(),
    startTime: startTime.required(),
    endTime: endTime.required(),
    reason: Joi.string().required(),
});

const updateDoctorScheduleSchema = Joi.object({
    dayOfWeek: dayOfWeek.optional(),
    startTime: startTime.optional(),
    endTime: endTime.optional(),
});

const getDoctorScheduleSchema = Joi.object({
    id: id.required(),
});

const getScheduleByDoctorIdSchema = Joi.object({
    doctorId,
});

module.exports = {
    createDoctorScheduleSchema,
    createDoctorBlockSchema,
    updateDoctorScheduleSchema,
    getDoctorScheduleSchema,
    getScheduleByDoctorIdSchema,
};
