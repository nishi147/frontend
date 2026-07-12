"use client";

import React, { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';
import { Phone, Video, Send, Smile, RefreshCw, Brain, Sparkles, Award, Play, ArrowRight, CheckCircle, ChevronRight, MessageSquare } from 'lucide-react';

interface ChatMessage {
  id: number;
  sender: 'bot' | 'user';
  text: string;
  timestamp: string;
  cta?: {
    text: string;
    link: string;
  };
}

const CHAT_SEQUENCE: Omit<ChatMessage, 'timestamp'>[] = [
  {
    id: 1,
    sender: 'bot',
    text: "Hey there! Welcome to Ruzann! 🚀 Ready to learn coding & AI in a fun, gamified way?",
  },
  {
    id: 2,
    sender: 'user',
    text: "Absolutely! Where should I start? 🤔",
  },
  {
    id: 3,
    sender: 'bot',
    text: "First, you should take our AI Quiz! It checks your current skills and recommends the perfect learning path. 🎯",
  },
  {
    id: 4,
    sender: 'user',
    text: "Sounds awesome! What do I get after the quiz?",
  },
  {
    id: 5,
    sender: 'bot',
    text: "You'll unlock a personalized roadmap, code in our playground editor, and build real-world games with expert mentors! 💻✨",
  },
  {
    id: 6,
    sender: 'bot',
    text: "Ready to test your skills? Click the button below to start your AI Quiz now! 👇",
    cta: {
      text: "Start AI Quiz 🚀",
      link: "/ai-quiz"
    }
  }
];

export const HowToUseSection = () => {
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [currentStep, setCurrentStep] = useState<number>(0);
  const [isTyping, setIsTyping] = useState<boolean>(false);
  const [typingSender, setTypingSender] = useState<'bot' | 'user'>('bot');
  const chatContainerRef = useRef<HTMLDivElement>(null);
  const timerRef = useRef<NodeJS.Timeout | null>(null);

  // Auto-scroll chat container to bottom without scrolling parent window
  useEffect(() => {
    if (chatContainerRef.current) {
      chatContainerRef.current.scrollTop = chatContainerRef.current.scrollHeight;
    }
  }, [messages, isTyping]);

  // Start/Manage chat animation sequence
  const startChatSequence = () => {
    if (timerRef.current) clearTimeout(timerRef.current);
    setMessages([]);
    setCurrentStep(0);
    triggerNextMessage(0);
  };

  const triggerNextMessage = (stepIndex: number) => {
    if (stepIndex >= CHAT_SEQUENCE.length) {
      setIsTyping(false);
      return;
    }

    const nextMsg = CHAT_SEQUENCE[stepIndex];
    setTypingSender(nextMsg.sender);
    setIsTyping(true);

    // Simulate realistic typing speed based on length of message
    const typingDuration = Math.max(1000, nextMsg.text.length * 15);

    timerRef.current = setTimeout(() => {
      setIsTyping(false);
      const now = new Date();
      const timeStr = now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
      
      setMessages(prev => [...prev, {
        ...nextMsg,
        timestamp: timeStr
      }]);

      setCurrentStep(stepIndex + 1);

      // Delay before starting to type the next message
      timerRef.current = setTimeout(() => {
        triggerNextMessage(stepIndex + 1);
      }, 1500);

    }, typingDuration);
  };

  useEffect(() => {
    startChatSequence();
    return () => {
      if (timerRef.current) clearTimeout(timerRef.current);
    };
  }, []);

  return (
    <section className="relative py-10 lg:py-20 px-4 overflow-hidden bg-slate-50 border-t border-b border-slate-100" id="how-to-use">
      {/* Decorative Background Accents */}
      <div className="absolute inset-0 z-0 pointer-events-none overflow-hidden">
        <div className="absolute top-[10%] left-[8%] text-7xl opacity-[0.04] animate-bounce-slow">🚀</div>
        <div className="absolute bottom-[15%] left-[5%] text-7xl opacity-[0.03] animate-float">🧠</div>
        <div className="absolute top-[20%] right-[5%] text-7xl opacity-[0.04] animate-spin-slow">✨</div>
        <div className="absolute bottom-[20%] right-[10%] text-7xl opacity-[0.03] animate-bounce-slow" style={{ animationDelay: '2s' }}>🎮</div>
      </div>

      <div className="relative z-10 max-w-6xl mx-auto flex flex-col lg:flex-row items-center gap-8 lg:gap-20">
        
        {/* Left Side: Explanatory Content */}
        <div className="flex-1 text-center lg:text-left space-y-6 lg:space-y-8">
          <div className="space-y-2 lg:space-y-4">
            <div className="inline-flex items-center gap-2 px-3 py-1 lg:px-4 lg:py-2 bg-indigo-50 border border-indigo-100 rounded-full text-indigo-600 font-bold text-[10px] lg:text-xs uppercase tracking-wider shadow-sm">
              <Sparkles size={12} className="animate-pulse" />
              <span>Interactive Guide</span>
            </div>
            <h2 className="text-2xl sm:text-3xl lg:text-5xl font-black text-slate-900 leading-[1.15]">
              How to Start Your <br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary-500 via-purple-500 to-indigo-600">
                Coding Adventure
              </span>
            </h2>
            <p className="text-xs sm:text-sm lg:text-lg font-bold text-slate-500 max-w-xl hidden sm:block">
              We make learning how to code simple, visual, and extremely fun. Follow our guide to kickstart your tech journey!
            </p>
          </div>

          {/* Steps list */}
          <div className="space-y-2.5 lg:space-y-4 max-w-md mx-auto lg:mx-0">
            {/* Step 1 */}
            <div className="flex items-center lg:items-start gap-3 lg:gap-4 p-2.5 lg:p-4 bg-white rounded-2xl border border-slate-100 shadow-sm hover:translate-x-2 transition-transform duration-300">
              <div className="w-8 h-8 lg:w-10 lg:h-10 bg-primary-100 text-primary-600 rounded-xl flex items-center justify-center shrink-0 shadow-inner">
                <Brain size={16} className="lg:w-5 lg:h-5" />
              </div>
              <div className="text-left">
                <span className="text-[8px] lg:text-[10px] font-black uppercase tracking-widest text-primary-500">Step 1</span>
                <h4 className="font-bold text-slate-800 text-xs lg:text-sm">Take the AI Quiz</h4>
                <p className="text-xs text-slate-500 font-semibold mt-0.5 hidden lg:block">A 5-minute quiz to evaluate your current coding logic and skill level.</p>
              </div>
            </div>

            {/* Step 2 */}
            <div className="flex items-center lg:items-start gap-3 lg:gap-4 p-2.5 lg:p-4 bg-white rounded-2xl border border-slate-100 shadow-sm hover:translate-x-2 transition-transform duration-300">
              <div className="w-8 h-8 lg:w-10 lg:h-10 bg-yellow-100 text-yellow-600 rounded-xl flex items-center justify-center shrink-0 shadow-inner">
                <Award size={16} className="lg:w-5 lg:h-5" />
              </div>
              <div className="text-left">
                <span className="text-[8px] lg:text-[10px] font-black uppercase tracking-widest text-yellow-500">Step 2</span>
                <h4 className="font-bold text-slate-800 text-xs lg:text-sm">Get Custom Roadmap</h4>
                <p className="text-xs text-slate-500 font-semibold mt-0.5 hidden lg:block">Receive customized course recommendations designed specifically for you.</p>
              </div>
            </div>

            {/* Step 3 */}
            <div className="flex items-center lg:items-start gap-3 lg:gap-4 p-2.5 lg:p-4 bg-white rounded-2xl border border-slate-100 shadow-sm hover:translate-x-2 transition-transform duration-300">
              <div className="w-8 h-8 lg:w-10 lg:h-10 bg-indigo-100 text-indigo-600 rounded-xl flex items-center justify-center shrink-0 shadow-inner">
                <Sparkles size={16} className="lg:w-5 lg:h-5" />
              </div>
              <div className="text-left">
                <span className="text-[8px] lg:text-[10px] font-black uppercase tracking-widest text-indigo-500">Step 3</span>
                <h4 className="font-bold text-slate-800 text-xs lg:text-sm">Build & Play</h4>
                <p className="text-xs text-slate-500 font-semibold mt-0.5 hidden lg:block">Access our coding sandbox editor and complete interactive web missions.</p>
              </div>
            </div>
          </div>

          <div className="pt-2 flex flex-row flex-wrap items-center justify-center lg:justify-start gap-3">
            <Link href="/ai-quiz">
              <button className="px-5 py-3 lg:px-8 lg:py-4 bg-gradient-to-r from-primary-500 to-indigo-600 hover:from-primary-600 hover:to-indigo-700 text-white font-black rounded-xl lg:rounded-2xl shadow-xl shadow-primary-500/20 hover:shadow-primary-500/35 hover:-translate-y-0.5 active:translate-y-0 active:scale-[0.98] transition-all flex items-center gap-1.5 lg:gap-2 text-xs lg:text-base">
                Start AI Quiz <ArrowRight size={14} className="lg:w-[18px] lg:h-[18px]" />
              </button>
            </Link>
            <button 
              onClick={startChatSequence}
              className="px-4 py-3 lg:px-6 lg:py-4 bg-white border-2 border-slate-200 hover:bg-slate-50 text-slate-700 font-black rounded-xl lg:rounded-2xl hover:-translate-y-0.5 active:translate-y-0 active:scale-[0.98] transition-all flex items-center gap-1.5 lg:gap-2 shadow-sm text-xs lg:text-base"
            >
              <RefreshCw size={12} className="lg:w-4 lg:h-4" /> Replay Conversation
            </button>
          </div>
        </div>

        {/* Right Side: Interactive Smartphone Simulator */}
        <div className="flex-1 flex justify-center items-center relative w-full">
          {/* Outer glow ring */}
          <div className="absolute w-[360px] h-[360px] rounded-full bg-gradient-to-tr from-cyan-400/20 to-purple-400/20 filter blur-[50px] animate-pulse pointer-events-none" />

          {/* Smartphone Frame */}
          <div className="relative w-[320px] sm:w-[340px] h-[600px] bg-slate-900 rounded-[3rem] p-3 shadow-2xl border-[10px] border-slate-800 ring-4 ring-slate-900 ring-offset-2 ring-offset-slate-100 flex flex-col overflow-hidden">
            
            {/* Speaker & Camera Notch */}
            <div className="absolute top-0 left-1/2 -translate-x-1/2 w-32 h-6 bg-slate-800 rounded-b-2xl z-30 flex items-center justify-center">
              <div className="w-12 h-1 bg-slate-900 rounded-full mb-1"></div>
              <div className="w-2.5 h-2.5 bg-slate-950 rounded-full absolute right-8 top-1.5 border border-slate-800"></div>
            </div>

            {/* Simulated Mobile OS Screen */}
            <div className="relative w-full h-full bg-[#0b141a] rounded-[2.3rem] overflow-hidden flex flex-col text-slate-100 shadow-inner">
              
              {/* Status Bar */}
              <div className="h-7 px-6 pt-1 flex justify-between items-center text-[10px] font-bold text-slate-400 bg-slate-950/60 z-20">
                <span>11:24 AM</span>
                <div className="flex items-center gap-1.5">
                  <span className="text-[8px]">📶</span>
                  <span>100%</span>
                  <div className="w-5 h-2.5 border border-slate-500 rounded-sm p-px flex items-center">
                    <div className="h-full w-full bg-emerald-500 rounded-[1px]"></div>
                  </div>
                </div>
              </div>

              {/* Chat App Header */}
              <div className="bg-[#1f2c34] p-3 flex items-center justify-between border-b border-[#2c3e50]/30 shadow-md">
                <div className="flex items-center gap-2">
                  {/* Bot Avatar */}
                  <div className="w-9 h-9 rounded-full bg-gradient-to-tr from-primary-500 to-indigo-600 flex items-center justify-center text-white font-black text-xs relative shadow-inner">
                    R
                    <span className="absolute bottom-0 right-0 w-2.5 h-2.5 bg-emerald-500 rounded-full border-2 border-[#1f2c34]"></span>
                  </div>
                  <div className="text-left">
                    <h4 className="font-black text-xs text-white leading-tight">Ruzann Assistant</h4>
                    <p className="text-[9px] text-emerald-400 font-bold flex items-center gap-0.5">
                      Online
                    </p>
                  </div>
                </div>
                {/* Phone & Video Buttons */}
                <div className="flex items-center gap-3 text-slate-400 mr-1">
                  <button className="hover:text-white transition-colors" aria-label="Audio call">
                    <Phone size={14} className="stroke-[2.5]" />
                  </button>
                  <button className="hover:text-white transition-colors" aria-label="Video call">
                    <Video size={14} className="stroke-[2.5]" />
                  </button>
                </div>
              </div>

              {/* Chat Message Window */}
              <div ref={chatContainerRef} className="flex-1 overflow-y-auto p-3.5 space-y-3.5 scrollbar-hide flex flex-col bg-[#0b141a] bg-opacity-95">
                
                {/* Simulated Conversation date badge */}
                <div className="mx-auto bg-slate-900/60 border border-slate-800 text-slate-400 font-bold text-[8px] uppercase tracking-widest px-2.5 py-0.5 rounded-full mb-1">
                  Today
                </div>

                <AnimatePresence>
                  {messages.map((msg) => {
                    const isBot = msg.sender === 'bot';
                    return (
                      <motion.div
                        key={msg.id}
                        initial={{ opacity: 0, y: 15, scale: 0.95 }}
                        animate={{ opacity: 1, y: 0, scale: 1 }}
                        className={`flex flex-col max-w-[85%] ${isBot ? 'self-start items-start' : 'self-end items-end'}`}
                      >
                        {/* Message bubble */}
                        <div
                          className={`p-3 rounded-2xl text-xs font-semibold leading-relaxed shadow-md transition-all ${
                            isBot
                              ? 'bg-gradient-to-br from-[#0f523c] to-[#005c4b] border-l-4 border-emerald-400 text-white rounded-tl-none'
                              : 'bg-[#202c33] text-slate-200 rounded-tr-none'
                          }`}
                        >
                          <p>{msg.text}</p>
                          
                          {/* Inner CTA Button for quiz prompt */}
                          {msg.cta && (
                            <Link href={msg.cta.link} className="block mt-3">
                              <button className="w-full py-2 bg-gradient-to-r from-yellow-400 to-amber-500 hover:from-yellow-500 hover:to-amber-600 text-slate-950 font-black rounded-xl text-[10px] shadow-lg flex items-center justify-center gap-1.5 transition-all transform hover:scale-[1.03] active:scale-95">
                                {msg.cta.text}
                              </button>
                            </Link>
                          )}
                        </div>
                        {/* Timestamp */}
                        <span className="text-[8px] text-slate-500 mt-1 font-bold">
                          {msg.timestamp}
                        </span>
                      </motion.div>
                    );
                  })}
                </AnimatePresence>

                {/* Animated Typing Indicator */}
                {isTyping && (
                  <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0 }}
                    className={`flex flex-col max-w-[80%] ${
                      typingSender === 'bot' ? 'self-start items-start' : 'self-end items-end'
                    }`}
                  >
                    <div
                      className={`p-3 rounded-2xl flex items-center gap-1.5 shadow-sm ${
                        typingSender === 'bot'
                          ? 'bg-[#005c4b] rounded-tl-none'
                          : 'bg-[#202c33] rounded-tr-none'
                      }`}
                    >
                      <span className="w-1.5 h-1.5 bg-slate-300 rounded-full animate-bounce" style={{ animationDelay: '0ms' }} />
                      <span className="w-1.5 h-1.5 bg-slate-300 rounded-full animate-bounce" style={{ animationDelay: '150ms' }} />
                      <span className="w-1.5 h-1.5 bg-slate-300 rounded-full animate-bounce" style={{ animationDelay: '300ms' }} />
                    </div>
                  </motion.div>
                )}

              </div>

              {/* Chat Input Footer */}
              <div className="bg-[#1f2c34] p-2.5 flex items-center gap-2 border-t border-[#2c3e50]/20">
                <button className="text-slate-400 hover:text-white transition-colors" aria-label="Emoji selector">
                  <Smile size={18} className="stroke-[2.5]" />
                </button>
                <div className="flex-1 relative">
                  <input
                    type="text"
                    placeholder="Write a message..."
                    disabled
                    className="w-full bg-[#2a3942] rounded-full pl-3.5 pr-8 py-2 text-[10px] text-white placeholder-slate-500 focus:outline-none cursor-not-allowed border-none font-semibold"
                  />
                </div>
                <button
                  onClick={startChatSequence}
                  className="w-7 h-7 rounded-full bg-emerald-500 hover:bg-emerald-600 flex items-center justify-center text-white transition-all transform active:scale-90 shadow-md shrink-0"
                  aria-label="Send message / Restart guide"
                >
                  <Send size={11} className="stroke-[2.5] relative left-px" />
                </button>
              </div>

            </div>
          </div>
        </div>

      </div>
    </section>
  );
};
