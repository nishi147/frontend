"use client";

import React, { useEffect, useState } from 'react';
import { DashboardLayout } from '@/components/layout/DashboardLayout';
import { Button } from '@/components/ui/Button';
import { Card, CardContent } from '@/components/ui/Card';
import { QuizForm } from '@/components/dashboard/QuizForm';
import api from '@/utils/api';
import { Plus, HelpCircle, Trash2, Edit3, Loader2, Award } from 'lucide-react';
import { useToast } from '@/context/ToastContext';

export default function AdminQuizzesPage() {
    const { showToast } = useToast();
    const [quizzes, setQuizzes] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [showForm, setShowForm] = useState(false);
    const [selectedQuiz, setSelectedQuiz] = useState(null);

    const fetchQuizzes = async () => {
        try {
            const res = await api.get('/api/quizzes/teacher/my-quizzes');
            if (res.data.success) {
                setQuizzes(res.data.data);
            }
        } catch (err) {
            console.error("Failed to fetch quizzes", err);
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        fetchQuizzes();
    }, []);

    const handleDelete = async (id: string) => {
        if (!confirm('Are you sure you want to delete this challenge?')) return;
        try {
            const res = await api.delete(`/api/quizzes/${id}`);
            if (res.data.success) {
                showToast('Challenge deleted successfully!', 'success');
                fetchQuizzes();
            }
        } catch (err) {
            showToast('Failed to delete challenge', 'error');
        }
    };

    return (
        <DashboardLayout allowedRoles={['admin']}>
            <div className="flex flex-col gap-8">
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                    <div>
                        <h1 className="text-4xl font-black text-gray-800 mb-2">Global Challenges 🌍</h1>
                        <p className="text-gray-500 font-bold">Admin control for all quizzes across the academy.</p>
                    </div>
                    <Button 
                        onClick={() => { setSelectedQuiz(null); setShowForm(true); }}
                        className="font-black text-lg px-8 py-6 rounded-2xl shadow-xl shadow-secondary-100 bg-secondary-600 hover:bg-secondary-700"
                    >
                        <Plus className="w-5 h-5 mr-2" /> Global Challenge
                    </Button>
                </div>

                {isLoading ? (
                    <div className="p-20 text-center"><Loader2 className="w-12 h-12 animate-spin mx-auto text-secondary-500" /></div>
                ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {quizzes.map((quiz: any) => (
                            <Card key={quiz._id} className="bg-white border-b-8 border-secondary-500 rounded-[2rem] hover:-translate-y-2 transition-all group">
                                <CardContent className="p-8">
                                    <div className="flex justify-between items-start mb-4">
                                        <div className="bg-secondary-50 p-3 rounded-2xl text-secondary-600">
                                            <HelpCircle className="w-6 h-6" />
                                        </div>
                                        <div className="flex gap-2">
                                            <button onClick={() => { setSelectedQuiz(quiz); setShowForm(true); }} className="p-2 text-gray-400 hover:text-secondary-500"><Edit3 className="w-5 h-5" /></button>
                                            <button onClick={() => handleDelete(quiz._id)} className="p-2 text-gray-400 hover:text-red-500"><Trash2 className="w-5 h-5" /></button>
                                        </div>
                                    </div>
                                    <h3 className="text-xl font-black text-gray-800 mb-2 line-clamp-1">{quiz.title}</h3>
                                    
                                    <div className="flex flex-col gap-2 pt-4 border-t border-gray-50">
                                        <div className="flex justify-between items-center">
                                            <p className="text-xs font-black text-gray-400 uppercase tracking-widest">Course</p>
                                            <p className="text-[10px] font-black bg-gray-100 px-2 py-0.5 rounded text-gray-500 tracking-tighter capitalize">{quiz.creator?.name || 'Admin'}</p>
                                        </div>
                                        <p className="font-bold text-secondary-600">{quiz.course?.title}</p>
                                    </div>
                                </CardContent>
                            </Card>
                        ))}
                    </div>
                )}
            </div>

            {showForm && (
                <QuizForm 
                    initialData={selectedQuiz}
                    onClose={() => setShowForm(false)}
                    onSuccess={fetchQuizzes}
                />
            )}
        </DashboardLayout>
    );
}
