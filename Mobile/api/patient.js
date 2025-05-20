import api from './axios';

export const createPatient = (data) => {
    const patientData = new FormData();

    for (const key in data) {
        patientData.append(key, data[key]);
    };

    return api.post('/patient', patientData, {
        headers: {
            'Content-Type' : 'multipart/form-data',
        },
    });
}; 

export const getPatientById = (id) => api.get(`/patient/${id}`);