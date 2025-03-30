const { DataTypes, Model, Sequelize } = require('sequelize');
const { USER_TABLE } = require('./user.model');
const { SPECIALITY_TABLE } = require('./speciality.model');

const DOCTOR_TABLE = 'doctor';

const DoctorSchema = {
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
    licenseNumber: {
        field: 'license_number',
        allowNull: false,
        type: DataTypes.STRING,
        unique: true,
        validate: {
            len: [5, 20],
        }
    },
    consultationFee: {
        field: 'consultation_fee',
        allowNull: false,
        type: DataTypes.DECIMAL(10,2),
        validate: {
            isDecimal: true,
            min: 0,
        }
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

class Doctor extends Model {
    static associate(models) {
        this.belongsTo(models.User, {
            as: 'user',
            foreignKey: 'userId',
        });

        this.hasMany(models.DoctorSchedule, {
            as: 'schedule',
            foreignKey: 'doctorId'
        });

        this.hasMany(models.DoctorScheduleBlock, {
            as: 'scheduleBlock',
            foreignKey: 'doctorId',
        });

        this.hasMany(models.Appointment, {
            as: 'appointment',
            foreignKey: 'doctorId',
        });

        this.hasMany(models.Observation, {
            as: 'observation',
            foreignKey: 'doctorId',
        });
        this.belongsTo(models.Speciality, {
            as: 'speciality',
            foreignKey: 'specialityId',
        })
    };

    static config(sequelize) {
        return {
            sequelize,
            tableName: DOCTOR_TABLE,
            modelName: 'Doctor',
            timestamps: true,
            paranoid: true,
        }
    };
};

module.exports = { DOCTOR_TABLE, Doctor, DoctorSchema };