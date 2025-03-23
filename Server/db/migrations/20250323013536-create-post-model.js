'use strict';

const { Sequelize, DataTypes } = require('sequelize');
const { POST_TABLE } = require('../models/post.model');
const { USER_TABLE } = require('../models/user.model');

/** @type {import('sequelize-cli').Migration} */
module.exports = {
    async up (queryInterface) {
        await queryInterface.createTable(POST_TABLE, {
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
        title: {
            allowNull: false,
            type: DataTypes.STRING,
        },
        content: {
            allowNull: true,
            type: DataTypes.TEXT,
        },
        image: {
            allowNull: true,
            type: DataTypes.STRING,
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

    async down (queryInterface) {
        await queryInterface.dropTable(POST_TABLE);
    }
};
