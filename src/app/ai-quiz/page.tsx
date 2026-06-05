"use client";

import React, { useState, useEffect } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import { Header } from '@/components/layout/Header';
import { Footer } from '@/components/layout/Footer';
import api from '@/utils/api';
import { motion, AnimatePresence } from 'framer-motion';
import { Brain, Cpu, Sparkles } from 'lucide-react';
import Script from 'next/script';

// Component imports
import Hero from './components/Hero';
import WhyMatters from './components/WhyMatters';
import Discover from './components/Discover';
import HowItWorks from './components/HowItWorks';
import LeadCapture from './components/LeadCapture';
import SocialProof from './components/SocialProof';
import AssessmentWizard from './components/AssessmentWizard';
import ResultReport from './components/ResultReport';
import ThankYou from './components/ThankYou';
import FAQSection from './components/FAQSection';

import { Suspense } from 'react';

function AssessmentFunnel() {
  const router = useRouter();
  const searchParams = useSearchParams();
  
  // Funnel Step State: 'landing' | 'assessment' | 'loading' | 'thank-you' | 'result'
  const [step, setStep] = useState<'landing' | 'assessment' | 'loading' | 'thank-you' | 'result'>('landing');
  
  // Lead / Answers Data
  const [leadDetails, setLeadDetails] = useState<any>(null);
  const [assessmentAnswers, setAssessmentAnswers] = useState<Record<number, any>>({});
  const [finalScore, setFinalScore] = useState<number>(0);
  const [category, setCategory] = useState<string>('');
  const [recommendedProgram, setRecommendedProgram] = useState<string>('');

  // Diagnostic loading cycling messages
  const [loadingMsgIdx, setLoadingMsgIdx] = useState(0);
  const loadingMessages = [
    "Analyzing technological adaptation index...",
    "Evaluating logical decomposition & algorithms...",
    "Checking creative confidence & design adaptability...",
    "Computing modern AI awareness index...",
    "Mapping results to age-group learning pathways...",
    "Generating personalized PDF assessment report..."
  ];

  // Auto-trigger offer modal if URL query parameters contain claimOffer
  useEffect(() => {
    if (searchParams.get('claimOffer') === 'true' && leadDetails) {
      setStep('result');
    }
  }, [searchParams, leadDetails]);

  // Loading screen cycling timer
  useEffect(() => {
    if (step === 'loading') {
      const interval = setInterval(() => {
        setLoadingMsgIdx(prev => (prev + 1) % loadingMessages.length);
      }, 900);
      return () => clearInterval(interval);
    }
  }, [step]);

  // Scroll to lead form from hero
  const handleScrollToLeadForm = () => {
    const el = document.getElementById('lead-capture-section');
    if (el) {
      el.scrollIntoView({ behavior: 'smooth' });
    }
  };

  // Step 1: Submit Details from Lead Capture
  const handleLeadSubmit = (data: any) => {
    setLeadDetails(data);
    setStep('assessment');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // Step 2: Calculate Score and classification logic
  const handleAssessmentComplete = async (answers: Record<number, any>, score: number) => {
    setAssessmentAnswers(answers);
    setFinalScore(score);
    setStep('loading');
    window.scrollTo({ top: 0, behavior: 'smooth' });

    // Determine Classification Category
    let computedCategory = 'Future Starter';
    if (score >= 81) {
      computedCategory = 'Future Innovator';
    } else if (score >= 61) {
      computedCategory = 'AI Explorer';
    } else if (score >= 41) {
      computedCategory = 'Creative Problem Solver';
    }
    setCategory(computedCategory);

    // Determine Recommended Path
    const age = parseInt(leadDetails.age, 10);
    let computedProgram = 'AI Creator Program'; // Ages 14-18
    if (age >= 6 && age <= 9) {
      computedProgram = 'AI Explorer Program';
    } else if (age >= 10 && age <= 13) {
      computedProgram = 'Future Coder Program';
    }
    setRecommendedProgram(computedProgram);

    // Prepare API Submission payload
    const rawAnswersMap: Record<string, any> = {};
    Object.entries(answers).forEach(([key, val]: any) => {
      rawAnswersMap[`Q${key}`] = val.value;
    });

    const payload = {
      parentName: leadDetails.parentName,
      mobile: leadDetails.mobile,
      email: leadDetails.email || undefined,
      studentName: leadDetails.studentName,
      age: Number(leadDetails.age),
      class: leadDetails.grade,
      city: leadDetails.city,
      answers: rawAnswersMap,
      score: score,
      category: computedCategory,
      recommendedProgram: computedProgram
    };

    try {
      // POST API submission to store assessment
      await api.post('/api/assessment-submissions', payload);
      
      // Delay transition slightly to let the loading screen feel premium/calculative
      setTimeout(() => {
        setStep('thank-you');
        window.scrollTo({ top: 0, behavior: 'smooth' });
      }, 4500);

    } catch (err) {
      console.error("Failed to submit assessment results to database", err);
      // Fallback transition in case of API failure so funnel does not stall
      setTimeout(() => {
        setStep('thank-you');
        window.scrollTo({ top: 0, behavior: 'smooth' });
      }, 4500);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      {/* Razorpay Script Import */}
      <Script src="https://checkout.razorpay.com/v1/checkout.js" strategy="lazyOnload" />

      <Header />

      <main className="flex-1 flex flex-col">
        <AnimatePresence mode="wait">
          
          {/* STEP 1: LANDING PAGE INFO SECTIONS */}
          {step === 'landing' && (
            <motion.div
              key="landing"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="flex flex-col"
            >
              <Hero onStartClick={handleScrollToLeadForm} />
              <WhyMatters />
              <Discover />
              <HowItWorks />
              <SocialProof />
              <LeadCapture onSubmit={handleLeadSubmit} />
              <FAQSection />
            </motion.div>
          )}

          {/* STEP 2: WIZARD ASSESSMENT QUIZ */}
          {step === 'assessment' && leadDetails && (
            <motion.div
              key="assessment"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0 }}
            >
              <AssessmentWizard
                studentName={leadDetails.studentName}
                isParent={leadDetails.role === 'parent'}
                onSubmit={handleAssessmentComplete}
              />
            </motion.div>
          )}

          {/* LOADING STATE: COMPUTING REPORT */}
          {step === 'loading' && (
            <motion.div
              key="loading"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="py-24 px-4 flex-1 flex flex-col items-center justify-center text-center bg-gradient-to-b from-[#f8fafc] to-white min-h-[500px]"
            >
              <div className="max-w-md flex flex-col items-center">
                {/* Computing Circle Icon */}
                <div className="relative w-24 h-24 mb-8 flex items-center justify-center">
                  <div className="absolute inset-0 rounded-full border-4 border-gray-100 border-t-primary-500 animate-spin" />
                  <div className="w-16 h-16 rounded-full bg-primary-50 border border-primary-100 flex items-center justify-center text-primary-500">
                    <Brain size={32} className="animate-pulse" />
                  </div>
                </div>

                <h3 className="font-baloo font-black text-navy-900 text-2xl mb-3 flex items-center gap-1.5 justify-center">
                  <Cpu size={24} className="text-secondary-500" /> Calculating AI Readiness Index
                </h3>

                {/* Animated changing text message */}
                <div className="h-8 flex items-center justify-center">
                  <motion.p
                    key={loadingMsgIdx}
                    initial={{ opacity: 0, y: 5 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -5 }}
                    className="text-gray-400 font-bold text-sm"
                  >
                    {loadingMessages[loadingMsgIdx]}
                  </motion.p>
                </div>
              </div>
            </motion.div>
          )}

          {/* STEP 3: THANK YOU / COMPLETE PAGE */}
          {step === 'thank-you' && leadDetails && (
            <motion.div
              key="thank-you"
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0 }}
            >
              <ThankYou
                studentName={leadDetails.studentName}
                parentName={leadDetails.parentName}
                mobile={leadDetails.mobile}
                email={leadDetails.email}
                score={finalScore}
                category={category}
                recommendedProgram={recommendedProgram}
                onViewReport={() => {
                  setStep('result');
                  window.scrollTo({ top: 0, behavior: 'smooth' });
                }}
              />
            </motion.div>
          )}

          {/* STEP 4: DETAILED SCORE REPORT & DIAGNOSTICS CARD */}
          {step === 'result' && leadDetails && (
            <motion.div
              key="result"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0 }}
            >
              <ResultReport
                score={finalScore}
                category={category}
                recommendedProgram={recommendedProgram}
                answers={assessmentAnswers}
                studentName={leadDetails.studentName}
                parentName={leadDetails.parentName}
                mobile={leadDetails.mobile}
                email={leadDetails.email}
                age={Number(leadDetails.age)}
                isParent={leadDetails.role === 'parent'}
                onRetake={() => {
                  setStep('landing');
                  setAssessmentAnswers({});
                  setFinalScore(0);
                  setCategory('');
                  setRecommendedProgram('');
                  window.scrollTo({ top: 0, behavior: 'smooth' });
                }}
                onBookingSuccess={() => {
                  // If they complete payment successfully we can take them to Ruzann's standard page,
                  // or show an alert. But standard IntroOfferContext already redirects to /payment-success,
                  // which handles course signup. So they will land there.
                }}
              />
            </motion.div>
          )}

        </AnimatePresence>
      </main>

      <Footer />
    </div>
  );
}

export default function AssessmentFunnelPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="w-10 h-10 border-4 border-[#ef4444] border-t-transparent rounded-full animate-spin" />
      </div>
    }>
      <AssessmentFunnel />
    </Suspense>
  );
}
