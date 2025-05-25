// jest.config.js
module.exports = {
    testEnvironment: 'node',
    roots: ['<rootDir>/Server'],
    testMatch: ['**/__tests__/**/*.js', '**/?(*.)+(spec|test).js'],
    moduleFileExtensions: ['js', 'json'],
    collectCoverage: true,
    collectCoverageFrom: ['Server/**/*.js', '!Server/test/**'],
    coverageDirectory: 'coverage',
};
