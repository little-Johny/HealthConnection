const { DataTypes, Model, Sequelize } = require('sequelize');

const SPECIALITY_TABLE = 'specialities';

const SpecialitySchema = {
    id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: DataTypes.INTEGER,
    },
    name: {
        allowNull: false,
        type: DataTypes.STRING,
        unique: true,
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

class Speciality extends Model {
    static associate(models) {
        this.hasMany(models.Doctor, {
            as: 'doctors',
            foreignKey: 'specialityId',
        });

        this.hasMany(models.Appointment, {
            as: 'appointments',
            foreignKey: 'specialityId',
        });
    }

    static config(sequelize) {
        return {
            sequelize,
            tableName: SPECIALITY_TABLE,
            modelName: 'Speciality',
            timestamps: true,
        };
    }
}

module.exports = { SPECIALITY_TABLE, Speciality, SpecialitySchema };
