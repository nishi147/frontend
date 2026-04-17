"use client";

import React, { useEffect, useState } from 'react';
import { Header } from '@/components/layout/Header';
import { Footer } from '@/components/layout/Footer';
import api from '@/utils/api';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import { FileText, ChevronRight, Shield, Clock, Download, ExternalLink, ArrowLeft } from 'lucide-react';
import { Button } from '@/components/ui/Button';
import Link from 'next/link';

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
          setContent(res.data.data.privacyPolicy?.content || '');
          setFileUrl(res.data.data.privacyPolicy?.fileUrl || '');
          setUpdatedAt(res.data.data.privacyPolicy?.updatedAt || '');
        }
      } catch (error) {
        console.error("Error fetching privacy policy:", error);
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
                       Last Updated: {updatedAt ? new Date(updatedAt).toLocaleDateString() : 'Recent'}
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
              <div className="prose prose-xl max-w-none 
                prose-p:text-gray-600 prose-p:font-bold prose-p:leading-relaxed prose-p:mb-8
                prose-headings:text-gray-800 prose-headings:font-black prose-headings:mb-6 prose-headings:mt-12
                prose-h2:text-4xl prose-h3:text-2xl
                prose-a:text-primary-500 prose-a:no-underline hover:prose-a:underline
                prose-ul:list-disc prose-ul:pl-6 prose-ul:mb-8
                prose-li:text-gray-600 prose-li:mb-2 prose-li:font-bold
                prose-strong:text-gray-800 prose-strong:font-black">
                {content ? (
                  <ReactMarkdown remarkPlugins={[remarkGfm]}>
                    {content}
                  </ReactMarkdown>
                ) : (
                  <div className="py-20 text-center">
                     <p className="text-gray-400 font-bold italic">This section is currently being updated by our legal team. Please check back shortly or refer to the PDF version if available.</p>
                  </div>
                )}
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
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
