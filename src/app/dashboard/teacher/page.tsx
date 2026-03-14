"use client";

import React, { useEffect, useState } from 'react';
import { DashboardLayout } from '@/components/layout/DashboardLayout';
import { Card, CardTitle, CardContent } from '@/components/ui/Card';
import { useAuth } from '@/context/AuthContext';
import { Button } from '@/components/ui/Button';
import axios from 'axios';
import Link from 'next/link';
import { useToast } from '@/context/ToastContext';

export default function TeacherDashboard() {
  const { user } = useAuth();
  const [liveClasses, setLiveClasses] = useState([]);
  const [myCourses, setMyCourses] = useState([]);
  const [isScheduleModalOpen, setIsScheduleModalOpen] = useState(false);
  const [scheduleData, setScheduleData] = useState({ title: '', course: '', scheduledDate: '', meetingLink: '' });
  const [isScheduling, setIsScheduling] = useState(false);
  const { showToast } = useToast();

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [classRes, courseRes] = await Promise.all([
          axios.get('/api/live-classes/teacher'),
          axios.get('/api/courses/teacher/my-courses')
        ]);
        
        if (classRes.data.success) {
          setLiveClasses(classRes.data.data);
        }
        if (courseRes.data.success) {
          setMyCourses(courseRes.data.data);
        }
      } catch (e) {
        console.error(e);
      }
    };
    fetchData();
  }, []);

  const handleScheduleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsScheduling(true);
    try {
      const res = await axios.post('/api/live-classes', scheduleData);
      if (res.data.success) {
        showToast('Class scheduled successfully!', 'success');
        setLiveClasses([...liveClasses, res.data.data] as any);
        setIsScheduleModalOpen(false);
        setScheduleData({ title: '', course: '', scheduledDate: '', meetingLink: '' });
      }
    } catch (err: any) {
      console.error(err);
      showToast(`Failed to schedule class: ${err.response?.data?.message || err.message}`, 'error');
    } finally {
      setIsScheduling(false);
    }
  };

  return (
    <DashboardLayout allowedRoles={['teacher', 'admin']}>
      <div className="flex flex-col gap-8">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
          <div>
            <h1 className="text-3xl md:text-4xl font-extrabold text-secondary-600 mb-2">Welcome Teacher {user?.name}! 🍎</h1>
            <p className="text-lg md:text-xl text-gray-500 font-bold">Manage your courses and students from here.</p>
          </div>
          <Link href="/dashboard/teacher/courses/new">
            <Button size="lg" variant="secondary">Create New Course</Button>
          </Link>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
           <Card hoverEffect className="bg-gradient-to-br from-green-100 to-emerald-100 border-none shadow-md">
             <CardTitle className="text-emerald-700">Active Courses 📖</CardTitle>
             <CardContent className="mt-4">
               <div className="text-5xl font-black text-emerald-600">{myCourses.length}</div>
             </CardContent>
           </Card>
           
           <Card hoverEffect className="bg-gradient-to-br from-blue-100 to-primary-100 border-none shadow-md">
             <CardTitle className="text-primary-700">Total Students 🎒</CardTitle>
             <CardContent className="mt-4">
               <div className="text-5xl font-black text-primary-600">0</div>
             </CardContent>
           </Card>

           <Card hoverEffect className="bg-gradient-to-br from-purple-100 to-secondary-100 border-none shadow-md">
             <CardTitle className="text-secondary-700">Earnings 💰</CardTitle>
             <CardContent className="mt-4">
               <div className="text-5xl font-black text-secondary-600">₹0</div>
             </CardContent>
           </Card>
        </div>

        <div className="flex flex-col md:flex-row justify-between items-start md:items-end mt-8 gap-4">
          <h2 className="text-2xl md:text-3xl font-bold text-gray-800">Your Courses 📘</h2>
          <Link href="/dashboard/teacher/courses/new">
            <Button size="sm" variant="outline">Add Course</Button>
          </Link>
        </div>

        {myCourses.length === 0 ? (
          <Card className="bg-white/50 border-dashed border-4 border-gray-300 text-center py-12">
            <p className="text-xl text-gray-500 font-bold">You haven't created any courses yet.</p>
            <Link href="/dashboard/teacher/courses/new">
              <Button variant="secondary" className="mt-4">Create Your First Course</Button>
            </Link>
          </Card>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {myCourses.map((course: any) => (
              <Card key={course._id} className="bg-white overflow-hidden hover:shadow-xl transition-all border-none">
                <div className="h-40 bg-gray-200 relative">
                  {course.thumbnail ? (
                    <img src={course.thumbnail} alt={course.title} className="w-full h-full object-cover" />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center text-4xl bg-gradient-to-br from-primary-100 to-secondary-100">
                      📗
                    </div>
                  )}
                  <div className="absolute top-2 right-2 px-3 py-1 bg-white/90 rounded-full text-xs font-black uppercase text-secondary-600 shadow-sm">
                    {course.isApproved ? 'Approved' : 'Pending'}
                  </div>
                </div>
                <CardContent className="p-6">
                  <h3 className="text-xl font-black text-gray-800 mb-2 truncate">{course.title}</h3>
                  <div className="flex justify-between items-center text-sm font-bold text-gray-500 mb-4">
                    <span>{course.numberOfSessions} Sessions</span>
                    <span className="text-primary-600">₹{course.totalCoursePrice}</span>
                  </div>
                  <div className="flex gap-2">
                    <Link href={`/dashboard/teacher/courses/${course._id}/lessons`} className="flex-1">
                      <Button variant="outline" size="sm" className="w-full font-bold">Lessons</Button>
                    </Link>
                    <Link href={`/dashboard/teacher/courses/${course._id}/edit`} className="flex-1">
                      <Button variant="secondary" size="sm" className="w-full font-bold">Edit</Button>
                    </Link>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}

        <div className="flex flex-col md:flex-row justify-between items-start md:items-end mt-12 gap-4">
          <h2 className="text-2xl md:text-3xl font-bold text-gray-800">Your Scheduled Classes 🎥</h2>
          <Button variant="outline" size="sm" onClick={() => setIsScheduleModalOpen(true)}>Schedule Class</Button>
        </div>

        {liveClasses.length === 0 ? (
          <Card className="bg-white/50 border-dashed border-4 border-gray-300 text-center py-12">
            <p className="text-xl text-gray-500 font-bold">You haven't scheduled any live classes.</p>
            <Button variant="secondary" className="mt-4" onClick={() => setIsScheduleModalOpen(true)}>Schedule First Class</Button>
          </Card>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {liveClasses.map((lc: any) => (
              <Card key={lc._id} className="bg-white border-l-8 border-secondary-500 overflow-hidden">
                <CardTitle className="text-xl mb-2 px-6 pt-6">{lc.title}</CardTitle>
                <CardContent className="px-6 pb-6 pt-2">
                   <div className="p-2 bg-gray-50 rounded-lg text-sm mb-4 font-bold text-gray-400">
                     Course: {lc.course?.title || 'General'}
                   </div>
                  <p className="text-secondary-600 font-bold">Date: {new Date(lc.scheduledDate).toLocaleString()}</p>
                  <a href={lc.meetingLink} target="_blank" rel="noreferrer">
                    <Button size="sm" variant="secondary" className="mt-4" fullWidth>Start Class</Button>
                  </a>
                </CardContent>
              </Card>
            ))}
          </div>
        )}

        {/* Schedule Modal */}
        {isScheduleModalOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-md">
             <Card className="w-full max-w-lg bg-white overflow-hidden shadow-2xl">
               <div className="bg-secondary-500 p-6 text-white flex justify-between items-center">
                  <h3 className="text-2xl font-black">Schedule Live Class 🎥</h3>
                  <button onClick={() => setIsScheduleModalOpen(false)} className="text-3xl font-bold hover:scale-110">✕</button>
               </div>
               <CardContent className="p-6">
                 <form onSubmit={handleScheduleSubmit} className="flex flex-col gap-4">
                    <div className="flex flex-col gap-1">
                       <label className="text-sm font-bold text-gray-600">Class Title</label>
                       <input 
                        required
                        type="text"
                        placeholder="e.g. Intro to Fun Coding"
                        className="p-3 border-2 border-gray-100 rounded-xl focus:border-secondary-400 outline-none font-semibold"
                        value={scheduleData.title}
                        onChange={e => setScheduleData({...scheduleData, title: e.target.value})}
                       />
                    </div>
                    <div className="flex flex-col gap-1">
                       <label className="text-sm font-bold text-gray-600">Select Course</label>
                       <select 
                        required
                        className="p-3 border-2 border-gray-100 rounded-xl focus:border-secondary-400 outline-none font-semibold"
                        value={scheduleData.course}
                        onChange={e => setScheduleData({...scheduleData, course: e.target.value})}
                       >
                         <option value="">Select a course...</option>
                         {myCourses.map((c: any) => (
                           <option key={c._id} value={c._id}>{c.title}</option>
                         ))}
                       </select>
                    </div>
                    <div className="flex flex-col gap-1">
                       <label className="text-sm font-bold text-gray-600">Scheduled Date & Time</label>
                       <input 
                        required
                        type="datetime-local"
                        className="p-3 border-2 border-gray-100 rounded-xl focus:border-secondary-400 outline-none font-semibold"
                        value={scheduleData.scheduledDate}
                        onChange={e => setScheduleData({...scheduleData, scheduledDate: e.target.value})}
                       />
                    </div>
                    <div className="flex flex-col gap-1">
                       <label className="text-sm font-bold text-gray-600">Meeting Link (Zoom/Google Meet)</label>
                       <input 
                        required
                        type="url"
                        placeholder="https://meet.google.com/..."
                        className="p-3 border-2 border-gray-100 rounded-xl focus:border-secondary-400 outline-none font-semibold"
                        value={scheduleData.meetingLink}
                        onChange={e => setScheduleData({...scheduleData, meetingLink: e.target.value})}
                       />
                    </div>
                    <Button type="submit" variant="secondary" size="lg" className="mt-4" isLoading={isScheduling}>
                       Schedule Now 🚀
                    </Button>
                 </form>
               </CardContent>
             </Card>
          </div>
        )}
      </div>
    </DashboardLayout>
  );
}
