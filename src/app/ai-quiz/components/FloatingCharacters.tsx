import React from 'react';
import { motion } from 'framer-motion';

interface FloatingItem {
  emoji: string;
  size: string;
  className: string; // positioning classes
  delay: number;
  duration: number;
}

export default function FloatingCharacters() {
  const items: FloatingItem[] = [
    { emoji: "🤖", size: "text-4xl md:text-5xl", className: "top-16 left-4 md:left-8", delay: 0, duration: 6 },
    { emoji: "🚀", size: "text-5xl md:text-6xl", className: "top-12 right-4 md:right-12", delay: 1, duration: 7 },
    { emoji: "🧠", size: "text-4xl md:text-5xl", className: "bottom-1/3 left-2 md:left-10 hidden md:block", delay: 2, duration: 8 },
    { emoji: "🎮", size: "text-4xl md:text-5xl", className: "bottom-1/3 right-2 md:right-12 hidden md:block", delay: 1.5, duration: 9 },
    { emoji: "🧩", size: "text-4xl md:text-5xl", className: "bottom-8 left-6 md:left-16 hidden lg:block", delay: 0.5, duration: 7.5 },
    { emoji: "👾", size: "text-5xl md:text-6xl", className: "bottom-10 right-6 md:right-20 hidden lg:block", delay: 2.5, duration: 6.5 },
    { emoji: "⚡", size: "text-3xl md:text-4xl", className: "top-1/4 left-1/4 hidden xl:block", delay: 3, duration: 5.5 },
    { emoji: "💻", size: "text-3xl md:text-4xl", className: "top-1/4 right-1/4 hidden xl:block", delay: 3.5, duration: 8.2 },
  ];

  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none z-0">
      {items.map((item, idx) => (
        <motion.div
          key={idx}
          className={`absolute pointer-events-auto select-none ${item.className}`}
          initial={{ opacity: 0, scale: 0.5 }}
          animate={{
            opacity: 0.25,
            scale: 1,
            y: [0, -18, 0],
            x: [0, 8, 0],
            rotate: [0, 8, -8, 0]
          }}
          transition={{
            opacity: { duration: 0.5, delay: item.delay * 0.2 },
            scale: { duration: 0.5, delay: item.delay * 0.2 },
            y: {
              duration: item.duration,
              repeat: Infinity,
              repeatType: "mirror" as const,
              ease: "easeInOut",
              delay: item.delay,
            },
            x: {
              duration: item.duration * 1.2,
              repeat: Infinity,
              repeatType: "mirror" as const,
              ease: "easeInOut",
              delay: item.delay,
            },
            rotate: {
              duration: item.duration * 1.5,
              repeat: Infinity,
              repeatType: "mirror" as const,
              ease: "easeInOut",
              delay: item.delay,
            }
          }}
          drag
          dragConstraints={{ left: 0, right: 0, top: 0, bottom: 0 }}
          dragElastic={0.6}
          dragTransition={{ bounceStiffness: 400, bounceDamping: 25 }}
          whileHover={{ 
            opacity: 0.85, 
            scale: 1.3, 
            rotate: 15,
            cursor: "grab",
            transition: { duration: 0.2 } 
          }}
          whileTap={{ 
            scale: 0.95, 
            cursor: "grabbing" 
          }}
        >
          <span className={`${item.size} block filter drop-shadow-sm`}>
            {item.emoji}
          </span>
        </motion.div>
      ))}
    </div>
  );
}
