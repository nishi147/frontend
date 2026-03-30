"use client";

import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import api from '@/utils/api';
import { X, Loader2, Calendar, FileText } from 'lucide-react';
import { useToast } from '@/context/ToastContext';

interface AssignmentFormProps {
  onClose: () => void;
  onSuccess: () => void;
  initialData?: any;
}

export const AssignmentForm = ({ onClose, onSuccess, initialData }: AssignmentFormProps) => {
  const { showToast } = useToast();
  const [loading, setLoading] = useState(false);
  const [courses, setCourses] = useState<any[]>([]);
  const [formData, setFormData] = useState({
    title: initialData?.title || '',
    description: initialData?.description || '',
    course: initialData?.course?._id || '',
    dueDate: initialData?.dueDate ? new Date(initialData.dueDate).toISOString().split('T')[0] : '',
    attachmentUrl: initialData?.attachmentUrl || ''
  });

  useEffect(() => {
    const fetchCourses = async () => {
      try {
        const res = await api.get('/api/courses/teacher/my-courses');
        if (res.data.success) {
          setCourses(res.data.data);
          if (!formData.course && res.data.data.length > 0) {
            setFormData(prev => ({ ...prev, course: res.data.data[0]._id }));
          }
        }
      } catch (err) {
        console.error("Failed to fetch courses", err);
      }
    };
    fetchCourses();
  }, [formData.course]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.title || !formData.course || !formData.description) {
      showToast('Please fill all required fields', 'error');
      return;
    }

    setLoading(true);
    try {
      const url = initialData 
        ? `/api/assignments/${initialData._id}` 
        : '/api/assignments';
      const method = initialData ? 'put' : 'post';

      const res = await (api as any)[method](url, formData);
      
      if (res.data.success) {
        showToast(`Assignment ${initialData ? 'updated' : 'created'} successfully! 📝`, 'success');
        onSuccess();
        onClose();
      }
    } catch (err: any) {
      console.error("Assignment submission error", err);
      showToast(err.response?.data?.message || 'Failed to save assignment', 'error');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-[200] flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm animate-in fade-in duration-300">
      <div className="bg-white rounded-[3rem] shadow-2xl w-full max-w-2xl overflow-hidden animate-in zoom-in-95 duration-300">
        <div className="p-8 border-b flex justify-between items-center bg-gradient-to-r from-primary-500 to-primary-600 text-white">
          <h2 className="text-2xl font-black flex items-center gap-3">
            <FileText className="w-8 h-8" /> {initialData ? 'Edit Mission' : 'Create New Mission'}
          </h2>
          <button onClick={onClose} className="p-2 hover:bg-white/20 rounded-full transition-colors">
            <X className="w-6 h-6" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-8 space-y-6 max-h-[70vh] overflow-y-auto custom-scrollbar">
          <div>
            <label className="block text-sm font-black text-gray-500 uppercase tracking-widest mb-2">Assignment Title</label>
            <Input 
              value={formData.title}
              onChange={e => setFormData({ ...formData, title: e.target.value })}
              placeholder="e.g., Build a Rocket with HTML/CSS"
              className="rounded-2xl border-2 border-gray-100 focus:border-primary-500 py-6"
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-black text-gray-500 uppercase tracking-widest mb-2">Target Course</label>
              <select 
                value={formData.course}
                onChange={e => setFormData({ ...formData, course: e.target.value })}
                className="w-full p-4 bg-gray-50 border-2 border-gray-100 rounded-2xl font-bold text-gray-700 outline-none focus:border-primary-500 transition-all appearance-none"
              >
                {courses.map(c => (
                  <option key={c._id} value={c._id}>{c.title}</option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-sm font-black text-gray-500 uppercase tracking-widest mb-2 flex items-center gap-2">
                <Calendar className="w-4 h-4" /> Due Date
              </label>
              <Input 
                type="date"
                value={formData.dueDate}
                onChange={e => setFormData({ ...formData, dueDate: e.target.value })}
                className="rounded-2xl border-2 border-gray-100 focus:border-primary-500 py-6"
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-black text-gray-500 uppercase tracking-widest mb-2">Mission Description</label>
            <textarea 
              value={formData.description}
              onChange={e => setFormData({ ...formData, description: e.target.value })}
              rows={4}
              placeholder="Explain the mission objectives, tools needed, and what to submit..."
              className="w-full p-4 bg-gray-50 border-2 border-gray-100 rounded-2xl font-bold text-gray-700 outline-none focus:border-primary-500 transition-all resize-none"
            />
          </div>

          <div>
            <label className="block text-sm font-black text-gray-500 uppercase tracking-widest mb-2">Resource Link (Optional)</label>
            <Input 
              value={formData.attachmentUrl}
              onChange={e => setFormData({ ...formData, attachmentUrl: e.target.value })}
              placeholder="https://github.com/resource-link"
              className="rounded-2xl border-2 border-gray-100 focus:border-primary-500 py-6"
            />
          </div>
        </form>

        <div className="p-8 border-t bg-gray-50 flex gap-4">
          <Button 
            variant="outline" 
            onClick={onClose} 
            className="flex-1 py-4 rounded-2xl font-black text-lg"
          >
            Cancel
          </Button>
          <Button 
            onClick={handleSubmit} 
            disabled={loading}
            className="flex-1 py-4 rounded-2xl font-black text-lg bg-primary-600 hover:bg-primary-700"
          >
            {loading ? <Loader2 className="w-6 h-6 animate-spin mx-auto" /> : (initialData ? 'Update Mission 🚀' : 'Launch Mission 🚀')}
          </Button>
        </div>
      </div>
    </div>
  );
};
