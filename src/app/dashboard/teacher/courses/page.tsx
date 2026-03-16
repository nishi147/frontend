"use client";

import React, { useEffect, useState } from 'react';
import { useAuth } from '@/context/AuthContext';
import { Header } from '@/components/layout/Header';
import { Card, CardContent } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import Link from 'next/link';
import axios from 'axios';
import { BookOpen, Plus, Settings, Trash2, Users } from 'lucide-react';

export default function TeacherCourses() {
  const { user, loading } = useAuth();
  const [courses, setCourses] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  const API = process.env.NEXT_PUBLIC_API_URL;
  useEffect(() => {
  const fetchCourses = async () => {
    try {
      const res = await axios.get(
        `${API}/api/courses/teacher/my-courses`,
        { withCredentials: true }
      );

      if (res.data.success) {
        setCourses(res.data.data);
      }
    } catch (err) {
      console.error("Failed to fetch teacher courses", err);
    } finally {
      setIsLoading(false);
    }
  };

  if (user?.role === "teacher" || user?.role === "admin") {
    fetchCourses();
  }
}, [user]);

  if (loading || isLoading) return <div className="p-20 text-center font-bold text-primary-500 text-2xl animate-pulse">Loading your academy... 📚</div>;

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col font-sans">
      <Header />
      <main className="flex-1 container mx-auto px-4 py-8">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-12">
          <div>
            <h1 className="text-4xl md:text-5xl font-black text-gray-800 mb-2">My Courses 🎓</h1>
            <p className="text-gray-500 font-bold">Manage your magical lessons and student adventures.</p>
          </div>
          <Link href="/dashboard/teacher/courses/new">
            <Button className="font-black text-lg px-8 py-6 rounded-2xl shadow-lg shadow-primary-200">
              <Plus className="w-5 h-5 mr-2" /> Create New Course
            </Button>
          </Link>
        </div>

        {courses.length === 0 ? (
          <Card className="p-20 text-center border-dashed border-4 border-gray-200 bg-white/50">
            <div className="text-6xl mb-6">🏜️</div>
            <h2 className="text-2xl font-black text-gray-400 mb-4">No courses yet!</h2>
            <p className="text-gray-400 font-bold mb-8">Start your journey by creating your first course.</p>
            <Link href="/dashboard/teacher/courses/new">
                <Button variant="outline" className="font-black">Create Course 🚀</Button>
            </Link>
          </Card>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {courses.map((course: any) => (
              <Card key={course._id} className="group hover:-translate-y-2 transition-all duration-300 border-b-8 border-primary-500 overflow-hidden bg-white">
                <div className="h-48 bg-gray-100 relative overflow-hidden">
                  {course.thumbnail ? (
                    <img
  src={course.thumbnail ? `${API}${course.thumbnail}` : "/placeholder-course.png"}
  alt={course.title}
  className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
/>
                  ) : (
                    <div className="w-full h-full flex items-center justify-center text-6xl bg-primary-50">
                        📚
                    </div>
                  )}
                  <div className={`absolute top-4 right-4 px-3 py-1 rounded-full text-xs font-black uppercase tracking-widest ${course.isApproved ? 'bg-green-100 text-green-600' : 'bg-amber-100 text-amber-600'}`}>
                    {course.isApproved ? 'Approved' : 'Pending'}
                  </div>
                </div>
                <CardContent className="p-6">
                  <h3 className="text-xl font-black text-gray-800 mb-2 line-clamp-1">{course.title}</h3>
                  <p className="text-gray-500 font-bold text-sm mb-6 line-clamp-2 h-10">{course.description}</p>
                  
                  <div className="flex items-center justify-between pt-6 border-t border-gray-50">
                    <div className="flex items-center gap-4 text-gray-400 font-bold text-sm">
                        <span className="flex items-center gap-1"><BookOpen className="w-4 h-4" /> {course.numberOfSessions}</span>
                        <span className="flex items-center gap-1"><Users className="w-4 h-4" /> 0</span>
                    </div>
                    <div className="flex items-center gap-2">
                        <Link href={`/dashboard/teacher/courses/${course._id}`}>
                            <Button size="sm" variant="ghost" className="p-2 text-gray-400 hover:text-primary-500"><Settings className="w-5 h-5" /></Button>
                        </Link>
                        <Button size="sm" variant="ghost" className="p-2 text-gray-400 hover:text-red-500"><Trash2 className="w-5 h-5" /></Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </main>
    </div>
  );
}
