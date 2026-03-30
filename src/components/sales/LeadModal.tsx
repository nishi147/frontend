"use client";
import React, { useState, useEffect } from 'react';
import api from '@/utils/api';
import { X, Send, User, Phone, Mail, Calendar, MessageSquare, History } from 'lucide-react';

interface LeadModalProps {
  lead: any;
  onClose: () => void;
  onUpdate: () => void;
}

export const LeadModal = ({ lead, onClose, onUpdate }: LeadModalProps) => {
  const [note, setNote] = useState('');
  const [status, setStatus] = useState(lead.status);
  const [assignedTo, setAssignedTo] = useState(lead.assignedTo?._id || '');
  const [followUpDate, setFollowUpDate] = useState(lead.followUpDate ? lead.followUpDate.split('T')[0] : '');
  const [revenue, setRevenue] = useState(lead.revenue || 0);
  const [counsellors, setCounsellors] = useState<any[]>([]);
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    const fetchCounsellors = async () => {
      try {
        const res = await api.get('/api/users?role=sales');
        setCounsellors(res.data.data);
      } catch (err) {
        console.error("Error fetching counsellors:", err);
      }
    };
    fetchCounsellors();
  }, []);

  const handleUpdate = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    try {
      const payload: any = { status, assignedTo, followUpDate };
      if (status === 'Converted') payload.revenue = revenue;
      await api.put(`/api/leads/${lead._id}`, payload);
      if (note.trim()) {
        await api.post(`/api/leads/${lead._id}/notes`, { text: note });
      }
      onUpdate();
      onClose();
    } catch (err) {
      console.error("Error updating lead:", err);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-[1000] flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/40 backdrop-blur-sm" onClick={onClose} />
      <div className="relative bg-white w-full max-w-2xl rounded-[3rem] shadow-2xl overflow-hidden animate-in zoom-in-95 duration-300">
        <div className="p-8 md:p-12 space-y-8">
           <div className="flex justify-between items-start">
              <div>
                 <span className="px-4 py-1.5 bg-primary-100 text-primary-600 rounded-full text-[10px] font-black uppercase tracking-widest mb-4 inline-block">Lead Details</span>
                 <h2 className="text-4xl font-black text-gray-800 tracking-tighter">{lead.name}</h2>
              </div>
              <button onClick={onClose} className="p-3 hover:bg-gray-100 rounded-2xl transition-all"><X size={24} /></button>
           </div>

           <div className="grid grid-cols-2 gap-6 border-b-2 border-gray-50 pb-8">
              <div className="space-y-4">
                 <div className="flex items-center gap-3 text-gray-500 font-bold">
                    <Phone size={18} className="text-primary-500" /> {lead.phone}
                 </div>
                 <div className="flex items-center gap-3 text-gray-500 font-bold">
                    <Mail size={18} className="text-secondary-500" /> {lead.email || 'No email provided'}
                 </div>
              </div>
              <div className="space-y-4 text-right">
                 <div className="flex items-center justify-end gap-3 text-gray-400 font-bold text-xs uppercase tracking-widest">
                    <Calendar size={14} /> Created: {new Date(lead.createdAt).toLocaleDateString()}
                 </div>
                 <div className="px-4 py-1.5 bg-gray-100 text-gray-600 rounded-lg text-xs font-black uppercase tracking-widest inline-block">
                    Source: {lead.source}
                 </div>
              </div>
           </div>

           <form onSubmit={handleUpdate} className="space-y-6">
              <div className="grid grid-cols-2 gap-6">
                 <div className="space-y-2">
                    <label className="text-[10px] font-black uppercase text-gray-400 tracking-widest ml-4">Update Status</label>
                    <select 
                      className="w-full p-4 rounded-2xl border-2 border-gray-100 focus:border-primary-500 font-bold text-gray-600 outline-none bg-gray-50/30"
                      value={status}
                      onChange={(e) => setStatus(e.target.value)}
                    >
                       <option value="New">New</option>
                       <option value="Contacted">Contacted</option>
                       <option value="Converted">Converted</option>
                       <option value="Lost">Lost</option>
                    </select>
                 </div>
                 {status === 'Converted' && (
                    <div className="space-y-2 animate-in fade-in slide-in-from-top-2 duration-300">
                      <label className="text-[10px] font-black uppercase text-green-500 tracking-widest ml-4">Revenue (₹)</label>
                      <input 
                        type="number"
                        className="w-full p-4 rounded-2xl border-2 border-green-100 focus:border-green-500 font-black text-green-600 outline-none bg-green-50/30"
                        value={revenue}
                        onChange={(e) => setRevenue(Number(e.target.value))}
                        placeholder="e.g. 5000"
                        required
                      />
                    </div>
                 )}
                 <div className="space-y-2">
                    <label className="text-[10px] font-black uppercase text-gray-400 tracking-widest ml-4">Assign To</label>
                    <select 
                      className="w-full p-4 rounded-2xl border-2 border-gray-100 focus:border-secondary-500 font-bold text-gray-600 outline-none bg-gray-50/30"
                      value={assignedTo}
                      onChange={(e) => setAssignedTo(e.target.value)}
                    >
                       <option value="">Unassigned</option>
                       {counsellors.map(c => (
                         <option key={c._id} value={c._id}>{c.name}</option>
                       ))}
                    </select>
                 </div>
                 <div className="space-y-2 md:col-span-2">
                    <label className="text-[10px] font-black uppercase text-gray-400 tracking-widest ml-4">Next Follow-up</label>
                    <input 
                      type="date"
                      className="w-full p-4 rounded-2xl border-2 border-gray-100 focus:border-purple-500 font-bold text-gray-600 outline-none bg-gray-50/30"
                      value={followUpDate}
                      onChange={(e) => setFollowUpDate(e.target.value)}
                    />
                 </div>
              </div>

              <div className="space-y-2">
                 <label className="text-[10px] font-black uppercase text-gray-400 tracking-widest ml-4">Add Note / Interaction</label>
                 <textarea 
                   placeholder="Write what happened during the call..."
                   className="w-full p-6 rounded-[2rem] border-2 border-gray-100 focus:border-primary-500 outline-none font-bold text-gray-600 bg-gray-50/30 min-h-[120px]"
                   value={note}
                   onChange={(e) => setNote(e.target.value)}
                 />
              </div>

              <button 
                type="submit"
                disabled={submitting}
                className="w-full bg-gray-800 text-white py-5 rounded-[2rem] font-black uppercase text-sm tracking-[0.2em] hover:bg-black transition-all shadow-xl disabled:opacity-50 flex items-center justify-center gap-3"
              >
                 {submitting ? <span className="w-6 h-6 border-4 border-white border-t-transparent rounded-full animate-spin" /> : <>Save Changes <Send size={20} /></>}
              </button>
           </form>

           {lead.notes?.length > 0 && (
             <div className="space-y-4 pt-4 border-t-2 border-gray-50">
                <div className="flex items-center gap-2 text-[10px] font-black text-gray-400 uppercase tracking-widest">
                   <History size={14} /> Interaction History
                </div>
                <div className="space-y-4 max-h-[150px] overflow-y-auto pr-4 scrollbar-hide">
                   {lead.notes.slice().reverse().map((n: any, i: number) => (
                     <div key={i} className="bg-gray-50 p-4 rounded-2xl">
                        <p className="text-sm font-bold text-gray-600">{n.text}</p>
                        <span className="text-[10px] text-gray-400 mt-2 block italic">{new Date(n.date).toLocaleString()}</span>
                     </div>
                   ))}
                </div>
             </div>
           )}
        </div>
      </div>
    </div>
  );
};
