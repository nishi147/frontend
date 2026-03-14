"use client";

import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/Card';
import { DashboardLayout } from '@/components/layout/DashboardLayout';
import { Settings, Globe, Shield, Palette, Mail, MessageSquare, CreditCard, Save, RefreshCw } from 'lucide-react';

export default function AdminSettings() {
  const [activeTab, setActiveTab] = useState('general');
  const [isSaving, setIsSaving] = useState(false);

  const handleSave = () => {
    setIsSaving(true);
    setTimeout(() => setIsSaving(false), 1500);
  };

  const tabs = [
    { id: 'general', name: 'General', icon: Globe },
    { id: 'security', name: 'Security', icon: Shield },
    { id: 'communication', name: 'Communication', icon: Mail },
    { id: 'payments', name: 'Payments', icon: CreditCard },
  ];

  return (
    <DashboardLayout>
      <div className="max-w-6xl mx-auto space-y-6 md:space-y-10 pb-24 md:pb-12 px-1 sm:px-2">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 bg-white p-6 md:p-10 rounded-[2.5rem] shadow-2xl border border-gray-50 overflow-hidden relative">
          <div className="absolute top-0 right-0 w-32 h-32 bg-primary-50 rounded-full -mr-16 -mt-16 opacity-50" />
          
          <div className="flex items-center gap-5 relative z-10">
            <div className="p-4 bg-primary-500 rounded-3xl shadow-lg shadow-primary-100">
              <Settings className="w-8 h-8 text-white animate-[spin_4s_linear_infinite]" />
            </div>
            <div>
              <h1 className="text-3xl md:text-5xl font-black text-gray-800 tracking-tighter">
                System <span className="text-primary-500">Settings</span>
              </h1>
              <p className="text-gray-400 font-black mt-1 text-[10px] md:text-xs uppercase tracking-[0.3em] opacity-80">Global Platform Control Center</p>
            </div>
          </div>

          <button 
            onClick={handleSave}
            disabled={isSaving}
            className="group bg-slate-900 hover:bg-primary-600 outline-none text-white px-10 py-5 rounded-3xl font-black flex items-center justify-center gap-3 transition-all transform active:scale-95 shadow-2xl shadow-slate-200 disabled:opacity-70 w-full md:w-auto relative z-10"
          >
            {isSaving ? <RefreshCw className="w-6 h-6 animate-spin" /> : <Save className="w-6 h-6 group-hover:scale-110 transition-transform" />}
            <span className="text-lg tracking-tight">{isSaving ? 'SYNCING...' : 'SAVE CHANGES'}</span>
          </button>
        </div>

        <div className="flex flex-col lg:flex-row gap-8">
          {/* Navigation Tabs */}
          <nav className="lg:w-72 flex flex-row lg:flex-col gap-2 overflow-x-auto lg:overflow-visible pb-4 lg:pb-0 scrollbar-hide -mx-2 px-2 md:mx-0 md:px-0">
            {tabs.map((tab) => {
              const Icon = tab.icon;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`flex items-center gap-3 px-6 py-4.5 rounded-3xl font-black transition-all whitespace-nowrap flex-1 lg:flex-none text-xs md:text-sm border-2 transform hover:translate-x-1 duration-300 ${
                    activeTab === tab.id 
                      ? 'bg-primary-500 text-white border-primary-500 shadow-xl shadow-primary-100 translate-x-1' 
                      : 'bg-white text-gray-400 border-gray-50 hover:border-primary-100 hover:text-gray-600'
                  }`}
                >
                  <div className={`p-2 rounded-xl ${activeTab === tab.id ? 'bg-white/20' : 'bg-gray-50'}`}>
                    <Icon className="w-4 h-4 md:w-5 md:h-5" />
                  </div>
                  {tab.name}
                </button>
              );
            })}
          </nav>

        {/* Settings Content */}
        <div className="flex-1 space-y-6 md:space-y-8">
          {activeTab === 'general' && (
            <div className="space-y-4 md:space-y-6 animate-in zoom-in-95 duration-500">
              <SettingsSection title="Identity" icon={<Globe className="w-6 h-6 text-primary-500" />}>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6">
                  <InputGroup label="Platform Name" placeholder="Ruzann Academy" />
                  <InputGroup label="Support Phone" placeholder="+91 91XXXXXX10" />
                  <div className="md:col-span-2">
                    <InputGroup label="Meta Title" placeholder="Learn Skills That Actually Matter" />
                  </div>
                  <div className="md:col-span-2">
                    <label className="block text-[10px] md:text-xs font-black text-gray-400 uppercase tracking-[0.2em] mb-3 px-1">SEO Description</label>
                    <textarea 
                      className="w-full px-5 md:px-6 py-4 rounded-2xl bg-gray-50 border-2 border-transparent focus:border-primary-400 focus:bg-white transition-all outline-none font-bold text-sm md:text-base h-24 md:h-32 text-gray-800"
                      placeholder="Explain what your platform does..."
                    />
                  </div>
                </div>
              </SettingsSection>

              <SettingsSection title="Global" icon={<Settings className="w-6 h-6 text-secondary-500" />}>
                <div className="grid grid-cols-1 gap-3 md:gap-4">
                  <ToggleItem title="Maintenance Mode" description="Lock system for admins only." />
                  <ToggleItem title="Workshop Public Flow" description="Enroll without logging in first." defaultChecked />
                  <ToggleItem title="Auto-Verification" description="Instant student onboarding." />
                </div>
              </SettingsSection>
            </div>
          )}

          {activeTab === 'security' && (
            <div className="space-y-4 md:space-y-6 animate-in zoom-in-95 duration-500">
              <SettingsSection title="Access" icon={<Shield className="w-6 h-6 text-red-500" />}>
                <div className="grid grid-cols-1 gap-3 md:gap-4">
                  <ToggleItem title="Master 2FA" description="Force 2FA for all root accounts." defaultChecked />
                  <ToggleItem title="Strict Policy" description="Enforce symbols & 12+ chars." />
                  <InputGroup label="Session TTL (Min)" placeholder="60" type="number" />
                </div>
              </SettingsSection>

              <SettingsSection title="Network" icon={<Globe className="w-6 h-6 text-gray-500" />}>
                 <div className="space-y-4">
                    <label className="block text-[10px] md:text-xs font-black text-gray-400 uppercase tracking-[0.2em] mb-3 px-1">Safe IP List</label>
                    <textarea 
                      className="w-full px-5 md:px-6 py-4 rounded-2xl bg-gray-50 border-2 border-transparent focus:border-red-400 focus:bg-white transition-all outline-none font-mono text-xs h-24 md:h-32 text-gray-800"
                      placeholder="127.0.0.1"
                    />
                    <ToggleItem title="Anti-VPN" description="Detect and block proxy traffic." />
                 </div>
              </SettingsSection>
            </div>
          )}

          {activeTab === 'communication' && (
            <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
              <SettingsSection title="Email Provider (SMTP)" icon={<Mail className="w-6 h-6 text-blue-500" />}>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <InputGroup label="SMTP Host" placeholder="smtp.gmail.com" />
                  <InputGroup label="SMTP Port" placeholder="587" />
                  <InputGroup label="Username" placeholder="notifications@ruzann.com" />
                  <InputGroup label="Password" placeholder="••••••••••••" type="password" />
                </div>
              </SettingsSection>

              <SettingsSection title="SMS Integration" icon={<MessageSquare className="w-6 h-6 text-green-500" />}>
                 <div className="space-y-6">
                    <select className="w-full px-6 py-4 rounded-2xl bg-gray-50 border-2 border-transparent focus:border-green-400 focus:bg-white transition-all outline-none font-black text-gray-700">
                      <option>Select Provider: Msg91 (Default)</option>
                      <option>Twilio</option>
                      <option>Gupshup</option>
                    </select>
                    <InputGroup label="Auth Key / API Key" placeholder="AXXXXXXXXX7878" />
                 </div>
              </SettingsSection>
            </div>
          )}

          {activeTab === 'payments' && (
             <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
                <SettingsSection title="Razorpay Integration" icon={<CreditCard className="w-6 h-6 text-primary-500" />}>
                  <div className="space-y-6">
                    <ToggleItem title="Enable Live Payments" description="Connect to Razorpay production environment." defaultChecked />
                    <InputGroup label="Key ID" placeholder="rzp_live_XXXXXXXX" />
                    <InputGroup label="Secret Key" placeholder="••••••••••••" type="password" />
                  </div>
                </SettingsSection>

                <SettingsSection title="Currency & Invoicing" icon={<CreditCard className="w-6 h-6 text-gray-500" />}>
                   <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <InputGroup label="Primary Currency" placeholder="INR (₹)" />
                    <InputGroup label="GSTIN (Optional)" placeholder="XXXXXXXXXXX" />
                   </div>
                </SettingsSection>
              </div>
            )}
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}

