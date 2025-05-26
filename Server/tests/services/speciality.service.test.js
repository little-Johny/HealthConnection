jest.mock('./../../libs/sequelize');
const { models, Op } = require('./../../libs/sequelize');


const { generateOneSpeciality, generateManySpecialities } = require('./../fakes/specialities.fake');
const SpecialityService = require('./../../services/speciality.service');

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
    });
});
