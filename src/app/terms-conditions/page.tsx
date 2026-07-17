"use client";

import React, { useEffect, useState } from 'react';
import { Header } from '@/components/layout/Header';
import { Footer } from '@/components/layout/Footer';
import api from '@/utils/api';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import { ChevronRight, Scale, Clock, Download, Info } from 'lucide-react';
import { Button } from '@/components/ui/Button';
import Link from 'next/link';

const DEFAULT_TERMS_AND_CONDITIONS = `
# Terms & Conditions

**Last updated: June 29, 2026**

Welcome to RUZANN! These Terms and Conditions ("Terms") govern your use of the RUZANN EdTech platform, including our website [www.ruzann.com](https://www.ruzann.com), mobile applications, and all related services (collectively, the "Services"). By accessing or using our Services, you agree to be bound by these Terms. If you do not agree, please do not use our Services.

---

## 1. Acceptance of Terms

By creating an account, enrolling in a course, or otherwise using our Services, you confirm that:
- You are at least 18 years of age, or are a parent/guardian enrolling a child.
- You have the legal capacity to enter into this agreement.
- You agree to comply with all applicable local, national, and international laws.

---

## 2. Account Registration & Responsibilities

- You agree to provide **accurate, current, and complete** information during registration.
- You are responsible for maintaining the **confidentiality of your account credentials** and for all activities that occur under your account.
- You must **immediately notify us** at support@ruzann.com of any unauthorised access to your account.
- RUZANN reserves the right to refuse or terminate accounts at its sole discretion.

---

## 3. Services Offered

RUZANN provides online learning services for children, including but not limited to:
- Live interactive coding, robotics, and STEM classes.
- AI-powered learning tools and quizzes.
- Recorded video lessons and course materials.
- Bootcamps and workshops.

We reserve the right to modify, suspend, or discontinue any part of our Services at any time with reasonable notice.

---

## 4. Course Enrollment & Payment

- **Enrollment** in any paid course constitutes a binding agreement to pay the applicable fees.
- All prices listed on our website are in **Indian Rupees (INR)** and are inclusive of applicable taxes unless stated otherwise.
- Payments are processed securely through **Razorpay**. RUZANN does not store your financial payment details.
- Recurring subscriptions, if applicable, will be automatically charged on the renewal date until cancelled.

---

## 5. Intellectual Property Rights

All content on the RUZANN platform — including course materials, videos, quizzes, text, graphics, logos, and software — is the **exclusive property of RUZANN EdTech Pvt. Ltd.** and is protected by applicable intellectual property laws.

- You may **not** copy, reproduce, distribute, sell, or create derivative works from our content without prior written permission.
- You are granted a **limited, non-exclusive, non-transferable licence** to access and use our content solely for your personal, non-commercial educational purposes.

---

## 6. Student Conduct & Code of Ethics

We are committed to maintaining a respectful and safe learning environment. All students and parents/guardians are expected to:

- **Be Respectful:** Treat mentors, staff, and fellow students with courtesy and respect during all sessions.
- **No Cheating or Plagiarism:** Submit only original work and refrain from any form of academic dishonesty.
- **No Inappropriate Content:** Refrain from sharing harmful, offensive, or inappropriate content in any communication on our platform.
- **Attend Classes Punctually:** Join live sessions on time and inform us in advance if you are unable to attend.

Violation of our Code of Ethics may result in suspension or permanent removal from the platform without a refund.

---

## 7. Parental Consent & Supervision

- Parents or legal guardians are responsible for monitoring their child's use of our Services.
- By enrolling a child in our programs, you provide explicit consent for your child to participate in online live sessions, which may be recorded for quality assurance and safety purposes.
- Recording of any session by students or parents without prior written consent from RUZANN is strictly prohibited.

---

## 8. Limitation of Liability

To the fullest extent permitted by law, RUZANN shall not be liable for:
- Any indirect, incidental, special, or consequential damages arising from your use of our Services.
- Any interruption, suspension, or termination of Services due to circumstances beyond our reasonable control (force majeure), including internet outages, server failures, or natural disasters.

In any event, our total liability to you shall not exceed the amount you paid for the specific service giving rise to the claim in the preceding three (3) months.

---

## 9. Disclaimer of Warranties

Our Services are provided on an **"as is" and "as available"** basis without any warranties of any kind, express or implied, including but not limited to warranties of merchantability, fitness for a particular purpose, or non-infringement. RUZANN does not guarantee that our Services will be error-free or uninterrupted.

---

## 10. Governing Law & Dispute Resolution

These Terms shall be governed by and construed in accordance with the laws of **India**. Any disputes arising out of or in connection with these Terms shall be subject to the exclusive jurisdiction of the courts in **Pune, Maharashtra, India**.

---

## 11. Changes to These Terms

RUZANN reserves the right to update these Terms at any time. When we make material changes, we will notify you via email and update the "Last Updated" date. Your continued use of our Services after any changes constitutes your acceptance of the revised Terms.

---

## 12. Contact Us

For any questions regarding these Terms and Conditions, please contact us:

**RUZANN EdTech Pvt. Ltd.**
📧 Email: support@ruzann.com
📞 Phone: +91 9960559894
📍 Address: Pune, Maharashtra, India
`;

