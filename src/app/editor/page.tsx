"use client";

import React, { useState, useEffect } from 'react';
import { Header } from '@/components/layout/Header';
import { useAuth } from '@/context/AuthContext';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/Button';
import { Play, RotateCcw, Save } from 'lucide-react';
import { useToast } from '@/context/ToastContext';

export default function MagicEditorPage() {
  const { user, loading } = useAuth();
  const router = useRouter();
  const starterCode = `// Try running this code! ✨
let name = "Explorer";
console.log("Hello", name, "🚀");
console.log("Welcome to your Magic Room!");`;
  
  const exampleCode = `// Here is a cool example! 🌈
let favoriteColor = "Blue";
console.log("My favorite color is", favoriteColor);
console.log("What is your favorite color?");`;

  const [code, setCode] = useState(starterCode);
  const [output, setOutput] = useState('');
  const [isSaving, setIsSaving] = useState(false);
  const [showHint, setShowHint] = useState(false);
  const [success, setSuccess] = useState(false);
  const { showToast } = useToast();

  const simplifyError = (err: string) => {
    if (err.includes('SyntaxError')) {
      return "⚠ Something went wrong! \nCheck if you missed a quote \", bracket ( ), or spelling.";
    }
    if (err.includes('ReferenceError')) {
       return "⚠ I don't know that word yet! \nCheck if you spelled everything correctly.";
    }
    return "⚠ Oops! Let's check the code together.\n" + err;
  };

  const saveCode = () => {
    setIsSaving(true);
    // Simulate saving to local storage or similar
    localStorage.setItem('magic_code_save', code);
    setTimeout(() => {
      showToast("Magic Code Saved Successfully! ✨", "success");
      setIsSaving(false);
    }, 1000);
  };

  useEffect(() => {
    if (!loading && !user) {
      router.push('/login');
    }
  }, [user, loading, router]);

  const runCode = () => {
    setSuccess(false);
    try {
      // Very basic evaluation for testing
      let logs: string[] = [];
      const originalConsoleLog = console.log;
      console.log = (...args) => {
        logs.push(args.join(' '));
        originalConsoleLog(...args);
      };
      
      // Execute
      const result = eval(code);
      
      // Restore
      console.log = originalConsoleLog;
      
      let finalOutput = logs.join('\n');
      if (result !== undefined) {
         finalOutput += (finalOutput ? '\n\n' : '') + '> Result: ' + String(result);
      }
      setOutput(finalOutput || 'Code executed successfully with no output.');
      setSuccess(true);
      showToast("🎉 Great job! Your code ran successfully.", "success");
    } catch (err: any) {
      setOutput(simplifyError(err.message));
      setSuccess(false);
    }
  };

  const resetCode = () => {
    setCode(starterCode);
    setOutput('');
    setSuccess(false);
  };

  const showExample = () => {
    setCode(exampleCode);
    showToast("Example code loaded! 📝", "info");
  };

  if (loading || !user) {
    return <div className="min-h-screen flex items-center justify-center font-bold text-2xl text-primary-500 animate-bounce">Preparing the Magic Room...</div>;
  }

  return (
    <div className="min-h-screen bg-gray-900 text-white flex flex-col font-sans">
      <Header />
      
      <main className="flex-1 w-full max-w-7xl mx-auto px-2 md:px-6 py-4 md:py-8 flex flex-col min-h-screen lg:h-full lg:max-h-[85vh]">
        <div className="flex flex-col md:flex-row md:items-center justify-between mb-6 md:mb-10 border-b border-gray-700 pb-6 gap-6 w-full">
          <div className="w-full md:w-auto">
            <h1 className="text-2xl md:text-3xl lg:text-4xl font-black text-transparent bg-clip-text bg-gradient-to-r from-green-400 to-blue-500 flex items-center gap-3 leading-tight">
              <span>🪄</span> <span>Magic Code Editor</span>
            </h1>
            <p className="text-xs md:text-sm font-bold text-gray-400 mt-1">Hello, {user.name}! Let's write some awesome code.</p>
          </div>
          <div className="flex flex-col sm:flex-row gap-3 w-full md:w-auto items-center">
            <Button variant="outline" className="bg-transparent border-gray-600 border-2 text-white hover:bg-gray-800 flex items-center justify-center gap-2 font-black p-3 md:px-5 text-sm w-full sm:w-auto" onClick={showExample}>
               <span className="text-lg md:text-xl">💡</span> Show Example
            </Button>
            <Button variant="outline" className="bg-transparent border-gray-600 border-2 text-white hover:bg-gray-800 flex items-center justify-center gap-2 font-black p-3 md:px-5 text-sm w-full sm:w-auto" onClick={resetCode}>
              <RotateCcw className="w-4 h-4 md:w-5 md:h-5" /> Reset
            </Button>
            <div className="flex flex-col gap-1 w-full sm:w-auto md:items-end">
              <Button className="bg-green-500 hover:bg-green-600 text-white flex items-center justify-center gap-2 border-none font-black text-base md:text-lg p-3 md:px-8 shadow-lg shadow-green-500/20 w-full" onClick={runCode}>
                <Play className="w-4 h-4 md:w-5 md:h-5" /> Run Code
              </Button>
              <span className="text-[10px] text-gray-500 font-bold uppercase tracking-widest hidden lg:block">Click to see the magic happen ▶</span>
            </div>
          </div>
        </div>

        {/* Kid-Friendly Hint Box */}
        <div className="mb-8 w-full">
           <div className="bg-blue-500/10 border-2 border-blue-500/20 rounded-2xl p-4 flex flex-col sm:flex-row items-center justify-between gap-4">
              <div className="flex items-center gap-4 w-full">
                 <div className="w-10 h-10 bg-blue-500 rounded-full flex-shrink-0 flex items-center justify-center text-xl shadow-lg shadow-blue-500/20">💡</div>
                 <div className="flex-1">
                    <h3 className="text-blue-400 font-black text-[10px] md:text-xs uppercase tracking-widest text-left">Teacher's Hint</h3>
                    <p className="text-gray-300 font-bold text-xs md:text-base text-left leading-tight">Change the text inside the quotes (" ") and click Run!</p>
                 </div>
              </div>
              <Button 
                variant="outline" 
                size="sm" 
                className="bg-gray-800 border-gray-700 text-xs font-black w-full sm:w-auto py-2 md:py-3 px-6"
                onClick={() => setShowHint(!showHint)}
              >
                {showHint ? "Hide Tip" : "Need Help?"}
              </Button>
           </div>
           {showHint && (
             <div className="mt-4 p-4 bg-yellow-500/10 border-2 border-yellow-500/20 rounded-xl animate-in fade-in zoom-in duration-300">
                <p className="text-yellow-400 font-bold text-xs md:text-base">🌟 Pro Tip: Make sure your text is inside the quotes like this: "Hello!"</p>
             </div>
           )}
        </div>

        <div className="flex flex-col lg:flex-row gap-6 flex-1 min-h-[500px] w-full overflow-hidden">
          {/* Coding Area */}
          <div className="flex-1 bg-[#1e1e1e] rounded-2xl flex flex-col border border-gray-700 shadow-2xl relative overflow-hidden group w-full">
            <div className="bg-[#2d2d2d] px-4 py-2 flex items-center gap-2 border-b border-gray-700">
              <div className="w-3 h-3 rounded-full bg-red-500"></div>
              <div className="w-3 h-3 rounded-full bg-yellow-500"></div>
              <div className="w-3 h-3 rounded-full bg-green-500"></div>
              <span className="ml-4 text-xs font-bold tracking-widest uppercase text-gray-400">script.js</span>
            </div>
            <textarea 
              value={code}
              onChange={e => setCode(e.target.value)}
              className="w-full flex-1 bg-transparent text-green-400 font-mono p-4 md:p-6 focus:outline-none resize-none"
              spellCheck="false"
              style={{ fontSize: '1rem', lineHeight: '1.6' }}
            />
          </div>

          {/* Output Area */}
          <div className="w-full lg:w-1/3 bg-black rounded-2xl flex flex-col border-2 border-gray-800 shadow-xl overflow-hidden">
            <div className="bg-gray-800 px-4 py-3 flex items-center gap-2 border-b border-gray-900">
              <span className="text-sm font-black tracking-widest uppercase text-gray-300">Console Output</span>
            </div>
            <div className="flex-1 p-6 font-mono text-gray-300 overflow-y-auto whitespace-pre-wrap leading-relaxed text-lg">
              {success && (
                <div className="mb-4 p-3 bg-green-500/20 border border-green-500/30 rounded-lg text-green-400 font-bold animate-in bounce-in duration-500">
                   🎉 Great job! Your code ran successfully! <br/>
                   <span className="text-xs opacity-70 italic font-medium">Try changing the text and run it again.</span>
                </div>
              )}
              {output || (
                 <div className="text-gray-600 italic">Press "Run Code" to see the magic happen! ✨</div>
              )}
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
