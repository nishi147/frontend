"use client";

import React from 'react';
import { Star, Award } from 'lucide-react';
import { useAuth } from '@/context/AuthContext';

export const RewardsWidget = () => {
  const { user } = useAuth();

  if (user?.role !== 'student') return null;

  return (
    <div className="fixed top-20 right-6 z-[200] flex flex-col gap-3">
      <div className="bg-white/80 backdrop-blur-md border border-yellow-200 shadow-lg shadow-yellow-100/50 flex items-center gap-3 px-4 py-2 rounded-2xl animate-bounce-slow">
        <div className="bg-yellow-400 p-2 rounded-xl">
          <Star className="w-5 h-5 text-white fill-white" />
        </div>
        <div>
          <p className="text-[10px] font-black text-yellow-700 uppercase leading-none mb-1">Stars</p>
          <p className="text-lg font-black text-yellow-600 leading-none">{user?.stars || 0}</p>
        </div>
      </div>

      <div className="bg-white/80 backdrop-blur-md border border-indigo-200 shadow-lg shadow-indigo-100/50 flex items-center gap-3 px-4 py-2 rounded-2xl animate-bounce-slow" style={{ animationDelay: '0.2s' }}>
        <div className="bg-indigo-500 p-2 rounded-xl">
          <Award className="w-5 h-5 text-white" />
        </div>
        <div>
          <p className="text-[10px] font-black text-indigo-700 uppercase leading-none mb-1">Gems</p>
          <p className="text-lg font-black text-indigo-600 leading-none">{user?.gems || 0}</p>
        </div>
      </div>
    </div>
  );
};
