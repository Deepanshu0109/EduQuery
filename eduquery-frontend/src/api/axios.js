import axios from 'axios';

// Your backend base URL
const API_URL = 'http://localhost:5000/api';

const axiosInstance = axios.create({
  baseURL: API_URL,
});

// Automatically add JWT token to requests if present
axiosInstance.interceptors.request.use((config) => {
  const token = localStorage.getItem('eduqueryToken');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export default axiosInstance;
