"use client";

import React, { useState, useEffect } from 'react';
import { DashboardLayout } from '@/components/layout/DashboardLayout';
import { Card, CardTitle, CardContent } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import axios from 'axios';
import { useParams, useRouter } from 'next/navigation';
import { Plus, Trash2, Video, FileText, ChevronDown, ChevronUp } from 'lucide-react';

export default function LessonsPage() {
  const { id } = useParams();
  const router = useRouter();
  const [course, setCourse] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    const fetchCourse = async () => {
      try {
        const res = await axios.get(`http://localhost:5000/api/courses/${id}`);
        if (res.data.success) {
          setCourse(res.data.data);
        }
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchCourse();
  }, [id]);

  const addModule = () => {
    const newModule = {
      title: 'New Module',
      lessons: [],
      order: course.modules.length
    };
    setCourse({ ...course, modules: [...course.modules, newModule] });
  };

  const addLesson = (moduleIndex: number) => {
    const newLesson = {
      title: 'New Lesson',
      description: '',
      videoUrl: '',
      pdfUrl: '',
      order: course.modules[moduleIndex].lessons.length
    };
    const updatedModules = [...course.modules];
    updatedModules[moduleIndex].lessons.push(newLesson);
    setCourse({ ...course, modules: updatedModules });
  };

  const updateModuleTitle = (index: number, title: string) => {
    const updatedModules = [...course.modules];
    updatedModules[index].title = title;
    setCourse({ ...course, modules: updatedModules });
  };

  const updateLesson = (moduleIndex: number, lessonIndex: number, field: string, value: string) => {
    const updatedModules = [...course.modules];
    updatedModules[moduleIndex].lessons[lessonIndex][field] = value;
    setCourse({ ...course, modules: updatedModules });
  };

  const deleteModule = (index: number) => {
    const updatedModules = course.modules.filter((_: any, i: number) => i !== index);
    setCourse({ ...course, modules: updatedModules });
  };

  const deleteLesson = (moduleIndex: number, lessonIndex: number) => {
    const updatedModules = [...course.modules];
    updatedModules[moduleIndex].lessons = updatedModules[moduleIndex].lessons.filter((_: any, i: number) => i !== lessonIndex);
    setCourse({ ...course, modules: updatedModules });
  };

  const handleSave = async () => {
    setIsSaving(true);
    try {
      const res = await axios.put(`http://localhost:5000/api/courses/${id}`, { modules: course.modules });
      if (res.data.success) {
        alert('Lessons saved successfully!');
      }
    } catch (err) {
      console.error(err);
      alert('Failed to save lessons');
    } finally {
      setIsSaving(false);
    }
  };

  if (loading) return <DashboardLayout allowedRoles={['teacher', 'admin']}><div className="text-center py-20 font-bold">Loading Magic Content...</div></DashboardLayout>;
  if (!course) return <DashboardLayout allowedRoles={['teacher', 'admin']}><div className="text-center py-20 font-bold text-red-500">Course not found</div></DashboardLayout>;

  return (
    <DashboardLayout allowedRoles={['teacher', 'admin']}>
      <div className="max-w-4xl mx-auto pb-20">
        <div className="flex justify-between items-center mb-8">
           <div>
             <h1 className="text-4xl font-black text-gray-800 mb-2">Manage Lessons 📚</h1>
             <p className="font-bold text-gray-500">Course: <span className="text-primary-600">{course.title}</span></p>
           </div>
           <Button onClick={handleSave} isLoading={isSaving} size="lg" className="px-10 shadow-lg shadow-primary-200">Save All Changes ✨</Button>
        </div>

        <div className="space-y-8">
          {course.modules.map((module: any, mIdx: number) => (
            <Card key={mIdx} className="bg-white border-2 border-gray-100 overflow-hidden">
               <div className="bg-gray-50 p-6 flex justify-between items-center border-b-2 border-gray-100">
                  <div className="flex-1 mr-4">
                    <input 
                      className="text-xl font-black text-gray-800 bg-transparent border-none outline-none focus:ring-2 focus:ring-primary-200 rounded px-2 w-full"
                      value={module.title}
                      onChange={(e) => updateModuleTitle(mIdx, e.target.value)}
                    />
                  </div>
                  <div className="flex gap-2">
                    <Button variant="outline" size="sm" onClick={() => addLesson(mIdx)} className="flex items-center gap-1 font-bold">
                       <Plus className="w-4 h-4" /> Add Lesson
                    </Button>
                    <Button variant="outline" size="sm" onClick={() => deleteModule(mIdx)} className="text-red-500 border-red-100 hover:bg-red-50">
                       <Trash2 className="w-4 h-4" />
                    </Button>
                  </div>
               </div>

               <CardContent className="p-6 space-y-4">
                  {module.lessons.length === 0 ? (
                    <p className="text-center text-gray-400 font-bold italic py-4">This module is empty. Add your first lesson!</p>
                  ) : (
                    module.lessons.map((lesson: any, lIdx: number) => (
                      <div key={lIdx} className="bg-gray-50/50 rounded-2xl p-6 border-2 border-gray-50 hover:border-gray-200 transition-colors">
                         <div className="flex justify-between items-start mb-4">
                            <input 
                              className="text-lg font-bold text-gray-700 bg-transparent border-none outline-none focus:ring-2 focus:ring-primary-200 rounded px-2 flex-1"
                              value={lesson.title}
                              onChange={(e) => updateLesson(mIdx, lIdx, 'title', e.target.value)}
                              placeholder="Lesson Title"
                            />
                            <Button variant="outline" size="sm" onClick={() => deleteLesson(mIdx, lIdx)} style={{ padding: '4px' }} className="text-red-400 border-none hover:bg-red-100">
                               <Trash2 className="w-4 h-4" />
                            </Button>
                         </div>
                         <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div className="flex items-center gap-3 bg-white p-3 rounded-xl border border-gray-100">
                               <Video className="w-5 h-5 text-blue-500" />
                               <input 
                                 className="text-xs font-semibold bg-transparent border-none outline-none w-full"
                                 placeholder="Video URL (YouTube/MP4)"
                                 value={lesson.videoUrl || ''}
                                 onChange={(e) => updateLesson(mIdx, lIdx, 'videoUrl', e.target.value)}
                               />
                            </div>
                            <div className="flex items-center gap-3 bg-white p-3 rounded-xl border border-gray-100">
                               <FileText className="w-5 h-5 text-orange-500" />
                               <input 
                                 className="text-xs font-semibold bg-transparent border-none outline-none w-full"
                                 placeholder="PDF/Resources URL"
                                 value={lesson.pdfUrl || ''}
                                 onChange={(e) => updateLesson(mIdx, lIdx, 'pdfUrl', e.target.value)}
                               />
                            </div>
                         </div>
                         <textarea 
                           className="w-full mt-4 bg-white p-3 rounded-xl border border-gray-100 text-sm font-semibold outline-none focus:border-primary-300 resize-none"
                           placeholder="Short lesson description..."
                           rows={2}
                           value={lesson.description || ''}
                           onChange={(e) => updateLesson(mIdx, lIdx, 'description', e.target.value)}
                         />
                      </div>
                    ))
                  )}
               </CardContent>
            </Card>
          ))}

          <Button variant="outline" fullWidth size="lg" onClick={addModule} className="border-dashed border-4 py-8 rounded-[2rem] text-xl font-black text-gray-400 hover:text-primary-500 hover:border-primary-200 transition-all">
             <Plus className="w-8 h-8 mr-2" /> Add New Module
          </Button>
        </div>
      </div>
    </DashboardLayout>
  );
}
