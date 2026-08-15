"use client";

import React, { useState, useMemo, useEffect } from 'react';
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
  ChevronLeft,
  Search,
  Video,
  Globe,
  MapPin,
  Play,
  Plus,
  Minus,
  Phone,
  Mail,
  MessageCircle,
  Instagram,
  Linkedin,
  Youtube,
  Facebook,
  Check
} from 'lucide-react';

export default function AcademicPage() {
  const [isDemoModalOpen, setIsDemoModalOpen] = useState(false);
  const [selectedCurriculum, setSelectedCurriculum] = useState('IB');
  const [searchQuery, setSearchQuery] = useState('');
  const [activeFaqIndex, setActiveFaqIndex] = useState<number | null>(0);
  const [activeStep, setActiveStep] = useState(0);
  const [currentReviewIndex, setCurrentReviewIndex] = useState(0);
  const [selectedMapRegion, setSelectedMapRegion] = useState('UK & Europe');

  // Auto-play review slider every 4 seconds
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentReviewIndex((prev) => (prev + 1) % 6);
    }, 4000);
    return () => clearInterval(timer);
  }, []);

  const openDemoModal = (curriculum?: string) => {
    if (curriculum) setSelectedCurriculum(curriculum);
    setIsDemoModalOpen(true);
  };

  const handleSearchSubmit = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (searchQuery.trim()) {
      const matched = curriculaList.find(c => 
        c.title.toLowerCase().includes(searchQuery.toLowerCase()) || 
        c.id.toLowerCase().includes(searchQuery.toLowerCase())
      );
      if (matched) {
        setSelectedCurriculum(matched.id);
      }
    }
    const section = document.getElementById('curricula-showcase');
    if (section) {
      section.scrollIntoView({ behavior: 'smooth' });
    }
  };

  // Curricula & Key Stage Data
  const curriculaList = [
    {
      id: 'IB',
      title: 'IB',
      name: 'IB (International Baccalaureate)',
      description: 'Personalized academic support for IB DP & MYP students.',
      subjects: ['Mathematics (AA/AI)', 'Physics HL/SL', 'Chemistry HL/SL', 'Biology', 'English A', 'IA & EE Guidance'],
      badge: 'HL & SL Covered',
      focus: 'Concept depth, Internal Assessment (IA) guidance & exam paper strategy.',
      boards: ['IBO']
    },
    {
      id: 'IGCSE',
      title: 'IGCSE',
      name: 'IGCSE (Cambridge & Edexcel)',
      description: 'Concept building, structured practice, and past paper drills.',
      subjects: ['Mathematics', 'Physics', 'Chemistry', 'Biology', 'English Lit & Lang', 'Computer Science'],
      badge: 'Core & Extended',
      focus: 'Past paper solving, mark scheme techniques & concept clarity.',
      boards: ['CIE', 'Edexcel']
    },
    {
      id: 'A-Level',
      title: 'A-LEVEL',
      name: 'A-Level & AS Level (Key Stage 5)',
      description: 'Advanced subject support for top university prep.',
      subjects: ['Pure & Applied Maths', 'Further Maths', 'Chemistry', 'Physics', 'Biology', 'Economics'],
      badge: 'AS & A2 Preparation',
      focus: 'Advanced problem solving, university entrance readiness & deep understanding.',
      boards: ['AQA', 'Edexcel', 'OCR']
    },
    {
      id: '11Plus',
      title: '11+ Entrance',
      name: '11+ Grammar School Entrance',
      description: 'Selective entrance exam prep for UK Independent & Grammar Schools.',
      subjects: ['11+ Verbal Reasoning', '11+ Non-Verbal Reasoning', 'Primary Maths', 'Creative Writing'],
      badge: 'CEM & GL Specialist',
      focus: 'Speed, accuracy, and paper technique for CEM & GL Assessment exams.',
      boards: ['CEM', 'GL Assessment', 'ISEB']
    },
    {
      id: 'AP',
      title: 'AP',
      name: 'AP (Advanced Placement)',
      description: 'Focused academic support and AP exam preparation.',
      subjects: ['Calculus (AB/BC)', 'Physics C', 'Chemistry', 'Biology', 'Computer Science A'],
      badge: 'Target Score 5',
      focus: 'Free-response question practice & high-yield topic reinforcement.',
      boards: ['College Board']
    },
    {
      id: 'CBSE',
      title: 'CBSE',
      name: 'CBSE Board',
      description: 'Strong foundations, personalized learning and board exam prep.',
      subjects: ['Mathematics', 'Physics', 'Chemistry', 'Biology', 'English'],
      badge: 'Class 6 - 12 Mastery',
      focus: 'NCERT foundation building, numerical practice & board exam excellence.',
      boards: ['CBSE']
    },
    {
      id: 'ICSE',
      title: 'ICSE',
      name: 'ICSE Board',
      description: 'Comprehensive subject mastery, structured learning & ICSE board exam prep.',
      subjects: ['Mathematics', 'Physics', 'Chemistry', 'Biology', 'English', 'Computer Applications'],
      badge: 'Class 6 - 10 Mastery',
      focus: 'CISCE syllabus depth, analytical problem solving & board exam excellence.',
      boards: ['CISCE']
    }
  ];

  // Quick Subject Search Items
  const QUICK_SEARCH_ITEMS = [
    { title: 'GCSE Maths (Edexcel Higher)', stage: 'IGCSE', board: 'Edexcel' },
    { title: 'A-Level Chemistry (AQA Organic)', stage: 'A-Level', board: 'AQA' },
    { title: '11+ Non-Verbal Reasoning (GL)', stage: '11Plus', board: 'GL' },
    { title: 'A-Level Physics (OCR A)', stage: 'A-Level', board: 'OCR' },
    { title: 'IB Maths Analysis & Approaches (HL)', stage: 'IB', board: 'IBO' },
    { title: 'GCSE English Literature (AQA)', stage: 'IGCSE', board: 'AQA' },
    { title: 'AP Calculus BC', stage: 'AP', board: 'College Board' },
  ];

  const filteredSearch = useMemo(() => {
    if (!searchQuery.trim()) return [];
    return QUICK_SEARCH_ITEMS.filter(item => 
      item.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.stage.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.board.toLowerCase().includes(searchQuery.toLowerCase())
    );
  }, [searchQuery]);

  const activeCurrData = curriculaList.find(c => c.id === selectedCurriculum) || curriculaList[0];

  // Global Map Locations Data
  const GLOBAL_REGIONS = [
    {
      name: 'UK & Europe',
      students: '5,500+ Students Taught',
      cities: ['London', 'Manchester', 'Hertfordshire', 'Edinburgh', 'Zurich'],
      pinCoordinates: [
        { top: '28%', left: '46%', name: 'London, UK', count: '3,200+' },
        { top: '25%', left: '48%', name: 'Zurich, Switzerland', count: '1,100+' },
      ]
    },
    {
      name: 'Middle East',
      students: '4,200+ Students Taught',
      cities: ['Dubai', 'Abu Dhabi', 'Doha', 'Riyadh', 'Muscat'],
      pinCoordinates: [
        { top: '42%', left: '60%', name: 'Dubai, UAE', count: '2,800+' },
        { top: '44%', left: '58%', name: 'Doha, Qatar', count: '1,400+' },
      ]
    },
    {
      name: 'Americas',
      students: '3,000+ Students Taught',
      cities: ['New York', 'California', 'Toronto', 'Vancouver', 'Texas'],
      pinCoordinates: [
        { top: '32%', left: '22%', name: 'New York, USA', count: '1,900+' },
        { top: '35%', left: '16%', name: 'California, USA', count: '1,100+' },
      ]
    },
    {
      name: 'Asia Pacific',
      students: '3,800+ Students Taught',
      cities: ['Singapore', 'Mumbai', 'Hong Kong', 'Sydney', 'Delhi'],
      pinCoordinates: [
        { top: '50%', left: '72%', name: 'Singapore', count: '1,600+' },
        { top: '46%', left: '68%', name: 'Mumbai, India', count: '2,200+' },
      ]
    }
  ];

  const currentMapData = GLOBAL_REGIONS.find(r => r.name === selectedMapRegion) || GLOBAL_REGIONS[0];

  // Tutorwaves Inspired 3 Highlight Icon Boxes
  const TUTORWAVES_FEATURE_BOXES = [
    {
      title: '1-to-1 Personalized Tutoring',
      desc: 'Tailored learning pace, individualized attention, and custom lesson plans built around your child’s goals.',
      icon: Users,
    },
    {
      title: 'Qualified Expert Tutors',
      desc: 'Top 1% subject specialists, DBS checked UK teachers, and graduates from Oxford, Cambridge & Imperial.',
      icon: Award,
    },
    {
      title: 'Progress Driven Learning',
      desc: 'Regular parent feedback, weekly reports, and transparent tracking of student grade improvement.',
      icon: TrendingUp,
    }
  ];

  // Reviews List
  const reviewsList = [
    {
      quote: "My son was struggling with IB Math HL analysis. The 1-to-1 tutor at Ruzann broke down complex calculus concepts patiently. His predicted grade jumped from a 4 to a 7!",
      author: "Dr. Alistair Vance",
      location: "London, UK",
      curriculum: "IB Math HL",
      rating: 4.8,
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
      rating: 4.7,
    },
    {
      quote: "My son passed both the Henriette Barnett and QE Boys 11+ grammar school entrance tests. The targeted Verbal and Non-Verbal reasoning mock drills were invaluable.",
      author: "Priya Sharma",
      location: "Hertfordshire, UK",
      curriculum: "11+ Grammar Prep",
      rating: 4.9,
    },
    {
      quote: "ICSE Board exams felt overwhelming until we found Ruzann. The 1-to-1 attention in ICSE Physics and Math boosted my son's confidence immensely. Scored 96% in boards!",
      author: "Rajesh Kulkarni",
      location: "Mumbai, India",
      curriculum: "ICSE Grade 10",
      rating: 4.6,
    },
    {
      quote: "AP Physics C calculus-based problems were intimidating. The instructor cleared every doubt with intuitive visual examples. Scored a perfect 5 on the AP exam!",
      author: "Sarah Jenkins",
      location: "California, USA",
      curriculum: "AP Physics C & Calculus",
      rating: 4.8,
    }
  ];

  const nextReview = () => {
    setCurrentReviewIndex((prev) => (prev + 1) % reviewsList.length);
  };

  const prevReview = () => {
    setCurrentReviewIndex((prev) => (prev - 1 + reviewsList.length) % reviewsList.length);
  };

  // FAQs
  const UK_FAQS = [
    {
      q: "Are all your tutors qualified and DBS checked?",
      a: "Yes. Every single tutor conducting academic sessions undergoes rigorous background, identity, and DBS checks. They hold degrees from top global institutions including Oxford, Cambridge, Imperial, UCL, and top state universities."
    },
    {
      q: "Which exam boards and curricula do you cover?",
      a: "We cover IB (MYP & DP), IGCSE, GCSE (AQA, Edexcel, OCR, CIE), A-Levels (AS & A2), 11+ Entrance (CEM & GL), AP, CBSE, and ICSE."
    },
    {
      q: "How does the Free Demo Class work?",
      a: "When you book a Free Demo Class, our academic coordinator matches your child with a dedicated 1-on-1 tutor. Your child gets a 30-minute diagnostic session with an interactive digital whiteboard and custom study plan."
    },
    {
      q: "Can lessons be scheduled around school hours and weekends?",
      a: "Yes. Lessons are completely flexible and can be booked after school hours, on weekends, or during holiday periods to fit your family's routine."
    },
    {
      q: "What equipment is required for live online classes?",
      a: "Any desktop computer, laptop, or iPad/tablet with a stable internet connection and microphone/webcam. Lessons take place in an interactive web-based classroom with dual-pen digital whiteboard."
    }
  ];

  return (
    <div className="min-h-screen bg-[#F4F7FF] text-slate-900 font-sans selection:bg-[#1E7DBB] selection:text-white pb-0 overflow-x-hidden">
      <Header />

      {/* TOP TRUST & ANNOUNCEMENT BAR (TUTORWAVES STYLE) */}
      <div className="bg-[#030F40] border-b border-blue-900 py-2.5 px-4 text-center text-xs font-semibold text-white shadow-sm">
        <div className="max-w-7xl mx-auto flex flex-wrap items-center justify-center gap-3 md:gap-6">
          <span className="inline-flex items-center gap-1.5 bg-[#1E7DBB]/30 border border-[#1E7DBB]/60 text-sky-200 px-3 py-0.5 rounded-full font-bold text-[11px] uppercase tracking-wider">
            Live Online Academic Tutoring
          </span>
          <span className="flex items-center gap-1 text-amber-300 font-medium">
            <ShieldCheck size={14} className="text-emerald-400" />
            100% DBS Checked Tutors
          </span>
          <span className="hidden md:inline text-slate-400">•</span>
          <div className="inline-block transform scale-90 sm:scale-100">
            <TrustpilotBadge variant="compact" />
          </div>
        </div>
      </div>

      {/* HERO SECTION — EXACT TUTORWAVES LEFT-ALIGNED DESKTOP STRUCTURE */}
      <section className="relative pt-8 pb-16 px-4 md:px-8 overflow-hidden bg-gradient-to-b from-[#F4F7FF] via-[#EEF4FF] to-[#F8FAFC]">
        {/* Ambient Glowing Graphic Background */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-7xl h-[550px] bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-blue-200/30 via-sky-100/10 to-transparent pointer-events-none" />
        
        <div className="container mx-auto max-w-6xl relative z-10">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-center">
            
            {/* LEFT CONTENT COLUMN — LEFT ALIGNED DESKTOP TEXT */}
            <div className="lg:col-span-7 space-y-6 text-left">
              
              {/* Top Pill Badge */}
              <motion.div
                initial={{ opacity: 0, y: -15 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
                className="inline-flex items-center gap-2 bg-white border border-blue-200 px-4 py-1.5 rounded-full text-[#1E7DBB] text-xs font-bold shadow-sm"
              >
                <Sparkles size={15} className="text-[#FF9B04] fill-[#FF9B04]" />
                <span>EXPERIENCE PERSONALISED ONLINE TUTORING</span>
              </motion.div>

              {/* Headline & Description Layout */}
              <div className="space-y-4">
                <motion.h1 
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, delay: 0.1 }}
                  className="text-4xl sm:text-5xl lg:text-6xl font-black text-[#030F40] tracking-tight leading-[1.1] text-left"
                >
                  Learn<br />
                  smarter<br />
                  with <span className="text-[#1E7DBB]">Ruzann</span>
                </motion.h1>

                <motion.p
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, delay: 0.2 }}
                  className="text-slate-600 text-sm sm:text-base font-normal leading-relaxed max-w-lg text-left"
                >
                  Experience personalised online tutoring that cultivates deeper understanding, accelerates progress, and ensures meaningful learning outcomes across <strong className="text-[#030F40]">IB, IGCSE, A-Levels, 11+, AP, CBSE & ICSE</strong>.
                </motion.p>

                {/* Large & Bold Hero Book Free Demo CTA Button */}
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, delay: 0.25 }}
                  className="pt-2"
                >
                  <button
                    onClick={() => openDemoModal()}
                    className="inline-flex items-center justify-center gap-3 bg-[#FF9B04] hover:bg-[#e08800] text-slate-950 font-black text-base sm:text-lg px-8 py-4 rounded-2xl shadow-xl shadow-amber-500/20 hover:shadow-2xl hover:scale-[1.02] active:scale-[0.98] transition-all transform tracking-tight uppercase"
                  >
                    <span>BOOK FREE DEMO CLASS →</span>
                  </button>
                </motion.div>
              </div>

              {/* Search Bar Element (Tutorwaves Pill Search) */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.3 }}
                className="relative max-w-xl z-20 pt-2"
              >
                <form onSubmit={handleSearchSubmit} className="bg-[#030F40] p-1.5 rounded-full shadow-2xl shadow-blue-950/20 flex items-center gap-2">
                  <div className="flex items-center gap-3 px-4 py-2 w-full">
                    <input
                      type="text"
                      placeholder="What do you want to learn?..."
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      className="bg-transparent text-white placeholder-slate-300 text-sm focus:outline-none w-full font-medium"
                    />
                  </div>
                  <button
                    type="submit"
                    className="shrink-0 bg-[#1E7DBB] hover:bg-[#16669b] text-white font-extrabold text-xs py-2.5 px-6 rounded-full transition-all flex items-center gap-2 cursor-pointer"
                  >
                    <span>Search</span>
                    <div className="w-6 h-6 rounded-full bg-white text-[#1E7DBB] flex items-center justify-center">
                      <Search size={12} />
                    </div>
                  </button>
                </form>

                {/* Quick Search Autocomplete Dropdown */}
                {searchQuery && (
                  <div className="absolute left-0 right-0 top-full mt-2 bg-white border border-slate-200 rounded-2xl p-3 shadow-2xl z-50 space-y-1 text-left">
                    {filteredSearch.length > 0 ? (
                      filteredSearch.map((item, idx) => (
                        <div
                          key={idx}
                          onClick={() => {
                            setSelectedCurriculum(item.stage);
                            handleSearchSubmit();
                            setSearchQuery('');
                          }}
                          className="flex items-center justify-between p-3 rounded-xl hover:bg-slate-50 cursor-pointer transition-colors border border-transparent hover:border-slate-200"
                        >
                          <span className="text-sm font-bold text-slate-800">{item.title}</span>
                          <span className="text-xs bg-[#EEF4FF] text-[#1E7DBB] border border-blue-200 px-3 py-0.5 rounded-full font-bold">
                            {item.board}
                          </span>
                        </div>
                      ))
                    ) : (
                      <div className="p-3 text-center text-xs text-slate-500 font-medium">
                        No matching subjects found. Click below to book custom 1-on-1 tutoring!
                      </div>
                    )}
                  </div>
                )}
              </motion.div>

              {/* Tutorwaves Style Connect Our Experts CTA Button */}
              <motion.div
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.6, delay: 0.4 }}
                className="pt-2 flex items-center gap-4"
              >
                <button
                  onClick={() => openDemoModal()}
                  className="group inline-flex items-center gap-3 text-[#1E7DBB] hover:text-[#030F40] font-extrabold text-sm transition-all"
                >
                  <span>Connect our experts</span>
                  <span className="w-8 h-8 rounded-full bg-[#1E7DBB] group-hover:bg-[#030F40] text-white flex items-center justify-center transition-colors shadow-md">
                    <ArrowRight size={14} />
                  </span>
                </button>
              </motion.div>

            </div>

            {/* RIGHT GRAPHIC COLUMN — HERO STUDENT VISUAL ASSET */}
            <div className="lg:col-span-5 relative flex items-center justify-center">
              <div className="relative w-full max-w-md aspect-[4/5] rounded-[32px] overflow-hidden shadow-2xl border border-blue-100 bg-white group">
                
                <img 
                  src="/images/hero-student.jpg" 
                  alt="Learn Smarter with Ruzann - Student Online Tutoring" 
                  className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                />

                {/* Floating Highlight Badge (Tutorwaves Style Glass Overlay) */}
                <div className="absolute bottom-5 left-5 right-5 bg-[#030F40]/95 backdrop-blur-md text-white p-5 rounded-2xl shadow-xl space-y-3 border border-blue-800">
                  <div className="flex items-center justify-between text-xs">
                    <span className="text-sky-300 font-bold uppercase tracking-wider text-[10px]">Academic Excellence</span>
                    <span className="bg-[#1E7DBB] text-white px-2.5 py-0.5 rounded-full font-bold text-[10px]">Free Demo Available</span>
                  </div>
                  <p className="text-xs text-slate-200 font-medium leading-relaxed">
                    Book a free 1-on-1 diagnostic demo class and get matched with expert tutors today.
                  </p>
                  <button
                    onClick={() => openDemoModal()}
                    className="w-full py-2.5 rounded-xl bg-[#FF9B04] hover:bg-[#E08900] text-white font-extrabold text-xs shadow-md transition-all flex items-center justify-center gap-2"
                  >
                    <span>Book Free Demo</span>
                    <ArrowRight size={14} />
                  </button>
                </div>

              </div>
            </div>

          </div>
        </div>
      </section>

      {/* TUTORWAVES 3 HIGHLIGHT ICON BOXES SECTION (BLUE ROUNDED CARDS) */}
      <section className="py-12 px-4 md:px-8 bg-white border-t border-slate-200">
        <div className="max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-6">
          {TUTORWAVES_FEATURE_BOXES.map((box, idx) => {
            const IconComp = box.icon;
            return (
              <motion.div
                key={idx}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: idx * 0.1 }}
                className="bg-[#1E7DBB] text-white rounded-[30px] p-8 space-y-4 shadow-xl hover:shadow-2xl transition-all"
              >
                <div className="w-16 h-16 rounded-2xl bg-white/15 border border-white/20 flex items-center justify-center text-white">
                  <IconComp size={30} />
                </div>
                <h3 className="text-2xl font-extrabold tracking-tight">
                  {box.title}
                </h3>
                <p className="text-sm text-slate-100 leading-relaxed font-medium">
                  {box.desc}
                </p>
              </motion.div>
            );
          })}
        </div>
      </section>

      {/* TUTORWAVES STATS BANNER SECTION */}
      <section className="py-12 px-4 md:px-8 bg-[#1E7DBB] text-white">
        <div className="max-w-6xl mx-auto grid grid-cols-2 md:grid-cols-4 gap-6 text-center">
          {[
            { number: '2,500+', label: 'STUDENTS TAUGHT', desc: 'Across 25+ countries' },
            { number: '98%', label: 'PASS RATE', desc: 'Grade improvements' },
            { number: '50+', label: 'SUBJECTS', desc: 'STEM & Humanities' },
            { number: '6+ YRS', label: 'EXPERIENCE', desc: 'Since 2020' },
          ].map((stat, idx) => (
            <div key={idx} className="space-y-2 p-4">
              <div className="text-4xl sm:text-5xl font-black text-[#FF9B04] tracking-tight">
                {stat.number}
              </div>
              <div className="text-xs font-extrabold tracking-widest uppercase text-white">
                {stat.label}
              </div>
              <div className="text-[11px] text-slate-100 font-medium">
                {stat.desc}
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* WHY CHOOSE US / MASTER THE SKILLS YOU NEED TO THRIVE (TUTORWAVES SECTION) */}
      <section className="py-20 px-4 md:px-8 bg-white border-t border-slate-200">
        <div className="max-w-6xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          
          <div className="space-y-6">
            <span className="text-[#1E7DBB] font-extrabold text-xs uppercase tracking-widest bg-[#EEF4FF] border border-blue-200 px-3.5 py-1 rounded-full">
              Why Choose Us
            </span>
            <h2 className="text-3xl sm:text-5xl font-black text-[#030F40] tracking-tight leading-tight">
              Master the Skills You Need to Thrive
            </h2>
            <p className="text-slate-600 text-base leading-relaxed font-medium">
              Since 2020, bridging learning gaps for school and college/university students through personalized live online tutoring. Our expert tutors empower students to achieve top grade scores.
            </p>

            <div className="space-y-4">
              {[
                { title: '1-to-1 Live Interactive Classes', desc: 'Dedicated 1-on-1 attention with custom explanation for every question.' },
                { title: 'Curriculum & Exam Board Alignment', desc: 'Lessons structured around exact mark schemes for AQA, Edexcel, OCR, IB & Cambridge.' },
                { title: 'Recorded Sessions & Notes Access', desc: 'Review recorded lessons 24/7 before mock and final exams.' },
                { title: 'Parent Progress Reporting', desc: 'Regular WhatsApp and email updates detailing topic performance.' },
              ].map((item, idx) => (
                <div key={idx} className="flex items-start gap-3 bg.f8fafc p-4 rounded-2xl border border-slate-200 shadow-sm">
                  <CheckCircle2 size={20} className="text-[#1E7DBB] shrink-0 mt-0.5" />
                  <div>
                    <div className="text-sm font-bold text-[#030F40]">{item.title}</div>
                    <div className="text-xs text-slate-600 font-medium">{item.desc}</div>
                  </div>
                </div>
              ))}
            </div>

            <div className="pt-2">
              <button
                onClick={() => openDemoModal()}
                className="px-7 py-3.5 rounded-xl bg-[#030F40] hover:bg-[#1E7DBB] text-white font-extrabold text-sm shadow-lg transition-all inline-flex items-center gap-2"
              >
                <span>Book Free Demo Class</span>
                <ArrowRight size={16} />
              </button>
            </div>
          </div>

          {/* Visual Graduate Student Photo Frame */}
          <div className="relative flex items-center justify-center">
            <div className="relative w-full max-w-lg aspect-[3/4] rounded-3xl overflow-hidden shadow-2xl border border-slate-200 bg-white group">
              
              <img 
                src="/images/why-choose-us-graduate.jpg" 
                alt="Master the Skills You Need to Thrive - Graduate Student Success at Ruzann" 
                className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
              />

              {/* Floating Overlay Badge */}
              <div className="absolute bottom-5 left-5 right-5 bg-white/95 backdrop-blur-md p-4 rounded-2xl border border-blue-100 shadow-xl flex items-center justify-between">
                <div>
                  <div className="text-xs font-black text-[#030F40]">Academic Excellence</div>
                  <div className="text-[11px] text-slate-500 font-medium">Over 2,500+ Successful Graduates</div>
                </div>
                <span className="bg-[#1E7DBB] text-white px-3 py-1 rounded-full text-xs font-extrabold shadow-sm">
                  98% Pass Rate
                </span>
              </div>

            </div>
          </div>

        </div>
      </section>

      {/* CURRICULA SHOWCASE (PROGRAMS GRID) */}
      <section id="curricula-showcase" className="py-20 px-4 md:px-8 bg-[#F4F7FF] border-t border-slate-200">
        <div className="max-w-6xl mx-auto space-y-12">
          
          <div className="text-center space-y-3">
            <span className="text-[#1E7DBB] font-extrabold text-xs uppercase tracking-widest bg-white border border-blue-200 px-3.5 py-1 rounded-full">
              Explore Our Programs
            </span>
            <h2 className="text-3xl sm:text-5xl font-black text-[#030F40]">
              Curricula & Academic Programs
            </h2>
            <p className="text-slate-600 text-base font-medium max-w-2xl mx-auto">
              Choose your child’s curriculum to view subject modules, target grade strategies, and exam board coverage.
            </p>
          </div>

          {/* Curricula Tabs Switcher */}
          <div className="flex flex-wrap justify-center gap-2 max-w-4xl mx-auto">
            {curriculaList.map((curr) => (
              <button
                key={curr.id}
                onClick={() => setSelectedCurriculum(curr.id)}
                className={`px-5 py-2.5 rounded-full text-xs sm:text-sm font-black transition-all ${
                  selectedCurriculum === curr.id
                    ? 'bg-[#030F40] text-white shadow-lg scale-105'
                    : 'bg-white text-slate-700 hover:bg-slate-100 border border-slate-200'
                }`}
              >
                {curr.title}
              </button>
            ))}
          </div>

          {/* Active Curriculum Card */}
          <div className="bg-white rounded-[30px] p-6 sm:p-10 border border-slate-200 shadow-xl max-w-4xl mx-auto space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-200 pb-6">
              <div>
                <span className="text-xs font-black uppercase tracking-wider px-3 py-1 rounded-full bg-[#EEF4FF] text-[#1E7DBB] border border-blue-200 inline-block mb-2">
                  {activeCurrData.badge}
                </span>
                <h3 className="text-lg sm:text-2xl lg:text-3xl font-black text-[#030F40]">
                  {activeCurrData.name}
                </h3>
                <p className="text-slate-600 text-xs sm:text-sm font-medium mt-1">{activeCurrData.description}</p>
              </div>
              <button
                onClick={() => openDemoModal(activeCurrData.id)}
                className="px-5 py-2.5 rounded-xl bg-[#1E7DBB] hover:bg-[#030F40] text-white font-extrabold text-xs sm:text-sm transition-all shrink-0 shadow-md"
              >
                Book Free {activeCurrData.title} Demo &rarr;
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-3">
                <h4 className="text-xs font-black uppercase tracking-widest text-[#1E7DBB]">Supported Subjects:</h4>
                <div className="flex flex-wrap gap-2">
                  {activeCurrData.subjects.map((sub) => (
                    <span 
                      key={sub} 
                      className="text-xs px-3 py-1.5 rounded-xl border border-slate-200 bg-[#F8FAFC] font-bold text-slate-800"
                    >
                      {sub}
                    </span>
                  ))}
                </div>
              </div>

              <div className="space-y-3">
                <h4 className="text-xs font-black uppercase tracking-widest text-[#FF9B04]">Target Focus:</h4>
                <p className="text-xs sm:text-sm text-slate-700 font-semibold leading-relaxed bg-[#F8FAFC] p-4 rounded-xl border border-slate-200">
                  {activeCurrData.focus}
                </p>
              </div>
            </div>
          </div>

        </div>
      </section>

      {/* GEOGRAPHIES SECTION — EXACT MATCH FROM TUTORWAVES SCREENSHOT */}
      <section className="py-20 px-4 md:px-8 bg-white border-t border-slate-200">
        <div className="max-w-6xl mx-auto grid grid-cols-1 lg:grid-cols-12 gap-10 items-center">
          
          {/* Left Text Content */}
          <div className="lg:col-span-5 space-y-4 text-left">
            <span className="text-[#1e7dbb] font-medium text-sm md:text-base tracking-tight block">
              Geographies
            </span>
            <h2 className="text-3xl sm:text-4xl md:text-5xl font-black text-[#030f40] tracking-tight leading-[1.15]">
              At Ruzann, Learning Knows No Boundaries
            </h2>
            <p className="text-slate-600 text-sm md:text-base leading-relaxed font-normal pt-2">
              The sun never sets on the territories of Ruzann where there are no geographical boundaries so long as the medium of communication is English. Our students extend from pole to pole: a few to point out are The USA, Canada, The UK, Sweden, the Netherlands, The Middle East, India, and Australia.
            </p>
          </div>

          {/* Right Dotted World Map Graphic — Exact User Image */}
          <div className="lg:col-span-7 relative w-full flex items-center justify-center p-2">
            <div className="relative w-full max-w-3xl bg-white rounded-3xl p-4 flex items-center justify-center border border-slate-100 shadow-sm overflow-hidden">
              <img 
                src="/images/geographies-map.png" 
                alt="At Ruzann, Learning Knows No Boundaries - Global Geographies Map" 
                className="w-full h-auto object-contain select-none"
              />
            </div>
          </div>

        </div>
      </section>

      {/* 4-STEP PROCESS JOURNEY */}
      <section className="py-20 px-4 md:px-8 bg-[#F4F7FF] border-t border-slate-200">
        <div className="max-w-6xl mx-auto space-y-14">
          
          <div className="text-center space-y-4 max-w-3xl mx-auto">
            <span className="text-[#1E7DBB] font-extrabold text-xs uppercase tracking-widest bg-white border border-blue-200 px-3.5 py-1 rounded-full">
              Simple 4-Step Process
            </span>
            <h2 className="text-3xl sm:text-5xl font-black text-[#030F40]">
              How Live 1-to-1 Tutoring Works
            </h2>
            <p className="text-slate-600 text-base font-medium">
              From initial consultation to exam day success in four simple steps.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {[
              { step: '01', title: 'Understand & Assess', desc: 'We evaluate your child’s current level, target grades, and exam board syllabus.' },
              { step: '02', title: 'Match Ideal Tutor', desc: 'Handpicked subject specialist matched to your child’s personality and pace.' },
              { step: '03', title: 'Interactive 1-on-1 Class', desc: 'Engaging live online sessions with interactive digital whiteboard and past paper practice.' },
              { step: '04', title: 'Track Progress & Succeed', desc: 'Receive regular parent progress reports and watch grade boundaries improve.' },
            ].map((stepItem, idx) => (
              <div 
                key={idx} 
                className="bg-white border border-slate-200 p-6 rounded-[25px] space-y-4 flex flex-col justify-between shadow-sm"
              >
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <span className="text-3xl font-black text-[#1E7DBB]">{stepItem.step}</span>
                    <div className="w-10 h-10 rounded-xl bg-[#EEF4FF] border border-blue-200 flex items-center justify-center text-[#1E7DBB] shadow-sm">
                      <CheckCircle2 size={20} />
                    </div>
                  </div>
                  <h3 className="text-lg font-extrabold text-[#030F40]">{stepItem.title}</h3>
                  <p className="text-xs text-slate-600 leading-relaxed font-medium">{stepItem.desc}</p>
                </div>
                <div className="pt-4 border-t border-slate-200 text-[11px] font-bold text-slate-500 flex items-center gap-1">
                  <CheckCircle2 size={13} className="text-emerald-600" /> Step {idx + 1} of 4
                </div>
              </div>
            ))}
          </div>

        </div>
      </section>

      {/* PARENT REVIEWS CAROUSEL */}
      <section className="py-20 px-4 md:px-8 bg-white border-t border-slate-200">
        <div className="max-w-6xl mx-auto space-y-12">
          
          <div className="text-center space-y-4">
            <h2 className="text-3xl sm:text-5xl font-black text-[#030F40]">
              Trusted by Parents Round the Globe
            </h2>
            <p className="text-slate-600 text-sm max-w-xl mx-auto font-medium">
              Read how personalized 1-to-1 academic support transformed confidence and results.
            </p>
          </div>

          <div className="relative max-w-2xl mx-auto px-4 sm:px-12">
            <button
              onClick={prevReview}
              className="absolute left-0 top-1/2 -translate-y-1/2 z-10 w-10 h-10 sm:w-12 sm:h-12 rounded-full bg-white border border-slate-300 shadow-xl text-slate-700 hover:bg-[#1E7DBB] hover:text-white transition-all flex items-center justify-center -ml-2 sm:-ml-5"
              aria-label="Previous review"
            >
              <ChevronLeft size={22} />
            </button>
            <button
              onClick={nextReview}
              className="absolute right-0 top-1/2 -translate-y-1/2 z-10 w-10 h-10 sm:w-12 sm:h-12 rounded-full bg-white border border-slate-300 shadow-xl text-slate-700 hover:bg-[#1E7DBB] hover:text-white transition-all flex items-center justify-center -mr-2 sm:-mr-5"
              aria-label="Next review"
            >
              <ChevronRight size={22} />
            </button>

            <AnimatePresence mode="wait">
              <motion.div
                key={currentReviewIndex}
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                transition={{ duration: 0.25 }}
                className="bg-[#F8FAFC] rounded-3xl p-6 sm:p-8 border-2 border-slate-200 space-y-6 flex flex-col justify-between shadow-lg min-h-[220px]"
              >
                <div className="space-y-4">
                  <div className="flex items-center justify-between gap-2">
                    <div className="flex items-center gap-1">
                      {[1, 2, 3, 4, 5].map((starIndex) => {
                        const rating = reviewsList[currentReviewIndex].rating;
                        if (starIndex <= Math.floor(rating)) {
                          return <Star key={starIndex} size={18} className="fill-[#FF9B04] text-[#FF9B04]" />;
                        } else if (starIndex - 0.5 <= rating) {
                          return <StarHalf key={starIndex} size={18} className="fill-[#FF9B04] text-[#FF9B04]" />;
                        } else {
                          return <Star key={starIndex} size={18} className="text-slate-300 fill-slate-100" />;
                        }
                      })}
                      <span className="text-xs font-black text-amber-600 ml-1">
                        {reviewsList[currentReviewIndex].rating.toFixed(1)} / 5 Verified
                      </span>
                    </div>
                    <span className="text-[10px] font-black uppercase tracking-wider text-slate-400 bg-slate-100 px-2.5 py-1 rounded-full border border-slate-200">
                      {currentReviewIndex + 1} / {reviewsList.length}
                    </span>
                  </div>
                  <p className="text-[#030F40] text-sm sm:text-base font-semibold italic leading-relaxed">
                    "{reviewsList[currentReviewIndex].quote}"
                  </p>
                </div>

                <div className="pt-4 border-t border-slate-200 flex items-center justify-between">
                  <div>
                    <h5 className="font-black text-[#030F40] text-sm sm:text-base">{reviewsList[currentReviewIndex].author}</h5>
                    <p className="text-xs text-slate-500 font-medium">{reviewsList[currentReviewIndex].location}</p>
                  </div>
                  <span className="text-xs font-bold text-[#1E7DBB] bg-[#EEF4FF] px-3 py-1 rounded-full border border-blue-200 shadow-sm">
                    {reviewsList[currentReviewIndex].curriculum}
                  </span>
                </div>
              </motion.div>
            </AnimatePresence>

            <div className="flex items-center justify-center gap-2 pt-8">
              {reviewsList.map((_, idx) => (
                <button
                  key={idx}
                  onClick={() => setCurrentReviewIndex(idx)}
                  className={`h-2.5 rounded-full transition-all ${
                    currentReviewIndex === idx ? 'w-8 bg-[#1E7DBB]' : 'w-2.5 bg-slate-300'
                  }`}
                  aria-label={`Go to slide ${idx + 1}`}
                />
              ))}
            </div>
          </div>

        </div>
      </section>

      {/* PARENT FAQS ACCORDION */}
      <section className="py-20 px-4 md:px-8 bg-[#F4F7FF] border-t border-slate-200">
        <div className="max-w-4xl mx-auto space-y-12">
          
          <div className="text-center space-y-4">
            <span className="text-[#1E7DBB] font-extrabold text-xs uppercase tracking-widest bg-white border border-blue-200 px-3.5 py-1 rounded-full">
              Parent FAQs
            </span>
            <h2 className="text-3xl sm:text-5xl font-black text-[#030F40]">
              Frequently Asked Questions
            </h2>
          </div>

          <div className="space-y-4">
            {UK_FAQS.map((faq, idx) => {
              const isOpen = activeFaqIndex === idx;
              return (
                <div 
                  key={idx} 
                  className="bg-white border border-slate-200 rounded-2xl overflow-hidden shadow-sm"
                >
                  <button
                    onClick={() => setActiveFaqIndex(isOpen ? null : idx)}
                    className="w-full p-5 text-left font-bold text-[#030F40] text-base sm:text-lg flex items-center justify-between gap-4 hover:bg-slate-50 transition-colors"
                  >
                    <span>{faq.q}</span>
                    <div className="w-8 h-8 rounded-full bg-[#EEF4FF] flex items-center justify-center text-[#1E7DBB] shrink-0">
                      {isOpen ? <Minus size={16} /> : <Plus size={16} />}
                    </div>
                  </button>

                  <AnimatePresence>
                    {isOpen && (
                      <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: 'auto', opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        transition={{ duration: 0.3 }}
                        className="px-5 pb-5 text-sm text-slate-600 leading-relaxed font-medium border-t border-slate-200 pt-3"
                      >
                        {faq.a}
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              );
            })}
          </div>

        </div>
      </section>

      {/* FOOTER CTA & GLOBAL CONTACT LOCATIONS BANNER — EXACT #1E7DBB BRAND BLUE THEME */}
      <section className="py-20 px-4 md:px-8 bg-[#1E7DBB] text-white text-center relative overflow-hidden border-t border-sky-600">
        <div className="max-w-4xl mx-auto space-y-10 relative z-10">
          
          <div className="space-y-3">
            <h2 className="text-3xl sm:text-5xl font-black text-white leading-tight">
              Start Your Child's Journey With A Free Demo Class.
            </h2>
            <p className="text-sky-100 text-sm sm:text-base max-w-2xl mx-auto font-medium">
              Meet the tutor, experience the live 1-on-1 teaching, and get a custom academic diagnostic.
            </p>
          </div>

          <div className="bg-[#030F40] rounded-3xl p-8 border border-blue-900 space-y-6 shadow-2xl max-w-2xl mx-auto">
            <h3 className="text-2xl sm:text-3xl font-black text-[#FF9B04]">
              Start with a Free personalized demo.
            </h3>

            <button
              onClick={() => openDemoModal()}
              className="w-full sm:w-auto px-8 py-3.5 rounded-xl bg-[#FF9B04] hover:bg-[#E08900] text-white font-extrabold text-sm shadow-lg hover:scale-105 transition-all inline-flex items-center justify-center gap-2"
            >
              <span>Book Free Demo Class</span>
              <ArrowRight size={16} />
            </button>

            <p className="text-sky-300 text-xs font-black tracking-widest uppercase">
              IB • IGCSE • A-LEVEL • 11+ • AP • CBSE • ICSE
            </p>
          </div>

          {/* Social Media & Contact Section */}
          <div className="pt-8 border-t border-blue-400/40 space-y-8 max-w-3xl mx-auto">
            <div className="space-y-2">
              <h3 className="text-3xl font-black tracking-tight text-white">
                RUZANN ACADEMIC
              </h3>
              <p className="text-sky-200 font-extrabold text-sm tracking-wider uppercase">
                Learn better. Think deeper. Go further.
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-left">
              <a 
                href="tel:+919960559894" 
                className="flex items-center gap-3 p-4 rounded-2xl bg-[#030F40]/70 border border-blue-400/30 hover:border-white shadow-lg transition-all group backdrop-blur-md"
              >
                <div className="w-10 h-10 rounded-xl bg-white/10 flex items-center justify-center text-[#FF9B04] group-hover:scale-110 transition-transform shrink-0">
                  <Phone size={20} />
                </div>
                <div>
                  <span className="text-[10px] uppercase font-bold text-sky-200 block">Phone / WhatsApp</span>
                  <span className="text-sm font-black text-white group-hover:text-amber-300 transition-colors">+91 9960559894</span>
                </div>
              </a>

              <a 
                href="mailto:support@ruzann.com" 
                className="flex items-center gap-3 p-4 rounded-2xl bg-[#030F40]/70 border border-blue-400/30 hover:border-white shadow-lg transition-all group backdrop-blur-md"
              >
                <div className="w-10 h-10 rounded-xl bg-white/10 flex items-center justify-center text-sky-300 group-hover:scale-110 transition-transform shrink-0">
                  <Mail size={20} />
                </div>
                <div>
                  <span className="text-[10px] uppercase font-bold text-sky-200 block">Official Email</span>
                  <span className="text-sm font-black text-white group-hover:text-amber-300 transition-colors">support@ruzann.com</span>
                </div>
              </a>

              <div className="flex items-center gap-3 p-4 rounded-2xl bg-[#030F40]/70 border border-blue-400/30 shadow-lg backdrop-blur-md">
                <div className="w-10 h-10 rounded-xl bg-white/10 flex items-center justify-center text-sky-300 shrink-0">
                  <MapPin size={20} />
                </div>
                <div>
                  <span className="text-[10px] uppercase font-bold text-sky-200 block">Headquarters</span>
                  <span className="text-sm font-black text-white">Pune, Maharashtra, India</span>
                </div>
              </div>
            </div>

            <div className="space-y-3 pt-2">
              <span className="text-xs font-bold text-sky-100 uppercase tracking-widest block">Connect With Us On Social Media</span>
              <div className="flex flex-wrap items-center justify-center gap-3">
                {[
                  { name: 'Instagram', Icon: Instagram, href: 'https://www.instagram.com/ruzann_edtech?igsh=cGQ2enhuMXk2MXc2', color: 'hover:bg-gradient-to-r hover:from-purple-500 hover:to-pink-500 hover:text-white' },
                  { name: 'LinkedIn', Icon: Linkedin, href: 'https://www.linkedin.com/company/ruzann/', color: 'hover:bg-blue-800 hover:text-white' },
                  { name: 'YouTube', Icon: Youtube, href: 'https://youtube.com/@ruzannedtech?si=IgxPDTVmDtDVpxad', color: 'hover:bg-red-600 hover:text-white' },
                  { name: 'Facebook', Icon: Facebook, href: 'https://www.facebook.com/share/17fzhNSYkM/', color: 'hover:bg-blue-900 hover:text-white' },
                  { name: 'WhatsApp', Icon: MessageCircle, href: 'https://wa.me/919960559894', color: 'hover:bg-emerald-600 hover:text-white' }
                ].map((social) => (
                  <a
                    key={social.name}
                    href={social.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    className={`w-10 h-10 rounded-full bg-white/15 border border-white/20 text-white flex items-center justify-center transition-all transform hover:-translate-y-1 shadow-sm ${social.color}`}
                    title={social.name}
                  >
                    <social.Icon size={18} />
                  </a>
                ))}
              </div>
            </div>

          </div>

        </div>
      </section>

      {/* FREE DEMO MODAL */}
      <FreeDemoModal
        isOpen={isDemoModalOpen}
        onClose={() => setIsDemoModalOpen(false)}
        defaultCurriculum={selectedCurriculum}
      />

    </div>
  );
}
