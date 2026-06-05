import React from 'react';
import { CheckCircle } from 'lucide-react';

export default function WhyMatters() {
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

  return (
    <section className="py-20 px-4 bg-white border-t border-gray-100">
      <div className="max-w-4xl mx-auto text-center">
        
        <span className="text-xs font-black text-secondary-500 uppercase tracking-widest block mb-3">
          The Changing Landscape
        </span>
        <h2 className="font-baloo text-3xl sm:text-4xl md:text-5xl font-black text-navy-900 leading-tight">
          Why This <span className="text-[#6b4fbb]">Assessment</span> Matters
        </h2>
        <p className="text-gray-500 font-bold mt-6 mb-12 text-base sm:text-lg leading-relaxed max-w-2xl mx-auto">
          The rise of Generative AI is the biggest shift since the birth of the internet. Standard school curriculums are lagging behind, leaving parents wondering how to prepare their kids.
        </p>

        <div className="flex flex-col gap-6 max-w-2xl mx-auto text-left">
          {keyPoints.map((point, idx) => (
            <div key={idx} className="flex gap-4 items-start bg-gray-50/50 p-5 rounded-2xl border border-gray-100 hover:border-gray-200 transition-all duration-300">
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
    </section>
  );
}
