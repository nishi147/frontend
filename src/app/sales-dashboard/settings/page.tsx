"use client";
import React from 'react';
import { DashboardLayout } from '@/components/layout/DashboardLayout';
import { useAuth } from '@/context/AuthContext';
import { Settings, User, Shield, Bell, Zap } from 'lucide-react';

export default function SalesSettings() {
  const { user } = useAuth();

  return (
    <DashboardLayout allowedRoles={['sales', 'admin']}>
      <div className="max-w-4xl mx-auto space-y-12 animate-in fade-in slide-in-from-bottom-4 duration-700">
        <div>
           <h1 className="text-5xl font-black text-gray-800 tracking-tighter mb-2">Sales <span className="text-primary-500">Settings</span> ⚙️</h1>
           <p className="text-gray-400 font-bold text-lg">Manage your counsellor profile and platform preferences.</p>
        </div>

        <div className="grid grid-cols-1 gap-8">
           <div className="bg-white p-10 rounded-[3rem] shadow-xl border-2 border-gray-50 space-y-8">
              <div className="flex items-center gap-6">
                 <div className="w-20 h-20 rounded-[2rem] bg-primary-100 flex items-center justify-center text-primary-600 text-3xl font-black shadow-inner">
                    {user?.name?.[0]}
                 </div>
                 <div>
                    <h2 className="text-3xl font-black text-gray-800 tracking-tight">{user?.name}</h2>
                    <span className="px-4 py-1.5 bg-primary-50 text-primary-600 rounded-xl text-[10px] font-black uppercase tracking-widest border border-primary-100 italic">Official Counsellor</span>
                 </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-8 border-t border-gray-50">
                 <div className="space-y-2">
                    <label className="text-[10px] font-black uppercase text-gray-400 tracking-widest ml-4">Email Address</label>
                    <div className="p-5 rounded-2xl bg-gray-50 border-2 border-transparent font-bold text-gray-400 select-none">
                       {user?.email}
                    </div>
                 </div>
                 <div className="space-y-2">
                    <label className="text-[10px] font-black uppercase text-gray-400 tracking-widest ml-4">Referral Code</label>
                    <div className="p-5 rounded-2xl bg-primary-50 border-2 border-primary-100 font-black text-primary-600 uppercase tracking-widest flex items-center justify-between">
                       {user?.referralCode || 'NOT_ASSIGNED'}
                       <Zap size={16} className="text-primary-400" />
                    </div>
                 </div>
              </div>
           </div>

           <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {[
                { icon: Bell, label: 'Notifications', desc: 'Manage lead alerts' },
                { icon: Shield, label: 'Security', desc: 'Privacy & access' },
                { icon: User, label: 'Bio', desc: 'Public profile info' }
              ].map((item, i) => (
                <div key={i} className="bg-white p-8 rounded-[2.5rem] shadow-lg border-2 border-gray-50 hover:border-primary-200 transition-all cursor-not-allowed group">
                   <div className="w-12 h-12 rounded-2xl bg-gray-50 flex items-center justify-center text-gray-400 mb-4 group-hover:bg-primary-50 group-hover:text-primary-500 transition-all">
                      <item.icon size={24} />
                   </div>
                   <h3 className="text-lg font-black text-gray-800 mb-1">{item.label}</h3>
                   <p className="text-xs font-bold text-gray-400">{item.desc}</p>
                </div>
              ))}
           </div>
        </div>
      </div>
    </DashboardLayout>
  );
}
