"use client";

import React, { useEffect, useState, useMemo } from 'react';
import { Header } from '@/components/layout/Header';
import { Footer } from '@/components/layout/Footer';
import { Button } from '@/components/ui/Button';
import api from '@/utils/api';
import { useParams, useRouter } from 'next/navigation';
import { Clock, User as UserIcon, Calendar, ArrowLeft, Share2, PlayCircle, BookOpen, List, HelpCircle, ChevronRight, Sparkles, ChevronUp } from 'lucide-react';
import Link from 'next/link';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';

export default function BlogSlugPage() {
  const { slug } = useParams();
  const router = useRouter();
  const [blog, setBlog] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchBlog = async () => {
      try {
        const res = await api.get(`/api/blogs/${slug}`);
        if (res.data.success) {
          setBlog(res.data.data);
        }
      } catch (e) {
        console.error("Error fetching blog:", e);
      } finally {
        setLoading(false);
      }
    };
    fetchBlog();
    window.scrollTo(0, 0);
  }, [slug]);

  // Generate Table of Contents
  const toc = useMemo(() => {
    if (!blog?.content) return [];
    const headings = blog.content.match(/^## .+/gm);
    if (!headings) return [];
    return headings.map((h: string) => {
      const text = h.replace('## ', '');
      const id = text.toLowerCase().replace(/[^\w ]+/g, '').replace(/ +/g, '-');
      return { text, id };
    });
  }, [blog]);

  if (loading) return (
    <div className="min-h-screen bg-white flex items-center justify-center">
      <div className="flex flex-col items-center gap-4">
        <div className="w-16 h-16 border-4 border-primary-100 border-t-primary-500 rounded-full animate-spin" />
        <p className="font-black text-gray-400 animate-pulse uppercase tracking-widest text-sm">Crafting the experience...</p>
      </div>
    </div>
  );
  
  if (!blog) return (
    <div className="min-h-screen bg-white flex flex-col items-center justify-center p-4 text-center">
       <div className="text-8xl mb-8">📖</div>
       <h1 className="text-4xl font-black text-gray-800 mb-4">Story Not Found</h1>
       <p className="text-gray-500 font-bold mb-10 max-w-md">This page seems to have moved or vanished.</p>
       <Button onClick={() => router.push('/')} className="rounded-2xl h-14 px-8 font-black">Back to Home</Button>
    </div>
  );

  // JSON-LD Schema
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "BlogPosting",
    "headline": blog.metaTitle || blog.title,
    "description": blog.metaDescription || blog.excerpt,
    "image": blog.image,
    "author": {
      "@type": "Organization",
      "name": "Ruzann"
    },
    "publisher": {
      "@type": "Organization",
      "name": "Ruzann",
      "logo": {
        "@type": "ImageObject",
        "url": "https://ruzann.com/logo.png"
      }
    },
    "datePublished": blog.createdAt,
    "dateModified": blog.updatedAt
  };

  const faqJsonLd = blog.faqs?.length > 0 ? {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    "mainEntity": blog.faqs.map((f: any) => ({
      "@type": "Question",
      "name": f.question,
      "acceptedAnswer": {
        "@type": "Answer",
        "text": f.answer
      }
    }))
  } : null;

  return (
    <div className="min-h-screen bg-[#FAFAFA]">
      {/* Dynamic Metadata Script */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      {faqJsonLd && (
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(faqJsonLd) }}
        />
      )}
      
      <Header />
      
      <main className="pt-24 pb-20">
        <div className="container mx-auto px-4 md:px-6">
          <Link href="/" className="inline-flex items-center gap-2 text-gray-400 hover:text-primary-500 font-black uppercase tracking-widest text-[10px] mb-10 transition-colors group">
            <ArrowLeft size={16} className="group-hover:-translate-x-1 transition-transform" /> Back to Magical Stories
          </Link>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
            {/* Sidebar / TOC (Sticky) */}
            <aside className="hidden lg:block lg:col-span-3">
              <div className="sticky top-32 space-y-8">
                {toc.length > 0 && (
                  <div className="bg-white rounded-[2rem] p-8 shadow-sm border border-gray-100">
                    <h4 className="text-[11px] font-black text-gray-400 uppercase tracking-widest mb-6 flex items-center gap-2">
                       <List size={14} /> Quick Navigation
                    </h4>
                    <nav className="space-y-4">
                      {toc.map((item: any, i: number) => (
                        <a 
                          key={i} 
                          href={`#${item.id}`}
                          className="block text-sm font-bold text-gray-500 hover:text-primary-500 transition-colors leading-relaxed"
                        >
                          {item.text}
                        </a>
                      ))}
                    </nav>
                  </div>
                )}
                
                <div className="bg-primary-500 rounded-[2rem] p-8 text-white shadow-xl shadow-primary-100">
                   <Sparkles className="mb-4 opacity-50" size={32} />
                   <h4 className="text-xl font-black mb-2">Learn to Code!</h4>
                   <p className="text-sm font-bold text-white/80 mb-6">Join our magical bootcamps and become a tech wizard.</p>
                   <Button className="w-full bg-white text-primary-600 rounded-xl h-12 font-black">Explore Courses</Button>
                </div>
              </div>
            </aside>

            {/* Main Content */}
            <article className="lg:col-span-9 max-w-4xl mx-auto lg:mx-0">
              <div className="mb-12">
                <div className="flex items-center gap-3 mb-6">
                  <span className="px-6 py-2 bg-primary-50 text-primary-600 rounded-full text-xs font-black uppercase tracking-widest border border-primary-100 shadow-sm">
                    {blog.category}
                  </span>
                  {blog.isPublished === false && <span className="bg-yellow-500 text-white px-3 py-1 rounded-full text-[10px] font-black">DRAFT</span>}
                </div>
                <h1 className="text-4xl md:text-6xl font-black text-gray-800 mb-8 leading-tight">
                  {blog.title}
                </h1>
                
                <div className="flex flex-wrap items-center gap-6 text-gray-400 font-bold">
                  <div className="flex items-center gap-2">
                    <div className="w-8 h-8 bg-gray-100 rounded-full flex items-center justify-center text-gray-500">
                      <UserIcon size={14} />
                    </div>
                    <span>{blog.author}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Calendar size={16} />
                    <span>{new Date(blog.createdAt).toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}</span>
                  </div>
                  <div className="flex items-center gap-2 text-primary-500">
                    <Clock size={16} />
                    <span>{blog.readTimeText || `${blog.readTime || 5} min read`}</span>
                  </div>
                </div>
              </div>

              <div className="relative rounded-[3rem] overflow-hidden shadow-2xl mb-16 aspect-video group bg-gray-200">
                <img 
                  src={blog.image} 
                  alt={blog.imageAlt || blog.title} 
                  loading="lazy"
                  className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                />
                {blog.videoUrl && (
                  <div className="absolute inset-0 bg-black/30 flex items-center justify-center group-hover:bg-black/40 transition-colors">
                    <a 
                      href={blog.videoUrl} 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="w-24 h-24 bg-white/20 backdrop-blur-md rounded-full flex items-center justify-center text-white border-2 border-white/30 hover:scale-110 hover:bg-white/30 transition-all shadow-2xl"
                    >
                      <PlayCircle size={48} fill="currentColor" />
                    </a>
                  </div>
                )}
              </div>

              <div className="bg-white rounded-[3.5rem] p-8 md:p-16 shadow-sm border border-gray-50 mb-12">
                <div className="prose prose-xl max-w-none 
                  prose-p:text-gray-600 prose-p:font-bold prose-p:leading-relaxed prose-p:mb-8
                  prose-headings:text-gray-800 prose-headings:font-black prose-headings:mb-6 prose-headings:mt-12
                  prose-h2:text-4xl prose-h3:text-2xl
                  prose-a:text-primary-500 prose-a:no-underline hover:prose-a:underline
                  prose-ul:list-disc prose-ul:pl-6 prose-ul:mb-8
                  prose-li:text-gray-600 prose-li:mb-2 prose-li:font-bold
                  prose-strong:text-gray-800 prose-strong:font-black">
                  <ReactMarkdown 
                    remarkPlugins={[remarkGfm]}
                    components={{
                      h2: ({node, ...props}) => {
                        const id = props.children?.toString().toLowerCase().replace(/[^\w ]+/g, '').replace(/ +/g, '-');
                        return <h2 id={id} {...props} />
                      }
                    }}
                  >
                    {blog.content}
                  </ReactMarkdown>
                </div>
              </div>

              {/* FAQ Section */}
              {blog.faqs?.length > 0 && (
                <div className="bg-white rounded-[3.5rem] p-8 md:p-16 shadow-sm border border-gray-100 mb-12">
                  <h3 className="text-3xl font-black text-gray-800 mb-10 flex items-center gap-3">
                     <HelpCircle className="text-primary-500" size={32} /> Frequently Asked Questions
                  </h3>
                  <div className="space-y-6">
                    {blog.faqs.map((faq: any, i: number) => (
                      <div key={i} className="bg-gray-50 rounded-3xl p-8 border border-gray-100">
                        <h4 className="text-xl font-black text-gray-800 mb-4 flex items-start gap-3">
                           <ChevronRight className="text-primary-500 mt-1 flex-shrink-0" size={20} />
                           {faq.question}
                        </h4>
                        <p className="text-gray-600 font-bold leading-relaxed pl-8">
                          {faq.answer}
                        </p>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Share & Footer */}
              <div className="flex flex-col md:flex-row items-center justify-between gap-8 pt-10 border-t border-gray-100">
                 <div className="flex items-center gap-4">
                    <span className="text-xs font-black text-gray-400 uppercase tracking-widest">Share this magic:</span>
                    <button className="w-10 h-10 rounded-full bg-gray-50 flex items-center justify-center text-gray-400 hover:bg-primary-500 hover:text-white transition-all shadow-sm">
                      <Share2 size={18} />
                    </button>
                    <button 
                      onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
                      className="w-10 h-10 rounded-full bg-gray-50 flex items-center justify-center text-gray-400 hover:bg-primary-500 hover:text-white transition-all shadow-sm"
                    >
                      <ChevronUp size={18} />
                    </button>
                 </div>
                 
                 <Link href="/" className="text-primary-500 font-black uppercase tracking-widest text-xs hover:underline">
                    More Stories →
                 </Link>
              </div>
            </article>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
