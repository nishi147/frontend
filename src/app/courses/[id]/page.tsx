"use client";

import React, { useEffect, useState } from 'react';
import { Header } from '@/components/layout/Header';
import { Card, CardTitle, CardContent } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import api from '@/utils/api';
import { useParams, useRouter } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';
import { CheckCircle, PlayCircle, FileText, X, ChevronDown, BookOpen, Star, ArrowRight } from 'lucide-react';
import { useToast } from '@/context/ToastContext';
import Link from 'next/link';

export default function CourseDetailPage() {
  const { id } = useParams();
  const { user, loading: authLoading } = useAuth();
  const router = useRouter();
  const [course, setCourse] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [isProcessing, setIsProcessing] = useState(false);
  const [selectedSessions, setSelectedSessions] = useState(1);
  const [couponCode, setCouponCode] = useState('');
  const [appliedCoupon, setAppliedCoupon] = useState<any>(null);
  const [couponError, setCouponError] = useState('');
  
  const originalPrice = selectedSessions * (course?.pricePerSession || 0);
  const discountAmount = appliedCoupon ? (
    appliedCoupon.discountType === 'percent' 
      ? (originalPrice * appliedCoupon.discountValue) / 100 
      : appliedCoupon.discountValue
  ) : 0;
  const finalPrice = Math.max(0, originalPrice - discountAmount);

  const handleApplyCoupon = async () => {
    if (!couponCode) return;
    setCouponError('');
    try {
      const res = await api.post('/api/coupons/validate', { code: couponCode });
      if (res.data.success) {
        setAppliedCoupon(res.data.data);
        showToast("Coupon applied successfully! ✨", "success");
      }
    } catch (err: any) {
      setAppliedCoupon(null);
      setCouponError(err.response?.data?.message || "Invalid coupon");
    }
  };
  const { showToast } = useToast();

  useEffect(() => {
    const fetchDoc = async () => {
      try {
        const res = await api.get(`/api/courses/${id}`);
        if (res.data.success) {
          setCourse(res.data.data);
        }
      } catch (e) {
        console.error(e);
      } finally {
        setLoading(false);
      }
    };
    fetchDoc();

    // Load Razorpay Script
    const script = document.createElement('script');
    script.src = 'https://checkout.razorpay.com/v1/checkout.js';
    script.async = true;
    document.body.appendChild(script);
  }, [id]);

  const isEnrolled = user?.enrollments?.some(e => e.course === id);

  const handleEnroll = async () => {
    if (authLoading) {
      showToast("Verifying your account... please wait a moment.", "info");
      return;
    }

    if (!user) {
      showToast("Please login to enroll in this course", "info");
      router.push('/login');
      return;
    }

    if (isEnrolled) {
      router.push(`/dashboard/student/courses/${id}`);
      return;
    }
    
    setIsProcessing(true);
    try {
      // 1. Create order
      const orderRes = await api.post('/api/payments/order', {
        courseId: course._id,
        sessions: selectedSessions,
        couponCode: appliedCoupon?.code
      });
      const order = orderRes.data.data;

      // 2. Open Razorpay Widget
      const options = {
        key: process.env.NEXT_PUBLIC_RAZORPAY_KEY || 'rzp_test_SPPoz25OmAiMsD',
        amount: order.amount,
        currency: order.currency,
        name: "RUZANN",
        description: `Enrollment for ${course.title}`,
        order_id: order.id,
        handler: async function (response: any) {
          try {
            // 3. Verify Payment
            const verifyRes = await api.post('/api/payments/verify', {
              razorpay_order_id: response.razorpay_order_id,
              razorpay_payment_id: response.razorpay_payment_id,
              razorpay_signature: response.razorpay_signature,
              amount: finalPrice,
              couponCode: appliedCoupon?.code
            });
            
            if (verifyRes.data.success) {
              showToast("Successfully enrolled! Welcome aboard. 🚀", "success");
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
          color: "#F2643D"
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
    <div className="min-h-screen bg-background flex items-center justify-center">
      <div className="flex flex-col items-center gap-4">
        <div className="w-16 h-16 border-4 border-primary-100 border-t-primary-500 rounded-full animate-spin" />
        <p className="font-black text-gray-400 animate-pulse">Summoning course magic...</p>
      </div>
    </div>
  );
  
  if (!course) return (
    <div className="min-h-screen bg-background flex flex-col items-center justify-center p-4 text-center">
       <span className="text-8xl mb-6 last:">🎒</span>
       <h1 className="text-4xl font-black text-gray-800 mb-2">Oops! Course Not Found</h1>
       <p className="text-gray-500 font-bold mb-8">The magic scroll for this course seems to be missing.</p>
       <Button onClick={() => router.push('/courses')}>Explore Other Courses</Button>
    </div>
  );

  return (
    <div className="min-h-screen bg-[#FDFDFD]">
      <Header />
      
      {/* Course Hero Header */}
      <div className="bg-navy-900 text-white py-16 md:py-24 relative overflow-hidden">
        {/* Decorative elements */}
        <div className="absolute top-0 right-0 w-96 h-96 bg-primary-500 rounded-full mix-blend-screen filter blur-[100px] opacity-10" />
        <div className="absolute bottom-0 left-0 w-64 h-64 bg-secondary-500 rounded-full mix-blend-screen filter blur-[80px] opacity-10" />

        <div className="container mx-auto px-4 md:px-6 flex flex-col lg:flex-row gap-12 items-center relative z-10">
          <div className="flex-1">
            <div className="flex flex-wrap items-center gap-3 mb-6">
              <span className="bg-primary-500 px-4 py-1.5 rounded-full text-[10px] font-black uppercase tracking-widest text-white shadow-lg shadow-primary-500/30">FEATURED PATH</span>
              <span className="bg-white/10 backdrop-blur-md px-4 py-1.5 rounded-full text-[10px] font-black uppercase tracking-widest text-primary-300 border border-white/10">{course.category?.name}</span>
            </div>
            
            <h1 className="text-4xl md:text-6xl font-black mb-6 leading-tight drop-shadow-md">{course.title}</h1>
            <p className="text-lg md:text-xl text-gray-400 font-bold mb-10 max-w-3xl leading-relaxed">{course.description}</p>
            
            <div className="flex flex-wrap items-center gap-8">
              <div className="flex items-center gap-4">
                <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-primary-400 to-primary-600 flex items-center justify-center font-black text-white text-2xl shadow-lg">
                   {course.teacher?.name?.[0]}
                </div>
                <div>
                  <p className="text-xs text-gray-400 font-black uppercase tracking-widest mb-1">Mentor</p>
                  <p className="font-bold text-xl">{course.teacher?.name}</p>
                </div>
              </div>
              
              <div className="hidden md:block h-12 w-px bg-white/10" />
              
              <div className="flex items-center gap-6">
                 <div>
                   <p className="text-xs text-secondary-400 font-black uppercase tracking-widest mb-1 items-center flex gap-1"><BookOpen size={12} /> Sessions</p>
                   <p className="font-bold text-xl">{course.numberOfSessions}</p>
                 </div>
                 <div>
                   <p className="text-xs text-primary-400 font-black uppercase tracking-widest mb-1 items-center flex gap-1"><Star size={12} fill="currentColor" /> Rating</p>
                   <p className="font-bold text-xl">5.0</p>
                 </div>
              </div>
            </div>
          </div>

          <div className="w-full lg:w-[420px]">
            <Card className="bg-white text-gray-800 p-8 md:p-10 shadow-[0_20px_50px_rgba(0,0,0,0.1)] rounded-[3rem] border-none overflow-visible relative">
              {/* Hot tag */}
              <div className="absolute -top-4 -right-4 bg-[#F2643D] text-white px-6 py-2 rounded-2xl font-black text-sm shadow-xl animate-bounce">BEST SELLER</div>
              
              <div className="text-center mb-8 border-b border-gray-50 pb-8">
                <div className="text-gray-400 font-black uppercase tracking-widest text-xs mb-3 italic">Total Course Access</div>
                <div className="flex flex-col items-center gap-1 mb-2">
                   {appliedCoupon && (
                       <span className="text-lg font-bold text-gray-400 line-through tracking-tighter">₹{originalPrice}</span>
                   )}
                   <span className="text-5xl font-black text-navy-900 tracking-tighter">₹{finalPrice}</span>
                </div>
                <div className="text-secondary-500 font-black text-xs uppercase tracking-tight bg-secondary-50 inline-block px-4 py-1.5 rounded-full mt-2">
                  ₹{course.pricePerSession} per amazing session!
                </div>
              </div>

              <div className="mb-8">
                <label className="block text-[10px] font-black text-gray-400 uppercase tracking-widest mb-3">
                  Promo Code:
                </label>
                <div className="flex gap-2">
                  <input
                    type="text"
                    placeholder="SUMMER25"
                    value={couponCode}
                    onChange={(e) => setCouponCode(e.target.value.toUpperCase())}
                    className="flex-1 p-4 rounded-2xl border-2 border-gray-50 font-bold bg-gray-50/30 focus:border-primary-400 focus:bg-white focus:outline-none transition-all"
                  />
                  <button 
                    onClick={handleApplyCoupon}
                    type="button"
                    className="bg-navy-900 text-white px-6 rounded-2xl font-black text-xs hover:bg-black transition-colors"
                  >
                    Apply
                  </button>
                </div>
                {couponError && <p className="text-red-500 text-[10px] font-bold mt-2 ml-2">{couponError}</p>}
                {appliedCoupon && (
                    <p className="text-green-600 text-[10px] font-bold mt-2 ml-2 flex items-center gap-1">
                        <CheckCircle size={10} /> {appliedCoupon.code} Applied! Saved ₹{discountAmount}
                    </p>
                )}
              </div>

              <div className="mb-8">
                <label htmlFor="session-select" className="block text-[10px] font-black text-gray-400 uppercase tracking-widest mb-3">
                  Pick your learning path:
                </label>
                <div className="relative group">
                  <select
                    id="session-select"
                    value={selectedSessions}
                    onChange={(e) => setSelectedSessions(parseInt(e.target.value))}
                    className="w-full p-4 pl-6 rounded-2xl border-2 border-gray-50 font-black text-gray-700 bg-gray-50/50 focus:border-primary-400 focus:bg-white focus:outline-none transition-all appearance-none cursor-pointer pr-12"
                  >
                    {Array.from({ length: course.numberOfSessions }, (_, i) => i + 1).map((num) => (
                      <option key={num} value={num}>
                        {num === course.numberOfSessions ? `Full Course (${num} Sessions)` : `${num} ${num === 1 ? 'Magical Session' : 'Sessions'}`}
                      </option>
                    ))}
                  </select>
                  <div className="absolute right-5 top-1/2 -translate-y-1/2 pointer-events-none text-gray-400 group-hover:text-primary-500 transition-colors">
                    <ChevronDown size={20} />
                  </div>
                </div>
              </div>
              
              <Button 
                size="lg" 
                fullWidth 
                className={`text-xl py-8 rounded-[2rem] font-black shadow-2xl transition-all active:scale-95 flex items-center justify-center gap-3 ${isEnrolled ? 'bg-green-500 hover:bg-green-600 shadow-green-200' : 'bg-primary-500 hover:bg-primary-600 shadow-primary-200'}`} 
                onClick={handleEnroll} 
                isLoading={isProcessing}
              >
                {isEnrolled ? (
                  <>Go to Course <ArrowRight size={22} /></>
                ) : (
                  <>Enroll Now ✨</>
                )}
              </Button>

              <div className="mt-8 space-y-4">
                {[
                  { icon: <CheckCircle className="text-green-500 w-5 h-5" />, text: "Full Lifetime Access" },
                  { icon: <CheckCircle className="text-green-500 w-5 h-5" />, text: "Certificate of Completion" },
                  { icon: <CheckCircle className="text-green-500 w-5 h-5" />, text: "Live Doubt Sessions" }
                ].map((item, idx) => (
                  <div key={idx} className="flex items-center gap-4 text-gray-600 font-bold hover:translate-x-1 transition-transform cursor-default">
                    <div className="w-8 h-8 rounded-full bg-gray-50 flex items-center justify-center group-hover:bg-green-50">
                      {item.icon}
                    </div>
                    <span className="text-[13px]">{item.text}</span>
                  </div>
                ))}
              </div>
              
              <p className="mt-8 text-center text-[10px] font-black text-gray-300 uppercase tracking-widest leading-relaxed px-4">
                Secure 256-bit SSL encrypted payment processing. Verified by RUZANN.
              </p>
            </Card>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 md:px-6 py-20 flex flex-col lg:flex-row gap-20">
        <div className="flex-1">
          <div className="mb-12">
             <h2 className="text-xs font-black text-primary-500 uppercase tracking-widest mb-3 flex items-center gap-2">
               <div className="w-8 h-px bg-primary-500" /> WHAT YOU'LL LEARN
             </h2>
             <h3 className="text-3xl md:text-5xl font-black text-navy-900 leading-tight">Master every skill with <br/><span className="text-secondary-500 italic">step-by-step</span> magic.</h3>
          </div>
          
          {course.modules && course.modules.length > 0 ? (
            <div className="flex flex-col gap-6">
              {course.modules.map((m: any, i: number) => (
                <div key={m._id} className="group bg-white rounded-[2.5rem] border-2 border-gray-50 p-8 hover:border-secondary-200 transition-all duration-500 hover:shadow-xl hover:shadow-secondary-100">
                  <div className="flex items-center gap-6 mb-6">
                    <div className="w-14 h-14 bg-secondary-50 text-secondary-500 rounded-2xl flex items-center justify-center font-black text-xl shadow-inner group-hover:scale-110 group-hover:bg-secondary-500 group-hover:text-white transition-all duration-500">
                      {i + 1}
                    </div>
                    <div>
                      <h3 className="text-2xl font-black text-navy-900 group-hover:text-secondary-600 transition-colors uppercase tracking-tight">{m.title}</h3>
                      <p className="text-xs font-black text-gray-400 uppercase tracking-widest">{m.lessons?.length || 0} Lessons</p>
                    </div>
                  </div>
                  
                  <div className="flex flex-col gap-3 pl-4 border-l-2 border-gray-50 ml-7 space-y-1">
                    {m.lessons.map((l: any, idx: number) => (
                      <div key={l._id} className="flex items-center justify-between p-4 rounded-2xl hover:bg-gray-50 transition-all group/lesson cursor-pointer">
                        <div className="flex items-center gap-4 font-bold text-gray-600 group-hover/lesson:text-navy-900">
                          <div className="w-8 h-8 rounded-full bg-white flex items-center justify-center text-xs shadow-sm border border-gray-100 group-hover/lesson:border-secondary-200">
                            {l.videoUrl ? <PlayCircle size={14} className="text-secondary-400" /> : <FileText size={14} className="text-accent-400" />}
                          </div>
                          <span>{l.title}</span>
                        </div>
                        <span className="text-[10px] font-black text-gray-300 uppercase tracking-widest group-hover/lesson:text-secondary-500 transition-colors">
                          {l.videoUrl ? 'Video' : 'Lecture'}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          ) : (
             <div className="bg-white p-12 rounded-[3.5rem] border-4 border-dashed border-gray-100 text-center flex flex-col items-center">
               <div className="w-24 h-24 bg-gray-50 rounded-full flex items-center justify-center text-4xl mb-6 grayscale opacity-50">📑</div>
               <h4 className="text-2xl font-black text-gray-300 mb-2">Curriculum Under Construction</h4>
               <p className="text-gray-400 font-bold max-w-sm">Our mentors are busy polishing the magic scrolls for this course. Check back soon!</p>
             </div>
          )}
        </div>
        
        <div className="lg:w-[380px] space-y-10">
           <div className="bg-primary-50 p-10 rounded-[3rem] relative overflow-hidden">
             <div className="absolute -top-10 -right-10 w-40 h-40 bg-white rounded-full opacity-20" />
             <h4 className="text-2xl font-black text-primary-900 mb-4 relative z-10">Need Help? 🪄</h4>
             <p className="text-primary-700 font-bold mb-8 relative z-10 leading-relaxed">Our magic support team is here to guide you through your learning adventure.</p>
             <Link href="/contact" className="inline-block bg-white text-primary-600 px-8 py-4 rounded-2xl font-black text-sm shadow-xl shadow-primary-500/10 hover:-translate-y-1 transition-transform relative z-10">
               Contact Support →
             </Link>
           </div>
           
           <div className="p-2">
             <h5 className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-6 border-b border-gray-100 pb-4">Our Commitment</h5>
             <div className="space-y-6">
                <div className="flex gap-5">
                   <div className="w-12 h-12 flex-shrink-0 bg-yellow-100 text-yellow-600 rounded-2xl flex items-center justify-center text-xl shadow-sm">🏆</div>
                   <div>
                     <p className="font-black text-gray-800 text-sm mb-1 uppercase tracking-tight">Verified Content</p>
                     <p className="text-gray-500 font-bold text-xs leading-relaxed">Expert-approved courses designed for maximum impact.</p>
                   </div>
                </div>
                <div className="flex gap-5">
                   <div className="w-12 h-12 flex-shrink-0 bg-blue-100 text-blue-600 rounded-2xl flex items-center justify-center text-xl shadow-sm">🔒</div>
                   <div>
                     <p className="font-black text-gray-800 text-sm mb-1 uppercase tracking-tight">Secure Learning</p>
                     <p className="text-gray-500 font-bold text-xs leading-relaxed">Safe and moderated environment for all superstars.</p>
                   </div>
                </div>
             </div>
           </div>
        </div>
      </div>
    </div>
  );
}
