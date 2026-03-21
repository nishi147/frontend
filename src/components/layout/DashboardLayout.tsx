"use client";
import React, { useEffect } from 'react';
import { Header } from './Header';
import { Sidebar } from './Sidebar';
import { useAuth } from '@/context/AuthContext';
import { useRouter } from 'next/navigation';
import { Loader2, X } from 'lucide-react';

export const DashboardLayout = ({ children, allowedRoles }: { children: React.ReactNode, allowedRoles?: string[] }) => {
  const { user, loading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!loading) {
      if (!user) {
        router.push('/login');
      } else if (allowedRoles && !allowedRoles.includes(user.role)) {
        if (user.role === 'sales' || user.role === 'admin') {
            router.push(user.role === 'sales' ? '/sales-dashboard' : '/dashboard/admin');
        } else {
            router.push(`/dashboard/${user.role}`);
        }
      }
    }
  }, [user, loading, router, allowedRoles]);

  if (loading || !user) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <Loader2 className="w-12 h-12 text-primary-500 animate-spin" />
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col bg-background relative overflow-x-hidden">
      {/* Playful background blobs */}
      <div className="fixed top-[-10%] left-[-10%] w-96 h-96 bg-primary-200 rounded-full mix-blend-multiply filter blur-3xl opacity-30 pointer-events-none" />
      <div className="fixed bottom-[-10%] right-[-10%] w-96 h-96 bg-secondary-200 rounded-full mix-blend-multiply filter blur-3xl opacity-30 pointer-events-none" />

      <Header />
      
      <div className="flex flex-col md:flex-row flex-1 relative z-[110] w-full">
        <Sidebar />
        <main className="flex-1 p-3 sm:p-6 md:p-8 lg:p-12 pb-24 md:pb-8 w-full">
          {/* Mobile Back Button */}
          <button 
            onClick={() => router.push('/')}
            className="md:hidden mb-6 p-3 bg-white/80 backdrop-blur-sm shadow-xl border-2 border-primary-50 border-gray-100 rounded-2xl text-gray-600 hover:text-primary-500 transition-all flex items-center gap-3 font-black text-[10px] uppercase tracking-[0.2em] animate-in slide-in-from-top duration-500"
          >
            <X size={16} strokeWidth={3} className="text-secondary-500" /> Back to Home
          </button>
          {children}
        </main>
      </div>
    </div>
  );
};
