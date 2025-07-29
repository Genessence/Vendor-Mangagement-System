// API Configuration
const API_CONFIG = {
  development: {
    baseURL: 'http://localhost:8000/api/v1',
    timeout: 10000,
  },
  production: {
    // For single domain: https://yourdomain.com/api/v1
    // For separate domains: https://api.yourdomain.com/api/v1
    baseURL: process.env.VITE_API_BASE_URL || 'https://yourdomain.com/api/v1',
    timeout: 15000,
  }
};

const currentEnv = import.meta.env.MODE || 'development';
export const API_BASE_URL = API_CONFIG[currentEnv].baseURL;
export const API_TIMEOUT = API_CONFIG[currentEnv].timeout;

// Axios configuration
export const axiosConfig = {
  baseURL: API_BASE_URL,
  timeout: API_TIMEOUT,
  headers: {
    'Content-Type': 'application/json',
  },
}; 