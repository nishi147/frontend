"use client";
import React, { useState, useEffect } from 'react';
import api from '@/utils/api';
import { X, Mail, Send, User, MessageSquare, FileText, Upload, GripVertical } from 'lucide-react';
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
  const [file, setFile] = useState<File | null>(null);

  // Draggable State
  const [position, setPosition] = useState({ x: 0, y: 0 });
  const [isDragging, setIsDragging] = useState(false);
  const [dragOffset, setDragOffset] = useState({ x: 0, y: 0 });

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

  const handleMouseDown = (e: React.MouseEvent) => {
    // Only drag from the header area or the grip icon
    const target = e.target as HTMLElement;
    if (target.closest('.drag-handle')) {
      setIsDragging(true);
      setDragOffset({
        x: e.clientX - position.x,
        y: e.clientY - position.y
      });
    }
  };

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      if (isDragging) {
        setPosition({
          x: e.clientX - dragOffset.x,
          y: e.clientY - dragOffset.y
        });
      }
    };

    const handleMouseUp = () => {
      setIsDragging(false);
    };

    if (isDragging) {
      window.addEventListener('mousemove', handleMouseMove);
      window.addEventListener('mouseup', handleMouseUp);
    }

    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('mouseup', handleMouseUp);
    };
  }, [isDragging, dragOffset]);

  const handleShare = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!targetUserId) {
        showToast("Please select a sales executive", "error");
        return;
    }

    const formData = new FormData();
    formData.append('targetUserId', targetUserId);
    formData.append('customMessage', customMessage);
    if (leadIds && leadIds.length > 0) {
      formData.append('leadIds', leadIds.join(','));
    }
    if (file) {
      formData.append('leadFile', file);
    }

    setLoading(true);
    try {
      const res = await api.post('/api/leads/share', formData, {
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      });

      if (res.data.success) {
        showToast(res.data.message || "Leads successfully shared/imported! 📧", "success");
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
      <div 
        className="relative bg-white w-full max-w-lg rounded-[3rem] shadow-2xl overflow-hidden animate-in zoom-in-95 duration-300"
        style={{ transform: `translate(${position.x}px, ${position.y}px)` }}
      >
        {/* Header / Drag Handle */}
        <div 
          className="p-8 md:p-12 pb-4 space-y-4 drag-handle cursor-move select-none"
          onMouseDown={handleMouseDown}
        >
           <div className="flex justify-between items-start">
              <div className="flex items-center gap-3">
                 <div className="p-2 bg-gray-50 rounded-lg text-gray-400">
                    <GripVertical size={20} />
                 </div>
                 <div>
                    <span className="px-4 py-1.5 bg-secondary-100 text-secondary-600 rounded-full text-[10px] font-black uppercase tracking-widest mb-1 inline-block">Report Manager</span>
                    <h2 className="text-4xl font-black text-gray-800 tracking-tighter">Share & Import</h2>
                 </div>
              </div>
              <button 
                onClick={onClose} 
                className="p-3 hover:bg-gray-100 rounded-2xl transition-all"
                onMouseDown={(e) => e.stopPropagation()}
              >
                <X size={24} />
              </button>
           </div>

           <p className="text-sm font-bold text-gray-400">
              {leadIds && leadIds.length > 0 
                ? `You are sharing ${leadIds.length} selected leads with a sales person.` 
                : "Select a sales person to share leads or upload an external list."}
           </p>
        </div>

        <div className="p-8 md:p-12 pt-0 space-y-8">
           <form onSubmit={handleShare} className="space-y-6">
              <div className="space-y-6">
                 {/* File Upload Section */}
                 <div className="space-y-2">
                    <label className="text-[10px] font-black uppercase text-gray-400 tracking-widest ml-4">Upload External Leads (CSV)</label>
                    <div 
                      className={`relative border-2 border-dashed rounded-[2rem] p-8 transition-all flex flex-col items-center justify-center gap-3 ${file ? 'border-primary-500 bg-primary-50/10' : 'border-gray-200 hover:border-primary-300 bg-gray-50/30'}`}
                      onDragOver={(e) => e.preventDefault()}
                      onDrop={(e) => {
                        e.preventDefault();
                        if (e.dataTransfer.files[0]) setFile(e.dataTransfer.files[0]);
                      }}
                    >
                       <Upload className={`w-10 h-10 ${file ? 'text-primary-500' : 'text-gray-300'}`} />
                       <div className="text-center">
                          <span className="text-xs font-black text-gray-600 uppercase tracking-widest block mb-1">
                             {file ? file.name : 'Drop CSV file here'}
                          </span>
                          <span className="text-[10px] font-bold text-gray-400">Max size 4MB • Standard CSV format</span>
                       </div>
                       <input 
                         type="file" 
                         accept=".csv"
                         className="absolute inset-0 opacity-0 cursor-pointer"
                         onChange={(e) => e.target.files?.[0] && setFile(e.target.files[0])}
                       />
                       {file && (
                         <button 
                           type="button"
                           onClick={(e) => { e.preventDefault(); e.stopPropagation(); setFile(null); }}
                           className="absolute top-4 right-4 text-[10px] font-black text-red-400 uppercase tracking-widest hover:text-red-600 transition-all"
                         >
                           Remove
                         </button>
                       )}
                    </div>
                 </div>

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
                      className="w-full p-6 rounded-[2rem] border-2 border-gray-100 focus:border-primary-500 outline-none font-bold text-gray-600 bg-gray-50/30 min-h-[100px] transition-all"
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
                    {loading ? <span className="w-5 h-5 border-4 border-white border-t-transparent rounded-full animate-spin" /> : <>{file ? 'Upload & Email' : 'Email CSV'} <Send size={18} /></>}
                 </button>
              </div>
           </form>
        </div>
      </div>
    </div>
  );
};
