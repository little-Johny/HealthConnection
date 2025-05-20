import api from "./axios";

export const createPost = (data) => {
    const postData = new FormData();
    const token = localStorage.getItem('auth_token');

    for (const key in data) {
        postData.append(key, data[key]);
    }

    return api.post('/post', postData, {
            headers: {
                'Content-Type' : 'multipart/form-data',
                Authorization: `Bearer ${token}`,
            },
    });
};

export const getAllPost = () => api.get('/post');
export const getPostById = (id) => api.get(`/post/${id}`);
export const partiallyUpdate = (id, changes) => {
    const postChanges = new FormData();
    const token = localStorage.getItem('auth_token');

    for (const key in changes) {
        postChanges.append(key, changes[key]);
    }

    return api.patch(`/post/${id}`, postChanges, {
            headers: {
                'Content-Type' : 'multipart/form-data',
                Authorization: `Bearer ${token}`,
            },
    });
};
export const deletePost = (id) => api.delete(`/post/${id}`);