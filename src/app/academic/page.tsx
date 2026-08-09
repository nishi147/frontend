"use client";

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Header } from '@/components/layout/Header';
import { TrustpilotBadge } from '@/components/ui/TrustpilotBadge';
import { FreeDemoModal } from '@/components/modals/FreeDemoModal';
import { 
  CheckCircle2, 
  Sparkles, 
  ArrowRight, 
  BookOpen, 
  GraduationCap, 
  Clock, 
  ShieldCheck, 
  Star, 
  StarHalf,
  Users, 
  Target, 
  TrendingUp, 
  Award,
  ChevronRight,
  DollarSign,
  HeartHandshake,
  Flame
} from 'lucide-react';

// Easily customizable pricing configuration per user request
// Later, to change price, edit HOURLY_RATE. To hide/remove section, set SHOW_PRICING_SECTION to false.
const SHOW_PRICING_SECTION = true;
const HOURLY_RATE = 12; // $12 per hour

export default function AcademicPage() {
  const [isDemoModalOpen, setIsDemoModalOpen] = useState(false);
  const [selectedCurriculum, setSelectedCurriculum] = useState('IB');
  const [activeStep, setActiveStep] = useState(0);

  const openDemoModal = (curriculum?: string) => {
    if (curriculum) setSelectedCurriculum(curriculum);
    setIsDemoModalOpen(true);
  };

  const curriculaList = [
    {
      id: 'IB',
      title: 'IB',
      name: 'IB (International Baccalaureate)',
      description: 'Personalized academic support for IB students (DP & MYP).',
      subjects: ['Mathematics (AA/AI)', 'Physics', 'Chemistry', 'Biology', 'English & more'],
      badge: 'HL & SL Covered',
      focus: 'Concept depth, Internal Assessment (IA) guidance & exam paper strategy.',
    },
    {
      id: 'IGCSE',
      title: 'IGCSE',
      name: 'IGCSE (Cambridge & Edexcel)',
      description: 'Concept building, structured practice and exam preparation.',
      subjects: ['Mathematics', 'Physics', 'Chemistry', 'Biology', 'English & more'],
      badge: 'Core & Extended',
      focus: 'Past paper solving, mark scheme techniques & concept clarity.',
    },
    {
      id: 'A-Level',
      title: 'A-LEVEL',
      name: 'A-Level & AS Level',
      description: 'Advanced subject support for academic excellence and university prep.',
      subjects: ['Mathematics', 'Physics', 'Chemistry', 'Biology', 'Economics & more'],
      badge: 'AS & A2 Preparation',
      focus: 'Advanced problem solving, university entrance readiness & deep understanding.',
    },
    {
      id: 'AP',
      title: 'AP',
      name: 'AP (Advanced Placement)',
      description: 'Focused academic support and AP exam preparation.',
      subjects: ['Calculus (AB/BC)', 'Physics', 'Chemistry', 'Biology', 'Computer Science & more'],
      badge: 'Target Score 5',
      focus: 'Free-response question practice & high-yield topic reinforcement.',
    },
    {
      id: 'CBSE',
      title: 'CBSE',
      name: 'CBSE Board',
      description: 'Strong foundations, personalized learning and board exam prep.',
      subjects: ['Mathematics', 'Science', 'English', 'Physics', 'Chemistry', 'Biology & more'],
      badge: 'Class 6 - 12 Mastery',
      focus: 'NCERT foundation building, numerical practice & board exam excellence.',
    },
  ];

  const tutorPillars = [
    {
      title: 'Subject expertise',
      desc: 'Strong subject knowledge and academic understanding.',
      icon: Award,
    },
    {
      title: 'Curriculum alignment',
      desc: 'Lessons designed around your child\'s specific curriculum.',
      icon: Target,
    },
    {
      title: 'Personalized teaching',
      desc: 'The pace, explanation and practice adapt to the student.',
      icon: Users,
    },
    {
      title: 'Patient guidance',
      desc: 'Because understanding matters more than simply finishing a chapter.',
      icon: HeartHandshake,
    },
    {
      title: 'Progress-focused learning',
      desc: 'Parents gain better visibility into their child\'s learning journey.',
      icon: TrendingUp,
    },
  ];

  const studentNeeds = [
    {
      tag: 'Algebra & Fundamentals',
      text: 'A student struggling with algebra may need stronger fundamentals.',
      accent: 'border-[#1ad8ea]/40 bg-[#1e2842]',
    },
    {
      tag: 'IGCSE Exam Mastery',
      text: 'An IGCSE student may need exam-focused practice.',
      accent: 'border-[#2363f1]/40 bg-[#1e2842]',
    },
    {
      tag: 'IB Deep Concepts',
      text: 'An IB student may need deeper conceptual understanding.',
      accent: 'border-[#f9be3e]/40 bg-[#1e2842]',
    },
    {
      tag: 'A-Level Problem Solving',
      text: 'An A-Level student may need advanced problem solving.',
      accent: 'border-[#1ad8ea]/40 bg-[#1e2842]',
    },
  ];

  const processSteps = [
    {
      number: '01',
      title: 'UNDERSTAND',
      desc: 'We learn about your child\'s curriculum, current level and goals.',
    },
    {
      number: '02',
      title: 'MATCH',
      desc: 'We connect your child with a suitable subject and curriculum expert.',
    },
    {
      number: '03',
      title: 'PERSONALIZE',
      desc: 'Lessons are adapted to the student\'s learning style and pace.',
    },
    {
      number: '04',
      title: 'PRACTICE',
      desc: 'Concepts are reinforced through guided questions and application.',
    },
    {
      number: '05',
      title: 'PROGRESS',
      desc: 'Learning is reviewed so your child\'s journey stays on track.',
    },
  ];

  const partnershipFeatures = [
    {
      title: '1-to-1 attention',
      desc: 'Focused learning without classroom distractions.',
    },
    {
      title: 'Curriculum-aligned lessons',
      desc: 'Learning built around the curriculum your child follows.',
    },
    {
      title: 'Flexible scheduling',
      desc: 'Learn from home at convenient times.',
    },
    {
      title: 'Targeted practice',
      desc: 'Focus on the areas where your child needs the most help.',
    },
    {
      title: 'Exam preparation',
      desc: 'Prepare with greater confidence for important assessments.',
    },
    {
      title: 'Parent visibility',
      desc: 'Stay connected with your child\'s learning journey.',
    },
  ];

  const activeCurrData = curriculaList.find(c => c.id === selectedCurriculum) || curriculaList[0];

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 font-sans selection:bg-[#2363f1] selection:text-white pb-20 lg:pb-0 overflow-x-hidden">
      <Header />

      {/* Top Trust Bar - Clean Light High-Contrast Style */}
      <div className="bg-slate-100 border-b border-slate-200 py-2.5 px-4 text-center text-xs font-semibold">
        <div className="max-w-7xl mx-auto flex flex-wrap items-center justify-center gap-3">
          <span className="flex items-center gap-1 bg-white text-[#2363f1] px-2.5 py-0.5 rounded-full text-[11px] font-bold border border-slate-200 shadow-sm">
            <Flame size={12} className="text-[#f9be3e] fill-[#f9be3e]" /> TOP 1% VERIFIED TUTORS
          </span>
          <TrustpilotBadge variant="compact" />
          <span className="hidden md:inline text-slate-300">•</span>
          <span className="text-slate-700 font-bold hidden sm:inline">100% Match Guarantee</span>
        </div>
      </div>

      {/* SECTION 1: HERO — Deep Midnight Navy background for strong first impression */}
      <section className="relative min-h-[80vh] pt-12 pb-20 px-4 md:px-8 flex flex-col justify-center items-center overflow-hidden bg-[#0c142a] text-white">
        {/* Ambient Glowing Orbs */}
        <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[650px] h-[380px] bg-[#2363f1]/25 rounded-full blur-[150px] pointer-events-none" />
        <div className="absolute top-1/3 left-1/4 w-[300px] h-[300px] bg-[#1ad8ea]/20 rounded-full blur-[130px] pointer-events-none" />

        <div className="container mx-auto max-w-5xl relative z-10 text-center space-y-8">
          
          {/* Badge */}
          <motion.div
            initial={{ opacity: 0, y: -15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="inline-flex items-center gap-2 bg-[#1e2842]/90 border border-[#1ad8ea]/40 px-4 py-2 rounded-full text-[#1ad8ea] font-bold text-xs md:text-sm shadow-xl shadow-[#1ad8ea]/10"
          >
            <Sparkles size={16} className="text-[#f9be3e]" />
            <span>RUZANN ACADEMIC · 1-TO-1 ONLINE TUTORING</span>
          </motion.div>

          {/* Main Headline */}
          <motion.div
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.15 }}
            className="space-y-3"
          >
            <h1 className="text-3xl sm:text-5xl md:text-6xl lg:text-7xl font-black text-white tracking-tight leading-[1.1]">
              Every Child Has <span className="bg-gradient-to-r from-[#1ad8ea] via-[#2363f1] to-[#f9be3e] bg-clip-text text-transparent">A Destination.</span>
            </h1>
            <h2 className="text-2xl sm:text-4xl md:text-5xl font-black text-slate-200 tracking-tight">
              We build the learning path to get them there.
            </h2>
          </motion.div>

          {/* Subheading & Curricula Badges */}
          <motion.div
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.3 }}
            className="max-w-3xl mx-auto space-y-5"
          >
            <h3 className="text-base sm:text-xl font-bold text-slate-300 leading-relaxed">
              Premium 1-to-1 Online Academic Tutoring for Students Round Globe
            </h3>

            {/* Curricula Pill Row */}
            <div className="flex flex-wrap items-center justify-center gap-2 text-xs sm:text-sm font-black">
              {['IB', 'IGCSE', 'A-Level', 'AP', 'CBSE'].map((curr) => (
                <span 
                  key={curr} 
                  className="px-4 py-1.5 rounded-full bg-[#1e2842] border border-[#1ad8ea]/40 text-[#1ad8ea] shadow-md hover:border-[#f9be3e] transition-colors"
                >
                  {curr}
                </span>
              ))}
            </div>

            <p className="text-slate-300 text-sm sm:text-base leading-relaxed">
              Personalized academic support designed around your child's curriculum, learning needs and goals.
            </p>
            <p className="text-slate-400 text-xs sm:text-sm max-w-2xl mx-auto">
              Whether your child needs to <strong className="text-white">catch up, keep up, get ahead or prepare for exams</strong>, Ruzann connects them with the right tutor and a learning path built specifically for them.
            </p>
          </motion.div>

          {/* Hero CTA */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.7, delay: 0.45 }}
            className="pt-4 flex flex-col items-center gap-3 max-w-md mx-auto"
          >
            <button
              onClick={() => openDemoModal()}
              className="w-full bg-gradient-to-r from-[#2363f1] to-[#1ad8ea] hover:from-[#1ad8ea] hover:to-[#2363f1] text-[#0c142a] font-black text-base sm:text-lg py-4.5 px-8 rounded-full shadow-[0_10px_30px_-10px_rgba(35,99,241,0.6)] hover:shadow-[0_15px_35px_-5px_rgba(26,216,234,0.7)] transition-all transform hover:-translate-y-1 active:translate-y-0 flex items-center justify-center gap-3 group"
            >
              <span>BOOK A FREE DEMO CLASS</span>
              <ArrowRight size={20} className="group-hover:translate-x-1 transition-transform" />
            </button>
            <p className="text-slate-400 text-xs italic font-medium">
              *No obligation • Personalized learning • Expert tutors • Flexible online classes*
            </p>
          </motion.div>

        </div>
      </section>

      {/* SECTION 2: LIGHT HIGH-CONTRAST SECTION — School gives the map. We help navigate. */}
      <section className="py-20 px-4 md:px-8 bg-white text-slate-900 border-t border-slate-200">
        <div className="max-w-5xl mx-auto space-y-12">
          
          <div className="text-center space-y-3">
            <h2 className="text-3xl sm:text-5xl font-black text-slate-900">
              School gives your child the map.
            </h2>
            <h3 className="text-2xl sm:text-4xl font-black text-[#2363f1]">
              We help them navigate it.
            </h3>
          </div>

          <div className="bg-slate-50 rounded-3xl p-6 md:p-10 border border-slate-200 shadow-xl space-y-6 text-slate-700 text-sm sm:text-base leading-relaxed max-w-3xl mx-auto">
            <p className="text-lg font-bold text-slate-900 text-center">
              Every student learns differently.
            </p>
            <ul className="space-y-3 font-semibold text-slate-800 max-w-xl mx-auto">
              <li className="flex items-center gap-3">
                <CheckCircle2 size={18} className="text-[#2363f1] shrink-0" />
                <span>Some need concepts explained differently.</span>
              </li>
              <li className="flex items-center gap-3">
                <CheckCircle2 size={18} className="text-[#2363f1] shrink-0" />
                <span>Some need more practice.</span>
              </li>
              <li className="flex items-center gap-3">
                <CheckCircle2 size={18} className="text-[#2363f1] shrink-0" />
                <span>Some need confidence.</span>
              </li>
              <li className="flex items-center gap-3">
                <CheckCircle2 size={18} className="text-[#2363f1] shrink-0" />
                <span>Some need a push to reach the next level.</span>
              </li>
            </ul>

            <div className="pt-4 border-t border-slate-200 text-center space-y-2">
              <p className="text-slate-600">
                At Ruzann, we don't believe every child should follow the same learning path.
              </p>
              <p className="text-slate-900 font-bold">
                We first understand <span className="text-[#2363f1]">where your child is today.</span>
              </p>
              <p className="text-slate-900 font-bold">
                Then we help build the path toward <span className="text-[#00b67a]">where they want to be.</span>
              </p>
            </div>
          </div>

          {/* Interactive Process Pipeline Pills */}
          <div className="pt-4 max-w-4xl mx-auto">
            <div className="flex flex-wrap items-center justify-center gap-2 sm:gap-3">
              {['Assess', 'Personalize', 'Teach', 'Track', 'Improve'].map((step, idx) => (
                <React.Fragment key={step}>
                  <button
                    onClick={() => setActiveStep(idx)}
                    className={`px-4 py-2.5 rounded-2xl border text-xs sm:text-sm font-black flex items-center gap-2 transition-all ${
                      activeStep === idx
                        ? 'bg-[#0c142a] text-white border-[#2363f1] shadow-lg scale-105'
                        : 'bg-slate-100 text-slate-700 border-slate-200 hover:bg-slate-200'
                    }`}
                  >
                    <span className={`w-5 h-5 rounded-full flex items-center justify-center text-[11px] font-bold ${
                      activeStep === idx ? 'bg-[#2363f1] text-white' : 'bg-slate-300 text-slate-800'
                    }`}>
                      {idx + 1}
                    </span>
                    {step}
                  </button>
                  {idx < 4 && (
                    <ChevronRight size={18} className="text-slate-400 hidden sm:block" />
                  )}
                </React.Fragment>
              ))}
            </div>

            {/* Active Step Description Card */}
            <div className="mt-6 p-6 rounded-2xl bg-[#0c142a] text-white border border-[#2363f1]/40 text-center max-w-xl mx-auto shadow-2xl">
              <h4 className="text-xs font-black uppercase text-[#1ad8ea] tracking-wider mb-1">
                Step 0{activeStep + 1} — {['Assess', 'Personalize', 'Teach', 'Track', 'Improve'][activeStep]}
              </h4>
              <p className="text-slate-300 text-xs sm:text-sm font-medium leading-relaxed">
                {[
                  'Diagnostic evaluation to pinpoint exact strengths, conceptual gaps, and learning style.',
                  'A customized learning roadmap built specifically around your child\'s target curriculum and exam goals.',
                  'Interactive 1-to-1 live sessions led by an expert subject specialist adapting to the student\'s pace.',
                  'Regular progress checks, topic assessments, and transparent feedback report shared with parents.',
                  'Targeted exam practice, problem-solving refinement, and continuous confidence boosting.'
                ][activeStep]}
              </p>
            </div>
          </div>

        </div>
      </section>

      {/* SECTION 3: DEEP NAVY CONTRAST SECTION — One platform. Five global curricula. */}
      <section className="py-20 px-4 md:px-8 bg-[#0c142a] text-white border-t border-slate-800">
        <div className="max-w-6xl mx-auto space-y-12">
          
          <div className="text-center space-y-3">
            <h2 className="text-3xl sm:text-5xl font-black text-white">
              One platform.
            </h2>
            <h3 className="text-2xl sm:text-4xl font-black text-transparent bg-clip-text bg-gradient-to-r from-[#1ad8ea] via-[#2363f1] to-[#f9be3e]">
              Five global curricula.
            </h3>
          </div>

          {/* Interactive Curricula Tabs Switcher */}
          <div className="flex flex-wrap justify-center gap-2 max-w-3xl mx-auto">
            {curriculaList.map((curr) => (
              <button
                key={curr.id}
                onClick={() => setSelectedCurriculum(curr.id)}
                className={`px-5 py-2.5 rounded-full text-xs sm:text-sm font-black transition-all ${
                  selectedCurriculum === curr.id
                    ? 'bg-gradient-to-r from-[#2363f1] to-[#1ad8ea] text-[#0c142a] shadow-lg scale-105'
                    : 'bg-[#1e2842] text-slate-300 hover:bg-[#1e2842]/80 border border-slate-700'
                }`}
              >
                {curr.title}
              </button>
            ))}
          </div>

          {/* Active Curriculum Detailed Showcase */}
          <div className="bg-[#1e2842] rounded-3xl p-6 sm:p-10 border border-[#1ad8ea]/30 shadow-2xl max-w-4xl mx-auto space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-700/60 pb-6">
              <div>
                <span className="text-xs font-black uppercase tracking-wider px-3 py-1 rounded-full bg-[#0c142a] text-[#f9be3e] border border-[#f9be3e]/30 inline-block mb-2">
                  {activeCurrData.badge}
                </span>
                <h3 className="text-2xl sm:text-3xl font-black text-white">{activeCurrData.name}</h3>
                <p className="text-slate-300 text-xs sm:text-sm font-medium mt-1">{activeCurrData.description}</p>
              </div>
              <button
                onClick={() => openDemoModal(activeCurrData.id)}
                className="px-6 py-3 rounded-full bg-gradient-to-r from-[#2363f1] to-[#1ad8ea] text-[#0c142a] font-black text-xs sm:text-sm hover:opacity-90 transition-all shrink-0 shadow-lg"
              >
                Book Free {activeCurrData.title} Demo &rarr;
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-3">
                <h4 className="text-xs font-black uppercase tracking-widest text-[#1ad8ea]">Supported Subjects:</h4>
                <div className="flex flex-wrap gap-2">
                  {activeCurrData.subjects.map((sub) => (
                    <span key={sub} className="text-xs px-3 py-1.5 rounded-xl bg-[#0c142a] border border-slate-700 font-bold text-slate-200">
                      {sub}
                    </span>
                  ))}
                </div>
              </div>

              <div className="space-y-3">
                <h4 className="text-xs font-black uppercase tracking-widest text-[#f9be3e]">Target Focus:</h4>
                <p className="text-xs sm:text-sm text-slate-300 font-semibold leading-relaxed bg-[#0c142a] p-4 rounded-xl border border-slate-700">
                  {activeCurrData.focus}
                </p>
              </div>
            </div>
          </div>

          <div className="text-center pt-4">
            <button
              onClick={() => openDemoModal()}
              className="px-8 py-4 rounded-full bg-gradient-to-r from-[#2363f1] to-[#1ad8ea] text-[#0c142a] font-black text-base shadow-[0_10px_30px_-10px_rgba(35,99,241,0.6)] hover:scale-105 transition-all"
            >
              [ BOOK A FREE DEMO CLASS ]
            </button>
          </div>

        </div>
      </section>

      {/* SECTION 4: LIGHT HIGH-CONTRAST SECTION — The right tutor can change the way a child learns. */}
      <section className="py-20 px-4 md:px-8 bg-slate-50 text-slate-900 border-t border-slate-200">
        <div className="max-w-5xl mx-auto space-y-12">
          
          <div className="text-center space-y-4 max-w-3xl mx-auto">
            <h2 className="text-3xl sm:text-5xl font-black text-slate-900 leading-tight">
              The right tutor can change the way a child learns.
            </h2>
            <p className="text-slate-600 text-base sm:text-lg font-medium">
              That's why we don't simply assign a tutor.
            </p>
            <p className="text-xl sm:text-2xl font-black text-[#2363f1]">
              We focus on finding the <span className="underline decoration-[#f9be3e] decoration-4">right learning fit</span>.
            </p>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-6">
            {tutorPillars.map((pillar, idx) => (
              <div key={idx} className="bg-white rounded-2xl sm:rounded-3xl p-3.5 sm:p-6 border border-slate-200 space-y-1.5 sm:space-y-3 shadow-sm hover:shadow-md transition-all flex flex-col justify-start">
                <div className="w-8 h-8 sm:w-10 sm:h-10 rounded-xl sm:rounded-2xl bg-[#2363f1]/10 border border-[#2363f1]/30 flex items-center justify-center text-[#2363f1] font-black shrink-0">
                  <pillar.icon className="w-4 h-4 sm:w-5 sm:h-5" />
                </div>
                <h4 className="text-xs sm:text-lg font-black text-slate-900 flex items-center gap-1 sm:gap-2 leading-tight sm:leading-normal">
                  ✓ {pillar.title}
                </h4>
                <p className="text-[11px] sm:text-sm font-medium text-slate-600 leading-snug sm:leading-relaxed">
                  {pillar.desc}
                </p>
              </div>
            ))}

            <div className="bg-white rounded-2xl sm:rounded-3xl p-3.5 sm:p-6 border border-dashed border-[#2363f1]/50 space-y-1.5 sm:space-y-3 shadow-sm hover:shadow-md transition-all flex flex-col justify-start">
              <div className="w-8 h-8 sm:w-10 sm:h-10 rounded-xl sm:rounded-2xl bg-[#2363f1]/10 border border-[#2363f1]/30 flex items-center justify-center text-[#2363f1] font-black shrink-0">
                <ShieldCheck className="w-4 h-4 sm:w-5 sm:h-5 text-[#2363f1]" />
              </div>
              <h4 className="text-xs sm:text-lg font-black text-slate-900 flex items-center gap-1 sm:gap-2 leading-tight sm:leading-normal">
                ✓ 100% Vetted Tutors
              </h4>
              <p className="text-[11px] sm:text-sm font-medium text-slate-600 leading-snug sm:leading-relaxed">
                Background checked & top 1% applicants qualify to teach.
              </p>
            </div>
          </div>

        </div>
      </section>

      {/* SECTION 5: DARK ACCENT BAND — Your child shouldn't have to fit the tutor. */}
      <section className="py-20 px-4 md:px-8 bg-gradient-to-r from-[#0c142a] via-[#1e2842] to-[#0c142a] text-white border-t border-b border-[#1ad8ea]/20">
        <div className="max-w-5xl mx-auto space-y-12">
          
          <div className="text-center space-y-3">
            <h2 className="text-3xl sm:text-5xl font-black text-slate-300">
              Your child shouldn't have to fit the tutor.
            </h2>
            <h3 className="text-2xl sm:text-4xl font-black text-white">
              The tutor should fit the child.
            </h3>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            {studentNeeds.map((need, idx) => (
              <div 
                key={idx}
                className={`rounded-3xl p-6 border ${need.accent} backdrop-blur-sm space-y-2 shadow-xl hover:border-[#1ad8ea] transition-all`}
              >
                <span className="text-[10px] font-black uppercase tracking-widest px-3 py-1 rounded-full bg-[#0c142a] text-[#1ad8ea] border border-[#1ad8ea]/30 inline-block">
                  {need.tag}
                </span>
                <p className="text-slate-100 text-base sm:text-lg font-bold leading-relaxed pt-1">
                  "{need.text}"
                </p>
              </div>
            ))}
          </div>

          <div className="bg-[#0c142a] p-8 rounded-3xl border border-[#1ad8ea]/30 text-center space-y-3 max-w-3xl mx-auto shadow-2xl">
            <p className="text-lg sm:text-xl font-black text-white">
              That's why every Ruzann learning journey begins by understanding <span className="text-[#f9be3e]">the student first.</span>
            </p>
          </div>

        </div>
      </section>

      {/* SECTION 6: LIGHT HIGH-CONTRAST SECTION — From "I don't understand this" to "I can solve this." */}
      <section className="py-20 px-4 md:px-8 bg-white text-slate-900 border-t border-slate-200">
        <div className="max-w-6xl mx-auto space-y-12">
          
          <div className="text-center space-y-4">
            <span className="text-slate-500 text-lg font-bold block">From</span>
            <h2 className="text-3xl sm:text-5xl font-black text-rose-600">
              “I don't understand this”
            </h2>
            <span className="text-slate-500 text-lg font-bold block">to</span>
            <h3 className="text-3xl sm:text-5xl font-black text-[#2363f1]">
              “I can solve this.”
            </h3>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-5 gap-3 sm:gap-4">
            {processSteps.map((step, idx) => (
              <div 
                key={step.number}
                className={`bg-slate-50 rounded-2xl sm:rounded-3xl p-4 sm:p-6 border border-slate-200 hover:border-[#2363f1] transition-all space-y-2 sm:space-y-3 relative overflow-hidden group shadow-sm hover:shadow-md flex flex-col ${
                  idx === 4 ? 'col-span-2 sm:col-span-1 items-center text-center sm:items-start sm:text-left' : 'items-start text-left'
                }`}
              >
                <div className="text-3xl sm:text-4xl font-black text-slate-300 group-hover:text-[#2363f1] transition-colors">
                  {step.number}
                </div>
                <h4 className="text-xs sm:text-base font-black text-slate-900 tracking-wide">
                  {step.title}
                </h4>
                <p className="text-[11px] sm:text-xs text-slate-600 font-medium leading-snug sm:leading-relaxed">
                  {step.desc}
                </p>
              </div>
            ))}
          </div>

        </div>
      </section>

      {/* SECTION 7: VIBRANT GRADIENT BANNER — Experience Ruzann before you decide. */}
      <section className="py-20 px-4 md:px-8 bg-slate-100 border-t border-slate-200">
        <div className="max-w-4xl mx-auto bg-gradient-to-br from-[#0c142a] via-[#1e2842] to-[#0c142a] text-white rounded-3xl p-8 sm:p-12 border border-[#1ad8ea]/30 text-center space-y-8 shadow-2xl relative overflow-hidden">
          
          <div className="space-y-3 relative z-10">
            <h2 className="text-3xl sm:text-5xl font-black text-white">
              Experience Ruzann before you decide.
            </h2>
            <h3 className="text-2xl sm:text-4xl font-black text-[#f9be3e]">
              Your first step is completely FREE.
            </h3>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-left max-w-2xl mx-auto pt-2 relative z-10">
            {[
              'Meet the tutor.',
              'Experience our teaching approach.',
              'Let your child experience personalized learning.',
              'Understand where they need support.'
            ].map((item, idx) => (
              <div key={idx} className="flex items-center gap-3 p-3.5 rounded-2xl bg-[#0c142a] border border-slate-700 text-slate-200 text-sm font-bold">
                <CheckCircle2 size={18} className="text-[#1ad8ea] shrink-0" />
                <span>{item}</span>
              </div>
            ))}
          </div>

          <div className="space-y-4 pt-4 relative z-10">
            <h4 className="text-lg font-black text-white uppercase tracking-wider">
              BOOK YOUR FREE DEMO CLASS
            </h4>
            <p className="text-slate-400 text-xs font-bold">
              No long-term commitment. No pressure to enroll.
            </p>
            <button
              onClick={() => openDemoModal()}
              className="px-10 py-4 rounded-full bg-gradient-to-r from-[#2363f1] to-[#1ad8ea] text-[#0c142a] font-black text-base shadow-[0_10px_30px_-10px_rgba(35,99,241,0.6)] hover:scale-105 transition-all"
            >
              [ BOOK FREE DEMO ]
            </button>
          </div>

        </div>
      </section>

      {/* SECTION 8: LIGHT HIGH-CONTRAST SECTION — More than tutoring. A learning partnership. */}
      <section className="py-20 px-4 md:px-8 bg-white text-slate-900 border-t border-slate-200">
        <div className="max-w-6xl mx-auto space-y-12">
          
          <div className="text-center space-y-4 max-w-3xl mx-auto">
            <h2 className="text-3xl sm:text-5xl font-black text-slate-900">
              More than tutoring.
            </h2>
            <h3 className="text-2xl sm:text-4xl font-black text-[#2363f1]">
              A learning partnership.
            </h3>
            <p className="text-slate-600 text-base sm:text-lg pt-2">
              Your child's school provides the classroom.
              <br />
              Ruzann provides the <strong className="text-slate-900">personal attention</strong> that a classroom often cannot.
            </p>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-6">
            {partnershipFeatures.map((feat, idx) => (
              <div 
                key={idx}
                className="bg-slate-50 rounded-2xl sm:rounded-3xl p-3.5 sm:p-6 border border-slate-200 space-y-1.5 sm:space-y-3 hover:bg-white hover:border-[#2363f1] transition-all shadow-sm hover:shadow-md flex flex-col justify-start"
              >
                <h4 className="text-xs sm:text-lg font-black text-slate-900 flex items-center gap-1.5 sm:gap-2 leading-tight sm:leading-normal">
                  <span className="w-2 h-2 sm:w-2.5 sm:h-2.5 rounded-full bg-[#2363f1] shrink-0" />
                  {feat.title}
                </h4>
                <p className="text-[11px] sm:text-sm font-medium text-slate-600 leading-snug sm:leading-relaxed">
                  {feat.desc}
                </p>
              </div>
            ))}
          </div>

        </div>
      </section>

      {/* SECTION 9: DEEP NAVY SHOWCASE — The goal isn't just a better grade. */}
      <section className="py-20 px-4 md:px-8 bg-[#0c142a] text-white border-t border-slate-800 text-center">
        <div className="max-w-4xl mx-auto space-y-10">
          
          <div className="space-y-3">
            <h2 className="text-3xl sm:text-5xl font-black text-slate-300">
              The goal isn't just a better grade.
            </h2>
            <h3 className="text-2xl sm:text-4xl font-black text-white">
              It's a child who understands why.
            </h3>
          </div>

          <div className="space-y-4 max-w-2xl mx-auto text-slate-300 text-base sm:text-lg font-medium leading-relaxed bg-[#1e2842] p-8 rounded-3xl border border-[#1ad8ea]/30 shadow-2xl">
            <p>Because when a child understands the concept,</p>
            <p className="text-[#1ad8ea] font-bold text-xl">confidence follows.</p>
            <p>When confidence follows,</p>
            <p className="text-[#2363f1] font-bold text-xl">they participate.</p>
            <p>When they participate,</p>
            <p className="text-[#f9be3e] font-bold text-xl">they improve.</p>
            <p>And when they improve, they begin to believe:</p>
            
            <div className="pt-6">
              <h2 className="text-4xl sm:text-6xl font-black bg-gradient-to-r from-[#1ad8ea] via-[#2363f1] to-[#f9be3e] bg-clip-text text-transparent tracking-tight">
                “I CAN DO THIS.”
              </h2>
            </div>
          </div>

        </div>
      </section>

      {/* SECTION 10: LIGHT PRICING SECTION ($12/hr) */}
      {SHOW_PRICING_SECTION && (
        <section id="pricing" className="py-20 px-4 md:px-8 bg-slate-50 text-slate-900 border-t border-slate-200">
          <div className="max-w-5xl mx-auto space-y-12">
            
            <div className="text-center space-y-4 max-w-2xl mx-auto">
              <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-white border border-slate-300 text-[#2363f1] text-xs font-black uppercase tracking-wider shadow-sm">
                <DollarSign size={14} className="text-[#2363f1]" /> Transparent & Flexible Pricing
              </div>
              <h2 className="text-3xl sm:text-5xl font-black text-slate-900">
                Simple, Honest Hourly Rate
              </h2>
              <p className="text-slate-600 text-sm sm:text-base">
                No hidden setup fees, no lock-in contracts. Pay only for the live 1-to-1 tutoring sessions your child needs.
              </p>
            </div>

            {/* High-Contrast Pricing Card */}
            <div className="max-w-xl mx-auto bg-white rounded-3xl p-8 sm:p-10 border-2 border-[#2363f1] shadow-2xl relative overflow-hidden text-slate-900">
              
              <div className="absolute top-0 right-0 bg-gradient-to-l from-[#2363f1] to-[#1ad8ea] text-[#0c142a] text-[10px] font-black uppercase tracking-widest px-6 py-1.5 rounded-bl-2xl">
                1-to-1 Live Academic Class
              </div>

              <div className="text-center space-y-4 pt-2">
                <h3 className="text-xl font-bold text-slate-800">Personalized 1-on-1 Academic Tutoring</h3>
                
                <div className="flex items-baseline justify-center gap-1">
                  <span className="text-5xl sm:text-6xl font-black text-slate-900">${HOURLY_RATE}</span>
                  <span className="text-[#2363f1] font-bold text-lg">/ hour</span>
                </div>

                <p className="text-slate-500 text-xs">
                  Available in all supported global curricula (IB, IGCSE, A-Level, AP, CBSE)
                </p>
              </div>

              <div className="space-y-3 pt-6 my-6 border-t border-slate-200 text-sm text-slate-700">
                {[
                  '100% Dedicated 1-to-1 Live Expert Tutor',
                  'Curriculum & Exam Board Specific Material',
                  'Free Academic Diagnostic & Assessment',
                  'Flexible Scheduling (Reschedule anytime free)',
                  'Detailed Parent Progress Reports after every topic',
                  'Homework & Past Paper Exam Solving Support'
                ].map((item, idx) => (
                  <div key={idx} className="flex items-center gap-3">
                    <CheckCircle2 size={18} className="text-[#2363f1] shrink-0" />
                    <span>{item}</span>
                  </div>
                ))}
              </div>

              <div className="pt-2 text-center space-y-3">
                <button
                  onClick={() => openDemoModal()}
                  className="w-full py-4 rounded-full bg-gradient-to-r from-[#2363f1] to-[#1ad8ea] text-[#0c142a] font-black text-base shadow-lg hover:scale-[1.02] active:scale-[0.98] transition-all"
                >
                  START WITH A FREE DEMO CLASS
                </button>
                <p className="text-slate-500 text-xs font-medium">
                  Try a 1-to-1 demo class for free before purchasing any session package.
                </p>
              </div>

            </div>

            {/* Trustpilot Badge below pricing */}
            <div className="flex justify-center pt-2">
              <TrustpilotBadge variant="compact" className="max-w-md w-full justify-center py-2.5 shadow-sm" />
            </div>

          </div>
        </section>
      )}

      {/* SECTION 11: LIGHT PARENT REVIEWS — Trustpilot & Verified Social Proof */}
      <section className="py-20 px-4 md:px-8 bg-white text-slate-900 border-t border-slate-200">
        <div className="max-w-6xl mx-auto space-y-12">
          
          <div className="text-center space-y-4">
            <TrustpilotBadge variant="compact" />
            <h2 className="text-3xl sm:text-5xl font-black text-slate-900 pt-2">
              Trusted by Parents Round the Globe
            </h2>
            <p className="text-slate-600 text-sm max-w-xl mx-auto font-medium">
              Read how personalized 1-to-1 academic support transformed confidence and results for students in top IB, Cambridge & CBSE schools.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {[
              {
                quote: "My son was struggling with IB Math HL analysis. The 1-to-1 tutor at Ruzann broke down complex calculus concepts patiently. His predicted grade jumped from a 4 to a 7!",
                author: "Dr. Alistair Vance",
                location: "London, UK",
                curriculum: "IB Math HL",
                rating: 4.5,
              },
              {
                quote: "We needed urgent exam prep for IGCSE Physics and Chemistry. The tailored practice questions and flexible scheduling made all the difference. Highly recommend Ruzann!",
                author: "Meera Subramaniam",
                location: "Singapore",
                curriculum: "IGCSE Sciences",
                rating: 4.5,
              },
              {
                quote: "Finding an A-Level tutor who actually understands the syllabus details was tough until we found Ruzann. The tutor is super encouraging and very structured.",
                author: "Marcus Lindqvist",
                location: "Dubai, UAE",
                curriculum: "A-Level Economics & Math",
                rating: 4.5,
              },
            ].map((review, i) => (
              <div key={i} className="bg-slate-50 rounded-3xl p-6 border border-slate-200 space-y-4 flex flex-col justify-between shadow-sm hover:shadow-md transition-all">
                <div className="space-y-3">
                  <div className="flex items-center gap-1.5">
                    <div className="flex items-center gap-0.5">
                      {[1, 2, 3, 4].map((r) => (
                        <div key={r} className="w-4 h-4 bg-[#00b67a] flex items-center justify-center rounded-[2px]">
                          <Star size={10} className="fill-white text-white" />
                        </div>
                      ))}
                      <div className="w-4 h-4 bg-[#00b67a] flex items-center justify-center rounded-[2px]">
                        <StarHalf size={10} className="fill-white text-white" />
                      </div>
                    </div>
                    <span className="text-xs font-black text-[#00b67a] ml-1">4.5 / 5 Verified</span>
                  </div>
                  <p className="text-slate-700 text-xs sm:text-sm font-medium italic leading-relaxed">
                    "{review.quote}"
                  </p>
                </div>

                <div className="pt-4 border-t border-slate-200 flex items-center justify-between">
                  <div>
                    <h5 className="font-black text-slate-900 text-sm">{review.author}</h5>
                    <p className="text-[11px] text-slate-500">{review.location}</p>
                  </div>
                  <span className="text-[10px] font-bold text-[#2363f1] bg-white px-2.5 py-1 rounded-full border border-slate-200">
                    {review.curriculum}
                  </span>
                </div>
              </div>
            ))}
          </div>

        </div>
      </section>

      {/* SECTION 12: DEEP GRADIENT FOOTER CTA & Tagline */}
      <section className="py-20 px-4 md:px-8 bg-gradient-to-b from-[#0c142a] to-slate-950 text-white text-center relative overflow-hidden">
        
        <div className="max-w-4xl mx-auto space-y-8 relative z-10">
          
          <div className="space-y-3">
            <h2 className="text-3xl sm:text-5xl font-black text-white leading-tight">
              Your child's next chapter starts with one FREE class.
            </h2>
            <p className="text-slate-300 text-sm sm:text-base max-w-2xl mx-auto">
              You don't need to commit to a program to discover whether Ruzann is right for your child.
            </p>
          </div>

          <div className="bg-[#1e2842] rounded-3xl p-8 border border-[#1ad8ea]/30 space-y-6 shadow-2xl max-w-2xl mx-auto">
            <h3 className="text-2xl font-black text-[#f9be3e]">
              Start with a FREE personalized demo.
            </h3>
            
            <p className="text-slate-200 text-sm font-bold">
              Meet the tutor. Experience the teaching. Discover the difference.
            </p>

            <button
              onClick={() => openDemoModal()}
              className="w-full sm:w-auto px-10 py-4 rounded-full bg-gradient-to-r from-[#2363f1] to-[#1ad8ea] text-[#0c142a] font-black text-base shadow-[0_10px_30px_-10px_rgba(35,99,241,0.6)] hover:scale-105 transition-all"
            >
              [ BOOK YOUR FREE DEMO CLASS ]
            </button>

            <p className="text-[#1ad8ea] text-xs font-black tracking-widest uppercase">
              IB • IGCSE • A-Level • AP • CBSE
            </p>
          </div>

          <div className="pt-8 space-y-2 border-t border-slate-800">
            <h3 className="text-3xl font-black tracking-tight text-white">
              RUZANN ACADEMIC
            </h3>
            <p className="text-[#1ad8ea] font-black text-base tracking-wider uppercase">
              Learn better. Think deeper. Go further.
            </p>
            <div className="pt-4 text-xs font-bold text-slate-500 flex flex-wrap justify-center items-center gap-3">
              <span>© {new Date().getFullYear()} Ruzann EdTech</span>
              <span>•</span>
              <a href="/privacy-policy" className="hover:text-slate-300 transition-colors">Privacy Policy</a>
              <span>•</span>
              <a href="/terms-conditions" className="hover:text-slate-300 transition-colors">Terms & Conditions</a>
            </div>
          </div>

        </div>
      </section>

      {/* Free Demo Modal */}
      <FreeDemoModal
        isOpen={isDemoModalOpen}
        onClose={() => setIsDemoModalOpen(false)}
        defaultCurriculum={selectedCurriculum}
      />
    </div>
  );
}
