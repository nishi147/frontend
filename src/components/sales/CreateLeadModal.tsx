"use client";
import React, { useState } from 'react';
import api from '@/utils/api';
import { X, Send, User, Phone, Mail, Box, MessageSquare } from 'lucide-react';
import { useToast } from '@/context/ToastContext';

interface CreateLeadModalProps {
  onClose: () => void;
  onUpdate: () => void;
}

export const CreateLeadModal = ({ onClose, onUpdate }: CreateLeadModalProps) => {
  const { showToast } = useToast();
  const [loading, setLoading] = useState(false);
  const [form, setForm] = useState({
    name: '',
    phone: '',
    email: '',
    source: 'Other',
    priority: 'Medium',
    note: ''
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.name || !form.phone) {
        showToast("Name and Phone are mandatory! 🛡️", "error");
        return;
    }
    setLoading(true);
    try {
      const res = await api.post('/api/leads', {
        ...form,
        notes: form.note ? [{ text: form.note }] : []
      });
      if (res.data.success) {
        showToast("Lead successfully manifested! ✨", "success");
        onUpdate();
        onClose();
      }
    } catch (err: any) {
      console.error("Error creating lead:", err);
      showToast(err.response?.data?.message || "Failed to create lead", "error");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-[1000] flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/40 backdrop-blur-sm" onClick={onClose} />
      <div className="relative bg-white w-full max-w-xl rounded-[3rem] shadow-2xl overflow-hidden animate-in zoom-in-95 duration-300">
        <div className="p-8 md:p-12 space-y-8">
           <div className="flex justify-between items-start">
              <div>
                 <span className="px-4 py-1.5 bg-primary-100 text-primary-600 rounded-full text-[10px] font-black uppercase tracking-widest mb-4 inline-block">CRM Control</span>
                 <h2 className="text-4xl font-black text-gray-800 tracking-tighter">Add New Lead</h2>
              </div>
              <button onClick={onClose} className="p-3 hover:bg-gray-100 rounded-2xl transition-all"><X size={24} /></button>
           </div>

           <form onSubmit={handleSubmit} className="space-y-6">
              <div className="space-y-4">
                 <div className="space-y-2">
                    <label className="text-[10px] font-black uppercase text-gray-400 tracking-widest ml-4">Full Name</label>
                    <input 
                      type="text"
                      className="w-full p-4 rounded-2xl border-2 border-gray-100 focus:border-primary-500 font-bold text-gray-800 outline-none bg-gray-50/30"
                      placeholder="e.g. Rahul Sharma"
                      value={form.name}
                      onChange={(e) => setForm({...form, name: e.target.value})}
                      required
                    />
                 </div>

                 <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                       <label className="text-[10px] font-black uppercase text-gray-400 tracking-widest ml-4">Phone Number</label>
                       <input 
                         type="tel"
                         className="w-full p-4 rounded-2xl border-2 border-gray-100 focus:border-secondary-500 font-bold text-gray-800 outline-none bg-gray-50/30"
                         placeholder="10 digit number"
                         value={form.phone}
                         onChange={(e) => setForm({...form, phone: e.target.value})}
                         required
                       />
                    </div>
                    <div className="space-y-2">
                       <label className="text-[10px] font-black uppercase text-gray-400 tracking-widest ml-4">Email Address</label>
                       <input 
                         type="email"
                         className="w-full p-4 rounded-2xl border-2 border-gray-100 focus:border-purple-500 font-bold text-gray-800 outline-none bg-gray-50/30"
                         placeholder="email@example.com"
                         value={form.email}
                         onChange={(e) => setForm({...form, email: e.target.value})}
                       />
                    </div>
                 </div>

                 <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                       <label className="text-[10px] font-black uppercase text-gray-400 tracking-widest ml-4">Lead Source</label>
                       <select 
                         className="w-full p-4 rounded-2xl border-2 border-gray-100 outline-none bg-gray-50/30 font-bold text-gray-600"
                         value={form.source}
                         onChange={(e) => setForm({...form, source: e.target.value})}
                       >
                          <option value="Website">Website</option>
                          <option value="Meta">Meta Ads</option>
                          <option value="Google">Google Ads</option>
                          <option value="Referral">Referral</option>
                          <option value="Other">Other</option>
                       </select>
                    </div>
                    <div className="space-y-2">
                       <label className="text-[10px] font-black uppercase text-gray-400 tracking-widest ml-4">Priority</label>
                       <select 
                         className="w-full p-4 rounded-2xl border-2 border-gray-100 outline-none bg-gray-50/30 font-bold text-gray-600"
                         value={form.priority}
                         onChange={(e) => setForm({...form, priority: e.target.value})}
                       >
                          <option value="High">High 🔥</option>
                          <option value="Medium">Medium ⚡</option>
                          <option value="Low">Low ❄️</option>
                       </select>
                    </div>
                 </div>

                 <div className="space-y-2">
                    <label className="text-[10px] font-black uppercase text-gray-400 tracking-widest ml-4">Initial Notes</label>
                    <textarea 
                      placeholder="Any context about this lead..."
                      className="w-full p-6 rounded-[2rem] border-2 border-gray-100 focus:border-primary-500 outline-none font-bold text-gray-600 bg-gray-50/30 min-h-[100px]"
                      value={form.note}
                      onChange={(e) => setForm({...form, note: e.target.value})}
                    />
                 </div>
              </div>

              <button 
                type="submit"
                disabled={loading}
                className="w-full bg-gray-800 text-white py-5 rounded-[2rem] font-black uppercase text-sm tracking-[0.2em] hover:bg-black transition-all shadow-xl disabled:opacity-50 flex items-center justify-center gap-3"
              >
                 {loading ? <span className="w-6 h-6 border-4 border-white border-t-transparent rounded-full animate-spin" /> : <>Create Lead <Send size={20} /></>}
              </button>
           </form>
        </div>
      </div>
    </div>
  );
};
