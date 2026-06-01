import React from 'react';
import { motion } from 'framer-motion';
import { Cpu, Lightbulb, Rocket, Milestone } from 'lucide-react';

export default function Discover() {
  const cards = [
    {
      title: "AI Readiness",
      desc: "Measures familiarity with AI applications, prompt validation, and the difference between computational power and human ingenuity.",
      icon: Cpu,
      color: "text-blue-500 bg-blue-50 border-blue-100",
      accent: "bg-blue-500"
    },
    {
      title: "Problem Solving",
      desc: "Evaluates procedural and analytical thinking: how your child decomposes a complex puzzle and devises step-by-step algorithms.",
      icon: Lightbulb,
      color: "text-amber-500 bg-amber-50 border-amber-100",
      accent: "bg-amber-500"
    },
    {
      title: "Innovation Potential",
      desc: "Assesses creative confidence, divergent thinking, and the ability to adapt design rules to invent brand-new concepts.",
      icon: Rocket,
      color: "text-pink-500 bg-pink-50 border-pink-100",
      accent: "bg-pink-500"
    },
    {
      title: "Future Skills Score",
      desc: "Measures core learning skills: collaboration dynamics, response to constructive feedback, and adaptability to new systems.",
      icon: Milestone,
      color: "text-emerald-500 bg-emerald-50 border-emerald-100",
      accent: "bg-emerald-500"
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
            What You Will <span className="text-[#EF4444]">Discover</span>
          </h2>
          <p className="text-gray-500 font-bold mt-4 text-sm sm:text-base">
            Our multi-dimensional engine evaluates four key pillars to deliver a holistic evaluation of your child's technical aptitude.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {cards.map((card, idx) => (
            <motion.div
              key={idx}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-100px" }}
              transition={{ duration: 0.5, delay: 0.1 * idx }}
              className="bg-white rounded-3xl p-8 border border-gray-100 shadow-sm relative overflow-hidden flex flex-col hover:shadow-xl hover:-translate-y-1.5 transition-all duration-300 group"
            >
              {/* Colored Corner Banner */}
              <div className={`absolute top-0 right-0 w-24 h-1 bg-gradient-to-r ${card.accent} opacity-80`} />

              {/* Icon Container */}
              <div className={`w-14 h-14 rounded-2xl border flex items-center justify-center mb-6 shrink-0 ${card.color} group-hover:scale-115 transition-transform duration-300`}>
                <card.icon size={26} />
              </div>

              {/* Title & Desc */}
              <h3 className="font-baloo font-black text-navy-900 text-lg sm:text-xl mb-3 leading-snug">
                {card.title}
              </h3>
              <p className="text-gray-400 font-bold text-xs sm:text-sm leading-relaxed flex-1">
                {card.desc}
              </p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
