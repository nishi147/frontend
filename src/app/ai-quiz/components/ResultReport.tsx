import React from 'react';
import { motion } from 'framer-motion';
import { CheckCircle, AlertTriangle, Calendar, MessageSquare, Phone, BookOpen, Star, Sparkles, RefreshCw } from 'lucide-react';
import { useIntroOffer } from '@/context/IntroOfferContext';
import { useCurrency } from '@/context/CurrencyContext';

interface ResultReportProps {
  score: number;
  category: string;
  recommendedProgram: string;
  answers: Record<number, any>;
  studentName: string;
  parentName: string;
  mobile: string;
  email: string;
  age: number;
  isParent: boolean;
  onRetake: () => void;
  onBookingSuccess: () => void; // Triggered if they complete checkout
}

export default function ResultReport({
  score,
  category,
  recommendedProgram,
  answers,
  studentName,
  parentName,
  mobile,
  email,
  age,
  isParent,
  onRetake,
  onBookingSuccess
}: ResultReportProps) {
  const { handleClaimOffer, isProcessing } = useIntroOffer();
  const { formatPrice } = useCurrency();

  // 1. Calculate Sub-Scores (out of 20) for the 5 categories
  // Questions: Tech 1-4, Logic 5-8, Innovation 9-12, AI 13-16, Skills 17-20
  const calculateSubScore = (start: number, end: number) => {
    let sum = 0;
    for (let i = start; i <= end; i++) {
      const ans = answers[i];
      if (ans && ans.weight) {
        sum += ans.weight;
      }
    }
    // Scale subscore to a max of 20.
    // Each question has a maximum weight of 4.
    const maxWeight = (end - start + 1) * 4;
    return Math.min(20, Math.round((sum / maxWeight) * 20));
  };

  const subScores = {
    tech: calculateSubScore(1, 4),
    logic: calculateSubScore(5, 8),
    innovation: calculateSubScore(9, 12),
    ai: calculateSubScore(13, 16),
    skills: calculateSubScore(17, 20)
  };

  // 2. Custom text depending on categorization
  const getInsights = () => {
    const ctaText = isParent 
      ? `Your child shows strong potential for future-ready skills. Discover how Ruzann can help transform this potential into real-world AI, Coding, Robotics, and Innovation skills through a Live Demo Class for just ₹99.`
      : `You show strong potential for future-ready skills. Discover how Ruzann can help transform this potential into real-world AI, Coding, Robotics, and Innovation skills through a Live Demo Class for just ₹99.`;

    switch (category) {
      case 'Future Innovator':
        return {
          badgeStyle: "bg-gradient-to-r from-emerald-500 to-green-400 text-white shadow-emerald-200/50",
          desc: ctaText,
          strengths: [
            "Outstanding logical comprehension and technological curiosity.",
            "Quick adaptation to new computational systems and frameworks.",
            "Ready to tackle high-level programming structures (Python, AI modeling)."
          ],
          growth: [
            "Introduce advanced AI algorithms and database structures.",
            "Challenge them with real-world coding projects and web/app design.",
            "Provide exposure to mentor-led open ended design hackathons."
          ]
        };
      case 'AI Explorer':
        return {
          badgeStyle: "bg-gradient-to-r from-blue-500 to-cyan-500 text-white shadow-blue-200/50",
          desc: ctaText,
          strengths: [
            "Shows active curiosity about smart assistants and future gadgets.",
            "Great interest in exploring how tech/coding applications function.",
            "Approaches problems systematically with a willingness to learn."
          ],
          growth: [
            "Encourage game development and interactive logic blocks (Scratch/Thunkable).",
            "Introduce foundational coding concepts and prompt structures.",
            "Deepen exposure to robotics systems and physical computing."
          ]
        };
      case 'Creative Problem Solver':
        return {
          badgeStyle: "bg-gradient-to-r from-yellow-500 to-amber-400 text-gray-900 shadow-yellow-200/50",
          desc: ctaText,
          strengths: [
            "Strong imaginative confidence and out-of-the-box thinking.",
            "Persistent with riddles, brain teasers, and puzzles.",
            "Good response to design modifications and logical instruction flow."
          ],
          growth: [
            "Introduce block-coding to organize creative concepts logically.",
            "Encourage step-by-step documentation of their building projects.",
            "Foster technological projects linking logic with design (3D, VR, Scratch)."
          ]
        };
      default: // Future Starter
        return {
          badgeStyle: "bg-gradient-to-r from-red-500 to-rose-500 text-white shadow-red-200/50",
          desc: ctaText,
          strengths: [
            "Good observer and enthusiastic learner when guided.",
            "Excited to explore new apps and tech gadgets when introduced.",
            "Enjoys creative storytelling and basic problem decomposition."
          ],
          growth: [
            "Build logical reasoning patterns via fun, gamified logic challenges.",
            "Develop confidence with digital creator tools rather than just screen viewing.",
            "Explore early coding through block-based visual storytelling games."
          ]
        };
    }
  };

  const insights = getInsights();

  // 3. Recommended Program details
  const getProgramDetails = () => {
    switch (recommendedProgram) {
      case 'AI Explorer Program':
        return {
          ageGroup: "Ages 6 - 9",
          duration: "12 Weeks (24 Sessions)",
          focus: "Scratch coding, block-logic, sequencing, and AI storycraft."
        };
      case 'Future Coder Program':
        return {
          ageGroup: "Ages 10 - 13",
          duration: "16 Weeks (32 Sessions)",
          focus: "App development, game architecture, visual blocks to syntax prep, and basic electronics."
        };
      default: // AI Creator Program
        return {
          ageGroup: "Ages 14 - 18",
          duration: "24 Weeks (48 Sessions)",
          focus: "Core Python, Machine Learning models, databases, web development, and OpenAI APIs."
        };
    }
  };

  const programDetails = getProgramDetails();

  // 4. Trigger ₹99 razorpay order
  const handleBookDemo = async () => {
    const bookingDetails = {
      parentName,
      studentName,
      email: email || `${mobile}@ruzann.com`,
      phone: mobile,
      age: Number(age)
    };
    
    try {
      // Calls standard IntroOfferContext which launches Razorpay checkout
      await handleClaimOffer(bookingDetails);
      // Wait, inside IntroOfferContext on payment success it redirects to '/payment-success'.
      // If we want a local thank-you page instead, we can let it redirect, or override it.
      // But standard payment success goes to `/payment-success` which is great! Let's keep it.
      // However, let's also support going to local state thank-you if preferred or let it redirect.
    } catch (err) {
      console.error("Booking error", err);
    }
  };

  // 5. WhatsApp Message Builders
  const getWhatsAppLink = (type: 'counselor' | 'chat') => {
    const defaultNumber = "919960559894";
    const textPrefix = isParent 
      ? `Hello RUZANN! I just completed the AI Readiness Assessment for my child ${studentName}.` 
      : `Hello RUZANN! I just completed the AI Readiness Assessment.`;
      
    const message = `${textPrefix}
- Score: ${score}/100
- Category: ${category}
- Recommended Program: ${recommendedProgram} (Age Group: ${programDetails.ageGroup})

I'd like to ${type === 'counselor' ? 'speak to a counselor' : 'chat on WhatsApp'} about starting the program.`;
    
    return `https://wa.me/${defaultNumber}?text=${encodeURIComponent(message)}`;
  };

  // SVG Circumference for Overall Score ring
  const strokeRadius = 70;
  const strokeCircumference = 2 * Math.PI * strokeRadius;
  const strokeDashoffset = strokeCircumference - (score / 100) * strokeCircumference;

  return (
    <section className="py-12 md:py-20 px-4 bg-gradient-to-b from-[#f8fafc] to-white flex-1">
      <div className="max-w-4xl mx-auto flex flex-col gap-10">
        
        {/* Main Score Header */}
        <div className="bg-white rounded-3xl border border-gray-100 p-8 shadow-sm flex flex-col md:flex-row items-center gap-8 relative overflow-hidden">
          <div className="absolute top-0 right-0 bg-primary-500/10 text-primary-600 font-baloo font-black text-xs px-4 py-2 rounded-bl-3xl">
            Funnel Diagnostic Report
          </div>

          {/* SVG Score Ring */}
          <div className="relative w-44 h-44 flex items-center justify-center shrink-0">
            <svg className="w-full h-full transform -rotate-90">
              <circle
                cx="88"
                cy="88"
                r={strokeRadius}
                className="stroke-gray-100 fill-none"
                strokeWidth="12"
              />
              <motion.circle
                cx="88"
                cy="88"
                r={strokeRadius}
                className="stroke-[#ef4444] fill-none"
                strokeWidth="12"
                strokeLinecap="round"
                initial={{ strokeDashoffset: strokeCircumference }}
                animate={{ strokeDashoffset }}
                transition={{ duration: 1.2, ease: "easeOut" }}
                style={{ strokeDasharray: strokeCircumference }}
              />
            </svg>
            <div className="absolute flex flex-col items-center">
              <span className="font-baloo font-black text-4xl text-navy-900 leading-none">
                {score}
              </span>
              <span className="text-[10px] font-black text-gray-400 uppercase tracking-widest mt-1">
                Out of 100
              </span>
            </div>
          </div>

          {/* Insights Text */}
          <div className="flex-1 text-center md:text-left">
            <div className={`inline-flex items-center gap-1.5 px-4 py-1.5 rounded-full text-xs font-black uppercase tracking-wider mb-4 shadow-sm ${insights.badgeStyle}`}>
              🏆 {category}
            </div>
            <h2 className="font-baloo font-black text-2xl sm:text-3xl text-navy-900 leading-tight">
              {isParent ? `${studentName}'s` : "Your"} AI Readiness Report Card
            </h2>
            <p className="text-gray-500 font-semibold text-sm mt-3 leading-relaxed">
              {insights.desc}
            </p>
          </div>
        </div>

        {/* Diagnostic Pillar Breakdowns (SVG/HTML Bar Charts) */}
        <div className="bg-white rounded-3xl border border-gray-100 p-6 sm:p-8 shadow-sm">
          <h3 className="font-baloo font-black text-navy-900 text-lg sm:text-xl mb-6 flex items-center gap-2">
            <Sparkles size={20} className="text-[#6C5CE7]" /> Diagnostic Pillars Evaluation
          </h3>

          <div className="flex flex-col gap-5">
            {[
              { label: "Technology Interest", val: subScores.tech, color: "bg-blue-500", key: "tech" },
              { label: "Problem Solving (Logic)", val: subScores.logic, color: "bg-amber-500", key: "logic" },
              { label: "Creativity & Innovation", val: subScores.innovation, color: "bg-pink-500", key: "innovation" },
              { label: "AI Awareness", val: subScores.ai, color: "bg-purple-500", key: "ai" },
              { label: "Future Skills (Soft Skills)", val: subScores.skills, color: "bg-emerald-500", key: "skills" }
            ].map((pillar, idx) => {
              const percentage = Math.round((pillar.val / 20) * 100);
              return (
                <div key={idx} className="flex flex-col gap-2">
                  <div className="flex justify-between items-center text-xs sm:text-sm">
                    <span className="font-bold text-gray-700">{pillar.label}</span>
                    <span className="font-black text-navy-900 font-baloo">{pillar.val}/20 ({percentage}%)</span>
                  </div>
                  {/* Progress Track */}
                  <div className="w-full h-3 rounded-full bg-gray-100 overflow-hidden relative">
                    <motion.div
                      className={`absolute left-0 top-0 h-full ${pillar.color}`}
                      initial={{ width: 0 }}
                      animate={{ width: `${percentage}%` }}
                      transition={{ duration: 1, delay: 0.1 * idx }}
                    />
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Strengths & Growth Areas */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Strengths */}
          <div className="bg-white rounded-3xl border border-gray-100 p-6 sm:p-8 shadow-sm">
            <h3 className="font-baloo font-black text-[#10b981] text-lg sm:text-xl mb-4 flex items-center gap-2">
              <CheckCircle size={20} className="text-[#10b981]" /> Learning Strengths
            </h3>
            <ul className="flex flex-col gap-3">
              {insights.strengths.map((str, idx) => (
                <li key={idx} className="flex gap-2 text-xs sm:text-sm font-semibold text-gray-500 leading-relaxed items-start">
                  <span className="text-[#10b981] text-base shrink-0 mt-0.5">•</span>
                  <span>{str}</span>
                </li>
              ))}
            </ul>
          </div>

          {/* Growth */}
          <div className="bg-white rounded-3xl border border-gray-100 p-6 sm:p-8 shadow-sm">
            <h3 className="font-baloo font-black text-[#f59e0b] text-lg sm:text-xl mb-4 flex items-center gap-2">
              <AlertTriangle size={20} className="text-[#f59e0b]" /> Growth Opportunities
            </h3>
            <ul className="flex flex-col gap-3">
              {insights.growth.map((gro, idx) => (
                <li key={idx} className="flex gap-2 text-xs sm:text-sm font-semibold text-gray-500 leading-relaxed items-start">
                  <span className="text-[#f59e0b] text-base shrink-0 mt-0.5">•</span>
                  <span>{gro}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Recommended Path Card */}
        <div className="bg-gradient-to-br from-[#6b4fbb]/10 to-indigo-500/10 rounded-3xl border-2 border-[#6b4fbb]/30 p-8 shadow-sm flex flex-col md:flex-row items-center justify-between gap-6 relative overflow-hidden">
          <div className="absolute top-0 right-0 bg-[#6b4fbb] text-white font-baloo font-black text-xs px-4 py-2 rounded-bl-3xl">
            Top Recommendation
          </div>

          <div className="flex-1">
            <span className="text-xs font-black text-[#6b4fbb] uppercase tracking-widest block mb-2">
              Learning Pathway
            </span>
            <h3 className="font-baloo font-black text-navy-900 text-2xl mb-1.5 flex items-center gap-2">
              <BookOpen className="text-[#6b4fbb]" /> {recommendedProgram}
            </h3>
            <p className="text-xs font-black text-gray-400 uppercase tracking-wider mb-4">
              🎯 Group: {programDetails.ageGroup} • Duration: {programDetails.duration}
            </p>
            <p className="text-gray-500 font-semibold text-sm leading-relaxed">
              <strong>Curriculum Focus:</strong> {programDetails.focus}
            </p>
          </div>
        </div>

        {/* Conversion CTA Block */}
        <div className="bg-gradient-to-br from-navy-900 to-slate-800 rounded-3xl p-8 sm:p-10 text-white shadow-xl relative overflow-hidden">
          {/* Background overlay details */}
          <div className="absolute top-0 right-0 w-44 h-44 bg-gradient-to-br from-primary-500/20 to-secondary-500/20 rounded-full blur-2xl pointer-events-none" />

          <div className="max-w-2xl text-center md:text-left">
            <h3 className="font-baloo font-black text-2xl sm:text-3xl lg:text-4xl text-white leading-tight">
              {isParent ? `${studentName} Has Potential.` : "You Have Potential."} Let's Help {isParent ? "Them" : "You"} Unlock It.
            </h3>
            <p className="text-slate-300 font-bold text-sm sm:text-base mt-4 leading-relaxed">
              Book a live 1-on-1 trial session where they can experience:
            </p>

            <ul className="grid grid-cols-1 sm:grid-cols-2 gap-3 mt-6 text-sm text-slate-200">
              {["Live Mentor-Led Session", "AI & Robotics Activities", "Interactive Coding Projects", "Future Skills Learning Path", "Personalized Report Guidance"].map((feat, idx) => (
                <li key={idx} className="flex gap-2.5 items-center font-bold">
                  <CheckCircle size={16} className="text-[#EF4444] fill-current text-white shrink-0" />
                  <span>{feat}</span>
                </li>
              ))}
            </ul>
          </div>

          {/* Pricing & CTA Card */}
          <div className="mt-10 bg-white/5 backdrop-blur-md rounded-2xl p-6 sm:p-8 border border-white/10 flex flex-col md:flex-row items-center justify-between gap-6">
            <div>
              <span className="text-xs font-black text-[#EF4444] uppercase tracking-widest block mb-1">
                LIMITED OFFER OFFERED DIRECTLY
              </span>
              <h4 className="font-baloo font-black text-xl text-white">
                🎓 Live Demo Class – {formatPrice(99)} Only
              </h4>
              <p className="text-xs font-bold text-slate-400 mt-1">
                Schedule a convenient hour slot with an expert teacher.
              </p>
            </div>

            <div className="flex flex-col sm:flex-row w-full md:w-auto gap-3 shrink-0">
              <button
                onClick={handleBookDemo}
                disabled={isProcessing}
                className="px-6 py-4 rounded-xl bg-[#EF4444] hover:bg-[#DC2626] disabled:opacity-70 text-white font-black text-sm uppercase tracking-wider text-center flex items-center justify-center gap-2 shadow-lg shadow-[#EF444420] transition-all hover:scale-103 cursor-pointer"
              >
                {isProcessing ? (
                  <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                ) : (
                  <>
                    <Calendar size={16} /> Book Live Demo – {formatPrice(99)}
                  </>
                )}
              </button>
              
              <a
                href={getWhatsAppLink('counselor')}
                target="_blank"
                rel="noreferrer"
                className="px-6 py-4 rounded-xl border border-white/20 hover:bg-white/10 text-white font-black text-sm uppercase tracking-wider text-center flex items-center justify-center gap-2 transition-colors cursor-pointer"
              >
                <Phone size={16} /> Talk to Counselor
              </a>

              <a
                href={getWhatsAppLink('chat')}
                target="_blank"
                rel="noreferrer"
                className="px-4 py-4 rounded-xl bg-[#25D366] hover:bg-[#20BA5A] text-white font-black text-sm uppercase tracking-wider text-center flex items-center justify-center gap-2 shadow-md transition-colors cursor-pointer"
              >
                <MessageSquare size={16} /> WhatsApp Chat
              </a>
            </div>
          </div>
        </div>

        {/* Retake Button */}
        <div className="flex justify-center mt-6">
          <button
            onClick={onRetake}
            className="px-6 py-3 rounded-xl border-2 border-gray-200 hover:border-gray-300 text-gray-500 hover:text-gray-700 font-black text-xs uppercase tracking-widest inline-flex items-center gap-2 transition-all cursor-pointer"
          >
            <RefreshCw size={12} /> Retake Assessment
          </button>
        </div>

      </div>
    </section>
  );
}
