import axios from 'axios';

const api = axios.create({
    baseURL: import.meta.env.VITE_API_HEALTHCONNECTION,
    headers: {
        'Content-Type': 'application/json',
    },
});

// Interceptor para agregar token JWT automáticamente
api.interceptors.request.use((config) => {
    const token = localStorage.getItem('auth_token');
    if (token) {
        config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
});

export default api;
