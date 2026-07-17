"use client";

import React, { useEffect, useState } from 'react';
import { Header } from '@/components/layout/Header';
import { Footer } from '@/components/layout/Footer';
import api from '@/utils/api';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import { ChevronRight, FileText, Clock, Download, CheckCircle, BadgeCheck, CalendarDays, Zap, Handshake, Mail, Phone, MapPin } from 'lucide-react';
import Link from 'next/link';

const DEFAULT_REFUND_POLICY = `
# Refund & Cancellation Policy

**Last updated: June 29, 2026**

At RUZANN, customer satisfaction is our top priority. We believe in providing high-quality, engaging educational experiences to all young learners. Please read our policy regarding refunds and course cancellations carefully.

---

## 1. Refund Eligibility

We offer a 100% money-back guarantee under the following conditions:

* **Trial Sessions:** If you or your child are not satisfied after your initial paid trial session, you are eligible for a full refund of the trial fee.
* **Multi-session Courses:** For our regular courses and bootcamps, you can request a full refund within **7 days of enrollment** or **before the start of the second (2nd) scheduled session** of the course, whichever is earlier.
* **No Refunds After 2nd Session:** Once the second session of a course or bootcamp has commenced, no refunds (full or partial) will be issued.

---

## 2. Non-Refundable Items

The following are not eligible for refunds:

* **Course materials and downloadable content** once accessed.
* **Bootcamp or workshop fees** after the event has commenced.
* **Subscription fees** for the current billing period once renewed.

---

## 3. How to Request a Refund

To request a refund, please send an email to **support@ruzann.com** with the following information:

* Your registered email address and phone number
* Child's name
* Course name and enrollment date
* Order/Transaction ID
* A brief explanation of the reason for requesting a refund (your feedback helps us improve)

We aim to respond to all refund requests within **2 business days**.

---

## 4. Refund Processing

Once your refund request is received and verified:

* We will notify you via email regarding the **approval or rejection** of your refund.
* **Approved refunds** will be processed immediately, and a credit will automatically be applied to your original payment method within **5 to 7 business days** (depending on your bank or card issuer).
* Refunds are always credited back to the **original payment method** used at the time of purchase.

---

## 5. Cancellations & Rescheduling

* **By the Parent/Guardian:** If you need to reschedule or pause a course due to unforeseen circumstances, please contact us at least **24 hours before** the scheduled class. We will do our best to accommodate makeup sessions.
* **By RUZANN:** In the rare event that a class is cancelled by us (e.g., due to mentor illness or technical outages), a makeup session will be scheduled at a mutually convenient time, or a **pro-rata refund** will be provided for that specific session.

---

## 6. Special Circumstances

We understand that exceptional situations arise. If you are unable to continue a course due to medical emergencies or other extenuating circumstances, please contact us at support@ruzann.com. We will review each case individually and work with you to find a fair resolution.

---

## 7. Contact Us

For any refund-related queries, please reach out to:

**RUZANN EdTech Pvt. Ltd.**
Email: support@ruzann.com
Phone: +91 9960559894
Address: Pune, Maharashtra, India
`;

const highlights = [
  { icon: BadgeCheck, color: 'text-green-500', bg: 'bg-green-50', title: '100% Money Back', desc: 'Full refund for trial sessions — no questions asked.' },
  { icon: CalendarDays, color: 'text-blue-500', bg: 'bg-blue-50', title: '7-Day Window', desc: 'Refund eligible within 7 days of enrollment.' },
  { icon: Zap, color: 'text-amber-500', bg: 'bg-amber-50', title: 'Fast Processing', desc: '5–7 business days to your original payment method.' },
  { icon: Handshake, color: 'text-purple-500', bg: 'bg-purple-50', title: 'Fair Resolution', desc: 'Special cases reviewed individually with empathy.' },
];

