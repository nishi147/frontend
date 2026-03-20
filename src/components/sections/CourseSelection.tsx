"use client";

import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Card, CardContent } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import Link from 'next/link';
import { Star, Users, BookOpen, ArrowRight, Loader2 } from 'lucide-react';

interface Category {
  _id: string;
  name: string;
  icon: string;
}

interface Course {
  _id: string;
  title: string;
  description: string;
  category: Category;
  thumbnail: string;
  ageGroup: string;
  courseType: string;
  rating: number;
  studentsEnrolled: number;
  numberOfSessions: number;
  pricePerSession: number;
  totalCoursePrice: number;
}

const CourseSelection = () => {
  const [courses, setCourses] = useState<Course[]>([]);
  const [filteredCourses, setFilteredCourses] = useState<Course[]>([]);
  const [loading, setLoading] = useState(true);
  const [categories, setCategories] = useState<Category[]>([]);
  const [ageFilter, setAgeFilter] = useState('All');
  const [typeFilter, setTypeFilter] = useState('All');
  const [categoryFilter, setCategoryFilter] = useState('All');

  const ageGroups = [
    { label: 'All Ages', value: 'All' },
    { label: 'Ages 6–9', value: '6-9' },
    { label: 'Ages 10–12', value: '10-12' },
    { label: 'Ages 13–16', value: '13-16' },
  ];

  const classTypes = [
    { label: 'All', value: 'All' },
    { label: '1:1 Classes', value: '1:1' },
    { label: 'Group Classes', value: 'Group' },
  ];

  useEffect(() => {
    const fetchData = async () => {
      try {
        const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000';
        const [coursesRes, categoriesRes] = await Promise.allSettled([
          axios.get(`${apiUrl}/api/courses`),
          axios.get(`${apiUrl}/api/categories`)
        ]);

        if (coursesRes.status === 'fulfilled' && coursesRes.value.data.success) {
          setCourses(coursesRes.value.data.data);
          setFilteredCourses(coursesRes.value.data.data);
        }
        if (categoriesRes.status === 'fulfilled' && categoriesRes.value.data.success) {
          setCategories(categoriesRes.value.data.data);
        }
      } catch (error) {
        console.error("Error fetching data:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  useEffect(() => {
    let result = courses;
    
    if (ageFilter !== 'All') {
      result = result.filter(course => course.ageGroup === ageFilter);
    }
    
    if (typeFilter !== 'All') {
      result = result.filter(course => course.courseType === typeFilter);
    }

    if (categoryFilter !== 'All') {
      result = result.filter(course => course.category?._id === categoryFilter);
    }
    
    setFilteredCourses(result);
  }, [ageFilter, typeFilter, categoryFilter, courses]);

  if (loading) {
    return (
      <div className="py-20 flex flex-col items-center justify-center space-y-4">
        <Loader2 className="w-12 h-12 text-primary-500 animate-spin" />
        <p className="text-gray-500 font-bold animate-pulse">Magical courses are loading...</p>
      </div>
    );
  }

  return (
    <section className="py-16 px-4 max-w-7xl mx-auto" id="course-selection">
      <div className="text-center mb-12">
        <h2 className="text-4xl md:text-6xl font-black text-gray-800 mb-4">Choose Your <span className="text-secondary-500">Course</span> 🎓</h2>
        <p className="text-lg font-bold text-gray-500 max-w-2xl mx-auto">
          Grade-wise, group and 1:1 live classes with expert instructors
        </p>
      </div>
<div className="flex justify-center flex-wrap gap-4 mb-10 px-4">
        <button
          onClick={() => setCategoryFilter('All')}
          className={`flex items-center gap-3 px-8 py-4 rounded-[2rem] font-black transition-all duration-300 transform hover:scale-105 ${
            categoryFilter === 'All'
              ? 'bg-navy-900 text-white shadow-2xl shadow-navy-200 ring-4 ring-navy-50'
              : 'bg-white text-gray-400 hover:bg-gray-50 border border-gray-100 shadow-sm'
          }`}
        >
          <span className="text-xl">🌟</span>
          <span className="uppercase tracking-widest text-[11px]">All Topics</span>
        </button>
        {categories.map((cat) => (
          <button
            key={cat._id}
            onClick={() => setCategoryFilter(cat._id)}
            className={`flex items-center gap-3 px-8 py-4 rounded-[2rem] font-black transition-all duration-300 transform hover:scale-105 ${
              categoryFilter === cat._id
                ? 'bg-navy-900 text-white shadow-2xl shadow-navy-200 ring-4 ring-navy-50'
                : 'bg-white text-gray-400 hover:bg-gray-50 border border-gray-100 shadow-sm'
            }`}
          >
            <span className="text-xl">{cat.icon || '📚'}</span>
            <span className="uppercase tracking-widest text-[11px]">{cat.name}</span>
          </button>
        ))}
      </div>
      <div className="flex flex-col md:flex-row items-center justify-between gap-6 mb-12 bg-white p-6 rounded-[2.5rem] shadow-[0_8px_30px_rgb(0,0,0,0.04)] border border-gray-100">
        <div className="flex flex-wrap items-center gap-3">
          <span className="text-xs font-black text-gray-400 uppercase tracking-widest mr-2 ml-2">Grade:</span>
          {ageGroups.map((group) => (
            <button
              key={group.value}
              onClick={() => setAgeFilter(group.value)}
              className={`px-6 py-2.5 rounded-full text-sm font-black transition-all duration-300 ${
                ageFilter === group.value
                  ? 'bg-primary-500 text-white shadow-lg shadow-primary-500/30 ring-2 ring-primary-100'
                  : 'bg-gray-50 text-gray-500 hover:bg-gray-100'
              }`}
            >
              {group.label}
            </button>
          ))}
        </div>

        <div className="w-px h-10 bg-gray-100 hidden md:block" />

        <div className="flex flex-wrap items-center gap-3">
          <span className="text-xs font-black text-gray-400 uppercase tracking-widest mr-2 ml-2">Type:</span>
          {classTypes.map((type) => (
            <button
              key={type.value}
              onClick={() => setTypeFilter(type.value)}
              className={`px-6 py-2.5 rounded-full text-sm font-black transition-all duration-300 ${
                typeFilter === type.value
                  ? 'bg-secondary-500 text-white shadow-lg shadow-secondary-500/30 ring-2 ring-secondary-100'
                  : 'bg-gray-50 text-gray-500 hover:bg-gray-100'
              }`}
            >
              {type.label}
            </button>
          ))}
        </div>
      </div>

      {/* Course Cards Grid */}
      {filteredCourses.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {filteredCourses.map((course) => (
            <Card key={course._id} className="group bg-white rounded-[3rem] border-2 border-gray-50 overflow-hidden hover:shadow-2xl hover:shadow-primary-100 transition-all duration-500 hover:-translate-y-2 flex flex-col relative">
              {/* Category & Type Tags */}
              <div className="absolute top-6 left-6 z-10 flex gap-2">
                <span className="bg-white/95 backdrop-blur-sm px-4 py-1.5 rounded-full text-[10px] font-black uppercase tracking-widest text-primary-600 shadow-sm border border-primary-50">
                  {course.category?.icon} {course.category?.name}
                </span>
                <span className="bg-secondary-500 px-4 py-1.5 rounded-full text-[10px] font-black uppercase tracking-widest text-white shadow-sm">
                  {course.courseType}
                </span>
              </div>

              {/* Thumbnail Area - Dynamic Icon-Based Design */}
              <div className={`h-64 relative overflow-hidden flex flex-col items-center justify-center p-8 transition-all duration-700 group-hover:scale-[1.02] ${
                course.category?.name?.toLowerCase().includes('space') ? 'bg-gradient-to-br from-indigo-600 via-purple-700 to-slate-900' :
                course.category?.name?.toLowerCase().includes('programming') ? 'bg-gradient-to-br from-cyan-400 via-blue-500 to-indigo-600' :
                course.category?.name?.toLowerCase().includes('magic') ? 'bg-gradient-to-br from-pink-500 via-rose-500 to-amber-500' :
                course.category?.name?.toLowerCase().includes('art') ? 'bg-gradient-to-br from-orange-400 via-pink-500 to-purple-600' :
                'bg-gradient-to-br from-primary-400 via-primary-600 to-primary-800'
              }`}>
                {/* Decorative Elements */}
                <div className="absolute top-0 left-0 w-full h-full opacity-20 pointer-events-none">
                  <div className="absolute top-[-20%] left-[-10%] w-64 h-64 bg-white rounded-full blur-3xl opacity-30 animate-pulse" />
                  <div className="absolute bottom-[-10%] right-[-10%] w-48 h-48 bg-black rounded-full blur-2xl opacity-20" />
                </div>

                {/* Main Visual */}
                <div className="relative z-10 flex flex-col items-center text-center transform group-hover:translate-y-[-5px] transition-transform duration-500">
                  <div className="text-7xl mb-4 filter drop-shadow-[0_10px_10px_rgba(0,0,0,0.3)] group-hover:scale-110 transition-transform duration-500">
                    {course.category?.icon || '📚'}
                  </div>
                  <div className="px-4 py-2 bg-white/10 backdrop-blur-md rounded-2xl border border-white/20">
                    <span className="text-sm font-black text-white uppercase tracking-[0.2em] drop-shadow-sm">
                      {course.title.split(':')[0]}
                    </span>
                  </div>
                </div>

                <div className="absolute bottom-6 right-6 bg-black/30 backdrop-blur-md text-white px-4 py-2 rounded-2xl flex items-center gap-2 text-xs font-black border border-white/10">
                  <BookOpen size={14} className="text-primary-300" /> {course.numberOfSessions} Lessons
                </div>
              </div>

              {/* Content Area */}
              <CardContent className="p-8 flex flex-col flex-1">
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center gap-1.5 text-yellow-500 font-black text-sm">
                    <Star size={16} fill="currentColor" /> {course.rating.toFixed(1)}
                  </div>
                  <div className="flex items-center gap-1.5 text-gray-400 font-black text-xs uppercase tracking-tighter">
                    <Users size={14} /> {course.studentsEnrolled} Enrolled
                  </div>
                </div>

                <h3 className="text-2xl font-black text-gray-900 mb-3 group-hover:text-primary-500 transition-colors line-clamp-1">{course.title}</h3>
                <p className="text-gray-500 font-bold text-sm mb-8 line-clamp-2 leading-relaxed h-10">{course.description}</p>
                
                <div className="mt-auto pt-6 border-t border-gray-50 flex items-center justify-between">
                  <div>
                    <div className="flex items-baseline gap-2">
                      <span className="text-3xl font-black text-gray-900">₹{course.totalCoursePrice}</span>
                      {course.totalCoursePrice < 5000 && (
                        <span className="text-sm font-bold text-gray-400 line-through">₹{course.totalCoursePrice + 1000}</span>
                      )}
                    </div>
                    <div className="text-[10px] font-black text-gray-400 uppercase tracking-tighter mt-1">
                      ₹{course.pricePerSession} <span className="text-gray-300">/</span> Session
                    </div>
                  </div>
                  
                  <Link href={`/courses/${course._id}`}>
                    <Button className="rounded-2xl px-8 py-6 font-black text-lg bg-primary-500 hover:bg-primary-600 shadow-lg shadow-primary-500/20 group/btn transition-all">
                      Enroll <ArrowRight size={20} className="ml-2 group-hover/btn:translate-x-1 transition-transform" />
                    </Button>
                  </Link>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      ) : (
        <div className="bg-white border-2 border-dashed border-gray-200 rounded-[3rem] p-20 text-center animate-in fade-in zoom-in duration-500">
          <div className="text-6xl mb-6 grayscale opacity-50">🔍</div>
          <h3 className="text-2xl font-black text-gray-800 mb-2">No Courses Found</h3>
          <p className="text-gray-400 font-bold">Try adjusting your filters to find the perfect magical class!</p>
          <Button 
            variant="outline" 
            onClick={() => { setAgeFilter('All'); setTypeFilter('All'); setCategoryFilter('All'); }}
            className="mt-8 rounded-2xl border-2 border-primary-100 font-black text-primary-600 hover:bg-primary-50"
          >
            Reset All Filters
          </Button>
        </div>
      )}
    </section>
  );
};

export default CourseSelection;
