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
    };
    
    async find(query) {
        const options = {
            where: {},
            include: [],
            limit: parseInt(query.limit)  || 10,
            offset: parseInt(query.offset) || 0,
        };
        
        const { patient, doctor, speciality, ...filters } = query;
        const filterableFields = ['date','startTime','endTime','status', 'patientId', 'doctorId'];
        let filterMessages = [];
    
        // 1) filtro por nombre de paciente
        if (patient) {
            const foundPatient = await models.Patient.findOne({
                include: [{
                model: models.User,
                as: 'user',
                where: { name: patient }
                }]
            });
            if (foundPatient) {
                options.where.patientId = foundPatient.id;
                filterMessages.push(`del paciente ${patient}`);
            }
        }
    
        // 2) filtro por nombre de doctor
        if (doctor) {
            const foundDoctor = await models.Doctor.findOne({
                include: [{
                model: models.User,
                as: 'user',
                where: { name: doctor }
                }]
            });
            if (foundDoctor) {
                options.where.doctorId = foundDoctor.id;
                filterMessages.push(`del doctor ${doctor}`);
            }
        }
    
        // 3) filtro por especialidad
        if (speciality) {
            const foundSpec = await models.Speciality.findOne({ where: { name: speciality } });
            if (foundSpec) {
                options.where.specialityId = foundSpec.id;
                filterMessages.push(`de la especialidad ${speciality}`);
            }
        }
    
        // 4) resto de filtros directos sobre Appointment
        for (const field of filterableFields) {
            if (filters[field]) {
                options.where[field] = filters[field];
                filterMessages.push(`${field}: ${filters[field]}`);
            }
        }
    
        // 5) siempre incluyo paciente y doctor con su nombre
        options.include.push(
            {
                model: models.Patient,
                as: 'patient',
                include: [{ model: models.User, as: 'user', attributes: ['name','lastName'] }]
            },
            {
                model: models.Doctor,
                as: 'doctor',
                include: [{ model: models.User, as: 'user', attributes: ['name','lastName'] }]
            }
        );
    
        // 6) obtengo filas y conteo total para paginación
        const [appointments, total] = await Promise.all([
            models.Appointment.findAll(options),
            models.Appointment.count({ where: options.where })
        ]);
    
        if (appointments.length === 0) {
            throw boom.notFound(`No se encontró ninguna cita ${filterMessages.join(', ')}`);
        }
        
        return {
            appointments,
            meta: {
                total,
                limit: options.limit,
                offset: options.offset,
                pages: Math.ceil(total / options.limit)
            }
        };
    }
    

    

    async findOne(id) {
        const appointment = await models.Appointment.findByPk(id, {
            include: [
                {
                    model: models.Patient,
                    as: 'patient',
                    include: [{ model: models.User, as: 'user', attributes: ['name','lastName'] }]
                },
                {
                    model: models.Doctor,
                    as: 'doctor',
                    include: [{ model: models.User, as: 'user', attributes: ['name','lastName'] }]
                }
            ]
        });
        if (!appointment) {
            throw boom.notFound(`No se encontro ninguna cita con ID ${id}`);
        };
        return appointment;
    };

    async update(id, changes) {
        const transaction = await sequelize.transaction();
        try {
            const appointment = await this.findOne(id);
    
            if (appointment.status !== 'pending') {
                throw boom.badRequest('Solo se pueden actualizar citas con estado pendiente.');
            }
    
            const updatedFields = {};
    
            // Detectar si se cambió horario o doctor
            const isTimeChanged =
                changes.date || changes.startTime || changes.endTime || changes.doctorId;
    
            if (isTimeChanged) {
                // Buscar el bloqueo asociado
                const block = await models.DoctorScheduleBlock.findOne({
                    where: {
                        doctorId: appointment.doctorId,
                        date: appointment.date,
                        startTime: appointment.startTime,
                        endTime: appointment.endTime,
                        reason: 'appointment',
                    },
                    transaction,
                });
        
                // Si hay un bloqueo, eliminarlo
                if (block) {
                    await scheduleService.unblockSchedule(block.id, transaction);
                }

                const newDate = changes.date || appointment.date;
                const newStartTime = changes.startTime || appointment.startTime;
                const newEndTime = changes.endTime || appointment.endTime;
                const newDoctorId = changes.doctorId || appointment.doctorId;
    
                const blockData = {
                    date: newDate,
                    startTime: newStartTime,
                    endTime: newEndTime,
                    reason: 'appointment',
                    confirm: changes.confirm || false, // en caso de que se confirme bloqueo
                };
    
                const blockResponse = await scheduleService.blockSchedule(
                    newDoctorId,
                    blockData,
                    { transaction }
                );
    
                if (blockResponse.requireConfirmation) {
                    await transaction.rollback();
                    return blockResponse;
                }
    
                updatedFields.date = newDate;
                updatedFields.startTime = newStartTime;
                updatedFields.endTime = newEndTime;
                updatedFields.doctorId = newDoctorId;
            }
    
            if (changes.specialityId && changes.specialityId !== appointment.specialityId) {
                const speciality = await specialityService.findOne(changes.specialityId);
                updatedFields.specialityId = speciality.id;
            }
    
            if (changes.patientId && changes.patientId !== appointment.patientId) {
                const patient = await patientService.findOne(changes.patientId);
                updatedFields.patientId = patient.id;
            }
    
            if (changes.status && changes.status !== appointment.status) {
                updatedFields.status = changes.status;
            }
    
            // Si se cambió el doctor, actualizamos la tarifa
            if (updatedFields.doctorId) {
                const doctor = await doctorService.findOne(updatedFields.doctorId);
                updatedFields.price = doctor.consultationFee;
            }
    
            const updatedAppointment = await appointment.update(updatedFields, { transaction });
            await transaction.commit();
            return updatedAppointment;
    
        } catch (error) {
            await transaction.rollback();
            throw error;
        }
    };
    

    async delete(id) {
        const transaction = await sequelize.transaction();
        try {
            const appointment = await this.findOne(id);
    
            if (appointment.status === 'canceled' || appointment.status === 'completed') {
                throw boom.badRequest(`Esta cita no se puede eliminar porque ya fue cancelada o completada`);
            }
    
            // Eliminar la cita
            await appointment.destroy({ transaction });
    
            // Buscar el bloqueo asociado
            const block = await models.DoctorScheduleBlock.findOne({
                where: {
                    doctorId: appointment.doctorId,
                    date: appointment.date,
                    startTime: appointment.startTime,
                    endTime: appointment.endTime,
                    reason: 'appointment',
                },
                transaction,
            });
    
            // Si hay un bloqueo, eliminarlo
            if (block) {
                await scheduleService.unblockSchedule(block.id, transaction);
            }
    
            await transaction.commit();
            return appointment;
        } catch (error) {
            await transaction.rollback();
            throw error;
        }
    };
    

    async changeState(id, status) {
        const transaction = await sequelize.transaction();
        try {
            const appointment = await this.findOne(id);
    
            const updatedAppointment = await appointment.update({ status }, { transaction });
    
            if (status === 'canceled') {
                const block = await models.DoctorScheduleBlock.findOne({
                    where: {
                        doctorId: appointment.doctorId,
                        date: appointment.date,
                        startTime: appointment.startTime,
                        endTime: appointment.endTime,
                        reason: 'appointment',
                    },
                    transaction,
                });
    
                if (block) {
                    await scheduleService.unblockSchedule(block.id, { transaction });
                }
            }
    
            await transaction.commit();
            return updatedAppointment;
        } catch (error) {
            await transaction.rollback();
            throw error;
        }
    }
    

};

module.exports = AppointmentService