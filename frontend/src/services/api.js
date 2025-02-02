import axios from 'axios';
import { auth } from '../config/firebase-config';

const api = axios.create({
    baseURL: 'http://localhost:3000/api'
});

api.interceptors.request.use(async (config) => {
    const user = auth.currentUser;
    if (user) {
        const token = await user.getIdToken();
        config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
});

export default api;