"use client";

import React, { useState, useEffect } from 'react';
import { Card, CardContent } from '../ui/Card';
import { Button } from '../ui/Button';
import { Play, ArrowRight, BookOpen, Clock, User, Star, Quote, X } from 'lucide-react';
import Link from 'next/link';
import api from '@/utils/api';

const BLOG_POSTS = [
  {
    id: 1,
    title: "Why Coding is the New Magic for Kids 🪄",
    excerpt: "Discover how learning to code empowers children to create, innovate, and solve real-world problems while having immense fun.",
    image: "/blog_post_coding_kids_1774005427109.png",
    author: "Sarah Chen",
    date: "March 15, 2024",
    readTime: "5 min read",
    tag: "Coding"
  },
  {
    id: 2,
    title: "Building Robots: A Journey of Discovery 🤖",
    excerpt: "From basic circuits to complex logic, see how our robotics workshops are shaping the engineers of tomorrow.",
    image: "/blog_post_robotics_fun_1774005452675.png",
    author: "David Miller",
    date: "March 10, 2024",
    readTime: "4 min read",
    tag: "Robotics"
  },
  {
    id: 3,
    title: "AI for Kids: De-mystifying the Future 🧠",
    excerpt: "Is AI too complex for children? Not with RUZANN! Explore our unique approach to teaching machine learning through play.",
    image: "/blog_post_ai_future_1774005471755.png",
    author: "Elena Rodriguez",
    date: "March 05, 2024",
    readTime: "6 min read",
    tag: "AI & ML"
  }
];

const STUDENT_VIDEOS = [
  {
    id: 1,
    title: "Aarav's First Game!",
    student: "Aarav, Age 10",
    thumbnail: "https://images.unsplash.com/photo-1542751371-adc38448a05e?auto=format&fit=crop&q=80&w=400",
    description: "Watch how Aarav built a fully functional space invader game in just 4 weeks! 🚀"
  },
  {
    id: 2,
    title: "Zoe's Robot Workshop",
    student: "Zoe, Age 8",
    thumbnail: "https://images.unsplash.com/photo-1531482615713-2afd69097998?auto=format&fit=crop&q=80&w=400",
    description: "Zoe showcases her custom-built line follower robot. Mechanical magic! 🤖"
  },
  {
    id: 3,
    title: "AI Art by Kabir",
    student: "Kabir, Age 12",
    thumbnail: "https://images.unsplash.com/photo-1517694712202-14dd9538aa97?auto=format&fit=crop&q=80&w=400",
    description: "Kabir explains how he used Python and AI to generate amazing futuristic landscapes. 🎨"
  }
];

