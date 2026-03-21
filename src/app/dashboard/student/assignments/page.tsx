"use client";

import React, { useEffect, useState } from 'react';
import { DashboardLayout } from '@/components/layout/DashboardLayout';
import { Card, CardTitle, CardContent } from '@/components/ui/Card';
import { useAuth } from '@/context/AuthContext';
import { Button } from '@/components/ui/Button';
import axios from 'axios';
import { FileText, Clock, CheckCircle, Upload } from 'lucide-react';

export default function AssignmentsPage() {
  const { user } = useAuth();
  const [assignments, setAssignments] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchAssignments = async () => {
      try {
        // In a real app, we'd fetch assignments for all student's courses
        // For now, let's fetch all (or a mock list if API is empty)
        const res = await axios.get('/api/assignments');
        if (res.data.success) {
          setAssignments(res.data.data);
        }
      } catch (e) {
        console.error(e);
      } finally {
        setIsLoading(false);
      }
    };
    fetchAssignments();
  }, []);

  return (
    <DashboardLayout allowedRoles={['student']}>
      <div className="flex flex-col gap-8">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
          <div>
            <h1 className="text-3xl md:text-4xl font-extrabold text-primary-600 mb-2">My Assignments 📝</h1>
            <p className="text-lg text-gray-500 font-bold">Track your tasks and submit your work.</p>
          </div>
        </div>

        {isLoading ? (
          <div className="text-center py-20">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600 mx-auto"></div>
            <p className="mt-4 text-gray-500 font-bold">Loading your assignments...</p>
          </div>
        ) : assignments.length === 0 ? (
          <Card className="bg-white/50 border-dashed border-4 border-gray-300 text-center py-12">
            <FileText className="w-16 h-16 text-gray-300 mx-auto mb-4" />
            <p className="text-xl text-gray-500 font-bold">No assignments found yet.</p>
            <p className="text-gray-400">Assignments from your teachers will appear here.</p>
          </Card>
        ) : (
          <div className="grid grid-cols-1 gap-6">
            {assignments.map((assignment: any) => (
              <Card key={assignment._id} className="bg-white border-l-8 border-primary-500 hover:shadow-xl transition-all">
                <div className="p-6">
                  <div className="flex justify-between items-start mb-4">
                    <div>
                      <CardTitle className="text-2xl mb-1">{assignment.title}</CardTitle>
                      <p className="text-gray-600 font-medium">{assignment.description}</p>
                    </div>
                    <div className="flex items-center gap-2 bg-primary-50 text-primary-700 px-4 py-2 rounded-full font-bold text-sm">
                      <Clock className="w-4 h-4" />
                      Due: {new Date(assignment.dueDate).toLocaleDateString()}
                    </div>
                  </div>

                  <div className="flex flex-wrap gap-4 mt-6">
                    {assignment.attachmentUrl && (
                      <a href={assignment.attachmentUrl} target="_blank" rel="noreferrer" className="flex-1">
                        <Button variant="outline" className="w-full flex gap-2">
                          <FileText className="w-4 h-4" /> Download Resources
                        </Button>
                      </a>
                    )}
                    <Button className="flex-1 flex gap-2">
                      <Upload className="w-4 h-4" /> Submit Work
                    </Button>
                  </div>
                </div>
              </Card>
            ))}
          </div>
        )}
      </div>
    </DashboardLayout>
  );
}
