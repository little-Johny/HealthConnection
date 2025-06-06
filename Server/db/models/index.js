const { User, UserSchema } = require('./user.model');
const { Patient, PatientSchema } = require('./patient.model');
const { Doctor, DoctorSchema } = require('./doctor.model');
const {
    DoctorSchedule,
    DoctorScheduleSchema,
} = require('./doctorSchedule.model');
const {
    DoctorScheduleBlockSchema,
    DoctorScheduleBlock,
} = require('./doctorScheduleBlock.model');
const {
    ClinicalHistory,
    ClinicalHistorySchema,
} = require('./clinicalHistory.model');
const { Speciality, SpecialitySchema } = require('./speciality.model');
const { Observation, ObservationSchema } = require('./observation.model');
const { Post, PostSchema } = require('./post.model');
const { Appointment, AppointmentSchema } = require('./appointment.model');
const { RecoveryLog, RecoveryLogSchema } = require('./recoveryLogs.model');

function setUpModels(sequelize) {
    // Iniciacion de modelos
    User.init(UserSchema, User.config(sequelize));
    Patient.init(PatientSchema, Patient.config(sequelize));
    Doctor.init(DoctorSchema, Doctor.config(sequelize));
    DoctorSchedule.init(DoctorScheduleSchema, DoctorSchedule.config(sequelize));
    DoctorScheduleBlock.init(
        DoctorScheduleBlockSchema,
        DoctorScheduleBlock.config(sequelize),
    );
    ClinicalHistory.init(
        ClinicalHistorySchema,
        ClinicalHistory.config(sequelize),
    );
    Appointment.init(AppointmentSchema, Appointment.config(sequelize));
    Speciality.init(SpecialitySchema, Speciality.config(sequelize));
    Observation.init(ObservationSchema, Observation.config(sequelize));
    Post.init(PostSchema, Post.config(sequelize));
    RecoveryLog.init(RecoveryLogSchema, RecoveryLog.config(sequelize));

    // Asociaciones de modelos
    User.associate(sequelize.models);
    Patient.associate(sequelize.models);
    Doctor.associate(sequelize.models);
    DoctorSchedule.associate(sequelize.models);
    DoctorScheduleBlock.associate(sequelize.models);
    ClinicalHistory.associate(sequelize.models);
    Appointment.associate(sequelize.models);
    Speciality.associate(sequelize.models);
    Observation.associate(sequelize.models);
    Post.associate(sequelize.models);
    RecoveryLog.associate(sequelize.models);

    return {
        User: sequelize.models.User,
        Patient: sequelize.models.Patient,
        Doctor: sequelize.models.Doctor,
        DoctorSchedule: sequelize.models.DoctorSchedule,
        DoctorScheduleBlock: sequelize.models.DoctorScheduleBlock,
        ClinicalHistory: sequelize.models.ClinicalHistory,
        Appointment: sequelize.models.Appointment,
        Speciality: sequelize.models.Speciality,
        Observation: sequelize.models.Observation,
        Post: sequelize.models.Post,
        RecoveryLog: sequelize.models.RecoveryLog,
    };
}

module.exports = setUpModels;
