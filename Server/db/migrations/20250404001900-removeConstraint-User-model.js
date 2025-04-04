'use strict';

const { DataTypes } = require('sequelize');
const { USER_TABLE } = require('../models/user.model');

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface) {
    // Eliminar la constraint UNIQUE si tiene nombre personalizado
    await queryInterface.removeConstraint(USER_TABLE, 'user_number_document_key');

    // (Opcional) asegurarte de que la columna se mantiene como quieres
    await queryInterface.changeColumn(USER_TABLE, 'number_document', {
      allowNull: false,
      type: DataTypes.STRING,
    });
  },

  async down (queryInterface) {
    // Restaurar la constraint UNIQUE
    await queryInterface.addConstraint(USER_TABLE, {
      fields: ['number_document'],
      type: 'unique',
      name: 'user_number_document_key',
    });
  }
};
