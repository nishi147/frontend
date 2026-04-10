"use client";

import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import api from '@/utils/api';
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
  bootcamps?: Array<{ bootcamp: string; status: string }>;
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

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    const initAuth = async () => {
      let storedToken = null;
      try {
        storedToken = localStorage.getItem('token');
      } catch (err) {
        console.warn("LocalStorage access failed in initAuth", err);
      }
      
      if (!storedToken) storedToken = Cookies.get('token');

      if (storedToken) {
        setToken(storedToken);
        // Sync to cookie if missing (for legacy or cross-tab)
        if (!Cookies.get('token')) {
          Cookies.set('token', storedToken, { expires: 30 });
        }
        try {
          const res = await api.get('/api/auth/me');
          if (res.data.success) {
             setUser(res.data.data);
          } else {
             logout();
          }
        } catch (error: any) {
          console.error("Auth init error:", error);
          if (error.response?.status === 401) {
            logout();
          }
        } finally {
          setLoading(false);
        }
      } else {
        setLoading(false);
      }
    };

    initAuth();
  }, []);

  const login = (newToken: string, newUser: User) => {
    try {
      localStorage.setItem('token', newToken);
    } catch (err) {
      console.warn("LocalStorage set failed during login", err);
    }
    Cookies.set('token', newToken, { expires: 30 });
    setToken(newToken);
    setUser(newUser);
    
    // Unified Role-Based Redirection
    let dashboardPath = `/dashboard/${newUser.role}`;
    if (newUser.role === 'sales') {
      dashboardPath = '/sales-dashboard';
    }
    
    router.push(dashboardPath);
  };

  const logout = () => {
    try {
      localStorage.removeItem('token');
    } catch (err) {
      console.warn("LocalStorage remove failed during logout", err);
    }
    Cookies.remove('token');
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
