"use client";

import React, { useEffect, useState } from 'react';
import { Header } from '@/components/layout/Header';
import { Card, CardContent } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import api from '@/utils/api';
import { useParams, useRouter } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';
import { CheckCircle, Calendar, MapPin, ArrowRight, Sparkles, Clock, ShieldCheck, Star, Users as UsersIcon } from 'lucide-react';
import { useToast } from '@/context/ToastContext';
import { Footer } from '@/components/layout/Footer';
import Link from 'next/link';
import { trackEvent, trackAddToCart, trackInitiateCheckout, trackPurchase } from '@/utils/analytics';
import { useCurrency } from '@/context/CurrencyContext';
import { WorkshopSlotSelectorModal } from '@/components/game/WorkshopSlotSelectorModal';
import { StudentRegistrationModal } from '@/components/modals/StudentRegistrationModal';

export default function WorkshopDetailPage() {
  const { id } = useParams();
  const { user, loading: authLoading } = useAuth();
  const { currency, formatPrice } = useCurrency();
  const router = useRouter();
  const { showToast } = useToast();

  const [workshop, setWorkshop] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [isProcessing, setIsProcessing] = useState(false);
  
  const [activeWorkshopForSlots, setActiveWorkshopForSlots] = useState<any>(null);
  const [workshopSlots, setWorkshopSlots] = useState<any[]>([]);
  const [showRegModal, setShowRegModal] = useState(false);
  const [selectedSlotId, setSelectedSlotId] = useState<string | null>(null);

  const [couponCode, setCouponCode] = useState('');
  const [appliedCoupon, setAppliedCoupon] = useState<any>(null);
  const [couponError, setCouponError] = useState('');

  const originalPrice = workshop?.price || 0;
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
      const res = await api.post('/api/coupons/validate', { code: couponCode, productType: 'workshop' });
      if (res.data.success) {
        setAppliedCoupon(res.data.data);
        showToast("Coupon applied successfully! ✨", "success");
      }
    } catch (err: any) {
      setAppliedCoupon(null);
      setCouponError(err.response?.data?.message || "Invalid coupon");
    }
  };

  useEffect(() => {
    const fetchWorkshop = async () => {
      try {
        const res = await api.get(`/api/workshops/${id}`);
        if (res.data.success) {
          setWorkshop(res.data.data);
        }
      } catch (e) {
        console.error(e);
      } finally {
        setLoading(false);
      }
    };
    fetchWorkshop();

    // Load Razorpay Script
    const script = document.createElement('script');
    script.src = 'https://checkout.razorpay.com/v1/checkout.js';
    script.async = true;
    document.body.appendChild(script);
  }, [id]);

  const handleBookWorkshop = async () => {
    if (authLoading) return;
    
    // Meta Pixel AddToCart Event
    trackAddToCart({
      content_name: workshop?.title,
      content_category: 'Workshop',
      content_ids: [workshop?._id],
      content_type: 'product',
      value: finalPrice,
      currency: 'INR'
    });

    setIsProcessing(true);
    try {
      const slotRes = await api.get(`/api/workshops/${workshop._id}/slots`);
      const slots = slotRes.data.success ? slotRes.data.data : [];
      
      if (slots.length > 0) {
        setWorkshopSlots(slots);
        setActiveWorkshopForSlots(workshop);
        setIsProcessing(false);
      } else {
        trackEvent('workshop_enroll_click', { workshop_id: workshop._id, workshop_title: workshop.title });
        setSelectedSlotId(null);
        setShowRegModal(true);
        setIsProcessing(false);
      }
    } catch (err) {
      console.error("Error fetching slots", err);
      trackEvent('workshop_enroll_click_fallback', { workshop_id: workshop._id, workshop_title: workshop.title });
      setSelectedSlotId(null);
      setShowRegModal(true);
      setIsProcessing(false);
    }
  };

  const proceedToPayment = async (registrationId: string, currentCouponCode?: string) => {
    setIsProcessing(true);
    try {
      const payload: any = { 
        workshopId: workshop._id, 
        registrationId, 
        couponCode: currentCouponCode || appliedCoupon?.code,
        amount: finalPrice,
        currency: currency
      };
      if (selectedSlotId) payload.slotId = selectedSlotId;

      const orderRes = await api.post('/api/payments/workshop-order', payload);
      const order = orderRes.data.data;

      trackEvent('workshop_payment_init', { 
        workshop_id: workshop._id, 
        amount: order.amount / 100, 
        currency: order.currency 
      });

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
              workshopId: workshop._id,
              registrationId,
              amount: finalPrice,
              couponCode: appliedCoupon?.code
            };
            if (selectedSlotId) verifyPayload.slotId = selectedSlotId;

            const verifyRes = await api.post('/api/payments/workshop-verify', verifyPayload);

            if (verifyRes.data.success) {
              trackEvent('workshop_payment_success', { 
                workshop_id: workshop._id, 
                amount: order.amount / 100, 
                currency: order.currency 
              });
              // Meta Pixel Purchase Event
              trackPurchase({
                value: finalPrice,
                currency: 'INR',
                content_name: workshop.title,
                content_ids: [workshop._id],
                content_type: 'product',
                transaction_id: response.razorpay_payment_id
              });
              showToast("Successful booking! See you there. 🚀", "success");
              router.push('/payment-success');
            }
          } catch (err: any) {
            showToast("Payment verification failed. Please contact support.", "error");
          }
        },
        prefill: {
          name: user?.name,
          email: user?.email,
        },
        theme: {
          color: "#E91E63"
        }
      };

      const rzp = new (window as any).Razorpay(options);

      // Meta Pixel InitiateCheckout Event
      trackInitiateCheckout({
        content_name: workshop.title,
        num_items: 1,
        value: finalPrice,
        currency: 'INR'
      });

      rzp.open();
    } catch (err: any) {
      showToast(err.response?.data?.message || "Failed to initiate payment", "error");
    } finally {
      setIsProcessing(false);
    }
  };

  if (loading) return (
    <div className="min-h-screen bg-slate-50 flex items-center justify-center">
      <div className="flex flex-col items-center gap-6">
        <div className="w-20 h-20 border-8 border-rose-100 border-t-rose-600 rounded-[2rem] animate-spin" />
        <p className="font-black text-slate-400 uppercase tracking-widest text-xs animate-pulse">Summoning Workshop Magic...</p>
      </div>
    </div>
  );
  
  if (!workshop) return (
    <div className="min-h-screen bg-slate-50 flex flex-col items-center justify-center p-4 text-center">
       <span className="text-9xl mb-8">🎟️</span>
       <h1 className="text-5xl font-black text-slate-800 tracking-tighter mb-4 uppercase">Event Not Found</h1>
       <p className="text-slate-500 font-bold mb-10 max-w-md">This workshop ticket is currently not in our active roster.</p>
       <Button onClick={() => router.push('/workshops')} className="bg-rose-600 px-10 py-6 rounded-2xl font-black shadow-xl shadow-rose-100">Browse Events</Button>
    </div>
  );

  return (
    <div className="min-h-screen bg-white">
      <Header />
      
      {/* Workshop Hero */}
      <div className="bg-slate-900 text-white pt-24 pb-32 md:pt-32 md:pb-48 relative overflow-hidden">
        <div className="absolute inset-0 z-0">
           <div className="absolute top-[-20%] left-[-10%] w-[60%] h-[60%] bg-rose-600/20 rounded-full blur-[150px] animate-pulse" />
           <div className="absolute bottom-[-10%] right-[-5%] w-[40%] h-[40%] bg-orange-600/10 rounded-full blur-[120px]" />
        </div>

        <div className="container mx-auto px-6 flex flex-col lg:flex-row gap-16 items-center relative z-10">
          <div className="flex-1 text-center lg:text-left">
            <div className="inline-flex items-center gap-3 px-4 py-2 bg-rose-500/10 backdrop-blur-xl border border-rose-500/30 rounded-2xl text-rose-300 font-black text-[10px] uppercase tracking-[0.3em] mb-8">
               <Sparkles size={14} className="animate-wiggle" /> Special Live Workshop
            </div>
            
            <h1 className="text-5xl md:text-7xl lg:text-8xl font-black mb-8 leading-[0.9] tracking-tighter uppercase">
               {workshop.title}
            </h1>
            
            <p className="text-xl md:text-2xl text-slate-400 font-bold mb-12 max-w-3xl leading-relaxed">
               {workshop.description}
            </p>
            
            <div className="flex flex-wrap items-center justify-center lg:justify-start gap-10">
               <div className="flex gap-10">
                  <div className="text-left">
                    <p className="text-[10px] text-slate-500 font-black uppercase tracking-widest mb-1 flex items-center gap-1"><Calendar size={12} /> Date</p>
                    <p className="font-black text-xl tracking-tight">{new Date(workshop.date).toLocaleDateString('en-IN', { day: 'numeric', month: 'long', year: 'numeric' })}</p>
                  </div>
                  <div className="text-left">
                    <p className="text-[10px] text-slate-500 font-black uppercase tracking-widest mb-1 flex items-center gap-1"><MapPin size={12} /> Venue</p>
                    <p className="font-black text-xl tracking-tight uppercase">{workshop.venue}</p>
                  </div>
                  {workshop.showStudentsEnrolled && (
                    <div className="text-left">
                      <p className="text-[10px] text-rose-400 font-black uppercase tracking-widest mb-1 flex items-center gap-1"><UsersIcon size={12} /> Joined By</p>
                      <p className="font-black text-xl tracking-tight uppercase">{workshop.studentsEnrolled || 0} Students</p>
                    </div>
                  )}
               </div>
            </div>
          </div>

          <div className="w-full lg:w-[450px] group">
            <Card className="bg-white p-10 md:p-12 shadow-[0_40px_100px_rgba(225,29,72,0.15)] rounded-[4rem] border-none relative overflow-visible">
              <div className="absolute -top-6 -right-6 bg-rose-600 text-white w-24 h-24 rounded-[2rem] flex flex-col items-center justify-center shadow-[0_20px_40px_rgba(225,29,72,0.4)] rotate-12 group-hover:rotate-6 transition-transform">
                 <p className="text-[10px] font-black uppercase tracking-widest">Only</p>
                 <p className="text-2xl font-black leading-none">{formatPrice(finalPrice)}</p>
              </div>
              
              <div className="text-center mb-10 pb-10 border-b-4 border-slate-50">
                <div className="w-20 h-20 bg-rose-50 text-rose-600 rounded-[1.5rem] flex items-center justify-center mx-auto mb-6 text-4xl shadow-inner group-hover:scale-110 transition-transform">🎟️</div>
                <h3 className="text-3xl font-black text-slate-800 tracking-tighter mb-2">BOOK YOUR SEAT</h3>
                <p className="text-slate-600 font-bold uppercase text-[10px] tracking-widest">Entry Ticket for Live Session</p>
                {appliedCoupon && (
                  <p className="text-green-600 text-[10px] font-bold mt-2 flex items-center justify-center gap-1">
                      <CheckCircle size={10} /> {appliedCoupon.code} Applied! Saved {formatPrice(discountAmount)}
                  </p>
                )}
              </div>

              <div className="mb-6">
                <label className="block text-[10px] font-black text-gray-900 uppercase tracking-widest mb-2">
                  Promo Code:
                </label>
                <div className="flex gap-2">
                  <input
                    type="text"
                    placeholder="SUMMER25"
                    value={couponCode}
                    onChange={(e) => setCouponCode(e.target.value.toUpperCase())}
                    className="flex-1 p-3 rounded-xl border-2 border-gray-200 font-bold bg-white focus:border-primary-400 focus:outline-none transition-all text-sm text-slate-800"
                  />
                  <button 
                    onClick={handleApplyCoupon}
                    type="button"
                    className="bg-slate-900 text-white px-4 rounded-xl font-black text-xs hover:bg-black transition-colors"
                  >
                    Apply
                  </button>
                </div>
                {couponError && <p className="text-red-500 text-[10px] font-bold mt-1">{couponError}</p>}
              </div>

              <div className="space-y-6 mb-12">
                 {[
                   { icon: <Clock className="text-rose-500" size={20} />, title: "Live interactive Session", sub: "Deep-dive with expert mentors" },
                   { icon: <ShieldCheck className="text-rose-500" size={20} />, title: "Ruzann Verified", sub: "Safe and moderated environment" },
                   { icon: <Star className="text-rose-500" size={20} />, title: "Resource Pack", sub: "Exclusive materials included" }
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
                className={`w-full py-10 rounded-[2.5rem] font-black text-2xl shadow-3xl bg-primary-500 hover:bg-primary-600 shadow-primary-500/30 transition-all active:scale-95 flex items-center justify-center gap-3`} 
                onClick={handleBookWorkshop} 
                isLoading={isProcessing}
              >
                <>Book Seat Now <ArrowRight size={28} /></>
              </Button>

              <div className="mt-8 text-center">
                 <p className="text-[10px] font-black text-slate-500 uppercase tracking-[0.2em] px-4">
                   Secure Checkout • Instant Confirmation
                 </p>
              </div>
            </Card>
          </div>
        </div>
      </div>

      {/* Main Content Info */}
      <div className="container mx-auto px-6 -mt-20 md:-mt-24 relative z-20 pb-32">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-16">
          <div className="lg:col-span-8">
            <div className="bg-white p-8 md:p-16 rounded-[4rem] shadow-2xl shadow-slate-100 border border-slate-50 group">
              <h2 className="text-xs font-black text-rose-500 uppercase tracking-[0.4em] mb-4 flex items-center gap-3">
                <div className="w-10 h-1 bg-rose-500 rounded-full" /> ABOUT THE WORKSHOP
              </h2>
              <h3 className="text-4xl md:text-5xl font-black text-slate-800 tracking-tighter mb-10">What to <span className="text-slate-300 italic">Expect.</span></h3>
              <div className="prose prose-slate max-w-none text-slate-600 font-bold leading-relaxed whitespace-pre-wrap">
                {workshop.description}
                
                {"\n\n"}
                Our workshops are designed to be highly interactive sessions where students engage directly with mentors. 
                Whether it's building a robotic arm, exploring the secrets of outer space, or mastering digital art, 
                every session is packed with practical knowledge and magical fun!
              </div>
            </div>
          </div>
          
          <div className="lg:col-span-4">
             <div className="bg-amber-500 p-12 rounded-[4rem] text-white relative overflow-hidden shadow-2xl">
                <h4 className="text-3xl font-black mb-6 tracking-tighter leading-none">Have Any <br/>Questions?</h4>
                <p className="text-amber-100 font-bold mb-10 leading-relaxed text-sm">Need help picking the right workshop or have technical doubts? Our team is here!</p>
                <Link href="/contact" className="flex items-center justify-center bg-white text-amber-600 w-full py-5 rounded-2xl font-black text-sm shadow-xl hover:-translate-y-1 transition-transform uppercase tracking-widest">
                  Contact Support →
                </Link>
             </div>
          </div>
        </div>
      </div>

      <Footer />
      
      {activeWorkshopForSlots && (
        <WorkshopSlotSelectorModal
          workshop={activeWorkshopForSlots}
          slots={workshopSlots}
          onClose={() => setActiveWorkshopForSlots(null)}
          onProceed={(slotId) => {
            setSelectedSlotId(slotId);
            setActiveWorkshopForSlots(null);
            setShowRegModal(true);
          }}
          isProcessing={isProcessing}
        />
      )}

      {workshop && (
        <StudentRegistrationModal
          isOpen={showRegModal}
          onClose={() => setShowRegModal(false)}
          onSuccess={(regId) => {
            setShowRegModal(false);
            proceedToPayment(regId, appliedCoupon?.code);
          }}
          type="workshop"
          itemId={workshop._id}
          itemName={workshop.title}
          amount={finalPrice}
        />
      )}
    </div>
  );
}
