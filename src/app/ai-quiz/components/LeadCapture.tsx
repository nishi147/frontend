import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { UserCheck, GraduationCap, MapPin, Phone, Mail, User, Rocket } from 'lucide-react';

interface LeadCaptureProps {
  onSubmit: (data: any) => void;
}

export default function LeadCapture({ onSubmit }: LeadCaptureProps) {
  const [role, setRole] = useState<'parent' | 'student' | null>(null);
  
  // Form State
  const [formData, setFormData] = useState({
    parentName: '',
    mobile: '',
    email: '',
    studentName: '',
    age: '',
    grade: '',
    city: ''
  });

  const [errors, setErrors] = useState<Record<string, string>>({});

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    if (errors[e.target.name]) {
      setErrors({ ...errors, [e.target.name]: '' });
    }
  };

  const validate = () => {
    const newErrors: Record<string, string> = {};

    if (!formData.parentName.trim()) {
      newErrors.parentName = 'Parent Name is required';
    }
    
    const phoneRegex = /^[6-9]\d{9}$/;
    if (!formData.mobile.trim()) {
      newErrors.mobile = 'Mobile Number is required';
    } else if (!phoneRegex.test(formData.mobile)) {
      newErrors.mobile = 'Enter a valid 10-digit Indian mobile number';
    }

    if (formData.email && !/^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/.test(formData.email.trim())) {
      newErrors.email = 'Enter a valid email address';
    }

    if (!formData.studentName.trim()) {
      newErrors.studentName = 'Student Name is required';
    }

    const ageNum = parseInt(formData.age, 10);
    if (!formData.age) {
      newErrors.age = 'Age is required';
    } else if (isNaN(ageNum) || ageNum < 5 || ageNum > 19) {
      newErrors.age = 'Age must be between 5 and 19';
    }

    if (!formData.grade) {
      newErrors.grade = 'Please select a Grade/Class';
    }

    if (!formData.city.trim()) {
      newErrors.city = 'City is required';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (validate()) {
      onSubmit({
        ...formData,
        role: role
      });
    }
  };

  return (
    <section id="lead-capture-section" className="py-20 px-4 bg-white border-t border-gray-100Scroll">
      <div className="max-w-4xl mx-auto">
        
        <div className="text-center mb-12">
          <span className="text-xs font-black text-primary-500 uppercase tracking-widest block mb-3">
            Get Started
          </span>
          <h2 className="font-baloo text-3xl sm:text-4xl md:text-5xl font-black text-navy-900 leading-tight">
            Who Is Taking the <span className="text-[#EF4444]">Assessment?</span>
          </h2>
          <p className="text-gray-500 font-bold mt-4 text-sm sm:text-base">
            Select your role to unlock the 3-minute AI Readiness Diagnostic.
          </p>
        </div>

        {/* Role Selection Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 max-w-2xl mx-auto mb-12">
          <button
            type="button"
            onClick={() => setRole('parent')}
            className={`rounded-[32px] p-8 border-2 transition-all duration-300 flex flex-col items-center text-center group ${
              role === 'parent'
                ? 'border-[#6b4fbb] bg-gradient-to-br from-[#6b4fbb]/10 to-[#6b4fbb]/5 shadow-[0_20px_40px_rgba(107,79,187,0.15)] scale-[1.03]'
                : 'border-[#6b4fbb]/10 hover:border-[#6b4fbb]/40 bg-white hover:bg-[#6b4fbb]/5 hover:-translate-y-1.5 shadow-[0_15px_30px_rgba(0,0,0,0.03)] hover:shadow-[0_20px_40px_rgba(107,79,187,0.08)]'
            }`}
          >
            <div className={`w-16 h-16 rounded-2xl flex items-center justify-center mb-4 transition-all duration-300 ${
              role === 'parent'
                ? 'bg-[#6b4fbb] text-white shadow-md'
                : 'bg-[#6b4fbb]/5 text-[#6b4fbb]/70 group-hover:scale-110 group-hover:bg-[#6b4fbb]/10 group-hover:text-[#6b4fbb]'
            }`}>
              <UserCheck size={32} />
            </div>
            <h3 className="font-baloo font-black text-navy-900 text-xl mb-2">I am a Parent</h3>
            <p className="text-gray-400 font-bold text-xs leading-relaxed">
              Evaluating my child's future potential and technical skills alignment.
            </p>
          </button>

          <button
            type="button"
            onClick={() => setRole('student')}
            className={`rounded-[32px] p-8 border-2 transition-all duration-300 flex flex-col items-center text-center group ${
              role === 'student'
                ? 'border-[#ef4444] bg-gradient-to-br from-[#ef4444]/10 to-[#ef4444]/5 shadow-[0_20px_40px_rgba(239,68,68,0.15)] scale-[1.03]'
                : 'border-[#ef4444]/10 hover:border-[#ef4444]/40 bg-white hover:bg-[#ef4444]/5 hover:-translate-y-1.5 shadow-[0_15px_30px_rgba(0,0,0,0.03)] hover:shadow-[0_20px_40px_rgba(239,68,68,0.08)]'
            }`}
          >
            <div className={`w-16 h-16 rounded-2xl flex items-center justify-center mb-4 transition-all duration-300 ${
              role === 'student'
                ? 'bg-[#ef4444] text-white shadow-md'
                : 'bg-[#ef4444]/5 text-[#ef4444]/70 group-hover:scale-110 group-hover:bg-[#ef4444]/10 group-hover:text-[#ef4444]'
            }`}>
              <GraduationCap size={32} />
            </div>
            <h3 className="font-baloo font-black text-navy-900 text-xl mb-2">I am a Student</h3>
            <p className="text-gray-400 font-bold text-xs leading-relaxed">
              Testing my tech, coding, and logical skills to see where I stand!
            </p>
          </button>
        </div>

        {/* Lead Capture Form */}
        <AnimatePresence mode="wait">
          {role && (
            <motion.div
              key={role}
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.4 }}
              className="bg-[#f8fafc] rounded-3xl border border-gray-200/60 p-6 sm:p-10 shadow-sm"
            >
              <h3 className="font-baloo font-black text-navy-900 text-xl sm:text-2xl mb-8 flex items-center gap-3">
                <Rocket className="text-primary-500" /> Enter Details to Start Assessment
              </h3>

              <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-6">
                
                {/* Parent Details Section */}
                <div className="md:col-span-2">
                  <h4 className="text-xs font-black text-gray-400 uppercase tracking-widest mb-4 pb-2 border-b border-gray-200/60">
                    Parent Details
                  </h4>
                </div>

                <div className="flex flex-col gap-1.5">
                  <label className="text-sm font-bold text-gray-700 flex items-center gap-1.5">
                    <User size={16} className="text-gray-400" /> Parent Name <span className="text-red-500">*</span>
                  </label>
                  <input
                    name="parentName"
                    type="text"
                    value={formData.parentName}
                    onChange={handleChange}
                    placeholder="Enter parent's full name"
                    className={`px-4 py-3.5 rounded-2xl border-2 bg-white font-semibold text-gray-800 text-sm focus:outline-none transition-colors ${
                      errors.parentName ? 'border-red-500 focus:border-red-500' : 'border-gray-200/80 focus:border-[#6C5CE7]'
                    }`}
                  />
                  {errors.parentName && <span className="text-red-500 text-xs font-bold mt-0.5">{errors.parentName}</span>}
                </div>

                <div className="flex flex-col gap-1.5">
                  <label className="text-sm font-bold text-gray-700 flex items-center gap-1.5">
                    <Phone size={16} className="text-gray-400" /> Mobile Number <span className="text-red-500">*</span>
                  </label>
                  <input
                    name="mobile"
                    type="tel"
                    maxLength={10}
                    value={formData.mobile}
                    onChange={handleChange}
                    placeholder="Enter 10-digit mobile number"
                    className={`px-4 py-3.5 rounded-2xl border-2 bg-white font-semibold text-gray-800 text-sm focus:outline-none transition-colors ${
                      errors.mobile ? 'border-red-500 focus:border-red-500' : 'border-gray-200/80 focus:border-[#6C5CE7]'
                    }`}
                  />
                  {errors.mobile && <span className="text-red-500 text-xs font-bold mt-0.5">{errors.mobile}</span>}
                </div>

                <div className="flex flex-col gap-1.5 md:col-span-2">
                  <label className="text-sm font-bold text-gray-700 flex items-center gap-1.5">
                    <Mail size={16} className="text-gray-400" /> Email Address <span className="text-gray-400 font-medium">(Optional - to receive report)</span>
                  </label>
                  <input
                    name="email"
                    type="email"
                    value={formData.email}
                    onChange={handleChange}
                    placeholder="parent@example.com"
                    className={`px-4 py-3.5 rounded-2xl border-2 bg-white font-semibold text-gray-800 text-sm focus:outline-none transition-colors ${
                      errors.email ? 'border-red-500 focus:border-red-500' : 'border-gray-200/80 focus:border-[#6C5CE7]'
                    }`}
                  />
                  {errors.email && <span className="text-red-500 text-xs font-bold mt-0.5">{errors.email}</span>}
                </div>

                {/* Student Details Section */}
                <div className="md:col-span-2 mt-4">
                  <h4 className="text-xs font-black text-gray-400 uppercase tracking-widest mb-4 pb-2 border-b border-gray-200/60">
                    Student Details
                  </h4>
                </div>

                <div className="flex flex-col gap-1.5">
                  <label className="text-sm font-bold text-gray-700 flex items-center gap-1.5">
                    <User size={16} className="text-gray-400" /> Student Name <span className="text-red-500">*</span>
                  </label>
                  <input
                    name="studentName"
                    type="text"
                    value={formData.studentName}
                    onChange={handleChange}
                    placeholder="Enter student's name"
                    className={`px-4 py-3.5 rounded-2xl border-2 bg-white font-semibold text-gray-800 text-sm focus:outline-none transition-colors ${
                      errors.studentName ? 'border-red-500 focus:border-red-500' : 'border-gray-200/80 focus:border-[#6C5CE7]'
                    }`}
                  />
                  {errors.studentName && <span className="text-red-500 text-xs font-bold mt-0.5">{errors.studentName}</span>}
                </div>

                <div className="flex flex-col gap-1.5">
                  <label className="text-sm font-bold text-gray-700">
                    Student Age <span className="text-red-500">*</span>
                  </label>
                  <input
                    name="age"
                    type="number"
                    min={5}
                    max={19}
                    value={formData.age}
                    onChange={handleChange}
                    placeholder="e.g. 10"
                    className={`px-4 py-3.5 rounded-2xl border-2 bg-white font-semibold text-gray-800 text-sm focus:outline-none transition-colors ${
                      errors.age ? 'border-red-500 focus:border-red-500' : 'border-gray-200/80 focus:border-[#6C5CE7]'
                    }`}
                  />
                  {errors.age && <span className="text-red-500 text-xs font-bold mt-0.5">{errors.age}</span>}
                </div>

                <div className="flex flex-col gap-1.5">
                  <label className="text-sm font-bold text-gray-700">
                    Grade/Class <span className="text-red-500">*</span>
                  </label>
                  <select
                    name="grade"
                    value={formData.grade}
                    onChange={handleChange}
                    className={`px-4 py-3.5 rounded-2xl border-2 bg-white font-semibold text-[#1e293b] text-sm focus:outline-none transition-colors ${
                      errors.grade ? 'border-red-500 focus:border-red-500' : 'border-gray-200/80 focus:border-[#6C5CE7]'
                    }`}
                  >
                    <option value="">Select Grade</option>
                    <option value="Class 1">Class 1</option>
                    <option value="Class 2">Class 2</option>
                    <option value="Class 3">Class 3</option>
                    <option value="Class 4">Class 4</option>
                    <option value="Class 5">Class 5</option>
                    <option value="Class 6">Class 6</option>
                    <option value="Class 7">Class 7</option>
                    <option value="Class 8">Class 8</option>
                    <option value="Class 9">Class 9</option>
                    <option value="Class 10">Class 10</option>
                    <option value="Class 11">Class 11</option>
                    <option value="Class 12">Class 12</option>
                  </select>
                  {errors.grade && <span className="text-red-500 text-xs font-bold mt-0.5">{errors.grade}</span>}
                </div>

                <div className="flex flex-col gap-1.5">
                  <label className="text-sm font-bold text-gray-700 flex items-center gap-1.5">
                    <MapPin size={16} className="text-gray-400" /> City <span className="text-red-500">*</span>
                  </label>
                  <input
                    name="city"
                    type="text"
                    value={formData.city}
                    onChange={handleChange}
                    placeholder="e.g. Pune"
                    className={`px-4 py-3.5 rounded-2xl border-2 bg-white font-semibold text-gray-800 text-sm focus:outline-none transition-colors ${
                      errors.city ? 'border-red-500 focus:border-red-500' : 'border-gray-200/80 focus:border-[#6C5CE7]'
                    }`}
                  />
                  {errors.city && <span className="text-red-500 text-xs font-bold mt-0.5">{errors.city}</span>}
                </div>

                {/* Submit Button */}
                <div className="md:col-span-2 mt-6">
                  <button
                    type="submit"
                    className="w-full py-4.5 rounded-2xl bg-[#EF4444] hover:bg-[#DC2626] text-white font-black text-lg transition-all shadow-md active:translate-y-1 uppercase tracking-wider inline-flex items-center justify-center gap-2"
                  >
                    🚀 START MY FREE ASSESSMENT
                  </button>
                </div>

              </form>
            </motion.div>
          )}
        </AnimatePresence>

      </div>
    </section>
  );
}
