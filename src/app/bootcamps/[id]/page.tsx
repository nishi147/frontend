"use client";

import React, { useEffect, useState } from 'react';
import { Header } from '@/components/layout/Header';
import { Card, CardContent } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import api from '@/utils/api';
import { useParams, useRouter } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';
import { CheckCircle, PlayCircle, FileText, ChevronDown, Calendar, MapPin, User, ArrowRight, Sparkles, BookOpen, Clock, ShieldCheck, Users as UsersIcon } from 'lucide-react';
import { useToast } from '@/context/ToastContext';
import { Footer } from '@/components/layout/Footer';
import Link from 'next/link';

export default function BootcampDetailPage() {
  const { id } = useParams();
  const { user, loading: authLoading } = useAuth();
  const router = useRouter();
  const { showToast } = useToast();

  const [bootcamp, setBootcamp] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [isProcessing, setIsProcessing] = useState(false);
  const [expandedModules, setExpandedModules] = useState<number[]>([0]);

  const toggleModule = (index: number) => {
    setExpandedModules(prev => 
      prev.includes(index) ? prev.filter(i => i !== index) : [...prev, index]
    );
  };

  useEffect(() => {
    const fetchBootcamp = async () => {
      try {
        const res = await api.get(`/api/bootcamps/${id}`);
        if (res.data.success) {
          setBootcamp(res.data.data);
        }
      } catch (e) {
        console.error(e);
      } finally {
        setLoading(false);
      }
    };
    fetchBootcamp();

    // Load Razorpay Script
    const script = document.createElement('script');
    script.src = 'https://checkout.razorpay.com/v1/checkout.js';
    script.async = true;
    document.body.appendChild(script);
  }, [id]);

  const isEnrolled = user?.bootcamps?.some((b: any) => {
    const bootcampId = typeof b.bootcamp === 'string' ? b.bootcamp : b.bootcamp?._id;
    return bootcampId === id;
  });

  const handleEnroll = async () => {
    if (authLoading) return;

    if (!user) {
      showToast("Please login to enroll in this bootcamp", "info");
      router.push('/login');
      return;
    }

    if (isEnrolled) {
      showToast("You are already enrolled in this bootcamp!", "success");
      return;
    }
    
    setIsProcessing(true);
    try {
      // 1. Create order
      const orderRes = await api.post('/api/payments/bootcamp-order', {
        bootcampId: bootcamp._id
      });
      const order = orderRes.data.data;

      // 2. Open Razorpay Widget
      const options = {
        key: process.env.NEXT_PUBLIC_RAZORPAY_KEY || 'rzp_test_SPPoz25OmAiMsD',
        amount: order.amount,
        currency: order.currency,
        name: "RUZANN",
        description: `Bootcamp: ${bootcamp.title}`,
        order_id: order.id,
        handler: async function (response: any) {
          try {
            // 3. Verify Payment
            const verifyRes = await api.post('/api/payments/bootcamp-verify', {
              razorpay_order_id: response.razorpay_order_id,
              razorpay_payment_id: response.razorpay_payment_id,
              razorpay_signature: response.razorpay_signature,
              bootcampId: bootcamp._id
            });
            
            if (verifyRes.data.success) {
              showToast("Mission Accepted! You're enrolled. 🚀", "success");
              router.push('/payment-success');
            }
          } catch (err) {
             showToast("Payment verification failed. Please contact support.", "error");
          }
        },
        prefill: {
          name: user.name,
          email: user.email,
        },
        theme: {
          color: "#EF4444"
        }
      };

      const rzp = new (window as any).Razorpay(options);
      rzp.open();
      
      rzp.on('payment.failed', function (response: any){
        showToast("Payment failed: " + response.error.description, "error");
      });

    } catch (err: any) {
      console.error(err);
      showToast(err.response?.data?.message || "Failed to initiate payment", "error");
    } finally {
      setIsProcessing(false);
    }
  };

  if (loading) return (
    <div className="min-h-screen bg-slate-50 flex items-center justify-center">
      <div className="flex flex-col items-center gap-6">
        <div className="w-20 h-20 border-8 border-indigo-100 border-t-indigo-600 rounded-[2rem] animate-spin" />
        <p className="font-black text-slate-400 uppercase tracking-widest text-xs animate-pulse">Initializing Mission Brief...</p>
      </div>
    </div>
  );
  
  if (!bootcamp) return (
    <div className="min-h-screen bg-slate-50 flex flex-col items-center justify-center p-4 text-center">
       <span className="text-9xl mb-8">🛰️</span>
       <h1 className="text-5xl font-black text-slate-800 tracking-tighter mb-4 uppercase">Mission Offline</h1>
       <p className="text-slate-500 font-bold mb-10 max-w-md">This bootcamp mission is currently not in our active roster.</p>
       <Button onClick={() => router.push('/')} className="bg-indigo-600 px-10 py-6 rounded-2xl font-black shadow-xl shadow-indigo-100">Return to HQ</Button>
    </div>
  );

  return (
    <div className="min-h-screen bg-white">
      <Header />
      
      {/* Bootcamp Hero */}
      <div className="bg-white text-slate-900 pt-10 pb-20 md:pt-16 md:pb-32 relative overflow-hidden">
        {/* Colorful floating background effect */}
        <div className="absolute inset-0 z-0">
           <div className="absolute top-[-10%] left-[-10%] w-[60%] h-[60%] bg-primary-400/10 rounded-full blur-[150px] animate-[pulse_6s_ease-in-out_infinite]" />
           <div className="absolute bottom-[-10%] right-[-5%] w-[40%] h-[40%] bg-rose-400/10 rounded-full blur-[120px] animate-[pulse_8s_ease-in-out_infinite_reverse]" />
        </div>

        <div className="container mx-auto px-4 md:px-6 flex flex-col lg:flex-row gap-12 items-center relative z-10">
          <div className="flex-1 min-w-0 w-full text-center lg:text-left">
            <div className="inline-flex items-center gap-3 px-4 py-2 bg-primary-50 border border-primary-100 rounded-2xl text-primary-600 font-black text-[10px] uppercase tracking-[0.3em] mb-8 animate-in fade-in slide-in-from-top-4 duration-700 shadow-sm hover:shadow-md transition-all hover:-translate-y-1">
               <Sparkles size={14} className="animate-pulse" /> Intensive Bootcamp Mission
            </div>
            
            <h1 className="text-4xl md:text-6xl font-black mb-6 leading-tight uppercase animate-in fade-in slide-in-from-left-8 duration-1000 text-slate-900 break-words drop-shadow-md">
               {bootcamp.title}
            </h1>
            
            <p className="text-lg md:text-xl text-slate-600 font-bold mb-10 max-w-3xl leading-relaxed whitespace-pre-wrap animate-in fade-in slide-in-from-bottom-8 duration-1000 delay-200">
               {bootcamp.description}
            </p>
            
            <div className="flex flex-wrap items-center justify-center lg:justify-start gap-10 animate-in fade-in slide-in-from-bottom-12 duration-1000 delay-500 group">
              <div className="flex items-center gap-5">
                <div className="w-16 h-16 rounded-[1.5rem] bg-primary-500 flex items-center justify-center font-black text-white text-3xl shadow-2xl shadow-primary-500/30 group-hover:scale-105 group-hover:rotate-6 transition-all duration-300">
                   {bootcamp.instructor?.name?.[0] || 'T'}
                </div>
                <div className="text-left">
                  <p className="text-[10px] text-primary-500 font-black uppercase tracking-widest mb-1">Chief Instructor</p>
                  <p className="font-black text-2xl tracking-tight text-slate-800">{bootcamp.instructor?.name || 'Top Mentor'}</p>
                </div>
              </div>
              
              <div className="hidden md:block h-14 w-px bg-slate-200" />
              
              <div className="flex gap-10">
                 <div className="text-left">
                   <p className="text-[10px] text-slate-500 font-black uppercase tracking-widest mb-1 flex items-center gap-1"><Calendar size={12} className="text-primary-500" /> Schedule</p>
                   <p className="font-black text-xl tracking-tight text-slate-800">{new Date(bootcamp.date).toLocaleDateString('en-IN', { day: 'numeric', month: 'short' })} - {new Date(bootcamp.endDate).toLocaleDateString('en-IN', { day: 'numeric', month: 'short' })}</p>
                 </div>
                 <div className="text-left">
                   <p className="text-[10px] text-slate-500 font-black uppercase tracking-widest mb-1 flex items-center gap-1"><MapPin size={12} className="text-primary-500" /> Base</p>
                   <p className="font-black text-xl tracking-tight uppercase text-slate-800">{bootcamp.venue}</p>
                 </div>
                 {bootcamp.showStudentsEnrolled && (
                   <div className="text-left">
                     <p className="text-[10px] text-primary-500 font-black uppercase tracking-widest mb-1 flex items-center gap-1"><UsersIcon size={12} /> Joined By</p>
                     <p className="font-black text-xl tracking-tight uppercase text-slate-800">{bootcamp.studentsEnrolled || 0} Students</p>
                   </div>
                 )}
              </div>
            </div>
          </div>

          {/* Floating Payment Card */}
          <div className="w-full lg:w-[420px] shrink-0 group animate-in zoom-in-95 duration-1000 delay-300">
            <Card className="bg-white p-10 md:p-12 shadow-[0_40px_100px_rgba(244,63,94,0.1)] rounded-[4rem] border-2 border-slate-50 relative overflow-visible group-hover:-translate-y-3 transition-transform duration-500">
              <div className="absolute -top-6 -right-6 bg-primary-500 text-white w-24 h-24 rounded-[2rem] flex flex-col items-center justify-center shadow-[0_20px_40px_rgba(244,63,94,0.3)] rotate-12 group-hover:rotate-6 transition-transform hover:scale-110">
                 <p className="text-[10px] font-black uppercase tracking-widest">Only</p>
                 <p className="text-2xl font-black leading-none">₹{bootcamp.price}</p>
              </div>
              
              <div className="text-center mb-10 pb-10 border-b-4 border-slate-50">
                <div className="w-20 h-20 bg-primary-50 text-primary-500 rounded-[1.5rem] flex items-center justify-center mx-auto mb-6 text-4xl shadow-inner group-hover:scale-110 transition-transform hover:-rotate-12 duration-300">🎓</div>
                <h3 className="text-3xl font-black text-slate-800 tracking-tighter mb-2">JOIN THE MISSION</h3>
                <p className="text-slate-600 font-bold uppercase text-[10px] tracking-widest">Secure your seat at HQ</p>
              </div>

              <div className="space-y-6 mb-12">
                 {[
                   { icon: <Clock className="text-primary-500" size={20} />, title: "Full Intensive Schedule", sub: "Access to all modules & sessions" },
                   { icon: <BookOpen className="text-primary-500" size={20} />, title: "Resource Vault", sub: "PDFs, Code Snippets & Checklists" },
                   { icon: <ShieldCheck className="text-primary-500" size={20} />, title: "Mission Completion", sub: "Official Ruzann Certification" }
                 ].map((item, idx) => (
                   <div key={idx} className="flex gap-5 items-start">
                     <div className="w-12 h-12 bg-slate-50 rounded-2xl flex items-center justify-center shrink-0 shadow-sm border border-slate-100/50">{item.icon}</div>
                     <div>
                       <p className="font-black text-slate-800 text-sm mb-1">{item.title}</p>
                       <p className="text-slate-500 font-bold text-[10px] uppercase tracking-widest">{item.sub}</p>
                     </div>
                   </div>
                 ))}
              </div>
              
              <Button 
                size="lg" 
                className={`w-full py-10 rounded-[2.5rem] font-black text-2xl shadow-3xl transition-all active:scale-95 flex items-center justify-center gap-3 ${isEnrolled ? 'bg-green-500 hover:bg-green-600 shadow-green-100' : 'bg-primary-500 hover:bg-primary-600 shadow-primary-500/30'}`} 
                onClick={handleEnroll} 
                isLoading={isProcessing}
              >
                {isEnrolled ? (
                  <>Mission Active <CheckCircle size={28} /></>
                ) : (
                  <>Enroll Now <ArrowRight size={28} /></>
                )}
              </Button>

              <div className="mt-8 text-center">
                 <p className="text-[10px] font-black text-slate-500 uppercase tracking-[0.2em] px-4">
                   Encrypted Payment Gateway • Instant Access
                 </p>
              </div>
            </Card>
          </div>
        </div>
      </div>

      {/* Curriculum & Details */}
      <div className="container mx-auto px-4 md:px-6 py-20 relative z-20">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-16">
          
          <div className="lg:col-span-8 flex flex-col gap-12">
            <div className="bg-white p-6 md:p-10 rounded-[2.5rem] shadow-xl shadow-slate-100 border border-slate-50">
              <div className="flex flex-col md:flex-row md:items-center justify-between mb-16 gap-6">
                 <div>
                    <h2 className="text-xs font-black text-primary-500 uppercase tracking-[0.4em] mb-4 flex items-center gap-3">
                      <div className="w-10 h-1 bg-primary-500 rounded-full" /> MISSION SYLLABUS
                    </h2>
                    <h3 className="text-3xl sm:text-4xl md:text-5xl font-black text-slate-800 tracking-tighter break-words">Deep Dive <span className="text-slate-300">Phase.</span></h3>
                 </div>
                 <div className="bg-slate-50 px-8 py-5 rounded-[2rem] border border-slate-100 flex items-center gap-4">
                    <div className="w-12 h-12 bg-white rounded-2xl flex items-center justify-center text-2xl shadow-sm">🚀</div>
                    <div>
                       <p className="font-black text-slate-800 text-lg leading-none">{bootcamp.modules?.length || 0}</p>
                       <p className="text-[10px] font-black uppercase text-slate-400 tracking-widest">Main Modules</p>
                    </div>
                 </div>
              </div>

              {bootcamp.modules && bootcamp.modules.length > 0 ? (
                <div className="space-y-6">
                  {bootcamp.modules.map((m: any, i: number) => {
                    const isExpanded = expandedModules.includes(i);
                    return (
                    <div key={m._id} className="relative group">
                       
                       <div className={`bg-white rounded-[2rem] border-2 transition-all duration-300 relative z-10 ${isExpanded ? 'border-primary-100 shadow-xl shadow-primary-50' : 'border-slate-50 hover:border-primary-50'}`}>
                          <button
                            onClick={() => toggleModule(i)}
                            className="w-full flex items-center justify-between p-5 md:p-8 text-left"
                          >
                            <div className="flex items-center gap-4 md:gap-6">
                              <div className={`w-12 h-12 md:w-14 md:h-14 rounded-xl md:rounded-2xl flex shrink-0 items-center justify-center font-black text-xl md:text-2xl shadow-inner transition-all duration-300 ${isExpanded ? 'bg-primary-500 text-white shadow-primary-200' : 'bg-slate-50 text-slate-400'}`}>
                                 {(i + 1).toString().padStart(2, '0')}
                              </div>
                              <div>
                                 <p className="text-[10px] font-black text-primary-500 uppercase tracking-widest mb-1 italic">Module {i + 1}</p>
                                 <h4 className={`text-lg md:text-xl font-bold uppercase tracking-tight leading-none transition-colors ${isExpanded ? 'text-primary-600' : 'text-slate-800'}`}>{m.title}</h4>
                              </div>
                            </div>
                            <div className={`w-10 h-10 rounded-full flex shrink-0 items-center justify-center border-2 transition-all duration-300 ${isExpanded ? 'bg-primary-50 border-primary-100 text-primary-500 rotate-180' : 'border-slate-100 text-slate-400 group-hover:border-primary-100 group-hover:text-primary-400'}`}>
                               <ChevronDown size={20} />
                            </div>
                          </button>
                          
                          {isExpanded && (
                            <div className="px-5 pb-6 md:px-8 md:pb-8 animate-in fade-in slide-in-from-top-4 duration-300">
                              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 border-t-2 border-slate-50 pt-6">
                                 {m.lessons.map((l: any, idx: number) => (
                                   <div key={l._id} className="flex items-center gap-4 p-4 rounded-2xl bg-slate-50/50 border-2 border-transparent hover:border-primary-50 hover:bg-white transition-all group/topic cursor-default">
                                      <div className="w-10 h-10 rounded-2xl bg-white flex items-center justify-center text-slate-300 group-hover/topic:bg-primary-500 group-hover/topic:text-white transition-all shadow-sm">
                                         <PlayCircle size={18} />
                                      </div>
                                      <div className="flex-1">
                                         <p className="font-black text-slate-700 text-sm leading-tight mb-1">{l.title}</p>
                                         <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">{l.duration || 'Session'}</p>
                                      </div>
                                   </div>
                                 ))}
                              </div>
                            </div>
                          )}
                       </div>
                    </div>
                  )})}
                </div>
              ) : (
                  <div className="bg-primary-50/30 p-16 rounded-[4rem] border-4 border-dashed border-primary-100 text-center flex flex-col items-center">
                    <div className="w-28 h-28 bg-white rounded-full flex items-center justify-center text-5xl mb-8 shadow-xl animate-pulse">🛰️</div>
                    <h4 className="text-3xl font-black text-primary-300 mb-4 uppercase tracking-widest">Syllabus Encrypting...</h4>
                    <p className="text-indigo-300 font-bold max-w-sm text-sm uppercase tracking-widest">The learning pathway for this mission is being finalized by our commanders.</p>
                  </div>
              )}
            </div>
          </div>

          <div className="lg:col-span-4 flex flex-col gap-10">
             <div className="bg-primary-500 p-12 rounded-[4rem] text-white relative overflow-hidden shadow-2xl shadow-primary-100">
                <div className="absolute -top-10 -right-10 w-48 h-48 bg-white/10 rounded-full blur-3xl" />
                <h4 className="text-3xl font-black mb-6 tracking-tighter leading-none">Need Direct <br/>Magical Support?</h4>
                <p className="text-primary-100 font-bold mb-10 leading-relaxed text-sm">Our mentors are ready to clarify your doubts and help you launch your coding career.</p>
                <Link href="/contact" className="flex items-center justify-center bg-white text-primary-500 w-full py-5 rounded-2xl font-black text-sm shadow-xl hover:-translate-y-1 transition-transform uppercase tracking-widest active:scale-95">
                  Contact HQ →
                </Link>
             </div>

             <div className="bg-white p-10 rounded-[3.5rem] shadow-xl shadow-slate-100 border border-slate-50">
                <h5 className="text-[10px] font-black text-slate-300 uppercase tracking-[0.3em] mb-10 border-b-4 border-slate-50 pb-5">MISSION ADVISORY</h5>
                <div className="space-y-8">
                   <div className="flex gap-6">
                      <div className="w-14 h-14 bg-amber-50 text-amber-500 rounded-2xl flex items-center justify-center text-2xl shadow-inner shrink-0 rotate-3">🛡️</div>
                      <div>
                        <p className="font-black text-slate-800 text-sm mb-1 uppercase tracking-tight">Verified HQ</p>
                        <p className="text-slate-400 font-bold text-[10px] uppercase tracking-widest leading-relaxed">Top-tier education recognized by industry leaders.</p>
                      </div>
                   </div>
                   <div className="flex gap-6">
                      <div className="w-14 h-14 bg-sky-50 text-sky-500 rounded-2xl flex items-center justify-center text-2xl shadow-inner shrink-0 -rotate-2">✨</div>
                      <div>
                        <p className="font-black text-slate-800 text-sm mb-1 uppercase tracking-tight">Post-Mission Support</p>
                        <p className="text-slate-400 font-bold text-[10px] uppercase tracking-widest leading-relaxed">Join our alumni network for career growth.</p>
                      </div>
                   </div>
                </div>
             </div>
          </div>
          
        </div>
      </div>

      <Footer />
    </div>
  );
}
