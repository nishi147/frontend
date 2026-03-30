"use client";

import React, { useState, useEffect, useRef } from 'react';
import { Button } from '@/components/ui/Button';
import { Card } from '@/components/ui/Card';
import api from '@/utils/api';
import { useAuth } from '@/context/AuthContext';
import { Trophy, RefreshCw, Zap, Target } from 'lucide-react';

type GameState = 'idle' | 'waiting' | 'ready' | 'result' | 'early' | 'miss' | 'finished';

const TOTAL_ROUNDS = 3;
const NUM_CARDS = 6;

export const ReflexGame = () => {
  const { user } = useAuth();
  const [gameState, setGameState] = useState<GameState>('idle');
  const [round, setRound] = useState(1);
  const [scores, setScores] = useState<number[]>([]);
  const [bestScore, setBestScore] = useState<number | null>(null);
  const [startTime, setStartTime] = useState<number>(0);
  const [reactionTime, setReactionTime] = useState<number | null>(null);
  const [activeCards, setActiveCards] = useState<number[]>([]);
  
  const timerRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    // Fetch user's best score if logged in
    const fetchScore = async () => {
      if (user) {
        try {
          const res = await api.get('/api/minigames');
          if (res.data.success && res.data.data.bestScore) {
            setBestScore(res.data.data.bestScore);
          }
        } catch (err) {
          console.error("Failed to fetch minigame score", err);
        }
      }
    };
    fetchScore();
  }, [user]);

  const saveScore = async (finalBestScore: number) => {
    if (user) {
      try {
        const res = await api.post('/api/minigames', { score: finalBestScore });
        if (res.data.success && res.data.data.bestScore) {
          setBestScore(res.data.data.bestScore);
        }
      } catch (err) {
        console.error("Failed to save minigame score", err);
      }
    }
  };

  const startGame = () => {
    setGameState('waiting');
    setReactionTime(null);
    setActiveCards([]);
    const delay = Math.floor(Math.random() * 3000) + 2000; // 2 to 5 seconds
    
    timerRef.current = setTimeout(() => {
      // Pick 1 or 2 random tiles
      const numActive = Math.random() > 0.6 ? 2 : 1;
      const newActive: number[] = [];
      while (newActive.length < numActive) {
         const r = Math.floor(Math.random() * NUM_CARDS);
         if (!newActive.includes(r)) newActive.push(r);
      }
      setActiveCards(newActive);
      setGameState('ready');
      setStartTime(Date.now());
    }, delay);
  };

  const handleOverlayInteraction = () => {
    if (gameState === 'idle' || gameState === 'early' || gameState === 'miss') {
      startGame();
    } else if (gameState === 'result') {
      setRound(round + 1);
      startGame();
    } else if (gameState === 'finished') {
      resetGame();
    }
  };

  const handleCardClick = (index: number) => {
    if (gameState === 'waiting') {
      // Clicked too early
      if (timerRef.current) clearTimeout(timerRef.current);
      setGameState('early');
    } else if (gameState === 'ready') {
      if (activeCards.includes(index)) {
        // Correct click!
        const time = Date.now() - startTime;
        setReactionTime(time);
        const newScores = [...scores, time];
        setScores(newScores);
        
        if (round < TOTAL_ROUNDS) {
          setGameState('result');
        } else {
          setGameState('finished');
          // Calculate best score of session and save
          const sessionBest = Math.min(...newScores);
          if (!bestScore || sessionBest < bestScore) {
            setBestScore(sessionBest);
          }
          saveScore(sessionBest);
        }
      } else {
        // Clicked a red (inactive) card instead of green
        setGameState('miss');
      }
    }
  };

  const resetGame = () => {
    setGameState('idle');
    setRound(1);
    setScores([]);
    setReactionTime(null);
    setActiveCards([]);
  };

  // Prevent memory leaks
  useEffect(() => {
    return () => {
      if (timerRef.current) clearTimeout(timerRef.current);
    };
  }, []);

  const getOverlayStyle = () => {
    switch (gameState) {
      case 'idle': return 'bg-white/90 backdrop-blur-sm cursor-pointer hover:bg-white/95';
      case 'early': return 'bg-orange-500/95 backdrop-blur-sm text-white cursor-pointer hover:bg-orange-600/95';
      case 'miss': return 'bg-red-500/95 backdrop-blur-sm text-white cursor-pointer hover:bg-red-600/95';
      case 'result': return 'bg-blue-500/95 backdrop-blur-sm text-white cursor-pointer hover:bg-blue-600/95';
      case 'finished': return 'bg-indigo-600/95 backdrop-blur-sm text-white cursor-default';
      default: return 'hidden pointer-events-none';
    }
  };

  const getMessage = () => {
    switch (gameState) {
      case 'idle': return (
        <>
          <Target className="w-16 h-16 mx-auto mb-4 text-indigo-500" />
          <h3 className="text-3xl font-black mb-2 text-slate-800">Target Challenge!</h3>
          <p className="text-lg font-bold text-gray-500 mb-6">Wait for the green cards to appear, then click them as fast as you can.</p>
          <Button size="lg" className="animate-pulse bg-indigo-600">Click anywhere to start</Button>
        </>
      );
      case 'early': return (
        <>
          <div className="text-6xl mb-4 py-6">⚠️</div>
          <h3 className="text-3xl font-black mb-2">Too early!</h3>
          <p className="text-xl font-bold">You clicked before it turned green. Click to try again.</p>
        </>
      );
      case 'miss': return (
        <>
          <div className="text-6xl mb-4 py-6">❌</div>
          <h3 className="text-3xl font-black mb-2">Missed Target!</h3>
          <p className="text-xl font-bold">You clicked the wrong card. Click to try again.</p>
        </>
      );
      case 'result': return (
        <>
          <div className="text-6xl mb-4 py-6 drop-shadow-lg">⏱️</div>
          <h3 className="text-4xl font-black mb-2">{reactionTime} ms</h3>
          <p className="text-xl font-bold">Click anywhere to start Round {round + 1}</p>
        </>
      );
      case 'finished': {
        const avgScore = Math.floor(scores.reduce((a, b) => a + b, 0) / scores.length);
        const currentBest = Math.min(...scores);
        return (
        <div onClick={(e) => e.stopPropagation()}>
          <Trophy className="w-20 h-20 mx-auto mb-4 text-yellow-400 drop-shadow-xl" />
          <h3 className="text-4xl font-black mb-6">Challenge Completed!</h3>
          <div className="grid grid-cols-2 gap-4 max-w-sm mx-auto mb-10 bg-white/10 rounded-2xl p-6 border border-white/20">
             <div>
               <p className="text-sm font-bold opacity-80 uppercase tracking-widest mb-1">Session Best</p>
               <p className="text-3xl font-black">{currentBest} <span className="text-lg">ms</span></p>
             </div>
             <div>
               <p className="text-sm font-bold opacity-80 uppercase tracking-widest mb-1">Average</p>
               <p className="text-3xl font-black">{avgScore} <span className="text-lg">ms</span></p>
             </div>
          </div>
          
          <Button onClick={resetGame} size="lg" className="bg-white text-indigo-600 hover:bg-gray-100 font-black px-10 py-6 text-xl rounded-full shadow-xl">
            <RefreshCw className="mr-2 h-6 w-6" /> Play Again
          </Button>

          {!user && (
            <p className="mt-8 text-sm font-bold bg-white/20 p-3 rounded-xl inline-block">
              Log in to save your awesome reflexes!
            </p>
          )}
        </div>
      );
      }
      default: return null;
    }
  };

  return (
    <div className="w-full max-w-4xl mx-auto p-2 md:p-6">
      <div className="flex justify-between items-center mb-6 px-2">
         <div className="flex items-center gap-2">
            <span className="bg-indigo-100 text-indigo-700 px-4 py-2 rounded-full text-sm font-black uppercase tracking-widest shadow-sm">
              Round {round}/{TOTAL_ROUNDS}
            </span>
         </div>
         <div className="flex items-center gap-2">
           {bestScore ? (
             <span className="flex items-center gap-2 bg-yellow-100 text-yellow-700 px-4 py-2 rounded-full text-sm font-black shadow-sm">
               <Trophy size={16} /> Best: {bestScore}ms
             </span>
           ) : (
             <span className="flex items-center gap-2 bg-gray-100 text-gray-500 px-4 py-2 rounded-full text-sm font-bold shadow-sm">
               <Trophy size={16} /> No Best Score
             </span>
           )}
         </div>
      </div>

      <div className="w-full min-h-[400px] md:min-h-[500px] bg-slate-100 rounded-[3rem] p-4 md:p-6 shadow-inner relative flex justify-center items-center">
        
        {/* Full coverage overlay for non-playing moments (idle, result, early, finished) */}
        <div 
           onClick={handleOverlayInteraction}
           className={`absolute inset-0 z-20 flex flex-col justify-center items-center text-center p-8 rounded-[3rem] transition-all duration-300 ${getOverlayStyle()}`}
        >
          {getMessage()}
        </div>

        {/* The Grid of Cards */}
        <div className="w-full h-full grid grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6 z-10">
          {Array.from({ length: NUM_CARDS }).map((_, i) => {
            const isWaiting = gameState === 'waiting';
            const isReady = gameState === 'ready';
            const isActive = isReady && activeCards.includes(i);
            
            // Random equations visualization
            // Use deterministic random based on index to stop hydration or re-rendering flickering
            const ops = ['+', '-', 'x'];
            const n1 = ((round * i * 7) % 12) + 1;
            const n2 = (((round + i) * 13) % 12) + 1;
            const op = ops[(i + round) % 3];
            let ans = 0;
            if (op === '+') ans = n1 + n2;
            if (op === '-') ans = n1; // just show n1 if -, we avoid negative for simplicity by making n1+n2 the first number
            if (op === 'x') ans = n1 * n2;
            
            const equationStr = op === '-' ? `${n1 + n2} - ${n2}` : `${n1} ${op} ${n2}`;
            const wrongAns = ans + (+((i%3)+1)); 
            
            // If active and ready, we show a correct equation. Otherwise a random wrong one
            const finalEq = isActive || (!isWaiting && !isReady) ? `${equationStr} = ${ans}` : `${equationStr} = ${wrongAns}`;

            // Determine styles based on state
            let boxClass = 'bg-white border-4 border-gray-100 shadow-sm text-gray-500';
            
            if (isWaiting) {
              boxClass = 'bg-[#F2643D] text-white/80 cursor-wait shadow-xl border-[#d14f2a] animate-pulse'; 
            } else if (isReady) {
              if (isActive) {
                boxClass = 'bg-green-500 text-white cursor-crosshair shadow-[0_0_40px_rgba(34,197,94,0.6)] border-green-400 scale-[1.02] transition-transform'; // Green target
              } else {
                boxClass = 'bg-[#F2643D] text-white/80 cursor-pointer shadow-md border-[#d14f2a] opacity-90'; 
              }
            } else if (gameState === 'early' || gameState === 'miss') {
              boxClass = 'bg-gray-200 text-gray-400 border-gray-300 opacity-50 grayscale';
            } else if (gameState === 'result' || gameState === 'finished') {
              boxClass = 'bg-gray-100 text-gray-400 border-gray-200 opacity-20';
            }

            return (
              <div 
                key={i}
                onClick={(e) => {
                  e.stopPropagation();
                  handleCardClick(i);
                }}
                className={`w-full flex items-center justify-center min-h-[120px] md:min-h-[160px] rounded-[2rem] transition-all duration-200 ${boxClass}`}
              >
                  <span className="text-2xl md:text-3xl font-black font-mono pointer-events-none select-none drop-shadow-sm">
                    {finalEq}
                  </span>
              </div>
            );
          })}
        </div>
      </div>

    </div>
  );
};
