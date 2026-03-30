"use client";

import React, { useState } from 'react';
import { DashboardLayout } from '@/components/layout/DashboardLayout';
import { Card, CardTitle, CardContent } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import api from '@/utils/api';
import { useRouter } from 'next/navigation';
import { useToast } from '@/context/ToastContext';
import { Plus, Trash2, ChevronLeft, ChevronRight, PlayCircle, CheckCircle, BookOpen } from 'lucide-react';

interface Session {
  title: string;
  videoUrl: string;
  duration: string;
}

interface Module {
  _id?: string;
  title: string;
  lessons: Session[];
}

export default function CreateCoursePage() {
  const router = useRouter();
  const { showToast } = useToast();
  const [loading, setLoading] = useState(false);
  const [currentStep, setCurrentStep] = useState(1);
  const [imagePreview, setImagePreview] = useState<string>("");
  const [categories, setCategories] = useState<any[]>([]);

  React.useEffect(() => {
    const fetchCategories = async () => {
      try {
        const res = await api.get('/api/categories');
        if (res.data.success) {
          setCategories(res.data.data);
        }
      } catch (err) {
        console.error("Failed to fetch categories", err);
      }
    };
    fetchCategories();
  }, []);

  const [formData, setFormData] = useState({
    title: "",
    slug: "",
    regularPrice: 0,
    offerPrice: 0,
    category: "",
    level: "Beginner",
    language: "English",
    totalLessons: 0,
    totalDuration: "",
    shortDescription: "",
    description: "",
    thumbnail: "",
    pricePerSession: 0,
    numberOfSessions: 0,
    isPublished: true,
    modules: [] as Module[],
  });

  // UI state for module/session addition
  const [newModuleTitle, setNewModuleTitle] = useState("");
  const [activeModuleIndex, setActiveModuleIndex] = useState<number | null>(null);
  const [newSessionData, setNewSessionData] = useState({ title: "", videoUrl: "", duration: "" });
  const [isAddingModule, setIsAddingModule] = useState(false);

  const handleSubmit = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    setLoading(true);

    if (!formData.title?.trim() || !formData.category?.trim() || !formData.description?.trim()) {
      showToast("Please fill in all required fields", "error");
      setCurrentStep(1);
      setLoading(false);
      return;
    }

    try {
      const createData: any = {
        ...formData,
        pricePerSession: formData.offerPrice,
        numberOfSessions: formData.totalLessons > 0 ? formData.totalLessons : 1,
      };

      const res = await api.post('/api/courses', createData);

      if (res.data.success) {
        showToast("Course created successfully! Waiting for Admin approval.", "success");
        router.push('/dashboard/teacher/courses');
      }
    } catch (error: any) {
      console.error(error);
      showToast(`Error: ${error.response?.data?.message || "Failed to create course"}`, "error");
    } finally {
      setLoading(false);
    }
  };

  const handleAddModule = () => {
    if (!newModuleTitle.trim()) return;
    setFormData({
      ...formData,
      modules: [...formData.modules, { title: newModuleTitle, lessons: [] }],
    });
    setNewModuleTitle("");
    setIsAddingModule(false);
  };

  const handleAddSession = (moduleIndex: number) => {
    if (!newSessionData.title.trim()) return;
    const updatedModules = [...formData.modules];
    updatedModules[moduleIndex].lessons.push({
      title: newSessionData.title,
      videoUrl: newSessionData.videoUrl,
      duration: newSessionData.duration,
    });

    setFormData({
      ...formData,
      modules: updatedModules,
      totalLessons: formData.totalLessons + 1,
    });
    setNewSessionData({ title: "", videoUrl: "", duration: "" });
    setActiveModuleIndex(null);
  };

  const removeModule = (mIdx: number) => {
    const updatedModules = formData.modules.filter((_, idx) => idx !== mIdx);
    setFormData({ ...formData, modules: updatedModules });
  };

  const removeSession = (mIdx: number, sIdx: number) => {
    const updatedModules = [...formData.modules];
    updatedModules[mIdx].lessons = updatedModules[mIdx].lessons.filter((_, idx) => idx !== sIdx);
    setFormData({ ...formData, modules: updatedModules, totalLessons: Math.max(0, formData.totalLessons - 1) });
  };

  const nextStep = () => setCurrentStep((prev) => Math.min(prev + 1, 4));
  const prevStep = () => setCurrentStep((prev) => Math.max(prev - 1, 1));

  return (
    <DashboardLayout allowedRoles={['teacher', 'admin']}>
      <div className="max-w-4xl mx-auto pb-10">
        <div className="mb-8">
           <h1 className="text-4xl font-black text-gray-800 tracking-tight flex items-center gap-3">
             <span className="text-5xl">🎨</span> Build Your New Course
           </h1>
           <p className="text-gray-500 font-bold uppercase text-xs tracking-widest mt-2 ml-1">Wizard Edition ✨</p>
        </div>
        
        <Card className="bg-white shadow-2xl rounded-[2.5rem] overflow-hidden flex flex-col border-none">
            {/* Stepper Header */}
            <div className="bg-slate-50 border-b border-slate-100 p-8 flex flex-col items-center justify-center relative">
               <div className="flex items-center gap-2 w-full max-w-2xl px-4">
                  {[1, 2, 3, 4].map((step) => (
                    <React.Fragment key={step}>
                       <div className={`w-10 h-10 rounded-full flex items-center justify-center font-black text-sm z-10 transition-all duration-300 ${currentStep >= step ? 'bg-secondary-500 text-white shadow-xl shadow-secondary-200 scale-110' : 'bg-white border-2 border-slate-200 text-slate-400'}`}>
                         {step}
                       </div>
                       {step < 4 && <div className={`flex-1 h-1.5 rounded-full transition-all duration-500 ${currentStep > step ? 'bg-secondary-500' : 'bg-slate-200'}`} />}
                    </React.Fragment>
                  ))}
               </div>
               <div className="flex justify-between w-full max-w-2xl px-4 mt-4 text-[11px] font-black uppercase text-slate-400 tracking-[0.2em]">
                  <span className={currentStep >= 1 ? 'text-secondary-600' : ''}>Setup</span>
                  <span className={currentStep >= 2 ? 'text-secondary-600' : ''}>Imagery</span>
                  <span className={currentStep >= 3 ? 'text-secondary-600' : ''}>Curriculum</span>
                  <span className={currentStep >= 4 ? 'text-secondary-600' : ''}>Review</span>
               </div>
            </div>

            {/* Step Body */}
            <CardContent className="p-8 md:p-12 bg-white min-h-[500px]">
               
               {/* STEP 1: SETUP */}
               {currentStep === 1 && (
                 <div className="grid grid-cols-1 md:grid-cols-2 gap-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
                    <div className="col-span-2">
                      <label className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] mb-2 block ml-1">Course Title</label>
                      <input required placeholder="Magical Coding Adventure..." value={formData.title} className="w-full p-5 bg-slate-50 rounded-2xl border-2 border-transparent focus:border-secondary-500 focus:bg-white outline-none font-bold text-slate-800 transition-all" onChange={(e) => setFormData({ ...formData, title: e.target.value })} />
                    </div>

                    <div>
                      <label className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] mb-2 block ml-1">Learning Category</label>
                      <select 
                        required
                        value={formData.category} 
                        className="w-full p-5 bg-slate-50 rounded-2xl border-2 border-transparent focus:border-secondary-500 focus:bg-white outline-none font-bold text-slate-800 transition-all appearance-none" 
                        onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                      >
                        <option value="">Select Category</option>
                        {categories.map((cat) => (
                          <option key={cat._id} value={cat._id}>{cat.name}</option>
                        ))}
                      </select>
                    </div>
                    <div>
                      <label className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] mb-2 block ml-1">Difficulty Level</label>
                      <select value={formData.level} className="w-full p-5 bg-slate-50 rounded-2xl border-2 border-transparent focus:border-secondary-500 focus:bg-white outline-none font-bold text-slate-800 transition-all appearance-none" onChange={(e) => setFormData({ ...formData, level: e.target.value })}>
                         <option value="Beginner">Beginner ✨</option>
                         <option value="Intermediate">Intermediate ⚔️</option>
                         <option value="Advanced">Advanced 🔥</option>
                      </select>
                    </div>

                    <div>
                      <label className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] mb-2 block ml-1">Regular Price (₹)</label>
                      <input type="number" value={formData.regularPrice} className="w-full p-5 bg-slate-50 rounded-2xl border-2 border-transparent focus:border-secondary-500 focus:bg-white outline-none font-bold text-slate-800 transition-all" onChange={(e) => setFormData({ ...formData, regularPrice: Number(e.target.value) })} />
                    </div>
                    <div>
                      <label className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] mb-2 block ml-1">Offer Price (₹)</label>
                      <input type="number" value={formData.offerPrice} className="w-full p-5 bg-slate-50 rounded-2xl border-2 border-transparent focus:border-secondary-500 focus:bg-white outline-none font-black text-secondary-600 transition-all" onChange={(e) => setFormData({ ...formData, offerPrice: Number(e.target.value) })} />
                    </div>
                    
                    <div className="col-span-2">
                      <label className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] mb-2 block ml-1">Course Bio / Description</label>
                      <textarea placeholder="Tell your students about the magic they will learn..." value={formData.description} rows={5} className="w-full p-5 bg-slate-50 rounded-2xl border-2 border-transparent focus:border-secondary-500 focus:bg-white outline-none font-bold text-slate-600 resize-none transition-all" onChange={(e) => setFormData({ ...formData, description: e.target.value })} />
                    </div>
                 </div>
               )}

               {/* STEP 2: IMAGERY */}
               {currentStep === 2 && (
                 <div className="flex flex-col items-center justify-center animate-in fade-in slide-in-from-bottom-4 duration-500 py-4">
                    <div className="w-full max-w-lg bg-slate-50 p-10 rounded-[2rem] border-2 border-dashed border-slate-200 text-center group hover:border-secondary-300 transition-colors">
                       <div className="w-24 h-24 bg-white rounded-3xl flex items-center justify-center text-5xl mx-auto shadow-xl mb-8 transform group-hover:rotate-6 transition-transform">🖼️</div>
                       <h3 className="text-2xl font-black text-slate-800 mb-2">Visual Identity</h3>
                       <p className="text-slate-500 font-bold text-sm mb-10">Add a stunning cover for your course</p>
                       
                       <div className="space-y-6 text-left">
                          <div>
                            <p className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] mb-3 text-center">External Image URL</p>
                            <input 
                              placeholder="https://images.unsplash.com/..." 
                              value={formData.thumbnail} 
                              className="w-full p-5 bg-white border-2 border-slate-100 rounded-2xl font-bold focus:border-secondary-500 outline-none text-center shadow-sm" 
                              onChange={(e) => { 
                                setFormData({ ...formData, thumbnail: e.target.value });
                                setImagePreview(e.target.value);
                              }} 
                            />
                          </div>
                       </div>
                       
                       {(imagePreview || formData.thumbnail) && (
                         <div className="mt-12 border-8 border-white shadow-2xl rounded-[2rem] overflow-hidden aspect-video bg-white">
                           <img src={imagePreview || formData.thumbnail} alt="Preview" className="w-full h-full object-cover" onError={(e) => (e.currentTarget.style.display = 'none')} />
                         </div>
                       )}
                    </div>
                 </div>
               )}

               {/* STEP 3: CURRICULUM */}
               {currentStep === 3 && (
                 <div className="animate-in fade-in slide-in-from-bottom-4 duration-500 space-y-8">
                    <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center bg-slate-900 p-8 rounded-[2rem] text-white shadow-2xl shadow-slate-200 gap-4">
                      <div>
                         <h3 className="font-black text-xl flex items-center gap-2 italic">Curriculum Forge <BookOpen className="text-secondary-400" size={24}/></h3>
                         <p className="text-[10px] font-bold text-slate-400 uppercase tracking-[0.3em] mt-1">Manifest your knowledge architecture</p>
                      </div>
                      <Button onClick={() => setIsAddingModule(true)} className="bg-secondary-500 hover:bg-secondary-600 font-black gap-2 rounded-2xl py-6 px-8 text-sm shadow-xl shadow-secondary-500/20">
                        <Plus size={18} /> NEW MODULE
                      </Button>
                    </div>

                    {isAddingModule && (
                      <div className="bg-white border-2 border-secondary-500/20 p-8 rounded-[2rem] flex flex-col md:flex-row gap-4 shadow-xl animate-in zoom-in-95 duration-300">
                         <input 
                           autoFocus
                           placeholder="Module Name (e.g. Master the Basics)" 
                           value={newModuleTitle} 
                           onChange={(e) => setNewModuleTitle(e.target.value)}
                           className="flex-1 p-5 rounded-2xl bg-slate-50 border-none font-bold focus:ring-4 ring-secondary-500/10 outline-none"
                         />
                         <div className="flex gap-2">
                            <Button onClick={handleAddModule} className="bg-slate-900 text-white font-black px-8 rounded-2xl">CREATE</Button>
                            <Button variant="outline" onClick={() => setIsAddingModule(false)} className="rounded-2xl border-slate-200 font-bold px-6">CANCEL</Button>
                         </div>
                      </div>
                    )}

                    <div className="space-y-8">
                        {formData.modules.map((module, mIdx) => (
                          <div key={mIdx} className="bg-slate-50/50 rounded-[2.5rem] p-6 md:p-8 border border-slate-100 shadow-sm">
                            <div className="flex justify-between items-center mb-6">
                               <div className="flex items-center gap-4">
                                  <div className="w-12 h-12 rounded-2xl bg-white shadow-md flex items-center justify-center text-slate-900 font-black text-lg border border-slate-100">{mIdx + 1}</div>
                                  <h4 className="font-black text-xl text-slate-800 tracking-tight">{module.title}</h4>
                               </div>
                               <button onClick={() => removeModule(mIdx)} className="w-10 h-10 rounded-full bg-white text-red-400 hover:text-white hover:bg-red-500 transition-all shadow-sm flex items-center justify-center border border-slate-100"><Trash2 size={18}/></button>
                            </div>

                            <div className="space-y-3 bg-white/40 rounded-[1.5rem] p-4">
                               {module.lessons.map((session, sIdx) => (
                                 <div key={sIdx} className="flex justify-between items-center p-5 bg-white rounded-2xl shadow-sm border border-slate-50 hover:border-secondary-100 transition-all group">
                                    <div className="flex items-center gap-5">
                                       <div className="w-11 h-11 rounded-3xl bg-secondary-50 text-secondary-500 flex items-center justify-center group-hover:scale-110 transition-transform">
                                          <PlayCircle size={22} />
                                       </div>
                                       <div>
                                          <h5 className="font-bold text-slate-800 leading-tight">{session.title}</h5>
                                          <span className="text-[10px] font-black uppercase text-slate-400 mt-1 flex gap-3">⏱️ {session.duration || 'Flexible'}</span>
                                       </div>
                                    </div>
                                    <button onClick={() => removeSession(mIdx, sIdx)} className="w-8 h-8 rounded-xl bg-slate-50 text-slate-300 hover:text-red-500 hover:bg-red-50 transition-colors flex items-center justify-center"><Trash2 size={16}/></button>
                                 </div>
                               ))}

                               {activeModuleIndex === mIdx ? (
                                 <div className="bg-white border-2 border-secondary-100 p-6 rounded-2xl space-y-5 mt-4 shadow-lg animate-in slide-in-from-top-2">
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                                      <div className="md:col-span-2">
                                        <label className="text-[9px] font-black uppercase text-slate-400 ml-1 tracking-[0.2em] mb-1 block">Session Name</label>
                                        <input autoFocus placeholder="e.g. Secret Coding Trick #1" value={newSessionData.title} onChange={(e) => setNewSessionData({...newSessionData, title: e.target.value})} className="w-full p-4 bg-slate-50 rounded-xl border-none font-bold outline-none" />
                                      </div>
                                      <div>
                                        <label className="text-[9px] font-black uppercase text-slate-400 ml-1 tracking-[0.2em] mb-1 block">Stream Link (Optional)</label>
                                        <input placeholder="https://..." value={newSessionData.videoUrl} onChange={(e) => setNewSessionData({...newSessionData, videoUrl: e.target.value})} className="w-full p-4 bg-slate-50 rounded-xl border-none font-bold outline-none" />
                                      </div>
                                      <div>
                                        <label className="text-[9px] font-black uppercase text-slate-400 ml-1 tracking-[0.2em] mb-1 block">Runtime</label>
                                        <input placeholder="e.g. 20 Mins" value={newSessionData.duration} onChange={(e) => setNewSessionData({...newSessionData, duration: e.target.value})} className="w-full p-4 bg-slate-50 rounded-xl border-none font-bold outline-none" />
                                      </div>
                                    </div>
                                    <div className="flex gap-2 justify-end pt-4 border-t border-slate-50">
                                      <Button variant="outline" onClick={() => setActiveModuleIndex(null)} className="rounded-xl border-slate-200 text-slate-400 font-bold px-6">CANCEL</Button>
                                      <Button onClick={() => handleAddSession(mIdx)} className="bg-slate-900 text-white rounded-xl font-black px-8">ATTACH SESSION</Button>
                                    </div>
                                 </div>
                               ) : (
                                 <Button variant="outline" onClick={() => setActiveModuleIndex(mIdx)} className="w-full border-dashed border-2 border-slate-200 p-8 rounded-2xl text-slate-400 hover:text-secondary-600 hover:border-secondary-500 hover:bg-secondary-50 transition-all font-black flex gap-3 mt-4">
                                    <Plus size={20} /> ADD NEW SESSION
                                 </Button>
                               )}
                            </div>
                          </div>
                        ))}
                    </div>
                    
                    {formData.modules.length === 0 && !isAddingModule && (
                      <div className="text-center py-24 bg-slate-50 rounded-[3rem] border-4 border-dashed border-slate-100">
                        <div className="text-6xl mb-6">🏔️</div>
                        <h4 className="font-black text-2xl text-slate-300 mb-2 uppercase tracking-tighter">Terra Incognita</h4>
                        <p className="text-slate-300 font-bold text-sm">Expand your curriculum by adding modules above.</p>
                      </div>
                    )}
                 </div>
               )}

               {/* STEP 4: REVIEW */}
               {currentStep === 4 && (
                 <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
                    <div className="text-center mb-12">
                       <div className="w-24 h-24 bg-emerald-50 text-emerald-500 rounded-[2rem] flex items-center justify-center mx-auto mb-6 shadow-xl shadow-emerald-500/5 transition-transform hover:scale-105">
                         <CheckCircle className="w-12 h-12" />
                       </div>
                       <h3 className="text-3xl font-black text-slate-800 mb-2">Manifestation Ready 💎</h3>
                       <p className="text-slate-500 font-bold text-base max-w-sm mx-auto">Seal the magic and send your course for approval.</p>
                    </div>

                    <div className="bg-slate-50 p-10 rounded-[2.5rem] border border-slate-100 grid grid-cols-1 md:grid-cols-2 gap-10">
                       <div className="space-y-8">
                          <div>
                             <span className="block text-[10px] uppercase font-black tracking-[0.3em] text-slate-300 mb-2 ml-1">Core Designation</span>
                             <span className="font-black text-slate-800 text-2xl leading-tight">{formData.title || <span className="text-red-300">UNNAMED ENTITY</span>}</span>
                          </div>
                          <div>
                             <span className="block text-[10px] uppercase font-black tracking-[0.3em] text-slate-300 mb-2 ml-1">Investment Value</span>
                             <div className="flex items-center gap-3">
                                <span className="text-secondary-600 font-black text-3xl">₹{formData.offerPrice}</span>
                                <span className="bg-secondary-100 text-secondary-600 px-4 py-1.5 rounded-full text-[10px] font-black uppercase">Magical Rate</span>
                             </div>
                          </div>
                       </div>
                       
                       <div className="space-y-8">
                          <div>
                             <span className="block text-[10px] uppercase font-black tracking-[0.3em] text-slate-300 mb-2 ml-1">Classification</span>
                             <div className="flex gap-2">
                                <span className="bg-white px-5 py-2 rounded-2xl text-slate-600 font-black text-xs shadow-sm border border-slate-100">{categories.find(c => c._id === formData.category)?.name || 'GENERAL'}</span>
                                <span className="bg-white px-5 py-2 rounded-2xl text-slate-600 font-black text-xs shadow-sm border border-slate-100">{formData.level}</span>
                             </div>
                          </div>
                          <div>
                             <span className="block text-[10px] uppercase font-black tracking-[0.3em] text-slate-300 mb-2 ml-1">Structure Integrity</span>
                             <span className="font-black text-slate-700 block text-lg">{formData.modules.length} Modules / {formData.totalLessons} Active Sessions</span>
                          </div>
                       </div>
                    </div>
                 </div>
               )}
               
            </CardContent>

            {/* Sticky Navigation Footer */}
            <div className="bg-white border-t border-slate-50 p-8 flex justify-between items-center shrink-0">
               <button 
                onClick={prevStep} 
                disabled={currentStep === 1}
                className={`font-black uppercase tracking-widest text-xs flex items-center gap-2 transition-all ${currentStep === 1 ? 'opacity-0 pointer-events-none' : 'text-slate-400 hover:text-slate-800'}`}
               >
                 <ChevronLeft size={20} /> Previous
               </button>

               {currentStep < 4 ? (
                 <Button onClick={nextStep} className="bg-slate-900 hover:bg-slate-800 text-white font-black text-base py-5 px-12 rounded-3xl shadow-xl shadow-slate-900/10 flex items-center gap-3">
                   CONTINUE <ChevronRight size={20} />
                 </Button>
               ) : (
                 <Button onClick={() => handleSubmit()} className="bg-emerald-500 hover:bg-emerald-600 text-white font-black text-lg py-5 px-12 rounded-[2rem] shadow-2xl shadow-emerald-500/20 flex items-center gap-3 scale-110" isLoading={loading}>
                   <CheckCircle size={22} /> LAUNCH COURSE
                 </Button>
               ) as any}
            </div>
        </Card>
      </div>
    </DashboardLayout>
  );
}
