"use client";

import React, { useState } from 'react';
import { Card, CardTitle, CardContent } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import Link from 'next/link';

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState('');
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    // Simulate network delay for sending email
    await new Promise((resolve) => setTimeout(resolve, 1500));
    
    setIsLoading(false);
    setIsSubmitted(true);
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-primary-200 via-secondary-200 to-accent-200 p-4">
      <Card className="w-full max-w-md bg-white/80">
        <div className="text-center mb-6">
          <div className="w-16 h-16 bg-primary-100 rounded-full flex items-center justify-center text-primary-600 font-bold text-3xl border-4 border-primary-500 mx-auto mb-4 animate-bounce-slow">
            R
          </div>
          <CardTitle className="text-3xl text-primary-600">Password Reset</CardTitle>
          <p className="text-gray-500 mt-2">Enter your email to receive a reset link</p>
        </div>

        <CardContent>
          {!isSubmitted ? (
            <form onSubmit={handleSubmit} className="flex flex-col gap-4">
              <div className="flex flex-col gap-1 mb-4">
                <label className="font-bold text-gray-700 ml-2">Email Address</label>
                <input 
                  type="email" 
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full px-4 py-3 rounded-2xl border-2 border-gray-200 focus:border-primary-500 focus:outline-none transition-colors"
                  placeholder="student@ruzann.com"
                />
              </div>

              <Button type="submit" size="lg" isLoading={isLoading} fullWidth>
                Send Reset Link
              </Button>
              
              <div className="text-center mt-4">
                <Link href="/login" className="text-primary-600 hover:underline font-bold">
                  ← Back to Login
                </Link>
              </div>
            </form>
          ) : (
            <div className="flex flex-col items-center gap-4 py-4 animate-in fade-in zoom-in duration-500">
              <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center text-green-500 border-4 border-green-500">
                <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                </svg>
              </div>
              <h3 className="text-2xl font-black text-gray-800 text-center">Check your inbox!</h3>
              <p className="text-center text-gray-600 font-medium">
                If an account exists for <span className="font-bold text-primary-600">{email}</span>, we have sent a password reset link.
              </p>
              <div className="mt-4 w-full">
                <Link href="/login">
                  <Button variant="outline" fullWidth>
                    Return to Login
                  </Button>
                </Link>
              </div>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
