import api from './api';

export const createDoctor = () => {
    const doctorData = new FormData();

    for (const key in data) {
        doctorData.append(key, data[key]);
    };

    return api.post('/doctor', doctorData, {
        headers: {
            'Content-Type' : 'multipart/form-data',
        },
    });
};

export const getDoctorById = (id) => api.get(`/doctor/${id}`);