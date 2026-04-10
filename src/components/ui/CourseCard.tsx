"use client";

import React from 'react';
import Link from 'next/link';
import { getThumbnailUrl } from '@/utils/image';
import { Card, CardContent } from './Card';
import { Button } from './Button';
import { Star } from 'lucide-react';
import { trackEvent } from '@/utils/analytics';

import { useCurrency } from '@/context/CurrencyContext';

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

interface CourseCardProps {
  course: Course;
  typeFilter?: string;
  className?: string;
}

const CourseCard: React.FC<CourseCardProps> = ({ course, typeFilter = 'All', className = '' }) => {
  const { formatPrice } = useCurrency();
  const multiplier = typeFilter === '3:1' ? 0.8 : typeFilter === '5:1' ? 0.6 : typeFilter === 'Group' ? 0.5 : 1;
  const displayPerSession = Math.round(course.pricePerSession * multiplier);
  const displayTotal = Math.round(displayPerSession * course.numberOfSessions);
  const displayType = typeFilter === 'All' ? course.courseType : typeFilter;

  return (
    <div className={`w-full flex-none group ${className}`}>
      <Card className="h-full border-2 border-slate-100 rounded-[2rem] overflow-hidden hover:border-primary-200 transition-all duration-500 hover:shadow-2xl hover:shadow-primary-100/50 flex flex-col bg-white">
        
        {/* Compact Image Frame */}
        <div className="relative aspect-[4/3] bg-slate-50 overflow-hidden flex items-center justify-center group-hover:bg-slate-100 transition-colors">
          {course.thumbnail ? (
            <img 
              src={getThumbnailUrl(course.thumbnail)} 
              alt={course.title} 
              className="w-full h-full object-contain p-4 group-hover:scale-110 transition-transform duration-700" 
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center p-4 text-8xl filter drop-shadow-md group-hover:scale-110 transition-transform duration-700 select-none">
              {course.category?.icon || '📚'}
            </div>
          )}

          {/* Floating Tags (Bottom) */}
          <div className="absolute bottom-3 left-3 right-3 flex justify-between items-center z-20">
             <span className="bg-white/95 backdrop-blur-md px-3 py-1.5 rounded-lg text-[9px] font-black uppercase tracking-widest text-slate-800 shadow-sm whitespace-nowrap">
               {course.category?.name || 'Class'}
             </span>
             <span className={`px-3 py-1.5 rounded-lg text-[9px] font-black uppercase tracking-widest text-white shadow-sm whitespace-nowrap ${displayType === '1:1' ? 'bg-indigo-500' : 'bg-primary-500'}`}>
               {displayType}
             </span>
          </div>
          
          <div className="absolute inset-0 bg-gradient-to-t from-black/10 to-transparent pointer-events-none" />
        </div>

        <CardContent className="p-5 flex flex-col flex-1">
           <h3 className="text-xl font-black text-slate-800 mb-2 line-clamp-2 leading-tight group-hover:text-primary-600 transition-colors">
             {course.title}
           </h3>
           
           <div className="flex items-center gap-3 mb-4">
              <div className="flex items-center gap-1 text-primary-500 font-black text-sm">
                <Star size={14} fill="currentColor" /> {course.rating.toFixed(1)}
              </div>
              <div className="w-1 h-1 bg-slate-300 rounded-full" />
              <div className="text-slate-500 font-bold text-[10px] uppercase tracking-widest">
                {course.numberOfSessions} Sessions
              </div>
           </div>

           <div className="flex flex-col gap-4 mt-auto">
              <div className="flex flex-col border-t border-slate-100 pt-4">
                 <div className="flex items-center gap-2">
                    <span className="text-2xl font-black text-slate-900">{formatPrice(displayPerSession)}</span>
                    <span className="text-[10px] font-black uppercase tracking-widest text-slate-500 mt-1">/ session</span>
                 </div>
                 <div className="flex items-center gap-2 mt-1">
                    <span className="text-xs font-black text-slate-600 bg-slate-50 px-2 py-0.5 rounded-lg">Total: {formatPrice(displayTotal)}</span>
                    <span className="text-[10px] font-bold text-slate-400 line-through opacity-60 px-1">{formatPrice(displayTotal + 5000)}</span>
                 </div>
              </div>
              
              <Link 
                href={`/courses/${course._id}?type=${typeFilter}`}
                onClick={() => trackEvent('course_details_click', { 
                  course_id: course._id, 
                  course_title: course.title,
                  category: course.category?.name,
                  age_group: course.ageGroup
                })}
              >
                <Button className="w-full rounded-xl py-4 bg-slate-900 hover:bg-black text-white font-black text-sm transition-all shadow-md mt-1">
                  View Details
                </Button>
              </Link>
           </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default CourseCard;
