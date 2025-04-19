import api from './api';

export const createUser = (data) => {
    const userData = new FormData();

    for (const key in data) {
        userData.append(key, data[key]);
    };

    return api.post('/user', userData, {
        headers: {
            'Content-Type' : 'multipart/form-data',
        },
    });
};
export const getUsers = (query) => api.get('/user', { params: query });
export const getUserById = (id) => api.get(`/user/${id}`);
export const getUserProfile = () => {
    const token = localStorage.getItem('auth_token'); 
    return api.get('/user/profile', {
        headers: {
            Authorization: `Bearer ${token}`,
        },
    });
};

export const getAllUsers = () => api.get('/user/all');
export const partiallyUpdateUser = (id, changes) => {
    const userChanges = new FormData();

    for( const key in changes) {
        userChanges.append(key, changes[key]);
    };
    
    return api.patch(`/user/${id}`, userChanges, {
        headers: {
            'Content-Type' : 'multipart/form-data',
        },
    });
};
export const deleteUser = (id) => api.delete(`/user/${id}`);
export const restoreUser = (id) => api.patch(`/user/restore/${id}`);
export const forceDeleteUser = (id) => api.delete(`/user/force/${id}`);