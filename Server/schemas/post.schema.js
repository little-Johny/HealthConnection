const Joi = require('joi');

const id = Joi.number().integer().positive();
const userId = Joi.number().integer().positive().required();
const title = Joi.string().min(5).max(100).required();
const content = Joi.string().min(10).optional().allow(null, '');
const image = Joi.string().uri().optional().allow(null, '');


const createPostSchema = Joi.object({
    userId,
    title,
    content,
    image,
});

const updatePostSchema = Joi.object({
    title: title.optional(),
    content: content.optional(),
    image: image.optional(),
});

const getPostSchema = Joi.object({
    id: id.required(),
});

module.exports = {
    createPostSchema,
    updatePostSchema,
    getPostSchema,
};
