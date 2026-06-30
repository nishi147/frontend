"use client";

import React, { useState, useEffect, useRef } from 'react';
import api from '@/utils/api';
import { Card, CardContent } from '@/components/ui/Card';
import { Star, Sparkles, Loader2, Trophy } from 'lucide-react';

interface Project {
  _id: string;
  title: string;
  description: string;
  url: string;
  studentName: string;
  isApproved: boolean;
}

export const SuperstarProjects = () => {
  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProjects = async () => {
      try {
        const res = await api.get('/api/projects');
        if (res.data.success) {
          // Limit to 10 projects for performance and preview feel
          setProjects(res.data.data.slice(0, 10));
        }
      } catch (error) {
        console.error("Error fetching projects:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchProjects();
  }, []);

  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const isMobile = window.matchMedia("(max-width: 768px)").matches;
    if (!isMobile) return;

    let intervalId: NodeJS.Timeout;

    const startAutoScroll = () => {
      intervalId = setInterval(() => {
        const container = scrollRef.current;
        if (container) {
          const maxScroll = container.scrollWidth - container.clientWidth;
          if (container.scrollLeft >= maxScroll - 10) {
            container.scrollTo({ left: 0, behavior: 'smooth' });
          } else {
            container.scrollBy({ left: 320, behavior: 'smooth' });
          }
        }
      }, 3000);
    };

    if (projects.length > 0) {
        setTimeout(() => {
          startAutoScroll();
          const container = scrollRef.current;
          if (container) {
             container.addEventListener('touchstart', () => clearInterval(intervalId));
             container.addEventListener('touchend', startAutoScroll);
          }
        }, 500);
    }
    return () => clearInterval(intervalId);
  }, [projects]);

  if (loading) return (
    <div className="py-20 flex flex-col items-center justify-center space-y-4">
      <Loader2 className="w-12 h-12 text-primary-500 animate-spin" />
      <p className="text-gray-500 font-bold animate-pulse">Scanning the cosmos for projects...</p>
    </div>
  );

  if (projects.length === 0) return null;

  return (
    <section className="py-12 md:py-24 px-4 bg-[#f8fafc] overflow-hidden" id="student-projects">
      <div className="max-w-7xl mx-auto relative">
        {/* Decorative Header Area */}
        <div className="text-center mb-12 md:mb-20 relative">
          <div className="flex items-center justify-center gap-3 mb-2">
            <Trophy className="w-8 h-8 md:w-10 md:h-10 text-yellow-500" />
            <h2 className="text-4xl md:text-6xl font-black tracking-tighter drop-shadow-sm text-slate-900">
              Projects by{' '}
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-green-400 to-blue-500">Students</span>
            </h2>
          </div>
          <p className="text-base md:text-xl font-bold max-w-2xl mx-auto leading-relaxed text-slate-500 mt-2">
            Explore amazing creations built by our young innovators that are out of this world!
          </p>
        </div>

        {/* Project Carousel (Horizontal Slider) */}
        <div ref={scrollRef} className="flex overflow-x-auto gap-8 md:gap-10 pb-16 scrollbar-hide no-scrollbar snap-x px-4 md:px-0 -mx-4 md:mx-0">
          {projects.map((project) => {
             // Extract Scratch ID for better preview if scratch
             const scratchId = project.url.split('/').filter(Boolean).pop();
             const previewUrl = `https://cdn2.scratch.mit.edu/get_image/project/${scratchId}_282x210.png`;

             return (
               <div key={project._id} className="min-w-[280px] md:min-w-[380px] snap-center group">
                 <div className="h-full bg-white rounded-[3rem] p-4 md:p-6 shadow-xl shadow-blue-500/5 hover:shadow-2xl hover:shadow-primary-500/10 transition-all duration-500 hover:-translate-y-2 flex flex-col border border-white">
                    {/* Image Container with rounded corners to match iSchool */}
                    <div className="relative aspect-[4/3] bg-slate-50 rounded-[2.5rem] overflow-hidden mb-6">
                       <img 
                         src={previewUrl} 
                         alt={project.title}
                         className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                         onError={(e) => { e.currentTarget.src = 'https://scratch.mit.edu/static/images/scratch-logo-sm.png'; }}
                       />
                    </div>

                    <div className="px-2 pb-2 flex flex-col flex-1">
                       <h3 className="text-2xl md:text-3xl font-black text-blue-600 mb-3 tracking-tight leading-none group-hover:text-primary-600 transition-colors">
                         {project.title}
                       </h3>
                       <p className="text-slate-900 font-bold text-sm md:text-base leading-relaxed line-clamp-3 opacity-80 mb-6">
                         {project.description}
                       </p>
                       <div className="mt-auto pt-4 border-t border-slate-50 flex items-center justify-between">
                          <div className="text-[10px] font-black text-slate-400 uppercase tracking-widest flex items-center gap-2">
                             <div className="w-6 h-6 rounded-full bg-primary-50 flex items-center justify-center text-primary-500">
                                <Sparkles size={12} />
                             </div>
                             {project.studentName}
                          </div>
                          <span className="text-[10px] font-black text-primary-500 uppercase tracking-widest bg-primary-50 px-3 py-1 rounded-full">Student Project</span>
                       </div>
                    </div>
                 </div>
               </div>
             );
          })}
        </div>

        {/* Mobile Swipe Indicator */}
        <div className="flex justify-center md:hidden mt-[-1rem] pb-8">
           <div className="flex gap-1">
              <div className="w-8 h-1.5 rounded-full bg-blue-600" />
              <div className="w-1.5 h-1.5 rounded-full bg-slate-200" />
              <div className="w-1.5 h-1.5 rounded-full bg-slate-200" />
           </div>
        </div>
      </div>
    </section>
  );
};
