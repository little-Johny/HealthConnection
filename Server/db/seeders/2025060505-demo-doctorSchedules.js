module.exports = {
    async up(queryInterface, Sequelize) {
        // 1. Obtener todos los doctores
        const doctors = await queryInterface.sequelize.query(
            // eslint-disable-next-line quotes
            `SELECT id FROM doctor;`,
            { type: Sequelize.QueryTypes.SELECT },
        );

        // 2. Días laborales
        const days = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'];

        // 3. Crear horarios para cada doctor
        const schedules = [];

        const startTime = '08:00:00';
        const endTime = '16:00:00';

        doctors.forEach((doctor) => {
            days.forEach((day) => {
                schedules.push({
                    doctor_id: doctor.id,
                    day_of_week: day,
                    start_time: startTime,
                    end_time: endTime,
                    created_at: new Date(),
                    updated_at: new Date(),
                });
            });
        });

        await queryInterface.bulkInsert('doctor_schedule', schedules, {});
    },

    async down(queryInterface) {
        await queryInterface.bulkDelete('doctor_schedule', null, {});
    },
};
