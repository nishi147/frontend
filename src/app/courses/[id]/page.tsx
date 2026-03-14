"use client";

import React, { useEffect, useState } from 'react';
import { Header } from '@/components/layout/Header';
import { Card, CardTitle, CardContent } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import axios from 'axios';
import { useParams, useRouter } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';
import { CheckCircle, PlayCircle, FileText, X } from 'lucide-react';
import { useToast } from '@/context/ToastContext';

export default function CourseDetailPage() {
  const { id } = useParams();
  const { user, loading: authLoading } = useAuth();
  const router = useRouter();
  const [course, setCourse] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [isProcessing, setIsProcessing] = useState(false);
  const [selectedSessions, setSelectedSessions] = useState(1);
  const { showToast } = useToast();

  useEffect(() => {
    const fetchDoc = async () => {
      try {
        const res = await axios.get(`/api/courses/${id}`);
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

  const handleEnroll = async () => {
    if (authLoading) return; // Wait for auth to settle

    if (!user) {
      router.push('/login');
      return;
    }
    
    setIsProcessing(true);
    try {
      // 1. Create order
      const orderRes = await axios.post('/api/payments/order', { 
        courseId: course._id,
        sessions: selectedSessions 
      });
      const order = orderRes.data.data;

      // 2. Open Razorpay Widget
      const options = {
        key: process.env.NEXT_PUBLIC_RAZORPAY_KEY || 'rzp_test_SPPoz25OmAiMsD', // fallback for now
        amount: order.amount,
        currency: order.currency,
        name: "RUZANN",
        description: `Enrollment for ${course.title}`,
        order_id: order.id,
        handler: async function (response: any) {
          try {
            // 3. Verify Payment
            const verifyRes = await axios.post('/api/payments/verify', {
              razorpay_order_id: response.razorpay_order_id,
              razorpay_payment_id: response.razorpay_payment_id,
              razorpay_signature: response.razorpay_signature,
              courseId: course._id,
              sessions: selectedSessions,
              amount: order.amount / 100 // passing original amount in INR
            });

            if (verifyRes.data.success) {
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
          color: "#3b82f6"
        }
      };

      const rzp = new (window as any).Razorpay(options);
      rzp.open();
      
      rzp.on('payment.failed', function (response: any){
        showToast("Payment failed: " + response.error.description, "error");
      });

    } catch (err) {
      console.error(err);
      showToast("Failed to initiate payment", "error");
    } finally {
      setIsProcessing(false);
    }
  };

  if (loading) return <div className="text-center mt-20 font-bold text-2xl animate-pulse">Loading course...</div>;
  if (!course) return <div className="text-center mt-20 font-bold text-2xl">Course not found.</div>;

  return (
    <div className="min-h-screen bg-background">
      <Header />
      
      {/* Course Hero Header */}
      <div className="bg-gradient-to-r from-primary-600 to-secondary-600 text-white py-16 relative">
        {/* Mobile Close Button */}
        <button 
          onClick={() => router.back()}
          className="lg:hidden absolute top-4 left-4 p-2 bg-white/20 hover:bg-white/30 rounded-full transition-colors z-20"
          title="Close and go back"
        >
          <X size={20} />
        </button>

        <div className="container mx-auto px-4 flex flex-col md:flex-row gap-8 items-center">
          <div className="flex-1">
            <span className="bg-white/20 px-3 py-1 rounded-full text-sm font-bold tracking-wider mb-4 inline-block">NEW COURSE</span>
            <h1 className="text-4xl md:text-5xl font-black mb-4">{course.title}</h1>
            <p className="text-lg md:text-xl text-blue-100 font-semibold mb-6 max-w-2xl">{course.description}</p>
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-full bg-white flex items-center justify-center font-bold text-primary-600 text-xl">
                 {course.teacher?.name?.[0]}
              </div>
              <div>
                <p className="text-sm text-blue-200">Created by</p>
                <p className="font-bold text-lg">{course.teacher?.name}</p>
              </div>
            </div>
          </div>

          <div className="w-full md:w-[400px]">
            <Card className="bg-white text-gray-800 p-8 shadow-2xl">
              <div className="text-center mb-6 border-b-2 border-gray-100 pb-6">
                <div className="text-gray-500 font-bold uppercase tracking-widest text-sm mb-2">Total Amount</div>
                <div className="text-4xl font-black text-secondary-600 mb-1">₹{selectedSessions * course.pricePerSession}</div>
                <div className="text-gray-500 font-medium">₹{course.pricePerSession} × {selectedSessions} {selectedSessions === 1 ? 'Session' : 'Sessions'}</div>
              </div>

              <div className="mb-6">
                <label htmlFor="session-select" className="block text-sm font-bold text-gray-700 mb-2">
                  Select Sessions:
                </label>
                <select
                  id="session-select"
                  value={selectedSessions}
                  onChange={(e) => setSelectedSessions(parseInt(e.target.value))}
                  className="w-full p-3 rounded-xl border-2 border-gray-100 font-bold text-gray-700 bg-gray-50 focus:border-secondary-400 focus:outline-none"
                >
                  {Array.from({ length: course.numberOfSessions }, (_, i) => i + 1).map((num) => (
                    <option key={num} value={num}>
                      {num} {num === 1 ? 'Session' : 'Sessions'}
                    </option>
                  ))}
                </select>
              </div>
              
              <Button size="lg" fullWidth className="text-lg shadow-primary-500/50" onClick={handleEnroll} isLoading={isProcessing}>
                Enroll Now ✨
              </Button>

              <div className="mt-6 flex flex-col gap-3">
                <div className="flex items-center gap-3 text-gray-600 font-semibold">
                  <CheckCircle className="text-green-500 w-5 h-5" />
                  Full Lifetime Access
                </div>
                <div className="flex items-center gap-3 text-gray-600 font-semibold">
                  <CheckCircle className="text-green-500 w-5 h-5" />
                  Certificate of Completion
                </div>
                <div className="flex items-center gap-3 text-gray-600 font-semibold">
                  <CheckCircle className="text-green-500 w-5 h-5" />
                  Live Doubt Sessions
                </div>
              </div>
            </Card>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-12 flex flex-col md:flex-row gap-12">
        <div className="flex-1">
          <h2 className="text-3xl font-black text-gray-800 mb-6">Course Modules</h2>
          
          {course.modules && course.modules.length > 0 ? (
            <div className="flex flex-col gap-4">
              {course.modules.map((m: any, i: number) => (
                <div key={m._id} className="bg-white rounded-2xl border-2 border-gray-100 p-6 overflow-hidden">
                  <h3 className="text-xl font-bold text-primary-600 mb-4 flex items-center gap-3">
                    <span className="bg-primary-100 text-primary-600 w-8 h-8 rounded-full flex items-center justify-center text-sm">{i + 1}</span>
                    {m.title}
                  </h3>
                  <div className="flex flex-col gap-3 pl-11">
                    {m.lessons.map((l: any, idx: number) => (
                      <div key={l._id} className="flex items-center justify-between p-3 rounded-xl hover:bg-gray-50 transition-colors">
                        <div className="flex items-center gap-3 font-semibold text-gray-700">
                          {l.videoUrl ? <PlayCircle className="text-secondary-400 w-5 h-5" /> : <FileText className="text-accent-400 w-5 h-5" />}
                          {l.title}
                        </div>
                        <Button variant="ghost" size="sm" className="opacity-0 group-hover:opacity-100">Preview</Button>
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          ) : (
             <div className="bg-white p-8 rounded-2xl border-2 border-gray-100 text-center text-gray-500 font-bold">
               No modules have been added to this course yet.
             </div>
          )}
        </div>
      </div>
    </div>
  );
}
