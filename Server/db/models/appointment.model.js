const { DataTypes, Model, Sequelize } = require('sequelize');
const { PATIENT_TABLE } = require('./patient.model');
const { DOCTOR_TABLE } = require('./doctor.model');
const { SPECIALITY_TABLE } = require('./speciality.model');

const APPOINTMENT_TABLE = 'appointment';

const AppointmentSchema = { 
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
        type: DataTypes.DECIMAL(10,2),
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
};

class Appointment extends Model{
    static associate(models) {
        this.belongsTo(models.Doctor, {
            as: 'doctor',
            foreignKey: 'doctorId',
        });

        this.belongsTo(models.Patient, {
            as: 'patient',
            foreignKey: 'patientId',
        });

        this.belongsTo(models.Speciality, {
            as: 'speciality',
            foreignKey: 'specialityId',
        });
    }
    static config(sequelize) {
        return {
            sequelize,
            tableName: APPOINTMENT_TABLE,
            modelName: 'Appointment',
            timestamps: true,
            paranoid: true,
        }
    }
};

module.exports = { APPOINTMENT_TABLE, Appointment, AppointmentSchema };



