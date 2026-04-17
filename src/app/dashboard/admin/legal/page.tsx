"use client";

import React, { useState, useEffect } from 'react';
import { DashboardLayout } from '@/components/layout/DashboardLayout';
import { FileText, Shield, Save, RefreshCw, Upload, ExternalLink, FileCheck, CheckCircle, Sparkles } from 'lucide-react';
import { useToast } from '@/context/ToastContext';
import api from '@/utils/api';
import { Button } from '@/components/ui/Button';

export default function AdminLegalPage() {
  const { showToast } = useToast();
  const [isSaving, setIsSaving] = useState(false);
  const [loading, setLoading] = useState(true);

  // Legal Docs State
  const [privacyContent, setPrivacyContent] = useState('');
  const [termsContent, setTermsContent] = useState('');
  const [privacyFile, setPrivacyFile] = useState<File | null>(null);
  const [termsFile, setTermsFile] = useState<File | null>(null);
  const [currentPrivacyFile, setCurrentPrivacyFile] = useState('');
  const [currentTermsFile, setCurrentTermsFile] = useState('');

  useEffect(() => {
    fetchSettings();
  }, []);

  const fetchSettings = async () => {
    try {
      const res = await api.get('/api/settings');
      if (res.data.success) {
        setPrivacyContent(res.data.data.privacyPolicy?.content || '');
        setTermsContent(res.data.data.termsAndConditions?.content || '');
        setCurrentPrivacyFile(res.data.data.privacyPolicy?.fileUrl || '');
        setCurrentTermsFile(res.data.data.termsAndConditions?.fileUrl || '');
      }
    } catch (error) {
      console.error("Error fetching settings:", error);
      showToast("Failed to load legal documents", "error");
    } finally {
      setLoading(false);
    }
  };

  const handleSave = async () => {
    setIsSaving(true);
    try {
      const formData = new FormData();
      formData.append('privacyContent', privacyContent);
      formData.append('termsContent', termsContent);
      if (privacyFile) formData.append('privacyFile', privacyFile);
      if (termsFile) formData.append('termsFile', termsFile);

      const res = await api.put('/api/settings', formData, {
        headers: { 'Content-Type': 'multipart/form-data' }
      });

      if (res.data.success) {
        showToast("Legal documents updated successfully!", "success");
        setCurrentPrivacyFile(res.data.data.privacyPolicy?.fileUrl || '');
        setCurrentTermsFile(res.data.data.termsAndConditions?.fileUrl || '');
        setPrivacyFile(null);
        setTermsFile(null);
      }
    } catch (error) {
      console.error("Error saving settings:", error);
      showToast("Failed to save legal documents", "error");
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <DashboardLayout>
      <div className="max-w-6xl mx-auto space-y-8 pb-24 md:pb-12">
        {/* Header Section */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 bg-white p-8 md:p-12 rounded-[3rem] shadow-2xl border border-gray-50 overflow-hidden relative">
          <div className="absolute top-0 right-0 w-32 h-32 bg-indigo-50 rounded-full -mr-16 -mt-16 opacity-50" />
          
          <div className="flex items-center gap-6 relative z-10">
            <div className="p-5 bg-indigo-500 rounded-[2rem] shadow-lg shadow-indigo-100 rotate-3">
              <FileText className="w-10 h-10 text-white" />
            </div>
            <div>
              <h1 className="text-3xl md:text-5xl font-black text-gray-800 tracking-tighter">
                Legal <span className="text-indigo-500">Center</span>
              </h1>
              <p className="text-gray-400 font-black mt-1 text-[10px] md:text-xs uppercase tracking-[0.3em] opacity-80">Compliance & Protection Management</p>
            </div>
          </div>

          <button 
            onClick={handleSave}
            disabled={isSaving}
            className="group bg-slate-900 hover:bg-indigo-600 outline-none text-white px-10 py-5 rounded-[2rem] font-black flex items-center justify-center gap-3 transition-all transform active:scale-95 shadow-2xl shadow-slate-200 disabled:opacity-70 w-full md:w-auto relative z-10"
          >
            {isSaving ? <RefreshCw className="w-6 h-6 animate-spin" /> : <Save className="w-6 h-6 group-hover:scale-110 transition-transform" />}
            <span className="text-lg tracking-tight uppercase">{isSaving ? 'Updating...' : 'Save Documents'}</span>
          </button>
        </div>

        {loading ? (
          <div className="h-96 flex flex-col items-center justify-center gap-4 bg-white rounded-[3rem] border-2 border-dashed border-gray-100">
            <RefreshCw className="w-12 h-12 text-indigo-500 animate-spin" />
            <p className="font-black text-gray-400 uppercase tracking-widest text-xs">Loading documents...</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 gap-10">
            {/* Privacy Policy Section */}
            <LegalSection title="Privacy Policy" icon={<FileText className="w-8 h-8 text-indigo-500" />}>
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                <div className="space-y-4">
                  <label className="block text-[11px] font-black text-gray-400 uppercase tracking-widest ml-1">Policy Content (Markdown)</label>
                  <textarea 
                    value={privacyContent}
                    onChange={(e) => setPrivacyContent(e.target.value)}
                    className="w-full px-6 py-5 rounded-[2rem] bg-gray-50 border-2 border-transparent focus:border-indigo-400 focus:bg-white transition-all outline-none font-medium text-sm md:text-base h-[30rem] text-gray-800 leading-relaxed shadow-inner"
                    placeholder="Paste your Privacy Policy here..."
                  />
                </div>
                <div className="space-y-8">
                   <div className="space-y-4">
                      <label className="block text-[11px] font-black text-gray-400 uppercase tracking-widest ml-1">Official PDF Document</label>
                      <div className={`relative border-2 border-dashed rounded-[2.5rem] p-12 transition-all text-center ${privacyFile ? 'border-indigo-400 bg-indigo-50/30 shadow-lg' : 'border-gray-200 bg-gray-50/50 hover:border-indigo-200'}`}>
                         <input 
                           type="file" 
                           accept=".pdf" 
                           onChange={(e) => setPrivacyFile(e.target.files?.[0] || null)}
                           className="absolute inset-0 opacity-0 cursor-pointer" 
                         />
                         <div className="flex flex-col items-center">
                            {privacyFile ? (
                              <>
                                <div className="w-16 h-16 bg-indigo-500 rounded-2xl flex items-center justify-center text-white mb-4 shadow-lg shadow-indigo-100">
                                   <FileCheck className="w-8 h-8" />
                                </div>
                                <span className="text-sm font-black text-indigo-700 truncate max-w-[250px]">{privacyFile.name}</span>
                                <button onClick={(e) => { e.stopPropagation(); setPrivacyFile(null); }} className="mt-3 text-[10px] font-black text-red-500 uppercase tracking-widest hover:underline bg-red-50 px-4 py-2 rounded-full">Remove File</button>
                              </>
                            ) : (
                              <>
                                <div className="w-16 h-16 bg-white rounded-2xl flex items-center justify-center text-gray-300 mb-4 shadow-sm">
                                   <Upload className="w-8 h-8" />
                                </div>
                                <span className="text-sm font-black text-gray-500">Drop PDF here or click to upload</span>
                                <span className="text-[10px] font-bold text-gray-300 mt-2 uppercase tracking-[0.2em]">Max file size: 4.5MB</span>
                              </>
                            )}
                         </div>
                      </div>
                   </div>

                   {currentPrivacyFile && (
                     <div className="p-8 bg-white rounded-[2.5rem] border border-gray-100 shadow-xl shadow-gray-100/50 flex items-center justify-between group">
                        <div className="flex items-center gap-5">
                           <div className="p-4 bg-indigo-50 rounded-2xl text-indigo-500 group-hover:scale-110 transition-transform">
                              <FileText size={24} />
                           </div>
                           <div>
                              <h4 className="text-md font-black text-gray-800">Live Privacy Policy</h4>
                              <p className="text-[10px] font-bold text-gray-400 uppercase flex items-center gap-1.5 mt-0.5">
                                 <CheckCircle size={10} className="text-green-500" /> Currently stored on cloud
                              </p>
                           </div>
                        </div>
                        <a href={currentPrivacyFile} target="_blank" rel="noopener noreferrer" className="p-4 bg-gray-50 rounded-2xl text-gray-400 hover:text-indigo-600 hover:bg-indigo-50 transition-all hover:shadow-md">
                           <ExternalLink size={20} />
                        </a>
                     </div>
                   )}
                   <div className="p-8 bg-indigo-50/50 rounded-[2.5rem] border border-indigo-100">
                      <h4 className="flex items-center gap-2 font-black text-indigo-900 text-sm mb-3">
                         <Sparkles size={16} /> Pro Tip
                      </h4>
                      <p className="text-xs font-bold text-indigo-700/70 leading-relaxed">
                         Keeping both the Markdown content and PDF document in sync ensures that users can read the policy directly on your website and also download an official copy for their records.
                      </p>
                   </div>
                </div>
              </div>
            </LegalSection>

            {/* Terms & Conditions Section */}
            <LegalSection title="Terms & Conditions" icon={<Shield className="w-8 h-8 text-amber-500" />}>
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                <div className="space-y-4">
                  <label className="block text-[11px] font-black text-gray-400 uppercase tracking-widest ml-1">Terms Content (Markdown)</label>
                  <textarea 
                    value={termsContent}
                    onChange={(e) => setTermsContent(e.target.value)}
                    className="w-full px-6 py-5 rounded-[2rem] bg-gray-50 border-2 border-transparent focus:border-amber-400 focus:bg-white transition-all outline-none font-medium text-sm md:text-base h-[30rem] text-gray-800 leading-relaxed shadow-inner"
                    placeholder="Paste your Terms and Conditions here..."
                  />
                </div>
                <div className="space-y-8">
                   <div className="space-y-4">
                      <label className="block text-[11px] font-black text-gray-400 uppercase tracking-widest ml-1">Official PDF Document</label>
                      <div className={`relative border-2 border-dashed rounded-[2.5rem] p-12 transition-all text-center ${termsFile ? 'border-amber-400 bg-amber-50/30 shadow-lg' : 'border-gray-200 bg-gray-50/50 hover:border-amber-200'}`}>
                         <input 
                           type="file" 
                           accept=".pdf" 
                           onChange={(e) => setTermsFile(e.target.files?.[0] || null)}
                           className="absolute inset-0 opacity-0 cursor-pointer" 
                         />
                         <div className="flex flex-col items-center">
                            {termsFile ? (
                              <>
                                <div className="w-16 h-16 bg-amber-500 rounded-2xl flex items-center justify-center text-white mb-4 shadow-lg shadow-amber-100">
                                   <FileCheck className="w-8 h-8" />
                                </div>
                                <span className="text-sm font-black text-amber-700 truncate max-w-[250px]">{termsFile.name}</span>
                                <button onClick={(e) => { e.stopPropagation(); setTermsFile(null); }} className="mt-3 text-[10px] font-black text-red-500 uppercase tracking-widest hover:underline bg-red-50 px-4 py-2 rounded-full">Remove File</button>
                              </>
                            ) : (
                              <>
                                <div className="w-16 h-16 bg-white rounded-2xl flex items-center justify-center text-gray-300 mb-4 shadow-sm">
                                   <Upload className="w-8 h-8" />
                                </div>
                                <span className="text-sm font-black text-gray-500">Drop PDF here or click to upload</span>
                                <span className="text-[10px] font-bold text-gray-300 mt-2 uppercase tracking-[0.2em]">Max file size: 4.5MB</span>
                              </>
                            )}
                         </div>
                      </div>
                   </div>

                   {currentTermsFile && (
                     <div className="p-8 bg-white rounded-[2.5rem] border border-gray-100 shadow-xl shadow-gray-100/50 flex items-center justify-between group">
                        <div className="flex items-center gap-5">
                           <div className="p-4 bg-amber-50 rounded-2xl text-amber-500 group-hover:scale-110 transition-transform">
                              <Shield size={24} />
                           </div>
                           <div>
                              <h4 className="text-md font-black text-gray-800">Live Terms & Conditions</h4>
                              <p className="text-[10px] font-bold text-gray-400 uppercase flex items-center gap-1.5 mt-0.5">
                                 <CheckCircle size={10} className="text-green-500" /> Currently stored on cloud
                              </p>
                           </div>
                        </div>
                        <a href={currentTermsFile} target="_blank" rel="noopener noreferrer" className="p-4 bg-gray-50 rounded-2xl text-gray-400 hover:text-amber-600 hover:bg-amber-50 transition-all hover:shadow-md">
                           <ExternalLink size={20} />
                        </a>
                     </div>
                   )}
                </div>
              </div>
            </LegalSection>
          </div>
        )}
      </div>
    </DashboardLayout>
  );
}

function LegalSection({ title, icon, children }: { title: string, icon: React.ReactNode, children: React.ReactNode }) {
  return (
    <div className="bg-white rounded-[3.5rem] shadow-2xl border border-gray-50 p-8 md:p-12 transform transition-all hover:shadow-indigo-100/20 overflow-hidden relative">
      <div className="flex items-center gap-6 mb-10 pb-8 border-b border-gray-50">
        <div className="p-4 bg-gray-50 rounded-[1.5rem]">
          {icon}
        </div>
        <h2 className="text-2xl md:text-4xl font-black text-gray-800 tracking-tight">{title}</h2>
      </div>
      {children}
    </div>
  );
}
