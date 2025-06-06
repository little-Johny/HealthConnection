module.exports = {
    async up(queryInterface) {
        const specialities = [
            { name: 'Pediatría', created_at: new Date(), updated_at: new Date() },
            { name: 'Cardiología', created_at: new Date(), updated_at: new Date() },
            { name: 'Dermatología', created_at: new Date(), updated_at: new Date() },
            { name: 'Ginecología', created_at: new Date(), updated_at: new Date() },
            { name: 'Neurología', created_at: new Date(), updated_at: new Date() },
        ];

        await queryInterface.bulkInsert('specialities', specialities, {});
    },

    async down(queryInterface) {
        await queryInterface.bulkDelete('specialities', null, {});
    },
};
