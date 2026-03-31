"use client";

import React, { useState, useRef } from 'react';
import { Card, CardContent } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { useAuth } from '@/context/AuthContext';
import api from '@/utils/api';
import Link from 'next/link';
import { Logo } from '@/components/ui/Logo';
import { User, Mail, Phone, Lock, Sparkles, Rocket, BookOpen, Brain, Camera, ArrowRight, CheckCircle } from 'lucide-react';

export default function TeacherSignupPage() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    password: '',
    role: 'teacher'
  });
  const [profilePicture, setProfilePicture] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [error, setError] = useState('');
  const [successMsg, setSuccessMsg] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const { login } = useAuth();

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files ? e.target.files[0] : null;
    if (file) {
      setProfilePicture(file);
      setPreviewUrl(URL.createObjectURL(file));
    }
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
      data.append('role', 'teacher');

      if (profilePicture) {
        data.append('profilePicture', profilePicture);
      }

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
        setSuccessMsg('Application submitted! Redirecting to teacher dashboard...');
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
    <div className="relative min-h-screen flex items-center justify-center p-4 overflow-hidden bg-white py-20">
      {/* Mesh Gradient Background */}
      <div className="absolute inset-0 z-0">
        <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-indigo-100/50 rounded-full blur-[100px] animate-pulse" />
        <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-blue-100/50 rounded-full blur-[100px] animate-pulse delay-700" />
      </div>

      {/* Floating Icons */}
      <div className="absolute inset-0 z-0 pointer-events-none overflow-hidden opacity-20">
        <Rocket className="absolute top-[15%] left-[10%] w-12 h-12 text-indigo-400 rotate-12 animate-bounce" />
        <BookOpen className="absolute bottom-[20%] left-[15%] w-10 h-10 text-blue-400 -rotate-12 animate-pulse" />
        <Sparkles className="absolute top-[20%] right-[15%] w-14 h-14 text-yellow-400 rotate-45 animate-pulse" />
      </div>

      <Card className="relative z-10 w-full max-w-xl bg-white/80 backdrop-blur-xl border-0 shadow-[0_30px_60px_rgba(0,0,0,0.12)] rounded-[40px] overflow-hidden">
        <div className="p-8 pb-4 text-center">
          <div className="flex justify-center mb-6">
            <div className="p-3 bg-white rounded-2xl shadow-sm">
                <Logo />
            </div>
          </div>
          <h1 className="text-3xl font-black text-gray-800 tracking-tight mb-2">Join as Educator</h1>
          <p className="text-gray-500 font-medium">Be the mentor who changes a child's world.</p>
        </div>

        <CardContent className="p-8 pt-0">
          <form onSubmit={handleSubmit} className="space-y-6">
            {error && (
              <div className="p-4 bg-red-50 border border-red-100 text-red-600 rounded-2xl text-sm font-bold text-center animate-shake">
                {error}
              </div>
            )}
            {successMsg && (
              <div className="p-4 bg-green-50 border border-green-100 text-green-700 rounded-2xl text-sm font-bold text-center animate-pulse">
                {successMsg}
              </div>
            )}

            {/* Profile Picture Upload */}
            <div className="flex flex-col items-center gap-4 mb-4">
              <div 
                onClick={() => fileInputRef.current?.click()}
                className="relative w-24 h-24 rounded-full bg-gray-50 border-2 border-dashed border-gray-200 flex items-center justify-center cursor-pointer hover:border-indigo-400 transition-all group overflow-hidden"
              >
                {previewUrl ? (
                  <img src={previewUrl} alt="Preview" className="w-full h-full object-cover" />
                ) : (
                  <Camera className="w-8 h-8 text-gray-300 group-hover:text-indigo-400" />
                )}
                <div className="absolute inset-0 bg-black/20 opacity-0 group-hover:opacity-100 flex items-center justify-center transition-opacity">
                   <span className="text-[10px] text-white font-black uppercase">Change</span>
                </div>
              </div>
              <input 
                type="file" 
                ref={fileInputRef} 
                className="hidden" 
                accept="image/*" 
                onChange={handleFileChange} 
              />
              <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Profile Picture (Recommended)</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="relative group">
                <div className="absolute inset-y-0 left-4 flex items-center pointer-events-none">
                  <User className="w-5 h-5 text-gray-400 group-focus-within:text-indigo-500 transition-colors" />
                </div>
                <input
                  name="name"
                  type="text"
                  required
                  placeholder="Full Name"
                  value={formData.name}
                  onChange={handleChange}
                  className="w-full pl-12 pr-4 py-4 rounded-2xl bg-gray-50/50 border-2 border-transparent focus:border-indigo-400 focus:bg-white focus:outline-none transition-all font-medium text-gray-700 placeholder:text-gray-400"
                />
              </div>

              <div className="relative group">
                <div className="absolute inset-y-0 left-4 flex items-center pointer-events-none">
                  <Phone className="w-5 h-5 text-gray-400 group-focus-within:text-indigo-500 transition-colors" />
                </div>
                <input
                  name="phone"
                  type="tel"
                  required
                  placeholder="Contact Number"
                  value={formData.phone}
                  onChange={handleChange}
                  className="w-full pl-12 pr-4 py-4 rounded-2xl bg-gray-50/50 border-2 border-transparent focus:border-indigo-400 focus:bg-white focus:outline-none transition-all font-medium text-gray-700 placeholder:text-gray-400"
                />
              </div>
            </div>

            <div className="relative group">
              <div className="absolute inset-y-0 left-4 flex items-center pointer-events-none">
                <Mail className="w-5 h-5 text-gray-400 group-focus-within:text-indigo-500 transition-colors" />
              </div>
              <input
                name="email"
                type="email"
                required
                placeholder="Professional Email Address"
                value={formData.email}
                onChange={handleChange}
                className="w-full pl-12 pr-4 py-4 rounded-2xl bg-gray-50/50 border-2 border-transparent focus:border-indigo-400 focus:bg-white focus:outline-none transition-all font-medium text-gray-700 placeholder:text-gray-400"
              />
            </div>

            <div className="relative group">
              <div className="absolute inset-y-0 left-4 flex items-center pointer-events-none">
                <Lock className="w-5 h-5 text-gray-400 group-focus-within:text-indigo-500 transition-colors" />
              </div>
              <input
                name="password"
                type="password"
                required
                placeholder="Create Password"
                value={formData.password}
                onChange={handleChange}
                className="w-full pl-12 pr-4 py-4 rounded-2xl bg-gray-50/50 border-2 border-transparent focus:border-indigo-400 focus:bg-white focus:outline-none transition-all font-medium text-gray-700 placeholder:text-gray-400"
              />
            </div>

            <div className="bg-indigo-50 p-6 rounded-3xl border border-indigo-100 flex items-start gap-4">
               <div className="mt-1">
                  <CheckCircle className="w-5 h-5 text-indigo-500" />
               </div>
               <div>
                  <h4 className="text-sm font-black text-indigo-800">Teacher Account Verified ✅</h4>
                  <p className="text-xs text-indigo-600 font-medium leading-relaxed mt-1">Your profile will be reviewed by our team. Once approved, you can start creating courses and workshops.</p>
               </div>
            </div>

            <Button
              type="submit"
              size="lg"
              isLoading={isLoading}
              className="w-full py-7 rounded-2xl text-xl font-black shadow-[0_15px_35px_rgba(79,70,229,0.25)] bg-gradient-to-r from-indigo-600 to-blue-600 hover:from-indigo-700 hover:to-blue-700 transform transition hover:-translate-y-1 active:translate-y-0"
            >
              Start Teaching Now <ArrowRight className="w-6 h-6 ml-2 inline" />
            </Button>

            <p className="text-center text-gray-500 font-bold mt-8">
              Already a teacher? <Link href="/teacher/login" className="text-indigo-600 hover:underline ml-1">Login here</Link>
            </p>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
