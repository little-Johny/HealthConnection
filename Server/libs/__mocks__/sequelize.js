const { Op, Sequelize } = require('sequelize');

const mockModels = {
    Speciality: {
        findAll: jest.fn(),
        findByPk: jest.fn(),
        findOne: jest.fn(),
        create: jest.fn(),
        update: jest.fn(),
        destroy: jest.fn(),
    },
    User: {
        findAll: jest.fn(),
        findByPk: jest.fn(),
        findAndCountAll: jest.fn(),
        findOne: jest.fn(),
        getAttributes: jest.fn().mockReturnValue([]),
        create: jest.fn(),
        update: jest.fn(),
        destroy: jest.fn(),
        restore: jest.fn(),
    },
    Doctor: {
        update: jest.fn(),
    },
    Patient: {
        update: jest.fn(),
    },
};

// Mock de transaction (usado en UserService.create y UserService.update)
const mockTransaction = {
    commit: jest.fn(),
    rollback: jest.fn(),
};

const mockSequelize = {
    transaction: jest.fn(() => Promise.resolve(mockTransaction)),
};

// Exportar el mock
module.exports = {
    models: mockModels,
    sequelize: mockSequelize,
    Op,
    Sequelize,
};
