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
import { useCurrency } from '@/context/CurrencyContext';
import { Footer } from '@/components/layout/Footer';
import { ScrollToTop } from '@/components/ui/ScrollToTop';
import { useToast } from '@/context/ToastContext';
import axios from 'axios';
import { UserIcon, Rocket, Sparkles, MessageCircle, Star, Calendar, MapPin, Tag, Trophy, ArrowRight, Check, BookOpen, Mail, Phone, Send, CheckCircle, ChevronDown, Users as UsersIcon, Ticket, GraduationCap, BarChart3, Target, Brain, Bot, Award, Flame } from 'lucide-react';
import CourseSelection from '@/components/sections/CourseSelection';
import { SuperstarProjects } from '@/components/sections/SuperstarProjects';
import { WorkshopSlotSelectorModal } from '@/components/game/WorkshopSlotSelectorModal';
import { trackEvent, trackLead, trackContact, trackAddToCart, trackInitiateCheckout, trackPurchase } from '@/utils/analytics';
import { AdUnit } from '@/components/AdSense';
import { SliderWrapper } from '@/components/ui/SliderWrapper';
import AiPlayground from '@/components/sections/AiPlayground';
import { HowToUseSection } from '@/components/sections/HowToUseSection';

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
  const { currency, formatPrice } = useCurrency();
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

  const handleEnrollBootcamp = async (bootcamp: any) => {
    trackLead({
      content_name: bootcamp.title,
      content_category: 'Bootcamp_Listing',
      content_ids: [bootcamp._id],
      value: bootcamp.price,
      currency: 'INR'
    });
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
      const payload: any = { bootcampId: bootcamp._id, currency };
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
              const purchaseData = {
                value: order.amount / 100,
                currency: order.currency || 'INR',
                content_name: bootcamp.title,
                content_ids: [bootcamp._id],
                content_type: 'product',
                transaction_id: response.razorpay_payment_id
              };

              trackEvent('bootcamp_payment_success', { 
                bootcamp_id: bootcamp._id, 
                amount: order.amount / 100, 
                currency: order.currency 
              });
              trackPurchase(purchaseData);

              if (typeof window !== 'undefined') {
                sessionStorage.setItem('latest_purchase', JSON.stringify(purchaseData));
              }

              await new Promise(r => setTimeout(r, 400));
              router.push(`/payment-success?tx=${response.razorpay_payment_id}&amount=${order.amount / 100}&title=${encodeURIComponent(bootcamp.title)}`);
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

      trackInitiateCheckout({
        content_name: bootcamp.title,
        num_items: 1,
        value: order.amount / 100,
        currency: order.currency || 'INR'
      });

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

  const now = new Date();
  const upcomingBootcamps = bootcamps.filter(bc => new Date(bc.date || Date.now()) > now);

  const renderBootcampCard = (bc: any, isUpcoming: boolean) => {
    const thumbUrl = getThumbnailUrl(bc.image);
    return (
      <div key={bc._id} className="group cursor-pointer h-full" onClick={() => handleEnrollBootcamp(bc)}>
        <Card className={`h-full rounded-[1.5rem] transition-all duration-300 flex flex-col bg-white overflow-hidden relative ${isUpcoming ? 'border-2 border-amber-400 shadow-md shadow-amber-500/5 hover:shadow-2xl hover:shadow-amber-500/10' : 'border border-gray-200 shadow-sm hover:shadow-xl'}`}>
          <div className="relative aspect-[16/10] bg-[#eef5ff] flex items-center justify-center group-hover:bg-[#e4efff] transition-colors overflow-hidden">
            {bc.showStudentsEnrolled && bc.studentsEnrolled > 0 && (
            <div className="absolute top-3 left-3 bg-white/90 backdrop-blur-sm px-2.5 py-1 rounded-full flex items-center gap-1.5 shadow-sm border border-white z-20">
              <UserIcon size={10} className="text-blue-500 shrink-0" />
              <span className="text-[10px] font-black text-gray-700">{bc.studentsEnrolled} Enrolled</span>
            </div>
            )}
            
            {isUpcoming && (
              <div className="absolute top-3 right-3 bg-gradient-to-r from-amber-500 to-orange-500 text-white font-black text-[9px] tracking-widest px-3 py-1 rounded-full z-20 uppercase shadow-md animate-pulse">
                Featured
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
              <div className="flex items-center gap-1.5 text-black font-black text-xs ml-auto">
                <UserIcon size={12} className="text-gray-400 shrink-0" /> {bc.studentsEnrolled || 0} students
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
                  <span className="text-2xl lg:text-3xl font-black text-black">{formatPrice(bc.price)}</span>
                  <span className="text-sm font-medium text-gray-400 line-through">{formatPrice(bc.price + 999)}</span>
                </div>
                <div className="text-sm font-bold text-black mt-1">(Total Bootcamp pass)</div>
              </div>
              {isUpcoming ? (
                <Button
                  isLoading={isProcessing && pendingBootcamp?._id === bc._id}
                  className="w-full rounded-full py-5 bg-[#E91E63] text-white hover:bg-pink-600 border-none font-bold text-base transition-all mt-2 shadow-md shadow-pink-500/20 active:scale-95 flex items-center justify-center gap-2"
                >
                  Enroll Now <Sparkles size={16} className="text-yellow-200 animate-pulse" />
                </Button>
              ) : (
                <Button
                  variant="outline"
                  isLoading={isProcessing && pendingBootcamp?._id === bc._id}
                  className="w-full rounded-full py-5 border-2 border-primary-500 text-primary-500 hover:bg-primary-500 hover:text-white font-bold text-base transition-colors mt-2 shadow-none"
                >
                  Enroll Now
                </Button>
              )}
            </div>
          </CardContent>
        </Card>
      </div>
    );
  };

  const bootcampCards = bootcamps.map(bc => renderBootcampCard(bc, false));
  const upcomingBootcampCards = upcomingBootcamps.map(bc => renderBootcampCard(bc, true));

  return (
    <div className="px-6 md:px-8 space-y-12">
      {upcomingBootcamps.length > 0 && (
        <div className="bg-gradient-to-br from-amber-50/50 via-yellow-50/30 to-orange-50/60 rounded-[3rem] p-8 border border-amber-100 shadow-sm relative overflow-hidden">
          {/* Decorative background overlay */}
          <div className="absolute -top-12 -right-12 w-32 h-32 bg-amber-200/20 rounded-full blur-2xl pointer-events-none" />
          
          <div className="relative z-10">
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-amber-500 to-orange-500 rounded-full text-white font-black mb-6 tracking-wide shadow-md shadow-orange-500/20">
              <Sparkles size={14} className="animate-pulse" />
              <span className="text-xs uppercase tracking-wider">Specialized & Featured</span>
            </div>
            <SliderWrapper slidesPerViewLg={3} slidesPerViewMd={2} slidesPerViewSm={1} autoPlay={4500} gap={24}>
              {upcomingBootcampCards}
            </SliderWrapper>
          </div>
        </div>
      )}

      <div className="pt-4">
        <div className="inline-flex items-center gap-2 px-4 py-2 bg-slate-100 rounded-full text-slate-700 font-bold mb-6 border border-slate-200">
          <Rocket size={14} className="text-slate-500" />
          <span className="text-xs uppercase tracking-wider">All Bootcamps</span>
        </div>
        <SliderWrapper slidesPerViewLg={3} slidesPerViewMd={2} slidesPerViewSm={1} autoPlay={4500} gap={24}>
          {bootcampCards}
        </SliderWrapper>
      </div>
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
  const { currency, formatPrice } = useCurrency();
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

  const handleBookWorkshop = async (workshop: any) => {
    trackLead({
      content_name: workshop.title,
      content_category: 'Workshop_Listing',
      content_ids: [workshop._id],
      value: workshop.price,
      currency: 'INR'
    });
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
      const payload: any = { workshopId: workshop._id, currency };
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
              const purchaseData = {
                value: order.amount / 100,
                currency: order.currency || 'INR',
                content_name: workshop.title,
                content_ids: [workshop._id],
                content_type: 'product',
                transaction_id: response.razorpay_payment_id
              };

              trackEvent('workshop_payment_success', { 
                workshop_id: workshop._id, 
                amount: order.amount / 100, 
                currency: order.currency 
              });
              trackPurchase(purchaseData);

              if (typeof window !== 'undefined') {
                sessionStorage.setItem('latest_purchase', JSON.stringify(purchaseData));
              }

              await new Promise(r => setTimeout(r, 400));
              router.push(`/payment-success?tx=${response.razorpay_payment_id}&amount=${order.amount / 100}&title=${encodeURIComponent(workshop.title)}`);
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
          color: "#E91E63"
        }
      };

      const rzp = new (window as any).Razorpay(options);

      trackInitiateCheckout({
        content_name: workshop.title,
        num_items: 1,
        value: order.amount / 100,
        currency: order.currency || 'INR'
      });

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

  const workshopCards = workshops.map((ws: any) => {
    const thumbUrl = getThumbnailUrl(ws.image);
    return (
      <div key={ws._id} className="group cursor-pointer h-full" onClick={() => handleBookWorkshop(ws)}>
        <Card className="h-full border border-gray-200 rounded-[1.5rem] shadow-sm hover:shadow-xl transition-all duration-300 flex flex-col bg-white overflow-hidden">
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
                  <span className="text-2xl lg:text-3xl font-black text-black">{formatPrice(ws.price)}</span>
                  <span className="text-sm font-medium text-gray-400 line-through">{formatPrice(ws.price + 999)}</span>
                </div>
                <div className="text-sm font-bold text-black mt-1">(Event ticket)</div>
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
    );
  });

  return (
    <div className="px-6 md:px-8">
      <SliderWrapper slidesPerViewLg={3} slidesPerViewMd={2} slidesPerViewSm={1} autoPlay={4000} gap={24}>
        {workshopCards}
      </SliderWrapper>

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
      trackContact({
        content_category: 'Contact Form',
        subject: form.subject
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
    <section className="relative py-12 px-4 overflow-hidden" id="contact">
      {/* Playful Background Elements */}
      <div className="absolute inset-0 bg-slate-50 z-0" />
      <div className="absolute top-0 right-0 w-96 h-96 bg-primary-200 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-float" />
      <div className="absolute bottom-0 left-0 w-96 h-96 bg-secondary-200 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-float" style={{ animationDelay: '2s' }} />
      
      {/* Floating Icons */}
      <div className="absolute top-20 left-10 text-4xl opacity-40 animate-bounce">🎈</div>
      <div className="absolute bottom-20 right-10 text-4xl opacity-40 animate-bounce" style={{ animationDelay: '1s' }}>🚀</div>
      <div className="absolute top-1/2 right-[5%] text-4xl opacity-30 animate-pulse">✨</div>
      <div className="absolute top-1/4 left-[10%] opacity-20 animate-spin-slow">
        <Star size={60} className="text-primary-300" strokeWidth={1} />
      </div>
      <div className="absolute bottom-1/4 right-[15%] opacity-20 animate-float">
        <Star size={80} className="text-secondary-300" strokeWidth={1} />
      </div>

      <div className="relative z-10 max-w-6xl mx-auto flex flex-col lg:flex-row items-center gap-8 lg:gap-12">
        <div className="flex-1 text-center lg:text-left">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 bg-white rounded-full text-secondary-600 font-bold mb-4 shadow-sm border border-gray-100">
            <MessageCircle size={14} />
            <span className="text-xs">Have a Question?</span>
          </div>
          <h2 className="text-3xl md:text-5xl font-black text-gray-900 mb-4 leading-tight">
            Let's Start a <br/><span className="text-primary-600">Magical</span> Conversation!
          </h2>
          <p className="text-base font-bold text-gray-600 mb-6 max-w-xl leading-relaxed">
            Whether you're curious about our courses, need a demo, or just want to say hi, we're all ears!
          </p>
          
          <div className="space-y-4 max-w-md mx-auto lg:mx-0">
             <div className="flex items-center gap-4 p-3 bg-white rounded-2xl border border-gray-100 shadow-sm hover:translate-x-2 transition-transform">
               <div className="w-11 h-11 bg-primary-100 text-primary-600 rounded-xl flex items-center justify-center shadow-inner">
                 <Mail size={18} />
               </div>
               <div className="text-left">
                 <p className="text-[10px] font-black text-gray-900 uppercase tracking-widest mb-0.5">Email Us</p>
                 <p className="font-bold text-gray-800 text-sm">support@ruzann.com</p>
               </div>
             </div>
             <div className="flex items-center gap-4 p-3 bg-white rounded-2xl border border-gray-100 shadow-sm hover:translate-x-2 transition-transform">
               <div className="w-11 h-11 bg-secondary-100 text-secondary-600 rounded-xl flex items-center justify-center shadow-inner">
                 <Phone size={18} />
               </div>
               <div className="text-left">
                 <p className="text-[10px] font-black text-gray-900 uppercase tracking-widest mb-0.5">Call Us</p>
                 <p className="font-bold text-gray-800 text-sm">+91 9960559894</p>
               </div>
             </div>
          </div>
        </div>

        <Card className="w-full lg:w-[450px] bg-white p-6 md:p-8 rounded-[2.5rem] shadow-2xl border-none relative">
           <div className="absolute -top-4 -left-4 bg-yellow-400 text-white w-12 h-12 rounded-2xl flex items-center justify-center text-2xl shadow-lg rotate-12 animate-wiggle">✍️</div>
           
           <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-1.5">
                <label className="text-[9px] font-black text-gray-900 uppercase tracking-widest ml-4">Your Name</label>
                <input 
                  required
                  type="text"
                  placeholder="Superstar's Name"
                  className="w-full px-4 py-2.5 rounded-xl border-2 border-slate-200 bg-white focus:border-primary-400 focus:outline-none transition-all font-bold text-black text-sm placeholder:text-gray-500"
                  value={form.name}
                  onChange={(e) => setForm({...form, name: e.target.value})}
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-[9px] font-black text-gray-900 uppercase tracking-widest ml-4">Email Address</label>
                <input 
                  required
                  type="email"
                  placeholder="parent@example.com"
                  className="w-full px-4 py-2.5 rounded-xl border-2 border-slate-200 bg-white focus:border-primary-400 focus:outline-none transition-all font-bold text-black text-sm placeholder:text-gray-500"
                  value={form.email}
                  onChange={(e) => setForm({...form, email: e.target.value})}
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-[9px] font-black text-gray-900 uppercase tracking-widest ml-4">Phone Number</label>
                <input 
                  required
                  type="tel"
                  placeholder="+91 00000 00000"
                  className="w-full px-4 py-2.5 rounded-xl border-2 border-slate-200 bg-white focus:border-primary-400 focus:outline-none transition-all font-bold text-black text-sm placeholder:text-gray-500"
                  value={form.phone}
                  onChange={(e) => setForm({...form, phone: e.target.value})}
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-[9px] font-black text-gray-900 uppercase tracking-widest ml-4">What's on your mind?</label>
                <div className="relative group">
                  <select 
                    required
                    className="w-full px-4 py-2.5 rounded-xl border-2 border-slate-200 bg-white focus:border-primary-400 focus:outline-none transition-all font-bold text-black text-sm appearance-none pr-12"
                    value={form.subject}
                    onChange={(e) => setForm({...form, subject: e.target.value})}
                  >
                    <option value="">Choose a Magic Topic</option>
                    <option value="Courses">Course Enquiry 📚</option>
                    <option value="Demo">Demo Session 🎁</option>
                    <option value="Feedback">Just Saying Hi 👋</option>
                  </select>
                  <div className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none text-gray-900">
                    <ChevronDown size={16} />
                  </div>
                </div>
              </div>

              <div className="space-y-1.5">
                <label className="text-[9px] font-black text-gray-900 uppercase tracking-widest ml-4">Referral Code (Optional)</label>
                <input 
                  type="text"
                  placeholder="e.g. RUZ-X4K"
                  className="w-full px-4 py-2.5 rounded-xl border-2 border-slate-200 bg-white focus:border-primary-400 focus:outline-none transition-all font-bold text-black text-sm uppercase placeholder:text-gray-500"
                  value={form.referralCode}
                  onChange={(e) => setForm({...form, referralCode: e.target.value})}
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-[9px] font-black text-gray-900 uppercase tracking-widest ml-4">Message</label>
                <textarea 
                  required
                  rows={2}
                  placeholder="Share your magic thoughts..."
                  className="w-full px-4 py-2.5 rounded-xl border-2 border-slate-200 bg-white focus:border-primary-400 focus:outline-none transition-all font-bold text-black text-sm resize-none placeholder:text-gray-500"
                  value={form.message}
                  onChange={(e) => setForm({...form, message: e.target.value})}
                />
              </div>

              <Button 
                type="submit" 
                size="lg" 
                fullWidth 
                className="py-4 rounded-xl font-black text-base bg-[#E91E63] hover:bg-[#D81B60] border-none shadow-xl shadow-[#E91E63]/20 transition-all flex items-center justify-center gap-3 active:scale-95 text-white"
                isLoading={isSubmitting}
              >
                Send Some Magic! <Send size={16} />
              </Button>
           </form>
        </Card>
      </div>
    </section>
  );
};

// ─── Floating BrightChamps-Style Decorations ───────────────────────────────
const FloatingDecorations = () => (
  <div className="fixed inset-0 pointer-events-none z-0 overflow-hidden" aria-hidden="true">

    {/* Outlined Stars */}
    <svg className="absolute top-[8%] left-[3%] opacity-[0.12] animate-float-a" style={{animationDelay:'0s'}} width="70" height="70" viewBox="0 0 80 80" fill="none">
      <path d="M40 5L47 30H73L52 46L59 71L40 55L21 71L28 46L7 30H33L40 5Z" stroke="#6366f1" strokeWidth="2.5" fill="none"/>
    </svg>
    <svg className="absolute top-[12%] right-[6%] opacity-[0.10] animate-float-b" style={{animationDelay:'1.5s'}} width="50" height="50" viewBox="0 0 60 60" fill="none">
      <path d="M30 4L36 22H55L40 33L46 51L30 40L14 51L20 33L5 22H24L30 4Z" stroke="#a855f7" strokeWidth="2" fill="none"/>
    </svg>
    <svg className="absolute top-[38%] left-[1%] opacity-[0.10] animate-float-c" style={{animationDelay:'2s'}} width="38" height="38" viewBox="0 0 60 60" fill="none">
      <path d="M30 4L36 22H55L40 33L46 51L30 40L14 51L20 33L5 22H24L30 4Z" stroke="#f59e0b" strokeWidth="2" fill="none"/>
    </svg>
    <svg className="absolute top-[55%] right-[2%] opacity-[0.09] animate-float-a" style={{animationDelay:'3s'}} width="64" height="64" viewBox="0 0 80 80" fill="none">
      <path d="M40 5L47 30H73L52 46L59 71L40 55L21 71L28 46L7 30H33L40 5Z" stroke="#6366f1" strokeWidth="2.5" fill="none"/>
    </svg>
    <svg className="absolute bottom-[20%] left-[4%] opacity-[0.10] animate-float-b" style={{animationDelay:'0.8s'}} width="48" height="48" viewBox="0 0 60 60" fill="none">
      <path d="M30 4L36 22H55L40 33L46 51L30 40L14 51L20 33L5 22H24L30 4Z" stroke="#ec4899" strokeWidth="2" fill="none"/>
    </svg>
    <svg className="absolute bottom-[10%] right-[5%] opacity-[0.09] animate-float-c" style={{animationDelay:'2.5s'}} width="36" height="36" viewBox="0 0 60 60" fill="none">
      <path d="M30 4L36 22H55L40 33L46 51L30 40L14 51L20 33L5 22H24L30 4Z" stroke="#a855f7" strokeWidth="2" fill="none"/>
    </svg>
    <svg className="absolute top-[72%] left-[8%] opacity-[0.08] animate-float-a" style={{animationDelay:'4s'}} width="30" height="30" viewBox="0 0 60 60" fill="none">
      <path d="M30 4L36 22H55L40 33L46 51L30 40L14 51L20 33L5 22H24L30 4Z" stroke="#6366f1" strokeWidth="2" fill="none"/>
    </svg>

    {/* Diamond sparkle glyphs */}
    <div className="absolute top-[22%] left-[12%] text-indigo-300 text-3xl opacity-20 animate-wiggle-slow" style={{animationDelay:'0.5s'}}>✦</div>
    <div className="absolute top-[45%] right-[10%] text-purple-300 text-2xl opacity-15 animate-wiggle-slow" style={{animationDelay:'2s'}}>✦</div>
    <div className="absolute bottom-[35%] left-[15%] text-pink-300 text-xl opacity-15 animate-float-b" style={{animationDelay:'1s'}}>✦</div>
    <div className="absolute bottom-[55%] right-[14%] text-amber-300 text-2xl opacity-20 animate-float-c" style={{animationDelay:'3.5s'}}>✦</div>
    <div className="absolute top-[65%] right-[18%] text-indigo-200 text-3xl opacity-15 animate-wiggle-slow" style={{animationDelay:'1.2s'}}>✦</div>

    {/* Plus signs */}
    <div className="absolute top-[30%] right-[22%] text-indigo-200 font-black text-2xl opacity-20 animate-float-a" style={{animationDelay:'0.3s'}}>+</div>
    <div className="absolute top-[60%] left-[22%] text-purple-200 font-black text-3xl opacity-15 animate-float-b" style={{animationDelay:'2.8s'}}>+</div>
    <div className="absolute bottom-[28%] right-[28%] text-pink-200 font-black text-xl opacity-15 animate-float-c" style={{animationDelay:'1.8s'}}>+</div>
    <div className="absolute top-[18%] left-[30%] text-amber-200 font-black text-2xl opacity-15 animate-float-a" style={{animationDelay:'3.2s'}}>+</div>

    {/* Coloured dots */}
    <div className="absolute top-[25%] left-[7%] w-3 h-3 rounded-full bg-indigo-300 opacity-25 animate-float-b" style={{animationDelay:'0.6s'}} />
    <div className="absolute top-[42%] right-[7%] w-4 h-4 rounded-full bg-purple-300 opacity-20 animate-float-a" style={{animationDelay:'1.4s'}} />
    <div className="absolute bottom-[42%] left-[10%] w-2.5 h-2.5 rounded-full bg-pink-300 opacity-25 animate-float-c" style={{animationDelay:'2.2s'}} />
    <div className="absolute bottom-[22%] right-[12%] w-3.5 h-3.5 rounded-full bg-amber-300 opacity-20 animate-float-b" style={{animationDelay:'3.8s'}} />
    <div className="absolute top-[78%] left-[18%] w-2 h-2 rounded-full bg-teal-300 opacity-25 animate-float-a" style={{animationDelay:'0.9s'}} />
    <div className="absolute top-[15%] right-[30%] w-2.5 h-2.5 rounded-full bg-rose-300 opacity-20 animate-float-c" style={{animationDelay:'4.2s'}} />

    {/* Spinning dashed rings */}
    <svg className="absolute top-[35%] right-[5%] opacity-[0.08] animate-spin-slow" width="50" height="50" viewBox="0 0 50 50" fill="none">
      <circle cx="25" cy="25" r="20" stroke="#8b5cf6" strokeWidth="2" strokeDasharray="8 6"/>
    </svg>
    <svg className="absolute bottom-[45%] left-[5%] opacity-[0.07] animate-spin-slow" style={{animationDelay:'3s', animationDirection:'reverse'}} width="40" height="40" viewBox="0 0 50 50" fill="none">
      <circle cx="25" cy="25" r="20" stroke="#f59e0b" strokeWidth="2" strokeDasharray="10 5"/>
    </svg>

    {/* Squiggly arcs */}
    <svg className="absolute top-[5%] left-[40%] opacity-[0.08] animate-float-c" style={{animationDelay:'1s'}} width="120" height="40" viewBox="0 0 140 50" fill="none">
      <path d="M10 35 Q35 5 70 25 Q105 45 130 15" stroke="#6366f1" strokeWidth="2.5" strokeLinecap="round" fill="none"/>
    </svg>
    <svg className="absolute bottom-[15%] right-[20%] opacity-[0.07] animate-float-a" style={{animationDelay:'2.3s'}} width="100" height="35" viewBox="0 0 140 50" fill="none">
      <path d="M10 35 Q35 5 70 25 Q105 45 130 15" stroke="#a855f7" strokeWidth="2.5" strokeLinecap="round" fill="none"/>
    </svg>

  </div>
);

export default function Home() {
  const router = useRouter();
  const { user } = useAuth();
  const { openIntroModal } = useIntroOffer();
  const { formatPrice } = useCurrency();
  const { showToast } = useToast();
  const [currentSlide, setCurrentSlide] = useState(0);
  const [mentors, setMentors] = useState<any[]>([]);
  const [loadingMentors, setLoadingMentors] = useState(true);

  // Enquiry Modal States
  const [isEnquiryOpen, setIsEnquiryOpen] = useState(false);
  const [enquiryForm, setEnquiryForm] = useState({ name: '', email: '', phone: '', subject: 'Demo', message: '' });
  const [isEnquirySubmitting, setIsEnquirySubmitting] = useState(false);

  const handleEnquirySubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsEnquirySubmitting(true);
    try {
      await axios.post('/api/leads', {
        name: enquiryForm.name,
        email: enquiryForm.email,
        phone: enquiryForm.phone || 'Not provided',
        source: 'Popup Enquiry',
        notes: [{ text: `Topic: ${enquiryForm.subject}\nMessage: ${enquiryForm.message || 'No additional details.'}` }]
      });
      trackContact({
        content_category: 'Popup Enquiry Form',
        subject: enquiryForm.subject
      });
      trackEvent('enquiry_form_submit', { subject: enquiryForm.subject });
      showToast("Enquiry submitted successfully! Our team will reach out to you soon. 🎉", "success");
      setEnquiryForm({ name: '', email: '', phone: '', subject: 'Demo', message: '' });
      setIsEnquiryOpen(false);
    } catch (err) {
      console.error(err);
      showToast("Failed to submit enquiry. Please try again.", "error");
    } finally {
      setIsEnquirySubmitting(false);
    }
  };


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

      {/* Floating BrightChamps-style background decorations */}
      <FloatingDecorations />
      
      {/* Top AdSense Unit 
      <div className="max-w-7xl mx-auto px-4 pt-4">
        <AdUnit slot="top-banner" className="mb-0" />
      </div>
      */}

      {/* 1. LMS-STYLE HERO SECTION */}
      <section className="relative flex min-h-[70vh] lg:min-h-screen items-center justify-center py-8 md:py-16 px-4 md:px-8 overflow-hidden bg-slate-950 text-white">
        
        {/* Background Grid Overlay */}
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#1e293b_1px,transparent_1px),linear-gradient(to_bottom,#1e293b_1px,transparent_1px)] bg-[size:4rem_4rem] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_0%,#000_70%,transparent_100%)] opacity-40 z-0" />

        {/* Floating Glowing Blobs */}
        <div className="absolute top-10 left-10 w-[300px] h-[300px] md:w-[500px] md:h-[500px] bg-gradient-to-tr from-cyan-500 to-primary-600 rounded-full mix-blend-screen filter blur-[80px] md:blur-[150px] opacity-35 animate-float z-0" />
        <div className="absolute bottom-10 right-10 w-[300px] h-[300px] md:w-[500px] md:h-[500px] bg-gradient-to-tr from-purple-500 to-secondary-600 rounded-full mix-blend-screen filter blur-[80px] md:blur-[150px] opacity-35 animate-float z-0" style={{ animationDelay: '3s' }} />

        <div className="relative z-10 max-w-7xl mx-auto w-full grid grid-cols-1 lg:grid-cols-12 gap-6 lg:gap-12 items-center">
          
          {/* Left Column: Core Value Proposition & CTAs */}
          <div className="lg:col-span-7 text-left space-y-4 md:space-y-8">
            
            {/* Trust Badge */}
            <div className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full border border-white/10 bg-white/5 backdrop-blur-xl text-[10px] md:text-sm font-black text-primary-300 shadow-lg shadow-black/10">
              <span className="flex text-yellow-400 gap-0.5">
                {[1, 2, 3, 4, 5].map(i => <Star key={i} className="w-3 h-3 md:w-3.5 md:h-3.5 fill-yellow-400 text-yellow-400" />)}
              </span>
              <span className="text-white/80">Loved by 10,000+ happy parents</span>
            </div>

            {/* Headline */}
            <h1 className="text-3xl sm:text-4xl md:text-6xl lg:text-[4.25rem] font-baloo font-black text-white leading-[1.1] tracking-tight drop-shadow-sm">
              Empower Your Child <br />
              to Create with <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 via-primary-400 to-purple-400">AI & Coding</span>
            </h1>

            {/* Sub-headline */}
            <p className="text-xs sm:text-base md:text-xl text-gray-300 font-bold max-w-2xl leading-relaxed">
              Interactive video courses, live cohorts, and a fun coding playground. <span className="hidden md:inline">Turn screen time into creative skill-building and set your child up for success.</span>
            </p>

            {/* Key bullet benefits */}
            <div className="hidden md:grid grid-cols-1 sm:grid-cols-2 gap-3 text-sm font-bold text-gray-200">
              <div className="flex items-center gap-2">
                <CheckCircle size={18} className="text-cyan-400 flex-shrink-0" />
                <span>Gamified Missions & Rewards</span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle size={18} className="text-cyan-400 flex-shrink-0" />
                <span>Live Support from Expert Mentors</span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle size={18} className="text-cyan-400 flex-shrink-0" />
                <span>Real Python, JS & Scratch Projects</span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle size={18} className="text-cyan-400 flex-shrink-0" />
                <span>No Credit Card Required to Start</span>
              </div>
            </div>

            {/* Dual CTAs */}
            <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2.5 md:gap-4">
              <Link href="/ai-quiz" className="flex-1 sm:flex-initial">
                <button className="w-full sm:w-auto text-sm md:text-lg px-6 py-3 md:px-8 md:py-4 rounded-xl bg-gradient-to-r from-primary-500 to-indigo-600 hover:from-primary-600 hover:to-indigo-700 font-bold text-white shadow-lg shadow-primary-500/20 hover:shadow-primary-500/30 hover:-translate-y-0.5 active:translate-y-0 active:scale-[0.98] transition-all duration-200 flex items-center justify-center gap-2">
                  Start Assessment <Rocket className="w-4 h-4 md:w-5 md:h-5 text-white animate-pulse" />
                </button>
              </Link>
              <button 
                onClick={() => setIsEnquiryOpen(true)}
                className="w-full sm:w-auto text-sm md:text-lg px-6 py-3 md:px-8 md:py-4 rounded-xl bg-white/10 backdrop-blur-md border border-white/15 hover:bg-white/20 font-bold text-white hover:-translate-y-0.5 active:translate-y-0 active:scale-[0.98] transition-all duration-200 flex items-center justify-center gap-2"
              >
                Book Demo <MessageCircle className="w-4 h-4 md:w-5 md:h-5 text-white" />
              </button>
            </div>

            <div className="text-xs md:text-sm font-semibold text-gray-400 text-left flex items-center gap-1">
              Want to start immediately?{" "}
              <button 
                onClick={openIntroModal}
                className="text-primary-400 hover:text-primary-300 underline font-bold cursor-pointer transition-colors bg-transparent border-none p-0 outline-none flex items-center gap-1"
              >
                Claim the {formatPrice(99)} offer here <Sparkles className="w-3.5 h-3.5 text-primary-400 animate-pulse" />
              </button>
            </div>

            {/* Quick Stats Grid */}
            <div className="hidden md:flex pt-6 border-t border-white/10 flex-wrap gap-8 md:gap-12">
              <div>
                <div className="text-3xl font-black text-white">10K+</div>
                <div className="text-xs font-bold text-gray-400 uppercase tracking-wider mt-1">Students Enrolled</div>
              </div>
              <div>
                <div className="text-3xl font-black text-cyan-400">98.4%</div>
                <div className="text-xs font-bold text-gray-400 uppercase tracking-wider mt-1">Completion Rate</div>
              </div>
              <div>
                <div className="text-3xl font-black text-purple-400">50+</div>
                <div className="text-xs font-bold text-gray-400 uppercase tracking-wider mt-1">AI & Code Sandbox Quests</div>
              </div>
            </div>

          </div>

          {/* Right Column: Premium LMS Dashboard Mockup */}
          <div className="flex lg:col-span-5 relative w-full justify-center items-center mt-6 lg:mt-0 px-4 sm:px-0">
            
            {/* Background glowing rings/orbits */}
            <div className="absolute inset-0 pointer-events-none flex items-center justify-center">
              <div className="w-[300px] h-[300px] md:w-[450px] md:h-[450px] rounded-full border border-white/5 animate-spin-slow" />
              <div className="absolute w-[200px] h-[200px] md:w-[350px] md:h-[350px] rounded-full border border-dashed border-white/5 animate-spin-slow" style={{ animationDirection: 'reverse' }} />
            </div>

            {/* Main Dashboard Preview Card */}
            <div className="relative w-full max-w-md bg-slate-900/90 border border-slate-800 rounded-2xl md:rounded-[2rem] p-4 md:p-8 shadow-2xl backdrop-blur-xl hover:border-slate-700/80 transition-all duration-500 group">
              
              {/* Inner header */}
              <div className="flex items-center justify-between pb-3.5 md:pb-5 border-b border-slate-800">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 md:w-10 md:h-10 rounded-xl bg-gradient-to-tr from-cyan-400 to-blue-500 flex items-center justify-center text-white shadow-md">
                    <GraduationCap className="w-4 h-4 md:w-5 md:h-5 text-white" />
                  </div>
                  <div>
                    <h3 className="font-black text-xs md:text-sm text-white">Alex's Portal</h3>
                    <p className="text-[9px] md:text-[10px] text-gray-400 font-bold">Lvl 4 Junior AI Creator</p>
                  </div>
                </div>
                <span className="bg-cyan-500/10 text-cyan-400 border border-cyan-500/20 px-2 py-0.5 md:px-2.5 md:py-1 rounded-full text-[8px] md:text-[10px] font-black tracking-wide uppercase">
                  Premium Student
                </span>
              </div>

              {/* Learning stats row */}
              <div className="grid grid-cols-2 gap-3 py-3.5 md:py-5 border-b border-slate-800">
                <div className="bg-slate-950/50 border border-slate-800/80 p-2 md:p-3 rounded-2xl flex items-center gap-3">
                  <Flame className="w-5 h-5 text-orange-500 shrink-0 animate-pulse" />
                  <div>
                    <p className="text-[8px] md:text-[9px] text-gray-500 uppercase tracking-widest font-black">Streak</p>
                    <p className="font-black text-xs md:text-sm text-white">12 Days</p>
                  </div>
                </div>
                <div className="bg-slate-950/50 border border-slate-800/80 p-2 md:p-3 rounded-2xl flex items-center gap-3">
                  <Trophy className="w-5 h-5 text-yellow-500 shrink-0" />
                  <div>
                    <p className="text-[8px] md:text-[9px] text-gray-500 uppercase tracking-widest font-black">Quests</p>
                    <p className="font-black text-xs md:text-sm text-white">34 Done</p>
                  </div>
                </div>
              </div>

              {/* Active course widget */}
              <div className="py-3.5 md:py-5">
                <div className="flex items-center justify-between mb-3">
                  <span className="text-[10px] md:text-xs font-black text-gray-400 uppercase tracking-wider">Active Course</span>
                  <span className="text-[10px] md:text-xs font-bold text-primary-400 hover:underline cursor-pointer flex items-center gap-1">
                    Continue <ArrowRight size={12} />
                  </span>
                </div>

                <div className="bg-slate-950/80 border border-slate-800 p-3 md:p-4 rounded-xl md:rounded-2xl space-y-3 md:space-y-4">
                  <div className="flex items-start justify-between gap-3">
                    <div className="space-y-1">
                      <h4 className="font-black text-xs md:text-sm text-white group-hover:text-cyan-400 transition-colors flex items-center gap-1.5">Python Game Creator <Rocket className="w-3.5 h-3.5 text-cyan-400 animate-pulse" /></h4>
                      <p className="text-[10px] md:text-[11px] text-gray-400 font-semibold">Module 3: Visual Animations</p>
                    </div>
                    <span className="bg-yellow-500/10 text-yellow-500 border border-yellow-500/20 px-1.5 py-0.5 md:px-2 md:py-0.5 rounded text-[8px] md:text-[9px] font-black uppercase">
                      Class 8/12
                    </span>
                  </div>

                  {/* Progress bar */}
                  <div className="space-y-1.5">
                    <div className="flex justify-between text-[9px] md:text-[10px] font-black text-gray-400">
                      <span>Course Progress</span>
                      <span className="text-white">66%</span>
                    </div>
                    <div className="w-full h-1.5 md:h-2.5 bg-slate-800 rounded-full overflow-hidden">
                      <div className="h-full bg-gradient-to-r from-cyan-400 to-primary-500 rounded-full" style={{ width: '66%' }} />
                    </div>
                  </div>
                </div>
              </div>

              {/* Upcoming live session */}
              <div className="pt-3 md:pt-4 border-t border-slate-800 flex items-center justify-between gap-3 md:gap-4">
                <div className="flex items-center gap-3">
                  <span className="relative flex h-3 w-3 md:h-3.5 md:w-3.5">
                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75"></span>
                    <span className="relative inline-flex rounded-full h-3 w-3 md:h-3.5 md:w-3.5 bg-red-500"></span>
                  </span>
                  <div>
                    <h5 className="font-black text-[10px] md:text-[11px] text-white">Live AI Class Starting Soon</h5>
                    <p className="text-[9px] md:text-[10px] text-gray-400 font-semibold">with Mentor Ruzann</p>
                  </div>
                </div>
                <Link href="/ai-quiz">
                  <button className="bg-red-500 hover:bg-red-600 text-white font-black text-[10px] md:text-xs px-3 py-1.5 md:px-4 md:py-2 rounded-lg md:rounded-xl shadow-lg shadow-red-500/20 active:scale-95 transition-all">
                    Join Room
                  </button>
                </Link>
              </div>

            </div>

            {/* Floating visual highlights */}
            <div className="hidden sm:flex absolute -top-6 -right-6 bg-slate-900 border border-slate-800 px-4 py-2 rounded-2xl items-center gap-2 shadow-xl backdrop-blur-xl animate-float" style={{ animationDelay: '1s' }}>
              <Bot className="w-5 h-5 text-cyan-400" />
              <div className="text-left leading-none">
                <span className="text-[8px] text-gray-400 uppercase tracking-widest font-black">Interactive</span>
                <p className="text-xs font-black text-white">AI Sandbox</p>
              </div>
            </div>

            <div className="hidden sm:flex absolute -bottom-6 -left-6 bg-slate-900 border border-slate-800 px-4 py-2 rounded-2xl items-center gap-2 shadow-xl backdrop-blur-xl animate-float" style={{ animationDelay: '2.5s' }}>
              <Award className="w-5 h-5 text-yellow-400" />
              <div className="text-left leading-none">
                <span className="text-[8px] text-gray-400 uppercase tracking-widest font-black">Award</span>
                <p className="text-xs font-black text-white">Genius Badge</p>
              </div>
            </div>

          </div>

        </div>
      </section>

      <HowToUseSection />

      <AiPlayground />

      {/* Mid-Page AdSense Unit 
      <div className="max-w-7xl mx-auto px-4 py-8">
        <AdUnit slot="mid-page-interstitial" className="my-0" />
      </div>
      */}

      {/* 2.7 BOOTCAMPS SECTION */}
      <section className="py-14 bg-white overflow-hidden" id="bootcamps">
        <div className="container mx-auto px-4">
          <div className="flex flex-col md:flex-row items-end justify-between mb-8 gap-4 text-left">
            <div className="max-w-2xl">
              <div className="inline-flex items-center gap-2 px-4 py-2 bg-indigo-100 rounded-full text-indigo-600 font-bold mb-3">
                <Sparkles size={16} />
                <span className="text-sm">Extended Learning</span>
              </div>
              <div className="flex items-center justify-start gap-3 mb-2">
                <GraduationCap className="w-8 h-8 md:w-10 md:h-10 text-secondary-500" />
                <h2 className="text-3xl md:text-5xl font-black leading-tight drop-shadow-sm text-slate-900">
                  Specialized{' '}
                  <span className="text-transparent bg-clip-text bg-gradient-to-r from-green-400 to-blue-500">Bootcamps</span>
                </h2>
              </div>
            </div>
            <p className="text-base font-bold md:max-w-xs animate-pulse opacity-90 mt-2">
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-green-400 to-blue-500">Long-term intensive programs to master advanced technologies.</span>
            </p>
          </div>

          <BootcampSection />
        </div>
      </section>

      <CourseSelection />


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

      {/* 2.6 WORKSHOPS & BOOTCAMPS SECTION
      <section className="py-14 bg-gradient-to-b from-white to-gray-50 overflow-hidden" id="workshops">
        <div className="container mx-auto px-4">
          <div className="flex flex-col md:flex-row items-end justify-between mb-8 gap-4 text-left">
            <div className="max-w-2xl">
              <div className="inline-flex items-center gap-2 px-4 py-2 bg-accent-100 rounded-full text-accent-600 font-bold mb-3">
                <Rocket size={16} />
                <span className="text-sm">Space Bootcamps</span>
              </div>
              <div className="flex items-center justify-start gap-3 mb-2">
                <Ticket className="w-8 h-8 md:w-10 md:h-10 text-secondary-500" />
                <h2 className="text-3xl md:text-5xl font-black leading-tight drop-shadow-sm text-slate-900">
                  Magical{' '}
                  <span className="text-transparent bg-clip-text bg-gradient-to-r from-green-400 to-blue-500">Workshops</span>
                </h2>
              </div>
            </div>
            <p className="text-base font-bold md:max-w-xs animate-pulse opacity-90 mt-2">
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-green-400 to-blue-500">Intensive learning experiences designed to spark creative magic.</span>
            </p>
          </div>

          <WorkshopSection />
        </div>
      </section>
      */}

      {/* After Courses AdSense Unit 
      <div className="max-w-7xl mx-auto px-4 py-8">
        <AdUnit slot="post-courses-banner" className="my-0" />
      </div>
      */}

      {/* UPDATED SUPERSTAR PROJECTS SECTION */}
      <SuperstarProjects />

      {/* 2. ₹99 ATTRACTIVE SECTION
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
              <span className="text-yellow-200 inline-block -rotate-6 scale-110 mx-2 drop-shadow-xl">{formatPrice(99)}</span>
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
               Go Magic! {formatPrice(99)} 🚀
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
      */}

      {/* 3. ABOUT RUZANN SECTION */}
      <section className="py-10 md:py-20 px-4 bg-slate-950 text-white relative overflow-hidden" id="about">
         {/* Glow effects */}
         <div className="absolute top-0 left-1/4 w-96 h-96 bg-primary-600 rounded-full mix-blend-screen filter blur-[120px] opacity-10 pointer-events-none" />
         <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-secondary-600 rounded-full mix-blend-screen filter blur-[120px] opacity-10 pointer-events-none" />
         
         <div className="relative z-10 max-w-7xl mx-auto">
            <div className="text-center max-w-3xl mx-auto mb-8 md:mb-16">
              <h2 className="text-2xl sm:text-3xl md:text-5xl font-black mb-2 md:mb-4">
                Why kids love <span className="text-transparent bg-clip-text bg-gradient-to-r from-green-400 to-blue-500">RUZANN</span>?
              </h2>
              <p className="text-xs sm:text-base font-bold text-gray-400">
                We make education an enchanting experience, combining play with meaningful skill-building.
              </p>
            </div>

            <div className="grid grid-cols-2 md:grid-cols-3 gap-3 sm:gap-4 md:gap-8">
              <div className="bg-slate-900/80 border border-slate-800 border-b-8 border-b-primary-500 p-4 sm:p-5 md:p-8 rounded-2xl md:rounded-[2rem] text-center hover:-translate-y-3 transition-transform duration-300">
                <div className="w-12 h-12 sm:w-14 sm:h-14 md:w-20 md:h-20 bg-slate-800 rounded-full flex items-center justify-center text-xl sm:text-2xl md:text-4xl mx-auto mb-3 md:mb-6 shadow-lg shadow-black/30">🎮</div>
                <h3 className="text-sm sm:text-lg md:text-xl font-black text-white mb-2 md:mb-3">Game-Based Learning</h3>
                <p className="text-[10px] sm:text-xs md:text-sm lg:text-base text-gray-300 font-semibold leading-relaxed">Every lesson feels like a mission. Complete quests and earn badges!</p>
              </div>
              
              <div className="bg-slate-900/80 border border-slate-800 border-b-8 border-b-secondary-500 p-4 sm:p-5 md:p-8 rounded-2xl md:rounded-[2rem] text-center hover:-translate-y-3 transition-transform duration-300 md:mt-10">
                <div className="w-12 h-12 sm:w-14 sm:h-14 md:w-20 md:h-20 bg-slate-800 rounded-full flex items-center justify-center text-xl sm:text-2xl md:text-4xl mx-auto mb-3 md:mb-6 shadow-lg shadow-black/30">👨‍🏫</div>
                <h3 className="text-sm sm:text-lg md:text-xl font-black text-white mb-2 md:mb-3">Live Mentorship</h3>
                <p className="text-[10px] sm:text-xs md:text-sm lg:text-base text-gray-300 font-semibold leading-relaxed">Learn directly from top educators in small, interactive live sessions.</p>
              </div>
              
              <div className="bg-slate-900/80 border border-slate-800 border-b-8 border-b-accent-500 p-4 sm:p-5 md:p-8 rounded-2xl md:rounded-[2rem] text-center hover:-translate-y-3 transition-transform duration-300 col-span-2 md:col-span-1">
                <div className="w-12 h-12 sm:w-14 sm:h-14 md:w-20 md:h-20 bg-slate-800 rounded-full flex items-center justify-center text-xl sm:text-2xl md:text-4xl mx-auto mb-3 md:mb-6 shadow-lg shadow-black/30">🏆</div>
                <h3 className="text-sm sm:text-lg md:text-xl font-black text-white mb-2 md:mb-3">Real Skills</h3>
                <p className="text-[10px] sm:text-xs md:text-sm lg:text-base text-gray-300 font-semibold leading-relaxed">From coding to creativity, kids learn skills that matter for their future.</p>
              </div>
            </div>
         </div>
      </section>

      {/* 5. TESTIMONIALS SECTION */}
      <section className="py-12 px-4 bg-primary-50" id="testimonials">
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

      {/* 6. EDUCATORS SHOWCASE SECTION — BrightChamps Style */}
      <section className="py-16 bg-white overflow-hidden" id="teachers">
        <div className="max-w-7xl mx-auto px-4 md:px-8">

          {/* Section Header */}
          <div className="text-left mb-12 relative">
            <div className="mb-2">
              <span className="text-4xl">⭐</span>
            </div>
            <h2 className="text-3xl md:text-5xl font-black text-gray-900 mb-3">
              Our Team of <span className="text-transparent bg-clip-text bg-gradient-to-r from-green-400 to-blue-500">Educators</span>
            </h2>
            <p className="text-base md:text-lg font-bold text-gray-500 max-w-xl">
              Guiding stars committed to student success
            </p>
          </div>

          {/* Cards */}
          {loadingMentors ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {[1,2,3,4].map(i => (
                <div key={i} className="rounded-2xl bg-gray-100 animate-pulse h-96" />
              ))}
            </div>
          ) : mentors.length === 0 ? (
            <div className="text-center py-16 bg-gray-50 rounded-3xl border-2 border-dashed border-gray-200">
              <p className="text-gray-500 font-bold italic text-lg">Adding our expert mentors shortly! Stay tuned. ✨</p>
            </div>
          ) : (
            <SliderWrapper slidesPerViewLg={4} slidesPerViewMd={2} slidesPerViewSm={1} autoPlay={4000} gap={20}>
              {mentors.map((mentor, i) => {
                const heroBgs = [
                  'bg-yellow-400', 'bg-green-500', 'bg-orange-400',
                  'bg-purple-400', 'bg-blue-400', 'bg-pink-400', 'bg-teal-400'
                ];
                const heroBg = heroBgs[i % heroBgs.length];
                const rating = mentor.rating || 5.0;
                const ratingCount = mentor.ratingCount || Math.floor(Math.random() * 800 + 200);
                const experience = mentor.experience || `${Math.floor(Math.random() * 4) + 1} years`;
                const subjects = mentor.specialization || 'Coding & Technology';
                const location = mentor.location || 'India';
                const bioText = mentor.bio || `Hi! I'm ${mentor.name.split(' ')[0]}, passionate about making learning fun and effective for every child.`;
                const shortBio = bioText.length > 90 ? bioText.slice(0, 90) + '...' : bioText;

                return (
                  <div key={mentor._id} className="group">
                    <div className="bg-white border border-gray-100 rounded-3xl overflow-hidden shadow-md hover:shadow-2xl transition-all duration-300 hover:-translate-y-1.5 flex flex-col">

                      {/* Coloured Photo Banner */}
                      <div className={`relative ${heroBg} h-56 overflow-hidden rounded-t-3xl`}>
                        {mentor.profilePicture ? (
                          <img
                            src={getThumbnailUrl(mentor.profilePicture)}
                            alt={mentor.name}
                            className="w-full h-full object-cover object-[center_15%] group-hover:scale-105 transition-transform duration-500"
                          />
                        ) : (
                          <div className="flex items-center justify-center w-full h-full">
                            <span className="text-8xl font-black text-white/70 select-none">{mentor.name[0]}</span>
                          </div>
                        )}

                      </div>

                      {/* Card Body */}
                      <div className="p-5 flex flex-col flex-1">
                        {/* Name */}
                        <h3 className="text-base font-black text-gray-900 mb-0.5 leading-snug">{mentor.name}</h3>

                        {/* Rating */}
                        <div className="flex items-center gap-1 mb-3">
                          <Star size={13} className="text-yellow-400 fill-yellow-400" />
                          <span className="text-xs font-black text-gray-800">{rating.toFixed(1)}</span>
                          <span className="text-xs text-gray-400 font-medium">({ratingCount.toLocaleString()} ratings)</span>
                        </div>

                        {/* Meta info */}
                        <div className="space-y-1.5 mb-3">
                          <div className="flex items-start gap-2 text-xs text-gray-700 font-bold">
                            <span className="text-gray-400 mt-px">◈</span>
                            <span>Experience: <strong>{experience}</strong></span>
                          </div>
                          <div className="flex items-start gap-2 text-xs text-gray-700 font-bold">
                            <span className="text-gray-400 mt-px">◈</span>
                            <span className="line-clamp-2 leading-relaxed">{subjects}</span>
                          </div>
                          <div className="flex items-center gap-1.5 mt-2">
                            <span className="text-base leading-none">🇮🇳</span>
                            <div className="flex flex-col leading-none">
                              <span className="text-[9px] text-gray-400 uppercase tracking-widest font-black">Location</span>
                              <span className="text-xs font-black text-gray-700">{location}</span>
                            </div>
                          </div>
                        </div>

                        {/* Short Bio */}
                        <p className="text-xs text-gray-500 font-medium leading-relaxed mb-4 flex-1">
                          {shortBio}{' '}
                          {bioText.length > 90 && (
                            <Link href={`/teachers/${mentor._id}`} className="text-primary-500 font-bold hover:underline">Read More</Link>
                          )}
                        </p>

                        {/* CTA */}
                        <Link href={`/teachers/${mentor._id}`} className="block">
                          <button className="w-full py-3 rounded-full border-2 border-primary-500 text-primary-600 text-sm font-black hover:bg-primary-500 hover:text-white transition-all duration-200 active:scale-95 tracking-wide">
                            Join Class
                          </button>
                        </Link>
                      </div>
                    </div>
                  </div>
                );
              })}
            </SliderWrapper>
          )}

          <div className="text-center mt-10">
            <Link href="/teachers#experts">
              <Button variant="outline" className="rounded-full px-10 py-5 border-2 border-slate-100 font-black text-slate-600 hover:bg-slate-50 hover:border-slate-200 transition-all gap-2 shadow-lg shadow-slate-100">
                See All Educators <ArrowRight size={16} className="text-primary-500" />
              </Button>
            </Link>
          </div>

        </div>
      </section>

      {/* AI READINESS ASSESSMENT SECTION */}
      <section className="relative py-10 md:py-16 px-4 overflow-hidden bg-slate-950 text-white" id="ai-assessment">
        {/* Background Grid Overlay */}
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#1e293b_1px,transparent_1px),linear-gradient(to_bottom,#1e293b_1px,transparent_1px)] bg-[size:4rem_4rem] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_0%,#000_70%,transparent_100%)] opacity-30 z-0" />
        
        {/* Glowing orbs matching rest of the dark sections */}
        <div className="absolute top-[-60px] left-[-60px] w-72 h-72 bg-purple-600 rounded-full mix-blend-screen filter blur-[100px] opacity-20 animate-float z-0" />
        <div className="absolute bottom-[-60px] right-[-60px] w-80 h-80 bg-indigo-500 rounded-full mix-blend-screen filter blur-[100px] opacity-15 animate-float z-0" style={{ animationDelay: '2s' }} />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-cyan-500 rounded-full mix-blend-screen filter blur-[160px] opacity-10 z-0" />

        {/* Floating stars */}
        <div className="absolute top-8 left-[10%] text-yellow-300 text-2xl opacity-40 animate-bounce">✦</div>
        <div className="absolute top-12 right-[12%] text-cyan-300 text-xl opacity-30 animate-pulse">✦</div>
        <div className="absolute bottom-12 left-[15%] text-purple-300 text-3xl opacity-25 animate-float">✦</div>
        <div className="absolute bottom-8 right-[8%] text-pink-300 text-2xl opacity-35 animate-bounce" style={{ animationDelay: '1s' }}>✦</div>

        <div className="relative z-10 max-w-4xl mx-auto text-center">
          {/* Badge */}
          <div className="inline-flex items-center gap-2 px-4 py-1.5 mb-4 rounded-full border border-white/20 bg-white/10 backdrop-blur-md text-cyan-300 font-black uppercase tracking-widest text-[10px] md:text-xs shadow-xl">
            <Brain className="w-3.5 h-3.5 text-cyan-300 animate-pulse" /> FREE AI READINESS CHECK
          </div>

          {/* Headline */}
          <h2 className="text-3xl md:text-5xl font-black text-white mb-2 md:mb-4 leading-tight drop-shadow-lg">
            Is Your Child Ready for the{' '}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-green-400 to-blue-500">
              AI Future?
            </span>
          </h2>

          {/* Sub-headline */}
          <p className="text-xs sm:text-sm md:text-base font-bold text-white/70 mb-6 md:mb-8 max-w-xl mx-auto leading-relaxed">
            FREE 3-Minute Assessment — Discover your child's AI potential right now!
          </p>

          {/* Feature Cards */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-3 md:gap-6 mb-6 md:mb-8 max-w-3xl mx-auto">
            {[
              { icon: <Trophy className="w-7 h-7 text-yellow-400" />, label: 'AI Readiness Score', desc: 'See exactly where your child stands in AI skills' },
              { icon: <BarChart3 className="w-7 h-7 text-cyan-400" />, label: 'Future Skills Report', desc: 'Personalised breakdown of key 21st-century skills' },
              { icon: <Target className="w-7 h-7 text-pink-500" />, label: 'Recommendations', desc: 'Custom learning path tailored for your child' },
            ].map(({ icon, label, desc }) => (
              <div
                key={label}
                className="flex flex-col items-center gap-1.5 p-4 md:p-6 rounded-2xl md:rounded-3xl bg-white/5 backdrop-blur-md border border-white/10 hover:bg-white/10 transition-all duration-300 hover:-translate-y-1"
              >
                <div className="mb-1.5 transform hover:scale-115 transition-transform duration-300 select-none filter drop-shadow-md">
                  {icon}
                </div>
                <span className="text-white font-black text-xs md:text-sm tracking-wide">{label}</span>
                <span className="text-white/50 text-[10px] md:text-xs font-semibold leading-relaxed">{desc}</span>
              </div>
            ))}
          </div>

          {/* CTA Button */}
          <Link href="/ai-quiz">
            <button
              id="start-ai-assessment-btn"
              className="group relative inline-flex items-center gap-2.5 px-8 py-3.5 md:px-12 md:py-5 rounded-full font-black text-base md:text-xl text-white shadow-2xl shadow-primary-500/30 transition-all duration-300 hover:scale-105 active:scale-95 overflow-hidden"
              style={{ background: 'linear-gradient(135deg, #E91E63, #00ACC1)' }}
            >
              {/* Shimmer effect */}
              <span className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent translate-x-[-200%] group-hover:translate-x-[200%] transition-transform duration-700" />
              <span className="relative z-10">🚀 Start Free Assessment</span>
              <ArrowRight size={20} className="relative z-10 group-hover:translate-x-1 transition-transform" />
            </button>
          </Link>

          {/* Trust indicators */}
          <div className="mt-5 md:mt-8 flex flex-wrap items-center justify-center gap-4 md:gap-6 text-white/40 text-[10px] md:text-xs font-bold uppercase tracking-widest">
            <span>✓ No sign-up required</span>
            <span>✓ 100% Free</span>
            <span>✓ Results in 3 minutes</span>
          </div>
        </div>
      </section>

      <ContactSection />

      {/* 8. TEACH AT RUZANN CTA SECTION */}
      <section className="py-12 relative overflow-hidden">
        <div className="container mx-auto px-4 max-w-5xl">
          <div className="relative group">
            {/* Background decorative elements */}
            <div className="absolute -top-10 -left-10 w-48 h-48 bg-primary-400/10 rounded-full blur-3xl animate-pulse" />
            <div className="absolute -bottom-10 -right-10 w-48 h-48 bg-secondary-400/10 rounded-full blur-3xl animate-pulse delay-1000" />
            
            {/* Added Decorative Stars for White BG visibility */}
            <div className="absolute top-10 right-10 opacity-20 animate-float">
              <Star size={40} className="text-indigo-400" strokeWidth={2} />
            </div>
            <div className="absolute bottom-10 left-10 opacity-20 animate-spin-slow">
              <Star size={30} className="text-primary-400" strokeWidth={2} />
            </div>
            <div className="absolute top-1/2 -left-20 opacity-10 rotate-12">
              <Star size={120} className="text-indigo-200" strokeWidth={1} />
            </div>
            
            <div className="relative z-10 glass-card bg-white/40 backdrop-blur-2xl border-2 border-white/60 p-8 md:p-12 rounded-[2.5rem] md:rounded-[3.5rem] text-center shadow-xl shadow-indigo-50/50 overflow-hidden transition-all duration-500">
               {/* Animated Icon */}
               <div className="w-16 h-16 bg-indigo-600 text-white rounded-2xl flex items-center justify-center mx-auto mb-6 text-3xl shadow-lg shadow-indigo-200 group-hover:scale-110 group-hover:rotate-6 transition-transform duration-500">
                  👨‍🏫
               </div>
               
               <h2 className="text-3xl md:text-5xl font-black text-slate-900 mb-4 tracking-tight leading-tight">
                 Inspire the Next <span className="text-indigo-600">Generation</span> 🌟
               </h2>
               
               <p className="text-base md:text-lg text-slate-600 font-bold max-w-xl mx-auto mb-8 leading-relaxed">
                 Join Ruzann as an educator and help kids explore the magic of technology. Share your knowledge and mentor young minds.
               </p>
               
               <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
                 <Link href="/teacher/signup" className="w-full sm:w-auto">
                    <Button size="lg" className="w-full sm:w-auto px-10 py-6 rounded-2xl font-black text-lg bg-indigo-600 hover:bg-indigo-700 shadow-xl shadow-indigo-100 transition-all active:scale-95 flex items-center justify-center gap-2">
                      Become a Teacher <ArrowRight size={20} />
                    </Button>
                 </Link>
                 <Link href="/contact" className="w-full sm:w-auto font-black text-indigo-500 hover:text-indigo-600 transition-colors py-2 px-6 text-base">
                    Contact HR
                 </Link>
               </div>
               
               {/* Bottom floating badge */}
               <div className="mt-10 flex items-center justify-center gap-2 border-t border-indigo-50 pt-8">
                 <div className="flex -space-x-2">
                    {[1,2,3].map(i => <div key={i} className="w-8 h-8 rounded-full border-2 border-white bg-indigo-50 flex items-center justify-center text-[10px]">⭐</div>)}
                 </div>
                 <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest ml-2">Join 500+ global educators</p>
               </div>
            </div>
          </div>
        </div>
      </section>
      
      {/* Bottom AdSense Unit 
      <div className="max-w-7xl mx-auto px-4 py-8">
        <AdUnit slot="footer-banner" className="mt-0" />
      </div>
      */}



      <Footer />
      <ScrollToTop />

      {/* Popup Enquiry Modal */}
      {isEnquiryOpen && (
        <div className="fixed inset-0 z-[2000] flex items-center justify-center p-4 bg-black/70 backdrop-blur-md animate-in fade-in duration-200">
          <div className="w-full max-w-md bg-slate-900 border border-slate-800 rounded-3xl overflow-hidden shadow-2xl p-6 md:p-8 relative animate-in zoom-in-95 duration-250">
            <button 
              onClick={() => setIsEnquiryOpen(false)}
              className="absolute top-4 right-4 text-gray-400 hover:text-white font-bold text-xl p-1"
            >
              ✕
            </button>
            <div className="text-center mb-6">
              <div className="w-12 h-12 bg-primary-500/10 text-primary-400 border border-primary-500/20 rounded-2xl flex items-center justify-center mx-auto mb-3 text-2xl">
                💬
              </div>
              <h3 className="text-2xl font-black text-white">Book Demo / Enquire</h3>
              <p className="text-sm font-bold text-gray-400 mt-1">Get in touch with our learning experts.</p>
            </div>
            
            <form onSubmit={handleEnquirySubmit} className="space-y-4">
              <div className="space-y-1">
                <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1">Your Name</label>
                <input 
                  required
                  type="text"
                  placeholder="Superstar Parent/Student Name"
                  className="w-full px-4 py-3 rounded-xl border border-slate-850 bg-slate-950 focus:border-primary-500 focus:outline-none transition-all font-semibold text-white text-sm placeholder:text-gray-600"
                  value={enquiryForm.name}
                  onChange={(e) => setEnquiryForm({...enquiryForm, name: e.target.value})}
                />
              </div>

              <div className="space-y-1">
                <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1">Email Address</label>
                <input 
                  required
                  type="email"
                  placeholder="parent@example.com"
                  className="w-full px-4 py-3 rounded-xl border border-slate-850 bg-slate-950 focus:border-primary-500 focus:outline-none transition-all font-semibold text-white text-sm placeholder:text-gray-600"
                  value={enquiryForm.email}
                  onChange={(e) => setEnquiryForm({...enquiryForm, email: e.target.value})}
                />
              </div>

              <div className="space-y-1">
                <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1">Phone Number</label>
                <input 
                  required
                  type="tel"
                  placeholder="e.g. +91 98765 43210"
                  className="w-full px-4 py-3 rounded-xl border border-slate-850 bg-slate-950 focus:border-primary-500 focus:outline-none transition-all font-semibold text-white text-sm placeholder:text-gray-600"
                  value={enquiryForm.phone}
                  onChange={(e) => setEnquiryForm({...enquiryForm, phone: e.target.value})}
                />
              </div>

              <div className="space-y-1">
                <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1">What's on your mind?</label>
                <div className="relative">
                  <select 
                    required
                    className="w-full px-4 py-3 rounded-xl border border-slate-850 bg-slate-950 focus:border-primary-500 focus:outline-none transition-all font-semibold text-white text-sm appearance-none pr-10"
                    value={enquiryForm.subject}
                    onChange={(e) => setEnquiryForm({...enquiryForm, subject: e.target.value})}
                  >
                    <option value="Demo">Book Demo Session 🎁</option>
                    <option value="Courses">Course Enquiry 📚</option>
                    <option value="Pricing">Fee Details & Offers 💰</option>
                    <option value="General">Other General Enquiry 👋</option>
                  </select>
                  <div className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none text-gray-400">
                    <ChevronDown size={14} />
                  </div>
                </div>
              </div>

              <div className="space-y-1">
                <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1">Additional Notes (Optional)</label>
                <textarea 
                  rows={2}
                  placeholder="Tell us a bit about your child..."
                  className="w-full px-4 py-3 rounded-xl border border-slate-850 bg-slate-950 focus:border-primary-500 focus:outline-none transition-all font-semibold text-white text-sm resize-none placeholder:text-gray-600"
                  value={enquiryForm.message}
                  onChange={(e) => setEnquiryForm({...enquiryForm, message: e.target.value})}
                />
              </div>

              <button 
                type="submit"
                disabled={isEnquirySubmitting}
                className="w-full py-4 rounded-xl font-black text-base bg-gradient-to-r from-primary-500 to-indigo-600 hover:from-primary-600 hover:to-indigo-700 text-white shadow-xl shadow-primary-500/20 transition-all flex items-center justify-center gap-2 active:scale-95 disabled:opacity-50"
              >
                {isEnquirySubmitting ? "Sending..." : "Submit Enquiry 🚀"}
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

// MODERN COURSE CATALOG COMPONENT
const CourseCatalog = () => {
    const [gradeFilter, setGradeFilter] = useState('All Ages');
    const [typeFilter, setTypeFilter] = useState('All');
    const { formatPrice } = useCurrency();
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
        if (cat.includes('robot')) return "bg-[#E91E6310]";
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
                                    <div className="text-xl md:text-3xl font-black text-gray-900">{formatPrice(course.offerPrice || course.totalCoursePrice)}</div>
                                    <div className="text-[10px] font-black text-gray-900 uppercase tracking-tighter">{formatPrice(course.pricePerSession)}/class</div>
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
