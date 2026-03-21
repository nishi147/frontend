"use client";

import React, { useEffect, useState } from 'react';
import { DashboardLayout } from '@/components/layout/DashboardLayout';
import { Card, CardTitle, CardContent } from '@/components/ui/Card';
import { useAuth } from '@/context/AuthContext';
import { Button } from '@/components/ui/Button';
import axios from 'axios';
import { BarChart, Star, GraduationCap, Calendar, Download, Award } from 'lucide-react';

export default function ProgressPage() {
  const { user } = useAuth();
  const [courses, setCourses] = useState([]);
  const [attendance, setAttendance] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await axios.get('/api/auth/me');
        if (res.data.success) {
            // In a real app we'd fetch detailed progress
        }
      } catch (e) {
        console.error(e);
      } finally {
        setIsLoading(false);
      }
    };
    fetchData();
  }, []);

  return (
    <DashboardLayout allowedRoles={['student']}>
      <div className="flex flex-col gap-8">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
          <div>
            <h1 className="text-3xl md:text-4xl font-extrabold text-primary-600 mb-2">My Progress 📈</h1>
            <p className="text-lg text-gray-500 font-bold">See how far you've come!</p>
          </div>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <Card hoverEffect className="bg-gradient-to-br from-yellow-100 to-orange-100 border-none shadow-md">
              <div className="p-6">
                <div className="flex justify-between items-center mb-4">
                  <CardTitle className="text-yellow-800">Stars Earned</CardTitle>
                  <Star className="w-8 h-8 text-yellow-500 fill-yellow-500" />
                </div>
                <div className="text-5xl font-black text-yellow-600">{user?.stars || 0}</div>
                <p className="mt-2 text-sm text-yellow-700 font-bold">Awarded by your teachers</p>
              </div>
            </Card>

            <Card hoverEffect className="bg-gradient-to-br from-blue-100 to-indigo-100 border-none shadow-md">
              <div className="p-6">
                <div className="flex justify-between items-center mb-4">
                  <CardTitle className="text-indigo-800">Gems Collected</CardTitle>
                  <Award className="w-8 h-8 text-indigo-500" />
                </div>
                <div className="text-5xl font-black text-indigo-600">{user?.gems || 0}</div>
                <p className="mt-2 text-sm text-indigo-700 font-bold">Rare rewards for excellence</p>
              </div>
            </Card>

            <Card hoverEffect className="bg-gradient-to-br from-green-100 to-emerald-100 border-none shadow-md">
              <div className="p-6">
                <div className="flex justify-between items-center mb-4">
                  <CardTitle className="text-emerald-800">Attendance</CardTitle>
                  <Calendar className="w-8 h-8 text-emerald-500" />
                </div>
                <div className="text-5xl font-black text-emerald-600">95%</div>
                <p className="mt-2 text-sm text-emerald-700 font-bold">Consistency is key!</p>
              </div>
            </Card>
        </div>

        {/* Course Progress Section */}
        <h2 className="text-3xl font-extrabold text-gray-800 mt-4">Course Progress 🎓</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
           <Card className="bg-white border-none shadow-lg">
             <div className="p-6">
                <div className="flex justify-between items-center mb-6">
                    <CardTitle className="text-xl">Python for Beginners</CardTitle>
                    <span className="text-primary-600 font-black">75%</span>
                </div>
                <div className="w-full bg-gray-100 rounded-full h-4 overflow-hidden">
                    <div className="bg-primary-500 h-full rounded-full transition-all duration-1000" style={{ width: '75%' }}></div>
                </div>
                <div className="flex justify-between mt-6">
                    <p className="text-gray-500 font-bold text-sm">Target: 4 Lessons Left</p>
                    <Button size="sm" variant="outline" disabled className="flex gap-2">
                      <GraduationCap className="w-4 h-4" /> Download Certificate
                    </Button>
                </div>
             </div>
           </Card>

           <Card className="bg-white border-none shadow-lg opacity-50">
             <div className="p-6">
                <div className="flex justify-between items-center mb-6">
                    <CardTitle className="text-xl">AI & Robotics</CardTitle>
                    <span className="text-gray-600 font-black">100%</span>
                </div>
                <div className="w-full bg-gray-100 rounded-full h-4 overflow-hidden">
                    <div className="bg-green-500 h-full rounded-full" style={{ width: '100%' }}></div>
                </div>
                <div className="flex justify-between mt-6">
                    <p className="text-green-600 font-black text-sm text-green-700">Course Completed! 🎉</p>
                    <Button size="sm" className="flex gap-2 bg-green-500 hover:bg-green-600">
                      <GraduationCap className="w-4 h-4" /> Download Certificate
                    </Button>
                </div>
             </div>
           </Card>
        </div>
      </div>
    </DashboardLayout>
  );
}
