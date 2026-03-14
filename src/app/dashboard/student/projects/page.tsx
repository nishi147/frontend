"use client";

import React, { useEffect, useState } from 'react';
import { useAuth } from '@/context/AuthContext';
import { DashboardLayout } from '@/components/layout/DashboardLayout';
import { Card, CardContent } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import axios from 'axios';
import { Plus, ExternalLink, RefreshCw, Star } from 'lucide-react';
import { useToast } from '@/context/ToastContext';

interface Project {
    _id: string;
    title: string;
    description: string;
    url: string;
    studentName: string;
    isApproved: boolean;
}

export default function StudentProjectsPage() {
    const { user, loading } = useAuth();
    const [projects, setProjects] = useState<Project[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const { showToast } = useToast();
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [showForm, setShowForm] = useState(false);
    
    // Form State
    const [formData, setFormData] = useState({
        title: '',
        url: '',
        description: '',
        studentName: user?.name || ''
    });

    const fetchMyProjects = async () => {
        try {
            const res = await axios.get('/api/projects/my-projects');
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
            setFormData(prev => ({ ...prev, studentName: user.name }));
            fetchMyProjects();
        }
    }, [user]);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsSubmitting(true);
        try {
            const res = await axios.post('/api/projects', formData);
            if (res.data.success) {
                setProjects([res.data.data, ...projects]);
                setShowForm(false);
                setFormData({ title: '', url: '', description: '', studentName: user?.name || '' });
                showToast("Project submitted for approval! 🚀", "success");
            }
        } catch (err: any) {
            console.error("Submission failed", err);
            showToast(err.response?.data?.message || "Failed to submit project", "error");
        } finally {
            setIsSubmitting(false);
        }
    };

    if (loading || isLoading) {
        return <div className="min-h-screen flex items-center justify-center font-bold text-2xl text-primary-500 animate-pulse">Loading Your Creations... 🎨</div>;
    }

    return (
        <DashboardLayout allowedRoles={['student']}>
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
                <div>
                    <h1 className="text-3xl md:text-5xl font-black text-gray-800 tracking-tighter">
                        My Scratched <span className="text-primary-500">Masterpieces</span> 🎨
                    </h1>
                    <p className="text-gray-500 font-bold mt-2">Share your amazing Scratch projects with the world!</p>
                </div>
                <Button 
                    onClick={() => setShowForm(!showForm)}
                    className="rounded-full px-8 py-6 font-black bg-primary-500 shadow-xl shadow-primary-200 hover:-translate-y-1 transition-all"
                >
                    {showForm ? 'Close Form' : <><Plus className="mr-2" /> Share New Project</>}
                </Button>
            </div>

            {showForm && (
                <Card className="mb-12 border-4 border-primary-100 rounded-[3rem] bg-white shadow-2xl overflow-hidden animate-in zoom-in-95 duration-300">
                    <CardContent className="p-10">
                        <form onSubmit={handleSubmit} className="space-y-6">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                                <div className="space-y-2">
                                    <label className="text-xs font-black uppercase tracking-widest text-gray-400 ml-4">Project Title</label>
                                    <input 
                                        type="text" 
                                        required
                                        placeholder="Epic Solar System Explorer"
                                        className="w-full px-6 py-4 rounded-2xl bg-gray-50 border-2 border-transparent focus:border-primary-500 outline-none font-bold transition-all"
                                        value={formData.title}
                                        onChange={(e) => setFormData({...formData, title: e.target.value})}
                                    />
                                </div>
                                <div className="space-y-2">
                                    <label className="text-xs font-black uppercase tracking-widest text-gray-400 ml-4">Scratch URL</label>
                                    <input 
                                        type="url" 
                                        required
                                        placeholder="https://scratch.mit.edu/projects/..."
                                        className="w-full px-6 py-4 rounded-2xl bg-gray-50 border-2 border-transparent focus:border-primary-500 outline-none font-bold transition-all"
                                        value={formData.url}
                                        onChange={(e) => setFormData({...formData, url: e.target.value})}
                                    />
                                </div>
                            </div>
                            <div className="space-y-2">
                                <label className="text-xs font-black uppercase tracking-widest text-gray-400 ml-4">Short Description</label>
                                <textarea 
                                    required
                                    rows={3}
                                    placeholder="Tell us what makes your project special! What did you learn while building it?"
                                    className="w-full px-6 py-4 rounded-2xl bg-gray-50 border-2 border-transparent focus:border-primary-500 outline-none font-bold transition-all resize-none"
                                    value={formData.description}
                                    onChange={(e) => setFormData({...formData, description: e.target.value})}
                                />
                            </div>
                            <Button 
                                type="submit" 
                                disabled={isSubmitting}
                                className="w-full rounded-2xl py-6 font-black bg-primary-500 hover:bg-primary-600 shadow-xl text-lg flex items-center justify-center gap-3"
                            >
                                {isSubmitting ? <RefreshCw className="animate-spin" /> : 'Blast Off! Submit Project 🚀'}
                            </Button>
                        </form>
                    </CardContent>
                </Card>
            )}

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                {projects.length === 0 ? (
                    <div className="col-span-full bg-white p-20 rounded-[3rem] text-center border-2 border-dashed border-gray-100">
                        <div className="text-6xl mb-6 text-gray-200">✨</div>
                        <h3 className="text-2xl font-black text-gray-400 mb-2">No Projects Shared Yet</h3>
                        <p className="text-gray-400 font-bold mb-8">Share your first masterpiece and get it featured on the homepage!</p>
                        <Button onClick={() => setShowForm(true)} variant="outline" className="rounded-2xl px-10 border-primary-100 text-primary-500 font-black">Get Started</Button>
                    </div>
                ) : (
                    projects.map((project: any) => (
                        <Card key={project._id} className="overflow-hidden border-2 border-white rounded-[2.5rem] bg-white/60 backdrop-blur-sm shadow-xl hover:shadow-2xl transition-all duration-500 flex flex-col group">
                            <div className="relative aspect-video bg-gray-100 overflow-hidden">
                                <iframe
                                    src={`https://scratch.mit.edu/projects/${project.url.split('/').filter(Boolean).pop()}/embed`}
                                    className="w-full h-full border-0"
                                    scrolling="no"
                                />
                                {!project.isApproved && (
                                    <div className="absolute inset-0 bg-black/40 backdrop-blur-[2px] flex items-center justify-center p-6 text-center">
                                        <div className="bg-white/90 px-6 py-3 rounded-2xl shadow-2xl">
                                            <p className="text-amber-600 font-black text-sm uppercase tracking-widest animate-pulse">Pending Admin Approval ⏳</p>
                                        </div>
                                    </div>
                                )}
                            </div>
                            <CardContent className="p-8 flex-1 flex flex-col">
                                <div className="flex justify-between items-start mb-4">
                                    <h3 className="text-2xl font-black text-gray-800 group-hover:text-primary-600 transition-colors">{project.title}</h3>
                                    <span className={`px-4 py-1.5 rounded-full text-[10px] font-black uppercase tracking-widest ${project.isApproved ? 'bg-green-100 text-green-600' : 'bg-amber-100 text-amber-600'}`}>
                                        {project.isApproved ? 'Live' : 'Pending'}
                                    </span>
                                </div>
                                <p className="text-gray-500 font-bold text-sm mb-6 line-clamp-3 leading-relaxed flex-1">{project.description}</p>
                                <div className="flex gap-4">
                                    <a href={project.url} target="_blank" className="flex-1">
                                        <Button variant="outline" className="w-full rounded-2xl py-5 font-black text-primary-600 border-primary-100 hover:bg-primary-50 flex items-center justify-center gap-2">
                                            Scratch Page <ExternalLink size={16} />
                                        </Button>
                                    </a>
                                </div>
                            </CardContent>
                        </Card>
                    ))
                )}
            </div>
        </DashboardLayout>
    );
}
