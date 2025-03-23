const { DataTypes, Model, Sequelize } = require('sequelize');
const { PATIENT_TABLE } = require('./patient.model');

const CLINICAL_HISTORY_TABLE = 'clinical_histories';

const ClinicalHistorySchema = {
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
};

class ClinicalHistory extends Model {
    static associate(models) {
        this.belongsTo(models.Patient, { 
            as: 'patient', 
            foreignKey: 'patientId', 
        });

        this.hasMany(models.Observation, { 
            as: 'observations', 
            foreignKey: 'clinicalHistoryId', 
        });
    }

    static config(sequelize) {
        return {
            sequelize,
            tableName: CLINICAL_HISTORY_TABLE,
            modelName: 'ClinicalHistory',
            timestamps: true,
            paranoid: true,
        };
    }
}

module.exports = { CLINICAL_HISTORY_TABLE, ClinicalHistory, ClinicalHistorySchema };
