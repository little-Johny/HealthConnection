const { DataTypes, Sequelize } = require('sequelize');
const {
    DOCTOR_SCHEDULE_BLOCK_TABLE,
} = require('../models/doctorScheduleBlock.model');
const { DOCTOR_TABLE } = require('../models/doctor.model');

/** @type {import('sequelize-cli').Migration} */
module.exports = {
    async up(queryInterface) {
        await queryInterface.createTable(DOCTOR_SCHEDULE_BLOCK_TABLE, {
            id: {
                allowNull: false,
                type: DataTypes.INTEGER,
                autoIncrement: true,
                primaryKey: true,
            },
            doctorId: {
                field: 'doctor_id',
                allowNull: false,
                type: DataTypes.INTEGER,
                references: {
                    model: DOCTOR_TABLE,
                    key: 'id',
                },
                onDelete: 'SET NULL',
                onUpdate: 'CASCADE',
            },
            date: {
                allowNull: false,
                type: DataTypes.DATEONLY,
            },
            startTime: {
                field: 'start_time',
                allowNull: false,
                type: DataTypes.TIME,
            },
            endTime: {
                field: 'end_time',
                allowNull: false,
                type: DataTypes.TIME,
                validate: {
                    isGreaterThanStart(value) {
                        if (value <= this.startTime || value === this.startTime) {
                            throw new Error(
                                'The end time must be greater than the start time.',
                            );
                        }
                    },
                },
            },
            reason: {
                allowNull: false,
                type: DataTypes.ENUM('appointment', 'break', 'meeting'),
            },
            createdAt: {
                field: 'created_at',
                allowNull: false,
                type: DataTypes.DATE,
                defaultValue: Sequelize.NOW,
            },
            updatedAt: {
                field: 'updated_at',
                allowNull: true,
                type: DataTypes.DATE,
            },
            deletedAt: {
                field: 'deleted_at',
                allowNull: true,
                type: DataTypes.DATE,
            },
        });
    },

    async down(queryInterface) {
        await queryInterface.dropTable(DOCTOR_SCHEDULE_BLOCK_TABLE);
    },
};
