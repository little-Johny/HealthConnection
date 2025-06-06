const { DataTypes, Sequelize } = require('sequelize');
const { APPOINTMENT_TABLE } = require('../models/appointment.model');
const { DOCTOR_TABLE } = require('../models/doctor.model');
const { PATIENT_TABLE } = require('../models/patient.model');
const { SPECIALITY_TABLE } = require('../models/speciality.model');

/** @type {import('sequelize-cli').Migration} */
module.exports = {
    async up(queryInterface) {
        await queryInterface.createTable(APPOINTMENT_TABLE, {
            id: {
                allowNull: false,
                type: DataTypes.INTEGER,
                autoIncrement: true,
                primaryKey: true,
            },
            patientId: {
                field: 'patient_id',
                allowNull: false,
                type: DataTypes.INTEGER,
                references: {
                    model: PATIENT_TABLE,
                    key: 'id',
                },
                onDelete: 'SET NULL',
                onUpdate: 'CASCADE',
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
            specialityId: {
                field: 'speciality_id',
                allowNull: false,
                type: DataTypes.INTEGER,
                references: {
                    model: SPECIALITY_TABLE,
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
            },
            price: {
                allowNull: false,
                type: DataTypes.DECIMAL(10, 2),
                validate: {
                    isDecimal: true,
                    min: 0,
                },
            },
            status: {
                allowNull: false,
                type: DataTypes.ENUM('pending', 'confirmed', 'completed', 'canceled'),
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
        await queryInterface.dropTable(APPOINTMENT_TABLE);
    },
};
