"use client";

import React, { useState, useEffect } from 'react';
import { Header } from '@/components/layout/Header';
import { useAuth } from '@/context/AuthContext';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/Button';
import { Play, RotateCcw, Save } from 'lucide-react';

export default function MagicEditorPage() {
  const { user, loading } = useAuth();
  const router = useRouter();
  const [code, setCode] = useState('// Welcome to the Magic Editor! ✨\n// Write your JavaScript code here 🐝\n\nfunction sayHello() {\n  return "Hello, RUZANN Superstars! 🌟";\n}\n\nconsole.log("Starting up...");\nsayHello();');
  const [output, setOutput] = useState('');
  const [isSaving, setIsSaving] = useState(false);

  const saveCode = () => {
    setIsSaving(true);
    // Simulate saving to local storage or similar
    localStorage.setItem('magic_code_save', code);
    setTimeout(() => {
      alert("Magic Code Saved Successfully! ✨");
      setIsSaving(false);
    }, 1000);
  };

  useEffect(() => {
    if (!loading && !user) {
      router.push('/login');
    }
  }, [user, loading, router]);

  const runCode = () => {
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
    } catch (err: any) {
      setOutput('❌ Error: ' + err.message);
    }
  };

  const resetCode = () => {
    setCode('// Welcome to the Magic Editor! ✨\n// Write your JavaScript code here 🐝\n\nfunction sayHello() {\n  return "Hello, RUZANN Superstars! 🌟";\n}\n\nconsole.log("Starting up...");\nsayHello();');
    setOutput('');
  };

  if (loading || !user) {
    return <div className="min-h-screen flex items-center justify-center font-bold text-2xl text-primary-500 animate-bounce">Preparing the Magic Room...</div>;
  }

  return (
    <div className="min-h-screen bg-gray-900 text-white flex flex-col font-sans">
      <Header />
      
      <main className="flex-1 container mx-auto px-4 py-8 flex flex-col h-full max-h-[85vh]">
        <div className="flex items-center justify-between mb-6 border-b border-gray-700 pb-4">
          <div>
            <h1 className="text-3xl font-black text-transparent bg-clip-text bg-gradient-to-r from-green-400 to-blue-500 flex items-center gap-3">
              <span>🪄</span> Magic Code Editor
            </h1>
            <p className="text-sm font-bold text-gray-400 mt-1">Hello, {user.name}! Let's write some awesome code.</p>
          </div>
          <div className="flex gap-3">
            <Button variant="outline" className="bg-transparent border-gray-600 border-2 text-white hover:bg-gray-800 flex items-center gap-2 font-bold p-2 md:px-4" onClick={resetCode}>
              <RotateCcw className="w-5 h-5" /> <span className="hidden md:inline">Reset</span>
            </Button>
            <Button variant="outline" className="bg-transparent border-primary-600 border-2 text-primary-400 hover:bg-gray-800 flex items-center gap-2 font-bold p-2 md:px-4" onClick={saveCode} isLoading={isSaving}>
              <Save className="w-5 h-5" /> <span className="hidden md:inline">Save</span>
            </Button>
            <Button className="bg-green-500 hover:bg-green-600 text-white flex items-center gap-2 border-none font-bold text-lg p-3 md:px-8 shadow-lg shadow-green-500/20" onClick={runCode}>
              <Play className="w-5 h-5" /> <span className="hidden md:inline">Run Code</span>
            </Button>
          </div>
        </div>

        <div className="flex flex-col lg:flex-row gap-6 flex-1 min-h-[500px]">
          {/* Coding Area */}
          <div className="flex-1 bg-[#1e1e1e] rounded-2xl flex flex-col border border-gray-700 shadow-2xl relative overflow-hidden group">
            <div className="bg-[#2d2d2d] px-4 py-2 flex items-center gap-2 border-b border-gray-700">
              <div className="w-3 h-3 rounded-full bg-red-500"></div>
              <div className="w-3 h-3 rounded-full bg-yellow-500"></div>
              <div className="w-3 h-3 rounded-full bg-green-500"></div>
              <span className="ml-4 text-xs font-bold tracking-widest uppercase text-gray-400">script.js</span>
            </div>
            <textarea 
              value={code}
              onChange={e => setCode(e.target.value)}
              className="w-full flex-1 bg-transparent text-green-400 font-mono p-6 focus:outline-none resize-none"
              spellCheck="false"
              style={{ fontSize: '1.2rem', lineHeight: '1.8' }}
            />
          </div>

          {/* Output Area */}
          <div className="w-full lg:w-1/3 bg-black rounded-2xl flex flex-col border-2 border-gray-800 shadow-xl overflow-hidden">
            <div className="bg-gray-800 px-4 py-3 flex items-center gap-2 border-b border-gray-900">
              <span className="text-sm font-black tracking-widest uppercase text-gray-300">Console Output</span>
            </div>
            <div className="flex-1 p-6 font-mono text-gray-300 overflow-y-auto whitespace-pre-wrap leading-relaxed text-lg">
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
