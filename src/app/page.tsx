"use client";

import React, { useState, useEffect } from 'react';
import { Header } from '@/components/layout/Header';
import { Button } from '@/components/ui/Button';
import { Card, CardTitle, CardContent } from '@/components/ui/Card';
import Link from 'next/link';
import axios from 'axios';
import { useAuth } from '@/context/AuthContext';
import { UserIcon } from 'lucide-react'; // Assuming UserIcon is from lucide-react or similar

const HERO_IMAGES = [
  '/kid_coding_illustration_1773305191930.png',
  '/kid_reading_illustration_1773305278467.png',
  '/kindergarten_kids_learning_1_1773301524384.png'
];

export default function Home() {
  const { user } = useAuth();
  const [currentSlide, setCurrentSlide] = useState(0);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [introData, setIntroData] = useState({
    studentName: '',
    parentName: '',
    email: '',
    phone: '',
    age: '',
  });

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % HERO_IMAGES.length);
    }, 5000);
    return () => clearInterval(timer);
  }, []);

  useEffect(() => {
    // Load Razorpay Script
    const script = document.createElement('script');
    script.src = 'https://checkout.razorpay.com/v1/checkout.js';
    script.async = true;
    document.body.appendChild(script);
  }, []);

  const handleClaimOffer = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsProcessing(true);
    try {
      // 1. Create Order on Backend
      const res = await axios.post('https://backend-1-5cs8.onrender.com/api/payments/intro-order', introData);
      
      const { id: orderId, amount, currency } = res.data.data;

      const key = process.env.NEXT_PUBLIC_RAZORPAY_KEY;
      if (!key) {
        alert("Razorpay Key is missing! Please set NEXT_PUBLIC_RAZORPAY_KEY in your .env.local and restart the server.");
        setIsProcessing(false);
        return;
      }

      // 2. Open Razorpay Checkout
      const options = {
        key: key,
        amount: amount,
        currency: currency,
        name: "RUZANN EdTech",
        description: "₹1 Introductory Offer",
        order_id: orderId,
        handler: async function (response: any) {
          try {
            const verifyRes = await axios.post('https://backend-1-5cs8.onrender.com/api/payments/intro-verify', {
              ...response,
              ...introData
            });
            if (verifyRes.data.success) {
              alert("Payment Successful! Welcome to RUZANN family. Check your email for details.");
              setIsModalOpen(false);
            }
          } catch (err) {
            console.error(err);
            alert("Verification failed. Please contact support.");
          }
        },
        prefill: {
          name: introData.parentName,
          email: introData.email,
          contact: introData.phone,
        },
        theme: {
          color: "#FF9F1C",
        },
      };

      const rzp1 = new (window as any).Razorpay(options);
      rzp1.open();
    } catch (error: any) {
      console.error(error);
      alert(error.response?.data?.message || "Failed to initiate payment. Please try again.");
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <div className="min-h-screen bg-background flex flex-col font-sans overflow-hidden">
      <Header />
      
      {/* 1. HERO SECTION WITH IMAGE SLIDER */}
      <section className="relative flex min-h-[90vh] items-center justify-center p-4 overflow-hidden">
        {/* Background Images Slider */}
        {HERO_IMAGES.map((img, idx) => (
          <div 
            key={idx}
            className={`absolute inset-0 transition-opacity duration-1500 ease-in-out ${idx === currentSlide ? 'opacity-100' : 'opacity-0'}`}
          >
            <div className="absolute inset-0 bg-gradient-to-b from-white/80 via-white/20 to-white/80 z-10" />
            <img src={img} alt="Hero Slider" className="w-full h-full object-cover" />
          </div>
        ))}

        <div className="absolute top-10 left-10 w-96 h-96 bg-primary-200 rounded-full mix-blend-multiply filter blur-3xl opacity-30 animate-float z-0" />
        <div className="absolute bottom-10 right-10 w-80 h-80 bg-secondary-200 rounded-full mix-blend-multiply filter blur-3xl opacity-30 animate-float z-0" style={{ animationDelay: '2s' }} />

        <div className="relative z-20 max-w-6xl mx-auto text-center px-4">
          <div className="inline-flex items-center gap-3 mb-10 px-8 py-3 rounded-full border-4 border-white bg-white/60 backdrop-blur-md text-primary-700 font-black uppercase tracking-widest text-lg shadow-xl hover:scale-105 transition-transform cursor-pointer">
            <span className="text-2xl">🌟</span> The Most Fun Learning Adventure Ever!
          </div>
          
          <h1 className="text-6xl md:text-9xl font-black text-gray-800 tracking-tight leading-[1] mb-10 drop-shadow-xl">
            Where Kids <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary-500 via-secondary-500 to-accent-500 animate-pulse inline-block transform hover:scale-110 transition-transform">GROW</span> and Glow!
          </h1>
          
          <p className="text-2xl md:text-4xl text-gray-700 font-black mb-14 max-w-4xl mx-auto leading-tight drop-shadow-sm px-4">
            Interactive courses, live classes, and magic coding projects for curious minds.
          </p>
          
          <div className="flex flex-col sm:flex-row items-center justify-center gap-8 scale-110">
            <Link href="/courses">
              <Button size="lg" className="text-2xl px-16 py-8 animate-bounce-slow">
                Start Learning 🚀
              </Button>
            </Link>
            
            <Button 
              variant="secondary"
              size="lg"
              onClick={() => setIsModalOpen(true)}
              className="text-2xl px-16 py-8"
            >
              Claim ₹1 Offer ✨
            </Button>
          </div>
        </div>
      </section>

      {/* 2. ENHANCED ₹1 ATTRACTIVE SECTION */}
      <section className="relative py-32 px-4 overflow-hidden">
        <div className="absolute inset-0 bg-accent-500 -skew-y-3 origin-left z-0" />
        <div className="absolute inset-0 bg-yellow-400 -skew-y-3 origin-right opacity-50 translate-y-4 z-0" />
        
        <div className="relative z-10 max-w-7xl mx-auto flex flex-col lg:flex-row items-center justify-between gap-16">
           <div className="text-white flex-1 text-center lg:text-left">
              <div className="inline-block bg-white text-accent-600 text-lg font-black tracking-widest uppercase px-6 py-2 rounded-full mb-8 shadow-lg animate-pulse">
                LIMITED TIME MAGIC
              </div>
              <h2 className="text-6xl md:text-8xl font-black mb-8 leading-[0.9]">
                Get Your First <br/>
                Lesson for <span className="text-yellow-200 inline-block -rotate-6 scale-125 mx-4 drop-shadow-xl">₹1</span>
              </h2>
              <div className="flex flex-wrap gap-4 justify-center lg:justify-start mb-8 font-bold text-xl">
                <span className="flex items-center gap-2 bg-white/20 backdrop-blur-sm px-4 py-2 rounded-xl">✓ No Commitments</span>
                <span className="flex items-center gap-2 bg-white/20 backdrop-blur-sm px-4 py-2 rounded-xl">✓ Full Access</span>
                <span className="flex items-center gap-2 bg-white/20 backdrop-blur-sm px-4 py-2 rounded-xl">✓ Certification</span>
              </div>
              <p className="text-2xl font-bold text-accent-100 max-w-xl">Join 10,000+ happy parents who started their child's tech journey with RUZANN.</p>
           </div>
           
           <Card className="w-full lg:w-[450px] bg-white p-10 rounded-[3rem] shadow-2xl border-4 border-yellow-200 transform hover:scale-105 transition-all">
             <div className="text-center mb-8">
               <div className="text-5xl mb-4">🎁</div>
               <h3 className="text-3xl font-black text-gray-800">Special Gift Box</h3>
               <p className="text-gray-500 font-bold">Fill details to unlock the offer</p>
             </div>
             
             <button 
               onClick={() => setIsModalOpen(true)}
               className="bg-accent-500 text-white w-full py-6 rounded-2xl text-2xl font-black shadow-xl hover:bg-accent-600 transition-all border-b-8 border-accent-700 active:border-b-0 active:translate-y-2 flex items-center justify-center gap-3"
             >
               Go Magic! ₹1 🚀
             </button>
             
             <div className="mt-8 pt-8 border-t-2 border-gray-100 flex items-center justify-center gap-4 text-gray-400 font-bold">
               <span className="text-xs uppercase">Trusted by</span>
               <div className="flex -space-x-3">
                 {[1,2,3,4].map(i => <div key={i} className="w-10 h-10 rounded-full border-2 border-white bg-gray-200 flex items-center justify-center text-[10px]"><UserIcon className="w-4 h-4" /></div>)}
                 <div className="w-10 h-10 rounded-full border-2 border-white bg-secondary-500 text-white flex items-center justify-center text-[10px] font-black">+10k</div>
               </div>
             </div>
           </Card>
        </div>
      </section>

      {/* ₹1 Offer Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/60 backdrop-blur-md">
          <Card className="w-full max-w-xl bg-white overflow-hidden animate-bounce-in">
             <div className="bg-gradient-to-r from-accent-400 to-accent-500 p-8 text-white relative">
                <button 
                  onClick={() => setIsModalOpen(false)}
                  className="absolute top-4 right-4 text-white/80 hover:text-white font-black text-2xl"
                >✕</button>
                <h2 className="text-3xl font-black mb-2">Start Learning at ₹1 Only! 🐝</h2>
                <p className="font-bold text-accent-100">Book Your Seat for a magical future.</p>
             </div>
             <CardContent className="p-8">
                <form onSubmit={handleClaimOffer} className="grid grid-cols-1 md:grid-cols-2 gap-4">
                   <div className="flex flex-col gap-1">
                      <label className="text-sm font-bold text-gray-600 ml-1">Student Name</label>
                      <input 
                        required
                        type="text"
                        className="w-full px-4 py-3 rounded-xl border-2 border-gray-100 focus:border-accent-400 focus:outline-none font-semibold"
                        placeholder="Kid's Name"
                        value={introData.studentName}
                        onChange={e => setIntroData({...introData, studentName: e.target.value})}
                      />
                   </div>
                   <div className="flex flex-col gap-1">
                      <label className="text-sm font-bold text-gray-600 ml-1">Parent Name</label>
                      <input 
                        required
                        type="text"
                        className="w-full px-4 py-3 rounded-xl border-2 border-gray-100 focus:border-accent-400 focus:outline-none font-semibold"
                        placeholder="Guardian's Name"
                        value={introData.parentName}
                        onChange={e => setIntroData({...introData, parentName: e.target.value})}
                      />
                   </div>
                   <div className="flex flex-col gap-1">
                      <label className="text-sm font-bold text-gray-600 ml-1">Email</label>
                      <input 
                        required
                        type="email"
                        className="w-full px-4 py-3 rounded-xl border-2 border-gray-100 focus:border-accent-400 focus:outline-none font-semibold"
                        placeholder="parent@email.com"
                        value={introData.email}
                        onChange={e => setIntroData({...introData, email: e.target.value})}
                      />
                   </div>
                   <div className="flex flex-col gap-1">
                      <label className="text-sm font-bold text-gray-600 ml-1">Phone Number</label>
                      <input 
                        required
                        type="tel"
                        className="w-full px-4 py-3 rounded-xl border-2 border-gray-100 focus:border-accent-400 focus:outline-none font-semibold"
                        placeholder="+91 00000 00000"
                        value={introData.phone}
                        onChange={e => setIntroData({...introData, phone: e.target.value})}
                      />
                   </div>
                   <div className="flex flex-col gap-1 md:col-span-2">
                      <label className="text-sm font-bold text-gray-600 ml-1">Student Age</label>
                      <input 
                        required
                        type="number"
                        min="5"
                        max="18"
                        className="w-full px-4 py-3 rounded-xl border-2 border-gray-100 focus:border-accent-400 focus:outline-none font-semibold"
                        placeholder="Age (5-18)"
                        value={introData.age}
                        onChange={e => setIntroData({...introData, age: e.target.value})}
                      />
                   </div>
                   <Button 
                     type="submit" 
                     className="md:col-span-2 mt-4 bg-accent-500 hover:bg-accent-600 text-white border-none py-6 rounded-2xl text-xl font-black shadow-lg shadow-accent-200"
                     isLoading={isProcessing}
                   >
                     Pay ₹1 & Start Adventure 🚀
                   </Button>
                </form>
             </CardContent>
          </Card>
        </div>
      )}

      {/* 2.5 FEATURED DUMMY COURSES SECTION */}
      <section className="py-24 px-4 container mx-auto" id="featured-courses">
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-6xl font-black text-gray-800 mb-6">Popular <span className="text-secondary-500">Adventures</span> 🌈</h2>
          <p className="text-xl font-bold text-gray-500">Pick a path and start your magical journey today!</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10">
          {[
            { title: "Generative AI for Kids", desc: "Learn how to talk to AI and create amazing art and stories!", price: 499, sessions: 8, color: "bg-blue-100", border: "border-primary-400" },
            { title: "Introduction to Coding", desc: "The basics of logic and building your very first programs.", price: 599, sessions: 10, color: "bg-purple-100", border: "border-secondary-400" },
            { title: "Scratch Programming", desc: "Drag, drop, and build your own interactive games!", price: 399, sessions: 6, color: "bg-orange-100", border: "border-accent-400" },
            { title: "Fun Math & Logic", desc: "Solve puzzles and riddles that make math your superpower.", price: 299, sessions: 5, color: "bg-green-100", border: "border-green-400" },
            { title: "Web Dev for Kids", desc: "Build your very own website from scratch using HTML & CSS.", price: 699, sessions: 12, color: "bg-yellow-100", border: "border-yellow-400" },
            { title: "Creative Storytelling", desc: "Use digital tools to bring your imagination to life.", price: 349, sessions: 6, color: "bg-pink-100", border: "border-pink-400" },
          ].map((course, i) => (
            <Card key={i} className={`p-8 hover:-translate-y-4 transition-all duration-300 border-b-8 ${course.border} flex flex-col h-full bg-white`}>
              <div className={`h-40 rounded-3xl ${course.color} mb-6 flex items-center justify-center text-6xl shadow-inner`}>
                {i === 0 ? "🤖" : i === 1 ? "💻" : i === 2 ? "🐱" : i === 3 ? "🧩" : i === 4 ? "🌐" : "📚"}
              </div>
              <h3 className="text-2xl font-black text-gray-800 mb-4">{course.title}</h3>
              <p className="text-gray-500 font-bold mb-6 flex-1 line-clamp-3">{course.desc}</p>
              <div className="pt-6 border-t border-gray-100 flex items-center justify-between">
                <div>
                  <div className="text-xs font-black text-gray-400 uppercase tracking-widest">{course.sessions} Sessions</div>
                  <div className="text-2xl font-black text-secondary-600">₹{course.price}</div>
                </div>
                <Link href="/register">
                  <Button size="sm" variant="secondary" className="font-black px-6">Enrol 🚀</Button>
                </Link>
              </div>
            </Card>
          ))}
        </div>
      </section>

      {/* 3. ABOUT RUZANN SECTION */}
      <section className="py-24 px-4 container mx-auto" id="about">
         <div className="text-center max-w-3xl mx-auto mb-16">
           <h2 className="text-4xl md:text-6xl font-black text-gray-800 mb-6">Why kids love <span className="text-primary-500">RUZANN</span>?</h2>
           <p className="text-xl font-bold text-gray-500">We make education an enchanting experience, combining play with meaningful skill-building.</p>
         </div>

         <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
            <div className="bg-blue-50 border-b-8 border-primary-500 p-10 rounded-[3rem] text-center hover:-translate-y-4 transition-transform duration-300">
              <div className="w-24 h-24 bg-white rounded-full flex items-center justify-center text-5xl mx-auto mb-6 shadow-md shadow-primary-200">🎮</div>
              <h3 className="text-2xl font-black text-primary-700 mb-4">Game-Based Learning</h3>
              <p className="text-gray-600 font-semibold text-lg">Every lesson feels like a mission. Complete quests and earn badges!</p>
            </div>
            
            <div className="bg-purple-50 border-b-8 border-secondary-500 p-10 rounded-[3rem] text-center hover:-translate-y-4 transition-transform duration-300 md:mt-12">
              <div className="w-24 h-24 bg-white rounded-full flex items-center justify-center text-5xl mx-auto mb-6 shadow-md shadow-secondary-200">👨‍🏫</div>
              <h3 className="text-2xl font-black text-secondary-700 mb-4">Live Mentorship</h3>
              <p className="text-gray-600 font-semibold text-lg">Learn directly from top educators in small, interactive live sessions.</p>
            </div>
            
            <div className="bg-yellow-50 border-b-8 border-accent-500 p-10 rounded-[3rem] text-center hover:-translate-y-4 transition-transform duration-300">
              <div className="w-24 h-24 bg-white rounded-full flex items-center justify-center text-5xl mx-auto mb-6 shadow-md shadow-accent-200">🏆</div>
              <h3 className="text-2xl font-black text-accent-700 mb-4">Real Skills</h3>
              <p className="text-gray-600 font-semibold text-lg">From coding to creativity, kids learn skills that matter for their future.</p>
            </div>
          </div>
      </section>

      {/* 4. MAGIC CODE EDITOR PREVIEW SECTION */}
      <section className="py-20 px-4 bg-gray-900 text-white relative overflow-hidden">
        <div className="absolute top-0 right-0 w-96 h-96 bg-primary-600 rounded-full mix-blend-screen filter blur-[100px] opacity-20" />
        
        <div className="max-w-6xl mx-auto flex flex-col lg:flex-row items-center gap-16 relative z-10">
          <div className="flex-1">
            <div className="bg-gray-800 text-xs font-mono px-4 py-2 inline-flex rounded-lg mb-6 border border-gray-700 text-green-400">
              {">"} print("Hello World")
            </div>
            <h2 className="text-4xl md:text-6xl font-black mb-6">Meet the <span className="text-transparent bg-clip-text bg-gradient-to-r from-green-400 to-blue-500">Magic Editor</span></h2>
            <p className="text-xl text-gray-300 font-bold mb-8">
              A built-in sandbox where kids can write real code, run it instantly, and see their imaginations come to life on the screen.
            </p>
            <ul className="space-y-4 font-semibold text-lg text-gray-400 mb-10">
               <li className="flex items-center gap-3"><span className="text-green-400 text-2xl">✓</span> Python & JavaScript support</li>
               <li className="flex items-center gap-3"><span className="text-green-400 text-2xl">✓</span> Visual block-to-code switching</li>
               <li className="flex items-center gap-3"><span className="text-green-400 text-2xl">✓</span> Instant browser preview</li>
            </ul>
            <Link href={user ? "/editor" : "/register"}>
              <Button size="lg" className="bg-green-500 text-white hover:bg-green-600 border-none font-black text-xl px-10 py-6 rounded-2xl shadow-lg shadow-green-500/30">
                Try it out now! 🪄
              </Button>
            </Link>
          </div>
          
          <div className="flex-1 w-full">
            <div className="bg-[#1e1e1e] rounded-2xl p-4 shadow-2xl border border-gray-700 transform lg:rotate-2 hover:rotate-0 transition-all duration-500">
               <div className="flex gap-2 mb-4">
                 <div className="w-3 h-3 rounded-full bg-red-500"></div>
                 <div className="w-3 h-3 rounded-full bg-yellow-500"></div>
                 <div className="w-3 h-3 rounded-full bg-green-500"></div>
               </div>
               <div className="font-mono text-sm leading-relaxed text-gray-300">
                 <p><span className="text-purple-400">function</span> <span className="text-blue-400">drawRainbow</span>() {'{'}</p>
                 <p className="ml-4"><span className="text-orange-400">const</span> colors = [<span className="text-green-300">'red'</span>, <span className="text-green-300">'orange'</span>, <span className="text-green-300">'yellow'</span>, <span className="text-green-300">'green'</span>, <span className="text-green-300">'blue'</span>];</p>
                 <p className="ml-4">colors.<span className="text-blue-400">forEach</span>(color =&gt; {'{'}</p>
                 <p className="ml-8"><span className="text-yellow-200">magicBrush</span>.<span className="text-blue-400">paint</span>(color);</p>
                 <p className="ml-4">{'}'});</p>
                 <p>{'}'}</p>
                 <p className="mt-4"><span className="text-blue-400">drawRainbow</span>(); <span className="text-gray-500 animate-pulse">|</span></p>
               </div>
            </div>
          </div>
        </div>
      </section>

      {/* 5. TESTIMONIALS SECTION */}
      <section className="py-24 px-4 bg-primary-50">
        <div className="max-w-6xl mx-auto text-center">
          <h2 className="text-4xl md:text-5xl font-black text-gray-800 mb-16">Stories from our <span className="text-secondary-500">Superstars</span>! 🌟</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <Card className="bg-white text-left p-8">
               <div className="flex gap-1 text-accent-500 mb-4 text-xl">⭐⭐⭐⭐⭐</div>
               <p className="text-gray-600 font-bold text-lg mb-6">"RUZANN is amazing! I built my first game ever. The teachers are so funny and helpful!"</p>
               <div className="flex items-center gap-4">
                  <div className="w-12 h-12 bg-primary-200 rounded-full flex items-center justify-center text-xl">👦🏻</div>
                  <div>
                    <h4 className="font-black text-gray-800">Aarav, 10</h4>
                    <span className="text-gray-500 text-sm">Learned Python Coding</span>
                  </div>
               </div>
            </Card>

            <Card className="bg-white text-left p-8 md:-translate-y-8">
               <div className="flex gap-1 text-accent-500 mb-4 text-xl">⭐⭐⭐⭐⭐</div>
               <p className="text-gray-600 font-bold text-lg mb-6">"As a parnt, I love how secure and structured it is. My daughter genuinely looks forward to her classes."</p>
               <div className="flex items-center gap-4">
                  <div className="w-12 h-12 bg-secondary-200 rounded-full flex items-center justify-center text-xl">👩🏽</div>
                  <div>
                    <h4 className="font-black text-gray-800">Priya S.</h4>
                    <span className="text-gray-500 text-sm">Parent</span>
                  </div>
               </div>
            </Card>

            <Card className="bg-white text-left p-8">
               <div className="flex gap-1 text-accent-500 mb-4 text-xl">⭐⭐⭐⭐⭐</div>
               <p className="text-gray-600 font-bold text-lg mb-6">"The session-pricing is completely transparent. The 1 INR trial convinced us to sign up!"</p>
               <div className="flex items-center gap-4">
                  <div className="w-12 h-12 bg-accent-200 rounded-full flex items-center justify-center text-xl">👨🏻</div>
                  <div>
                    <h4 className="font-black text-gray-800">Rajesh M.</h4>
                    <span className="text-gray-500 text-sm">Parent</span>
                  </div>
               </div>
            </Card>
          </div>
        </div>
      </section>

      {/* 6. TEACHERS SHOWCASE SECTION */}
      <section className="py-24 px-4 container mx-auto" id="teachers">
        <div className="flex flex-col md:flex-row justify-between items-end mb-12 gap-6">
           <div className="max-w-2xl">
             <h2 className="text-4xl md:text-5xl font-black text-gray-800 mb-4">Meet Our Cool <span className="text-primary-500">Mentors</span></h2>
             <p className="text-xl font-bold text-gray-500">Learn from the very best! Our verified experts know exactly how to guide young minds.</p>
           </div>
           <Link href="/teachers">
             <Button variant="outline" className="hidden md:flex font-bold">See all Mentors</Button>
           </Link>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
           {[
             { name: "Rahul Sharma", role: "Coding Expert", emoji: "👨‍💻", bg: "bg-blue-100" },
             { name: "Anita Desai", role: "Math Wizard", emoji: "🧮", bg: "bg-purple-100" },
             { name: "Vikram Singh", role: "Science Geek", emoji: "🔬", bg: "bg-green-100" },
             { name: "Sneha Patel", role: "Art & Design", emoji: "🎨", bg: "bg-yellow-100" },
           ].map((t, i) => (
             <div key={i} className="bg-white border-2 border-gray-100 rounded-3xl p-6 text-center hover:border-primary-300 transition-colors cursor-pointer group">
               <div className={`w-32 h-32 ${t.bg} rounded-full flex items-center justify-center text-6xl mx-auto mb-6 group-hover:scale-110 transition-transform`}>
                 {t.emoji}
               </div>
               <h3 className="text-2xl font-black text-gray-800">{t.name}</h3>
               <p className="text-gray-500 font-bold mb-4">{t.role}</p>
             </div>
           ))}
        </div>
        <Button variant="outline" className="md:hidden w-full font-bold mt-8">See all Mentors</Button>
      </section>

      {/* 7. FOOTER / CTA SECTION */}
      <footer className="bg-gray-900 pt-20 pb-10 px-4 mt-auto">
        <div className="container mx-auto">
          <div className="bg-gradient-to-r from-primary-500 to-secondary-500 rounded-[3rem] p-12 text-center text-white mb-20 transform -translate-y-32 shadow-2xl relative overflow-hidden">
             <div className="absolute top-0 right-0 w-64 h-64 bg-white rounded-full mix-blend-overlay filter blur-3xl opacity-20" />
             <h2 className="text-4xl md:text-6xl font-black mb-6 relative z-10">Ready to start the adventure?</h2>
             <p className="text-2xl font-bold text-white/90 mb-8 max-w-2xl mx-auto relative z-10">Join thousands of kids already learning and creating every day!</p>
             <Link href="/register">
               <Button 
                variant="outline" 
                size="lg" 
                className="bg-white border-none text-primary-600 hover:scale-110 text-3xl px-20 py-10 shadow-2xl relative z-10 font-black rounded-[3rem] transition-all"
               >
                 Create Free Account 🚀
               </Button>
             </Link>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-gray-400 font-semibold mb-12 -mt-16 border-b border-gray-800 pb-12">
            <div>
              <div className="text-2xl font-black text-white mb-6">RUZANN</div>
              <p className="text-sm">Making education fun, accessible, and magical for children across the globe.</p>
            </div>
            <div>
              <h4 className="text-white font-bold mb-4">Platform</h4>
              <ul className="space-y-2">
                <li><Link href="/courses" className="hover:text-primary-400">Courses</Link></li>
                <li><Link href="/pricing" className="hover:text-primary-400">Pricing</Link></li>
                <li><Link href="/teachers" className="hover:text-primary-400">Our Teachers</Link></li>
              </ul>
            </div>
            <div>
              <h4 className="text-white font-bold mb-4">Resources</h4>
              <ul className="space-y-2">
                <li><Link href="/blog" className="hover:text-primary-400">Blog</Link></li>
                <li><Link href="/help" className="hover:text-primary-400">Help Center</Link></li>
                <li><Link href="/community" className="hover:text-primary-400">Community</Link></li>
              </ul>
            </div>
            <div>
              <h4 className="text-white font-bold mb-4">Legal</h4>
              <ul className="space-y-2">
                <li><Link href="/privacy" className="hover:text-primary-400">Privacy Policy</Link></li>
                <li><Link href="/terms" className="hover:text-primary-400">Terms of Service</Link></li>
              </ul>
            </div>
          </div>
          
          <div className="text-center text-gray-600 font-semibold">
            &copy; {new Date().getFullYear()} RUZANN EdTech. All rights reserved.
          </div>
        </div>
      </footer>
    </div>
  );
}
