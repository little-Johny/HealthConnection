const { DataTypes, Model, Sequelize } = require('sequelize');
const { USER_TABLE } = require('./user.model');

const PATIENT_TABLE = 'patient';

const PatientSchema = {
    id: {
        allowNull: false,
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true,
    },
    userId: {
        field: 'user_id',
        allowNull: false,
        type: DataTypes.INTEGER,
        references: {
            model: USER_TABLE,
            key: 'id',
        },
        onDelete: 'SET NULL',
        onUpdate: 'CASCADE',
    },
    birthdate: {
        allowNull: false,
        type: DataTypes.DATE,
        validate: {
            isBefore(value) {
                if (new Date(value) >= new Date()) {
                    throw new Error('La fecha de nacimiento debe ser en el pasado.');
                }
            },
        },
    },
    address: {
        allowNull: false,
        type: DataTypes.STRING,
    },
    city: {
        allowNull: false,
        type: DataTypes.STRING,
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

class Patient extends Model {
    static associate(models) {
        this.belongsTo(models.User, {
            as: 'user',
            foreignKey: 'userId',
        });

        this.hasOne(models.ClinicalHistory, {
            as: 'clinical_history',
            foreignKey: 'patientId',
        });
    }

    static config(sequelize) {
        return {
            sequelize,
            tableName: PATIENT_TABLE,
            modelName: 'Patient',
            timestamps: true,
            paranoid: true,
        };
    }
}

module.exports = { PATIENT_TABLE, Patient, PatientSchema };
