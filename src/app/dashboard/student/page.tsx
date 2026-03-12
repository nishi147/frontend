"use client";

import React, { useEffect, useState } from 'react';
import { DashboardLayout } from '@/components/layout/DashboardLayout';
import { Card, CardTitle, CardContent, CardHeader } from '@/components/ui/Card';
import { useAuth } from '@/context/AuthContext';
import { Button } from '@/components/ui/Button';
import axios from 'axios';
import Link from 'next/link';

export default function StudentDashboard() {
  const { user } = useAuth();
  const [courses, setCourses] = useState([]);
  const [liveClasses, setLiveClasses] = useState([]);

  useEffect(() => {
    // Fetch student data later
    const fetchData = async () => {
      try {
        const classRes = await axios.get('http://localhost:5000/api/live-classes');
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
      <div className="flex flex-col gap-8">
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-4xl font-extrabold text-primary-600 mb-2">Hello, {user?.name}! 👋</h1>
            <p className="text-xl text-gray-500 font-bold">Ready to learn something new today?</p>
          </div>
          <Link href="/courses">
            <Button size="lg" className="animate-bounce-slow">Explore Courses</Button>
          </Link>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
           <Card hoverEffect className="bg-gradient-to-br from-blue-100 to-primary-100 border-none shadow-md">
             <CardTitle className="text-primary-700">Enrolled Courses 📚</CardTitle>
             <CardContent className="mt-4">
               <div className="text-5xl font-black text-primary-600">0</div>
             </CardContent>
           </Card>
           
           <Card hoverEffect className="bg-gradient-to-br from-yellow-100 to-accent-100 border-none shadow-md">
             <CardTitle className="text-accent-700">Completed Lessons ⭐️</CardTitle>
             <CardContent className="mt-4">
               <div className="text-5xl font-black text-accent-600">0</div>
             </CardContent>
           </Card>

           <Card hoverEffect className="bg-gradient-to-br from-purple-100 to-secondary-100 border-none shadow-md">
             <CardTitle className="text-secondary-700">Certificates 🎓</CardTitle>
             <CardContent className="mt-4">
               <div className="text-5xl font-black text-secondary-600">0</div>
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
