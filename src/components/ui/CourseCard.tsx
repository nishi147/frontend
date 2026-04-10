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
      onClick={() => trackEvent('course_details_click', {
        course_id: course._id,
        course_title: course.title,
        category: course.category?.name,
        age_group: course.ageGroup
      })}
    >
      <Card className={`h-full border border-gray-200 rounded-[1.5rem] shadow-sm hover:shadow-lg transition-all duration-300 flex flex-col bg-white overflow-hidden cursor-pointer ${className}`}>
        
        {/* BrightChamps Style Header: light blue, centered icon */}
        <div className="relative aspect-[16/10] bg-[#eef5ff] flex items-center justify-center p-8 group-hover:bg-[#e4efff] transition-colors">
          
          {/* Top Left Enrolled Badge */}
          {course.showStudentsEnrolled && course.studentsEnrolled > 0 && (
          <div className="absolute top-3 left-3 bg-white/80 backdrop-blur-sm px-2 py-1 rounded-full flex items-center gap-1 shadow-sm border border-white">
             <div className="w-4 h-4 rounded-full bg-blue-100 flex items-center justify-center overflow-hidden">
                <span className="text-[8px]">👦</span>
             </div>
             <span className="text-[10px] font-bold text-gray-700">{course.studentsEnrolled} Enrolled</span>
          </div>
          )}

          <div className="w-24 h-24 relative z-10 flex items-center justify-center">
            {course.thumbnail ? (
              <img 
                src={getThumbnailUrl(course.thumbnail)} 
                alt={course.title} 
                className="w-full h-full object-contain filter drop-shadow-md group-hover:scale-110 transition-transform duration-500" 
              />
            ) : (
              <div className="text-6xl filter drop-shadow-md group-hover:scale-110 transition-transform duration-500 select-none">
                {course.category?.icon || '📚'}
              </div>
            )}
          </div>

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
