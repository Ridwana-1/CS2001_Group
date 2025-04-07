/**
 * Axios API Configuration
 * @author Sultan Jurabekov
 * @functionality API client configuration that handles:
 * - Base URL configuration
 * - Authentication token management
 * - Request/response interceptors
 * - Error handling
 * - Automatic token refresh
 * - Unauthorized request handling
 */

import axios from 'axios';

const api = axios.create({
  baseURL: 'http://localhost:3000/api',  // Add /api to baseURL
  headers: {
    'Content-Type': 'application/json',
  },
  withCredentials: true, // Added to handle CORS with credentials
});

// Add a request interceptor
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    console.log('Interceptor - Using token:', token);

    if (token) {
      // Проверяем, что мы не в инкогнито режиме
      try {
        const testKey = 'test';
        localStorage.setItem(testKey, testKey);
        localStorage.removeItem(testKey);
      } catch (e) {
        // Если localStorage недоступен (например, в инкогнито режиме)
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        window.location.href = '/login';
        return Promise.reject(new Error('Private browsing detected'));
      }

      // Проверяем, что токен не пустой
      if (token.trim() === '') {
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        window.location.href = '/login';
        return Promise.reject(new Error('Invalid token'));
      }

      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    console.error('Request interceptor error:', error);
    return Promise.reject(error);
  }
);

// Add a response interceptor
api.interceptors.response.use(
  (response) => {
    console.log('Response interceptor - Success:', response.data);
    return response;
  },
  async (error) => {
    console.error('Response interceptor - Error:', error.response?.data || error.message);

    // Если ошибка 401 (Unauthorized), удаляем токен и редиректим на страницу логина
    if (error.response?.status === 401) {
      // Пытаемся выполнить logout перед удалением токена
      try {
        const token = localStorage.getItem('token');
        if (token) {
          await api.post('/api/auth/logout');
        }
      } catch (logoutError) {
        console.error('Logout error:', logoutError);
      }

      localStorage.removeItem('token');
      localStorage.removeItem('user');
      window.location.href = '/login';
    }

    return Promise.reject(error);
  }
);

export default api;
