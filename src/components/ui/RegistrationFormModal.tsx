import React, { useState, useEffect } from 'react';
import { Button } from './Button';
import { Input } from './Input';
import { X, User, Phone, Mail, MapPin, Briefcase, GraduationCap, ArrowRight } from 'lucide-react';

interface RegistrationFormModalProps {
    title: string;
    amount: number;
    initialData?: {
        name?: string;
        email?: string;
        phone?: string;
    };
    onClose: () => void;
    onSubmit: (data: any) => void;
    isProcessing: boolean;
}

export const RegistrationFormModal: React.FC<RegistrationFormModalProps> = ({
    title,
    amount,
    initialData,
    onClose,
    onSubmit,
    isProcessing
}) => {
    const [formData, setFormData] = useState({
        name: initialData?.name || '',
        parentName: '',
        phone: initialData?.phone || '',
        email: initialData?.email || '',
        place: '',
        occupation: '',
        age: ''
    });

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        onSubmit(formData);
    };

    return (
        <div className="fixed inset-0 z-[150] flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in">
            <div className="w-full max-w-2xl bg-white rounded-[2.5rem] shadow-2xl overflow-hidden flex flex-col max-h-[95vh] animate-in zoom-in-95 duration-300">
                
                {/* Header */}
                <div className="bg-gradient-to-r from-primary-600 to-indigo-600 p-8 text-white relative shrink-0">
                    <button onClick={onClose} className="absolute top-6 right-6 p-2 bg-white/20 hover:bg-white/30 rounded-full backdrop-blur-md transition-colors">
                        <X className="w-5 h-5 text-white" />
                    </button>
                    <div className="inline-block bg-white/20 backdrop-blur-sm px-4 py-1.5 rounded-full text-[10px] font-black tracking-[0.2em] uppercase mb-4 text-white/90">
                        Registration Details
                    </div>
                    <h2 className="text-3xl md:text-4xl font-black leading-tight tracking-tighter">
                        {title}
                    </h2>
                    <p className="font-bold text-white/70 mt-2">Please provide these details to complete your enrollment.</p>
                </div>

                {/* Form Body */}
                <form onSubmit={handleSubmit} className="flex-1 overflow-y-auto p-8 bg-gray-50/50">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                        <div className="space-y-3">
                            <label className="text-sm font-black uppercase tracking-widest text-slate-600 ml-1 flex items-center gap-2">
                                <User size={16} className="text-primary-500" /> Student Name
                            </label>
                            <input
                                required
                                name="name"
                                value={formData.name}
                                onChange={handleChange}
                                placeholder="e.g. Rahul Kumar"
                                className="w-full px-6 py-5 rounded-[1.5rem] border-2 border-slate-200 focus:border-primary-500 focus:ring-4 focus:ring-primary-100 outline-none transition-all font-black text-xl text-slate-900 placeholder:text-slate-300 bg-white shadow-sm"
                            />
                        </div>

                        <div className="space-y-3">
                            <label className="text-sm font-black uppercase tracking-widest text-slate-600 ml-1 flex items-center gap-2">
                                <User size={16} className="text-primary-500" /> Parent's Name
                            </label>
                            <input
                                required
                                name="parentName"
                                value={formData.parentName}
                                onChange={handleChange}
                                placeholder="Father/Mother Name"
                                className="w-full px-6 py-5 rounded-[1.5rem] border-2 border-slate-200 focus:border-primary-500 focus:ring-4 focus:ring-primary-100 outline-none transition-all font-black text-xl text-slate-900 placeholder:text-slate-300 bg-white shadow-sm"
                            />
                        </div>

                        <div className="space-y-3">
                            <label className="text-sm font-black uppercase tracking-widest text-slate-600 ml-1 flex items-center gap-2">
                                <Phone size={16} className="text-primary-500" /> WhatsApp Number
                            </label>
                            <input
                                required
                                name="phone"
                                value={formData.phone}
                                onChange={handleChange}
                                placeholder="10-digit number"
                                className="w-full px-6 py-5 rounded-[1.5rem] border-2 border-slate-200 focus:border-primary-500 focus:ring-4 focus:ring-primary-100 outline-none transition-all font-black text-xl text-slate-900 placeholder:text-slate-300 bg-white shadow-sm"
                            />
                        </div>

                        <div className="space-y-3">
                            <label className="text-sm font-black uppercase tracking-widest text-slate-600 ml-1 flex items-center gap-2">
                                <Mail size={16} className="text-primary-500" /> Email Address
                            </label>
                            <input
                                required
                                type="email"
                                name="email"
                                value={formData.email}
                                onChange={handleChange}
                                placeholder="your@email.com"
                                className="w-full px-6 py-5 rounded-[1.5rem] border-2 border-slate-200 focus:border-primary-500 focus:ring-4 focus:ring-primary-100 outline-none transition-all font-black text-xl text-slate-900 placeholder:text-slate-300 bg-white shadow-sm"
                            />
                        </div>

                        <div className="space-y-3">
                            <label className="text-sm font-black uppercase tracking-widest text-slate-600 ml-1 flex items-center gap-2">
                                <MapPin size={16} className="text-primary-500" /> Place
                            </label>
                            <input
                                required
                                name="place"
                                value={formData.place}
                                onChange={handleChange}
                                placeholder="City/State"
                                className="w-full px-6 py-5 rounded-[1.5rem] border-2 border-slate-200 focus:border-primary-500 focus:ring-4 focus:ring-primary-100 outline-none transition-all font-black text-xl text-slate-900 placeholder:text-slate-300 bg-white shadow-sm"
                            />
                        </div>

                        <div className="space-y-3">
                            <label className="text-sm font-black uppercase tracking-widest text-slate-600 ml-1 flex items-center gap-2">
                                <Briefcase size={16} className="text-primary-500" /> Occupation
                            </label>
                            <input
                                required
                                name="occupation"
                                value={formData.occupation}
                                onChange={handleChange}
                                placeholder="e.g. Student / Parent"
                                className="w-full px-6 py-5 rounded-[1.5rem] border-2 border-slate-200 focus:border-primary-500 focus:ring-4 focus:ring-primary-100 outline-none transition-all font-black text-xl text-slate-900 placeholder:text-slate-300 bg-white shadow-sm"
                            />
                        </div>

                        <div className="space-y-3 md:col-span-2">
                            <label className="text-sm font-black uppercase tracking-widest text-slate-600 ml-1 flex items-center gap-2">
                                <GraduationCap size={16} className="text-primary-500" /> Age / Class
                            </label>
                            <input
                                name="age"
                                value={formData.age}
                                onChange={handleChange}
                                placeholder="e.g. 12 years / Class 8"
                                className="w-full px-6 py-5 rounded-[1.5rem] border-2 border-slate-200 focus:border-primary-500 focus:ring-4 focus:ring-primary-100 outline-none transition-all font-black text-xl text-slate-900 placeholder:text-slate-300 bg-white shadow-sm"
                            />
                        </div>
                    </div>

                    <div className="mt-8 p-6 bg-primary-50 rounded-[2rem] border-2 border-primary-100 flex items-center justify-between">
                        <div>
                            <p className="text-[10px] font-black text-primary-400 uppercase tracking-widest mb-1">Total Payable</p>
                            <p className="text-3xl font-black text-primary-600">₹{amount}</p>
                        </div>
                        <Button
                            type="submit"
                            size="lg"
                            disabled={isProcessing}
                            isLoading={isProcessing}
                            className="bg-primary-500 hover:bg-primary-600 text-white px-8 py-6 rounded-2xl font-black shadow-xl shadow-primary-500/20 active:scale-95 transition-all"
                        >
                            Proceed to Payment <ArrowRight size={20} className="ml-2" />
                        </Button>
                    </div>
                </form>

                <div className="p-6 bg-white border-t border-gray-100 text-center shrink-0">
                    <p className="text-xs font-black text-slate-500 uppercase tracking-[0.2em] flex items-center justify-center gap-2">
                        🛡️ YOUR DATA IS ENCRYPTED & SECURE WITH RUZANN HQ
                    </p>
                </div>
            </div>
        </div>
    );
};
