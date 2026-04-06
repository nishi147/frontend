"use client";

import React, { useEffect, useState } from 'react';
import { Header } from '@/components/layout/Header';
import { Card, CardTitle, CardContent } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import CourseCard from '@/components/ui/CourseCard';
import api from '@/utils/api';
import Link from 'next/link';
import { useCurrency } from '@/context/CurrencyContext';

export default function CoursesPage() {
  const { formatPrice } = useCurrency();
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchCourses = async () => {
      try {
       const res = await api.get('/api/courses');
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
              <CourseCard key={course._id} course={course} />
            ))}
          </div>
        )}
      </main>
    </div>
  );
}
