"use client";

import React, { useEffect, useState } from 'react';
import { useAuth } from '@/context/AuthContext';
import { DashboardLayout } from '@/components/layout/DashboardLayout';
import { Card, CardContent } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import api from '@/utils/api';
import { useSearchParams } from 'next/navigation';
import { Trash2, ExternalLink, Sparkles, Plus, Loader2, Upload } from 'lucide-react';
import { useToast } from '@/context/ToastContext';

interface Project {
    _id: string;
    title: string;
    description: string;
    url: string;
    thumbnail?: string;
    isApproved: boolean;
    createdAt: string;
}

export default function StudentProjectsPage() {
    const { user, loading } = useAuth();
    const searchParams = useSearchParams();
    const [projects, setProjects] = useState<Project[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const { showToast, confirm } = useToast();

    const [showForm, setShowForm] = useState(false);
    const [formData, setFormData] = useState({
        title: '',
        url: '',
        description: '',
    });
    const [thumbnail, setThumbnail] = useState<File | null>(null);
    const [isSubmitting, setIsSubmitting] = useState(false);

    const fetchMyProjects = async () => {
        try {
            const res = await api.get('/api/projects/my-projects');
            if (res.data.success) {
                setProjects(res.data.data);
            }
        } catch (err) {
            console.error("Failed to fetch my projects", err);
            showToast("Failed to load your projects", "error");
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        if (user) {
            fetchMyProjects();
        }
        
        // Auto-open form if ?upload=true
        if (searchParams.get('upload') === 'true') {
            setShowForm(true);
        }
    }, [user, searchParams]);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        
        // Basic Scratch URL Validation
        if (!formData.url.includes('scratch.mit.edu/projects/')) {
            showToast("Please provide a valid Scratch project URL", "error");
            return;
        }

        setIsSubmitting(true);
        try {
            const data = new FormData();
            data.append('title', formData.title);
            data.append('url', formData.url);
            data.append('description', formData.description);
            data.append('studentName', user?.name || "Student");
            if (thumbnail) {
                data.append('thumbnail', thumbnail);
            }

            const res = await api.post('/api/projects', data, {
                headers: { 'Content-Type': 'multipart/form-data' }
            });

            if (res.data.success) {
                setProjects([res.data.data, ...projects]);
                setShowForm(false);
                setFormData({ title: '', url: '', description: '' });
                setThumbnail(null);
                showToast("Project submitted for review! 🚀", "success");
            }
        } catch (err: any) {
            console.error("Submission failed", err);
            showToast(err.response?.data?.message || "Failed to submit project", "error");
        } finally {
            setIsSubmitting(false);
        }
    };

    const handleDelete = async (id: string) => {
        const confirmed = await confirm(
            "Delete Project", 
            "Are you sure you want to remove this project?", 
            { variant: 'danger' }
        );
        if (!confirmed) return;

        try {
            const res = await api.delete(`/api/projects/${id}`);
            if (res.data.success) {
                setProjects(projects.filter(p => p._id !== id));
                showToast("Project removed", "success");
            }
        } catch (err) {
            console.error("Deletion failed", err);
            showToast("Failed to delete project", "error");
        }
    };

    if (loading || isLoading) {
        return (
            <div className="min-h-screen flex items-center justify-center font-black text-2xl text-primary-500 animate-pulse">
                Preparing your gallery... 🎨
            </div>
        );
    }

    return (
        <DashboardLayout>
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-10 gap-6">
                <div>
                    <h1 className="text-3xl md:text-5xl font-black text-gray-800 tracking-tighter">
                        My <span className="text-primary-500">Showcase</span> 🚀
                    </h1>
                    <p className="text-gray-500 font-bold mt-2">Upload your Scratch projects and show them to the world!</p>
                </div>
                <Button 
                    onClick={() => setShowForm(!showForm)}
                    className={`rounded-full px-8 py-6 font-black shadow-xl transition-all flex items-center gap-2 ${
                        showForm ? 'bg-gray-100 text-gray-500 hover:bg-gray-200' : 'bg-primary-500 text-white shadow-primary-200 hover:-translate-y-1'
                    }`}
                >
                    {showForm ? 'Cancel' : <><Plus size={20} /> Upload New Project</>}
                </Button>
            </div>

            {showForm && (
                <Card className="mb-12 border-4 border-primary-100 rounded-[3rem] bg-white shadow-2xl overflow-hidden animate-in zoom-in-95 duration-300">
                    <CardContent className="p-8 md:p-12">
                        <form onSubmit={handleSubmit} className="space-y-8">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                                <div className="space-y-3">
                                    <label className="text-xs font-black uppercase tracking-widest text-gray-400 ml-4">Project Title</label>
                                    <input 
                                        type="text" 
                                        required
                                        placeholder="My Cool Game"
                                        className="w-full px-6 py-4 rounded-2xl bg-gray-50 border-2 border-transparent focus:border-primary-500 outline-none font-bold transition-all"
                                        value={formData.title}
                                        onChange={(e) => setFormData({...formData, title: e.target.value})}
                                    />
                                </div>
                                <div className="space-y-3">
                                    <label className="text-xs font-black uppercase tracking-widest text-gray-400 ml-4">Scratch Project Link</label>
                                    <input 
                                        type="url" 
                                        required
                                        placeholder="https://scratch.mit.edu/projects/12345678"
                                        className="w-full px-6 py-4 rounded-2xl bg-gray-50 border-2 border-transparent focus:border-primary-500 outline-none font-bold transition-all"
                                        value={formData.url}
                                        onChange={(e) => setFormData({...formData, url: e.target.value})}
                                    />
                                </div>
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                                <div className="space-y-3">
                                    <label className="text-xs font-black uppercase tracking-widest text-gray-400 ml-4">Project Description</label>
                                    <textarea 
                                        required
                                        rows={4}
                                        placeholder="Tell us what makes your project special!"
                                        className="w-full px-6 py-4 rounded-2xl bg-gray-50 border-2 border-transparent focus:border-primary-500 outline-none font-bold transition-all resize-none"
                                        value={formData.description}
                                        onChange={(e) => setFormData({...formData, description: e.target.value})}
                                    />
                                </div>
                                <div className="space-y-3">
                                    <label className="text-xs font-black uppercase tracking-widest text-gray-400 ml-4">Cover Image (Thumbnail)</label>
                                    <div className="relative group h-[124px]">
                                        <input 
                                            type="file" 
                                            accept="image/*"
                                            className="absolute inset-0 opacity-0 cursor-pointer z-10"
                                            onChange={(e) => setThumbnail(e.target.files?.[0] || null)}
                                        />
                                        <div className="w-full h-full border-2 border-dashed border-gray-200 rounded-2xl flex flex-col items-center justify-center gap-2 group-hover:border-primary-300 transition-colors bg-gray-50">
                                            {thumbnail ? (
                                                <div className="flex items-center gap-2 text-primary-600 font-bold">
                                                    <Upload size={20} />
                                                    <span className="truncate max-w-[200px]">{thumbnail.name}</span>
                                                </div>
                                            ) : (
                                                <div className="flex flex-col items-center text-gray-400 animate-pulse">
                                                    <Upload size={24} />
                                                    <span className="text-[10px] font-black uppercase tracking-tighter">Click to select image</span>
                                                </div>
                                            )}
                                        </div>
                                    </div>
                                    <p className="text-[10px] text-gray-400 font-bold ml-4">* Max size 5MB. PNG or JPG suggested.</p>
                                </div>
                            </div>

                            <Button 
                                type="submit" 
                                disabled={isSubmitting}
                                className="w-full rounded-2xl py-6 font-black bg-primary-500 hover:bg-primary-600 shadow-xl text-lg flex items-center justify-center gap-3 transition-all active:scale-95"
                            >
                                {isSubmitting ? (
                                    <>
                                        <Loader2 className="animate-spin" />
                                        Submitting...
                                    </>
                                ) : (
                                    <>Share My Creation 🚀</>
                                )}
                            </Button>
                        </form>
                    </CardContent>
                </Card>
            )}

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                {projects.length === 0 ? (
                    <div className="col-span-full bg-white p-24 rounded-[3.5rem] text-center border-4 border-dashed border-gray-100">
                        <div className="w-20 h-20 bg-gray-50 rounded-full flex items-center justify-center mx-auto mb-6">
                            <Sparkles className="text-gray-200 w-10 h-10" />
                        </div>
                        <h3 className="text-2xl font-black text-gray-800 mb-2">No projects yet!</h3>
                        <p className="text-gray-400 font-bold max-w-sm mx-auto">Upload your first magic creation and get featured on our homepage!</p>
                    </div>
                ) : (
                    projects.map((project) => (
                        <Card key={project._id} className="overflow-hidden border-2 border-gray-100 rounded-[2.5rem] bg-white group hover:border-primary-200 hover:shadow-2xl hover:shadow-primary-100/50 transition-all duration-500 flex flex-col">
                            {/* Preview Area */}
                            <div className="relative aspect-video bg-gray-50 border-b-2 border-gray-100 overflow-hidden">
                                <iframe
                                    src={`https://scratch.mit.edu/projects/${project.url.split('/').filter(Boolean).pop()}/embed`}
                                    className="w-full h-full border-0 group-hover:scale-105 transition-transform duration-700 pointer-events-none"
                                    scrolling="no"
                                />
                                <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent pointer-events-none" />
                                <div className="absolute top-4 right-4 flex gap-2">
                                    <span className={`px-4 py-1.5 rounded-full text-[10px] font-black uppercase tracking-widest backdrop-blur-md shadow-lg ${
                                        project.isApproved 
                                            ? 'bg-green-500/90 text-white' 
                                            : 'bg-amber-500/90 text-white'
                                    }`}>
                                        {project.isApproved ? 'Approved' : 'Pending Review'}
                                    </span>
                                </div>
                            </div>

                            <CardContent className="p-8 flex flex-col flex-1">
                                <div className="flex items-start justify-between mb-4">
                                    <h3 className="text-xl font-black text-gray-800 line-clamp-1">{project.title}</h3>
                                    <div className="flex items-center gap-3">
                                        <a 
                                            href={project.url} 
                                            target="_blank" 
                                            rel="noopener noreferrer"
                                            className="text-primary-500 hover:text-primary-600 transition-colors"
                                        >
                                            <ExternalLink size={18} />
                                        </a>
                                        <button 
                                            onClick={() => handleDelete(project._id)}
                                            className="text-gray-300 hover:text-red-500 transition-colors"
                                        >
                                            <Trash2 size={18} />
                                        </button>
                                    </div>
                                </div>
                                <p className="text-gray-500 font-medium leading-relaxed line-clamp-2 mb-6 flex-1 italic text-sm">
                                    "{project.description}"
                                </p>
                                <div className="pt-6 border-t border-gray-50 flex items-center justify-between text-[10px] font-black uppercase tracking-widest text-gray-400">
                                    <span>Submitted on {new Date(project.createdAt).toLocaleDateString()}</span>
                                </div>
                            </CardContent>
                        </Card>
                    ))
                )}
            </div>
        </DashboardLayout>
    );
}
