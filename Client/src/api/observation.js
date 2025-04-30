import api from "./api";

export const createObservation = (data) => api.post('/observation', data);
export const  getObservationById = (id) => api.get(`/observation/${id}`);
export const  partiallyUpdateObsevation = (id, changes) => api.patch(`/observation/${id}`, changes);
export const  deleteObservation = (id) => api.delete(`/observation/${id}`);


