import React from 'react';

export const Logo = ({ className = "" }: { className?: string }) => {
  return (
    <div className={`flex items-center justify-center relative ${className}`}>
      {/* Bee with graduation cap */}
      <div className="absolute -top-6 left-8 animate-bounce-slow z-10 flex flex-col items-center drop-shadow-md transform rotate-12">
        <span className="text-xl -mb-3 z-20 drop-shadow-sm transform -rotate-12 translate-x-1">🎓</span>
        <span className="text-4xl">🐝</span>
      </div>
      
      {/* Playful Dotted Path */}
      <svg className="absolute -top-1 -left-4 w-12 h-10 text-gray-400 opacity-60 z-0" viewBox="0 0 100 100" fill="none" stroke="currentColor" strokeWidth="3" strokeDasharray="4 4" strokeLinecap="round">
        <path d="M10,90 Q40,10 80,60" />
      </svg>
      
      {/* Ruzann bubble text */}
      <div className="text-4xl md:text-5xl font-black tracking-tighter drop-shadow-sm font-sans relative z-10 flex">
        <span className="text-[#8B5CF6] transform hover:-translate-y-1 transition-transform">R</span>
        <span className="text-[#3B82F6] transform hover:-translate-y-1 transition-transform">u</span>
        <span className="text-[#EC4899] transform hover:-translate-y-1 transition-transform">z</span>
        <span className="text-[#F43F5E] transform hover:-translate-y-1 transition-transform">a</span>
        <span className="text-[#FBBF24] transform hover:-translate-y-1 transition-transform">n</span>
        <span className="text-[#06B6D4] transform hover:-translate-y-1 transition-transform">n</span>
      </div>
    </div>
  );
};
