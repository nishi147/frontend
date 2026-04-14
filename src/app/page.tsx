"use client";

import React, { useState, useEffect } from 'react';
import { Header } from '@/components/layout/Header';
import { Button } from '@/components/ui/Button';
import { Card, CardTitle, CardContent } from '@/components/ui/Card';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import api from '@/utils/api';
import { useAuth } from '@/context/AuthContext';
import { useIntroOffer } from '@/context/IntroOfferContext';
import { Footer } from '@/components/layout/Footer';
import { ScrollToTop } from '@/components/ui/ScrollToTop';
import { useToast } from '@/context/ToastContext';
import axios from 'axios';
import { UserIcon, Rocket, Sparkles, MessageCircle, Star, Calendar, MapPin, Tag, Trophy, ArrowRight, Check, BookOpen, Mail, Phone, Send, CheckCircle, ChevronDown, Users as UsersIcon, Ticket, GraduationCap } from 'lucide-react';
import CourseSelection from '@/components/sections/CourseSelection';
import { PlayAndLearnSection } from '@/components/sections/PlayAndLearnSection';
import { SuperstarProjects } from '@/components/sections/SuperstarProjects';
import { WorkshopSlotSelectorModal } from '@/components/game/WorkshopSlotSelectorModal';
import { trackEvent } from '@/utils/analytics';
import { AdUnit } from '@/components/AdSense';
import { BlogSection } from '@/components/sections/BlogSection';

const HERO_IMAGES = [
  '/kid_coding_illustration_1773305191930.png',
  '/kid_reading_illustration_1773305278467.png',
  '/kindergarten_kids_learning_1_1773301524384.png'
];

const EnrollLeadModal = ({ isOpen, onClose, onProceed, isProcessing, title = "Enroll in Workshop 🎟️" }: any) => {
  const [formData, setFormData] = useState({ name: '', email: '', phone: '', age: '' });
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[2000] flex items-center justify-center bg-black/80 backdrop-blur-md p-4 sm:p-6">
      <Card className="w-full max-w-md bg-white rounded-3xl sm:rounded-[2.5rem] overflow-hidden shadow-2xl animate-in zoom-in-95 duration-200">
        <div className="p-6 sm:p-10">
           <div className="flex justify-between items-center mb-6">
              <h3 className="text-xl sm:text-2xl font-black text-black leading-tight">{title}</h3>
              <button onClick={onClose} className="text-slate-900 hover:text-slate-800 transition-colors p-2 -mr-2">✕</button>
           </div>
           <p className="text-black font-bold text-xs sm:text-sm mb-8 leading-relaxed">Enter your details to proceed to the secure payment gateway.</p>
           
           <div className="space-y-4">
              <div>
                <label className="text-[10px] font-black uppercase tracking-widest text-black ml-1">Parent/Student Name</label>
                <input required value={formData.name} onChange={(e) => setFormData({...formData, name: e.target.value})} placeholder="e.g. John Doe" className="w-full p-4 bg-slate-50 border border-slate-100 rounded-2xl font-bold outline-none focus:border-primary-500 transition-all text-sm text-black placeholder:text-gray-500" />
              </div>
              <div>
                <label className="text-[10px] font-black uppercase tracking-widest text-black ml-1">Email Address</label>
                <input required type="email" value={formData.email} onChange={(e) => setFormData({...formData, email: e.target.value})} placeholder="e.g. name@example.com" className="w-full p-4 bg-slate-50 border border-slate-100 rounded-2xl font-bold outline-none focus:border-primary-500 transition-all text-sm text-black placeholder:text-gray-500" />
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="flex flex-col gap-1">
                  <label className="text-[10px] font-black uppercase tracking-widest text-black ml-1">Phone Number</label>
                  <input required value={formData.phone} onChange={(e) => setFormData({...formData, phone: e.target.value})} placeholder="98765 43210" className="w-full p-4 bg-slate-50 border border-slate-100 rounded-2xl font-bold outline-none focus:border-primary-500 transition-all text-sm text-black placeholder:text-gray-500" />
                </div>
                <div className="flex flex-col gap-1">
                  <label className="text-[10px] font-black uppercase tracking-widest text-black ml-1">Child's Age (Optional)</label>
                  <input value={formData.age} onChange={(e) => setFormData({...formData, age: e.target.value})} placeholder="e.g. 8" className="w-full p-4 bg-slate-50 border border-slate-100 rounded-2xl font-bold outline-none focus:border-primary-500 transition-all text-sm text-black placeholder:text-gray-500" />
                </div>
              </div>
           </div>

           <Button 
            onClick={() => onProceed(formData)} 
            disabled={!formData.name || !formData.email || !formData.phone}
            isLoading={isProcessing}
            className="w-full py-5 sm:py-6 rounded-2xl font-black text-base sm:text-lg bg-primary-500 hover:bg-primary-600 shadow-xl shadow-primary-200 mt-8 sm:mt-10 transition-all active:scale-95"
           >
             Proceed to Payment →
           </Button>
        </div>
      </Card>
    </div>
  );
};

import { getThumbnailUrl } from '@/utils/image';

