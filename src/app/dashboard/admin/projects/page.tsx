"use client";

import React, { useEffect, useState } from 'react';
import { useAuth } from '@/context/AuthContext';
import { DashboardLayout } from '@/components/layout/DashboardLayout';
import { Card, CardContent } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import api from '@/utils/api';
import { CheckCircle, XCircle, Trash2, ExternalLink, Star } from 'lucide-react';
import { useToast } from '@/context/ToastContext';

interface Project {
    _id: string;
    title: string;
    description: string;
    url: string;
    studentName: string;
    isApproved: boolean;
}

export default function AdminProjectsPage() {
    const { user, loading } = useAuth();
    const [projects, setProjects] = useState<Project[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const { showToast, confirm } = useToast();

    const [showForm, setShowForm] = useState(false);
    const [formData, setFormData] = useState({
        title: '',
        url: '',
        description: '',
        studentName: '',
        isApproved: true
    });
    const [isSubmitting, setIsSubmitting] = useState(false);

    const fetchProjects = async () => {
        try {
            const res = await api.get('/api/projects/admin/all');
            if (res.data.success) {
                setProjects(res.data.data);
            }
        } catch (err) {
            console.error("Failed to fetch projects", err);
            showToast("Failed to load projects", "error");
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        if (user?.role === 'admin') {
            fetchProjects();
        }
    }, [user]);

    const handleCreate = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsSubmitting(true);
        try {
            const res = await api.post('/api/projects', formData);
            if (res.data.success) {
                setProjects([res.data.data, ...projects]);
                setShowForm(false);
                setFormData({ title: '', url: '', description: '', studentName: '', isApproved: true });
                showToast("Project added successfully!", "success");
            }
        } catch (err: any) {
            console.error("Creation failed", err);
            const errorMsg = err.response?.data?.error || err.response?.data?.message || err.message || "Failed to add project";
            showToast(errorMsg, "error");
        } finally {
            setIsSubmitting(false);
        }
    };

    const handleApprove = async (id: string) => {
        try {
            const res = await api.put(`/api/projects/admin/approve/${id}`);
            if (res.data.success) {
                setProjects(projects.map((p: any) => p._id === id ? res.data.data : p));
                showToast(res.data.data.isApproved ? "Project approved!" : "Approval revoked", "success");
            }
        } catch (err) {
            console.error("Approval failed", err);
            showToast("Failed to update status", "error");
        }
    };

    const handleDelete = async (id: string) => {
        const confirmed = await confirm("Delete Project", "Are you sure you want to delete this project?", { variant: 'danger' });
        if (!confirmed) return;
        try {
            const res = await api.delete(`/api/projects/${id}`);
            if (res.data.success) {
                setProjects(projects.filter((p: any) => p._id !== id));
                showToast("Project deleted", "success");
            }
        } catch (err) {
            console.error("Deletion failed", err);
            showToast("Failed to delete project", "error");
        }
    };

    if (loading || isLoading) {
        return <div className="min-h-screen flex items-center justify-center font-bold text-2xl text-primary-500 animate-pulse">Loading Superstars... 🎨</div>;
    }

    return (
        <DashboardLayout>
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
                <div>
                    <h1 className="text-3xl md:text-5xl font-black text-gray-800 tracking-tighter">
                        Project <span className="text-primary-500">Approvals</span> 🎨
                    </h1>
                    <p className="text-gray-500 font-bold mt-2">Review and showcase the best student creations on the homepage.</p>
                </div>
                <Button 
                    onClick={() => setShowForm(!showForm)}
                    className="rounded-full px-8 py-6 font-black bg-primary-500 shadow-xl shadow-primary-200 hover:-translate-y-1 transition-all"
                >
                    {showForm ? 'Close Form' : 'Add New Project'}
                </Button>
            </div>

            {showForm && (
                <Card className="mb-12 border-4 border-primary-100 rounded-[3rem] bg-white shadow-2xl overflow-hidden animate-in zoom-in-95 duration-300">
                    <CardContent className="p-10">
                        <form onSubmit={handleCreate} className="space-y-6">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                                <div className="space-y-2">
                                    <label className="text-xs font-black uppercase tracking-widest text-gray-400 ml-4">Project Title</label>
                                    <input 
                                        type="text" 
                                        required
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
                                        className="w-full px-6 py-4 rounded-2xl bg-gray-50 border-2 border-transparent focus:border-primary-500 outline-none font-bold transition-all"
                                        value={formData.url}
                                        onChange={(e) => setFormData({...formData, url: e.target.value})}
                                    />
                                </div>
                                <div className="space-y-2">
                                    <label className="text-xs font-black uppercase tracking-widest text-gray-400 ml-4">Student Name</label>
                                    <input 
                                        type="text" 
                                        required
                                        className="w-full px-6 py-4 rounded-2xl bg-gray-50 border-2 border-transparent focus:border-primary-500 outline-none font-bold transition-all"
                                        value={formData.studentName}
                                        onChange={(e) => setFormData({...formData, studentName: e.target.value})}
                                    />
                                </div>
                            </div>
                            <div className="space-y-2">
                                <label className="text-xs font-black uppercase tracking-widest text-gray-400 ml-4">Short Description</label>
                                <textarea 
                                    required
                                    rows={3}
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
                                {isSubmitting ? 'Adding...' : 'Add Project to Showcase 🚀'}
                            </Button>
                        </form>
                    </CardContent>
                </Card>
            )}

            <div className="grid grid-cols-1 gap-6">
                {projects.length === 0 ? (
                    <div className="bg-white p-20 rounded-[3rem] text-center border-2 border-dashed border-gray-100">
                        <p className="text-gray-400 font-black text-xl">No projects submitted yet! 😴</p>
                    </div>
                ) : (
                    projects.map((project: any) => (
                        <Card key={project._id} className="overflow-hidden border-2 border-gray-100 rounded-[2rem] bg-white group hover:border-primary-200 transition-all">
                            <CardContent className="p-0">
                                <div className="flex flex-col md:flex-row">
                                    <div className="w-full md:w-72 bg-gray-50 aspect-video md:aspect-auto border-b md:border-b-0 md:border-r border-gray-100 relative">
                                        <iframe
                                            src={`https://scratch.mit.edu/projects/${project.url.split('/').filter(Boolean).pop()}/embed`}
                                            className="w-full h-full border-0"
                                            scrolling="no"
                                        />
                                    </div>
                                    <div className="p-8 flex-1 flex flex-col justify-between">
                                        <div>
                                            <div className="flex items-center justify-between mb-4">
                                                <div className="flex items-center gap-2">
                                                    <span className={`px-4 py-1.5 rounded-full text-[10px] font-black uppercase tracking-widest ${project.isApproved ? 'bg-green-100 text-green-600' : 'bg-amber-100 text-amber-600'}`}>
                                                        {project.isApproved ? 'Approved & Live' : 'Pending Review'}
                                                    </span>
                                                    <a href={project.url} target="_blank" className="text-primary-500 hover:scale-110 transition-transform"><ExternalLink size={18} /></a>
                                                </div>
                                                <button onClick={() => handleDelete(project._id)} className="text-gray-300 hover:text-red-500 transition-colors"><Trash2 size={20} /></button>
                                            </div>
                                            <h3 className="text-2xl font-black text-gray-800 mb-2">{project.title}</h3>
                                            <div className="flex items-center gap-2 text-gray-400 font-bold text-sm mb-4">
                                                <Star size={14} className="text-yellow-400 fill-current" />
                                                By {project.studentName}
                                            </div>
                                            <p className="text-gray-500 font-medium leading-relaxed">{project.description}</p>
                                        </div>
                                        <div className="mt-8 pt-6 border-t border-gray-50 flex gap-4">
                                            <Button 
                                                onClick={() => handleApprove(project._id)}
                                                className={`flex-1 rounded-2xl py-6 font-black ${project.isApproved ? 'bg-amber-500 hover:bg-amber-600' : 'bg-green-500 hover:bg-green-600'} shadow-lg text-white`}
                                            >
                                                {project.isApproved ? <><XCircle className="mr-2" /> Revoke Approval</> : <><CheckCircle className="mr-2" /> Approve Project</>}
                                            </Button>
                                        </div>
                                    </div>
                                </div>
                            </CardContent>
                        </Card>
                    ))
                )}
            </div>
        </DashboardLayout>
    );
}
