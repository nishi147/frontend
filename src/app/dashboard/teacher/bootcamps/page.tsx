"use client";

import React, { useEffect, useState } from 'react';
import { DashboardLayout } from '@/components/layout/DashboardLayout';
import { Card, CardContent } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import api from '@/utils/api';
import { Calendar, MapPin, Tag, Edit, Link as LinkIcon, Plus, Trash2, Clock, Sparkles } from 'lucide-react';
import { useToast } from '@/context/ToastContext';
import { useAuth } from '@/context/AuthContext';

export default function TeacherBootcamps() {
  const [bootcamps, setBootcamps] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const { showToast, confirm } = useToast();
  const { user } = useAuth();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    date: '',
    endDate: '',
    price: 0,
    venue: '',
    meetingLink: '',
    image: '',
  });
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string>("");

  const fetchBootcamps = async () => {
    try {
      const res = await api.get('/api/bootcamps');
      if (res.data.success) {
        // Teachers see all bootcamps but can only edit theirs (handled by backend or UI filter)
        // For better experience, we can highlight theirs or filter
        setBootcamps(res.data.data);
      }
    } catch (err) {
      console.error("Failed to fetch bootcamps", err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchBootcamps();
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

      let res;
      if (editingId) {
        res = await api.put(`/api/bootcamps/${editingId}`, formDataToSubmit, {
          headers: { 'Content-Type': 'multipart/form-data' }
        });
      } else {
        res = await api.post('/api/bootcamps', formDataToSubmit, {
          headers: { 'Content-Type': 'multipart/form-data' }
        });
      }
      if (res.data.success) {
        setIsModalOpen(false);
        setEditingId(null);
        setFormData({ title: '', description: '', date: '', endDate: '', price: 0, venue: '', meetingLink: '', image: '' });
        setImageFile(null);
        setImagePreview("");
        fetchBootcamps();
        showToast(`Bootcamp ${editingId ? 'updated' : 'created'} successfully`, "success");
      }
    } catch (err) {
      showToast(`Failed to ${editingId ? 'update' : 'create'} bootcamp`, "error");
    }
  };

  const openEditModal = (bc: any) => {
    setEditingId(bc._id);
    setFormData({
      title: bc.title,
      description: bc.description,
      date: new Date(bc.date).toISOString().split('T')[0],
      endDate: bc.endDate ? new Date(bc.endDate).toISOString().split('T')[0] : '',
      price: bc.price,
      venue: bc.venue,
      meetingLink: bc.meetingLink || '',
      image: bc.image || '',
    });
    setImagePreview(bc.image || "");
    setImageFile(null);
    setIsModalOpen(true);
  };

  const handleDelete = async (id: string) => {
    const isConfirmed = await confirm("Delete Bootcamp?", "Do you really want to remove this bootcamp?");
    if (!isConfirmed) return;
    try {
      await api.delete(`/api/bootcamps/${id}`);
      fetchBootcamps();
      showToast("Bootcamp deleted successfully", "success");
    } catch (err) {
      showToast("Failed to delete bootcamp. You can only delete bootcamps you created.", "error");
    }
  };

  return (
    <DashboardLayout allowedRoles={['teacher', 'admin']}>
      <div className="flex flex-col md:flex-row items-start md:items-center justify-between mb-10 gap-4">
        <div>
          <h1 className="text-3xl md:text-4xl font-black text-indigo-900 uppercase">My Bootcamps 🎓</h1>
          <p className="text-slate-500 font-bold">Manage your intensive learning sessions and students.</p>
        </div>
        <Button onClick={() => {
          setEditingId(null);
          setFormData({ title: '', description: '', date: '', endDate: '', price: 0, venue: '', meetingLink: '', image: '' });
          setImageFile(null);
          setImagePreview("");
          setIsModalOpen(true);
        }} className="font-black w-full md:w-auto bg-indigo-600 hover:bg-indigo-700 rounded-2xl py-6 px-10 shadow-xl shadow-indigo-100">
          <Plus className="mr-2" /> Create Bootcamp
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {isLoading ? (
          [1, 2, 3].map(i => (
            <div key={i} className="h-[400px] rounded-[2.5rem] bg-slate-100 animate-pulse" />
          ))
        ) : (
          bootcamps.map((bc: any) => {
            const isMine = bc.instructor?._id === user?._id || bc.instructor === user?._id;
            return (
              <Card key={bc._id} className={`relative group overflow-visible border-none shadow-sm hover:shadow-xl rounded-[2.5rem] transition-all duration-500 bg-white ${!isMine && 'opacity-80'}`}>
                <div className={`h-48 relative overflow-hidden flex items-center justify-center text-7xl rounded-t-[2.5rem] ${isMine ? 'bg-indigo-600' : 'bg-slate-400'}`}>
                   {bc.image ? (
                     <img src={bc.image} alt={bc.title} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" />
                   ) : (
                     <div className="absolute inset-0 flex items-center justify-center text-8xl transition-transform duration-500 group-hover:scale-110">🚀</div>
                   )}
                   {isMine && !bc.image && <div className="text-white opacity-20 font-black uppercase tracking-tighter mix-blend-overlay">BOOTCAMP</div>}
                   {!isMine && (
                     <div className="absolute top-4 left-4 px-3 py-1 bg-white/20 backdrop-blur-md rounded-full text-[10px] font-black text-white uppercase tracking-widest border border-white/30">
                        Other Instructor
                     </div>
                   )}
                </div>
                
                <div className="absolute top-[10rem] right-6 bg-white px-6 py-2 rounded-2xl shadow-xl z-10 flex items-center justify-center border border-indigo-100 transform group-hover:-translate-y-2 transition-transform duration-500">
                  <span className="text-slate-900 font-black text-3xl tracking-tight">₹{bc.price}</span>
                </div>

                <CardContent className="p-8 pt-10">
                  <div className="flex items-center gap-2 mb-2">
                     <span className="px-3 py-1 bg-indigo-50 text-indigo-600 rounded-full text-[10px] font-black uppercase tracking-widest">Intensive</span>
                     {bc.instructor && (
                       <span className="text-[10px] font-black text-slate-400">By {isMine ? 'Me' : bc.instructor.name}</span>
                     )}
                  </div>
                  <h3 className="text-xl font-black text-slate-800 uppercase tracking-wide mb-1 line-clamp-1">{bc.title}</h3>
                  <p className="text-slate-500 font-bold text-xs uppercase tracking-widest mb-8 line-clamp-1">{bc.description}</p>
                  
                  <div className="space-y-4 mb-10 pl-1">
                    <div className="flex items-center gap-4 text-slate-700">
                      <div className="w-10 h-10 rounded-full bg-indigo-50 flex items-center justify-center">
                        <Calendar size={18} className="text-indigo-600" />
                      </div>
                      <span className="font-bold text-[15px]">{new Date(bc.date).toLocaleDateString()} - {new Date(bc.endDate).toLocaleDateString()}</span>
                    </div>
                    <div className="flex items-center gap-4 text-slate-700">
                      <div className="w-10 h-10 rounded-full bg-indigo-50 flex items-center justify-center">
                        <MapPin size={18} className="text-indigo-600" />
                      </div>
                      <span className="font-bold text-[15px] uppercase line-clamp-1">{bc.venue}</span>
                    </div>
                  </div>

                  {isMine && (
                    <div className="flex gap-3 mt-auto">
                      <Button 
                        variant="outline" 
                        onClick={() => openEditModal(bc)}
                        className="flex-1 py-6 rounded-full font-black text-lg text-indigo-600 hover:bg-indigo-50 border-2 border-indigo-100 transition-all flex items-center justify-center gap-2"
                      >
                        <Edit size={20} /> Edit
                      </Button>
                      <Button 
                        variant="ghost" 
                        onClick={() => handleDelete(bc._id)}
                        className="flex-1 py-6 rounded-full font-black text-lg text-red-500 hover:text-white hover:bg-red-500 border-2 border-red-100 hover:border-red-500 transition-all flex items-center justify-center gap-2"
                      >
                        <Trash2 size={20} /> Delete
                      </Button>
                    </div>
                  )}
                </CardContent>
              </Card>
            );
          })
        )}
      </div>

      {isModalOpen && (
        <div className="fixed inset-0 z-[200] flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm">
          <Card className="w-full max-w-lg overflow-y-auto max-h-[90vh] bg-white rounded-[2.5rem] shadow-2xl scrollbar-hide">
            <div className="sticky top-0 z-10 bg-indigo-600 p-8 text-white flex justify-between items-center">
              <h2 className="text-3xl font-black">{editingId ? 'Edit Bootcamp ✏️' : 'New Bootcamp 🚀'}</h2>
              <button onClick={() => setIsModalOpen(false)} className="text-white hover:scale-110 p-2">✕</button>
            </div>
            <form onSubmit={handleSubmit} className="p-8 flex flex-col gap-5">
              <div>
                <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 ml-1">Bootcamp Title</label>
                <input 
                  type="text" required placeholder="e.g. Master Web Development"
                  className="w-full p-4 border-2 rounded-2xl focus:border-indigo-500 outline-none font-bold text-slate-700 bg-slate-50 transition-all"
                  value={formData.title} onChange={e => setFormData({...formData, title: e.target.value})}
                />
              </div>
              <textarea 
                required placeholder="What will they learn?" rows={3}
                className="w-full p-4 border-2 rounded-2xl focus:border-indigo-500 outline-none font-bold text-slate-700 bg-slate-50 transition-all resize-none"
                value={formData.description} onChange={e => setFormData({...formData, description: e.target.value})}
              ></textarea>
              <div className="grid grid-cols-2 gap-4">
                <input 
                  type="date" required
                  className="w-full p-4 border-2 rounded-2xl focus:border-indigo-500 outline-none font-bold text-slate-700 bg-slate-50 transition-all"
                  value={formData.date} onChange={e => setFormData({...formData, date: e.target.value})}
                />
                <input 
                  type="date" required
                  className="w-full p-4 border-2 rounded-2xl focus:border-indigo-500 outline-none font-bold text-slate-700 bg-slate-50 transition-all"
                  value={formData.endDate} onChange={e => setFormData({...formData, endDate: e.target.value})}
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <input 
                  type="number" required placeholder="Price (₹)"
                  className="w-full p-4 border-2 rounded-2xl focus:border-indigo-500 outline-none font-bold text-slate-700 bg-slate-50 transition-all"
                  value={formData.price} onChange={e => setFormData({...formData, price: Number(e.target.value)})}
                />
                <input 
                  type="text" required placeholder="Venue (e.g. Zoom Live)"
                  className="w-full p-4 border-2 rounded-2xl focus:border-indigo-500 outline-none font-bold text-slate-700 bg-slate-50 transition-all"
                  value={formData.venue} onChange={e => setFormData({...formData, venue: e.target.value})}
                />
              </div>
              <input 
                type="url" placeholder="Meeting Link (Optional)"
                className="w-full p-4 border-2 rounded-2xl focus:border-indigo-500 outline-none font-bold text-slate-700 bg-slate-50 transition-all mb-4"
                value={formData.meetingLink} onChange={e => setFormData({...formData, meetingLink: e.target.value})}
              />
              <div className="space-y-2">
                <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 ml-1">Bootcamp Image</label>
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
                  className="w-full p-4 border-2 border-dashed rounded-2xl font-bold text-xs cursor-pointer hover:border-indigo-500 transition-colors bg-slate-50"
                />
                {imagePreview && (
                  <div className="mt-2 h-24 w-full rounded-2xl overflow-hidden border">
                    <img src={imagePreview} className="w-full h-full object-cover" alt="Preview" />
                  </div>
                )}
              </div>
              <Button type="submit" className="w-full py-6 font-black text-xl bg-indigo-600 hover:bg-indigo-700 mt-2 rounded-[1.5rem] shadow-xl shadow-indigo-100">
                {editingId ? 'Save Changes ✨' : 'Launch Bootcamp 🚀'}
              </Button>
            </form>
          </Card>
        </div>
      )}
    </DashboardLayout>
  );
}
