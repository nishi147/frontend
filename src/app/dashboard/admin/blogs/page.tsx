"use client";

import React, { useState, useEffect } from 'react';
import { DashboardLayout } from '@/components/layout/DashboardLayout';
import { Button } from '@/components/ui/Button';
import { Card, CardContent } from '@/components/ui/Card';
import { Plus, Pencil, Trash2, Eye, Search, BookOpen, Clock, User as UserIcon, X, Check, Loader2, Bold, Italic, Link as LinkIcon, List, Type, HelpCircle, ChevronDown, ChevronUp, AlertCircle, Sparkles, Upload, Link2, FileText } from 'lucide-react';
import { useToast } from '@/context/ToastContext';
import { ConfirmationModal } from '@/components/ui/ConfirmationModal';
import api from '@/utils/api';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';

// Utility for slug generation
const generateSlug = (text: string) => {
  return text
    .toLowerCase()
    .replace(/[^\w ]+/g, '')
    .replace(/ +/g, '-');
};

export default function AdminBlogsPage() {
  const [blogs, setBlogs] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [activeModalTab, setActiveModalTab] = useState<'editor' | 'preview'>('editor');
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [blogToDelete, setBlogToDelete] = useState<string | null>(null);
  const [currentBlog, setCurrentBlog] = useState<any>(null);
  const [saving, setSaving] = useState(false);
  const { showToast } = useToast();

  const [formData, setFormData] = useState({
    title: '',
    slug: '',
    excerpt: '',
    content: '',
    image: '',
    imageAlt: '',
    videoUrl: '',
    category: 'Coding',
    author: 'Ruzann Team',
    isPublished: true,
    metaTitle: '',
    metaDescription: '',
    keywords: '',
    faqs: [] as { question: string, answer: string }[]
  });
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [videoFile, setVideoFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string>('');
  const [videoPreview, setVideoPreview] = useState<string>('');
  const [imageInputMode, setImageInputMode] = useState<'file' | 'url'>('file');
  const [videoInputMode, setVideoInputMode] = useState<'file' | 'url'>('url');
  const [seoScore, setSeoScore] = useState(0);

  const fetchBlogs = async () => {
    try {
      const res = await api.get('/api/blogs');
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

  const calculateSeoScore = (data: typeof formData) => {
    let score = 0;
    if (data.title.length > 30) score += 20;
    if (data.metaTitle && data.metaTitle.length > 30) score += 20;
    if (data.metaDescription && data.metaDescription.length > 100 && data.metaDescription.length <= 160) score += 20;
    if (data.content.split(' ').length >= 250) score += 20;
    if (data.keywords && data.keywords.split(',').filter(Boolean).length >= 3) score += 10;
    if (data.imageAlt) score += 10;
    setSeoScore(score);
  };

  useEffect(() => {
    calculateSeoScore(formData);
  }, [formData]);

  useEffect(() => {
    fetchBlogs();
  }, []);

  const handleOpenModal = (blog: any = null) => {
    if (blog) {
      setCurrentBlog(blog);
      setFormData({
        title: blog.title || '',
        slug: blog.slug || '',
        excerpt: blog.excerpt || '',
        content: blog.content || '',
        image: blog.image || '',
        imageAlt: blog.imageAlt || '',
        videoUrl: blog.videoUrl || '',
        category: blog.category || 'Coding',
        author: blog.author || 'Ruzann Team',
        isPublished: blog.isPublished ?? true,
        metaTitle: blog.metaTitle || '',
        metaDescription: blog.metaDescription || '',
        keywords: Array.isArray(blog.keywords) ? blog.keywords.join(', ') : '',
        faqs: blog.faqs || []
      });
      setImagePreview(blog.image || '');
      setVideoPreview(blog.videoUrl || '');
    } else {
      setCurrentBlog(null);
      setFormData({
        title: '',
        slug: '',
        excerpt: '',
        content: '',
        image: '',
        imageAlt: '',
        videoUrl: '',
        category: 'Coding',
        author: 'Ruzann Team',
        isPublished: true,
        metaTitle: '',
        metaDescription: '',
        keywords: '',
        faqs: []
      });
      setImagePreview('');
      setVideoPreview('');
    }
    setImageFile(null);
    setVideoFile(null);
    setActiveModalTab('editor');
    setIsModalOpen(true);
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    try {
      const data = new FormData();
      Object.entries(formData).forEach(([key, value]) => {
        if (key === 'faqs') {
          data.append(key, JSON.stringify(value));
        } else {
          data.append(key, value.toString());
        }
      });

      if (imageFile) data.append('image', imageFile);
      if (videoFile) data.append('video', videoFile);

      if (currentBlog) {
        await api.put(`/api/blogs/${currentBlog._id}`, data, {
          headers: { 'Content-Type': 'multipart/form-data' }
        });
        showToast("Blog updated successfully!", "success");
      } else {
        await api.post('/api/blogs', data, {
          headers: { 'Content-Type': 'multipart/form-data' }
        });
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
      await api.delete(`/api/blogs/${blogToDelete}`);
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
    (blog.category && blog.category.toLowerCase().includes(searchQuery.toLowerCase()))
  );

  return (
    <DashboardLayout>
      <div className="p-4 md:p-8 max-w-7xl mx-auto font-sans">
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
             <p className="font-black text-gray-400 uppercase tracking-widest text-sm">Gathering stories...</p>
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
                <div className="relative aspect-video overflow-hidden bg-gray-100">
                  <img src={blog.image || "/blog_post_coding_kids_1774005427109.png"} alt={blog.title} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" />
                  <div className="absolute top-4 left-4 flex gap-2">
                    <span className="px-3 py-1 bg-white/90 backdrop-blur-md rounded-full text-[10px] font-black uppercase tracking-widest text-primary-600 shadow-sm border border-white">
                      {blog.category || 'General'}
                    </span>
                    {!blog.isPublished && (
                      <span className="px-3 py-1 bg-amber-500 text-white rounded-full text-[10px] font-black uppercase tracking-widest shadow-sm">
                        Draft
                      </span>
                    )}
                  </div>
                </div>
                <CardContent className="p-6">
                  <h3 className="text-xl font-black text-gray-800 mb-3 line-clamp-2">{blog.title}</h3>
                  <div className="flex items-center gap-4 text-[10px] font-black text-gray-400 uppercase tracking-widest mb-6">
                    <span className="flex items-center gap-1.5"><Clock size={12} /> {blog.readTimeText || `${blog.readingTime || 5} min read`}</span>
                    <span className="w-1 h-1 bg-gray-300 rounded-full" />
                    <span className="flex items-center gap-1.5"><UserIcon size={12} /> {blog.author || 'Ruzann Team'}</span>
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
            <div className="bg-white rounded-[3rem] w-full max-w-3xl max-h-[92vh] overflow-hidden flex flex-col shadow-2xl animate-in zoom-in duration-300">
              {/* Header */}
              <div className="px-8 py-6 border-b border-gray-100 flex items-center justify-between bg-gradient-to-r from-primary-50/50 to-white">
                <div className="flex items-center gap-4">
                  <h2 className="text-2xl font-black text-gray-800">{currentBlog ? 'Edit Story' : 'New Magical Story'}</h2>
                  <div className="flex bg-gray-100 p-1 rounded-xl gap-1">
                    <button
                      type="button"
                      onClick={() => setActiveModalTab('editor')}
                      className={`px-4 py-1.5 rounded-lg text-xs font-black uppercase tracking-wider transition-all ${activeModalTab === 'editor' ? 'bg-white text-primary-600 shadow-sm' : 'text-gray-500 hover:text-gray-800'}`}
                    >
                      <Pencil className="inline mr-1 -mt-0.5" size={12} /> Editor
                    </button>
                    <button
                      type="button"
                      onClick={() => setActiveModalTab('preview')}
                      className={`px-4 py-1.5 rounded-lg text-xs font-black uppercase tracking-wider transition-all ${activeModalTab === 'preview' ? 'bg-white text-primary-600 shadow-sm' : 'text-gray-500 hover:text-gray-800'}`}
                    >
                      <Eye className="inline mr-1 -mt-0.5" size={12} /> Live Preview
                    </button>
                  </div>
                </div>
                <button onClick={() => setIsModalOpen(false)} className="p-3 hover:bg-gray-100 rounded-full transition-all text-gray-400 hover:text-gray-600">
                  <X size={24} />
                </button>
              </div>
              
              {activeModalTab === 'preview' ? (
                <div className="p-8 overflow-y-auto space-y-6">
                  <div className="border border-gray-100 rounded-3xl p-8 bg-gray-50/50">
                    <span className="px-4 py-1 bg-primary-100 text-primary-600 rounded-full text-xs font-black uppercase tracking-widest">
                      {formData.category}
                    </span>
                    <h1 className="text-3xl md:text-4xl font-black text-gray-800 mt-4 mb-4">{formData.title || 'Untitled Article'}</h1>
                    <p className="text-gray-500 font-bold italic mb-6">{formData.excerpt || 'Excerpt preview...'}</p>
                    {imagePreview && (
                      <div className="rounded-2xl overflow-hidden mb-6 aspect-video">
                        <img src={imagePreview} alt="Cover Preview" className="w-full h-full object-cover" />
                      </div>
                    )}
                    <div className="prose prose-lg max-w-none text-gray-700">
                      <ReactMarkdown remarkPlugins={[remarkGfm]}>
                        {formData.content || '_No content written yet._'}
                      </ReactMarkdown>
                    </div>
                  </div>
                </div>
              ) : (
                <form onSubmit={handleSave} className="p-8 overflow-y-auto space-y-6">
                  {/* Status Toggle */}
                  <div className="flex items-center justify-between p-4 bg-gray-50 rounded-2xl border border-gray-100">
                    <div>
                      <span className="text-xs font-black text-gray-700 uppercase tracking-wider">Publish Status</span>
                      <p className="text-xs text-gray-400 font-bold">Make this story live immediately upon saving</p>
                    </div>
                    <button
                      type="button"
                      onClick={() => setFormData({ ...formData, isPublished: !formData.isPublished })}
                      className={`relative inline-flex h-7 w-14 items-center rounded-full transition-colors ${formData.isPublished ? 'bg-green-500' : 'bg-gray-300'}`}
                    >
                      <span className={`inline-block h-5 w-5 transform rounded-full bg-white transition-transform ${formData.isPublished ? 'translate-x-8' : 'translate-x-1'}`} />
                    </button>
                  </div>

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
                        <option>STEM</option>
                      </select>
                    </div>
                    <div className="space-y-2">
                      <label className="text-[11px] font-black text-gray-400 uppercase tracking-widest ml-1">Author</label>
                      <input
                        type="text"
                        value={formData.author}
                        onChange={(e) => setFormData({...formData, author: e.target.value})}
                        placeholder="Author name (default: Ruzann Team)"
                        className="w-full px-6 py-4 bg-gray-50/50 rounded-2xl border-2 border-gray-100 focus:border-primary-300 outline-none font-bold text-gray-700 transition-all"
                      />
                    </div>
                  </div>

                  {/* Image & Video Input Options */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {/* Image Section */}
                    <div className="space-y-3">
                      <div className="flex items-center justify-between">
                        <label className="text-[11px] font-black text-primary-500 uppercase tracking-widest ml-1">Cover Image</label>
                        <div className="flex gap-2">
                          <button
                            type="button"
                            onClick={() => setImageInputMode('file')}
                            className={`text-[10px] font-black px-2 py-0.5 rounded-md ${imageInputMode === 'file' ? 'bg-primary-500 text-white' : 'bg-gray-100 text-gray-400'}`}
                          >
                            Upload
                          </button>
                          <button
                            type="button"
                            onClick={() => setImageInputMode('url')}
                            className={`text-[10px] font-black px-2 py-0.5 rounded-md ${imageInputMode === 'url' ? 'bg-primary-500 text-white' : 'bg-gray-100 text-gray-400'}`}
                          >
                            URL
                          </button>
                        </div>
                      </div>

                      {imageInputMode === 'file' ? (
                        <div className="relative group/upload h-28 rounded-2xl bg-gray-50 border-2 border-dashed border-gray-200 flex items-center justify-center hover:border-primary-400 transition-all overflow-hidden">
                           {imagePreview ? (
                             <div className="relative w-full h-full">
                               <img src={imagePreview} className="w-full h-full object-cover" alt="Preview" />
                               <button
                                 type="button"
                                 onClick={() => { setImageFile(null); setImagePreview(''); setFormData({ ...formData, image: '' }); }}
                                 className="absolute top-2 right-2 p-1.5 bg-black/60 text-white rounded-full hover:bg-red-500 transition-colors"
                               >
                                 <X size={14} />
                               </button>
                             </div>
                           ) : (
                             <div className="text-gray-400 text-[10px] font-black uppercase text-center p-2">
                               <Upload className="mx-auto mb-1 text-primary-400" size={20} />
                               Click to Upload Cover Image
                             </div>
                           )}
                           <input 
                             type="file" accept="image/*" className="absolute inset-0 opacity-0 cursor-pointer"
                             onChange={(e) => {
                               const file = e.target.files?.[0];
                               if (file) {
                                 setImageFile(file);
                                 const reader = new FileReader();
                                 reader.onloadend = () => setImagePreview(reader.result as string);
                                 reader.readAsDataURL(file);
                               }
                             }}
                           />
                        </div>
                      ) : (
                        <input
                          type="url"
                          value={formData.image}
                          onChange={(e) => {
                            setFormData({ ...formData, image: e.target.value });
                            setImagePreview(e.target.value);
                          }}
                          placeholder="https://example.com/image.jpg"
                          className="w-full px-6 py-4 bg-gray-50/50 rounded-2xl border-2 border-gray-100 focus:border-primary-300 outline-none font-bold text-gray-700 text-xs"
                        />
                      )}
                    </div>

                    {/* Video Section */}
                    <div className="space-y-3">
                      <div className="flex items-center justify-between">
                        <label className="text-[11px] font-black text-secondary-500 uppercase tracking-widest ml-1">Video (Optional)</label>
                        <div className="flex gap-2">
                          <button
                            type="button"
                            onClick={() => setVideoInputMode('file')}
                            className={`text-[10px] font-black px-2 py-0.5 rounded-md ${videoInputMode === 'file' ? 'bg-secondary-500 text-white' : 'bg-gray-100 text-gray-400'}`}
                          >
                            Upload
                          </button>
                          <button
                            type="button"
                            onClick={() => setVideoInputMode('url')}
                            className={`text-[10px] font-black px-2 py-0.5 rounded-md ${videoInputMode === 'url' ? 'bg-secondary-500 text-white' : 'bg-gray-100 text-gray-400'}`}
                          >
                            URL
                          </button>
                        </div>
                      </div>

                      {videoInputMode === 'file' ? (
                        <div className="relative group/upload h-28 rounded-2xl bg-gray-50 border-2 border-dashed border-gray-200 flex items-center justify-center hover:border-secondary-400 transition-all overflow-hidden">
                           {videoPreview ? (
                             <div className="w-full h-full flex flex-col items-center justify-center bg-secondary-50 text-secondary-600 font-black text-[10px] uppercase p-2 relative">
                               <Check size={18} className="mb-1" /> {videoPreview}
                               <button
                                 type="button"
                                 onClick={() => { setVideoFile(null); setVideoPreview(''); setFormData({ ...formData, videoUrl: '' }); }}
                                 className="absolute top-2 right-2 p-1.5 bg-black/60 text-white rounded-full hover:bg-red-500 transition-colors"
                               >
                                 <X size={14} />
                               </button>
                             </div>
                           ) : (
                             <div className="text-gray-400 text-[10px] font-black uppercase text-center p-2">
                               <Upload className="mx-auto mb-1 text-secondary-400" size={20} />
                               Upload Video File (MP4, WebM)
                             </div>
                           )}
                           <input 
                             type="file" accept="video/*" className="absolute inset-0 opacity-0 cursor-pointer"
                             onChange={(e) => {
                               const file = e.target.files?.[0];
                               if (file) {
                                 setVideoFile(file);
                                 setVideoPreview(file.name);
                               }
                             }}
                           />
                        </div>
                      ) : (
                        <input
                          type="url"
                          value={formData.videoUrl}
                          onChange={(e) => {
                            setFormData({ ...formData, videoUrl: e.target.value });
                            setVideoPreview(e.target.value);
                          }}
                          placeholder="https://example.com/video.mp4 or YouTube link"
                          className="w-full px-6 py-4 bg-gray-50/50 rounded-2xl border-2 border-gray-100 focus:border-secondary-300 outline-none font-bold text-gray-700 text-xs"
                        />
                      )}
                    </div>
                  </div>

                  <div className="space-y-2">
                    <label className="text-[11px] font-black text-gray-400 uppercase tracking-widest ml-1">Excerpt (Short Summary)</label>
                    <textarea
                      required
                      value={formData.excerpt}
                      onChange={(e) => setFormData({...formData, excerpt: e.target.value})}
                      placeholder="Short summary for the post card..."
                      className="w-full px-6 py-4 bg-gray-50/50 rounded-2xl border-2 border-gray-100 focus:border-primary-300 outline-none font-bold text-gray-700 transition-all h-24 resize-none"
                    />
                  </div>

                  {/* Content Editor with Toolbar */}
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <label className="text-[11px] font-black text-gray-400 uppercase tracking-widest ml-1">Article Content (Markdown Supported)</label>
                      <div className="flex items-center gap-1 bg-gray-100 p-1 rounded-xl">
                        {[
                          { icon: Bold, action: '**Bold Text**', label: 'Bold' },
                          { icon: Italic, action: '_Italic Text_', label: 'Italic' },
                          { icon: List, action: '\n- Item 1\n- Item 2\n', label: 'List' },
                          { icon: Type, action: '\n## Section Title\n', label: 'Heading' },
                          { icon: LinkIcon, action: '[Link Title](https://)', label: 'Link' }
                        ].map((tool, i) => (
                          <button
                            key={i}
                            type="button"
                            onClick={() => {
                              setFormData({ ...formData, content: formData.content + tool.action });
                            }}
                            className="p-1.5 hover:bg-white rounded-lg transition-all text-gray-500 hover:text-primary-500"
                            title={tool.label}
                          >
                            <tool.icon size={16} />
                          </button>
                        ))}
                      </div>
                    </div>
                    <textarea
                      required
                      value={formData.content}
                      onChange={(e) => setFormData({...formData, content: e.target.value})}
                      placeholder="Write your article story here in markdown..."
                      className="w-full px-6 py-4 bg-gray-50/50 rounded-2xl border-2 border-gray-100 focus:border-primary-300 outline-none font-medium text-gray-700 transition-all h-64 resize-none leading-relaxed"
                    />
                  </div>

                  {/* SEO Optimization Section */}
                  <div className="pt-6 border-t border-gray-100">
                    <div className="flex items-center justify-between mb-6">
                      <h3 className="text-lg font-black text-gray-800 flex items-center gap-2">
                         <Sparkles className="text-yellow-500" size={20} /> SEO Optimization
                      </h3>
                      <div className="flex items-center gap-3 bg-gray-50 px-4 py-2 rounded-2xl border border-gray-100">
                        <span className="text-[10px] font-black text-gray-400 uppercase tracking-widest">SEO Score</span>
                        <div className="w-12 h-6 bg-gray-200 rounded-full overflow-hidden relative">
                           <div 
                             className={`h-full transition-all duration-1000 ${seoScore > 70 ? 'bg-green-500' : seoScore > 40 ? 'bg-yellow-500' : 'bg-red-500'}`}
                             style={{ width: `${seoScore}%` }}
                           />
                        </div>
                        <span className={`text-xs font-black ${seoScore > 70 ? 'text-green-600' : seoScore > 40 ? 'text-yellow-600' : 'text-red-500'}`}>{seoScore}%</span>
                      </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div className="space-y-2">
                        <label className="text-[11px] font-black text-gray-400 uppercase tracking-widest ml-1">URL Slug</label>
                        <div className="relative">
                          <input
                            type="text"
                            value={formData.slug}
                            onChange={(e) => setFormData({...formData, slug: e.target.value})}
                            placeholder="auto-generated-slug"
                            className="w-full px-6 py-4 bg-gray-50/50 rounded-2xl border-2 border-gray-100 focus:border-primary-300 outline-none font-bold text-gray-700 transition-all pr-16"
                          />
                          <button 
                            type="button" 
                            onClick={() => setFormData({...formData, slug: generateSlug(formData.title)})}
                            className="absolute right-4 top-1/2 -translate-y-1/2 text-primary-500 hover:text-primary-600 font-black text-[10px]"
                          >
                            AUTO
                          </button>
                        </div>
                      </div>
                      <div className="space-y-2">
                        <label className="text-[11px] font-black text-gray-400 uppercase tracking-widest ml-1">Meta Title</label>
                        <input
                          type="text"
                          value={formData.metaTitle}
                          onChange={(e) => setFormData({...formData, metaTitle: e.target.value})}
                          placeholder="Meta Title for Google Search Results"
                          className="w-full px-6 py-4 bg-gray-50/50 rounded-2xl border-2 border-gray-100 focus:border-primary-300 outline-none font-bold text-gray-700 transition-all"
                        />
                      </div>
                      <div className="col-span-full space-y-2">
                        <label className="text-[11px] font-black text-gray-400 uppercase tracking-widest ml-1">Meta Description ({formData.metaDescription.length}/160)</label>
                        <textarea
                          value={formData.metaDescription}
                          onChange={(e) => setFormData({...formData, metaDescription: e.target.value.slice(0, 160)})}
                          placeholder="A magnetic summary for search engines..."
                          className="w-full px-6 py-4 bg-gray-50/50 rounded-2xl border-2 border-gray-100 focus:border-primary-300 outline-none font-bold text-gray-700 transition-all h-20 resize-none"
                        />
                      </div>
                      <div className="space-y-2">
                        <label className="text-[11px] font-black text-gray-400 uppercase tracking-widest ml-1">Keywords (Comma separated)</label>
                        <input
                          type="text"
                          value={formData.keywords}
                          onChange={(e) => setFormData({...formData, keywords: e.target.value})}
                          placeholder="coding, robotics, edtech, kids..."
                          className="w-full px-6 py-4 bg-gray-50/50 rounded-2xl border-2 border-gray-100 focus:border-primary-300 outline-none font-bold text-gray-700 transition-all"
                        />
                      </div>
                      <div className="space-y-2">
                        <label className="text-[11px] font-black text-gray-400 uppercase tracking-widest ml-1">Image Alt Text</label>
                        <input
                          type="text"
                          value={formData.imageAlt}
                          onChange={(e) => setFormData({...formData, imageAlt: e.target.value})}
                          placeholder="Describe the image for search engines & accessibility"
                          className="w-full px-6 py-4 bg-gray-50/50 rounded-2xl border-2 border-gray-100 focus:border-primary-300 outline-none font-bold text-gray-700 transition-all"
                        />
                      </div>
                    </div>
                  </div>

                  {/* FAQ Section */}
                  <div className="pt-6 border-t border-gray-100">
                    <div className="flex items-center justify-between mb-4">
                      <h3 className="text-lg font-black text-gray-800 flex items-center gap-2">
                        <HelpCircle className="text-primary-500" size={20} /> Blog FAQ Section
                      </h3>
                      <button 
                        type="button"
                        onClick={() => setFormData({ ...formData, faqs: [...formData.faqs, { question: '', answer: '' }] })}
                        className="text-xs font-black text-primary-500 hover:text-primary-600 flex items-center gap-1 uppercase tracking-widest"
                      >
                        <Plus size={14} /> Add Question
                      </button>
                    </div>
                    <div className="space-y-4">
                      {formData.faqs.map((faq, idx) => (
                        <div key={idx} className="p-6 bg-gray-50 rounded-[1.5rem] border border-gray-100 relative group animate-in slide-in-from-bottom-2">
                          <button 
                            type="button"
                            onClick={() => {
                              const newFaqs = [...formData.faqs];
                              newFaqs.splice(idx, 1);
                              setFormData({ ...formData, faqs: newFaqs });
                            }}
                            className="absolute top-4 right-4 text-gray-300 hover:text-red-500 transition-colors"
                          >
                            <Trash2 size={16} />
                          </button>
                          <div className="space-y-3">
                            <input
                              type="text"
                              value={faq.question}
                              onChange={(e) => {
                                const newFaqs = [...formData.faqs];
                                newFaqs[idx].question = e.target.value;
                                setFormData({ ...formData, faqs: newFaqs });
                              }}
                              placeholder="Question..."
                              className="w-full px-4 py-3 bg-white rounded-xl border border-gray-200 focus:border-primary-300 outline-none font-bold text-gray-700"
                            />
                            <textarea
                              value={faq.answer}
                              onChange={(e) => {
                                const newFaqs = [...formData.faqs];
                                newFaqs[idx].answer = e.target.value;
                                setFormData({ ...formData, faqs: newFaqs });
                              }}
                              placeholder="Answer..."
                              className="w-full px-4 py-3 bg-white rounded-xl border border-gray-200 focus:border-primary-300 outline-none font-medium text-gray-600 h-20 resize-none"
                            />
                          </div>
                        </div>
                      ))}
                    </div>
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
              )}
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
