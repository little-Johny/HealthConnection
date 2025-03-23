const Joi = require('joi');

const id = Joi.number().integer().positive();
const userId = Joi.number().integer().positive().required();
const title = Joi.string().min(5).max(100).required();
const content = Joi.string().min(10).optional().allow(null, '');
const image = Joi.string().uri().optional().allow(null, '');
const startDate = Joi.date().iso();
const endDate = Joi.date().iso().greater(Joi.ref('startDate'));
const limit = Joi.number().integer().positive().default(10);
const offset = Joi.number().integer().min(0).default(0);

const createPostSchema = Joi.object({
    userId,
    title,
    content,
    image,
});

const updatePostSchema = Joi.object({
    userId: userId.optional(),
    title: title.optional(),
    content: content.optional(),
    image: image.optional(),
});

const getPostSchema = Joi.object({
    
});

const getQueryPostSchema = Joi.object({
    id: id.optional(),
    userId: userId.optional(),
    title: title.optional(),
    startDate: startDate.optional(),
    endDate: endDate.optional(),
    limit: limit.optional(),
    offset: offset.optional(),
}).and('startDate', 'endDate');

module.exports = {
    createPostSchema,
    updatePostSchema,
    getPostSchema,
    getQueryPostSchema,
};
