"use client";

import React, { useEffect, useState } from 'react';
import { DashboardLayout } from '@/components/layout/DashboardLayout';
import { Button } from '@/components/ui/Button';
import { Card, CardContent } from '@/components/ui/Card';
import { AssignmentForm } from '@/components/dashboard/AssignmentForm';
import axios from 'axios';
import { Plus, BookOpen, Calendar, Trash2, Edit3, Loader2 } from 'lucide-react';
import { useToast } from '@/context/ToastContext';

export default function AdminAssignmentsPage() {
    const { showToast } = useToast();
    const [assignments, setAssignments] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [showForm, setShowForm] = useState(false);
    const [selectedAssignment, setSelectedAssignment] = useState(null);

    const API = process.env.NEXT_PUBLIC_API_URL || '';

    const fetchAssignments = async () => {
        try {
            // Admin endpoint (or filter handled in controller)
            const res = await axios.get(`${API}/api/assignments/teacher/my-assignments`, { withCredentials: true });
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
    }, [API]);

    const handleDelete = async (id: string) => {
        if (!confirm('Are you sure you want to delete this mission?')) return;
        try {
            const res = await axios.delete(`${API}/api/assignments/${id}`, { withCredentials: true });
            if (res.data.success) {
                showToast('Mission deleted successfully!', 'success');
                fetchAssignments();
            }
        } catch (err) {
            showToast('Failed to delete mission', 'error');
        }
    };

    return (
        <DashboardLayout allowedRoles={['admin']}>
            <div className="flex flex-col gap-8">
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                    <div>
                        <h1 className="text-4xl font-black text-gray-800 mb-2">Global Assignments 🌍</h1>
                        <p className="text-gray-500 font-bold">Admin control for all missions across the academy.</p>
                    </div>
                    <Button 
                        onClick={() => { setSelectedAssignment(null); setShowForm(true); }}
                        className="font-black text-lg px-8 py-6 rounded-2xl shadow-xl shadow-primary-100"
                    >
                        <Plus className="w-5 h-5 mr-2" /> Global Mission
                    </Button>
                </div>

                {isLoading ? (
                    <div className="p-20 text-center"><Loader2 className="w-12 h-12 animate-spin mx-auto text-primary-500" /></div>
                ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {assignments.map((assignment: any) => (
                            <Card key={assignment._id} className="bg-white border-b-8 border-primary-500 rounded-[2rem] hover:-translate-y-2 transition-all group">
                                <CardContent className="p-8">
                                    <div className="flex justify-between items-start mb-4">
                                        <div className="bg-primary-50 p-3 rounded-2xl text-primary-600">
                                            <BookOpen className="w-6 h-6" />
                                        </div>
                                        <div className="flex gap-2">
                                            <button onClick={() => { setSelectedAssignment(assignment); setShowForm(true); }} className="p-2 text-gray-400 hover:text-primary-500"><Edit3 className="w-5 h-5" /></button>
                                            <button onClick={() => handleDelete(assignment._id)} className="p-2 text-gray-400 hover:text-red-500"><Trash2 className="w-5 h-5" /></button>
                                        </div>
                                    </div>
                                    <h3 className="text-xl font-black text-gray-800 mb-2 line-clamp-1">{assignment.title}</h3>
                                    <p className="text-gray-500 font-bold text-sm mb-6 line-clamp-2 h-10">{assignment.description}</p>
                                    
                                    <div className="flex flex-col gap-2 pt-4 border-t border-gray-50">
                                        <div className="flex justify-between items-center">
                                            <p className="text-xs font-black text-gray-400 uppercase tracking-widest">Course</p>
                                            <p className="text-[10px] font-black bg-gray-100 px-2 py-0.5 rounded text-gray-500 tracking-tighter capitalize">{assignment.teacher?.name || 'Admin'}</p>
                                        </div>
                                        <p className="font-bold text-primary-600">{assignment.course?.title}</p>
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
