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
  Copy, Check, Twitter, Linkedin, X 
} from 'lucide-react';
import Link from 'next/link';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import { useToast } from '@/context/ToastContext';

export default function BlogSlugPage() {
  const { slug } = useParams();
  const router = useRouter();
  const [blog, setBlog] = useState<any>(null);
  const [relatedBlogs, setRelatedBlogs] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [scrollProgress, setScrollProgress] = useState(0);
  const [isVideoModalOpen, setIsVideoModalOpen] = useState(false);
  const [copiedLink, setCopiedLink] = useState(false);
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
              className="absolute top-6 right-6 z-10 p-3 bg-white/10 hover:bg-white/20 rounded-full transition-all text-white backdrop-blur-md border border-white/20"
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

      <main className="pt-24 sm:pt-28 pb-12 sm:pb-20">
        <div className="max-w-7xl mx-auto px-3 sm:px-6">
          <Link href="/blog" className="inline-flex items-center gap-2 text-slate-400 hover:text-primary-600 font-black uppercase tracking-widest text-[10px] sm:text-[11px] mb-6 sm:mb-10 transition-colors group">
            <ArrowLeft size={16} className="group-hover:-translate-x-1 transition-transform" /> Back to All Stories
          </Link>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12">
            
            {/* Left Sticky Table of Contents (3 cols) */}
            <aside className="hidden lg:block lg:col-span-3">
              <div className="sticky top-32 space-y-8">
                {toc.length > 0 && (
                  <div className="bg-white rounded-[2rem] p-6 shadow-sm border border-slate-100">
                    <h4 className="text-[11px] font-black text-slate-400 uppercase tracking-widest mb-4 flex items-center gap-2">
                       <List size={14} className="text-primary-500" /> Table of Contents
                    </h4>
                    <nav className="space-y-3">
                      {toc.map((item: any, i: number) => (
                        <a 
                          key={i} 
                          href={`#${item.id}`}
                          className="block text-xs font-bold text-slate-600 hover:text-primary-600 transition-colors leading-relaxed line-clamp-2"
                        >
                          {item.text}
                        </a>
                      ))}
                    </nav>
                  </div>
                )}
                
                <div className="bg-gradient-to-br from-primary-600 to-indigo-700 rounded-[2rem] p-6 text-white shadow-xl">
                   <Sparkles className="mb-3 text-yellow-300" size={28} />
                   <h4 className="text-lg font-black mb-2">Explore Ruzann Courses</h4>
                   <p className="text-xs font-medium text-white/80 mb-6 leading-relaxed">Level up coding, AI, and robotics skills with our live interactive classes.</p>
                   <Link href="/courses">
                     <button className="w-full bg-white hover:bg-slate-100 text-slate-900 rounded-xl h-11 font-black text-xs uppercase tracking-wider transition-all shadow-md active:scale-95 cursor-pointer">
                       Browse Catalog
                     </button>
                   </Link>
                </div>
              </div>
            </aside>

            {/* Main Content Article (9 cols) */}
            <article className="lg:col-span-9 max-w-4xl mx-auto lg:mx-0 w-full">
              
              {/* Mobile Table of Contents Dropdown */}
              {toc.length > 0 && (
                <details className="lg:hidden bg-white rounded-2xl p-4 mb-6 border border-slate-200 shadow-sm group">
                  <summary className="font-black text-xs uppercase tracking-wider text-slate-800 flex items-center justify-between cursor-pointer list-none">
                    <span className="flex items-center gap-2">
                      <List size={14} className="text-primary-500" /> Jump to Section ({toc.length})
                    </span>
                    <ChevronRight size={16} className="text-slate-400 group-open:rotate-90 transition-transform" />
                  </summary>
                  <nav className="mt-3 pt-3 border-t border-slate-100 space-y-2.5">
                    {toc.map((item: any, i: number) => (
                      <a 
                        key={i} 
                        href={`#${item.id}`}
                        className="block text-xs font-bold text-slate-600 hover:text-primary-600 transition-colors"
                      >
                        • {item.text}
                      </a>
                    ))}
                  </nav>
                </details>
              )}

              <div className="mb-6 sm:mb-10">
                <div className="flex items-center gap-2.5 mb-4 sm:mb-6">
                  <span className="px-3.5 sm:px-5 py-1 sm:py-1.5 bg-primary-100 text-primary-700 rounded-full text-[10px] sm:text-xs font-black uppercase tracking-widest border border-primary-200 shadow-sm">
                    {blog.category || 'General'}
                  </span>
                  {!blog.isPublished && (
                    <span className="bg-amber-500 text-white px-2.5 py-1 rounded-full text-[10px] font-black uppercase">
                      Draft
                    </span>
                  )}
                </div>

                <h1 className="text-2xl sm:text-4xl md:text-6xl font-black text-slate-900 mb-6 sm:mb-8 leading-snug sm:leading-[1.15] tracking-tight">
                  {blog.title}
                </h1>
                
                <div className="flex flex-wrap items-center gap-4 sm:gap-6 text-[11px] sm:text-xs text-slate-500 font-bold border-y border-slate-200 py-3 sm:py-4">
                  <div className="flex items-center gap-2">
                    <div className="w-7 sm:w-8 h-7 sm:h-8 rounded-full bg-primary-100 text-primary-700 flex items-center justify-center font-black">
                      <UserIcon size={12} />
                    </div>
                    <span className="text-slate-800">{blog.author || 'Ruzann Team'}</span>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <Calendar size={14} className="text-slate-400" />
                    <span>{new Date(blog.createdAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}</span>
                  </div>
                  <div className="flex items-center gap-1.5 text-primary-600">
                    <Clock size={14} />
                    <span>{blog.readTimeText || `${blog.readingTime || 5} min read`}</span>
                  </div>
                </div>
              </div>

              {/* Featured Cover Image / Video Banner */}
              <div className="relative rounded-[2.5rem] overflow-hidden shadow-xl mb-12 aspect-video group bg-slate-100 border border-slate-200">
                <img 
                  src={blog.image || "/blog_post_coding_kids_1774005427109.png"} 
                  alt={blog.imageAlt || blog.title} 
                  className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                />
                {blog.videoUrl && (
                  <div className="absolute inset-0 bg-black/35 flex items-center justify-center group-hover:bg-black/45 transition-colors">
                    <button 
                      onClick={() => setIsVideoModalOpen(true)}
                      className="w-20 h-20 bg-white/25 backdrop-blur-md rounded-full flex items-center justify-center text-white border-2 border-white/40 hover:scale-110 hover:bg-white/35 transition-all shadow-2xl"
                    >
                      <PlayCircle size={44} fill="currentColor" />
                    </button>
                  </div>
                )}
              </div>

              {/* Excerpt Lead */}
              {blog.excerpt && (
                <div className="p-8 rounded-3xl bg-primary-50/50 border border-primary-100 mb-10 text-slate-700 font-medium text-lg leading-relaxed italic">
                  "{blog.excerpt}"
                </div>
              )}

              {/* Markdown Rendered Content */}
              <div className="bg-white rounded-[2.5rem] p-8 sm:p-14 shadow-sm border border-slate-100 mb-12">
                <div className="prose prose-lg sm:prose-xl max-w-none 
                  prose-p:text-slate-600 prose-p:font-normal prose-p:leading-relaxed prose-p:mb-6
                  prose-headings:text-slate-900 prose-headings:font-black prose-headings:mb-4 prose-headings:mt-10
                  prose-h2:text-3xl prose-h3:text-2xl
                  prose-a:text-primary-600 prose-a:font-bold prose-a:no-underline hover:prose-a:underline
                  prose-ul:list-disc prose-ul:pl-6 prose-ul:mb-6
                  prose-li:text-slate-600 prose-li:mb-2
                  prose-strong:text-slate-900 prose-strong:font-black">
                  <ReactMarkdown 
                    remarkPlugins={[remarkGfm]}
                    components={{
                      h2: ({node, ...props}) => {
                        const id = props.children?.toString().toLowerCase().replace(/[^\w ]+/g, '').replace(/ +/g, '-');
                        return <h2 id={id} className="scroll-mt-36" {...props} />
                      }
                    }}
                  >
                    {blog.content}
                  </ReactMarkdown>
                </div>
              </div>

              {/* FAQ Accordion Section */}
              {blog.faqs?.length > 0 && (
                <div className="bg-white rounded-[2.5rem] p-8 sm:p-12 shadow-sm border border-slate-100 mb-12">
                  <h3 className="text-2xl font-black text-slate-900 mb-8 flex items-center gap-3">
                     <HelpCircle className="text-primary-500" size={28} /> Frequently Asked Questions
                  </h3>
                  <div className="space-y-4">
                    {blog.faqs.map((faq: any, i: number) => (
                      <div key={i} className="bg-slate-50 rounded-2xl p-6 border border-slate-100">
                        <h4 className="text-lg font-black text-slate-800 mb-2 flex items-start gap-2">
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

              {/* Interactive Share Toolbar */}
              <div className="flex flex-col sm:flex-row items-center justify-between gap-6 py-8 border-t border-slate-200">
                 <div className="flex items-center gap-3">
                    <span className="text-xs font-black text-slate-400 uppercase tracking-widest">Share Article:</span>
                    <button 
                      onClick={handleCopyLink}
                      className="flex items-center gap-1.5 px-4 py-2 rounded-full bg-slate-100 hover:bg-primary-50 hover:text-primary-600 transition-colors text-xs font-bold text-slate-700"
                    >
                      {copiedLink ? <Check size={14} className="text-green-500" /> : <Copy size={14} />}
                      {copiedLink ? 'Copied!' : 'Copy Link'}
                    </button>
                    <a
                      href={`https://twitter.com/intent/tweet?text=${encodeURIComponent(blog.title)}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="p-2.5 rounded-full bg-slate-100 hover:bg-sky-50 hover:text-sky-500 transition-colors text-slate-600"
                    >
                      <Twitter size={16} />
                    </a>
                    <a
                      href={`https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(typeof window !== 'undefined' ? window.location.href : '')}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="p-2.5 rounded-full bg-slate-100 hover:bg-blue-50 hover:text-blue-600 transition-colors text-slate-600"
                    >
                      <Linkedin size={16} />
                    </a>
                 </div>
                 
                 <button 
                   onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
                   className="inline-flex items-center gap-2 text-slate-400 hover:text-primary-600 font-black text-xs uppercase tracking-widest"
                 >
                   Back to Top <ChevronUp size={16} />
                 </button>
              </div>

              {/* Related Stories Grid */}
              {relatedBlogs.length > 0 && (
                <div className="mt-16 pt-12 border-t border-slate-200">
                  <h3 className="text-2xl font-black text-slate-900 mb-8">Related Stories</h3>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    {relatedBlogs.map((post: any) => (
                      <Link key={post._id} href={`/blog/${post.slug || post._id}`}>
                        <Card className="h-full border border-slate-100 rounded-2xl overflow-hidden hover:border-primary-300 hover:shadow-lg transition-all group bg-white">
                          <div className="aspect-[16/10] overflow-hidden bg-slate-100">
                            <img src={post.image || "/blog_post_coding_kids_1774005427109.png"} alt={post.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                          </div>
                          <CardContent className="p-4">
                            <span className="text-[10px] font-black text-primary-600 uppercase">{post.category}</span>
                            <h4 className="font-black text-sm text-slate-900 line-clamp-2 mt-1 group-hover:text-primary-600 transition-colors">{post.title}</h4>
                          </CardContent>
                        </Card>
                      </Link>
                    ))}
                  </div>
                </div>
              )}

            </article>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
