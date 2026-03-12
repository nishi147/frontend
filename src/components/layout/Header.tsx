"use client";

import React from 'react';
import Link from 'next/link';
import { useAuth } from '@/context/AuthContext';
import { useCurrency } from '@/context/CurrencyContext';
import { LogOut, User as UserIcon, BookOpen, Heart, PenTool, LayoutDashboard } from 'lucide-react';
import { Button } from '../ui/Button';
import { Logo } from '../ui/Logo';

export const Header = () => {
  const { user, logout } = useAuth();
  const { currency, setCurrency } = useCurrency();
  const [isCurrencyOpen, setIsCurrencyOpen] = React.useState(false);

  return (
    <header className="bg-white/90 backdrop-blur-md sticky top-0 z-50 border-b-4 border-yellow-400 shadow-sm transition-all duration-300">
      <div className="container mx-auto px-4 h-24 flex items-center justify-between">
        {/* Logo */}
        <Link href="/" className="flex items-center gap-3 pt-4">
          <Logo />
        </Link>

        {/* Desktop Navigation Group */}
        <div className="hidden md:flex items-center gap-8">
          <nav className="flex items-center gap-6 bg-gray-50/80 px-6 py-2 rounded-full border-2 border-gray-100 shadow-inner">
            <Link href="/" className="text-gray-600 font-bold hover:text-primary-600 hover:-translate-y-1 transition-all flex items-center gap-2">
              <Heart className="w-4 h-4" /> Home
            </Link>
            <Link href="/courses" className="text-gray-600 font-bold hover:text-secondary-600 hover:-translate-y-1 transition-all flex items-center gap-2">
              <BookOpen className="w-4 h-4" /> Courses
            </Link>
            <Link href="/about" className="text-gray-600 font-bold hover:text-accent-600 hover:-translate-y-1 transition-all flex items-center gap-2">
              <PenTool className="w-4 h-4" /> About
            </Link>
            <Link href="/blog" className="text-gray-600 font-bold hover:text-primary-600 hover:-translate-y-1 transition-all">
              Blog
            </Link>
            <Link href="/teachers" className="text-gray-600 font-bold hover:text-secondary-600 hover:-translate-y-1 transition-all">
              Teachers
            </Link>
          </nav>
          
          <div className="h-8 w-1 bg-gray-200 rounded-full"></div>
          
          <div className="relative">
            <button 
              onClick={() => setIsCurrencyOpen(!isCurrencyOpen)}
              className="flex items-center gap-2 bg-gray-50 px-4 py-2 rounded-xl border-2 border-gray-100 hover:border-primary-300 transition-all font-bold text-gray-700"
            >
              <span>{currency === 'INR' ? '₹' : currency === 'USD' ? '$' : currency === 'EUR' ? '€' : '£'} {currency}</span>
              <span className={`text-[10px] transition-transform ${isCurrencyOpen ? 'rotate-180' : ''}`}>▼</span>
            </button>
            
            {isCurrencyOpen && (
              <div className="absolute top-full mt-2 right-0 bg-white shadow-xl rounded-2xl border-2 border-gray-100 p-2 min-w-[120px] animate-in fade-in zoom-in duration-200">
                {(['INR', 'USD', 'EUR', 'GBP'] as const).map((curr) => (
                  <button
                    key={curr}
                    onClick={() => {
                      setCurrency(curr);
                      setIsCurrencyOpen(false);
                    }}
                    className={`w-full text-left px-4 py-2 rounded-xl font-bold transition-colors ${currency === curr ? 'bg-primary-50 text-primary-600' : 'hover:bg-gray-50 text-gray-500'}`}
                  >
                    {curr}
                  </button>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Global Actions */}
        <div className="flex items-center gap-4">
          {!user ? (
            <>
              <Link href="/login">
                <Button variant="ghost" className="font-bold border-2 border-transparent hover:border-gray-200 bg-white">Login</Button>
              </Link>
              <Link href="/register">
                <Button variant="primary" className="shadow-primary-500/50 hover:shadow-primary-500/80 animate-pulse">Sign Up Free</Button>
              </Link>
            </>
          ) : (
            <>
              <Link href={`/dashboard/${user.role}`}>
                <Button variant="outline" className="font-bold flex items-center gap-2 bg-white">
                  <LayoutDashboard className="w-5 h-5 text-primary-500" />
                  Dashboard
                </Button>
              </Link>
              <Button variant="ghost" onClick={logout} className="flex items-center gap-2 text-gray-500 hover:text-red-500 hover:bg-red-50">
                <LogOut className="w-4 h-4" />
              </Button>
            </>
          )}
        </div>
      </div>
    </header>
  );
};
