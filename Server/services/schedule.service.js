const boom = require('@hapi/boom');
const { models } = require('./../libs/sequelize');
const { DateTime } = require('luxon');
const { Op } = require('sequelize');
const DoctorService = require('./doctor.service');
const sequelize = require('./../libs/sequelize');
const doctorService = new DoctorService();

class ScheduleService {
    //registrar el horario de un dia
    async create(data) {
        const transaction = await sequelize.transaction();
        try {
            await doctorService.findOne(data.doctorId);
            const newDoctorSchedule = await models.DoctorSchedule.create(data);
            transaction.commit();
            return newDoctorSchedule;
        } catch (error) {
            transaction.rollback();
            if (error.name === 'SequelizeUniqueConstraintError') {
                throw boom.conflict(`Ya hay un horario definido para ${data.dayOfWeek}`);
            }
            throw error;
        }
    };

    //encotnrarnun horario por su doctor
    async findByDoctorId(doctorId) {
        const schedule = await models.DoctorSchedule.findAll({
            where: { doctorId },
        });

        if (!schedule || schedule.length === 0) {
            throw boom.notFound(`No existe un horario del doctor con ID ${doctorId}`);
        }

        return schedule;
    };

    //encontrar un orario por su id
    async findOne(id) {
        const schedule = await models.DoctorSchedule.findByPk(id);
        if (!schedule) {
            throw boom.notFound(`No existe este horario`);
        }

        return schedule;
    };

    //actualizar un horario
    async update(id, changes) {
        const schedule = await this.findOne(id);
        const updatedSchedule = await schedule.update(changes);
        return updatedSchedule;
    };

    //eliminar un horario
    async delete(id) {
        const schedule = await this.findOne(id);
        const deletedSchedule = await schedule.destroy();
        return deletedSchedule;
    };

    //bloquear o marcar como ocupado un intervalo de tiempo especifico
    async blockSchedule(doctorId, data, transactionOptions = {}) {
        const nowInBogota = DateTime.now().setZone('America/Bogota');
        const currentDate = nowInBogota.toFormat('yyyy-MM-dd');
        const currentTime = nowInBogota.toFormat('HH:mm:ss');
    
        // Convertir la fecha ingresada a la zona horaria correcta
        const dateInBogota = DateTime.fromISO(data.date, { zone: 'America/Bogota' });
    
        // Obtener el día de la semana
        const dayOfWeek = dateInBogota.toFormat('EEEE');
    
        // Validar que la fecha no sea en el pasado
        if (nowInBogota.startOf('day') > dateInBogota.startOf('day')) {
            throw boom.badRequest(`No es posible hacer un bloqueo para la fecha ${dateInBogota.toFormat('yyyy-MM-dd')}, porque no se puede bloquear un día pasado.`);
        }
    
        // Crear un DateTime completo con la fecha y hora del bloqueo
        const blockDateTime = DateTime.fromFormat(
            `${data.date} ${data.startTime}`, 'yyyy-MM-dd HH:mm:ss', { zone: 'America/Bogota' }
        );
    
        // Validar que el horario no sea en el pasado
        if (blockDateTime < nowInBogota) {
            throw boom.badRequest(`No es posible bloquear en el pasado. La hora ingresada (${data.startTime}) ya pasó.`);
        }
    
        // Convertir startTime a DateTime y restarle 10 minutos
        const startTimeInFormat = DateTime.fromFormat(data.startTime, 'HH:mm:ss', { zone: 'America/Bogota' });
        const tenMinutesBefore = startTimeInFormat.minus({ minutes: 10 });
    
        // Validar que falten al menos 10 minutos para el bloqueo, permitiendo confirmación
        if (dateInBogota.toFormat('yyyy-MM-dd') === currentDate) {
            if (nowInBogota > tenMinutesBefore && !data.confirm) {
                return {
                    message: `Faltan menos de 10 minutos para la hora del bloqueo (${data.startTime}), seguro quieres continuar?`,
                    requireConfirmation: true,
                };
            }
        }
    
        // Verificar si el doctor tiene un horario ese día
        const schedule = await models.DoctorSchedule.findOne({
            where: { doctorId, dayOfWeek },
        });
    
        if (!schedule) {
            throw boom.notFound(`El doctor ${doctorId} no tiene un horario para el día ${dayOfWeek}`);
        }
    
        // Validar que el intervalo está dentro del horario del doctor
        if (data.startTime < schedule.startTime || data.endTime > schedule.endTime) {
            throw boom.badRequest(`El intervalo seleccionado está fuera del horario disponible del doctor`);
        }
    
        // Verificar si ya existe un bloqueo en la misma franja horaria
        const existingBlock = await models.DoctorScheduleBlock.findOne({
            where: {
                doctorId,
                date: data.date,
                [Op.or]: [
                    {
                        startTime: { [Op.lt]: data.endTime },
                        endTime: { [Op.gt]: data.startTime }
                    }
                ]
            }
        });
    
        if (existingBlock) {
            throw boom.conflict(`Ya existe un bloqueo en la franja horaria ${data.startTime} - ${data.endTime}`);
        }
    
        // Crear el bloqueo
        const newBlock = await models.DoctorScheduleBlock.create(
            {
                doctorId,
                date: data.date,
                scheduleId: schedule.id,
                startTime: data.startTime,
                endTime: data.endTime,
                reason: data.reason,
            },
            transactionOptions
        );
    
        return newBlock;
    }
    
    //desbloquear un intervalo especifico de tiempo que haya sido bloqueado
    async unblockSchedule(blockId, transactionOptions = {}) {
        const block = await models.DoctorScheduleBlock.findByPk(blockId);
        if (!block) {
            throw boom.notFound(`El bloqueo de este horario no existe`);
        }

        const deletedBlock = await block.destroy(transactionOptions);
        return deletedBlock;
    };

    //encontrar horarios ocupados o disponibles 
    async findSchedule(state, doctorId, date) {
        const dayOfWeek = DateTime.fromISO(date, { zone: 'America/Bogota' }).toFormat('EEEE');
    
        // Consultar el horario del doctor ese día
        const schedule = await models.DoctorSchedule.findOne({
            where: { doctorId, dayOfWeek },
        });
    
        if (!schedule) {
            throw boom.notFound(`El doctor ${doctorId} no tiene horario para el día ${dayOfWeek}`);
        }
    
        // Buscar bloqueos de ese día
        const blocks = await models.DoctorScheduleBlock.findAll({
            where: { doctorId, date },
        });
    
        if (state === 'occupied') {
            return blocks; // Devolver los horarios bloqueados
        }
    
        // Generar los horarios disponibles
        const availableSlots = [];
        let currentTime = DateTime.fromFormat(schedule.startTime, 'HH:mm:ss', { zone: 'America/Bogota' });
    
        const endTime = DateTime.fromFormat(schedule.endTime, 'HH:mm:ss', { zone: 'America/Bogota' });
    
        while (currentTime < endTime) {
            // Verificar si el horario está bloqueado
            const isBlocked = blocks.some(
                (block) => {
                    const blockStart = DateTime.fromFormat(block.startTime, 'HH:mm:ss', { zone: 'America/Bogota' });
                    const blockEnd = DateTime.fromFormat(block.endTime, 'HH:mm:ss', { zone: 'America/Bogota' });
                    return currentTime >= blockStart && currentTime < blockEnd;
                }
            );
    
            if (!isBlocked) {
                availableSlots.push(currentTime.toFormat('HH:mm'));
            }
    
            // Avanzar una hora
            currentTime = currentTime.plus({ hours: 1 });
        }
    
        return availableSlots;
    }
    
};

module.exports = ScheduleService;