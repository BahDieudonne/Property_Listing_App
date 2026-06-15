import axios from 'axios';

// Create axios instance with the backend base URL
const axiosInstance = axios.create({
  baseURL: 'http://localhost:5000/api',

  // THIS IS THE KEY CHANGE:
  withCredentials: true,
});

export default axiosInstance;