import axios from 'axios';
import Cookies from 'js-cookie';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000';

const api = axios.create({
  withCredentials: true,
  timeout: 60000, // 60s timeout for file uploads
});

// Request Interceptor
api.interceptors.request.use((config) => {
  let token = null;
  
  try {
    if (typeof window !== 'undefined') {
      token = localStorage.getItem('token');
    }
  } catch (err) {
    console.warn('LocalStorage access blocked:', err);
  }

  // Fallback to cookie if localStorage fails or is empty
  if (!token) {
    token = Cookies.get('token');
  }

  if (token) {
    if (config.headers && typeof config.headers.set === 'function') {
      config.headers.set('Authorization', `Bearer ${token}`);
    } else {
      config.headers.Authorization = `Bearer ${token}`;
    }
  }

  // Robust URL Handling:
  if (config.url) {
    const isAbsolute = /^https?:\/\//i.test(config.url);

    if (isAbsolute) {
      // If absolute, do nothing
    } else {
      const cleanBase = API_URL.replace(/\/$/, '');
      const cleanUrl = config.url.startsWith('/') ? config.url : `/${config.url}`;
      config.url = `${cleanBase}${cleanUrl}`;
    }
  }

  return config;
}, (error) => {
  return Promise.reject(error);
});

export default api;
