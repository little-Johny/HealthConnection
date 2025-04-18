import axios from 'axios';

const api = axios.create({
    baseURL: `http://172.18.65.151:3000/health_connection/v2`,
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
