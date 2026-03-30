"use client";
import React, { useEffect, useState } from 'react';
import { useAuth } from '@/context/AuthContext';
import { DashboardLayout } from '@/components/layout/DashboardLayout';
import api from '@/utils/api';
import { MessageSquare, Trash2, Edit3, Plus, X, Star, User, GraduationCap, CheckCircle2 } from 'lucide-react';
import { useToast } from '@/context/ToastContext';

export default function TestimonialsPage() {
  const { user, loading } = useAuth();
  const [testimonials, setTestimonials] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [formData, setFormData] = useState({
    name: '',
    role: 'Student',
    content: '',
    rating: 5,
    image: '',
    isActive: true
  });
  const { showToast } = useToast();

  const fetchTestimonials = async () => {
    try {
      const res = await api.get('/api/testimonials?admin=true');
      setTestimonials(res.data.data);
    } catch (err) {
      console.error("Failed to fetch testimonials", err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (user?.role === 'admin') fetchTestimonials();
  }, [user]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      if (editingId) {
        await api.put(`/api/testimonials/${editingId}`, formData);
        showToast("Testimonial updated!", "success");
      } else {
        await api.post('/api/testimonials', formData);
        showToast("Testimonial added!", "success");
      }
      setShowForm(false);
      setEditingId(null);
      setFormData({ name: '', role: 'Student', content: '', rating: 5, image: '', isActive: true });
      fetchTestimonials();
    } catch (err) {
      showToast("Operation failed.", "error");
    }
  };

  const handleDelete = async (id: string) => {
    if (!window.confirm("Delete this testimonial?")) return;
    try {
      await api.delete(`/api/testimonials/${id}`);
      showToast("Deleted successfully", "success");
      fetchTestimonials();
    } catch (err) {
      showToast("Delete failed", "error");
    }
  };

  const handleEdit = (t: any) => {
    setFormData({
      name: t.name,
      role: t.role,
      content: t.content,
      rating: t.rating,
      image: t.image || '',
      isActive: t.isActive
    });
    setEditingId(t._id);
    setShowForm(true);
  };

  if (loading || isLoading) return <div className="p-20 text-center font-black text-2xl text-primary-500 animate-pulse uppercase tracking-widest">Collecting Praises... ✨</div>;

  return (
    <DashboardLayout allowedRoles={['admin']}>
      <div className="max-w-7xl mx-auto space-y-12 animate-in fade-in duration-700">
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
          <div className="space-y-2">
            <h1 className="text-5xl font-black text-gray-800 tracking-tighter">Social <span className="text-primary-500">Proof</span> 🌟</h1>
            <p className="text-gray-400 font-bold text-lg">Manage what students and parents are saying about Ruzann.</p>
          </div>
          <button 
            onClick={() => {
              setEditingId(null);
              setFormData({ name: '', role: 'Student', content: '', rating: 5, image: '', isActive: true });
              setShowForm(true);
            }}
            className="px-8 py-5 bg-primary-500 text-white rounded-[2.5rem] font-black uppercase text-xs tracking-widest shadow-xl shadow-primary-100 hover:bg-primary-600 transition-all active:scale-95 flex items-center gap-3"
          >
            <Plus size={20} strokeWidth={3} /> Add Testimonial
          </button>
        </div>

        {showForm && (
          <div className="fixed inset-0 z-[1000] flex items-center justify-center p-4">
            <div className="absolute inset-0 bg-black/40 backdrop-blur-sm" onClick={() => setShowForm(false)} />
            <div className="relative bg-white w-full max-w-xl rounded-[3rem] shadow-2xl overflow-hidden animate-in zoom-in-95 duration-300">
               <form onSubmit={handleSubmit} className="p-8 md:p-12 space-y-6">
                  <div className="flex justify-between items-center">
                     <h2 className="text-3xl font-black text-gray-800 tracking-tighter">{editingId ? 'Edit' : 'New'} <span className="text-primary-500">Testimonial</span></h2>
                     <button type="button" onClick={() => setShowForm(false)} className="p-2 hover:bg-gray-100 rounded-xl transition-all"><X size={24}/></button>
                  </div>

                  <div className="space-y-4">
                    <div className="space-y-2">
                       <label className="text-[10px] font-black uppercase text-gray-400 tracking-widest ml-4">Full Name</label>
                       <input 
                         required
                         type="text"
                         className="w-full p-5 rounded-2xl border-2 border-gray-100 focus:border-primary-500 bg-gray-50/30 outline-none font-bold text-gray-700"
                         value={formData.name}
                         onChange={(e) => setFormData({...formData, name: e.target.value})}
                       />
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                       <div className="space-y-2">
                          <label className="text-[10px] font-black uppercase text-gray-400 tracking-widest ml-4">Role</label>
                          <select 
                            className="w-full p-5 rounded-2xl border-2 border-gray-100 focus:border-primary-500 bg-gray-50/30 outline-none font-bold text-gray-600"
                            value={formData.role}
                            onChange={(e) => setFormData({...formData, role: e.target.value})}
                          >
                             <option value="Student">Student</option>
                             <option value="Parent">Parent</option>
                             <option value="Other">Other</option>
                          </select>
                       </div>
                       <div className="space-y-2">
                          <label className="text-[10px] font-black uppercase text-gray-400 tracking-widest ml-4">Rating</label>
                          <input 
                            type="number" min="1" max="5"
                            className="w-full p-5 rounded-2xl border-2 border-gray-100 focus:border-primary-500 bg-gray-50/30 outline-none font-bold text-gray-700"
                            value={formData.rating}
                            onChange={(e) => setFormData({...formData, rating: Number(e.target.value)})}
                          />
                       </div>
                    </div>

                    <div className="space-y-2">
                       <label className="text-[10px] font-black uppercase text-gray-400 tracking-widest ml-4">Feedback Content</label>
                       <textarea 
                         required
                         className="w-full p-6 rounded-[2rem] border-2 border-gray-100 focus:border-primary-500 bg-gray-50/30 outline-none font-bold text-gray-600 min-h-[120px]"
                         value={formData.content}
                         onChange={(e) => setFormData({...formData, content: e.target.value})}
                       />
                    </div>
                  </div>

                  <button className="w-full bg-primary-500 text-white p-5 rounded-[2rem] font-black uppercase text-sm tracking-widest shadow-xl shadow-primary-100 hover:bg-primary-600 transition-all transform hover:-translate-y-1">
                     Save Testimonial
                  </button>
               </form>
            </div>
          </div>
        )}

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
           {testimonials.length === 0 ? (
             <div className="col-span-full py-24 text-center">
                <MessageSquare size={64} className="mx-auto text-gray-100 mb-4" />
                <p className="text-gray-400 font-black uppercase tracking-widest">No social proof found yet.</p>
             </div>
           ) : testimonials.map((t: any) => (
             <div key={t._id} className="bg-white p-8 rounded-[3rem] shadow-xl border-2 border-gray-50 group hover:-translate-y-2 transition-all duration-500">
                <div className="flex justify-between items-start mb-6">
                   <div className="flex items-center gap-4">
                      <div className="w-14 h-14 rounded-2xl bg-primary-100 flex items-center justify-center text-primary-600 shadow-inner">
                         {t.role === 'Parent' ? <User size={24} /> : <GraduationCap size={24} />}
                      </div>
                      <div>
                         <h3 className="text-xl font-black text-gray-800 leading-none mb-1">{t.name}</h3>
                         <span className="text-[10px] font-black text-primary-500 uppercase tracking-widest">{t.role}</span>
                      </div>
                   </div>
                   <div className="flex gap-2">
                      <button onClick={() => handleEdit(t)} className="p-3 bg-gray-50 text-gray-400 hover:bg-primary-500 hover:text-white rounded-xl transition-all"><Edit3 size={16} /></button>
                      <button onClick={() => handleDelete(t._id)} className="p-3 bg-red-50 text-red-500 hover:bg-red-500 hover:text-white rounded-xl transition-all"><Trash2 size={16} /></button>
                   </div>
                </div>

                <div className="flex items-center gap-1 mb-4">
                   {[...Array(5)].map((_, i) => (
                     <Star key={i} size={14} className={i < t.rating ? 'text-yellow-400' : 'text-gray-200'} fill={i < t.rating ? 'currentColor' : 'none'} />
                   ))}
                </div>

                <p className="text-gray-500 font-bold leading-relaxed mb-6 italic">"{t.content}"</p>

                <div className="flex items-center justify-between pt-6 border-t border-gray-50">
                   <span className="text-[10px] text-gray-300 font-black uppercase tracking-widest">{new Date(t.createdAt).toLocaleDateString()}</span>
                   <div className={`flex items-center gap-2 px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest ${t.isActive ? 'bg-green-50 text-green-600' : 'bg-red-50 text-red-600'}`}>
                      {t.isActive ? <CheckCircle2 size={12}/> : <X size={12}/>} {t.isActive ? 'Live' : 'Hidden'}
                   </div>
                </div>
             </div>
           ))}
        </div>
      </div>
    </DashboardLayout>
  );
}
