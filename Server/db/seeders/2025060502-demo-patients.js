// eslint-disable-next-line import/no-extraneous-dependencies
const { faker } = require('@faker-js/faker');

module.exports = {
    async up(queryInterface, Sequelize) {
        // 1. Crear usuarios
        const users = [];
        const now = new Date();
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
                role: faker.helpers.arrayElement(['patient']),
                recovery_token: null,
                created_at: now,
                updated_at: now,
                deleted_at: null,
            });
        }

        await queryInterface.bulkInsert('user', users, {});

        // 2. Obtener los usuarios insertados
        const insertedUsers = await queryInterface.sequelize.query(
            'SELECT id FROM "user" ORDER BY "created_at" DESC LIMIT 5;',
            { type: Sequelize.QueryTypes.SELECT },
        );

        // 3. Crear pacientes usando los IDs de usuarios
        const patients = insertedUsers.map((user) => ({
            user_id: user.id,
            birthdate: faker.date.birthdate(),
            address: faker.location.streetAddress(),
            city: faker.location.city(),
            created_at: new Date(),
            updated_at: new Date(),
        }));

        await queryInterface.bulkInsert('patient', patients, {});
    },

    async down(queryInterface) {
        // Primero elimina los pacientes, luego los usuarios
        await queryInterface.bulkDelete('patient', null, {});
        await queryInterface.bulkDelete('user', null, {});
    },
};
