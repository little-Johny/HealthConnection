import api from './axios';

export const createAppointment = (data) => api.post('/appointment', data);
export const getAppointments = (query) => api.get('/appointment', { params: query });
export const getAppointmentById = (id) => api.get(`/appointment/${id}`);
export const partiallyUpdateAppointment = (id, changes) => api.patch(`/appointment/${id}`, changes);
export const deleteAppointment = (id) => api.delete(`/appointment/${id}`);
export const changeState = (id, state) => api.patch(`/appointment/${id}/status`, state);