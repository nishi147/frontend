"use client";

import React, { useState } from 'react';
import dynamic from 'next/dynamic';
import { Button } from '@/components/ui/Button';
import { Zap, Play } from 'lucide-react';

// Lazy load the game so we don't block the main JS payload
const ReflexGame = dynamic(() => import('../game/ReflexGame').then(mod => mod.ReflexGame), {
  loading: () => <div className="animate-pulse bg-gray-100 rounded-3xl h-96 w-full flex items-center justify-center"><p className="text-xl font-bold text-gray-400">Loading Game Assets...</p></div>,
  ssr: false
});

export const PlayAndLearnSection = () => {
  const [isPlaying, setIsPlaying] = useState(false);

  return (
    <section className="relative py-24 px-4 overflow-hidden container mx-auto" id="play-and-learn">
      
      {/* Decorative BrightChamps-inspired Floating Elements */}
      <div className="absolute inset-0 z-0 pointer-events-none overflow-hidden hidden md:block">
        <div className="absolute top-[10%] left-[5%] text-6xl opacity-20 hover:opacity-80 hover:scale-125 transition-all duration-300 animate-wiggle">🚀</div>
        <div className="absolute top-[20%] right-[10%] text-6xl opacity-20 hover:opacity-80 hover:scale-125 transition-all duration-300 animate-bounce-slow">💡</div>
        <div className="absolute bottom-[20%] left-[10%] text-7xl opacity-20 hover:opacity-80 hover:scale-125 transition-all duration-300 animate-float">🧩</div>
        <div className="absolute bottom-[10%] right-[5%] text-6xl opacity-20 hover:opacity-80 hover:scale-125 transition-all duration-300 animate-spin-slow">⚛️</div>
        
        {/* Techy Dots / Geometric Shapes */}
        <div className="absolute top-[50%] left-[15%] w-4 h-4 rounded-full bg-yellow-400 opacity-50 animate-ping"></div>
        <div className="absolute top-[30%] right-[25%] w-3 h-3 rounded-full bg-indigo-500 opacity-50 animate-ping" style={{ animationDelay: '1s' }}></div>
        <div className="absolute bottom-[40%] left-[25%] w-6 h-6 border-4 border-pink-400 opacity-40 rotate-45"></div>
        <div className="absolute bottom-[30%] right-[20%] w-0 h-0 border-l-[10px] border-r-[10px] border-b-[20px] border-l-transparent border-r-transparent border-b-cyan-400 opacity-40 -rotate-12 animate-float"></div>
      </div>

      <div className="relative z-10 flex flex-col items-center justify-center text-center max-w-4xl mx-auto">
        <div className="inline-flex items-center gap-2 px-4 py-2 bg-yellow-100 rounded-full text-yellow-600 font-bold mb-3 shadow-sm border border-yellow-200">
          <Zap size={16} />
          <span className="text-sm">Play & Learn</span>
        </div>
        
        <h2 className="text-4xl md:text-6xl font-black text-gray-800 leading-tight mb-4">
          Test Your <span className="text-yellow-500">Reflexes!</span> ⚡
        </h2>
        <p className="text-lg font-bold text-gray-500 md:max-w-2xl mx-auto mb-10">
          How fast are you? Play this quick reaction mini-game. Set new high scores and prove you are the fastest!
        </p>
      </div>

      <div className="max-w-5xl mx-auto bg-gradient-to-br from-indigo-50 to-blue-50 rounded-[3rem] p-4 md:p-8 border-4 border-white shadow-[0_8px_30px_rgb(0,0,0,0.06)] relative overflow-hidden">
         {/* Decorative Background Elements */}
         <div className="absolute -top-24 -right-24 w-64 h-64 bg-indigo-200 rounded-full mix-blend-multiply opacity-30 animate-pulse pointer-events-none" />
         <div className="absolute -bottom-24 -left-24 w-64 h-64 bg-cyan-200 rounded-full mix-blend-multiply opacity-30 animate-pulse pointer-events-none" style={{ animationDelay: '1.5s' }} />
         
         {!isPlaying ? (
           <div className="flex flex-col items-center justify-center min-h-[400px] relative z-10 text-center">
              <div className="w-32 h-32 bg-white rounded-full flex items-center justify-center text-5xl shadow-xl mb-6 animate-bounce">
                🎮
              </div>
              <h3 className="text-3xl font-black text-slate-800 mb-2">Ready, Set, Go!</h3>
              <p className="text-gray-500 font-semibold mb-8 max-w-sm">
                Compete against yourself. It only takes a few seconds. Do you have what it takes?
              </p>
              
              <Button 
                onClick={() => setIsPlaying(true)} 
                size="lg" 
                className="bg-indigo-600 text-white font-black hover:bg-indigo-700 px-10 py-6 text-xl rounded-full shadow-lg shadow-indigo-600/30 flex items-center gap-3 transition-transform hover:scale-105"
              >
                <Play className="fill-white w-5 h-5" /> Play Now
              </Button>
           </div>
         ) : (
           <div className="relative z-10">
             <ReflexGame />
           </div>
         )}
      </div>
    </section>
  );
};
