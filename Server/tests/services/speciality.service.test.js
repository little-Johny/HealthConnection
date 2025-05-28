jest.mock('./../../libs/sequelize');
const { models, Op } = require('./../../libs/sequelize');

const { generateOneSpeciality, generateManySpecialities } = require('./../fakes/specialities.fake');
const SpecialityService = require('./../../services/speciality.service');
const { where } = require('sequelize');

describe('Testing for Speciality service', () => {
    let service;

    beforeAll(() => {
        service = new SpecialityService();
    });

    beforeEach(() => {
        jest.clearAllMocks();
    });

    describe('Testing Get specialities', () => {
        
        describe('Sin filtros', () => {
            test('should be all specialities', async () => {
                const fakeSpecialities = generateManySpecialities();
                models.Speciality.findAll.mockResolvedValue(fakeSpecialities);
                const specialities = await service.find({});
                expect(specialities.length).toEqual(10);
                expect(models.Speciality.findAll).toHaveBeenCalled();
                expect(models.Speciality.findAll).toHaveBeenCalledWith({ where: {} });
                expect(models.Speciality.findAll).toHaveBeenCalledTimes(1);
            });

            test('should ignore empty name filter', async () => {
                const data = generateManySpecialities();
                models.Speciality.findAll.mockResolvedValue(data);
                const result = await service.find({ name: ' ' });
                expect(result).toEqual(data);
            });
        });

        describe('Filtro por nombre', () => {
            test('should get speciality by name', async () => {
                const specificSpeciality = generateOneSpeciality({ name: 'Cardiology' });
                models.Speciality.findAll.mockResolvedValue([specificSpeciality]);
                const specialities = await service.find({ name: 'Cardiology' });
                expect(Array.isArray(specialities)).toBe(true);
                expect(specialities.length).toBeGreaterThan(0);
                expect(specialities.some(s => s.name === 'Cardiology')).toBe(true);
                expect(models.Speciality.findAll).toHaveBeenCalledWith(
                expect.objectContaining({
                    where: expect.objectContaining({
                    name: { [Op.iLike]: '%Cardiology%' }
                    })
                })
                );
            });

            test('should safely handle possible SQL injection in name filter', async () => {
                const fakeResult = [];
                const maliciousInput = "'; DROP TABLE users; --";
                models.Speciality.findAll.mockResolvedValue(fakeResult);
                await expect(service.find({ name: maliciousInput })).rejects.toThrow(
                /No se encontro ninguna especialidad/
                );
                expect(models.Speciality.findAll).toHaveBeenCalledWith(
                expect.objectContaining({
                    where: expect.objectContaining({
                    name: { [Op.iLike]: `%${maliciousInput}%` }
                    })
                })
                );
            });

            test('should convert numeric name to string safely', async () => {
                const input = 123;
                const expected = [{ id: 1, name: '123' }];
                models.Speciality.findAll.mockResolvedValue(expected);
                const result = await service.find({ name: input });
                expect(result).toEqual(expected);
                expect(models.Speciality.findAll).toHaveBeenCalledWith(
                expect.objectContaining({
                    where: expect.objectContaining({
                    name: { [Op.iLike]: `%123%` }
                    })
                })
                );
            });
        });

        describe('Filtro por fecha', () => {
            test('should filter by createdAt range', async () => {
                const data = generateManySpecialities();
                const startDate = '2023-01-01';
                const endDate = '2023-12-31';
                models.Speciality.findAll.mockResolvedValue(data);
                const result = await service.find({ startDate, endDate });
                expect(result).toEqual(data);
                expect(models.Speciality.findAll).toHaveBeenCalledWith(
                expect.objectContaining({
                    where: expect.objectContaining({
                    createdAt: { [Op.between]: [new Date(startDate), new Date(endDate)] }
                    })
                })
                );
            });
        });

        describe('Paginación', () => {
            test('should limit with limit and offset', async () => {
                const data = generateManySpecialities(20);
                models.Speciality.findAll.mockResolvedValue(data);
                const result = await service.find({ limit: 10, offset: 0 });
                expect(result).toEqual(data);
                expect(models.Speciality.findAll).toHaveBeenCalledWith(
                expect.objectContaining({
                    where: {},
                    limit: 10,
                    offset: 0
                })
                );
            });

            test('should get 10 records of 20 result', async () => {
                const data = generateManySpecialities(20);
                models.Speciality.findAll.mockResolvedValue(data.slice(0, 10));
                const result = await service.find({ limit: 10, offset: 0 });
                expect(result.length).toBe(10);
            });
        });

        describe('Filtros combinados', () => {
            test('should can use multiple filters', async () => {
                const data = [generateOneSpeciality({
                    id: 2,
                    name: 'Cardiologia',
                    createdAt: '2024-06-25T00:00:00.000Z'
                })];
                models.Speciality.findAll.mockResolvedValue(data);
                const startDate = '2024-06-14';
                const endDate = '2024-06-30';
                const name = 'Cardiologia';
                const result = await service.find({ name, startDate, endDate });
                expect(result.length).toBe(1);
                expect(result).toEqual(data);
                expect(models.Speciality.findAll).toHaveBeenCalledWith(
                    expect.objectContaining({
                        where: expect.objectContaining({
                            name: { [Op.iLike]: `%Cardiologia%` },
                            createdAt: { [Op.between]: [new Date(startDate), new Date(endDate)] }
                        })
                    })
                );
            });
        });
    });
});

