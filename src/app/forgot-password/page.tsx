"use client";

import React, { useState } from 'react';
import { Card, CardContent } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import Link from 'next/link';
import axios from 'axios';
import { Logo } from '@/components/ui/Logo';
import { Mail, ArrowLeft, CheckCircle2, Sparkles, Brain } from 'lucide-react';

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState('');
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');

    try {
      const res = await axios.post(`${process.env.NEXT_PUBLIC_API_URL}/api/auth/forgotpassword`, { email });
      if (res.data.success) {
        setIsSubmitted(true);
      }
    } catch (err: any) {
      setError(err.response?.data?.message || 'Something went wrong. Please try again later.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="relative min-h-screen flex items-center justify-center p-4 overflow-hidden bg-white">
      {/* Background Decor */}
      <div className="absolute inset-0 z-0">
        <div className="absolute top-[-15%] right-[-10%] w-[50%] h-[50%] bg-indigo-50/50 rounded-full blur-[120px]" />
        <div className="absolute bottom-[-15%] left-[-10%] w-[50%] h-[50%] bg-purple-50/50 rounded-full blur-[120px]" />
      </div>

      <Card className="relative z-10 w-full max-w-lg bg-white/70 backdrop-blur-xl border-0 shadow-[0_20px_50px_rgba(0,0,0,0.1)] rounded-[40px] overflow-hidden">
        <div className="p-8 pb-4 text-center">
            <div className="flex justify-center mb-6">
                <div className="p-3 bg-white rounded-2xl shadow-sm">
                    <Logo />
                </div>
            </div>
          <h1 className="text-3xl font-black text-gray-800 tracking-tight mb-2">Password Reset</h1>
          <p className="text-gray-500 font-medium">No worries, it happens to the best of us!</p>
        </div>

        <CardContent className="p-8 pt-0">
          {!isSubmitted ? (
            <form onSubmit={handleSubmit} className="space-y-6">
              {error && (
                <div className="p-4 bg-red-50 border border-red-100 text-red-600 rounded-2xl text-sm font-bold text-center">
                  {error}
                </div>
              )}
              
              <div className="relative group">
                <div className="absolute inset-y-0 left-4 flex items-center pointer-events-none">
                  <Mail className="w-5 h-5 text-gray-400 group-focus-within:text-primary-500 transition-colors" />
                </div>
                <input 
                  type="email" 
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full pl-12 pr-4 py-4 rounded-2xl bg-gray-50/50 border-2 border-transparent focus:border-primary-400 focus:bg-white focus:outline-none transition-all font-medium text-gray-700 placeholder:text-gray-400"
                  placeholder="Enter your registered email"
                />
              </div>

              <Button 
                type="submit" 
                size="lg" 
                isLoading={isLoading} 
                className="w-full py-6 rounded-2xl text-lg font-black shadow-lg bg-gradient-to-r from-primary-600 to-primary-500"
              >
                Send Recovery Link
              </Button>
              
              <div className="text-center pt-2">
                <Link href="/login" className="text-gray-500 hover:text-primary-600 font-bold flex items-center justify-center gap-2 group transition-colors">
                  <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" /> Back to Login
                </Link>
              </div>
            </form>
          ) : (
            <div className="flex flex-col items-center gap-6 py-6 animate-in fade-in zoom-in duration-700">
              <div className="w-20 h-20 bg-green-100 rounded-[30px] flex items-center justify-center text-green-600 shadow-inner">
                <CheckCircle2 className="w-10 h-10" />
              </div>
              <div className="text-center space-y-2">
                <h3 className="text-2xl font-black text-gray-800">Check Your Inbox</h3>
                <p className="text-gray-600 font-medium leading-relaxed px-4">
                  We've sent a magic link to <span className="text-primary-600 font-bold">{email}</span>. Click it to reset your password!
                </p>
              </div>
              <div className="w-full pt-4">
                <Link href="/login">
                  <Button variant="outline" className="w-full py-5 rounded-2xl border-2 font-bold text-gray-600 hover:bg-gray-50">
                    Return to Login
                  </Button>
                </Link>
              </div>
            </div>
          )}
        </CardContent>
      </Card>
      
      {/* Decorative Floating Elements */}
      <Sparkles className="absolute top-[25%] left-[10%] w-8 h-8 text-primary-200 animate-pulse opacity-50" />
      <Brain className="absolute bottom-[20%] right-[15%] w-10 h-10 text-purple-200 animate-bounce opacity-50" />
    </div>
  );
}