const BootcampSection = () => {
  const { user } = useAuth();
  const { showToast } = useToast();
  const router = useRouter();
  const [bootcamps, setBootcamps] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [isProcessing, setIsProcessing] = useState(false);
  const [isLeadModalOpen, setIsLeadModalOpen] = useState(false);
  const [pendingBootcamp, setPendingBootcamp] = useState<any>(null);

  useEffect(() => {
    const fetchBootcamps = async () => {
      try {
        const res = await api.get('/api/bootcamps');
        if (res.data.success) {
          setBootcamps(res.data.data);
        }
      } catch (error) {
        console.error("Error fetching bootcamps:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchBootcamps();
  }, []);

  const scrollRef = React.useRef<HTMLDivElement>(null);

  useEffect(() => {
    const isMobile = window.matchMedia("(max-width: 768px)").matches;
    if (!isMobile) return;

    let intervalId: NodeJS.Timeout;

    const startAutoScroll = () => {
      intervalId = setInterval(() => {
        const container = scrollRef.current;
        if (container) {
          const maxScroll = container.scrollWidth - container.clientWidth;
          if (container.scrollLeft >= maxScroll - 10) {
            container.scrollTo({ left: 0, behavior: 'smooth' });
          } else {
            container.scrollBy({ left: 320, behavior: 'smooth' });
          }
        }
      }, 3000);
    };

    if (bootcamps.length > 0) {
        setTimeout(() => {
          startAutoScroll();
          const container = scrollRef.current;
          if (container) {
             container.addEventListener('touchstart', () => clearInterval(intervalId));
             container.addEventListener('touchend', startAutoScroll);
          }
        }, 500);
    }
    return () => clearInterval(intervalId);
  }, [bootcamps]);

  const handleEnrollBootcamp = async (bootcamp: any) => {
    router.push(`/bootcamps/${bootcamp._id}`);
  };

  const handleGuestLeadSubmission = async (leadData: any) => {
    trackEvent('bootcamp_lead_submit', { bootcamp_id: pendingBootcamp?._id, bootcamp_title: pendingBootcamp?.title });
    setIsLeadModalOpen(false);
    await proceedToPayment(pendingBootcamp, leadData);
  };

  const proceedToPayment = async (bootcamp: any, guestInfo: any) => {
    setIsProcessing(true);
    try {
      const payload: any = { bootcampId: bootcamp._id };
      if (guestInfo) {
        payload.guestName = guestInfo.name;
        payload.guestEmail = guestInfo.email;
        payload.guestPhone = guestInfo.phone;
        payload.guestAge = guestInfo.age;
      }

      const orderRes = await api.post('/api/payments/bootcamp-order', payload);
      const order = orderRes.data.data;

      trackEvent('bootcamp_payment_init', { 
        bootcamp_id: bootcamp._id, 
        amount: order.amount / 100, 
        currency: order.currency 
      });

      const options = {
        key: process.env.NEXT_PUBLIC_RAZORPAY_KEY || 'rzp_test_SPPoz25OmAiMsD',
        amount: order.amount,
        currency: order.currency,
        name: "RUZANN",
        description: `Bootcamp: ${bootcamp.title}`,
        order_id: order.id,
        handler: async function (response: any) {
          try {
            const verifyPayload: any = {
              razorpay_order_id: response.razorpay_order_id,
              razorpay_payment_id: response.razorpay_payment_id,
              razorpay_signature: response.razorpay_signature,
              bootcampId: bootcamp._id
            };
            if (guestInfo) {
               verifyPayload.guestName = guestInfo.name;
               verifyPayload.guestEmail = guestInfo.email;
               verifyPayload.guestPhone = guestInfo.phone;
               verifyPayload.guestAge = guestInfo.age;
            }

            const verifyRes = await api.post('/api/payments/bootcamp-verify', verifyPayload);

            if (verifyRes.data.success) {
              trackEvent('bootcamp_payment_success', { 
                bootcamp_id: bootcamp._id, 
                amount: order.amount / 100, 
                currency: order.currency 
              });
              router.push('/payment-success');
            }
          } catch (err: any) {
            console.error("Verification error:", err);
            showToast("Payment verification failed: " + (err.response?.data?.message || err.message), "error");
          }
        },
        prefill: {
          name: user?.name || guestInfo?.name,
          email: user?.email || guestInfo?.email,
          contact: guestInfo?.phone
        },
        theme: {
          color: "#4F46E5"
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
      setPendingBootcamp(null);
    }
  };

  if (loading) return (
    <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-6">
      {[1, 2, 3, 4].map(i => <div key={i} className="h-64 rounded-3xl bg-gray-100 animate-pulse" />)}
    </div>
  );

  if (bootcamps.length === 0) return null;

  return (
    <div ref={scrollRef} className="flex md:grid md:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8 overflow-x-auto scrollbar-hide no-scrollbar w-full px-4 md:px-0 pb-8">
      {bootcamps.map((bc: any) => {
        const thumbUrl = getThumbnailUrl(bc.image);
        return (
          <div key={bc._id} className="w-[85vw] md:w-full flex-none group cursor-pointer" onClick={() => handleEnrollBootcamp(bc)}>
            <Card className="h-full border border-gray-200 rounded-[1.5rem] shadow-sm hover:shadow-lg transition-all duration-300 flex flex-col bg-white overflow-hidden">
              <div className="relative aspect-[16/10] bg-[#eef5ff] flex items-center justify-center group-hover:bg-[#e4efff] transition-colors overflow-hidden">
                {bc.showStudentsEnrolled && bc.studentsEnrolled > 0 && (
                <div className="absolute top-3 left-3 bg-white/80 backdrop-blur-sm px-2 py-1 rounded-full flex items-center gap-1 shadow-sm border border-white z-20">
                  <div className="w-4 h-4 rounded-full bg-blue-100 flex items-center justify-center overflow-hidden">
                    <span className="text-[8px]">👦</span>
                  </div>
                  <span className="text-[10px] font-bold text-gray-700">{bc.studentsEnrolled} Enrolled</span>
                </div>
                )}



                <div className="w-full h-full relative z-10 flex items-center justify-center">
                  {bc.image && bc.image !== 'no-image.jpg' ? (
                    <img src={thumbUrl} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" alt={bc.title} />
                  ) : (
                    <div className="text-6xl filter drop-shadow-md group-hover:scale-110 transition-transform duration-500">🚀</div>
                  )}
                </div>

                <div className="absolute bottom-4 left-0 right-0 flex justify-center items-center gap-2 z-20">
                  <span className="bg-white px-3 py-1 rounded-full text-[10px] font-bold text-gray-600 shadow-sm whitespace-nowrap">Bootcamp</span>
                  <span className="bg-white px-3 py-1 rounded-full text-[10px] font-bold text-gray-600 shadow-sm whitespace-nowrap">Live</span>
                </div>
              </div>

              <CardContent className="p-5 flex flex-col flex-1 bg-white">
                <h3 className="text-xl font-bold text-black mb-2 line-clamp-2 min-h-[3.5rem]">{bc.title}</h3>
                
                <div className="flex items-center justify-between mb-3 text-sm">
                  {bc.rating > 0 && (
                  <div className="flex items-center gap-1 text-gray-600">
                    <Star size={14} className="text-yellow-400 fill-yellow-400" /> 
                    <span className="font-bold text-black">{bc.rating.toFixed(1)}</span>
                  </div>
                  )}
                  {bc.showStudentsEnrolled && (
                  <div className="flex items-center gap-1 text-black font-bold text-xs ml-auto">
                    <span className="text-gray-600">👤</span> {bc.studentsEnrolled || 0} students
                  </div>
                  )}
                </div>

                <div className="flex flex-col gap-1.5 mb-4 text-sm text-gray-600">
                  <div className="flex items-center gap-2">
                     <Calendar size={14} className="text-gray-400" />
                     <span className="truncate">{new Date(bc.date || Date.now()).toLocaleDateString('en-IN', { day: 'numeric', month: 'short' })} - {new Date(bc.endDate || Date.now()).toLocaleDateString('en-IN', { day: 'numeric', month: 'short' })}</span>
                  </div>
                  {bc.venue && (
                  <div className="flex items-center gap-2">
                     <MapPin size={14} className="text-gray-400" />
                     <span className="truncate">{bc.venue}</span>
                  </div>
                  )}
                </div>

                <div className="flex flex-col gap-4 mt-auto">
                  <div className="flex flex-col pt-1">
                     <div className="flex items-baseline gap-2">
                        <span className="text-2xl lg:text-3xl font-black text-black">₹{bc.price}</span>
                        <span className="text-sm font-medium text-gray-400 line-through">₹{bc.price + 999}</span>
                     </div>
                     <div className="text-sm font-bold text-black mt-1">
                        (Total Bootcamp pass)
                     </div>
                  </div>
                  
                  <Button 
                    variant="outline"
                    isLoading={isProcessing && pendingBootcamp?._id === bc._id}
                    className="w-full rounded-full py-5 border-2 border-primary-500 text-primary-500 hover:bg-primary-500 hover:text-white font-bold text-base transition-colors mt-2 shadow-none"
                  >
                    Enroll Now
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
        );
      })}

      <EnrollLeadModal 
        isOpen={isLeadModalOpen} 
        onClose={() => setIsLeadModalOpen(false)} 
        onProceed={handleGuestLeadSubmission}
        isProcessing={isProcessing}
        title="Enroll in Bootcamp 🎓"
      />
    </div>
  );
};

const WorkshopSection = () => {
  const { user, token } = useAuth();
  const router = useRouter();
  const { showToast } = useToast();
  const [workshops, setWorkshops] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [isProcessing, setIsProcessing] = useState(false);
  const [activeWorkshopForSlots, setActiveWorkshopForSlots] = useState<any>(null);
  const [workshopSlots, setWorkshopSlots] = useState<any[]>([]);
  const [isLeadModalOpen, setIsLeadModalOpen] = useState(false);
  const [pendingWorkshopFetch, setPendingWorkshopFetch] = useState<any>(null);
  const [guestDetails, setGuestDetails] = useState<any>(null);

  useEffect(() => {
    const fetchWorkshops = async () => {
      try {
        const res = await api.get('/api/workshops');
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

  const scrollRef = React.useRef<HTMLDivElement>(null);

  useEffect(() => {
    const isMobile = window.matchMedia("(max-width: 768px)").matches;
    if (!isMobile) return;

    let intervalId: NodeJS.Timeout;

    const startAutoScroll = () => {
      intervalId = setInterval(() => {
        const container = scrollRef.current;
        if (container) {
          const maxScroll = container.scrollWidth - container.clientWidth;
          if (container.scrollLeft >= maxScroll - 10) {
            container.scrollTo({ left: 0, behavior: 'smooth' });
          } else {
            container.scrollBy({ left: 320, behavior: 'smooth' });
          }
        }
      }, 3000);
    };

    if (workshops.length > 0) {
        setTimeout(() => {
          startAutoScroll();
          const container = scrollRef.current;
          if (container) {
             container.addEventListener('touchstart', () => clearInterval(intervalId));
             container.addEventListener('touchend', startAutoScroll);
          }
        }, 500);
    }
    return () => clearInterval(intervalId);
  }, [workshops]);

  const handleBookWorkshop = async (workshop: any) => {
    router.push(`/workshops/${workshop._id}`);
  };

  const handleSlotSelection = async (slotId: string | null) => {
     if (!user) {
        setPendingWorkshopFetch({ workshop: activeWorkshopForSlots, slotId });
        setIsLeadModalOpen(true);
     } else {
        trackEvent('workshop_slot_select', { workshop_id: activeWorkshopForSlots?._id, slot_id: slotId });
        await proceedToPayment(activeWorkshopForSlots, slotId, null);
     }
     setActiveWorkshopForSlots(null);
  };

  const handleGuestLeadSubmission = async (leadData: any) => {
    trackEvent('workshop_lead_submit', { workshop_id: pendingWorkshopFetch?.workshop?._id });
    setGuestDetails(leadData);
    setIsLeadModalOpen(false);
    await proceedToPayment(pendingWorkshopFetch.workshop, pendingWorkshopFetch.slotId, leadData);
  };

  const proceedToPayment = async (workshop: any, slotId: string | null, guestInfo: any) => {
    setIsProcessing(true);
    try {
      const payload: any = { workshopId: workshop._id };
      if (slotId) payload.slotId = slotId;
      if (guestInfo) {
        payload.guestName = guestInfo.name;
        payload.guestEmail = guestInfo.email;
        payload.guestPhone = guestInfo.phone;
        payload.guestAge = guestInfo.age;
      }

      const orderRes = await api.post('/api/payments/workshop-order', payload);
      const order = orderRes.data.data;

      trackEvent('workshop_payment_init', { 
        workshop_id: workshop._id, 
        amount: order.amount / 100, 
        currency: order.currency 
      });

      // 2. Open Razorpay Widget
      const options = {
        key: process.env.NEXT_PUBLIC_RAZORPAY_KEY || 'rzp_test_SPPoz25OmAiMsD',
        amount: order.amount,
        currency: order.currency,
        name: "RUZANN",
        description: `Workshop: ${workshop.title}`,
        order_id: order.id,
        handler: async function (response: any) {
          try {
            const verifyPayload: any = {
              razorpay_order_id: response.razorpay_order_id,
              razorpay_payment_id: response.razorpay_payment_id,
              razorpay_signature: response.razorpay_signature,
              workshopId: workshop._id
            };
            if (slotId) verifyPayload.slotId = slotId;
            if (guestInfo) {
               verifyPayload.guestName = guestInfo.name;
               verifyPayload.guestEmail = guestInfo.email;
               verifyPayload.guestPhone = guestInfo.phone;
               verifyPayload.guestAge = guestInfo.age;
            }

            const verifyRes = await api.post('/api/payments/workshop-verify', verifyPayload);

            if (verifyRes.data.success) {
              trackEvent('workshop_payment_success', { 
                workshop_id: workshop._id, 
                amount: order.amount / 100, 
                currency: order.currency 
              });
              router.push('/payment-success');
            }
          } catch (err: any) {
            console.error("Verification error:", err);
            showToast("Payment verification failed: " + (err.response?.data?.message || err.message), "error");
          }
        },
        prefill: {
          name: user?.name || guestInfo?.name,
          email: user?.email || guestInfo?.email,
          contact: guestInfo?.phone
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
      console.error("Payment initiation error:", err);
      showToast("Failed to initiate payment: " + (err.response?.data?.message || err.message), "error");
    } finally {
      setIsProcessing(false);
      setPendingWorkshopFetch(null);
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
       <h3 className="text-3xl font-black text-gray-900 mb-2">No Workshops Scheduled</h3>
       <p className="text-gray-900 font-bold">New magical learning sessions are being planned. Check back soon!</p>
     </div>
  );

  return (
    <div ref={scrollRef} className="flex md:grid md:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8 overflow-x-auto scrollbar-hide no-scrollbar w-full px-4 md:px-0 pb-8">
      {workshops.map((ws: any) => {
        const thumbUrl = getThumbnailUrl(ws.image);
        return (
          <div key={ws._id} className="w-[85vw] md:w-full flex-none group cursor-pointer" onClick={() => handleBookWorkshop(ws)}>
            <Card className="h-full border border-gray-200 rounded-[1.5rem] shadow-sm hover:shadow-lg transition-all duration-300 flex flex-col bg-white overflow-hidden">
              <div className="relative aspect-[16/10] bg-[#eef5ff] flex items-center justify-center group-hover:bg-[#e4efff] transition-colors overflow-hidden">
                {ws.showStudentsEnrolled && ws.studentsEnrolled > 0 && (
                <div className="absolute top-3 left-3 bg-white/80 backdrop-blur-sm px-2 py-1 rounded-full flex items-center gap-1 shadow-sm border border-white z-20">
                  <div className="w-4 h-4 rounded-full bg-blue-100 flex items-center justify-center overflow-hidden">
                    <span className="text-[8px]">👦</span>
                  </div>
                  <span className="text-[10px] font-bold text-gray-700">{ws.studentsEnrolled} Enrolled</span>
                </div>
                )}



                <div className="w-full h-full relative z-10 flex items-center justify-center">
                  {ws.image && ws.image !== 'no-image.jpg' ? (
                    <img src={thumbUrl} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" alt={ws.title} />
                  ) : (
                    <div className="text-6xl filter drop-shadow-md group-hover:scale-110 transition-transform duration-500">
                      {ws.title.toLowerCase().includes('space') ? '🚀' : ws.title.toLowerCase().includes('robot') ? '🤖' : ws.title.toLowerCase().includes('art') ? '🎨' : '🎟️'}
                    </div>
                  )}
                </div>

                <div className="absolute bottom-4 left-0 right-0 flex justify-center items-center gap-2 z-20">
                  <span className="bg-white px-3 py-1 rounded-full text-[10px] font-bold text-gray-600 shadow-sm whitespace-nowrap">Workshop</span>
                  <span className="bg-white px-3 py-1 rounded-full text-[10px] font-bold text-gray-600 shadow-sm whitespace-nowrap">Event</span>
                </div>
              </div>

              <CardContent className="p-5 flex flex-col flex-1 bg-white">
                <h3 className="text-xl font-bold text-black mb-2 line-clamp-2 min-h-[3.5rem]">{ws.title}</h3>
                
                <div className="flex items-center justify-between mb-3 text-sm">
                  {ws.rating > 0 && (
                  <div className="flex items-center gap-1 text-gray-600">
                    <Star size={14} className="text-yellow-400 fill-yellow-400" /> 
                    <span className="font-bold text-black">{ws.rating.toFixed(1)}</span>
                  </div>
                  )}
                  {ws.showStudentsEnrolled && (
                  <div className="flex items-center gap-1 text-black font-bold text-xs ml-auto">
                    <span className="text-gray-600">👤</span> {ws.studentsEnrolled || 0} students
                  </div>
                  )}
                </div>

                <div className="flex flex-col gap-1.5 mb-4 text-sm text-gray-600">
                  <div className="flex items-center gap-2">
                     <Calendar size={14} className="text-gray-400" />
                     <span className="truncate">{new Date(ws.date).toLocaleDateString('en-IN', { day: 'numeric', month: 'short' })}</span>
                  </div>
                  <div className="flex items-center gap-2">
                     <MapPin size={14} className="text-gray-400" />
                     <span className="truncate">{ws.venue}</span>
                  </div>
                </div>

                <div className="flex flex-col gap-4 mt-auto">
                  <div className="flex flex-col pt-1">
                     <div className="flex items-baseline gap-2">
                        <span className="text-2xl lg:text-3xl font-black text-black">₹{ws.price}</span>
                        <span className="text-sm font-medium text-gray-400 line-through">₹{ws.price + 999}</span>
                     </div>
                     <div className="text-sm font-bold text-black mt-1">
                        (Event ticket)
                     </div>
                  </div>
                  
                  <Button 
                    variant="outline"
                    isLoading={isProcessing && activeWorkshopForSlots?._id === ws._id}
                    className="w-full rounded-full py-5 border-2 border-primary-500 text-primary-500 hover:bg-primary-500 hover:text-white font-bold text-base transition-colors mt-2 shadow-none"
                  >
                    Enroll Now
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
        )
      })}

      {activeWorkshopForSlots && (
        <WorkshopSlotSelectorModal
          workshop={activeWorkshopForSlots}
          slots={workshopSlots}
          onClose={() => setActiveWorkshopForSlots(null)}
          onProceed={(slotId) => handleSlotSelection(slotId)}
          isProcessing={isProcessing}
        />
      )}

      <EnrollLeadModal 
        isOpen={isLeadModalOpen} 
        onClose={() => setIsLeadModalOpen(false)} 
        onProceed={handleGuestLeadSubmission}
        isProcessing={isProcessing}
        title="Enroll in Workshop 🎟️"
      />
    </div>
  );
};



const ContactSection = () => {
  const { showToast } = useToast();
  const [form, setForm] = useState({ name: '', email: '', phone: '', subject: '', message: '', referralCode: '' });
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    try {
      await axios.post('/api/leads', {
        name: form.name,
        email: form.email,
        phone: form.phone || 'Not provided',
        source: 'Website',
        referralCode: form.referralCode,
        notes: [{ text: `Subject: ${form.subject}\nMessage: ${form.message}` }]
      });
      trackEvent('contact_form_submit', { subject: form.subject });
      showToast("Thanks! Our team will contact you soon 🎉", "success");
      setForm({ name: '', email: '', phone: '', subject: '', message: '', referralCode: '' });
    } catch (err) {
      console.error(err);
      showToast("Something went wrong. Please try again later.", "error");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <section className="relative py-24 px-4 overflow-hidden" id="contact">
      {/* Playful Background Elements */}
      <div className="absolute inset-0 bg-slate-50 z-0" />
      <div className="absolute top-0 right-0 w-96 h-96 bg-primary-200 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-float" />
      <div className="absolute bottom-0 left-0 w-96 h-96 bg-secondary-200 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-float" style={{ animationDelay: '2s' }} />
      
      {/* Floating Icons */}
      <div className="absolute top-20 left-10 text-4xl opacity-20 animate-bounce">🎈</div>
      <div className="absolute bottom-20 right-10 text-4xl opacity-20 animate-bounce" style={{ animationDelay: '1s' }}>🚀</div>
      <div className="absolute top-1/2 right-[5%] text-4xl opacity-10 animate-pulse">✨</div>

      <div className="relative z-10 max-w-7xl mx-auto flex flex-col lg:flex-row items-center gap-16">
        <div className="flex-1 text-center lg:text-left">
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-white rounded-full text-secondary-600 font-bold mb-6 shadow-sm border border-gray-100">
            <MessageCircle size={16} />
            <span className="text-sm">Have a Question?</span>
          </div>
          <h2 className="text-4xl md:text-6xl font-black text-gray-900 mb-6 leading-tight">
            Let's Start a <br/><span className="text-primary-600">Magical</span> Conversation!
          </h2>
          <p className="text-lg font-bold text-black mb-10 max-w-xl leading-relaxed">
            Whether you're curious about our courses, need a demo, or just want to say hi, we're all ears!
          </p>
          
          <div className="space-y-6 max-w-md mx-auto lg:mx-0">
             <div className="flex items-center gap-6 p-4 bg-white rounded-3xl border border-gray-100 shadow-sm hover:translate-x-2 transition-transform">
               <div className="w-14 h-14 bg-primary-100 text-primary-600 rounded-2xl flex items-center justify-center shadow-inner">
                 <Mail size={24} />
               </div>
               <div className="text-left">
                 <p className="text-xs font-black text-gray-900 uppercase tracking-widest mb-1">Email Us</p>
                 <p className="font-bold text-gray-800">support@ruzann.com</p>
               </div>
             </div>
             <div className="flex items-center gap-6 p-4 bg-white rounded-3xl border border-gray-100 shadow-sm hover:translate-x-2 transition-transform">
               <div className="w-14 h-14 bg-secondary-100 text-secondary-600 rounded-2xl flex items-center justify-center shadow-inner">
                 <Phone size={24} />
               </div>
               <div className="text-left">
                 <p className="text-xs font-black text-gray-900 uppercase tracking-widest mb-1">Call Us</p>
                 <p className="font-bold text-gray-800">+91 9960559894</p>
               </div>
             </div>
          </div>
        </div>

        <Card className="w-full lg:w-[500px] bg-white p-8 md:p-12 rounded-[3.5rem] shadow-2xl border-none relative">
           <div className="absolute -top-6 -left-6 bg-yellow-400 text-white w-16 h-16 rounded-3xl flex items-center justify-center text-3xl shadow-lg rotate-12 animate-wiggle">✍️</div>
           
           <form onSubmit={handleSubmit} className="space-y-6">
              <div className="space-y-2">
                <label className="text-[10px] font-black text-gray-900 uppercase tracking-widest ml-4">Your Name</label>
                <input 
                  required
                  type="text"
                  placeholder="Superstar's Name"
                  className="w-full px-6 py-4 rounded-2xl border-2 border-slate-200 bg-white focus:border-primary-400 focus:outline-none transition-all font-bold text-black placeholder:text-gray-500"
                  value={form.name}
                  onChange={(e) => setForm({...form, name: e.target.value})}
                />
              </div>

              <div className="space-y-2">
                <label className="text-[10px] font-black text-gray-900 uppercase tracking-widest ml-4">Email Address</label>
                <input 
                  required
                  type="email"
                  placeholder="parent@example.com"
                  className="w-full px-6 py-4 rounded-2xl border-2 border-slate-200 bg-white focus:border-primary-400 focus:outline-none transition-all font-bold text-black placeholder:text-gray-500"
                  value={form.email}
                  onChange={(e) => setForm({...form, email: e.target.value})}
                />
              </div>

              <div className="space-y-2">
                <label className="text-[10px] font-black text-gray-900 uppercase tracking-widest ml-4">Phone Number</label>
                <input 
                  required
                  type="tel"
                  placeholder="+91 00000 00000"
                  className="w-full px-6 py-4 rounded-2xl border-2 border-slate-200 bg-white focus:border-primary-400 focus:outline-none transition-all font-bold text-black placeholder:text-gray-500"
                  value={form.phone}
                  onChange={(e) => setForm({...form, phone: e.target.value})}
                />
              </div>

              <div className="space-y-2">
                <label className="text-[10px] font-black text-gray-900 uppercase tracking-widest ml-4">What's on your mind?</label>
                <div className="relative group">
                  <select 
                    required
                    className="w-full px-6 py-4 rounded-2xl border-2 border-slate-200 bg-white focus:border-primary-400 focus:outline-none transition-all font-bold text-black appearance-none pr-12"
                    value={form.subject}
                    onChange={(e) => setForm({...form, subject: e.target.value})}
                  >
                    <option value="">Choose a Magic Topic</option>
                    <option value="Courses">Course Enquiry 📚</option>
                    <option value="Demo">Free Demo Session 🎁</option>
                    <option value="Feedback">Just Saying Hi 👋</option>
                  </select>
                  <div className="absolute right-5 top-1/2 -translate-y-1/2 pointer-events-none text-gray-900">
                    <ChevronDown size={20} />
                  </div>
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-[10px] font-black text-gray-900 uppercase tracking-widest ml-4">Referral Code (Optional)</label>
                <input 
                  type="text"
                  placeholder="e.g. RUZ-X4K"
                  className="w-full px-6 py-4 rounded-2xl border-2 border-slate-200 bg-white focus:border-primary-400 focus:outline-none transition-all font-bold text-black uppercase placeholder:text-gray-500"
                  value={form.referralCode}
                  onChange={(e) => setForm({...form, referralCode: e.target.value})}
                />
              </div>

              <div className="space-y-2">
                <label className="text-[10px] font-black text-gray-900 uppercase tracking-widest ml-4">Message</label>
                <textarea 
                  required
                  rows={4}
                  placeholder="Share your magic thoughts..."
                  className="w-full px-6 py-4 rounded-2xl border-2 border-slate-200 bg-white focus:border-primary-400 focus:outline-none transition-all font-bold text-black resize-none placeholder:text-gray-500"
                  value={form.message}
                  onChange={(e) => setForm({...form, message: e.target.value})}
                />
              </div>

              <Button 
                type="submit" 
                size="lg" 
                fullWidth 
                className="py-8 rounded-[2rem] font-black text-xl bg-[#EF4444] hover:bg-[#DC2626] border-none shadow-xl shadow-[#EF4444]/20 transition-all flex items-center justify-center gap-3 active:scale-95"
                isLoading={isSubmitting}
              >
                Send Some Magic! <Send size={20} />
              </Button>
           </form>
        </Card>
      </div>
    </section>
  );
};

export default function Home() {
  const router = useRouter();
  const { user } = useAuth();
  const { openIntroModal } = useIntroOffer();
  const [currentSlide, setCurrentSlide] = useState(0);
  const [mentors, setMentors] = useState<any[]>([]);
  const [loadingMentors, setLoadingMentors] = useState(true);


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

    // Fetch Approved Mentors
    const fetchMentors = async () => {
      try {
        const res = await api.get('/api/mentors');
        if (res.data.success) {
          setMentors(res.data.data);
        }
      } catch (error) {
        console.error("Error fetching mentors:", error);
      } finally {
        setLoadingMentors(false);
      }
    };
    fetchMentors();
  }, []);





  return (
    <div className="min-h-screen bg-white flex flex-col font-sans overflow-hidden">
      <Header />
      
      {/* Top AdSense Unit 
      <div className="max-w-7xl mx-auto px-4 pt-4">
        <AdUnit slot="top-banner" className="mb-0" />
      </div>
      */}

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
            <span className="text-xl animate-spin-slow">✨</span> THE MOST FUN LEARNING EXPERIENCE!
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
                Start Learning 🚀
              </Button>
            </Link>
            <Button 
              variant="secondary"
              size="lg"
              onClick={openIntroModal}
              className="text-lg px-10 py-4 rounded-full bg-white/10 backdrop-blur-lg border-2 border-white/20 hover:bg-white/20 font-black text-white"
            >
              Claim ₹99 Offer ✨
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

      {/* NEW PLAY & LEARN SECTION */}
      <PlayAndLearnSection />

      {/* Mid-Page AdSense Unit 
      <div className="max-w-7xl mx-auto px-4 py-8">
        <AdUnit slot="mid-page-interstitial" className="my-0" />
      </div>
      */}

      {/* 2.6 WORKSHOPS & BOOTCAMPS SECTION */}
      <section className="py-14 bg-gradient-to-b from-white to-gray-50 overflow-hidden" id="workshops">
        <div className="container mx-auto px-4">
          <div className="flex flex-col md:flex-row items-end justify-between mb-8 gap-4 text-center md:text-left">
            <div className="max-w-2xl">
              <div className="inline-flex items-center gap-2 px-4 py-2 bg-accent-100 rounded-full text-accent-600 font-bold mb-3">
                <Rocket size={16} />
                <span className="text-sm">Space Bootcamps</span>
              </div>
              <div className="flex items-center justify-center md:justify-start gap-3 mb-2">
                <Ticket className="w-8 h-8 md:w-10 md:h-10 text-secondary-500 animate-bounce-slow" />
                <h2 className="text-3xl md:text-5xl font-black leading-tight drop-shadow-sm animate-float">
                  <span className="text-transparent bg-clip-text bg-gradient-to-r from-secondary-500 via-purple-500 to-pink-500">Magical Workshops</span>
                </h2>
              </div>
            </div>
            <p className="text-base font-bold md:max-w-xs animate-pulse opacity-90 mt-2">
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-purple-600 to-secondary-500">Intensive learning experiences designed to spark creative magic.</span>
            </p>
          </div>

          <WorkshopSection />
        </div>
      </section>

      {/* 2.7 BOOTCAMPS SECTION */}
      <section className="py-14 bg-white overflow-hidden" id="bootcamps">
        <div className="container mx-auto px-4">
          <div className="flex flex-col md:flex-row items-end justify-between mb-8 gap-4 text-center md:text-left">
            <div className="max-w-2xl">
              <div className="inline-flex items-center gap-2 px-4 py-2 bg-indigo-100 rounded-full text-indigo-600 font-bold mb-3">
                <Sparkles size={16} />
                <span className="text-sm">Extended Learning</span>
              </div>
              <div className="flex items-center justify-center md:justify-start gap-3 mb-2">
                <GraduationCap className="w-8 h-8 md:w-10 md:h-10 text-secondary-500 animate-bounce-slow" />
                <h2 className="text-3xl md:text-5xl font-black leading-tight drop-shadow-sm animate-float">
                  <span className="text-transparent bg-clip-text bg-gradient-to-r from-secondary-500 via-purple-500 to-pink-500">Specialized Bootcamps</span>
                </h2>
              </div>
            </div>
            <p className="text-base font-bold md:max-w-xs animate-pulse opacity-90 mt-2">
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-purple-600 to-secondary-500">Long-term intensive programs to master advanced technologies.</span>
            </p>
          </div>

          <BootcampSection />
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
            <ul className="space-y-3 font-semibold text-base text-gray-100 mb-8">
               <li className="flex items-center gap-3"><span className="text-green-400 text-xl">✓</span> Python & JavaScript support</li>
               <li className="flex items-center gap-3"><span className="text-green-400 text-xl">✓</span> Visual block-to-code switching</li>
               <li className="flex items-center gap-3"><span className="text-green-400 text-xl">✓</span> Instant browser preview</li>
            </ul>
            <Link href={user ? "/editor" : "/signup"}>
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

      <CourseSelection />

      {/* After Courses AdSense Unit 
      <div className="max-w-7xl mx-auto px-4 py-8">
        <AdUnit slot="post-courses-banner" className="my-0" />
      </div>
      */}

      {/* UPDATED SUPERSTAR PROJECTS SECTION */}
      <SuperstarProjects />

      {/* 2. ₹99 ATTRACTIVE SECTION */}
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
              <span className="text-yellow-200 inline-block -rotate-6 scale-110 mx-2 drop-shadow-xl">₹99</span>
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
               Go Magic! ₹99 🚀
             </button>
             <div className="mt-5 pt-5 border-t-2 border-gray-100 flex items-center justify-center gap-4 text-gray-900 font-bold">
               <span className="text-xs uppercase">Trusted by</span>
               <div className="flex -space-x-3">
                 {[1,2,3,4].map(i => <div key={i} className="w-9 h-9 rounded-full border-2 border-white bg-gray-200 flex items-center justify-center text-[10px]"><UserIcon className="w-4 h-4" /></div>)}
                 <div className="w-9 h-9 rounded-full border-2 border-white bg-secondary-500 text-white flex items-center justify-center text-[10px] font-black">+10k</div>
               </div>
             </div>
           </Card>
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

      {/* 5. TESTIMONIALS SECTION */}
      <section className="py-12 px-4 bg-primary-50">
        <div className="max-w-6xl mx-auto text-center">
          <h2 className="text-3xl md:text-4xl font-black text-gray-800 mb-10">Stories from our <span className="text-secondary-500">Superstars</span>! 🌟</h2>
          
          <div className="flex overflow-x-auto md:grid md:grid-cols-3 gap-6 md:gap-8 pb-8 md:pb-0 snap-x snap-mandatory scrollbar-hide -mx-4 px-4 md:mx-0 md:px-0">
            <Card className="min-w-[280px] md:min-w-0 bg-white text-left p-6 md:p-8 snap-center">
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
               <p className="text-gray-600 font-bold text-lg mb-6">"As a parent, I love how secure and structured it is. My daughter genuinely looks forward to her classes."</p>
               <div className="flex items-center gap-4">
                  <div className="w-12 h-12 bg-secondary-200 rounded-full flex items-center justify-center text-xl">👩🏽</div>
                  <div>
                    <h4 className="font-black text-gray-800">Priya S.</h4>
                    <span className="text-gray-500 text-sm">Parent</span>
                  </div>
               </div>
            </Card>

            <Card className="min-w-[280px] md:min-w-0 bg-white text-left p-6 md:p-8 snap-center">
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
           <Link href="/teachers#experts">
             <Button variant="outline" className="hidden md:flex font-bold">See all Mentors</Button>
           </Link>
        </div>

        <div className="flex md:grid md:grid-cols-2 lg:grid-cols-4 gap-6 overflow-x-auto scrollbar-hide no-scrollbar w-full px-4 md:px-0 pb-8">
           {loadingMentors ? (
             [1,2,3,4].map(i => (
               <div key={i} className="min-w-[280px] md:min-w-0 h-48 rounded-2xl bg-gray-50 animate-pulse border-2 border-gray-100 flex-none" />
             ))
           ) : mentors.length === 0 ? (
             <div className="col-span-full text-center py-10 bg-gray-50 rounded-2xl border-2 border-dashed border-gray-200">
                <p className="text-gray-900 font-bold italic">Adding our expert mentors shortly! Stay tuned. ✨</p>
             </div>
           ) : (
             mentors.map((mentor, i) => {
               const bgColors = ['bg-blue-100', 'bg-purple-100', 'bg-green-100', 'bg-yellow-100', 'bg-red-100', 'bg-orange-100'];
               const bgColor = bgColors[i % bgColors.length];
               return (
                 <Link href={`/teachers/${mentor._id}`} key={mentor._id} className="min-w-[280px] md:min-w-0 flex-none bg-white border-2 border-gray-100 rounded-2xl p-5 text-center hover:border-primary-300 transition-all cursor-pointer group hover:-translate-y-1 hover:shadow-xl shadow-primary-100">
                   <div className={`w-24 h-24 ${bgColor} rounded-full flex items-center justify-center text-5xl mx-auto mb-4 group-hover:scale-110 transition-transform overflow-hidden relative border-4 border-white shadow-sm`}>
                     {mentor.profilePicture ? (
                       <img 
                        src={getThumbnailUrl(mentor.profilePicture)} 
                        alt={mentor.name} 
                        className="w-full h-full object-cover" 
                       />
                     ) : (
                       <span className="font-baloo text-primary-600 font-black">{mentor.name[0]}</span>
                     )}
                   </div>
                   <h3 className="text-2xl font-black text-gray-800 mb-1">{mentor.name}</h3>
                   <p className="text-gray-500 font-bold mb-2 uppercase tracking-tight text-sm">
                     {mentor.specialization || "Expert Mentor"}
                   </p>
                 </Link>
               );
             })
           )}
        </div>
        <Link href="/teachers#experts">
          <Button variant="outline" className="md:hidden w-full font-bold mt-8">See all Mentors</Button>
        </Link>
      </section>

      <BlogSection />
      <ContactSection />
      
      {/* Bottom AdSense Unit 
      <div className="max-w-7xl mx-auto px-4 py-8">
        <AdUnit slot="footer-banner" className="mt-0" />
      </div>
      */}

      <Footer />
      <ScrollToTop />
    </div>
  );
}

// MODERN COURSE CATALOG COMPONENT
const CourseCatalog = () => {
    const [gradeFilter, setGradeFilter] = useState('All Ages');
    const [typeFilter, setTypeFilter] = useState('All');
    const [courses, setCourses] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchCourses = async () => {
            try {
                const res = await api.get('/api/courses');
                if (res.data.success) {
                    setCourses(res.data.data);
                }
            } catch (err) {
                console.error("Failed to fetch courses:", err);
            } finally {
                setLoading(false);
            }
        };
        fetchCourses();
    }, []);

    const getCourseIcon = (category: string) => {
        const cat = category?.toLowerCase() || '';
        if (cat.includes('robot')) return "🤖";
        if (cat.includes('cod')) return "🐱";
        if (cat.includes('ai')) return "🧠";
        if (cat.includes('math')) return "🧩";
        if (cat.includes('art')) return "🎨";
        return "📚";
    };

    const getCourseColor = (category: string) => {
        const cat = category?.toLowerCase() || '';
        if (cat.includes('robot')) return "bg-[#EF444410]";
        if (cat.includes('cod')) return "bg-[#FF767510]";
        if (cat.includes('ai')) return "bg-[#FDCB6E10]";
        if (cat.includes('math')) return "bg-[#00B89410]";
        if (cat.includes('art')) return "bg-[#FD79A810]";
        return "bg-blue-50";
    };

    const filtered = courses.filter(c => 
        (gradeFilter === 'All Ages' || c.ageGroup === gradeFilter || (gradeFilter === 'Ages 6–9' && c.ageGroup === '6-9') || (gradeFilter === 'Ages 10–12' && c.ageGroup === '10-12') || (gradeFilter === 'Ages 13–16' && c.ageGroup === '13-16')) &&
        (typeFilter === 'All' || c.courseType === (typeFilter === '1:1 Classes' ? '1:1' : 'Group'))
    );

    if (loading) return (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10">
            {[1, 2, 3].map(i => <div key={i} className="h-96 rounded-[2.5rem] bg-gray-100 animate-pulse" />)}
        </div>
    );

    return (
        <div className="flex flex-col gap-12">
            {/* Filters Bar */}
            <div className="bg-white p-4 rounded-[2rem] border-2 border-gray-100 shadow-sm flex flex-col md:flex-row items-center justify-center gap-8 font-bold">
                <div className="flex items-center gap-4 flex-wrap justify-center">
                    <span className="text-gray-900 uppercase tracking-widest text-xs">Grade:</span>
                    {['All Ages', 'Ages 6–9', 'Ages 10–12', 'Ages 13–16'].map(grade => (
                        <button 
                            key={grade}
                            onClick={() => setGradeFilter(grade)}
                            className={`px-6 py-2 rounded-full transition-all text-sm md:text-base ${gradeFilter === grade ? 'bg-navy-900 text-white shadow-lg' : 'hover:bg-gray-100 text-gray-500'}`}
                        >
                            {grade}
                        </button>
                    ))}
                </div>
                <div className="hidden md:block w-px h-8 bg-gray-100" />
                <div className="flex items-center gap-4 flex-wrap justify-center">
                    <span className="text-gray-900 uppercase tracking-widest text-xs">Type:</span>
                    {['All', '1:1 Classes', 'Group Classes'].map(type => (
                        <button 
                            key={type}
                            onClick={() => setTypeFilter(type)}
                            className={`px-6 py-2 rounded-full transition-all text-sm md:text-base ${typeFilter === type ? 'bg-navy-900 text-white shadow-lg' : 'hover:bg-gray-100 text-gray-500'}`}
                        >
                            {type}
                        </button>
                    ))}
                </div>
            </div>

            {/* Courses Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-10">
                {filtered.map(course => (
                    <Card key={course._id} className="group bg-white rounded-[2.5rem] border-2 border-gray-50 overflow-hidden hover:shadow-2xl transition-all duration-500 hover:-translate-y-2 flex flex-col">
                        <div className={`h-48 md:h-64 ${getCourseColor(course.category?.name)} relative overflow-hidden flex items-center justify-center group-hover:scale-105 transition-transform duration-500`}>
                            {/* Tags */}
                            <div className="absolute top-4 md:top-6 left-4 md:left-6 flex gap-2">
                                <span className="bg-white/90 backdrop-blur-sm px-3 md:px-4 py-1.5 rounded-full text-[10px] font-black uppercase tracking-widest text-black shadow-sm">{course.category?.name || 'General'}</span>
                                <span className="bg-primary-500 px-3 md:px-4 py-1.5 rounded-full text-[10px] font-black uppercase tracking-widest text-white shadow-sm">{course.courseType}</span>
                            </div>
                            <div className="text-6xl md:text-8xl mt-4 filter drop-shadow-lg">{getCourseIcon(course.category?.name)}</div>
                            {/* Student Count Overlay */}
                            {course.studentsEnrolled > 0 && (
                            <div className="absolute bottom-4 md:bottom-6 right-4 md:right-6 bg-navy-900/80 backdrop-blur-sm text-white px-3 md:px-4 py-2 rounded-2xl flex items-center gap-2 text-[10px] md:text-xs font-black">
                                <UsersIcon size={14} /> {course.studentsEnrolled} Students
                            </div>
                            )}
                        </div>
                        <CardContent className="p-6 md:p-8 flex flex-col flex-1">
                            <h3 className="text-lg md:text-2xl font-black text-gray-900 mb-2 truncate group-hover:text-primary-500 transition-colors">{course.title}</h3>
                            <p className="text-gray-500 font-bold text-xs md:text-sm mb-4 md:mb-6 line-clamp-2 leading-relaxed">{course.description || course.shortDescription}</p>
                            
                            <div className="flex items-center gap-4 mb-6 md:mb-8">
                                <div className="flex items-center gap-2 text-[#FF7675] font-black text-xs md:text-sm whitespace-nowrap">
                                    <BookOpen size={16} className="shrink-0" /> {course.totalLessons || course.numberOfSessions} Sessions
                                </div>
                                <div className="w-px h-4 bg-gray-200 shrink-0" />
                                <div className="flex items-center gap-2 text-yellow-500 font-black text-xs md:text-sm whitespace-nowrap">
                                    <Star size={16} fill="currentColor" className="shrink-0" /> {course.rating || 5.0}
                                </div>
                            </div>

                            <div className="mt-auto pt-4 md:pt-6 border-t border-gray-50 flex items-center justify-between">
                                <div>
                                    <div className="text-xl md:text-3xl font-black text-gray-900">₹{(course.offerPrice || course.totalCoursePrice).toLocaleString()}</div>
                                    <div className="text-[10px] font-black text-gray-900 uppercase tracking-tighter">₹{course.pricePerSession}/class</div>
                                </div>
                                <Link href={`/courses/${course._id}`}>
                                    <Button className="rounded-2xl px-6 md:px-8 py-4 md:py-6 font-black text-base md:text-lg bg-primary-500 hover:bg-primary-600 shadow-lg shadow-primary-500/20">Enroll →</Button>
                                </Link>
                            </div>
                        </CardContent>
                    </Card>
                ))}
            </div>
            {filtered.length === 0 && (
                <div className="text-center py-20 bg-gray-50 rounded-[3rem] border-2 border-dashed border-gray-200">
                    <span className="text-5xl block mb-4">🔍</span>
                    <h3 className="text-2xl font-black text-gray-900">No courses match your criteria</h3>
                    <p className="text-gray-900 font-bold">Try adjusting the filters to explore more learning adventures.</p>
                </div>
            )}
        </div>
    );
};