function SettingsSection({ title, icon, children }: { title: string, icon: React.ReactNode, children: React.ReactNode }) {
  return (
    <div className="bg-white rounded-[2.5rem] shadow-2xl border border-gray-50 p-6 md:p-12 transform transition-all hover:shadow-primary-100/20">
      <div className="flex items-center gap-5 mb-8 md:mb-10">
        <div className="p-3 bg-gray-50 rounded-2xl">
          {icon}
        </div>
        <h2 className="text-2xl md:text-3xl font-black text-gray-800 tracking-tight">{title}</h2>
      </div>
      {children}
    </div>
  );
}

function InputGroup({ label, placeholder, type = "text" }: { label: string, placeholder: string, type?: string }) {
  return (
    <div className="space-y-2">
      <label className="block text-[10px] md:text-xs font-black text-gray-400 uppercase tracking-[0.2em] mb-1 px-3 underline decoration-primary-200 decoration-4 underline-offset-4">{label}</label>
      <input 
        type={type}
        className="w-full px-6 py-4.5 rounded-2xl bg-gray-50 border-2 border-transparent focus:border-primary-400 focus:bg-white transition-all outline-none font-black text-sm md:text-base text-gray-700 placeholder:text-gray-300 shadow-inner"
        placeholder={placeholder}
      />
    </div>
  );
}

