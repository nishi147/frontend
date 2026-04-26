"use client";

import React, { useEffect, useState } from 'react';
import { DashboardLayout } from '@/components/layout/DashboardLayout';
import { Card, CardContent } from '@/components/ui/Card';
import api from '@/utils/api';
import { Users, Search, Filter, Download, Mail, Phone, MapPin, Briefcase, GraduationCap, Calendar, Ticket, Sparkles } from 'lucide-react';
import { useToast } from '@/context/ToastContext';

export default function StudentDetailsPage() {
    const [details, setDetails] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');
    const { showToast } = useToast();

    useEffect(() => {
        fetchDetails();
    }, []);

    const fetchDetails = async () => {
        try {
            const res = await api.get('/api/student-details');
            if (res.data.success) {
                setDetails(res.data.data);
            }
        } catch (err) {
            showToast("Failed to fetch student details", "error");
        } finally {
            setLoading(false);
        }
    };

    const filteredDetails = details.filter(item => 
        item.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        item.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
        item.phone.includes(searchTerm) ||
        (item.workshop?.title || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
        (item.bootcamp?.title || '').toLowerCase().includes(searchTerm.toLowerCase())
    );

    return (
        <DashboardLayout allowedRoles={['admin']}>
            <div className="mb-8 animate-in slide-in-from-left duration-700">
                <h1 className="text-3xl md:text-5xl font-black text-gray-800 tracking-tighter leading-none">
                    Student <span className="text-primary-500">Details</span> 📋
                </h1>
                <p className="text-gray-500 font-bold mt-3 text-sm md:text-lg">View and manage workshop/bootcamp registrations.</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                <div className="relative md:col-span-2 group">
                    <div className="absolute inset-y-0 left-6 flex items-center pointer-events-none text-gray-400 group-focus-within:text-primary-500 transition-colors">
                        <Search size={20} />
                    </div>
                    <input 
                        type="text" 
                        placeholder="Search by name, email, phone or event..."
                        className="w-full pl-16 pr-6 py-5 bg-white border-2 border-gray-100 rounded-[2rem] focus:border-primary-500 focus:ring-0 font-bold text-gray-700 transition-all shadow-sm hover:shadow-md"
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                    />
                </div>
                <div className="flex gap-4">
                    <button className="flex-1 bg-white border-2 border-gray-100 rounded-[2rem] px-6 py-5 font-black text-gray-600 flex items-center justify-center gap-3 hover:border-primary-200 transition-all shadow-sm">
                        <Filter size={20} /> Filter
                    </button>
                    <button className="flex-1 bg-navy-900 text-white rounded-[2rem] px-6 py-5 font-black flex items-center justify-center gap-3 hover:bg-navy-800 transition-all shadow-xl">
                        <Download size={20} /> Export
                    </button>
                </div>
            </div>

            {loading ? (
                <div className="grid grid-cols-1 gap-6">
                    {[1, 2, 3, 4].map(i => (
                        <div key={i} className="h-48 bg-gray-100 animate-pulse rounded-[3rem]" />
                    ))}
                </div>
            ) : filteredDetails.length === 0 ? (
                <div className="bg-white p-20 rounded-[4rem] text-center shadow-xl border-2 border-dashed border-gray-100">
                    <div className="w-24 h-24 bg-gray-50 rounded-full flex items-center justify-center mx-auto mb-6 text-4xl">🤷‍♂️</div>
                    <h3 className="text-2xl font-black text-gray-800 mb-2">No Registrations Found</h3>
                    <p className="text-gray-500 font-bold">Adjust your search or wait for new students to join the mission.</p>
                </div>
            ) : (
                <div className="grid grid-cols-1 gap-6 pb-20">
                    {filteredDetails.map((item) => (
                        <Card key={item._id} className="overflow-hidden border-none shadow-xl hover:shadow-2xl transition-all duration-500 rounded-[3rem] group">
                            <CardContent className="p-0">
                                <div className="flex flex-col lg:flex-row">
                                    {/* Left Side: Identity */}
                                    <div className="lg:w-1/3 p-8 bg-gray-50 flex flex-col justify-center items-center lg:items-start text-center lg:text-left relative overflow-hidden">
                                        <div className="absolute top-[-20%] right-[-10%] w-32 h-32 bg-primary-100 rounded-full blur-3xl opacity-50" />
                                        
                                        <div className="w-20 h-20 bg-white rounded-[2rem] shadow-lg flex items-center justify-center text-3xl font-black text-primary-500 mb-4 relative z-10 group-hover:scale-110 group-hover:rotate-6 transition-transform">
                                            {item.name[0]}
                                        </div>
                                        <div className="relative z-10">
                                            <h3 className="text-2xl font-black text-gray-800 tracking-tight mb-1">{item.name}</h3>
                                            <p className="text-[10px] font-black text-primary-500 uppercase tracking-[0.2em] mb-4">Student Profile</p>
                                            
                                            <div className="flex flex-col gap-2">
                                                <div className="flex items-center gap-3 text-gray-500 font-bold text-sm">
                                                    <Mail size={16} className="text-gray-400" /> {item.email}
                                                </div>
                                                <div className="flex items-center gap-3 text-gray-500 font-bold text-sm">
                                                    <Phone size={16} className="text-gray-400" /> {item.phone}
                                                </div>
                                            </div>
                                        </div>
                                    </div>

                                    {/* Middle: Details */}
                                    <div className="flex-1 p-8 bg-white grid grid-cols-1 sm:grid-cols-2 gap-8 items-center border-x-2 border-gray-50">
                                        <div className="space-y-6">
                                            <div className="flex gap-4">
                                                <div className="w-12 h-12 bg-blue-50 rounded-2xl flex items-center justify-center text-blue-500 shrink-0">
                                                    <User size={20} />
                                                </div>
                                                <div>
                                                    <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-1">Parent's Name</p>
                                                    <p className="font-black text-gray-800">{item.parentName}</p>
                                                </div>
                                            </div>
                                            <div className="flex gap-4">
                                                <div className="w-12 h-12 bg-purple-50 rounded-2xl flex items-center justify-center text-purple-500 shrink-0">
                                                    <Briefcase size={20} />
                                                </div>
                                                <div>
                                                    <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-1">Occupation</p>
                                                    <p className="font-black text-gray-800">{item.occupation}</p>
                                                </div>
                                            </div>
                                        </div>
                                        <div className="space-y-6">
                                            <div className="flex gap-4">
                                                <div className="w-12 h-12 bg-orange-50 rounded-2xl flex items-center justify-center text-orange-500 shrink-0">
                                                    <MapPin size={20} />
                                                </div>
                                                <div>
                                                    <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-1">Place</p>
                                                    <p className="font-black text-gray-800">{item.place}</p>
                                                </div>
                                            </div>
                                            <div className="flex gap-4">
                                                <div className="w-12 h-12 bg-green-50 rounded-2xl flex items-center justify-center text-green-500 shrink-0">
                                                    <GraduationCap size={20} />
                                                </div>
                                                <div>
                                                    <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-1">Age / Class</p>
                                                    <p className="font-black text-gray-800">{item.age || 'Not specified'}</p>
                                                </div>
                                            </div>
                                        </div>
                                    </div>

                                    {/* Right Side: Event & Status */}
                                    <div className="lg:w-1/4 p-8 bg-gray-50/50 flex flex-col justify-center gap-6">
                                        <div className={`p-5 rounded-[2rem] border-2 flex flex-col items-center text-center gap-3 transition-all ${item.type === 'bootcamp' ? 'bg-indigo-50 border-indigo-100 text-indigo-600' : 'bg-rose-50 border-rose-100 text-rose-600'}`}>
                                            {item.type === 'bootcamp' ? <Sparkles size={24} /> : <Ticket size={24} />}
                                            <div>
                                                <p className="text-[10px] font-black uppercase tracking-widest opacity-70">{item.type}</p>
                                                <p className="font-black text-sm line-clamp-2 leading-tight">
                                                    {item.type === 'bootcamp' ? item.bootcamp?.title : item.workshop?.title}
                                                </p>
                                            </div>
                                        </div>

                                        <div className="text-center">
                                            <div className={`inline-flex items-center gap-2 px-4 py-2 rounded-full font-black text-[10px] uppercase tracking-widest mb-2 ${item.paymentStatus === 'success' ? 'bg-green-100 text-green-600' : 'bg-amber-100 text-amber-600'}`}>
                                                <div className={`w-2 h-2 rounded-full ${item.paymentStatus === 'success' ? 'bg-green-500' : 'bg-amber-500 animate-pulse'}`} />
                                                {item.paymentStatus === 'success' ? 'Paid' : 'Payment Pending'}
                                            </div>
                                            <p className="text-xs font-bold text-gray-400 flex items-center justify-center gap-1">
                                                <Calendar size={12} /> Registered on {new Date(item.createdAt).toLocaleDateString()}
                                            </p>
                                        </div>
                                    </div>
                                </div>
                            </CardContent>
                        </Card>
                    ))}
                </div>
            )}
        </DashboardLayout>
    );
}
