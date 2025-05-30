const { DataTypes } = require('sequelize');
const { RECOVERY_LOG_TABLE } = require('../models/recoveryLogs.model');
const { USER_TABLE } = require('../models/user.model');

/** @type {import('sequelize-cli').Migration} */
module.exports = {
    async up(queryInterface) {
        await queryInterface.createTable(RECOVERY_LOG_TABLE, {
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
                onDelete: 'CASCADE',
                onUpdate: 'CASCADE',
            },
            requestedAt: {
                field: 'requested_at',
                allowNull: false,
                type: DataTypes.DATE,
            },
            ipAddress: {
                field: 'ip_address',
                allowNull: true,
                type: DataTypes.STRING,
            },
            userAgent: {
                field: 'user_agent',
                allowNull: true,
                type: DataTypes.STRING,
            },
        });
    },

    async down(queryInterface) {
        await queryInterface.dropTable(RECOVERY_LOG_TABLE);
    },
};
