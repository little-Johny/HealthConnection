const boom = require('@hapi/boom');
const { models } = require('./../libs/sequelize');
const sequelize = require('./../libs/sequelize');
const PatientService = require('./patient.service');
const DoctorService = require('./doctor.service');
const ScheduleService = require('./schedule.service');
const SpecialityService = require('./speciality.service');
const patientService = new PatientService();
const doctorService = new DoctorService();
const scheduleService = new ScheduleService();
const specialityService  = new SpecialityService();

class AppointmentService {
    async create(data) {
        const transaction = await sequelize.transaction();
        try {
    
            const blockData = {
                date: data.date,
                startTime: data.startTime,
                endTime: data.endTime,
                reason: 'appointment',
            };
    
            // Intentar bloquear el horario del doctor
            const blockResponse = await scheduleService.blockSchedule(data.doctorId, blockData, { transaction });
    
            // Si se requiere confirmación, devolver el mensaje y no continuar
            if (blockResponse.requireConfirmation) {
                await transaction.rollback();
                return blockResponse;
            }

            //Hacemos todas lasconsultas en una promesa
            const [doctor, patient, speciality] = await Promise.all([
                doctorService.findOne(data.doctorId),
                patientService.findOne(data.patientId),
                specialityService.findOne(data.specialityId),
            ]);
    
            const appointmentData = {
                patientId: patient.id,
                doctorId: doctor.id, 
                specialityId: speciality.id,
                date: data.date,
                startTime: data.startTime,
                endTime: data.endTime,
                price: doctor.consultationFee,
                status: 'pending',
            };
    
            const newAppointment = await models.Appointment.create(appointmentData, { transaction });
    
            await transaction.commit();
            return newAppointment;
        } catch (error) {
            await transaction.rollback();
            throw error;
        }
    }
    

    async find() {};

    async findOne() {};

    async update() {};

    async delete() {};

    async changeState() {};

};

module.exports = AppointmentService