"use client";
import React from 'react';
import { Plus, Video, Calendar, Link as LinkIcon, Trash2, Clock, CheckCircle2, LayoutDashboard } from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { Card, CardTitle, CardContent } from '@/components/ui/Card';
import { DashboardLayout } from '@/components/layout/DashboardLayout';
import api from '@/utils/api';
import { useAuth } from '@/context/AuthContext';
import { useToast } from '@/context/ToastContext';


export default function TeacherLiveClassesPage() {
    const { user } = useAuth();
    const [courses, setCourses] = React.useState<any[]>([]);
    const [sessions, setSessions] = React.useState<any[]>([]);
    const [loading, setLoading] = React.useState(true);
    const [isScheduling, setIsScheduling] = React.useState(false);
    const { showToast } = useToast();
    const [formData, setFormData] = React.useState({
        title: '',
        course: '',
        scheduledDate: '',
        meetingLink: '',
    });

    const fetchData = async () => {
        try {
            const [coursesRes, sessionsRes] = await Promise.all([
                api.get('/api/live-classes/courses'),
                api.get('/api/live-classes/teacher')
            ]);
            if (coursesRes.data.success) setCourses(coursesRes.data.data);
            if (sessionsRes.data.success) setSessions(sessionsRes.data.data);
        } catch (error) {
            console.error("Failed to fetch live session data", error);
        } finally {
            setLoading(false);
        }
    };

    React.useEffect(() => {
        fetchData();
    }, []);

    const handleSchedule = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        try {
            const res = await api.post('/api/live-classes', formData);
            if (res.data.success) {
                showToast('Session scheduled successfully! 🚀', 'success');
                setIsScheduling(false);
                setFormData({ title: '', course: '', scheduledDate: '', meetingLink: '' });
                fetchData();
            }
        } catch (error) {
            showToast('Failed to schedule session', 'error');
        } finally {
            setLoading(false);
        }
    };

    return (
        <DashboardLayout allowedRoles={['teacher', 'admin']}>
            <div className="max-w-6xl mx-auto px-4 py-8">
                <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6 mb-12">
                    <div>
                        <h1 className="text-4xl font-black text-gray-800 flex items-center gap-3">
                            <Video className="w-10 h-10 text-primary-500" /> Live Session Hub
                        </h1>
                        <p className="text-xl text-gray-500 font-bold mt-2">Bring magic to life in real-time! ✨</p>
                    </div>
                    <Button 
                        size="lg" 
                        onClick={() => setIsScheduling(!isScheduling)}
                        variant={isScheduling ? "ghost" : "primary"}
                        className="font-black px-8"
                    >
                        {isScheduling ? "Cancel" : <><Plus className="mr-2" /> Schedule Magic</>}
                    </Button>
                </div>

                {isScheduling && (
                    <Card className="mb-12 border-primary-100 bg-primary-50/30 overflow-hidden animate-in fade-in slide-in-from-top duration-300">
                        <CardContent className="p-8">
                            <form onSubmit={handleSchedule} className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div className="space-y-2">
                                    <label className="font-bold text-gray-700 ml-1">Session Title</label>
                                    <input 
                                        type="text" required
                                        placeholder="e.g. Secret Python Spells 🪄"
                                        className="w-full px-4 py-3 rounded-2xl border-2 border-gray-200 focus:border-primary-500 outline-none font-bold"
                                        value={formData.title}
                                        onChange={e => setFormData({...formData, title: e.target.value})}
                                    />
                                </div>
                                <div className="space-y-2">
                                    <label className="font-bold text-gray-700 ml-1">Select Course</label>
                                    <select 
                                        required
                                        className="w-full px-4 py-3 rounded-2xl border-2 border-gray-200 focus:border-primary-500 outline-none font-bold bg-white"
                                        value={formData.course}
                                        onChange={e => setFormData({...formData, course: e.target.value})}
                                    >
                                        <option value="">Choose a magical path...</option>
                                        {courses.map(c => (
                                            <option key={c._id} value={c._id}>{c.title}</option>
                                        ))}
                                    </select>
                                </div>
                                <div className="space-y-2">
                                    <label className="font-bold text-gray-700 ml-1">Date & Time</label>
                                    <input 
                                        type="datetime-local" required
                                        className="w-full px-4 py-3 rounded-2xl border-2 border-gray-200 focus:border-primary-500 outline-none font-bold"
                                        value={formData.scheduledDate}
                                        onChange={e => setFormData({...formData, scheduledDate: e.target.value})}
                                    />
                                </div>
                                <div className="space-y-2">
                                    <label className="font-bold text-gray-700 ml-1">Meeting Link (Zoom/Meet)</label>
                                    <input 
                                        type="url" required
                                        placeholder="https://zoom.us/j/..."
                                        className="w-full px-4 py-3 rounded-2xl border-2 border-gray-200 focus:border-primary-500 outline-none font-bold"
                                        value={formData.meetingLink}
                                        onChange={e => setFormData({...formData, meetingLink: e.target.value})}
                                    />
                                </div>
                                <Button type="submit" size="lg" className="md:col-span-2 font-black text-xl py-6 mt-4 shadow-xl shadow-primary-200" isLoading={loading}>
                                    Go Live! 🚀
                                </Button>
                            </form>
                        </CardContent>
                    </Card>
                )}

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                    {sessions.length === 0 ? (
                        <div className="col-span-full py-20 text-center bg-gray-50 border-4 border-dashed border-gray-200 rounded-[3rem]">
                            <Clock className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                            <h3 className="text-2xl font-black text-gray-400">No sessions scheduled yet</h3>
                            <p className="text-gray-400 font-bold mt-2">Start by creating your first interactive live session!</p>
                        </div>
                    ) : (
                        sessions.map((session) => (
                            <Card key={session._id} className="group hover:-translate-y-2 transition-all duration-300 border-b-8 border-secondary-500 bg-white">
                                <CardContent className="p-8">
                                    <div className="flex justify-between items-start mb-6">
                                        <div className={`px-4 py-1.5 rounded-full text-xs font-black uppercase tracking-widest ${
                                            session.status === 'scheduled' ? 'bg-secondary-100 text-secondary-600' :
                                            session.status === 'live' ? 'bg-red-100 text-red-600 animate-pulse' :
                                            'bg-gray-100 text-gray-500'
                                        }`}>
                                            {session.status}
                                        </div>
                                        <button className="text-gray-300 hover:text-red-500 transition-colors">
                                            <Trash2 size={20} />
                                        </button>
                                    </div>
                                    <h3 className="text-2xl font-black text-gray-800 mb-4 group-hover:text-secondary-600 transition-colors line-clamp-2 min-h-[4rem]">
                                        {session.title}
                                    </h3>
                                    <div className="space-y-3 mb-8">
                                        <div className="flex items-center gap-3 text-gray-500 font-bold">
                                            <LayoutDashboard size={18} className="text-secondary-400" />
                                            <span className="line-clamp-1">{session.course?.title}</span>
                                        </div>
                                        <div className="flex items-center gap-3 text-gray-500 font-bold">
                                            <Calendar size={18} className="text-secondary-400" />
                                            <span>{new Date(session.scheduledDate).toLocaleString([], { dateStyle: 'medium', timeStyle: 'short' })}</span>
                                        </div>
                                    </div>
                                    <a 
                                        href={session.meetingLink} 
                                        target="_blank" 
                                        rel="noopener noreferrer"
                                        className="w-full flex items-center justify-center gap-3 py-4 rounded-2xl bg-secondary-50 hover:bg-secondary-600 hover:text-white transition-all font-black text-secondary-600 group-hover:shadow-lg"
                                    >
                                        <LinkIcon size={20} /> Launch Session
                                    </a>
                                </CardContent>
                            </Card>
                        ))
                    )}
                </div>
            </div>
        </DashboardLayout>
    );
}

