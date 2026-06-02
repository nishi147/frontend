import React from 'react';
import { motion } from 'framer-motion';
import { Star, Quote, Award } from 'lucide-react';

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
      avatar: "/review_girl_black.jpg",
      studentAvatar: null
    },
    {
      parent: "Ananya Sen",
      student: "Ishaan (Age 11)",
      city: "Delhi",
      text: "Ishaan's report highlighted his innovative thinking but showed logic needed work. We booked the ₹99 demo class, and the mentor was fantastic at explaining the concepts.",
      rating: 5,
      avatar: "/review_woman_maroon.jpg",
      studentAvatar: "/review_boy_white.jpg"
    }
  ];

  return (
    <section className="py-20 px-4 bg-[#f8fafc] border-t border-gray-100">
      <div className="max-w-7xl mx-auto">
        
        {/* Statistics Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8 mb-20">
          <div className="bg-white rounded-[32px] p-8 border border-gray-100/80 shadow-[0_15px_35px_rgba(0,0,0,0.05)] hover:shadow-[0_20px_50px_rgba(0,0,0,0.08)] hover:-translate-y-1.5 transition-all duration-300 text-center">
            <div className="font-baloo text-4xl md:text-5xl font-black text-primary-500 mb-2">
              10,000+
            </div>
            <p className="text-gray-600 font-bold text-sm">Students Empowered</p>
            <p className="text-gray-400 text-xs mt-1">Across 15+ cities in India</p>
          </div>
          
          <div className="bg-white rounded-[32px] p-8 border border-gray-100/80 shadow-[0_15px_35px_rgba(0,0,0,0.05)] hover:shadow-[0_20px_50px_rgba(0,0,0,0.08)] hover:-translate-y-1.5 transition-all duration-300 text-center">
            <div className="font-baloo text-4xl md:text-5xl font-black text-secondary-500 mb-2">
              1,000+
            </div>
            <p className="text-gray-600 font-bold text-sm">Projects Created</p>
            <p className="text-gray-400 text-xs mt-1">From Scratch games to Python models</p>
          </div>

          <div className="bg-white rounded-[32px] p-8 border border-gray-100/80 shadow-[0_15px_35px_rgba(0,0,0,0.05)] hover:shadow-[0_20px_50px_rgba(0,0,0,0.08)] hover:-translate-y-1.5 transition-all duration-300 text-center">
            <div className="font-baloo text-4xl md:text-5xl font-black text-accent-500 mb-2">
              500+
            </div>
            <p className="text-gray-600 font-bold text-sm">Workshops Conducted</p>
            <p className="text-gray-400 text-xs mt-1">Engaging, interactive tech bootcamps</p>
          </div>

          <div className="bg-white rounded-[32px] p-8 border border-gray-100/80 shadow-[0_15px_35px_rgba(0,0,0,0.05)] hover:shadow-[0_20px_50px_rgba(0,0,0,0.08)] hover:-translate-y-1.5 transition-all duration-300 text-center">
            <div className="font-baloo text-4xl md:text-5xl font-black text-navy-900 mb-2">
              100%
            </div>
            <p className="text-gray-600 font-bold text-sm">Future Skills Focused</p>
            <p className="text-gray-400 text-xs mt-1">Curriculums mapped to modern AI standards</p>
          </div>
        </div>

        {/* Testimonials Title */}
        <div className="text-center max-w-2xl mx-auto mb-16">
          <span className="text-xs font-black text-secondary-500 uppercase tracking-widest block mb-3">
            Parent Feedback
          </span>
          <h2 className="font-baloo text-3xl sm:text-4xl md:text-5xl font-black text-navy-900 leading-tight">
            Hear What <span className="text-[#6b4fbb]">Parents</span> Say
          </h2>
          <p className="text-gray-500 font-bold mt-4 text-sm sm:text-base">
            See how the AI Readiness assessment helps families make clear academic decisions.
          </p>
        </div>

        {/* Testimonials Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {testimonials.map((t, idx) => (
            <motion.div
              key={idx}
              initial={{ opacity: 0, scale: 0.95 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true, margin: "-50px" }}
              transition={{ duration: 0.4, delay: 0.1 * idx }}
              className="bg-white rounded-3xl p-8 border border-gray-100 shadow-sm relative flex flex-col justify-between hover:shadow-lg transition-shadow duration-300"
            >
              {/* Quote Icon */}
              <div className="absolute top-6 right-6 text-gray-100 pointer-events-none">
                <Quote size={40} className="fill-current" />
              </div>

              {/* Stars */}
              <div className="flex gap-1 mb-5">
                {[...Array(t.rating)].map((_, i) => (
                  <Star key={i} size={16} className="text-yellow-400 fill-current" />
                ))}
              </div>

              {/* Text */}
              <p className="text-gray-500 font-semibold text-xs sm:text-sm leading-relaxed mb-6 italic">
                "{t.text}"
              </p>

              {/* Reviewer Details */}
              <div className="flex items-center gap-4 border-t border-gray-50 pt-5 mt-auto">
                <div className="flex items-center shrink-0">
                  <div className="w-12 h-12 rounded-full border border-gray-100 overflow-hidden shadow-sm bg-gray-50 flex items-center justify-center">
                    {t.avatar.startsWith('/') ? (
                      <img src={t.avatar} alt={t.parent} className="w-full h-full object-cover" />
                    ) : (
                      <span className="text-xl">{t.avatar}</span>
                    )}
                  </div>
                  {t.studentAvatar && (
                    <div className="w-8 h-8 -ml-4 mt-6 rounded-full border-2 border-white overflow-hidden shrink-0 shadow-md">
                      <img src={t.studentAvatar} alt={t.student} className="w-full h-full object-cover" />
                    </div>
                  )}
                </div>
                <div>
                  <h4 className="font-baloo font-bold text-navy-900 text-sm leading-none">
                    {t.parent}
                  </h4>
                  <p className="text-gray-400 font-extrabold text-[10px] sm:text-xs tracking-tighter mt-1">
                    Parent of {t.student} • {t.city}
                  </p>
                </div>
              </div>
            </motion.div>
          ))}
        </div>

      </div>
    </section>
  );
}
