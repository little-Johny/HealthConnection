const { DataTypes, Sequelize } = require('sequelize');
const { DOCTOR_TABLE } = require('../models/doctor.model');
const { USER_TABLE } = require('../models/user.model');
const { SPECIALITY_TABLE } = require('../models/speciality.model');

/** @type {import('sequelize-cli').Migration} */
module.exports = {
    async up(queryInterface) {
        await queryInterface.createTable(DOCTOR_TABLE, {
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
                },
            },
            consultationFee: {
                field: 'consultation_fee',
                allowNull: false,
                type: DataTypes.DECIMAL(10, 2),
                validate: {
                    isDecimal: true,
                    min: 0,
                },
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
        });
    },

    async down(queryInterface) {
        await queryInterface.dropTable(DOCTOR_TABLE);
    },
};
