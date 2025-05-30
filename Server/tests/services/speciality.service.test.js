jest.mock('./../../libs/sequelize');
const { models, Op } = require('../../libs/sequelize');

const { generateOneSpeciality, generateManySpecialities } = require('../fakes/specialities.fake');
const SpecialityService = require('../../services/speciality.service');

describe('Testing for Speciality service', () => {
    let service;

    beforeAll(() => {
        service = new SpecialityService();
    });

    beforeEach(() => {
        jest.clearAllMocks();
    });

    describe('Testing GET specialities', () => {
        describe('Without filters', () => {
            test('should be all specialities', async () => {
                // Arrange
                const fakeSpecialities = generateManySpecialities();
                models.Speciality.findAll.mockResolvedValue(fakeSpecialities);
                // Act
                const specialities = await service.find({});
                // Assert
                expect(specialities.length).toEqual(10);
                expect(models.Speciality.findAll).toHaveBeenCalled();
                expect(models.Speciality.findAll).toHaveBeenCalledWith({ where: {} });
                expect(models.Speciality.findAll).toHaveBeenCalledTimes(1);
            });

            test('should ignore empty name filter', async () => {
                // Arrange
                const data = generateManySpecialities();
                models.Speciality.findAll.mockResolvedValue(data);
                // Act
                const result = await service.find({ name: ' ' });
                // Assert
                expect(result).toEqual(data);
            });
        });

        describe('Filter name', () => {
            test('should get speciality by name', async () => {
                // Arrange
                const specificSpeciality = generateOneSpeciality({ name: 'Cardiology' });
                models.Speciality.findAll.mockResolvedValue([specificSpeciality]);
                // Act
                const specialities = await service.find({ name: 'Cardiology' });
                // Assert
                expect(Array.isArray(specialities)).toBe(true);
                expect(specialities.length).toBeGreaterThan(0);
                expect(specialities.some((s) => s.name === 'Cardiology')).toBe(true);
                expect(models.Speciality.findAll).toHaveBeenCalledWith(
                    expect.objectContaining({
                        where: expect.objectContaining({
                            name: { [Op.iLike]: '%Cardiology%' },
                        }),
                    }),
                );
            });

            test('should safely handle possible SQL injection in name filter', async () => {
                // Arrange
                const fakeResult = [];
                const maliciousInput = "'; DROP TABLE users; --";
                models.Speciality.findAll.mockResolvedValue(fakeResult);
                // Act & Assert
                await expect(service.find({ name: maliciousInput })).rejects.toThrow(
                    /No se encontro ninguna especialidad/,
                );
                expect(models.Speciality.findAll).toHaveBeenCalledWith(
                    expect.objectContaining({
                        where: expect.objectContaining({
                            name: { [Op.iLike]: `%${maliciousInput}%` },
                        }),
                    }),
                );
            });

            test('should convert numeric name to string safely', async () => {
                // Arrange
                const input = 123;
                const expected = [{ id: 1, name: '123' }];
                models.Speciality.findAll.mockResolvedValue(expected);
                // Act
                const result = await service.find({ name: input });
                // Assert
                expect(result).toEqual(expected);
                expect(models.Speciality.findAll).toHaveBeenCalledWith(
                    expect.objectContaining({
                        where: expect.objectContaining({
                            name: { [Op.iLike]: '%123%' },
                        }),
                    }),
                );
            });

            test('should trhow notFound error if not found any speciality', async () => {
                // Arrange
                models.Speciality.findAll.mockResolvedValue([]);
                // Act
                const result = service.find({
                    name: 'pediatría',
                    startDate: '2024-01-01',
                    endDate: '2024-12-31',
                });
                // Assert
                await expect(result).rejects.toThrow('No se encontro ninguna especialidad con el nombre: pediatría, creada entre 2024-01-01 y 2024-12-31');
            });
        });

        describe('Filter date', () => {
            test('should filter by createdAt range', async () => {
                // Arrage
                const data = generateManySpecialities();
                const startDate = '2023-01-01';
                const endDate = '2023-12-31';
                models.Speciality.findAll.mockResolvedValue(data);
                // Act
                const result = await service.find({ startDate, endDate });
                // Assert
                expect(result).toEqual(data);
                expect(models.Speciality.findAll).toHaveBeenCalledWith(
                    expect.objectContaining({
                        where: expect.objectContaining({
                            createdAt: { [Op.between]: [new Date(startDate), new Date(endDate)] },
                        }),
                    }),
                );
            });
        });

        describe('Pagination', () => {
            test('should limit with limit', async () => {
                // Arrange
                const limit = '10';
                const data = generateManySpecialities(20);
                models.Speciality.findAll.mockResolvedValue(data);
                // Act
                const result = await service.find({ limit });
                // Assert
                expect(result).toEqual(data);
                expect(models.Speciality.findAll).toHaveBeenCalledWith(
                    expect.objectContaining({
                        where: {},
                        limit: 10,
                    }),
                );
            });

            test('should get 10 records of 20 result', async () => {
                // Arrange
                const data = generateManySpecialities(20);
                models.Speciality.findAll.mockResolvedValue(data.slice(0, 10));
                // Act
                const result = await service.find({ limit: 10, offset: 0 });
                // Assert
                expect(result.length).toBe(10);
            });

            test('should apply offset if provided', async () => {
                // Arrange
                const offset = '5';
                const data = generateManySpecialities(2);
                models.Speciality.findAll.mockResolvedValue(data);
                // Act
                const result = await service.find({ offset });
                // Assert
                expect(models.Speciality.findAll).toHaveBeenCalledWith(
                    expect.objectContaining({
                        offset: 5,
                    }),
                );
                expect(result).toEqual(data);
            });
        });

        describe('Mix filters', () => {
            test('should can use multiple filters', async () => {
                // Arrange
                const data = [generateOneSpeciality({
                    id: 2,
                    name: 'Cardiologia',
                    createdAt: '2024-06-25T00:00:00.000Z',
                })];
                models.Speciality.findAll.mockResolvedValue(data);
                const startDate = '2024-06-14';
                const endDate = '2024-06-30';
                const name = 'Cardiologia';
                // Act
                const result = await service.find({ name, startDate, endDate });
                // Assert
                expect(result.length).toBe(1);
                expect(result).toEqual(data);
                expect(models.Speciality.findAll).toHaveBeenCalledWith(
                    expect.objectContaining({
                        where: expect.objectContaining({
                            name: { [Op.iLike]: '%Cardiologia%' },
                            createdAt: { [Op.between]: [new Date(startDate), new Date(endDate)] },
                        }),
                    }),
                );
            });
        });

        describe('Get by id', () => {
            test('should return a speciality when found', async () => {
                // Arrange
                const data = generateOneSpeciality({ id: 10, name: 'Cardiologia' });
                const id = 10;
                models.Speciality.findByPk.mockResolvedValue(data);
                // Act
                const result = await service.findOne(id);
                // Assert
                expect(result).toEqual(data);
            });

            test('should throw notFound error when speciality is not found', async () => {
                // Arrange
                const id = 99;
                models.Speciality.findByPk.mockResolvedValue(null);
                // Act
                const result = service.findOne(id);
                // Assert
                await expect(result).rejects.toThrow(`No se encuentra ninguna especialidad con ID ${id}`);
            });
        });
    });

    describe('Testing POST specialities', () => {
        test('should create new speciality successfully', async () => {
            // Arrange
            const input = { name: 'Cardiologia' };
            const expected = { id: 1, name: 'Cardiologia' };
            models.Speciality.create.mockResolvedValue(expected);
            // Act
            const result = await service.create(input);
            // Assert
            expect(result).toEqual(expected);
            expect(models.Speciality.create).toHaveBeenCalledWith(input);
            expect(models.Speciality.create).toHaveBeenCalledTimes(1);
        });

        test('should throw an error if the database fails', async () => {
            // Arrange
            const data = { name: 'Cardiologia' };
            const error = new Error('Database Error');
            models.Speciality.create.mockRejectedValue(error);
            // Act
            const result = service.create(data);
            // Assert
            await expect(result).rejects.toThrow('Database Error');
        });
    });

    describe('Testing PATCH specialities', () => {
        test('should ;', async () => {
            // Arrange
            const id = 20;
            const changes = { name: 'Optometria' };
            const oldSpeciality = {
                id,
                name: 'Cardiologia',
                update: jest.fn(), //  mock del metodo update
            };

            const updatedSpeciality = {
                id,
                name: 'Optometria',
            };

            // simular findOne
            jest.spyOn(service, 'findOne').mockResolvedValue(oldSpeciality);

            // simular la actualizacion
            oldSpeciality.update.mockResolvedValue(updatedSpeciality);

            // Act
            const result = await service.update(id, changes);
            // Assert
            expect(service.findOne).toHaveBeenCalledWith(id);
            expect(oldSpeciality.update).toHaveBeenCalledWith(changes);
            expect(result).toEqual(updatedSpeciality);
        });

        test('should throw notFound error if speciality does not exist', async () => {
            // Arrange
            const id = 99;
            const changes = { name: 'Nueva' };
            jest.spyOn(service, 'findOne').mockRejectedValue(new Error(`No se encuentra ninguna especialidad con ID ${id}`));
            // Act & Assert
            await expect(service.update(id, changes)).rejects.toThrow(`No se encuentra ninguna especialidad con ID ${id}`);
        });

        test('should first', async () => {
            // Arrange
            const id = 1;
            const error = new Error();
            const changes = { name: 'Failed' };
            const speciality = { id, name: 'Cardiologia', update: jest.fn() };
            jest.spyOn(service, 'findOne').mockResolvedValue(speciality);
            speciality.update.mockRejectedValue(error);

            // Act & Assert
            await expect(service.update(id, changes)).rejects.toThrow(error);
        });
    });

    describe('Testing DELETE specialities', () => {
        test('should delete a speciality successfully', async () => {
            // Arrange
            const id = 1;
            const mockSpeciality = { destroy: jest.fn() };
            // Espiamos el método findOne y lo hacemos retornar una entidad falsa
            jest.spyOn(service, 'findOne').mockResolvedValue(mockSpeciality);
            // Act
            const result = await service.delete(id);
            // Assert
            expect(service.findOne).toHaveBeenCalledWith(id);
            expect(mockSpeciality.destroy).toHaveBeenCalled();
            expect(result).toEqual({ id });
        });

        test('should throw if speciality is not found', async () => {
            // Arrange
            const id = 999;
            // Simulamos que findOne lanza un error
            jest.spyOn(service, 'findOne').mockRejectedValue(new Error(`No se encuentra ninguna especialidad con ID ${id}`));
            // Act & Assert
            await expect(service.delete(id)).rejects.toThrow(`No se encuentra ninguna especialidad con ID ${id}`);
        });

        test('should throw if delete operation fails in DB', async () => {
            // Arrange
            const id = 1;
            const mockSpeciality = {
                destroy: jest.fn().mockRejectedValue(new Error('DB error')),
            };
            jest.spyOn(service, 'findOne').mockResolvedValue(mockSpeciality);
            // Act & Assert
            await expect(service.delete(id)).rejects.toThrow('DB error');
        });
    });
});
