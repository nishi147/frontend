import axios from 'axios';
import Cookies from 'js-cookie';

const API_URL = process.env.NEXT_PUBLIC_API_URL || '';

const api = axios.create({
  baseURL: API_URL,
  withCredentials: true,
});

// Request Interceptor: Automatically attach Bearer Token and handle URLs
api.interceptors.request.use((config) => {
  const token = Cookies.get('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  
  // Robust Path Handling:
  // 1. If absolute URL (starts with http) -> Remove baseURL to avoid double-prefixing
  // 2. If relative URL (starts with /) -> Ensure baseURL is applied
  if (config.url && (config.url.startsWith('http://') || config.url.startsWith('https://'))) {
    config.baseURL = ''; 
  } else if (config.url && config.url.startsWith('/') && API_URL) {
    // Ensure we don't double-slash
    config.url = `${API_URL.replace(/\/$/, '')}${config.url}`;
    config.baseURL = ''; 
  }
  
  return config;
}, (error) => {
  return Promise.reject(error);
});

export default api;
