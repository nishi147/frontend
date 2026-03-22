"use client";

import React, { useState, useEffect } from 'react';
import { DashboardLayout } from '@/components/layout/DashboardLayout';
import { Card, CardTitle, CardContent } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import axios from 'axios';
import { Star, Send } from 'lucide-react';

import { useToast } from '@/context/ToastContext';

export default function FeedbackPage() {
  const { showToast } = useToast();
  const [courses, setCourses] = useState<any[]>([]);
  const [selectedCourse, setSelectedCourse] = useState('');
  const [rating, setRating] = useState(5);
  const [comment, setComment] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    const fetchCourses = async () => {
      try {
        const res = await axios.get('/api/courses/student/my-courses');
        if (res.data.success) {
          setCourses(res.data.data);
          if (res.data.data.length > 0) setSelectedCourse(res.data.data[0]._id);
        }
      } catch (e) {
        console.error(e);
      }
    };
    fetchCourses();
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    try {
      const res = await axios.post('/api/reviews', {
        course: selectedCourse,
        rating,
        comment
      });
      if (res.data.success) {
        showToast('Thank you for your feedback! ❤️', 'success');
        setComment('');
      }
    } catch (e) {
      console.error(e);
      showToast('Failed to submit feedback. Please try again.', 'error');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <DashboardLayout allowedRoles={['student']}>
      <div className="flex flex-col gap-8 max-w-4xl">
        <div>
          <h1 className="text-3xl md:text-4xl font-extrabold text-primary-600 mb-2">Teacher Feedback 🌟</h1>
          <p className="text-lg text-gray-500 font-bold">Help us improve by sharing your experience!</p>
        </div>

        <Card className="bg-white border-none shadow-xl rounded-[3rem] p-8">
          <form onSubmit={handleSubmit} className="flex flex-col gap-8">
            <div>
              <label className="block text-sm font-black text-gray-500 uppercase tracking-widest mb-4">Select Course</label>
              <select 
                value={selectedCourse}
                onChange={(e) => setSelectedCourse(e.target.value)}
                className="w-full p-4 bg-gray-50 border-none rounded-2xl font-bold text-gray-700 focus:ring-4 focus:ring-primary-100 transition-all outline-none appearance-none"
              >
                {courses.map((c: any) => (
                  <option key={c._id} value={c._id}>{c.title}</option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-black text-gray-500 uppercase tracking-widest mb-4">Rating</label>
              <div className="flex gap-4">
                {[1, 2, 3, 4, 5].map((num) => (
                  <button
                    key={num}
                    type="button"
                    onClick={() => setRating(num)}
                    className={`w-14 h-14 rounded-2xl flex items-center justify-center transition-all ${
                      rating >= num ? 'bg-yellow-400 text-white shadow-lg shadow-yellow-100 scale-110' : 'bg-gray-100 text-gray-400'
                    }`}
                  >
                    <Star className={`w-8 h-8 ${rating >= num ? 'fill-white' : ''}`} />
                  </button>
                ))}
              </div>
            </div>

            <div>
              <label className="block text-sm font-black text-gray-500 uppercase tracking-widest mb-4">Your Feedback</label>
              <textarea 
                value={comment}
                onChange={(e) => setComment(e.target.value)}
                rows={5}
                placeholder="What did you think of the course and the teacher?"
                className="w-full p-6 bg-gray-50 border-none rounded-3xl font-bold text-gray-700 focus:ring-4 focus:ring-primary-100 transition-all outline-none"
              />
            </div>

            <Button type="submit" disabled={isSubmitting || !selectedCourse} className="py-6 text-xl rounded-3xl flex gap-3">
              <Send className="w-6 h-6" /> {isSubmitting ? 'Sending...' : 'Submit Feedback'}
            </Button>
          </form>
        </Card>
      </div>
    </DashboardLayout>
  );
}
