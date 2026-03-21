"use client";

import React, { useState } from 'react';
import { Card, CardContent } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { useAuth } from '@/context/AuthContext';
import axios from 'axios';
import Link from 'next/link';
import { Logo } from '@/components/ui/Logo';
import { Mail, Lock, Shield, Sparkles, Rocket, BookOpen, Brain, ArrowRight } from 'lucide-react';

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
        setSuccessMsg('Welcome back! Journeying to your dashboard...');
        setTimeout(() => {
          login(res.data.token, res.data.user);
        }, 1500);
      }
    } catch (err: any) {
      setError(err.response?.data?.message || 'Login failed. Check your credentials.');
      setIsLoading(false);
    }
  };

  return (
    <div className="relative min-h-screen flex items-center justify-center p-4 overflow-hidden bg-white">
      {/* Mesh Gradient Background */}
      <div className="absolute inset-0 z-0">
        <div className="absolute bottom-[-10%] left-[-10%] w-[40%] h-[40%] bg-blue-200/50 rounded-full blur-[100px] animate-pulse" />
        <div className="absolute top-[-10%] right-[-10%] w-[40%] h-[40%] bg-purple-200/50 rounded-full blur-[100px] animate-pulse delay-700" />
      </div>

      {/* Floating Icons */}
      <div className="absolute inset-0 z-0 pointer-events-none overflow-hidden opacity-30">
        <Rocket className="absolute top-[20%] right-[15%] w-12 h-12 text-blue-400 rotate-45 animate-bounce" />
        <Brain className="absolute bottom-[20%] left-[10%] w-14 h-14 text-purple-400 -rotate-12 animate-pulse" />
      </div>

      <Card className="relative z-10 w-full max-w-lg bg-white/70 backdrop-blur-xl border-0 shadow-[0_20px_50px_rgba(0,0,0,0.1)] rounded-[40px] overflow-hidden">
        <div className="p-8 pb-4 text-center">
          <div className="flex justify-center mb-6">
            <div className="p-3 bg-white rounded-2xl shadow-sm">
                <Logo />
            </div>
          </div>
          <h1 className="text-3xl font-black text-gray-800 tracking-tight mb-2">Welcome Back</h1>
          <p className="text-gray-500 font-medium italic">Your learning magic awaits!</p>
        </div>

        <CardContent className="p-8 pt-0">
          <form onSubmit={handleSubmit} className="space-y-5">
            {error && (
              <div className="p-4 bg-red-50 border border-red-100 text-red-600 rounded-2xl text-sm font-bold animate-shake text-center">
                {error}
              </div>
            )}
            {successMsg && (
              <div className="p-4 bg-green-50 border border-green-100 text-green-700 rounded-2xl text-sm font-bold animate-pulse text-center">
                {successMsg}
              </div>
            )}

            {isAdminHint && (
              <div className="p-4 bg-amber-50 border-2 border-amber-200 rounded-3xl flex items-center gap-4 animate-in slide-in-from-top duration-700 shadow-sm">
                <div className="p-2 bg-amber-100 rounded-full">
                    <Shield className="w-8 h-8 text-amber-600" />
                </div>
                <div>
                  <p className="font-black text-amber-800 text-sm">ADMIN PORTAL DETECTED 🔐</p>
                  <p className="text-xs text-amber-600 font-bold italic">Sign in with super-user authority.</p>
                </div>
              </div>
            )}

            <div className="relative group">
              <div className="absolute inset-y-0 left-4 flex items-center pointer-events-none">
                <Mail className="w-5 h-5 text-gray-400 group-focus-within:text-blue-500 transition-colors" />
              </div>
              <input
                type="email"
                required
                placeholder="Email Address"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full pl-12 pr-4 py-4 rounded-2xl bg-gray-50/50 border-2 border-transparent focus:border-blue-400 focus:bg-white focus:outline-none transition-all font-medium text-gray-700 placeholder:text-gray-400"
              />
            </div>

            <div className="relative group">
              <div className="absolute inset-y-0 left-4 flex items-center pointer-events-none">
                <Lock className="w-5 h-5 text-gray-400 group-focus-within:text-blue-500 transition-colors" />
              </div>
              <input
                type="password"
                required
                placeholder="Password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full pl-12 pr-4 py-4 rounded-2xl bg-gray-50/50 border-2 border-transparent focus:border-blue-400 focus:bg-white focus:outline-none transition-all font-medium text-gray-700 placeholder:text-gray-400"
              />
            </div>

            <div className="flex justify-end px-2">
                <Link href="/forgot-password" size="sm" className="text-sm font-bold text-gray-500 hover:text-blue-600 transition-colors">
                    Forgot Password?
                </Link>
            </div>

            <Button
              type="submit"
              size="lg"
              isLoading={isLoading}
              className="w-full py-6 rounded-2xl text-lg font-black shadow-[0_10px_30px_rgba(59,130,246,0.3)] bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 transform transition hover:-translate-y-1 active:translate-y-0"
            >
              Sign In <ArrowRight className="w-5 h-5 ml-2 inline" />
            </Button>

            <p className="text-center text-gray-500 font-bold mt-8">
              New to RUZANN? <Link href="/signup" className="text-blue-600 hover:underline ml-1">Create an account</Link>
            </p>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
