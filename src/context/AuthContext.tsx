"use client";

import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import axios from 'axios';
import Cookies from 'js-cookie';
import { useRouter } from 'next/navigation';

interface User {
  _id: string;
  name: string;
  email: string;
  role: 'student' | 'teacher' | 'admin' | 'sales';
  profilePicture?: string;
  referralCode?: string;
  stars?: number;
  gems?: number;
  enrollments?: Array<{ course: string; status: string }>;
}

interface AuthContextType {
  user: User | null;
  token: string | null;
  loading: boolean;
  login: (token: string, user: User) => void;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType>({
  user: null,
  token: null,
  loading: true,
  login: () => {},
  logout: () => {},
});

// Use relative path '/api' to trigger Next.js rewrites in dev, or direct URL in production
axios.defaults.baseURL = process.env.NEXT_PUBLIC_API_URL || ''; 
// NOTE: Setting baseURL here ensures that all relative calls like axios.get('/api/users')
// correctly point to the backend server even on Vercel.

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    const initAuth = async () => {
      const storedToken = Cookies.get('token');
      if (storedToken) {
        setToken(storedToken);
        axios.defaults.headers.common['Authorization'] = `Bearer ${storedToken}`;
        try {
          const apiUrl = process.env.NEXT_PUBLIC_API_URL || '';
          const res = await axios.get(`${apiUrl}/api/auth/me`);
          if (res.data.success) {
             setUser(res.data.data);
          } else {
             logout();
          }
        } catch (error: any) {
          console.error("Auth init error:", error);
          // Only logout on 401 Unauthorized, to prevent logout on network/server blips
          if (error.response?.status === 401) {
            logout();
          }
        }
      }
      setLoading(false);
    };

    initAuth();
  }, []);

  const login = (newToken: string, newUser: User) => {
    Cookies.set('token', newToken, { expires: 30 });
    axios.defaults.headers.common['Authorization'] = `Bearer ${newToken}`;
    setToken(newToken);
    setUser(newUser);
    const dashboardPath = newUser.role === 'sales' ? '/sales-dashboard' : `/dashboard/${newUser.role}`;
    router.push(dashboardPath);
  };

  const logout = () => {
    Cookies.remove('token');
    delete axios.defaults.headers.common['Authorization'];
    setToken(null);
    setUser(null);
    router.push('/login');
  };

  return (
    <AuthContext.Provider value={{ user, token, loading, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
