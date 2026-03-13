"use client";

import React from 'react';
import { Header } from '@/components/layout/Header';
import { Card, CardContent } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import Link from 'next/link';
import { CheckCircle, Sparkles, Rocket, ArrowRight, Mail } from 'lucide-react';

export default function PaymentSuccessPage() {
  return (
    <div className="min-h-screen bg-gray-50 flex flex-col font-sans">
      <Header />
      
      <main className="flex-1 flex items-center justify-center p-4 py-20 relative overflow-hidden">
        {/* Background Sparkles */}
        <div className="absolute top-20 left-20 text-yellow-400 animate-pulse"><Sparkles size={48} /></div>
        <div className="absolute bottom-20 right-20 text-primary-400 animate-bounce-slow"><Rocket size={64} /></div>
        <div className="absolute top-1/2 left-10 text-secondary-400 opacity-20"><Sparkles size={120} /></div>

        <Card className="w-full max-w-2xl bg-white rounded-[3rem] shadow-2xl border-4 border-green-100 overflow-hidden relative z-10 animate-in zoom-in duration-500">
           <div className="bg-green-500 p-12 text-center text-white relative">
              <div className="w-32 h-32 bg-white rounded-full flex items-center justify-center mx-auto mb-6 shadow-xl animate-bounce-slow">
                 <CheckCircle size={64} className="text-green-500" />
              </div>
              <h1 className="text-5xl font-black mb-4">Payment Successful! 🌈</h1>
              <p className="text-xl font-bold text-green-50">Welcome to the magical RUZANN family!</p>
           </div>
           
           <CardContent className="p-12">
              <div className="space-y-8">
                 <div className="flex items-start gap-6">
                    <div className="w-14 h-14 rounded-2xl bg-gray-100 flex items-center justify-center shrink-0">
                       <Mail size={24} className="text-primary-500" />
                    </div>
                    <div>
                       <h3 className="text-xl font-black text-gray-800 mb-2">Check Your Email</h3>
                       <p className="text-gray-500 font-bold leading-relaxed">We've sent a confirmation email with all the details and next steps to start your adventure.</p>
                    </div>
                 </div>

                 <div className="flex items-start gap-6">
                    <div className="w-14 h-14 rounded-2xl bg-gray-100 flex items-center justify-center shrink-0">
                       <Rocket size={24} className="text-secondary-500" />
                    </div>
                    <div>
                       <h3 className="text-xl font-black text-gray-800 mb-2">Start Learning</h3>
                       <p className="text-gray-500 font-bold leading-relaxed">Your course is now active in your student dashboard. You can start building magic right away!</p>
                    </div>
                 </div>

                 <div className="pt-8 border-t border-gray-100 flex flex-col sm:flex-row gap-4">
                    <Link href="/dashboard/student" className="flex-1">
                       <Button size="lg" fullWidth className="py-8 rounded-3xl text-xl font-black shadow-xl shadow-primary-200 flex items-center justify-center gap-3">
                          Go to Dashboard <ArrowRight />
                       </Button>
                    </Link>
                    <Link href="/courses" className="flex-1">
                       <Button variant="outline" size="lg" fullWidth className="py-8 rounded-3xl text-xl font-black flex items-center justify-center gap-2">
                          Browse More 📚
                       </Button>
                    </Link>
                 </div>
              </div>
           </CardContent>
           
           <div className="bg-gray-50 p-6 text-center text-gray-400 font-bold text-sm">
              Transaction ID: {Math.random().toString(36).substring(7).toUpperCase()} • RUZANN SAFE PAY
           </div>
        </Card>
      </main>
    </div>
  );
}
