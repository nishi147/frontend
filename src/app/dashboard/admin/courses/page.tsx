"use client";

import React, { useEffect, useState } from "react";
import { useAuth } from "@/context/AuthContext";
import { DashboardLayout } from "@/components/layout/DashboardLayout";
import { Card, CardContent } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import api from "@/utils/api";
import { Trash2, BookOpen, Plus, Edit2, ChevronLeft, ChevronRight, PlayCircle, CheckCircle } from "lucide-react";
import { useToast } from "@/context/ToastContext";

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

export default function AdminCourseManagement() {
  const { user, loading } = useAuth();
  const { showToast, confirm } = useToast();

  const [courses, setCourses] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingCourse, setEditingCourse] = useState<any>(null);
  const [imagePreview, setImagePreview] = useState<string>("");
  const [categories, setCategories] = useState<any[]>([]);

  const [currentStep, setCurrentStep] = useState(1);

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
    ageGroup: "All",
    courseType: "Group",
    isPublished: true,
    isApproved: true,
    modules: [] as Module[],
  });

  // UI state for module/session addition
  const [newModuleTitle, setNewModuleTitle] = useState("");
  const [activeModuleIndex, setActiveModuleIndex] = useState<number | null>(null);
  const [newSessionData, setNewSessionData] = useState({ title: "", description: "", videoUrl: "", duration: "" });
  const [isAddingModule, setIsAddingModule] = useState(false);
  const [editingModuleIndex, setEditingModuleIndex] = useState<number | null>(null);
  const [editingSessionInfo, setEditingSessionInfo] = useState<{ mIdx: number; sIdx: number } | null>(null);
  const [imageFile, setImageFile] = useState<File | null>(null);

  // FETCH COURSES
  const fetchCourses = async () => {
    try {
      const res = await api.get('/api/courses/admin/all');
      // Fallback handlers to ensure state is array no matter what
      if (res.data?.success) {
        setCourses(res.data.data || res.data.courses || []);
      } else if (Array.isArray(res.data)) {
        setCourses(res.data);
      } else if (res.data?.data) {
        setCourses(res.data.data);
      } else {
        setCourses([]);
      }
    } catch (err) {
      console.error("Failed to fetch courses", err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    // Also fetch if user is not fully loaded just to be fail-safe, or check user role accurately
    if (user?.role === "admin") {
      fetchCourses();
      fetchCategories();
    } else if (user) {
      // If user exists but is not admin, still stop loading to prevent infinite spinner
      setIsLoading(false);
    }
  }, [user]);

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

  // RESET FORM
  const resetForm = () => {
    setFormData({
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
      ageGroup: "All",
      courseType: "Group",
      isPublished: true,
      isApproved: true,
      modules: [],
    });
    setCurrentStep(1);
    setEditingCourse(null);
    setImagePreview("");
    setImageFile(null);
  };

  // CREATE / UPDATE COURSE
  const handleSubmit = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();

    // Frontend Validation
    if (!formData.title?.trim()) {
      showToast("Course Title is required", "error");
      setCurrentStep(1);
      return;
    }
    if (!formData.category?.trim()) {
      showToast("Course Category is required", "error");
      setCurrentStep(1);
      return;
    }
    if (!formData.description?.trim()) {
      showToast("Course Description is required", "error");
      setCurrentStep(1);
      return;
    }

    try {
        const formDataToSubmit = new FormData();
        
        // Append all regular fields
        Object.keys(formData).forEach(key => {
          if (key === 'modules') {
            formDataToSubmit.append('modules', JSON.stringify(formData.modules));
          } else if (key === 'thumbnail') {
            // Only append if it's a string (URL) and no file is selected
            if (typeof formData.thumbnail === 'string' && !imageFile) {
              formDataToSubmit.append('thumbnail', formData.thumbnail);
            }
          } else {
            formDataToSubmit.append(key, (formData as any)[key]);
          }
        });

        // Append file if selected
        if (imageFile) {
          formDataToSubmit.append('thumbnail', imageFile);
        }

        // Price calculations
        formDataToSubmit.set('pricePerSession', formData.offerPrice.toString());
        formDataToSubmit.set('numberOfSessions', (formData.numberOfSessions > 0 ? formData.numberOfSessions : 1).toString());

        const response = await (editingCourse 
          ? api.put(`/api/courses/${editingCourse._id}`, formDataToSubmit, {
              headers: { 'Content-Type': 'multipart/form-data' }
            })
          : api.post('/api/courses', formDataToSubmit, {
              headers: { 'Content-Type': 'multipart/form-data' }
            }));

        if (response.data.success) {
          showToast(editingCourse ? "Course Updated!" : "Course Created!", "success");
          setIsModalOpen(false);
          resetForm();
          fetchCourses();
        }
    } catch (err: any) {
        console.error("Course Submission Error:", err.response?.data || err.message);
        const errorMsg = err.response?.data?.message || err.response?.data?.error || "Check all required fields";
        showToast(`Error: ${errorMsg}`, "error");
    }
  };

  // EDIT
  const openEdit = (course: any) => {
    setEditingCourse(course);
    setFormData({
      title: course.title || "",
      slug: course.slug || "",
      regularPrice: course.regularPrice || 0,
      offerPrice: course.offerPrice || course.pricePerSession || 0,
      category: course.category?._id || course.category || "",
      level: course.level || "Beginner",
      language: course.language || "English",
      totalLessons: course.totalLessons || course.numberOfSessions || 0,
      totalDuration: course.totalDuration || "",
      shortDescription: course.shortDescription || "",
      description: course.description || "",
      thumbnail: course.thumbnail || "",
      pricePerSession: course.pricePerSession || 0,
      numberOfSessions: course.numberOfSessions || 0,
      ageGroup: course.ageGroup || "All",
      courseType: course.courseType || "Group",
      isPublished: course.isPublished,
      isApproved: course.isApproved,
      modules: course.modules || [],
    });
    setImagePreview(course.thumbnail || "");
    setCurrentStep(1);
    setIsModalOpen(true);
  };

  // APPROVE
  const approveCourse = async (id: string) => {
    try {
      await api.put(`/api/courses/admin/approve/${id}`);
      fetchCourses();
      showToast("Course Approved!", "success");
    } catch {
      showToast("Error approving course", "error");
    }
  };

  // DELETE
  const deleteCourse = async (id: string) => {
    const isConfirmed = await (confirm as any)("Delete Course?", "This will remove the course permanently.");
    if (!isConfirmed) return;

    try {
      await api.delete(`/api/courses/${id}`);
      showToast("Course Deleted", "success");
      fetchCourses();
    } catch {
      showToast("Error deleting course", "error");
    }
  };

  // CURRICULUM HANDLERS
  const handleAddModule = () => {
    if (!newModuleTitle.trim()) return;

    if (editingModuleIndex !== null) {
      const updatedModules = [...formData.modules];
      updatedModules[editingModuleIndex].title = newModuleTitle;
      setFormData({ ...formData, modules: updatedModules });
      setEditingModuleIndex(null);
    } else {
      setFormData({
        ...formData,
        modules: [...formData.modules, { title: newModuleTitle, lessons: [] }],
      });
    }
    setNewModuleTitle("");
    setIsAddingModule(false);
  };

  const handleAddSession = (moduleIndex: number) => {
    if (!newSessionData.title.trim()) return;
    const updatedModules = [...formData.modules];

    if (editingSessionInfo) {
      updatedModules[editingSessionInfo.mIdx].lessons[editingSessionInfo.sIdx] = {
        ...newSessionData
      };
      setEditingSessionInfo(null);
    } else {
      updatedModules[moduleIndex].lessons.push({
        title: newSessionData.title,
        description: newSessionData.description,
        videoUrl: newSessionData.videoUrl,
        duration: newSessionData.duration,
      });
    }

    setFormData({
      ...formData,
      modules: updatedModules,
    });
    setNewSessionData({ title: "", description: "", videoUrl: "", duration: "" });
    setActiveModuleIndex(null);
  };

  const openEditModule = (mIdx: number) => {
    setNewModuleTitle(formData.modules[mIdx].title);
    setEditingModuleIndex(mIdx);
    setIsAddingModule(true);
  };

  const openEditSession = (mIdx: number, sIdx: number) => {
    const session = formData.modules[mIdx].lessons[sIdx];
    setNewSessionData({
      title: session.title,
      description: session.description || "",
      videoUrl: session.videoUrl,
      duration: session.duration,
    });
    setEditingSessionInfo({ mIdx, sIdx });
    setActiveModuleIndex(mIdx);
  };

  const removeModule = (mIdx: number) => {
    const updatedModules = formData.modules.filter((_, idx) => idx !== mIdx);
    setFormData({ ...formData, modules: updatedModules });
  };

  const removeSession = (mIdx: number, sIdx: number) => {
    const updatedModules = [...formData.modules];
    updatedModules[mIdx].lessons = updatedModules[mIdx].lessons.filter((_, idx) => idx !== sIdx);
    setFormData({ ...formData, modules: updatedModules });
  };

  const nextStep = () => setCurrentStep((prev) => Math.min(prev + 1, 4));
  const prevStep = () => setCurrentStep((prev) => Math.max(prev - 1, 1));


  if (user?.role !== "admin" && !loading) {
    return <div className="p-20 text-center text-red-500 font-bold">Access Denied</div>;
  }

  return (
    <DashboardLayout>
      <div className="flex justify-between mb-8 items-center">
        <div>
           <h1 className="text-3xl font-black text-gray-800 tracking-tight">Manage Courses</h1>
           <p className="text-gray-500 font-bold uppercase text-[10px] tracking-widest mt-1">Curriculum & Catalogue</p>
        </div>
        <Button onClick={() => { resetForm(); setIsModalOpen(true); }} className="gap-2 px-6 shadow-xl w-auto md:w-auto text-sm md:text-base">
          <Plus size={18} /> <span className="hidden sm:inline">Create Course</span><span className="sm:hidden">Create</span>
        </Button>
      </div>

      {/* COURSES TABLE/GRID */}
      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
        {isLoading ? (
          [1, 2, 3, 4, 5, 6].map(i => (
            <div key={i} className="h-64 rounded-3xl bg-gray-100 animate-pulse" />
          ))
        ) : (
          courses.map((course) => (
            <Card key={course._id} className="overflow-hidden border-2 border-transparent hover:border-primary-100 transition-all shadow-lg">
              <div className="relative h-40 group bg-gray-100">
                {course.thumbnail ? (
                    <img src={course.thumbnail} className="w-full h-full object-cover group-hover:scale-105 transition-all" alt="Course" />
                ) : (
                    <div className="flex items-center justify-center w-full h-full text-5xl opacity-40">📚</div>
                )}
                <div className={`absolute top-4 right-4 px-3 py-1 rounded-full text-xs font-black uppercase tracking-widest text-white shadow-md ${course.isApproved ? 'bg-green-500' : 'bg-amber-500 animate-pulse'}`}>
                    {course.isApproved ? 'Live' : 'Pending'}
                </div>
              </div>

              <CardContent className="p-6 relative">
                <div className="flex items-center justify-between mb-3 text-xs uppercase font-black text-gray-400 tracking-widest">
                  <span className="flex items-center gap-1 text-primary-500">
                    <BookOpen size={14} /> {course.category?.name || 'General'}
                  </span>
                  <span className={course.level === 'Advanced' ? 'text-red-500' : course.level === 'Intermediate' ? 'text-orange-500' : 'text-green-500'}>{course.level}</span>
                </div>

                <h3 className="text-xl font-bold text-gray-800 mb-1 leading-tight line-clamp-1 truncate">{course.title}</h3>
                <p className="text-sm text-gray-500 mb-4 line-clamp-2">By {course.teacher?.name || 'Administrator'}</p>

                <div className="flex items-center gap-4 mb-6 border-t border-gray-100 pt-4">
                  <div>
                      <span className="block text-[10px] uppercase font-black text-gray-400 tracking-wider">Price</span>
                      <span className="font-black text-secondary-600">₹{course.totalCoursePrice || course.offerPrice || course.pricePerSession}</span>
                  </div>
                  <div className="w-px h-8 bg-gray-200"></div>
                  <div>
                      <span className="block text-[10px] uppercase font-black text-gray-400 tracking-wider">Lessons</span>
                      <span className="font-black text-gray-600">{course.totalLessons || course.numberOfSessions || 0}</span>
                  </div>
                </div>

                <div className="flex gap-2">
                  {!course.isApproved && (
                    <Button onClick={() => approveCourse(course._id)} className="flex-1 bg-green-500 hover:bg-green-600 text-white font-bold">Approve</Button>
                  )}
                  <Button variant="outline" onClick={() => openEdit(course)} className="flex-1 font-bold"><Edit2 size={16} className="mr-2" /> Edit</Button>
                  <Button variant="outline" onClick={() => deleteCourse(course._id)} className="flex-none px-4 text-red-500 border-red-200 hover:bg-red-50"><Trash2 size={16} /></Button>
                </div>
              </CardContent>
            </Card>
          ))
        )}
      </div>

      {/* WIZARD MODAL */}
      {isModalOpen && (
        <div className="fixed inset-0 z-[2000] flex items-start md:items-center justify-center bg-black/70 backdrop-blur-sm p-0 md:p-4 overflow-y-auto">
          <Card className="w-full max-w-4xl bg-white shadow-2xl rounded-none md:rounded-3xl overflow-hidden flex flex-col min-h-screen md:min-h-0 md:h-auto md:max-h-[95vh] my-0 md:my-4">

            
            {/* Header & Stepper */}
            <div className="bg-gray-50 border-b border-gray-100 p-6 flex flex-col items-center justify-center relative">
               <button onClick={() => setIsModalOpen(false)} className="absolute right-6 top-6 w-8 h-8 flex items-center justify-center rounded-full hover:bg-gray-200 font-bold transition-colors">✕</button>
               <h2 className="text-2xl font-black text-gray-800 mb-6">{editingCourse ? 'Editing Course' : 'Create New Course'}</h2>
               
               <div className="flex items-center gap-2 w-full max-w-2xl px-4">
                  {[1, 2, 3, 4].map((step) => (
                    <React.Fragment key={step}>
                       <div className={`w-8 h-8 rounded-full flex items-center justify-center font-black text-sm z-10 transition-colors ${currentStep >= step ? 'bg-primary-500 text-white shadow-md shadow-primary-200' : 'bg-gray-200 text-gray-500'}`}>
                         {step}
                       </div>
                       {step < 4 && <div className={`flex-1 h-1 rounded-full transition-colors ${currentStep > step ? 'bg-primary-500' : 'bg-gray-200'}`} />}
                    </React.Fragment>
                  ))}
               </div>
               <div className="flex justify-between w-full max-w-2xl px-4 mt-2 text-[10px] font-black uppercase text-gray-400 tracking-widest">
                  <span className={currentStep >= 1 ? 'text-primary-600' : ''}>Basic Info</span>
                  <span className={currentStep >= 2 ? 'text-primary-600' : ''}>Media</span>
                  <span className={currentStep >= 3 ? 'text-primary-600' : ''}>Curriculum</span>
                  <span className={currentStep >= 4 ? 'text-primary-600' : ''}>Review</span>
               </div>
            </div>

            {/* Scrollable Content Body */}
            <CardContent className="p-6 md:p-8 overflow-y-auto flex-1 bg-white">
               
               {/* STEP 1: BASIC INFORMATION */}
               {currentStep === 1 && (
                 <div className="grid grid-cols-1 md:grid-cols-2 gap-5 animate-in fade-in zoom-in-95 duration-200">
                    <div className="col-span-2 md:col-span-1">
                      <label className="text-xs font-black text-gray-500 uppercase tracking-widest mb-1 block">Title</label>
                      <input required placeholder="Enter course title" value={formData.title} className="w-full p-4 border bg-gray-50 border-gray-100 rounded-xl font-bold focus:border-primary-500 focus:bg-white outline-none" onChange={(e) => setFormData({ ...formData, title: e.target.value })} />
                    </div>
                    <div className="col-span-2 md:col-span-1">
                      <label className="text-xs font-black text-gray-500 uppercase tracking-widest mb-1 block">Slug (URL)</label>
                      <input placeholder="e.g. generative-ai-kids" value={formData.slug} className="w-full p-4 border bg-gray-50 border-gray-100 rounded-xl font-bold focus:border-primary-500 focus:bg-white outline-none" onChange={(e) => setFormData({ ...formData, slug: e.target.value })} />
                    </div>

                    <div className="col-span-2 md:col-span-1">
                      <label className="text-xs font-black text-gray-500 uppercase tracking-widest mb-1 block">Regular Price (₹)</label>
                      <input 
                        type="number" 
                        value={formData.regularPrice || ""} 
                        className="w-full p-4 border bg-gray-50 border-gray-100 rounded-xl font-bold focus:border-primary-500 focus:bg-white outline-none" 
                        onWheel={(e) => e.currentTarget.blur()}
                        onChange={(e) => setFormData({ ...formData, regularPrice: e.target.value === "" ? 0 : Number(e.target.value) })} 
                      />
                    </div>
                    <div className="col-span-2 md:col-span-1">
                      <label className="text-xs font-black text-gray-500 uppercase tracking-widest mb-1 block">Offer Price (₹)</label>
                      <input 
                        type="number" 
                        value={formData.offerPrice || ""} 
                        className="w-full p-4 border bg-gray-50 border-gray-100 rounded-xl font-bold text-green-600 focus:border-primary-500 focus:bg-white outline-none" 
                        onWheel={(e) => e.currentTarget.blur()}
                        onChange={(e) => setFormData({ ...formData, offerPrice: e.target.value === "" ? 0 : Number(e.target.value) })} 
                      />
                    </div>

                    <div className="col-span-2 md:col-span-1">
                      <label className="text-xs font-black text-gray-500 uppercase tracking-widest mb-1 block">Category</label>
                      <select 
                        required
                        value={formData.category} 
                        className="w-full p-4 border bg-gray-50 border-gray-100 rounded-xl font-bold focus:border-primary-500 focus:bg-white outline-none appearance-none" 
                        onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                      >
                        <option value="">Select Category</option>
                        {categories.map((cat) => (
                          <option key={cat._id} value={cat._id}>{cat.name}</option>
                        ))}
                      </select>
                    </div>
                    <div className="col-span-2 md:col-span-1">
                      <label className="text-xs font-black text-gray-500 uppercase tracking-widest mb-1 block">Level</label>
                      <select value={formData.level} className="w-full p-4 border bg-gray-50 border-gray-100 rounded-xl font-bold focus:border-primary-500 focus:bg-white outline-none appearance-none" onChange={(e) => setFormData({ ...formData, level: e.target.value })}>
                         <option value="Beginner">Beginner 🟢</option>
                         <option value="Intermediate">Intermediate 🟡</option>
                         <option value="Advanced">Advanced 🔴</option>
                      </select>
                    </div>

                    <div className="col-span-2 md:col-span-1">
                      <label className="text-xs font-black text-gray-500 uppercase tracking-widest mb-1 block">Language</label>
                      <select value={formData.language} className="w-full p-4 border bg-gray-50 border-gray-100 rounded-xl font-bold focus:border-primary-500 focus:bg-white outline-none appearance-none" onChange={(e) => setFormData({ ...formData, language: e.target.value })}>
                         <option value="English">English</option>
                         <option value="Hindi">Hindi</option>
                         <option value="Spanish">Spanish</option>
                      </select>
                    </div>
                    <div className="col-span-2 md:col-span-1">
                      <label className="text-xs font-black text-gray-500 uppercase tracking-widest mb-1 block">Number of Sessions</label>
                      <input 
                        type="number" 
                        value={formData.numberOfSessions || ""} 
                        placeholder="e.g. 32"
                        className="w-full p-4 border bg-gray-50 border-gray-100 rounded-xl font-bold focus:border-primary-500 focus:bg-white outline-none" 
                        onWheel={(e) => e.currentTarget.blur()}
                        onChange={(e) => {
                          const val = e.target.value === "" ? 0 : Number(e.target.value);
                          setFormData({ ...formData, numberOfSessions: val, totalLessons: val });
                        }} 
                      />
                    </div>
                    
                    <div className="col-span-2 md:col-span-1">
                      <label className="text-xs font-black text-gray-500 uppercase tracking-widest mb-1 block">Age Group</label>
                      <select value={formData.ageGroup} className="w-full p-4 border bg-gray-50 border-gray-100 rounded-xl font-bold focus:border-primary-500 focus:bg-white outline-none appearance-none" onChange={(e) => setFormData({ ...formData, ageGroup: e.target.value })}>
                         <option value="All">All Ages</option>
                         <option value="6-9">Ages 6-9</option>
                         <option value="10-12">Ages 10-12</option>
                         <option value="13-16">Ages 13-16</option>
                      </select>
                    </div>

                    <div className="col-span-2 md:col-span-1">
                      <label className="text-xs font-black text-gray-500 uppercase tracking-widest mb-1 block">Class Type</label>
                      <select value={formData.courseType} className="w-full p-4 border bg-gray-50 border-gray-100 rounded-xl font-bold focus:border-primary-500 focus:bg-white outline-none appearance-none" onChange={(e) => setFormData({ ...formData, courseType: e.target.value })}>
                         <option value="Group">Group Class</option>
                         <option value="1:1">1:1 Session</option>
                      </select>
                    </div>
                    
                    <div className="col-span-2">
                       <label className="text-xs font-black text-gray-500 uppercase tracking-widest mb-1 block">Total Duration</label>
                       <input placeholder="e.g. 10 hours 30 minutes" value={formData.totalDuration} className="w-full p-4 border bg-gray-50 border-gray-100 rounded-xl font-bold focus:border-primary-500 focus:bg-white outline-none" onChange={(e) => setFormData({ ...formData, totalDuration: e.target.value })} />
                    </div>

                    <div className="col-span-2">
                      <label className="text-xs font-black text-gray-500 uppercase tracking-widest mb-1 block">Short Description</label>
                      <textarea placeholder="Brief summary (max 150 chars)" value={formData.shortDescription} rows={2} className="w-full p-4 border bg-gray-50 border-gray-100 rounded-xl font-bold resize-none focus:border-primary-500 focus:bg-white outline-none" onChange={(e) => setFormData({ ...formData, shortDescription: e.target.value })} />
                    </div>
                    
                    <div className="col-span-2">
                      <label className="text-xs font-black text-gray-500 uppercase tracking-widest mb-1 block">Full Description</label>
                      <textarea placeholder="Detailed course description" value={formData.description} rows={4} className="w-full p-4 border bg-gray-50 border-gray-100 rounded-xl font-bold resize-none focus:border-primary-500 focus:bg-white outline-none" onChange={(e) => setFormData({ ...formData, description: e.target.value })} />
                    </div>
                 </div>
               )}

               {/* STEP 2: IMAGE & VIDEO */}
               {currentStep === 2 && (
                 <div className="flex flex-col items-center justify-center animate-in fade-in zoom-in-95 duration-200 py-10">
                    <div className="w-full max-lg bg-gray-50 p-8 rounded-3xl border-2 border-dashed border-gray-200 text-center hover:border-primary-300 transition-colors">
                       <div className="w-20 h-20 bg-white rounded-full flex items-center justify-center text-4xl mx-auto shadow-sm mb-6">📷</div>
                       <h3 className="text-xl font-black text-gray-800 mb-2">Course Thumbnail</h3>
                       
                       <div className="space-y-4 relative w-full text-left">
                          <div>
                            <p className="text-xs font-bold text-gray-500 uppercase tracking-widest mb-2 text-center">Upload or Paste URL</p>
                            <div className="flex flex-col gap-3">
                               <input 
                                 type="file"
                                 accept="image/*"
                                 onChange={(e) => {
                                   const file = e.target.files?.[0];
                                   if (file) {
                                      setImageFile(file);
                                      const reader = new FileReader();
                                      reader.onloadend = () => setImagePreview(reader.result as string);
                                      reader.readAsDataURL(file);
                                   }
                                 }}
                                 className="w-full p-4 border-2 border-dashed border-gray-200 rounded-xl font-bold text-sm bg-white cursor-pointer hover:border-primary-400 transition-all"
                               />
                               <div className="flex items-center gap-2">
                                  <div className="h-px bg-gray-200 flex-1"></div>
                                  <span className="text-[10px] font-black text-gray-400 uppercase tracking-widest">OR</span>
                                  <div className="h-px bg-gray-200 flex-1"></div>
                               </div>
                               <input 
                                placeholder="Paste Image Link (https://...)" 
                                value={typeof formData.thumbnail === 'string' ? formData.thumbnail : ''} 
                                className="w-full p-4 border bg-white border-gray-100 rounded-xl font-bold focus:border-primary-500 outline-none text-center text-sm" 
                                onChange={(e) => { 
                                  setFormData({ ...formData, thumbnail: e.target.value });
                                  setImagePreview(e.target.value);
                                  setImageFile(null);
                                }} 
                              />
                            </div>
                          </div>
                       </div>
                       
                       {imagePreview && (
                         <div className="mt-8 border-4 border-white shadow-xl rounded-xl overflow-hidden aspect-video bg-gray-200">
                           <img src={imagePreview} alt="Preview" className="w-full h-full object-cover" onError={(e) => (e.currentTarget.style.display = 'none')} />
                         </div>
                       )}
                    </div>
                 </div>
               )}

               {/* STEP 3: CURRICULUM */}
               {currentStep === 3 && (
                 <div className="animate-in fade-in zoom-in-95 duration-200 space-y-6">
                    <div className="flex justify-between items-center bg-blue-50/50 p-4 rounded-2xl border border-blue-100">
                      <div>
                         <h3 className="font-black text-slate-800 text-lg">Curriculum Builder</h3>
                         <p className="text-xs font-bold text-slate-500">Structure your course into modules and sessions.</p>
                      </div>
                      <Button onClick={() => setIsAddingModule(true)} className="bg-slate-800 hover:bg-slate-900 text-white font-bold gap-2 rounded-xl">
                        <Plus size={16} /> Add Module
                      </Button>
                    </div>

                    {isAddingModule && (
                      <div className="bg-gray-50 border-2 border-primary-200 p-6 rounded-2xl flex gap-4">
                         <input 
                           autoFocus
                           placeholder="Enter Module Title (e.g. Introduction to React)" 
                           value={newModuleTitle} 
                           onChange={(e) => setNewModuleTitle(e.target.value)}
                           className="flex-1 p-3 rounded-xl border border-gray-200 font-bold focus:border-primary-500 outline-none text-sm"
                         />
                         <Button onClick={handleAddModule} className="font-bold shrink-0">{editingModuleIndex !== null ? 'Update Module' : 'Save Module'}</Button>
                         <Button variant="outline" onClick={() => { setIsAddingModule(false); setEditingModuleIndex(null); setNewModuleTitle(""); }} className="shrink-0 font-bold">Cancel</Button>
                      </div>
                    )}

                    {formData.modules.length === 0 && !isAddingModule ? (
                      <div className="text-center py-16 px-4 border-2 border-dashed border-gray-200 rounded-3xl">
                        <span className="text-5xl opacity-40 mb-4 block">📑</span>
                        <h4 className="font-black text-xl text-gray-400 mb-2">No Modules Yet</h4>
                        <p className="text-gray-400 font-bold text-sm">Organize your course content by adding the first module.</p>
                      </div>
                    ) : (
                      <div className="space-y-6">
                        {formData.modules.map((module, mIdx) => (
                          <div key={mIdx} className="border-2 border-slate-100 rounded-2xl overflow-hidden shadow-sm">
                            {/* Module Header */}
                            <div className="bg-slate-50 p-5 flex justify-between items-center border-b border-slate-100">
                               <div className="flex items-center gap-3">
                                  <div className="w-8 h-8 rounded-lg bg-white border border-slate-200 flex items-center justify-center text-slate-400 font-black text-sm">{mIdx + 1}</div>
                                  <h4 className="font-black text-slate-800 text-lg">{module.title}</h4>
                               </div>
                               <div className="flex gap-2">
                                  <button 
                                    onClick={() => openEditModule(mIdx)} 
                                    className="flex items-center justify-center w-8 h-8 rounded-full border border-slate-200 text-slate-400 hover:text-primary-500 hover:border-primary-200 hover:bg-primary-50 transition-all bg-white shadow-sm"
                                    title="Edit Module"
                                  >
                                    <Edit2 size={14}/>
                                  </button>
                                  <button 
                                    onClick={() => removeModule(mIdx)} 
                                    className="flex items-center justify-center w-8 h-8 rounded-full border border-red-100 text-red-400 hover:text-red-600 hover:border-red-200 hover:bg-red-50 transition-all bg-white shadow-sm"
                                    title="Delete Module"
                                  >
                                    <Trash2 size={14}/>
                                  </button>
                               </div>
                            </div>

                            {/* Module Content */}
                            <div className="p-5 space-y-3 bg-white">
                               {module.lessons.map((session, sIdx) => (
                                 <div key={sIdx} className="flex justify-between items-center p-4 border border-slate-100 rounded-xl hover:border-primary-200 transition-colors bg-white group shadow-sm">
                                    <div className="flex items-center gap-4">
                                       <div className="w-10 h-10 rounded-full bg-primary-50 text-primary-500 flex items-center justify-center group-hover:bg-primary-500 group-hover:text-white transition-colors">
                                          <PlayCircle size={20} />
                                       </div>
                                       <div>
                                          <h5 className="font-bold text-slate-800 text-sm leading-tight">{session.title}</h5>
                                          <div className="text-[10px] font-black uppercase tracking-widest text-slate-400 mt-1 flex gap-3">
                                            {session.duration && <span>⏱️ {session.duration}</span>}
                                            {session.videoUrl && <span>🔗 Video Linked</span>}
                                          </div>
                                          {session.description && (
                                            <p className="text-[10px] font-bold text-slate-500 mt-1 line-clamp-2 italic">{session.description}</p>
                                          )}
                                       </div>
                                    </div>
                                    <div className="flex gap-2">
                                       <button 
                                         onClick={() => openEditSession(mIdx, sIdx)} 
                                         className="flex items-center justify-center w-8 h-8 rounded-lg border border-slate-200 text-slate-400 hover:text-primary-500 hover:border-primary-200 hover:bg-primary-50 transition-all bg-white shadow-sm"
                                         title="Edit Session"
                                       >
                                         <Edit2 size={14}/>
                                       </button>
                                       <button 
                                         onClick={() => removeSession(mIdx, sIdx)} 
                                         className="flex items-center justify-center w-8 h-8 rounded-lg border border-red-100 text-red-400 hover:text-red-600 hover:border-red-200 hover:bg-red-50 transition-all bg-white shadow-sm"
                                         title="Delete Session"
                                       >
                                         <Trash2 size={14}/>
                                       </button>
                                    </div>
                                 </div>
                               ))}

                               {activeModuleIndex === mIdx ? (
                                 <div className="bg-slate-50 border border-slate-200 p-5 rounded-xl space-y-4 mt-4">
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                      <div className="md:col-span-2">
                                        <label className="text-[10px] font-black uppercase text-slate-400 ml-1">Session Title</label>
                                        <input autoFocus placeholder="e.g. Getting Started" value={newSessionData.title} onChange={(e) => setNewSessionData({...newSessionData, title: e.target.value})} className="w-full p-3 rounded-lg border border-slate-200 font-bold focus:border-primary-500 outline-none text-sm" />
                                      </div>
                                      <div className="md:col-span-2">
                                        <label className="text-[10px] font-black uppercase text-slate-400 ml-1">Session Description (Short)</label>
                                        <textarea placeholder="Briefly describe what this session covers" value={newSessionData.description} onChange={(e) => setNewSessionData({...newSessionData, description: e.target.value})} className="w-full p-3 rounded-lg border border-slate-200 font-bold focus:border-primary-500 outline-none text-sm resize-none" rows={2} />
                                      </div>
                                      <div>
                                        <label className="text-[10px] font-black uppercase text-slate-400 ml-1">Video URL (Optional)</label>
                                        <input placeholder="https://youtube.com/..." value={newSessionData.videoUrl} onChange={(e) => setNewSessionData({...newSessionData, videoUrl: e.target.value})} className="w-full p-3 rounded-lg border border-slate-200 font-bold focus:border-primary-500 outline-none text-sm" />
                                      </div>
                                      <div>
                                        <label className="text-[10px] font-black uppercase text-slate-400 ml-1">Duration (Optional)</label>
                                        <input placeholder="e.g. 15m" value={newSessionData.duration} onChange={(e) => setNewSessionData({...newSessionData, duration: e.target.value})} className="w-full p-3 rounded-lg border border-slate-200 font-bold focus:border-primary-500 outline-none text-sm" />
                                      </div>
                                    </div>
                                    <div className="flex gap-2 justify-end pt-2 border-t border-slate-200">
                                      <Button variant="outline" onClick={() => { setActiveModuleIndex(null); setEditingSessionInfo(null); setNewSessionData({ title: "", description: "", videoUrl: "", duration: "" }); }} className="h-9 px-4 text-xs font-bold">Cancel</Button>
                                      <Button onClick={() => handleAddSession(mIdx)} className="h-9 px-6 text-xs font-bold hover:bg-primary-600">{editingSessionInfo ? 'Update Session' : 'Save Session'}</Button>
                                    </div>
                                 </div>
                               ) : (
                                 <Button variant="outline" onClick={() => setActiveModuleIndex(mIdx)} className="w-full border-dashed border-2 border-slate-200 text-slate-500 hover:border-primary-300 hover:text-primary-600 font-bold flex gap-2">
                                    <Plus size={16} /> Add Session to {module.title}
                                 </Button>
                               )}
                            </div>
                          </div>
                        ))}
                      </div>
                    )}
                 </div>
               )}

               {/* STEP 4: REVIEW */}
               {currentStep === 4 && (
                 <div className="animate-in fade-in zoom-in-95 duration-200 p-6 md:p-10 border border-slate-100 rounded-3xl bg-slate-50/50">
                    <div className="text-center mb-10">
                       <div className="w-20 h-20 bg-green-100 text-green-500 rounded-full flex items-center justify-center mx-auto mb-4 scale-110">
                         <CheckCircle className="w-10 h-10" />
                       </div>
                       <h3 className="text-2xl font-black text-slate-800 mb-2">Ready for Lift-Off! 🚀</h3>
                       <p className="text-slate-500 font-bold text-sm max-w-sm mx-auto">Please review the course details before launching it into the global catalogue.</p>
                    </div>

                    <div className="bg-white p-6 rounded-2xl border border-slate-100 shadow-sm grid grid-cols-1 sm:grid-cols-2 flex-wrap gap-8 text-sm">
                       <div>
                          <span className="block text-[10px] uppercase font-black tracking-widest text-slate-400 mb-1">Course Title</span>
                          <span className="font-black text-slate-800 text-lg">{formData.title || <span className="text-red-400">Missing</span>}</span>
                       </div>
                       <div>
                          <span className="block text-[10px] uppercase font-black tracking-widest text-slate-400 mb-1">Price / Offer Price</span>
                          <div className="flex items-center gap-2 font-black">
                            <span className="text-slate-400 line-through">₹{formData.regularPrice}</span>
                            <span className="text-green-600 text-lg">₹{formData.offerPrice}</span>
                          </div>
                       </div>
                        <div>
                          <span className="block text-[10px] uppercase font-black tracking-widest text-slate-400 mb-1">Category & Level</span>
                          <span className="font-bold text-slate-600">
                            {categories.find(c => c._id === formData.category)?.name || 'N/A'} • {formData.level}
                          </span>
                        </div>
                       <div>
                          <span className="block text-[10px] uppercase font-black tracking-widest text-slate-400 mb-1">Curriculum Details</span>
                          <span className="font-bold text-slate-600">{formData.modules.length} Modules / {formData.numberOfSessions} Sessions Total</span>
                        </div>

                        <div className="col-span-1 sm:col-span-2 mt-4 pt-4 border-t border-slate-100 grid grid-cols-1 sm:grid-cols-2 gap-4">
                           <div className="flex items-center justify-between p-4 bg-slate-100/50 rounded-2xl">
                              <span className="text-xs font-black uppercase text-slate-500">Public Visibility</span>
                              <button 
                                type="button"
                                onClick={() => setFormData({...formData, isPublished: !formData.isPublished})}
                                className={`px-4 py-1.5 rounded-full text-[10px] font-black uppercase tracking-widest transition-all ${formData.isPublished ? 'bg-primary-500 text-white' : 'bg-slate-300 text-slate-600'}`}
                              >
                                {formData.isPublished ? 'Published' : 'Hidden'}
                              </button>
                           </div>
                           <div className="flex items-center justify-between p-4 bg-slate-100/50 rounded-2xl">
                              <span className="text-xs font-black uppercase text-slate-500">Approval Status</span>
                              <button 
                                type="button"
                                onClick={() => setFormData({...formData, isApproved: !formData.isApproved})}
                                className={`px-4 py-1.5 rounded-full text-[10px] font-black uppercase tracking-widest transition-all ${formData.isApproved ? 'bg-green-500 text-white' : 'bg-slate-300 text-slate-600'}`}
                              >
                                {formData.isApproved ? 'Approved' : 'Pending'}
                              </button>
                           </div>
                        </div>
                    </div>
                 </div>
               )}
               
            </CardContent>

            {/* Footer Navigation */}
            <div className="bg-white border-t border-gray-100 p-6 flex justify-between items-center rounded-b-3xl shrink-0 z-10">
               <Button 
                variant="outline" 
                onClick={prevStep} 
                disabled={currentStep === 1}
                className="font-black gap-2 border-gray-200 text-gray-500 hover:text-gray-800 w-28"
               >
                 <ChevronLeft size={18} /> Back
               </Button>

               {currentStep < 4 ? (
                 <Button onClick={nextStep} className="font-black text-lg gap-2 px-10 shadow-lg shadow-primary-200 w-48 hover:-translate-y-0.5 transition-transform">
                   Next <ChevronRight size={18} />
                 </Button>
               ) : (
                 <Button onClick={() => handleSubmit()} className="font-black text-lg gap-2 px-10 bg-green-500 hover:bg-green-600 shadow-lg shadow-green-200 w-48 hover:-translate-y-0.5 transition-transform">
                   <CheckCircle size={18} /> {editingCourse ? 'Save Changes' : 'Publish Course'}
                 </Button>
               )}
            </div>
          </Card>
        </div>
      )}
    </DashboardLayout>
  );
}