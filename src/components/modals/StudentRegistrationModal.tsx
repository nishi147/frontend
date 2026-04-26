"use client";

import React, { useState } from 'react';
import { X, User, Users, Phone, Mail, MapPin, Briefcase, Calendar, ShieldCheck } from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { Card } from '@/components/ui/Card';
import api from '@/utils/api';
import { useAuth } from '@/context/AuthContext';
import { useToast } from '@/context/ToastContext';

interface StudentRegistrationModalProps {
    isOpen: boolean;
    onClose: () => void;
    onSuccess: (registrationId: string) => void;
    type: 'bootcamp' | 'workshop';
    itemId: string;
    itemName: string;
    amount: number;
}

export const StudentRegistrationModal: React.FC<StudentRegistrationModalProps> = ({
    isOpen,
    onClose,
    onSuccess,
    type,
    itemId,
    itemName,
    amount
}) => {
    const { user } = useAuth();
    const { showToast } = useToast();
    const [isSubmitting, setIsSubmitting] = useState(false);

    const [formData, setFormData] = useState({
        name: user?.role !== 'admin' ? (user?.name || '') : '',
        parentName: '',
        phone: user?.role !== 'admin' ? (user?.phone || '') : '',
        email: user?.role !== 'admin' ? (user?.email || '') : '',
        place: '',
        occupation: '',
        age: ''
    });

    React.useEffect(() => {
        if (user && user.role !== 'admin') {
            setFormData(prev => ({
                ...prev,
                name: prev.name || user.name || '',
                phone: prev.phone || user.phone || '',
                email: prev.email || user.email || ''
            }));
        }
    }, [user]);

    if (!isOpen) return null;

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        
        // Validation
        if (!formData.name || !formData.parentName || !formData.phone || !formData.email || !formData.place || !formData.occupation) {
            showToast("Please fill in all required fields", "error");
            return;
        }

        if (formData.phone.length !== 10 || !/^\d+$/.test(formData.phone)) {
            showToast("Please enter a valid 10-digit phone number", "error");
            return;
        }

        setIsSubmitting(true);
        try {
            // Ensure amount is a number
            const finalAmount = typeof amount === 'string' ? parseFloat(amount.replace(/,/g, '')) : amount;

            const res = await api.post('/api/registrations', {
                ...formData,
                type,
                itemId,
                itemName,
                amount: finalAmount
            });

            if (res.data.success) {
                showToast("Details saved! Proceeding to payment...", "success");
                onSuccess(res.data.data._id);
            }
        } catch (error: any) {
            console.error("Registration submission error:", error);
            const errMsg = error.response?.data?.message || error.message || "Failed to save details";
            showToast(errMsg, "error");
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-2 sm:p-4 bg-slate-900/80 backdrop-blur-md animate-in fade-in duration-300">
            <div className="relative w-full max-w-2xl max-h-[95vh] overflow-y-auto scrollbar-hide animate-in zoom-in-95 duration-300">
                <Card className="bg-white rounded-[2rem] sm:rounded-[3rem] shadow-2xl overflow-hidden border-none my-4">
                    {/* Header */}
                    <div className="bg-gradient-to-r from-primary-600 to-indigo-600 p-6 sm:p-10 text-white relative">
                        <button 
                            onClick={onClose}
                            className="absolute top-4 sm:top-6 right-4 sm:right-6 w-8 h-8 sm:w-10 sm:h-10 bg-white/20 hover:bg-white/30 rounded-full flex items-center justify-center transition-colors z-10"
                        >
                            <X size={18} />
                        </button>
                        <h2 className="text-2xl sm:text-3xl font-black tracking-tighter uppercase mb-2">Student Registration</h2>
                        <p className="text-primary-100 font-bold opacity-80 uppercase text-[10px] tracking-[0.2em]">Required Details for {itemName}</p>
                    </div>

                    {/* Form */}
                    <form onSubmit={handleSubmit} className="p-6 sm:p-10 space-y-6 sm:space-y-8">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-5 sm:gap-6">
                            {/* Student Name */}
                            <div className="space-y-2">
                                <label className="text-[12px] font-extrabold text-slate-800 uppercase tracking-widest flex items-center gap-2 ml-1">
                                    <User size={14} className="text-primary-600" /> Student Full Name *
                                </label>
                                <input
                                    type="text"
                                    name="name"
                                    value={formData.name}
                                    onChange={handleChange}
                                    placeholder="Enter full name"
                                    className="w-full bg-slate-50 border-2 border-slate-200 rounded-2xl p-4 sm:p-5 font-bold text-slate-900 text-lg focus:border-primary-500 focus:bg-white transition-all outline-none placeholder:text-slate-400"
                                    required
                                />
                            </div>

                            {/* Parent Name */}
                            <div className="space-y-2">
                                <label className="text-[12px] font-extrabold text-slate-800 uppercase tracking-widest flex items-center gap-2 ml-1">
                                    <Users size={14} className="text-primary-600" /> Parent/Guardian Name *
                                </label>
                                <input
                                    type="text"
                                    name="parentName"
                                    value={formData.parentName}
                                    onChange={handleChange}
                                    placeholder="Enter parent name"
                                    className="w-full bg-slate-50 border-2 border-slate-200 rounded-2xl p-4 sm:p-5 font-bold text-slate-900 text-lg focus:border-primary-500 focus:bg-white transition-all outline-none placeholder:text-slate-400"
                                    required
                                />
                            </div>

                            {/* Email */}
                            <div className="space-y-2">
                                <label className="text-[12px] font-extrabold text-slate-800 uppercase tracking-widest flex items-center gap-2 ml-1">
                                    <Mail size={14} className="text-primary-600" /> Email Address *
                                </label>
                                <input
                                    type="email"
                                    name="email"
                                    value={formData.email}
                                    onChange={handleChange}
                                    placeholder="example@mail.com"
                                    className="w-full bg-slate-50 border-2 border-slate-200 rounded-2xl p-4 sm:p-5 font-bold text-slate-900 text-lg focus:border-primary-500 focus:bg-white transition-all outline-none placeholder:text-slate-400"
                                    required
                                />
                            </div>

                            {/* Phone */}
                            <div className="space-y-2">
                                <label className="text-[12px] font-extrabold text-slate-800 uppercase tracking-widest flex items-center gap-2 ml-1">
                                    <Phone size={14} className="text-primary-600" /> Phone Number *
                                </label>
                                <input
                                    type="tel"
                                    name="phone"
                                    value={formData.phone}
                                    onChange={(e) => {
                                        const val = e.target.value.replace(/\D/g, '').slice(0, 10);
                                        setFormData({ ...formData, phone: val });
                                    }}
                                    placeholder="10-digit number"
                                    className="w-full bg-slate-50 border-2 border-slate-200 rounded-2xl p-4 sm:p-5 font-bold text-slate-900 text-lg focus:border-primary-500 focus:bg-white transition-all outline-none placeholder:text-slate-400"
                                    required
                                />
                            </div>

                            {/* Place */}
                            <div className="space-y-2">
                                <label className="text-[12px] font-extrabold text-slate-800 uppercase tracking-widest flex items-center gap-2 ml-1">
                                    <MapPin size={14} className="text-primary-600" /> Place/City *
                                </label>
                                <input
                                    type="text"
                                    name="place"
                                    value={formData.place}
                                    onChange={handleChange}
                                    placeholder="Enter city"
                                    className="w-full bg-slate-50 border-2 border-slate-200 rounded-2xl p-4 sm:p-5 font-bold text-slate-900 text-lg focus:border-primary-500 focus:bg-white transition-all outline-none placeholder:text-slate-400"
                                    required
                                />
                            </div>

                            {/* Occupation */}
                            <div className="space-y-2">
                                <label className="text-[12px] font-extrabold text-slate-800 uppercase tracking-widest flex items-center gap-2 ml-1">
                                    <Briefcase size={14} className="text-primary-600" /> Occupation *
                                </label>
                                <input
                                    type="text"
                                    name="occupation"
                                    value={formData.occupation}
                                    onChange={handleChange}
                                    placeholder="e.g. Student, Working"
                                    className="w-full bg-slate-50 border-2 border-slate-200 rounded-2xl p-4 sm:p-5 font-bold text-slate-900 text-lg focus:border-primary-500 focus:bg-white transition-all outline-none placeholder:text-slate-400"
                                    required
                                />
                            </div>

                            {/* Age */}
                            <div className="space-y-2">
                                <label className="text-[12px] font-extrabold text-slate-800 uppercase tracking-widest flex items-center gap-2 ml-1">
                                    <Calendar size={14} className="text-primary-600" /> Age (Optional)
                                </label>
                                <input
                                    type="text"
                                    name="age"
                                    value={formData.age}
                                    onChange={handleChange}
                                    placeholder="Enter age"
                                    className="w-full bg-slate-50 border-2 border-slate-200 rounded-2xl p-4 sm:p-5 font-bold text-slate-900 text-lg focus:border-primary-500 focus:bg-white transition-all outline-none placeholder:text-slate-400"
                                />
                            </div>
                        </div>

                        <div className="mt-6 sm:mt-10 flex flex-col items-center gap-6">
                            <Button
                                type="submit"
                                size="lg"
                                className="w-full py-6 sm:py-8 rounded-2xl bg-primary-600 hover:bg-primary-700 text-lg sm:text-xl font-black shadow-xl shadow-primary-200 active:scale-95 transition-all"
                                isLoading={isSubmitting}
                            >
                                Confirm & Proceed to Payment
                            </Button>
                            
                            <div className="flex items-center gap-2 text-[10px] font-black text-slate-500 uppercase tracking-widest">
                                <ShieldCheck size={14} className="text-green-500" /> 
                                Data secured with SSL encryption
                            </div>
                        </div>
                    </form>
                </Card>
            </div>
        </div>
    );
};
