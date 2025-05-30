const { Sequelize } = require('sequelize');
const { USER_TABLE } = require('../models/user.model');

/** @type {import('sequelize-cli').Migration} */
module.exports = {
    async up(queryInterface) {
        await queryInterface.createTable(USER_TABLE, {
            id: {
                allowNull: false,
                type: Sequelize.INTEGER,
                autoIncrement: true,
                primaryKey: true,
            },
            username: {
                allowNull: false,
                type: Sequelize.STRING,
                unique: true,
            },
            password: {
                allowNull: false,
                type: Sequelize.STRING,
            },
            name: {
                allowNull: false,
                type: Sequelize.STRING,
            },
            lastName: {
                field: 'last_name',
                allowNull: false,
                type: Sequelize.STRING,
            },
            photo: {
                allowNull: true,
                type: Sequelize.STRING,
            },
            typeDocument: {
                field: 'type_document',
                allowNull: false,
                type: Sequelize.STRING,
            },
            numberDocument: {
                field: 'number_document',
                allowNull: false,
                type: Sequelize.STRING,
                unique: true,
            },
            gender: {
                allowNull: false,
                type: Sequelize.STRING,
            },
            email: {
                allowNull: false,
                type: Sequelize.STRING,
                unique: true,
            },
            role: {
                allowNull: false,
                type: Sequelize.ENUM('admin', 'staff', 'doctor', 'patient'),
            },
            createdAt: {
                field: 'created_at',
                allowNull: false,
                type: Sequelize.DATE,
                defaultValue: Sequelize.NOW,
            },
            updatedAt: {
                field: 'updated_at',
                allowNull: true,
                type: Sequelize.DATE,
            },
            deletedAt: {
                field: 'deleted_at',
                allowNull: true,
                type: Sequelize.DATE,
            },
        });
    },

    async down(queryInterface) {
        await queryInterface.dropTable(USER_TABLE);
        await queryInterface.sequelize.query(
            'DROP TYPE IF EXISTS "enum_users_role";',
        ); // ✅ Eliminar ENUM manualmente
    },
};
