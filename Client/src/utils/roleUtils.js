export const roleMap = {
    admin: 'Administrador',
    staff: 'Personal Administrativo',
    doctor: 'Doctor',
    patient: 'Paciente'
};

export const getDisplayRole = (role) => roleMap[role] || role;
