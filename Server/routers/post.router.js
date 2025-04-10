const express = require('express');
const passport = require('passport');
const { checkRole } = require('./../middlewares/authentication.handler');
const validatorHandler = require('./../middlewares/validation.handler');
const ResponseHandler = require('./../middlewares/response.handler');
const { postsUpload, getUploadedFileURL } = require('./../middlewares/files.handler');
const { createPostSchema, getPostSchema, updatePostSchema } = require('./../schemas/post.schema');
const PostService = require('./../services/post.service');
const router = express.Router();
const service = new PostService();

const processPostData = (req) => {
    let data = { ...req.body };
    if (req.file) {
        data.image = getUploadedFileURL('posts', req.file.filename)
    };
    return data;
}

// Crear publicacion
router.post(
    '/',
    passport.authenticate('jwt', { session: false }),
    checkRole(['staff', 'admin']),
    postsUpload.single('image'),
    validatorHandler(createPostSchema, 'body'),
    async (req, res, next) => {
        try {
            const postData = processPostData(req);
            processPostData.userId = req.user.sub;
            const newPost = await service.create(postData);
            ResponseHandler.success({
                res,
                req,
                message: `Publicacion creada exitosamente`,
                data: newPost,
                statusCode: 201,
            });
        } catch (error) {
            next(error);
        }
    }
);

// Obtener publicaciones
router.get(
    '/',
    async (req, res, next) => {
        try {
            const posts = await service.find();
            ResponseHandler.success({
                res,
                req,
                message: `Publicaciones encontradas`,
                data: posts,
            });
        } catch (error) {
            next(error);
        }
    }
);


// obtener publicacion por su id
router.get(
    '/:id',
    validatorHandler(getPostSchema, 'params'),
    async (req, res, next) => {
        try {
            const { id } = req.params;
            const post = await service.findOne(id);
            ResponseHandler.success({
                res,
                req,
                message: `Publicacion con ID ${id} encontrada`,
                data: post,
            });
        } catch (error) {
            next(error);
        }
    }
);

// Actualizar parcialmente una publicacion
router.patch(
    '/:id',
    postsUpload.single('image'),
    validatorHandler(getPostSchema, 'params'),
    validatorHandler(updatePostSchema, 'body'),
    async (req, res, next) => {
        try {
            const { id } = req.params;
            const changes = processPostData(req);

            const originalPost = await service.findOne(id);
            await service.update(id, changes);
            const updatedPost = await service.findOne(id);

            const updatedFields = Object.keys(changes).map(
                (key) => `${key}: '${originalPost[key]}' → '${updatedPost[key]}'`,
            );

            ResponseHandler.success({
                res,
                req,
                message: `Publicacion actualizada exitosamente. Cambios: ${updatedFields.join(', ')}`,
                data: updatedPost,
            });
        } catch (error) {
            next(error);
        }
    }
);

// Eliminar una publicacion
router.delete(
    '/:id',
    validatorHandler(getPostSchema, 'params'),
    async (req, res, next) => {
        try {
            const { id } = req.params;
            await service.delete(id);
            ResponseHandler.success({
                res,
                req,
                message: `Publicacion eliminada exitosamente`,
                data: id,
            });
        } catch (error) {
            next(error);
        }
    }
);

module.exports = router;