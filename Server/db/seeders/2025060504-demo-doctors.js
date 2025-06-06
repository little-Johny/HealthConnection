// eslint-disable-next-line import/no-extraneous-dependencies
const { faker } = require('@faker-js/faker');

module.exports = {
    async up(queryInterface, Sequelize) {
        const now = new Date();
        const users = [];

        // 1. Crear usuarios con prefijo en username para identificarlos luego
        for (let i = 0; i < 5; i++) {
            users.push({
                username: `seed_doc_${faker.internet.username()}`,
                password: faker.internet.password(12),
                name: faker.person.firstName(),
                last_name: faker.person.lastName(),
                photo: faker.image.avatar(),
                type_document: faker.helpers.arrayElement(['CC', 'TI', 'CE']),
                number_document: faker.string.numeric(10),
                gender: faker.person.gender(),
                email: faker.internet.email(),
                phone: faker.phone.number(),
                role: 'doctor',
                recovery_token: null,
                created_at: now,
                updated_at: now,
                deleted_at: null,
            });
        }

        await queryInterface.bulkInsert('user', users, {});

        // 2. Obtener los IDs de los usuarios recién insertados (filtrando por prefijo)
        const insertedUsers = await queryInterface.sequelize.query(
            'SELECT id FROM "user" WHERE username LIKE \'seed_doc_%\';',
            { type: Sequelize.QueryTypes.SELECT },
        );

        // 3. Obtener IDs de especialidades
        const specialities = await queryInterface.sequelize.query(
            'SELECT id FROM "specialities";',
            { type: Sequelize.QueryTypes.SELECT },
        );

        if (!specialities.length) {
            console.warn('⚠️ No hay especialidades registradas en la base de datos.');
            return;
        }

        // 4. Crear doctores
        const doctors = insertedUsers.map((user) => ({
            user_id: user.id,
            speciality_id: faker.helpers.arrayElement(specialities).id,
            license_number: faker.string.alphanumeric(10).toUpperCase(),
            consultation_fee: faker.number.float({ min: 50, max: 500, precision: 0.01 }),
            created_at: now,
            updated_at: now,
        }));

        await queryInterface.bulkInsert('doctor', doctors, {});
    },

    async down(queryInterface, Sequelize) {
        // 1. Eliminar doctores cuyos usuarios tienen username con prefijo
        await queryInterface.bulkDelete(
            'doctor',
            {
                user_id: {
                    [Sequelize.Op.in]: Sequelize.literal(
                        '(SELECT id FROM "user" WHERE username LIKE \'seed_doc_%\')',
                    ),
                },
            },
            {},
        );

        // 2. Eliminar los usuarios creados por este seeder
        await queryInterface.bulkDelete(
            'user',
            {
                username: {
                    [Sequelize.Op.like]: 'seed_doc_%',
                },
            },
            {},
        );
    },
};
