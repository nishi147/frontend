"use client";
import React, { useState, useEffect } from 'react';
import api from '@/utils/api';
import { X, Mail, Send, User, MessageSquare, FileText } from 'lucide-react';
import { useToast } from '@/context/ToastContext';

interface ShareLeadsModalProps {
  onClose: () => void;
  leadIds?: string[];
}

export const ShareLeadsModal = ({ onClose, leadIds }: ShareLeadsModalProps) => {
  const { showToast } = useToast();
  const [salesUsers, setSalesUsers] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [fetching, setFetching] = useState(true);
  const [targetUserId, setTargetUserId] = useState('');
  const [customMessage, setCustomMessage] = useState('');

  useEffect(() => {
    const fetchSalesUsers = async () => {
      try {
        const res = await api.get('/api/users?role=sales');
        setSalesUsers(res.data.data);
      } catch (err) {
        console.error("Error fetching sales users:", err);
      } finally {
        setFetching(false);
      }
    };
    fetchSalesUsers();
  }, []);

  const handleShare = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!targetUserId) {
        showToast("Please select a sales executive", "error");
        return;
    }

    setLoading(true);
    try {
      const res = await api.post('/api/leads/share', {
        targetUserId,
        leadIds,
        customMessage
      });

      if (res.data.success) {
        showToast(res.data.message || "Leads shared successfully! 📧", "success");
        onClose();
      }
    } catch (err: any) {
      console.error("Error sharing leads:", err);
      showToast(err.response?.data?.message || "Failed to share leads", "error");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-[1000] flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/40 backdrop-blur-sm" onClick={onClose} />
      <div className="relative bg-white w-full max-w-lg rounded-[3rem] shadow-2xl overflow-hidden animate-in zoom-in-95 duration-300">
        <div className="p-8 md:p-12 space-y-8">
           <div className="flex justify-between items-start">
              <div>
                 <span className="px-4 py-1.5 bg-secondary-100 text-secondary-600 rounded-full text-[10px] font-black uppercase tracking-widest mb-4 inline-block">Report Manager</span>
                 <h2 className="text-4xl font-black text-gray-800 tracking-tighter">Share CSV Export</h2>
              </div>
              <button onClick={onClose} className="p-3 hover:bg-gray-100 rounded-2xl transition-all"><X size={24} /></button>
           </div>

           <p className="text-sm font-bold text-gray-400">
              {leadIds && leadIds.length > 0 
                ? `You are sharing ${leadIds.length} selected leads with a sales person.` 
                : "Select a sales person to email them a CSV of all their assigned leads."}
           </p>

           <form onSubmit={handleShare} className="space-y-6">
              <div className="space-y-4">
                 <div className="space-y-2">
                    <label className="text-[10px] font-black uppercase text-gray-400 tracking-widest ml-4">Select Sales Executive</label>
                    <div className="relative">
                       <User className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 w-5 h-5 pointer-events-none" />
                       <select 
                         className="w-full pl-12 pr-4 py-4 rounded-2xl border-2 border-gray-100 focus:border-secondary-500 font-bold text-gray-700 outline-none bg-gray-50/30 appearance-none transition-all"
                         value={targetUserId}
                         onChange={(e) => setTargetUserId(e.target.value)}
                         disabled={fetching}
                       >
                          <option value="">Choose Executive...</option>
                          {salesUsers.map(user => (
                             <option key={user._id} value={user._id}>{user.name} ({user.email})</option>
                          ))}
                       </select>
                    </div>
                 </div>

                 <div className="space-y-2">
                    <label className="text-[10px] font-black uppercase text-gray-400 tracking-widest ml-4">Message (Optional)</label>
                    <textarea 
                      placeholder="Add a custom note to the email..."
                      className="w-full p-6 rounded-[2rem] border-2 border-gray-100 focus:border-primary-500 outline-none font-bold text-gray-600 bg-gray-50/30 min-h-[120px] transition-all"
                      value={customMessage}
                      onChange={(e) => setCustomMessage(e.target.value)}
                    />
                 </div>
              </div>

              <div className="flex gap-4">
                 <button 
                   type="button"
                   onClick={onClose}
                   className="flex-1 px-8 py-5 rounded-[2rem] font-black uppercase text-xs tracking-widest text-gray-400 hover:text-gray-600 hover:bg-gray-50 transition-all border-2 border-transparent"
                 >
                    Cancel
                 </button>
                 <button 
                   type="submit"
                   disabled={loading || fetching || !targetUserId}
                   className="flex-[2] bg-secondary-500 text-white px-8 py-5 rounded-[2rem] font-black uppercase text-xs tracking-widest shadow-xl shadow-secondary-100 hover:bg-secondary-600 transition-all disabled:opacity-50 flex items-center justify-center gap-3"
                 >
                    {loading ? <span className="w-5 h-5 border-4 border-white border-t-transparent rounded-full animate-spin" /> : <>Email CSV <Send size={18} /></>}
                 </button>
              </div>
           </form>
        </div>
      </div>
    </div>
  );
};
