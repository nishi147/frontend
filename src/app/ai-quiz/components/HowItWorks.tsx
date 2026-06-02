import React from 'react';
import { motion } from 'framer-motion';
import { ArrowRight, ClipboardCheck, FileText, Compass, CalendarCheck } from 'lucide-react';

export default function HowItWorks() {
  const steps = [
    {
      num: "01",
      title: "Take Assessment",
      desc: "Complete a fun, 3-minute diagnostic test consisting of 25 child-friendly questions.",
      icon: ClipboardCheck,
      color: "bg-[#FFF5E6] text-[#FF7F50] border-[#FFEAD1]",
    },
    {
      num: "02",
      title: "Get Personalized Report",
      desc: "Instant assessment scores, badges, strengths analysis, and areas of growth sent to your email.",
      icon: FileText,
      color: "bg-[#EEE8FF] text-[#6C5CE7] border-[#DFD3FF]",
    },
    {
      num: "03",
      title: "Discover Opportunities",
      desc: "Receive customized learning recommendations mapped to your child's age group and tech interest.",
      icon: Compass,
      color: "bg-[#E8FFF5] text-[#00B894] border-[#C2FFDF]",
    },
    {
      num: "04",
      title: "Reserve ₹99 Demo Class",
      desc: "Activate a 1-on-1 live session with our AI expert mentors to build their first practical project.",
      icon: CalendarCheck,
      color: "bg-[#FFEBEF] text-[#EF4444] border-[#FFD1DA]",
    }
  ];

  return (
    <section className="py-20 px-4 bg-white border-t border-gray-100">
      <div className="max-w-7xl mx-auto">
        <div className="text-center max-w-2xl mx-auto mb-16">
          <span className="text-xs font-black text-secondary-500 uppercase tracking-widest block mb-3">
            Funnel Flow
          </span>
          <h2 className="font-baloo text-3xl sm:text-4xl md:text-5xl font-black text-navy-900 leading-tight">
            How It <span className="text-[#6b4fbb]">Works</span>
          </h2>
          <p className="text-gray-500 font-bold mt-4 text-sm sm:text-base">
            From the initial diagnostic quiz to your first live mentor session, here is what to expect.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8 relative">
          {steps.map((step, idx) => (
            <div key={idx} className="relative flex flex-col items-center text-center">
              
              {/* Step Node Card */}
              <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true, margin: "-50px" }}
                transition={{ duration: 0.5, delay: 0.15 * idx }}
                className="bg-[#f8fafc] rounded-3xl p-8 border border-gray-200/60 shadow-sm w-full relative group hover:bg-white hover:border-gray-300 hover:shadow-lg transition-all duration-300"
              >
                {/* Step Index Circle */}
                <div className="absolute -top-4 left-6 bg-white border-2 border-gray-200 text-navy-900 font-baloo font-black text-xs px-3 py-1 rounded-full shadow-sm">
                  Step {step.num}
                </div>

                {/* Icon Container */}
                <div className={`w-14 h-14 rounded-2xl border flex items-center justify-center mb-6 mx-auto ${step.color} group-hover:scale-110 transition-transform duration-300`}>
                  <step.icon size={26} />
                </div>

                {/* Title & Desc */}
                <h3 className="font-baloo font-black text-navy-900 text-lg sm:text-xl mb-3">
                  {step.title}
                </h3>
                <p className="text-gray-400 font-bold text-xs sm:text-sm leading-relaxed">
                  {step.desc}
                </p>
              </motion.div>

              {/* Connecting Desktop Arrow */}
              {idx < 3 && (
                <div className="hidden lg:block absolute top-1/2 -translate-y-1/2 -right-4 z-20 text-gray-300 pointer-events-none transform translate-x-1/2">
                  <ArrowRight size={28} className="animate-pulse" />
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
