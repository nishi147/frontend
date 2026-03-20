"use client";

import React from 'react';
import { Sparkles, Rocket, Star, Trophy } from 'lucide-react';

export const MovingBanner = () => {
  const messages = [
    { text: "Winter Coding Bootcamp is LIVE! 🚀", icon: Rocket, color: "text-white" },
    { text: "Join 10,000+ Happy Explorers! ✨", icon: Sparkles, color: "text-yellow-300" },
    { text: "Get your First Trial Session for just ₹1 🎁", icon: Trophy, color: "text-white" },
    { text: "New Courses in AI & Robotics! 🤖", icon: Star, color: "text-secondary-300" },
    { text: "Learning is Fun with RUZANN! 🎨", icon: Sparkles, color: "text-white" },
  ];

  // Repeat the messages to ensure a seamless loop
  const repeatedMessages = [...messages, ...messages, ...messages];

  return (
    <div className="w-full bg-[#6C5CE7] py-2.5 overflow-hidden border-b border-white/10 relative z-[150]">
      <div className="flex animate-marquee whitespace-nowrap items-center">
        {repeatedMessages.map((msg, i) => (
          <div key={i} className="flex items-center gap-3 px-8">
            <msg.icon size={16} className={msg.color} />
            <span className={`text-[11px] md:text-xs font-black uppercase tracking-[0.15em] ${msg.color}`}>
              {msg.text}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
};
