const { DataTypes } = require('sequelize');
const {
    DOCTOR_SCHEDULE_BLOCK_TABLE,
} = require('../models/doctorScheduleBlock.model');

/** @type {import('sequelize-cli').Migration} */
module.exports = {
    async up(queryInterface) {
        await queryInterface.changeColumn(DOCTOR_SCHEDULE_BLOCK_TABLE, 'reason', {
            allowNull: false,
            type: DataTypes.ENUM('appointment', 'break', 'meeting'),
        });
    },

    async down(queryInterface) {
        await queryInterface.changeColumn(DOCTOR_SCHEDULE_BLOCK_TABLE, 'reason', {
            allowNull: false,
            type: DataTypes.ENUM('appintment', 'break', 'meeting'),
        });
    },
};
