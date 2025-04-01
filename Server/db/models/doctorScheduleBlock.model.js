const { Model, DataTypes, Sequelize } = require('sequelize');
const { DOCTOR_TABLE } = require('./doctor.model');

const DOCTOR_SCHEDULE_BLOCK_TABLE = 'doctor_schedule_block';

const DoctorScheduleBlockSchema = {
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
                const start = new Date(`1970-01-01T${this.startTime}Z`);
                const end = new Date(`1970-01-01T${value}Z`);
                if (end <= start) {
                    throw new Error(`The end time must be greater than the start time.`);
                }
            }
        }
        
    },
    reason: {
        allowNull: false,
        type: DataTypes.ENUM('appintment', 'break', 'meeting'),
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

class DoctorScheduleBlock extends Model {
    static associate(models) {
        this.belongsTo(models.Doctor, {
            as: 'doctor',
            foreignKey: 'doctorId',
        })
    };

    static config(sequelize) {
        return {
            sequelize,
            tableName: DOCTOR_SCHEDULE_BLOCK_TABLE,
            modelName: 'DoctorScheduleBlock',
            timestamps: true,
            paranoid: true,
        };
    }
};

module.exports = { DOCTOR_SCHEDULE_BLOCK_TABLE, DoctorScheduleBlock, DoctorScheduleBlockSchema };