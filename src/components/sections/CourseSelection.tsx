"use client";

import React, { useState, useEffect } from 'react';
import api from '@/utils/api';
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
        const [coursesRes, categoriesRes] = await Promise.allSettled([
          api.get('/api/courses'),
          api.get('/api/categories')
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
    <section className="py-8 md:py-16 px-0 md:px-4 w-full max-w-7xl mx-auto overflow-hidden" id="course-selection">
      <div className="text-center mb-6 md:mb-16 px-4">
        <h2 className="text-2xl md:text-5xl font-black text-[#1a0a54] mb-2 md:mb-3">Choose Your Course</h2>
        <p className="text-sm md:text-xl font-bold text-[#4a5568] max-w-xl mx-auto">
          Exciting and effective programs, curated by experts!
        </p>
      </div>

      {/* Grade Selector Card */}
      <div className="mx-auto bg-[#f8f9fe] rounded-2xl md:rounded-3xl p-5 md:p-8 mb-8 md:mb-12 flex flex-col md:flex-row items-center justify-center gap-3 md:gap-4 text-center md:text-left shadow-[0_2px_15px_rgb(0,0,0,0.03)] border border-blue-50/50 w-[92%] max-w-2xl">
        <span className="text-sm md:text-xl font-black text-[#1a0a54]">Select Your Child's Age</span>
        <div className="relative w-full md:w-auto min-w-[180px] md:min-w-[200px]">
          <select 
            value={ageFilter}
            onChange={(e) => setAgeFilter(e.target.value)}
            className="w-full appearance-none bg-white border-2 border-primary-100 rounded-full px-6 md:px-8 py-2 md:py-3.5 text-sm md:text-base font-black text-gray-700 focus:outline-none focus:border-primary-500 shadow-sm transition-all cursor-pointer pr-10 md:pr-12"
          >
            {ageGroups.map(g => <option key={g.value} value={g.value}>{g.label}</option>)}
          </select>
          <div className="absolute right-4 md:right-6 top-1/2 -translate-y-1/2 pointer-events-none text-primary-500">
            <svg className="w-3 md:w-4 h-auto" viewBox="0 0 14 8" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M1 1L7 7L13 1" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          </div>
        </div>
      </div>

      {/* Subject Tabs */}
      <div className="flex items-center md:justify-center gap-4 md:gap-12 mb-8 md:mb-10 border-b-2 border-gray-100 px-4 max-w-4xl mx-auto overflow-x-auto scrollbar-hide no-scrollbar relative">
        <button 
          onClick={() => setCategoryFilter('All')}
          className={`pb-3 md:pb-4 text-sm md:text-lg font-black transition-all relative whitespace-nowrap px-2 md:px-4 ${categoryFilter === 'All' ? 'text-primary-600' : 'text-[#1a0a54]/50 hover:text-[#1a0a54]'}`}
        >
          All Subjects
          {categoryFilter === 'All' && <div className="absolute bottom-[-2px] left-0 right-0 h-1 bg-primary-500 rounded-full" />}
        </button>
        
        {categories.map((cat) => (
          <button 
            key={cat._id}
            onClick={() => setCategoryFilter(cat._id)}
            className={`pb-3 md:pb-4 text-sm md:text-lg font-black transition-all relative whitespace-nowrap px-2 md:px-4 ${categoryFilter === cat._id ? 'text-primary-600' : 'text-[#1a0a54]/50 hover:text-[#1a0a54]'}`}
          >
            {cat.name}
            {categoryFilter === cat._id && <div className="absolute bottom-[-2px] left-0 right-0 h-1 bg-primary-500 rounded-full" />}
          </button>
        ))}

        <button 
          className="pb-3 md:pb-4 text-sm md:text-lg font-black text-primary-600 flex items-center gap-2 px-2 md:px-4 opacity-70 hover:opacity-100"
          onClick={() => setCategoryFilter('All')}
        >
          <span className="whitespace-nowrap">View All</span>
          <ArrowRight size={14} className="md:w-4 md:h-4" />
        </button>
      </div>

      {/* Type Filter Buttons */}
      <div className="flex items-center justify-center gap-2 mb-6 md:mb-12 flex-wrap px-4">
        {classTypes.map((type) => (
          <button
            key={type.value}
            onClick={() => setTypeFilter(type.value)}
            className={`px-3 md:px-6 py-1.5 md:py-2.5 rounded-full text-[10px] md:text-xs font-black transition-all duration-300 border-2 ${
              typeFilter === type.value
                ? 'bg-primary-50 border-primary-500 text-primary-600 shadow-sm'
                : 'bg-white border-transparent text-gray-400 hover:bg-gray-50'
            }`}
          >
            {type.label}
          </button>
        ))}
      </div>

      {/* Course Cards Grid (Horizontal on Mobile) */}
      {filteredCourses.length > 0 ? (
        <div className="flex overflow-x-auto md:grid md:grid-cols-2 lg:grid-cols-3 gap-5 md:gap-8 snap-x scrollbar-hide no-scrollbar pb-10 px-4 md:px-0">
          {filteredCourses.map((course) => {
            let multiplier = 1;
            if (typeFilter === '3:1') multiplier = 0.8;
            else if (typeFilter === '5:1') multiplier = 0.6;
            else if (typeFilter === 'Group') multiplier = 0.5;

            const displayTotal = Math.round(course.totalCoursePrice * multiplier);
            const displaySession = Math.round(course.pricePerSession * multiplier);
            const displayType = typeFilter === 'All' ? course.courseType : typeFilter;

            return (
              <Card key={course._id} className="min-w-[280px] w-[80vw] md:w-auto snap-center group bg-white rounded-3xl border border-gray-100 overflow-hidden hover:shadow-2xl hover:shadow-primary-100/50 transition-all duration-500 flex flex-col relative shrink-0">
                {/* Category & Type Tags */}
                <div className="absolute top-4 left-4 z-10 flex gap-2">
                  <span className="bg-white/95 backdrop-blur-sm px-4 py-1.5 rounded-lg text-[10px] font-black uppercase tracking-widest text-[#1a0a54] shadow-sm border border-gray-100">
                    {course.category?.name}
                  </span>
                  <span className="bg-primary-500/90 backdrop-blur-sm px-4 py-1.5 rounded-lg text-[10px] font-black uppercase tracking-widest text-white shadow-sm">
                    {displayType}
                  </span>
                </div>

                {/* Thumbnail Area */}
                <div className={`h-44 md:h-52 relative overflow-hidden flex flex-col items-center justify-center p-6 ${
                  course.category?.name?.toLowerCase().includes('space') ? 'bg-[#1a0a54]' :
                  course.category?.name?.toLowerCase().includes('programming') ? 'bg-[#3b82f6]' :
                  'bg-[#f2643d]'
                }`}>
                  {/* Enrolled Stack */}
                  <div className="absolute top-4 right-4 z-10 bg-white/20 backdrop-blur-md rounded-full pl-1 pr-3 py-1 flex items-center gap-2 border border-white/30">
                    <div className="flex -space-x-2">
                      {[1, 2, 3].map(i => (
                        <div key={i} className="w-5 h-5 rounded-full border-2 border-white bg-gray-200 flex items-center justify-center text-[8px]">
                          {i === 3 ? '👨' : i === 2 ? '👧' : '🧒'}
                        </div>
                      ))}
                    </div>
                    <span className="text-[10px] font-black text-white">{course.studentsEnrolled}+ Enrolled</span>
                  </div>

                  <div className="relative z-10 text-6xl filter drop-shadow-xl group-hover:scale-110 transition-transform duration-500">
                    {course.category?.icon || '📚'}
                  </div>
                </div>

                {/* Content Area */}
                <CardContent className="p-6 md:p-8 flex flex-col flex-1 gap-y-4 md:gap-y-6">
                  <div className="flex items-center gap-4 mb-3">
                    <div className="flex items-center gap-1 text-yellow-500 font-black text-xs">
                      <Star size={14} fill="currentColor" /> {course.rating.toFixed(1)}
                      <span className="text-gray-400 font-bold ml-1">({Math.floor(course.rating * 123)} ratings)</span>
                    </div>
                    <span className="w-1 h-1 bg-gray-300 rounded-full" />
                    <div className="flex items-center gap-1 text-gray-500 font-black text-xs">
                      <Users size={14} /> {course.studentsEnrolled} students
                    </div>
                  </div>

                  <div className="space-y-4 min-h-[5.5rem] md:min-h-[6.5rem]">
                    <h3 className="text-xl md:text-2xl font-black text-[#1a0a54] group-hover:text-primary-500 transition-colors line-clamp-2 leading-tight">
                      {course.title}
                    </h3>
                    <p className="text-gray-500 font-bold text-sm line-clamp-2 leading-relaxed">
                      {course.description}
                    </p>
                  </div>
                  
                  <div className="mt-auto pt-5 border-t border-gray-100 flex flex-col gap-4">
                    <div className="flex flex-col">
                      <div className="flex items-baseline gap-2 mb-1">
                        <span className="text-2xl md:text-3xl font-black text-[#1a0a54]">₹{displayTotal}</span>
                        <span className="text-sm font-bold text-gray-400 line-through opacity-70">₹{displayTotal + 20000}</span>
                      </div>
                      <span className="text-sm font-black text-gray-600">
                        (₹{displaySession} per class)
                      </span>
                    </div>
                    
                    <Link href={`/courses/${course._id}?type=${typeFilter}`} className="w-full">
                      <Button variant="primary" className="w-full rounded-full py-4 md:py-6 font-black text-base md:text-lg shadow-lg hover:shadow-xl transition-all focus:ring-0 active:scale-95 shrink-0">
                        Enroll Now
                      </Button>
                    </Link>
                  </div>
                </CardContent>
              </Card>
            );
          })}
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