export const BlogSection = () => {
  const [activeVideo, setActiveVideo] = useState<any>(null);
  const [blogs, setBlogs] = useState<any[]>([]);

  useEffect(() => {
    const fetchBlogs = async () => {
      try {
        const res = await api.get('/api/blogs');
        if (res.data.success && res.data.data.length > 0) {
          setBlogs(res.data.data.map((b: any) => ({
            ...b,
            id: b._id,
            tag: b.category // Map category to tag for UI
          })));
        } else {
          setBlogs(BLOG_POSTS);
        }
      } catch (error) {
        console.error("Error fetching blogs:", error);
        setBlogs(BLOG_POSTS);
      }
    };
    fetchBlogs();
  }, []);

  const VideoModal = ({ video, onClose }: { video: any, onClose: () => void }) => {
    if (!video) return null;
    return (
      <div className="fixed inset-0 z-[10000] flex items-center justify-center p-4 bg-black/90 backdrop-blur-md animate-in fade-in duration-300">
        <div className="relative w-full max-w-4xl aspect-video bg-black rounded-3xl overflow-hidden shadow-2xl">
          <button 
            onClick={onClose}
            className="absolute top-6 right-6 z-10 p-3 bg-white/10 hover:bg-white/20 rounded-full transition-all text-white backdrop-blur-md border border-white/20"
          >
            <X className="w-6 h-6" />
          </button>
          
          <div className="w-full h-full flex items-center justify-center">
             {/* Placeholder for real video - using a stylish message */}
             <div className="text-center p-8">
                <div className="w-24 h-24 bg-secondary-500 rounded-full flex items-center justify-center mx-auto mb-6 animate-pulse">
                  <Play size={40} className="text-white ml-2" fill="currentColor" />
                </div>
                <h3 className="text-3xl font-black text-white mb-2">{video.title}</h3>
                <p className="text-gray-400 font-bold mb-8">Video streaming from RUZANN cloud... ✨</p>
                <div className="inline-flex items-center gap-3 px-6 py-3 bg-white/5 border border-white/10 rounded-2xl text-secondary-400 font-black text-sm uppercase tracking-widest">
                  <Star size={18} fill="currentColor" /> Starring: {video.student}
                </div>
             </div>
          </div>
        </div>
      </div>
    );
  };

  return (
    <section className="py-24 px-4 bg-white overflow-hidden" id="blog">
      {activeVideo && <VideoModal video={activeVideo} onClose={() => setActiveVideo(null)} />}
      <div className="max-w-7xl mx-auto">
        {/* ... */}
        <div className="flex flex-col md:flex-row items-end justify-between mb-16 gap-4 text-center md:text-left">
          <div className="max-w-2xl">
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-primary-100 rounded-full text-primary-600 font-bold mb-3">
              <BookOpen size={16} />
              <span className="text-sm">RUZANN Stories</span>
            </div>
            <h2 className="text-4xl md:text-6xl font-black text-gray-800 leading-tight">
              Explore Our <span className="text-primary-500 underline decoration-8 decoration-primary-100 underline-offset-8">Magical</span> Blog ✨
            </h2>
          </div>
          <p className="text-lg font-bold text-gray-400 md:max-w-xs">
            Inspiring stories, learning tips, and latest news from the world of EdTech.
          </p>
        </div>

        {/* Blog Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-10 mb-24">
          {blogs.map((post) => (
            <Link key={post.id} href={`/blog/${post.id}`} className="group">
              <Card className="h-full border-2 border-gray-100 rounded-[2.5rem] overflow-hidden hover:border-primary-300 transition-all duration-500 hover:shadow-2xl hover:shadow-primary-100 bg-white">
                <div className="relative aspect-[16/10] overflow-hidden">
                  <img src={post.image || "/blog_post_coding_kids_1774005427109.png"} alt={post.title} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" />
                  <div className="absolute top-4 left-4 flex gap-2">
                    <span className="px-4 py-1 bg-white/90 backdrop-blur-md rounded-full text-[10px] font-black uppercase tracking-widest text-primary-600 shadow-sm">
                      {post.tag}
                    </span>
                    {post.videoUrl && (
                      <div className="w-8 h-8 bg-secondary-500 rounded-full flex items-center justify-center text-white shadow-lg animate-pulse">
                        <Play size={14} fill="currentColor" className="ml-0.5" />
                      </div>
                    )}
                  </div>
                </div>
                <CardContent className="p-8">
                  <div className="flex items-center gap-4 text-[10px] font-black text-gray-400 uppercase tracking-widest mb-4">
                    <span className="flex items-center gap-1.5"><Clock size={12} /> {post.readTime}</span>
                    <span className="w-1 h-1 bg-gray-300 rounded-full" />
                    <span className="flex items-center gap-1.5"><User size={12} /> By {post.author}</span>
                  </div>
                  <h3 className="text-2xl font-black text-gray-800 mb-4 group-hover:text-primary-500 transition-colors leading-tight">
                    {post.title}
                  </h3>
                  <p className="text-gray-500 font-bold text-sm leading-relaxed mb-6 line-clamp-2">
                    {post.excerpt}
                  </p>
                  <div className="flex items-center text-primary-500 font-black text-xs uppercase tracking-widest group-hover:gap-3 gap-2 transition-all">
                    Read Story <ArrowRight size={14} />
                  </div>
                </CardContent>
              </Card>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
};
