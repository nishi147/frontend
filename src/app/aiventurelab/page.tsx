"use client";

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import { Header } from '@/components/layout/Header';
import { Footer } from '@/components/layout/Footer';
import { useToast } from '@/context/ToastContext';
import { useCurrency } from '@/context/CurrencyContext';
import api from '@/utils/api';
import {
  trackAddToCart,
  trackInitiateCheckout,
  trackPurchase,
  trackEvent,
  trackViewContent,
  trackLead
} from '@/utils/analytics';
import {
  Sparkles,
  Award,
  CheckCircle2,
  Zap,
  Users,
  Clock,
  Star,
  Video,
  Gift,
  ArrowRight,
  Lock,
  ChevronDown,
  Briefcase,
  HeartHandshake,
  X,
  Flame,
  BadgeCheck,
  Check,
  Calendar,
  Globe,
  Tag,
  ShieldCheck,
  Loader2,
  XCircle,
  TrendingUp,
  Cpu,
  Layers,
  Bot,
  Compass,
  Rocket,
  MessageSquare,
  Layout,
  BarChart3,
  Database,
  Share2,
  HelpCircle,
  ArrowUpRight,
  Play
} from 'lucide-react';

export default function AIVentureLabPage() {
  const router = useRouter();
  const { showToast } = useToast();
  const { currency, formatPrice } = useCurrency();

  const [isRegModalOpen, setIsRegModalOpen] = useState(false);
  const [openFaq, setOpenFaq] = useState<number | null>(0);
  const [splitScreenTab, setSplitScreenTab] = useState<'current' | 'future'>('future');
  const [activeRoadmapWeek, setActiveRoadmapWeek] = useState<number>(1);

  // Registration Form State
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    role: 'Women Entrepreneur',
    businessName: '',
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Load Razorpay script
  useEffect(() => {
    const script = document.createElement('script');
    script.src = 'https://checkout.razorpay.com/v1/checkout.js';
    script.async = true;
    document.body.appendChild(script);

    return () => {
      if (document.body.contains(script)) {
        document.body.removeChild(script);
      }
    };
  }, []);

  // Track Meta Pixel ViewContent event on page view
  useEffect(() => {
    trackViewContent({
      content_name: 'AI Venture Lab LIVE Webinar',
      content_category: 'Webinar',
      content_ids: ['aiventurelab_99'],
      content_type: 'product',
      value: 99,
      currency: currency || 'INR'
    });
  }, [currency]);

  const openBookingModal = () => {
    setIsRegModalOpen(true);
    trackAddToCart({
      content_name: 'AI Venture Lab LIVE Webinar',
      content_category: 'Webinar',
      content_ids: ['aiventurelab_99'],
      content_type: 'product',
      value: 99,
      currency: currency || 'INR'
    });
  };

  const handleRegistrationSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name || !formData.email || !formData.phone) {
      showToast('Please fill out all required fields.', 'error');
      return;
    }

    setIsSubmitting(true);

    trackLead({
      content_name: 'AI Venture Lab LIVE Webinar',
      value: 99,
      currency: currency || 'INR',
      role: formData.role
    });

    try {
      const orderRes = await api.post('/api/payments/intro-order', {
        currency: currency || 'INR'
      });

      if (!orderRes.data.success || !orderRes.data.data) {
        throw new Error(orderRes.data.message || 'Failed to create order');
      }

      const order = orderRes.data.data;

      trackInitiateCheckout({
        content_name: 'AI Venture Lab LIVE Webinar',
        num_items: 1,
        value: 99,
        currency: currency || 'INR'
      });

      const options = {
        key: process.env.NEXT_PUBLIC_RAZORPAY_KEY || 'rzp_live_SQl3GLrpIJFRGe',
        amount: order.amount,
        currency: order.currency || 'INR',
        name: "RUZANN",
        description: "AI Venture Lab LIVE Webinar Seat (₹99)",
        order_id: order.id,
        prefill: {
          name: formData.name,
          email: formData.email,
          contact: formData.phone
        },
        theme: {
          color: "#2563EB"
        },
        handler: async function (response: any) {
          try {
            const verifyRes = await api.post('/api/payments/intro-verify', {
              razorpay_order_id: response.razorpay_order_id,
              razorpay_payment_id: response.razorpay_payment_id,
              razorpay_signature: response.razorpay_signature,
              studentName: formData.name,
              parentName: formData.businessName || formData.name,
              email: formData.email,
              phone: formData.phone,
              role: formData.role,
              programName: 'AI Venture Lab LIVE Webinar',
              isAIVentureLab: true,
              age: 25
            });

            if (verifyRes.data.success) {
              const purchaseData = {
                value: 99,
                currency: currency || 'INR',
                content_name: 'AI Venture Lab LIVE Webinar',
                content_ids: ['aiventurelab_99'],
                content_type: 'product',
                transaction_id: response.razorpay_payment_id
              };

              trackPurchase(purchaseData);
              trackEvent('aiventurelab_payment_success', {
                amount: 99,
                email: formData.email,
                payment_id: response.razorpay_payment_id
              });

              showToast("Seat confirmed! Welcome to Ruzann AI Venture Lab.", "success");
              setIsRegModalOpen(false);
              router.push(`/payment-success?tx=${response.razorpay_payment_id}&amount=99&title=${encodeURIComponent('AI Venture Lab LIVE Webinar')}`);
            } else {
              showToast("Payment verification failed. Please contact support.", "error");
            }
          } catch (err: any) {
            console.error("Verification error:", err);
            showToast("Payment verification failed. Please contact support.", "error");
          }
        },
        modal: {
          ondismiss: function () {
            setIsSubmitting(false);
            showToast("Payment cancelled. You can retry anytime.", "info");
          }
        }
      };

      if (typeof window !== 'undefined' && (window as any).Razorpay) {
        const rzp = new (window as any).Razorpay(options);
        rzp.open();
      } else {
        throw new Error("Razorpay SDK unavailable. Please check your internet connection.");
      }
    } catch (err: any) {
      console.error("Order creation error:", err);
      showToast(err.response?.data?.message || err.message || "Failed to launch payment gateway", "error");
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#0c142a] text-slate-100 font-sans selection:bg-[#2363f1] selection:text-white pb-20 lg:pb-0 overflow-x-hidden">
      {/* 0. STICKY TOP URGENCY BANNER */}
      <div className="bg-[#0c142a] border-b border-[#1ad8ea]/20 text-white py-2.5 px-4 text-center text-xs font-semibold sticky top-0 z-50 backdrop-blur-xl flex items-center justify-center gap-3">
        <span className="flex items-center gap-1 bg-[#1e2842] text-[#1ad8ea] px-2.5 py-0.5 rounded-full text-[11px] font-bold border border-[#1ad8ea]/30 animate-pulse">
          <Flame size={12} className="text-[#f9be3e] fill-[#f9be3e]" /> LIVE BATCH
        </span>
        <span className="hidden md:inline-block bg-[#f9be3e] text-[#0c142a] px-2.5 py-0.5 rounded text-[10px] font-black uppercase tracking-wider">
          Special ₹99 Webinar Pass
        </span>
        <button
          onClick={openBookingModal}
          className="ml-2 underline text-[#1ad8ea] hover:text-white font-bold text-xs hidden sm:inline"
        >
          Claim Seat &rarr;
        </button>
      </div>

      <Header />

      {/* 1. FULL-SCREEN HERO SECTION — CROSSING THE BRIDGE */}
      <section className="relative min-h-[92vh] pt-12 pb-20 px-4 md:px-8 flex flex-col justify-center items-center overflow-hidden bg-[#0c142a]">
        {/* Glowing Ambient Light Orbs */}
        <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[700px] h-[400px] bg-[#2363f1]/20 rounded-full blur-[160px] pointer-events-none" />
        <div className="absolute top-1/3 left-1/4 w-[350px] h-[350px] bg-[#1ad8ea]/15 rounded-full blur-[140px] pointer-events-none" />
        <div className="absolute bottom-10 right-1/4 w-[400px] h-[400px] bg-[#2363f1]/15 rounded-full blur-[160px] pointer-events-none" />

        {/* Futuristic Illuminated Bridge Canvas (SVG Graphic) */}
        <div className="absolute inset-0 pointer-events-none flex items-center justify-center opacity-30">
          <svg className="w-full h-full max-w-6xl" viewBox="0 0 1200 600" fill="none" xmlns="http://www.w3.org/2000/svg">
            <defs>
              <linearGradient id="bridgeGrad" x1="0%" y1="50%" x2="100%" y2="50%">
                <stop offset="0%" stopColor="#2363f1" stopOpacity="0.2" />
                <stop offset="50%" stopColor="#1ad8ea" stopOpacity="0.9" />
                <stop offset="100%" stopColor="#f9be3e" stopOpacity="0.9" />
              </linearGradient>
            </defs>

            {/* Left Bank — Dark & Uncertain */}
            <path d="M 0,450 Q 200,430 350,480 L 350,600 L 0,600 Z" fill="#1e2842" opacity="0.6" />
            <circle cx="150" cy="450" r="8" fill="#64748B" />
            <text x="100" y="490" fill="#94A3B8" fontSize="14" fontFamily="Inter" fontWeight="600">The Uncertain Side</text>

            {/* Right Bank — Radiant AI Future City */}
            <path d="M 850,480 Q 1000,430 1200,450 L 1200,600 L 850,600 Z" fill="#1e2842" opacity="0.8" />
            <circle cx="1050" cy="450" r="12" fill="#f9be3e" />
            <text x="1000" y="490" fill="#f9be3e" fontSize="14" fontFamily="Inter" fontWeight="700">AI Powered Future</text>

            {/* The Illuminated Cyber Bridge */}
            <path d="M 150,450 Q 600,280 1050,450" stroke="url(#bridgeGrad)" strokeWidth="6" strokeLinecap="round" />
            <path d="M 150,455 Q 600,285 1050,455" stroke="#1ad8ea" strokeWidth="2" strokeDasharray="8 8" opacity="0.8" />

            {/* Bridge Support Pillars */}
            <line x1="400" y1="360" x2="400" y2="580" stroke="#334155" strokeWidth="2" opacity="0.5" />
            <line x1="800" y1="360" x2="800" y2="580" stroke="#334155" strokeWidth="2" opacity="0.5" />
          </svg>
        </div>

        <div className="container mx-auto max-w-6xl relative z-10 text-center space-y-8">
          {/* Badge */}
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="inline-flex items-center gap-2 bg-[#1e2842]/80 border border-[#1ad8ea]/30 px-4 py-2 rounded-full text-[#1ad8ea] font-medium text-xs md:text-sm backdrop-blur-xl shadow-xl shadow-[#1ad8ea]/10"
          >
            <Sparkles size={16} className="text-[#f9be3e] animate-spin-slow" />
            <span>RUZANN AI VENTURE LAB · LIVE WEBINAR</span>
          </motion.div>

          {/* Main Headline */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="max-w-4xl mx-auto space-y-4"
          >
            <h1 className="text-3xl sm:text-5xl md:text-6xl lg:text-7xl font-black text-white tracking-tight leading-[1.1]">
              Every Dream Has <span className="bg-gradient-to-r from-[#1ad8ea] via-[#2363f1] to-[#f9be3e] bg-clip-text text-transparent">Two Sides.</span>
            </h1>
            <p className="text-slate-300 text-sm sm:text-lg md:text-xl font-normal leading-relaxed max-w-3xl mx-auto">
              On one side — <span className="text-slate-400 font-semibold">Dreams. Ideas. Potential.</span><br className="hidden sm:inline" />
              On the other — <span className="text-white font-bold">Customers. Income. Freedom.</span>
            </p>
            <p className="text-slate-400 text-xs sm:text-base font-medium">
              The distance between them isn&apos;t luck — <strong className="text-white">It&apos;s knowing <span className="text-[#f9be3e]">which bridge to cross.</span></strong>
            </p>
          </motion.div>

          {/* CTA Box */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.8, delay: 0.4 }}
            className="pt-2 flex flex-col items-center gap-4 max-w-md mx-auto"
          >
            <button
              onClick={openBookingModal}
              className="w-full bg-gradient-to-r from-[#2363f1] to-[#1ad8ea] hover:from-[#1ad8ea] hover:to-[#2363f1] text-[#0c142a] font-black text-base sm:text-lg py-4.5 px-8 rounded-full shadow-[0_10px_30px_-10px_rgba(35,99,241,0.6)] hover:shadow-[0_15px_35px_-5px_rgba(26,216,234,0.7)] transition-all transform hover:-translate-y-1 active:translate-y-0 flex items-center justify-center gap-3 group"
            >
              <span>Reserve My Seat</span>
              <ArrowRight size={20} className="group-hover:translate-x-1 transition-transform" />
            </button>

            <div className="flex items-center gap-2 text-xs font-medium">
              <span className="text-[#f9be3e] font-bold">₹99 Only</span>
              <span className="text-slate-500">•</span>
              <span className="text-slate-300">LIVE Online Webinar</span>
            </div>
          </motion.div>

          {/* Floating Glass Metaphor Cards */}
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1, delay: 0.6 }}
            className="pt-8 grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3 max-w-5xl mx-auto"
          >
            {[
              { icon: Cpu, label: "AI Tools", desc: "No Coding Needed" },
              { icon: Briefcase, label: "AI Business", desc: "Idea to Launch" },
              { icon: Rocket, label: "Marketing", desc: "Automated Ads" },
              { icon: Bot, label: "Automation", desc: "24/7 AI Agents" },
              { icon: Users, label: "Customers", desc: "Predictable Leads" },
              { icon: TrendingUp, label: "Income", desc: "Scalable Freedom" },
            ].map((item, idx) => (
              <div
                key={idx}
                className="bg-[#1e2842]/60 border border-white/10 hover:border-[#1ad8ea]/40 rounded-2xl p-4 text-center backdrop-blur-xl transition-all hover:-translate-y-1 group shadow-lg"
              >
                <div className="w-10 h-10 rounded-xl bg-[#2363f1]/15 border border-[#2363f1]/30 text-[#1ad8ea] flex items-center justify-center mx-auto mb-2.5 group-hover:scale-110 transition-transform">
                  <item.icon size={20} />
                </div>
                <h4 className="text-xs font-bold text-white group-hover:text-[#1ad8ea] transition-colors">{item.label}</h4>
                <p className="text-[10px] text-slate-400 mt-0.5">{item.desc}</p>
              </div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* 2. SECTION 2: THE WORLD HAS CHANGED (LIGHT SLATE SECTION) */}
      <section className="py-24 px-4 md:px-8 bg-[#f8fafc] text-slate-900 border-t border-slate-200 relative overflow-hidden">
        <div className="container mx-auto max-w-5xl space-y-12 relative z-10">
          <div className="text-center max-w-3xl mx-auto space-y-3">
            <span className="text-xs font-bold uppercase tracking-widest text-[#2363f1] font-mono">
              THE WORLD HAS CHANGED
            </span>
            <h2 className="text-3xl sm:text-5xl font-black text-[#0c142a] tracking-tight leading-tight">
              Three times in history, the ground moved. <span className="text-slate-500 font-bold">This is the third.</span>
            </h2>
            <p className="text-slate-600 text-sm md:text-base max-w-2xl mx-auto">
              Every major shift creates a new class of leaders. Those who cross the technological bridge early build generational wealth.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 relative">
            {/* Connecting line */}
            <div className="hidden md:block absolute top-1/2 left-10 right-10 h-0.5 bg-gradient-to-r from-slate-300 via-[#2363f1] to-[#1ad8ea] -translate-y-12 z-0" />

            {/* Timeline Item 1 */}
            <div className="bg-white border border-slate-200/90 rounded-3xl p-7 relative z-10 space-y-4 hover:shadow-xl transition-all shadow-lg shadow-slate-200/50">
              <div className="inline-flex items-center justify-center px-3.5 py-1.5 rounded-xl bg-slate-100 text-slate-700 border border-slate-300 font-mono font-bold text-xs whitespace-nowrap shadow-sm">
                1760
              </div>
              <h3 className="text-xl font-black text-[#0c142a]">Industrial Revolution</h3>
              <p className="text-xs text-slate-600 leading-relaxed">
                Machines replaced muscle. Those who embraced factories built industries; those who resisted lost relevance.
              </p>
              <div className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider">Era of Physical Power</div>
            </div>

            {/* Timeline Item 2 */}
            <div className="bg-white border border-slate-200/90 rounded-3xl p-7 relative z-10 space-y-4 hover:shadow-xl transition-all shadow-lg shadow-slate-200/50">
              <div className="inline-flex items-center justify-center px-3.5 py-1.5 rounded-xl bg-blue-50 text-[#2363f1] border border-blue-200 font-mono font-bold text-xs whitespace-nowrap shadow-sm">
                1995
              </div>
              <h3 className="text-xl font-black text-[#0c142a]">Internet Revolution</h3>
              <p className="text-xs text-slate-600 leading-relaxed">
                Information replaced distance. Digital pioneers created global empires from scratch.
              </p>
              <div className="text-[11px] font-semibold text-[#2363f1] uppercase tracking-wider">Era of Digital Connectivity</div>
            </div>

            {/* Timeline Item 3 — Highlighting TODAY */}
            <div className="bg-gradient-to-b from-blue-50/80 via-white to-white border-2 border-[#1ad8ea] rounded-3xl p-7 relative z-10 space-y-4 shadow-xl shadow-[#2363f1]/15">
              <div className="inline-flex items-center gap-1.5 bg-[#f9be3e] text-[#0c142a] text-[10px] font-black uppercase px-3 py-1 rounded-full absolute -top-3 right-6 shadow-md">
                HAPPENING NOW
              </div>
              <div className="inline-flex items-center justify-center px-3.5 py-1.5 rounded-xl bg-[#1ad8ea] text-[#0c142a] font-mono font-black text-xs whitespace-nowrap shadow-md shadow-[#1ad8ea]/30">
                Now
              </div>
              <h3 className="text-xl font-black text-[#0c142a]">AI Revolution</h3>
              <p className="text-xs text-slate-700 leading-relaxed">
                Intelligence replaces effort. One person with AI can now out-execute a 10-person agency.
              </p>
              <div className="text-[11px] font-bold text-[#2363f1] uppercase tracking-wider flex items-center gap-1">
                <span>The people who learn AI today will lead tomorrow</span> &rarr;
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 3. SECTION 3: WHAT YOU'LL LEARN (LIGHT SLATE SECTION) */}
      <section className="py-24 px-4 md:px-8 bg-[#f1f5f9] text-slate-900 border-t border-slate-200 relative">
        <div className="container mx-auto max-w-6xl space-y-16">
          <div className="text-center max-w-3xl mx-auto space-y-3">
            <span className="text-xs font-bold uppercase tracking-widest text-[#2363f1] font-mono">
              SIX MILESTONES ON THE BRIDGE
            </span>
            <h2 className="text-3xl sm:text-5xl font-black text-[#0c142a] tracking-tight">
              Milestones On Your Bridge To AI Success
            </h2>
            <p className="text-slate-600 text-sm md:text-base">
              In this {formatPrice(99)} LIVE Webinar, we walk you through the 6 vital checkpoints needed to cross from uncertainty to an active AI business.
            </p>
          </div>

          {/* Milestone Cards Grid */}
          <div className="grid grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6">
            {[
              {
                num: "01",
                title: "AI Opportunity",
                desc: "Where the real money is moving in the AI economy right now.",
                icon: Compass,
              },
              {
                num: "02",
                title: "Business Ideas",
                desc: "Find the one idea that fits your skill and market seamlessly.",
                icon: Zap,
              },
              {
                num: "03",
                title: "Marketing Engine",
                desc: "Get seen, get trusted, get customers — powered with AI.",
                icon: Rocket,
              },
              {
                num: "04",
                title: "Automation",
                desc: "Let intelligent 24/7 systems do the operational work while you sleep.",
                icon: Bot,
              },
              {
                num: "05",
                title: "Business Roadmap",
                desc: "A step-by-step path from zero to fully launched digital brand.",
                icon: Layers,
              },
              {
                num: "06",
                title: "The Lab Transformation",
                desc: "How AI Venture Lab turns beginners into thriving AI entrepreneurs.",
                icon: Trophy,
              }
            ].map((m, idx) => (
              <div
                key={idx}
                className="bg-white border border-slate-200/80 hover:border-[#2363f1]/40 rounded-3xl p-5 md:p-7 space-y-4 hover:-translate-y-1 transition-all group shadow-lg shadow-slate-200/50 flex flex-col justify-between"
              >
                <div className="flex items-center justify-between">
                  <span className="text-2xl md:text-3xl font-black font-mono text-slate-300 group-hover:text-[#2363f1] transition-colors">{m.num}</span>
                  <div className="w-10 h-10 rounded-xl bg-[#2363f1]/10 text-[#2363f1] flex items-center justify-center shadow-sm">
                    <m.icon size={20} />
                  </div>
                </div>
                <div>
                  <h3 className="text-base md:text-xl font-black text-[#0c142a] group-hover:text-[#2363f1] transition-colors leading-tight mb-1.5">{m.title}</h3>
                  <p className="text-xs text-slate-600 leading-relaxed">{m.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 4. SECTION 4: BEFORE VS AFTER (DARK INK SECTION) */}
      <section className="py-24 px-4 md:px-8 bg-[#0c142a] text-white border-t border-slate-800">
        <div className="container mx-auto max-w-6xl space-y-12">
          <div className="text-center max-w-3xl mx-auto space-y-3">
            <span className="text-xs font-bold uppercase tracking-widest text-[#1ad8ea] font-mono">
              BEFORE VS AFTER TRANSFORMATION
            </span>
            <h2 className="text-3xl sm:text-5xl font-black text-white tracking-tight">
              Same person. <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#1ad8ea] to-[#2363f1]">Different side of the bridge.</span>
            </h2>
            <p className="text-slate-400 text-sm md:text-base">
              Which side of the bridge will you be standing on 60 days from now?
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-8">
            {/* Left Column — Today (Before) */}
            <div className="bg-[#1e2842]/50 border border-slate-700/60 rounded-3xl p-6 md:p-8 space-y-6">
              <div className="flex items-center gap-3 border-b border-slate-700/60 pb-4">
                <div className="w-10 h-10 rounded-xl bg-rose-500/10 text-rose-400 flex items-center justify-center font-bold">
                  <XCircle size={20} />
                </div>
                <div>
                  <h3 className="text-xl font-black text-white">Today</h3>
                  <span className="text-xs text-slate-400 font-medium">Before Crossing</span>
                </div>
              </div>

              <ul className="space-y-4 text-sm text-slate-300">
                <li className="flex items-center gap-3">
                  <XCircle size={18} className="text-rose-400 shrink-0" />
                  <span>Confusion & Overwhelm</span>
                </li>
                <li className="flex items-center gap-3">
                  <XCircle size={18} className="text-rose-400 shrink-0" />
                  <span>No Customers</span>
                </li>
                <li className="flex items-center gap-3">
                  <XCircle size={18} className="text-rose-400 shrink-0" />
                  <span>Manual Exhausting Work</span>
                </li>
                <li className="flex items-center gap-3">
                  <XCircle size={18} className="text-rose-400 shrink-0" />
                  <span>No Active Business</span>
                </li>
              </ul>
            </div>

            {/* Right Column — Day 60 (After) */}
            <div className="bg-gradient-to-br from-[#1e2842] via-[#0c142a] to-[#2363f1]/20 border-2 border-[#1ad8ea]/60 rounded-3xl p-6 md:p-8 space-y-6 shadow-2xl shadow-[#2363f1]/20">
              <div className="flex items-center gap-3 border-b border-slate-700/60 pb-4">
                <div className="w-10 h-10 rounded-xl bg-[#1ad8ea]/20 text-[#1ad8ea] flex items-center justify-center font-bold">
                  <CheckCircle2 size={20} />
                </div>
                <div>
                  <h3 className="text-xl font-black text-white">Day 60</h3>
                  <span className="text-xs text-[#1ad8ea] font-semibold">Across The Bridge</span>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4 text-sm text-slate-100">
                <div className="flex items-center gap-2.5">
                  <CheckCircle2 size={18} className="text-[#1ad8ea] shrink-0" />
                  <span className="font-bold">Website</span>
                </div>
                <div className="flex items-center gap-2.5">
                  <CheckCircle2 size={18} className="text-[#1ad8ea] shrink-0" />
                  <span className="font-bold">Brand</span>
                </div>
                <div className="flex items-center gap-2.5">
                  <CheckCircle2 size={18} className="text-[#1ad8ea] shrink-0" />
                  <span className="font-bold">WhatsApp Business</span>
                </div>
                <div className="flex items-center gap-2.5">
                  <CheckCircle2 size={18} className="text-[#1ad8ea] shrink-0" />
                  <span className="font-bold">Customers</span>
                </div>
                <div className="flex items-center gap-2.5">
                  <CheckCircle2 size={18} className="text-[#1ad8ea] shrink-0" />
                  <span className="font-bold">Income</span>
                </div>
                <div className="flex items-center gap-2.5">
                  <CheckCircle2 size={18} className="text-[#1ad8ea] shrink-0" />
                  <span className="font-bold">Marketing</span>
                </div>
                <div className="flex items-center gap-2.5 col-span-2">
                  <CheckCircle2 size={18} className="text-[#1ad8ea] shrink-0" />
                  <span className="font-bold">24/7 AI Automation</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 5. SECTION 5: AI VENTURE LAB 8-WEEK JOURNEY (LIGHT SLATE SECTION) */}
      <section className="py-24 px-4 md:px-8 bg-[#f8fafc] text-slate-900 border-t border-slate-200 relative">
        <div className="container mx-auto max-w-6xl space-y-16">
          <div className="text-center max-w-3xl mx-auto space-y-3">
            <span className="text-xs font-bold uppercase tracking-widest text-[#2363f1] font-mono">
              THE FULL TRANSFORMATION
            </span>
            <h2 className="text-3xl sm:text-5xl font-black text-[#0c142a] tracking-tight">
              The 8-Week AI Venture Lab Journey
            </h2>
            <p className="text-slate-600 text-sm md:text-base">
              The ₹99 webinar opens the door. The complete 8-Week AI Venture Lab ({formatPrice(10999)}) takes you step-by-step all the way across the bridge.
            </p>
          </div>

          {/* 8-Week Roadmap */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 md:gap-4">
            {[
              { week: "Week 1", title: "Business Discovery", desc: "Identify & validate your high-profit AI business niche." },
              { week: "Week 2", title: "Brand Building", desc: "Generate logos, color schemes & brand assets using AI." },
              { week: "Week 3", title: "AI Content Engine", desc: "Build automated social media, copy & video creation workflows." },
              { week: "Week 4", title: "Website + WhatsApp", desc: "Deploy your zero-code website & WhatsApp API lead funnel." },
              { week: "Week 5", title: "Performance Marketing", desc: "Launch high-converting Meta & Google ad campaigns." },
              { week: "Week 6", title: "Workflow Automation", desc: "Integrate custom AI Chatbots & automated CRM sequences." },
              { week: "Week 7", title: "Scaling Operations", desc: "Systematize client delivery & recursive income streams." },
              { week: "Week 8", title: "Official Business Launch", desc: "Graduation, live market launch & alumni network showcase." },
            ].map((w, idx) => (
              <div
                key={idx}
                onClick={() => setActiveRoadmapWeek(idx + 1)}
                className={`cursor-pointer rounded-2xl p-4 md:p-5 border transition-all ${
                  activeRoadmapWeek === idx + 1
                    ? 'bg-[#0c142a] text-white border-2 border-[#1ad8ea] shadow-xl shadow-[#2363f1]/15'
                    : 'bg-white text-slate-900 border-slate-200/90 hover:border-[#2363f1] shadow-sm'
                }`}
              >
                <div className="flex items-center justify-between mb-2 md:mb-3">
                  <span className={`text-[10px] md:text-[11px] font-black uppercase tracking-wider px-2 py-0.5 rounded-full border ${
                    activeRoadmapWeek === idx + 1
                      ? 'bg-[#1ad8ea]/20 text-[#1ad8ea] border-[#1ad8ea]/40'
                      : 'bg-blue-50 text-[#2363f1] border-blue-200'
                  }`}>
                    {w.week}
                  </span>
                  <Sparkles size={14} className={activeRoadmapWeek === idx + 1 ? 'text-[#f9be3e]' : 'text-slate-400'} />
                </div>
                <h4 className={`text-xs sm:text-base font-bold mb-1 leading-tight ${activeRoadmapWeek === idx + 1 ? 'text-white' : 'text-[#0c142a]'}`}>{w.title}</h4>
                <p className={`text-[10px] md:text-xs leading-relaxed line-clamp-2 md:line-clamp-none ${activeRoadmapWeek === idx + 1 ? 'text-slate-300' : 'text-slate-600'}`}>{w.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 6. SECTION 6: WHAT YOU'LL BUILD (LIGHT SLATE SECTION) */}
      <section className="py-24 px-4 md:px-8 bg-[#f1f5f9] text-slate-900 border-t border-slate-200">
        <div className="container mx-auto max-w-6xl space-y-16">
          <div className="text-center max-w-3xl mx-auto space-y-3">
            <span className="text-xs font-bold uppercase tracking-widest text-[#2363f1] font-mono">
              TANGIBLE ASSETS PRODUCED
            </span>
            <h2 className="text-3xl sm:text-5xl font-black text-[#0c142a] tracking-tight">
              What You Will Build During The Program
            </h2>
            <p className="text-slate-600 text-sm md:text-base">
              You won&apos;t just learn theory. You will build and deploy 12 concrete assets for your business.
            </p>
          </div>

          {/* 12 Build Cards */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 md:gap-4">
            {[
              { name: "1. Business Idea & Strategy", icon: Compass },
              { name: "2. Complete Brand Identity", icon: Sparkles },
              { name: "3. High-Converting Landing Page", icon: Layout },
              { name: "4. Live Website & Storefront", icon: Globe },
              { name: "5. WhatsApp Business Suite", icon: MessageSquare },
              { name: "6. Instagram Content Engine", icon: Share2 },
              { name: "7. Facebook Ad Campaign Setup", icon: BarChart3 },
              { name: "8. 24/7 AI Lead Chatbot", icon: Bot },
              { name: "9. Omnichannel Marketing Plan", icon: Rocket },
              { name: "10. Meta Ads Funnel Architecture", icon: TrendingUp },
              { name: "11. Automated Customer Database", icon: Database },
              { name: "12. Official Business Market Launch", icon: Trophy },
            ].map((card, idx) => (
              <div
                key={idx}
                className="bg-white border border-slate-200/90 hover:border-[#2363f1]/40 rounded-2xl p-4 flex items-center gap-3 transition-all hover:-translate-y-1 shadow-md shadow-slate-200/40"
              >
                <div className="w-9 h-9 rounded-xl bg-[#2363f1]/10 text-[#2363f1] flex items-center justify-center shrink-0 border border-[#2363f1]/20">
                  <card.icon size={18} />
                </div>
                <span className="text-xs font-bold text-[#0c142a] leading-tight">{card.name}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 7. SECTION 7: LUXURY BONUS SECTION (DARK INK + GOLDEN GLOW) */}
      <section className="py-24 px-4 md:px-8 bg-[#0c142a] text-white relative overflow-hidden border-y border-slate-800">
        {/* Golden Ambient Glow */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[350px] bg-[#f9be3e]/10 rounded-full blur-[160px] pointer-events-none" />

        <div className="container mx-auto max-w-5xl space-y-12 relative z-10">
          <div className="text-center max-w-3xl mx-auto space-y-3">
            <span className="bg-[#f9be3e]/10 text-[#f9be3e] border border-[#f9be3e]/30 px-3.5 py-1 rounded-full text-xs font-bold uppercase tracking-wider inline-flex items-center gap-1.5 shadow-md">
              <Gift size={14} className="text-[#f9be3e]" /> EXCLUSIVE ENROLLMENT BONUSES
            </span>
            <h2 className="text-3xl sm:text-5xl font-black text-white tracking-tight">
              The value stack you cross with.
            </h2>
          </div>

          {/* HERO BONUS CARD — WHATSAPP API */}
          <div className="bg-gradient-to-r from-[#1e2842] via-[#0c142a] to-[#1e2842] border-2 border-[#f9be3e]/60 rounded-3xl p-6 md:p-10 shadow-2xl shadow-[#f9be3e]/10 relative overflow-hidden">
            <div className="absolute top-0 right-0 bg-[#f9be3e] text-[#0c142a] font-black text-xs px-4 py-1.5 rounded-bl-2xl uppercase tracking-wider shadow-lg">
              Hero Bonus
            </div>

            <div className="grid grid-cols-1 md:grid-cols-12 gap-8 items-center">
              <div className="md:col-span-8 space-y-4">
                <div className="inline-flex items-center gap-2 bg-emerald-500/20 text-emerald-300 px-3 py-1 rounded-full text-xs font-bold border border-emerald-400/30">
                  <CheckCircle2 size={14} /> FREE 12 Months Access
                </div>
                <h3 className="text-2xl md:text-4xl font-black text-white leading-tight">
                  FREE 12 Months WhatsApp Business API Access
                </h3>
                <p className="text-xs md:text-sm text-slate-300 leading-relaxed">
                  Automated conversations, broadcast campaigns and a real customer pipeline — running from day one.
                </p>
              </div>

              <div className="md:col-span-4 text-center bg-[#0c142a]/90 border border-[#f9be3e]/40 rounded-2xl p-6 space-y-2">
                <div className="text-slate-400 text-xs font-bold uppercase tracking-wider">Worth</div>
                <div className="text-[#f9be3e] font-black text-3xl md:text-4xl">{formatPrice(25000)}</div>
                <span className="text-[10px] text-slate-400 block font-semibold uppercase tracking-wider">Included Free</span>
              </div>
            </div>
          </div>

          {/* ADDITIONAL BONUS STACK */}
          <div className="grid grid-cols-2 lg:grid-cols-3 gap-3 md:gap-4">
            {[
              { title: "40+ AI Tools", desc: "Curated stack for every business function." },
              { title: "Prompt Library", desc: "Battle-tested prompts you can reuse daily." },
              { title: "Business Templates", desc: "Contracts, offers, funnels, pitch decks." },
              { title: "Weekly Income Challenge", desc: "Momentum that converts learning to revenue." },
              { title: "Private Community", desc: "Founders building alongside you." },
              { title: "Certificate", desc: "Verified completion of AI Venture Lab." },
            ].map((b, idx) => (
              <div key={idx} className="bg-[#1e2842]/60 border border-slate-700/60 rounded-2xl p-4 md:p-5 space-y-2 hover:border-[#f9be3e]/40 transition-all flex flex-col justify-between">
                <div>
                  <h4 className="font-bold text-[#f9be3e] text-sm md:text-base leading-tight mb-1">{b.title}</h4>
                  <p className="text-xs text-slate-300 leading-relaxed">{b.desc}</p>
                </div>
              </div>
            ))}
          </div>

          {/* DISCLAIMER / NOTICE FOOTER */}
          <div className="text-center pt-2">
            <p className="text-xs text-slate-400 font-medium italic bg-[#1e2842]/40 border border-slate-700/50 rounded-2xl py-3 px-6 inline-block max-w-2xl">
              These bonuses are available only when participants enroll in the complete AI Venture Lab Program ({formatPrice(10999)}).
            </p>
          </div>
        </div>
      </section>

      {/* 8. SECTION 8: TESTIMONIALS (DARK INK SECTION) */}
      <section className="py-24 px-4 md:px-8 bg-[#0c142a] text-white">
        <div className="container mx-auto max-w-6xl space-y-16">
          <div className="text-center max-w-3xl mx-auto space-y-3">
            <span className="text-xs font-bold uppercase tracking-widest text-[#1ad8ea] font-mono">
              SUCCESS STORIES ACROSS THE BRIDGE
            </span>
            <h2 className="text-3xl sm:text-5xl font-black text-white tracking-tight">
              Real Results From Real Founders
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="bg-[#1e2842]/60 border border-slate-700/60 rounded-3xl p-6 space-y-4 backdrop-blur-xl">
              <div className="flex text-[#f9be3e] gap-1">
                {[...Array(5)].map((_, i) => (
                  <Star key={i} size={16} className="fill-[#f9be3e]" />
                ))}
              </div>
              <p className="text-xs text-slate-300 italic leading-relaxed">
                &ldquo;I went from spending ₹1.5L/month on digital marketing agencies to running my own AI content engine. Saved over 25 hours a week and doubled my lead conversions.&rdquo;
              </p>
              <div className="border-t border-slate-700/60 pt-3 flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-[#2363f1]/20 text-[#1ad8ea] font-bold flex items-center justify-center text-sm">PM</div>
                <div>
                  <h4 className="text-xs font-bold text-white">Pooja Malhotra</h4>
                  <span className="text-[10px] text-slate-400">Women Entrepreneur & Founder</span>
                </div>
              </div>
            </div>

            <div className="bg-[#1e2842]/60 border border-slate-700/60 rounded-3xl p-6 space-y-4 backdrop-blur-xl">
              <div className="flex text-[#f9be3e] gap-1">
                {[...Array(5)].map((_, i) => (
                  <Star key={i} size={16} className="fill-[#f9be3e]" />
                ))}
              </div>
              <p className="text-xs text-slate-300 italic leading-relaxed">
                &ldquo;The WhatsApp API integration changed everything. Our lead response time dropped from 4 hours to 5 seconds. We closed 18 new clients in the first month alone.&rdquo;
              </p>
              <div className="border-t border-slate-700/60 pt-3 flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-[#1ad8ea]/20 text-[#1ad8ea] font-bold flex items-center justify-center text-sm">RK</div>
                <div>
                  <h4 className="text-xs font-bold text-white">Rajesh Kapoor</h4>
                  <span className="text-[10px] text-slate-400">B2B Business Owner</span>
                </div>
              </div>
            </div>

            <div className="bg-[#1e2842]/60 border border-slate-700/60 rounded-3xl p-6 space-y-4 backdrop-blur-xl">
              <div className="flex text-[#f9be3e] gap-1">
                {[...Array(5)].map((_, i) => (
                  <Star key={i} size={16} className="fill-[#f9be3e]" />
                ))}
              </div>
              <p className="text-xs text-slate-300 italic leading-relaxed">
                &ldquo;I had zero coding background. The step-by-step roadmap gave me the confidence to launch my AI consulting agency. The ₹99 webinar was the best decision I made.&rdquo;
              </p>
              <div className="border-t border-slate-700/60 pt-3 flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-[#2363f1]/20 text-[#1ad8ea] font-bold flex items-center justify-center text-sm">SR</div>
                <div>
                  <h4 className="text-xs font-bold text-white">Sunita Rao</h4>
                  <span className="text-[10px] text-slate-400">Freelance AI Consultant</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 9. SECTION 9: FAQ (LIGHT SLATE SECTION) */}
      <section className="py-24 px-4 md:px-8 bg-[#f8fafc] text-slate-900 border-t border-slate-200">
        <div className="container mx-auto max-w-4xl space-y-12">
          <div className="text-center max-w-2xl mx-auto space-y-3">
            <span className="text-xs font-bold uppercase tracking-widest text-[#2363f1] font-mono">
              FREQUENTLY ASKED QUESTIONS
            </span>
            <h2 className="text-3xl sm:text-4xl font-black text-[#0c142a] tracking-tight">
              Got Questions? We Have Answers.
            </h2>
          </div>

          <div className="space-y-4">
            {[
              {
                q: "What is the difference between the ₹99 Webinar and the 8-Week AI Venture Lab?",
                a: "The ₹99 LIVE Webinar is the FIRST STEP onto the bridge. It gives you the complete opportunity blueprint, AI business validation framework, and roadmap. The 8-Week AI Venture Lab (₹10,999) is the COMPLETE JOURNEY where we build your entire business, website, WhatsApp API, and marketing systems together hands-on."
              },
              {
                q: "Do I need any technical or coding knowledge?",
                a: "No coding or technical background is required. Everything taught uses modern no-code AI tools, drag-and-drop builders, and intuitive visual interfaces designed for non-tech founders."
              },
              {
                q: "How do I claim the 1-Year WhatsApp Business API bonus?",
                a: "The complimentary 1-Year WhatsApp Business API subscription (Worth ₹25,000) is included as an exclusive bonus when participants enroll in the complete 8-Week AI Venture Lab Program (₹10,999)."
              },
              {
                q: "Will I get recordings if I miss the live webinar session?",
                a: "Yes! While we strongly encourage attending live for real-time Q&A and interactive demonstrations, recorded session access will be provided to all registered participants."
              },
              {
                q: "What certificate will I receive?",
                a: "You will receive an official verifiable digital Certificate of Completion from Ruzann AI Venture Lab complete with a unique QR code for LinkedIn and client verification."
              }
            ].map((faq, idx) => (
              <div key={idx} className="bg-white border border-slate-200/90 rounded-2xl overflow-hidden shadow-sm">
                <button
                  onClick={() => setOpenFaq(openFaq === idx ? null : idx)}
                  className="w-full p-5 text-left font-bold text-sm md:text-base text-[#0c142a] flex justify-between items-center gap-4 hover:text-[#2363f1] transition-colors"
                >
                  <span>{faq.q}</span>
                  <ChevronDown size={18} className={`shrink-0 transition-transform duration-300 ${openFaq === idx ? 'rotate-180 text-[#2363f1]' : 'text-slate-400'}`} />
                </button>
                {openFaq === idx && (
                  <div className="px-5 pb-5 text-xs md:text-sm text-slate-600 leading-relaxed border-t border-slate-100 pt-3">
                    {faq.a}
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 10. SECTION 10: FINAL EMOTIONAL CTA (DARK INK SECTION) */}
      <section className="py-24 px-4 md:px-8 bg-[#0c142a] text-center text-white relative overflow-hidden border-t border-slate-800">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[700px] h-[400px] bg-[#2363f1]/15 rounded-full blur-[180px] pointer-events-none" />

        <div className="container mx-auto max-w-4xl space-y-8 relative z-10">
          <h2 className="text-3xl sm:text-5xl md:text-6xl font-black text-white tracking-tight leading-tight">
            Every Great Journey<br />Begins With One Step.
          </h2>

          <p className="text-slate-300 text-sm sm:text-lg md:text-xl max-w-2xl mx-auto leading-relaxed">
            Today you&apos;re standing at the beginning of the bridge.<br />
            Six months from now you&apos;ll either say...<br />
            <span className="text-[#f9be3e] font-bold">&ldquo;I&apos;m glad I started.&rdquo;</span> or <span className="text-slate-400 font-bold">&ldquo;I wish I had.&rdquo;</span>
          </p>

          <div className="pt-4 max-w-md mx-auto space-y-4">
            <button
              onClick={openBookingModal}
              className="w-full bg-gradient-to-r from-[#2363f1] to-[#1ad8ea] hover:from-[#1ad8ea] hover:to-[#2363f1] text-[#0c142a] font-black text-lg py-5 px-8 rounded-full shadow-[0_10px_30px_-10px_rgba(35,99,241,0.6)] hover:shadow-[0_15px_35px_-5px_rgba(26,216,234,0.7)] transition-all transform hover:-translate-y-1 active:translate-y-0 flex items-center justify-center gap-3 group"
            >
              <span>Reserve My Seat</span>
              <ArrowRight size={22} className="group-hover:translate-x-1 transition-transform" />
            </button>

            <div className="text-xs text-slate-400 font-medium">
              100% Risk-Free Guarantee • Instant Access Sent To Email
            </div>
          </div>
        </div>
      </section>

      {/* REGISTRATION & PAYMENT MODAL */}
      {isRegModalOpen && (
        <div className="fixed inset-0 z-50 bg-[#0c142a]/90 backdrop-blur-xl flex items-center justify-center p-4">
          <div className="bg-[#0c142a] border border-[#1ad8ea]/40 w-full max-w-md rounded-3xl p-6 md:p-8 relative shadow-2xl shadow-[#2363f1]/20">
            <button
              onClick={() => setIsRegModalOpen(false)}
              className="absolute top-4 right-4 text-slate-400 hover:text-white bg-[#1e2842] p-2 rounded-full transition-colors"
            >
              <X size={18} />
            </button>

            <div className="text-center mb-6">
              <div className="w-12 h-12 rounded-2xl bg-[#2363f1]/15 text-[#1ad8ea] flex items-center justify-center mx-auto mb-2 border border-[#2363f1]/30">
                <Sparkles size={24} />
              </div>
              <h3 className="text-xl font-black text-white">Reserve Your Seat</h3>
              <p className="text-xs text-[#1ad8ea] font-semibold mt-1">Ruzann AI Venture Lab LIVE Webinar ({formatPrice(99)})</p>
            </div>

            <form onSubmit={handleRegistrationSubmit} className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-slate-300 mb-1">Full Name *</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Priya Sharma"
                  value={formData.name}
                  onChange={e => setFormData({ ...formData, name: e.target.value })}
                  className="w-full bg-[#1e2842] border border-slate-700/80 rounded-xl px-4 py-3 text-xs text-white focus:outline-none focus:border-[#1ad8ea] transition-colors"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-300 mb-1">Email Address *</label>
                <input
                  type="email"
                  required
                  placeholder="priya@mybusiness.com"
                  value={formData.email}
                  onChange={e => setFormData({ ...formData, email: e.target.value })}
                  className="w-full bg-[#1e2842] border border-slate-700/80 rounded-xl px-4 py-3 text-xs text-white focus:outline-none focus:border-[#1ad8ea] transition-colors"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-300 mb-1">Phone Number (WhatsApp) *</label>
                <input
                  type="tel"
                  required
                  placeholder="+91 98765 43210"
                  value={formData.phone}
                  onChange={e => setFormData({ ...formData, phone: e.target.value })}
                  className="w-full bg-[#1e2842] border border-slate-700/80 rounded-xl px-4 py-3 text-xs text-white focus:outline-none focus:border-[#1ad8ea] transition-colors"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-300 mb-1">Your Role / Background</label>
                <select
                  value={formData.role}
                  onChange={e => setFormData({ ...formData, role: e.target.value })}
                  className="w-full bg-[#1e2842] border border-slate-700/80 rounded-xl px-4 py-3 text-xs text-white focus:outline-none focus:border-[#1ad8ea] transition-colors"
                >
                  <option value="Women Entrepreneur">Women Entrepreneur / Founder</option>
                  <option value="Small Business Owner">Small Business Owner</option>
                  <option value="Freelancer">Freelancer / Consultant</option>
                  <option value="Corporate Professional">Corporate Professional / Executive</option>
                  <option value="Homemaker">Homemaker / Aspiring Founder</option>
                  <option value="Other">Other</option>
                </select>
              </div>

              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full bg-gradient-to-r from-[#2363f1] to-[#1ad8ea] text-[#0c142a] font-black py-4 rounded-xl shadow-xl transition-all flex items-center justify-center gap-2 text-xs sm:text-sm disabled:opacity-50"
              >
                {isSubmitting ? (
                  <>
                    <Loader2 size={18} className="animate-spin" />
                    <span>Opening Payment Gateway...</span>
                  </>
                ) : (
                  <>
                    <Lock size={16} />
                    <span>CONFIRM REGISTRATION ({formatPrice(99)})</span>
                  </>
                )}
              </button>
            </form>
          </div>
        </div>
      )}

      {/* STICKY MOBILE BOTTOM BAR */}
      <div className="lg:hidden fixed bottom-0 left-0 right-0 z-40 bg-[#0c142a]/95 border-t border-slate-800 p-3 px-4 backdrop-blur-xl flex items-center justify-between gap-3">
        <div>
          <div className="text-[10px] text-slate-400 uppercase font-bold">LIVE Webinar Pass</div>
          <div className="text-[#1ad8ea] font-black text-lg">{formatPrice(99)} <span className="line-through text-slate-500 text-xs font-normal">{formatPrice(1999)}</span></div>
        </div>
        <button
          onClick={openBookingModal}
          className="bg-gradient-to-r from-[#2363f1] to-[#1ad8ea] text-[#0c142a] font-black text-xs px-5 py-3 rounded-full shadow-lg flex items-center gap-1.5"
        >
          <span>RESERVE SEAT</span>
          <ArrowRight size={14} />
        </button>
      </div>

      {/* FLOATING WHATSAPP BUTTON */}
      <a
        href="https://wa.me/919876543210?text=Hi%2C%20I%20have%20a%20question%20about%20Ruzann%20AI%20Venture%20Lab%20Webinar"
        target="_blank"
        rel="noopener noreferrer"
        className="fixed bottom-20 lg:bottom-6 right-6 z-40 bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold p-3.5 rounded-full shadow-2xl flex items-center gap-2 transition-all transform hover:scale-110"
        title="Chat on WhatsApp"
      >
        <MessageSquare size={22} className="fill-slate-950" />
        <span className="hidden md:inline text-xs font-black">Ask Support</span>
      </a>

      <Footer />
    </div>
  );
}

// Trophy icon helper component
function Trophy(props: any) {
  return (
    <svg
      {...props}
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M6 9H4.5a2.5 2.5 0 0 1 0-5H6" />
      <path d="M18 9h1.5a2.5 2.5 0 0 0 0-5H18" />
      <path d="M4 22h16" />
      <path d="M10 14.66V17c0 .55-.47.98-.97 1.21C7.85 18.75 7 20.24 7 22" />
      <path d="M14 14.66V17c0 .55.47.98.97 1.21C16.15 18.75 17 20.24 17 22" />
      <path d="M18 2H6v7a6 6 0 0 0 12 0V2Z" />
    </svg>
  );
}
