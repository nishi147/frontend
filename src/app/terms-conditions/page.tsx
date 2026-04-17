"use client";

import React, { useEffect, useState } from 'react';
import { Header } from '@/components/layout/Header';
import { Footer } from '@/components/layout/Footer';
import api from '@/utils/api';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import { FileText, ChevronRight, Scale, Clock, Download, ArrowLeft, Info } from 'lucide-react';
import { Button } from '@/components/ui/Button';
import Link from 'next/link';

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
          setContent(res.data.data.termsAndConditions?.content || '');
          setFileUrl(res.data.data.termsAndConditions?.fileUrl || '');
          setUpdatedAt(res.data.data.termsAndConditions?.updatedAt || '');
        }
      } catch (error) {
        console.error("Error fetching terms:", error);
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
                       Last Updated: {updatedAt ? new Date(updatedAt).toLocaleDateString() : 'Recent'}
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
              <div className="prose prose-xl max-w-none 
                prose-p:text-gray-600 prose-p:font-bold prose-p:leading-relaxed prose-p:mb-8
                prose-headings:text-gray-800 prose-headings:font-black prose-headings:mb-6 prose-headings:mt-12
                prose-h2:text-4xl prose-h3:text-2xl
                prose-a:text-secondary-500 prose-a:no-underline hover:prose-a:underline
                prose-ul:list-disc prose-ul:pl-6 prose-ul:mb-8
                prose-li:text-gray-600 prose-li:mb-2 prose-li:font-bold
                prose-strong:text-gray-800 prose-strong:font-black">
                {content ? (
                  <ReactMarkdown remarkPlugins={[remarkGfm]}>
                    {content}
                  </ReactMarkdown>
                ) : (
                  <div className="py-20 text-center">
                     <p className="text-gray-400 font-bold italic">Our terms of service are currently being updated. Refer to the PDF version or contact support for immediate inquiries.</p>
                  </div>
                )}
              </div>
            </div>

            {/* Help CTA */}
            <div className="mt-16 text-center">
               <p className="text-gray-400 font-bold mb-6">Need help understanding these terms?</p>
               <Button onClick={() => window.location.href='/contact'} className="bg-white border-2 border-gray-100 font-black text-gray-800 rounded-2xl h-14 px-10 hover:border-secondary-500 hover:text-secondary-500 transition-all shadow-sm">Get in Touch</Button>
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
