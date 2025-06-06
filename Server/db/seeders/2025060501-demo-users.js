// eslint-disable-next-line import/no-extraneous-dependencies
const { faker } = require('@faker-js/faker');

module.exports = {
    async up(queryInterface) {
        const users = [];

        for (let i = 0; i < 5; i++) {
            users.push({
                username: faker.internet.username(),
                password: faker.internet.password(12),
                name: faker.person.firstName(),
                last_name: faker.person.lastName(),
                photo: faker.image.avatar(),
                type_document: faker.helpers.arrayElement(['CC', 'TI', 'CE']),
                number_document: faker.string.numeric(10),
                gender: faker.person.gender(),
                email: faker.internet.email(),
                phone: faker.phone.number(),
                role: faker.helpers.arrayElement(['staff', 'admin']),
                recovery_token: null,
                created_at: new Date(),
                updated_at: new Date(),
                deleted_at: null,
            });
        }

        await queryInterface.bulkInsert('user', users, {});
    },

    async down(queryInterface) {
        await queryInterface.bulkDelete('user', {
            role: ['staff', 'admin'], // Elimina solo los creados con estos roles
        }, {});
    },
};
