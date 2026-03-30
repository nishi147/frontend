"use client";

import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import api from '@/utils/api';
import { X, Loader2, Plus, Trash2, HelpCircle } from 'lucide-react';
import { useToast } from '@/context/ToastContext';

interface QuizFormProps {
  onClose: () => void;
  onSuccess: () => void;
  initialData?: any;
}

export const QuizForm = ({ onClose, onSuccess, initialData }: QuizFormProps) => {
  const { showToast } = useToast();
  const [loading, setLoading] = useState(false);
  const [courses, setCourses] = useState<any[]>([]);
  const [formData, setFormData] = useState({
    title: initialData?.title || '',
    course: initialData?.course?._id || '',
    passingScore: initialData?.passingScore || 70,
    questions: initialData?.questions || [
      { text: '', options: ['', '', '', ''], correctOption: 0, points: 1 }
    ]
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

  const handleAddQuestion = () => {
    setFormData({
      ...formData,
      questions: [...formData.questions, { text: '', options: ['', '', '', ''], correctOption: 0, points: 1 }]
    });
  };

  const handleRemoveQuestion = (index: number) => {
    const newQuestions = formData.questions.filter((_, i) => i !== index);
    setFormData({ ...formData, questions: newQuestions });
  };

  const handleQuestionChange = (index: number, field: string, value: any) => {
    const newQuestions = [...formData.questions];
    newQuestions[index] = { ...newQuestions[index], [field]: value };
    setFormData({ ...formData, questions: newQuestions });
  };

  const handleOptionChange = (qIndex: number, oIndex: number, value: string) => {
    const newQuestions = [...formData.questions];
    newQuestions[qIndex].options[oIndex] = value;
    setFormData({ ...formData, questions: newQuestions });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.title || !formData.course) {
      showToast('Please fill all required fields', 'error');
      return;
    }

    // Validation
    for (const q of formData.questions) {
        if (!q.text || q.options.some((o: string) => !o)) {
            showToast('All questions and options must be filled', 'error');
            return;
        }
    }

    setLoading(true);
    try {
      const url = initialData 
        ? `/api/quizzes/${initialData._id}` 
        : '/api/quizzes';
      const method = initialData ? 'put' : 'post';

      const res = await (api as any)[method](url, formData);
      
      if (res.data.success) {
        showToast(`Quiz ${initialData ? 'updated' : 'created'} successfully! 🧠`, 'success');
        onSuccess();
        onClose();
      }
    } catch (err: any) {
      console.error("Quiz submission error", err);
      showToast(err.response?.data?.message || 'Failed to save quiz', 'error');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-[200] flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm animate-in fade-in duration-300">
      <div className="bg-white rounded-[3rem] shadow-2xl w-full max-w-4xl overflow-hidden animate-in zoom-in-95 duration-300">
        <div className="p-8 border-b flex justify-between items-center bg-gradient-to-r from-secondary-500 to-secondary-600 text-white">
          <h2 className="text-2xl font-black flex items-center gap-3">
            <HelpCircle className="w-8 h-8" /> {initialData ? 'Edit Brain Challenge' : 'Create New Brain Challenge'}
          </h2>
          <button onClick={onClose} className="p-2 hover:bg-white/20 rounded-full transition-colors">
            <X className="w-6 h-6" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-8 space-y-8 max-h-[70vh] overflow-y-auto custom-scrollbar">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="md:col-span-2">
              <label className="block text-sm font-black text-gray-500 uppercase tracking-widest mb-2">Quiz Title</label>
              <Input 
                value={formData.title}
                onChange={e => setFormData({ ...formData, title: e.target.value })}
                placeholder="e.g., HTML Basics Mastery"
                className="rounded-2xl border-2 border-gray-100 focus:border-secondary-500 py-6"
              />
            </div>
            <div>
              <label className="block text-sm font-black text-gray-500 uppercase tracking-widest mb-2">Target Course</label>
              <select 
                value={formData.course}
                onChange={e => setFormData({ ...formData, course: e.target.value })}
                className="w-full p-4 bg-gray-50 border-2 border-gray-100 rounded-2xl font-bold text-gray-700 outline-none focus:border-secondary-500 transition-all appearance-none"
              >
                {courses.map(c => (
                  <option key={c._id} value={c._id}>{c.title}</option>
                ))}
              </select>
            </div>
          </div>

          <div className="space-y-8">
            <div className="flex justify-between items-center">
                <h3 className="text-xl font-black text-gray-800">Questions List 📝</h3>
                <Button type="button" onClick={handleAddQuestion} variant="outline" size="sm" className="rounded-xl border-2 font-black border-secondary-500 text-secondary-600 hover:bg-secondary-50">
                    <Plus className="w-4 h-4 mr-1" /> Add Question
                </Button>
            </div>

            {formData.questions.map((q, qIndex) => (
                <div key={qIndex} className="p-6 bg-gray-50 rounded-[2rem] border-2 border-gray-100 relative group animate-in slide-in-from-bottom duration-300">
                    <button 
                        type="button" 
                        onClick={() => handleRemoveQuestion(qIndex)}
                        className="absolute -top-3 -right-3 p-2 bg-red-500 text-white rounded-full shadow-lg opacity-0 group-hover:opacity-100 transition-opacity"
                    >
                        <Trash2 className="w-4 h-4" />
                    </button>

                    <div className="space-y-4">
                        <div>
                            <label className="block text-xs font-black text-gray-400 uppercase tracking-widest mb-1">Question {qIndex + 1}</label>
                            <Input 
                                value={q.text}
                                onChange={e => handleQuestionChange(qIndex, 'text', e.target.value)}
                                placeholder="Enter your question here..."
                                className="rounded-xl border-gray-200 focus:border-secondary-500"
                            />
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            {q.options.map((opt, oIndex) => (
                                <div key={oIndex} className="flex items-center gap-2">
                                    <input 
                                        type="radio"
                                        checked={q.correctOption === oIndex}
                                        onChange={() => handleQuestionChange(qIndex, 'correctOption', oIndex)}
                                        className="w-5 h-5 accent-secondary-500 cursor-pointer"
                                    />
                                    <Input 
                                        value={opt}
                                        onChange={e => handleOptionChange(qIndex, oIndex, e.target.value)}
                                        placeholder={`Option ${oIndex + 1}`}
                                        className={`rounded-xl border-gray-200 focus:border-secondary-500 ${q.correctOption === oIndex ? 'bg-secondary-50 border-secondary-200' : ''}`}
                                    />
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            ))}
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
            className="flex-1 py-4 rounded-2xl font-black text-lg bg-secondary-600 hover:bg-secondary-700 shadow-xl shadow-secondary-100"
          >
            {loading ? <Loader2 className="w-6 h-6 animate-spin mx-auto" /> : (initialData ? 'Update Challenge ⚡️' : 'Launch Challenge ⚡️')}
          </Button>
        </div>
      </div>
    </div>
  );
};
