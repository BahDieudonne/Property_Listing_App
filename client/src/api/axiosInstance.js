import axios from 'axios';

// Create a custom axios instance 
const axiosInstance = axios.create({
  baseURL: 'http://localhost:5000/api',
});

// ===== GLOBAL REQUEST INTERCEPTOR =====
axiosInstance.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');

    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }

    return config;
  },
  (error) => Promise.reject(error)
);

export default axiosInstance;