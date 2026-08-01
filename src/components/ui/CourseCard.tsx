"use client";
import React from 'react';
import Link from 'next/link';
import { getThumbnailUrl } from '@/utils/image';
import { Card, CardContent } from './Card';
import { Button } from './Button';
import { Star } from 'lucide-react';1
import { trackEvent, trackLead } from '@/utils/analytics';

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
  showStudentsEnrolled: boolean;
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
  const displayType = typeFilter === 'All' ? course.courseType : typeFilter;
  const sessionsCount = course.numberOfSessions > 0 ? course.numberOfSessions : 1;

  let displayTotal = 0;
  let displayPerSession = 0;

  if (course.numberOfSessions && course.numberOfSessions > 1 && course.pricePerSession && course.totalCoursePrice && course.pricePerSession < course.totalCoursePrice) {
    displayPerSession = Math.round(course.pricePerSession * multiplier);
    displayTotal = Math.round(displayPerSession * course.numberOfSessions);
  } else {
    const baseTotal = course.totalCoursePrice || course.pricePerSession || 0;
    displayTotal = Math.round(baseTotal * multiplier);
    displayPerSession = sessionsCount > 1 ? Math.round(displayTotal / sessionsCount) : displayTotal;
  }

  return (
    <Link
      href={`/courses/${course._id}?type=${typeFilter}`}
      className={`w-full flex-none group block`}
      onClick={() => {
        trackLead({
          content_name: course.title,
          content_category: course.category?.name,
          content_ids: [course._id],
          content_type: 'product',
          value: displayTotal,
          currency: 'INR'
        });
        trackEvent('course_details_click', {
          course_id: course._id,
          course_title: course.title,
          category: course.category?.name,
          age_group: course.ageGroup
        });
      }}
    >
      <Card className={`h-full border border-gray-200 rounded-[1.5rem] shadow-sm hover:shadow-lg transition-all duration-300 flex flex-col bg-white cursor-pointer p-3 pb-0 max-w-[360px] mx-auto ${className}`}>
        
        {/* BrightChamps Style Header: Full area thumbnail or centered icon */}
        <div className="relative aspect-[16/10] bg-[#eef5ff] group-hover:bg-[#e4efff] transition-all duration-500 rounded-[1.2rem] overflow-hidden">
          
          {/* Top Left Enrolled Badge */}
          {course.showStudentsEnrolled && course.studentsEnrolled > 0 && (
          <div className="absolute top-3 left-3 bg-white/95 backdrop-blur-sm px-2.5 py-1 rounded-full flex items-center gap-1.5 shadow-md border border-white/50 z-30">
             <div className="flex -space-x-1.5">
                <div className="w-4 h-4 rounded-full bg-blue-200 border border-white flex items-center justify-center overflow-hidden">
                   <span className="text-[8px]">👦</span>
                </div>
                <div className="w-4 h-4 rounded-full bg-green-200 border border-white flex items-center justify-center overflow-hidden">
                   <span className="text-[8px]">👧</span>
                </div>
                <div className="w-4 h-4 rounded-full bg-yellow-200 border border-white flex items-center justify-center overflow-hidden">
                   <span className="text-[8px]">👶</span>
                </div>
             </div>
             <span className="text-[9px] font-black text-slate-800">{course.studentsEnrolled}+ Enrolled</span>
          </div>
          )}

          {course.thumbnail ? (
            <img 
              src={getThumbnailUrl(course.thumbnail)} 
              alt={course.title} 
              className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700 ease-out" 
            />
          ) : (
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="text-7xl filter drop-shadow-xl group-hover:scale-110 transition-transform duration-500 select-none">
                {course.category?.icon || '📚'}
              </div>
            </div>
          )}

          {/* Bottom Floating White Pill Tags */}
          <div className="absolute bottom-3 left-3 flex items-center gap-1.5 z-20">
             <span className="bg-white px-2.5 py-1 rounded-full text-[10px] font-extrabold text-slate-600 shadow-sm whitespace-nowrap">
               {course.category?.name || 'Coding Basics'}
             </span>
             <span className="bg-white px-2.5 py-1 rounded-full text-[10px] font-extrabold text-slate-600 shadow-sm whitespace-nowrap">
               {displayType}
             </span>
          </div>
        </div>

        <CardContent className="px-1 py-4 flex flex-col flex-1 bg-white">
           <h3 className="text-xl font-bold text-black mb-2 line-clamp-2 min-h-[3.5rem]">
             {course.title} {displayType !== 'All' ? `- ${displayType}` : ''}
           </h3>
           
           <div className="flex items-center gap-2 mb-3 text-sm flex-wrap">
              {course.rating > 0 && (
              <div className="flex items-center gap-1 text-slate-600">
                <Star size={14} className="text-yellow-400 fill-yellow-400 animate-pulse" /> 
                <span className="font-black text-slate-800">{course.rating.toFixed(2)}</span>
                <span className="text-slate-400 text-xs font-bold">({Math.round((course.studentsEnrolled || 10) * 3.6)} ratings)</span>
              </div>
              )}
              {course.showStudentsEnrolled && (
              <div className="flex items-center gap-1 text-slate-800 font-black text-xs ml-auto">
                <span>{course.studentsEnrolled || 0} students</span>
              </div>
              )}
           </div>

           {course.description && (
             <p className="text-sm text-gray-600 line-clamp-2 mt-1 mb-4 leading-relaxed">
               {course.description}
             </p>
           )}

           <div className="flex flex-col gap-4 mt-auto">
              <div className="flex flex-col pt-1">
                 <div className="flex items-baseline gap-2">
                    <span className="text-2xl lg:text-3xl font-black text-black">{formatPrice(displayTotal)}</span>
                    <span className="text-sm font-medium text-gray-400 line-through">{formatPrice(Math.round(displayTotal * 2.36))}</span>
                 </div>
                 {displayPerSession > 0 && displayPerSession < displayTotal && (
                   <div className="text-sm font-bold text-slate-500 mt-1">
                      ({formatPrice(displayPerSession)} per class)
                   </div>
                 )}
              </div>
              
              <div className="w-full rounded-full py-3 border-2 border-primary-500 text-primary-500 font-extrabold text-base transition-colors mt-2 text-center bg-white group-hover:bg-primary-500 group-hover:text-white">
                Book a Free Demo
              </div>
           </div>
        </CardContent>
      </Card>
    </Link>
  );
};

export default CourseCard;
