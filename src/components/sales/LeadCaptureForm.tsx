"use client";
import React, { useState } from 'react';
import axios from 'axios';
import { Send, CheckCircle2, AlertCircle, Phone, User, Mail, Sparkles } from 'lucide-react';

export const LeadCaptureForm = ({ source = 'Website' }: { source?: string }) => {
  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    email: '',
    referralCode: ''
  });
  const [status, setStatus] = useState<'idle' | 'submitting' | 'success' | 'error'>('idle');
  const [errorMessage, setErrorMessage] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setStatus('submitting');
    try {
      await axios.post('/api/leads', { ...formData, source });
      setStatus('success');
      setFormData({ name: '', phone: '', email: '', referralCode: '' });
    } catch (err: any) {
      setStatus('error');
      setErrorMessage(err.response?.data?.message || 'Something went wrong. Please try again.');
    }
  };

  if (status === 'success') {
    return (
      <div className="bg-green-50 p-12 rounded-[3rem] border-4 border-green-100 text-center space-y-4 animate-in zoom-in duration-500 shadow-2xl shadow-green-100">
        <div className="w-20 h-20 bg-green-500 rounded-full flex items-center justify-center mx-auto text-white shadow-lg">
           <CheckCircle2 size={48} strokeWidth={3} />
        </div>
        <h3 className="text-3xl font-black text-green-800 tracking-tight">Success! 🚀</h3>
        <p className="text-green-700 font-bold text-lg max-w-xs mx-auto">One of our expert counsellors will reach out to you within 24 hours.</p>
        <button 
          onClick={() => setStatus('idle')}
          className="mt-4 px-8 py-4 bg-green-600 text-white rounded-2xl font-black uppercase text-xs tracking-widest hover:bg-green-700 transition-all"
        >
          Submit Another
        </button>
      </div>
    );
  }

  return (
    <div className="bg-white p-8 md:p-12 rounded-[3rem] shadow-2xl shadow-gray-100 border-2 border-primary-50 relative overflow-hidden group">
      {/* Decorative elements */}
      <div className="absolute top-[-5%] right-[-5%] w-32 h-32 bg-primary-100 rounded-full blur-3xl opacity-50 group-hover:scale-150 transition-transform duration-1000" />
      
      <div className="relative z-10 space-y-8">
        <div className="space-y-2">
          <div className="flex items-center gap-2 text-primary-500 mb-2">
             <Sparkles size={24} fill="currentColor" />
             <span className="text-[10px] font-black uppercase tracking-[0.3em]">Start Your Journey</span>
          </div>
          <h2 className="text-4xl font-black text-gray-800 tracking-tighter leading-none">Book a <span className="text-primary-500">Free Counselling</span></h2>
          <p className="text-gray-400 font-bold text-sm tracking-tight italic">Enter your details and our team will guide you through our courses.</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="relative group/field">
            <User className="absolute left-4 top-11 -translate-y-1/2 text-gray-400 w-5 h-5 group-focus-within/field:text-primary-500 transition-colors" />
            <label className="text-[10px] font-black uppercase text-gray-400 ml-4 mb-2 block tracking-widest">Full Name</label>
            <input
              required
              type="text"
              placeholder="John Doe"
              className="w-full pl-12 pr-4 py-4 rounded-2xl border-2 border-gray-100 focus:border-primary-500 outline-none transition-all font-bold text-gray-700 bg-gray-50/30"
              value={formData.name}
              onChange={(e) => setFormData({...formData, name: e.target.value})}
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="relative group/field">
              <Phone className="absolute left-4 top-11 -translate-y-1/2 text-gray-400 w-5 h-5 group-focus-within/field:text-secondary-500 transition-colors" />
              <label className="text-[10px] font-black uppercase text-gray-400 ml-4 mb-2 block tracking-widest">Phone Number</label>
              <input
                required
                type="tel"
                placeholder="+91 9876543210"
                className="w-full pl-12 pr-4 py-4 rounded-2xl border-2 border-gray-100 focus:border-secondary-500 outline-none transition-all font-bold text-gray-700 bg-gray-50/30"
                value={formData.phone}
                onChange={(e) => setFormData({...formData, phone: e.target.value})}
              />
            </div>
            <div className="relative group/field">
              <Mail className="absolute left-4 top-11 -translate-y-1/2 text-gray-400 w-5 h-5 group-focus-within/field:text-primary-500 transition-colors" />
              <label className="text-[10px] font-black uppercase text-gray-400 ml-4 mb-2 block tracking-widest">Email Address</label>
              <input
                required
                type="email"
                placeholder="john@example.com"
                className="w-full pl-12 pr-4 py-4 rounded-2xl border-2 border-gray-100 focus:border-primary-500 outline-none transition-all font-bold text-gray-700 bg-gray-50/30"
                value={formData.email}
                onChange={(e) => setFormData({...formData, email: e.target.value})}
              />
            </div>
          </div>

          <div className="relative group/field">
            <label className="text-[10px] font-black uppercase text-gray-400 ml-4 mb-2 block tracking-widest">Referral Code (Optional)</label>
            <input
              type="text"
              placeholder="RUZANN2026"
              className="w-full px-6 py-4 rounded-2xl border-2 border-dashed border-gray-200 focus:border-purple-500 outline-none transition-all font-mono font-bold text-gray-700 bg-gray-50/10"
              value={formData.referralCode}
              onChange={(e) => setFormData({...formData, referralCode: e.target.value})}
            />
          </div>

          {status === 'error' && (
            <div className="flex items-center gap-3 p-4 bg-red-50 text-red-600 rounded-2xl text-xs font-bold border border-red-100">
               <AlertCircle size={18} /> {errorMessage}
            </div>
          )}

          <button
            type="submit"
            disabled={status === 'submitting'}
            className="w-full bg-primary-500 text-white rounded-[2rem] py-5 font-black uppercase text-sm tracking-[0.2em] shadow-xl shadow-primary-100 hover:bg-primary-600 hover:-translate-y-1 active:scale-95 transition-all disabled:opacity-50 flex items-center justify-center gap-3 mt-4"
          >
            {status === 'submitting' ? (
              <span className="w-6 h-6 border-4 border-white border-t-transparent rounded-full animate-spin" />
            ) : (
              <>
                Confirm Booking <Send size={20} className="group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform" />
              </>
            )}
          </button>
        </form>
      </div>
    </div>
  );
};
