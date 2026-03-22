"use client";

import React, { useEffect, useState } from 'react';
import { DashboardLayout } from '@/components/layout/DashboardLayout';
import { Card, CardTitle, CardContent } from '@/components/ui/Card';
import { useAuth } from '@/context/AuthContext';
import { Button } from '@/components/ui/Button';
import axios from 'axios';
import { FileQuestion, Play, CheckCircle } from 'lucide-react';

export default function QuizzesPage() {
  const { user } = useAuth();
  const [quizzes, setQuizzes] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchQuizzes = async () => {
      try {
        const res = await axios.get('/api/quizzes');
        if (res.data.success) {
          setQuizzes(res.data.data);
        }
      } catch (e) {
        console.error(e);
      } finally {
        setIsLoading(false);
      }
    };
    fetchQuizzes();
  }, []);

  return (
    <DashboardLayout allowedRoles={['student']}>
      <div className="flex flex-col gap-8">
        <div>
          <h1 className="text-3xl md:text-4xl font-extrabold text-primary-600 mb-2">Quizzes 🧠</h1>
          <p className="text-lg text-gray-500 font-bold">Challenge yourself and test your knowledge!</p>
        </div>

        {isLoading ? (
          <div className="text-center py-20">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600 mx-auto"></div>
          </div>
        ) : quizzes.length === 0 ? (
          <Card className="bg-white/50 border-dashed border-4 border-gray-200 text-center py-12">
            <FileQuestion className="w-16 h-16 text-gray-300 mx-auto mb-4" />
            <p className="text-xl text-gray-500 font-bold">No quizzes available right now.</p>
          </Card>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {quizzes.map((quiz: any) => (
              <Card key={quiz._id} hoverEffect className="bg-white border-l-8 border-accent-500">
                <div className="p-6">
                  <CardTitle className="text-2xl mb-2">{quiz.title}</CardTitle>
                  <p className="text-gray-500 font-bold text-sm mb-6 uppercase tracking-wider">
                    {quiz.questions.length} Questions • {quiz.passingScore}% Passing Score
                  </p>
                  
                  <div className="flex gap-4">
                    <Button className="flex-1 flex gap-2">
                       <Play className="w-4 h-4" /> Start Quiz
                    </Button>
                    <Button variant="outline" className="flex-1 flex gap-2">
                       <CheckCircle className="w-4 h-4" /> View History
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
