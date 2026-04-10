"use client";

import React from 'react';
import { Header } from '@/components/layout/Header';
import { Card, CardContent } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import Link from 'next/link';
import api from '@/utils/api';

const colors = [
  "from-blue-400 to-blue-600",
  "from-green-400 to-green-600",
  "from-purple-400 to-purple-600",
  "from-yellow-400 to-yellow-600",
  "from-red-400 to-red-600",
  "from-indigo-400 to-indigo-600"
];

export default function BlogPage() {
  const [blogs, setBlogs] = React.useState<any[]>([]);
  const [loading, setLoading] = React.useState(true);
  const [activeCategory, setActiveCategory] = React.useState('All');

  React.useEffect(() => {
    const fetchBlogs = async () => {
      try {
        const res = await api.get('/api/blogs');
        if (res.data.success) {
          // Filter for published blogs
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

  const filteredBlogs = blogs.filter((blog: any) => 
    activeCategory === 'All' || blog.category === activeCategory
  );

  return (
    <div className="min-h-screen bg-background flex flex-col font-sans">
      <Header />
      
      {/* Hero Section */}
      <section className="bg-gradient-to-r from-primary-600 to-secondary-600 text-white py-20 px-4">
        <div className="max-w-4xl mx-auto text-center">
          <h1 className="text-5xl md:text-7xl font-black mb-6 tracking-tight">The RUZANN Blog 📚</h1>
          <p className="text-xl md:text-2xl font-bold text-white/80 max-w-2xl mx-auto italic">
            Fun insights, learning strategies, and tips for parents and young scholars alike.
          </p>
        </div>
      </section>

      {/* Categories */}
      <section className="py-8 border-b-2 border-gray-100 bg-white sticky top-0 z-10 shadow-sm">
        <div className="max-w-6xl mx-auto px-4 flex gap-4 overflow-x-auto pb-4 hide-scrollbar">
          {["All", "Coding", "Robotics", "AI & ML", "Parenting", "Unboxed"].map((cat: string) => (
             <button 
                key={cat} 
                onClick={() => setActiveCategory(cat)}
                className={`whitespace-nowrap px-8 py-3 rounded-full font-black text-xs uppercase tracking-widest transition-all ${
                  activeCategory === cat 
                  ? 'bg-primary-500 text-white shadow-lg' 
                  : 'bg-gray-100 text-gray-500 hover:bg-gray-200'
                }`}
             >
               {cat}
             </button>
          ))}
        </div>
      </section>

      {/* Blog Grid */}
      <section className="py-16 px-4 bg-[#FAFAFA] flex-1">
        <div className="max-w-6xl mx-auto">
          {loading ? (
            <div className="flex flex-col items-center justify-center py-20 gap-4">
                <div className="w-12 h-12 border-4 border-primary-100 border-t-primary-500 rounded-full animate-spin" />
                <p className="font-black text-gray-400 uppercase tracking-widest text-xs">Gathering the magic...</p>
            </div>
          ) : filteredBlogs.length === 0 ? (
            <div className="text-center py-20 bg-white rounded-[3rem] border-2 border-dashed border-gray-100">
                <div className="text-6xl mb-6">🏜️</div>
                <h3 className="text-2xl font-black text-gray-800 mb-2 uppercase tracking-tight">No Stories Found</h3>
                <p className="text-gray-500 font-bold">The quill is ready, but the ink is still drying. Check back soon!</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
              {filteredBlogs.map((post: any, index: number) => (
                <Link key={post._id} href={`/blog/${post._id}`}>
                  <Card className="overflow-hidden hover:-translate-y-2 transition-all duration-300 border-0 bg-white shadow-[0_10px_40px_rgba(0,0,0,0.04)] rounded-[2.5rem] group cursor-pointer">
                    <div className="relative h-64 overflow-hidden">
                      {post.image ? (
                        <img src={post.image} alt={post.title} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" />
                      ) : (
                        <div className={`w-full h-full bg-gradient-to-br ${colors[index % colors.length]} flex items-center justify-center text-7xl`}>
                          📖
                        </div>
                      )}
                    </div>
                    <CardContent className="p-10">
                      <div className="flex items-center justify-between mb-6">
                        <span className="text-[10px] font-black text-primary-600 uppercase tracking-widest bg-primary-50 px-4 py-1.5 rounded-full border border-primary-100">
                          {post.category}
                        </span>
                        <span className="text-[10px] font-black text-gray-400 uppercase tracking-widest">
                          {new Date(post.createdAt || Date.now()).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
                        </span>
                      </div>
                      <h2 className="text-2xl md:text-3xl font-black text-gray-800 mb-4 group-hover:text-primary-500 transition-colors leading-tight">
                        {post.title}
                      </h2>
                      <p className="text-gray-500 font-bold mb-8 line-clamp-3 leading-relaxed italic">
                        {post.excerpt}
                      </p>
                      <Button variant="outline" className="w-full h-14 rounded-2xl font-black text-xs uppercase tracking-widest group-hover:bg-primary-500 group-hover:text-white transition-all border-2 border-gray-100 group-hover:border-primary-500 shadow-sm">
                        Read Complete Article
                      </Button>
                    </CardContent>
                  </Card>
                </Link>
              ))}
            </div>
          )}
        </div>
      </section>

      {/* Footer Teaser */}
      <footer className="bg-gray-900 py-12 px-4 text-center mt-auto">
        <p className="text-gray-400 font-bold">© {new Date().getFullYear()} RUZANN EdTech. Never stop exploring. 🔍</p>
      </footer>
    </div>
  );
}
