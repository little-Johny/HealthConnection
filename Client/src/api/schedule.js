import api from "./api";

export const createSchedule = (data) => api.post(`/doctor-schedule`, data);
export const createBlockSchedule = (data) =>  api.post(`/doctor-schedule/block`, data);
export const getScheduleByDoctorId = (doctorId) => api.get(`/doctor-schedule/doc/${doctorId}`);
export const getScheduleById = (id) => api.get(`/doctor-schedule/${id}`);
export const getAvailability = (doctorId, query) => api.get(`/doctor-schedule/provision/${doctorId}`, { params: query });
export const partiallyUpdateSchedule = (id, changes) => api.patch(`/doctor-schedule/${id}`, changes);
export const deleteSchedule = (id) =>  api.delete(`/doctor-schedule/${id}`);
export const deleteBlockSchedule = (id) => api.delete(`/doctor-schedule/unblock/${id}`);