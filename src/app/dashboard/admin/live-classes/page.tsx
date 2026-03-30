"use client";

import React, { useEffect, useState } from 'react';
import { useAuth } from '@/context/AuthContext';
import { Header } from '@/components/layout/Header';
import { DashboardLayout } from '@/components/layout/DashboardLayout';
import { Card, CardContent } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import api from '@/utils/api';
import { Calendar, Video, Trash2, Plus, Clock, User } from 'lucide-react';
import { useToast } from '@/context/ToastContext';

export default function AdminLiveClasses() {
  const { user, loading } = useAuth();
  const [liveClasses, setLiveClasses] = useState([]);
  const [courses, setCourses] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const { showToast, confirm } = useToast();
  const [formData, setFormData] = useState({ title: '', course: '', scheduledDate: '', meetingLink: '', description: '' });

  const fetchData = async () => {
    try {
      const [classRes, courseRes] = await Promise.all([
        api.get('/api/live-classes/teacher'), // Admin can use teacher route or we need admin route
        api.get('/api/courses/admin/all')
      ]);
      setLiveClasses(classRes.data.data);
      setCourses(courseRes.data.data);
    } catch (err) {
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (user?.role === 'admin') fetchData();
  }, [user]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await api.post('/api/live-classes', formData);
      showToast("Live Class Scheduled!", "success");
      setIsModalOpen(false);
      fetchData();
    } catch (err) {
      showToast("Failed to schedule.", "error");
    }
  };

  const deleteClass = async (id: string) => {
    const isConfirmed = await (confirm as any)("Cancel Session?", "Are you sure you want to delete this live class?");
    if (!isConfirmed) return;
    try {
      await api.delete(`/api/live-classes/${id}`);
      fetchData();
    } catch (err) {
      showToast("Failed to delete.", "error");
    }
  };

  if (loading || isLoading) return <div className="p-20 text-center font-bold text-secondary-500 text-2xl">Loading Live Sessions... 🎥</div>;

  return (
    <DashboardLayout>
      <div className="flex flex-col md:flex-row items-start md:items-center justify-between mb-8 gap-4 px-2 sm:px-0">
        <div>
          <h1 className="text-3xl md:text-4xl font-black text-gray-800 tracking-tight">Live <span className="text-secondary-500">Sessions</span> 🎥</h1>
          <p className="text-gray-400 font-bold mt-1 uppercase text-[10px] tracking-[0.2em]">Real-time Interaction Control</p>
        </div>
        <Button onClick={() => setIsModalOpen(true)} className="flex items-center gap-3 w-full md:w-auto justify-center py-4 px-8 rounded-2xl shadow-lg shadow-secondary-100 font-black">
          <Plus className="w-5 h-5" /> Schedule Session
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8 mb-12">
        {liveClasses.map((lc: any) => (
          <Card key={lc._id} className="bg-white border-l-8 border-secondary-500 overflow-hidden shadow-xl rounded-[2.5rem] transform transition-all hover:scale-[1.02]">
            <CardContent className="p-8">
              <div className="flex justify-between items-start mb-6">
                <div className="bg-secondary-50 p-4 rounded-2xl text-secondary-600 shadow-inner">
                  <Video className="w-6 h-6" />
                </div>
                <Button variant="outline" onClick={() => deleteClass(lc._id)} className="text-red-500 border-red-50 p-2 hover:bg-red-50 hover:border-red-500 transition-all">
                  <Trash2 className="w-5 h-5" />
                </Button>
              </div>
              <h3 className="text-2xl font-black text-gray-800 mb-3 truncate">{lc.title}</h3>
              <div className="space-y-3 mb-8">
                <p className="flex items-center gap-3 text-sm font-bold text-gray-400">
                  <Clock className="w-4 h-4 text-secondary-400" /> {new Date(lc.scheduledDate).toLocaleString('en-IN', { dateStyle: 'medium', timeStyle: 'short' })}
                </p>
                <p className="flex items-center gap-3 text-sm font-bold text-gray-400">
                  <User className="w-4 h-4 text-secondary-400" /> {lc.teacher?.name || 'Academic Facilitator'}
                </p>
              </div>
              <a href={lc.meetingLink} target="_blank" rel="noreferrer" className="block">
                <Button variant="secondary" className="w-full font-black py-4 rounded-2xl shadow-lg shadow-secondary-100">LAUNCH STUDIO →</Button>
              </a>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Schedule Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-[200] flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
           <Card className="w-full max-w-lg bg-white rounded-[2.5rem] overflow-hidden shadow-2xl">
              <div className="bg-secondary-500 p-6 md:p-8 text-white flex justify-between items-center">
                 <h3 className="text-2xl font-black">Studio Scheduler 🚀</h3>
                 <button onClick={() => setIsModalOpen(false)} className="text-2xl font-bold bg-white/20 w-10 h-10 rounded-full flex items-center justify-center">✕</button>
              </div>
              <CardContent className="p-8">
                 <form onSubmit={handleSubmit} className="space-y-4">
                    <input required placeholder="Session Theme" className="w-full p-4 bg-gray-50 rounded-2xl border-2 border-transparent focus:border-secondary-500 outline-none font-black text-gray-800" onChange={e => setFormData({...formData, title: e.target.value})} />
                    <select required className="w-full p-4 bg-gray-50 rounded-2xl border-2 border-transparent focus:border-secondary-500 outline-none font-black text-gray-800" onChange={e => setFormData({...formData, course: e.target.value})}>
                       <option value="">Select Target Course</option>
                       {courses.map((c: any) => <option key={c._id} value={c._id}>{c.title}</option>)}
                    </select>
                    <input required type="datetime-local" className="w-full p-4 bg-gray-50 rounded-2xl border-2 border-transparent focus:border-secondary-500 outline-none font-black text-gray-800" onChange={e => setFormData({...formData, scheduledDate: e.target.value})} />
                    <input required placeholder="Virtual Studio Link" className="w-full p-4 bg-gray-50 rounded-2xl border-2 border-transparent focus:border-secondary-500 outline-none font-black text-gray-800" onChange={e => setFormData({...formData, meetingLink: e.target.value})} />
                    <textarea placeholder="Instructional Notes" className="w-full p-4 bg-gray-50 rounded-2xl border-2 border-transparent focus:border-secondary-500 outline-none font-bold text-gray-600 h-24 resize-none" onChange={e => setFormData({...formData, description: e.target.value})} />
                    <Button type="submit" variant="secondary" size="lg" className="w-full font-black text-lg py-5 rounded-3xl mt-4 shadow-xl shadow-secondary-100">COMMENCE BROADCAST 🌟</Button>
                 </form>
              </CardContent>
           </Card>
        </div>
      )}
    </DashboardLayout>
  );
}
