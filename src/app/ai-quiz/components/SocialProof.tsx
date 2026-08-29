import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Star, Quote, ChevronLeft, ChevronRight } from 'lucide-react';

export default function SocialProof() {
  const testimonials = [
    {
      parent: "Meera Deshmukh",
      student: "Aarav (Age 9)",
      city: "Pune",
      text: "The report categorized Aarav as an 'AI Explorer' and recommended the visual coding route. The insights were spot on! He's already building games on Scratch.",
      rating: 5,
      avatar: "/review_woman_blue.jpg",
      studentAvatar: "/review_boy_red.jpg"
    },
    {
      parent: "Rajesh Kumar",
      student: "Sneha (Age 14)",
      city: "Mumbai",
      text: "I was confused about whether Python or Web Dev was right for Sneha. This test showed her logical strengths and recommended the 'AI Creator' course. Extremely helpful!",
      rating: 5,
      avatar: "/review_parent_rajesh.jpg",
      studentAvatar: "/review_girl_black.jpg"
    },
    {
      parent: "Ananya Sen",
      student: "Ishaan (Age 11)",
      city: "Delhi",
      text: "Ishaan's report highlighted his innovative thinking but showed logic needed work. We booked the Free Trial demo class, and the mentor was fantastic at explaining the concepts.",
      rating: 5,
      avatar: "/review_woman_maroon.jpg",
      studentAvatar: "/review_boy_white.jpg"
    }
  ];

  const [currentIndex, setCurrentIndex] = useState(0);
  const [direction, setDirection] = useState(0); // -1 for left, 1 for right
  const [isHovered, setIsHovered] = useState(false);

  const handlePrev = () => {
    setDirection(-1);
    setCurrentIndex((prev) => (prev === 0 ? testimonials.length - 1 : prev - 1));
  };

  const handleNext = () => {
    setDirection(1);
    setCurrentIndex((prev) => (prev === testimonials.length - 1 ? 0 : prev + 1));
  };

  useEffect(() => {
    if (isHovered) return;
    const timer = setInterval(() => {
      handleNext();
    }, 5000);
    return () => clearInterval(timer);
  }, [isHovered]);

  const slideVariants = {
    enter: (dir: number) => ({
      x: dir > 0 ? 120 : -120,
      opacity: 0
    }),
    center: {
      x: 0,
      opacity: 1
    },
    exit: (dir: number) => ({
      x: dir < 0 ? 120 : -120,
      opacity: 0
    })
  };

  return (
    <section className="py-20 px-4 bg-[#f8fafc] border-t border-gray-100">
      <div className="max-w-7xl mx-auto">
        
      
        {/* Testimonials Title */}
        <div className="text-center max-w-2xl mx-auto mb-16">
          <span className="text-xs font-black text-secondary-500 uppercase tracking-widest block mb-3">
            Parent Feedback
          </span>
          <h2 className="font-baloo text-3xl sm:text-4xl md:text-5xl font-black text-navy-900 leading-tight">
            Hear What <span className="text-[#0D47A1]">Parents</span> Say About Ruzann
          </h2>
          <p className="text-gray-500 font-bold mt-4 text-sm sm:text-base">
            See how the AI Readiness assessment helps families make clear academic decisions.
          </p>
        </div>

        {/* Testimonials Slider */}
        <div 
          className="relative max-w-4xl mx-auto px-4 sm:px-16 flex items-center justify-center min-h-[360px]"
          onMouseEnter={() => setIsHovered(true)}
          onMouseLeave={() => setIsHovered(false)}
        >
          {/* Left Arrow Button */}
          <button
            onClick={handlePrev}
            className="absolute left-0 z-10 p-3 rounded-full bg-white border border-gray-100 shadow-md text-navy-900 hover:text-[#0D47A1] hover:scale-110 active:scale-95 transition-all duration-200 focus:outline-none"
            aria-label="Previous testimonial"
          >
            <ChevronLeft size={24} />
          </button>

          {/* Card Container */}
          <div className="w-full overflow-hidden py-4">
            <AnimatePresence initial={false} custom={direction} mode="wait">
              <motion.div
                key={currentIndex}
                custom={direction}
                variants={slideVariants}
                initial="enter"
                animate="center"
                exit="exit"
                transition={{
                  x: { type: "spring", stiffness: 300, damping: 30 },
                  opacity: { duration: 0.2 }
                }}
                className="bg-white rounded-3xl p-8 sm:p-10 border border-gray-100 shadow-[0_15px_35px_rgba(0,0,0,0.03)] relative flex flex-col justify-between hover:shadow-md transition-shadow duration-300 w-full max-w-2xl mx-auto min-h-[280px]"
              >
                {/* Quote Icon */}
                <div className="absolute top-6 right-8 text-gray-100 pointer-events-none">
                  <Quote size={48} className="fill-current opacity-60" />
                </div>

                {/* Stars */}
                <div className="flex gap-1 mb-5">
                  {[...Array(testimonials[currentIndex].rating)].map((_, i) => (
                    <Star key={i} size={18} className="text-yellow-400 fill-current" />
                  ))}
                </div>

                {/* Text */}
                <p className="text-gray-500 font-semibold text-sm sm:text-base leading-relaxed mb-8 italic">
                  "{testimonials[currentIndex].text}"
                </p>

                {/* Reviewer Details */}
                <div className="flex items-center gap-4 border-t border-gray-50 pt-5 mt-auto">
                  <div className="flex items-center shrink-0">
                    <div className="w-14 h-14 rounded-full border-2 border-white overflow-hidden shadow-md bg-gray-50 flex items-center justify-center relative z-10">
                      {testimonials[currentIndex].avatar.startsWith('/') ? (
                        <img src={testimonials[currentIndex].avatar} alt={testimonials[currentIndex].parent} className="w-full h-full object-cover" />
                      ) : (
                        <span className="text-2xl">{testimonials[currentIndex].avatar}</span>
                      )}
                    </div>
                    {testimonials[currentIndex].studentAvatar && (
                      <div className="w-9 h-9 -ml-5 mt-6 rounded-full border-2 border-white overflow-hidden shrink-0 shadow-lg relative z-20">
                        <img src={testimonials[currentIndex].studentAvatar} alt={testimonials[currentIndex].student} className="w-full h-full object-cover" />
                      </div>
                    )}
                  </div>
                  <div>
                    <h4 className="font-baloo font-bold text-navy-900 text-base leading-none">
                      {testimonials[currentIndex].parent}
                    </h4>
                    <p className="text-gray-400 font-extrabold text-[11px] sm:text-xs tracking-tighter mt-1.5">
                      Parent of {testimonials[currentIndex].student} • {testimonials[currentIndex].city}
                    </p>
                  </div>
                </div>
              </motion.div>
            </AnimatePresence>
          </div>

          {/* Right Arrow Button */}
          <button
            onClick={handleNext}
            className="absolute right-0 z-10 p-3 rounded-full bg-white border border-gray-100 shadow-md text-navy-900 hover:text-[#0D47A1] hover:scale-110 active:scale-95 transition-all duration-200 focus:outline-none"
            aria-label="Next testimonial"
          >
            <ChevronRight size={24} />
          </button>
        </div>

        {/* Indicator Dots */}
        <div className="flex justify-center gap-2 mt-8">
          {testimonials.map((_, idx) => (
            <button
              key={idx}
              onClick={() => {
                setDirection(idx > currentIndex ? 1 : -1);
                setCurrentIndex(idx);
              }}
              className={`w-3 h-3 rounded-full transition-all duration-300 focus:outline-none ${
                idx === currentIndex 
                  ? 'bg-[#0D47A1] w-8' 
                  : 'bg-gray-300 hover:bg-gray-400'
              }`}
              aria-label={`Go to slide ${idx + 1}`}
            />
          ))}
        </div>

      </div>
    </section>
  );
}

