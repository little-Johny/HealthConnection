'use strict';

const { DataTypes, Sequelize } = require('sequelize');
const { OBSERVATION_TABLE } = require('../models/observation.model');
const { DOCTOR_TABLE } = require('../models/doctor.model');
const { CLINICAL_HISTORY_TABLE } = require('../models/clinicalHistory.model');

/** @type {import('sequelize-cli').Migration} */
module.exports = {
    async up (queryInterface) {
        await queryInterface.createTable(OBSERVATION_TABLE, {
        id: {
            allowNull: false, 
            type: DataTypes.INTEGER,
            autoIncrement: true,
            primaryKey: true,
        },
        clinicalHistoryId: {
            field: 'clinical_history_id',
            allowNull: false,
            type: DataTypes.INTEGER,
            references: {
                model: CLINICAL_HISTORY_TABLE,
                key: 'id',
            },
        },  
        doctorId: {
            field: 'doctor_id',
            allowNull: false,
            type: DataTypes.INTEGER,
            references: {
                model: DOCTOR_TABLE,
                key: 'id',
            },
        },
        diagnosis: {
            allowNull: false,
            type: DataTypes.TEXT,
        },
        treatment: {
            allowNull: true,
            type: DataTypes.TEXT,
        },
        notes: {
            allowNull: true,
            type: DataTypes.TEXT,
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
        await queryInterface.dropTable(OBSERVATION_TABLE);
    }
};
