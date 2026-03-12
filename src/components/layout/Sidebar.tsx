"use client";

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { BookOpen, Video, Home, CheckSquare, BarChart, Users, Settings } from 'lucide-react';
import { useAuth } from '@/context/AuthContext';

export const Sidebar = () => {
  const pathname = usePathname();
  const { user } = useAuth();

  const getLinks = () => {
    const role = user?.role || 'student';
    const base = `/dashboard/${role}`;

    const studentLinks = [
      { name: 'My Dashboard', href: base, icon: Home },
      { name: 'My Courses', href: `${base}/courses`, icon: BookOpen },
      { name: 'Live Classes', href: `${base}/live-classes`, icon: Video },
    ];

    const teacherLinks = [
      { name: 'Dashboard', href: base, icon: Home },
      { name: 'Manage Courses', href: `${base}/courses`, icon: BookOpen },
      { name: 'Live Sessions', href: `${base}/live-classes`, icon: Video },
      { name: 'Assignments', href: `${base}/assignments`, icon: CheckSquare },
    ];

    const adminLinks = [
      { name: 'Overview', href: base, icon: BarChart },
      { name: 'Manage Users', href: `${base}/users`, icon: Users },
      { name: 'Course Approvals', href: `${base}/courses`, icon: BookOpen },
      { name: 'Settings', href: `${base}/settings`, icon: Settings },
    ];

    if (role === 'admin') return adminLinks;
    if (role === 'teacher') return teacherLinks;
    return studentLinks;
  };

  const links = getLinks();

  return (
    <aside className="w-64 bg-white/60 backdrop-blur-xl border-r-4 border-primary-200 p-6 flex flex-col gap-4 min-h-[calc(100vh-5rem)]">
      {links.map((link) => {
        const isActive = pathname === link.href;
        const Icon = link.icon;
        
        return (
          <Link 
            key={link.name} 
            href={link.href}
            className={`flex items-center gap-3 px-4 py-3 rounded-2xl font-bold transition-all ${
              isActive 
                ? 'bg-primary-500 text-white shadow-md' 
                : 'text-gray-600 hover:bg-primary-100 hover:text-primary-600'
            }`}
          >
            <Icon className="w-5 h-5" />
            {link.name}
          </Link>
        )
      })}
    </aside>
  );
};
