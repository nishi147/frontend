"use client";

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { useAuth } from '@/context/AuthContext';
import { Header } from '@/components/layout/Header';
import { DashboardLayout } from '@/components/layout/DashboardLayout';
import { Card, CardContent } from '@/components/ui/Card';
import axios from 'axios';
import { Users, BookOpen, GraduationCap, IndianRupee, Video, Mail, UserCheck, UserX, Trash2, Settings } from 'lucide-react';

interface Analytics {
  totalStudents: number;
  totalTeachers: number;
  totalCourses: number;
  totalEnrollments: number;
  totalRevenue: number;
}

export default function AdminDashboard() {
  const { user, loading } = useAuth();
  const [analytics, setAnalytics] = useState<Analytics | null>(null);
  const [users, setUsers] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [analyticsRes, usersRes] = await Promise.all([
          axios.get('/api/users/analytics'),
          axios.get('/api/users')
        ]);
        if (analyticsRes.data.success) setAnalytics(analyticsRes.data.data);
        if (usersRes.data.success) setUsers(usersRes.data.data);
      } catch (err) {
        console.error("Failed to fetch dashboard data", err);
      } finally {
        setIsLoading(false);
      }
    };

    if (user?.role === 'admin') {
      fetchData();
    }
  }, [user]);

  if (loading || isLoading) {
    return <div className="min-h-screen flex items-center justify-center font-bold text-2xl text-accent-500 animate-pulse">Scanning Platform... 🔍</div>;
  }

  if (user?.role !== 'admin') {
    return <div className="min-h-screen flex items-center justify-center text-red-500 font-bold">Access Denied</div>;
  }

  return (
    <DashboardLayout>
      <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between mb-8 gap-6 px-2 sm:px-0">
        <div className="animate-in slide-in-from-left duration-700">
          <h1 className="text-3xl md:text-5xl font-black text-gray-800 tracking-tighter leading-none">
            Admin Control <span className="text-accent-500">Center</span> 🔐
          </h1>
          <p className="text-gray-500 font-bold mt-3 text-sm md:text-lg">Welcome back, Super Admin {user.name}!</p>
        </div>
        <div className="bg-white px-6 py-4 rounded-3xl shadow-xl border-2 border-accent-100 flex items-center gap-4 w-full lg:w-auto transform hover:rotate-1 transition-all">
           <div className="w-4 h-4 rounded-full bg-green-500 animate-pulse shadow-[0_0_15px_rgba(34,197,94,0.5)]"></div>
           <span className="font-black text-accent-700 uppercase tracking-widest text-xs md:text-sm">System Live & Secure</span>
        </div>
      </div>

      {/* Analytics Grid */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6 mb-12 px-2 sm:px-0">
        <StatCard 
          title="Students" 
          value={analytics?.totalStudents || 0} 
          icon={<Users className="w-6 h-6 md:w-8 md:h-8 text-blue-500" />} 
          color="bg-blue-50" 
        />
        <StatCard 
          title="Teachers" 
          value={analytics?.totalTeachers || 0} 
          icon={<GraduationCap className="w-6 h-6 md:w-8 md:h-8 text-purple-500" />} 
          color="bg-purple-50" 
        />
        <StatCard 
          title="Courses" 
          value={analytics?.totalCourses || 0} 
          icon={<BookOpen className="w-6 h-6 md:w-8 md:h-8 text-orange-500" />} 
          color="bg-orange-50" 
        />
        <StatCard 
          title="Revenue" 
          value={`₹${analytics?.totalRevenue || 0}`} 
          icon={<IndianRupee className="w-6 h-6 md:w-8 md:h-8 text-green-600" />} 
          color="bg-green-50" 
        />
      </div>

      {/* Management Links */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-8 mb-12 px-2 sm:px-0">
         <ManagementCard 
           title="User Management"
           description="Manage students and teacher accounts, approve new registrations."
           href="/dashboard/admin/users"
           icon={<Users className="w-10 h-10 md:w-12 md:h-12 text-primary-500" />}
         />
         <ManagementCard 
           title="Course Oversight"
           description="Review, approve, or edit courses created by teachers."
           href="/dashboard/admin/courses"
           icon={<BookOpen className="w-10 h-10 md:w-12 md:h-12 text-secondary-500" />}
         />
         <ManagementCard 
           title="Live Sessions"
           description="Manage webinars and live classes for all courses."
           href="/dashboard/admin/live-classes"
           icon={<Video className="w-10 h-10 md:w-12 md:h-12 text-accent-500" />}
         />
         <ManagementCard 
           title="Workshops"
           description="Create and manage live magical events and schedules."
           href="/dashboard/admin/workshops"
           icon={<Video className="w-10 h-10 md:w-12 md:h-12 text-green-500" />}
         />
         <ManagementCard 
           title="System Settings"
           description="Configure platform branding, payments, SEO, and comms."
           href="/dashboard/admin/settings"
           icon={<Settings className="w-10 h-10 md:w-12 md:h-12 text-primary-600" />}
         />
      </div>

      {/* User Overview Section */}
      <div className="mt-12 mb-8 px-4 sm:px-0">
        <h2 className="text-2xl md:text-3xl font-black text-gray-800">Recent Users 👥</h2>
        <p className="text-gray-400 font-bold mt-1 uppercase text-[10px] tracking-[0.2em]">Platform Access Monitoring</p>
      </div>
      
      {/* Desktop Table View */}
      <div className="hidden md:block bg-white rounded-[2rem] shadow-2xl overflow-hidden border border-gray-100 mb-12 transform hover:scale-[1.005] transition-all duration-500 mx-1">
        <div className="overflow-x-auto scrollbar-hide font-sans">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-gray-50/80 border-b border-gray-100 font-black text-gray-400 uppercase text-xs tracking-[0.2em] px-8">
                <th className="px-8 py-6">Identity</th>
                <th className="px-8 py-6">Privileges</th>
                <th className="px-8 py-6 text-right">Verification</th>
              </tr>
            </thead>
            <tbody>
              {users.map((u: any) => (
                <tr key={u._id} className="border-b border-gray-50 hover:bg-primary-50/30 transition-all group">
                  <td className="px-8 py-6">
                    <div className="flex items-center gap-4">
                      <div className={`w-12 h-12 rounded-2xl flex items-center justify-center text-white font-black text-lg ${u.role === 'teacher' ? 'bg-secondary-500' : u.role === 'admin' ? 'bg-accent-500' : 'bg-primary-500'}`}>
                        {u.name[0]}
                      </div>
                      <div className="min-w-0">
                        <p className="font-black text-gray-800 truncate">{u.name}</p>
                        <p className="text-gray-400 flex items-center gap-1 text-xs font-bold truncate tracking-tight"><Mail className="w-3 h-3" /> {u.email}</p>
                      </div>
                    </div>
                  </td>
                  <td className="px-8 py-6 font-bold uppercase tracking-widest text-[10px]">
                     <span className={`px-3 py-1.5 rounded-xl font-black ${u.role === 'teacher' ? 'text-secondary-600 bg-secondary-50' : u.role === 'admin' ? 'text-accent-600 bg-accent-50' : 'text-primary-600 bg-primary-50'}`}>
                        {u.role}
                     </span>
                  </td>
                  <td className="px-8 py-6 text-right font-black">
                    {u.role === 'teacher' ? (
                      u.isApprovedTeacher ? (
                        <span className="text-green-500 flex items-center justify-end gap-2 text-xs"><UserCheck className="w-4 h-4" /> Rooted</span>
                      ) : (
                        <span className="text-amber-500 flex items-center justify-end gap-2 text-xs animate-pulse tracking-tighter"><UserX className="w-4 h-4" /> Pending Approval</span>
                      )
                    ) : u.role === 'student' ? (
                      u.isApprovedStudent ? (
                        <span className="text-green-500 flex items-center justify-end gap-2 text-xs"><UserCheck className="w-4 h-4" /> Verified Identity</span>
                      ) : (
                        <span className="text-amber-500 flex items-center justify-end gap-2 text-xs animate-pulse tracking-tighter"><UserX className="w-4 h-4" /> On Platform Waitlist</span>
                      )
                    ) : (
                      <span className="text-gray-400">—</span>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Mobile Card View */}
      <div className="md:hidden space-y-4 mb-24 px-3">
        {users.map((u: any) => (
          <div key={u._id} className="bg-white p-6 rounded-[2rem] shadow-xl border border-gray-100 flex flex-col gap-4">
             <div className="flex items-center gap-4">
                <div className={`w-14 h-14 rounded-2xl flex items-center justify-center text-white font-black text-xl flex-shrink-0 ${u.role === 'teacher' ? 'bg-secondary-500 shadow-lg' : u.role === 'admin' ? 'bg-accent-500 shadow-lg' : 'bg-primary-500 shadow-lg'}`}>
                  {u.name[0]}
                </div>
                <div className="min-w-0">
                  <p className="font-black text-gray-800 text-lg truncate tracking-tight">{u.name}</p>
                  <p className="text-gray-400 text-[11px] font-bold truncate opacity-70">{u.email}</p>
                </div>
             </div>
             <div className="flex items-center justify-between border-t border-gray-50 pt-4">
                <span className={`px-4 py-1.5 rounded-xl font-black uppercase text-[9px] tracking-widest ${u.role === 'teacher' ? 'text-secondary-600 bg-secondary-50' : u.role === 'admin' ? 'text-accent-600 bg-accent-50' : 'text-primary-600 bg-primary-50'}`}>
                  {u.role}
                </span>
                <div>
                  {u.role === 'teacher' ? (
                    u.isApprovedTeacher ? (
                      <span className="text-green-500 font-black text-[11px] flex items-center gap-1.5 tracking-tight"><UserCheck className="w-3.5 h-3.5" /> Identity Rooted</span>
                    ) : (
                      <span className="text-amber-500 font-black text-[11px] animate-pulse tracking-tight">Access Pending Approval</span>
                    )
                  ) : u.role === 'student' ? (
                    u.isApprovedStudent ? (
                      <span className="text-green-500 font-black text-[11px] flex items-center gap-1.5 tracking-tight"><UserCheck className="w-3.5 h-3.5" /> Identity Verified</span>
                    ) : (
                      <span className="text-amber-500 font-black text-[11px] animate-pulse tracking-tight tracking-tight">On Admission Waitlist</span>
                    )
                  ) : (
                    <span className="text-gray-400">—</span>
                  )}
                </div>
             </div>
          </div>
        ))}
      </div>
    </DashboardLayout>
  );
}

function StatCard({ title, value, icon, color }: { title: string, value: string | number, icon: any, color: string }) {
  return (
    <Card className="hover:scale-[1.02] transition-transform border-none shadow-md overflow-hidden bg-white">
      <CardContent className="p-3 md:p-6 flex items-center gap-3 md:gap-6">
        <div className={`${color} p-2.5 md:p-4 rounded-xl md:rounded-2xl shrink-0`}>
          {icon}
        </div>
        <div className="min-w-0">
          <p className="text-gray-400 font-black text-[9px] md:text-sm uppercase tracking-widest truncate md:whitespace-normal mb-0.5">{title}</p>
          <p className="text-lg md:text-3xl font-black text-gray-800 truncate md:whitespace-normal leading-tight">{value}</p>
        </div>
      </CardContent>
    </Card>
  );
}

function ManagementCard({ title, description, href, icon }: { title: string, description: string, href: string, icon: any }) {
  return (
    <Link href={href} className="block group">
      <Card className="p-5 md:p-8 h-full bg-white border-none shadow-md group-hover:shadow-xl transition-all border-l-8 border-transparent group-hover:border-accent-500">
        <div className="flex items-start gap-4 md:gap-6">
           <div className="bg-gray-50 p-3 md:p-4 rounded-2xl md:rounded-3xl shrink-0 group-hover:scale-110 transition-transform">
             {icon}
           </div>
           <div className="min-w-0">
             <h3 className="text-lg md:text-2xl font-black text-gray-800 mb-1 md:mb-2 group-hover:text-accent-600 transition-colors truncate md:whitespace-normal leading-tight">{title}</h3>
             <p className="text-gray-400 font-bold text-xs md:text-base leading-relaxed line-clamp-2 md:line-clamp-none md:text-gray-500 md:font-medium">{description}</p>
             <div className="mt-4 md:mt-6 inline-flex items-center gap-2 text-accent-500 font-black uppercase tracking-widest text-[10px] md:text-sm">
               Control Panel <span>→</span>
             </div>
           </div>
        </div>
      </Card>
    </Link>
  );
}
