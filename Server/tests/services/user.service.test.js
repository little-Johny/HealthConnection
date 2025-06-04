jest.mock('./../../libs/sequelize');
jest.mock('bcryptjs', () => ({
    hash: jest.fn().mockResolvedValue('hashed_password'),
}));
const bcrypt = require('bcryptjs');
const { models, Op, sequelize } = require('../../libs/sequelize');
const { generateOneUser, generateManyUsers } = require('../fakes/users.fake');
const UserService = require('../../services/user.service');

describe('Testing UserService methods', () => {
    let service;

    beforeAll(() => {
        service = new UserService();
    });

    beforeEach(() => {
        jest.clearAllMocks();
    });

    describe('Test Create method', () => {
        test('should create a new user when numberDocument and role are unique', async () => {
            // Arrange
            const fakeUser = generateOneUser();
            const hashedPassword = 'hashed_password';
            const fakeCreatedUser = {
                ...fakeUser,
                id: 1,
                password: hashedPassword,
                dataValues: { ...fakeUser },
            };

            models.User.findOne.mockResolvedValue(null);
            models.User.create.mockResolvedValue(fakeCreatedUser);

            // Act
            const result = await service.create(fakeUser);

            // Assert
            expect(models.User.findOne).toHaveBeenCalledWith({
                where: {
                    numberDocument: fakeUser.numberDocument,
                    role: fakeUser.role,
                },
            });

            expect(models.User.create).toHaveBeenCalledWith(expect.objectContaining({
                username: fakeUser.username,
                password: expect.any(String),
            }));

            expect(result).toEqual(expect.objectContaining({
                id: expect.any(Number),
                username: fakeUser.username,
            }));
        });

        test('should hash password before create user', async () => {
            // Arrange
            const fakerUser = generateOneUser();
            const data = { ...fakerUser, id: 1, dataValues: { ...fakerUser } };

            models.User.findOne.mockResolvedValue(null);
            models.User.create.mockResolvedValue(data);

            // Act
            await service.create(fakerUser);

            // Assert
            expect(bcrypt.hash).toHaveBeenCalledWith(fakerUser.password, 10);
            expect(models.User.create).toHaveBeenCalledWith(expect.objectContaining({
                password: 'hashed_password',
            }));
        });

        test('should remove password from dataValues in returned user', async () => {
            // Arrange
            const fakeUser = generateOneUser();
            const fakeCreatedUser = {
                ...fakeUser,
                id: 3,
                dataValues: { ...fakeUser },
            };

            models.User.findOne.mockResolvedValue(null);
            models.User.create.mockResolvedValue(fakeCreatedUser);

            // Act
            const result = await service.create(fakeUser);

            // Assert
            expect(result.dataValues?.password).toBeUndefined();
        });

        test('should throw conflict error if user already exists with same numberDocument and role', async () => {
            const fakeUser = generateOneUser();
            models.User.findOne.mockResolvedValue(fakeUser);

            await expect(service.create(fakeUser)).rejects.toThrow(`Ya existe un usuario con el documento ${fakeUser.numberDocument} y el rol ${fakeUser.role}.`);
        });

        test('should throw conflict error if username is already taken (unique constraint)', async () => {
            const fakeUser = generateOneUser();
            models.User.findOne.mockResolvedValue(null);

            const error = new Error();
            error.name = 'SequelizeUniqueConstraintError';
            models.User.create.mockRejectedValue(error);

            await expect(service.create(fakeUser)).rejects.toThrow(`El username ${fakeUser.username} ya existe, intenta con otro`);
        });

        test('should call rollback if an unexpected error occurs before commit', async () => {
            // Arrange
            const fakerUser = generateOneUser();
            models.User.findOne.mockResolvedValue(null);
            const unexpectedError = new Error('Unexpected failure');
            unexpectedError.name = 'SomeError';
            models.User.create.mockRejectedValue(unexpectedError);
            // Act & Assert
            await expect(service.create(fakerUser)).rejects.toThrow('Unexpected failure');
            expect(sequelize.transaction).toHaveBeenCalled();
            expect(sequelize.transaction.mock.results[0].value).resolves.toHaveProperty('rollback');
        });

        test('should rethrow unknown errors from create()', async () => {
            // Arrange
            const fakeUser = generateOneUser();
            models.User.findOne.mockResolvedValue(null);

            const customError = new Error('Some random DB error');
            customError.name = 'SomeOtherError';
            models.User.create.mockRejectedValue(customError);
            // Act & Assert
            await expect(service.create(fakeUser)).rejects.toThrow('Some random DB error');
        });

        test('should call sequelize.transaction()', async () => {
            // Arrange
            const fakeUser = generateOneUser();
            const fakeCreatedUser = { ...fakeUser, id: 4, dataValues: { ...fakeUser } };
            models.User.findOne.mockResolvedValue(null);
            models.User.create.mockResolvedValue(fakeCreatedUser);
            // Act
            await service.create(fakeUser);
            // Assert
            expect(sequelize.transaction).toHaveBeenCalled();
        });

        test('should commit transaction when user is created successfully', async () => {
            // Arrange
            const fakeUser = generateOneUser();
            const fakeCreatedUser = { ...fakeUser, id: 5, dataValues: { ...fakeUser } };
            models.User.findOne.mockResolvedValue(null);
            models.User.create.mockResolvedValue(fakeCreatedUser);
            // Act
            await service.create(fakeUser);
            const transaction = await sequelize.transaction.mock.results[0].value;
            // Assert
            expect(transaction.commit).toHaveBeenCalled();
        });

        test('should not call User.create if user already exists', async () => {
            // Arrange
            const fakeUser = generateOneUser();
            models.User.findOne.mockResolvedValue(fakeUser);
            // Act & Assert
            await expect(service.create(fakeUser)).rejects.toThrow();
            expect(models.User.create).not.toHaveBeenCalled();
        });
    });

    describe('Test Find method', () => {
    });

    describe('Test FindOne method', () => {
    });
});
