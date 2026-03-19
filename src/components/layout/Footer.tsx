"use client";

import React from 'react';
import Link from 'next/link';
import { Logo } from '../ui/Logo';
import { Facebook, Instagram, Twitter, Youtube, Phone, Mail, MapPin } from 'lucide-react';

export const Footer = () => {
  return (
    <footer className="w-full bg-navy-900 text-white pt-14 pb-8 px-4">
  <div className="max-w-7xl mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10 mb-12">
          {/* Column 1: Brand */}
          <div className="flex flex-col gap-6">
            <Link href="/">
              <Logo />
            </Link>
            <p className="text-gray-300 font-bold leading-relaxed max-w-xs">
              "We nurture a natural interest in coding and other learning areas, empowering your child to learn, explore, and reach their highest potential."
            </p>
            <div className="flex gap-4">
              {[Facebook, Instagram, Twitter, Youtube].map((Icon, i) => (
                <Link key={i} href="#" className="w-10 h-10 rounded-full bg-white/10 flex items-center justify-center hover:bg-primary-500 transition-all hover:-translate-y-1">
                  <Icon size={20} />
                </Link>
              ))}
            </div>
          </div>

          {/* Column 2: Quick Links */}
          <div>
            <h4 className="text-xl font-black mb-8 border-b-4 border-primary-500 pb-2 inline-block">Quick Links</h4>
            <ul className="flex flex-col gap-4 font-bold text-gray-400">
              {['Home', 'About Us', 'Courses', 'Reviews', 'Our Impact'].map(link => (
                <li key={link}>
                  <Link href="#" className="hover:text-white transition-colors flex items-center gap-2 group">
                    <span className="w-2 h-2 rounded-full bg-primary-500 opacity-0 group-hover:opacity-100 transition-opacity" />
                    {link}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Column 3: Categories */}
          <div>
            <h4 className="text-xl font-black mb-8 border-b-4 border-secondary-500 pb-2 inline-block">Categories</h4>
            <ul className="flex flex-col gap-4 font-bold text-gray-400">
              {['Coding', 'Robotics', 'Python', 'AI & ML', 'Data Science', 'Math', 'Science'].map(cat => (
                <li key={cat}>
                  <Link href="#" className="hover:text-white transition-colors flex items-center gap-2 group">
                    <span className="w-2 h-2 rounded-full bg-secondary-500 opacity-0 group-hover:opacity-100 transition-opacity" />
                    {cat}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Column 4: Contact Us */}
          <div className="flex flex-col gap-6">
            <h4 className="text-xl font-black mb-8 border-b-4 border-yellow-400 pb-2 inline-block">Contact Us</h4>
            <div className="flex flex-col gap-4 font-bold text-gray-400">
              <div className="flex items-center gap-4">
                <div className="w-10 h-10 rounded-xl bg-white/5 flex items-center justify-center text-yellow-400">
                  <Phone size={20} />
                </div>
                <span>+91 9960559894</span>
              </div>
              <div className="flex items-center gap-4">
                <div className="w-10 h-10 rounded-xl bg-white/5 flex items-center justify-center text-primary-400">
                  <Mail size={20} />
                </div>
                <span>support@ruzann.com</span>
              </div>
              <div className="flex items-center gap-4">
                <div className="w-10 h-10 rounded-xl bg-white/5 flex items-center justify-center text-secondary-400">
                  <MapPin size={20} />
                </div>
                <span>Pune, Maharashtra, India</span>
              </div>
            </div>
          </div>
        </div>

        {/* Board Tags & Copyright */}
        <div className="border-t border-white/10 pt-10 flex flex-col md:flex-row items-center justify-between gap-8">
          <div className="flex flex-wrap gap-4 justify-center">
            {['IB', 'ICSE', 'CBSE', 'IGCSE'].map(tag => (
              <span key={tag} className="px-6 py-2 rounded-full bg-white/5 border border-white/10 text-sm font-black tracking-widest hover:bg-white/10 cursor-default transition-all">
                {tag}
              </span>
            ))}
          </div>
          <p className="text-gray-500 font-bold">
            © {new Date().getFullYear()} RUZANN EdTech. Crafted with ✨ for future innovators.
          </p>
        </div>
      </div>
    </footer>
  );
};
