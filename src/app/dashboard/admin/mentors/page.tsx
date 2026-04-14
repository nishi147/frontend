"use client";

import React, { useState, useEffect } from 'react';
import {DashboardLayout} from '@/components/layout/DashboardLayout';
import { Button } from '@/components/ui/Button';
import { Plus, Edit2, Trash2, X, Check, Search, User, Briefcase, Mail, ShieldCheck, Upload, Camera, Image as ImageIcon } from 'lucide-react';
import { useToast } from '@/context/ToastContext';
import { ConfirmationModal } from '@/components/ui/ConfirmationModal';
import api from '@/utils/api';

interface Mentor {
    _id: string;
    name: string;
    email: string;
    specialization: string;
    profilePicture: string;
    bio: string;
    isApprovedTeacher: boolean;
}

export default function AdminMentorsPage() {
    const [mentors, setMentors] = useState<Mentor[]>([]);
    const [loading, setLoading] = useState(true);
    const [showModal, setShowModal] = useState(false);
    const [editingMentor, setEditingMentor] = useState<Mentor | null>(null);
    const [search, setSearch] = useState('');
    const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
    const [mentorToDelete, setMentorToDelete] = useState<string | null>(null);
    const { showToast } = useToast();

    const [formData, setFormData] = useState({
        name: '',
        email: '',
        phone: '',
        password: '',
        specialization: '',
        profilePicture: '',
        bio: '',
        isApprovedTeacher: true
    });
    const [imageFile, setImageFile] = useState<File | null>(null);
    const [imagePreview, setImagePreview] = useState<string | null>(null);


    useEffect(() => {
        fetchMentors();
    }, []);

    const fetchMentors = async () => {
        try {
            const res = await api.get('/api/mentors');
            if (res.data.success) {
                setMentors(res.data.data);
            }
        } catch (error) {
            console.error("Error fetching mentors:", error);
            showToast("Failed to load mentors", "error");
        } finally {
            setLoading(false);
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            const data = new FormData();
            data.append('name', formData.name);
            data.append('email', formData.email);
            data.append('phone', formData.phone);
            if (!editingMentor) data.append('password', formData.password);
            data.append('specialization', formData.specialization);
            data.append('bio', formData.bio);
            data.append('isApprovedTeacher', String(formData.isApprovedTeacher));
            
            if (imageFile) {
                data.append('profilePicture', imageFile);
            } else if (editingMentor) {
                // If editing and no new file, keep the existing URL
                data.append('profilePicture', formData.profilePicture);
            }

            if (editingMentor) {
                await api.put(`/api/users/mentors/${editingMentor._id}`, data);
                showToast("Mentor updated successfully!", "success");
            } else {
                await api.post('/api/users/mentors', data);
                showToast("Mentor created successfully!", "success");
            }
            setShowModal(false);
            setEditingMentor(null);
            resetForm();
            fetchMentors();
        } catch (error: any) {
            showToast(error.response?.data?.message || "Action failed", "error");
        }
    };

    const handleDelete = (id: string) => {
        setMentorToDelete(id);
        setIsDeleteModalOpen(true);
    };

    const confirmDelete = async () => {
        if (!mentorToDelete) return;
        try {
            await api.delete(`/api/users/${mentorToDelete}`);
            showToast("Mentor deleted", "success");
            fetchMentors();
        } catch (error) {
            showToast("Failed to delete", "error");
        } finally {
            setIsDeleteModalOpen(false);
            setMentorToDelete(null);
        }
    };

    const resetForm = () => {
        setFormData({
            name: '',
            email: '',
            phone: '',
            password: '',
            specialization: '',
            profilePicture: '',
            bio: '',
            isApprovedTeacher: true
        });
        setImageFile(null);
        setImagePreview(null);
    };

    const handleEdit = (mentor: Mentor) => {
        setEditingMentor(mentor);
        setFormData({
            name: mentor.name,
            email: mentor.email,
            phone: (mentor as any).phone || '',
            password: '', 
            specialization: mentor.specialization,
            profilePicture: mentor.profilePicture,
            bio: mentor.bio || '',
            isApprovedTeacher: mentor.isApprovedTeacher
        });
        setImagePreview(mentor.profilePicture);
        setImageFile(null);
        setShowModal(true);
    };

    const filteredMentors = mentors.filter(m => 
        m.name?.toLowerCase().includes(search.toLowerCase()) || 
        m.specialization?.toLowerCase().includes(search.toLowerCase())
    );

    return (
        <DashboardLayout>
            <div className="p-4 md:p-8 max-w-7xl mx-auto">
                {/* Header Section */}
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-10">
                    <div>
                        <h1 className="text-3xl md:text-5xl font-black text-slate-900 tracking-tight mb-2">Cool <span className="text-primary-500 underline decoration-8 decoration-primary-100 underline-offset-8">Mentors</span> 👨‍🏫</h1>
                        <p className="text-slate-500 font-bold">Manage your superstar educators and experts.</p>
                    </div>
                    <Button 
                        onClick={() => { resetForm(); setEditingMentor(null); setShowModal(true); }}
                        className="rounded-2xl px-8 py-6 bg-primary-500 hover:bg-primary-600 shadow-xl shadow-primary-500/20 font-black text-lg flex items-center gap-3 transition-all hover:scale-105"
                    >
                        <Plus size={24} /> Add New Mentor
                    </Button>
                </div>

                {/* Stats & Search */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                    <div className="bg-white p-6 rounded-3xl border border-slate-100 shadow-sm flex items-center gap-5">
                        <div className="w-14 h-14 bg-blue-50 rounded-2xl flex items-center justify-center text-blue-600">
                             <Briefcase size={28} />
                        </div>
                        <div>
                            <p className="text-xs font-black text-slate-400 uppercase tracking-widest">Active Mentors</p>
                            <p className="text-3xl font-black text-slate-900">{mentors.length}</p>
                        </div>
                    </div>

                    <div className="md:col-span-2 bg-white p-4 rounded-3xl border border-slate-100 shadow-sm flex items-center px-6 gap-4">
                        <Search size={22} className="text-slate-400" />
                        <input 
                            type="text" 
                            placeholder="Search by name or expertise..." 
                            value={search}
                            onChange={(e) => setSearch(e.target.value)}
                            className="bg-transparent border-none outline-none w-full font-bold text-slate-700 placeholder:text-slate-300 py-2"
                        />
                    </div>
                </div>

                {/* Mentors Grid/List */}
                {loading ? (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {[1, 2, 3].map(i => <div key={i} className="h-64 bg-slate-100 rounded-[2.5rem] animate-pulse" />)}
                    </div>
                ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {filteredMentors.map((mentor) => (
                            <div key={mentor._id} className="bg-white rounded-[2.5rem] border border-slate-50 shadow-sm hover:shadow-xl hover:shadow-slate-200/50 transition-all duration-500 group relative p-6 flex flex-col">
                                <div className="flex items-center gap-5 mb-6">
                                    <div className="w-20 h-20 rounded-[1.5rem] bg-slate-100 overflow-hidden border-4 border-white shadow-md relative group-hover:scale-105 transition-transform duration-500">
                                        {mentor.profilePicture ? (
                                            <img src={mentor.profilePicture} alt={mentor.name} className="w-full h-full object-cover" />
                                        ) : (
                                            <div className="w-full h-full flex items-center justify-center text-slate-300 bg-slate-50">
                                                <User size={32} />
                                            </div>
                                        )}
                                        {mentor.isApprovedTeacher && (
                                            <div className="absolute -bottom-1 -right-1 bg-green-500 text-white p-1 rounded-full border-2 border-white shadow-sm scale-75">
                                                <Check size={12} strokeWidth={4} />
                                            </div>
                                        )}
                                    </div>
                                    <div className="min-w-0 flex-1">
                                        <h3 className="text-xl font-black text-slate-900 truncate tracking-tight">{mentor.name}</h3>
                                        <p className="text-xs font-black text-primary-500 uppercase tracking-widest">{mentor.specialization || "Expert Mentor"}</p>
                                    </div>
                                </div>

                                <div className="space-y-3 mb-6 flex-1">
                                    <div className="flex items-center gap-3 text-slate-500">
                                        <Mail size={16} />
                                        <span className="text-sm font-bold truncate">{mentor.email}</span>
                                    </div>
                                    <div className="flex items-center gap-3 text-slate-500">
                                        <ShieldCheck size={16} />
                                        <span className={`text-[10px] font-black uppercase tracking-widest px-3 py-1 rounded-full ${mentor.isApprovedTeacher ? 'bg-green-50 text-green-600' : 'bg-red-50 text-red-600'}`}>
                                            {mentor.isApprovedTeacher ? 'Verified Expert' : 'Pending Verification'}
                                        </span>
                                    </div>
                                </div>

                                <div className="pt-5 border-t border-slate-50 flex items-center justify-between">
                                    <div className="flex gap-2">
                                        <button 
                                            onClick={() => handleEdit(mentor)}
                                            className="p-3 rounded-2xl bg-slate-50 text-slate-400 hover:bg-primary-50 hover:text-primary-600 transition-all"
                                        >
                                            <Edit2 size={18} />
                                        </button>
                                        <button 
                                            onClick={() => handleDelete(mentor._id)}
                                            className="p-3 rounded-2xl bg-slate-50 text-slate-400 hover:bg-red-50 hover:text-red-600 transition-all"
                                        >
                                            <Trash2 size={18} />
                                        </button>
                                    </div>
                                    <span className="text-[10px] font-black text-slate-300 tracking-widest uppercase">Member Since 2024</span>
                                </div>
                            </div>
                        ))}
                    </div>
                )}

                {/* Empty State */}
                {!loading && filteredMentors.length === 0 && (
                    <div className="bg-white border-4 border-dashed border-slate-100 rounded-[3rem] p-20 text-center">
                        <div className="w-24 h-24 bg-slate-50 rounded-full flex items-center justify-center mx-auto mb-6 text-5xl">🔭</div>
                        <h3 className="text-3xl font-black text-slate-900 mb-2">No Mentors Found</h3>
                        <p className="text-slate-400 font-bold text-lg mb-8">Try adjusting your search or add a new superstar mentor!</p>
                        <Button onClick={() => setShowModal(true)} variant="outline" className="rounded-2xl border-2 font-black border-primary-100 text-primary-600 hover:bg-primary-50">Add First Mentor</Button>
                    </div>
                )}
            </div>

            {/* Modal */}
            {showModal && (
                <div className="fixed inset-0 z-[200] flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-in fade-in duration-300">
                    <div className="bg-white w-full max-w-2xl rounded-[3rem] shadow-2xl overflow-hidden flex flex-col max-h-[90dvh]">
                        <div className="p-8 md:p-10 border-b border-slate-50 flex justify-between items-center bg-slate-50/50">
                            <div>
                                <h2 className="text-3xl font-black text-slate-900 tracking-tight">{editingMentor ? 'Edit Mentor' : 'Add New Mentor'} 👩‍🏫</h2>
                                <p className="text-slate-400 font-bold text-sm">Fill in the mentor's professional details.</p>
                            </div>
                            <button onClick={() => { setShowModal(false); setEditingMentor(null); }} className="p-4 bg-white rounded-2xl shadow-sm text-slate-400 hover:text-slate-900 transition-colors">
                                <X size={24} />
                            </button>
                        </div>

                        <form onSubmit={handleSubmit} className="p-8 md:p-10 space-y-8 overflow-y-auto">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                                <div className="space-y-3">
                                    <label className="text-xs font-black text-slate-400 uppercase tracking-widest ml-1">Full Name</label>
                                    <input 
                                        required
                                        placeholder="e.g. Dr. Sarah Chen"
                                        value={formData.name}
                                        onChange={(e) => setFormData({...formData, name: e.target.value})}
                                        className="w-full p-5 bg-slate-50 rounded-2xl border-2 border-transparent focus:border-primary-500 focus:bg-white transition-all font-bold outline-none text-slate-800"
                                    />
                                </div>
                                <div className="space-y-3">
                                    <label className="text-xs font-black text-slate-400 uppercase tracking-widest ml-1">Email Address</label>
                                    <input 
                                        required
                                        type="email"
                                        disabled={!!editingMentor}
                                        placeholder="mentor@ruzann.com"
                                        value={formData.email}
                                        onChange={(e) => setFormData({...formData, email: e.target.value})}
                                        className="w-full p-5 bg-slate-50 rounded-2xl border-2 border-transparent focus:border-primary-500 focus:bg-white transition-all font-bold outline-none text-slate-800 disabled:opacity-50"
                                    />
                                </div>
                                {!editingMentor && (
                                    <div className="space-y-3">
                                        <label className="text-xs font-black text-slate-400 uppercase tracking-widest ml-1">Temporary Password</label>
                                        <input 
                                            required={!editingMentor}
                                            type="password"
                                            placeholder="••••••••"
                                            value={formData.password}
                                            onChange={(e) => setFormData({...formData, password: e.target.value})}
                                            className="w-full p-5 bg-slate-50 rounded-2xl border-2 border-transparent focus:border-primary-500 focus:bg-white transition-all font-bold outline-none text-slate-800"
                                        />
                                    </div>
                                )}
                                <div className="space-y-3">
                                    <label className="text-xs font-black text-slate-400 uppercase tracking-widest ml-1">Phone Number</label>
                                    <input 
                                        type="tel"
                                        placeholder="10-digit number"
                                        pattern="\d{10}"
                                        maxLength={10}
                                        value={formData.phone}
                                        onChange={(e) => setFormData({...formData, phone: e.target.value.replace(/\D/g, '')})}
                                        className="w-full p-5 bg-slate-50 rounded-2xl border-2 border-transparent focus:border-primary-500 focus:bg-white transition-all font-bold outline-none text-slate-800"
                                    />
                                </div>
                                <div className="space-y-3">
                                    <label className="text-xs font-black text-slate-400 uppercase tracking-widest ml-1">Specialization</label>
                                    <input 
                                        required
                                        placeholder="e.g. Coding Wizard"
                                        value={formData.specialization}
                                        onChange={(e) => setFormData({...formData, specialization: e.target.value})}
                                        className="w-full p-5 bg-slate-50 rounded-2xl border-2 border-transparent focus:border-primary-500 focus:bg-white transition-all font-bold outline-none text-slate-800"
                                    />
                                </div>
                            </div>

                            <div className="space-y-3">
                                <label className="text-xs font-black text-slate-400 uppercase tracking-widest ml-1">Profile Photo</label>
                                <div className="flex flex-col md:flex-row gap-6 items-center">
                                    <div className="relative group w-32 h-32 rounded-[2rem] bg-slate-50 border-4 border-white shadow-xl overflow-hidden flex-shrink-0">
                                        {imagePreview ? (
                                            <img src={imagePreview} alt="Preview" className="w-full h-full object-cover" />
                                        ) : (
                                            <div className="w-full h-full flex items-center justify-center text-slate-300">
                                                <Camera size={40} />
                                            </div>
                                        )}
                                        {imagePreview && (
                                            <button 
                                                type="button"
                                                onClick={() => { setImageFile(null); setImagePreview(null); }}
                                                className="absolute inset-0 bg-red-500/80 flex items-center justify-center text-white opacity-0 group-hover:opacity-100 transition-opacity"
                                            >
                                                <X size={24} />
                                            </button>
                                        )}
                                    </div>
                                    <div className="flex-1 w-full">
                                        <label className="relative flex flex-col items-center justify-center w-full h-32 border-2 border-dashed border-slate-200 rounded-[2rem] hover:bg-slate-50 transition-all cursor-pointer group">
                                            <div className="flex flex-col items-center justify-center pt-5 pb-6">
                                                <div className="w-10 h-10 bg-primary-50 rounded-xl flex items-center justify-center text-primary-500 mb-2 group-hover:scale-110 transition-transform">
                                                    <Upload size={20} />
                                                </div>
                                                <p className="text-xs font-black text-slate-500 tracking-widest uppercase">Click or Drag Image</p>
                                                <p className="text-[10px] text-slate-400 font-bold mt-1">PNG, JPG, WEBP (Max 4MB)</p>
                                            </div>
                                            <input 
                                                type="file" 
                                                className="hidden" 
                                                accept="image/*"
                                                onChange={(e) => {
                                                    const file = e.target.files?.[0];
                                                    if (file) {
                                                        setImageFile(file);
                                                        setImagePreview(URL.createObjectURL(file));
                                                    }
                                                }}
                                            />
                                        </label>
                                    </div>
                                </div>
                            </div>
                            
                            <div className="space-y-3">
                                <label className="text-xs font-black text-slate-400 uppercase tracking-widest ml-1">Mentor Biography / About</label>
                                <textarea 
                                    placeholder="Write a magical bio for this mentor..."
                                    value={formData.bio}
                                    onChange={(e) => setFormData({...formData, bio: e.target.value})}
                                    className="w-full p-5 bg-slate-50 rounded-2xl border-2 border-transparent focus:border-primary-500 focus:bg-white transition-all font-bold outline-none text-slate-800 min-h-[150px] resize-none"
                                />
                                <p className="text-[10px] text-slate-400 font-bold ml-1 italic">This will be displayed on their public profile page.</p>
                            </div>

                            <div className="pt-4 border-t border-slate-50">
                                <label className="text-xs font-black text-slate-400 uppercase tracking-widest mb-4 block ml-1">Verification Status</label>
                                <div className="flex gap-4">
                                    <button 
                                        type="button" 
                                        onClick={() => setFormData({...formData, isApprovedTeacher: true})}
                                        className={`flex-1 p-5 rounded-2xl font-black flex items-center justify-center gap-3 transition-all border-2 ${formData.isApprovedTeacher ? 'bg-primary-500 border-primary-500 text-white shadow-lg' : 'bg-white border-slate-100 text-slate-400'}`}
                                    >
                                        <Check size={20} /> VERIFIED
                                    </button>
                                    <button 
                                        type="button" 
                                        onClick={() => setFormData({...formData, isApprovedTeacher: false})}
                                        className={`flex-1 p-5 rounded-2xl font-black flex items-center justify-center gap-3 transition-all border-2 ${!formData.isApprovedTeacher ? 'bg-slate-900 border-slate-900 text-white shadow-lg' : 'bg-white border-slate-100 text-slate-400'}`}
                                    >
                                        <X size={20} /> PENDING
                                    </button>
                                </div>
                            </div>

                            <div className="flex gap-4 pt-4">
                                <Button type="submit" size="lg" className="flex-1 py-8 rounded-[1.5rem] font-black text-xl bg-primary-500 hover:bg-primary-600 shadow-xl shadow-primary-500/20 transition-all">
                                    {editingMentor ? 'Save Changes' : 'Create Mentor Account'}
                                </Button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
            {/* Confirmation Modal */}
            <ConfirmationModal 
                isOpen={isDeleteModalOpen}
                title="Delete Mentor Account"
                message="Are you sure you want to delete this mentor? This action cannot be undone and will permanently remove their access."
                onConfirm={confirmDelete}
                onCancel={() => {
                    setIsDeleteModalOpen(false);
                    setMentorToDelete(null);
                }}
                confirmText="Yes, Delete Account"
                variant="danger"
            />
        </DashboardLayout>
    );
}
