"use client";

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { BookOpen, Video, Home, CheckSquare, BarChart, Users, Settings, UserCheck } from 'lucide-react';
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
      { name: 'My Projects', href: `${base}/projects`, icon: CheckSquare },
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
      { name: 'Cool Mentors', href: `${base}/mentors`, icon: UserCheck },
      { name: 'Manage Courses', href: `${base}/courses`, icon: BookOpen },
      { name: 'Course Categories', href: `${base}/categories`, icon: BookOpen },
      { name: 'Global Currencies', href: `${base}/currencies`, icon: BookOpen },
      { name: 'Workshops', href: `${base}/workshops`, icon: BookOpen },
      { name: 'Project Approvals', href: `${base}/projects`, icon: CheckSquare },
      { name: 'Live Sessions', href: `${base}/live-classes`, icon: Video },
      { name: 'Manage Blogs', href: `${base}/blogs`, icon: BookOpen },
      { name: 'Settings', href: `${base}/settings`, icon: Settings },
    ];

    if (role === 'admin') return adminLinks;
    if (role === 'teacher') return teacherLinks;
    return studentLinks;
  };

  const links = getLinks();

  return (
    <aside className="fixed bottom-0 left-0 right-0 z-[100] md:relative md:w-64 bg-white/90 backdrop-blur-3xl border-t md:border-t-0 md:border-r border-primary-100 shadow-[0_-15px_35px_rgba(0,0,0,0.1)] md:shadow-none transition-all">
      <div className="flex flex-row md:flex-col justify-start md:justify-start gap-1 p-2 md:p-6 md:min-h-[calc(100vh-5rem)] overflow-x-auto md:overflow-x-visible scrollbar-hide">
        {links.map((link) => {
          const isActive = pathname === link.href;
          const Icon = link.icon;
          
          return (
            <Link 
              key={link.name} 
              href={link.href}
              className={`flex flex-col md:flex-row items-center gap-1 md:gap-4 px-3 py-2 sm:px-5 md:py-4 rounded-2xl md:rounded-[1.5rem] font-black transition-all group shrink-0 md:shrink ${
                isActive 
                  ? 'bg-primary-500 text-white shadow-xl shadow-primary-200 -translate-y-1 md:translate-y-0' 
                  : 'text-gray-400 hover:bg-primary-50 hover:text-primary-600'
              }`}
            >
              <div className={`p-1.5 md:p-0 rounded-lg ${isActive ? 'bg-white/20' : ''}`}>
                <Icon className={`w-5 h-5 md:w-6 md:h-6 ${isActive ? 'animate-bounce' : 'group-hover:scale-125 transition-transform'}`} />
              </div>
              <span className="text-[9px] md:text-sm tracking-tight font-black uppercase md:capitalize whitespace-nowrap">{link.name}</span>
            </Link>
          )
        })}
      </div>
    </aside>
  );
};
