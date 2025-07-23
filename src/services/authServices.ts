// src/services/authService.ts
import axios, { AxiosError, AxiosHeaders } from 'axios';

const API = import.meta.env.VITE_API_URL;

// Save token to localStorage, so it survives page reloads
const getToken = () => localStorage.getItem('jwt');
const setToken = (token: string | null) => {
    if (token) {
        localStorage.setItem('jwt', token);
    } else {
        localStorage.removeItem('jwt');
    }
};

const api = axios.create({
    baseURL: API,
    withCredentials: true,
    headers: {
        'Content-Type': 'application/json',
    },
});

// Attach token automatically to all requests made with `api`
api.interceptors.request.use(config => {
    const token = getToken();
    if (token) {
        if (!config.headers) {
            config.headers = new AxiosHeaders();
        }
        if (typeof config.headers.set === 'function') {
            config.headers.set('Authorization', `Bearer ${token}`);
        } else {
            (config.headers as any)['Authorization'] = `Bearer ${token}`;
        }
    }
    return config;
});

export const authService = {
    async login(email: string, password: string) {
        try {
            const { data } = await api.post('/Account/LoginApi', { email, password });
            if (data.success && data.token) {
                setToken(data.token);
            }
            return data;
        } catch (error) {
            if (axios.isAxiosError(error)) {
                const axiosError = error as AxiosError;
                if (axiosError.response?.status === 401) {
                    throw new Error('Invalid credentials');
                }
            }
            throw error;
        }
    },

    async logout() {
        setToken(null);
        return api.post('/Account/Logout');
    },

    async getCurrentUser() {
        try {
            const { data } = await api.get('/Account/Me');
            return data;
        } catch {
            return null;
        }
    },
};
export { api };
