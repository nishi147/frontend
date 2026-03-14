"use client";

import React, { useState } from 'react';
import { Card, CardTitle, CardContent } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { useAuth } from '@/context/AuthContext';
import axios from 'axios';
import Link from 'next/link';

export default function RegisterPage() {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [role, setRole] = useState('student');
  const [error, setError] = useState('');
  const [successMsg, setSuccessMsg] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [profilePicture, setProfilePicture] = useState<File | null>(null);
  const { login } = useAuth();

  const handleSubmit = async (e: React.FormEvent) => {
  e.preventDefault();
  setError('');
  setSuccessMsg('');
  setIsLoading(true);

  try {
    const data = new FormData();
    data.append('name', name);
    data.append('email', email);
    data.append('password', password);
    data.append('role', role);

    if (profilePicture) {
      data.append('profilePicture', profilePicture);
    }

    const res = await axios.post(
      `${process.env.NEXT_PUBLIC_API_URL}/api/auth/register`,
      data
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
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-accent-200 via-primary-200 to-secondary-200 p-4">
      <Card className="w-full max-w-md bg-white/80">
        <div className="text-center mb-6">
          <CardTitle className="text-3xl text-secondary-600">Join RUZANN!</CardTitle>
          <p className="text-gray-500 mt-2">Create an account to start your journey</p>
        </div>

        <CardContent>
          <form onSubmit={handleSubmit} className="flex flex-col gap-4">
            {error && <div className="p-3 bg-red-100 text-red-600 rounded-xl text-center font-bold">{error}</div>}
            {successMsg && <div className="p-3 bg-green-100 text-green-700 rounded-xl text-center font-bold border-2 border-green-200 animate-pulse">{successMsg}</div>}
            
            <div className="flex gap-2 mb-2 p-1 bg-gray-100 rounded-full">
               <button 
                type="button"
                onClick={() => setRole('student')}
                className={`flex-1 py-2 rounded-full font-bold transition-all ${role === 'student' ? 'bg-primary-500 text-white shadow-md' : 'text-gray-500 hover:bg-gray-200'}`}
               >
                 Student
               </button>
               <button 
                type="button"
                onClick={() => setRole('teacher')}
                className={`flex-1 py-2 rounded-full font-bold transition-all ${role === 'teacher' ? 'bg-secondary-500 text-white shadow-md' : 'text-gray-500 hover:bg-gray-200'}`}
               >
                 Teacher
               </button>
            </div>

            {role === 'teacher' && (
              <div className="flex flex-col gap-1">
                <label className="font-bold text-gray-700 ml-2">Profile Picture (Optional)</label>
                <input 
                  type="file" 
                  accept="image/*"
                  onChange={(e) => setProfilePicture(e.target.files ? e.target.files[0] : null)}
                  className="w-full px-4 py-3 rounded-2xl border-2 border-gray-200 focus:border-secondary-500 focus:outline-none transition-colors file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-bold file:bg-secondary-50 file:text-secondary-600"
                />
              </div>
            )}

            <div className="flex flex-col gap-1">

              <label className="font-bold text-gray-700 ml-2">Full Name</label>
              <input 
                type="text" 
                required
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full px-4 py-3 rounded-2xl border-2 border-gray-200 focus:border-primary-500 focus:outline-none transition-colors"
                placeholder="John Doe"
              />
            </div>

            <div className="flex flex-col gap-1">
              <label className="font-bold text-gray-700 ml-2">Email</label>
              <input 
                type="email" 
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full px-4 py-3 rounded-2xl border-2 border-gray-200 focus:border-primary-500 focus:outline-none transition-colors"
                placeholder="you@example.com"
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

            <Button type="submit" size="lg" variant={role === 'student' ? 'primary' : 'secondary'} isLoading={isLoading} fullWidth>
              Create Account
            </Button>
            
            <p className="text-center text-gray-500 mt-4 font-bold">
              Already have an account? <Link href="/login" className="text-secondary-600 hover:underline">Login here</Link>
            </p>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
