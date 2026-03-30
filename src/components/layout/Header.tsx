"use client";

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';
import { LogOut, LayoutDashboard, Menu, X, ChevronDown, Sparkles, Star } from 'lucide-react';
import { Logo } from '../ui/Logo';
import { useIntroOffer } from '@/context/IntroOfferContext';
import api from '@/utils/api';
import { useCurrency } from '@/context/CurrencyContext';
import { MovingBanner } from './MovingBanner';

const CurrencySwitcher = ({ isMobile = false }) => {
  const { currency, setCurrency, availableCurrencies } = useCurrency();
  
  if (!availableCurrencies || availableCurrencies.length === 0) return null;
  
  return (
    <div className={`flex items-center gap-1 ${isMobile ? 'bg-gray-50 p-1 rounded-xl border border-gray-100' : ''}`}>
      {availableCurrencies.map((curr: string) => (
        <button
          key={curr}
          onClick={() => setCurrency(curr)}
          className={`px-2 py-1 rounded-lg text-[10px] font-black transition-all ${
            currency === curr 
              ? 'bg-slate-900 text-white shadow-sm' 
              : 'text-gray-400 hover:text-gray-600 hover:bg-gray-100'
          }`}
        >
          {curr}
        </button>
      ))}
    </div>
  );
};

