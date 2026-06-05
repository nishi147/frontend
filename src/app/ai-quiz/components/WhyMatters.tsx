import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Check, Sparkles, Briefcase, Brain, Award, Shield, ChevronRight, Zap } from 'lucide-react';

export default function WhyMatters() {
  const [activeTab, setActiveTab] = useState<'careers' | 'skills' | 'report'>('careers');
  const [selectedJob, setSelectedJob] = useState<'tech' | 'design' | 'business'>('tech');
  const [selectedSkill, setSelectedSkill] = useState<number | null>(null);
  const [selectedAge, setSelectedAge] = useState<'6-9' | '10-13' | '14-18'>('10-13');

  const jobsData = {
    tech: {
      title: "Software Creator",
      impact: 85,
      traditional: "Writing repetitive boilerplate code manually line-by-line.",
      future: "Commanding AI coding agents, designing scalable system architecture, and system integration."
    },
    design: {
      title: "Digital Designer",
      impact: 75,
      traditional: "Manual photo editing, static vector rendering, and slow manual updates.",
      future: "Generating assets using generative AI models, engineering UI styling prompts, and rapid wireframe prototyping."
    },
    business: {
      title: "Business Analyst",
      impact: 80,
      traditional: "Manual data entry, standard Excel reporting, and basic chart compiling.",
      future: "Interpreting automated AI data pipelines to drive strategic decisions and model simulation."
    }
  };

  const skillsData = [
    {
      title: "Logical Coding",
      short: "Decomposing complex problems.",
      details: "Breaking a big system down into step-by-step algorithms. Instead of just memorization, kids learn computational logic.",
      icon: <Brain size={22} className="text-purple-600" />
    },
    {
      title: "Prompt Engineering",
      short: "Communicating with AI models.",
      details: "Formulating precise questions and parameters. Kids learn how to instruct AI to get accurate code, research, or design outputs.",
      icon: <Sparkles size={22} className="text-amber-600" />
    },
    {
      title: "Critical Validation",
      short: "Spotting bugs and biases.",
      details: "Reviewing AI outputs critically. Kids learn to debug code, verify facts, and make modifications rather than blindly trusting AI.",
      icon: <Shield size={22} className="text-emerald-600" />
    },
    {
      title: "Creative Building",
      short: "Rapidly launching products.",
      details: "Integrating coding with AI tools to build actual games, websites, or apps in hours instead of months.",
      icon: <Zap size={22} className="text-rose-600" />
    }
  ];

  const reportData = {
    '6-9': {
      title: "Ages 6-9: AI Explorer",
      focus: "Visual Logic & Playful Sequencing",
      score: 78,
      program: "AI Explorer Program",
      description: "Developing sequential thinking via block-based game logic and interactive storytelling.",
      skills: ["Sequential Logic", "Creative Confidence", "Computational Vocabulary"]
    },
    '10-13': {
      title: "Ages 10-13: Future Coder",
      focus: "Structured Logic & AI Foundations",
      score: 84,
      program: "Future Coder Program",
      description: "Writing structural logic, learning loops/variables, and exploring prompt parameters.",
      skills: ["Algorithmic Design", "Prompt Formulation", "Data Security Basics"]
    },
    '14-18': {
      title: "Ages 14-18: AI Creator",
      focus: "Advanced Python & Machine Learning",
      score: 92,
      program: "AI Creator Program",
      description: "Building custom web applications, running data queries, and tuning neural network APIs.",
      skills: ["Fullstack Dev Logic", "API Integration", "Model Tuning"]
    }
  };

  return (
    <section className="py-20 px-4 bg-white border-t border-gray-100">
      <div className="max-w-6xl mx-auto">
        
        {/* Header */}
        <div className="text-center mb-12">
          <span className="text-xs font-black text-secondary-500 uppercase tracking-widest block mb-3">
            Why It Matters
          </span>
          <h2 className="font-baloo text-3xl sm:text-4xl md:text-5xl font-black text-navy-900 leading-tight">
            Is Your Child Ready for <span className="text-[#ef4444]">2030?</span>
          </h2>
          <p className="text-gray-500 font-bold mt-4 text-sm sm:text-base max-w-xl mx-auto">
            Click through our interactive interactive landscape to see how the world is shifting and what skills your child needs.
          </p>
        </div>

        {/* Interactive Tabs Menu */}
        <div className="flex justify-center p-1.5 bg-gray-50 border border-gray-200/60 rounded-full max-w-lg mx-auto mb-12">
          <button
            onClick={() => setActiveTab('careers')}
            className={`flex-1 py-3 px-4 rounded-full text-xs sm:text-sm font-black transition-all ${
              activeTab === 'careers'
                ? 'bg-navy-900 text-white shadow-sm'
                : 'text-gray-500 hover:text-navy-900'
            }`}
          >
            💼 Career Shift
          </button>
          <button
            onClick={() => setActiveTab('skills')}
            className={`flex-1 py-3 px-4 rounded-full text-xs sm:text-sm font-black transition-all ${
              activeTab === 'skills'
                ? 'bg-navy-900 text-white shadow-sm'
                : 'text-gray-500 hover:text-navy-900'
            }`}
          >
            ⚡ Modern Skills
          </button>
          <button
            onClick={() => setActiveTab('report')}
            className={`flex-1 py-3 px-4 rounded-full text-xs sm:text-sm font-black transition-all ${
              activeTab === 'report'
                ? 'bg-navy-900 text-white shadow-sm'
                : 'text-gray-500 hover:text-navy-900'
            }`}
          >
            📊 Diagnostics Preview
          </button>
        </div>

        {/* Tab Content Display */}
        <div className="bg-[#f8fafc] border border-gray-200/60 rounded-3xl p-6 sm:p-10 min-h-[400px] flex items-center justify-center">
          <AnimatePresence mode="wait">
            
            {/* TAB 1: CAREERS SHIFT */}
            {activeTab === 'careers' && (
              <motion.div
                key="careers"
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -15 }}
                transition={{ duration: 0.3 }}
                className="w-full grid grid-cols-1 lg:grid-cols-2 gap-8 items-center"
              >
                <div>
                  <h3 className="font-baloo font-black text-navy-900 text-2xl mb-4 flex items-center gap-2">
                    <Briefcase className="text-[#6b4fbb]" /> Choose a Future Path:
                  </h3>
                  <div className="flex flex-col gap-3">
                    {Object.keys(jobsData).map((jobKey) => {
                      const isActive = selectedJob === jobKey;
                      return (
                        <button
                          key={jobKey}
                          onClick={() => setSelectedJob(jobKey as any)}
                          className={`w-full text-left p-4.5 rounded-2xl border-2 transition-all flex items-center justify-between ${
                            isActive
                              ? 'border-[#6b4fbb] bg-white shadow-sm font-bold text-navy-900'
                              : 'border-gray-200/80 bg-white/50 text-gray-500 hover:bg-white'
                          }`}
                        >
                          <span className="font-baloo text-base sm:text-lg font-black">
                            {jobsData[jobKey as keyof typeof jobsData].title}
                          </span>
                          <ChevronRight size={18} className={isActive ? 'text-[#6b4fbb]' : 'text-gray-400'} />
                        </button>
                      );
                    })}
                  </div>
                </div>

                <div className="bg-white rounded-3xl p-6 sm:p-8 border border-gray-200/60 shadow-sm flex flex-col justify-between h-full">
                  <div>
                    <div className="flex justify-between items-center mb-6">
                      <span className="text-xs font-black text-purple-600 uppercase tracking-widest">
                        AI Integration Index
                      </span>
                      <span className="text-lg font-black text-navy-900">
                        {jobsData[selectedJob].impact}% Impacted
                      </span>
                    </div>

                    {/* Progress Bar */}
                    <div className="w-full h-3.5 bg-gray-100 rounded-full overflow-hidden mb-6">
                      <motion.div
                        className="h-full bg-gradient-to-r from-[#6b4fbb] to-[#ef4444]"
                        initial={{ width: 0 }}
                        animate={{ width: `${jobsData[selectedJob].impact}%` }}
                        transition={{ duration: 0.5, ease: 'easeOut' }}
                      />
                    </div>

                    <div className="space-y-4">
                      <div className="p-4 rounded-xl bg-rose-50 border border-rose-100">
                        <span className="text-xs font-black text-rose-500 uppercase tracking-widest block mb-1">
                          Traditional Way (No AI)
                        </span>
                        <p className="text-gray-500 font-semibold text-sm leading-relaxed">
                          {jobsData[selectedJob].traditional}
                        </p>
                      </div>

                      <div className="p-4 rounded-xl bg-emerald-50 border border-emerald-100">
                        <span className="text-xs font-black text-emerald-500 uppercase tracking-widest block mb-1">
                          AI-Native Way (Future)
                        </span>
                        <p className="text-gray-700 font-bold text-sm leading-relaxed">
                          {jobsData[selectedJob].future}
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              </motion.div>
            )}

            {/* TAB 2: SKILLS EXPLORER */}
            {activeTab === 'skills' && (
              <motion.div
                key="skills"
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -15 }}
                transition={{ duration: 0.3 }}
                className="w-full"
              >
                <h3 className="font-baloo font-black text-navy-900 text-2xl text-center mb-2">
                  Interactive Skills Grid
                </h3>
                <p className="text-gray-400 font-bold text-xs sm:text-sm text-center mb-8">
                  Click on any skill block to inspect how it works in real life!
                </p>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 max-w-4xl mx-auto">
                  {skillsData.map((skill, idx) => {
                    const isOpen = selectedSkill === idx;
                    return (
                      <div
                        key={idx}
                        onClick={() => setSelectedSkill(isOpen ? null : idx)}
                        className={`p-5 rounded-2xl border-2 bg-white cursor-pointer transition-all duration-300 flex flex-col justify-between ${
                          isOpen
                            ? 'border-[#6b4fbb] shadow-md scale-[1.01]'
                            : 'border-gray-200/60 hover:border-gray-300 hover:shadow-sm'
                        }`}
                      >
                        <div>
                          <div className="flex items-center gap-3 mb-2">
                            <div className="p-2 rounded-xl bg-gray-50 border border-gray-100 flex-shrink-0">
                              {skill.icon}
                            </div>
                            <h4 className="font-baloo font-black text-navy-900 text-lg">
                              {skill.title}
                            </h4>
                          </div>
                          <p className="text-gray-400 font-bold text-xs sm:text-sm">
                            {skill.short}
                          </p>
                        </div>

                        <AnimatePresence>
                          {isOpen && (
                            <motion.div
                              initial={{ height: 0, opacity: 0 }}
                              animate={{ height: 'auto', opacity: 1 }}
                              exit={{ height: 0, opacity: 0 }}
                              transition={{ duration: 0.2 }}
                              className="overflow-hidden mt-3 pt-3 border-t border-gray-100"
                            >
                              <p className="text-gray-500 font-semibold text-sm leading-relaxed">
                                {skill.details}
                              </p>
                            </motion.div>
                          )}
                        </AnimatePresence>
                      </div>
                    );
                  })}
                </div>
              </motion.div>
            )}

            {/* TAB 3: DIAGNOSTICS REPORT PREVIEW */}
            {activeTab === 'report' && (
              <motion.div
                key="report"
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -15 }}
                transition={{ duration: 0.3 }}
                className="w-full grid grid-cols-1 lg:grid-cols-2 gap-8 items-center"
              >
                <div>
                  <h3 className="font-baloo font-black text-navy-900 text-2xl mb-4 flex items-center gap-2">
                    <Award className="text-[#ef4444]" /> Select Student Age Group:
                  </h3>
                  <div className="flex gap-2.5 mb-6">
                    {(['6-9', '10-13', '14-18'] as const).map((ageGroup) => (
                      <button
                        key={ageGroup}
                        onClick={() => setSelectedAge(ageGroup)}
                        className={`flex-1 py-3.5 px-3 rounded-2xl border-2 font-black text-xs sm:text-sm transition-all ${
                          selectedAge === ageGroup
                            ? 'border-[#ef4444] bg-[#ef4444] text-white shadow-sm'
                            : 'border-gray-200/80 bg-white text-gray-500 hover:bg-gray-50'
                        }`}
                      >
                        {ageGroup === '6-9' ? '🎒 Ages 6-9' : ageGroup === '10-13' ? '🧑 Ages 10-13' : '🎓 Ages 14-18'}
                      </button>
                    ))}
                  </div>

                  <div className="p-5 rounded-2xl bg-white border border-gray-200/60 shadow-sm">
                    <span className="text-xs font-black text-[#ef4444] uppercase tracking-widest block mb-1">
                      Focus Area
                    </span>
                    <h4 className="font-baloo font-black text-navy-900 text-lg mb-2">
                      {reportData[selectedAge].focus}
                    </h4>
                    <p className="text-gray-500 font-semibold text-sm leading-relaxed">
                      {reportData[selectedAge].description}
                    </p>
                  </div>
                </div>

                <div className="bg-white rounded-3xl p-6 border border-gray-200/60 shadow-md">
                  <div className="text-center mb-6">
                    <span className="text-xs font-black text-gray-400 uppercase tracking-widest block mb-1">
                      Mock Readiness Result
                    </span>
                    <div className="text-4xl font-black text-navy-900">
                      {reportData[selectedAge].score}<span className="text-lg text-gray-400 font-bold">/100</span>
                    </div>
                    <div className="inline-block bg-purple-50 border border-purple-100 text-[#6b4fbb] font-black text-xs px-3.5 py-1.5 rounded-full mt-2">
                      🚀 {reportData[selectedAge].program}
                    </div>
                  </div>

                  <div>
                    <span className="text-xs font-black text-gray-400 uppercase tracking-widest block mb-3">
                      Key Evaluated Benchmarks:
                    </span>
                    <div className="space-y-2">
                      {reportData[selectedAge].skills.map((skillName, idx) => (
                        <div key={idx} className="flex items-center gap-2 bg-gray-50 p-2.5 rounded-xl border border-gray-100">
                          <Check size={16} className="text-emerald-500 flex-shrink-0" />
                          <span className="text-navy-900 font-bold text-xs sm:text-sm">
                            {skillName}
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </motion.div>
            )}

          </AnimatePresence>
        </div>

      </div>
    </section>
  );
}
