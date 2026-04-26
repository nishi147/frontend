"use client";

import React, { useEffect, useState } from 'react';
import { Header } from '@/components/layout/Header';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import api from '@/utils/api';
import { useToast } from '@/context/ToastContext';
import { Loader2, Search, Download, Calendar, User, Phone, Mail, MapPin, Briefcase, Tag } from 'lucide-react';

export default function StudentDetailsAdminPage() {
    const [registrations, setRegistrations] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');
    const { showToast } = useToast();

    useEffect(() => {
        fetchRegistrations();
    }, []);

    const fetchRegistrations = async () => {
        try {
            const res = await api.get('/api/registrations');
            if (res.data.success) {
                setRegistrations(res.data.data);
            }
        } catch (error) {
            console.error("Error fetching registrations:", error);
            showToast("Failed to load registrations", "error");
        } finally {
            setLoading(false);
        }
    };

    const filteredRegistrations = registrations.filter(reg => 
        reg.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        reg.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
        reg.itemName?.toLowerCase().includes(searchTerm.toLowerCase())
    );

    const exportToCSV = () => {
        const headers = ['Date', 'Type', 'Item Name', 'Student Name', 'Parent Name', 'Email', 'Phone', 'Place', 'Occupation', 'Age', 'Amount', 'Status'];
        const csvData = filteredRegistrations.map(reg => [
            new Date(reg.createdAt).toLocaleDateString(),
            reg.type,
            reg.itemName,
            reg.name,
            reg.parentName,
            reg.email,
            reg.phone,
            reg.place,
            reg.occupation,
            reg.age || 'N/A',
            reg.amount,
            reg.status
        ]);

        const csvContent = [headers, ...csvData].map(e => e.join(",")).join("\n");
        const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
        const link = document.createElement("a");
        const url = URL.createObjectURL(blob);
        link.setAttribute("href", url);
        link.setAttribute("download", `student_registrations_${new Date().toISOString().split('T')[0]}.csv`);
        link.style.visibility = 'hidden';
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    };

    return (
        <div className="min-h-screen bg-slate-50">
            <Header />
            <div className="container mx-auto px-4 py-12">
                <div className="flex flex-col md:flex-row md:items-center justify-between mb-10 gap-6">
                    <div>
                        <h1 className="text-4xl font-black text-slate-800 tracking-tighter uppercase mb-2">Student Registrations</h1>
                        <p className="text-slate-500 font-bold uppercase text-[10px] tracking-[0.3em]">Manage and view all bootcamp & workshop registrations</p>
                    </div>
                    <div className="flex items-center gap-4">
                        <div className="relative">
                            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
                            <input
                                type="text"
                                placeholder="Search registrations..."
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                                className="pl-12 pr-6 py-3 bg-white border-2 border-slate-200 rounded-2xl font-bold text-slate-700 outline-none focus:border-primary-500 transition-all w-full md:w-64"
                            />
                        </div>
                        <Button onClick={exportToCSV} className="bg-green-600 hover:bg-green-700 rounded-2xl font-black shadow-lg shadow-green-100 flex items-center gap-2">
                            <Download size={18} /> Export
                        </Button>
                    </div>
                </div>

                {/* Content Section */}
                {loading ? (
                    <div className="flex flex-col items-center justify-center py-32 gap-4">
                        <Loader2 className="w-12 h-12 text-primary-500 animate-spin" />
                        <p className="font-black text-slate-400 uppercase tracking-widest text-xs">Accessing Student Records...</p>
                    </div>
                ) : (
                    <div className="bg-white rounded-[2rem] shadow-xl overflow-hidden border border-slate-100">
                        <div className="overflow-x-auto">
                            <table className="w-full text-left border-collapse min-w-[1000px]">
                                <thead>
                                    <tr className="bg-slate-50 border-b border-slate-100">
                                        <th className="p-6 text-[10px] font-black text-slate-400 uppercase tracking-widest">Date</th>
                                        <th className="p-6 text-[10px] font-black text-slate-400 uppercase tracking-widest">Student Info</th>
                                        <th className="p-6 text-[10px] font-black text-slate-400 uppercase tracking-widest">Enrollment</th>
                                        <th className="p-6 text-[10px] font-black text-slate-400 uppercase tracking-widest">Contact</th>
                                        <th className="p-6 text-[10px] font-black text-slate-400 uppercase tracking-widest">Family/Location</th>
                                        <th className="p-6 text-[10px] font-black text-slate-400 uppercase tracking-widest text-center">Status</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-slate-50">
                                    {filteredRegistrations.length > 0 ? (
                                        filteredRegistrations.map((reg) => (
                                            <tr key={reg._id} className="hover:bg-slate-50/50 transition-colors group">
                                                <td className="p-6">
                                                    <div className="flex items-center gap-2 text-slate-500">
                                                        <Calendar size={14} />
                                                        <span className="font-bold text-xs">{new Date(reg.createdAt).toLocaleDateString()}</span>
                                                    </div>
                                                </td>
                                                <td className="p-6">
                                                    <div className="font-black text-slate-800 text-base uppercase leading-tight">{reg.name}</div>
                                                    <div className="text-[10px] font-bold text-slate-400 mt-1 uppercase tracking-tighter">Age: {reg.age || 'N/A'} yrs</div>
                                                </td>
                                                <td className="p-6">
                                                    <div className="flex items-center gap-2 mb-1">
                                                        <Tag size={12} className="text-primary-400" />
                                                        <span className="text-[10px] font-black text-primary-600 uppercase tracking-tight">{reg.type}</span>
                                                    </div>
                                                    <div className="font-bold text-slate-600 text-sm max-w-[200px] truncate" title={reg.itemName}>{reg.itemName}</div>
                                                    <div className="text-green-600 font-black text-[10px] mt-1 tracking-widest">₹{reg.amount}</div>
                                                </td>
                                                <td className="p-6">
                                                    <div className="space-y-1">
                                                        <div className="flex items-center gap-2 text-slate-600">
                                                            <Mail size={12} className="text-slate-400" />
                                                            <span className="text-xs font-bold">{reg.email}</span>
                                                        </div>
                                                        <div className="flex items-center gap-2 text-slate-600">
                                                            <Phone size={12} className="text-slate-400" />
                                                            <span className="text-xs font-bold tracking-wider">{reg.phone}</span>
                                                        </div>
                                                    </div>
                                                </td>
                                                <td className="p-6">
                                                    <div className="space-y-1">
                                                        <div className="flex items-center gap-2 text-slate-700">
                                                            <User size={12} className="text-indigo-400" />
                                                            <span className="text-xs font-black uppercase tracking-tight">{reg.parentName}</span>
                                                        </div>
                                                        <div className="flex items-center gap-2 text-slate-500">
                                                            <MapPin size={12} className="text-slate-400" />
                                                            <span className="text-xs font-bold truncate max-w-[150px]">{reg.place}</span>
                                                        </div>
                                                    </div>
                                                </td>
                                                <td className="p-6 text-center">
                                                    <span className={`px-4 py-1.5 rounded-full text-[10px] font-black uppercase tracking-widest border ${
                                                        reg.status === 'success' 
                                                            ? 'bg-green-50 text-green-700 border-green-100' 
                                                            : reg.status === 'failed'
                                                            ? 'bg-rose-50 text-rose-700 border-rose-100'
                                                            : 'bg-amber-50 text-amber-700 border-amber-100'
                                                    }`}>
                                                        {reg.status}
                                                    </span>
                                                </td>
                                            </tr>
                                        ))
                                    ) : (
                                        <tr>
                                            <td colSpan={6} className="p-32 text-center">
                                                <div className="flex flex-col items-center gap-4 opacity-30 grayscale">
                                                    <div className="text-6xl mb-4">📋</div>
                                                    <p className="font-black uppercase tracking-[0.4em] text-sm text-slate-400">No Dossiers Found</p>
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
