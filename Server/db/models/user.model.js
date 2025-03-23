const { DataTypes, Model, Sequelize } = require('sequelize');

const USER_TABLE = 'user';

const UserSchema = {
    id: {
        allowNull: false,
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true,
    },
    username: {
        allowNull: false,
        type: DataTypes.STRING,
        unique: true,
    },
    password: {
        allowNull: false,
        type: DataTypes.STRING,
        validate: {
            len: [8, 100],
        },
    },
    name: {
        allowNull: false,
        type: DataTypes.STRING,
    },
    lastName: {
        field: 'last_name',
        allowNull: false,
        type: DataTypes.STRING,
    },
    photo: {
        allowNull: true,
        type: DataTypes.STRING,
    },
    typeDocument:{
        field: 'type_document',
        allowNull: false,
        type: DataTypes.STRING,
    },
    numberDocument:{
        field: 'number_document',
        allowNull: false,
        type: DataTypes.STRING,
        unique: true,
    },
    gender: {
        allowNull: false,
        type: DataTypes.STRING,
    },
    email: {
        allowNull: false,
        type: DataTypes.STRING,
        unique: true,
    },
    phone: {
        allowNull: true,
        type: DataTypes.STRING,
    },
    role: {
        allowNull: false,
        type: DataTypes.ENUM('admin', 'staff', 'doctor', 'patient'),
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

class User extends Model {
    static associate(models) {
        this.hasMany(models.Patient, {
            as: 'patient',
            foreignKey: 'userId',
        });
        this.hasMany(models.Doctor, {
            as: 'doctor',
            foreignKey: 'userId',
        });
        this.hasMany(models.Post, {
            as: 'post',
            foreignKey: 'userId',
        });
    }

    static config(sequelize) {
        return {
            sequelize,
            tableName: USER_TABLE,
            modelName: 'User',
            timestamps: true,
            paranoid: true,
        }
    }
}

module.exports = { USER_TABLE, User, UserSchema }; 