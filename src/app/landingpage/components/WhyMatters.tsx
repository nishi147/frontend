import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronDown, HelpCircle, CheckCircle, ShieldAlert } from 'lucide-react';

export default function WhyMatters() {
  const [openFaq, setOpenFaq] = useState<number | null>(null);

  const keyPoints = [
    {
      title: "AI is reshaping education and careers",
      desc: "By 2030, over 80% of jobs will require computational thinking and AI literacy. Children who start now will lead the change rather than follow it."
    },
    {
      title: "Future skills are the new foundation",
      desc: "Coding, prompt engineering, and robotics aren't just for software engineers. They build core cognitive abilities: problem-solving, resilience, and spatial intelligence."
    },
    {
      title: "Parents need data-driven guidance",
      desc: "Every child is unique. Rather than guessing, parents need objective, diagnostic insights to find their child's true strengths and interest areas."
    }
  ];

  const faqs = [
    {
      q: "What skills will my child need for the future?",
      a: "Beyond basic coding, children need 'AI-Native' skills: logical problem breakdown, critical validation of AI outputs, creative prompt composition, and cross-disciplinary solution design."
    },
    {
      q: "Is AI important for younger children?",
      a: "Yes, absolutely! For ages 6-9, we focus on block-based logical sequencing and creativity. It's not about complex math, but rather developing a structured problem-solving mindset early."
    },
    {
      q: "When should my child start learning technology?",
      a: "The ideal age is between 6 and 12 years. At this stage, their brains are highly adaptive, and they learn technology as a natural tool for expression rather than a difficult academic subject."
    },
    {
      q: "How can I prepare my child for future careers?",
      a: "Support their active building. Move them from passive screen consumers (watching videos/playing games) to active screen creators (coding games, designing AI models, building electronics)."
    }
  ];

  const toggleFaq = (idx: number) => {
    setOpenFaq(openFaq === idx ? null : idx);
  };

  return (
    <section className="py-20 px-4 bg-white border-t border-gray-100">
      <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
        
        {/* Left Side: Educational context */}
        <div>
          <span className="text-xs font-black text-secondary-500 uppercase tracking-widest block mb-3">
            The Changing Landscape
          </span>
          <h2 className="font-baloo text-3xl sm:text-4xl md:text-5xl font-black text-navy-900 leading-tight">
            Why This <span className="text-[#6b4fbb]">Assessment</span> Matters
          </h2>
          <p className="text-gray-500 font-bold mt-6 mb-8 text-base sm:text-lg leading-relaxed">
            The rise of Generative AI is the biggest shift since the birth of the internet. Standard school curriculums are lagging behind, leaving parents wondering how to prepare their kids.
          </p>

          <div className="flex flex-col gap-6">
            {keyPoints.map((point, idx) => (
              <div key={idx} className="flex gap-4 items-start">
                <div className="w-8 h-8 rounded-full bg-emerald-50 border border-emerald-100 flex items-center justify-center flex-shrink-0 text-emerald-500 mt-1">
                  <CheckCircle size={18} fill="currentColor" className="text-emerald-100" />
                </div>
                <div>
                  <h4 className="font-baloo font-bold text-navy-900 text-lg leading-snug">
                    {point.title}
                  </h4>
                  <p className="text-gray-400 font-bold text-sm mt-1 leading-relaxed">
                    {point.desc}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Right Side: FAQ Accordion */}
        <div className="bg-[#f8fafc] rounded-3xl p-6 sm:p-8 border border-gray-200/60 shadow-sm">
          <div className="flex items-center gap-3 mb-6">
            <div className="w-10 h-10 rounded-xl bg-purple-100 text-purple-600 flex items-center justify-center">
              <HelpCircle size={22} />
            </div>
            <div>
              <h3 className="font-baloo font-black text-navy-900 text-xl">
                Common Parent Questions
              </h3>
              <p className="text-gray-400 text-xs font-bold">Frequently Asked Questions</p>
            </div>
          </div>

          <div className="flex flex-col gap-3">
            {faqs.map((faq, idx) => {
              const isOpen = openFaq === idx;
              return (
                <div 
                  key={idx} 
                  className={`bg-white rounded-2xl border transition-all duration-300 ${
                    isOpen ? 'border-[#6b4fbb] shadow-md' : 'border-gray-100 hover:border-gray-200'
                  }`}
                >
                  <button
                    onClick={() => toggleFaq(idx)}
                    className="w-full px-6 py-5 flex items-center justify-between text-left gap-4"
                  >
                    <span className="font-baloo font-bold text-navy-900 text-sm sm:text-base leading-snug">
                      {faq.q}
                    </span>
                    <ChevronDown 
                      size={18} 
                      className={`text-gray-400 transition-transform duration-300 shrink-0 ${
                        isOpen ? 'rotate-180 text-[#6b4fbb]' : ''
                      }`} 
                    />
                  </button>

                  <AnimatePresence initial={false}>
                    {isOpen && (
                      <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: 'auto', opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        transition={{ duration: 0.25 }}
                        className="overflow-hidden"
                      >
                        <div className="px-6 pb-5 pt-1 text-gray-500 font-semibold text-xs sm:text-sm leading-relaxed border-t border-gray-50">
                          {faq.a}
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              );
            })}
          </div>
        </div>

      </div>
    </section>
  );
}
