import axios from 'axios';
import * as SecureStore from 'expo-secure-store';

// Replace with your actual backend URL
// For Android Emulator use: http://10.0.2.2:3000
// For iOS Simulator use: http://localhost:3000
// For Physical Device use: http://YOUR_PC_IP:3000
const BASE_URL = 'http://localhost:4000';

const client = axios.create({
    baseURL: BASE_URL,
    headers: {
        'Content-Type': 'application/json',
    },
});

// Add interceptor to add token to requests
client.interceptors.request.use(
    async (config) => {
        try {
            const token = await SecureStore.getItemAsync('hubivent_auth_token');
            if (token) {
                config.headers.Authorization = `Bearer ${token}`;
            }
        } catch (error) {
            console.error('Error getting token:', error);
        }
        return config;
    },
    (error) => {
        return Promise.reject(error);
    }
);

export default client;
