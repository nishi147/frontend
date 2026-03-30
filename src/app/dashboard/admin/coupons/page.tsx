"use client";
import React, { useEffect, useState } from 'react';
import { useAuth } from '@/context/AuthContext';
import { DashboardLayout } from '@/components/layout/DashboardLayout';
import { Button } from '@/components/ui/Button';
import api from '@/utils/api';
import { Gift, Trash2, Calendar, Tag, Percent, IndianRupee, Plus, X, CheckCircle2 } from 'lucide-react';
import { useToast } from '@/context/ToastContext';

export default function CouponsPage() {
  const { user, loading } = useAuth();
  const [coupons, setCoupons] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [showAddForm, setShowAddForm] = useState(false);
  const [newCoupon, setNewCoupon] = useState({
    code: '',
    discountType: 'percentage',
    discountAmount: 0,
    expiryDate: '',
    isActive: true
  });
  const { showToast } = useToast();

  const fetchCoupons = async () => {
    try {
      const res = await api.get('/api/coupons');
      if (res.data.success) {
        setCoupons(res.data.data);
      }
    } catch (err) {
      console.error("Failed to fetch coupons", err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (user?.role === 'admin') {
      fetchCoupons();
    }
  }, [user]);

  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await api.post('/api/coupons', newCoupon);
      showToast("Coupon created successfully!", "success");
      setShowAddForm(false);
      setNewCoupon({ code: '', discountType: 'percentage', discountAmount: 0, expiryDate: '', isActive: true });
      fetchCoupons();
    } catch (err: any) {
      showToast(err.response?.data?.message || "Failed to create coupon", "error");
    }
  };

  const deleteCoupon = async (id: string) => {
    if (!window.confirm("Are you sure you want to delete this coupon?")) return;
    try {
      await api.delete(`/api/coupons/${id}`);
      showToast("Coupon deleted!", "success");
      fetchCoupons();
    } catch (err) {
      showToast("Delete failed.", "error");
    }
  };

  if (loading || isLoading) return <div className="p-20 text-center font-bold text-accent-500 text-2xl animate-pulse tracking-widest uppercase">Consulting Oracles... 🔮</div>;

  return (
    <DashboardLayout allowedRoles={['admin']}>
      <div className="max-w-7xl mx-auto space-y-12">
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
          <div>
            <div className="flex items-center gap-2 text-purple-600 mb-2">
               <Tag size={20} className="animate-bounce" />
               <span className="text-[10px] font-black uppercase tracking-[0.3em]">Marketing Engine</span>
            </div>
            <h1 className="text-5xl font-black text-gray-800 tracking-tighter">Coupon <span className="text-purple-500">Center</span> 🎫</h1>
            <p className="text-gray-400 font-bold mt-2 text-lg">Create magical discounts and track your campaign performance.</p>
          </div>
          <button 
            onClick={() => setShowAddForm(true)}
            className="flex items-center gap-3 px-8 py-5 bg-purple-500 text-white rounded-[2rem] font-black uppercase text-xs tracking-widest shadow-xl shadow-purple-100 hover:bg-purple-600 hover:-translate-y-1 transition-all active:scale-95"
          >
            <Plus size={20} strokeWidth={3} /> Create Coupon
          </button>
        </div>

        {showAddForm && (
          <div className="fixed inset-0 z-[1000] flex items-center justify-center p-4">
            <div className="absolute inset-0 bg-black/40 backdrop-blur-sm" onClick={() => setShowAddForm(false)} />
            <div className="relative bg-white w-full max-w-xl rounded-[3rem] shadow-2xl overflow-hidden animate-in zoom-in-95 duration-300">
               <form onSubmit={handleCreate} className="p-8 md:p-12 space-y-8">
                  <div className="flex justify-between items-center mb-4">
                     <h2 className="text-3xl font-black text-gray-800 tracking-tighter">New <span className="text-purple-500">Coupon</span></h2>
                     <button type="button" onClick={() => setShowAddForm(false)} className="p-2 hover:bg-gray-100 rounded-xl transition-all"><X size={24}/></button>
                  </div>

                  <div className="space-y-4">
                    <div className="space-y-2">
                       <label className="text-[10px] font-black uppercase text-gray-400 tracking-widest ml-4">Coupon Code</label>
                       <input 
                         required
                         type="text"
                         placeholder="MAGIC2026"
                         className="w-full p-5 rounded-2xl border-2 border-gray-100 focus:border-purple-500 bg-gray-50/30 outline-none font-black text-xl uppercase tracking-widest text-purple-600"
                         value={newCoupon.code}
                         onChange={(e) => setNewCoupon({...newCoupon, code: e.target.value.toUpperCase()})}
                       />
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                       <div className="space-y-2">
                          <label className="text-[10px] font-black uppercase text-gray-400 tracking-widest ml-4">Type</label>
                          <select 
                            className="w-full p-5 rounded-2xl border-2 border-gray-100 focus:border-purple-500 bg-gray-50/30 outline-none font-bold text-gray-600"
                            value={newCoupon.discountType}
                            onChange={(e) => setNewCoupon({...newCoupon, discountType: e.target.value as any})}
                          >
                             <option value="percentage">Percentage (%)</option>
                             <option value="fixed">Fixed Amount (₹)</option>
                          </select>
                       </div>
                       <div className="space-y-2">
                          <label className="text-[10px] font-black uppercase text-gray-400 tracking-widest ml-4">Amount</label>
                          <input 
                            required
                            type="number"
                            className="w-full p-5 rounded-2xl border-2 border-gray-100 focus:border-purple-500 bg-gray-50/30 outline-none font-black text-xl text-gray-700"
                            value={newCoupon.discountAmount}
                            onChange={(e) => setNewCoupon({...newCoupon, discountAmount: Number(e.target.value)})}
                          />
                       </div>
                    </div>

                    <div className="space-y-2">
                       <label className="text-[10px] font-black uppercase text-gray-400 tracking-widest ml-4">Expiry Date</label>
                       <input 
                         type="date"
                         className="w-full p-5 rounded-2xl border-2 border-gray-100 focus:border-purple-500 bg-gray-50/30 outline-none font-bold text-gray-600"
                         value={newCoupon.expiryDate}
                         onChange={(e) => setNewCoupon({...newCoupon, expiryDate: e.target.value})}
                       />
                    </div>
                  </div>

                  <button 
                    type="submit"
                    className="w-full bg-purple-600 text-white p-5 rounded-[2rem] font-black uppercase text-sm tracking-widest shadow-xl shadow-purple-100 hover:bg-purple-700 transition-all transform hover:-translate-y-1"
                  >
                     Activate Magic Code
                  </button>
               </form>
            </div>
          </div>
        )}

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
           {coupons.length === 0 ? (
             <div className="col-span-full py-20 text-center space-y-4">
                <Gift size={64} className="mx-auto text-gray-100" />
                <p className="text-gray-400 font-black uppercase tracking-widest">No coupons in existence. Create your first one!</p>
             </div>
           ) : coupons.map((c: any) => (
             <div key={c._id} className="bg-white p-8 rounded-[3rem] shadow-xl border-2 border-gray-50 group hover:-translate-y-2 transition-all duration-500 relative overflow-hidden">
                <div className="absolute top-[-20%] right-[-10%] w-40 h-40 bg-purple-50 rounded-full blur-3xl group-hover:scale-150 transition-transform duration-1000" />
                
                <div className="relative z-10 flex justify-between items-start mb-6">
                   <div className="p-4 bg-purple-50 text-purple-600 rounded-2xl shadow-inner">
                      {c.discountType === 'percentage' ? <Percent size={24} strokeWidth={3} /> : <IndianRupee size={24} strokeWidth={3} />}
                   </div>
                   <button 
                     onClick={() => deleteCoupon(c._id)}
                     className="p-3 bg-red-50 text-red-500 hover:bg-red-500 hover:text-white rounded-xl transition-all shadow-sm"
                   >
                     <Trash2 size={18} />
                   </button>
                </div>

                <div className="relative z-10 space-y-4">
                   <div className="flex flex-col">
                      <span className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-1">Coupon Code</span>
                      <span className="text-3xl font-black text-gray-800 tracking-tighter uppercase">{c.code}</span>
                   </div>
                   
                   <div className="flex items-center justify-between pt-4 border-t border-gray-50">
                      <div className="flex flex-col">
                         <span className="text-[8px] font-black text-gray-400 uppercase tracking-widest">Discount</span>
                         <span className="text-xl font-black text-purple-600">
                           {c.discountType === 'percentage' ? `${c.discountAmount}%` : `₹${c.discountAmount}`}
                         </span>
                      </div>
                      <div className="flex flex-col text-right">
                         <span className="text-[8px] font-black text-gray-400 uppercase tracking-widest italic">Usage</span>
                         <span className="text-xl font-black text-gray-800">{c.usageCount || 0} Uses</span>
                      </div>
                   </div>

                   <div className="flex items-center gap-3 pt-4 text-xs font-bold text-gray-400">
                      <Calendar size={14} /> 
                      {c.expiryDate ? `Expires: ${new Date(c.expiryDate).toLocaleDateString()}` : "No Expiry"}
                      <div className={`ml-auto w-3 h-3 rounded-full ${c.isActive ? 'bg-green-500 shadow-[0_0_10px_rgba(34,197,94,0.5)]' : 'bg-red-500'}`} />
                   </div>
                </div>
             </div>
           ))}
        </div>
      </div>
    </DashboardLayout>
  );
}
