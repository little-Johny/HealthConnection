'use strict';

const { USER_TABLE } = require('../models/user.model');
const { DataTypes } = require('sequelize');

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface) {
    await queryInterface.addColumn(USER_TABLE, 'phone', {
      allowNull: true,
      type: DataTypes.STRING,
    });
  },

  async down(queryInterface) {
    await queryInterface.removeColumn(USER_TABLE, 'phone');
  }
};
