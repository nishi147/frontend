"use client";

import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Header } from '@/components/layout/Header';
import { Footer } from '@/components/layout/Footer';
import { Card, CardContent } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Calendar, MapPin, ArrowRight, Rocket, Search } from 'lucide-react';
import Link from 'next/link';
import { useAuth } from '@/context/AuthContext';
import { useRouter } from 'next/navigation';

export default function WorkshopsPage() {
  const { user } = useAuth();
  const router = useRouter();
  const [workshops, setWorkshops] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);

  useEffect(() => {
    const fetchWorkshops = async () => {
      try {
        const res = await axios.get(`${process.env.NEXT_PUBLIC_API_URL}/api/workshops`);
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
      router.push('/register');
      return;
    }

    setIsProcessing(true);
    try {
      const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000';
      
      // 1. Create order
      const orderRes = await axios.post(`${apiUrl}/api/payments/workshop-order`, { workshopId: workshop._id });
      
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
            alert("Payment verification failed: " + (err.response?.data?.message || err.message));
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
        alert("Payment failed: " + response.error.description);
      });

    } catch (err: any) {
      console.error("Payment initiation error:", err);
      alert("Failed to initiate payment: " + (err.response?.data?.message || err.message));
    } finally {
      setIsProcessing(false);
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
          <p className="text-lg md:text-xl font-bold text-white/80 mb-8">
            Intensive, hands-on learning experiences for young innovators
          </p>
          {/* Search */}
          <div className="flex items-center gap-3 bg-white rounded-2xl px-4 py-3 max-w-md mx-auto shadow-lg">
            <Search size={20} className="text-gray-400" />
            <input
              type="text"
              value={search}
              onChange={e => setSearch(e.target.value)}
              placeholder="Search workshops..."
              className="flex-1 font-bold text-gray-700 bg-transparent outline-none"
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
              <h3 className="text-2xl font-black text-gray-400 mb-2">
                {search ? 'No workshops match your search' : 'No Workshops Scheduled Yet'}
              </h3>
              <p className="text-gray-400 font-bold">Check back soon — new bootcamps are being planned!</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {filtered.map((ws: any) => (
                <Card key={ws._id} className="relative group overflow-visible border-none shadow-[0_8px_30px_rgb(0,0,0,0.06)] hover:shadow-[0_8px_30px_rgb(0,0,0,0.12)] rounded-[2.5rem] transition-all duration-500 bg-white">
                  <div className="h-48 bg-gray-50 relative overflow-hidden flex items-center justify-center text-7xl rounded-t-[2.5rem]">
                    {ws.image && ws.image !== 'no-image.jpg' ? (
                      <img src={ws.image} alt={ws.title} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" />
                    ) : (
                      <div className="text-gray-300 opacity-50 font-sans font-black uppercase tracking-tighter mix-blend-multiply">{ws.title.substring(0, 8)}</div>
                    )}
                  </div>
                  
                  <div className="absolute top-[10rem] right-6 bg-white px-6 py-2 rounded-2xl shadow-xl z-10 flex items-center justify-center border border-gray-100 transform group-hover:-translate-y-2 transition-transform duration-500">
                    <span className="text-slate-900 font-black text-3xl tracking-tight">₹{ws.price}</span>
                  </div>

                  <CardContent className="p-8 pt-10">
                    <h3 className="text-xl font-black text-slate-800 uppercase tracking-wide mb-1 line-clamp-1">{ws.title}</h3>
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
          )}
        </div>
      </section>

      <Footer />
    </div>
  );
}
