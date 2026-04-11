"use client";

import React, { useState, useRef, useEffect } from 'react';
import { Card, CardContent } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import api from '@/utils/api';
import { Logo } from '@/components/ui/Logo';
import { Mail, ArrowLeft, CheckCircle2, Sparkles, Brain, Lock, Eye, EyeOff, RefreshCw } from 'lucide-react';

type Step = 'email' | 'otp' | 'password' | 'success';

export default function ForgotPasswordPage() {
  const router = useRouter();
  const [step, setStep] = useState<Step>('email');
  const [email, setEmail] = useState('');
  const [otp, setOtp] = useState(['', '', '', '', '', '']);
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [resendTimer, setResendTimer] = useState(0);
  const otpRefs = useRef<(HTMLInputElement | null)[]>([]);

  // Countdown timer for resend
  useEffect(() => {
    if (resendTimer > 0) {
      const t = setTimeout(() => setResendTimer(r => r - 1), 1000);
      return () => clearTimeout(t);
    }
  }, [resendTimer]);

  // Step 1: Send OTP
  const handleSendOtp = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);
    try {
      const res = await api.post('/api/auth/send-otp', { email });
      if (res.data.success) {
        setStep('otp');
        setResendTimer(60);
      }
    } catch (err: any) {
      setError(err.response?.data?.message || 'Could not send OTP. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  // OTP input handling
  const handleOtpChange = (index: number, value: string) => {
    if (value.length > 1) return;
    if (!/^\d*$/.test(value)) return;
    const updated = [...otp];
    updated[index] = value;
    setOtp(updated);
    if (value && index < 5) {
      otpRefs.current[index + 1]?.focus();
    }
  };

  const handleOtpKeyDown = (index: number, e: React.KeyboardEvent) => {
    if (e.key === 'Backspace' && !otp[index] && index > 0) {
      otpRefs.current[index - 1]?.focus();
    }
  };

  const handleOtpPaste = (e: React.ClipboardEvent) => {
    const pasted = e.clipboardData.getData('text').replace(/\D/g, '').slice(0, 6);
    if (pasted.length === 6) {
      setOtp(pasted.split(''));
      otpRefs.current[5]?.focus();
    }
  };

  // Step 2: Verify OTP
  const handleVerifyOtp = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    const otpString = otp.join('');
    if (otpString.length < 6) {
      setError('Please enter the complete 6-digit OTP.');
      return;
    }
    setIsLoading(true);
    // Just move to password step — we verify OTP + reset together
    setIsLoading(false);
    setStep('password');
  };

  // Step 3: Reset Password
  const handleResetPassword = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (newPassword.length < 6) {
      setError('Password must be at least 6 characters.');
      return;
    }
    if (newPassword !== confirmPassword) {
      setError('Passwords do not match.');
      return;
    }

    setIsLoading(true);
    try {
      const res = await api.post('/api/auth/verify-otp-reset', {
        email,
        otp: otp.join(''),
        newPassword
      });
      if (res.data.success) {
        setStep('success');
        setTimeout(() => router.push('/login'), 3000);
      }
    } catch (err: any) {
      setError(err.response?.data?.message || 'Failed to reset password. OTP may have expired.');
      // Go back to OTP step if reset fails
      setStep('otp');
      setOtp(['', '', '', '', '', '']);
    } finally {
      setIsLoading(false);
    }
  };

  // Resend OTP
  const handleResend = async () => {
    if (resendTimer > 0) return;
    setError('');
    setOtp(['', '', '', '', '', '']);
    setIsLoading(true);
    try {
      await api.post('/api/auth/send-otp', { email });
      setResendTimer(60);
    } catch (err: any) {
      setError(err.response?.data?.message || 'Could not resend OTP.');
    } finally {
      setIsLoading(false);
    }
  };

  const stepLabel = { email: 1, otp: 2, password: 3, success: 3 };
  const otpFilled = otp.join('').length === 6;

  return (
    <div className="relative min-h-screen flex items-center justify-center p-4 overflow-hidden bg-white">
      {/* Background */}
      <div className="absolute inset-0 z-0">
        <div className="absolute top-[-15%] right-[-10%] w-[50%] h-[50%] bg-indigo-50/60 rounded-full blur-[120px]" />
        <div className="absolute bottom-[-15%] left-[-10%] w-[50%] h-[50%] bg-purple-50/60 rounded-full blur-[120px]" />
      </div>
      <Sparkles className="absolute top-[25%] left-[10%] w-8 h-8 text-primary-200 animate-pulse opacity-50" />
      <Brain className="absolute bottom-[20%] right-[15%] w-10 h-10 text-purple-200 animate-bounce opacity-50" />

      <Card className="relative z-10 w-full max-w-lg bg-white/70 backdrop-blur-xl border-0 shadow-[0_20px_50px_rgba(0,0,0,0.1)] rounded-[40px] overflow-hidden">
        <div className="p-6 pb-0 text-center">
          <div className="flex justify-center mb-3">
            <div className="p-2 bg-white rounded-2xl shadow-sm">
              <Logo size="small" />
            </div>
          </div>

          {/* Step Indicator */}
          {step !== 'success' && (
            <div className="flex items-center justify-center gap-2 mb-4">
              {[1, 2, 3].map(s => (
                <React.Fragment key={s}>
                  <div className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-black transition-all ${
                    stepLabel[step] >= s ? 'bg-primary-500 text-white shadow-md' : 'bg-gray-100 text-gray-400'
                  }`}>{s}</div>
                  {s < 3 && <div className={`h-0.5 w-8 rounded-full transition-all ${stepLabel[step] > s ? 'bg-primary-400' : 'bg-gray-100'}`} />}
                </React.Fragment>
              ))}
            </div>
          )}

          <h1 className="text-2xl font-black text-gray-900 tracking-tight mb-1">
            {step === 'email' && 'Forgot Password?'}
            {step === 'otp' && 'Enter OTP'}
            {step === 'password' && 'New Password'}
            {step === 'success' && 'All Done! 🎉'}
          </h1>
          <p className="text-gray-500 font-medium text-sm mb-4">
            {step === 'email' && 'Enter your email and we\'ll send a 6-digit OTP'}
            {step === 'otp' && <>OTP sent to <span className="text-primary-600 font-bold">{email}</span></>}
            {step === 'password' && 'Choose a strong new password'}
            {step === 'success' && 'Your password has been reset. Redirecting to login...'}
          </p>
        </div>

        <CardContent className="p-8 pt-2">
          {/* Error */}
          {error && (
            <div className="p-3 mb-4 bg-red-50 border border-red-100 text-red-600 rounded-2xl text-sm font-bold text-center">
              {error}
            </div>
          )}

          {/* STEP 1: Email */}
          {step === 'email' && (
            <form onSubmit={handleSendOtp} className="space-y-5">
              <div className="relative group">
                <div className="absolute inset-y-0 left-4 flex items-center pointer-events-none">
                  <Mail className="w-5 h-5 text-gray-400 group-focus-within:text-primary-500 transition-colors" />
                </div>
                <input
                  type="email"
                  required
                  value={email}
                  onChange={e => setEmail(e.target.value)}
                  className="w-full pl-12 pr-4 py-4 rounded-2xl bg-gray-50 border-2 border-transparent focus:border-primary-400 focus:bg-white focus:outline-none transition-all font-bold text-black placeholder:text-gray-400"
                  placeholder="Enter your registered email"
                />
              </div>
              <Button type="submit" size="lg" isLoading={isLoading} className="w-full py-5 rounded-2xl font-black text-base bg-gradient-to-r from-primary-600 to-primary-500 shadow-lg">
                Send OTP →
              </Button>
              <div className="text-center pt-1">
                <Link href="/login" className="text-gray-400 hover:text-primary-600 font-bold flex items-center justify-center gap-2 group transition-colors text-sm">
                  <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" /> Back to Login
                </Link>
              </div>
            </form>
          )}

          {/* STEP 2: OTP */}
          {step === 'otp' && (
            <form onSubmit={handleVerifyOtp} className="space-y-6">
              <div className="flex justify-center gap-2 sm:gap-3" onPaste={handleOtpPaste}>
                {otp.map((digit, i) => (
                  <input
                    key={i}
                    ref={el => { otpRefs.current[i] = el; }}
                    type="text"
                    inputMode="numeric"
                    maxLength={1}
                    value={digit}
                    onChange={e => handleOtpChange(i, e.target.value)}
                    onKeyDown={e => handleOtpKeyDown(i, e)}
                    className={`w-12 h-14 sm:w-14 sm:h-16 text-center text-2xl font-black rounded-2xl border-2 outline-none transition-all ${
                      digit ? 'border-primary-500 bg-primary-50 text-primary-700' : 'border-gray-200 bg-gray-50 text-gray-900'
                    } focus:border-primary-500 focus:bg-white`}
                  />
                ))}
              </div>

              <Button
                type="submit"
                size="lg"
                disabled={!otpFilled}
                isLoading={isLoading}
                className="w-full py-5 rounded-2xl font-black text-base bg-gradient-to-r from-primary-600 to-primary-500 shadow-lg disabled:opacity-50"
              >
                Verify OTP →
              </Button>

              <div className="flex items-center justify-between text-sm px-1">
                <button
                  type="button"
                  onClick={() => setStep('email')}
                  className="text-gray-400 hover:text-gray-700 font-bold flex items-center gap-1 transition-colors"
                >
                  <ArrowLeft className="w-3 h-3" /> Change email
                </button>
                <button
                  type="button"
                  onClick={handleResend}
                  disabled={resendTimer > 0}
                  className={`font-black flex items-center gap-1 transition-colors ${resendTimer > 0 ? 'text-gray-300 cursor-not-allowed' : 'text-primary-600 hover:text-primary-700'}`}
                >
                  <RefreshCw className="w-3 h-3" />
                  {resendTimer > 0 ? `Resend in ${resendTimer}s` : 'Resend OTP'}
                </button>
              </div>
            </form>
          )}

          {/* STEP 3: New Password */}
          {step === 'password' && (
            <form onSubmit={handleResetPassword} className="space-y-5">
              <div className="relative group">
                <div className="absolute inset-y-0 left-4 flex items-center pointer-events-none">
                  <Lock className="w-5 h-5 text-gray-400 group-focus-within:text-primary-500 transition-colors" />
                </div>
                <input
                  type={showPassword ? 'text' : 'password'}
                  required
                  value={newPassword}
                  onChange={e => setNewPassword(e.target.value)}
                  className="w-full pl-12 pr-12 py-4 rounded-2xl bg-gray-50 border-2 border-transparent focus:border-primary-400 focus:bg-white focus:outline-none transition-all font-bold text-black placeholder:text-gray-400"
                  placeholder="New password (min. 6 chars)"
                />
                <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute inset-y-0 right-4 flex items-center text-gray-400 hover:text-primary-500 transition-colors">
                  {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                </button>
              </div>

              <div className="relative group">
                <div className="absolute inset-y-0 left-4 flex items-center pointer-events-none">
                  <Lock className="w-5 h-5 text-gray-400 group-focus-within:text-primary-500 transition-colors" />
                </div>
                <input
                  type={showConfirm ? 'text' : 'password'}
                  required
                  value={confirmPassword}
                  onChange={e => setConfirmPassword(e.target.value)}
                  className="w-full pl-12 pr-12 py-4 rounded-2xl bg-gray-50 border-2 border-transparent focus:border-primary-400 focus:bg-white focus:outline-none transition-all font-bold text-black placeholder:text-gray-400"
                  placeholder="Confirm new password"
                />
                <button type="button" onClick={() => setShowConfirm(!showConfirm)} className="absolute inset-y-0 right-4 flex items-center text-gray-400 hover:text-primary-500 transition-colors">
                  {showConfirm ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                </button>
              </div>

              <Button type="submit" size="lg" isLoading={isLoading} className="w-full py-5 rounded-2xl font-black text-base bg-gradient-to-r from-primary-600 to-primary-500 shadow-lg">
                Reset Password ✓
              </Button>
            </form>
          )}

          {/* STEP 4: Success */}
          {step === 'success' && (
            <div className="flex flex-col items-center gap-6 py-4 animate-in fade-in zoom-in duration-700">
              <div className="w-20 h-20 bg-green-100 rounded-[30px] flex items-center justify-center text-green-600 shadow-inner">
                <CheckCircle2 className="w-10 h-10" />
              </div>
              <div className="text-center space-y-2">
                <h3 className="text-xl font-black text-gray-800">Password Updated!</h3>
                <p className="text-gray-500 font-medium text-sm">Redirecting you to login in a moment...</p>
              </div>
              <Link href="/login" className="w-full">
                <Button variant="outline" className="w-full py-5 rounded-2xl border-2 font-bold text-gray-600 hover:bg-gray-50">
                  Go to Login Now →
                </Button>
              </Link>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
