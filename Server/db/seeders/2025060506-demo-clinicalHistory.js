// eslint-disable-next-line import/no-extraneous-dependencies
const { faker } = require('@faker-js/faker');

module.exports = {
    async up(queryInterface, Sequelize) {
        // 1. Obtener todos los pacientes
        const patients = await queryInterface.sequelize.query(
            'SELECT id FROM patient;',
            { type: Sequelize.QueryTypes.SELECT },
        );

        // 2. Opciones para tipo de sangre
        const bloodTypes = ['A+', 'A-', 'B+', 'B-', 'O+', 'O-', 'AB+', 'AB-'];

        // 3. Crear historial clínico para cada paciente
        const clinicalHistories = patients.map((patient) => ({
            patient_id: patient.id,
            blood_type: faker.helpers.arrayElement(bloodTypes),
            weight: parseFloat(faker.number.float({ min: 40, max: 120, precision: 0.1 }).toFixed(1)),
            height: parseFloat(faker.number.float({ min: 1.4, max: 2.0, precision: 0.01 }).toFixed(2)),
            chronic_diseases: faker.datatype.boolean()
                ? faker.lorem.words(faker.number.int({ min: 1, max: 3 })).replace(/\s/g, ', ')
                : null,
            allergies: faker.datatype.boolean()
                ? faker.lorem.words(faker.number.int({ min: 1, max: 3 })).replace(/\s/g, ', ')
                : null,
            created_at: new Date(),
            updated_at: new Date(),
        }));

        await queryInterface.bulkInsert('clinical_histories', clinicalHistories, {});
    },

    async down(queryInterface) {
        await queryInterface.bulkDelete('clinical_histories', null, {});
    },
};