export default function TermsConditionsPage() {
  const [content, setContent] = useState('');
  const [fileUrl, setFileUrl] = useState('');
  const [updatedAt, setUpdatedAt] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchTerms = async () => {
      try {
        const res = await api.get('/api/settings');
        if (res.data.success) {
          setContent(res.data.data.termsAndConditions?.content || DEFAULT_TERMS_AND_CONDITIONS);
          setFileUrl(res.data.data.termsAndConditions?.fileUrl || '');
          setUpdatedAt(res.data.data.termsAndConditions?.updatedAt || '');
        } else {
          setContent(DEFAULT_TERMS_AND_CONDITIONS);
        }
      } catch (error) {
        console.error("Error fetching terms:", error);
        setContent(DEFAULT_TERMS_AND_CONDITIONS);
      } finally {
        setLoading(false);
      }
    };
    fetchTerms();
    window.scrollTo(0, 0);
  }, []);

  if (loading) return (
    <div className="min-h-screen bg-white flex items-center justify-center">
      <div className="flex flex-col items-center gap-4">
        <div className="w-16 h-16 border-4 border-secondary-100 border-t-secondary-500 rounded-full animate-spin" />
        <p className="font-black text-gray-400 animate-pulse uppercase tracking-[0.3em] text-[10px]">Loading Terms...</p>
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
            <Link href="/" className="hover:text-secondary-500 transition-colors">Home</Link>
            <ChevronRight size={12} />
            <span className="text-gray-800">Terms & Conditions</span>
          </nav>

          <div className="max-w-4xl mx-auto">
            {/* Header Card */}
            <div className="bg-white rounded-[3rem] p-8 md:p-16 shadow-2xl border border-gray-50 relative overflow-hidden mb-12">
               <div className="absolute top-0 right-0 w-64 h-64 bg-secondary-50 rounded-full -mr-32 -mt-32 opacity-50 blur-3xl animate-pulse" />
               
               <div className="relative z-10">
                 <div className="flex items-center gap-4 mb-8">
                   <div className="p-4 bg-secondary-500 rounded-2xl shadow-lg shadow-secondary-100">
                     <Scale className="w-8 h-8 text-white" />
                   </div>
                   <h1 className="text-4xl md:text-6xl font-black text-gray-800 tracking-tighter">
                     Terms of <span className="text-secondary-500">Service</span>
                   </h1>
                 </div>

                 <p className="text-lg md:text-xl font-bold text-gray-500 leading-relaxed max-w-2xl mb-10">
                   These terms outline the rules and regulations for using the Ruzann platform. By accessing our services, you agree to comply with these guidelines.
                 </p>

                 <div className="flex flex-col sm:flex-row items-start sm:items-center gap-6">
                    <div className="flex items-center gap-3 text-gray-400 font-black text-xs uppercase tracking-widest">
                       <Clock size={16} className="text-secondary-400" />
                       Last Updated: {updatedAt ? new Date(updatedAt).toLocaleDateString() : 'June 29, 2026'}
                    </div>
                    {fileUrl && (
                      <a 
                        href={fileUrl} 
                        target="_blank" 
                        rel="noopener noreferrer"
                        className="flex items-center gap-2 bg-gray-900 text-white px-6 py-3 rounded-2xl font-black text-xs uppercase tracking-widest hover:bg-secondary-600 transition-all shadow-xl shadow-gray-200"
                      >
                        <Download size={16} /> View Official PDF
                      </a>
                    )}
                 </div>
               </div>
            </div>

            {/* Quick Summary Alert */}
            <div className="mb-12 p-8 bg-amber-50 border-2 border-amber-100 rounded-[2.5rem] flex flex-col md:flex-row gap-6 items-start md:items-center">
               <div className="p-4 bg-white rounded-2xl shadow-sm text-amber-500">
                  <Info size={24} />
               </div>
               <div>
                  <h4 className="font-black text-amber-900 mb-1">TL;DR Summary</h4>
                  <p className="text-sm font-bold text-amber-800/70 leading-relaxed">
                    Be respectful, follow our course rules, and enjoy learning. We own our content, and you own your progress!
                  </p>
               </div>
            </div>

            {/* Content Section */}
            <div className="bg-white rounded-[3.5rem] p-8 md:p-20 shadow-sm border border-gray-100">
              <div className="policy-content">
                <ReactMarkdown remarkPlugins={[remarkGfm]}>
                  {content}
                </ReactMarkdown>
              </div>
            </div>

            {/* Help CTA */}
            <div className="mt-16 text-center">
               <p className="text-gray-400 font-bold mb-6">Need help understanding these terms?</p>
               <button onClick={() => window.location.href='/contact'} className="bg-white border-2 border-gray-200 font-black text-gray-800 rounded-2xl h-14 px-10 hover:border-secondary-500 hover:text-secondary-500 transition-all shadow-sm cursor-pointer">Get in Touch</button>
            </div>

            {/* Related Links */}
            <div className="mt-10 flex flex-col sm:flex-row gap-4 justify-center">
              <Link href="/privacy-policy" className="flex-1 p-6 bg-white rounded-3xl border border-gray-100 shadow-sm text-center font-black text-gray-600 hover:border-primary-200 hover:text-primary-500 transition-all">
                Privacy Policy →
              </Link>
              <Link href="/refund-policy" className="flex-1 p-6 bg-white rounded-3xl border border-gray-100 shadow-sm text-center font-black text-gray-600 hover:border-amber-200 hover:text-amber-500 transition-all">
                Refund Policy →
              </Link>
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
