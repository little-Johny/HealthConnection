// eslint-disable-next-line import/no-extraneous-dependencies
const { faker } = require('@faker-js/faker');

module.exports = {
    async up(queryInterface, Sequelize) {
        // 1. Obtener los usuarios existentes
        const users = await queryInterface.sequelize.query(
            'SELECT id FROM "user";',
            { type: Sequelize.QueryTypes.SELECT },
        );

        // 2. Crear publicaciones para algunos usuarios (o para todos)
        const posts = [];

        users.forEach((user) => {
        // Generar entre 1 y 3 posts por usuario
            const postCount = faker.number.int({ min: 1, max: 3 });
            for (let i = 0; i < postCount; i++) {
                posts.push({
                    user_id: user.id,
                    title: faker.lorem.sentence(5),
                    content: faker.lorem.paragraphs(faker.number.int({ min: 1, max: 3 }), '\n\n'),
                    image: faker.datatype.boolean() ? faker.image.url() : null,
                    created_at: faker.date.past(),
                    updated_at: faker.date.recent(),
                    deleted_at: null,
                });
            }
        });

        await queryInterface.bulkInsert('post', posts, {});
    },

    async down(queryInterface) {
        await queryInterface.bulkDelete('post', null, {});
    },
};
