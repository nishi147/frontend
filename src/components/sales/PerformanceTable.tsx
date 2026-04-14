"use client";
import React, { useState, useEffect } from 'react';
import api from '@/utils/api';
import { Target, TrendingUp, DollarSign, User, Mail, IndianRupee } from 'lucide-react';

export const PerformanceTable = () => {
  const [performance, setPerformance] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchPerformance = async () => {
      try {
        const res = await api.get('/api/leads/performance');
        setPerformance(res.data.data);
      } catch (err) {
        console.error("Error fetching performance:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchPerformance();
  }, []);

  if (loading) return <div className="text-center py-12 animate-pulse font-black text-gray-400 uppercase tracking-widest text-xs">Analyzing conversion data...</div>;

  return (
    <div className="bg-white rounded-[2.5rem] shadow-xl border-2 border-gray-50 overflow-hidden">
      <div className="p-8 border-b-2 border-gray-50 flex items-center justify-between">
         <h2 className="text-xl font-black text-gray-800 tracking-tight flex items-center gap-3">
            <TrendingUp size={24} className="text-primary-500" /> Sales Team Performance
         </h2>
         <span className="text-[10px] font-black text-gray-400 uppercase tracking-widest bg-gray-50 px-3 py-1.5 rounded-xl">Live Metrics</span>
      </div>
      <div className="overflow-x-auto">
        <table className="w-full text-left border-collapse">
          <thead className="bg-gray-50/50 uppercase text-[10px] tracking-[0.2em] font-black text-gray-400">
            <tr>
              <th className="px-8 py-6">Sales Executive</th>
              <th className="px-8 py-6 text-center">Total Leads</th>
              <th className="px-8 py-6 text-center">Conversions</th>
              <th className="px-8 py-6 text-center">Conv. Rate</th>
              <th className="px-8 py-6 text-right">Revenue Generated</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-50">
            {performance.map((exec) => (
              <tr key={exec.userId} className="hover:bg-primary-50/20 transition-colors">
                <td className="px-8 py-6">
                   <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-2xl bg-primary-100 flex items-center justify-center text-primary-600 text-sm font-black uppercase">
                         {exec.name[0]}
                      </div>
                      <div className="flex flex-col">
                         <span className="font-black text-gray-800 text-base">{exec.name}</span>
                         <span className="text-[10px] font-bold text-gray-400">{exec.email}</span>
                      </div>
                   </div>
                </td>
                <td className="px-8 py-6 text-center">
                   <span className="px-4 py-1.5 bg-gray-50 rounded-xl text-sm font-black text-gray-600">{exec.totalLeads}</span>
                </td>
                <td className="px-8 py-6 text-center">
                   <span className="px-4 py-1.5 bg-green-50 rounded-xl text-sm font-black text-green-600">{exec.convertedLeads}</span>
                </td>
                <td className="px-8 py-6 text-center">
                   <div className="flex flex-col items-center">
                      <span className="text-sm font-black text-secondary-600">{exec.conversionRate.toFixed(1)}%</span>
                      <div className="w-16 h-1 bg-gray-100 rounded-full mt-1">
                         <div className="h-full bg-secondary-500 rounded-full" style={{ width: `${Math.min(exec.conversionRate, 100)}%` }} />
                      </div>
                   </div>
                </td>
                <td className="px-8 py-6 text-right">
                   <span className="text-lg font-black text-gray-800 flex items-center justify-end gap-1">
                      <IndianRupee size={16} /> {exec.totalRevenue.toLocaleString()}
                   </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};
