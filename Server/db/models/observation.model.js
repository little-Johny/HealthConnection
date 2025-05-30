const { DataTypes, Model, Sequelize } = require('sequelize');
const { CLINICAL_HISTORY_TABLE } = require('./clinicalHistory.model');
const { DOCTOR_TABLE } = require('./doctor.model');

const OBSERVATION_TABLE = 'observation';

const ObservationSchema = {
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
};

class Observation extends Model {
    static associate(models) {
        this.belongsTo(models.ClinicalHistory, {
            as: 'clinical_history',
            foreignKey: 'clinicalHistoryId',
        });

        this.belongsTo(models.Doctor, {
            as: 'doctor',
            foreignKey: 'doctorId',
        });
    }

    static config(sequelize) {
        return {
            sequelize,
            tableName: OBSERVATION_TABLE,
            modelName: 'Observation',
            timestamps: true,
            paranoid: true,
        };
    }
}

module.exports = { OBSERVATION_TABLE, Observation, ObservationSchema };