export default function RefundPolicyPage() {
  const [content, setContent] = useState('');
  const [fileUrl, setFileUrl] = useState('');
  const [updatedAt, setUpdatedAt] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchPolicy = async () => {
      try {
        const res = await api.get('/api/settings');
        if (res.data.success) {
          setContent(res.data.data.refundPolicy?.content || DEFAULT_REFUND_POLICY);
          setFileUrl(res.data.data.refundPolicy?.fileUrl || '');
          setUpdatedAt(res.data.data.refundPolicy?.updatedAt || '');
        } else {
          setContent(DEFAULT_REFUND_POLICY);
        }
      } catch (error) {
        console.error("Error fetching refund policy:", error);
        setContent(DEFAULT_REFUND_POLICY);
      } finally {
        setLoading(false);
      }
    };
    fetchPolicy();
    window.scrollTo(0, 0);
  }, []);

  if (loading) return (
    <div className="min-h-screen bg-white flex items-center justify-center">
      <div className="flex flex-col items-center gap-4">
        <div className="w-16 h-16 border-4 border-primary-100 border-t-primary-500 rounded-full animate-spin" />
        <p className="font-black text-gray-400 animate-pulse uppercase tracking-[0.3em] text-[10px]">Loading Policy...</p>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-[#FAFAFA]">
      <Header />
      
      <main className="pt-32 pb-24">
        <div className="container mx-auto px-4 md:px-6">
          {/* Breadcrumbs */}
          <nav className="flex items-center gap-2 text-[10px] font-black uppercase tracking-widest text-gray-400 mb-10 overflow-x-auto whitespace-nowrap pb-2 scrollbar-hide">
            <Link href="/" className="hover:text-primary-500 transition-colors">Home</Link>
            <ChevronRight size={12} />
            <span className="text-gray-800">Refund Policy</span>
          </nav>

          <div className="max-w-4xl mx-auto">
            {/* Header Card */}
            <div className="bg-white rounded-[3rem] p-8 md:p-16 shadow-2xl border border-gray-50 relative overflow-hidden mb-12">
               <div className="absolute top-0 right-0 w-64 h-64 bg-amber-50 rounded-full -mr-32 -mt-32 opacity-70 blur-3xl animate-pulse" />
               
               <div className="relative z-10">
                 <div className="flex items-center gap-4 mb-8">
                   <div className="p-4 bg-amber-500 rounded-2xl shadow-lg shadow-amber-100">
                     <FileText className="w-8 h-8 text-white" />
                   </div>
                   <h1 className="text-4xl md:text-6xl font-black text-gray-800 tracking-tighter">
                     Refund <span className="text-amber-500">Policy</span>
                   </h1>
                 </div>

                 <p className="text-lg md:text-xl font-bold text-gray-500 leading-relaxed max-w-2xl mb-10">
                   We believe in our learning quality and support it with a transparent, student-first refund process.
                 </p>

                 <div className="flex flex-col sm:flex-row items-start sm:items-center gap-6">
                    <div className="flex items-center gap-3 text-gray-400 font-black text-xs uppercase tracking-widest">
                       <Clock size={16} className="text-amber-400" />
                       Last Updated: {updatedAt ? new Date(updatedAt).toLocaleDateString() : 'June 29, 2026'}
                    </div>
                    {fileUrl && (
                      <a 
                        href={fileUrl} 
                        target="_blank" 
                        rel="noopener noreferrer"
                        className="flex items-center gap-2 bg-gray-900 text-white px-6 py-3 rounded-2xl font-black text-xs uppercase tracking-widest hover:bg-amber-600 transition-all shadow-xl shadow-gray-200"
                      >
                        <Download size={16} /> View Official PDF
                      </a>
                    )}
                 </div>
               </div>
            </div>

            {/* Highlights Grid */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-12">
              {highlights.map((h, i) => (
                <div key={i} className="bg-white p-6 rounded-[2rem] border border-gray-100 shadow-sm text-center">
                  <div className={`inline-flex items-center justify-center w-12 h-12 rounded-2xl mb-3 ${h.bg}`}>
                    <h.icon className={`w-6 h-6 ${h.color}`} />
                  </div>
                  <h4 className="font-black text-gray-800 text-sm mb-1">{h.title}</h4>
                  <p className="text-xs font-bold text-gray-400 leading-relaxed">{h.desc}</p>
                </div>
              ))}
            </div>

            {/* Content Section */}
            <div className="bg-white rounded-[3.5rem] p-8 md:p-20 shadow-sm border border-gray-100">
              <div className="policy-content">
                <ReactMarkdown remarkPlugins={[remarkGfm]}>
                  {content}
                </ReactMarkdown>
              </div>
            </div>

            {/* Contact CTA */}
            <div className="mt-16 p-10 md:p-16 bg-gradient-to-br from-amber-500 to-orange-600 rounded-[3.5rem] text-center text-white relative overflow-hidden shadow-2xl">
               <div className="relative z-10">
                  <div className="flex justify-center mb-6">
                    <CheckCircle className="w-16 h-16 text-white/80" />
                  </div>
                  <h2 className="text-3xl md:text-4xl font-black mb-6 tracking-tight">Need Help with a Refund?</h2>
                  <p className="text-white/80 font-bold mb-10 max-w-lg mx-auto leading-relaxed">
                    Our support team typically responds within 2 business days. We're here to make this as smooth as possible.
                  </p>
                  <a 
                    href="mailto:support@ruzann.com"
                    className="inline-flex items-center gap-2 bg-white text-amber-600 px-12 py-5 rounded-2xl font-black text-lg shadow-2xl shadow-amber-700/20 hover:bg-amber-50 transition-all"
                  >
                    Email support@ruzann.com
                  </a>
               </div>
            </div>

            {/* Related Links */}
            <div className="mt-10 flex flex-col sm:flex-row gap-4 justify-center">
              <Link href="/privacy-policy" className="flex-1 p-6 bg-white rounded-3xl border border-gray-100 shadow-sm text-center font-black text-gray-600 hover:border-primary-200 hover:text-primary-500 transition-all">
                Privacy Policy →
              </Link>
              <Link href="/terms-conditions" className="flex-1 p-6 bg-white rounded-3xl border border-gray-100 shadow-sm text-center font-black text-gray-600 hover:border-secondary-200 hover:text-secondary-500 transition-all">
                Terms & Conditions →
              </Link>
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
