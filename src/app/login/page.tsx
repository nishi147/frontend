"use client";

import React, { useState } from 'react';
import { Card, CardTitle, CardContent } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { useAuth } from '@/context/AuthContext';
import axios from 'axios';
import Link from 'next/link';
import { Shield } from 'lucide-react';
import { Logo } from '@/components/ui/Logo';

export default function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [successMsg, setSuccessMsg] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const { login } = useAuth();
  const searchParams = typeof window !== 'undefined' ? new URLSearchParams(window.location.search) : null;
  const isAdminHint = searchParams?.get('admin') === 'true';

  const handleSubmit = async (e: React.FormEvent) => {
  e.preventDefault();
  setError('');
  setSuccessMsg('');
  setIsLoading(true);

  try {
    const res = await axios.post(
      `${process.env.NEXT_PUBLIC_API_URL}/api/auth/login`,
      { email, password }
    );

    if (res.data.success) {
      setSuccessMsg('Login Successful! Redirecting you to your dashboard...');
      setTimeout(() => {
        login(res.data.token, res.data.user);
      }, 1500);
    }
  } catch (err: any) {
    setError(err.response?.data?.message || 'Login failed. Try again.');
    setIsLoading(false);
  }
};

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-primary-200 via-secondary-200 to-accent-200 p-4">
      <Card className="w-full max-w-md bg-white/80">
        <div className="text-center mb-6">
          <div className="flex justify-center mb-4">
            <Logo />
          </div>
          <CardTitle className="text-3xl text-primary-600">Welcome Back!</CardTitle>
          <p className="text-gray-500 mt-2">Login to continue learning</p>
        </div>

        <CardContent>
          <form onSubmit={handleSubmit} className="flex flex-col gap-4">
            {error && <div className="p-3 bg-red-100 text-red-600 rounded-xl text-center font-bold">{error}</div>}
            {successMsg && <div className="p-3 bg-green-100 text-green-700 rounded-xl text-center font-bold border-2 border-green-200 animate-pulse">{successMsg}</div>}
            {isAdminHint && (
              <div className="p-4 bg-accent-50 border-2 border-accent-200 rounded-2xl flex items-center gap-3 animate-in slide-in-from-top duration-500">
                <Shield className="w-8 h-8 text-accent-500" />
                <div>
                  <p className="font-black text-accent-700 text-sm">ADMIN PORTAL DETECTED 🔐</p>
                  <p className="text-xs text-accent-600 font-bold italic">Log in with your super-user credentials.</p>
                </div>
              </div>
            )}
            
            <div className="flex flex-col gap-1">
              <label className="font-bold text-gray-700 ml-2">Email</label>
              <input 
                type="email" 
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full px-4 py-3 rounded-2xl border-2 border-gray-200 focus:border-primary-500 focus:outline-none transition-colors"
                placeholder="teacher@ruzann.com"
              />
            </div>

            <div className="flex flex-col gap-1 mb-2">
              <label className="font-bold text-gray-700 ml-2">Password</label>
              <input 
                type="password" 
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full px-4 py-3 rounded-2xl border-2 border-gray-200 focus:border-primary-500 focus:outline-none transition-colors"
                placeholder="••••••••"
              />
            </div>

            <Button type="submit" size="lg" isLoading={isLoading} fullWidth>
              Let's Go!
            </Button>
            
            <p className="text-center text-gray-500 mt-4 font-bold">
              Don't have an account? <Link href="/register" className="text-primary-600 hover:underline">Sign up</Link>
            </p>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
