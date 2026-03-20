"use client";

import React, { useEffect, useState } from 'react';
import { Header } from '@/components/layout/Header';
import { Footer } from '@/components/layout/Footer';
import { Button } from '@/components/ui/Button';
import axios from 'axios';
import { useParams, useRouter } from 'next/navigation';
import { Clock, User as UserIcon, Calendar, ArrowLeft, Share2, PlayCircle } from 'lucide-react';
import Link from 'next/link';

const API = process.env.NEXT_PUBLIC_API_URL;

export default function BlogDetailPage() {
  const { id } = useParams();
  const router = useRouter();
  const [blog, setBlog] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchBlog = async () => {
      try {
        const res = await axios.get(`${API}/api/blogs/${id}`);
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
  }, [id]);

  if (loading) return (
    <div className="min-h-screen bg-white flex items-center justify-center">
      <div className="flex flex-col items-center gap-4">
        <div className="w-16 h-16 border-4 border-primary-100 border-t-primary-500 rounded-full animate-spin" />
        <p className="font-black text-gray-400 animate-pulse uppercase tracking-widest text-sm">Brewing the story...</p>
      </div>
    </div>
  );
  
  if (!blog) return (
    <div className="min-h-screen bg-white flex flex-col items-center justify-center p-4 text-center">
       <div className="text-8xl mb-8">📖</div>
       <h1 className="text-4xl font-black text-gray-800 mb-4">Story Not Found</h1>
       <p className="text-gray-500 font-bold mb-10 max-w-md">This magical scroll seems to have vanished into the digital aether.</p>
       <Button onClick={() => router.push('/')} className="rounded-2xl h-14 px-8 font-black">Back to Home</Button>
    </div>
  );

  return (
    <div className="min-h-screen bg-[#FAFAFA]">
      <Header />
      
      <main className="pt-24 pb-20">
        <div className="container mx-auto px-4 md:px-6">
          {/* Back Button */}
          <Link href="/" className="inline-flex items-center gap-2 text-gray-400 hover:text-primary-500 font-black uppercase tracking-widest text-[10px] mb-10 transition-colors group">
            <ArrowLeft size={16} className="group-hover:-translate-x-1 transition-transform" /> Back to Magical Stories
          </Link>

          <article className="max-w-4xl mx-auto">
            {/* Header Content */}
            <div className="text-center mb-12">
              <div className="flex justify-center mb-6">
                <span className="px-6 py-2 bg-primary-50 text-primary-600 rounded-full text-xs font-black uppercase tracking-widest border border-primary-100 shadow-sm">
                  {blog.category}
                </span>
              </div>
              <h1 className="text-4xl md:text-6xl font-black text-gray-800 mb-8 leading-tight">
                {blog.title}
              </h1>
              
              <div className="flex flex-wrap items-center justify-center gap-6 text-gray-400 font-bold">
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
                <div className="flex items-center gap-2">
                  <Clock size={16} />
                  <span>{blog.readTime}</span>
                </div>
              </div>
            </div>

            {/* Featured Image / Video */}
            <div className="relative rounded-[3rem] overflow-hidden shadow-2xl mb-16 aspect-video group">
              <img 
                src={blog.image || "/blog_post_coding_kids_1774005427109.png"} 
                alt={blog.title} 
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

            {/* Article Content */}
            <div className="bg-white rounded-[3.5rem] p-8 md:p-16 shadow-sm border border-gray-50 mb-12">
              <div className="prose prose-xl max-w-none prose-p:text-gray-600 prose-headings:text-gray-800 prose-p:font-bold prose-headings:font-black prose-p:leading-relaxed">
                {blog.content.split('\n').map((paragraph: string, i: number) => (
                  <p key={i} className="mb-6">{paragraph}</p>
                ))}
              </div>
              
              {/* If video exists but image was shown on top, add a CTA here */}
              {blog.videoUrl && (
                <div className="mt-16 p-10 bg-secondary-50 rounded-[2.5rem] border-2 border-dashed border-secondary-200 text-center">
                  <h3 className="text-2xl font-black text-secondary-900 mb-4 uppercase tracking-tight">Watch the Story 🎬</h3>
                  <p className="text-secondary-700 font-bold mb-8">This story is even better in motion! Check out the companion video.</p>
                  <Button 
                    onClick={() => window.open(blog.videoUrl, '_blank')}
                    className="bg-secondary-500 hover:bg-secondary-600 text-white rounded-2xl h-14 px-10 font-black shadow-xl shadow-secondary-200"
                  >
                    View Video Link
                  </Button>
                </div>
              )}
            </div>

            {/* Share & Footer */}
            <div className="flex flex-col md:flex-row items-center justify-between gap-8 pt-10 border-t border-gray-100">
               <div className="flex items-center gap-4">
                  <span className="text-xs font-black text-gray-400 uppercase tracking-widest">Share this magic:</span>
                  <div className="flex gap-2">
                    {[Share2].map((Icon, i) => (
                      <button key={i} className="w-10 h-10 rounded-full bg-gray-50 flex items-center justify-center text-gray-400 hover:bg-primary-500 hover:text-white transition-all shadow-sm">
                        <Icon size={18} />
                      </button>
                    ))}
                  </div>
               </div>
               
               <Link href="/" className="text-primary-500 font-black uppercase tracking-widest text-xs hover:underline">
                  More Stories →
               </Link>
            </div>
          </article>
        </div>
      </main>

      <Footer />
    </div>
  );
}
