import axios from 'axios';
import Cookies from 'js-cookie';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000';

const api = axios.create({
  withCredentials: true,
  timeout: 10000, // 10s timeout to prevent infinite hangs
});

// Request Interceptor
api.interceptors.request.use((config) => {
  const isBrowser = typeof window !== 'undefined';
  const token = Cookies.get('token');

  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }

  // Robust URL Handling:
  // We avoid using baseURL globally to prevent axios from concatenating incorrectly.
  if (config.url) {
    const isAbsolute = /^https?:\/\//i.test(config.url);

    if (isAbsolute) {
      // If absolute, do nothing (axios will use it as is)
    } else if (isBrowser && config.url.startsWith('/api')) {
      // In browser, use relative path for NextJs Rewrites (e.g. /api/auth/me)
      // This avoids CORS and stale API_URL issues.
    } else {
      // For SSR or non-api assets, prepend the API_URL
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
