const { faker } = require('@faker-js/faker');

const generateOneSpeciality = (overrides = {}) => ({
    id: faker.number.int({ min: 1, max: 1000}),
    name: faker.commerce.department(),
    createdAt: faker.date.past(),
    updatedAt: faker.date.recent(),
    deletedAt: null,
    ...overrides
});

const generateManySpecialities = (size = 10) => Array.from({length: size}, () => generateOneSpeciality());

module.exports = { generateOneSpeciality, generateManySpecialities };