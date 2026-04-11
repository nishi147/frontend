"use client";

import React, { useEffect, useState } from 'react';
import { DashboardLayout } from '@/components/layout/DashboardLayout';
import { Card, CardContent } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import api from '@/utils/api';
import { Calendar, MapPin, Tag, Edit, Link as LinkIcon, Plus, Trash2, Clock } from 'lucide-react';
import { useToast } from '@/context/ToastContext';
import { WorkshopSlotModal } from '@/components/admin/WorkshopSlotModal';

export default function AdminWorkshops() {
  const [workshops, setWorkshops] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const { showToast, confirm } = useToast();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [activeWorkshopForSlots, setActiveWorkshopForSlots] = useState<any>(null);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    date: '',
    price: 0,
    venue: '',
    meetingLink: '',
    image: '',
    rating: 0,
    showStudentsEnrolled: false,
    studentsEnrolled: '' as number | string,
  });
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string>("");

  const fetchWorkshops = async () => {
    try {
      const res = await api.get('/api/workshops');
      if (res.data.success) {
        setWorkshops(res.data.data);
      }
    } catch (err) {
      console.error("Failed to fetch workshops", err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchWorkshops();
  }, []);
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const formDataToSubmit = new FormData();
      Object.keys(formData).forEach(key => {
        if (key !== 'image' || (key === 'image' && !imageFile)) {
          formDataToSubmit.append(key, (formData as any)[key]);
        }
      });

      if (imageFile) {
        formDataToSubmit.append('image', imageFile);
      }

      let token = '';
      try {
        token = localStorage.getItem('token') || '';
      } catch (err) {}
      
      const config = {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      };

      let res;
      if (editingId) {
        res = await api.put(`/api/workshops/${editingId}`, formDataToSubmit, config);
      } else {
        res = await api.post('/api/workshops', formDataToSubmit, config);
      }
      if (res.data.success) {
        setIsModalOpen(false);
        setEditingId(null);
        setFormData({ title: '', description: '', date: '', price: 0, venue: '', meetingLink: '', image: '', rating: 0, showStudentsEnrolled: false, studentsEnrolled: '' });
        setImageFile(null);
        setImagePreview("");
        fetchWorkshops();
        showToast(`Workshop ${editingId ? 'updated' : 'created'} successfully`, "success");
      }
    } catch (err) {
      showToast(`Failed to ${editingId ? 'update' : 'create'} workshop`, "error");
    }
  };

  const openEditModal = (ws: any) => {
    setEditingId(ws._id);
    setFormData({
      title: ws.title,
      description: ws.description,
      date: new Date(ws.date).toISOString().split('T')[0],
      price: ws.price,
      venue: ws.venue,
      meetingLink: ws.meetingLink || '',
      image: ws.image || '',
      rating: ws.rating || 0,
      showStudentsEnrolled: ws.showStudentsEnrolled || false,
      studentsEnrolled: ws.studentsEnrolled ?? '',
    });
    setImagePreview(ws.image || "");
    setImageFile(null);
    setIsModalOpen(true);
  };

  const handleDelete = async (id: string) => {
    const isConfirmed = await confirm("Delete Workshop?", "Do you really want to remove this workshop from the schedule?");
    if (!isConfirmed) return;
    try {
      await api.delete(`/api/workshops/${id}`);
      fetchWorkshops();
      showToast("Workshop deleted successfully", "success");
    } catch (err) {
      showToast("Failed to delete workshop", "error");
    }
  };

  return (
    <DashboardLayout allowedRoles={['admin']}>
      <div className="flex flex-col md:flex-row items-start md:items-center justify-between mb-10 gap-4">
        <div>
          <h1 className="text-3xl md:text-4xl font-black text-gray-800">Workshop Management 🎟️</h1>
          <p className="text-gray-500 font-bold">Create and manage upcoming magical bootcamps.</p>
        </div>
        <Button onClick={() => {
          setEditingId(null);
          setFormData({ title: '', description: '', date: '', price: 0, venue: '', meetingLink: '', image: '', rating: 0, showStudentsEnrolled: false, studentsEnrolled: '' });
          setIsModalOpen(true);
        }} className="font-black w-full md:w-auto">
          <Plus className="mr-2" /> Add Workshop
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {isLoading ? (
          [1, 2, 3].map(i => (
            <div key={i} className="h-[400px] rounded-[2.5rem] bg-gray-100 animate-pulse" />
          ))
        ) : (
          workshops.map((ws: any) => (
            <Card key={ws._id} className="relative group overflow-visible border-none shadow-[0_8px_30px_rgb(0,0,0,0.06)] hover:shadow-[0_8px_30px_rgb(0,0,0,0.12)] rounded-[2.5rem] transition-all duration-500 bg-white">
              <div className="h-48 bg-gray-50 relative overflow-hidden flex items-center justify-center text-7xl rounded-t-[2.5rem]">
                {ws.image && ws.image !== 'no-image.jpg' ? (
                    <img src={ws.image} alt={ws.title} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" />
                ) : (
                    <div className="text-gray-300 opacity-50 font-sans font-black uppercase tracking-tighter mix-blend-multiply">{ws.title.substring(0, 8)}</div>
                )}
              </div>
              
              <div className="absolute top-[10rem] right-6 bg-white px-6 py-2 rounded-2xl shadow-xl z-10 flex items-center justify-center border border-gray-100 transform group-hover:-translate-y-2 transition-transform duration-500">
                <span className="text-slate-900 font-black text-3xl tracking-tight">₹{ws.price}</span>
              </div>

              <CardContent className="p-8 pt-10">
                <h3 className="text-xl font-black text-slate-800 uppercase tracking-wide mb-1 line-clamp-1">{ws.title}</h3>
                <p className="text-gray-500 font-bold text-xs uppercase tracking-widest mb-8 line-clamp-1">{ws.description}</p>
                
                <div className="space-y-4 mb-10 pl-1">
                  <div className="flex items-center gap-4 text-slate-700">
                    <div className="w-10 h-10 rounded-full bg-teal-50 flex items-center justify-center">
                      <Calendar size={18} className="text-teal-600" />
                    </div>
                    <span className="font-bold text-[15px]">{new Date(ws.date).toLocaleDateString('en-IN', { day: 'numeric', month: 'long', year: 'numeric' })}</span>
                  </div>
                  <div className="flex items-center gap-4 text-slate-700">
                    <div className="w-10 h-10 rounded-full bg-teal-50 flex items-center justify-center">
                      <MapPin size={18} className="text-teal-600" />
                    </div>
                    <span className="font-bold text-[15px] uppercase line-clamp-1">{ws.venue}</span>
                  </div>
                  {ws.meetingLink && (
                    <div className="flex items-center gap-4 text-slate-700">
                      <div className="w-10 h-10 rounded-full bg-teal-50 flex items-center justify-center">
                        <LinkIcon size={18} className="text-teal-600" />
                      </div>
                      <a href={ws.meetingLink} target="_blank" rel="noopener noreferrer" className="font-bold text-[15px] text-primary-500 hover:text-primary-600 hover:underline line-clamp-1 truncate block" title={ws.meetingLink}>
                          Join Meeting
                      </a>
                    </div>
                  )}
                </div>

                <div className="flex gap-3 mb-3">
                  <Button 
                    variant="outline" 
                    onClick={() => setActiveWorkshopForSlots(ws)}
                    className="w-full py-5 rounded-2xl font-black text-sm text-secondary-600 hover:bg-secondary-50 border-2 border-secondary-100/50 hover:border-secondary-500 transition-all flex items-center justify-center gap-2 shadow-sm"
                  >
                    <Clock size={18} /> Manage Time Slots
                  </Button>
                </div>

                <div className="flex gap-3">
                  <Button 
                    variant="outline" 
                    onClick={() => openEditModal(ws)}
                    className="flex-1 py-6 rounded-full font-black text-lg text-primary-600 hover:bg-primary-50 border-2 border-primary-100 transition-all flex items-center justify-center gap-2"
                  >
                    <Edit size={20} /> Edit
                  </Button>
                  <Button 
                    variant="ghost" 
                    onClick={() => handleDelete(ws._id)}
                    className="flex-1 py-6 rounded-full font-black text-lg text-red-500 hover:text-white hover:bg-red-500 border-2 border-red-100 hover:border-red-500 transition-all flex items-center justify-center gap-2"
                  >
                    <Trash2 size={20} /> Delete
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))
        )}
      </div>

      {isModalOpen && (
        <div className="fixed inset-0 z-[2000] flex items-center justify-center p-0 md:p-6 bg-slate-900/80 backdrop-blur-md overflow-hidden">
          <Card className="w-full max-w-lg overflow-hidden bg-white shadow-3xl rounded-none md:rounded-[2.5rem] flex flex-col h-full md:h-auto md:max-h-[90vh]">
            <div className="bg-indigo-600 p-4 pt-8 md:p-8 text-white flex justify-between items-center shrink-0 shadow-lg relative">
               <div>
                  <h2 className="text-xl md:text-2xl font-black">{editingId ? 'Edit Workshop ✏️' : 'New Workshop 🚀'}</h2>
                  <p className="text-[10px] font-black uppercase tracking-[0.2em] text-indigo-100 opacity-80 mt-1">Configure Event Details</p>
               </div>
               <button onClick={() => setIsModalOpen(false)} className="bg-white/10 hover:bg-white/20 p-2 rounded-xl transition-colors">✕</button>
            </div>
            
            <form onSubmit={handleSubmit} className="p-4 md:p-8 flex flex-col gap-6 overflow-y-auto flex-1 bg-white">
               <div className="space-y-2">
                  <label className="text-[10px] font-black text-slate-900 uppercase tracking-widest ml-2">Workshop Identity</label>
                  <input 
                    type="text" required placeholder="e.g. Master the Dark Arts of JS"
                    className="w-full p-4 border-2 border-slate-100 bg-slate-50 rounded-2xl focus:border-indigo-500 focus:bg-white outline-none font-black text-slate-800 transition-all placeholder:text-slate-400"
                    value={formData.title} onChange={e => setFormData({...formData, title: e.target.value})}
                  />
               </div>

               <div className="space-y-2">
                  <label className="text-[10px] font-black text-slate-900 uppercase tracking-widest ml-2">The Mission Brief</label>
                  <textarea 
                    required placeholder="What will they learn? What will they build?" rows={4}
                    className="w-full p-4 border-2 border-slate-100 bg-slate-50 rounded-2xl focus:border-indigo-500 focus:bg-white outline-none font-bold text-slate-700 resize-none transition-all placeholder:text-slate-400"
                    value={formData.description} onChange={e => setFormData({...formData, description: e.target.value})}
                  ></textarea>
               </div>

               <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                 <div className="space-y-2">
                   <label className="text-[10px] font-black text-slate-900 uppercase tracking-widest ml-2">Deployment Date</label>
                   <input 
                     type="date" required
                     className="w-full p-4 border-2 border-slate-100 bg-slate-50 rounded-2xl focus:border-indigo-500 focus:bg-white outline-none font-black text-slate-800 transition-all"
                     value={formData.date} onChange={e => setFormData({...formData, date: e.target.value})}
                   />
                 </div>
                 <div className="space-y-2">
                   <label className="text-[10px] font-black text-slate-900 uppercase tracking-widest ml-2">Contribution (₹)</label>
                   <input 
                     type="number" required placeholder="999"
                     className="w-full p-4 border-2 border-slate-100 bg-slate-50 rounded-2xl focus:border-indigo-500 focus:bg-white outline-none font-black text-indigo-600 transition-all placeholder:text-slate-400"
                     value={formData.price} onChange={e => setFormData({...formData, price: Number(e.target.value)})}
                   />
                 </div>
               </div>

               <div className="space-y-2">
                  <label className="text-[10px] font-black text-slate-900 uppercase tracking-widest ml-2">Launch Base / Venue</label>
                  <input 
                    type="text" required placeholder="e.g. Pune Tech Park or Zoom"
                    className="w-full p-4 border-2 border-slate-100 bg-slate-50 rounded-2xl focus:border-indigo-500 focus:bg-white outline-none font-bold text-slate-800 transition-all placeholder:text-slate-400"
                    value={formData.venue} onChange={e => setFormData({...formData, venue: e.target.value})}
                  />
               </div>

               <div className="space-y-2">
                  <label className="text-[10px] font-black text-slate-900 uppercase tracking-widest ml-2">Meeting Link (Optional)</label>
                  <input 
                    type="url" placeholder="https://zoom.us/..."
                    className="w-full p-4 border-2 border-slate-100 bg-slate-50 rounded-2xl focus:border-indigo-500 focus:bg-white outline-none font-bold text-slate-500 text-sm transition-all placeholder:text-slate-400"
                    value={formData.meetingLink} onChange={e => setFormData({...formData, meetingLink: e.target.value})}
                  />
               </div>

               <div className="grid grid-cols-1 sm:grid-cols-1 gap-6">
                 <div className="space-y-2">
                   <label className="text-[10px] font-black text-slate-900 uppercase tracking-widest ml-2">Experience Rating (0-5)</label>
                   <input 
                     type="number" step="0.1" min="0" max="5"
                     className="w-full p-4 border-2 border-slate-100 bg-slate-50 rounded-2xl focus:border-indigo-500 focus:bg-white outline-none font-black text-slate-800 transition-all"
                     value={formData.rating} onChange={e => setFormData({...formData, rating: Number(e.target.value)})}
                   />
                 </div>
                 <div className="flex flex-col gap-4 p-4 rounded-3xl bg-slate-50 border border-slate-100">
                    <div className="flex items-center gap-3">
                      <input 
                        type="checkbox" id="wsShowEnrolled"
                        className="w-6 h-6 rounded-lg accent-indigo-600 cursor-pointer"
                        checked={formData.showStudentsEnrolled} onChange={e => setFormData({...formData, showStudentsEnrolled: e.target.checked})}
                      />
                      <label htmlFor="wsShowEnrolled" className="text-[10px] font-black text-slate-900 uppercase tracking-widest cursor-pointer mt-1">Show Social Proof Badge</label>
                    </div>
                    {formData.showStudentsEnrolled && (
                      <div className="animate-in fade-in duration-300 space-y-2">
                        <label className="text-[10px] font-black text-slate-900 uppercase tracking-widest ml-2">Manual Enrollment Count</label>
                        <input 
                          type="number" placeholder="e.g. 500"
                          className="w-full p-4 border-2 border-white bg-white rounded-2xl focus:border-indigo-500 outline-none font-black text-indigo-600 shadow-sm transition-all"
                          value={formData.studentsEnrolled} onChange={e => setFormData({...formData, studentsEnrolled: e.target.value === '' ? '' : Number(e.target.value)})}
                        />
                      </div>
                    )}
                 </div>
               </div>

               <div className="space-y-2">
                 <label className="text-[10px] font-black text-slate-900 uppercase tracking-widest ml-2">Workshop Visual (Thumbnail)</label>
                 <div className="p-8 border-2 border-dashed border-slate-200 rounded-[2rem] bg-slate-50 hover:border-indigo-300 transition-all text-center group relative overflow-hidden">
                    <input 
                      type="file" 
                      accept="image/*"
                      onChange={(e) => {
                        const file = e.target.files?.[0];
                        if (file) {
                          setImageFile(file);
                          const reader = new FileReader();
                          reader.onloadend = () => setImagePreview(reader.result as string);
                          reader.readAsDataURL(file);
                        }
                      }}
                      className="absolute inset-0 opacity-0 cursor-pointer z-10"
                    />
                    <div className="flex flex-col items-center">
                       <span className="text-3xl mb-2 group-hover:scale-110 transition-transform">🖼️</span>
                       <span className="text-[10px] font-black uppercase text-slate-400">Click or Drag to Upload</span>
                    </div>
                 </div>
                 {imagePreview && (
                   <div className="mt-4 h-32 w-full rounded-2xl overflow-hidden shadow-xl border-4 border-white">
                     <img src={imagePreview} className="w-full h-full object-cover" alt="Preview" />
                   </div>
                 )}
               </div>

               <div className="sticky bottom-0 bg-white pt-4 pb-2 border-t border-slate-50 -mx-8 px-8 mt-4">
                  <Button type="submit" className="w-full py-7 rounded-2xl font-black text-xl bg-indigo-600 hover:bg-indigo-700 shadow-2xl shadow-indigo-100 transition-all hover:scale-[1.02] active:scale-95">
                    {editingId ? 'Save Mission ✨' : 'Launch Workshop 🚀'}
                  </Button>
               </div>
            </form>
          </Card>
        </div>
      )}

      {activeWorkshopForSlots && (
        <WorkshopSlotModal 
           workshop={activeWorkshopForSlots} 
           onClose={() => setActiveWorkshopForSlots(null)} 
        />
      )}
    </DashboardLayout>
  );
}


