const { DataTypes, Sequelize } = require('sequelize');
const { SPECIALITY_TABLE } = require('../models/speciality.model');

/** @type {import('sequelize-cli').Migration} */
module.exports = {
    async up(queryInterface) {
        await queryInterface.createTable(SPECIALITY_TABLE, {
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
        });
    },

    async down(queryInterface) {
        await queryInterface.dropTable(SPECIALITY_TABLE);
    },
};
