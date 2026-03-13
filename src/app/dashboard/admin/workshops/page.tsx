"use client";

import React, { useEffect, useState } from 'react';
import { DashboardLayout } from '@/components/layout/DashboardLayout';
import { Card, CardContent } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import axios from 'axios';
import { Plus, Trash2, Calendar, MapPin, Tag } from 'lucide-react';

export default function AdminWorkshops() {
  const [workshops, setWorkshops] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    date: '',
    price: 0,
    venue: '',
  });

  const fetchWorkshops = async () => {
    try {
      const res = await axios.get(`${process.env.NEXT_PUBLIC_API_URL}/api/workshops`);
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
      const res = await axios.post(`${process.env.NEXT_PUBLIC_API_URL}/api/workshops`, formData);
      if (res.data.success) {
        setIsModalOpen(false);
        setFormData({ title: '', description: '', date: '', price: 0, venue: '' });
        fetchWorkshops();
      }
    } catch (err) {
      alert("Failed to create workshop");
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure?")) return;
    try {
      await axios.delete(`${process.env.NEXT_PUBLIC_API_URL}/api/workshops/${id}`);
      fetchWorkshops();
    } catch (err) {
      alert("Failed to delete workshop");
    }
  };

  return (
    <DashboardLayout allowedRoles={['admin']}>
      <div className="flex justify-between items-center mb-10">
        <div>
          <h1 className="text-4xl font-black text-gray-800">Workshop Management 🎟️</h1>
          <p className="text-gray-500 font-bold">Create and manage upcoming magical bootcamps.</p>
        </div>
        <Button onClick={() => setIsModalOpen(true)} className="font-black">
          <Plus className="mr-2" /> Add Workshop
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {workshops.map((ws: any) => (
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
                   <span className="font-bold text-[15px] uppercase">{ws.venue}</span>
                </div>
              </div>

              <Button 
                variant="ghost" 
                onClick={() => handleDelete(ws._id)}
                className="w-full py-6 rounded-full font-black text-lg text-red-500 hover:text-white hover:bg-red-500 border-2 border-red-100 hover:border-red-500 transition-all flex items-center justify-center gap-2"
              >
                <Trash2 size={20} /> Delete Workshop
              </Button>
            </CardContent>
          </Card>
        ))}
      </div>

      {isModalOpen && (
        <div className="fixed inset-0 z-[200] flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
          <Card className="w-full max-w-lg overflow-hidden bg-white">
            <div className="bg-accent-500 p-6 text-white flex justify-between items-center">
              <h2 className="text-2xl font-black">New Workshop 🚀</h2>
              <button onClick={() => setIsModalOpen(false)} className="text-white hover:scale-110">✕</button>
            </div>
            <form onSubmit={handleSubmit} className="p-6 flex flex-col gap-4">
              <input 
                type="text" required placeholder="Workshop Title"
                className="p-3 border-2 rounded-xl focus:border-accent-500 outline-none font-bold"
                value={formData.title} onChange={e => setFormData({...formData, title: e.target.value})}
              />
              <textarea 
                required placeholder="Description" rows={3}
                className="p-3 border-2 rounded-xl focus:border-accent-500 outline-none font-bold resize-none"
                value={formData.description} onChange={e => setFormData({...formData, description: e.target.value})}
              ></textarea>
              <div className="grid grid-cols-2 gap-4">
                <input 
                  type="date" required
                  className="p-3 border-2 rounded-xl focus:border-accent-500 outline-none font-bold"
                  value={formData.date} onChange={e => setFormData({...formData, date: e.target.value})}
                />
                <input 
                  type="number" required placeholder="Price (₹)"
                  className="p-3 border-2 rounded-xl focus:border-accent-500 outline-none font-bold"
                  value={formData.price} onChange={e => setFormData({...formData, price: Number(e.target.value)})}
                />
              </div>
              <input 
                type="text" required placeholder="Venue (or Online Link)"
                className="p-3 border-2 rounded-xl focus:border-accent-500 outline-none font-bold"
                value={formData.venue} onChange={e => setFormData({...formData, venue: e.target.value})}
              />
              <Button type="submit" className="w-full py-6 font-black text-lg bg-accent-500 hover:bg-accent-600">
                Create Workshop ✨
              </Button>
            </form>
          </Card>
        </div>
      )}
    </DashboardLayout>
  );
}


