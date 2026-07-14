"use client";

import React, { useState, useEffect, useRef, useCallback } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';

interface SliderWrapperProps {
  children: React.ReactNode[];
  /** Cards visible on desktop (lg). Default 3 */
  slidesPerViewLg?: number;
  /** Cards visible on tablet (md). Default 2 */
  slidesPerViewMd?: number;
  /** Cards visible on mobile. Default 1 */
  slidesPerViewSm?: number;
  /** Auto-play interval in ms. Set 0 to disable. Default 4000 */
  autoPlay?: number;
  /** Gap between slides in px. Default 24 */
  gap?: number;
  /** Accent color for active dot & arrows (Tailwind class prefix) */
  accentColor?: string;
}

function useWindowWidth() {
  const [width, setWidth] = useState<number>(typeof window !== 'undefined' ? window.innerWidth : 1200);
  useEffect(() => {
    const handler = () => setWidth(window.innerWidth);
    window.addEventListener('resize', handler);
    return () => window.removeEventListener('resize', handler);
  }, []);
  return width;
}

export const SliderWrapper: React.FC<SliderWrapperProps> = ({
  children,
  slidesPerViewLg = 3,
  slidesPerViewMd = 2,
  slidesPerViewSm = 1,
  autoPlay = 4000,
  gap = 24,
  accentColor = 'primary',
}) => {
  const width = useWindowWidth();
  const items = React.Children.toArray(children);

  let slidesPerView = slidesPerViewSm;
  if (width >= 1024) {
    slidesPerView = slidesPerViewLg;
  } else if (width >= 768) {
    slidesPerView = slidesPerViewMd;
  } else if (slidesPerViewSm !== 1) {
    slidesPerView = width >= 550 ? slidesPerViewSm * 1.5 : slidesPerViewSm;
  }

  const maxIndex = Math.max(0, items.length - slidesPerView);
  const [current, setCurrent] = useState(0);
  const [isHovered, setIsHovered] = useState(false);
  const timerRef = useRef<NodeJS.Timeout | null>(null);

  // Touch support
  const touchStartX = useRef<number | null>(null);
  const touchEndX   = useRef<number | null>(null);

  const goTo = useCallback((idx: number) => {
    setCurrent(Math.min(Math.max(idx, 0), maxIndex));
  }, [maxIndex]);

  const prev = useCallback(() => goTo(current === 0 ? maxIndex : current - 1), [current, maxIndex, goTo]);
  const next = useCallback(() => goTo(current === maxIndex ? 0 : current + 1), [current, maxIndex, goTo]);

  // Auto-play
  useEffect(() => {
    if (!autoPlay || isHovered || items.length <= slidesPerView) return;
    timerRef.current = setInterval(next, autoPlay);
    return () => { if (timerRef.current) clearInterval(timerRef.current); };
  }, [autoPlay, isHovered, next, items.length, slidesPerView]);

  // Clamp current when resizing
  useEffect(() => {
    if (current > maxIndex) setCurrent(maxIndex);
  }, [maxIndex, current]);

  const cardWidthPercent = 100 / slidesPerView;

  const onTouchStart = (e: React.TouchEvent) => { touchStartX.current = e.touches[0].clientX; };
  const onTouchMove  = (e: React.TouchEvent) => { touchEndX.current = e.touches[0].clientX; };
  const onTouchEnd   = () => {
    if (touchStartX.current === null || touchEndX.current === null) return;
    const diff = touchStartX.current - touchEndX.current;
    if (Math.abs(diff) > 40) diff > 0 ? next() : prev();
    touchStartX.current = null;
    touchEndX.current = null;
  };

  if (items.length === 0) return null;

  const dotCount = maxIndex + 1;

  return (
    <div
      className="relative w-full"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {/* Overflow container */}
      <div className="overflow-hidden w-full">
        <div
          className="flex transition-transform duration-500 ease-in-out"
          style={{
            transform: `translateX(calc(-${current * cardWidthPercent}% - ${(current * gap) / slidesPerView}px))`,
            gap: `${gap}px`,
          }}
          onTouchStart={onTouchStart}
          onTouchMove={onTouchMove}
          onTouchEnd={onTouchEnd}
        >
          {items.map((child, i) => (
            <div
              key={i}
              className="flex-shrink-0"
              style={{ width: `calc(${cardWidthPercent}% - ${gap * (slidesPerView - 1) / slidesPerView}px)` }}
            >
              {child}
            </div>
          ))}
        </div>
      </div>

      {/* Prev / Next Arrows — only show when more than one "page" */}
      {items.length > slidesPerView && (
        <>
          <button
            onClick={prev}
            aria-label="Previous slide"
            className="absolute -left-4 md:-left-6 top-1/2 -translate-y-1/2 z-20 w-10 h-10 md:w-12 md:h-12 rounded-full bg-white shadow-xl border border-gray-100 flex items-center justify-center text-gray-700 hover:bg-primary-500 hover:text-white hover:border-primary-500 transition-all duration-200 active:scale-95"
          >
            <ChevronLeft size={20} />
          </button>
          <button
            onClick={next}
            aria-label="Next slide"
            className="absolute -right-4 md:-right-6 top-1/2 -translate-y-1/2 z-20 w-10 h-10 md:w-12 md:h-12 rounded-full bg-white shadow-xl border border-gray-100 flex items-center justify-center text-gray-700 hover:bg-primary-500 hover:text-white hover:border-primary-500 transition-all duration-200 active:scale-95"
          >
            <ChevronRight size={20} />
          </button>
        </>
      )}

      {/* Dot Indicators */}
      {dotCount > 1 && (
        <div className="flex justify-center gap-2 mt-6">
          {Array.from({ length: dotCount }).map((_, i) => (
            <button
              key={i}
              onClick={() => goTo(i)}
              aria-label={`Go to slide ${i + 1}`}
              className={`rounded-full transition-all duration-300 ${
                i === current
                  ? 'w-6 h-2.5 bg-primary-500'
                  : 'w-2.5 h-2.5 bg-gray-200 hover:bg-gray-400'
              }`}
            />
          ))}
        </div>
      )}
    </div>
  );
};

export default SliderWrapper;
