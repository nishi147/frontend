"use client";

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';
import { LogOut, LayoutDashboard, Menu, X } from 'lucide-react';
import { Logo } from '../ui/Logo';
import { useIntroOffer } from '@/context/IntroOfferContext';

export const Header = () => {
  const { user, logout } = useAuth();
  const { openIntroModal } = useIntroOffer();
  const pathname = usePathname();
  const [isMenuOpen, setIsMenuOpen] = React.useState(false);

  const navLinks = [
    { href: '/', label: 'Home' },
    { href: '/courses', label: 'Courses' },
    { href: '/about', label: 'About Us' },
    { href: '/workshops', label: 'Workshops' },
    { href: '/contact', label: 'Contact' },
  ];

  const isActive = (href: string) => pathname === href;

  return (
    <header className="bg-white sticky top-0 z-[100] border-b border-gray-100 shadow-sm">
      <div className="max-w-7xl mx-auto px-4 md:px-6 h-14 md:h-16 flex items-center justify-between gap-4 md:gap-6">

        {/* Logo */}
        <Link href="/" className="flex-shrink-0 flex items-center">
          <Logo />
        </Link>

        {/* Desktop Nav */}
        <nav className="hidden lg:flex items-center gap-1 flex-1 justify-center">
          {navLinks.map((link) => (
            <Link
              key={link.label}
              href={link.href}
              className={`px-5 py-2 rounded-full text-sm font-semibold transition-all ${
                isActive(link.href)
                  ? 'bg-[#EEE8FF] text-[#6C5CE7]'
                  : 'text-gray-600 hover:bg-gray-100 hover:text-gray-900'
              }`}
            >
              {link.label}
            </Link>
          ))}
        </nav>

        {/* Desktop Actions */}
        <div className="hidden lg:flex items-center gap-3 flex-shrink-0">
          {!user ? (
            <>
              <Link href="/login">
                <button className="px-5 py-2 rounded-full border-2 border-[#6C5CE7] text-[#6C5CE7] text-sm font-bold hover:bg-[#EEE8FF] transition-all">
                  Login
                </button>
              </Link>
              <button 
                onClick={openIntroModal}
                className="px-5 py-2 rounded-full bg-[#FF7F50] hover:bg-[#e86e40] text-white text-sm font-bold transition-all shadow-md"
              >
                Book Trial ₹1
              </button>
            </>
          ) : (
            <>
              <Link href={`/dashboard/${user.role}`}>
                <button className="flex items-center gap-2 px-5 py-2 rounded-full border-2 border-[#6C5CE7] text-[#6C5CE7] text-sm font-bold hover:bg-[#EEE8FF] transition-all">
                  <LayoutDashboard className="w-4 h-4" />
                  Dashboard
                </button>
              </Link>
              <button
                onClick={logout}
                className="flex items-center gap-2 px-4 py-2 rounded-full text-sm font-bold text-gray-400 hover:text-red-500 hover:bg-red-50 transition-all"
              >
                <LogOut className="w-4 h-4" />
              </button>
            </>
          )}
        </div>

        {/* Mobile Toggle */}
        <button
          onClick={() => setIsMenuOpen(!isMenuOpen)}
          className="lg:hidden p-2 rounded-xl text-gray-500 hover:bg-gray-100 transition-all"
        >
          {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
        </button>
      </div>

      {/* Mobile Drawer */}
      {isMenuOpen && (
        <div className="lg:hidden bg-white border-t border-gray-100 px-6 py-6 flex flex-col gap-3">
          {navLinks.map((link) => (
            <Link
              key={link.label}
              href={link.href}
              onClick={() => setIsMenuOpen(false)}
              className={`px-4 py-3 rounded-xl text-base font-semibold transition-all ${
                isActive(link.href)
                  ? 'bg-[#EEE8FF] text-[#6C5CE7]'
                  : 'text-gray-700 hover:bg-gray-50'
              }`}
            >
              {link.label}
            </Link>
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
  );
};
