"use client";

import React, { useEffect, useState, Suspense } from 'react';
import { Card, CardContent } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import api from '@/utils/api';
import Link from 'next/link';
import { Logo } from '@/components/ui/Logo';
import { CheckCircle2, XCircle, Loader2 } from 'lucide-react';
import { useSearchParams } from 'next/navigation';

function VerifyEmailContent() {
  const [status, setStatus] = useState<'loading' | 'success' | 'error'>('loading');
  const [message, setMessage] = useState('Verifying your email...');
  const searchParams = useSearchParams();
  const token = searchParams.get('token');

  useEffect(() => {
    if (!token) {
      setStatus('error');
      setMessage('No verification token found in the URL. Please check your email link.');
      return;
    }

    const verifyToken = async () => {
      try {
        const res = await api.post('/api/auth/verify-email', { token });
        if (res.data.success) {
          setStatus('success');
          setMessage('Email verified successfully! Your account is now active.');
        }
      } catch (err: any) {
        setStatus('error');
        setMessage(err.response?.data?.message || 'Verification failed. The link may have expired or is invalid.');
      }
    };

    verifyToken();
  }, [token]);

  return (
    <Card className="relative z-10 w-full max-w-md bg-white/70 backdrop-blur-xl border-0 shadow-[0_20px_50px_rgba(0,0,0,0.1)] rounded-[40px] overflow-hidden">
      <div className="p-8 pb-4 text-center">
        <div className="flex justify-center mb-6">
          <div className="p-2 bg-white rounded-2xl shadow-sm">
            <Logo size="small" />
          </div>
        </div>

        {status === 'loading' && (
          <div className="flex flex-col items-center">
            <Loader2 className="w-16 h-16 text-blue-500 animate-spin mb-4" />
            <h1 className="text-2xl font-black text-black tracking-tight mb-2">Verifying Email</h1>
            <p className="text-gray-600 font-medium">{message}</p>
          </div>
        )}

        {status === 'success' && (
          <div className="flex flex-col items-center">
            <CheckCircle2 className="w-16 h-16 text-green-500 animate-bounce mb-4" />
            <h1 className="text-2xl font-black text-black tracking-tight mb-2">Verified!</h1>
            <p className="text-gray-600 font-medium mb-6">{message}</p>
            <Link href="/login" className="w-full">
              <Button size="lg" className="w-full py-6 rounded-2xl text-lg font-black shadow-[0_10px_30px_rgba(34,197,94,0.3)] bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700">
                Proceed to Login
              </Button>
            </Link>
          </div>
        )}

        {status === 'error' && (
          <div className="flex flex-col items-center">
            <XCircle className="w-16 h-16 text-red-500 animate-shake mb-4" />
            <h1 className="text-2xl font-black text-black tracking-tight mb-2">Verification Failed</h1>
            <p className="text-gray-600 font-medium mb-6">{message}</p>
            <Link href="/login" className="w-full">
              <Button size="lg" variant="outline" className="w-full py-6 rounded-2xl text-lg font-black bg-white">
                Back to Login
              </Button>
            </Link>
          </div>
        )}
      </div>
      <CardContent className="p-8 pt-0"></CardContent>
    </Card>
  );
}

export default function VerifyEmailPage() {
  return (
    <div className="relative min-h-screen flex items-center justify-center p-4 overflow-hidden bg-white">
      {/* Mesh Gradient Background */}
      <div className="absolute inset-0 z-0">
        <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-green-200/50 rounded-full blur-[100px] animate-pulse" />
        <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-blue-200/50 rounded-full blur-[100px] animate-pulse delay-700" />
      </div>

      <Suspense fallback={<div className="font-bold relative z-10">Loading...</div>}>
        <VerifyEmailContent />
      </Suspense>
    </div>
  );
}
