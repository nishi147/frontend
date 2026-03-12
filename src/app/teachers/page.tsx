"use client";

import React from 'react';
import { Header } from '@/components/layout/Header';
import { Card, CardContent } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import Link from 'next/link';
import { useAuth } from '@/context/AuthContext';
import { useRouter } from 'next/navigation';

export default function TeachersPage() {
  const { user } = useAuth();
  const router = useRouter();

  // If already a teacher, maybe redirect to dashboard
  const handleJoinClick = () => {
    if (user?.role === 'teacher') {
      router.push('/dashboard/teacher');
    } else {
      router.push('/register?role=teacher');
    }
  };

  return (
    <div className="min-h-screen bg-background flex flex-col font-sans">
      <Header />
      
      <main className="flex-1">
        {/* Hero Section */}
        <section className="py-20 px-4 bg-gradient-to-r from-secondary-50 to-white overflow-hidden relative">
          <div className="absolute top-0 right-0 w-64 h-64 bg-secondary-200 rounded-full blur-3xl opacity-30 -mr-32 -mt-32" />
          <div className="container mx-auto text-center relative z-10">
            <span className="bg-secondary-100 text-secondary-600 px-6 py-2 rounded-full font-black text-sm tracking-widest uppercase mb-6 inline-block">
              Shape the Future 🍎
            </span>
            <h1 className="text-5xl md:text-7xl font-black text-gray-800 mb-8 leading-tight">
              Teach at <span className="text-secondary-500">RUZANN</span>
            </h1>
            <p className="text-xl md:text-2xl text-gray-600 font-bold mb-10 max-w-2xl mx-auto">
              Join our community of amazing educators and inspire children aged 5-18 across the globe.
            </p>
            <Button size="lg" variant="secondary" onClick={handleJoinClick} className="px-12 py-8 text-2xl shadow-xl shadow-secondary-200 animate-bounce-slow">
              Become a Teacher 🚀
            </Button>
          </div>
        </section>

        {/* Why Teach With Us */}
        <section className="py-24 container mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <Card hoverEffect className="p-8 text-center border-none bg-blue-50">
              <div className="text-5xl mb-6">🌎</div>
              <h3 className="text-2xl font-black mb-4 text-blue-800">Global Reach</h3>
              <p className="font-bold text-blue-600/70">Connect with students from different cultures and backgrounds.</p>
            </Card>
            <Card hoverEffect className="p-8 text-center border-none bg-green-50">
              <div className="text-5xl mb-6">🛠️</div>
              <h3 className="text-2xl font-black mb-4 text-green-800">Advanced Tools</h3>
              <p className="font-bold text-green-600/70">Use our Magic Code Editor and live session tools for seamless teaching.</p>
            </Card>
            <Card hoverEffect className="p-8 text-center border-none bg-purple-50">
              <div className="text-5xl mb-6">💸</div>
              <h3 className="text-2xl font-black mb-4 text-purple-800">Great Earnings</h3>
              <p className="font-bold text-purple-600/70">Earn competitively while doing what you love, on your own schedule.</p>
            </Card>
          </div>
        </section>

        {/* Showcase / CTA */}
        <section className="py-20 bg-gray-900 text-white text-center rounded-[3rem] mx-4 mb-20">
          <h2 className="text-4xl md:text-5xl font-black mb-8">Ready to start your adventure?</h2>
          <p className="text-xl text-gray-400 mb-12 max-w-xl mx-auto font-bold">
            Sign up today and create your first course. Our team will guide you through every step!
          </p>
          <Button variant="secondary" size="lg" onClick={handleJoinClick} className="px-10">Start Teaching Now</Button>
        </section>
      </main>

      <footer className="bg-white py-12 border-t-2 border-gray-100 text-center">
        <p className="text-gray-400 font-bold">© 2026 RUZANN EdTech. All Rights Reserved.</p>
      </footer>
    </div>
  );
}
