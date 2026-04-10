"use client";

import React, { useEffect, useState } from 'react';
import { DashboardLayout } from '@/components/layout/DashboardLayout';
import { Card, CardContent } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import api from '@/utils/api';
import { Calendar, MapPin, Tag, Edit, Link as LinkIcon, Plus, Trash2, Clock, Sparkles, CheckCircle, Edit2, PlayCircle, ChevronLeft, ChevronRight, Loader2 } from 'lucide-react';
import { useToast } from '@/context/ToastContext';

interface Session {
  title: string;
  description?: string;
  videoUrl: string;
  duration: string;
}

interface Module {
  _id?: string;
  title: string;
  lessons: Session[];
}

export default function AdminBootcamps() {
  const [bootcamps, setBootcamps] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const { showToast, confirm } = useToast();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  
  const [currentStep, setCurrentStep] = useState(1);

  const [formData, setFormData] = useState({
    title: '',
    description: '',
    date: '',
    endDate: '',
    price: 0,
    venue: '',
    meetingLink: '',
    image: '',
    rating: 0,
    showStudentsEnrolled: false,
    modules: [] as Module[],
  });

  // Curriculum State
  const [newModuleTitle, setNewModuleTitle] = useState("");
  const [activeModuleIndex, setActiveModuleIndex] = useState<number | null>(null);
  const [newSessionData, setNewSessionData] = useState({ title: "", description: "", videoUrl: "", duration: "" });
  const [isAddingModule, setIsAddingModule] = useState(false);
  const [editingModuleIndex, setEditingModuleIndex] = useState<number | null>(null);
  const [editingSessionInfo, setEditingSessionInfo] = useState<{ mIdx: number; sIdx: number } | null>(null);

  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string>("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const fetchBootcamps = async () => {
    try {
      const res = await api.get('/api/bootcamps');
      if (res.data.success) {
        setBootcamps(res.data.data);
      }
    } catch (err) {
      console.error("Failed to fetch bootcamps", err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchBootcamps();
  }, []);

  const resetForm = () => {
    setFormData({ title: '', description: '', date: '', endDate: '', price: 0, venue: '', meetingLink: '', image: '', rating: 0, showStudentsEnrolled: false, modules: [] });
    setEditingId(null);
    setCurrentStep(1);
    setImageFile(null);
    setImagePreview("");
    setNewModuleTitle("");
    setActiveModuleIndex(null);
    setIsAddingModule(false);
  };

  const handleSubmit = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    setIsSubmitting(true);
    try {
      const formDataToSubmit = new FormData();
      Object.keys(formData).forEach(key => {
        if (key === 'modules') {
          formDataToSubmit.append('modules', JSON.stringify(formData.modules));
        } else if (key !== 'image' || (key === 'image' && !imageFile)) {
          formDataToSubmit.append(key, (formData as any)[key]);
        }
      });

      if (imageFile) {
        formDataToSubmit.append('image', imageFile);
      }

      let res;
      if (editingId) {
        res = await api.put(`/api/bootcamps/${editingId}`, formDataToSubmit);
      } else {
        res = await api.post('/api/bootcamps', formDataToSubmit);
      }

      if (res.data.success) {
        setIsModalOpen(false);
        resetForm();
        fetchBootcamps();
        showToast(`Bootcamp ${editingId ? 'updated' : 'created'} successfully`, "success");
      }
    } catch (err: any) {
      console.error("Bootcamp Create/Update Error:", err);
      showToast(`Failed: ${err.response?.data?.message || err.message}`, "error");
    } finally {
      setIsSubmitting(false);
    }
  };

  const openEditModal = (bc: any) => {
    setEditingId(bc._id);
    setFormData({
      title: bc.title,
      description: bc.description,
      date: new Date(bc.date).toISOString().split('T')[0],
      endDate: bc.endDate ? new Date(bc.endDate).toISOString().split('T')[0] : '',
      price: bc.price,
      venue: bc.venue,
      meetingLink: bc.meetingLink || '',
      image: bc.image || '',
      rating: bc.rating || 0,
      showStudentsEnrolled: bc.showStudentsEnrolled || false,
      modules: bc.modules || [],
    });
    setImagePreview(bc.image || "");
    setImageFile(null);
    setCurrentStep(1);
    setIsModalOpen(true);
  };

  const handleDelete = async (id: string) => {
    const isConfirmed = await confirm("Delete Bootcamp?", "This action cannot be undone.");
    if (!isConfirmed) return;
    try {
      await api.delete(`/api/bootcamps/${id}`);
      fetchBootcamps();
      showToast("Bootcamp deleted", "success");
    } catch (err) {
      showToast("Deletion failed", "error");
    }
  };

  // CURRICULUM HANDLERS
  const handleAddModule = () => {
    if (!newModuleTitle.trim()) return;
    if (editingModuleIndex !== null) {
      const updated = [...formData.modules];
      updated[editingModuleIndex].title = newModuleTitle;
      setFormData({ ...formData, modules: updated });
      setEditingModuleIndex(null);
    } else {
      setFormData({ ...formData, modules: [...formData.modules, { title: newModuleTitle, lessons: [] }] });
    }
    setNewModuleTitle("");
    setIsAddingModule(false);
  };

  const handleAddSession = (mIdx: number) => {
    if (!newSessionData.title.trim()) return;
    const updated = [...formData.modules];
    if (editingSessionInfo) {
      updated[editingSessionInfo.mIdx].lessons[editingSessionInfo.sIdx] = { ...newSessionData };
      setEditingSessionInfo(null);
    } else {
      updated[mIdx].lessons.push({ ...newSessionData });
    }
    setFormData({ ...formData, modules: updated });
    setNewSessionData({ title: "", description: "", videoUrl: "", duration: "" });
    setActiveModuleIndex(null);
  };

  const removeModule = (mIdx: number) => {
    setFormData({ ...formData, modules: formData.modules.filter((_, idx) => idx !== mIdx) });
  };

  const removeSession = (mIdx: number, sIdx: number) => {
    const updated = [...formData.modules];
    updated[mIdx].lessons = updated[mIdx].lessons.filter((_, idx) => idx !== sIdx);
    setFormData({ ...formData, modules: updated });
  };

  const nextStep = () => setCurrentStep(p => Math.min(p + 1, 4));
  const prevStep = () => setCurrentStep(p => Math.max(p - 1, 1));

  return (
    <DashboardLayout allowedRoles={['admin']}>
      <div className="flex flex-col md:flex-row items-start md:items-center justify-between mb-10 gap-4">
        <div>
          <h1 className="text-3xl md:text-5xl font-black text-slate-800 tracking-tighter">Bootcamp <span className="text-indigo-600">Missions</span> 🛰️</h1>
          <p className="text-slate-400 font-bold mt-1 uppercase text-[10px] tracking-[0.2em]">High Intensive Curriculum Management</p>
        </div>
        <Button onClick={() => { resetForm(); setIsModalOpen(true); }} className="font-black px-8 py-6 rounded-2xl bg-indigo-600 hover:bg-indigo-700 shadow-xl shadow-indigo-100 transition-all hover:-translate-y-1">
          <Plus className="mr-2" /> Launch New Mission
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {isLoading ? (
          [1, 2, 3].map(i => <div key={i} className="h-[450px] rounded-[3rem] bg-slate-50 animate-pulse border-4 border-slate-100" />)
        ) : (
          bootcamps.map((bc: any) => (
            <Card key={bc._id} className="relative group overflow-visible border-4 border-transparent hover:border-indigo-100 shadow-sm hover:shadow-2xl rounded-[3rem] transition-all duration-500 bg-white p-2">
              <div className="aspect-[16/10] bg-indigo-600 relative overflow-hidden rounded-[2.5rem]">
                 {bc.image ? <img src={bc.image} alt={bc.title} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" /> : <div className="absolute inset-0 flex items-center justify-center text-8xl">🚀</div>}
                 <div className="absolute top-6 left-6 flex gap-2">
                   <span className="px-5 py-2 bg-white/90 backdrop-blur-md rounded-full text-[10px] font-black uppercase tracking-widest text-indigo-600 shadow-lg">Intensive</span>
                 </div>
              </div>
              
              <CardContent className="p-8">
                <h3 className="text-2xl font-black text-slate-800 tracking-tight mb-2 line-clamp-1 group-hover:text-indigo-600 transition-colors uppercase">{bc.title}</h3>
                <div className="flex items-center gap-4 text-slate-400 text-xs font-black uppercase tracking-widest mb-6">
                   <span>{bc.modules?.length || 0} Modules</span>
                   <div className="w-1.5 h-1.5 rounded-full bg-slate-200" />
                   <span className="text-indigo-500">₹{bc.price}</span>
                </div>

                <div className="space-y-4 mb-8">
                  <div className="flex items-center gap-4 p-4 rounded-2xl bg-slate-50 border border-slate-100">
                    <Calendar size={18} className="text-indigo-500" />
                    <span className="font-black text-xs text-slate-700">{new Date(bc.date).toLocaleDateString()} - {new Date(bc.endDate).toLocaleDateString()}</span>
                  </div>
                </div>

                <div className="flex gap-3 mt-auto">
                  <Button variant="outline" onClick={() => openEditModal(bc)} className="flex-1 py-6 rounded-2xl font-black text-indigo-600 border-2 border-indigo-50 hover:bg-indigo-50 transition-all flex items-center justify-center gap-2">
                    <Edit size={18} /> Edit
                  </Button>
                  <Button variant="ghost" onClick={() => handleDelete(bc._id)} className="px-6 py-6 rounded-2xl text-red-500 hover:bg-red-50 transition-all">
                    <Trash2 size={18} />
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))
        )}
      </div>

      {isModalOpen && (
        <div className="fixed inset-0 z-[2000] flex items-center justify-center bg-slate-900/80 backdrop-blur-md p-0 md:p-6 overflow-y-auto">
          <Card className="w-full max-w-4xl bg-white shadow-3xl rounded-none md:rounded-[3.5rem] overflow-hidden flex flex-col min-h-screen md:min-h-0 md:max-h-[95vh]">
            
            {/* Header / Stepper */}
            <div className="bg-slate-50 border-b border-slate-100 p-8 pt-12 md:p-12 relative flex flex-col items-center">
               <button onClick={() => setIsModalOpen(false)} className="absolute right-8 top-8 w-10 h-10 flex items-center justify-center rounded-2xl bg-white shadow-sm border border-slate-100 hover:bg-slate-200 transition-colors font-bold z-50">✕</button>
               <h2 className="text-3xl font-black text-slate-800 mb-8">{editingId ? 'Updating Mission 🛰️' : 'Launching New Mission 🚀'}</h2>
               
               <div className="flex items-center gap-2 w-full max-w-2xl">
                  {[1, 2, 3, 4].map((step) => (
                    <React.Fragment key={step}>
                       <div className={`w-10 h-10 rounded-2xl flex items-center justify-center font-black text-sm z-10 transition-all duration-500 ${currentStep >= step ? 'bg-indigo-600 text-white shadow-xl shadow-indigo-200' : 'bg-white border-2 border-slate-100 text-slate-400'}`}>
                         {step}
                       </div>
                       {step < 4 && <div className={`flex-1 h-1.5 rounded-full mx-1 transition-all duration-700 ${currentStep > step ? 'bg-indigo-600' : 'bg-slate-100'}`} />}
                    </React.Fragment>
                  ))}
               </div>
               <div className="flex justify-between w-full max-w-2xl px-2 mt-3 text-[10px] font-black uppercase text-slate-400 tracking-[0.2em]">
                  <span className={currentStep >= 1 ? 'text-indigo-600' : ''}>The Brief</span>
                  <span className={currentStep >= 2 ? 'text-indigo-600' : ''}>Logistics</span>
                  <span className={currentStep >= 3 ? 'text-indigo-600' : ''}>Curriculum</span>
                  <span className={currentStep >= 4 ? 'text-indigo-600' : ''}>Final Check</span>
               </div>
            </div>

            <CardContent className="p-8 md:p-12 overflow-y-auto flex-1 bg-white">
               
               {/* STEP 1: BASIC INFO */}
               {currentStep === 1 && (
                 <div className="grid grid-cols-1 gap-8 animate-in slide-in-from-bottom-4 duration-500">
                    <div className="space-y-2">
                       <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-4">Campaign Title</label>
                       <input autoFocus required placeholder="e.g. Full Stack Masterclass" value={formData.title} className="w-full p-6 border-2 border-slate-50 bg-slate-50 rounded-[1.5rem] font-black text-slate-700 focus:border-indigo-400 focus:bg-white outline-none transition-all placeholder:text-slate-300" onChange={(e) => setFormData({ ...formData, title: e.target.value })} />
                    </div>
                    <div className="space-y-2">
                       <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-4">The Mission Goal (Description)</label>
                       <textarea required rows={5} placeholder="Tell them why this bootcamp will change their lives..." value={formData.description} className="w-full p-6 border-2 border-slate-50 bg-slate-50 rounded-[1.5rem] font-bold text-slate-600 resize-none focus:border-indigo-400 focus:bg-white outline-none transition-all" onChange={(e) => setFormData({ ...formData, description: e.target.value })} />
                    </div>
                 </div>
               )}

               {/* STEP 2: LOGISTICS */}
               {currentStep === 2 && (
                 <div className="grid grid-cols-1 md:grid-cols-2 gap-8 animate-in slide-in-from-bottom-4 duration-500">
                    <div className="space-y-2">
                       <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-4">Start Launch Date</label>
                       <input type="date" value={formData.date} className="w-full p-5 border-2 border-slate-50 bg-slate-50 rounded-2xl font-black text-slate-700 outline-none focus:border-indigo-400 focus:bg-white transition-all" onChange={(e) => setFormData({ ...formData, date: e.target.value })} />
                    </div>
                    <div className="space-y-2">
                       <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-4">Estimated End Date</label>
                       <input type="date" value={formData.endDate} className="w-full p-5 border-2 border-slate-50 bg-slate-50 rounded-2xl font-black text-slate-700 outline-none focus:border-indigo-400 focus:bg-white transition-all" onChange={(e) => setFormData({ ...formData, endDate: e.target.value })} />
                    </div>
                    <div className="space-y-2">
                       <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-4">Price / Contribution (₹)</label>
                       <input type="number" value={formData.price || ""} placeholder="9999" className="w-full p-5 border-2 border-slate-50 bg-slate-50 rounded-2xl font-black text-indigo-600 outline-none focus:border-indigo-400 focus:bg-white transition-all" onChange={(e) => setFormData({ ...formData, price: Number(e.target.value) })} />
                    </div>
                    <div className="space-y-2">
                       <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-4">Base / Venue</label>
                       <input placeholder="e.g. Pune City Center or Zoom" value={formData.venue} className="w-full p-5 border-2 border-slate-50 bg-slate-50 rounded-2xl font-bold text-slate-700 outline-none focus:border-indigo-400 focus:bg-white transition-all" onChange={(e) => setFormData({ ...formData, venue: e.target.value })} />
                    </div>
                    <div className="col-span-2 space-y-2">
                       <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-4">HQ Access Link (Meeting Link)</label>
                       <input placeholder="https://zoom.us/j/..." value={formData.meetingLink} className="w-full p-5 border-2 border-slate-50 bg-slate-50 rounded-2xl font-bold text-slate-500 outline-none focus:border-indigo-400 focus:bg-white transition-all" onChange={(e) => setFormData({ ...formData, meetingLink: e.target.value })} />
                    </div>
                    <div className="space-y-2">
                       <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-4">Launch Rating (0-5)</label>
                       <input type="number" step="0.1" min="0" max="5" value={formData.rating} className="w-full p-5 border-2 border-slate-50 bg-slate-50 rounded-2xl font-black text-indigo-600 outline-none focus:border-indigo-400 focus:bg-white transition-all" onChange={(e) => setFormData({ ...formData, rating: Number(e.target.value) })} />
                    </div>
                    <div className="space-y-2 flex items-center gap-3 pt-6">
                       <input type="checkbox" id="bcShowEnrolled" checked={formData.showStudentsEnrolled} className="w-6 h-6 rounded-lg accent-indigo-600 cursor-pointer" onChange={(e) => setFormData({ ...formData, showStudentsEnrolled: e.target.checked })} />
                       <label htmlFor="bcShowEnrolled" className="text-[10px] font-black text-slate-400 uppercase tracking-widest cursor-pointer mt-1">Show Enrolled Count on Frontend</label>
                    </div>
                 </div>
               )}

               {/* STEP 3: CURRICULUM */}
               {currentStep === 3 && (
                 <div className="space-y-8 animate-in slide-in-from-bottom-4 duration-500">
                    <div className="flex justify-between items-center bg-indigo-50/50 p-6 rounded-3xl border border-indigo-100/50 shadow-sm">
                      <div>
                         <h3 className="font-black text-slate-800 text-xl tracking-tight">Curriculum Architecture</h3>
                         <p className="text-[10px] font-black uppercase text-indigo-400 tracking-widest mt-1">Design the learning pathway</p>
                      </div>
                      <Button onClick={() => setIsAddingModule(true)} className="bg-slate-900 border-b-4 border-slate-700 active:border-b-0 active:translate-y-1 hover:bg-black text-white font-black rounded-2xl px-6 py-4 flex gap-2">
                        <Plus size={18} /> New Module
                      </Button>
                    </div>

                    {isAddingModule && (
                      <div className="bg-slate-50 p-8 rounded-[2rem] border-4 border-indigo-100 flex flex-col md:flex-row gap-4 animate-in zoom-in-95">
                         <input autoFocus placeholder="Module Title (e.g. Part 1: Foundations)" value={newModuleTitle} onChange={(e) => setNewModuleTitle(e.target.value)} className="flex-1 p-5 rounded-2xl border-2 border-white bg-white font-black text-slate-700 focus:border-indigo-400 outline-none shadow-sm" />
                         <div className="flex gap-2">
                            <Button onClick={handleAddModule} className="bg-indigo-600 text-white font-black h-full px-8 rounded-2xl">{editingModuleIndex !== null ? 'Update' : 'Save'}</Button>
                            <Button variant="outline" onClick={() => { setIsAddingModule(false); setEditingModuleIndex(null); setNewModuleTitle(""); }} className="bg-white border-2 border-slate-100 font-black h-full px-6 rounded-2xl text-slate-400">Cancel</Button>
                         </div>
                      </div>
                    )}

                    <div className="space-y-8">
                       {formData.modules.map((mod, mIdx) => (
                         <div key={mIdx} className="border-4 border-slate-50 rounded-[2.5rem] bg-white overflow-hidden shadow-sm group/mod">
                            <div className="bg-slate-50/50 p-6 flex justify-between items-center border-b border-slate-50">
                               <div className="flex items-center gap-4">
                                  <div className="w-10 h-10 rounded-2xl bg-white border border-slate-100 flex items-center justify-center font-black text-indigo-600 shadow-sm">{mIdx + 1}</div>
                                  <h4 className="font-black text-slate-800 text-xl uppercase tracking-wide">{mod.title}</h4>
                               </div>
                               <div className="flex gap-2 opacity-0 group-hover/mod:opacity-100 transition-opacity">
                                  <button onClick={() => { setNewModuleTitle(mod.title); setEditingModuleIndex(mIdx); setIsAddingModule(true); }} className="w-10 h-10 flex items-center justify-center rounded-xl bg-white text-slate-300 hover:text-indigo-500 border border-slate-100 transition-colors"><Edit2 size={16}/></button>
                                  <button onClick={() => removeModule(mIdx)} className="w-10 h-10 flex items-center justify-center rounded-xl bg-white text-slate-300 hover:text-red-500 border border-slate-100 transition-colors"><Trash2 size={16}/></button>
                               </div>
                            </div>
                            <div className="p-6 space-y-4">
                               {mod.lessons.map((les, sIdx) => (
                                 <div key={sIdx} className="flex justify-between items-center p-5 rounded-2xl bg-slate-50/30 border-2 border-slate-50 hover:border-indigo-100 transition-all group/ses">
                                    <div className="flex items-center gap-5">
                                       <div className="w-10 h-10 rounded-full bg-white flex items-center justify-center text-indigo-500 shadow-sm group-hover/ses:bg-indigo-500 group-hover:text-white transition-all"><PlayCircle size={20}/></div>
                                       <div>
                                          <p className="font-black text-slate-800 text-sm leading-tight">{les.title}</p>
                                          <div className="flex gap-4 mt-1 text-[10px] font-black uppercase tracking-widest text-slate-400">
                                            {les.duration && <span>⏱️ {les.duration}</span>}
                                            {les.videoUrl && <span className="text-indigo-400 flex items-center gap-1"><LinkIcon size={10}/> Linked</span>}
                                          </div>
                                       </div>
                                    </div>
                                    <div className="flex gap-2">
                                       <button onClick={() => { setNewSessionData({ ...les, description: les.description || "" }); setEditingSessionInfo({mIdx, sIdx}); setActiveModuleIndex(mIdx); }} className="p-2 text-slate-200 hover:text-indigo-500 transition-colors"><Edit size={14}/></button>
                                       <button onClick={() => removeSession(mIdx, sIdx)} className="p-2 text-slate-200 hover:text-red-500 transition-colors"><Trash2 size={14}/></button>
                                    </div>
                                 </div>
                               ))}
                               {activeModuleIndex === mIdx ? (
                                 <div className="bg-slate-50 p-6 rounded-3xl border-2 border-slate-100 space-y-5 animate-in slide-in-from-top-2">
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                                       <div className="col-span-2">
                                         <label className="text-[10px] font-black uppercase text-slate-400 ml-2">Session Topic</label>
                                         <input autoFocus placeholder="e.g. Intro to Logic" value={newSessionData.title} onChange={e => setNewSessionData({...newSessionData, title: e.target.value})} className="w-full p-4 rounded-xl border-2 border-white bg-white font-black text-sm outline-none focus:border-indigo-400 shadow-sm" />
                                       </div>
                                       <div className="col-span-2">
                                         <textarea placeholder="Tell them what they will master in this session..." rows={2} value={newSessionData.description} onChange={e => setNewSessionData({...newSessionData, description: e.target.value})} className="w-full p-4 rounded-xl border-2 border-white bg-white font-bold text-sm outline-none focus:border-indigo-400 shadow-sm resize-none" />
                                       </div>
                                       <div>
                                         <label className="text-[10px] font-black uppercase text-slate-400 ml-2">Video Link (Optional)</label>
                                         <input placeholder="https://youtube.com/..." value={newSessionData.videoUrl} onChange={e => setNewSessionData({...newSessionData, videoUrl: e.target.value})} className="w-full p-4 rounded-xl border-2 border-white bg-white font-bold text-sm outline-none focus:border-indigo-400 shadow-sm" />
                                       </div>
                                       <div>
                                         <label className="text-[10px] font-black uppercase text-slate-400 ml-2">Estimated Duration</label>
                                         <input placeholder="e.g. 2 Hours" value={newSessionData.duration} onChange={e => setNewSessionData({...newSessionData, duration: e.target.value})} className="w-full p-4 rounded-xl border-2 border-white bg-white font-bold text-sm outline-none focus:border-indigo-400 shadow-sm" />
                                       </div>
                                    </div>
                                    <div className="flex gap-2 justify-end pt-4 border-t border-slate-100">
                                       <Button variant="ghost" onClick={() => { setActiveModuleIndex(null); setEditingSessionInfo(null); setNewSessionData({title:"", description:"", videoUrl:"", duration:""}); }} className="font-bold text-slate-400">Cancel</Button>
                                       <Button onClick={() => handleAddSession(mIdx)} className="bg-indigo-600 text-white font-black px-8 rounded-xl shadow-lg shadow-indigo-100">{editingSessionInfo ? 'Update Session' : 'Add Session'}</Button>
                                    </div>
                                 </div>
                               ) : (
                                 <button onClick={() => setActiveModuleIndex(mIdx)} className="w-full py-5 border-2 border-dashed border-slate-100 rounded-2xl font-black text-xs text-slate-300 hover:border-indigo-200 hover:text-indigo-400 transition-all uppercase tracking-widest flex items-center justify-center gap-2">
                                   <Plus size={14}/> Add New Topic to {mod.title}
                                 </button>
                               )}
                            </div>
                         </div>
                       ))}
                    </div>
                 </div>
               )}

               {/* STEP 4: FINAL CHECK & MEDIA */}
               {currentStep === 4 && (
                 <div className="animate-in slide-in-from-bottom-4 duration-500 py-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
                       <div className="space-y-8">
                          <div className="bg-slate-50 p-8 rounded-[2.5rem] border-4 border-dashed border-slate-100 text-center hover:border-indigo-300 transition-colors group">
                             <div className="w-20 h-20 bg-white rounded-[1.5rem] shadow-xl flex items-center justify-center text-4xl mx-auto mb-6 group-hover:scale-110 transition-transform">🛰️</div>
                             <h4 className="text-xl font-black text-slate-800 mb-6 tracking-tight">Mission Visual (Thumbnail)</h4>
                             
                             <div className="space-y-4">
                                <input type="file" accept="image/*" className="w-full p-4 border-2 border-slate-100 rounded-2xl bg-white font-black text-xs cursor-pointer hover:border-indigo-300 transition-all" onChange={(e) => {
                                   const file = e.target.files?.[0];
                                   if (file) { setImageFile(file); const r = new FileReader(); r.onloadend = () => setImagePreview(r.result as string); r.readAsDataURL(file); }
                                }} />
                                <div className="text-[10px] font-black text-slate-300 uppercase tracking-widest">or paste url</div>
                                <input placeholder="https://..." value={typeof formData.image === 'string' ? formData.image : ''} className="w-full p-4 border-2 border-slate-100 rounded-2xl bg-white font-bold text-sm outline-none focus:border-indigo-400 transition-all" onChange={e => { setFormData({...formData, image: e.target.value}); setImagePreview(e.target.value); setImageFile(null); }} />
                             </div>
                             
                             {imagePreview && <div className="mt-8 h-48 w-full rounded-[2rem] overflow-hidden border-4 border-white shadow-2xl"><img src={imagePreview} className="w-full h-full object-cover" alt="Preview" /></div>}
                          </div>
                       </div>

                       <div className="flex flex-col justify-center text-center md:text-left space-y-8 p-6 md:p-10 bg-indigo-50/30 rounded-[3rem] border border-indigo-100/50">
                          <CheckCircle className="w-20 h-20 text-green-500 mx-auto md:mx-0 mb-2 animate-bounce" />
                          <h3 className="text-4xl font-black text-slate-800 tracking-tighter leading-none mb-4">Mission Ready <br/><span className="text-indigo-600">for Deployment!</span></h3>
                          <div className="space-y-3 font-bold text-slate-500">
                             <p className="flex items-center gap-3"><span className="w-2 h-2 rounded-full bg-green-500" /> {formData.modules.length} Curriculum Modules Configured</p>
                             <p className="flex items-center gap-3"><span className="w-2 h-2 rounded-full bg-indigo-500" /> Price set at ₹{formData.price}</p>
                             <p className="flex items-center gap-3"><span className="w-2 h-2 rounded-full bg-orange-500" /> Venue: {formData.venue}</p>
                          </div>
                       </div>
                    </div>
                 </div>
               )}

            </CardContent>

            <div className="p-8 md:p-12 border-t border-slate-50 flex items-center justify-between bg-white backdrop-blur-md">
               <Button disabled={currentStep === 1 || isSubmitting} onClick={prevStep} variant="outline" className="px-8 py-5 rounded-2xl border-2 border-slate-100 text-slate-400 font-black flex gap-2 hover:bg-slate-50 transition-all">
                 <ChevronLeft size={20} /> Back
               </Button>
               
               <div className="flex gap-4">
                  {currentStep < 4 ? (
                    <Button onClick={nextStep} className="px-10 py-5 rounded-2xl bg-indigo-600 text-white font-black flex gap-2 shadow-xl shadow-indigo-100 hover:bg-indigo-700 transition-all active:scale-95">
                      Next Step <ChevronRight size={20} />
                    </Button>
                  ) : (
                    <Button disabled={isSubmitting} onClick={() => handleSubmit()} className="px-12 py-5 rounded-3xl bg-indigo-600 text-white font-black text-xl flex gap-3 shadow-2xl shadow-indigo-200 hover:bg-indigo-700 transition-all hover:scale-105 active:scale-95">
                      {isSubmitting ? <><Loader2 className="animate-spin" /> Launching...</> : editingId ? 'Update Mission ✨' : 'Launch Bootcamp 🚀'}
                    </Button>
                  ) }
               </div>
            </div>

          </Card>
        </div>
      )}
    </DashboardLayout>
  );
}
