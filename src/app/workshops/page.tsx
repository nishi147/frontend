"use client";

import React, { useState, useEffect } from 'react';
import { Header } from '@/components/layout/Header';
import { Footer } from '@/components/layout/Footer';
import { Card, CardContent } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Calendar, MapPin, ArrowRight, Rocket, Search, Link as LinkIcon, Star } from 'lucide-react';
import Link from 'next/link';
import { useAuth } from '@/context/AuthContext';
import { useRouter } from 'next/navigation';
import { useToast } from '@/context/ToastContext';

import api from '@/utils/api';
import { getThumbnailUrl } from '@/utils/image';

export default function WorkshopsPage() {
  const { user } = useAuth();
  const router = useRouter();
  const { showToast } = useToast();
  const [workshops, setWorkshops] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [processingId, setProcessingId] = useState<string | null>(null);

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

    // Load Razorpay Script
    const script = document.createElement('script');
    script.src = 'https://checkout.razorpay.com/v1/checkout.js';
    script.async = true;
    document.body.appendChild(script);
  }, []);

  const handleBookWorkshop = async (workshop: any) => {
    if (!user) {
      router.push('/login');
      return;
    }

    setProcessingId(workshop._id);
    try {
      // 1. Create order
      const orderRes = await api.post('/api/payments/workshop-order', { workshopId: workshop._id });
      
      if (!orderRes.data.success) {
        throw new Error(orderRes.data.message || "Failed to create order");
      }
      
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
            const verifyRes = await api.post('/api/payments/workshop-verify', {
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
      console.error("Payment initiation error:", err.response?.data || err);
      showToast("Failed to initiate payment: " + (err.response?.data?.message || err.message), "error");
    } finally {
      setProcessingId(null);
    }
  };

  const filtered = workshops.filter((w: any) =>
    w.title?.toLowerCase().includes(search.toLowerCase()) ||
    w.description?.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      <Header />

      {/* Hero */}
      <section className="bg-gradient-to-br from-[#6C5CE7] to-[#FD79A8] py-16 px-4 text-white text-center">
        <div className="container mx-auto max-w-3xl">
          <div className="inline-flex items-center gap-2 bg-white/20 px-4 py-2 rounded-full font-bold text-sm mb-4">
            <Rocket size={16} /> Live Events & Bootcamps
          </div>
          <h1 className="text-4xl md:text-6xl font-black mb-4 leading-tight">
            Workshops & <span className="text-yellow-300">Bootcamps</span>
          </h1>
          <p className="text-lg md:text-xl font-bold text-white mb-8">
            Intensive, hands-on learning experiences for young innovators
          </p>
          {/* Search */}
          <div className="flex items-center gap-3 bg-white rounded-2xl px-4 py-3 max-w-md mx-auto shadow-lg">
            <Search size={20} className="text-gray-900" />
            <input
              type="text"
              value={search}
              onChange={e => setSearch(e.target.value)}
              placeholder="Search workshops..."
              className="flex-1 font-black text-black bg-transparent outline-none placeholder:text-gray-400"
            />
          </div>
        </div>
      </section>

      {/* Workshop Cards */}
      <section className="py-12 px-4 flex-1">
        <div className="container mx-auto">
          {loading ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {[1, 2, 3].map(i => (
                <div key={i} className="h-80 rounded-3xl bg-gray-200 animate-pulse" />
              ))}
            </div>
          ) : filtered.length === 0 ? (
            <div className="text-center py-24">
              <div className="text-6xl mb-4">🎪</div>
              <h3 className="text-2xl font-black text-gray-950 mb-2">
                {search ? 'No workshops match your search' : 'No Workshops Scheduled Yet'}
              </h3>
              <p className="text-gray-900 font-bold">Check back soon — new bootcamps are being planned!</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {filtered.map((ws: any) => {
                const thumbUrl = getThumbnailUrl(ws.image);
                return (
                  <Card key={ws._id} className="min-w-[280px] sm:min-w-[320px] md:min-w-0 snap-center relative group overflow-hidden border border-gray-100 shadow-sm hover:shadow-md rounded-sm transition-all duration-300 bg-white">
                    <div className={`h-20 relative overflow-hidden flex flex-col items-center justify-center p-4 transition-all duration-700 group-hover:scale-[1.02] ${
                      ws.image && ws.image !== 'no-image.jpg' ? 'bg-slate-100' :
                      ws.title.toLowerCase().includes('space') ? 'bg-gradient-to-br from-indigo-700 via-purple-800 to-slate-900' :
                      ws.title.toLowerCase().includes('robot') ? 'bg-gradient-to-br from-cyan-500 via-blue-600 to-indigo-700' :
                      ws.title.toLowerCase().includes('art') ? 'bg-gradient-to-br from-pink-500 via-rose-500 to-orange-500' :
                      'bg-gradient-to-br from-[#F2643D] via-[#E0532C] to-[#C04220]'
                    }`}>
                      {/* Background Hero Image */}
                      {ws.image && ws.image !== 'no-image.jpg' ? (
                        <img 
                          src={thumbUrl} 
                          className="absolute inset-0 w-full h-full object-cover group-hover:scale-105 transition-transform duration-700" 
                          alt={ws.title} 
                        />
                      ) : (
                        <>
                          {/* Decorative Elements */}
                          <div className="absolute inset-0 opacity-20 pointer-events-none">
                            <div className="absolute -top-5 -left-5 w-20 h-20 bg-white rounded-full blur-2xl opacity-30 animate-pulse" />
                          </div>

                          <div className="relative z-10">
                            <div className="text-3xl filter drop-shadow-md group-hover:scale-110 transition-transform duration-500">
                              {ws.title.toLowerCase().includes('space') ? '🚀' : 
                               ws.title.toLowerCase().includes('robot') ? '🤖' : 
                               ws.title.toLowerCase().includes('art') ? '🎨' : '🎟️'}
                            </div>
                          </div>
                        </>
                      )}
                    </div>
                    
                    <div className="absolute top-2 right-2 bg-white/90 backdrop-blur-md px-2 py-0.5 rounded shadow-sm font-black text-slate-900 text-sm z-10 border border-white/20">
                      ₹{ws.price}
                    </div>

                    <CardContent className="p-3">
                      <div className="mb-2">
                         <h3 className="text-sm font-black text-black leading-tight mb-0.5 line-clamp-1">{ws.title}</h3>
                         <div className="flex items-center gap-1 text-yellow-500">
                           <Star size={10} fill="currentColor" />
                           <span className="text-[10px] font-black text-gray-800">5.0</span>
                           <span className="text-[10px] font-medium text-gray-400">(4k+)</span>
                         </div>
                      </div>

                      <div className="flex flex-col gap-1.5 mb-4 pt-2 border-t border-gray-50">
                        <div className="flex items-center gap-2 text-slate-700">
                           <Calendar size={12} className="text-indigo-500" />
                           <span className="font-bold text-[10px] truncate">{new Date(ws.date).toLocaleDateString('en-IN', { day: 'numeric', month: 'short' })}</span>
                        </div>
                        <div className="flex items-center gap-2 text-slate-700">
                           <MapPin size={12} className="text-indigo-500" />
                           <span className="font-bold text-[10px] uppercase truncate">{ws.venue}</span>
                        </div>
                      </div>

                      <div className="flex flex-col gap-1.5">
                        <Button 
                          onClick={() => handleBookWorkshop(ws)}
                          isLoading={processingId === ws._id}
                          className="w-full py-2.5 rounded font-black text-[10px] uppercase tracking-wider bg-[#F2643D] hover:bg-[#E0532C] text-white border-none transition-all flex items-center justify-center gap-2"
                        >
                          Book Seat <ArrowRight size={12} />
                        </Button>
                        <Link href="/workshops" className="w-full py-1.5 rounded font-black text-[9px] uppercase tracking-widest text-indigo-500 border border-indigo-100 hover:bg-indigo-50 transition-all text-center">
                          Program Info →
                        </Link>
                      </div>
                    </CardContent>
                  </Card>
                );
              })}
            </div>
          )}
        </div>
      </section>

      <Footer />
    </div>
  );
}
