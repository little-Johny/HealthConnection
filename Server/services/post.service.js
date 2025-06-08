const boom = require('@hapi/boom');
const path = require('path');
const fs = require('fs');
const { models, sequelize } = require('../libs/sequelize');
const UserService = require('./user.service');

const userService = new UserService();

class PostService {
    async create(data) {
        await userService.findOne(data.userId);
        const newPost = await models.Post.create(data);
        return newPost;
    }

    async find() {
        const posts = await models.Post.findAll();
        if (posts.length === 0) {
            throw boom.notFound('No se encontraron publicaciones');
        }
        return posts;
    }

    async findOne(id) {
        const post = await models.Post.findByPk(id);
        if (!post) {
            throw boom.notFound(`No se encontro la publicacion ID ${id}`);
        }
        return post;
    }

    async update(id, changes) {
        const transaction = await sequelize.transaction();
        try {
            const post = await this.findOne(id);

            if (changes.image) {
                await this.unlinkPostPhoto(post.image);
            }

            const postUpdated = await post.update(changes, {
                fields: Object.keys(changes).filter(
                    (field) => field !== 'id' && field !== 'userId',
                ),
                transaction,
            });
            await transaction.commit();
            return postUpdated;
        } catch (error) {
            await transaction.rollback();
            throw error;
        }
    }

    async delete(id) {
        const post = await this.findOne(id);
        const postDeleted = await post.destroy();
        return postDeleted;
    }

    async unlinkPostPhoto(photo) {
        const filePath = path.join(
            __dirname,
            '../../Uploads/posts',
            path.basename(photo),
        );

        if (fs.existsSync(filePath)) {
            fs.unlinkSync(filePath);
        }
    }
}

module.exports = PostService;
