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
        test('should return users without any filters', async () => {
            // Arrange
            const users = generateManyUsers(2);
            models.User.findAndCountAll.mockResolvedValue({ rows: users, count: users.length });
            // Act
            const result = await service.find({});
            // Assert
            expect(models.User.findAndCountAll).toHaveBeenCalledWith(expect.objectContaining({
                where: {},
                include: expect.any(Array),
                attributes: { exclude: ['password'] },
            }));

            expect(result.data).toEqual(users);
            expect(result.meta.totalCount).toBe(users.length);
        });

        test('should apply limit and offset for pagination', async () => {
            // Arrage
            const users = generateManyUsers(3);
            models.User.findAndCountAll.mockResolvedValue({ rows: users, count: 10 });
            // Act
            const result = await service.find({ limit: 3, offset: 6 });
            // Assert
            expect(models.User.findAndCountAll).toHaveBeenCalledWith(expect.objectContaining({
                limit: 3,
                offset: 6,
            }));

            expect(result.meta.currentPage).toBe(3);
        });

        test('should filter users by email and role', async () => {
            // Arrange
            const user = generateOneUser({ email: 'test@example.com', role: 'doctor' });
            models.User.findAndCountAll.mockResolvedValue({ rows: [user], count: 1 });
            // Act
            const result = await service.find({ email: 'test@example.com', role: 'doctor' });
            // Assert
            expect(models.User.findAndCountAll).toHaveBeenCalledWith(expect.objectContaining({
                where: expect.objectContaining({
                    email: 'test@example.com',
                    role: 'doctor',
                }),
            }));

            expect(result.data).toHaveLength(1);
        });

        test('should perform flexible search across fields', async () => {
            // Arrange
            const user = generateOneUser({ name: 'Pedro' });
            models.User.findAndCountAll.mockResolvedValue({ rows: [user], count: 1 });
            // Act
            const result = await service.find({ search: 'Pedro' });
            // Assert
            expect(models.User.findAndCountAll).toHaveBeenCalledWith(expect.objectContaining({
                where: expect.objectContaining({
                    [Op.or]: expect.any(Array),
                }),
            }));

            expect(result.data[0].name).toBe('Pedro');
        });

        test('should filter doctors by valid speciality', async () => {
            // Arrange
            const user = generateOneUser({ role: 'doctor' });
            models.Speciality.findOne.mockResolvedValue({ id: 1 });
            models.User.findAndCountAll.mockResolvedValue({ rows: [user], count: 1 });
            // Act
            const result = await service.find({ speciality: 'Cardiología' });
            // Assert
            expect(models.Speciality.findOne).toHaveBeenCalledWith({
                where: { name: 'Cardiología' },
            });

            expect(result.data[0].role).toBe('doctor');
        });

        test('should throw notFound error if speciality does not exist', async () => {
            // Arrange
            models.Speciality.findOne.mockResolvedValue(null);
            // Act & Assert
            await expect(service.find({ speciality: 'Falsa' })).rejects.toThrow('No se encontró la especialidad: Falsa');
        });

        test('should filter users by patient data (city)', async () => {
            // Arrange
            const user = generateOneUser();
            models.User.findAndCountAll.mockResolvedValue({ rows: [user], count: 1 });
            // Act
            const result = await service.find({ city: 'Medellín' });
            // Assert
            expect(result.data).toHaveLength(1);
        });

        test('should filter users by doctor data (licenseNumber)', async () => {
            // Arrange
            const user = generateOneUser({ role: 'doctor' });
            models.Speciality.findOne.mockResolvedValue(null);
            models.User.findAndCountAll.mockResolvedValue({ rows: [user], count: 1 });
            // Act
            const result = await service.find({ licenseNumber: '12345' });
            // Assert
            expect(result.data[0].role).toBe('doctor');
        });

        test('should filter users by creation date range', async () => {
            // Arrange
            const user = generateOneUser();
            models.User.findAndCountAll.mockResolvedValue({ rows: [user], count: 1 });
            // Arrange
            const result = await service.find({ startDate: '2024-01-01', endDate: '2025-01-01' });
            // Assert
            expect(models.User.findAndCountAll).toHaveBeenCalledWith(expect.objectContaining({
                where: expect.objectContaining({
                    createdAt: {
                        [Op.between]: [new Date('2024-01-01'), new Date('2025-01-01')],
                    },
                }),
            }));

            expect(result.data).toHaveLength(1);
        });

        test('should throw notFound error if no users match filters', async () => {
            // Arrange
            models.User.findAndCountAll.mockResolvedValue({ rows: [], count: 0 });
            // Act & Assert
            await expect(service.find({ search: 'no-existe' })).rejects.toThrow(/No se encuentra ningún usuario/);
        });
    });

    describe('Test FindOne method', () => {
        test('should return user when found by id', async () => {
            // Arrange
            const fakeUser = generateOneUser();
            models.User.findByPk.mockResolvedValue(fakeUser);
            // Act
            const result = await service.findOne(fakeUser.id);
            // Assert
            expect(models.User.findByPk).toHaveBeenCalledWith(fakeUser.id, expect.objectContaining({
                attributes: { exclude: ['password'] },
                include: expect.any(Array),
            }));

            expect(result).toEqual(fakeUser);
        });

        test('should throw notFound error when user is not found by id', async () => {
            // Arrange
            models.User.findByPk.mockResolvedValue(null);
            // Act & Assert
            await expect(service.findOne(999)).rejects.toThrow('No se encuentra usuario con ID 999');
        });
    });

    describe('Test FindByUsername method', () => {
        test('should return user by username', async () => {
            // Arrange
            const fakeUser = generateOneUser();
            models.User.findOne.mockResolvedValue(fakeUser);
            // Act
            const result = await service.findByUsername(fakeUser.username);
            // Assert
            expect(models.User.findOne).toHaveBeenCalledWith({
                where: { username: fakeUser.username },
                include: expect.any(Array),
            });

            expect(result).toEqual(fakeUser);
        });

        test('should throw notFound error if username is not found', async () => {
            // Arrange
            models.User.findOne.mockResolvedValue(null);
            // Act & Assert
            await expect(service.findByUsername('no_existe')).rejects.toThrow('Usuario no encontrado');
        });
    });

    describe('Test FindAll method', () => {
        test('should return all users including deleted ones', async () => {
            // Arrange
            const users = generateManyUsers(3);
            models.User.findAll.mockResolvedValue(users);
            models.User.getAttributes.mockReturnValue({ id: {}, username: {}, email: {} });
            // Act
            const result = await service.findAll();
            // Assert
            expect(models.User.findAll).toHaveBeenCalledWith({
                attributes: expect.arrayContaining([
                    expect.any(String),
                    [expect.anything(), 'isDeleted'],
                ]),
                paranoid: false,
            });

            expect(result).toEqual(users);
        });

        test('should return empty array when no users exist', async () => {
            // Arrange
            models.User.findAll.mockResolvedValue([]);
            models.User.getAttributes.mockReturnValue({});
            // Act
            const result = await service.findAll();
            // Assert
            expect(result).toEqual([]);
        });
    });

    describe('Test Update method', () => {
        test('should update a user successfully when data is valid', async () => {
            // Arrange
            const fakeUser = generateOneUser();
            const updatedUser = { ...fakeUser, name: 'NuevoNombre' };

            const mockInstance = {
                ...fakeUser,
                update: jest.fn().mockResolvedValue(updatedUser),
            };

            jest.spyOn(service, 'findOne').mockResolvedValue(mockInstance);
            models.User.findOne.mockResolvedValue(null); // no hay conflicto con username

            // Act
            const result = await service.update(fakeUser.id, { name: 'NuevoNombre' });

            // Assert
            expect(service.findOne).toHaveBeenCalledWith(fakeUser.id);
            expect(models.User.findOne).not.toHaveBeenCalledWith({ where: { username: fakeUser.username } });
            expect(mockInstance.update).toHaveBeenCalledWith(
                { name: 'NuevoNombre' },
                expect.objectContaining({ transaction: expect.any(Object) }),
            );
            expect(result.name).toBe('NuevoNombre');
        });

        test('should throw conflict error if new username is already taken', async () => {
            // Arrange
            const fakeUser = generateOneUser();
            const changes = { username: 'usuarioExistente' };

            const mockInstance = {
                ...fakeUser,
                update: jest.fn(),
            };

            jest.spyOn(service, 'findOne').mockResolvedValue(mockInstance);
            models.User.findOne.mockResolvedValue({ id: 999 }); // otro usuario con el mismo username

            // Act & Assert
            await expect(service.update(fakeUser.id, changes)).rejects.toThrow(/ya está en uso/);
            expect(models.User.findOne).toHaveBeenCalledWith({ where: { username: changes.username } });
        });

        test('should update patient relationship if user has role patient', async () => {
            // Arrange
            const fakeUser = generateOneUser({ role: 'patient' });
            const changes = { address: 'Nueva dirección' };

            const mockInstance = {
                ...fakeUser,
                patient: {
                    update: jest.fn().mockResolvedValue(true),
                },
                update: jest.fn().mockResolvedValue({ ...fakeUser, ...changes }),
            };

            jest.spyOn(service, 'findOne').mockResolvedValue(mockInstance);
            models.User.findOne.mockResolvedValue(null); // username disponible

            // Act
            const result = await service.update(fakeUser.id, changes);

            // Assert
            expect(mockInstance.patient.update).toHaveBeenCalledWith(changes, expect.any(Object));
            expect(mockInstance.update).toHaveBeenCalled();
            expect(result.address).toBe('Nueva dirección');
        });

        test('should update doctor relationship if user has role doctor', async () => {
            // Arrange
            const fakeUser = generateOneUser({ role: 'doctor' });
            const changes = { licenseNumber: 'ABC123' };

            const mockInstance = {
                ...fakeUser,
                doctor: {
                    update: jest.fn().mockResolvedValue(true),
                },
                update: jest.fn().mockResolvedValue({ ...fakeUser, ...changes }),
            };

            jest.spyOn(service, 'findOne').mockResolvedValue(mockInstance);
            models.User.findOne.mockResolvedValue(null); // username disponible

            // Act
            const result = await service.update(fakeUser.id, changes);

            // Assert
            expect(mockInstance.doctor.update).toHaveBeenCalledWith(changes, expect.any(Object));
            expect(mockInstance.update).toHaveBeenCalled();
            expect(result.licenseNumber).toBe('ABC123');
        });

        test('should remove old photo if a new one is uploaded', async () => {
            // Arrange
            const fakeUser = generateOneUser({ photo: 'http://old-photo.com/pic.jpg' });
            const changes = { photo: 'http://new-photo.com/pic.jpg' };

            const mockInstance = {
                ...fakeUser,
                update: jest.fn().mockResolvedValue({ ...fakeUser, ...changes }),
            };

            jest.spyOn(service, 'findOne').mockResolvedValue(mockInstance);
            jest.spyOn(service, 'unlinkUserPhoto').mockImplementation(jest.fn());
            models.User.findOne.mockResolvedValue(null);

            // Act
            const result = await service.update(fakeUser.id, changes);

            // Assert
            expect(service.unlinkUserPhoto).toHaveBeenCalledWith(fakeUser.photo);
            expect(result.photo).toBe(changes.photo);
        });

        test('should not update restricted fields like id or password', async () => {
            // Arrange
            const fakeUser = generateOneUser();
            const changes = {
                id: 999,
                password: 'nuevaClave',
                name: 'NuevoNombre',
                doctorId: 5,
            };

            const expectedChanges = { name: 'NuevoNombre' }; // solo este campo debe pasar

            const mockInstance = {
                ...fakeUser,
                update: jest.fn().mockResolvedValue({ ...fakeUser, ...expectedChanges }),
            };

            jest.spyOn(service, 'findOne').mockResolvedValue(mockInstance);
            models.User.findOne.mockResolvedValue(null);

            // Act
            const result = await service.update(fakeUser.id, changes);

            // Assert
            expect(mockInstance.update).toHaveBeenCalledWith(
                expect.any(Object),
                expect.objectContaining({
                    fields: ['name'],
                    transaction: expect.any(Object),
                }),
            );

            expect(result.name).toBe('NuevoNombre');
        });

        test('should rollback transaction if an error occurs during update', async () => {
            // Arrange
            const fakeUser = generateOneUser();
            const changes = { name: 'NuevoNombre' };

            const error = new Error('falló update');
            const mockInstance = {
                ...fakeUser,
                update: jest.fn().mockRejectedValue(error),
            };

            jest.spyOn(service, 'findOne').mockResolvedValue(mockInstance);
            models.User.findOne.mockResolvedValue(null);

            // Act & Assert
            await expect(service.update(fakeUser.id, changes)).rejects.toThrow('falló update');
            const transaction = await sequelize.transaction.mock.results[0].value;
            expect(transaction.rollback).toHaveBeenCalled();
        });

        test('should throw notFound error if user does not exist', async () => {
            // Arrange
            jest.spyOn(service, 'findOne').mockRejectedValue(new Error('Usuario no encontrado'));

            const changes = { name: 'NuevoNombre' };

            // Act & Assert
            await expect(service.update(9999, changes)).rejects.toThrow('Usuario no encontrado');
        });
    });

    describe('Test Delete method', () => {
        test('should soft-delete a user when found', async () => {
            // Arrange
            const fakeUser = generateOneUser();
            const mockInstance = {
                ...fakeUser,
                destroy: jest.fn().mockResolvedValue(fakeUser),
            };

            jest.spyOn(service, 'findOne').mockResolvedValue(mockInstance);

            // Act
            const result = await service.delete(fakeUser.id);

            // Assert
            expect(service.findOne).toHaveBeenCalledWith(fakeUser.id);
            expect(mockInstance.destroy).toHaveBeenCalled();
            expect(result).toEqual({ id: fakeUser.id });
        });

        test('should throw error if user to delete is not found', async () => {
            // Arrange
            const error = new Error('Usuario no encontrado');
            jest.spyOn(service, 'findOne').mockRejectedValue(error);

            // Act & Assert
            await expect(service.delete(9999)).rejects.toThrow('Usuario no encontrado');
        });
    });

    describe('Test Restore method', () => {
        test('should restore a soft-deleted user when found', async () => {
            // Arrange
            const fakeUser = generateOneUser();
            const mockInstance = {
                ...fakeUser,
                restore: jest.fn().mockResolvedValue(true),
            };

            models.User.findOne.mockResolvedValue(mockInstance);

            // Act
            const result = await service.restore(fakeUser.id);

            // Assert
            expect(models.User.findOne).toHaveBeenCalledWith({
                where: { id: fakeUser.id },
                paranoid: false,
            });
            expect(mockInstance.restore).toHaveBeenCalled();
            expect(result).toEqual(mockInstance);
        });

        test('should throw error if user to restore is not found', async () => {
            // Arrange
            models.User.findOne.mockResolvedValue(null);

            // Act & Assert
            await expect(service.restore(9999)).rejects.toThrow('Usuario con ID 9999 no encontrado');
        });
    });

    describe('Test ForceDelete method', () => {
        test('should permanently delete a user with photo', async () => {
            // Arrange
            const fakeUser = generateOneUser({ photo: 'http://site.com/photo.jpg' });
            const mockInstance = {
                ...fakeUser,
                destroy: jest.fn().mockResolvedValue(true),
            };

            jest.spyOn(service, 'unlinkUserPhoto').mockImplementation(jest.fn());
            models.User.findOne.mockResolvedValue(mockInstance);

            // Act
            const result = await service.forceDelete(fakeUser.id);

            // Assert
            expect(models.User.findOne).toHaveBeenCalledWith({
                where: { id: fakeUser.id },
                paranoid: false,
            });
            expect(service.unlinkUserPhoto).toHaveBeenCalledWith(fakeUser.photo);
            expect(mockInstance.destroy).toHaveBeenCalledWith({ force: true });
            expect(result).toEqual({
                message: `Usuario con ID ${fakeUser.id} eliminado permanentemente`,
            });
        });

        test('should throw error if user to force delete is not found', async () => {
            // Arrange
            models.User.findOne.mockResolvedValue(null);

            // Act & Assert
            await expect(service.forceDelete(9999)).rejects.toThrow('No se encuentra usuario con ID 9999');
        });

        test('should not call unlinkUserPhoto if user has no photo', async () => {
            // Arrange
            const fakeUser = generateOneUser({ photo: null });
            const mockInstance = {
                ...fakeUser,
                destroy: jest.fn().mockResolvedValue(true),
            };

            jest.spyOn(service, 'unlinkUserPhoto').mockImplementation(jest.fn());
            models.User.findOne.mockResolvedValue(mockInstance);

            // Act
            await service.forceDelete(fakeUser.id);

            // Assert
            expect(service.unlinkUserPhoto).not.toHaveBeenCalled();
            expect(mockInstance.destroy).toHaveBeenCalledWith({ force: true });
        });
    });
});
