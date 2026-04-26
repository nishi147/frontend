"use client";

import React, { useEffect, useState } from 'react';
import { Header } from '@/components/layout/Header';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import api from '@/utils/api';
import { useToast } from '@/context/ToastContext';
import { Loader2, Search, Mail, Phone, Trash2, UserCheck, GraduationCap } from 'lucide-react';

export default function RegisteredStudentsPage() {
    const [students, setStudents] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');
    const { showToast } = useToast();

    useEffect(() => {
        fetchStudents();
    }, []);

    const fetchStudents = async () => {
        try {
            const res = await api.get('/api/users');
            if (res.data.success) {
                const onlyStudents = res.data.data.filter((u: any) => u.role === 'student');
                setStudents(onlyStudents);
            }
        } catch (error) {
            console.error("Error fetching students:", error);
            showToast("Failed to load student accounts", "error");
        } finally {
            setLoading(false);
        }
    };

    const deleteStudent = async (id: string) => {
        if (!window.confirm("Delete this student account? This cannot be undone.")) return;
        try {
            const res = await api.delete(`/api/users/${id}`);
            if (res.data.success) {
                showToast("Student account deleted", "success");
                fetchStudents();
            }
        } catch (err: any) {
            showToast("Delete failed", "error");
        }
    };

    const filteredStudents = students.filter(s => 
        s.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        s.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
        (s.phone && s.phone.includes(searchTerm))
    );

    return (
        <div className="min-h-screen bg-slate-50">
            <Header />
            <div className="container mx-auto px-4 py-12">
                <div className="flex flex-col md:flex-row md:items-center justify-between mb-10 gap-6">
                    <div>
                        <h1 className="text-4xl font-black text-slate-800 tracking-tighter uppercase mb-2">Registered Students</h1>
                        <p className="text-slate-500 font-bold uppercase text-[10px] tracking-[0.3em]">Manage all student platform accounts</p>
                    </div>
                    <div className="relative">
                        <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
                        <input
                            type="text"
                            placeholder="Search by name, email or phone..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            className="pl-12 pr-6 py-3 bg-white border-2 border-slate-200 rounded-2xl font-bold text-slate-700 outline-none focus:border-primary-500 transition-all w-full md:w-80"
                        />
                    </div>
                </div>

                {loading ? (
                    <div className="flex flex-col items-center justify-center py-32 gap-4">
                        <Loader2 className="w-12 h-12 text-primary-500 animate-spin" />
                        <p className="font-black text-slate-400 uppercase tracking-widest text-xs">Accessing Student Directory...</p>
                    </div>
                ) : (
                    <div className="bg-white rounded-[2rem] shadow-xl overflow-hidden border border-slate-100">
                        <div className="overflow-x-auto">
                            <table className="w-full text-left border-collapse min-w-[800px]">
                                <thead>
                                    <tr className="bg-slate-50 border-b border-slate-100">
                                        <th className="p-6 text-[10px] font-black text-slate-400 uppercase tracking-widest">Student Identity</th>
                                        <th className="p-6 text-[10px] font-black text-slate-400 uppercase tracking-widest">Contact Details</th>
                                        <th className="p-6 text-[10px] font-black text-slate-400 uppercase tracking-widest text-center">Status</th>
                                        <th className="p-6 text-[10px] font-black text-slate-400 uppercase tracking-widest text-right">Actions</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-slate-50">
                                    {filteredStudents.length > 0 ? (
                                        filteredStudents.map((s) => (
                                            <tr key={s._id} className="hover:bg-primary-50/20 transition-colors group">
                                                <td className="p-6">
                                                    <div className="flex items-center gap-4">
                                                        <div className="w-12 h-12 rounded-2xl bg-primary-500 flex items-center justify-center text-white font-black text-xl shadow-lg shadow-primary-100">
                                                            {s.name[0].toUpperCase()}
                                                        </div>
                                                        <div>
                                                            <div className="font-black text-slate-800 text-lg uppercase tracking-tight">{s.name}</div>
                                                            <div className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Joined: {new Date(s.createdAt).toLocaleDateString()}</div>
                                                        </div>
                                                    </div>
                                                </td>
                                                <td className="p-6">
                                                    <div className="space-y-1">
                                                        <div className="flex items-center gap-2 text-slate-600">
                                                            <Mail size={14} className="text-slate-400" />
                                                            <span className="font-bold text-sm">{s.email}</span>
                                                        </div>
                                                        <div className="flex items-center gap-2 text-slate-600">
                                                            <Phone size={14} className="text-slate-400" />
                                                            <span className="font-bold text-sm tracking-wider">{s.phone || 'N/A'}</span>
                                                        </div>
                                                    </div>
                                                </td>
                                                <td className="p-6 text-center">
                                                    <div className="inline-flex items-center gap-2 px-4 py-1.5 bg-green-50 text-green-600 rounded-full text-[10px] font-black uppercase tracking-widest border border-green-100">
                                                        <UserCheck size={14} /> Active Account
                                                    </div>
                                                </td>
                                                <td className="p-6 text-right">
                                                    <button 
                                                        onClick={() => deleteStudent(s._id)}
                                                        className="p-3 bg-red-50 text-red-500 hover:bg-red-500 hover:text-white rounded-2xl transition-all shadow-md active:scale-95 border-2 border-red-100"
                                                        title="Delete Student"
                                                    >
                                                        <Trash2 size={18} />
                                                    </button>
                                                </td>
                                            </tr>
                                        ))
                                    ) : (
                                        <tr>
                                            <td colSpan={4} className="p-32 text-center">
                                                <div className="flex flex-col items-center gap-4 opacity-20 grayscale">
                                                    <GraduationCap size={64} />
                                                    <p className="font-black uppercase tracking-[0.4em] text-sm">No Registered Students</p>
                                                </div>
                                            </td>
                                        </tr>
                                    )}
                                </tbody>
                            </table>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}
