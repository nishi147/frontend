"use client";

import React, { useState, useEffect } from 'react';
import { Header } from '@/components/layout/Header';
import { Button } from '@/components/ui/Button';
import { Card, CardTitle, CardContent } from '@/components/ui/Card';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import axios from 'axios';
import { useAuth } from '@/context/AuthContext';
import { useIntroOffer } from '@/context/IntroOfferContext';
import { Footer } from '@/components/layout/Footer';
import { ScrollToTop } from '@/components/ui/ScrollToTop';
import { useToast } from '@/context/ToastContext';
import { UserIcon, Rocket, Sparkles, MessageCircle, Star, Calendar, MapPin, Tag, Trophy, ArrowRight, Check, BookOpen, Users as UsersIcon } from 'lucide-react';

const HERO_IMAGES = [
  '/kid_coding_illustration_1773305191930.png',
  '/kid_reading_illustration_1773305278467.png',
  '/kindergarten_kids_learning_1_1773301524384.png'
];

const WorkshopSection = () => {
  const { user } = useAuth();
  const router = useRouter();
  const { showToast } = useToast();
  const [workshops, setWorkshops] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isProcessing, setIsProcessing] = useState(false);

  useEffect(() => {
    const fetchWorkshops = async () => {
      try {
        const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000';
        const res = await axios.get(`${apiUrl}/api/workshops`);
        if (res.data.success) {
          setWorkshops(res.data.data);
        }
      } catch (error) {
        console.error("Error fetching workshops:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchWorkshops();
  }, []);

  const handleBookWorkshop = async (workshop: any) => {
    if (!user) {
      router.push('/register');
      return;
    }

    setIsProcessing(true);
    try {
      const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000';
      
      // 1. Create order
      const orderRes = await axios.post(`${apiUrl}/api/payments/workshop-order`, { workshopId: workshop._id });
      const order = orderRes.data.data;

      // 2. Open Razorpay Widget
      const options = {
        key: process.env.NEXT_PUBLIC_RAZORPAY_KEY || 'rzp_test_SPPoz25OmAiMsD',
        amount: order.amount,
        currency: order.currency,
        name: "RUZANN",
        description: `Booking for ${workshop.title}`,
        order_id: order.id,
        handler: async function (response: any) {
          try {
            // 3. Verify Payment
            const verifyRes = await axios.post(`${apiUrl}/api/payments/workshop-verify`, {
              razorpay_order_id: response.razorpay_order_id,
              razorpay_payment_id: response.razorpay_payment_id,
              razorpay_signature: response.razorpay_signature,
              workshopId: workshop._id
            });

            if (verifyRes.data.success) {
              router.push('/payment-success');
            }
          } catch (err: any) {
            console.error("Verification error:", err);
            showToast("Payment verification failed: " + (err.response?.data?.message || err.message), "error");
          }
        },
        prefill: {
          name: user.name,
          email: user.email,
        },
        theme: {
          color: "#F2643D"
        }
      };

      const rzp = new (window as any).Razorpay(options);
      rzp.open();
      
      rzp.on('payment.failed', function (response: any){
        showToast("Payment failed: " + response.error.description, "error");
      });

    } catch (err: any) {
      console.error("Payment initiation error:", err);
      showToast("Failed to initiate payment: " + (err.response?.data?.message || err.message), "error");
    } finally {
      setIsProcessing(false);
    }
  };

  if (loading) return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
      {[1, 2, 3].map(i => <div key={i} className="h-96 rounded-3xl bg-gray-100 animate-pulse" />)}
    </div>
  );

  if (workshops.length === 0) return (
     <div className="bg-white border-2 border-dashed border-gray-200 rounded-[3rem] p-20 text-center">
       <span className="text-6xl block mb-6">🗓️</span>
       <h3 className="text-3xl font-black text-gray-400 mb-2">No Workshops Scheduled</h3>
       <p className="text-gray-400 font-bold">New magical adventures are being planned. Check back soon!</p>
     </div>
  );

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
      {workshops.map((ws: any) => (
        <Card key={ws._id} className="relative group overflow-visible border-none shadow-[0_8px_30px_rgb(0,0,0,0.06)] hover:shadow-[0_8px_30px_rgb(0,0,0,0.12)] rounded-[2.5rem] transition-all duration-500 bg-white">
          <div className="h-56 bg-gray-50 relative overflow-hidden flex items-center justify-center text-7xl rounded-t-[2.5rem]">
             {ws.image && ws.image !== 'no-image.jpg' ? (
                <img src={ws.image} alt={ws.title} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" />
             ) : (
                <div className="text-gray-300 opacity-50 font-sans font-black uppercase tracking-tighter mix-blend-multiply">{ws.title.substring(0, 8)}</div>
             )}
          </div>
          
          <div className="absolute top-[12rem] right-6 bg-white px-6 py-2 rounded-2xl shadow-xl z-10 flex items-center justify-center border border-gray-100 transform group-hover:-translate-y-2 transition-transform duration-500">
            <span className="text-slate-900 font-black text-4xl tracking-tight">₹{ws.price}</span>
          </div>

          <CardContent className="p-8 pt-10">
            <h3 className="text-2xl font-black text-slate-800 uppercase tracking-wide mb-1 line-clamp-1">{ws.title}</h3>
            <p className="text-gray-500 font-bold text-xs uppercase tracking-widest mb-8 line-clamp-1">{ws.description}</p>
            
            <div className="space-y-4 mb-10 pl-1">
              <div className="flex items-center gap-4 text-slate-700">
                 <div className="w-10 h-10 rounded-full bg-teal-50 flex items-center justify-center">
                   <Calendar size={18} className="text-teal-600" />
                 </div>
                 <span className="font-bold text-[15px]">{new Date(ws.date).toLocaleDateString('en-IN', { day: 'numeric', month: 'long', year: 'numeric' })}</span>
              </div>
              <div className="flex items-center gap-4 text-slate-700">
                 <div className="w-10 h-10 rounded-full bg-teal-50 flex items-center justify-center">
                   <MapPin size={18} className="text-teal-600" />
                 </div>
                 <span className="font-bold text-[15px] uppercase">{ws.venue}</span>
              </div>
            </div>

            <Button 
              onClick={() => handleBookWorkshop(ws)}
              isLoading={isProcessing}
              className="w-full py-6 rounded-full font-black text-lg bg-[#F2643D] hover:bg-[#E0532C] text-white border-none shadow-lg shadow-[#F2643D]/30 transition-all flex items-center justify-center gap-2"
            >
              Book Seat <ArrowRight size={20} className="group-hover:translate-x-1 transition-transform" />
            </Button>
          </CardContent>
        </Card>
      ))}
    </div>
  );
};

