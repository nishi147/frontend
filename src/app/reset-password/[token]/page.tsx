"use client";

import React, { useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { Card, CardTitle, CardContent } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import axios from 'axios';

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
      const res = await axios.put(`/api/auth/resetpassword/${token}`, { password });
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
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-primary-200 via-secondary-200 to-accent-200 p-4">
      <Card className="w-full max-w-md bg-white/80">
        <div className="text-center mb-6">
          <div className="w-16 h-16 bg-primary-100 rounded-full flex items-center justify-center text-primary-600 font-bold text-3xl border-4 border-primary-500 mx-auto mb-4 animate-bounce-slow">
            R
          </div>
          <CardTitle className="text-3xl text-primary-600">New Password</CardTitle>
          <p className="text-gray-500 mt-2">Create a secure password for your account</p>
        </div>

        <CardContent>
          {!success ? (
            <form onSubmit={handleSubmit} className="flex flex-col gap-4">
              {error && <div className="p-3 bg-red-100 text-red-600 rounded-xl text-center font-bold text-sm">{error}</div>}
              
              <div className="flex flex-col gap-1">
                <label className="font-bold text-gray-700 ml-2">New Password</label>
                <input 
                  type="password" 
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full px-4 py-3 rounded-2xl border-2 border-gray-200 focus:border-primary-500 focus:outline-none transition-colors"
                  placeholder="••••••••"
                />
              </div>

              <div className="flex flex-col gap-1 mb-4">
                <label className="font-bold text-gray-700 ml-2">Confirm Password</label>
                <input 
                  type="password" 
                  required
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  className="w-full px-4 py-3 rounded-2xl border-2 border-gray-200 focus:border-primary-500 focus:outline-none transition-colors"
                  placeholder="••••••••"
                />
              </div>

              <Button type="submit" size="lg" isLoading={isLoading} fullWidth>
                Reset Password
              </Button>
            </form>
          ) : (
            <div className="flex flex-col items-center gap-4 py-4 animate-in fade-in zoom-in duration-500">
              <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center text-green-500 border-4 border-green-500">
                <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                </svg>
              </div>
              <h3 className="text-2xl font-black text-gray-800 text-center">Password Updated!</h3>
              <p className="text-center text-gray-600 font-medium">
                Your password has been successfully reset. Redirecting you to login...
              </p>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
