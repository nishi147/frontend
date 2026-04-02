"use client";

import React, { useState, useEffect } from 'react';
import api from '@/utils/api';
import { Card, CardContent } from '@/components/ui/Card';
import { Star, Sparkles, Loader2 } from 'lucide-react';

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
          // Limit to 10 projects for performance and "preview" feel
          setProjects(res.data.data.slice(0, 10));
        }
      } catch (err) {
        console.error('Error fetching projects:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchProjects();
  }, []);

  if (loading) return (
    <div className="py-20 flex flex-col items-center justify-center space-y-4">
      <Loader2 className="w-12 h-12 text-primary-500 animate-spin" />
      <p className="text-gray-500 font-bold animate-pulse">Scanning the cosmos for projects...</p>
    </div>
  );

  if (projects.length === 0) return null;

  return (
    <section className="py-12 md:py-20 px-4 bg-white overflow-hidden" id="student-projects">
      <div className="max-w-7xl mx-auto relative">
        {/* Decorative Header Area (Matching Screenshot) */}
        <div className="text-center mb-10 md:mb-16 relative">
          {/* SVG Decorations */}
          <div className="absolute left-[8%] top-0 hidden lg:block opacity-70 animate-bounce-slow">
            <div className="w-4 h-4 rounded-full bg-blue-500 mb-2" />
            <div className="w-8 h-8 rounded-full bg-orange-500 ml-8" />
            <div className="w-10 h-10 text-3xl">✨</div>
          </div>
          
          <div className="absolute right-[5%] top-0 hidden lg:block">
            <svg width="220" height="80" viewBox="0 0 220 80" fill="none" xmlns="http://www.w3.org/2000/svg" className="animate-float">
               <path d="M20 60 Q110 -20 200 60" stroke="#FFD700" strokeWidth="8" strokeLinecap="round" fill="none" />
               <circle cx="20" cy="62" r="12" fill="#3B82F6" />
               <circle cx="200" cy="62" r="15" fill="#FFA500" />
               <text x="140" y="30" fontSize="24" transform="rotate(15, 140, 30)">⭐</text>
            </svg>
          </div>

          <h2 className="text-3xl md:text-5xl font-black text-[#1a0a54] mb-4">
            Discover <span className="text-blue-600"></span> Students Projects
          </h2>
          <p className="text-gray-500 font-bold text-sm md:text-xl max-w-2xl mx-auto opacity-70">
            Explore out these projects by RUZANN Coders that are out of this world! 
          </p>
        </div>

        {/* Project Carousel (Mobile: horizontal, Desktop: smaller cards) */}
        <div className="flex overflow-x-auto md:grid md:grid-cols-4 lg:grid-cols-5 gap-6 md:gap-6 pb-10 scrollbar-hide no-scrollbar snap-x px-2 -mx-2 md:mx-0 md:px-0">
          {projects.map((project) => {
             // Extract Scratch ID for better preview if scratch
             const scratchId = project.url.split('/').filter(Boolean).pop();
             const previewUrl = `https://cdn2.scratch.mit.edu/get_image/project/${scratchId}_282x210.png`;

             return (
               <div key={project._id} className="min-w-[280px] md:min-w-0 snap-center group">
                 <Card className="h-full border-2 border-gray-50 rounded-[2rem] overflow-hidden hover:border-blue-100 transition-all duration-500 hover:shadow-2xl hover:shadow-blue-100/50 flex flex-col bg-white">
                    {/* Compact Image Frame */}
                    <div className="relative aspect-[4/3] bg-slate-100 overflow-hidden">
                       <img 
                         src={previewUrl} 
                         alt={project.title}
                         className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                         onError={(e) => { e.currentTarget.src = 'https://scratch.mit.edu/static/images/scratch-logo-sm.png'; }}
                       />
                       <div className="absolute inset-0 bg-gradient-to-t from-black/10 to-transparent pointer-events-none" />
                    </div>

                    <CardContent className="p-5 flex flex-col flex-1 gap-y-2">
                       <h3 className="text-lg font-black text-blue-600 leading-tight group-hover:text-blue-700 transition-colors line-clamp-1">
                         {project.title}
                       </h3>
                       <p className="text-slate-800 font-bold text-xs leading-relaxed line-clamp-2 min-h-[2.5rem]">
                         {project.description}
                       </p>
                       <div className="mt-2 text-[10px] font-black text-slate-400 uppercase tracking-widest flex items-center gap-1">
                          <Sparkles size={10} className="text-orange-400" /> {project.studentName}
                       </div>
                    </CardContent>
                 </Card>
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
