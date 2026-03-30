"use client";
import React, { useState, useEffect } from 'react';
import api from '@/utils/api';
import { Users, Gift, CheckCircle, Clock, Share2, Award, Copy, Check } from 'lucide-react';
import { useAuth } from '@/context/AuthContext';

export default function ReferralsPage() {
  const { user } = useAuth();
  const [stats, setStats] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [copied, setCopied] = useState(false);

  const fetchReferrals = async () => {
    try {
      setLoading(true);
      const endpoint = user?.role === 'admin' ? '/api/referrals' : '/api/referrals/me';
      const res = await api.get(endpoint);
      setStats(res.data.data);
    } catch (err) {
      console.error("Error fetching referrals:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchReferrals();
  }, [user]);

  const copyToClipboard = () => {
    const code = stats?.referralCode || user?.referralCode;
    if (code && code !== 'ADMIN-GLOBAL') {
      navigator.clipboard.writeText(code);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  const StatCard = ({ title, value, icon: Icon, color }: any) => (
    <div className="bg-white p-6 rounded-[2rem] shadow-xl shadow-gray-100 border-2 border-gray-50 flex items-center gap-6">
      <div className={`p-4 rounded-2xl ${color} bg-opacity-10 text-${color.split('-')[1]}-600`}>
         <Icon size={28} strokeWidth={3} />
      </div>
      <div>
         <p className="text-gray-400 text-[10px] font-black uppercase tracking-widest mb-1">{title}</p>
         <h3 className="text-3xl font-black text-gray-800 tracking-tighter">{value}</h3>
      </div>
    </div>
  );

  return (
    <div className="max-w-7xl mx-auto space-y-12 animate-in fade-in duration-700">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
        <div className="space-y-2">
          <h1 className="text-5xl font-black text-gray-800 tracking-tighter">Referral <span className="text-secondary-500">Program</span></h1>
          <p className="text-gray-500 font-bold text-lg">Track your influence and rewards for bringing new explorers to Ruzann.</p>
        </div>

        {/* My Referral Code */}
        <div className="bg-gradient-to-br from-secondary-500 to-secondary-600 p-1 rounded-[2rem] shadow-2xl shadow-secondary-100">
          <div className="bg-white px-6 py-4 rounded-[1.8rem] flex items-center gap-4">
             <div className="flex flex-col">
                <span className="text-[10px] font-black text-secondary-500 uppercase tracking-widest">Your Code</span>
                <span className="text-2xl font-black text-gray-800 tracking-wider font-mono">{stats?.referralCode || user?.referralCode || 'N/A'}</span>
             </div>
             <button 
               onClick={copyToClipboard}
               className="p-3 bg-secondary-50 rounded-2xl text-secondary-600 hover:bg-secondary-500 hover:text-white transition-all group active:scale-95"
             >
                {copied ? <Check size={20} strokeWidth={3} /> : <Copy size={20} strokeWidth={3} className="group-hover:rotate-12 transition-transform" />}
             </button>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        <StatCard title="Total Referrals" value={stats?.totalReferrals || 0} icon={Share2} color="bg-secondary-500" />
        <StatCard title="Successful Conversions" value={stats?.conversions || 0} icon={Award} color="bg-green-500" />
        <StatCard title="Total Rewards (₹)" value={`₹${stats?.rewards || 0}`} icon={Gift} color="bg-primary-500" />
      </div>

      <div className="bg-white rounded-[2.5rem] shadow-2xl shadow-gray-50 border-2 border-gray-50 overflow-hidden">
        <div className="px-8 py-8 border-b-2 border-gray-50 flex items-center gap-4">
           <div className="w-10 h-10 rounded-xl bg-secondary-500 text-white flex items-center justify-center">
              <Users size={20} />
           </div>
           <h2 className="text-2xl font-black text-gray-800 tracking-tight">Referral History</h2>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-left font-bold">
            <thead className="bg-gray-50/50 uppercase text-[10px] tracking-widest font-black text-gray-400">
              <tr>
                <th className="px-8 py-5 italic">#ID</th>
                <th className="px-8 py-5">Referred Lead</th>
                <th className="px-8 py-5">Date</th>
                <th className="px-8 py-5">Status</th>
                <th className="px-8 py-5 text-right">Reward</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50 text-gray-600">
              {loading ? (
                <tr><td colSpan={5} className="text-center py-20 animate-pulse">Scanning the stars...</td></tr>
              ) : (!stats?.history || stats.history.length === 0) ? (
                <tr><td colSpan={5} className="text-center py-20 uppercase text-xs tracking-widest text-gray-400">No referrals found yet. Share your code!</td></tr>
              ) : stats.history.map((ref: any, index: number) => (
                <tr key={ref._id} className="hover:bg-gray-50 transition-colors">
                  <td className="px-8 py-5 text-[10px] text-gray-300">00{index + 1}</td>
                  <td className="px-8 py-5 font-black text-gray-800">{ref.referredLead?.name || 'Anonymous User'}</td>
                  <td className="px-8 py-5 text-sm">{new Date(ref.createdAt).toLocaleDateString()}</td>
                  <td className="px-8 py-5">
                    <span className={`px-4 py-1.5 rounded-xl text-[10px] font-black uppercase tracking-widest flex items-center gap-2 w-fit ${
                      ref.status === 'Successful' ? 'bg-green-50 text-green-600' : 'bg-orange-50 text-orange-600'
                    }`}>
                      {ref.status === 'Successful' ? <CheckCircle size={12} /> : <Clock size={12} />}
                      {ref.status}
                    </span>
                  </td>
                  <td className="px-8 py-5 text-right font-black text-secondary-500">{ref.reward || 'Pending Conversion'}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
