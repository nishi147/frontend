"use client";

import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { DashboardLayout } from '@/components/layout/DashboardLayout';
import { Card, CardTitle, CardContent, CardHeader } from '@/components/ui/Card';
import { useAuth } from '@/context/AuthContext';
import { Button } from '@/components/ui/Button';
import api from '@/utils/api';
import { BookOpen, Video, Star, Sparkles, Rocket, ArrowRight } from 'lucide-react';

export default function StudentDashboard() {
  const { user } = useAuth();
  const router = useRouter();
  const [courses, setCourses] = useState([]);
  const [liveClasses, setLiveClasses] = useState([]);

  useEffect(() => {
    // Fetch student data later
    const fetchData = async () => {
      try {
        const classRes = await api.get('/api/live-classes');
        if (classRes.data.success) {
          setLiveClasses(classRes.data.data);
        }
      } catch (e) {
        console.error(e);
      }
    };
    fetchData();
  }, []);

  return (
    <DashboardLayout allowedRoles={['student']}>
      <div className="flex flex-col gap-8 max-w-7xl mx-auto">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
          <div>
            <h1 className="text-3xl md:text-5xl font-black text-gray-800 tracking-tighter mb-2">Hello, <span className="text-primary-500">{user?.name}</span>! 👋</h1>
            <p className="text-lg md:text-xl text-gray-500 font-bold">Ready to launch another project today?</p>
          </div>
          <div className="flex gap-4">
            <Link href="/courses">
               <Button size="lg" variant="outline" className="rounded-2xl border-2 font-black">Explore Courses</Button>
            </Link>
            <Link href="/dashboard/student/projects?upload=true">
               <Button size="lg" className="rounded-2xl font-black bg-primary-500 shadow-xl shadow-primary-200 animate-bounce-slow">Upload Project 🚀</Button>
            </Link>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
           <Card className="bg-white border-2 border-primary-50 rounded-[2rem] shadow-sm hover:shadow-xl transition-all group">
             <CardContent className="p-8">
               <div className="w-12 h-12 bg-primary-50 rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                 <BookOpen className="text-primary-500" />
               </div>
               <div className="text-4xl font-black text-gray-800 mb-1">0</div>
               <p className="text-sm font-black text-gray-400 uppercase tracking-widest">Enrolled Courses</p>
             </CardContent>
           </Card>
           
           <Card className="bg-white border-2 border-accent-50 rounded-[2rem] shadow-sm hover:shadow-xl transition-all group">
             <CardContent className="p-8">
               <div className="w-12 h-12 bg-accent-50 rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                 <Star className="text-accent-500" />
               </div>
               <div className="text-4xl font-black text-gray-800 mb-1">0</div>
               <p className="text-sm font-black text-gray-400 uppercase tracking-widest">Completed Lessons</p>
             </CardContent>
           </Card>

           <Card className="bg-white border-2 border-secondary-50 rounded-[2rem] shadow-sm hover:shadow-xl transition-all group">
             <CardContent className="p-8">
               <div className="w-12 h-12 bg-secondary-50 rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                 <Sparkles className="text-secondary-500" />
               </div>
               <div className="text-4xl font-black text-gray-800 mb-1">0</div>
               <p className="text-sm font-black text-gray-400 uppercase tracking-widest">Rewards Won</p>
             </CardContent>
           </Card>

           <Card className="bg-gradient-to-br from-primary-500 to-primary-600 border-none rounded-[2rem] shadow-xl shadow-primary-100 hover:shadow-2xl transition-all group cursor-pointer overflow-hidden relative" onClick={() => router.push('/dashboard/student/projects?upload=true')}>
              <div className="absolute top-[-20%] right-[-10%] w-32 h-32 bg-white/10 rounded-full blur-2xl" />
              <CardContent className="p-8 text-white relative z-10">
                <div className="w-12 h-12 bg-white/20 rounded-2xl flex items-center justify-center mb-6 group-hover:rotate-12 transition-transform">
                  <Rocket className="text-white" />
                </div>
                <div className="text-xl font-black mb-1">Project Showcase</div>
                <p className="text-[10px] font-black uppercase tracking-widest opacity-80 mb-4">Show your magic! 🎨</p>
                <div className="flex items-center gap-2 text-xs font-black">
                   Upload Now <ArrowRight size={14} />
                </div>
              </CardContent>
           </Card>
        </div>

        <h2 className="text-3xl font-bold text-gray-800 mt-4">Upcoming Live Classes 🎥</h2>
        
        {liveClasses.length === 0 ? (
          <Card className="bg-white/50 border-dashed border-4 border-gray-300 text-center py-12">
            <p className="text-xl text-gray-500 font-bold mb-4">You have no upcoming classes right now.</p>
            <Link href="/courses"><Button variant="outline">Browse Courses to Enroll</Button></Link>
          </Card>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {liveClasses.map((lc: any) => (
              <Card key={lc._id} className="bg-white border-l-8 border-primary-500">
                <CardTitle className="text-xl mb-2">{lc.title}</CardTitle>
                <CardContent>
                  <p className="text-gray-600 font-semibold">Teacher: {lc.teacher.name}</p>
                  <p className="text-primary-600 font-bold mt-2">Date: {new Date(lc.scheduledDate).toLocaleString()}</p>
                  <a href={lc.meetingLink} target="_blank" rel="noreferrer">
                    <Button size="sm" className="mt-4" fullWidth>Join Class</Button>
                  </a>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </div>
    </DashboardLayout>
  );
}
