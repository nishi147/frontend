"use client";

import React, { useState, useEffect } from 'react';
import { DashboardLayout } from '@/components/layout/DashboardLayout';
import { Button } from '@/components/ui/Button';
import { Card, CardContent } from '@/components/ui/Card';
import { Plus, Pencil, Trash2, Eye, Search, BookOpen, Clock, User as UserIcon, X, Check, Loader2 } from 'lucide-react';
import axios from 'axios';
import { useToast } from '@/context/ToastContext';
import { ConfirmationModal } from '@/components/ui/ConfirmationModal';

const API = process.env.NEXT_PUBLIC_API_URL;

export default function AdminBlogsPage() {
  const [blogs, setBlogs] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [blogToDelete, setBlogToDelete] = useState<string | null>(null);
  const [currentBlog, setCurrentBlog] = useState<any>(null);
  const [saving, setSaving] = useState(false);
  const { showToast } = useToast();

  const [formData, setFormData] = useState({
    title: '',
    excerpt: '',
    content: '',
    image: '',
    videoUrl: '',
    category: 'Coding',
    readTime: '5 min read',
    author: 'Ruzann Team',
    isPublished: true
  });

  const fetchBlogs = async () => {
    try {
      const res = await axios.get(`${API}/api/blogs`);
      if (res.data.success) {
        setBlogs(res.data.data);
      }
    } catch (error) {
      console.error("Error fetching blogs:", error);
      showToast("Failed to fetch blogs", "error");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchBlogs();
  }, []);

  const handleOpenModal = (blog: any = null) => {
    if (blog) {
      setCurrentBlog(blog);
      setFormData({
        title: blog.title,
        excerpt: blog.excerpt,
        content: blog.content,
        image: blog.image || '',
        videoUrl: blog.videoUrl || '',
        category: blog.category || 'Coding',
        readTime: blog.readTime || '5 min read',
        author: blog.author || 'Ruzann Team',
        isPublished: blog.isPublished ?? true
      });
    } else {
      setCurrentBlog(null);
      setFormData({
        title: '',
        excerpt: '',
        content: '',
        image: '',
        videoUrl: '',
        category: 'Coding',
        readTime: '5 min read',
        author: 'Ruzann Team',
        isPublished: true
      });
    }
    setIsModalOpen(true);
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    try {
      if (currentBlog) {
        await axios.put(`${API}/api/blogs/${currentBlog._id}`, formData);
        showToast("Blog updated successfully!", "success");
      } else {
        await axios.post(`${API}/api/blogs`, formData);
        showToast("Blog created successfully!", "success");
      }
      setIsModalOpen(false);
      fetchBlogs();
    } catch (error: any) {
      console.error("Error saving blog:", error);
      const msg = error.response?.data?.message || "Failed to save blog";
      showToast(msg, "error");
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = (id: string) => {
    setBlogToDelete(id);
    setIsDeleteModalOpen(true);
  };

  const confirmDelete = async () => {
    if (!blogToDelete) return;
    try {
      await axios.delete(`${API}/api/blogs/${blogToDelete}`);
      showToast("Blog deleted successfully", "success");
      fetchBlogs();
    } catch (error) {
      showToast("Failed to delete blog", "error");
    } finally {
      setIsDeleteModalOpen(false);
      setBlogToDelete(null);
    }
  };

  const filteredBlogs = blogs.filter(blog => 
    blog.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    blog.category.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <DashboardLayout>
      <div className="p-4 md:p-8 max-w-7xl mx-auto">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-10">
          <div>
            <h1 className="text-3xl md:text-4xl font-black text-gray-800 flex items-center gap-3">
              <BookOpen className="text-primary-500" size={36} /> Manage Blogs
            </h1>
            <p className="text-gray-500 font-bold mt-1">Create and curate magical stories for our explorers.</p>
          </div>
          <Button onClick={() => handleOpenModal()} className="rounded-2xl h-14 px-8 bg-primary-600 hover:bg-primary-700 text-white font-black text-lg shadow-xl shadow-primary-200">
            <Plus className="mr-2" /> Add New Blog
          </Button>
        </div>

        {/* Search Bar */}
        <div className="relative mb-8 max-w-md">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
          <input
            type="text"
            placeholder="Search blogs by title or category..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-12 pr-4 py-4 bg-white rounded-2xl border-2 border-gray-100 focus:border-primary-300 outline-none font-bold text-gray-700 transition-all shadow-sm"
          />
        </div>

        {loading ? (
          <div className="flex flex-col items-center justify-center py-20 bg-white rounded-[2.5rem] border-2 border-dashed border-gray-200">
             <Loader2 className="w-12 h-12 text-primary-500 animate-spin mb-4" />
             <p className="font-black text-gray-400 uppercase tracking-widest text-sm">Gathering the stories...</p>
          </div>
        ) : filteredBlogs.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-20 bg-white rounded-[2.5rem] border-2 border-dashed border-gray-200 text-center">
            <div className="w-20 h-20 bg-gray-50 rounded-full flex items-center justify-center mb-6 text-gray-300">
               <BookOpen size={40} />
            </div>
            <h3 className="text-2xl font-black text-gray-800 mb-2">No Blogs Found</h3>
            <p className="text-gray-400 font-bold max-w-xs px-4">Time to write some magical stories for Ruzann!</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {filteredBlogs.map((blog) => (
              <Card key={blog._id} className="rounded-[2rem] border-2 border-gray-100 overflow-hidden hover:border-primary-200 transition-all group bg-white shadow-sm hover:shadow-xl">
                <div className="relative aspect-video overflow-hidden">
                  <img src={blog.image || "/blog_post_coding_kids_1774005427109.png"} alt={blog.title} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" />
                  <div className="absolute top-4 left-4">
                    <span className="px-3 py-1 bg-white/90 backdrop-blur-md rounded-full text-[10px] font-black uppercase tracking-widest text-primary-600 shadow-sm border border-white">
                      {blog.category}
                    </span>
                  </div>
                </div>
                <CardContent className="p-6">
                  <h3 className="text-xl font-black text-gray-800 mb-3 line-clamp-2">{blog.title}</h3>
                  <div className="flex items-center gap-4 text-[10px] font-black text-gray-400 uppercase tracking-widest mb-6">
                    <span className="flex items-center gap-1.5"><Clock size={12} /> {blog.readTime}</span>
                    <span className="w-1 h-1 bg-gray-300 rounded-full" />
                    <span className="flex items-center gap-1.5"><UserIcon size={12} /> {blog.author}</span>
                  </div>
                  <div className="flex items-center gap-2 pt-4 border-t border-gray-50">
                    <Button onClick={() => handleOpenModal(blog)} variant="outline" className="flex-1 rounded-xl h-10 font-black text-[10px] uppercase tracking-widest gap-2 bg-gray-50 hover:bg-primary-50 hover:text-primary-600 border-none">
                      <Pencil size={14} /> Edit
                    </Button>
                    <Button onClick={() => handleDelete(blog._id)} variant="outline" className="flex-1 rounded-xl h-10 font-black text-[10px] uppercase tracking-widest gap-2 bg-red-50 text-red-500 hover:bg-red-500 hover:text-white border-none">
                      <Trash2 size={14} /> Delete
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}

        {/* Add/Edit Modal */}
        {isModalOpen && (
          <div className="fixed inset-0 z-[1000] flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
            <div className="bg-white rounded-[3rem] w-full max-w-2xl max-h-[90vh] overflow-hidden flex flex-col shadow-2xl animate-in zoom-in duration-300">
              <div className="p-8 border-b border-gray-100 flex items-center justify-between bg-primary-50/30">
                <h2 className="text-2xl font-black text-gray-800">{currentBlog ? 'Edit Story' : 'New Magical Story'}</h2>
                <button onClick={() => setIsModalOpen(false)} className="p-3 hover:bg-white rounded-full transition-all text-gray-400 hover:text-gray-600">
                  <X size={24} />
                </button>
              </div>
              
              <form onSubmit={handleSave} className="p-8 overflow-y-auto space-y-6">
                <div className="space-y-2">
                  <label className="text-[11px] font-black text-gray-400 uppercase tracking-widest ml-1">Blog Title</label>
                  <input
                    type="text"
                    required
                    value={formData.title}
                    onChange={(e) => setFormData({...formData, title: e.target.value})}
                    placeholder="Enter an exciting title..."
                    className="w-full px-6 py-4 bg-gray-50/50 rounded-2xl border-2 border-gray-100 focus:border-primary-300 outline-none font-bold text-gray-700 transition-all"
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <label className="text-[11px] font-black text-gray-400 uppercase tracking-widest ml-1">Category</label>
                    <select
                      value={formData.category}
                      onChange={(e) => setFormData({...formData, category: e.target.value})}
                      className="w-full px-6 py-4 bg-gray-50/50 rounded-2xl border-2 border-gray-100 focus:border-primary-300 outline-none font-bold text-gray-700 transition-all cursor-pointer"
                    >
                      <option>Coding</option>
                      <option>Robotics</option>
                      <option>AI & ML</option>
                      <option>Parenting</option>
                      <option>Unboxed</option>
                    </select>
                  </div>
                  <div className="space-y-2">
                    <label className="text-[11px] font-black text-gray-400 uppercase tracking-widest ml-1">Read Time</label>
                    <input
                      type="text"
                      value={formData.readTime}
                      onChange={(e) => setFormData({...formData, readTime: e.target.value})}
                      placeholder="e.g. 5 min read"
                      className="w-full px-6 py-4 bg-gray-50/50 rounded-2xl border-2 border-gray-100 focus:border-primary-300 outline-none font-bold text-gray-700 transition-all"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <label className="text-[11px] font-black text-gray-400 uppercase tracking-widest ml-1">Thumbnail URL</label>
                    <input
                      type="text"
                      value={formData.image}
                      onChange={(e) => setFormData({...formData, image: e.target.value})}
                      placeholder="Image URL"
                      className="w-full px-6 py-4 bg-gray-50/50 rounded-2xl border-2 border-gray-100 focus:border-primary-300 outline-none font-bold text-gray-700 transition-all"
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-[11px] font-black text-gray-400 uppercase tracking-widest ml-1">Video Link (Optional)</label>
                    <input
                      type="text"
                      value={formData.videoUrl}
                      onChange={(e) => setFormData({...formData, videoUrl: e.target.value})}
                      placeholder="YouTube/Vimeo Link"
                      className="w-full px-6 py-4 bg-gray-50/50 rounded-2xl border-2 border-gray-100 focus:border-primary-300 outline-none font-bold text-gray-700 transition-all"
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="text-[11px] font-black text-gray-400 uppercase tracking-widest ml-1">Excerpt (Short Summary)</label>
                  <textarea
                    required
                    value={formData.excerpt}
                    onChange={(e) => setFormData({...formData, excerpt: e.target.value})}
                    placeholder="Short summary for the card..."
                    className="w-full px-6 py-4 bg-gray-50/50 rounded-2xl border-2 border-gray-100 focus:border-primary-300 outline-none font-bold text-gray-700 transition-all h-24 resize-none"
                  />
                </div>

                <div className="space-y-2">
                  <label className="text-[11px] font-black text-gray-400 uppercase tracking-widest ml-1">Content (Markdown/Text)</label>
                  <textarea
                    required
                    value={formData.content}
                    onChange={(e) => setFormData({...formData, content: e.target.value})}
                    placeholder="Tell your story here..."
                    className="w-full px-6 py-4 bg-gray-50/50 rounded-2xl border-2 border-gray-100 focus:border-primary-300 outline-none font-bold text-gray-700 transition-all h-48 resize-none"
                  />
                </div>

                <div className="pt-6 flex gap-3">
                  <Button type="button" onClick={() => setIsModalOpen(false)} variant="outline" className="flex-1 rounded-2xl h-14 font-black uppercase tracking-widest text-sm bg-gray-50 border-none">
                    Cancel
                  </Button>
                  <Button type="submit" disabled={saving} className="flex-1 rounded-2xl h-14 bg-primary-600 hover:bg-primary-700 text-white font-black uppercase tracking-widest text-sm shadow-xl shadow-primary-100">
                    {saving ? <Loader2 className="animate-spin" /> : currentBlog ? 'Update Story' : 'Create Story'}
                  </Button>
                </div>
              </form>
            </div>
          </div>
        )}

        {/* Delete Confirmation */}
        <ConfirmationModal
          isOpen={isDeleteModalOpen}
          onCancel={() => setIsDeleteModalOpen(false)}
          onConfirm={confirmDelete}
          title="Delete Story?"
          message="Are you sure you want to delete this story? This action cannot be undone."
          variant="danger"
        />
      </div>
    </DashboardLayout>
  );
}
