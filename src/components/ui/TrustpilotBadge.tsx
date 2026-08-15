"use client";

import React from 'react';
import { Star, StarHalf, ShieldCheck } from 'lucide-react';

interface TrustpilotBadgeProps {
  variant?: 'hero' | 'compact' | 'card' | 'inline' | 'dark';
  className?: string;
  showReviewCount?: boolean;
}

export const TrustpilotBadge: React.FC<TrustpilotBadgeProps> = ({
  variant = 'compact',
  className = '',
  showReviewCount = true,
}) => {
  const renderStars = (size: number) => (
    <div className="flex items-center gap-0.5">
      {[1, 2, 3, 4].map((s) => (
        <div key={s} className="w-4 h-4 sm:w-5 sm:h-5 bg-[#00b67a] flex items-center justify-center rounded-[2px]">
          <Star size={size} className="fill-white text-white" />
        </div>
      ))}
      <div className="w-4 h-4 sm:w-5 sm:h-5 bg-[#00b67a] flex items-center justify-center rounded-[2px]">
        <StarHalf size={size} className="fill-white text-white" />
      </div>
    </div>
  );

  const renderSmallStars = (size: number) => (
    <div className="flex items-center gap-0.5">
      {[1, 2, 3, 4].map((s) => (
        <div key={s} className="w-3.5 h-3.5 bg-[#00b67a] flex items-center justify-center rounded-[1px]">
          <Star size={size} className="fill-white text-white" />
        </div>
      ))}
      <div className="w-3.5 h-3.5 bg-[#00b67a] flex items-center justify-center rounded-[1px]">
        <StarHalf size={size} className="fill-white text-white" />
      </div>
    </div>
  );

  if (variant === 'hero') {
    return (
      <div className={`inline-flex flex-wrap items-center gap-2.5 p-2 px-3.5 rounded-2xl bg-slate-900/90 border border-slate-800 text-white shadow-xl backdrop-blur-md ${className}`}>
        <div className="flex items-center gap-1 bg-[#00b67a] px-2 py-0.5 rounded text-white font-black text-xs">
          <span className="font-extrabold tracking-tight">Trustpilot</span>
        </div>
        {renderStars(12)}
        <div className="flex items-center gap-1.5 text-xs font-bold text-slate-200">
          <span className="font-black text-[#00b67a]">4.8 / 5</span>
          <span className="text-slate-400">•</span>
          <span>{showReviewCount ? '500+ Parent Reviews' : 'Rated Excellent'}</span>
        </div>
      </div>
    );
  }

  if (variant === 'card') {
    return (
      <div className={`p-4 rounded-2xl bg-amber-50/70 border border-amber-200/80 flex items-center justify-between gap-4 ${className}`}>
        <div className="flex items-center gap-3">
          {renderStars(11)}
          <div>
            <div className="flex items-center gap-1.5">
              <span className="text-xs font-black text-slate-900">4.8 out of 5 stars</span>
              <span className="text-[10px] font-bold text-emerald-700 bg-emerald-100 px-1.5 py-0.5 rounded">Trustpilot</span>
            </div>
            <p className="text-[11px] font-medium text-slate-600">Based on 500+ verified parent reviews</p>
          </div>
        </div>
        <ShieldCheck className="w-6 h-6 text-[#00b67a] shrink-0" />
      </div>
    );
  }

  if (variant === 'dark') {
    return (
      <div className={`inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-slate-900/90 border border-slate-700/60 backdrop-blur-md text-xs ${className}`}>
        {renderSmallStars(8)}
        <span className="font-extrabold text-white text-[11px]">Trustpilot <span className="text-[#00b67a]">4.8/5</span></span>
        <span className="text-slate-400 text-[10px]">• 500+ Reviews</span>
      </div>
    );
  }

  if (variant === 'inline') {
    return (
      <div className={`inline-flex items-center gap-2 ${className}`}>
        {renderStars(10)}
        <span className="text-xs font-black text-slate-800">4.8/5 on</span>
        <span className="text-xs font-extrabold text-[#00b67a] tracking-tight">Trustpilot</span>
      </div>
    );
  }

  // Default compact
  return (
    <div className={`inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-white border border-gray-200 shadow-sm text-xs ${className}`}>
      <span className="font-black text-[#00b67a] text-[11px] tracking-tight">Trustpilot</span>
      {renderSmallStars(8)}
      <span className="font-bold text-gray-800 text-[11px]">4.8 / 5</span>
    </div>
  );
};
