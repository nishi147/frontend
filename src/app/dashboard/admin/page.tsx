"use client";

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { useAuth } from '@/context/AuthContext';
import { Header } from '@/components/layout/Header';
import { DashboardLayout } from '@/components/layout/DashboardLayout';
import { Card, CardContent } from '@/components/ui/Card';
import axios from 'axios';
import { Users, BookOpen, GraduationCap, IndianRupee, Video, Mail, UserCheck, UserX, Trash2, Settings, TrendingUp, Target, Gift } from 'lucide-react';

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
  const [salesStats, setSalesStats] = useState<any>(null);
  const [users, setUsers] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [analyticsRes, usersRes, salesRes] = await Promise.all([
          axios.get('/api/users/analytics'),
          axios.get('/api/users'),
          axios.get('/api/analytics/sales')
        ]);
        if (analyticsRes.data.success) setAnalytics(analyticsRes.data.data);
        if (usersRes.data.success) setUsers(usersRes.data.data);
        if (salesRes.data.success) setSalesStats(salesRes.data.data);
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
        <StatCard 
          title="Coupon Rev." 
          value={`₹${salesStats?.revenueFromCoupons || 0}`} 
          icon={<Gift className="w-6 h-6 md:w-8 md:h-8 text-purple-600" />} 
          color="bg-purple-50" 
        />
        <StatCard 
          title="Conv. Rate" 
          value={`${salesStats?.conversionRate?.toFixed(1) || 0}%`} 
          icon={<TrendingUp className="w-6 h-6 md:w-8 md:h-8 text-secondary-500" />} 
          color="bg-secondary-50" 
        />
      </div>

      {salesStats?.salesUserPerformance?.length > 0 && (
        <div className="mb-12 px-2 sm:px-0">
          <div className="flex items-center gap-3 mb-6">
            <h2 className="text-2xl font-black text-gray-800">Sales Leaderboard 🚀</h2>
            <span className="bg-primary-100 text-primary-700 text-[10px] font-black px-3 py-1 rounded-full uppercase tracking-widest">Top Performers</span>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {salesStats.salesUserPerformance.map((performer: any, i: number) => (
              <div key={i} className="bg-white p-6 rounded-[2.5rem] shadow-xl border-2 border-gray-50 flex items-center gap-5 transform hover:-translate-y-1 transition-all">
                <div className="w-14 h-14 bg-navy-900 text-white rounded-2xl flex items-center justify-center font-black text-xl shadow-lg">
                  {i + 1}
                </div>
                <div className="flex-1">
                  <p className="font-black text-gray-800 truncate">{performer.name}</p>
                  <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest">{performer.totalSales} Conversions</p>
                </div>
                <div className="text-right">
                  <p className="font-black text-green-600 tracking-tight">₹{performer.totalRevenue}</p>
                  <p className="text-[9px] font-bold text-gray-400 uppercase">Revenue</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Management Links */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-6 md:gap-8 mb-12 px-2 sm:px-0">
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
           title="Sales CRM"
           description="Manage leads, track conversions, and assign counsellors."
           href="/sales-dashboard"
           icon={<Target className="w-10 h-10 md:w-12 md:h-12 text-secondary-500" />}
         />
         <ManagementCard 
           title="Coupon Center"
           description="Create discount codes and track marketing performance."
           href="/dashboard/admin/coupons"
           icon={<Gift className="w-10 h-10 md:w-12 md:h-12 text-purple-500" />}
         />
         <ManagementCard 
           title="System Settings"
           description="Configure platform branding, payments, and SEO."
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
    <Card className="hover:scale-[1.02] transition-transform border-none shadow-md overflow-hidden bg-white group">
      <CardContent className="p-4 md:p-6 flex flex-col items-center text-center gap-3">
        <div className={`${color} p-4 rounded-3xl shrink-0 group-hover:rotate-6 transition-transform`}>
          {icon}
        </div>
        <div className="w-full">
          <p className="text-gray-400 font-black text-[10px] md:text-xs uppercase tracking-[0.2em] mb-1">{title}</p>
          <p className="text-xl md:text-3xl font-black text-gray-800 leading-tight">{value}</p>
        </div>
      </CardContent>
    </Card>
  );
}

function ManagementCard({ title, description, href, icon }: { title: string, description: string, href: string, icon: any }) {
  return (
    <Link href={href} className="block group">
      <Card className="p-6 md:p-8 h-full bg-white border-none shadow-md group-hover:shadow-2xl transition-all border-b-8 border-transparent group-hover:border-accent-500 rounded-[2.5rem]">
        <div className="flex flex-col items-center text-center gap-6">
           <div className="bg-gray-50 p-5 md:p-6 rounded-[2rem] shrink-0 group-hover:scale-110 group-hover:bg-accent-50 transition-all duration-500">
             {icon}
           </div>
           <div className="w-full flex flex-col items-center">
             <h3 className="text-xl md:text-2xl font-black text-gray-800 mb-3 group-hover:text-accent-600 transition-colors leading-tight">
               {title}
             </h3>
             <p className="text-gray-500 font-bold text-xs md:text-sm leading-relaxed max-w-[250px]">
               {description}
             </p>
             <div className="mt-6 inline-flex items-center gap-2 text-accent-500 font-black uppercase tracking-widest text-[10px] md:text-xs bg-accent-50 px-4 py-2 rounded-full group-hover:bg-accent-500 group-hover:text-white transition-all">
               Control Panel <span>→</span>
             </div>
           </div>
        </div>
      </Card>
    </Link>
  );
}
