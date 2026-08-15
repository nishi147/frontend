"use client";

import React, { useState } from 'react';
import { X, Calendar, User, Phone, Mail, BookOpen, CheckCircle, Sparkles, ShieldCheck, Clock, Award } from 'lucide-react';
import api from '@/utils/api';
import { useToast } from '@/context/ToastContext';
import { TrustpilotBadge } from '@/components/ui/TrustpilotBadge';

interface FreeDemoModalProps {
  isOpen: boolean;
  onClose: () => void;
  defaultCurriculum?: string;
}

export const FreeDemoModal: React.FC<FreeDemoModalProps> = ({
  isOpen,
  onClose,
  defaultCurriculum = 'IB'
}) => {
  const { showToast } = useToast();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);

  const [formData, setFormData] = useState({
    parentName: '',
    studentName: '',
    email: '',
    phone: '',
    grade: 'Grade 9-10',
    curriculum: defaultCurriculum,
    subject: 'Mathematics',
    notes: '',
  });

  if (!isOpen) return null;

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.parentName || !formData.phone || !formData.email || !formData.studentName) {
      showToast('Please fill in all required fields.', 'error');
      return;
    }

    setIsSubmitting(true);
    try {
      await api.post('/api/leads', {
        name: formData.parentName,
        email: formData.email,
        phone: formData.phone,
        source: 'Academic Page Free Demo',
        notes: [
          {
            text: `Student: ${formData.studentName} | Grade: ${formData.grade} | Curriculum: ${formData.curriculum} | Subject: ${formData.subject} | Extra Notes: ${formData.notes || 'None'}`
          }
        ]
      });

      // Silently subscribe to email list if needed
      api.post('/api/klaviyo/subscribe', {
        email: formData.email,
        firstName: formData.parentName.split(' ')[0],
        phone: formData.phone,
        source: 'Academic Free Demo'
      }).catch(() => {});

      setIsSubmitted(true);
      showToast('Free Demo Class booked successfully! Our academic coordinator will contact you shortly.', 'success');
    } catch (err: any) {
      console.error(err);
      showToast('Failed to submit booking. Please try again or call +91 9960559894.', 'error');
    } finally {
      setIsSubmitting(false);
    }
  };

  const resetAndClose = () => {
    setIsSubmitted(false);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-[200] flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-fade-in overflow-y-auto">
      <div className="relative w-full max-w-2xl bg-white rounded-3xl shadow-2xl border border-slate-200 overflow-hidden my-8 text-slate-900">
        
        {/* Top Header with Soft Light Theme Background */}
        <div className="bg-gradient-to-r from-[#F4F7FF] via-[#EEF4FF] to-[#F8FAFC] border-b border-slate-200 p-6 md:p-8 relative">
          <button
            onClick={resetAndClose}
            className="absolute top-4 right-4 w-9 h-9 rounded-full bg-white hover:bg-[#1E7DBB] border border-slate-200 hover:border-[#1E7DBB] flex items-center justify-center text-slate-600 hover:text-white transition-all shadow-sm"
            aria-label="Close"
          >
            <X size={20} />
          </button>

          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white border border-blue-200 text-xs font-black text-[#1E7DBB] uppercase tracking-wider mb-3 shadow-sm">
            <Sparkles size={14} className="text-[#FF9B04] fill-[#FF9B04]" /> 100% Free • No Credit Card Required
          </div>

          <h3 className="text-2xl md:text-3xl font-black text-[#030F40] tracking-tight leading-tight">
            Book Your Child's Free 1-to-1 Demo Class
          </h3>
          <p className="text-slate-600 text-xs md:text-sm font-medium mt-1">
            Meet an expert tutor, get an academic diagnostic assessment, and build a tailored learning path.
          </p>

          <div className="mt-4 flex flex-wrap items-center gap-3">
            <TrustpilotBadge variant="compact" />
            <span className="text-[11px] font-bold text-[#1E7DBB] flex items-center gap-1 bg-white border border-blue-200 px-2.5 py-1 rounded-full shadow-sm">
              <ShieldCheck size={14} className="text-emerald-500" /> Top 1% Verified Tutors
            </span>
          </div>
        </div>

        {/* Form Body or Success View */}
        <div className="p-6 md:p-8 bg-white">
          {isSubmitted ? (
            <div className="text-center py-8 space-y-5">
              <div className="w-16 h-16 bg-[#EEF4FF] border border-blue-200 text-[#1E7DBB] rounded-full flex items-center justify-center mx-auto animate-bounce shadow-sm">
                <CheckCircle size={36} />
              </div>
              <h4 className="text-2xl font-black text-[#030F40]">Your Free Demo is Reserved! 🎉</h4>
              <p className="text-slate-600 text-sm max-w-md mx-auto font-medium">
                Thank you, <span className="font-bold text-[#030F40]">{formData.parentName}</span>! Our Academic Coordinator is matching <span className="font-bold text-[#1E7DBB]">{formData.studentName}</span> with the perfect {formData.curriculum} tutor.
              </p>
              <div className="bg-[#F8FAFC] p-4 rounded-2xl border border-slate-200 text-xs text-slate-700 max-w-md mx-auto text-left space-y-2">
                <div className="flex items-center gap-2 font-bold text-[#030F40]">
                  <Clock size={14} className="text-[#FF9B04]" /> What happens next?
                </div>
                <p>1. We will reach out on WhatsApp/Call ({formData.phone}) within 2 hours to confirm your convenient time slot.</p>
                <p>2. You'll receive a 1-to-1 Zoom link & personalized pre-lesson diagnostic sheet.</p>
              </div>
              <button
                onClick={resetAndClose}
                className="px-8 py-3 rounded-full bg-[#1E7DBB] hover:bg-[#030F40] text-white font-black text-sm hover:opacity-95 transition-all shadow-md"
              >
                Back to Ruzann Academic
              </button>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                
                {/* Parent Name */}
                <div>
                  <label className="block text-xs font-black uppercase tracking-wider text-[#030F40] mb-1">
                    Parent's Full Name <span className="text-[#FF9B04]">*</span>
                  </label>
                  <div className="relative">
                    <User size={16} className="absolute left-3 top-3 text-[#1E7DBB]" />
                    <input
                      type="text"
                      name="parentName"
                      value={formData.parentName}
                      onChange={handleChange}
                      placeholder="e.g. Sarah Jenkins"
                      required
                      className="w-full pl-9 pr-3 py-2.5 rounded-xl bg-[#F8FAFC] border border-slate-300 text-slate-900 text-sm font-semibold focus:outline-none focus:border-[#1E7DBB] focus:bg-white transition-colors"
                    />
                  </div>
                </div>

                {/* Student Name */}
                <div>
                  <label className="block text-xs font-black uppercase tracking-wider text-[#030F40] mb-1">
                    Student's Name <span className="text-[#FF9B04]">*</span>
                  </label>
                  <div className="relative">
                    <User size={16} className="absolute left-3 top-3 text-[#1E7DBB]" />
                    <input
                      type="text"
                      name="studentName"
                      value={formData.studentName}
                      onChange={handleChange}
                      placeholder="e.g. Alex Jenkins"
                      required
                      className="w-full pl-9 pr-3 py-2.5 rounded-xl bg-[#F8FAFC] border border-slate-300 text-slate-900 text-sm font-semibold focus:outline-none focus:border-[#1E7DBB] focus:bg-white transition-colors"
                    />
                  </div>
                </div>

                {/* Email */}
                <div>
                  <label className="block text-xs font-black uppercase tracking-wider text-[#030F40] mb-1">
                    Email Address <span className="text-[#FF9B04]">*</span>
                  </label>
                  <div className="relative">
                    <Mail size={16} className="absolute left-3 top-3 text-[#1E7DBB]" />
                    <input
                      type="email"
                      name="email"
                      value={formData.email}
                      onChange={handleChange}
                      placeholder="sarah@example.com"
                      required
                      className="w-full pl-9 pr-3 py-2.5 rounded-xl bg-[#F8FAFC] border border-slate-300 text-slate-900 text-sm font-semibold focus:outline-none focus:border-[#1E7DBB] focus:bg-white transition-colors"
                    />
                  </div>
                </div>

                {/* Phone */}
                <div>
                  <label className="block text-xs font-black uppercase tracking-wider text-[#030F40] mb-1">
                    WhatsApp / Phone Number <span className="text-[#FF9B04]">*</span>
                  </label>
                  <div className="relative">
                    <Phone size={16} className="absolute left-3 top-3 text-[#1E7DBB]" />
                    <input
                      type="tel"
                      name="phone"
                      value={formData.phone}
                      onChange={handleChange}
                      placeholder="+44 7123 456789"
                      required
                      className="w-full pl-9 pr-3 py-2.5 rounded-xl bg-[#F8FAFC] border border-slate-300 text-slate-900 text-sm font-semibold focus:outline-none focus:border-[#1E7DBB] focus:bg-white transition-colors"
                    />
                  </div>
                </div>
              </div>

              {/* Grade & Curriculum */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-black uppercase tracking-wider text-[#030F40] mb-1">
                    Grade / Year Group
                  </label>
                  <select
                    name="grade"
                    value={formData.grade}
                    onChange={handleChange}
                    className="w-full px-3 py-2.5 rounded-xl bg-[#F8FAFC] border border-slate-300 text-slate-900 text-sm font-bold focus:outline-none focus:border-[#1E7DBB] focus:bg-white transition-colors"
                  >
                    <option value="Primary / 11+">Primary / 11+ Entrance (Years 1-6)</option>
                    <option value="Key Stage 3">Key Stage 3 (Years 7-9)</option>
                    <option value="GCSE / Grade 9-10">GCSE / IGCSE (Years 10-11)</option>
                    <option value="A-Level / Grade 11-12">A-Level / AS & A2 (Years 12-13)</option>
                    <option value="IB Diploma">IB Diploma (MYP / DP)</option>
                    <option value="AP / College">AP / College Entrance</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-black uppercase tracking-wider text-[#030F40] mb-1">
                    Curriculum / Exam Board
                  </label>
                  <select
                    name="curriculum"
                    value={formData.curriculum}
                    onChange={handleChange}
                    className="w-full px-3 py-2.5 rounded-xl bg-[#F8FAFC] border border-slate-300 text-slate-900 text-sm font-bold focus:outline-none focus:border-[#1E7DBB] focus:bg-white transition-colors"
                  >
                    <option value="IB">IB (International Baccalaureate)</option>
                    <option value="GCSE / Edexcel">GCSE (Edexcel / Pearson)</option>
                    <option value="GCSE / AQA">GCSE (AQA Board)</option>
                    <option value="GCSE / OCR">GCSE (OCR Board)</option>
                    <option value="A-Level">A-Level (AS & A2)</option>
                    <option value="11+ Entrance">11+ Entrance (CEM / GL)</option>
                    <option value="ICSE">ICSE Board</option>
                    <option value="IGCSE">IGCSE (Cambridge / Edexcel)</option>
                    <option value="AP">AP (Advanced Placement)</option>
                    <option value="CBSE">CBSE Board</option>
                  </select>
                </div>
              </div>

              {/* Subject */}
              <div>
                <label className="block text-xs font-black uppercase tracking-wider text-[#030F40] mb-1">
                  Primary Subject Needing Support
                </label>
                <select
                  name="subject"
                  value={formData.subject}
                  onChange={handleChange}
                  className="w-full px-3 py-2.5 rounded-xl bg-[#F8FAFC] border border-slate-300 text-slate-900 text-sm font-bold focus:outline-none focus:border-[#1E7DBB] focus:bg-white transition-colors"
                >
                  <option value="Mathematics">Mathematics (AA / AI / Additional Math / Calculus)</option>
                  <option value="Physics">Physics</option>
                  <option value="Chemistry">Chemistry</option>
                  <option value="Biology">Biology</option>
                  <option value="English">English Literature & Language</option>
                  <option value="Computer Science">Computer Science & Programming</option>
                  <option value="Economics">Economics & Business</option>
                  <option value="Multiple Subjects">Multiple Subjects</option>
                </select>
              </div>

              {/* Submit Button */}
              <div className="pt-2">
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full py-3.5 rounded-xl bg-[#1E7DBB] hover:bg-[#030F40] text-white font-extrabold text-sm sm:text-base shadow-lg transition-all flex items-center justify-center gap-2"
                >
                  {isSubmitting ? (
                    <span>Booking your free class...</span>
                  ) : (
                    <>
                      <Calendar size={18} /> BOOK YOUR FREE DEMO CLASS NOW →
                    </>
                  )}
                </button>
                <p className="text-center text-[11px] text-slate-500 font-medium mt-2">
                  🔒 Zero spam guarantee. We respect your privacy. No credit card required.
                </p>
              </div>

            </form>
          )}
        </div>

      </div>
    </div>
  );
};
