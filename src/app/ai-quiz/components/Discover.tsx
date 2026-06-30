import React from 'react';
import { motion } from 'framer-motion';
import { Cpu, Lightbulb, Rocket, Milestone } from 'lucide-react';

export default function Discover() {
  const cards = [
    {
      title: "AI Readiness",
      desc: "Measures familiarity with AI applications, prompt validation, and the difference between computational power and human ingenuity.",
      icon: Cpu,
      color: "text-blue-600 bg-blue-50/50 border-blue-100 group-hover:bg-blue-600 group-hover:text-white group-hover:shadow-[0_8px_20px_rgba(59,130,246,0.3)]",
      gradient: "from-blue-500 to-indigo-600",
      glowColor: "bg-blue-400"
    },
    {
      title: "Problem Solving",
      desc: "Evaluates procedural and analytical thinking: how your child decomposes a complex puzzle and devises step-by-step algorithms.",
      icon: Lightbulb,
      color: "text-amber-600 bg-amber-50/50 border-amber-100 group-hover:bg-amber-500 group-hover:text-white group-hover:shadow-[0_8px_20px_rgba(245,158,11,0.3)]",
      gradient: "from-amber-500 to-orange-600",
      glowColor: "bg-amber-400"
    },
    {
      title: "Innovation Potential",
      desc: "Assesses creative confidence, divergent thinking, and the ability to adapt design rules to invent brand-new concepts.",
      icon: Rocket,
      color: "text-pink-600 bg-pink-50/50 border-pink-100 group-hover:bg-pink-500 group-hover:text-white group-hover:shadow-[0_8px_20px_rgba(236,72,153,0.3)]",
      gradient: "from-pink-500 to-rose-600",
      glowColor: "bg-pink-400"
    },
    {
      title: "Future Skills Score",
      desc: "Measures core learning skills: collaboration dynamics, response to constructive feedback, and adaptability to new systems.",
      icon: Milestone,
      color: "text-emerald-600 bg-emerald-50/50 border-emerald-100 group-hover:bg-emerald-500 group-hover:text-white group-hover:shadow-[0_8px_20px_rgba(16,185,129,0.3)]",
      gradient: "from-emerald-500 to-teal-600",
      glowColor: "bg-emerald-400"
    }
  ];

  return (
    <section className="py-20 px-4 bg-[#f8fafc] border-t border-gray-100">
      <div className="max-w-7xl mx-auto">
        <div className="text-center max-w-2xl mx-auto mb-16">
          <span className="text-xs font-black text-primary-500 uppercase tracking-widest block mb-3">
            Assessment Blueprint
          </span>
          <h2 className="font-baloo text-3xl sm:text-4xl md:text-5xl font-black text-navy-900 leading-tight">
            What You Will <span className="text-[#E91E63]">Discover</span>
          </h2>
          <p className="text-gray-500 font-bold mt-4 text-sm sm:text-base">
            Our multi-dimensional engine evaluates four key pillars to deliver a holistic evaluation of your child's technical aptitude.
          </p>
        </div>

        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-8">
          {cards.map((card, idx) => (
            <motion.div
              key={idx}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-100px" }}
              transition={{ duration: 0.5, delay: 0.1 * idx }}
              className="bg-white rounded-[2rem] sm:rounded-[32px] p-4 sm:p-8 border border-gray-200/60 shadow-sm relative overflow-hidden flex flex-col items-center justify-center aspect-square hover:shadow-xl hover:-translate-y-2.5 transition-all duration-500 group cursor-default"
            >
              {/* Top Gradient Banner Strip */}
              <div className={`absolute top-0 left-0 right-0 h-1.5 bg-gradient-to-r ${card.gradient}`} />

              {/* Glowing Ambient Background Circle on Hover */}
              <div className={`absolute -bottom-8 -right-8 w-24 h-24 rounded-full ${card.glowColor} blur-2xl opacity-0 group-hover:opacity-20 transition-opacity duration-500`} />

              {/* Icon Container */}
              <div className={`w-11 h-11 sm:w-16 sm:h-16 rounded-xl sm:rounded-2xl border flex items-center justify-center mb-3 sm:mb-6 shrink-0 transition-all duration-300 ${card.color}`}>
                <card.icon className="w-5 h-5 sm:w-7 sm:h-7 transition-transform duration-500 group-hover:rotate-6" />
              </div>

              {/* Title & Desc */}
              <h3 className="font-baloo font-black text-navy-900 text-xs sm:text-xl mb-1 sm:mb-3 text-center leading-snug group-hover:text-navy-900 transition-colors">
                {card.title}
              </h3>
              <p className="text-slate-500 font-bold text-[10px] sm:text-sm leading-relaxed text-center hidden sm:block flex-1">
                {card.desc}
              </p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