export const Header = () => {
  const { user, logout } = useAuth();
  const { openIntroModal } = useIntroOffer();
  const pathname = usePathname();
  const [isMenuOpen, setIsMenuOpen] = React.useState(false);
  const [isCoursesOpen, setIsCoursesOpen] = React.useState(false);
  const [courses, setCourses] = useState<any[]>([]);

  // (Existing useEffect for fetching courses)
  useEffect(() => {
    const fetchCourses = async () => {
      try {
        const res = await api.get('/api/courses');
        if (res.data.success) {
          setCourses(res.data.data.slice(0, 5));
        }
      } catch (error) {
        console.error("Error fetching header courses:", error);
      }
    };
    fetchCourses();
  }, []);

  const navLinks = [
    { href: '/', label: 'Home' },
    { href: '/courses', label: 'Courses', hasDropdown: true },
    { href: '/about', label: 'About Us' },
    { href: '/blog', label: 'Blog' },
    { href: '/workshops', label: 'Workshops' },
    { href: '/contact', label: 'Contact' },
  ];

  const isActive = (href: string) => pathname === href;

  return (
    <>
      <MovingBanner />
      <header className="bg-white sticky top-0 z-[100] border-b border-gray-100 shadow-sm">
      <div className="max-w-7xl mx-auto px-4 md:px-6 h-28 lg:h-32 flex items-center justify-between gap-2 md:gap-6">

        {/* Logo */}
        <Link href="/" className="flex-shrink-0 flex items-center">
          <Logo />
        </Link>

        {/* Desktop Nav */}
        <nav className="hidden lg:flex items-center gap-1 flex-1 justify-center">
          {navLinks.map((link) => (
            <div 
              key={link.label} 
              className="relative group h-full flex items-center"
              onMouseEnter={() => link.hasDropdown && setIsCoursesOpen(true)}
              onMouseLeave={() => link.hasDropdown && setIsCoursesOpen(false)}
            >
              <Link
                href={link.href}
                className={`px-5 py-2 rounded-full text-sm font-semibold transition-all flex items-center gap-1 ${
                  isActive(link.href)
                    ? 'bg-[#EEE8FF] text-[#6C5CE7]'
                    : 'text-gray-600 hover:bg-gray-100 hover:text-gray-900'
                }`}
              >
                {link.label}
                {link.hasDropdown && <ChevronDown className={`w-4 h-4 transition-transform duration-300 ${isCoursesOpen ? 'rotate-180' : ''}`} />}
              </Link>

              {/* Courses Dropdown */}
              {link.hasDropdown && (
                <div className={`absolute top-full left-1/2 -translate-x-1/2 pt-2 w-[350px] transition-all duration-300 transform ${isCoursesOpen ? 'opacity-100 translate-y-0 pointer-events-auto' : 'opacity-0 -translate-y-4 pointer-events-none'}`}>
                  <div className="bg-white rounded-3xl shadow-2xl border border-gray-100 p-4 overflow-hidden">
                    <div className="mb-3 px-3">
                      <h4 className="text-[10px] font-black text-gray-400 uppercase tracking-widest flex items-center gap-2">
                        <Sparkles size={12} className="text-secondary-400" /> Featured Paths
                      </h4>
                    </div>
                    
                    <div className="flex flex-col gap-1">
                      {courses.length > 0 ? (
                        courses.map((course) => (
                          <Link 
                            key={course._id} 
                            href={`/courses/${course._id}`}
                            className="flex items-center gap-4 p-3 rounded-2xl hover:bg-gray-50 transition-colors group/item"
                          >
                            <div className={`w-12 h-12 rounded-xl flex items-center justify-center text-xl shadow-sm group-hover/item:scale-110 transition-transform overflow-hidden relative border border-white/20 ${
                              typeof course.category === 'object' && course.category?.name?.toLowerCase().includes('space') ? 'bg-indigo-600' :
                              typeof course.category === 'object' && course.category?.name?.toLowerCase().includes('programming') ? 'bg-cyan-500' :
                              'bg-primary-500'
                            }`}>
                              <span className="filter drop-shadow-sm">
                                {typeof course.category === 'object' ? course.category?.icon : '📚'}
                              </span>
                            </div>
                            <div className="flex-1 min-w-0">
                               <p className="font-bold text-gray-800 text-sm truncate">{course.title}</p>
                               <span className="text-[10px] font-black text-secondary-500 uppercase tracking-tighter">{typeof course.category === 'object' ? course.category?.name : course.category} • {course.numberOfSessions} Sessions</span>
                            </div>
                            <Star size={14} className="text-yellow-400 opacity-0 group-hover/item:opacity-100 transition-opacity" fill="currentColor" />
                          </Link>
                        ))
                      ) : (
                        <div className="p-4 text-center text-gray-400 text-xs font-bold italic">
                          Magic courses loading... ✨
                        </div>
                      )}
                    </div>

                    <div className="mt-4 pt-4 border-t border-gray-50 flex justify-center">
                      <Link href="/courses" className="text-xs font-black text-[#6C5CE7] hover:underline uppercase tracking-widest">
                        Explore All Courses →
                      </Link>
                    </div>
                  </div>
                </div>
              )}
            </div>
          ))}
        </nav>

        {/* Right Section (Desktop & Mobile Actions) */}
        <div className="flex items-center gap-2 md:gap-4 shrink-0">
          {/* Currency Switcher Temporarily Removed */}

          {/* Mobile Specific View: Currency Removed */}

          {!user ? (
            <div className="flex items-center gap-2">
              <Link href="/login" className="hidden lg:block">
                <button className="px-5 py-2 rounded-full border-2 border-[#6C5CE7] text-[#6C5CE7] text-sm font-bold hover:bg-[#EEE8FF] transition-all">
                  Login
                </button>
              </Link>
              <button 
                onClick={openIntroModal}
                className="px-4 py-2 sm:px-5 sm:py-2 rounded-full bg-[#FF7F50] hover:bg-[#e86e40] text-white text-[10px] sm:text-xs md:text-sm font-black transition-all shadow-md uppercase tracking-wide border-b-4 border-[#e86e40] active:border-b-0 active:translate-y-1"
              >
                Trial ₹1
              </button>
            </div>
          ) : (
            <div className="flex items-center gap-2">
              <Link href={`/dashboard/${user.role}`}>
                <button className="flex items-center gap-2 px-3 py-2 sm:px-5 sm:py-2 rounded-full border-2 border-[#6C5CE7] text-[#6C5CE7] text-xs sm:text-sm font-bold hover:bg-[#EEE8FF] transition-all">
                  <LayoutDashboard className="w-4 h-4" />
                  <span className="hidden sm:inline">Dashboard</span>
                </button>
              </Link>
              <button
                onClick={logout}
                className="hidden md:flex items-center gap-2 px-4 py-2 rounded-full text-sm font-bold text-gray-400 hover:text-red-500 hover:bg-red-50 transition-all"
              >
                <LogOut className="w-4 h-4" />
              </button>
            </div>
          )}

          {/* Mobile Toggle */}
          <div className="lg:hidden flex items-center gap-2 border-l pl-2 border-gray-100">
            <button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="p-2 rounded-xl text-gray-500 hover:bg-gray-100 transition-all border border-gray-100"
            >
              {isMenuOpen ? <X size={20} /> : <Menu size={20} />}
            </button>
          </div>
        </div>
      </div>

      {/* Container for mobile actions that need to fill space if needed */}
      {/* (Mobile Drawer logic below) */}

      {/* Mobile Drawer */}
      {isMenuOpen && (
        <div className="lg:hidden bg-white border-t border-gray-100 px-6 py-6 flex flex-col gap-3 max-h-[80vh] overflow-y-auto">
          {navLinks.map((link) => (
            <div key={link.label}>
              <Link
                href={link.href}
                onClick={() => setIsMenuOpen(false)}
                className={`px-4 py-3 rounded-xl text-base font-semibold flex items-center justify-between transition-all ${
                  isActive(link.href)
                    ? 'bg-[#EEE8FF] text-[#6C5CE7]'
                    : 'text-gray-700 hover:bg-gray-50'
                }`}
              >
                {link.label}
              </Link>
              {link.hasDropdown && (
                <div className="pl-6 mt-2 flex flex-col gap-2 border-l-2 border-gray-50 ml-6">
                   {courses.slice(0, 3).map(course => (
                     <Link key={course._id} href={`/courses/${course._id}`} onClick={() => setIsMenuOpen(false)} className="py-2 text-sm font-bold text-gray-500 hover:text-[#6C5CE7] transition-colors line-clamp-1">
                       🚀 {course.title}
                     </Link>
                   ))}
                </div>
              )}
            </div>
          ))}

          <div className="border-t border-gray-100 pt-4 mt-2 flex flex-col gap-3">
            {!user ? (
              <>
                <Link href="/login" onClick={() => setIsMenuOpen(false)}>
                  <button className="w-full py-3 rounded-xl border-2 border-[#6C5CE7] text-[#6C5CE7] font-bold hover:bg-[#EEE8FF] transition-all">
                    Login
                  </button>
                </Link>
                <button 
                  onClick={() => { openIntroModal(); setIsMenuOpen(false); }}
                  className="w-full py-3 rounded-xl bg-[#FF7F50] text-white font-bold hover:bg-[#e86e40] transition-all shadow"
                >
                  Book Trial ₹1
                </button>
              </>
            ) : (
              <>
                <Link href={`/dashboard/${user.role}`} onClick={() => setIsMenuOpen(false)}>
                  <button className="w-full py-3 rounded-xl border-2 border-[#6C5CE7] text-[#6C5CE7] font-bold hover:bg-[#EEE8FF] flex items-center justify-center gap-2 transition-all">
                    <LayoutDashboard className="w-5 h-5" /> Dashboard
                  </button>
                </Link>
                <button
                  onClick={() => { logout(); setIsMenuOpen(false); }}
                  className="w-full py-3 rounded-xl text-red-500 font-bold hover:bg-red-50 flex items-center justify-center gap-2 transition-all"
                >
                  <LogOut className="w-5 h-5" /> Logout
                </button>
              </>
            )}
          </div>
        </div>
      )}
    </header>
    </>
  );
};
