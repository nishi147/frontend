"use client";

import React, { useEffect, useState, useMemo } from 'react';
import { Header } from '@/components/layout/Header';
import { Footer } from '@/components/layout/Footer';
import { Button } from '@/components/ui/Button';
import { Card, CardContent } from '@/components/ui/Card';
import api from '@/utils/api';
import { useParams, useRouter } from 'next/navigation';
import { 
  Clock, User as UserIcon, Calendar, ArrowLeft, Share2, PlayCircle, 
  BookOpen, List, HelpCircle, ChevronRight, Sparkles, ChevronUp, 
  Copy, Check, Twitter, Linkedin, X, Bookmark, Lightbulb
} from 'lucide-react';
import Link from 'next/link';
import { useToast } from '@/context/ToastContext';
import { ArticleContentRenderer, TocItem } from '@/components/blog/ArticleContentRenderer';

export default function BlogSlugPage() {
  const { slug } = useParams();
  const router = useRouter();
  const [blog, setBlog] = useState<any>(null);
  const [relatedBlogs, setRelatedBlogs] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [scrollProgress, setScrollProgress] = useState(0);
  const [isVideoModalOpen, setIsVideoModalOpen] = useState(false);
  const [copiedLink, setCopiedLink] = useState(false);
  const [toc, setToc] = useState<TocItem[]>([]);
  const { showToast } = useToast();

  useEffect(() => {
    const handleScroll = () => {
      const totalHeight = document.documentElement.scrollHeight - window.innerHeight;
      if (totalHeight > 0) {
        const currentProgress = (window.scrollY / totalHeight) * 100;
        setScrollProgress(currentProgress);
      }
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    const fetchBlogAndRelated = async () => {
      try {
        setLoading(true);
        const res = await api.get(`/api/blogs/${slug}`);
        if (res.data.success) {
          const blogData = res.data.data;
          if (blogData.slug && slug !== blogData.slug) {
            router.replace(`/blog/${blogData.slug}`);
            return;
          }
          setBlog(blogData);

          // Fetch all blogs to get related ones
          const allRes = await api.get('/api/blogs');
          if (allRes.data.success) {
            const otherBlogs = allRes.data.data.filter(
              (b: any) => b.isPublished !== false && b._id !== blogData._id
            );
            // Match same category or pick top 3
            const matching = otherBlogs.filter((b: any) => b.category === blogData.category);
            const finalRelated = matching.length >= 3 ? matching.slice(0, 3) : otherBlogs.slice(0, 3);
            setRelatedBlogs(finalRelated);
          }
        }
      } catch (e) {
        console.error("Error fetching blog:", e);
      } finally {
        setLoading(false);
      }
    };
    fetchBlogAndRelated();
    window.scrollTo(0, 0);
  }, [slug, router]);

  const handleCopyLink = () => {
    if (typeof window !== 'undefined') {
      navigator.clipboard.writeText(window.location.href);
      setCopiedLink(true);
      showToast("Article link copied to clipboard!", "success");
      setTimeout(() => setCopiedLink(false), 2000);
    }
  };

  if (loading) return (
    <div className="min-h-screen bg-white flex items-center justify-center">
      <div className="flex flex-col items-center gap-4">
        <div className="w-16 h-16 border-4 border-primary-100 border-t-primary-500 rounded-full animate-spin" />
        <p className="font-black text-slate-400 animate-pulse uppercase tracking-widest text-xs">Preparing story...</p>
      </div>
    </div>
  );
  
  if (!blog) return (
    <div className="min-h-screen bg-slate-50 flex flex-col items-center justify-center p-4 text-center font-sans">
       <div className="text-8xl mb-6">📖</div>
       <h1 className="text-4xl font-black text-slate-800 mb-3">Story Not Found</h1>
       <p className="text-slate-500 font-bold mb-8 max-w-md">This article may have been moved or unpublished.</p>
       <Button onClick={() => router.push('/blog')} className="rounded-2xl h-14 px-8 font-black bg-primary-600 hover:bg-primary-700 text-white">Back to All Stories</Button>
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
      "name": blog.author || "Ruzann"
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
    <div className="min-h-screen bg-[#F8FAFC] font-sans selection:bg-primary-500 selection:text-white">
      {/* Scroll Reading Progress Bar */}
      <div 
        className="fixed top-0 left-0 h-1.5 bg-gradient-to-r from-primary-500 to-secondary-500 z-[100] transition-all duration-150"
        style={{ width: `${scrollProgress}%` }}
      />

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
      
      {/* Video Modal */}
      {isVideoModalOpen && blog.videoUrl && (
        <div className="fixed inset-0 z-[10000] flex items-center justify-center p-4 bg-black/90 backdrop-blur-md animate-in fade-in duration-300">
          <div className="relative w-full max-w-4xl aspect-video bg-black rounded-3xl overflow-hidden shadow-2xl">
            <button 
              onClick={() => setIsVideoModalOpen(false)}
              className="absolute top-6 right-6 z-10 p-3 bg-white/10 hover:bg-white/20 rounded-full transition-all text-white backdrop-blur-md border border-white/20 cursor-pointer"
            >
              <X className="w-6 h-6" />
            </button>
            <div className="w-full h-full flex items-center justify-center">
              {blog.videoUrl.includes('youtube.com') || blog.videoUrl.includes('youtu.be') ? (
                <iframe
                  src={blog.videoUrl.replace('watch?v=', 'embed/')}
                  className="w-full h-full"
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                  allowFullScreen
                />
              ) : (
                <video src={blog.videoUrl} controls autoPlay className="w-full h-full object-contain" />
              )}
            </div>
          </div>
        </div>
      )}

      <main className="pt-24 sm:pt-28 pb-16 sm:pb-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          
          {/* Top Breadcrumb Navigation */}
          <Link href="/blog" className="inline-flex items-center gap-2 text-slate-400 hover:text-primary-600 font-black uppercase tracking-widest text-[10px] sm:text-[11px] mb-6 sm:mb-8 transition-colors group">
            <ArrowLeft size={16} className="group-hover:-translate-x-1 transition-transform" /> Back to All Stories
          </Link>

          {/* ARTICLE HEADER (Full width centered) */}
          <header className="max-w-4xl mx-auto text-left mb-8 sm:mb-12">
            <div className="flex items-center gap-2.5 mb-4 sm:mb-5">
              <span className="px-4 py-1.5 bg-primary-100/80 text-primary-700 rounded-full text-xs font-black uppercase tracking-widest border border-primary-200/60 shadow-sm">
                {blog.category || 'General'}
              </span>
              {!blog.isPublished && (
                <span className="bg-amber-500 text-white px-3 py-1 rounded-full text-[10px] font-black uppercase">
                  Draft
                </span>
              )}
            </div>

            <h1 className="text-3xl sm:text-5xl md:text-6xl font-black text-slate-900 mb-5 sm:mb-6 leading-[1.15] tracking-tight">
              {blog.title}
            </h1>
            
            {blog.excerpt && (
              <p className="text-lg sm:text-xl text-slate-600 font-medium leading-relaxed mb-6 sm:mb-8">
                {blog.excerpt}
              </p>
            )}

            <div className="flex flex-wrap items-center justify-between gap-4 border-y border-slate-200/80 py-4">
              <div className="flex items-center gap-5 text-xs text-slate-500 font-bold">
                <div className="flex items-center gap-2.5">
                  <div className="w-8 h-8 rounded-full bg-primary-50 text-primary-600 flex items-center justify-center font-black border border-primary-200/60">
                    <UserIcon size={14} />
                  </div>
                  <span className="text-slate-800 font-extrabold">{blog.author || 'Ruzann Team'}</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <Calendar size={14} className="text-slate-400" />
                  <span>{new Date(blog.createdAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}</span>
                </div>
                <div className="flex items-center gap-1.5 text-primary-600 font-extrabold bg-primary-50 px-3 py-1 rounded-full border border-primary-100">
                  <Clock size={14} />
                  <span>{blog.readTimeText || `${blog.readingTime || 5} min read`}</span>
                </div>
              </div>

              {/* Quick Share Pills */}
              <div className="flex items-center gap-2">
                <button 
                  onClick={handleCopyLink}
                  className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-slate-100 hover:bg-primary-50 hover:text-primary-600 transition-colors text-xs font-bold text-slate-600 cursor-pointer"
                  title="Copy link"
                >
                  {copiedLink ? <Check size={14} className="text-green-500" /> : <Copy size={14} />}
                  <span>{copiedLink ? 'Copied' : 'Share'}</span>
                </button>
              </div>
            </div>
          </header>

          {/* Featured Cover Image / Video Banner */}
          <div className="max-w-4xl mx-auto relative rounded-2xl sm:rounded-3xl overflow-hidden shadow-lg mb-10 sm:mb-14 aspect-[16/9] md:aspect-[21/9] group bg-slate-100 border border-slate-200/80">
            <img 
              src={blog.image || "/blog_post_coding_kids_1774005427109.png"} 
              alt={blog.imageAlt || blog.title} 
              className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
            />
            {blog.videoUrl && (
              <div className="absolute inset-0 bg-black/30 flex items-center justify-center group-hover:bg-black/40 transition-colors">
                <button 
                  onClick={() => setIsVideoModalOpen(true)}
                  className="w-20 h-20 bg-white/25 backdrop-blur-md rounded-full flex items-center justify-center text-white border-2 border-white/40 hover:scale-110 hover:bg-white/35 transition-all shadow-2xl cursor-pointer"
                >
                  <PlayCircle size={44} fill="currentColor" />
                </button>
              </div>
            )}
          </div>

          {/* MAIN TWO-COLUMN CONTAINER (Article + Sidebar) */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-14 items-start">
            
            {/* ARTICLE BODY (8 cols desktop, full width mobile) */}
            <main className="lg:col-span-8 w-full max-w-[760px] mx-auto lg:mx-0">
              
              {/* Mobile Collapsible Table of Contents */}
              {toc.length > 0 && (
                <details className="lg:hidden bg-white rounded-2xl p-4 mb-8 border border-slate-200 shadow-sm group">
                  <summary className="font-black text-xs uppercase tracking-wider text-slate-800 flex items-center justify-between cursor-pointer list-none">
                    <span className="flex items-center gap-2">
                      <List size={14} className="text-primary-500" /> Table of Contents ({toc.length} sections)
                    </span>
                    <ChevronRight size={16} className="text-slate-400 group-open:rotate-90 transition-transform" />
                  </summary>
                  <nav className="mt-3 pt-3 border-t border-slate-100 space-y-2.5">
                    {toc.map((item: TocItem, i: number) => (
                      <a 
                        key={i} 
                        href={`#${item.id}`}
                        className={`block text-xs font-bold hover:text-primary-600 transition-colors ${item.level === 3 ? 'pl-4 text-slate-500' : 'text-slate-700'}`}
                      >
                        • {item.text}
                      </a>
                    ))}
                  </nav>
                </details>
              )}

              {/* ARTICLE BODY CONTENT (Clean background, NO giant cards) */}
              <div className="w-full">
                <ArticleContentRenderer 
                  content={blog.content} 
                  onHeadingsExtracted={(extracted) => setToc(extracted)}
                />
              </div>

              {/* FAQ Accordion Section */}
              {blog.faqs?.length > 0 && (
                <div className="mt-14 pt-10 border-t border-slate-200/80">
                  <h3 className="text-2xl font-black text-slate-900 mb-6 flex items-center gap-3">
                     <HelpCircle className="text-primary-500" size={26} /> Frequently Asked Questions
                  </h3>
                  <div className="space-y-4">
                    {blog.faqs.map((faq: any, i: number) => (
                      <div key={i} className="bg-white rounded-2xl p-6 border border-slate-200/80 shadow-sm">
                        <h4 className="text-base sm:text-lg font-black text-slate-800 mb-2 flex items-start gap-2">
                           <ChevronRight className="text-primary-500 mt-1 flex-shrink-0" size={18} />
                           {faq.question}
                        </h4>
                        <p className="text-slate-600 font-medium text-sm leading-relaxed pl-6">
                          {faq.answer}
                        </p>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Share & Footer Bar */}
              <div className="mt-12 pt-8 border-t border-slate-200/80 flex flex-col sm:flex-row items-center justify-between gap-6">
                 <div className="flex items-center gap-3">
                    <span className="text-xs font-black text-slate-400 uppercase tracking-widest">Share Article:</span>
                    <button 
                      onClick={handleCopyLink}
                      className="flex items-center gap-1.5 px-4 py-2 rounded-full bg-slate-100 hover:bg-primary-50 hover:text-primary-600 transition-colors text-xs font-bold text-slate-700 cursor-pointer"
                    >
                      {copiedLink ? <Check size={14} className="text-green-500" /> : <Copy size={14} />}
                      {copiedLink ? 'Copied!' : 'Copy Link'}
                    </button>
                    <a
                      href={`https://twitter.com/intent/tweet?text=${encodeURIComponent(blog.title)}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="p-2.5 rounded-full bg-slate-100 hover:bg-sky-50 hover:text-sky-500 transition-colors text-slate-600"
                      title="Share on X / Twitter"
                    >
                      <Twitter size={16} />
                    </a>
                    <a
                      href={`https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(typeof window !== 'undefined' ? window.location.href : '')}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="p-2.5 rounded-full bg-slate-100 hover:bg-blue-50 hover:text-blue-600 transition-colors text-slate-600"
                      title="Share on LinkedIn"
                    >
                      <Linkedin size={16} />
                    </a>
                 </div>
                 
                 <button 
                   onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
                   className="inline-flex items-center gap-2 text-slate-400 hover:text-primary-600 font-black text-xs uppercase tracking-widest cursor-pointer transition-colors"
                 >
                   Back to Top <ChevronUp size={16} />
                 </button>
              </div>

              {/* Related Stories / Read Next */}
              {relatedBlogs.length > 0 && (
                <div className="mt-16 pt-10 border-t border-slate-200/80">
                  <div className="flex items-center justify-between mb-8">
                    <h3 className="text-2xl font-black text-slate-900">Read Next</h3>
                    <Link href="/blog" className="text-xs font-black uppercase text-primary-600 hover:underline">
                      See All Stories &rarr;
                    </Link>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
                    {relatedBlogs.map((post: any) => (
                      <Link key={post._id} href={`/blog/${post.slug || post._id}`}>
                        <Card className="h-full border border-slate-200/80 rounded-2xl overflow-hidden hover:border-primary-300 hover:shadow-lg transition-all group bg-white flex flex-col">
                          <div className="aspect-[16/10] overflow-hidden bg-slate-100">
                            <img 
                              src={post.image || "/blog_post_coding_kids_1774005427109.png"} 
                              alt={post.title} 
                              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" 
                            />
                          </div>
                          <CardContent className="p-4 flex-1 flex flex-col justify-between">
                            <div>
                              <span className="text-[10px] font-black text-primary-600 uppercase">{post.category || 'General'}</span>
                              <h4 className="font-black text-sm text-slate-900 line-clamp-2 mt-1 group-hover:text-primary-600 transition-colors leading-snug">
                                {post.title}
                              </h4>
                            </div>
                            <p className="text-[11px] font-bold text-slate-400 mt-3">
                              {post.readTimeText || `${post.readingTime || 5} min read`}
                            </p>
                          </CardContent>
                        </Card>
                      </Link>
                    ))}
                  </div>
                </div>
              )}

            </main>

            {/* STICKY RIGHT SIDEBAR (4 cols desktop, hidden mobile) */}
            <aside className="hidden lg:block lg:col-span-4 sticky top-28 space-y-8">
              
              {/* Table of Contents Widget */}
              {toc.length > 0 && (
                <div className="bg-white rounded-3xl p-6 shadow-sm border border-slate-200/80">
                  <h4 className="text-xs font-black text-slate-400 uppercase tracking-widest mb-4 flex items-center gap-2">
                     <List size={14} className="text-primary-500" /> In This Article
                  </h4>
                  <nav className="space-y-2.5 max-h-[360px] overflow-y-auto pr-2 [scrollbar-width:thin]">
                    {toc.map((item: TocItem, i: number) => (
                      <a 
                        key={i} 
                        href={`#${item.id}`}
                        className={`block text-xs font-bold transition-colors leading-relaxed line-clamp-2 ${
                          item.level === 3 
                            ? 'pl-3 text-slate-500 hover:text-primary-600' 
                            : 'text-slate-700 hover:text-primary-600'
                        }`}
                      >
                        {item.text}
                      </a>
                    ))}
                  </nav>
                </div>
              )}

              {/* Ruzann Course Promotion CTA */}
              <div className="bg-gradient-to-br from-primary-600 via-indigo-600 to-indigo-800 rounded-3xl p-7 text-white shadow-xl relative overflow-hidden">
                 <div className="absolute -top-10 -right-10 w-32 h-32 bg-white/10 rounded-full blur-2xl pointer-events-none" />
                 <Sparkles className="mb-3 text-yellow-300" size={28} />
                 <h4 className="text-xl font-black mb-2">Empower Your Child with AI & Coding</h4>
                 <p className="text-xs font-medium text-white/80 mb-6 leading-relaxed">
                   Join live 1-on-1 and small group classes led by expert tech mentors at Ruzann.
                 </p>
                 <Link href="/courses">
                   <button className="w-full bg-white hover:bg-slate-100 text-slate-900 rounded-xl h-11 font-black text-xs uppercase tracking-wider transition-all shadow-md active:scale-95 cursor-pointer">
                     Explore Live Courses
                   </button>
                 </Link>
              </div>

              {/* Quick Author Bio */}
              <div className="bg-white rounded-3xl p-6 shadow-sm border border-slate-200/80">
                <div className="flex items-center gap-3 mb-3">
                  <div className="w-10 h-10 rounded-full bg-primary-100 text-primary-700 flex items-center justify-center font-black">
                    <UserIcon size={18} />
                  </div>
                  <div>
                    <h5 className="font-black text-sm text-slate-900">{blog.author || 'Ruzann Editorial'}</h5>
                    <p className="text-[11px] text-slate-400 font-medium">STEM & EdTech Insights</p>
                  </div>
                </div>
                <p className="text-xs text-slate-600 font-medium leading-relaxed">
                  Curated content helping young minds and parents navigate coding, robotics, and artificial intelligence.
                </p>
              </div>

            </aside>

          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