export default function Home() {
  const router = useRouter();
  const { user } = useAuth();
  const { openIntroModal } = useIntroOffer();
  const [currentSlide, setCurrentSlide] = useState(0);


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





  return (
    <div className="min-h-screen bg-white flex flex-col font-sans overflow-hidden">
      <Header />
      
      {/* 1. BALANCED HERO SECTION: COSMIC KINDERGARTEN */}
      <section className="relative flex min-h-[70vh] items-center justify-center p-4 overflow-hidden bg-navy-900">
        {/* Background Layer: Playful Illustration with Navy Overlay */}
        <div className="absolute inset-0 z-0">
          <img 
            src="/kindergarten_learning_hero_bg_1773385613471.png" 
            alt="Kindergarten background" 
            className="w-full h-full object-cover opacity-20 grayscale brightness-50" 
          />
          <div className="absolute inset-0 bg-gradient-to-tr from-navy-900 via-navy-900/40 to-secondary-600/20" />
        </div>

        {/* Technical Elements: SVG Orbit lines & Stars */}
        <div className="absolute inset-0 z-1 pointer-events-none opacity-40">
           <svg className="w-full h-full" viewBox="0 0 1440 800" fill="none" preserveAspectRatio="xMidYMid slice">
              <circle cx="200" cy="200" r="150" stroke="white" strokeWidth="0.5" strokeDasharray="10 10" />
              <circle cx="1200" cy="600" r="250" stroke="white" strokeWidth="0.5" strokeDasharray="15 15" />
              <path d="M-100,400 Q720,-200 1540,400" stroke="white" strokeWidth="1" strokeDasharray="20 20" />
              {/* Star-like dots */}
              {[...Array(20)].map((_, i) => (
                <circle key={i} cx={Math.random() * 1440} cy={Math.random() * 800} r={Math.random() * 2} fill="white" className="animate-pulse" style={{ animationDelay: `${Math.random() * 2}s` }} />
              ))}
           </svg>
        </div>

        {/* Glowing Blobs */}
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-primary-500 rounded-full mix-blend-screen filter blur-[120px] opacity-20 animate-float z-0" />
        <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-secondary-500 rounded-full mix-blend-screen filter blur-[120px] opacity-20 animate-float z-0" style={{ animationDelay: '2s' }} />

        <div className="relative z-20 max-w-6xl mx-auto text-center px-4">
          <div className="inline-flex items-center gap-2 mb-6 px-5 py-2 rounded-full border border-white/20 bg-white/5 backdrop-blur-xl text-primary-300 font-black uppercase tracking-widest text-sm shadow-xl">
            <span className="text-xl animate-spin-slow">✨</span> THE MOST FUN LEARNING ADVENTURE!
          </div>
          
          <h1 className="text-4xl md:text-7xl font-baloo font-black text-white tracking-tight leading-tight mb-6 drop-shadow-[0_6px_6px_rgba(0,0,0,0.5)]">
            Where Kids <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary-400 via-white to-secondary-400">GROW</span> and Glow!
          </h1>
          
          <p className="text-lg md:text-2xl text-gray-300 font-bold mb-8 max-w-3xl mx-auto leading-relaxed">
            Interactive courses, live classes, and <span className="text-white border-b-4 border-primary-500">magic coding</span> for the next generation of explorers.
          </p>
          
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link href="/courses">
              <Button size="lg" className="text-lg px-10 py-4 rounded-full bg-primary-500 hover:bg-primary-600 shadow-lg font-black">
                Start Adventure 🚀
              </Button>
            </Link>
            <Button 
              variant="secondary"
              size="lg"
              onClick={openIntroModal}
              className="text-lg px-10 py-4 rounded-full bg-white/10 backdrop-blur-lg border-2 border-white/20 hover:bg-white/20 font-black text-white"
            >
              Claim ₹1 Offer ✨
            </Button>
          </div>

          <div className="mt-10 flex flex-wrap justify-center gap-6 opacity-60 grayscale hover:grayscale-0 transition-all duration-500">
             <div className="flex items-center gap-2 text-white font-black text-xs uppercase tracking-tighter"><span className="text-xl">🤖</span> Gen AI</div>
             <div className="flex items-center gap-2 text-white font-black text-xs uppercase tracking-tighter"><span className="text-xl">💻</span> Web Dev</div>
             <div className="flex items-center gap-2 text-white font-black text-xs uppercase tracking-tighter"><span className="text-xl">⚡</span> Python</div>
             <div className="flex items-center gap-2 text-white font-black text-xs uppercase tracking-tighter"><span className="text-xl">🎮</span> Game Dev</div>
          </div>
        </div>
      </section>

      {/* 2. ₹1 ATTRACTIVE SECTION */}
      <section className="relative py-16 px-4 overflow-hidden">
        <div className="absolute inset-0 bg-accent-500 -skew-y-3 origin-left z-0" />
        <div className="absolute inset-0 bg-yellow-400 -skew-y-3 origin-right opacity-50 translate-y-4 z-0" />
        
        <div className="relative z-10 max-w-7xl mx-auto flex flex-col lg:flex-row items-center justify-between gap-8">
           <div className="text-white flex-1 text-center lg:text-left">
              <div className="inline-block bg-white text-accent-600 text-sm font-black tracking-widest uppercase px-5 py-2 rounded-full mb-5 shadow-lg animate-pulse">
                LIMITED TIME MAGIC
              </div>
              <h2 className="text-4xl md:text-6xl font-black mb-5 leading-[0.95]">
                Get Your First <br/>
              <span className="text-yellow-200 inline-block -rotate-6 scale-110 mx-2 drop-shadow-xl">₹1</span>
              </h2>
              <div className="flex flex-wrap gap-3 justify-center lg:justify-start mb-5 font-bold text-base">
                <span className="flex items-center gap-2 bg-white/20 backdrop-blur-sm px-3 py-1.5 rounded-xl">✓ No Commitments</span>
                <span className="flex items-center gap-2 bg-white/20 backdrop-blur-sm px-3 py-1.5 rounded-xl">✓ Full Access</span>
                <span className="flex items-center gap-2 bg-white/20 backdrop-blur-sm px-3 py-1.5 rounded-xl">✓ Certification</span>
              </div>
              <p className="text-lg font-bold text-accent-100 max-w-xl">Join 10,000+ happy parents who started their child's tech journey with RUZANN.</p>
           </div>
           
           <Card className="w-full lg:w-[380px] bg-white p-7 rounded-[2rem] shadow-xl border-4 border-yellow-200 transform hover:scale-105 transition-all">
             <div className="text-center mb-5">
               <div className="text-4xl mb-3">🎁</div>
               <h3 className="text-2xl font-black text-gray-800">Special Gift Box</h3>
               <p className="text-gray-500 font-bold text-sm">Fill details to unlock the offer</p>
             </div>
             <button 
               onClick={openIntroModal}
               className="bg-accent-500 text-white w-full py-4 rounded-xl text-xl font-black shadow-xl hover:bg-accent-600 transition-all border-b-4 border-accent-700 active:border-b-0 active:translate-y-1 flex items-center justify-center gap-3"
             >
               Go Magic! ₹1 🚀
             </button>
             <div className="mt-5 pt-5 border-t-2 border-gray-100 flex items-center justify-center gap-4 text-gray-400 font-bold">
               <span className="text-xs uppercase">Trusted by</span>
               <div className="flex -space-x-3">
                 {[1,2,3,4].map(i => <div key={i} className="w-9 h-9 rounded-full border-2 border-white bg-gray-200 flex items-center justify-center text-[10px]"><UserIcon className="w-4 h-4" /></div>)}
                 <div className="w-9 h-9 rounded-full border-2 border-white bg-secondary-500 text-white flex items-center justify-center text-[10px] font-black">+10k</div>
               </div>
             </div>
           </Card>
        </div>
      </section>



      {/* 2.5 FEATURED DUMMY COURSES SECTION */}
      <section className="py-12 px-4 container mx-auto" id="featured-courses">
        <div className="text-center mb-10">
          <h2 className="text-3xl md:text-5xl font-black text-gray-800 mb-3">Popular <span className="text-secondary-500">Adventures</span> 🌈</h2>
          <p className="text-base font-bold text-gray-500">Pick a path and start your magical journey today!</p>
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

      {/* 2.6 WORKSHOPS & BOOTCAMPS SECTION */}
      <section className="py-14 bg-gradient-to-b from-white to-gray-50 overflow-hidden" id="workshops">
        <div className="container mx-auto px-4">
          <div className="flex flex-col md:flex-row items-end justify-between mb-8 gap-4 text-center md:text-left">
            <div className="max-w-2xl">
              <div className="inline-flex items-center gap-2 px-4 py-2 bg-accent-100 rounded-full text-accent-600 font-bold mb-3">
                <Rocket size={16} />
                <span className="text-sm">Space Bootcamps</span>
              </div>
              <h2 className="text-3xl md:text-5xl font-black text-gray-800 leading-tight">
                Magical <span className="text-accent-500">Workshops</span>  🎟️
              </h2>
            </div>
            <p className="text-base font-bold text-gray-400 md:max-w-xs">
              Intensive learning experiences designed to spark creative magic.
            </p>
          </div>

          <WorkshopSection />
        </div>
      </section>


      {/* 3. ABOUT RUZANN SECTION */}
      <section className="py-14 px-4 container mx-auto" id="about">
         <div className="text-center max-w-3xl mx-auto mb-10">
           <h2 className="text-3xl md:text-5xl font-black text-gray-800 mb-4">Why kids love <span className="text-primary-500">RUZANN</span>?</h2>
           <p className="text-base font-bold text-gray-500">We make education an enchanting experience, combining play with meaningful skill-building.</p>
         </div>

         <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="bg-blue-50 border-b-8 border-primary-500 p-8 rounded-[2rem] text-center hover:-translate-y-3 transition-transform duration-300">
              <div className="w-20 h-20 bg-white rounded-full flex items-center justify-center text-4xl mx-auto mb-4 shadow-md shadow-primary-200">🎮</div>
              <h3 className="text-xl font-black text-primary-700 mb-3">Game-Based Learning</h3>
              <p className="text-gray-600 font-semibold">Every lesson feels like a mission. Complete quests and earn badges!</p>
            </div>
            
            <div className="bg-purple-50 border-b-8 border-secondary-500 p-8 rounded-[2rem] text-center hover:-translate-y-3 transition-transform duration-300 md:mt-10">
              <div className="w-20 h-20 bg-white rounded-full flex items-center justify-center text-4xl mx-auto mb-4 shadow-md shadow-secondary-200">👨‍🏫</div>
              <h3 className="text-xl font-black text-secondary-700 mb-3">Live Mentorship</h3>
              <p className="text-gray-600 font-semibold">Learn directly from top educators in small, interactive live sessions.</p>
            </div>
            
            <div className="bg-yellow-50 border-b-8 border-accent-500 p-8 rounded-[2rem] text-center hover:-translate-y-3 transition-transform duration-300">
              <div className="w-20 h-20 bg-white rounded-full flex items-center justify-center text-4xl mx-auto mb-4 shadow-md shadow-accent-200">🏆</div>
              <h3 className="text-xl font-black text-accent-700 mb-3">Real Skills</h3>
              <p className="text-gray-600 font-semibold">From coding to creativity, kids learn skills that matter for their future.</p>
            </div>
          </div>
      </section>

      {/* 4. MAGIC CODE EDITOR PREVIEW SECTION */}
      <section className="py-12 px-4 bg-gray-900 text-white relative overflow-hidden">
        <div className="absolute top-0 right-0 w-64 h-64 bg-primary-600 rounded-full mix-blend-screen filter blur-[80px] opacity-20" />
        <div className="max-w-6xl mx-auto flex flex-col lg:flex-row items-center gap-10 relative z-10">
          <div className="flex-1">
            <div className="bg-gray-800 text-xs font-mono px-4 py-2 inline-flex rounded-lg mb-4 border border-gray-700 text-green-400">
              {">"} print("Hello World")
            </div>
            <h2 className="text-3xl md:text-5xl font-black mb-4">Meet the <span className="text-transparent bg-clip-text bg-gradient-to-r from-green-400 to-blue-500">Magic Editor</span></h2>
            <p className="text-base text-gray-300 font-bold mb-6">
              A built-in sandbox where kids can write real code, run it instantly, and see their imaginations come to life on the screen.
            </p>
            <ul className="space-y-3 font-semibold text-base text-gray-400 mb-8">
               <li className="flex items-center gap-3"><span className="text-green-400 text-xl">✓</span> Python & JavaScript support</li>
               <li className="flex items-center gap-3"><span className="text-green-400 text-xl">✓</span> Visual block-to-code switching</li>
               <li className="flex items-center gap-3"><span className="text-green-400 text-xl">✓</span> Instant browser preview</li>
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
      <section className="py-12 px-4 bg-primary-50">
        <div className="max-w-6xl mx-auto text-center">
          <h2 className="text-3xl md:text-4xl font-black text-gray-800 mb-10">Stories from our <span className="text-secondary-500">Superstars</span>! 🌟</h2>
          
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
      <section className="py-12 px-4 container mx-auto" id="teachers">
        <div className="flex flex-col md:flex-row justify-between items-end mb-8 gap-4">
           <div className="max-w-2xl">
             <h2 className="text-3xl md:text-4xl font-black text-gray-800 mb-2">Meet Our Cool <span className="text-primary-500">Mentors</span></h2>
             <p className="text-base font-bold text-gray-500">Learn from the very best! Our verified experts know exactly how to guide young minds.</p>
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
             <div key={i} className="bg-white border-2 border-gray-100 rounded-2xl p-5 text-center hover:border-primary-300 transition-colors cursor-pointer group">
               <div className={`w-20 h-20 ${t.bg} rounded-full flex items-center justify-center text-5xl mx-auto mb-4 group-hover:scale-110 transition-transform`}>
                 {t.emoji}
               </div>
               <h3 className="text-2xl font-black text-gray-800">{t.name}</h3>
               <p className="text-gray-500 font-bold mb-4">{t.role}</p>
             </div>
           ))}
        </div>
        <Button variant="outline" className="md:hidden w-full font-bold mt-8">See all Mentors</Button>
      </section>

      <Footer />
      <ScrollToTop />
    </div>
  );
}

