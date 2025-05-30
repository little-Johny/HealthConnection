const { Op } = require('sequelize');

const mockModels = {
    Speciality: {
        findAll: jest.fn(),
        create: jest.fn(),
        findByPk: jest.fn(),
        update: jest.fn(),
        destroy: jest.fn(),
    },
};

module.exports = {
    models: mockModels,
    Op,
};
