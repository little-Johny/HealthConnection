const { DataTypes } = require('sequelize');
const { DOCTOR_SCHEDULE_TABLE } = require('../models/doctorSchedule.model');
const { DOCTOR_TABLE } = require('../models/doctor.model');

/** @type {import('sequelize-cli').Migration} */
module.exports = {
    async up(queryInterface) {
        await queryInterface.addConstraint(DOCTOR_SCHEDULE_TABLE, {
            fields: ['doctor_id', 'day_of_week'],
            type: 'unique',
            name: 'unique_doctor_day',
        });

        await queryInterface.changeColumn(DOCTOR_SCHEDULE_TABLE, 'doctor_id', {
            field: 'doctor_id',
            allowNull: false,
            type: DataTypes.INTEGER,
            references: {
                model: DOCTOR_TABLE,
                key: 'id',
            },
            onDelete: 'CASCADE',
            onUpdate: 'CASCADE',
        });

        await queryInterface.changeColumn(DOCTOR_SCHEDULE_TABLE, 'end_time', {
            field: 'end_time',
            allowNull: false,
            type: DataTypes.TIME,
            validate: {
                isGreaterThanStart(value) {
                    if (value <= this.startTime || !value || value === this.startTime) {
                        throw new Error(
                            'The end time must be greater than the start time.',
                        );
                    }
                },
            },
        });
    },

    async down(queryInterface) {
        await queryInterface.removeConstraint(
            DOCTOR_SCHEDULE_TABLE,
            'unique_doctor_day',
        );

        await queryInterface.changeColumn(DOCTOR_SCHEDULE_TABLE, 'doctor_id', {
            field: 'doctor_id',
            allowNull: false,
            type: DataTypes.INTEGER,
            references: {
                model: DOCTOR_TABLE,
                key: 'id',
            },
            onDelete: 'SET NULL',
            onUpdate: 'CASCADE',
        });

        await queryInterface.changeColumn(DOCTOR_SCHEDULE_TABLE, 'end_time', {
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
        });
    },
};
