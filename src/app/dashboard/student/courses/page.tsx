"use client";

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { DashboardLayout } from '@/components/layout/DashboardLayout';
import { Card, CardTitle, CardContent } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import api from '@/utils/api';
import { BookOpen, Video, PlayCircle, FileText } from 'lucide-react';

export default function MyCoursesPage() {
    const [courses, setCourses] = useState<any[]>([]);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        const fetchMyCourses = async () => {
            try {
                const res = await api.get('/api/courses/student/my-courses');
                if (res.data.success) {
                    setCourses(res.data.data);
                }
            } catch (e) {
                console.error("Fetch Courses Error:", e);
            } finally {
                setIsLoading(false);
            }
        };
        fetchMyCourses();
    }, []);

    if (isLoading) {
        return (
            <DashboardLayout allowedRoles={['student']}>
                <div className="flex items-center justify-center min-h-[60vh]">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div>
                </div>
            </DashboardLayout>
        );
    }

    return (
        <DashboardLayout allowedRoles={['student']}>
            <div className="flex flex-col gap-8">
                <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                    <div>
                        <h1 className="text-3xl md:text-4xl font-extrabold text-primary-600 mb-2">My Learning Path 📚</h1>
                        <p className="text-lg text-gray-500 font-bold">Pick up right where you left off.</p>
                    </div>
                    <Link href="/courses">
                        <Button variant="outline" size="lg">Browse Library</Button>
                    </Link>
                </div>

                {courses.length === 0 ? (
                    <div className="max-w-6xl mx-auto text-center py-20 bg-white/50 border-dashed border-4 border-gray-200 rounded-[3rem]">
                        <div className="text-8xl mb-8">📚</div>
                        <h1 className="text-4xl font-black text-gray-800 mb-4">No enrolled courses!</h1>
                        <p className="text-xl text-gray-500 font-bold mb-10">Choose a course to start your learning journey.</p>
                        <Link href="/courses" className="bg-primary-500 text-white px-10 py-4 rounded-2xl font-black text-xl shadow-lg shadow-primary-200 hover:scale-105 transition-transform inline-block">
                            Explore Courses 🚀
                        </Link>
                    </div>
                ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                        {courses.map((course: any) => (
                            <Card key={course._id} hoverEffect className="bg-white border-none shadow-xl overflow-hidden group rounded-[2.5rem]">
                                <div className="relative h-48 overflow-hidden">
                                    <img 
                                        src={course.thumbnail || 'https://via.placeholder.com/400x200?text=Course+Thumbnail'} 
                                        alt={course.title}
                                        className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                                    />
                                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
                                    <div className="absolute bottom-4 left-4">
                                        <span className="bg-primary-500 text-white text-[10px] uppercase font-black px-3 py-1 rounded-full tracking-widest">
                                            {course.level}
                                        </span>
                                    </div>
                                </div>
                                
                                <CardContent className="p-6">
                                    <h3 className="text-xl font-black text-gray-800 mb-2 line-clamp-1">{course.title}</h3>
                                    <p className="text-gray-500 font-bold text-sm mb-4 flex items-center gap-2">
                                        <User className="w-4 h-4" /> {course.teacher?.name}
                                    </p>
                                    
                                    <div className="space-y-4">
                                        <div className="flex justify-between text-xs font-black text-gray-400 uppercase tracking-wider">
                                            <span>Progress</span>
                                            <span className="text-primary-600">0%</span>
                                        </div>
                                        <div className="w-full bg-gray-100 h-2 rounded-full overflow-hidden">
                                            <div className="bg-primary-500 h-full w-[0%] rounded-full" />
                                        </div>
                                        
                                        <div className="grid grid-cols-2 gap-3 pt-2">
                                            <Link href={`/dashboard/student/courses/${course._id}`}>
                                                <Button fullWidth size="sm" className="flex gap-2">
                                                    <PlayCircle className="w-4 h-4" /> Resume
                                                </Button>
                                            </Link>
                                            <Button variant="outline" size="sm" className="flex gap-2">
                                                <FileText className="w-4 h-4" /> Notes
                                            </Button>
                                        </div>
                                    </div>
                                </CardContent>
                            </Card>
                        ))}
                    </div>
                )}
            </div>
        </DashboardLayout>
    );
}

const User = ({ className }: { className?: string }) => (
    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}><path d="M19 21v-2a4 4 0 0 0-4-4H9a4 4 0 0 0-4 4v2"></path><circle cx="12" cy="7" r="4"></circle></svg>
);