// MODERN COURSE CATALOG COMPONENT
const CourseCatalog = () => {
    const [gradeFilter, setGradeFilter] = useState('All Ages');
    const [typeFilter, setTypeFilter] = useState('All');

    const courses = [
        { id: 1, title: "Robotics Adventure", category: "Robotics", type: "Group", grade: "Ages 6–9", desc: "For Young Inventors ages 6–9. 18 sessions, beginner friendly, activity-based.", lessons: 18, rating: 4.8, students: "375+", total: 41175, perClass: 2287, icon: "🤖", color: "bg-[#6C5CE710]" },
        { id: 2, title: "Beginner Robotics", category: "Robotics", type: "Group", grade: "Ages 10–12", desc: "For Curious Kids Ages 10–12. Learn by Doing, Play, Build and Explore!", lessons: 18, rating: 4.7, students: "400+", total: 41175, perClass: 2287, icon: "⚙️", color: "bg-[#00CECA10]" },
        { id: 3, title: "Intermediate Robotics", category: "Robotics", type: "Group", grade: "Ages 10–12", desc: "Build. Try. Fix. Improve. For Smart Kids Ages 10–12. 24 sessions.", lessons: 24, rating: 4.9, students: "400+", total: 30744, perClass: 1281, icon: "🛠️", color: "bg-[#FD79A810]" },
        { id: 4, title: "Generative AI for Kids", category: "AI", type: "1:1 Classes", grade: "Ages 13–16", desc: "Learn how to use AI tools responsibly and creatively. Deep dive into prompts.", lessons: 12, rating: 5.0, students: "120+", total: 15999, perClass: 1333, icon: "🧠", color: "bg-[#FDCB6E10]" },
        { id: 5, title: "Scratch Coding", category: "Coding", type: "Group", grade: "Ages 6–9", desc: "Drag and drop coding for the youngest learners. Build 5 interactive games.", lessons: 10, rating: 4.6, students: "1k+", total: 5999, perClass: 599, icon: "🐱", color: "bg-[#FF767510]" },
        { id: 6, title: "Fun Math & Logic", category: "Math", type: "1:1 Classes", grade: "All Ages", desc: "Critical thinking and logic puzzles that make math fun and exciting.", lessons: 8, rating: 4.9, students: "500+", total: 8499, perClass: 1062, icon: "🧩", color: "bg-[#00B89410]" },
    ];

    const filtered = courses.filter(c => 
        (gradeFilter === 'All Ages' || c.grade === gradeFilter) &&
        (typeFilter === 'All' || c.type === typeFilter)
    );

    return (
        <div className="flex flex-col gap-12">
            {/* Filters Bar */}
            <div className="bg-white p-4 rounded-[2rem] border-2 border-gray-100 shadow-sm flex flex-col md:flex-row items-center justify-center gap-8 font-bold">
                <div className="flex items-center gap-4 flex-wrap justify-center">
                    <span className="text-gray-400 uppercase tracking-widest text-xs">Grade:</span>
                    {['All Ages', 'Ages 6–9', 'Ages 10–12', 'Ages 13–16'].map(grade => (
                        <button 
                            key={grade}
                            onClick={() => setGradeFilter(grade)}
                            className={`px-6 py-2 rounded-full transition-all ${gradeFilter === grade ? 'bg-navy-900 text-white shadow-lg' : 'hover:bg-gray-100 text-gray-500'}`}
                        >
                            {grade}
                        </button>
                    ))}
                </div>
                <div className="hidden md:block w-px h-8 bg-gray-100" />
                <div className="flex items-center gap-4 flex-wrap justify-center">
                    <span className="text-gray-400 uppercase tracking-widest text-xs">Type:</span>
                    {['All', '1:1 Classes', 'Group Classes'].map(type => (
                        <button 
                            key={type}
                            onClick={() => setTypeFilter(type)}
                            className={`px-6 py-2 rounded-full transition-all ${typeFilter === type ? 'bg-navy-900 text-white shadow-lg' : 'hover:bg-gray-100 text-gray-500'}`}
                        >
                            {type}
                        </button>
                    ))}
                </div>
            </div>

            {/* Courses Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10">
                {filtered.map(course => (
                    <Card key={course.id} className="group bg-white rounded-[2.5rem] border-2 border-gray-50 overflow-hidden hover:shadow-2xl transition-all duration-500 hover:-translate-y-2 flex flex-col">
                        <div className={`h-64 ${course.color} relative overflow-hidden flex items-center justify-center group-hover:scale-105 transition-transform duration-500`}>
                            {/* Tags */}
                            <div className="absolute top-6 left-6 flex gap-2">
                                <span className="bg-white/90 backdrop-blur-sm px-4 py-1.5 rounded-full text-[10px] font-black uppercase tracking-widest text-gray-700 shadow-sm">{course.category}</span>
                                <span className="bg-[#6C5CE7] px-4 py-1.5 rounded-full text-[10px] font-black uppercase tracking-widest text-white shadow-sm">{course.type}</span>
                            </div>
                            <div className="text-8xl mt-4 filter drop-shadow-lg">{course.icon}</div>
                            {/* Student Count Overlay */}
                            <div className="absolute bottom-6 right-6 bg-navy-900/80 backdrop-blur-sm text-white px-4 py-2 rounded-2xl flex items-center gap-2 text-xs font-black">
                                <UsersIcon size={14} /> {course.students} Students
                            </div>
                        </div>
                        <CardContent className="p-8 flex flex-col flex-1">
                            <h3 className="text-2xl font-black text-gray-900 mb-2 truncate group-hover:text-[#6C5CE7] transition-colors">{course.title}</h3>
                            <p className="text-gray-500 font-bold text-sm mb-6 line-clamp-2 leading-relaxed">{course.desc}</p>
                            
                            <div className="flex items-center gap-4 mb-8">
                                <div className="flex items-center gap-2 text-[#FF7675] font-black">
                                    <BookOpen size={16} /> {course.lessons} Lessons
                                </div>
                                <div className="w-px h-4 bg-gray-200" />
                                <div className="flex items-center gap-2 text-yellow-500 font-black">
                                    <Star size={16} fill="currentColor" /> {course.rating}
                                </div>
                            </div>

                            <div className="mt-auto pt-6 border-t border-gray-50 flex items-center justify-between">
                                <div>
                                    <div className="text-3xl font-black text-gray-900">₹{course.total.toLocaleString()}</div>
                                    <div className="text-[10px] font-black text-gray-400 uppercase tracking-tighter">₹{course.perClass}/class</div>
                                </div>
                                <Link href="/register">
                                    <Button className="rounded-2xl px-8 py-6 font-black text-lg bg-[#6C5CE7] hover:bg-[#5B4BCB] shadow-lg shadow-[#6C5CE720]">Enroll →</Button>
                                </Link>
                            </div>
                        </CardContent>
                    </Card>
                ))}
            </div>
        </div>
    );
};
