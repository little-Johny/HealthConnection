import api from "./api";

export const createClinicalHistory = (data) => api.post('/clinical-history', data);
export const getClinicalHistoryById = (id) => api.get(`/clinical-history/${id}`);
export const partiallyUpdateClinicalHistory = (id, changes) => api.patch(`/clinical-history/${id}`, changes);