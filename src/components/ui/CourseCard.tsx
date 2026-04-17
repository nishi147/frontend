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
  const displayPerSession = Math.round(course.pricePerSession * multiplier);
  const displayTotal = Math.round(displayPerSession * course.numberOfSessions);
  const displayType = typeFilter === 'All' ? course.courseType : typeFilter;

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
          value: Math.round(course.pricePerSession * multiplier * course.numberOfSessions),
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
      <Card className={`h-full border border-gray-200 rounded-[1.5rem] shadow-sm hover:shadow-lg transition-all duration-300 flex flex-col bg-white overflow-hidden cursor-pointer ${className}`}>
        
        {/* BrightChamps Style Header: Full area thumbnail or centered icon */}
        <div className="relative aspect-[16/10] bg-[#eef5ff] group-hover:bg-[#e4efff] transition-all duration-500 overflow-hidden">
          
          {/* Top Left Enrolled Badge */}
          {course.showStudentsEnrolled && course.studentsEnrolled > 0 && (
          <div className="absolute top-3 left-3 bg-white/90 backdrop-blur-sm px-3 py-1 rounded-full flex items-center gap-1.5 shadow-md border border-white/50 z-30">
             <div className="w-5 h-5 rounded-full bg-blue-100 flex items-center justify-center overflow-hidden">
                <span className="text-[10px]">👦</span>
             </div>
             <span className="text-[10px] font-black text-slate-800">{course.studentsEnrolled} Enrolled</span>
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
          <div className="absolute bottom-4 left-0 right-0 flex justify-center items-center gap-2 z-20">
             <span className="bg-white px-3 py-1 rounded-full text-[10px] font-bold text-gray-600 shadow-sm whitespace-nowrap">
               {course.category?.name || 'Coding Basics'}
             </span>
             <span className="bg-white px-3 py-1 rounded-full text-[10px] font-bold text-gray-600 shadow-sm whitespace-nowrap">
               {displayType}
             </span>
          </div>
        </div>

        <CardContent className="p-5 flex flex-col flex-1 bg-white">
           <h3 className="text-xl font-bold text-black mb-2 line-clamp-2 min-h-[3.5rem]">
             {course.title} {displayType !== 'All' ? `- ${displayType}` : ''}
           </h3>
           
           <div className="flex items-center justify-between mb-3 text-sm">
              {course.rating > 0 && (
              <div className="flex items-center gap-1 text-gray-600">
                <Star size={14} className="text-yellow-400 fill-yellow-400" /> 
                <span className="font-bold text-black">{course.rating.toFixed(1)}</span>
              </div>
              )}
              {course.showStudentsEnrolled && (
              <div className="flex items-center gap-1 text-black font-bold text-xs ml-auto">
                <span className="text-gray-600">👤</span> {course.studentsEnrolled || 0} students
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
                    <span className="text-sm font-medium text-gray-400 line-through">{formatPrice(displayTotal + 15000)}</span>
                 </div>
                 <div className="text-sm font-bold text-black mt-1">
                    ({formatPrice(displayPerSession)} per hour)
                 </div>
              </div>
              
              <div className="w-full rounded-full py-3 border-2 border-primary-500 text-primary-500 group-hover:bg-primary-500 group-hover:text-white font-bold text-base transition-colors mt-2 text-center">
                Enroll Now
              </div>
           </div>
        </CardContent>
      </Card>
    </Link>
  );
};

export default CourseCard;
