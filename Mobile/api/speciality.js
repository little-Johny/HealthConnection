import api from './axios';

export const createSpeciality = (data) => api.post('/speciality', data);
export const getSpecialities = (query) => api.get('/speciality', { params: query });
export const getSpecialityById = (id) => api.get(`/speciality/${id}`);
export const partiallyUpdateSpeciality = (id, changes) => api.patch(`/speciality/${id}`, changes);
export const deleteSpeciality = (id) => api.delete(`/speciality/${id}`);

