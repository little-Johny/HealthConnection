const { DataTypes, Model } = require('sequelize');

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
};

class Speciality extends Model {
    static associate(models) {
        this.hasMany(models.Doctor, { 
            as: 'doctors' ,
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
