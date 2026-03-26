import axios from 'axios';
import Cookies from 'js-cookie';

const API_URL = process.env.NEXT_PUBLIC_API_URL || '';

const api = axios.create({
  baseURL: API_URL,
  withCredentials: true,
});

// Request Interceptor: Automatically attach Bearer Token from Cookies
api.interceptors.request.use((config) => {
  const token = Cookies.get('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  
  // Safety check: Never prefix absolute URLs
  if (config.url && (config.url.startsWith('http://') || config.url.startsWith('https://'))) {
    config.baseURL = '';
  }
  
  return config;
}, (error) => {
  return Promise.reject(error);
});

export default api;
