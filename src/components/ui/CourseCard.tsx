"use client";

import React from 'react';
import Link from 'next/link';
import { getThumbnailUrl } from '@/utils/image';
import { Card, CardContent } from './Card';
import { Button } from './Button';
import { Star } from 'lucide-react';

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
    <div className={`min-w-[300px] md:min-w-0 flex-none group ${className}`}>
      <Card className="h-full border-none shadow-none bg-transparent hover:translate-y-[-8px] transition-all duration-500">
        {/* Image Area (Consistent Light Blue/Lavender) */}
        <div className="relative aspect-[4/3] rounded-[2.5rem] bg-[#f0f4ff] overflow-hidden flex items-center justify-center mb-3 group-hover:shadow-2xl group-hover:shadow-primary-100 transition-all duration-500">
          
          {/* Main Icon/Illustration or Thumbnail */}
          <div className="w-full h-full p-4 flex items-center justify-center">
            {course.thumbnail ? (
              <img 
                src={getThumbnailUrl(course.thumbnail)} 
                alt={course.title} 
                className="w-full h-full object-contain filter drop-shadow-2xl group-hover:scale-110 transition-transform duration-700" 
              />
            ) : (
              <div className="text-8xl filter drop-shadow-2xl group-hover:scale-110 transition-transform duration-700 select-none">
                {course.category?.icon || '📚'}
              </div>
            )}
          </div>

          {/* Floating Tags (Bottom) */}
          <div className="absolute bottom-4 left-4 right-4 flex justify-between items-center z-20">
             <span className="bg-white px-3 py-1 rounded-lg text-[9px] font-black uppercase tracking-widest text-slate-800 shadow-sm whitespace-nowrap">
               {course.category?.name || 'Class'}
             </span>
             <span className={`bg-primary-500 px-3 py-1 rounded-lg text-[9px] font-black uppercase tracking-widest text-white shadow-sm whitespace-nowrap ${displayType === '1:1' ? 'bg-indigo-500' : 'bg-primary-500'}`}>
               {displayType} Class
             </span>
          </div>

          {/* Overlay Glow */}
          <div className="absolute inset-0 bg-gradient-to-t from-black/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
        </div>

        <CardContent className="p-0">
           <h3 className="text-xl md:text-2xl font-black text-slate-800 mb-2 line-clamp-2 leading-tight group-hover:text-primary-600 transition-colors min-h-[3rem]">
             {course.title}
           </h3>
           
           <div className="flex items-center gap-3 mb-3">
              <div className="flex items-center gap-1 text-primary-600 font-black text-sm">
                <Star size={14} fill="currentColor" /> {course.rating.toFixed(1)}
              </div>
              <div className="w-1 h-1 bg-slate-300 rounded-full" />
              <div className="text-slate-400 font-bold text-[10px] uppercase tracking-widest">
                {course.numberOfSessions} Sessions
              </div>
           </div>

           <div className="flex flex-col gap-4">
              <div className="flex flex-col">
                <div className="flex items-center gap-2">
                   <span className="text-2xl font-black text-slate-900">{formatPrice(displayPerSession)}</span>
                   <span className="text-[10px] font-black uppercase tracking-widest text-slate-600 mt-1">/ session</span>
                </div>
                <div className="flex items-center gap-2 mt-1">
                   <span className="text-xs font-black text-slate-700 bg-slate-50 px-2 py-0.5 rounded-lg border border-slate-100">Total: {formatPrice(displayTotal)}</span>
                   <span className="text-[10px] font-bold text-slate-400 line-through opacity-60">{formatPrice(displayTotal + 5000)}</span>
                </div>
              </div>
              
              <Link href={`/courses/${course._id}?type=${typeFilter}`}>
                <Button className="w-full rounded-2xl py-4.5 bg-slate-900 hover:bg-black text-white font-black text-sm group-hover:scale-102 transition-all shadow-xl shadow-slate-200">
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
