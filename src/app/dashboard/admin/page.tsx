"use client";

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { useAuth } from '@/context/AuthContext';
import { Header } from '@/components/layout/Header';
import { Card, CardContent } from '@/components/ui/Card';
import axios from 'axios';
import { Users, BookOpen, GraduationCap, IndianRupee, Video, Mail, UserCheck, UserX, Trash2 } from 'lucide-react';

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
    <div className="min-h-screen bg-gray-50 flex flex-col font-sans">
      <Header />
      
      <main className="flex-1 container mx-auto px-4 py-8">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-4xl font-black text-gray-800">Admin Control Center 🔐</h1>
            <p className="text-gray-500 font-bold mt-2">Welcome back, Super Admin {user.name}!</p>
          </div>
          <div className="bg-white px-6 py-3 rounded-2xl shadow-sm border-2 border-accent-100 flex items-center gap-3">
             <div className="w-3 h-3 rounded-full bg-green-500 animate-pulse"></div>
             <span className="font-black text-accent-700 uppercase tracking-tighter">System Live</span>
          </div>
        </div>

        {/* Analytics Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
          <StatCard 
            title="Total Students" 
            value={analytics?.totalStudents || 0} 
            icon={<Users className="w-8 h-8 text-blue-500" />} 
            color="bg-blue-100" 
          />
          <StatCard 
            title="Total Teachers" 
            value={analytics?.totalTeachers || 0} 
            icon={<GraduationCap className="w-8 h-8 text-purple-500" />} 
            color="bg-purple-100" 
          />
          <StatCard 
            title="Total Courses" 
            value={analytics?.totalCourses || 0} 
            icon={<BookOpen className="w-8 h-8 text-orange-500" />} 
            color="bg-orange-100" 
          />
          <StatCard 
            title="Platform Revenue" 
            value={`₹${analytics?.totalRevenue || 0}`} 
            icon={<IndianRupee className="w-8 h-8 text-green-600" />} 
            color="bg-green-100" 
          />
        </div>

        {/* Management Links */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-12">
           <ManagementCard 
             title="User Management"
             description="Manage students and teacher accounts, approve new registrations."
             href="/dashboard/admin/users"
             icon={<Users className="w-12 h-12 text-primary-500" />}
           />
           <ManagementCard 
             title="Course Oversight"
             description="Review, approve, or edit courses created by teachers."
             href="/dashboard/admin/courses"
             icon={<BookOpen className="w-12 h-12 text-secondary-500" />}
           />
           <ManagementCard 
             title="Live Sessions"
             description="Manage webinars and live classes for all courses."
             href="/dashboard/admin/live-classes"
             icon={<Video className="w-12 h-12 text-accent-500" />}
           />
           <ManagementCard 
             title="Workshops & Bootcamps"
             description="Create and manage live magical events and schedules."
             href="/dashboard/admin/workshops"
             icon={<Video className="w-12 h-12 text-green-500" />}
           />
        </div>

        {/* User Overview Table */}
        <div className="mb-8 flex items-center justify-between mt-12">
          <h2 className="text-3xl font-black text-gray-800">Registered Users Overview 👥</h2>
        </div>
        
        <div className="bg-white rounded-3xl shadow-xl overflow-hidden border border-gray-100 mb-12">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-gray-50 border-b border-gray-100 font-black text-gray-400 uppercase text-xs tracking-widest">
                <th className="px-8 py-6">User</th>
                <th className="px-8 py-6">Role</th>
                <th className="px-8 py-6">Status</th>
              </tr>
            </thead>
            <tbody>
              {users.map((u: any) => (
                <tr key={u._id} className="border-b border-gray-50 hover:bg-gray-50/50 transition-colors group">
                  <td className="px-8 py-6">
                    <div className="flex items-center gap-4">
                      <div className={`w-12 h-12 rounded-2xl flex items-center justify-center text-white font-black text-lg ${u.role === 'teacher' ? 'bg-secondary-500' : u.role === 'admin' ? 'bg-accent-500' : 'bg-primary-500'}`}>
                        {u.name[0]}
                      </div>
                      <div>
                        <p className="font-black text-gray-800">{u.name}</p>
                        <p className="text-gray-400 flex items-center gap-1 text-sm"><Mail className="w-3 h-3" /> {u.email}</p>
                      </div>
                    </div>
                  </td>
                  <td className="px-8 py-6 font-bold uppercase tracking-widest text-xs">
                     <span className={`px-4 py-1 rounded-full ${u.role === 'teacher' ? 'text-secondary-600 bg-secondary-50' : u.role === 'admin' ? 'text-accent-600 bg-accent-50' : 'text-primary-600 bg-primary-50'}`}>
                        {u.role}
                     </span>
                  </td>
                  <td className="px-8 py-6 font-bold">
                    {u.role === 'teacher' ? (
                      u.isApprovedTeacher ? (
                        <span className="text-green-500 flex items-center gap-2"><UserCheck className="w-4 h-4" /> Approved</span>
                      ) : (
                        <span className="text-amber-500 flex items-center gap-2 animate-pulse"><UserX className="w-4 h-4" /> Pending</span>
                      )
                    ) : u.role === 'student' ? (
                      u.isApprovedStudent ? (
                        <span className="text-green-500 flex items-center gap-2"><UserCheck className="w-4 h-4" /> Approved</span>
                      ) : (
                        <span className="text-amber-500 flex items-center gap-2 animate-pulse"><UserX className="w-4 h-4" /> Pending Approval</span>
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
      </main>
    </div>
  );
}

function StatCard({ title, value, icon, color }: { title: string, value: string | number, icon: any, color: string }) {
  return (
    <Card className="hover:scale-105 transition-transform border-none shadow-md overflow-hidden bg-white">
      <CardContent className="p-6 flex items-center gap-6">
        <div className={`${color} p-4 rounded-2xl`}>
          {icon}
        </div>
        <div>
          <p className="text-gray-400 font-bold text-sm uppercase tracking-widest">{title}</p>
          <p className="text-3xl font-black text-gray-800">{value}</p>
        </div>
      </CardContent>
    </Card>
  );
}

function ManagementCard({ title, description, href, icon }: { title: string, description: string, href: string, icon: any }) {
  return (
    <Link href={href} className="block group">
      <Card className="p-8 h-full bg-white border-none shadow-md group-hover:shadow-xl transition-all border-l-8 border-transparent group-hover:border-accent-500">
        <div className="flex items-start gap-6">
           <div className="bg-gray-50 p-4 rounded-3xl group-hover:scale-110 transition-transform">
             {icon}
           </div>
           <div>
             <h3 className="text-2xl font-black text-gray-800 mb-2 group-hover:text-accent-600 transition-colors">{title}</h3>
             <p className="text-gray-500 font-medium leading-relaxed">{description}</p>
             <div className="mt-6 inline-flex items-center gap-2 text-accent-500 font-black uppercase tracking-widest text-sm">
               Control Panel <span>→</span>
             </div>
           </div>
        </div>
      </Card>
    </Link>
  );
}
