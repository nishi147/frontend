"use client";

import React, { useState, useEffect, useMemo } from 'react';
import { Header } from '@/components/layout/Header';
import { Footer } from '@/components/layout/Footer';
import { Card, CardContent } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import Link from 'next/link';
import api from '@/utils/api';
import { 
  Search, Sparkles, Clock, User, Calendar, ArrowRight, 
  BookOpen, Mail, CheckCircle2, X, SlidersHorizontal, Play, Share2, TrendingUp 
} from 'lucide-react';
import { useToast } from '@/context/ToastContext';

const colorGradients = [
  "from-blue-500 to-indigo-600",
  "from-purple-500 to-pink-600",
  "from-emerald-500 to-teal-600",
  "from-amber-500 to-orange-600",
  "from-rose-500 to-red-600",
  "from-cyan-500 to-blue-600"
];

const categories = ["All", "Coding", "Robotics", "AI & ML", "Parenting", "Unboxed", "STEM"];

export default function BlogPage() {
  const [blogs, setBlogs] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeCategory, setActiveCategory] = useState('All');
  const [searchQuery, setSearchQuery] = useState('');
  const [sortBy, setSortBy] = useState<'newest' | 'oldest' | 'readTime'>('newest');
  
  // Newsletter state
  const [newsletterEmail, setNewsletterEmail] = useState('');
  const [newsletterSubscribed, setNewsletterSubscribed] = useState(false);
  const { showToast } = useToast();

  useEffect(() => {
    const fetchBlogs = async () => {
      try {
        const res = await api.get('/api/blogs');
        if (res.data.success) {
          const published = res.data.data.filter((b: any) => b.isPublished !== false);
          setBlogs(published);
        }
      } catch (e) {
        console.error("Error fetching blogs:", e);
      } finally {
        setLoading(false);
      }
    };
    fetchBlogs();
  }, []);

  // Filter and Sort Blogs
  const filteredAndSortedBlogs = useMemo(() => {
    let result = blogs.filter((blog: any) => {
      const matchesCategory = activeCategory === 'All' || blog.category === activeCategory;
      const matchesSearch = 
        blog.title?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        blog.excerpt?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        (Array.isArray(blog.keywords) && blog.keywords.some((k: string) => k.toLowerCase().includes(searchQuery.toLowerCase())));
      return matchesCategory && matchesSearch;
    });

    if (sortBy === 'newest') {
      result.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
    } else if (sortBy === 'oldest') {
      result.sort((a, b) => new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime());
    } else if (sortBy === 'readTime') {
      result.sort((a, b) => (a.readingTime || 5) - (b.readingTime || 5));
    }

    return result;
  }, [blogs, activeCategory, searchQuery, sortBy]);

  // Featured Post
  const featuredPost = filteredAndSortedBlogs.length > 0 ? filteredAndSortedBlogs[0] : null;
  const remainingBlogs = filteredAndSortedBlogs.length > 0 ? filteredAndSortedBlogs.slice(1) : [];

  const handleNewsletterSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newsletterEmail || !newsletterEmail.includes('@')) {
      showToast("Please enter a valid email address", "error");
      return;
    }
    setNewsletterSubscribed(true);
    showToast("Subscribed to Ruzann Insights!", "success");
    setNewsletterEmail('');
  };

  return (
    <div className="min-h-screen bg-[#F8FAFC] flex flex-col font-sans selection:bg-primary-500 selection:text-white">
      <Header />
      
      {/* Hero Header */}
      <section className="relative pt-24 sm:pt-28 pb-12 sm:pb-16 px-4 overflow-hidden bg-gradient-to-br from-gray-900 via-primary-950 to-slate-900 text-white">
        <div className="absolute top-0 left-1/4 w-72 sm:w-96 h-72 sm:h-96 bg-primary-500/20 rounded-full blur-3xl animate-pulse" />
        <div className="absolute bottom-0 right-1/4 w-72 sm:w-96 h-72 sm:h-96 bg-secondary-500/20 rounded-full blur-3xl animate-pulse delay-700" />
        
        <div className="max-w-7xl mx-auto relative z-10">
          <div className="max-w-3xl">
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 bg-white/10 backdrop-blur-md rounded-full border border-white/15 text-primary-300 text-[10px] sm:text-xs font-black uppercase tracking-widest mb-4 sm:mb-6">
              <Sparkles size={14} className="text-yellow-400" /> RUZANN EDUCATION INSIGHTS
            </div>
            <h1 className="text-3xl sm:text-6xl md:text-7xl font-black tracking-tight leading-tight sm:leading-none mb-4 sm:mb-6">
              Stories that <span className="bg-gradient-to-r from-primary-400 via-teal-300 to-secondary-400 bg-clip-text text-transparent">Empower</span> Young Minds.
            </h1>
            <p className="text-sm sm:text-xl font-medium text-slate-300 max-w-2xl leading-relaxed mb-4 sm:mb-8">
              Explore cutting-edge STEM guides, parenting insights, coding blueprints, and tech innovations.
            </p>
          </div>
        </div>
      </section>

      {/* Featured Article Spotlight */}
      {!loading && featuredPost && (
        <section className="max-w-7xl mx-auto px-3 sm:px-4 -mt-6 sm:-mt-10 relative z-20 w-full mb-8 sm:mb-12">
          <Link href={`/blog/${featuredPost.slug || featuredPost._id}`} className="group block">
            <div className="bg-white rounded-[2rem] sm:rounded-[2.5rem] p-4 sm:p-8 md:p-10 shadow-xl border border-slate-100 hover:shadow-2xl transition-all duration-500 grid grid-cols-1 lg:grid-cols-12 gap-6 sm:gap-8 items-center overflow-hidden">
              <div className="lg:col-span-7 relative h-52 sm:h-80 md:h-96 rounded-2xl sm:rounded-[2rem] overflow-hidden bg-slate-100">
                {featuredPost.image ? (
                  <img 
                    src={featuredPost.image} 
                    alt={featuredPost.title} 
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                  />
                ) : (
                  <div className={`w-full h-full bg-gradient-to-br ${colorGradients[0]} flex items-center justify-center text-6xl sm:text-8xl`}>
                    🚀
                  </div>
                )}
                <div className="absolute top-4 sm:top-6 left-4 sm:left-6 flex items-center gap-2">
                  <span className="px-3 sm:px-4 py-1 sm:py-1.5 bg-primary-600 text-white rounded-full text-[10px] sm:text-xs font-black uppercase tracking-widest shadow-md">
                    Featured
                  </span>
                  {featuredPost.videoUrl && (
                    <span className="px-2.5 sm:px-3 py-1 sm:py-1.5 bg-secondary-500 text-white rounded-full text-[10px] sm:text-xs font-black uppercase tracking-widest shadow-md flex items-center gap-1">
                      <Play size={10} fill="currentColor" /> Video
                    </span>
                  )}
                </div>
              </div>

              <div className="lg:col-span-5 flex flex-col justify-center px-1 sm:px-0">
                <div className="flex items-center gap-2 sm:gap-3 text-[10px] sm:text-xs font-black uppercase tracking-widest text-primary-600 mb-2 sm:mb-4">
                  <span>{featuredPost.category || 'General'}</span>
                  <span className="w-1.5 h-1.5 rounded-full bg-primary-300" />
                  <span className="text-slate-400">
                    {new Date(featuredPost.createdAt || Date.now()).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
                  </span>
                </div>

                <h2 className="text-xl sm:text-3xl md:text-4xl font-black text-slate-900 group-hover:text-primary-600 transition-colors leading-snug sm:leading-tight mb-3 sm:mb-4">
                  {featuredPost.title}
                </h2>

                <p className="text-slate-600 font-medium text-xs sm:text-base line-clamp-2 sm:line-clamp-3 mb-4 sm:mb-6 leading-relaxed">
                  {featuredPost.excerpt}
                </p>

                <div className="flex items-center justify-between pt-3 sm:pt-4 border-t border-slate-100">
                  <div className="flex items-center gap-2.5">
                    <div className="w-8 sm:w-9 h-8 sm:h-9 rounded-full bg-primary-50 text-primary-600 flex items-center justify-center font-black text-xs sm:text-sm">
                      <User size={14} />
                    </div>
                    <div className="text-[10px] sm:text-xs">
                      <p className="font-black text-slate-800">{featuredPost.author || 'Ruzann Team'}</p>
                      <p className="text-slate-400 font-medium">{featuredPost.readTimeText || `${featuredPost.readingTime || 5} min read`}</p>
                    </div>
                  </div>

                  <span className="inline-flex items-center gap-1.5 text-primary-600 font-black text-[11px] sm:text-xs uppercase tracking-widest group-hover:translate-x-1 transition-transform">
                    Read <ArrowRight size={14} />
                  </span>
                </div>
              </div>
            </div>
          </Link>
        </section>
      )}

      {/* Modern Responsive Sticky Toolbar */}
      <section className="sticky top-[4rem] z-30 bg-white/95 backdrop-blur-md border-y border-slate-200 shadow-sm py-3 px-3 sm:px-4 transition-all">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3">
          
          {/* Category Tabs with Hidden Scrollbar */}
          <div className="flex gap-2 overflow-x-auto w-full sm:w-auto pb-1 sm:pb-0 [scrollbar-width:none] [-ms-overflow-style:none] [&::-webkit-scrollbar]:hidden">
            {categories.map((cat) => (
              <button
                key={cat}
                onClick={() => setActiveCategory(cat)}
                className={`whitespace-nowrap px-4 sm:px-6 py-2 sm:py-2.5 rounded-full font-black text-[11px] sm:text-xs uppercase tracking-wider transition-all duration-300 flex-shrink-0 active:scale-95 ${
                  activeCategory === cat
                    ? 'bg-slate-900 text-white shadow-md'
                    : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>

          {/* Search Bar & Sort Dropdown */}
          <div className="flex items-center gap-2 sm:gap-3 w-full sm:w-auto">
            <div className="relative flex-1 sm:w-64 md:w-72">
              <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" size={16} />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search topics..."
                className="w-full pl-9 pr-8 py-2 bg-slate-100 hover:bg-slate-100/80 focus:bg-white rounded-full border border-slate-200 focus:border-primary-400 outline-none font-bold text-xs text-slate-800 transition-all"
              />
              {searchQuery && (
                <button 
                  onClick={() => setSearchQuery('')}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
                >
                  <X size={14} />
                </button>
              )}
            </div>

            <select
              value={sortBy}
              onChange={(e: any) => setSortBy(e.target.value)}
              className="px-3.5 py-2 bg-slate-100 rounded-full border border-slate-200 font-black text-[11px] sm:text-xs text-slate-700 outline-none cursor-pointer hover:bg-slate-200 transition-all"
            >
              <option value="newest">Latest</option>
              <option value="oldest">Oldest</option>
              <option value="readTime">Fast Read</option>
            </select>
          </div>

        </div>
      </section>

      {/* Main Content Grid & Sidebar */}
      <section className="py-8 sm:py-12 px-3 sm:px-4 flex-1">
        <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-12 gap-8 sm:gap-10">
          
          {/* Articles Grid (8 cols) */}
          <div className="lg:col-span-8">
            {loading ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 sm:gap-8">
                {[1, 2, 4].map((n) => (
                  <div key={n} className="bg-white rounded-3xl p-5 border border-slate-100 animate-pulse space-y-4">
                    <div className="w-full h-44 bg-slate-200 rounded-2xl" />
                    <div className="h-4 bg-slate-200 rounded w-1/3" />
                    <div className="h-6 bg-slate-200 rounded w-3/4" />
                    <div className="h-4 bg-slate-200 rounded w-full" />
                  </div>
                ))}
              </div>
            ) : filteredAndSortedBlogs.length === 0 ? (
              <div className="bg-white rounded-[2rem] sm:rounded-[2.5rem] p-8 sm:p-12 text-center border-2 border-dashed border-slate-200 my-4 sm:my-8">
                <div className="text-5xl sm:text-6xl mb-3">🔍</div>
                <h3 className="text-xl sm:text-2xl font-black text-slate-800 mb-2">No Articles Found</h3>
                <p className="text-slate-500 font-bold text-xs sm:text-sm mb-6">We couldn't find any articles matching your search query or topic.</p>
                <Button 
                  onClick={() => { setActiveCategory('All'); setSearchQuery(''); }}
                  className="rounded-full px-6 py-3 bg-primary-600 text-white font-black text-xs uppercase tracking-widest"
                >
                  Clear Filters & Search
                </Button>
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 sm:gap-8">
                {(searchQuery || activeCategory !== 'All' ? filteredAndSortedBlogs : remainingBlogs).map((post: any, idx: number) => (
                  <Link key={post._id} href={`/blog/${post.slug || post._id}`}>
                    <Card className="h-full border border-slate-100 rounded-[1.8rem] sm:rounded-[2.2rem] overflow-hidden hover:border-primary-300 hover:shadow-xl transition-all duration-300 group bg-white flex flex-col active:scale-[0.99]">
                      <div className="relative aspect-[16/10] overflow-hidden bg-slate-100">
                        {post.image ? (
                          <img 
                            src={post.image} 
                            alt={post.title} 
                            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700" 
                          />
                        ) : (
                          <div className={`w-full h-full bg-gradient-to-br ${colorGradients[idx % colorGradients.length]} flex items-center justify-center text-5xl sm:text-6xl`}>
                            📖
                          </div>
                        )}
                        <div className="absolute top-3.5 left-3.5 flex gap-2">
                          <span className="px-3 py-1 bg-white/90 backdrop-blur-md rounded-full text-[10px] font-black uppercase tracking-wider text-primary-600 shadow-sm">
                            {post.category || 'General'}
                          </span>
                          {post.videoUrl && (
                            <span className="w-6 h-6 bg-secondary-500 text-white rounded-full flex items-center justify-center shadow-md">
                              <Play size={10} fill="currentColor" />
                            </span>
                          )}
                        </div>
                      </div>

                      <CardContent className="p-5 sm:p-6 flex-1 flex flex-col justify-between">
                        <div>
                          <div className="flex items-center gap-2.5 text-[10px] font-black uppercase tracking-wider text-slate-400 mb-2.5">
                            <span className="flex items-center gap-1"><Clock size={12} /> {post.readTimeText || `${post.readingTime || 5} min read`}</span>
                            <span className="w-1 h-1 bg-slate-300 rounded-full" />
                            <span>{new Date(post.createdAt || Date.now()).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}</span>
                          </div>
                          
                          <h3 className="text-lg sm:text-xl font-black text-slate-900 group-hover:text-primary-600 transition-colors leading-snug mb-2.5 line-clamp-2">
                            {post.title}
                          </h3>

                          <p className="text-slate-500 font-medium text-xs leading-relaxed line-clamp-2 sm:line-clamp-3 mb-4">
                            {post.excerpt}
                          </p>
                        </div>

                        <div className="pt-3 border-t border-slate-100 flex items-center justify-between mt-auto">
                          <span className="text-[11px] font-black text-slate-700 flex items-center gap-1.5">
                            <User size={12} className="text-slate-400" /> {post.author || 'Ruzann Team'}
                          </span>
                          <span className="text-primary-600 font-black text-[11px] uppercase tracking-wider group-hover:translate-x-1 transition-transform inline-flex items-center gap-1">
                            Read <ArrowRight size={12} />
                          </span>
                        </div>
                      </CardContent>
                    </Card>
                  </Link>
                ))}
              </div>
            )}
          </div>

          {/* Right Sidebar Widgets */}
          <aside className="lg:col-span-4 space-y-6 sm:space-y-8">
            
            {/* Newsletter Card */}
            <div className="bg-gradient-to-br from-primary-600 to-indigo-700 rounded-[2rem] sm:rounded-[2.5rem] p-6 sm:p-8 text-white shadow-xl relative overflow-hidden">
              <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full blur-2xl pointer-events-none" />
              <div className="relative z-10">
                <div className="w-10 sm:w-12 h-10 sm:h-12 bg-white/10 backdrop-blur-md rounded-2xl flex items-center justify-center text-yellow-300 mb-4 sm:mb-6 border border-white/20">
                  <Mail size={22} />
                </div>
                <h3 className="text-xl sm:text-2xl font-black mb-2 leading-tight">Stay Ahead with Ruzann Insights</h3>
                <p className="text-xs font-medium text-white/80 leading-relaxed mb-5 sm:mb-6">
                  Get weekly educational guides, robotics updates, and tech learning activities delivered straight to your inbox.
                </p>

                {newsletterSubscribed ? (
                  <div className="bg-white/15 backdrop-blur-md rounded-2xl p-4 flex items-center gap-3 border border-white/20">
                    <CheckCircle2 size={24} className="text-emerald-400" />
                    <div>
                      <p className="font-black text-sm text-white">You're Subscribed!</p>
                      <p className="text-[10px] text-white/80">Check your inbox for our latest newsletter.</p>
                    </div>
                  </div>
                ) : (
                  <form onSubmit={handleNewsletterSubmit} className="space-y-3">
                    <input
                      type="email"
                      required
                      value={newsletterEmail}
                      onChange={(e) => setNewsletterEmail(e.target.value)}
                      placeholder="Enter your email"
                      className="w-full px-4 py-3 bg-white/15 backdrop-blur-md rounded-2xl border border-white/20 text-white placeholder:text-white/60 text-xs font-bold outline-none focus:bg-white/20 transition-all"
                    />
                    <button 
                      type="submit" 
                      className="w-full h-11 bg-white hover:bg-slate-100 text-slate-900 font-black text-xs uppercase tracking-widest rounded-2xl transition-all shadow-lg active:scale-95 flex items-center justify-center gap-2 cursor-pointer"
                    >
                      Subscribe Free <ArrowRight size={14} className="text-primary-600" />
                    </button>
                  </form>
                )}
              </div>
            </div>

            {/* Trending Categories */}
            <div className="bg-white rounded-[2rem] sm:rounded-[2.2rem] p-6 sm:p-8 border border-slate-100 shadow-sm">
              <h4 className="text-xs font-black text-slate-400 uppercase tracking-widest mb-4 sm:mb-6 flex items-center gap-2">
                <TrendingUp size={14} className="text-primary-500" /> Explore Trending Topics
              </h4>
              <div className="space-y-2.5 sm:space-y-3">
                {[
                  { name: "Coding Bootcamps", count: "12 stories", cat: "Coding" },
                  { name: "Parenting in AI Era", count: "8 stories", cat: "Parenting" },
                  { name: "Robotics for Young Inventors", count: "10 stories", cat: "Robotics" },
                  { name: "Artificial Intelligence Basics", count: "6 stories", cat: "AI & ML" }
                ].map((item, i) => (
                  <button
                    key={i}
                    onClick={() => setActiveCategory(item.cat)}
                    className="w-full flex items-center justify-between p-3.5 sm:p-4 rounded-2xl bg-slate-50 hover:bg-primary-50 transition-colors text-left group active:scale-[0.98]"
                  >
                    <div>
                      <p className="font-black text-xs sm:text-sm text-slate-800 group-hover:text-primary-600 transition-colors">{item.name}</p>
                      <p className="text-[10px] text-slate-400 font-bold">{item.count}</p>
                    </div>
                    <ArrowRight size={14} className="text-slate-300 group-hover:text-primary-500 group-hover:translate-x-1 transition-all" />
                  </button>
                ))}
              </div>
            </div>

          </aside>

        </div>
      </section>

      <Footer />
    </div>
  );
}
