import React from 'react';
import { motion } from 'framer-motion';
import { Brain, Star, Award, TrendingUp, Sparkles, ShieldCheck, Users, Code2, Video } from 'lucide-react';

interface HeroProps {
  onStartClick: () => void;
}

export default function Hero({ onStartClick }: HeroProps) {
  const benefits = [
    {
      title: "Personalized AI Readiness Score",
      description: "Gain clarity on how well-equipped your child is for the AI era.",
      icon: Brain,
      color: "from-pink-500 to-rose-500",
    },
    {
      title: "Future Skills Analysis",
      description: "Evaluate key attributes: logic, problem solving, and creativity.",
      icon: TrendingUp,
      color: "from-amber-500 to-orange-500",
    },
    {
      title: "Strengths & Opportunities",
      description: "Identify personalized learning pathways and areas of immediate growth.",
      icon: Sparkles,
      color: "from-emerald-500 to-teal-500",
    },
    {
      title: "Recommended Learning Path",
      description: "Receive curriculum matching based specifically on your child's age group.",
      icon: Award,
      color: "from-blue-500 to-indigo-500",
    },
    {
      title: "Instant AI Readiness Report",
      description: "Download or email a comprehensive PDF report instantly after completion.",
      icon: ShieldCheck,
      color: "from-violet-500 to-purple-500",
    }
  ];

  return (
    <section className="relative overflow-hidden bg-gradient-to-b from-[#f8fafc] via-[#f1f5f9] to-white py-16 md:py-24 px-4">
      {/* Playful Floating Shapes */}
      <div className="absolute top-10 left-10 w-24 h-24 bg-pink-300 rounded-full mix-blend-multiply filter blur-xl opacity-30 animate-float-a pointer-events-none" />
      <div className="absolute bottom-10 right-10 w-32 h-32 bg-purple-300 rounded-full mix-blend-multiply filter blur-xl opacity-30 animate-float-b pointer-events-none" />
      <div className="absolute top-1/2 left-2/3 w-28 h-28 bg-yellow-200 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-float-c pointer-events-none" />

      <div className="max-w-7xl mx-auto flex flex-col items-center text-center relative z-10">
        {/* Badge */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary-50 border border-primary-100 text-primary-500 font-extrabold text-xs sm:text-sm uppercase tracking-wider mb-6"
        >
          <Sparkles size={16} className="text-primary-500 animate-pulse" />
          Free 3-Minute Assessment
        </motion.div>

        {/* Headline */}
        <motion.h1
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.1 }}
          className="font-baloo text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-black text-navy-900 leading-[1.1] tracking-tight max-w-4xl"
        >
          🚀 Is Your Child Ready for the <span className="text-[#EF4444] bg-clip-text bg-gradient-to-r from-primary-500 to-secondary-500">AI Future?</span>
        </motion.h1>

        {/* Subheadline */}
        <motion.p
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="text-lg md:text-xl font-bold text-gray-500 max-w-3xl mt-6 leading-relaxed"
        >
          Take this FREE 3-Minute AI Readiness Assessment and discover your child's future potential in AI, Coding, Robotics, and Future Skills.
        </motion.p>

        {/* Primary CTA */}
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5, delay: 0.3 }}
          className="mt-10"
        >
          <button
            onClick={onStartClick}
            className="px-10 py-5 rounded-2xl bg-[#EF4444] hover:bg-[#DC2626] text-white font-black text-xl md:text-2xl transition-all shadow-lg hover:shadow-xl hover:scale-105 active:scale-95 uppercase tracking-wide border-b-8 border-[#DC2626] active:border-b-0 active:translate-y-2 inline-flex items-center gap-3"
          >
            START FREE ASSESSMENT
          </button>
        </motion.div>

        {/* Benefit Cards Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-6 mt-20 w-full">
          {benefits.map((benefit, idx) => (
            <motion.div
              key={idx}
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.1 * idx + 0.3 }}
              className="bg-white rounded-3xl p-6 shadow-sm border border-gray-100 flex flex-col items-center hover:shadow-xl hover:-translate-y-2 transition-all duration-300 group"
            >
              <div className={`w-14 h-14 rounded-2xl bg-gradient-to-br ${benefit.color} text-white flex items-center justify-center shadow-md mb-5 group-hover:scale-110 transition-transform duration-300`}>
                <benefit.icon size={26} />
              </div>
              <h3 className="font-baloo font-bold text-navy-900 text-base leading-snug mb-2">
                {benefit.title}
              </h3>
              <p className="text-gray-400 font-bold text-xs leading-relaxed">
                {benefit.description}
              </p>
            </motion.div>
          ))}
        </div>

        {/* Floating Trust Bar Card */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.8 }}
          whileHover={{ y: -4, transition: { duration: 0.2 } }}
          className="mt-16 md:mt-20 w-full max-w-5xl bg-white rounded-3xl p-6 md:p-8 shadow-[0_20px_50px_rgba(0,0,0,0.06)] border border-gray-100/80 relative z-20"
        >
          <p className="text-[10px] sm:text-xs font-black text-gray-400 uppercase tracking-widest mb-6">
            Empowering the Next Generation of Tech Leaders
          </p>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 md:gap-8">
            {/* Stat 1 */}
            <div className="flex flex-col sm:flex-row items-center justify-center gap-3 text-center sm:text-left">
              <div className="w-12 h-12 rounded-2xl bg-rose-50 text-[#EF4444] flex items-center justify-center shrink-0 shadow-sm border border-rose-100/50">
                <Users size={22} />
              </div>
              <div>
                <div className="text-2xl md:text-3xl font-black text-navy-900 font-baloo leading-none mb-1">10,000+</div>
                <div className="text-xs font-bold text-gray-500">Students Empowered</div>
              </div>
            </div>

            {/* Stat 2 */}
            <div className="flex flex-col sm:flex-row items-center justify-center gap-3 text-center sm:text-left">
              <div className="w-12 h-12 rounded-2xl bg-amber-50 text-amber-500 flex items-center justify-center shrink-0 shadow-sm border border-amber-100/50">
                <Code2 size={22} />
              </div>
              <div>
                <div className="text-2xl md:text-3xl font-black text-navy-900 font-baloo leading-none mb-1">1,000+</div>
                <div className="text-xs font-bold text-gray-500">Projects Built</div>
              </div>
            </div>

            {/* Stat 3 */}
            <div className="flex flex-col sm:flex-row items-center justify-center gap-3 text-center sm:text-left">
              <div className="w-12 h-12 rounded-2xl bg-emerald-50 text-emerald-500 flex items-center justify-center shrink-0 shadow-sm border border-emerald-100/50">
                <Video size={22} />
              </div>
              <div>
                <div className="text-2xl md:text-3xl font-black text-navy-900 font-baloo leading-none mb-1">Live</div>
                <div className="text-xs font-bold text-gray-500">Expert Mentors</div>
              </div>
            </div>

            {/* Stat 4 */}
            <div className="flex flex-col sm:flex-row items-center justify-center gap-3 text-center sm:text-left">
              <div className="w-12 h-12 rounded-2xl bg-purple-50 text-purple-600 flex items-center justify-center shrink-0 shadow-sm border border-purple-100/50">
                <Brain size={22} />
              </div>
              <div>
                <div className="text-2xl md:text-3xl font-black text-[#EF4444] font-baloo leading-none mb-1">AI-First</div>
                <div className="text-xs font-bold text-gray-500">Skills Curriculum</div>
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
