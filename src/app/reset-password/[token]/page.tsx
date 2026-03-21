"use client";

import React, { useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { Card, CardContent } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import axios from 'axios';
import { Logo } from '@/components/ui/Logo';
import { Lock, CheckCircle2, ShieldCheck, Sparkles, Brain, ArrowRight } from 'lucide-react';

export default function ResetPasswordPage() {
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);
  
  const params = useParams();
  const router = useRouter();
  const token = params.token;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (password !== confirmPassword) {
      setError('Passwords do not match');
      return;
    }

    if (password.length < 6) {
      setError('Password must be at least 6 characters');
      return;
    }

    setIsLoading(true);

    try {
      const res = await axios.put(`${process.env.NEXT_PUBLIC_API_URL}/api/auth/resetpassword/${token}`, { password });
      if (res.data.success) {
        setSuccess(true);
        setTimeout(() => {
          router.push('/login');
        }, 3000);
      }
    } catch (err: any) {
      setError(err.response?.data?.message || 'Invalid or expired token');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="relative min-h-screen flex items-center justify-center p-4 overflow-hidden bg-white">
      {/* Background Decor */}
      <div className="absolute inset-0 z-0">
        <div className="absolute top-[-20%] left-[-10%] w-[60%] h-[60%] bg-blue-50/60 rounded-full blur-[130px]" />
        <div className="absolute bottom-[-20%] right-[-10%] w-[60%] h-[60%] bg-indigo-50/60 rounded-full blur-[130px]" />
      </div>

      <Card className="relative z-10 w-full max-w-lg bg-white/70 backdrop-blur-xl border-0 shadow-[0_20px_60px_rgba(0,0,0,0.12)] rounded-[40px] overflow-hidden">
        <div className="p-8 pb-4 text-center">
            <div className="flex justify-center mb-6">
                <div className="p-3 bg-white rounded-2xl shadow-sm">
                    <Logo />
                </div>
            </div>
          <h1 className="text-3xl font-black text-gray-800 tracking-tight mb-2">Secure Reset</h1>
          <p className="text-gray-500 font-medium">Create a strong new password</p>
        </div>

        <CardContent className="p-8 pt-0">
          {!success ? (
            <form onSubmit={handleSubmit} className="space-y-6">
              {error && (
                <div className="p-4 bg-red-50 border border-red-100 text-red-600 rounded-2xl text-sm font-bold text-center">
                  {error}
                </div>
              )}
              
              <div className="relative group">
                <div className="absolute inset-y-0 left-4 flex items-center pointer-events-none">
                  <Lock className="w-5 h-5 text-gray-400 group-focus-within:text-primary-500 transition-colors" />
                </div>
                <input 
                  type="password" 
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full pl-12 pr-4 py-4 rounded-2xl bg-gray-50/50 border-2 border-transparent focus:border-primary-400 focus:bg-white focus:outline-none transition-all font-medium text-gray-700 placeholder:text-gray-400"
                  placeholder="New Password"
                />
              </div>

              <div className="relative group">
                <div className="absolute inset-y-0 left-4 flex items-center pointer-events-none">
                  <ShieldCheck className="w-5 h-5 text-gray-400 group-focus-within:text-primary-500 transition-colors" />
                </div>
                <input 
                  type="password" 
                  required
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  className="w-full pl-12 pr-4 py-4 rounded-2xl bg-gray-50/50 border-2 border-transparent focus:border-primary-400 focus:bg-white focus:outline-none transition-all font-medium text-gray-700 placeholder:text-gray-400"
                  placeholder="Confirm New Password"
                />
              </div>

              <Button 
                type="submit" 
                size="lg" 
                isLoading={isLoading} 
                className="w-full py-6 rounded-2xl text-lg font-black shadow-lg bg-gradient-to-r from-blue-600 to-indigo-600"
              >
                Update Password <ArrowRight className="w-5 h-5 ml-2 inline" />
              </Button>
            </form>
          ) : (
            <div className="flex flex-col items-center gap-6 py-6 animate-in fade-in zoom-in duration-700">
              <div className="w-20 h-20 bg-green-100 rounded-[30px] flex items-center justify-center text-green-600 shadow-inner">
                <CheckCircle2 className="w-10 h-10" />
              </div>
              <div className="text-center space-y-2">
                <h3 className="text-2xl font-black text-gray-800">Success!</h3>
                <p className="text-gray-600 font-medium leading-relaxed px-4">
                  Your password has been updated. You're being redirected to login...
                </p>
              </div>
              <div className="w-full h-1.5 bg-gray-100 rounded-full overflow-hidden mt-4">
                  <div className="h-full bg-green-500 animate-progress-fill" style={{ width: '100%' }} />
              </div>
            </div>
          )}
        </CardContent>
      </Card>
      
      {/* Decorative Floating Elements */}
      <Sparkles className="absolute top-[20%] right-[12%] w-10 h-10 text-blue-200 animate-pulse opacity-50" />
      <Brain className="absolute bottom-[25%] left-[12%] w-12 h-12 text-indigo-200 animate-bounce opacity-50 shadow-sm" />
    </div>
  );
}
