// client/src/service/api.js
import axios from 'axios';

const API = axios.create({
  baseURL: 'http://localhost:8070', // change this to your backend URL
  withCredentials: true,            // optional: if you’re using cookies
  headers: {
    'Content-Type': 'application/json',
  },
});

// Optional: attach token to every request
API.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export default API;
