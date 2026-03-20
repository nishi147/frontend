"use client";

import React, { useEffect, useState } from 'react';
import { DashboardLayout } from '@/components/layout/DashboardLayout';
import { Card, CardContent } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import axios from 'axios';
import { Trash2, Edit2, Plus, CheckCircle, XCircle, Loader2 } from 'lucide-react';
import { useToast } from '@/context/ToastContext';

const API = process.env.NEXT_PUBLIC_API_URL;

export default function CategoryManagement() {
    const [categories, setCategories] = useState<any[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editingCategory, setEditingCategory] = useState<any>(null);
    const [formData, setFormData] = useState({
        name: '',
        icon: '📚',
        status: 'active'
    });
    const { showToast, confirm } = useToast();

    const fetchCategories = async () => {
        try {
            const res = await axios.get(`${API}/api/categories`);
            if (res.data.success) {
                setCategories(res.data.data);
            }
        } catch (err) {
            showToast('Failed to fetch categories', 'error');
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        fetchCategories();
    }, []);

    const resetForm = () => {
        setFormData({ name: '', icon: '📚', status: 'active' });
        setEditingCategory(null);
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            if (editingCategory) {
                await axios.put(`${API}/api/categories/${editingCategory._id}`, formData, { withCredentials: true });
                showToast('Category updated successfully', 'success');
            } else {
                await axios.post(`${API}/api/categories`, formData, { withCredentials: true });
                showToast('Category created successfully', 'success');
            }
            setIsModalOpen(false);
            resetForm();
            fetchCategories();
        } catch (err: any) {
            showToast(err.response?.data?.message || 'Action failed', 'error');
        }
    };

    const handleDelete = async (id: string, name: string) => {
        const isConfirmed = await (confirm as any)(`Delete ${name}?`, 'This will remove the category permanently.');
        if (!isConfirmed) return;

        try {
            await axios.delete(`${API}/api/categories/${id}`, { withCredentials: true });
            showToast('Category deleted', 'success');
            fetchCategories();
        } catch (err: any) {
            showToast(err.response?.data?.message || 'Delete failed', 'error');
        }
    };

    if (isLoading) {
        return (
            <DashboardLayout allowedRoles={['admin']}>
                <div className="flex items-center justify-center p-20">
                    <Loader2 className="w-10 h-10 animate-spin text-primary-500" />
                </div>
            </DashboardLayout>
        );
    }

    return (
        <DashboardLayout allowedRoles={['admin']}>
            <div className="flex justify-between items-center mb-10">
                <div>
                    <h1 className="text-4xl font-black text-gray-800 tracking-tighter">Course <span className="text-secondary-500">Categories</span></h1>
                    <p className="text-gray-500 font-bold uppercase text-[10px] tracking-[0.2em] mt-1">Classification & Organization Hub</p>
                </div>
                <Button onClick={() => { resetForm(); setIsModalOpen(true); }} className="gap-2 px-8 shadow-2xl hover:scale-105 transition-all">
                    <Plus size={20} /> Add Category
                </Button>
            </div>

            <div className="bg-white rounded-[2.5rem] shadow-2xl border border-gray-100 overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="w-full text-left border-collapse">
                        <thead>
                            <tr className="bg-gray-50/50 border-b border-gray-100 font-black text-gray-400 uppercase text-[10px] tracking-[0.2em]">
                                <th className="px-10 py-8">Category Identity</th>
                                <th className="px-10 py-8">Status</th>
                                <th className="px-10 py-8 text-right">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-50">
                            {categories.map((cat) => (
                                <tr key={cat._id} className="hover:bg-primary-50/30 transition-all group">
                                    <td className="px-10 py-8">
                                        <div className="flex items-center gap-6">
                                            <div className="w-16 h-16 bg-white border-2 border-gray-100 rounded-3xl flex items-center justify-center text-3xl shadow-sm group-hover:scale-110 group-hover:rotate-6 transition-all duration-500">
                                                {cat.icon || '📚'}
                                            </div>
                                            <div>
                                                <p className="font-black text-gray-800 text-xl tracking-tight leading-none">{cat.name}</p>
                                                <p className="text-gray-400 text-xs font-bold mt-2 uppercase tracking-widest">{cat.courseCount || 0} Courses Linked</p>
                                            </div>
                                        </div>
                                    </td>
                                    <td className="px-10 py-8">
                                        <span className={`px-4 py-2 rounded-full font-black uppercase text-[9px] tracking-widest flex items-center gap-2 w-fit ${cat.status === 'active' ? 'bg-green-50 text-green-600' : 'bg-red-50 text-red-600'}`}>
                                            <div className={`w-1.5 h-1.5 rounded-full ${cat.status === 'active' ? 'bg-green-500 animate-pulse' : 'bg-red-500'}`}></div>
                                            {cat.status}
                                        </span>
                                    </td>
                                    <td className="px-10 py-8 text-right">
                                        <div className="flex justify-end gap-3">
                                            <button 
                                                onClick={() => {
                                                    setEditingCategory(cat);
                                                    setFormData({ name: cat.name, icon: cat.icon || '📚', status: cat.status });
                                                    setIsModalOpen(true);
                                                }}
                                                className="p-4 bg-gray-50 text-gray-400 rounded-2xl hover:bg-secondary-50 hover:text-secondary-600 transition-all shadow-sm"
                                            >
                                                <Edit2 size={18} />
                                            </button>
                                            <button 
                                                onClick={() => handleDelete(cat._id, cat.name)}
                                                className="p-4 bg-gray-50 text-gray-400 rounded-2xl hover:bg-red-50 hover:text-red-600 transition-all shadow-sm"
                                            >
                                                <Trash2 size={18} />
                                            </button>
                                        </div>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>

            {/* Modal */}
            {isModalOpen && (
                <div className="fixed inset-0 z-[200] flex items-center justify-center bg-slate-900/60 backdrop-blur-md p-4 sm:p-6">
                    <div className="w-full max-w-4xl bg-white shadow-2xl rounded-[2rem] md:rounded-[3rem] overflow-hidden animate-in zoom-in-95 duration-400">
                        <div className="p-6 md:p-10 border-b border-gray-100 flex justify-between items-center bg-gray-50/80">
                            <h2 className="text-2xl md:text-3xl font-black text-gray-800 tracking-tighter">{editingCategory ? 'Modify' : 'Create'} Category</h2>
                            <button onClick={() => setIsModalOpen(false)} className="w-10 h-10 flex items-center justify-center rounded-full bg-white text-gray-400 hover:text-red-500 hover:bg-red-50 font-bold transition-all shadow-sm">✕</button>
                        </div>
                        <form onSubmit={handleSubmit} className="p-6 md:p-10 space-y-6 md:space-y-8">
                            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 md:gap-8 items-start">
                                <div>
                                    <label className="text-[10px] md:text-xs font-black text-gray-400 uppercase tracking-[0.2em] mb-3 block">Category Name</label>
                                    <input 
                                        required 
                                        placeholder="e.g. Robotics & Automation" 
                                        value={formData.name} 
                                        onChange={(e) => setFormData({...formData, name: e.target.value})}
                                        className="w-full p-4 md:p-5 bg-gray-50 border-2 border-transparent focus:border-primary-500 focus:bg-white rounded-2xl md:rounded-[1.5rem] font-bold outline-none transition-all placeholder:text-gray-300 text-gray-700" 
                                    />
                                </div>
                                <div>
                                    <label className="text-[10px] md:text-xs font-black text-gray-400 uppercase tracking-[0.2em] mb-3 block">Icon / Emoji</label>
                                    <input 
                                        placeholder="🤖" 
                                        value={formData.icon} 
                                        onChange={(e) => setFormData({...formData, icon: e.target.value})}
                                        className="w-full p-4 md:p-5 bg-gray-50 border-2 border-transparent focus:border-primary-500 focus:bg-white rounded-2xl md:rounded-[1.5rem] font-bold outline-none transition-all text-2xl text-center md:text-left" 
                                    />
                                    <p className="text-[10px] text-gray-400 font-bold mt-2 ml-1">Tip: Use Win + . to pick an emoji!</p>
                                </div>
                                <div>
                                    <label className="text-[10px] md:text-xs font-black text-gray-400 uppercase tracking-[0.2em] mb-3 block">Status</label>
                                    <div className="flex gap-3">
                                        {['active', 'inactive'].map((s) => (
                                            <button
                                                key={s}
                                                type="button"
                                                onClick={() => setFormData({...formData, status: s})}
                                                className={`flex-1 p-4 md:p-5 rounded-2xl font-black uppercase tracking-widest text-[10px] md:text-[11px] border-2 transition-all ${formData.status === s ? 'bg-primary-500 border-primary-500 text-white shadow-lg shadow-primary-500/30 ring-4 ring-primary-50' : 'bg-white border-gray-100 text-gray-400 hover:border-gray-200 hover:bg-gray-50'}`}
                                            >
                                                {s}
                                            </button>
                                        ))}
                                    </div>
                                </div>
                            </div>
                            
                            <Button type="submit" className="w-full md:w-auto md:min-w-[300px] md:ml-auto md:block py-5 md:py-6 text-lg md:text-xl font-black rounded-[1.5rem] shadow-xl shadow-primary-500/20 hover:scale-[1.02] hover:-translate-y-1 transition-all mt-4">
                                {editingCategory ? 'Update Category' : 'Authorize Category'}
                            </Button>
                        </form>
                    </div>
                </div>
            )}
        </DashboardLayout>
    );
}
