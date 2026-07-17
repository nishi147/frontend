"use client";

import React, { useEffect, useState } from 'react';
import { Header } from '@/components/layout/Header';
import { Footer } from '@/components/layout/Footer';
import api from '@/utils/api';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import { ChevronRight, Shield, Clock, Download } from 'lucide-react';
import { Button } from '@/components/ui/Button';
import Link from 'next/link';

const DEFAULT_PRIVACY_POLICY = `
# Privacy Policy

**Last updated: June 29, 2026**

At RUZANN EdTech Pvt. Ltd. ("RUZANN", "we", "us", or "our"), we are deeply committed to protecting the privacy and personal information of our users, especially the children and families who trust us with their learning journeys. This Privacy Policy explains how we collect, use, disclose, and safeguard your information when you visit our website [www.ruzann.com](https://www.ruzann.com) and use our services.

Please read this policy carefully. If you disagree with its terms, please discontinue use of our site.

---

## 1. Information We Collect

We collect information in the following ways:

### 1.1 Information You Provide Directly
- **Account Registration:** Name, email address, phone number, and password when you sign up.
- **Student Profiles:** Child's name, age, grade level, and learning preferences to personalise course recommendations.
- **Payment Information:** Billing details processed securely via our third-party payment gateway (Razorpay). We do not store your full card details on our servers.
- **Communications:** Any messages, feedback, or support requests you send us.

### 1.2 Information Collected Automatically
- **Usage Data:** Pages visited, features used, time spent on lessons, quiz scores, and course progress.
- **Device & Technical Data:** IP address, browser type, operating system, and referring URLs.
- **Cookies & Tracking Technologies:** We use cookies and similar technologies to enhance your experience. See our Cookie section below.

---

## 2. How We Use Your Information

We use the information we collect to:

- **Provide and Improve Services:** Deliver personalised learning experiences, track course progress, and improve our platform.
- **Process Transactions:** Handle enrollments, payments, and issue receipts.
- **Communicate with You:** Send course updates, class reminders, newsletters, and important account notifications.
- **Ensure Safety:** Detect and prevent fraud, abuse, or any violations of our Terms of Service.
- **Legal Compliance:** Comply with applicable laws and regulations in India and internationally.
- **Analytics:** Understand how our platform is used to make data-driven improvements.

---

## 3. Children's Privacy (COPPA & Indian IT Act Compliance)

RUZANN's services are designed for children under the supervision of their parents or guardians. We take children's privacy very seriously.

- We **do not knowingly collect** personal information from children under the age of 13 without verifiable parental consent.
- All student accounts are linked to a **parent or guardian account**.
- Parents/guardians can review, modify, or request deletion of their child's data at any time by contacting us at **support@ruzann.com**.
- We do not display behavioural advertising to children.

---

## 4. Sharing of Information

We do not sell your personal information. We may share your data with:

- **Service Providers:** Third-party vendors who assist us in operating our platform (e.g., cloud hosting on AWS, payment processing via Razorpay, email delivery via SendGrid). These providers are contractually obligated to keep your data secure.
- **Legal Authorities:** When required by law, court order, or to protect the rights and safety of RUZANN and its users.
- **Business Transfers:** In the event of a merger, acquisition, or sale of assets, your information may be transferred. We will notify you before your information becomes subject to a different privacy policy.

---

## 5. Data Security

We implement industry-standard security measures to protect your information:

- **Encryption:** All data transmitted between your browser and our servers is encrypted using TLS/SSL.
- **Secure Storage:** Data is stored on secured, access-controlled servers.
- **Regular Audits:** We conduct periodic security reviews and vulnerability assessments.

Despite our efforts, no method of transmission over the internet is 100% secure. We encourage you to use a strong, unique password for your account.

---

## 6. Cookies Policy

We use cookies to:
- Keep you logged in during your session.
- Remember your preferences and settings.
- Analyse website traffic and user behaviour (via Google Analytics).

You can control cookie settings through your browser. Disabling cookies may affect some features of our platform.

---

## 7. Your Rights & Choices

You have the following rights regarding your personal data:

- **Access & Correction:** Request a copy of the personal information we hold about you and correct any inaccuracies.
- **Deletion:** Request that we delete your account and associated data, subject to certain legal exceptions.
- **Opt-Out:** Unsubscribe from marketing emails at any time using the unsubscribe link in any email.
- **Data Portability:** Request your data in a portable, machine-readable format.

To exercise any of these rights, please contact us at **support@ruzann.com**.

---

## 8. Third-Party Links

Our website may contain links to third-party websites (e.g., social media platforms, partner organisations). We are not responsible for the privacy practices of those sites. We encourage you to review their privacy policies independently.

---

## 9. Changes to This Policy

We may update this Privacy Policy from time to time to reflect changes in our practices or legal requirements. When we do, we will revise the "Last Updated" date at the top of this page and notify registered users via email. Your continued use of our services after changes are posted constitutes your acceptance of the updated policy.

---

## 10. Contact Us

If you have any questions, concerns, or requests regarding this Privacy Policy, please contact our Data Protection Officer at:

**RUZANN EdTech Pvt. Ltd.**
📧 Email: support@ruzann.com
📞 Phone: +91 9960559894
📍 Address: Pune, Maharashtra, India
`;

