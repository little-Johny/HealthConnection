const { DataTypes, Model, Sequelize } = require('sequelize');
const { DOCTOR_TABLE } = require('./doctor.model');

const DOCTOR_SCHEDULE_TABLE = 'doctor_schedule';

const DoctorScheduleSchema = {
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
            key: 'id'
        },
        onDelete: 'SET NULL',
        onUpdate: 'CASCADE',
    },
    dayOfWeek: {
        field: 'day_of_week',
        allowNull: false,
        type: DataTypes.ENUM('Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'),
    },    
    startTime: {
        field: 'start_time',
        allowNull:false,
        type: DataTypes.TIME,
    },
    endTime: {
        field: 'end_time',
        allowNull:false,
        type: DataTypes.TIME,
        validate: {
            isGreaterThanStart(value) {
                if (value <= this.startTime || value === this.startTime) {
                    throw new Error(`The end time must be greater than the start time.`);
                }
            }
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
}

class DoctorSchedule extends Model {
    static associate(models) {
        this.belongsTo(models.Doctor, {
            as: 'doctor',
            foreignKey: 'doctorId',
        })
    };

    static config(sequelize) {
        return {
            sequelize,
            tableName: DOCTOR_SCHEDULE_TABLE,
            modelName: 'DoctorSchedule',
            timestamps: true,
            paranoid: true,
        } 
    };
};

module.exports = { DOCTOR_SCHEDULE_TABLE, DoctorSchedule, DoctorScheduleSchema };