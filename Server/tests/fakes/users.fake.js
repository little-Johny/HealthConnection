const { faker } = require('@faker-js/faker');

const generateOneUser = (overrides = {}) => ({
    id: faker.number.int({ min: 1, max: 1000 }),
    username: faker.internet.username(),
    password: faker.internet.password(12), // ya tiene longitud minima de 8
    name: faker.person.firstName(),
    lastName: faker.person.lastName(),
    photo: faker.image.avatar(),
    typeDocument: faker.helpers.arrayElement(['CC', 'TI', 'CE']),
    numberDocument: faker.string.numeric(10),
    gender: faker.person.gender(),
    email: faker.internet.email(),
    phone: faker.phone.number(),
    role: faker.helpers.arrayElement(['admin', 'staff', 'doctor', 'patient']),
    recoveryToker: null,
    createdAt: faker.date.past(),
    updatedAt: faker.date.recent(),
    deletedAt: null,
    ...overrides,
});

const generateManyUsers = (size = 10) => Array.from({ length: size }, () => generateOneUser());

module.exports = { generateOneUser, generateManyUsers };
