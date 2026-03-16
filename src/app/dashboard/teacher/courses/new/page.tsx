"use client";

import React, { useState } from 'react';
import { DashboardLayout } from '@/components/layout/DashboardLayout';
import { Card, CardTitle, CardContent } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import axios from 'axios';
import { useRouter } from 'next/navigation';
import { useToast } from '@/context/ToastContext';

export default function CreateCoursePage() {
  const router = useRouter();
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    category: '',
    numberOfSessions: 1,
    pricePerSession: 0,
  });
  const [thumbnail, setThumbnail] = useState<File | null>(null);
  const [loading, setLoading] = useState(false);
  const { showToast } = useToast();
const API = process.env.NEXT_PUBLIC_API_URL;
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      const data = new FormData();
      data.append('title', formData.title);
      data.append('description', formData.description);
      data.append('category', formData.category);
      data.append('numberOfSessions', formData.numberOfSessions.toString());
      data.append('pricePerSession', formData.pricePerSession.toString());
      if (thumbnail) {
        data.append('thumbnail', thumbnail);
      }

      const res = await axios.post(
  `${API}/api/courses`,
  data,
  {
    withCredentials: true,
    headers: {
      'Content-Type': 'multipart/form-data',
    },
  }
);
      if (res.data.success) {
        showToast('Course created successfully! Waiting for Admin approval.', 'success');
       router.push('/dashboard/teacher/courses');
      }
    } catch (error) {
       console.error(error);
       showToast('Failed to create course', 'error');
    } finally {
      setLoading(false);
    }
  };


  return (
    <DashboardLayout allowedRoles={['teacher', 'admin']}>
      <div className="max-w-3xl mx-auto">
        <h1 className="text-4xl font-black text-gray-800 mb-6 flex items-center gap-3">
          <span className="text-5xl">🎨</span> Create a New Course
        </h1>
        
        <Card className="bg-white/90">
          <CardContent>
            <form onSubmit={handleSubmit} className="flex flex-col gap-6 p-2">
              <div className="flex flex-col gap-2">
                <label className="font-bold text-gray-700">Course Title</label>
                <input 
                  type="text" 
                  required
                  placeholder="e.g. Fun CSS Animations for Kids!"
                  className="w-full px-4 py-3 rounded-xl border-2 border-gray-200 focus:border-secondary-500 font-semibold focus:outline-none"
                  value={formData.title}
                  onChange={(e) => setFormData({...formData, title: e.target.value})}
                />
              </div>

              <div className="flex flex-col gap-2">
                <label className="font-bold text-gray-700">Course Thumbnail (Optional)</label>
                <input 
                  type="file" 
                  accept="image/*"
                  className="w-full px-4 py-3 rounded-xl border-2 border-gray-200 focus:border-secondary-500 font-semibold focus:outline-none file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-secondary-50 file:text-secondary-700 hover:file:bg-secondary-100"
                  onChange={(e) => setThumbnail(e.target.files ? e.target.files[0] : null)}
                />
              </div>


              <div className="flex flex-col gap-2">
                <label className="font-bold text-gray-700">Category</label>
                <input 
                  type="text" 
                  required
                  placeholder="e.g. Coding, Math, Science"
                  className="w-full px-4 py-3 rounded-xl border-2 border-gray-200 focus:border-secondary-500 font-semibold focus:outline-none"
                  value={formData.category}
                  onChange={(e) => setFormData({...formData, category: e.target.value})}
                />
              </div>

              <div className="flex flex-col gap-2">
                <label className="font-bold text-gray-700">Description</label>
                <textarea 
                  required
                  rows={4}
                  placeholder="Describe your course playfully..."
                  className="w-full px-4 py-3 rounded-xl border-2 border-gray-200 focus:border-secondary-500 font-semibold focus:outline-none resize-none"
                  value={formData.description}
                  onChange={(e) => setFormData({...formData, description: e.target.value})}
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="flex flex-col gap-2">
                  <label className="font-bold text-gray-700">Number of Sessions</label>
                  <input 
                    type="number" 
                    min="1"
                    required
                    className="w-full px-4 py-3 rounded-xl border-2 border-gray-200 focus:border-secondary-500 font-semibold focus:outline-none text-center text-xl"
                    value={formData.numberOfSessions}
                    onChange={(e) => setFormData({...formData, numberOfSessions: parseInt(e.target.value)})}
                  />
                </div>

                <div className="flex flex-col gap-2">
                  <label className="font-bold text-gray-700">Price per Session (₹)</label>
                  <input 
                    type="number" 
                    min="0"
                    required
                    className="w-full px-4 py-3 rounded-xl border-2 border-gray-200 focus:border-secondary-500 font-bold focus:outline-none text-center text-xl text-secondary-600"
                    value={formData.pricePerSession}
                    onChange={(e) => setFormData({...formData, pricePerSession: parseInt(e.target.value)})}
                  />
                </div>
              </div>

              <div className="bg-secondary-50 border-2 border-secondary-200 p-4 rounded-xl flex justify-between items-center mt-2">
                <span className="font-bold text-secondary-800">Total Course Price:</span>
                <span className="text-3xl font-black text-secondary-600">₹{formData.numberOfSessions * formData.pricePerSession}</span>
              </div>

              <Button type="submit" variant="secondary" size="lg" className="mt-4" isLoading={loading}>
                Create Course 🚀
              </Button>
            </form>
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  );
}
