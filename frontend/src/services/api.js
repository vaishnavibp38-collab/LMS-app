import axios from 'axios';

// Vite exposes environment variables via import.meta.env
// We will default to the absolute '/api' path to ensure it
// works across all nested routes on Vercel.
const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || '/api',
});

// Add a request interceptor to include the token
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export default api;