function ToggleItem({ title, description, defaultChecked = false }: { title: string, description: string, defaultChecked?: boolean }) {
  const [checked, setChecked] = useState(defaultChecked);
  return (
    <div 
      onClick={() => setChecked(!checked)}
      className={`flex items-center justify-between p-6 md:p-8 rounded-3xl border-2 transition-all cursor-pointer group ${checked ? 'bg-primary-50/30 border-primary-100 shadow-lg shadow-primary-50/50' : 'bg-gray-50/50 border-transparent hover:border-gray-100'}`}
    >
      <div className="pr-6">
        <h4 className={`font-black tracking-tight transition-colors text-sm md:text-lg ${checked ? 'text-primary-600' : 'text-gray-800'}`}>{title}</h4>
        <p className="text-[10px] md:text-sm text-gray-400 font-bold opacity-80 leading-relaxed mt-1">{description}</p>
      </div>
      <div className={`w-14 h-8 md:w-16 md:h-9 rounded-full p-1.5 transition-all duration-500 flex-shrink-0 relative ${checked ? 'bg-primary-500 shadow-lg shadow-primary-200' : 'bg-gray-200'}`}>
        <div className={`w-5 h-5 md:w-6 md:h-6 bg-white rounded-full shadow-xl transform transition-all duration-500 ${checked ? 'translate-x-6 md:translate-x-7' : 'translate-x-0'}`} />
      </div>
    </div>
  );
}
