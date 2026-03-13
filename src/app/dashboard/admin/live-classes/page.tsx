"use client";

import React, { useEffect, useState } from 'react';
import { useAuth } from '@/context/AuthContext';
import { Header } from '@/components/layout/Header';
import { Card, CardContent } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import axios from 'axios';
import { Calendar, Video, Trash2, Plus, Clock, User } from 'lucide-react';

export default function AdminLiveClasses() {
  const { user, loading } = useAuth();
  const [liveClasses, setLiveClasses] = useState([]);
  const [courses, setCourses] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [formData, setFormData] = useState({ title: '', course: '', scheduledDate: '', meetingLink: '', description: '' });

  const fetchData = async () => {
    try {
      const [classRes, courseRes] = await Promise.all([
        axios.get('/api/live-classes/teacher'), // Admin can use teacher route or we need admin route
        axios.get('/api/courses/admin/all')
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
      await axios.post('/api/live-classes', formData);
      alert("Live Class Scheduled!");
      setIsModalOpen(false);
      fetchData();
    } catch (err) {
      alert("Failed to schedule.");
    }
  };

  const deleteClass = async (id: string) => {
    if (!confirm("Delete this session?")) return;
    try {
      await axios.delete(`/api/live-classes/${id}`);
      fetchData();
    } catch (err) {
      alert("Failed to delete.");
    }
  };

  if (loading || isLoading) return <div className="p-20 text-center font-bold text-secondary-500 text-2xl">Loading Live Sessions... 🎥</div>;

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col font-sans">
      <Header />
      <main className="flex-1 container mx-auto px-4 py-8">
        <div className="flex items-center justify-between mb-8">
          <h1 className="text-4xl font-black text-gray-800">Live Session Management 🎥</h1>
          <Button onClick={() => setIsModalOpen(true)} className="flex items-center gap-2">
            <Plus className="w-5 h-5" /> Schedule Session
          </Button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {liveClasses.map((lc: any) => (
            <Card key={lc._id} className="bg-white border-l-8 border-secondary-500 overflow-hidden shadow-lg rounded-3xl">
              <CardContent className="p-6">
                <div className="flex justify-between items-start mb-4">
                  <div className="bg-secondary-50 p-3 rounded-2xl text-secondary-600">
                    <Video className="w-6 h-6" />
                  </div>
                  <Button variant="outline" onClick={() => deleteClass(lc._id)} className="text-red-500 border-red-100 p-2">
                    <Trash2 className="w-5 h-5" />
                  </Button>
                </div>
                <h3 className="text-xl font-black text-gray-800 mb-2 truncate">{lc.title}</h3>
                <div className="space-y-2 text-sm font-bold text-gray-500">
                  <p className="flex items-center gap-2"><Clock className="w-4 h-4" /> {new Date(lc.scheduledDate).toLocaleString()}</p>
                  <p className="flex items-center gap-2"><User className="w-4 h-4" /> {lc.teacher?.name || 'Admin'}</p>
                </div>
                <a href={lc.meetingLink} target="_blank" rel="noreferrer" className="block mt-6">
                  <Button variant="secondary" className="w-full font-black">GO LIVE →</Button>
                </a>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Schedule Modal */}
        {isModalOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
             <Card className="w-full max-w-lg bg-white rounded-[2rem] overflow-hidden">
                <div className="bg-secondary-500 p-6 text-white flex justify-between items-center">
                   <h3 className="text-2xl font-black">Schedule New Class 🚀</h3>
                   <button onClick={() => setIsModalOpen(false)} className="text-2xl font-bold">✕</button>
                </div>
                <CardContent className="p-8">
                   <form onSubmit={handleSubmit} className="space-y-4">
                      <input required placeholder="Class Title" className="w-full p-4 bg-gray-50 rounded-2xl border-2 border-transparent focus:border-secondary-500 outline-none font-bold" onChange={e => setFormData({...formData, title: e.target.value})} />
                      <select required className="w-full p-4 bg-gray-50 rounded-2xl border-2 border-transparent focus:border-secondary-500 outline-none font-bold" onChange={e => setFormData({...formData, course: e.target.value})}>
                         <option value="">Select Course</option>
                         {courses.map((c: any) => <option key={c._id} value={c._id}>{c.title}</option>)}
                      </select>
                      <input required type="datetime-local" className="w-full p-4 bg-gray-50 rounded-2xl border-2 border-transparent focus:border-secondary-500 outline-none font-bold" onChange={e => setFormData({...formData, scheduledDate: e.target.value})} />
                      <input required placeholder="Meeting Link" className="w-full p-4 bg-gray-50 rounded-2xl border-2 border-transparent focus:border-secondary-500 outline-none font-bold" onChange={e => setFormData({...formData, meetingLink: e.target.value})} />
                      <textarea placeholder="Description" className="w-full p-4 bg-gray-50 rounded-2xl border-2 border-transparent focus:border-secondary-500 outline-none font-bold" onChange={e => setFormData({...formData, description: e.target.value})} />
                      <Button type="submit" variant="secondary" size="lg" className="w-full font-black text-lg py-4">LAUNCH SESSION 🌟</Button>
                   </form>
                </CardContent>
             </Card>
          </div>
        )}
      </main>
    </div>
  );
}
