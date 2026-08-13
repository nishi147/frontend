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
    <div className="fixed inset-0 z-[200] flex items-center justify-center p-4 bg-[#0c142a]/90 backdrop-blur-md animate-fade-in overflow-y-auto">
      <div className="relative w-full max-w-2xl bg-[#0c142a] rounded-3xl shadow-2xl border border-[#1ad8ea]/30 overflow-hidden my-8 text-slate-100">
        
        {/* Top Header with AI Venture Lab Gradient (#2363f1 -> #1ad8ea) */}
        <div className="bg-gradient-to-r from-[#0c142a] via-[#1e2842] to-[#0c142a] border-b border-[#1ad8ea]/20 p-6 md:p-8 relative">
          <button
            onClick={resetAndClose}
            className="absolute top-4 right-4 w-9 h-9 rounded-full bg-[#1e2842] hover:bg-[#2363f1] border border-[#1ad8ea]/30 flex items-center justify-center text-white transition-all"
            aria-label="Close"
          >
            <X size={20} />
          </button>

          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#1e2842] border border-[#1ad8ea]/30 text-xs font-black text-[#1ad8ea] uppercase tracking-wider mb-3">
            <Sparkles size={14} className="text-[#f9be3e]" /> 100% Free • No Credit Card Required
          </div>

          <h3 className="text-2xl md:text-3xl font-black text-white tracking-tight leading-tight">
            Book Your Child's Free 1-to-1 Demo Class
          </h3>
          <p className="text-slate-300 text-xs md:text-sm font-medium mt-1">
            Meet an expert tutor, get an academic diagnostic assessment, and build a tailored learning path.
          </p>

          <div className="mt-4 flex flex-wrap items-center gap-3">
            <TrustpilotBadge variant="dark" />
            <span className="text-[11px] font-bold text-[#1ad8ea] flex items-center gap-1">
              <ShieldCheck size={14} className="text-[#1ad8ea]" /> Top 1% Verified Tutors
            </span>
          </div>
        </div>

        {/* Form Body or Success View */}
        <div className="p-6 md:p-8 bg-[#0c142a]">
          {isSubmitted ? (
            <div className="text-center py-8 space-y-5">
              <div className="w-16 h-16 bg-[#1ad8ea]/10 border border-[#1ad8ea]/30 text-[#1ad8ea] rounded-full flex items-center justify-center mx-auto animate-bounce">
                <CheckCircle size={36} />
              </div>
              <h4 className="text-2xl font-black text-white">Your Free Demo is Reserved! 🎉</h4>
              <p className="text-slate-300 text-sm max-w-md mx-auto font-medium">
                Thank you, <span className="font-bold text-[#f9be3e]">{formData.parentName}</span>! Our Academic Coordinator is matching <span className="font-bold text-[#1ad8ea]">{formData.studentName}</span> with the perfect {formData.curriculum} tutor.
              </p>
              <div className="bg-[#1e2842]/90 p-4 rounded-2xl border border-[#1ad8ea]/20 text-xs text-slate-300 max-w-md mx-auto text-left space-y-2">
                <div className="flex items-center gap-2 font-bold text-[#1ad8ea]">
                  <Clock size={14} className="text-[#f9be3e]" /> What happens next?
                </div>
                <p>1. We will reach out on WhatsApp/Call ({formData.phone}) within 2 hours to confirm your convenient time slot.</p>
                <p>2. You'll receive a 1-to-1 Zoom link & personalized pre-lesson diagnostic sheet.</p>
              </div>
              <button
                onClick={resetAndClose}
                className="px-8 py-3 rounded-full bg-gradient-to-r from-[#2363f1] to-[#1ad8ea] text-[#0c142a] font-black text-sm hover:opacity-90 transition-all shadow-md"
              >
                Back to Ruzann Academic
              </button>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                
                {/* Parent Name */}
                <div>
                  <label className="block text-xs font-black uppercase tracking-wider text-slate-300 mb-1">
                    Parent's Full Name <span className="text-[#f9be3e]">*</span>
                  </label>
                  <div className="relative">
                    <User size={16} className="absolute left-3 top-3 text-[#1ad8ea]" />
                    <input
                      type="text"
                      name="parentName"
                      value={formData.parentName}
                      onChange={handleChange}
                      placeholder="e.g. Sarah Jenkins"
                      required
                      className="w-full pl-9 pr-3 py-2.5 rounded-xl bg-[#1e2842] border border-slate-700 text-white text-sm font-semibold focus:outline-none focus:border-[#1ad8ea]"
                    />
                  </div>
                </div>

                {/* Student Name */}
                <div>
                  <label className="block text-xs font-black uppercase tracking-wider text-slate-300 mb-1">
                    Student's Name <span className="text-[#f9be3e]">*</span>
                  </label>
                  <div className="relative">
                    <User size={16} className="absolute left-3 top-3 text-[#1ad8ea]" />
                    <input
                      type="text"
                      name="studentName"
                      value={formData.studentName}
                      onChange={handleChange}
                      placeholder="e.g. Alex Jenkins"
                      required
                      className="w-full pl-9 pr-3 py-2.5 rounded-xl bg-[#1e2842] border border-slate-700 text-white text-sm font-semibold focus:outline-none focus:border-[#1ad8ea]"
                    />
                  </div>
                </div>

                {/* Email */}
                <div>
                  <label className="block text-xs font-black uppercase tracking-wider text-slate-300 mb-1">
                    Email Address <span className="text-[#f9be3e]">*</span>
                  </label>
                  <div className="relative">
                    <Mail size={16} className="absolute left-3 top-3 text-[#1ad8ea]" />
                    <input
                      type="email"
                      name="email"
                      value={formData.email}
                      onChange={handleChange}
                      placeholder="sarah@example.com"
                      required
                      className="w-full pl-9 pr-3 py-2.5 rounded-xl bg-[#1e2842] border border-slate-700 text-white text-sm font-semibold focus:outline-none focus:border-[#1ad8ea]"
                    />
                  </div>
                </div>

                {/* Phone */}
                <div>
                  <label className="block text-xs font-black uppercase tracking-wider text-slate-300 mb-1">
                    WhatsApp / Phone Number <span className="text-[#f9be3e]">*</span>
                  </label>
                  <div className="relative">
                    <Phone size={16} className="absolute left-3 top-3 text-[#1ad8ea]" />
                    <input
                      type="tel"
                      name="phone"
                      value={formData.phone}
                      onChange={handleChange}
                      placeholder="+1 (555) 000-0000"
                      required
                      className="w-full pl-9 pr-3 py-2.5 rounded-xl bg-[#1e2842] border border-slate-700 text-white text-sm font-semibold focus:outline-none focus:border-[#1ad8ea]"
                    />
                  </div>
                </div>

                {/* Curriculum */}
                <div>
                  <label className="block text-xs font-black uppercase tracking-wider text-slate-300 mb-1">
                    Target Curriculum <span className="text-[#f9be3e]">*</span>
                  </label>
                  <select
                    name="curriculum"
                    value={formData.curriculum}
                    onChange={handleChange}
                    className="w-full px-3 py-2.5 rounded-xl bg-[#1e2842] border border-slate-700 text-white text-sm font-bold focus:outline-none focus:border-[#1ad8ea]"
                  >
                    <option value="IB">IB (International Baccalaureate)</option>
                    <option value="ICSE">ICSE (Indian Certificate of Secondary Education)</option>
                    <option value="IGCSE">IGCSE (Cambridge / Edexcel)</option>
                    <option value="A-Level">A-Level / AS Level</option>
                    <option value="AP">AP (Advanced Placement)</option>
                    <option value="CBSE">CBSE (Central Board)</option>
                    <option value="Languages">Languages (Arabic, English, French, Spanish)</option>
                    <option value="Other">Other International Curriculum</option>
                  </select>
                </div>

                {/* Grade Level */}
                <div>
                  <label className="block text-xs font-black uppercase tracking-wider text-slate-300 mb-1">
                    Student's Grade Level
                  </label>
                  <select
                    name="grade"
                    value={formData.grade}
                    onChange={handleChange}
                    className="w-full px-3 py-2.5 rounded-xl bg-[#1e2842] border border-slate-700 text-white text-sm font-bold focus:outline-none focus:border-[#1ad8ea]"
                  >
                    <option value="Grade 1-5">Primary (Grades 1-5)</option>
                    <option value="Grade 6-8">Middle School (Grades 6-8)</option>
                    <option value="Grade 9-10">High School / IGCSE / MYP (Grades 9-10)</option>
                    <option value="Grade 11-12">Senior / IB DP / A-Level / AP (Grades 11-12)</option>
                  </select>
                </div>

              </div>

              {/* Subject */}
              <div>
                <label className="block text-xs font-black uppercase tracking-wider text-slate-300 mb-1">
                  Primary Subject Needing Support
                </label>
                <select
                  name="subject"
                  value={formData.subject}
                  onChange={handleChange}
                  className="w-full px-3 py-2.5 rounded-xl bg-[#1e2842] border border-slate-700 text-white text-sm font-bold focus:outline-none focus:border-[#1ad8ea]"
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
                  className="w-full py-4 rounded-2xl bg-gradient-to-r from-[#2363f1] to-[#1ad8ea] hover:from-[#1ad8ea] hover:to-[#2363f1] text-[#0c142a] font-black text-base shadow-[0_10px_30px_-10px_rgba(35,99,241,0.6)] hover:shadow-[0_15px_35px_-5px_rgba(26,216,234,0.7)] transition-all flex items-center justify-center gap-2"
                >
                  {isSubmitting ? (
                    <span>Booking your free class...</span>
                  ) : (
                    <>
                      <Calendar size={18} /> BOOK YOUR FREE DEMO CLASS NOW →
                    </>
                  )}
                </button>
                <p className="text-center text-[11px] text-slate-400 font-medium mt-2">
                  🔒 Zero spam guarantee. We respect your privacy. No payment required.
                </p>
              </div>

            </form>
          )}
        </div>

      </div>
    </div>
  );
};
