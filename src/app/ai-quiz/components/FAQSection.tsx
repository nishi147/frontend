import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronDown, HelpCircle } from 'lucide-react';

export default function FAQSection() {
  const [openFaq, setOpenFaq] = useState<number | null>(null);

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
    <section className="py-20 px-4 bg-[#f8fafc] border-t border-b border-gray-100">
      <div className="max-w-4xl mx-auto">
        
        <div className="text-center mb-12">
          <div className="w-12 h-12 rounded-2xl bg-purple-100 text-purple-600 flex items-center justify-center mx-auto mb-4">
            <HelpCircle size={28} />
          </div>
          <h2 className="font-baloo text-3xl sm:text-4xl font-black text-navy-900 leading-tight">
            Common Parent <span className="text-[#6b4fbb]">Questions</span>
          </h2>
          <p className="text-gray-500 font-bold mt-3 text-sm sm:text-base">
            Frequently Asked Questions
          </p>
        </div>

        <div className="flex flex-col gap-4 max-w-3xl mx-auto">
          {faqs.map((faq, idx) => {
            const isOpen = openFaq === idx;
            return (
              <div 
                key={idx} 
                className={`bg-white rounded-3xl border transition-all duration-300 ${
                  isOpen ? 'border-[#6b4fbb] shadow-md' : 'border-gray-200/60 hover:border-gray-300'
                }`}
              >
                <button
                  onClick={() => toggleFaq(idx)}
                  className="w-full px-6 py-5 sm:px-8 sm:py-6 flex items-center justify-between text-left gap-4"
                >
                  <span className="font-baloo font-black text-navy-900 text-base sm:text-lg leading-snug">
                    {faq.q}
                  </span>
                  <ChevronDown 
                    size={20} 
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
                      <div className="px-6 pb-6 pt-1 sm:px-8 sm:pb-6 text-gray-500 font-bold text-sm sm:text-base leading-relaxed border-t border-gray-100">
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
    </section>
  );
}
