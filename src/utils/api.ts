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
    config.headers.Authorization = `Bearer ${token}`;
  }

  // Robust URL Handling:
  // We avoid using baseURL globally to prevent axios from concatenating incorrectly.
  if (config.url) {
    const isAbsolute = /^https?:\/\//i.test(config.url);

    if (isAbsolute) {
      // If absolute, do nothing (axios will use it as is)
    } else {
      // Prepend API_URL for ALL relative calls (local or production)
      // This bypasses Next.js rewrite issues and is more robust.
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
