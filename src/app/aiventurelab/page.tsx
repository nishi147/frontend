"use client";

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Header } from '@/components/layout/Header';
import { Footer } from '@/components/layout/Footer';
import { useToast } from '@/context/ToastContext';
import { useCurrency } from '@/context/CurrencyContext';
import api from '@/utils/api';
import { trackAddToCart, trackInitiateCheckout, trackPurchase, trackEvent } from '@/utils/analytics';
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
  XCircle
} from 'lucide-react';

export default function AIVentureLabPage() {
  const router = useRouter();
  const { showToast } = useToast();
  const { currency, formatPrice } = useCurrency();

  // Countdown timer state
  const [timeLeft, setTimeLeft] = useState({ hours: 2, minutes: 14, seconds: 35 });
  const [isRegModalOpen, setIsRegModalOpen] = useState(false);
  const [openFaq, setOpenFaq] = useState<number | null>(0);
  const [activeTrackTab, setActiveTrackTab] = useState<'women' | 'business'>('women');

  // Registration Form State
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    role: 'Women Entrepreneur',
    businessName: '',
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [regSuccess, setRegSuccess] = useState(false);

  // Load Razorpay script & handle ticking timer
  useEffect(() => {
    // Dynamically load Razorpay checkout script
    const script = document.createElement('script');
    script.src = 'https://checkout.razorpay.com/v1/checkout.js';
    script.async = true;
    document.body.appendChild(script);

    const timer = setInterval(() => {
      setTimeLeft(prev => {
        if (prev.seconds > 0) {
          return { ...prev, seconds: prev.seconds - 1 };
        } else if (prev.minutes > 0) {
          return { ...prev, minutes: 59, seconds: 59 };
        } else if (prev.hours > 0) {
          return { ...prev, hours: prev.hours - 1, minutes: 59, seconds: 59 };
        }
        return prev;
      });
    }, 1000);

    return () => {
      clearInterval(timer);
      if (document.body.contains(script)) {
        document.body.removeChild(script);
      }
    };
  }, []);

  const openBookingModal = () => {
    setRegSuccess(false);
    setIsRegModalOpen(true);
    trackAddToCart({
      content_name: 'AI Venture Lab Masterclass',
      content_category: 'Masterclass',
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
    try {
      // 1. Create Razorpay order via intro-order endpoint (₹99)
      const orderRes = await api.post('/api/payments/intro-order', {
        currency: currency || 'INR'
      });

      if (!orderRes.data.success || !orderRes.data.data) {
        throw new Error(orderRes.data.message || 'Failed to create order');
      }

      const order = orderRes.data.data;

      // Track InitiateCheckout
      trackInitiateCheckout({
        content_name: 'AI Venture Lab Masterclass',
        num_items: 1,
        value: 99,
        currency: currency || 'INR'
      });

      // 2. Configure Razorpay Gateway Popup
      const options = {
        key: process.env.NEXT_PUBLIC_RAZORPAY_KEY || 'rzp_live_SQl3GLrpIJFRGe',
        amount: order.amount,
        currency: order.currency || 'INR',
        name: "RUZANN",
        description: "AI Venture Lab Live Masterclass Seat (₹99)",
        order_id: order.id,
        prefill: {
          name: formData.name,
          email: formData.email,
          contact: formData.phone
        },
        theme: {
          color: "#E91E63"
        },
        handler: async function (response: any) {
          try {
            // Verify payment on backend
            const verifyRes = await api.post('/api/payments/intro-verify', {
              razorpay_order_id: response.razorpay_order_id,
              razorpay_payment_id: response.razorpay_payment_id,
              razorpay_signature: response.razorpay_signature,
              studentName: formData.name,
              parentName: formData.businessName || formData.name,
              email: formData.email,
              phone: formData.phone,
              role: formData.role,
              programName: 'AI Venture Lab Live Masterclass',
              isAIVentureLab: true,
              age: 25
            });

            if (verifyRes.data.success) {
              const purchaseData = {
                value: 99,
                currency: currency || 'INR',
                content_name: 'AI Venture Lab Masterclass',
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

              showToast("Payment successful! Welcome to AI Venture Lab.", "success");
              setIsRegModalOpen(false);
              router.push(`/payment-success?tx=${response.razorpay_payment_id}&amount=99&title=${encodeURIComponent('AI Venture Lab Masterclass')}`);
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
    <div className="min-h-screen bg-slate-900 text-slate-100 flex flex-col font-sans selection:bg-rose-500 selection:text-white pb-16 lg:pb-0">
      <Header />

      {/* 1. TOP URGENT ANNOUNCEMENT BAR */}
      <div className="bg-gradient-to-r from-rose-600 via-pink-600 to-rose-600 text-white py-1.5 md:py-2.5 px-3 text-center text-[11px] md:text-sm font-bold shadow-md sticky top-0 z-40 flex items-center justify-center gap-2 md:gap-3">
        <span className="flex items-center gap-1 bg-white/20 px-2 py-0.5 rounded-full text-amber-300 text-[10px] md:text-xs animate-pulse shrink-0">
          <Flame size={12} className="fill-amber-300" /> LIVE BATCH
        </span>
        <span className="hidden sm:inline">Admissions Closing Soon:</span>
        <span className="font-mono bg-slate-900/60 px-2 py-0.5 md:px-2.5 md:py-1 rounded border border-white/20 tracking-wider text-amber-300 text-xs md:text-sm">
          {String(timeLeft.hours).padStart(2, '0')}:{String(timeLeft.minutes).padStart(2, '0')}:{String(timeLeft.seconds).padStart(2, '0')}
        </span>
        <span className="bg-amber-400 text-slate-950 px-1.5 py-0.5 rounded text-[10px] font-black uppercase tracking-wider hidden sm:inline-block">
          Special ₹99 Offer
        </span>
      </div>

      {/* 2. HERO SECTION */}
      <section className="relative pt-4 pb-8 md:pt-12 md:pb-20 px-3 md:px-8 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-slate-800 via-slate-900 to-slate-950 overflow-hidden">
        {/* Background Glows */}
        <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[350px] md:w-[600px] h-[200px] md:h-[350px] bg-rose-500/15 rounded-full blur-[100px] md:blur-[140px] pointer-events-none" />

        <div className="container mx-auto max-w-6xl relative z-10">
          {/* Target Audience Pill */}
          <div className="flex justify-center mb-3 md:mb-6">
            <div className="inline-flex items-center gap-1.5 bg-gradient-to-r from-rose-500/20 via-sky-500/20 to-purple-500/20 border border-rose-400/30 px-3 py-1 md:px-4 md:py-2 rounded-full text-rose-300 font-bold text-[11px] md:text-sm backdrop-blur-md text-center">
              <Sparkles size={14} className="text-amber-400 shrink-0" />
              <span>For Women Entrepreneurs & Business Owners</span>
            </div>
          </div>

          {/* Headline & Subheadline */}
          <div className="text-center max-w-4xl mx-auto mb-4 md:mb-10">
            <h1 className="text-2xl sm:text-4xl md:text-5xl lg:text-6xl font-black text-white leading-tight mb-2 md:mb-6 tracking-tight">
              Master <span className="bg-gradient-to-r from-rose-400 via-pink-300 to-amber-300 bg-clip-text text-transparent">AI Tools & Automation</span> to Scale 10X
            </h1>
            <p className="text-slate-300 text-xs sm:text-base md:text-xl font-medium leading-relaxed max-w-3xl mx-auto">
              Save 20+ hours weekly, drop agency costs & automate sales, marketing & admin—<strong className="text-white underline decoration-rose-500 underline-offset-2">no coding required.</strong>
            </p>
          </div>

          {/* Hero Content Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-4 md:gap-8 items-center">
            {/* Left Column: Key Highlights & Primary CTA */}
            <div className="lg:col-span-7 space-y-4 md:space-y-6">
              <div className="bg-slate-800/80 border border-slate-700/60 rounded-2xl md:rounded-3xl p-4 md:p-8 backdrop-blur-xl shadow-xl space-y-3 md:space-y-4">
                <h3 className="text-sm md:text-lg font-black text-rose-400 flex items-center gap-2">
                  <Zap size={18} className="text-amber-400" /> What You Will Achieve:
                </h3>
                <ul className="space-y-2 md:space-y-3 text-xs md:text-base text-slate-200">
                  <li className="flex items-start gap-2 md:gap-3">
                    <CheckCircle2 size={16} className="text-rose-400 shrink-0 mt-0.5" />
                    <span><strong>Automate Marketing & Visuals:</strong> Create 30 days of high-converting posts & scripts in 15 mins.</span>
                  </li>
                  <li className="flex items-start gap-2 md:gap-3">
                    <CheckCircle2 size={16} className="text-rose-400 shrink-0 mt-0.5" />
                    <span><strong>24/7 AI Sales Assistants:</strong> Auto-respond to client inquiries & nurture leads on autopilot.</span>
                  </li>
                  <li className="flex items-start gap-2 md:gap-3">
                    <CheckCircle2 size={16} className="text-rose-400 shrink-0 mt-0.5" />
                    <span><strong>Streamline Admin & Finance:</strong> Replace tedious manual invoicing, bookkeeping & proposals.</span>
                  </li>
                  <li className="flex items-start gap-2 md:gap-3">
                    <CheckCircle2 size={16} className="text-rose-400 shrink-0 mt-0.5" />
                    <span><strong>Scale Profitably:</strong> Achieve output of a 10-person team with minimal overhead.</span>
                  </li>
                </ul>

                {/* Primary CTA Button Box */}
                <div className="pt-3 border-t border-slate-700/60 flex flex-col sm:flex-row items-center gap-3">
                  <button
                    onClick={openBookingModal}
                    className="w-full sm:w-auto flex-1 bg-gradient-to-r from-rose-500 to-pink-600 hover:from-rose-600 hover:to-pink-700 text-white font-black text-base md:text-lg px-6 py-3.5 md:py-4 rounded-xl md:rounded-2xl shadow-lg shadow-rose-500/25 transition-all flex items-center justify-center gap-2 group"
                  >
                    <span>PAY {formatPrice(99)} & JOIN LIVE</span>
                    <ArrowRight size={18} className="group-hover:translate-x-1 transition-transform" />
                  </button>
                  <div className="text-center sm:text-left text-[11px] md:text-xs text-slate-400 font-medium">
                    <div className="text-amber-300 font-bold flex items-center justify-center sm:justify-start gap-1">
                      <Star size={12} className="fill-amber-300" /> 4.9/5 Rating (2,400+ Reviews)
                    </div>
                    <span>Regular: <span className="line-through text-slate-500">{formatPrice(1999)}</span> (95% OFF)</span>
                  </div>
                </div>
              </div>

              {/* Trust Badges Grid */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 md:gap-3">
                <div className="bg-slate-800/40 border border-slate-700/40 rounded-xl p-2.5 text-center">
                  <BadgeCheck size={18} className="text-rose-400 mx-auto mb-0.5" />
                  <span className="text-[11px] md:text-xs font-bold text-slate-300 block">Official Certificate</span>
                  <span className="text-[9px] md:text-[10px] text-slate-400">Quality Training</span>
                </div>
                <div className="bg-slate-800/40 border border-slate-700/40 rounded-xl p-2.5 text-center">
                  <Users size={18} className="text-sky-400 mx-auto mb-0.5" />
                  <span className="text-[11px] md:text-xs font-bold text-slate-300 block">15,000+ Alumni</span>
                  <span className="text-[9px] md:text-[10px] text-slate-400">Business Owners</span>
                </div>
                <div className="bg-slate-800/40 border border-slate-700/40 rounded-xl p-2.5 text-center">
                  <Lock size={18} className="text-emerald-400 mx-auto mb-0.5" />
                  <span className="text-[11px] md:text-xs font-bold text-slate-300 block">Instant Access</span>
                  <span className="text-[9px] md:text-[10px] text-slate-400">Secure Enrollment</span>
                </div>
                <div className="bg-slate-800/40 border border-slate-700/40 rounded-xl p-2.5 text-center">
                  <Award size={18} className="text-amber-400 mx-auto mb-0.5" />
                  <span className="text-[11px] md:text-xs font-bold text-slate-300 block">Verified Certificate</span>
                  <span className="text-[9px] md:text-[10px] text-slate-400">Included Free</span>
                </div>
              </div>
            </div>

            {/* Right Column: Interactive Card / Workshop Details */}
            <div className="lg:col-span-5 mt-2 md:mt-0">
              <div className="bg-gradient-to-b from-slate-800 to-slate-900 border-2 border-rose-500/30 rounded-2xl md:rounded-3xl p-4 md:p-6 shadow-xl relative overflow-hidden">
                <div className="absolute top-0 right-0 bg-gradient-to-l from-rose-500 to-pink-600 text-white text-[10px] md:text-xs font-black px-3 py-1 rounded-bl-xl uppercase tracking-wider">
                  Live Workshop
                </div>

                <div className="text-center mb-4 pt-1">
                  <div className="w-12 h-12 rounded-xl bg-rose-500/10 border border-rose-500/30 flex items-center justify-center mx-auto mb-2 text-rose-400">
                    <Video size={24} />
                  </div>
                  <h3 className="text-base md:text-xl font-black text-white">AI Venture Lab Masterclass</h3>
                  <p className="text-[11px] md:text-xs text-rose-300 font-semibold mt-0.5">Interactive Live Session</p>
                </div>

                {/* Event Key Info */}
                <div className="bg-slate-950/60 rounded-xl p-3 border border-slate-800 space-y-2 text-xs md:text-sm mb-4">
                  <div className="flex items-center justify-between py-1 border-b border-slate-800/80">
                    <span className="text-slate-400 flex items-center gap-1.5"><Calendar size={14} className="text-rose-400" /> Date:</span>
                    <span className="font-bold text-white">Upcoming Saturday</span>
                  </div>
                  <div className="flex items-center justify-between py-1 border-b border-slate-800/80">
                    <span className="text-slate-400 flex items-center gap-1.5"><Globe size={14} className="text-rose-400" /> Mode:</span>
                    <span className="font-bold text-emerald-400 flex items-center gap-1"><span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-ping inline-block" /> Google Meet Live</span>
                  </div>
                  <div className="flex items-center justify-between py-1">
                    <span className="text-slate-400 flex items-center gap-1.5"><Gift size={14} className="text-rose-400" /> WhatsApp API:</span>
                    <span className="font-bold text-amber-300">1 Year FREE ({formatPrice(25000)})</span>
                  </div>
                </div>

                {/* Seat Counter */}
                <div className="bg-rose-950/40 border border-rose-800/40 rounded-lg p-2.5 mb-4 text-center">
                  <div className="flex items-center justify-between text-[11px] font-bold mb-1">
                    <span className="text-rose-300">Seats Reserved: 86%</span>
                    <span className="text-amber-300 font-mono">14 Left at {formatPrice(99)}</span>
                  </div>
                  <div className="w-full h-1.5 bg-slate-800 rounded-full overflow-hidden">
                    <div className="h-full bg-gradient-to-r from-amber-400 to-rose-500 w-[86%] rounded-full" />
                  </div>
                </div>

                <button
                  onClick={openBookingModal}
                  className="w-full bg-amber-400 hover:bg-amber-300 text-slate-950 font-black text-sm md:text-base py-3 rounded-xl shadow-md transition-all flex items-center justify-center gap-2"
                >
                  <Lock size={16} />
                  <span>PAY {formatPrice(99)} VIA RAZORPAY</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 3. MEDIA LOGOS */}
      <section className="bg-slate-950 py-4 md:py-8 border-y border-slate-800">
        <div className="container mx-auto max-w-6xl px-3 text-center">
          <p className="text-[10px] md:text-xs font-black uppercase tracking-widest text-slate-400 mb-3 md:mb-6">
            FEATURED IN TOP MEDIA & BUSINESS PUBLICATIONS
          </p>
          <div className="flex flex-wrap items-center justify-center gap-4 md:gap-12 opacity-70 hover:opacity-100 transition-all text-xs md:text-xl font-black text-slate-300 tracking-wider">
            <span>ENTREPRENEUR</span>
            <span>YOURSTORY</span>
            <span>INC42</span>
            <span>BUSINESS INSIDER</span>
            <span>FORBES INDIA</span>
          </div>
        </div>
      </section>

      {/* 4. HIGH-CONVERTING SECTION: JOIN LIVE MASTERCLASS AT ₹99 */}
      <section className="py-8 md:py-16 px-3 md:px-8 bg-gradient-to-r from-rose-950 via-slate-900 to-rose-950 relative overflow-hidden border-b border-rose-500/20">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[300px] md:w-[600px] h-[150px] md:h-[250px] bg-rose-500/20 rounded-full blur-[100px] pointer-events-none" />

        <div className="container mx-auto max-w-4xl relative z-10">
          <div className="bg-slate-900/90 border-2 border-rose-500/50 rounded-2xl md:rounded-3xl p-5 md:p-10 shadow-2xl backdrop-blur-xl text-center relative overflow-hidden">
            <div className="inline-flex items-center gap-1.5 bg-amber-400 text-slate-950 px-3.5 py-1 rounded-full text-xs md:text-sm font-black uppercase tracking-wider mb-4 shadow-md">
              <Tag size={14} className="fill-slate-950" />
              SPECIAL LIMITED-TIME OFFER
            </div>

            <h2 className="text-2xl md:text-4xl lg:text-5xl font-black text-white leading-tight mb-3">
              Join Our Live Masterclass <span className="bg-gradient-to-r from-amber-300 via-rose-300 to-pink-400 bg-clip-text text-transparent">Today</span>
            </h2>

            <p className="text-slate-300 text-xs sm:text-base md:text-lg max-w-2xl mx-auto mb-6">
              Get live interactive AI training, {formatPrice(25000)}+ free bonuses, Certificate of Completion & 1-year WhatsApp API access for less than a cup of coffee.
            </p>

            <div className="flex items-center justify-center gap-3 mb-6">
              <span className="text-slate-400 line-through text-lg md:text-2xl font-bold">{formatPrice(1999)}</span>
              <span className="text-amber-400 text-3xl md:text-5xl font-black tracking-tight">{formatPrice(99)}</span>
              <span className="bg-rose-500/20 text-rose-300 border border-rose-400/40 text-[10px] md:text-xs font-bold px-2.5 py-1 rounded-lg">
                SAVE 95%
              </span>
            </div>

            <div className="max-w-md mx-auto">
              <button
                onClick={openBookingModal}
                className="w-full bg-gradient-to-r from-rose-500 via-pink-500 to-rose-600 hover:from-rose-600 hover:to-pink-600 text-white font-black text-base md:text-xl py-4 md:py-5 px-6 rounded-2xl shadow-2xl shadow-rose-500/40 transition-all transform hover:-translate-y-1 active:translate-y-0 flex items-center justify-center gap-3 group border border-rose-300/30"
              >
                <Sparkles size={22} className="text-amber-300 animate-spin-slow shrink-0" />
                <span>PAY {formatPrice(99)} & CLAIM SEAT</span>
                <ArrowRight size={22} className="group-hover:translate-x-1 transition-transform shrink-0" />
              </button>

              <div className="flex items-center justify-center gap-4 text-[10px] md:text-xs text-slate-400 mt-3 font-medium">
                <span className="flex items-center gap-1 text-amber-300"><Flame size={12} /> Only 14 seats remaining</span>
                <span>•</span>
                <span className="flex items-center gap-1 text-emerald-400"><ShieldCheck size={12} /> Instant Access & Bonus Included</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 5. PAIN POINT VS TRANSFORMATION MATRIX */}
      <section className="py-8 md:py-20 px-3 md:px-8 bg-slate-900">
        <div className="container mx-auto max-w-5xl">
          <div className="text-center max-w-3xl mx-auto mb-6 md:mb-14">
            <h2 className="text-xl sm:text-3xl md:text-4xl font-black text-white mb-2 md:mb-4">
              Struggling to Scale While Managing Everyday Chaos?
            </h2>
            <p className="text-slate-400 text-xs md:text-base">
              Without AI automation, traditional business owners work 60+ hours a week yet get stuck in bottlenecks.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-8">
            <div className="bg-slate-950/80 border border-rose-900/30 rounded-2xl md:rounded-3xl p-4 md:p-8 space-y-3">
              <div className="inline-flex items-center gap-1.5 bg-rose-500/10 border border-rose-500/30 px-2.5 py-0.5 rounded-full text-rose-400 font-bold text-[10px] md:text-xs">
                <XCircle size={14} className="text-rose-400 shrink-0" />
                <span>THE OLD MANUAL WAY</span>
              </div>
              <h3 className="text-base md:text-xl font-bold text-slate-200">Constant Overwhelm & Burnout</h3>
              <ul className="space-y-2 text-xs md:text-sm text-slate-300">
                <li className="flex items-start gap-2">
                  <span className="text-rose-400 font-bold mt-0.5">•</span>
                  <span>15+ hours/week wasted writing social posts & emails manually.</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-rose-400 font-bold mt-0.5">•</span>
                  <span>Paying expensive agency fees (₹50k-₹1.5L/mo) for average results.</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-rose-400 font-bold mt-0.5">•</span>
                  <span>Missing hot customer leads due to delayed manual responses.</span>
                </li>
              </ul>
            </div>

            <div className="bg-gradient-to-b from-slate-800 to-slate-850 border border-rose-500/40 rounded-2xl md:rounded-3xl p-4 md:p-8 space-y-3 shadow-xl">
              <div className="inline-flex items-center gap-1.5 bg-rose-500/20 border border-rose-400/40 px-2.5 py-0.5 rounded-full text-rose-300 font-bold text-[10px] md:text-xs">
                <Sparkles size={14} className="text-rose-300 shrink-0" />
                <span>THE AI VENTURE LAB SYSTEM</span>
              </div>
              <h3 className="text-base md:text-xl font-bold text-white">Automated Profit & Freedom</h3>
              <ul className="space-y-2 text-xs md:text-sm text-slate-200">
                <li className="flex items-start gap-2">
                  <CheckCircle2 size={16} className="text-emerald-400 shrink-0 mt-0.5" />
                  <span><strong>30 Days Content in 15 Mins:</strong> Instant strategy & assets.</span>
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle2 size={16} className="text-emerald-400 shrink-0 mt-0.5" />
                  <span><strong>Zero Agency Reliance:</strong> Manage copy, graphics & ads in-house.</span>
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle2 size={16} className="text-emerald-400 shrink-0 mt-0.5" />
                  <span><strong>24/7 AI Lead Assistant:</strong> Capture & convert leads automatically.</span>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* 6. DUAL AUDIENCE TRACKS */}
      <section className="py-8 md:py-20 px-3 md:px-8 bg-slate-950">
        <div className="container mx-auto max-w-6xl">
          <div className="text-center max-w-3xl mx-auto mb-6 md:mb-14">
            <span className="text-[10px] md:text-xs font-black uppercase tracking-widest text-rose-400 mb-1 block">
              TAILORED CURRICULUM FOCUS
            </span>
            <h2 className="text-xl md:text-4xl font-black text-white">
              Designed For Your Specific Track
            </h2>

            <div className="flex lg:hidden justify-center gap-2 mt-4 bg-slate-900 p-1 rounded-xl border border-slate-800 max-w-xs mx-auto">
              <button
                onClick={() => setActiveTrackTab('women')}
                className={`flex-1 py-2 px-3 rounded-lg text-xs font-bold transition-all ${
                  activeTrackTab === 'women'
                    ? 'bg-rose-500 text-white shadow-md'
                    : 'text-slate-400 hover:text-white'
                }`}
              >
                Women Founders
              </button>
              <button
                onClick={() => setActiveTrackTab('business')}
                className={`flex-1 py-2 px-3 rounded-lg text-xs font-bold transition-all ${
                  activeTrackTab === 'business'
                    ? 'bg-sky-500 text-white shadow-md'
                    : 'text-slate-400 hover:text-white'
                }`}
              >
                Business Owners
              </button>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 md:gap-8">
            <div className={`bg-slate-900 border border-slate-800 rounded-2xl md:rounded-3xl p-5 md:p-8 hover:border-rose-500/40 transition-all ${activeTrackTab === 'women' ? 'block' : 'hidden lg:block'}`}>
              <div className="w-10 h-10 md:w-14 md:h-14 rounded-xl md:rounded-2xl bg-rose-500/10 border border-rose-500/30 flex items-center justify-center text-rose-400 mb-4">
                <HeartHandshake size={22} className="md:w-7 md:h-7" />
              </div>
              <h3 className="text-lg md:text-2xl font-black text-white mb-2">For Women Entrepreneurs & Founders</h3>
              <p className="text-slate-400 text-xs md:text-sm mb-4 leading-relaxed">
                Empower your vision, balance high performance with personal freedom, and automate personal branding.
              </p>
              <ul className="space-y-2 text-xs md:text-sm text-slate-300 border-t border-slate-800 pt-4">
                <li className="flex items-center gap-2">
                  <Check size={16} className="text-rose-400 shrink-0" />
                  <span>Automate social branding & video scripts easily.</span>
                </li>
                <li className="flex items-center gap-2">
                  <Check size={16} className="text-rose-400 shrink-0" />
                  <span>Streamline client onboarding & customer support.</span>
                </li>
                <li className="flex items-center gap-2">
                  <Check size={16} className="text-rose-400 shrink-0" />
                  <span>Build pitch decks & financial plans for grants/funding.</span>
                </li>
              </ul>
            </div>

            <div className={`bg-slate-900 border border-slate-800 rounded-2xl md:rounded-3xl p-5 md:p-8 hover:border-sky-500/40 transition-all ${activeTrackTab === 'business' ? 'block' : 'hidden lg:block'}`}>
              <div className="w-10 h-10 md:w-14 md:h-14 rounded-xl md:rounded-2xl bg-sky-500/10 border border-sky-500/30 flex items-center justify-center text-sky-400 mb-4">
                <Briefcase size={22} className="md:w-7 md:h-7" />
              </div>
              <h3 className="text-lg md:text-2xl font-black text-white mb-2">For Business Owners & Executives</h3>
              <p className="text-slate-400 text-xs md:text-sm mb-4 leading-relaxed">
                Boost bottom-line profit, deploy autonomous AI agents, and empower staff with cutting-edge tools.
              </p>
              <ul className="space-y-2 text-xs md:text-sm text-slate-300 border-t border-slate-800 pt-4">
                <li className="flex items-center gap-2">
                  <Check size={16} className="text-sky-400 shrink-0" />
                  <span>Deploy custom GPTs trained on internal business data.</span>
                </li>
                <li className="flex items-center gap-2">
                  <Check size={16} className="text-sky-400 shrink-0" />
                  <span>Automate sales call summaries, CRM & proposal writing.</span>
                </li>
                <li className="flex items-center gap-2">
                  <Check size={16} className="text-sky-400 shrink-0" />
                  <span>Maximize ROI by eliminating redundant software costs.</span>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* 7. SYLLABUS BREAKDOWN */}
      <section className="py-8 md:py-20 px-3 md:px-8 bg-slate-900">
        <div className="container mx-auto max-w-5xl">
          <div className="text-center max-w-3xl mx-auto mb-6 md:mb-14">
            <span className="text-[10px] md:text-xs font-black uppercase tracking-widest text-amber-400 mb-1 block">
              SYLLABUS BREAKDOWN
            </span>
            <h2 className="text-xl md:text-4xl font-black text-white mb-2">
              What You Will Learn
            </h2>
          </div>

          <div className="space-y-3">
            {[
              { num: '01', title: 'Foundational AI & Executive Prompting', desc: 'Master the 4-step framework for razor-sharp business outputs.' },
              { num: '02', title: 'AI Marketing & Content Factory', desc: 'Generate ad copy, Canva graphics & video scripts in seconds.' },
              { num: '03', title: 'Automated Sales & Lead Funnels', desc: 'Set up auto-responding lead magnets & WhatsApp capture.' },
              { num: '04', title: 'Finance & Admin Automation', desc: 'Automate invoice parsing, meeting notes & vendor emails.' },
              { num: '05', title: 'Custom AI Business Assistant', desc: 'Deploy a private AI trained on your business SOPs.' },
            ].map((m, idx) => (
              <div key={idx} className="bg-slate-950 border border-slate-800 rounded-xl md:rounded-2xl p-3.5 md:p-6 flex items-center justify-between gap-3">
                <div className="flex items-center gap-3">
                  <div className="w-9 h-9 md:w-12 md:h-12 rounded-lg bg-rose-500/10 text-rose-400 font-black text-xs md:text-lg flex items-center justify-center shrink-0">
                    {m.num}
                  </div>
                  <div>
                    <h3 className="text-xs md:text-lg font-bold text-white">{m.title}</h3>
                    <p className="text-slate-400 text-[11px] md:text-sm line-clamp-1">{m.desc}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 8. MAJOR INCLUSION: FREE WHATSAPP API */}
      <section className="py-8 md:py-20 px-3 md:px-8 bg-slate-950">
        <div className="container mx-auto max-w-6xl">
          <div className="bg-gradient-to-br from-rose-950/60 via-slate-900 to-rose-950 border-2 border-rose-500/40 rounded-2xl md:rounded-3xl p-6 md:p-12 shadow-2xl relative overflow-hidden">
            {/* Background Glow */}
            <div className="absolute -top-24 -right-24 w-96 h-96 bg-rose-500/20 rounded-full blur-[100px] pointer-events-none" />

            <div className="text-center max-w-3xl mx-auto mb-6 md:mb-10 relative z-10">
              <span className="bg-gradient-to-r from-amber-400 to-amber-300 text-slate-950 text-[10px] md:text-xs font-black px-3.5 py-1 rounded-full uppercase tracking-wider inline-flex items-center gap-1.5 mb-3 shadow-md">
                <Sparkles size={14} className="fill-slate-950" />
                MAJOR INCLUSION - WORTH {formatPrice(25000)}
              </span>
              <h2 className="text-2xl md:text-5xl font-black text-white mb-3 leading-tight">
                1-Year Free <span className="bg-gradient-to-r from-amber-300 via-rose-300 to-pink-400 bg-clip-text text-transparent">WhatsApp API Access</span>
              </h2>
              <p className="text-slate-300 text-xs md:text-base leading-relaxed max-w-2xl mx-auto">
                Get full 1-year complimentary access to the WhatsApp Business API (Worth {formatPrice(25000)}/year) absolutely FREE with your enrollment.
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 md:gap-6 relative z-10 mb-8">
              <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-4 md:p-5 hover:border-rose-500/40 transition-all shadow-lg">
                <div className="w-10 h-10 rounded-xl bg-emerald-500/10 text-emerald-400 flex items-center justify-center font-bold mb-3">
                  <Zap size={20} />
                </div>
                <h4 className="text-sm md:text-base font-bold text-white mb-1.5">24/7 Auto Responses</h4>
                <p className="text-xs text-slate-400 leading-relaxed">
                  Auto-respond to client questions, send instant product catalogs, and handle inquiries around the clock.
                </p>
              </div>

              <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-4 md:p-5 hover:border-rose-500/40 transition-all shadow-lg">
                <div className="w-10 h-10 rounded-xl bg-rose-500/10 text-rose-400 flex items-center justify-center font-bold mb-3">
                  <Users size={20} />
                </div>
                <h4 className="text-sm md:text-base font-bold text-white mb-1.5">Lead Capture & Funnels</h4>
                <p className="text-xs text-slate-400 leading-relaxed">
                  Capture hot incoming leads from ads & social media directly into WhatsApp with automatic follow-up sequences.
                </p>
              </div>

              <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-4 md:p-5 hover:border-rose-500/40 transition-all shadow-lg">
                <div className="w-10 h-10 rounded-xl bg-amber-400/10 text-amber-400 flex items-center justify-center font-bold mb-3">
                  <Gift size={20} />
                </div>
                <h4 className="text-sm md:text-base font-bold text-white mb-1.5">Zero Subscription Fee</h4>
                <p className="text-xs text-slate-400 leading-relaxed">
                  Save {formatPrice(25000)} per year. You pay ₹0 subscription for the entire first year as an eligible student.
                </p>
              </div>

              <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-4 md:p-5 hover:border-rose-500/40 transition-all shadow-lg">
                <div className="w-10 h-10 rounded-xl bg-sky-500/10 text-sky-400 flex items-center justify-center font-bold mb-3">
                  <CheckCircle2 size={20} />
                </div>
                <h4 className="text-sm md:text-base font-bold text-white mb-1.5">Plug & Play Integration</h4>
                <p className="text-xs text-slate-400 leading-relaxed">
                  Easily integrate with your CRM, website, or marketing campaigns without any complex coding required.
                </p>
              </div>
            </div>

            <div className="text-center relative z-10">
              <button
                onClick={openBookingModal}
                className="bg-gradient-to-r from-rose-500 via-pink-500 to-rose-600 hover:from-rose-600 hover:to-pink-600 text-white font-black text-sm md:text-lg px-8 py-4 rounded-xl shadow-xl shadow-rose-500/30 transition-all transform hover:-translate-y-0.5"
              >
                PAY {formatPrice(99)} & CLAIM FREE WHATSAPP API
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* 9. TESTIMONIALS */}
      <section className="py-8 md:py-20 px-3 md:px-8 bg-slate-900">
        <div className="container mx-auto max-w-6xl">
          <div className="text-center max-w-3xl mx-auto mb-6 md:mb-14">
            <h2 className="text-xl md:text-4xl font-black text-white mb-2">
              Real Results From Business Owners
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="bg-slate-950 border border-slate-800 rounded-2xl p-4 space-y-3">
              <div className="flex text-amber-400 gap-1">
                {[...Array(5)].map((_, i) => (
                  <Star key={i} size={14} className="fill-amber-400" />
                ))}
              </div>
              <p className="text-slate-300 text-xs italic">
                &ldquo;Automated my entire social content & ad copy. Saved ₹1.2L/month in agency fees!&rdquo;
              </p>
              <div className="border-t border-slate-800/80 pt-2.5 flex items-center gap-2">
                <div className="w-8 h-8 rounded-full bg-rose-500/20 text-rose-300 font-bold text-xs flex items-center justify-center">PM</div>
                <div>
                  <h4 className="text-xs font-bold text-white">Pooja Malhotra</h4>
                  <span className="text-[10px] text-slate-400">Founder, EcoStyle</span>
                </div>
              </div>
            </div>

            <div className="bg-slate-950 border border-slate-800 rounded-2xl p-4 space-y-3">
              <div className="flex text-amber-400 gap-1">
                {[...Array(5)].map((_, i) => (
                  <Star key={i} size={14} className="fill-amber-400" />
                ))}
              </div>
              <p className="text-slate-300 text-xs italic">
                &ldquo;Deployed an AI assistant for inquiries and grew lead conversions by 34%.&rdquo;
              </p>
              <div className="border-t border-slate-800/80 pt-2.5 flex items-center gap-2">
                <div className="w-8 h-8 rounded-full bg-sky-500/20 text-sky-300 font-bold text-xs flex items-center justify-center">RK</div>
                <div>
                  <h4 className="text-xs font-bold text-white">Rajesh Kapoor</h4>
                  <span className="text-[10px] text-slate-400">MD, B2B Logistics</span>
                </div>
              </div>
            </div>

            <div className="bg-slate-950 border border-slate-800 rounded-2xl p-4 space-y-3">
              <div className="flex text-amber-400 gap-1">
                {[...Array(5)].map((_, i) => (
                  <Star key={i} size={14} className="fill-amber-400" />
                ))}
              </div>
              <p className="text-slate-300 text-xs italic">
                &ldquo;Zero tech background. Now I handle client proposals in 10 minutes instead of 3 hours.&rdquo;
              </p>
              <div className="border-t border-slate-800/80 pt-2.5 flex items-center gap-2">
                <div className="w-8 h-8 rounded-full bg-amber-500/20 text-amber-300 font-bold text-xs flex items-center justify-center">SR</div>
                <div>
                  <h4 className="text-xs font-bold text-white">Sunita Rao</h4>
                  <span className="text-[10px] text-slate-400">Corporate Trainer</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ⭐ CERTIFICATE OF COMPLETION SECTION */}
      <section className="py-8 md:py-20 px-3 md:px-8 bg-slate-950 border-t border-slate-800">
        <div className="container mx-auto max-w-5xl">
          <div className="text-center max-w-3xl mx-auto mb-8 md:mb-14">
            <div className="inline-flex items-center gap-1.5 bg-amber-400/10 border border-amber-400/30 px-3 py-1 rounded-full text-amber-300 font-bold text-[10px] md:text-xs mb-3">
              <Award size={14} className="text-amber-400 shrink-0" />
              <span>OFFICIAL CERTIFICATION</span>
            </div>
            <h2 className="text-xl sm:text-3xl md:text-4xl font-black text-white mb-2 md:mb-4">
              Get Your Official Certificate of Completion
            </h2>
            <p className="text-slate-400 text-xs md:text-base max-w-2xl mx-auto">
              Showcase your expertise to clients, investors, and peers with your verified digital Certificate of Completion.
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 md:gap-10 items-center">
            {/* Left: Certificate Features */}
            <div className="lg:col-span-5 space-y-4">
              <div className="bg-slate-900 border border-slate-800 rounded-2xl p-4 md:p-6 space-y-3 shadow-lg">
                <div className="flex items-start gap-3">
                  <div className="w-9 h-9 rounded-xl bg-amber-400/10 text-amber-400 font-bold flex items-center justify-center shrink-0 mt-0.5">
                    <BadgeCheck size={20} />
                  </div>
                  <div>
                    <h4 className="text-sm md:text-base font-bold text-white mb-1">Official Completion Certificate</h4>
                    <p className="text-xs text-slate-400 leading-relaxed">
                      Verified digital credential validating your hands-on mastery of business AI automation.
                    </p>
                  </div>
                </div>

                <div className="border-t border-slate-800/80 pt-3 flex items-start gap-3">
                  <div className="w-9 h-9 rounded-xl bg-rose-500/10 text-rose-400 font-bold flex items-center justify-center shrink-0 mt-0.5">
                    <Award size={20} />
                  </div>
                  <div>
                    <h4 className="text-sm md:text-base font-bold text-white mb-1">LinkedIn & Resume Sharable</h4>
                    <p className="text-xs text-slate-400 leading-relaxed">
                      Easily attach your verifiable credential URL to your LinkedIn profile, business website & pitch deck.
                    </p>
                  </div>
                </div>

                <div className="border-t border-slate-800/80 pt-3 flex items-start gap-3">
                  <div className="w-9 h-9 rounded-xl bg-sky-500/10 text-sky-400 font-bold flex items-center justify-center shrink-0 mt-0.5">
                    <ShieldCheck size={20} />
                  </div>
                  <div>
                    <h4 className="text-sm md:text-base font-bold text-white mb-1">Unique QR Verification</h4>
                    <p className="text-xs text-slate-400 leading-relaxed">
                      Includes a secure digital verification ID ensuring 100% authenticity for clients and organizations.
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Right: High Resolution Certificate Preview Card */}
            <div className="lg:col-span-7">
              <div className="bg-slate-900 border-2 border-amber-400/30 rounded-2xl md:rounded-3xl p-3 md:p-4 shadow-2xl relative overflow-hidden group">
                <div className="overflow-hidden rounded-xl bg-slate-950 border border-slate-800">
                  <img
                    src="/aiventurelab_certificate.png"
                    alt="Ruzann AI Venture Lab Certificate of Completion"
                    className="w-full h-auto object-cover transform group-hover:scale-105 transition-transform duration-500"
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 10. FAQ ACCORDION */}
      <section className="py-8 md:py-20 px-3 md:px-8 bg-slate-950">
        <div className="container mx-auto max-w-4xl">
          <div className="text-center max-w-2xl mx-auto mb-6 md:mb-14">
            <h2 className="text-xl md:text-4xl font-black text-white mb-2">
              Frequently Asked Questions
            </h2>
          </div>

          <div className="space-y-3">
              {[
                {
                  q: "1. Is the WhatsApp API included with the course?",
                  a: "Yes! Every eligible learner receives 1 year of WhatsApp API access worth ₹25,000 absolutely FREE. This allows you to automate customer communication, send notifications, manage leads, and engage with clients using WhatsApp Business as part of your learning experience."
                },
                {
                  q: "2. Why is the WhatsApp API valuable?",
                  a: "The WhatsApp API is widely used by businesses to automate customer support, lead follow-ups, appointment reminders, order updates, and marketing campaigns. Purchasing it separately can cost around ₹25,000 per year, but it's included at no additional cost with this course for eligible students."
                },
                {
                  q: "3. Who is eligible for the free WhatsApp API offer?",
                  a: "The complimentary 1-year WhatsApp API subscription is available to eligible students enrolled in this course. Please review the course details or contact our support team for any activation requirements or applicable terms."
                },
                {
                  q: "4. Can I use the WhatsApp API for my own business?",
                  a: "Absolutely! Once activated, you can integrate the WhatsApp API into your own business to communicate professionally with customers, automate workflows, and improve customer engagement while applying what you learn throughout the course."
                },
                {
                  q: "5. Are there any hidden charges for the WhatsApp API?",
                  a: "No hidden subscription fee for the API itself during the first year. Your ₹25,000 annual WhatsApp API access is included FREE with the course for eligible learners. Standard WhatsApp conversation charges or third-party platform fees (if applicable under Meta's pricing policy) are separate and are not included."
                }
              ].map((item, idx) => (
              <div key={idx} className="bg-slate-900 border border-slate-800 rounded-xl overflow-hidden">
                <button
                  onClick={() => setOpenFaq(openFaq === idx ? null : idx)}
                  className="w-full p-4 text-left font-bold text-xs md:text-base text-white flex justify-between items-center gap-3 hover:text-rose-400"
                >
                  <span>{item.q}</span>
                  <ChevronDown size={16} className={`shrink-0 transition-transform ${openFaq === idx ? 'rotate-180 text-rose-400' : 'text-slate-400'}`} />
                </button>
                {openFaq === idx && (
                  <div className="px-4 pb-4 text-slate-300 text-xs leading-relaxed border-t border-slate-800/60 pt-3">
                    {item.a}
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 11. FINAL CTA */}
      <section className="py-10 md:py-20 px-3 md:px-8 bg-gradient-to-br from-rose-950 via-slate-900 to-slate-950 text-center">
        <div className="container mx-auto max-w-4xl space-y-4">
          <h2 className="text-2xl md:text-5xl font-black text-white">
            Multiply Business Output & Save 20+ Hours Weekly
          </h2>
          <div>
            <button
              onClick={openBookingModal}
              className="bg-gradient-to-r from-rose-500 to-pink-600 text-white font-black text-base md:text-xl px-8 py-4 rounded-xl md:rounded-2xl shadow-xl"
            >
              PAY {formatPrice(99)} & JOIN MASTERCLASS
            </button>
          </div>
        </div>
      </section>

      {/* 12. REGISTRATION & PAYMENT MODAL */}
      {isRegModalOpen && (
        <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-md flex items-center justify-center p-3">
          <div className="bg-slate-900 border border-slate-700 w-full max-w-md rounded-2xl p-5 md:p-8 relative shadow-2xl">
            <button
              onClick={() => setIsRegModalOpen(false)}
              className="absolute top-3 right-3 text-slate-400 hover:text-white bg-slate-800 p-1.5 rounded-full"
            >
              <X size={16} />
            </button>

            <div className="text-center mb-4">
              <div className="w-10 h-10 rounded-xl bg-rose-500/10 text-rose-400 flex items-center justify-center mx-auto mb-1">
                <Sparkles size={20} />
              </div>
              <h3 className="text-lg font-black text-white">Reserve Your Seat</h3>
              <p className="text-xs text-slate-400">AI Venture Lab Live Masterclass ({formatPrice(99)})</p>
            </div>

            <form onSubmit={handleRegistrationSubmit} className="space-y-3">
              <div>
                <label className="block text-xs font-bold text-slate-300 mb-1">Full Name *</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Priya Sharma"
                  value={formData.name}
                  onChange={e => setFormData({ ...formData, name: e.target.value })}
                  className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-2.5 text-xs text-white focus:outline-none focus:border-rose-500"
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
                  className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-2.5 text-xs text-white focus:outline-none focus:border-rose-500"
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
                  className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-2.5 text-xs text-white focus:outline-none focus:border-rose-500"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-300 mb-1">Role / Background</label>
                <select
                  value={formData.role}
                  onChange={e => setFormData({ ...formData, role: e.target.value })}
                  className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-2.5 text-xs text-white focus:outline-none focus:border-rose-500"
                >
                  <option value="Women Entrepreneur">Women Entrepreneur / Founder</option>
                  <option value="Small Business Owner">Business Owner / Businessman</option>
                  <option value="Executive / Professional">Executive / Corporate Professional</option>
                  <option value="Other">Other</option>
                </select>
              </div>

              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full bg-gradient-to-r from-rose-500 to-pink-600 hover:from-rose-600 hover:to-pink-700 text-white font-black py-3 rounded-lg shadow-lg transition-all flex items-center justify-center gap-2 mt-2 text-xs md:text-sm disabled:opacity-50"
              >
                {isSubmitting ? (
                  <>
                    <Loader2 size={16} className="animate-spin" />
                    <span>Opening Payment Gateway...</span>
                  </>
                ) : (
                  <>
                    <Lock size={14} />
                    <span>PROCEED TO PAY {formatPrice(99)}</span>
                  </>
                )}
              </button>
            </form>
          </div>
        </div>
      )}

      {/* 13. STICKY MOBILE BOTTOM BAR */}
      <div className="lg:hidden fixed bottom-0 left-0 right-0 z-40 bg-slate-950/95 border-t border-slate-800 p-2.5 px-4 backdrop-blur-lg flex items-center justify-between gap-3">
        <div>
          <div className="text-[9px] text-slate-400 uppercase font-bold">Offer Closing Soon</div>
          <div className="text-rose-400 font-black text-base">{formatPrice(99)} <span className="line-through text-slate-500 text-[10px] font-normal">{formatPrice(1999)}</span></div>
        </div>
        <button
          onClick={openBookingModal}
          className="bg-gradient-to-r from-rose-500 to-pink-600 text-white font-black text-xs px-5 py-2.5 rounded-xl shadow-lg flex items-center gap-1"
        >
          <span>PAY ₹99 NOW</span>
          <ArrowRight size={14} />
        </button>
      </div>

      <Footer />
    </div>
  );
}
