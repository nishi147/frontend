"use client";

import React from 'react';
import { Header } from '@/components/layout/Header';
import { Card, CardContent } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';

const SAMPLE_POSTS = [
  {
    id: 1,
    title: "Why Kids Should Learn to Code Early 🚀",
    excerpt: "Discover the amazing cognitive benefits of introducing programming concepts to children as young as 5, and how it sparks problem-solving skills.",
    category: "Coding",
    emoji: "💻",
    color: "from-blue-400 to-blue-600",
    date: "Mar 15, 2026"
  },
  {
    id: 2,
    title: "The Power of Game-Based Learning 🎮",
    excerpt: "How gamification in education is revolutionizing the way students retain information and stay motivated without feeling stressed.",
    category: "Education",
    emoji: "🎯",
    color: "from-green-400 to-green-600",
    date: "Mar 10, 2026"
  },
  {
    id: 3,
    title: "Parent's Guide: Balancing Screen Time 📱",
    excerpt: "Practical tips for parents to differentiate between 'passive' screen time and 'active/productive' screen time for their children.",
    category: "Parenting",
    emoji: "👨‍👩‍👧",
    color: "from-purple-400 to-purple-600",
    date: "Mar 05, 2026"
  },
  {
    id: 4,
    title: "Building Confidence Through Math 🧮",
    excerpt: "Math doesn't have to be scary! See how our interactive visual math tools are helping kids overcome math anxiety.",
    category: "Subject Focus",
    emoji: "✨",
    color: "from-yellow-400 to-yellow-600",
    date: "Feb 28, 2026"
  }
];

export default function BlogPage() {
  return (
    <div className="min-h-screen bg-background flex flex-col font-sans">
      <Header />
      
      {/* Hero Section */}
      <section className="bg-gradient-to-r from-primary-600 to-secondary-600 text-white py-20 px-4">
        <div className="max-w-4xl mx-auto text-center">
          <h1 className="text-5xl md:text-7xl font-black mb-6">The RUZANN Blog 📚</h1>
          <p className="text-xl md:text-2xl font-bold text-white/80 max-w-2xl mx-auto">
            Fun insights, learning strategies, and tips for parents and young scholars alike.
          </p>
        </div>
      </section>

      {/* Categories */}
      <section className="py-8 border-b-2 border-gray-100 bg-white">
        <div className="max-w-6xl mx-auto px-4 flex gap-4 overflow-x-auto pb-4 hide-scrollbar">
          {["All", "Coding", "Education", "Parenting", "Subject Focus", "News"].map(cat => (
             <button key={cat} className="whitespace-nowrap px-6 py-2 rounded-full font-bold bg-gray-100 text-gray-600 hover:bg-primary-100 hover:text-primary-600 transition-colors">
               {cat}
             </button>
          ))}
        </div>
      </section>

      {/* Blog Grid */}
      <section className="py-16 px-4">
        <div className="max-w-6xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {SAMPLE_POSTS.map(post => (
              <Card key={post.id} className="overflow-hidden hover:-translate-y-2 transition-transform duration-300">
                <div className={`h-48 bg-gradient-to-br ${post.color} flex items-center justify-center text-7xl`}>
                  {post.emoji}
                </div>
                <CardContent className="p-8">
                  <div className="flex items-center justify-between mb-4">
                    <span className="text-sm font-black text-primary-600 uppercase tracking-widest bg-primary-50 px-3 py-1 rounded-md">{post.category}</span>
                    <span className="text-sm font-bold text-gray-400">{post.date}</span>
                  </div>
                  <h2 className="text-2xl font-black text-gray-800 mb-4">{post.title}</h2>
                  <p className="text-gray-600 font-semibold mb-6">{post.excerpt}</p>
                  <Button variant="outline" className="w-full font-bold">Read Complete Article</Button>
                </CardContent>
              </Card>
            ))}
          </div>

          <div className="text-center mt-12">
            <Button size="lg" className="font-bold px-12 py-6 rounded-full text-lg shadow-xl shadow-primary-200">
               Load More Magic ✨
            </Button>
          </div>
        </div>
      </section>

      {/* Footer Teaser */}
      <footer className="bg-gray-900 py-12 px-4 text-center mt-auto">
        <p className="text-gray-400 font-bold">© {new Date().getFullYear()} RUZANN EdTech. Never stop exploring. 🔍</p>
      </footer>
    </div>
  );
}
