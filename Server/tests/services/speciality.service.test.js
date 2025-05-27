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
        test('should be all specialities', async () => { 
            // Arrange
            const fakeSpecialities = generateManySpecialities();
            models.Speciality.findAll.mockResolvedValue(fakeSpecialities);
            // Act
            const specialities = await service.find({});
            console.log(specialities);
            // Assert
            expect(specialities.length).toEqual(10);
            expect(models.Speciality.findAll).toHaveBeenCalled();
            expect(models.Speciality.findAll).toHaveBeenCalledWith({ where: {}});
            expect(models.Speciality.findAll).toHaveBeenCalledTimes(1);
        });

        test('should get speciality by name', async () => {
            //Arrange
            const specificSpeciality = generateOneSpeciality({ name: 'Cardiology' });
            models.Speciality.findAll.mockResolvedValue([specificSpeciality]);
            //Act
            const specialities = await service.find({ name: 'Cardiology' });
            console.log(specialities);
            //Assert
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

        test('should ignore empty name filter', async () => { 
            //Arrange
            const data = generateManySpecialities();
            models.Speciality.findAll.mockResolvedValue(data);

            //Act
            const  result = await service.find({name: ' '});
            console.log(result);
            
            //Assert
            expect(result).toEqual(data);
        });

        test('should safely handle possible SQL injection in name filter', async () => { 
            //Arrange
            const fakeResult = [];
            const maliciousInput ="'; DROP TABLE users; --";
            models.Speciality.findAll.mockResolvedValue(fakeResult);

            //Act & Assert
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

        test('should filter by createdAt reange', async () => { 
            //Arrange
            const data = generateManySpecialities();
            models.Speciality.findAll.mockResolvedValue(data);

            const startDate = '2023-01-01';
            const endDate = '2023-12-31';

            //Act
            const result = await service.find({ startDate, endDate });
            console.log(result);
            
            //Assert
            expect(result).toEqual(data);
            expect(models.Speciality.findAll).toHaveBeenCalledWith(
                expect.objectContaining({
                    where: expect.objectContaining({
                        createdAt: { [Op.between]: [new Date(startDate), new Date(endDate)] }
                    })
                })
            );
        });

        test('shoul convert numeric name to string safely', async () => {
            //Arrange
            const input = 123;
            const expected = [{ id:1, name:'123' }];
            models.Speciality.findAll.mockResolvedValue(expected);
            //Act
            const result = await service.find({ name: input });
            console.log(result);
            //Assert
            expect(result).toEqual(expected);
            expect(models.Speciality.findAll).toHaveBeenCalledWith(
                expect.objectContaining({
                    where: expect.objectContaining({
                        name: {[Op.iLike]: `%123%`},
                    })
                })
            );
        });

        test('should limit with limit and offset', async () => { 
            //Arrange
                const data = generateManySpecialities(20);
                models.Speciality.findAll.mockResolvedValue(data);
            //Act
                const result = await service.find({ limit : 10, offset : 0 });
            //Assert
            expect(result).toEqual(data);
            expect(models.Speciality.findAll).toHaveBeenCalledWith(
                expect.objectContaining({
                    where: {},
                    limit: 10,
                    offset: 0
                })
            );
        });
    });
});
