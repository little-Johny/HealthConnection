import api from './axios';


export const login = (credentials) => api.post('/auth/login', credentials);
export const recovery = (email) => api.post('/auth/recovery', email);
export const changePassword = (data) => api.post('/auth/change-password', data) ;
