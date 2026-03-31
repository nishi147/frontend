"use client";

import React, { useEffect, useState } from 'react';
import { DashboardLayout } from '@/components/layout/DashboardLayout';
import { Button } from '@/components/ui/Button';
import { Card, CardContent } from '@/components/ui/Card';
import { AssignmentForm } from '@/components/dashboard/AssignmentForm';
import api from '@/utils/api';
import { Plus, BookOpen, Calendar, Trash2, Edit3, Loader2 } from 'lucide-react';
import { useToast } from '@/context/ToastContext';

export default function AssignmentsPage() {
    const { showToast } = useToast();
    const [assignments, setAssignments] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [showForm, setShowForm] = useState(false);
    const [selectedAssignment, setSelectedAssignment] = useState(null);

    const fetchAssignments = async () => {
        try {
            const res = await api.get('/api/assignments/teacher/my-assignments');
            if (res.data.success) {
                setAssignments(res.data.data);
            }
        } catch (err) {
            console.error("Failed to fetch assignments", err);
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        fetchAssignments();
    }, []);

    const handleDelete = async (id: string) => {
        if (!confirm('Are you sure you want to delete this mission?')) return;
        try {
            const res = await api.delete(`/api/assignments/${id}`);
            if (res.data.success) {
                showToast('Mission deleted successfully!', 'success');
                fetchAssignments();
            }
        } catch (err) {
            showToast('Failed to delete mission', 'error');
        }
    };

    return (
        <DashboardLayout allowedRoles={['teacher', 'admin']}>
            <div className="flex flex-col gap-8">
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                    <div>
                        <h1 className="text-4xl font-black text-gray-800 mb-2">Mission Control 🚀</h1>
                        <p className="text-gray-500 font-bold">Deploy and manage assignments for your space cadets.</p>
                    </div>
                    <Button 
                        onClick={() => { setSelectedAssignment(null); setShowForm(true); }}
                        className="font-black text-lg px-8 py-6 rounded-2xl shadow-xl shadow-primary-100"
                    >
                        <Plus className="w-5 h-5 mr-2" /> New Mission
                    </Button>
                </div>

                {isLoading ? (
                    <div className="p-20 text-center"><Loader2 className="w-12 h-12 animate-spin mx-auto text-primary-500" /></div>
                ) : assignments.length === 0 ? (
                    <Card className="p-20 text-center border-dashed border-4 border-gray-200 bg-white/50 rounded-[3rem]">
                        <div className="text-6xl mb-6">📝</div>
                        <h2 className="text-2xl font-black text-gray-400 mb-4">No missions deployed!</h2>
                        <p className="text-gray-400 font-bold mb-8">Start by creating your first assignment mission.</p>
                        <Button onClick={() => setShowForm(true)} variant="outline" className="font-black">Deploy Mission 🚀</Button>
                    </Card>
                ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {assignments.map((assignment: any) => (
                            <Card key={assignment._id} className="bg-white border-b-8 border-primary-500 rounded-[2rem] hover:-translate-y-2 transition-all group">
                                <CardContent className="p-8">
                                    <div className="flex justify-between items-start mb-4">
                                        <div className="bg-primary-50 p-3 rounded-2xl text-primary-600">
                                            <BookOpen className="w-6 h-6" />
                                        </div>
                                        <div className="flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                                            <button onClick={() => { setSelectedAssignment(assignment); setShowForm(true); }} className="p-2 text-gray-400 hover:text-primary-500"><Edit3 className="w-5 h-5" /></button>
                                            <button onClick={() => handleDelete(assignment._id)} className="p-2 text-gray-400 hover:text-red-500"><Trash2 className="w-5 h-5" /></button>
                                        </div>
                                    </div>
                                    <h3 className="text-xl font-black text-gray-800 mb-2 line-clamp-1">{assignment.title}</h3>
                                    <p className="text-gray-500 font-bold text-sm mb-6 line-clamp-2 h-10">{assignment.description}</p>
                                    
                                    <div className="flex flex-col gap-2 pt-4 border-t border-gray-50">
                                        <p className="text-xs font-black text-gray-400 uppercase tracking-widest">Course</p>
                                        <p className="font-bold text-primary-600">{assignment.course?.title}</p>
                                        {assignment.dueDate && (
                                            <p className="text-xs font-bold text-orange-500 flex items-center gap-1 mt-2">
                                                <Calendar className="w-3 h-3" /> Due: {new Date(assignment.dueDate).toLocaleDateString()}
                                            </p>
                                        )}
                                    </div>
                                </CardContent>
                            </Card>
                        ))}
                    </div>
                )}
            </div>

            {showForm && (
                <AssignmentForm 
                    initialData={selectedAssignment}
                    onClose={() => setShowForm(false)}
                    onSuccess={fetchAssignments}
                />
            )}
        </DashboardLayout>
    );
}
