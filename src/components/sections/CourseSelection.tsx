"use client";

import React, { useState, useEffect, useRef } from 'react';
import api from '@/utils/api';
import { Card, CardContent } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import Link from 'next/link';
import { Star, Users, BookOpen, ArrowRight, Loader2, Code, Gamepad2, BrainCircuit, MonitorSmartphone, Palette, Shapes, Sparkles, Search } from 'lucide-react';
import CourseCard from '@/components/ui/CourseCard';
import { SliderWrapper } from '@/components/ui/SliderWrapper';

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
  showStudentsEnrolled: boolean;
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

  const getCategoryIcon = (catName: string) => {
    const name = catName?.toLowerCase() || '';
    if (name.includes('cod') || name.includes('program')) return <Code className="w-6 h-6 text-purple-600" />;
    if (name.includes('game')) return <Gamepad2 className="w-6 h-6 text-orange-500" />;
    if (name.includes('ai') || name.includes('artificial')) return <BrainCircuit className="w-6 h-6 text-teal-500" />;
    if (name.includes('app') || name.includes('web')) return <MonitorSmartphone className="w-6 h-6 text-emerald-500" />;
    if (name.includes('math')) return <Shapes className="w-6 h-6 text-blue-500" />;
    if (name.includes('art') || name.includes('design')) return <Palette className="w-6 h-6 text-rose-500" />;
    return <BookOpen className="w-6 h-6 text-indigo-500" />;
  };

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

  const groupSubTypes = [
    { label: '3:1 Ratio', value: '3:1' },
    { label: '5:1 Ratio', value: '5:1' },
    { label: 'Standard Group', value: 'Group' },
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
    <section className="py-8 md:py-16 px-0 md:px-4 w-full max-w-7xl mx-auto overflow-hidden bg-white" id="course-selection">
    <div className="text-left mb-6 md:mb-10 px-4 relative">

        <h2 className="text-3xl md:text-6xl font-black mb-3 tracking-tight drop-shadow-sm">
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-secondary-500 via-purple-500 to-pink-500">Choose Your Course</span>
        </h2>
        <p className="text-base md:text-xl font-bold max-w-2xl leading-relaxed opacity-90 mt-2">
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-purple-600 to-secondary-500">Exciting and effective programs, curated by experts!</span>
        </p>
      </div>

      {/* Grade Selector (BrightChamps Style) */}
      <div className="flex justify-center mb-8 px-4">
        <div className="inline-flex flex-wrap items-center bg-[#f8fafc] border border-slate-100 rounded-full py-2 pl-6 pr-2 shadow-sm gap-4 transition-all hover:shadow-md">
          <span className="text-sm md:text-base font-bold text-black whitespace-nowrap">Select Your Child's Age</span>
          <div className="relative">
            <select 
              value={ageFilter}
              onChange={(e) => setAgeFilter(e.target.value)}
              className="appearance-none bg-white border border-slate-200 rounded-full px-6 py-2.5 text-sm md:text-base font-black text-primary-600 focus:outline-none focus:ring-2 focus:ring-primary-500/20 cursor-pointer pr-10 shadow-sm min-w-[140px]"
            >
              {ageGroups.map(g => <option key={g.value} value={g.value}>{g.label}</option>)}
            </select>
            <div className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none text-primary-500">
               <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M19 9l-7 7-7-7"></path></svg>
            </div>
          </div>
        </div>
      </div>

      {/* Subject Tabs (BrightChamps Style with Icons) */}
      <div className="max-w-5xl mx-auto px-4 mb-8">
        <div className="flex items-center gap-8 md:gap-14 border-b-2 border-slate-100 overflow-x-auto scrollbar-hide pb-0.5 no-scrollbar relative min-h-[60px]">
          <button 
            onClick={() => setCategoryFilter('All')}
            className={`flex flex-col items-center gap-2 pb-4 text-sm md:text-base font-black transition-all relative whitespace-nowrap px-4 group ${categoryFilter === 'All' ? 'text-primary-600' : 'text-slate-900 hover:text-slate-600'}`}
          >
            <div className={`mb-1 group-hover:-translate-y-1 transition-all duration-300 p-2.5 rounded-[1rem] shadow-sm border ${categoryFilter === 'All' ? 'bg-primary-50 border-primary-200' : 'bg-slate-50 border-slate-100 group-hover:bg-slate-100 group-hover:border-slate-200'} group-hover:shadow-md`}>
              <Sparkles className={`w-6 h-6 ${categoryFilter === 'All' ? 'text-primary-600' : 'text-slate-500 group-hover:text-primary-500'}`} />
            </div>
            <span>All Subjects</span>
            {categoryFilter === 'All' && <div className="absolute bottom-[-2px] left-0 right-0 h-1 bg-primary-500 rounded-full animate-in slide-in-from-left-full duration-300" />}
          </button>
          
          {categories.map((cat) => (
            <button 
              key={cat._id}
              onClick={() => setCategoryFilter(cat._id)}
              className={`flex flex-col items-center gap-2 pb-4 text-sm md:text-base font-black transition-all relative whitespace-nowrap px-4 group ${categoryFilter === cat._id ? 'text-primary-600' : 'text-slate-900 hover:text-slate-600'}`}
            >
              <div className={`mb-1 group-hover:-translate-y-1 transition-all duration-300 p-2.5 rounded-[1rem] shadow-sm border ${categoryFilter === cat._id ? 'bg-primary-50 border-primary-200' : 'bg-slate-50 border-slate-100 group-hover:bg-slate-100 group-hover:border-slate-200'} group-hover:shadow-md`}>
                 {getCategoryIcon(cat.name)}
              </div>
              <span>{cat.name}</span>
              {categoryFilter === cat._id && <div className="absolute bottom-[-2px] left-0 right-0 h-1 bg-primary-500 rounded-full animate-in slide-in-from-left-full duration-300" />}
            </button>
          ))}

          <Link 
            href="/courses"
            className="flex flex-col items-center gap-2 pb-4 text-xs md:text-sm font-black text-primary-500 ml-auto group"
          >
            <div className="mb-1 group-hover:-translate-y-1 transition-all duration-300 bg-primary-50 p-2.5 rounded-[1rem] shadow-sm border border-primary-100 group-hover:bg-primary-200 group-hover:shadow-md">
               <Search className="w-6 h-6 text-primary-600" />
            </div>
            <div className="flex items-center gap-1 opacity-80 group-hover:opacity-100 transition-opacity mt-1">
              <span>View All</span>
              <ArrowRight size={14} />
            </div>
          </Link>
        </div>
      </div>

      {/* Type Filters (Simplified Labels) */}
      <div className="flex flex-col items-center gap-6 mb-12 px-4">
        <div className="flex items-center justify-center gap-3 flex-wrap">
          {classTypes.map((type) => (
            <button
              key={type.value}
              onClick={() => {
                setTypeFilter(type.value);
                // If switching to Group, default to generic group for pricing multiplier
                if (type.value === 'Group' && !['3:1', '5:1', 'Group'].includes(typeFilter)) {
                  setTypeFilter('Group');
                }
              }}
              className={`px-6 py-2.5 rounded-full text-xs font-black transition-all duration-300 border-2 ${
                (type.value === 'Group' ? ['Group', '3:1', '5:1'].includes(typeFilter) : typeFilter === type.value)
                  ? 'bg-primary-500 border-primary-500 text-white shadow-lg shadow-primary-200'
                  : 'bg-white border-slate-100 text-slate-900 hover:border-slate-200'
              }`}
            >
              {type.label}
            </button>
          ))}
        </div>

        {/* Sub-Filters for Group Mode */}
        {['Group', '3:1', '5:1'].includes(typeFilter) && (
          <div className="flex items-center justify-center gap-2 animate-in fade-in slide-in-from-top-2 duration-500">
            {groupSubTypes.map((sub) => (
              <button
                key={sub.value}
                onClick={() => setTypeFilter(sub.value)}
                className={`px-4 py-1.5 rounded-xl text-[10px] font-black transition-all duration-300 border ${
                  typeFilter === sub.value
                    ? 'bg-primary-100 border-primary-200 text-primary-600'
                    : 'bg-gray-50 border-gray-100 text-gray-400 hover:bg-white hover:border-gray-200'
                }`}
              >
                {sub.label}
              </button>
            ))}
          </div>
        )}
      </div>

      {/* Course Cards (BrightChamps Aesthetic) */}
      <div className="px-6 md:px-8">
        {filteredCourses.length > 0 ? (
          <div className="flex flex-col items-center">
            <div className="w-full">
              <SliderWrapper slidesPerViewLg={3} slidesPerViewMd={2} slidesPerViewSm={1} autoPlay={5000} gap={24}>
                {filteredCourses.slice(0, 6).map((course) => (
                  <div key={course._id} className="h-full">
                    <CourseCard course={course} typeFilter={typeFilter} />
                  </div>
                ))}
              </SliderWrapper>
            </div>

            {filteredCourses.length > 6 && (
              <Link href="/courses" className="mt-8">
                <Button variant="outline" className="rounded-full px-12 py-7 border-2 border-slate-100 font-black text-slate-600 hover:bg-slate-50 hover:border-slate-200 transition-all gap-3 shadow-xl shadow-slate-100">
                  <span>View All Courses</span>
                  <ArrowRight size={20} className="text-primary-500" />
                </Button>
              </Link>
            )}
          </div>
        ) : (
          <div className="bg-slate-50 border-2 border-dashed border-slate-200 rounded-[3rem] py-24 text-center">
            <div className="text-6xl mb-6 grayscale opacity-40">🎒</div>
            <h3 className="text-2xl font-black text-slate-900 mb-2">No Classes Found</h3>
            <p className="text-slate-900 font-bold max-w-sm mx-auto">Try selecting a different age group or subject category to find the perfect class.</p>
            <Button
              variant="outline"
              onClick={() => { setAgeFilter('All'); setTypeFilter('All'); setCategoryFilter('All'); }}
              className="mt-8 rounded-2xl border-none font-black text-primary-600 bg-primary-50 px-8 py-6"
            >
              See All Classes
            </Button>
          </div>
        )}
      </div>
    </section>
  );
};

export default CourseSelection;
