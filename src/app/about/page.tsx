"use client";

import React from 'react';
import { Header } from '@/components/layout/Header';
import { Card } from '@/components/ui/Card';

export default function AboutPage() {
  return (
    <div className="min-h-screen bg-background flex flex-col font-sans">
      <Header />
      
      {/* 1. What RUZANN is and its mission */}
      <section className="py-20 px-4 relative flex items-center justify-center min-h-[60vh] overflow-hidden">
        {/* Playful background Blobs */}
        <div className="absolute top-0 right-10 w-80 h-80 bg-primary-200 rounded-full mix-blend-multiply filter blur-3xl opacity-50 animate-float" />
        <div className="absolute bottom-10 left-10 w-96 h-96 bg-secondary-200 rounded-full mix-blend-multiply filter blur-3xl opacity-50 animate-float" style={{ animationDelay: '2s' }} />
        
        <div className="max-w-4xl mx-auto text-center relative z-10">
          <div className="inline-block mb-6 px-6 py-2 rounded-full border-2 border-primary-200 bg-primary-50 text-primary-600 font-bold uppercase tracking-widest text-sm shadow-sm">
            Our Mission 🚀
          </div>
          <h1 className="text-5xl md:text-7xl font-black text-gray-800 tracking-tight leading-tight mb-8">
            Empowering the Next Generation of <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary-500 to-secondary-500">Superstars</span>
          </h1>
          <p className="text-xl md:text-2xl text-gray-600 font-bold mb-8 leading-relaxed max-w-3xl mx-auto">
            At RUZANN, we believe that learning should be as magical as playing a game. 
            We are building an enchanting digital ecosystem where children from ages 5-18 fall in love with education every single day.
          </p>
        </div>
      </section>

      {/* 2. How the platform helps kids learn */}
      <section className="py-24 px-4 bg-gradient-to-b from-white to-gray-50 border-t-4 border-dashed border-gray-200">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-black text-gray-800 mb-6">How We Make Learning <span className="text-accent-500">Magical</span> ✨</h2>
            <p className="text-xl font-bold text-gray-500 max-w-2xl mx-auto">We combine top-tier pedagogy with engaging interactivity to create an unforgettable experience.</p>
          </div>

          <div className="space-y-16">
            {/* Feature 1 */}
            <div className="flex flex-col md:flex-row items-center gap-12 bg-white rounded-[3rem] p-8 md:p-12 shadow-xl border-b-8 border-primary-500 hover:-translate-y-2 transition-transform">
               <div className="w-48 h-48 bg-primary-100 rounded-full flex items-center justify-center text-7xl shrink-0">
                 🎮
               </div>
               <div>
                  <h3 className="text-3xl font-black text-primary-700 mb-4">Fun & Game-Based Flow</h3>
                  <p className="text-lg text-gray-600 font-semibold leading-relaxed">
                    Gone are the days of boring textbooks. Our platform introduces concepts through storytelling, quests, and rewards. 
                    Every lesson completed earns them badges, unlocking their true potential while they enjoy the process.
                  </p>
               </div>
            </div>

            {/* Feature 2 */}
            <div className="flex flex-col md:flex-row-reverse items-center gap-12 bg-white rounded-[3rem] p-8 md:p-12 shadow-xl border-b-8 border-secondary-500 hover:-translate-y-2 transition-transform">
               <div className="w-48 h-48 bg-secondary-100 rounded-full flex items-center justify-center text-7xl shrink-0">
                 💻
               </div>
               <div className="text-right">
                  <h3 className="text-3xl font-black text-secondary-700 mb-4">Interactive Coding for Kids</h3>
                  <p className="text-lg text-gray-600 font-semibold leading-relaxed">
                    With our Magic Code Editor, kids can dive safely into the world of programming. They see real-time 
                    results of their code, transitioning smoothly from block-based programming to actual Python and JavaScript 
                    syntaxes in a completely secure browser environment.
                  </p>
               </div>
            </div>

            {/* Feature 3 */}
            <div className="flex flex-col md:flex-row items-center gap-12 bg-white rounded-[3rem] p-8 md:p-12 shadow-xl border-b-8 border-accent-500 hover:-translate-y-2 transition-transform">
               <div className="w-48 h-48 bg-accent-100 rounded-full flex items-center justify-center text-7xl shrink-0">
                 👩‍🏫
               </div>
               <div>
                  <h3 className="text-3xl font-black text-accent-700 mb-4">Live Expert Mentorship</h3>
                  <p className="text-lg text-gray-600 font-semibold leading-relaxed">
                    Children learn best when guided. Our curated teachers host interactive live sessions where students 
                    can ask questions, collaborate with peers, and receive personalized feedback in real-time. We ensure 
                    that no child is left behind.
                  </p>
               </div>
            </div>
          </div>
        </div>
      </section>
      
      {/* Footer Teaser */}
      <footer className="bg-gray-900 py-12 px-4 text-center mt-auto">
        <p className="text-gray-400 font-bold">© {new Date().getFullYear()} RUZANN EdTech. Sparking curiosity everywhere. 🌍</p>
      </footer>
    </div>
  );
}
