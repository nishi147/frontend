"use client";

import React, { useState } from 'react';
import { Card, CardContent } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { useAuth } from '@/context/AuthContext';
import api from '@/utils/api';
import Link from 'next/link';
import { Logo } from '@/components/ui/Logo';
import { User, Mail, Phone, Lock, Sparkles, Rocket, BookOpen, Brain } from 'lucide-react';

export default function SignupPage() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    password: '',
    role: 'student'
  });
  const [error, setError] = useState('');
  const [successMsg, setSuccessMsg] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const { login } = useAuth();

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setSuccessMsg('');
    setIsLoading(true);

    try {
      const data = new FormData();
      data.append('name', formData.name);
      data.append('email', formData.email);
      data.append('phone', formData.phone);
      data.append('password', formData.password);
      data.append('role', formData.role);

      const res = await api.post(
        '/api/auth/register',
        data,
        {
          headers: {
            'Content-Type': 'multipart/form-data',
          },
        }
      );

      if (res.data.success) {
        setSuccessMsg('Account created successfully! Preparing your magical dashboard...');
        setTimeout(() => {
          login(res.data.token, res.data.user);
        }, 1500);
      }
    } catch (err: any) {
      setError(err.response?.data?.message || 'Registration failed. Try again.');
      setIsLoading(false);
    }
  };

  return (
    <div className="relative min-h-screen flex items-center justify-center p-4 overflow-hidden bg-white">
      {/* Mesh Gradient Background */}
      <div className="absolute inset-0 z-0">
        <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-purple-200/50 rounded-full blur-[100px] animate-pulse" />
        <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-blue-200/50 rounded-full blur-[100px] animate-pulse delay-700" />
        <div className="absolute top-[20%] right-[10%] w-[30%] h-[30%] bg-pink-100/50 rounded-full blur-[80px] animate-pulse delay-1000" />
      </div>

      {/* Floating Icons */}
      <div className="absolute inset-0 z-0 pointer-events-none overflow-hidden">
        <Rocket className="absolute top-[15%] left-[10%] w-12 h-12 text-purple-300 transform -rotate-12 animate-bounce opacity-40 shadow-sm" />
        <BookOpen className="absolute bottom-[20%] left-[15%] w-10 h-10 text-blue-300 transform rotate-12 animate-pulse opacity-40" />
        <Brain className="absolute top-[20%] right-[15%] w-14 h-14 text-pink-300 transform -rotate-6 animate-pulse opacity-40" />
        <Sparkles className="absolute bottom-[25%] right-[10%] w-12 h-12 text-yellow-300 transform rotate-45 animate-bounce opacity-40" />
      </div>

      <Card className="relative z-10 w-full max-w-lg bg-white/70 backdrop-blur-xl border-0 shadow-[0_20px_50px_rgba(0,0,0,0.1)] rounded-[40px] overflow-hidden">
        <div className="p-8 pb-4 text-center">
          <div className="flex justify-center mb-6">
            <div className="p-3 bg-white rounded-2xl shadow-sm">
                <Logo />
            </div>
          </div>
          <h1 className="text-3xl font-black text-gray-800 tracking-tight mb-2">Join RUZANN</h1>
          <p className="text-gray-500 font-medium">Start your journey to greatness today!</p>
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

            <div className="relative group">
              <div className="absolute inset-y-0 left-4 flex items-center pointer-events-none">
                <User className="w-5 h-5 text-gray-400 group-focus-within:text-primary-500 transition-colors" />
              </div>
              <input
                name="name"
                type="text"
                required
                placeholder="What should we call you?"
                value={formData.name}
                onChange={handleChange}
                className="w-full pl-12 pr-4 py-4 rounded-2xl bg-gray-50/50 border-2 border-transparent focus:border-primary-400 focus:bg-white focus:outline-none transition-all font-medium text-gray-700 placeholder:text-gray-400"
              />
            </div>

            <div className="relative group">
              <div className="absolute inset-y-0 left-4 flex items-center pointer-events-none">
                <Mail className="w-5 h-5 text-gray-400 group-focus-within:text-primary-500 transition-colors" />
              </div>
              <input
                name="email"
                type="email"
                required
                placeholder="Your superpower email"
                value={formData.email}
                onChange={handleChange}
                className="w-full pl-12 pr-4 py-4 rounded-2xl bg-gray-50/50 border-2 border-transparent focus:border-primary-400 focus:bg-white focus:outline-none transition-all font-medium text-gray-700 placeholder:text-gray-400"
              />
            </div>

            <div className="relative group">
              <div className="absolute inset-y-0 left-0 flex items-center pl-4 border-r border-gray-100">
                <span className="text-gray-500 font-bold text-sm">+91</span>
              </div>
              <div className="absolute inset-y-0 left-12 flex items-center pl-1 pointer-events-none">
                 <Phone className="w-5 h-5 text-gray-400 group-focus-within:text-primary-500 transition-colors" />
              </div>
              <input
                name="phone"
                type="tel"
                required
                placeholder="Mobile number"
                value={formData.phone}
                onChange={handleChange}
                className="w-full pl-20 pr-4 py-4 rounded-2xl bg-gray-50/50 border-2 border-transparent focus:border-primary-400 focus:bg-white focus:outline-none transition-all font-medium text-gray-700 placeholder:text-gray-400"
              />
            </div>

            <div className="relative group">
              <div className="absolute inset-y-0 left-4 flex items-center pointer-events-none">
                <Lock className="w-5 h-5 text-gray-400 group-focus-within:text-primary-500 transition-colors" />
              </div>
              <input
                name="password"
                type="password"
                required
                placeholder="Create a strong password"
                value={formData.password}
                onChange={handleChange}
                className="w-full pl-12 pr-4 py-4 rounded-2xl bg-gray-50/50 border-2 border-transparent focus:border-primary-400 focus:bg-white focus:outline-none transition-all font-medium text-gray-700 placeholder:text-gray-400"
              />
            </div>

            <Button
              type="submit"
              size="lg"
              isLoading={isLoading}
              className="w-full py-6 rounded-2xl text-lg font-black shadow-[0_10px_30px_rgba(var(--primary-rgb),0.3)] transform transition hover:-translate-y-1 active:translate-y-0"
            >
              Get Started
            </Button>

            <p className="text-center text-gray-400 text-xs mt-6 font-medium leading-relaxed">
              By clicking on "Get started", I acknowledge and agree to the <Link href="/terms" className="text-primary-500 hover:underline">Terms of Service</Link>
            </p>

            <p className="text-center text-gray-500 font-bold mt-8">
              Already have an account? <Link href="/login" className="text-primary-600 hover:underline ml-1">Login here</Link>
            </p>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
