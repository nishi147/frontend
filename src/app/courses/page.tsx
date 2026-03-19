"use client";

import React, { useEffect, useState } from 'react';
import { Header } from '@/components/layout/Header';
import { Card, CardTitle, CardContent } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import axios from 'axios';
import Link from 'next/link';
import { useCurrency } from '@/context/CurrencyContext';

export default function CoursesPage() {
  const { formatPrice } = useCurrency();
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchCourses = async () => {
      try {
       const res = await axios.get(`${process.env.NEXT_PUBLIC_API_URL}/api/courses`);
        if (res.data.success) {
          setCourses(res.data.data);
        }
      } catch (e) {
        console.error("Failed to load courses");
      } finally {
        setLoading(false);
      }
    };
    fetchCourses();
  }, []);

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <Header />
      <main className="flex-1 container mx-auto px-4 py-8 relative">
        {/* Playful background decorative blobs */}
        <div className="absolute top-10 left-10 w-64 h-64 bg-yellow-200 rounded-full mix-blend-multiply filter blur-3xl opacity-50 animate-float" />
        <div className="absolute bottom-10 right-10 w-72 h-72 bg-blue-200 rounded-full mix-blend-multiply filter blur-3xl opacity-50 animate-float" style={{ animationDelay: '2s' }} />

        <div className="relative z-10 text-center mb-12">
          <h1 className="text-5xl font-black text-primary-600 mb-4">Explore Fun Courses! 🚀</h1>
          <p className="text-xl text-gray-600 font-bold max-w-2xl mx-auto">
            Discover a world of interactive learning with our expert teachers.
            Pick a course and start learning today!
          </p>
        </div>

        {loading ? (
          <div className="text-center font-bold text-gray-500 animate-pulse text-2xl">Loading awesome courses...</div>
        ) : courses.length === 0 ? (
          <div className="text-center bg-white/50 p-8 rounded-3xl border-4 border-dashed border-gray-300">
            <h2 className="text-2xl font-bold text-gray-600">No courses available yet! 😢</h2>
            <p className="text-gray-500">Check back later or ask your teachers to add some.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 relative z-10">
            {courses.map((course: any) => (
              <Card key={course._id} hoverEffect className="flex flex-col h-full bg-white/80">
                <div className="h-48 rounded-2xl bg-gray-200 mb-4 overflow-hidden border-4 border-white shadow-sm">
                  {course.thumbnail ? (
                    <img src={`${process.env.NEXT_PUBLIC_API_URL || ''}/${course.thumbnail}`} alt={course.title} className="w-full h-full object-cover" />
                  ) : (
                    <div className="w-full h-full bg-gradient-to-br from-primary-200 to-secondary-200 flex items-center justify-center">
                      <span className="text-4xl">🎓</span>
                    </div>
                  )}
                </div>
                <CardTitle className="text-2xl text-gray-800 line-clamp-2">{course.title}</CardTitle>
                <div className="flex items-center gap-2 mt-2 mb-4">
                  <div className="w-8 h-8 rounded-full bg-primary-100 flex items-center justify-center font-bold text-primary-600">
                    {course.teacher?.name?.[0] || 'T'}
                  </div>
                  <span className="text-gray-600 font-semibold">{course.teacher?.name}</span>
                </div>
                
                <CardContent className="flex-1">
                  <p className="text-gray-500 line-clamp-3 mb-4">{course.description}</p>
                </CardContent>

                <div className="mt-auto pt-4 border-t-2 border-gray-100 flex items-center justify-between">
                  <div>
                    <div className="text-xs font-bold text-gray-500 uppercase tracking-wider">{course.numberOfSessions} Sessions</div>
                    <div className="text-2xl font-black text-secondary-600">{formatPrice(course.totalCoursePrice)}</div>
                  </div>
                  <Link href={`/courses/${course._id}`}>
                    <Button variant="primary">View Details</Button>
                  </Link>
                </div>
              </Card>
            ))}
          </div>
        )}
      </main>
    </div>
  );
}