export default function PrivacyPolicyPage() {
  const [content, setContent] = useState('');
  const [fileUrl, setFileUrl] = useState('');
  const [updatedAt, setUpdatedAt] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchPolicy = async () => {
      try {
        const res = await api.get('/api/settings');
        if (res.data.success) {
          setContent(res.data.data.privacyPolicy?.content || DEFAULT_PRIVACY_POLICY);
          setFileUrl(res.data.data.privacyPolicy?.fileUrl || '');
          setUpdatedAt(res.data.data.privacyPolicy?.updatedAt || '');
        } else {
          setContent(DEFAULT_PRIVACY_POLICY);
        }
      } catch (error) {
        console.error("Error fetching privacy policy:", error);
        setContent(DEFAULT_PRIVACY_POLICY);
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
            <span className="text-gray-800">Privacy Policy</span>
          </nav>

          <div className="max-w-4xl mx-auto">
            {/* Header Card */}
            <div className="bg-white rounded-[3rem] p-8 md:p-16 shadow-2xl border border-gray-50 relative overflow-hidden mb-12">
               <div className="absolute top-0 right-0 w-64 h-64 bg-primary-50 rounded-full -mr-32 -mt-32 opacity-50 blur-3xl animate-pulse" />
               
               <div className="relative z-10">
                 <div className="flex items-center gap-4 mb-8">
                   <div className="p-4 bg-primary-500 rounded-2xl shadow-lg shadow-primary-100">
                     <Shield className="w-8 h-8 text-white" />
                   </div>
                   <h1 className="text-4xl md:text-6xl font-black text-gray-800 tracking-tighter">
                     Privacy <span className="text-primary-500">Policy</span>
                   </h1>
                 </div>

                 <p className="text-lg md:text-xl font-bold text-gray-500 leading-relaxed max-w-2xl mb-10">
                   Your trust is the foundation of our community. We are committed to protecting your personal data and ensuring a safe learning environment.
                 </p>

                 <div className="flex flex-col sm:flex-row items-start sm:items-center gap-6">
                    <div className="flex items-center gap-3 text-gray-400 font-black text-xs uppercase tracking-widest">
                       <Clock size={16} className="text-primary-400" />
                       Last Updated: {updatedAt ? new Date(updatedAt).toLocaleDateString() : 'June 29, 2026'}
                    </div>
                    {fileUrl && (
                      <a 
                        href={fileUrl} 
                        target="_blank" 
                        rel="noopener noreferrer"
                        className="flex items-center gap-2 bg-gray-900 text-white px-6 py-3 rounded-2xl font-black text-xs uppercase tracking-widest hover:bg-primary-600 transition-all shadow-xl shadow-gray-200"
                      >
                        <Download size={16} /> View Official PDF
                      </a>
                    )}
                 </div>
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

            {/* Bottom Contact CTA */}
            <div className="mt-16 p-10 md:p-16 bg-gradient-to-br from-gray-900 to-navy-950 rounded-[3.5rem] text-center text-white relative overflow-hidden shadow-2xl">
               <div className="absolute top-0 left-0 w-full h-full bg-[url('/grid-white.svg')] opacity-5" />
               <div className="relative z-10">
                  <h2 className="text-3xl md:text-4xl font-black mb-6 tracking-tight">Questions about your data?</h2>
                  <p className="text-white/60 font-bold mb-10 max-w-lg mx-auto leading-relaxed">
                    Our data protection officer is here to help. Reach out to us if you need clarification on how we handle your information.
                  </p>
                  <Button onClick={() => window.location.href='/contact'} className="bg-primary-500 hover:bg-white hover:text-primary-500 rounded-2xl h-16 px-12 font-black shadow-2xl shadow-primary-500/20 text-lg">Contact Support</Button>
               </div>
            </div>

            {/* Related Links */}
            <div className="mt-10 flex flex-col sm:flex-row gap-4 justify-center">
              <Link href="/terms-conditions" className="flex-1 p-6 bg-white rounded-3xl border border-gray-100 shadow-sm text-center font-black text-gray-600 hover:border-primary-200 hover:text-primary-500 transition-all">
                Terms & Conditions →
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
