"use client";
import React, { useState, useEffect } from 'react';
import { Search, Filter, Download, MessageSquare, ExternalLink, User, Calendar, Mail, Bell, Phone, MessageCircle } from 'lucide-react';
import axios from 'axios';
import { LeadModal } from './LeadModal';
import { useToast } from '@/context/ToastContext';
import { useAuth } from '@/context/AuthContext';
import { Trash2 } from 'lucide-react';

export const LeadsTable = () => {
  const { user } = useAuth();
  const [leads, setLeads] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [status, setStatus] = useState('');
  const [source, setSource] = useState('');
  const [followUp, setFollowUp] = useState('');
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [selectedLead, setSelectedLead] = useState<any>(null);
  const { showToast } = useToast();

  const fetchLeads = async () => {
    try {
      setLoading(true);
      const res = await axios.get('/api/leads', {
        params: { search, status, source, followUp, page, limit: 15 }
      });
      setLeads(res.data.data);
      setTotalPages(res.data.pages || 1);
    } catch (err) {
      console.error("Error fetching leads:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    setPage(1); // Reset page on filter change
  }, [search, status, source, followUp]);

  useEffect(() => {
    const delayDebounceFn = setTimeout(() => {
      fetchLeads();
    }, 500);
    return () => clearTimeout(delayDebounceFn);
  }, [search, status, source, followUp, page]);

  const handleExport = () => {
    window.open(`/api/leads/export`, '_blank');
  };

  const handleWhatsApp = (lead: any) => {
    const message = `Hello ${lead.name}, this is from Ruzann. We received your inquiry and would love to help you with our courses!`;
    const encodedMessage = encodeURIComponent(message);
    window.open(`https://wa.me/${lead.phone.replace(/[^0-9]/g, '')}?text=${encodedMessage}`, '_blank');
  };

  const handleDelete = async (e: React.MouseEvent, id: string) => {
    e.stopPropagation();
    if (!window.confirm("Are you sure you want to delete this lead?")) return;
    try {
      await axios.delete(`/api/leads/${id}`);
      showToast("Lead deleted successfully", "success");
      fetchLeads();
    } catch (err) {
      showToast("Failed to delete lead", "error");
    }
  };

  const isOverdue = (dateStr: string) => {
    if (!dateStr) return false;
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    return new Date(dateStr) < today;
  };

  return (
    <div className="space-y-6">
      {selectedLead && (
        <LeadModal 
          lead={selectedLead} 
          onClose={() => setSelectedLead(null)} 
          onUpdate={fetchLeads} 
        />
      )}
      <div className="flex flex-col md:flex-row gap-4 justify-between items-center">
        <div className="relative w-full md:w-96">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 w-5 h-5" />
          <input
            type="text"
            placeholder="Search leads..."
            className="w-full pl-12 pr-4 py-4 rounded-[2rem] border-2 border-gray-100 focus:border-primary-500 shadow-sm transition-all outline-none font-medium"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>

        <div className="flex flex-wrap gap-2 w-full md:w-auto">
          <button 
            onClick={() => setFollowUp(followUp === 'today' ? '' : 'today')}
            className={`flex items-center gap-2 px-5 py-4 rounded-2xl font-black uppercase text-[10px] tracking-widest transition-all border-2 ${followUp === 'today' ? 'bg-purple-500 border-purple-500 text-white shadow-lg' : 'bg-white border-gray-100 text-gray-400'}`}
          >
             <Bell size={16} /> {followUp === 'today' ? 'Today Only' : 'Follow-up Today'}
          </button>

          <select 
            className="px-4 py-4 rounded-2xl border-2 border-gray-100 outline-none focus:border-primary-500 bg-white font-bold text-xs text-gray-600 min-w-[130px]"
            value={status}
            onChange={(e) => setStatus(e.target.value)}
          >
            <option value="">Status</option>
            <option value="New">New</option>
            <option value="Contacted">Contacted</option>
            <option value="Converted">Converted</option>
            <option value="Lost">Lost</option>
          </select>

          <select 
            className="px-4 py-4 rounded-2xl border-2 border-gray-100 outline-none focus:border-primary-500 bg-white font-bold text-xs text-gray-600 min-w-[130px]"
            value={source}
            onChange={(e) => setSource(e.target.value)}
          >
            <option value="">Source</option>
            <option value="Website">Website</option>
            <option value="Meta">Meta Ads</option>
            <option value="Google">Google Ads</option>
            <option value="Referral">Referral</option>
          </select>

          <button 
            onClick={handleExport}
            className="flex items-center gap-3 px-6 py-4 bg-secondary-500 text-white rounded-2xl font-black uppercase text-xs tracking-widest shadow-lg shadow-secondary-100 hover:bg-secondary-600 transition-all"
          >
            <Download size={18} /> Export
          </button>
        </div>
      </div>

      <div className="bg-white rounded-[2.5rem] shadow-xl border-2 border-gray-50 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead className="bg-gray-50/50 border-b-2 border-gray-50 uppercase text-[10px] tracking-[0.2em] font-black text-gray-400">
              <tr>
                <th className="px-8 py-6">Lead Information</th>
                <th className="px-8 py-6">Source</th>
                <th className="px-8 py-6">Status</th>
                <th className="px-8 py-6">Assigned To</th>
                <th className="px-8 py-6 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {loading ? (
                <tr><td colSpan={5} className="text-center py-24 text-gray-400 font-bold animate-pulse uppercase tracking-widest">Gathering leads...</td></tr>
              ) : leads.length === 0 ? (
                <tr><td colSpan={5} className="text-center py-24 text-gray-400 font-bold uppercase tracking-widest">No leads found</td></tr>
              ) : leads.map((lead: any) => (
                <tr 
                  key={lead._id} 
                  className={`hover:bg-primary-50/30 transition-colors group cursor-pointer ${isOverdue(lead.followUpDate) && lead.status !== 'Converted' && lead.status !== 'Lost' ? 'border-l-4 border-l-red-500 bg-red-50/10' : ''}`}
                  onClick={() => setSelectedLead(lead)}
                >
                  <td className="px-8 py-6">
                    <div className="flex flex-col">
                      <span className="font-black text-gray-800 text-lg tracking-tight mb-1">{lead.name}</span>
                      <div className="flex flex-wrap gap-x-4 gap-y-1 text-[10px] font-bold text-gray-400">
                         <span className="flex items-center gap-1"><Phone size={10}/> {lead.phone}</span>
                         <span className="flex items-center gap-1"><Mail size={10}/> {lead.email}</span>
                      </div>
                    </div>
                  </td>
                  <td className="px-8 py-6">
                     <span className={`px-3 py-1.5 rounded-xl text-[9px] font-black uppercase tracking-wider ${
                       lead.source === 'Meta' ? 'bg-blue-50 text-blue-600' :
                       lead.source === 'Google' ? 'bg-red-50 text-red-600' :
                       lead.source === 'Referral' ? 'bg-purple-50 text-purple-600' :
                       'bg-green-50 text-green-600'
                     }`}>{lead.source}</span>
                  </td>
                  <td className="px-8 py-6">
                     <span className={`px-4 py-2 rounded-2xl text-[9px] font-black uppercase tracking-widest shadow-sm ${
                       lead.status === 'Converted' ? 'bg-green-500 text-white' :
                       lead.status === 'Contacted' ? 'bg-secondary-500 text-white' :
                       lead.status === 'Lost' ? 'bg-gray-400 text-white' :
                       'bg-primary-500 text-white'
                     }`}>{lead.status}</span>
                  </td>
                  <td className="px-8 py-6">
                    <div className="flex items-center gap-3">
                       <div className="w-8 h-8 rounded-xl bg-gray-100 flex items-center justify-center text-gray-400 text-[10px] font-black">
                          {lead.assignedTo?.name?.[0] || '?'}
                       </div>
                       <span className="text-xs font-black text-gray-600">{lead.assignedTo?.name || 'Unassigned'}</span>
                    </div>
                  </td>
                  <td className="px-8 py-6 text-right">
                    <div className="flex items-center justify-end gap-2" onClick={(e) => e.stopPropagation()}>
                       <button 
                         onClick={() => handleWhatsApp(lead)}
                         className="p-2.5 bg-green-50 text-green-600 hover:bg-green-500 hover:text-white rounded-xl transition-all shadow-sm"
                         title="WhatsApp"
                       >
                          <MessageCircle size={18} />
                       </button>
                       {lead.email && (
                         <a 
                           href={`mailto:${lead.email}?subject=Regarding your inquiry at Ruzann&body=Hi ${lead.name},`}
                           className="p-2.5 bg-blue-50 text-blue-600 hover:bg-blue-500 hover:text-white rounded-xl transition-all shadow-sm"
                           title="Email"
                         >
                            <Mail size={18} />
                         </a>
                       )}
                       <button 
                         onClick={(e) => { e.stopPropagation(); setSelectedLead(lead); }}
                         className="p-2.5 bg-gray-50 text-gray-400 hover:bg-primary-500 hover:text-white rounded-xl transition-all shadow-sm"
                       >
                          <ExternalLink size={18} />
                       </button>
                       {user?.role === 'admin' && (
                         <button 
                           onClick={(e) => handleDelete(e, lead._id)}
                           className="p-2.5 bg-red-50 text-red-600 hover:bg-red-500 hover:text-white rounded-xl transition-all shadow-sm"
                           title="Delete Lead"
                         >
                            <Trash2 size={18} />
                         </button>
                       )}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        
        {/* Pagination Controls */}
        {totalPages > 1 && (
          <div className="flex items-center justify-between px-8 py-4 border-t-2 border-gray-50 bg-gray-50/50">
            <span className="text-xs font-bold text-gray-400 uppercase tracking-widest">
              Page {page} of {totalPages}
            </span>
            <div className="flex gap-2">
              <button 
                disabled={page === 1}
                onClick={() => setPage(p => Math.max(1, p - 1))}
                className="px-4 py-2 bg-white rounded-xl font-bold text-xs text-gray-600 border-2 border-gray-100 hover:border-primary-500 disabled:opacity-50 transition-all"
              >
                Previous
              </button>
              <button 
                disabled={page === totalPages}
                onClick={() => setPage(p => Math.min(totalPages, p + 1))}
                className="px-4 py-2 bg-white rounded-xl font-bold text-xs text-gray-600 border-2 border-gray-100 hover:border-primary-500 disabled:opacity-50 transition-all"
              >
                Next
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
