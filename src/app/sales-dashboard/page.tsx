"use client";
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { LeadsTable } from '@/components/sales/LeadsTable';
import { Users, Target, TrendingUp, DollarSign, ArrowUpRight, Clock, Star, MessageSquare, Bell } from 'lucide-react';

export default function SalesDashboard() {
  const [stats, setStats] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const res = await axios.get('/api/analytics/sales');
        setStats(res.data.data);
      } catch (err) {
        console.error("Error fetching sales stats:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchStats();
  }, []);

  const StatCard = ({ title, value, icon: Icon, color, trend }: any) => (
    <div className="bg-white p-8 rounded-[2.5rem] shadow-xl shadow-gray-100 border-2 border-gray-50 group hover:-translate-y-2 transition-all duration-500">
      <div className="flex justify-between items-start mb-6">
        <div className={`p-4 rounded-3xl ${color} bg-opacity-10 shadow-inner group-hover:scale-110 transition-transform`}>
           <Icon className={`w-8 h-8 ${color.replace('bg-', 'text-')}`} strokeWidth={3} />
        </div>
        <div className="flex items-center gap-1 px-3 py-1 bg-green-50 text-green-600 rounded-full text-[10px] font-black uppercase tracking-widest">
           <ArrowUpRight size={12} strokeWidth={3} /> {trend || 'Stable'}
        </div>
      </div>
      <div className="flex flex-col">
        <span className="text-gray-400 text-[11px] font-black uppercase tracking-[0.2em] mb-1">{title}</span>
        <span className="text-4xl font-black text-gray-800 tracking-tighter tabular-nums mb-2">
          {typeof value === 'number' && title.includes('Revenue') ? `₹${value.toLocaleString()}` : value || 0}
          {title.includes('Rate') && '%'}
        </span>
        <div className="w-full h-1.5 bg-gray-50 rounded-full overflow-hidden mt-2">
           <div className={`h-full ${color} rounded-full transition-all duration-1000`} style={{ width: '65%' }} />
        </div>
      </div>
    </div>
  );

  return (
    <div className="max-w-[1600px] mx-auto space-y-12 animate-in fade-in slide-in-from-bottom-5 duration-700">
      {/* Header Section */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
        <div className="space-y-2">
          <div className="flex items-center gap-3 mb-2">
             <span className="px-4 py-1.5 bg-primary-100 text-primary-600 rounded-full text-[10px] font-black uppercase tracking-[0.2em] shadow-sm">
                Sales Control Center
             </span>
             <span className="flex items-center gap-2 text-xs font-bold text-gray-400">
                <Clock size={14} /> Updated just now
             </span>
          </div>
          <h1 className="text-5xl md:text-6xl font-black text-gray-800 tracking-tighter leading-tight">
             Leads <span className="text-primary-500">Dashboard</span>
          </h1>
          <p className="text-gray-500 font-bold text-lg max-w-2xl leading-relaxed">
             Track your sales pipeline, manage potential students, and monitor your performance targets in real-time.
          </p>
        </div>
        
        <div className="flex gap-4">
           <button className="px-8 py-5 bg-white border-2 border-gray-100 rounded-[2rem] font-black text-gray-400 hover:text-primary-500 hover:border-primary-100 hover:shadow-xl transition-all flex items-center gap-3 uppercase text-xs tracking-widest active:scale-95">
              <Star size={18} fill="currentColor" /> Premium Features
           </button>
        </div>
      </div>

      {/* Analytics Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
        <StatCard 
          title="Total Potential Leads" 
          value={stats?.totalLeads} 
          icon={Users} 
          color="bg-primary-500" 
          trend="+12.5%" 
        />
        <StatCard 
          title="Successfully Converted" 
          value={stats?.convertedLeads} 
          icon={Target} 
          color="bg-green-500" 
          trend="+8.2%" 
        />
        <StatCard 
          title="Conversion Rate" 
          value={stats?.conversionRate?.toFixed(1)} 
          icon={TrendingUp} 
          color="bg-secondary-500" 
          trend="+2.1%" 
        />
        <StatCard 
          title="Total Revenue Generated" 
          value={stats?.totalRevenue} 
          icon={DollarSign} 
          color="bg-purple-500" 
          trend="+15.0%" 
        />
      </div>

      {/* Secondary Dashboard Stats */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
         <div className="lg:col-span-2 bg-white p-8 rounded-[2.5rem] shadow-xl border-2 border-gray-50">
            <h2 className="text-xl font-black text-gray-800 tracking-tight mb-6 flex items-center gap-3">
              <Target className="text-primary-500" /> Source Analytics
            </h2>
            <div className="space-y-6">
              {stats?.sourceStats?.sort((a: any, b: any) => b.count - a.count).map((src: any) => {
                 const total = stats.totalLeads || 1;
                 const percent = ((src.count / total) * 100).toFixed(1);
                 return (
                   <div key={src._id} className="relative group">
                     <div className="flex justify-between text-sm font-bold text-gray-600 mb-2">
                       <span className="uppercase tracking-widest text-xs">{src._id}</span>
                       <span className="text-gray-400">{src.count} Leads ({percent}%)</span>
                     </div>
                     <div className="w-full h-3 bg-gray-50 rounded-full overflow-hidden">
                       <div className="h-full bg-gradient-to-r from-primary-400 to-primary-600 rounded-full group-hover:from-secondary-400 group-hover:to-secondary-600 transition-all duration-500" style={{ width: `${percent}%` }} />
                     </div>
                   </div>
                 );
              })}
              {(!stats?.sourceStats || stats.sourceStats.length === 0) && (
                <div className="text-center py-8 text-gray-400 font-bold uppercase tracking-widest text-xs">No source data available</div>
              )}
            </div>
         </div>
         <div className="bg-purple-50 p-8 rounded-[2.5rem] shadow-xl border-2 border-purple-100 flex flex-col justify-center items-center text-center group hover:bg-purple-100 transition-colors cursor-pointer">
            <div className="w-16 h-16 bg-white text-purple-600 rounded-2xl flex justify-center items-center mb-6 shadow-sm group-hover:scale-110 transition-transform">
               <Bell size={32} />
            </div>
            <h3 className="text-purple-400 text-xs font-black uppercase tracking-widest mb-2">Required Follow-ups Today</h3>
            <p className="text-7xl font-black text-purple-600 tracking-tighter">{stats?.followUpToday || 0}</p>
         </div>
      </div>

      {/* Main Table Section */}
      <div className="space-y-6">
        <div className="flex items-center justify-between px-2">
           <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-2xl bg-gray-800 flex items-center justify-center text-white shadow-lg">
                 <MessageSquare size={24} />
              </div>
              <h2 className="text-3xl font-black text-gray-800 tracking-tight">Active Pipepline</h2>
           </div>
           <span className="text-sm font-bold text-gray-400 uppercase tracking-widest border-b-2 border-gray-100 pb-1">
              Showing {stats?.totalLeads || 0} Leads
           </span>
        </div>
        <LeadsTable />
      </div>
    </div>
  );
}
