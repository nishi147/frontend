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
    { label: '3:1 Classes', value: '3:1' },
    { label: '5:1 Classes', value: '5:1' },
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
    
    // We treat typeFilter as a dynamic pricing mode instead of a hard filter now
    // if (typeFilter !== 'All') {
    //   result = result.filter(course => course.courseType === typeFilter);
    // }

    if (categoryFilter !== 'All') {
      result = result.filter(course => course.category?._id === categoryFilter);
    }
    
    setFilteredCourses(result);
  }, [ageFilter, categoryFilter, courses]);

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
        <h2 className="text-4xl md:text-6xl font-black text-gray-800 mb-4">Explore <span className="text-secondary-500">All Subjects</span></h2>
        <p className="text-lg font-bold text-gray-500 max-w-2xl mx-auto">
          Personalized courses for every curious young mind
        </p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 mb-16 px-4">
        {/* All Subjects Card */}
        <button
          onClick={() => setCategoryFilter('All')}
          className={`flex flex-col items-center justify-center p-6 rounded-3xl transition-all duration-300 transform hover:-translate-y-1 border-2 ${
            categoryFilter === 'All'
              ? 'bg-white border-primary-500 shadow-xl shadow-primary-500/20 ring-4 ring-primary-50'
              : 'bg-white border-transparent hover:border-gray-50 shadow-[0_4px_20px_rgb(0,0,0,0.04)] hover:shadow-[0_4px_20px_rgb(0,0,0,0.08)]'
          }`}
        >
          <div className="w-14 h-14 rounded-2xl flex items-center justify-center text-2xl mb-3 bg-gray-900 text-white shadow-md">
            🌟
          </div>
          <h3 className="text-lg font-black text-gray-900 mb-1">All Subjects</h3>
          <p className="text-gray-500 text-[11px] font-bold text-center mb-3">Explore our full catalog</p>
          <span className="bg-gray-100 text-gray-500 px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest transition-colors">
            {courses.length} Course{courses.length !== 1 ? 's' : ''}
          </span>
        </button>

        {/* Dynamic Category Cards */}
        {categories.map((cat, idx) => {
          const nameLower = cat.name.toLowerCase();
          let style = { bg: 'bg-[#eef5fe]', iconBg: 'bg-[#3b82f6]', text: 'text-[#2563eb]', desc: 'Discover new skills' };
          
          if (nameLower.includes('coding') || nameLower.includes('programming') || nameLower.includes('web')) {
            style = { bg: 'bg-[#eef5fe]', iconBg: 'bg-[#3b82f6]', text: 'text-[#2563eb]', desc: 'Python, Scratch, Web Dev' };
          } else if (nameLower.includes('robot')) {
            style = { bg: 'bg-[#f5eeff]', iconBg: 'bg-[#8b5cf6]', text: 'text-[#7c3aed]', desc: 'Build & Program Real Bots' };
          } else if (nameLower.includes('ai') || nameLower.includes('artificial') || nameLower.includes('intelligence')) {
            style = { bg: 'bg-[#e6fbf5]', iconBg: 'bg-[#10b981]', text: 'text-[#059669]', desc: 'Future-Ready Thinking' };
          } else if (nameLower.includes('math')) {
            style = { bg: 'bg-[#fff8e1]', iconBg: 'bg-[#f59e0b]', text: 'text-[#d97706]', desc: 'Master Number Skills' };
          } else if (nameLower.includes('science') || nameLower.includes('space')) {
            style = { bg: 'bg-[#fff1f0]', iconBg: 'bg-[#f97316]', text: 'text-[#ea580c]', desc: 'Explore with Curiosity' };
          } else if (nameLower.includes('english') || nameLower.includes('language')) {
            style = { bg: 'bg-[#ecfdf5]', iconBg: 'bg-[#22c55e]', text: 'text-[#16a34a]', desc: 'Express with Impact' };
          } else if (nameLower.includes('python')) {
            style = { bg: 'bg-[#fffbeb]', iconBg: 'bg-[#eab308]', text: 'text-[#ca8a04]', desc: 'From Basics to Advanced' };
          } else if (nameLower.includes('data')) {
            style = { bg: 'bg-[#faf5ff]', iconBg: 'bg-[#a855f7]', text: 'text-[#9333ea]', desc: 'Analyse & Visualise' };
          } else if (nameLower.includes('game')) {
            style = { bg: 'bg-[#ffedb8]', iconBg: 'bg-[#f43f5e]', text: 'text-[#e11d48]', desc: 'Create Interactive Magic' };
          } else {
            const palettes = [
              { bg: 'bg-[#eef5fe]', iconBg: 'bg-[#3b82f6]', text: 'text-[#2563eb]' },
              { bg: 'bg-[#f5eeff]', iconBg: 'bg-[#8b5cf6]', text: 'text-[#7c3aed]' },
              { bg: 'bg-[#e6fbf5]', iconBg: 'bg-[#10b981]', text: 'text-[#059669]' },
              { bg: 'bg-[#fff8e1]', iconBg: 'bg-[#f59e0b]', text: 'text-[#d97706]' },
              { bg: 'bg-[#fff1f0]', iconBg: 'bg-[#f97316]', text: 'text-[#ea580c]' },
            ];
            style = { ...palettes[idx % palettes.length], desc: 'Discover new skills' };
          }

          const courseCount = courses.filter(c => c.category?._id === cat._id).length;
          const isSelected = categoryFilter === cat._id;
          
          return (
            <button
              key={cat._id}
              onClick={() => setCategoryFilter(cat._id)}
              className={`flex flex-col items-center justify-center p-6 rounded-3xl transition-all duration-300 transform hover:-translate-y-1 border-2 ${
                isSelected
                  ? `${style.bg} border-current ring-4 ring-opacity-20 ${style.text} shadow-lg`
                  : `${style.bg} border-transparent hover:shadow-md hover:shadow-gray-200/50`
              }`}
            >
              <div className={`w-14 h-14 rounded-2xl flex items-center justify-center text-2xl mb-3 text-white shadow-md ${style.iconBg} ${!cat.icon && "font-serif font-bold italic"}`}>
                {cat.icon || cat.name.charAt(0)}
              </div>
              <h3 className={`text-lg font-black mb-1 ${style.text}`}>{cat.name}</h3>
              <p className="text-gray-500 text-[11px] font-bold text-center mb-3 line-clamp-1 opacity-80">{style.desc}</p>
              <span className={`px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest transition-colors ${isSelected ? 'bg-white/90 text-current' : 'bg-white/60 text-gray-500 hover:bg-white'} `}>
                {courseCount} Course{courseCount !== 1 ? 's' : ''}
              </span>
            </button>
          );
        })}
      </div>
      <div className="flex flex-col gap-6 mb-12 bg-white p-6 md:p-8 rounded-[2.5rem] shadow-[0_8px_30px_rgb(0,0,0,0.04)] border border-gray-100 max-w-5xl mx-auto">
        <div className="flex flex-col sm:flex-row sm:items-center gap-4">
          <span className="text-xs font-black text-gray-400 uppercase tracking-widest w-16 shrink-0 md:text-right">Grade:</span>
          <div className="flex flex-wrap items-center gap-3 flex-1">
            {ageGroups.map((group) => (
              <button
                key={group.value}
                onClick={() => setAgeFilter(group.value)}
                className={`px-5 py-2.5 rounded-full text-sm font-black transition-all duration-300 ${
                  ageFilter === group.value
                    ? 'bg-primary-500 text-white shadow-lg shadow-primary-500/30 ring-2 ring-primary-100'
                    : 'bg-gray-50 text-gray-500 hover:bg-gray-100'
                }`}
              >
                {group.label}
              </button>
            ))}
          </div>
        </div>

        <div className="w-full h-px bg-gray-100" />

        <div className="flex flex-col sm:flex-row sm:items-center gap-4">
          <span className="text-xs font-black text-gray-400 uppercase tracking-widest w-16 shrink-0 md:text-right">Type:</span>
          <div className="flex flex-wrap items-center gap-3 flex-1">
            {classTypes.map((type) => (
              <button
                key={type.value}
                onClick={() => setTypeFilter(type.value)}
                className={`px-5 py-2.5 rounded-full text-sm font-black transition-all duration-300 ${
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
      </div>

      {/* Course Cards Grid */}
      {filteredCourses.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredCourses.map((course) => {
            let multiplier = 1;
            if (typeFilter === '3:1') multiplier = 0.8;
            else if (typeFilter === '5:1') multiplier = 0.6;
            else if (typeFilter === 'Group') multiplier = 0.5;

            const displayTotal = Math.round(course.totalCoursePrice * multiplier);
            const displaySession = Math.round(course.pricePerSession * multiplier);
            const displayType = typeFilter === 'All' ? course.courseType : typeFilter;

            return (
            <Card key={course._id} className="group bg-white rounded-3xl border border-gray-100 overflow-hidden hover:shadow-2xl hover:shadow-primary-100 transition-all duration-500 hover:-translate-y-1 flex flex-col relative">
              {/* Category & Type Tags */}
              <div className="absolute top-4 left-4 z-10 flex gap-1.5">
                <span className="bg-white/95 backdrop-blur-sm px-3 py-1 rounded-full text-[9px] font-black uppercase tracking-widest text-primary-600 shadow-sm border border-primary-50">
                  {course.category?.icon} {course.category?.name}
                </span>
                <span className="bg-secondary-500 px-3 py-1 rounded-full text-[9px] font-black uppercase tracking-widest text-white shadow-sm">
                  {displayType}
                </span>
              </div>

              {/* Thumbnail Area - Dynamic Icon-Based Design */}
              <div className={`h-48 relative overflow-hidden flex flex-col items-center justify-center p-6 transition-all duration-700 group-hover:scale-[1.02] ${
                course.category?.name?.toLowerCase().includes('space') ? 'bg-gradient-to-br from-indigo-600 via-purple-700 to-slate-900' :
                course.category?.name?.toLowerCase().includes('programming') ? 'bg-gradient-to-br from-cyan-400 via-blue-500 to-indigo-600' :
                course.category?.name?.toLowerCase().includes('magic') ? 'bg-gradient-to-br from-pink-500 via-rose-500 to-amber-500' :
                course.category?.name?.toLowerCase().includes('art') ? 'bg-gradient-to-br from-orange-400 via-pink-500 to-purple-600' :
                'bg-gradient-to-br from-[#F2643D] via-[#E0532C] to-[#C04220]'
              }`}>
                {/* Decorative Elements */}
                <div className="absolute top-0 left-0 w-full h-full opacity-20 pointer-events-none">
                  <div className="absolute top-[-20%] left-[-10%] w-48 h-48 bg-white rounded-full blur-3xl opacity-30 animate-pulse" />
                  <div className="absolute bottom-[-10%] right-[-10%] w-32 h-32 bg-black rounded-full blur-2xl opacity-20" />
                </div>

                {/* Main Visual */}
                <div className="relative z-10 flex flex-col items-center text-center transform group-hover:translate-y-[-5px] transition-transform duration-500">
                  <div className="text-5xl mb-3 filter drop-shadow-[0_10px_10px_rgba(0,0,0,0.3)] group-hover:scale-110 transition-transform duration-500">
                    {course.category?.name?.toLowerCase().includes('robotics') ? '🤖' : 
                     course.category?.name?.toLowerCase().includes('space') ? '🚀' :
                     course.category?.icon || '📚'}
                  </div>
                  <div className="px-3 py-1.5 bg-white/10 backdrop-blur-md rounded-xl border border-white/20">
                    <span className="text-xs font-black text-white uppercase tracking-[0.2em] drop-shadow-sm">
                      {course.title.split(':')[0]}
                    </span>
                  </div>
                </div>

                <div className="absolute bottom-4 right-4 bg-black/30 backdrop-blur-md text-white px-3 py-1.5 rounded-xl flex items-center gap-1.5 text-[10px] font-black border border-white/10">
                  <BookOpen size={12} className="text-primary-300" /> {course.numberOfSessions} Lessons
                </div>
              </div>

              {/* Content Area */}
              <CardContent className="p-6 flex flex-col flex-1">
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center gap-1.5 text-yellow-500 font-black text-xs">
                    <Star size={14} fill="currentColor" /> {course.rating.toFixed(1)}
                  </div>
                  <div className="flex items-center gap-1.5 text-gray-400 font-black text-[10px] uppercase tracking-tighter">
                    <Users size={12} /> {course.studentsEnrolled} Enrolled
                  </div>
                </div>

                <h3 className="text-xl font-black text-gray-900 mb-2 group-hover:text-primary-500 transition-colors line-clamp-1">{course.title}</h3>
                <p className="text-gray-500 font-bold text-[12px] mb-6 line-clamp-2 leading-relaxed h-9">{course.description}</p>
                
                <div className="mt-auto pt-4 border-t border-gray-100 flex items-center justify-between">
                  <div>
                    <div className="flex items-baseline gap-2">
                      <span className="text-2xl font-black text-gray-900">₹{displayTotal}</span>
                      {displayTotal < 5000 && (
                        <span className="text-xs font-bold text-gray-400 line-through">₹{displayTotal + 1000}</span>
                      )}
                    </div>
                    <div className="text-[9px] font-black text-gray-400 uppercase tracking-tighter mt-0.5">
                      ₹{displaySession} <span className="text-gray-300">/</span> Session
                    </div>
                  </div>
                  
                  <Link href={`/courses/${course._id}?type=${typeFilter}`}>
                    <Button className="rounded-[1.5rem] px-6 py-4 font-black text-base bg-[#F2643D] hover:bg-[#E0532C] text-white border-none shadow-lg shadow-[#F2643D]/20 group/btn transition-all">
                      Enroll <ArrowRight size={16} className="ml-1 group-hover/btn:translate-x-1 transition-transform" />
                    </Button>
                  </Link>
                </div>
              </CardContent>
            </Card>
          )})}
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
