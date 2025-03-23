'use strict';

const { DataTypes, Sequelize } = require('sequelize');
const { CLINICAL_HISTORY_TABLE } = require('../models/clinicalHistory.model');
const { PATIENT_TABLE } = require('../models/patient.model');

/** @type {import('sequelize-cli').Migration} */
module.exports = {
    async up (queryInterface) {
        await queryInterface.createTable(CLINICAL_HISTORY_TABLE, {
        id: {
            allowNull: false,
            autoIncrement: true,
            primaryKey: true,
            type: DataTypes.INTEGER,
        },
        patientId: {
            field: 'patient_id',
            allowNull: false,
            type: DataTypes.INTEGER,
            references: {
                model: PATIENT_TABLE,
                key: 'id',
            },
            onDelete: 'CASCADE',
        },
        bloodType: {
            field: 'blood_type',
            allowNull: false,
            type: DataTypes.ENUM('A+', 'A-', 'B+', 'B-', 'O+', 'O-', 'AB+', 'AB-'),
        },
        weight: {
            allowNull: true,
            type: DataTypes.FLOAT, // Peso en kg
        },
        height: {
            allowNull: true,
            type: DataTypes.FLOAT, // Altura en metros
        },
        chronicDiseases: {
            field: 'chronic_diseases',
            allowNull: true,
            type: DataTypes.TEXT, // Enfermedades preexistentes en formato string separado por comas
        },
        allergies: {
            allowNull: true,
            type: DataTypes.TEXT, // Alergias en formato string separado por comas
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

    async down (queryInterface) {
        await queryInterface.dropTable(CLINICAL_HISTORY_TABLE);
    }
};
