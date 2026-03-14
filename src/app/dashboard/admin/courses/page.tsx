"use client";

import React, { useEffect, useState } from 'react';
import { useAuth } from '@/context/AuthContext';
import { Header } from '@/components/layout/Header';
import { DashboardLayout } from '@/components/layout/DashboardLayout';
import { Card, CardContent } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import axios from 'axios';
import { Check, X, Eye, FileText, Trash2, BookOpen, Plus, Edit2 } from 'lucide-react';
import { useToast } from '@/context/ToastContext';

export default function AdminCourseManagement() {
  const { user, loading } = useAuth();
  const [courses, setCourses] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingCourse, setEditingCourse] = useState<any>(null);
  const { showToast, confirm } = useToast();
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    category: '',
    pricePerSession: 0,
    numberOfSessions: 0,
    thumbnail: '',
    isPublished: true,
    isApproved: true
  });

  const fetchCourses = async () => {
    try {
      const res = await axios.get('/api/courses/admin/all');
      if (res.data.success) {
        setCourses(res.data.data);
      }
    } catch (err) {
      console.error("Failed to fetch courses", err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (user?.role === 'admin') {
      fetchCourses();
    }
  }, [user]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      if (editingCourse) {
        await axios.put(`/api/courses/${editingCourse._id}`, formData);
        showToast("Course Updated!", "success");
      } else {
        await axios.post('/api/courses', formData);
        showToast("Course Created!", "success");
      }
      setIsModalOpen(false);
      setEditingCourse(null);
      fetchCourses();
    } catch (err: any) {
      console.error("Error saving course:", err.response?.data || err.message);
      showToast(`Error saving course: ${err.response?.data?.error || "Check console for details"}`, "error");
    }
  };

  const openEdit = (course: any) => {
    setEditingCourse(course);
    setFormData({
      title: course.title,
      description: course.description,
      category: course.category,
      pricePerSession: course.pricePerSession,
      numberOfSessions: course.numberOfSessions,
      thumbnail: course.thumbnail,
      isPublished: course.isPublished,
      isApproved: course.isApproved
    });
    setIsModalOpen(true);
  };

  const approveCourse = async (id: string) => {
    try {
      await axios.put(`/api/courses/admin/approve/${id}`);
      showToast("Course Approved!", "success");
      fetchCourses();
    } catch (err) {
      showToast("Error approving course", "error");
    }
  };

  const deleteCourse = async (id: string) => {
    const isConfirmed = await (confirm as any)("Delete Course?", "This will remove the course and all its modules. You cannot undo this.");
    if (!isConfirmed) return;
    try {
      await axios.delete(`/api/courses/${id}`);
      showToast("Course Deleted", "success");
      fetchCourses();
    } catch (err) {
      showToast("Error deleting course", "error");
    }
  };

  if (loading || isLoading) return <div className="p-20 text-center font-bold text-secondary-500 text-2xl animate-pulse">Auditing Library... 📚</div>;

  return (
    <DashboardLayout>
      <div className="flex flex-col md:flex-row items-start md:items-center justify-between mb-8 gap-4 px-2 sm:px-0">
        <div>
          <h1 className="text-3xl md:text-4xl font-black text-gray-800 tracking-tight">Course <span className="text-secondary-500">Oversight</span> 🎓</h1>
          <p className="text-gray-400 font-bold mt-1 uppercase text-[10px] tracking-[0.2em]">Curriculum Control Center</p>
        </div>
        <Button onClick={() => { setEditingCourse(null); setFormData({ title: '', description: '', category: '', pricePerSession: 0, numberOfSessions: 0, thumbnail: '', isPublished: true, isApproved: true }); setIsModalOpen(true); }} className="flex items-center gap-3 w-full md:w-auto justify-center py-4 px-8 rounded-2xl shadow-lg shadow-primary-100 font-black">
          <Plus className="w-5 h-5" /> Deploy Course
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8 mb-12">
        {courses.map((course: any) => (
          <Card key={course._id} className="relative group overflow-hidden border-none shadow-xl bg-white rounded-[2.5rem] transform transition-all hover:scale-[1.02] hover:shadow-2xl">
            <div className="relative h-48 overflow-hidden">
              <img src={course.thumbnail} alt={course.title} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" />
              <div className={`absolute top-4 right-4 px-4 py-1.5 rounded-xl text-[10px] font-black uppercase tracking-widest shadow-lg ${course.isApproved ? 'bg-green-500 text-white' : 'bg-amber-500 text-white animate-pulse'}`}>
                {course.isApproved ? 'Live' : 'Draft'}
              </div>
            </div>

            <CardContent className="p-8">
              <div className="flex items-center gap-2 text-gray-400 text-[10px] font-black uppercase tracking-widest mb-3">
                <BookOpen className="w-3.5 h-3.5 text-primary-500" /> {course.category}
              </div>
              <h3 className="text-2xl font-black text-gray-800 mb-2 truncate">{course.title}</h3>
              <p className="text-gray-500 font-bold text-sm mb-6 line-clamp-2 min-h-[2.5rem] opacity-70">{course.description}</p>
              
              <div className="flex items-center gap-3 mb-8 pt-6 border-t border-gray-50">
                <div className={`w-10 h-10 rounded-xl flex items-center justify-center font-black text-white shadow-md ${course.isApproved ? 'bg-primary-500' : 'bg-gray-300'}`}>
                  {course.teacher?.name?.[0] || 'T'}
                </div>
                <div>
                  <p className="text-[10px] font-black text-gray-400 uppercase tracking-tighter">Instructor</p>
                  <p className="font-black text-gray-700 text-sm">{course.teacher?.name || 'Academic Lead'}</p>
                </div>
              </div>

              <div className="flex gap-2">
                {!course.isApproved && (
                  <Button 
                    className="flex-[2] font-black bg-accent-500 hover:bg-accent-600 shadow-lg shadow-accent-200" 
                    onClick={() => approveCourse(course._id)}
                  >
                    Verify
                  </Button>
                )}
                <Button 
                  variant="outline" 
                  className="flex-1 text-primary-500 border-primary-200 hover:bg-primary-50 font-black p-3" 
                  onClick={() => openEdit(course)}
                >
                  <Edit2 className="w-4 h-4" />
                </Button>
                <Button 
                  variant="outline" 
                  className="flex-1 text-red-500 border-red-200 hover:bg-red-50 font-black p-3" 
                  onClick={() => deleteCourse(course._id)}
                >
                  <Trash2 className="w-4 h-4" />
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Course Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-[200] flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
           <Card className="w-full max-w-2xl bg-white rounded-[2.5rem] overflow-hidden max-h-[90vh] overflow-y-auto shadow-2xl">
              <div className="bg-primary-500 p-6 md:p-8 text-white flex justify-between items-center sticky top-0 z-10">
                 <h3 className="text-2xl font-black">{editingCourse ? 'Studio: Edit Mode' : 'Creation Lab 🧪'}</h3>
                 <button onClick={() => setIsModalOpen(false)} className="text-2xl font-bold bg-white/20 w-10 h-10 rounded-full flex items-center justify-center hover:bg-white/30 transition-all">✕</button>
              </div>
              <CardContent className="p-6 md:p-10">
                 <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-5 md:gap-6">
                    <div className="md:col-span-2">
                      <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1 mb-2 block">Hero Title</label>
                      <input required value={formData.title} className="w-full p-4 bg-gray-50 rounded-2xl border-2 border-transparent focus:border-primary-500 outline-none font-black text-gray-800" onChange={e => setFormData({...formData, title: e.target.value})} />
                    </div>
                    <div className="md:col-span-2">
                      <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1 mb-2 block">Mission Description</label>
                      <textarea required value={formData.description} className="w-full p-4 bg-gray-50 rounded-2xl border-2 border-transparent focus:border-primary-500 outline-none font-bold h-32 text-gray-600 resize-none" onChange={e => setFormData({...formData, description: e.target.value})} />
                    </div>
                    <div className="md:col-span-1">
                      <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1 mb-2 block">Category</label>
                      <input required value={formData.category} className="w-full p-4 bg-gray-50 rounded-2xl border-2 border-transparent focus:border-primary-500 outline-none font-black text-gray-800" onChange={e => setFormData({...formData, category: e.target.value})} />
                    </div>
                    <div className="md:col-span-1">
                      <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1 mb-2 block">Visual URL</label>
                      <input value={formData.thumbnail} className="w-full p-4 bg-gray-50 rounded-2xl border-2 border-transparent focus:border-primary-500 outline-none font-black text-gray-800" onChange={e => setFormData({...formData, thumbnail: e.target.value})} />
                    </div>
                    <div>
                      <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1 mb-2 block">Tuition (₹)</label>
                      <input type="number" required value={formData.pricePerSession} className="w-full p-4 bg-gray-50 rounded-2xl border-2 border-transparent focus:border-primary-500 outline-none font-black text-gray-800" onChange={e => setFormData({...formData, pricePerSession: Number(e.target.value)})} />
                    </div>
                    <div>
                      <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1 mb-2 block">Total Milestones</label>
                      <input type="number" required value={formData.numberOfSessions} className="w-full p-4 bg-gray-50 rounded-2xl border-2 border-transparent focus:border-primary-500 outline-none font-black text-gray-800" onChange={e => setFormData({...formData, numberOfSessions: Number(e.target.value)})} />
                    </div>
                    <Button type="submit" variant="primary" className="md:col-span-2 font-black text-lg py-5 rounded-3xl mt-4 shadow-xl shadow-primary-100">
                      {editingCourse ? 'SYNCHRONIZE UPDATE 💾' : 'LAUNCH MISSION 🚀'}
                    </Button>
                 </form>
              </CardContent>
           </Card>
        </div>
      )}
    </DashboardLayout>
  );
}
