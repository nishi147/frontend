"use client";

import React, { useEffect, useState } from 'react';
import { useAuth } from '@/context/AuthContext';
import { Header } from '@/components/layout/Header';
import { Card, CardContent } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import axios from 'axios';
import { Check, X, Eye, FileText, Trash2, BookOpen, Plus, Edit2 } from 'lucide-react';

export default function AdminCourseManagement() {
  const { user, loading } = useAuth();
  const [courses, setCourses] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingCourse, setEditingCourse] = useState<any>(null);
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
      const res = await axios.get('https://backend-1-5cs8.onrender.com/api/courses/admin/all');
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
        await axios.put(`https://backend-1-5cs8.onrender.com/api/courses/${editingCourse._id}`, formData);
        alert("Course Updated!");
      } else {
        await axios.post('https://backend-1-5cs8.onrender.com/api/courses', formData);
        alert("Course Created!");
      }
      setIsModalOpen(false);
      setEditingCourse(null);
      fetchCourses();
    } catch (err) {
      alert("Error saving course");
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
      await axios.put(`https://backend-1-5cs8.onrender.com/api/courses/admin/approve/${id}`);
      alert("Course Approved!");
      fetchCourses();
    } catch (err) {
      alert("Error approving course");
    }
  };

  const deleteCourse = async (id: string) => {
    if (!confirm("Are you sure?")) return;
    try {
      await axios.delete(`https://backend-1-5cs8.onrender.com/api/courses/${id}`);
      alert("Course Deleted");
      fetchCourses();
    } catch (err) {
      alert("Error deleting course");
    }
  };

  if (loading || isLoading) return <div className="p-20 text-center font-bold text-secondary-500 text-2xl animate-pulse">Auditing Library... 📚</div>;

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col font-sans">
      <Header />
      <main className="flex-1 container mx-auto px-4 py-8">
        <div className="flex items-center justify-between mb-8">
          <h1 className="text-4xl font-black text-gray-800">Course Oversight 🎓</h1>
          <Button onClick={() => { setEditingCourse(null); setFormData({ title: '', description: '', category: '', pricePerSession: 0, numberOfSessions: 0, thumbnail: '', isPublished: true, isApproved: true }); setIsModalOpen(true); }} className="flex items-center gap-2">
            <Plus className="w-5 h-5" /> Add New Course
          </Button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {courses.map((course: any) => (
            <Card key={course._id} className="relative group overflow-hidden border-none shadow-xl bg-white rounded-[2.5rem]">
              <div className="relative h-48">
                <img src={course.thumbnail} alt={course.title} className="w-full h-full object-cover" />
                <div className={`absolute top-4 right-4 px-4 py-1 rounded-full text-xs font-black uppercase tracking-widest ${course.isApproved ? 'bg-green-500 text-white' : 'bg-amber-500 text-white animate-pulse'}`}>
                  {course.isApproved ? 'Approved' : 'Pending Review'}
                </div>
              </div>

              <CardContent className="p-8">
                <div className="flex items-center gap-2 text-gray-400 text-xs font-black uppercase tracking-widest mb-3">
                  <BookOpen className="w-3 h-3" /> {course.category}
                </div>
                <h3 className="text-2xl font-black text-gray-800 mb-2 truncate">{course.title}</h3>
                <p className="text-gray-500 font-medium mb-6 line-clamp-2">{course.description}</p>
                
                <div className="flex items-center gap-3 mb-8 pt-6 border-t border-gray-100">
                  <div className="w-10 h-10 rounded-xl bg-gray-100 flex items-center justify-center font-black text-secondary-500">
                    {course.teacher?.name?.[0] || 'T'}
                  </div>
                  <div>
                    <p className="text-xs font-black text-gray-400 uppercase tracking-tighter">Instructor</p>
                    <p className="font-bold text-gray-700">{course.teacher?.name || 'Unknown'}</p>
                  </div>
                </div>

                <div className="flex gap-2">
                  {!course.isApproved && (
                    <Button 
                      className="flex-1 font-black bg-accent-500 hover:bg-accent-600 shadow-lg shadow-accent-200" 
                      onClick={() => approveCourse(course._id)}
                    >
                      Approve
                    </Button>
                  )}
                  <Button 
                    variant="outline" 
                    className="flex-1 text-primary-500 border-primary-200 hover:bg-primary-50 font-black" 
                    onClick={() => openEdit(course)}
                  >
                    <Edit2 className="w-4 h-4" />
                  </Button>
                  <Button 
                    variant="outline" 
                    className="flex-1 text-red-500 border-red-200 hover:bg-red-50 font-black" 
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
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
             <Card className="w-full max-w-2xl bg-white rounded-[2rem] overflow-hidden max-h-[90vh] overflow-y-auto">
                <div className="bg-primary-500 p-6 text-white flex justify-between items-center sticky top-0 z-10">
                   <h3 className="text-2xl font-black">{editingCourse ? 'Edit Course 📝' : 'Creation Lab 🧪'}</h3>
                   <button onClick={() => setIsModalOpen(false)} className="text-2xl font-bold">✕</button>
                </div>
                <CardContent className="p-8">
                   <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div className="md:col-span-2">
                        <label className="text-sm font-black text-gray-400 uppercase">Course Title</label>
                        <input required value={formData.title} className="w-full p-4 bg-gray-50 rounded-2xl border-2 border-transparent focus:border-primary-500 outline-none font-bold" onChange={e => setFormData({...formData, title: e.target.value})} />
                      </div>
                      <div className="md:col-span-2">
                        <label className="text-sm font-black text-gray-400 uppercase">Description</label>
                        <textarea required value={formData.description} className="w-full p-4 bg-gray-50 rounded-2xl border-2 border-transparent focus:border-primary-500 outline-none font-bold h-32" onChange={e => setFormData({...formData, description: e.target.value})} />
                      </div>
                      <div>
                        <label className="text-sm font-black text-gray-400 uppercase">Category</label>
                        <input required value={formData.category} className="w-full p-4 bg-gray-50 rounded-2xl border-2 border-transparent focus:border-primary-500 outline-none font-bold" onChange={e => setFormData({...formData, category: e.target.value})} />
                      </div>
                      <div>
                        <label className="text-sm font-black text-gray-400 uppercase">Thumbnail URL</label>
                        <input value={formData.thumbnail} className="w-full p-4 bg-gray-50 rounded-2xl border-2 border-transparent focus:border-primary-500 outline-none font-bold" onChange={e => setFormData({...formData, thumbnail: e.target.value})} />
                      </div>
                      <div>
                        <label className="text-sm font-black text-gray-400 uppercase">Price per Session (₹)</label>
                        <input type="number" required value={formData.pricePerSession} className="w-full p-4 bg-gray-50 rounded-2xl border-2 border-transparent focus:border-primary-500 outline-none font-bold" onChange={e => setFormData({...formData, pricePerSession: Number(e.target.value)})} />
                      </div>
                      <div>
                        <label className="text-sm font-black text-gray-400 uppercase">Number of Sessions</label>
                        <input type="number" required value={formData.numberOfSessions} className="w-full p-4 bg-gray-50 rounded-2xl border-2 border-transparent focus:border-primary-500 outline-none font-bold" onChange={e => setFormData({...formData, numberOfSessions: Number(e.target.value)})} />
                      </div>
                      <Button type="submit" variant="primary" size="lg" className="md:col-span-2 font-black text-lg py-4 mt-4">
                        {editingCourse ? 'CONFIRM CHANGES 💾' : 'DEPLOY COURSE 🚀'}
                      </Button>
                   </form>
                </CardContent>
             </Card>
          </div>
        )}
      </main>
    </div>
  );
}
