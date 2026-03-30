"use client";

import React, { useEffect, useState } from 'react';
import { DashboardLayout } from '@/components/layout/DashboardLayout';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import api from '@/utils/api';
import { Trash2, Edit2, Plus, Loader2, Star } from 'lucide-react';
import { useToast } from '@/context/ToastContext';

export default function CurrencyManagement() {
    const [currencies, setCurrencies] = useState<any[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editingCurrency, setEditingCurrency] = useState<any>(null);
    const [formData, setFormData] = useState({
        code: '',
        symbol: '',
        exchangeRate: 1,
        status: 'active',
        isDefault: false
    });
    const { showToast, confirm } = useToast();

    const fetchCurrencies = async () => {
        try {
            // Include credentials so admin route gets ALL currencies including inactive ones
            const res = await api.get('/api/currencies');
            if (res.data.success) {
                setCurrencies(res.data.data);
            }
        } catch (err) {
            showToast('Failed to fetch currencies', 'error');
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        fetchCurrencies();
    }, []);

    const resetForm = () => {
        setFormData({ code: '', symbol: '', exchangeRate: 1, status: 'active', isDefault: false });
        setEditingCurrency(null);
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            if (editingCurrency) {
                await api.put(`/api/currencies/${editingCurrency._id}`, formData);
                showToast('Currency updated successfully', 'success');
            } else {
                await api.post('/api/currencies', formData);
                showToast('Currency created successfully', 'success');
            }
            setIsModalOpen(false);
            resetForm();
            fetchCurrencies();
        } catch (err: any) {
            showToast(err.response?.data?.message || 'Action failed', 'error');
        }
    };

    const handleDelete = async (id: string, code: string) => {
        const isConfirmed = await (confirm as any)(`Delete ${code}?`, 'This will remove the currency globally.');
        if (!isConfirmed) return;

        try {
            await api.delete(`/api/currencies/${id}`);
            showToast('Currency deleted', 'success');
            fetchCurrencies();
        } catch (err: any) {
            showToast(err.response?.data?.message || 'Delete failed', 'error');
        }
    };
    
    const setAsDefault = async (currency: any) => {
        try {
            await api.put(`/api/currencies/${currency._id}`, { ...currency, isDefault: true });
            showToast(`${currency.code} is now the default currency.`, 'success');
            fetchCurrencies();
        } catch (err: any) {
            showToast(err.response?.data?.message || 'Action failed', 'error');
        }
    };

    if (isLoading) {
        return (
            <DashboardLayout allowedRoles={['admin']}>
                <div className="flex items-center justify-center p-20">
                    <Loader2 className="w-10 h-10 animate-spin text-primary-500" />
                </div>
            </DashboardLayout>
        );
    }

    return (
        <DashboardLayout allowedRoles={['admin']}>
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-10 gap-4">
                <div>
                    <h1 className="text-4xl font-black text-gray-800 tracking-tighter">Global <span className="text-primary-500">Currencies</span></h1>
                    <p className="text-gray-500 font-bold uppercase text-[10px] tracking-[0.2em] mt-1">Exchange Rates & Finance</p>
                </div>
                <Button onClick={() => { resetForm(); setIsModalOpen(true); }} className="gap-2 px-8 shadow-2xl hover:scale-105 transition-all">
                    <Plus size={20} /> Create New
                </Button>
            </div>

            <div className="bg-white rounded-[2.5rem] shadow-2xl border border-gray-100 overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="w-full text-left border-collapse min-w-[800px]">
                        <thead>
                            <tr className="bg-gray-50/50 border-b border-gray-100 font-black text-gray-400 uppercase text-[10px] tracking-[0.2em]">
                                <th className="px-8 py-6">Code</th>
                                <th className="px-8 py-6">Symbol</th>
                                <th className="px-8 py-6">Rate (Multiplier)</th>
                                <th className="px-8 py-6">Default</th>
                                <th className="px-8 py-6">Status</th>
                                <th className="px-8 py-6 text-right">Action</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-50">
                            {currencies.map((curr) => (
                                <tr key={curr._id} className="hover:bg-primary-50/30 transition-all group">
                                    <td className="px-8 py-6">
                                        <p className="font-black text-gray-800 text-lg tracking-tight">{curr.code}</p>
                                    </td>
                                    <td className="px-8 py-6">
                                        <div className="w-10 h-10 bg-gray-50 border-2 border-gray-100 rounded-xl flex items-center justify-center text-lg font-black text-gray-600 shadow-sm">
                                            {curr.symbol}
                                        </div>
                                    </td>
                                    <td className="px-8 py-6 text-gray-600 font-bold">
                                        {curr.exchangeRate.toFixed(4)}
                                    </td>
                                    <td className="px-8 py-6">
                                        {curr.isDefault ? (
                                            <span className="px-3 py-1.5 rounded-full bg-green-100 text-green-700 font-black text-[10px] uppercase tracking-widest flex items-center gap-1 w-fit">
                                                <Star fill="currentColor" size={10} /> Default
                                            </span>
                                        ) : (
                                            <span className="px-3 py-1.5 rounded-full bg-gray-100 text-gray-400 font-black text-[10px] uppercase tracking-widest cursor-pointer hover:bg-gray-200 transition-colors w-fit block" onClick={() => setAsDefault(curr)}>
                                                Set Default
                                            </span>
                                        )}
                                    </td>
                                    <td className="px-8 py-6">
                                        <span className={`px-4 py-1.5 rounded-full font-black uppercase text-[9px] tracking-widest flex items-center gap-2 w-fit ${curr.status === 'active' ? 'bg-green-50 text-green-600' : 'bg-red-50 text-red-600'}`}>
                                            <div className={`w-1.5 h-1.5 rounded-full ${curr.status === 'active' ? 'bg-green-500 animate-pulse' : 'bg-red-500'}`}></div>
                                            {curr.status}
                                        </span>
                                    </td>
                                    <td className="px-8 py-6 text-right">
                                        <div className="flex justify-end gap-2">
                                            <button 
                                                onClick={() => {
                                                    setEditingCurrency(curr);
                                                    setFormData({ code: curr.code, symbol: curr.symbol, exchangeRate: curr.exchangeRate, status: curr.status, isDefault: curr.isDefault });
                                                    setIsModalOpen(true);
                                                }}
                                                className="px-4 py-2 bg-slate-800 text-white rounded-xl hover:bg-slate-700 transition-all shadow-md font-bold text-xs flex items-center gap-2"
                                            >
                                                <Edit2 size={14} /> Edit
                                            </button>
                                            {!curr.isDefault && (
                                                <button 
                                                    onClick={() => handleDelete(curr._id, curr.code)}
                                                    className="p-2 bg-red-100 text-red-500 rounded-xl hover:bg-red-500 hover:text-white transition-all shadow-sm"
                                                >
                                                    <Trash2 size={16} />
                                                </button>
                                            )}
                                        </div>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>

            {/* Modal */}
            {isModalOpen && (
                <div className="fixed inset-0 z-[200] flex items-start md:items-center justify-center bg-slate-900/60 backdrop-blur-md p-2 sm:p-6 overflow-y-auto">
                    <div className="w-full max-w-4xl bg-white shadow-2xl rounded-[1.5rem] md:rounded-[3rem] animate-in zoom-in-95 duration-400 mt-2 md:mt-0 flex flex-col max-h-[96dvh]">
                        <div className="p-5 md:p-10 border-b border-gray-100 flex justify-between items-center bg-gray-50/80 rounded-t-[1.5rem] md:rounded-t-[3rem] shrink-0">
                            <h2 className="text-xl md:text-3xl font-black text-gray-800 tracking-tighter">{editingCurrency ? 'Modify' : 'Create'} Currency</h2>
                            <button onClick={() => setIsModalOpen(false)} className="w-8 h-8 md:w-10 md:h-10 flex items-center justify-center rounded-full bg-white text-gray-400 hover:text-red-500 hover:bg-red-50 font-bold transition-all shadow-sm">✕</button>
                        </div>
                        <form onSubmit={handleSubmit} className="p-5 md:p-10 space-y-5 md:space-y-8 overflow-y-auto flex-1">
                            <div className="grid grid-cols-1 md:grid-cols-3 gap-5 md:gap-8 items-start">
                                <div>
                                    <label className="text-[9px] md:text-xs font-black text-gray-400 uppercase tracking-[0.2em] mb-2 md:mb-3 block ml-1">Currency Code</label>
                                    <input 
                                        required 
                                        placeholder="e.g. USD" 
                                        maxLength={5}
                                        value={formData.code} 
                                        onChange={(e) => setFormData({...formData, code: e.target.value.toUpperCase()})}
                                        className="w-full p-4 md:p-5 bg-gray-50 border-2 border-transparent focus:border-primary-500 focus:bg-white rounded-xl md:rounded-2xl font-black outline-none transition-all placeholder:text-gray-300 text-gray-800 uppercase text-sm md:text-base" 
                                    />
                                </div>
                                <div>
                                    <label className="text-[9px] md:text-xs font-black text-gray-400 uppercase tracking-[0.2em] mb-2 md:mb-3 block ml-1">Symbol</label>
                                    <input 
                                        required
                                        placeholder="e.g. $" 
                                        value={formData.symbol} 
                                        onChange={(e) => setFormData({...formData, symbol: e.target.value})}
                                        className="w-full p-4 md:p-5 bg-gray-50 border-2 border-transparent focus:border-primary-500 focus:bg-white rounded-xl md:rounded-2xl font-black outline-none transition-all text-lg md:text-2xl text-center md:text-left" 
                                    />
                                </div>
                                <div>
                                    <label className="text-[9px] md:text-xs font-black text-gray-400 uppercase tracking-[0.2em] mb-2 md:mb-3 block ml-1">Exchange Rate</label>
                                    <input 
                                        type="number"
                                        step="0.0001"
                                        required
                                        value={formData.exchangeRate} 
                                        onChange={(e) => setFormData({...formData, exchangeRate: Number(e.target.value)})}
                                        className="w-full p-4 md:p-5 bg-gray-50 border-2 border-transparent focus:border-primary-500 focus:bg-white rounded-xl md:rounded-2xl font-black outline-none transition-all text-sm md:text-base" 
                                    />
                                    <p className="text-[9px] text-gray-400 font-bold mt-2 ml-1">Multiplier against base currency.</p>
                                </div>
                            </div>
                            
                            <div className="flex flex-col md:flex-row gap-5 md:gap-8 border-t border-gray-50 pt-6 md:pt-8">
                                <div className="flex-1">
                                    <label className="text-[9px] md:text-xs font-black text-gray-400 uppercase tracking-[0.2em] mb-2 md:mb-3 block ml-1">Visibility Status</label>
                                    <div className="flex gap-2 md:gap-3">
                                        {['active', 'inactive'].map((s) => (
                                            <button
                                                key={s}
                                                type="button"
                                                onClick={() => setFormData({...formData, status: s})}
                                                className={`flex-1 p-3 md:p-4 rounded-xl md:rounded-2xl font-black uppercase tracking-widest text-[9px] md:text-[11px] border-2 transition-all ${formData.status === s ? 'bg-primary-500 border-primary-500 text-white shadow-lg shadow-primary-500/30 ring-4 ring-primary-50' : 'bg-white border-gray-100 text-gray-400 hover:border-gray-200 hover:bg-gray-50'}`}
                                            >
                                                {s}
                                            </button>
                                        ))}
                                    </div>
                                </div>
                                <div className="flex-1">
                                    <label className="text-[9px] md:text-xs font-black text-gray-400 uppercase tracking-[0.2em] mb-2 md:mb-3 block ml-1">Default Configuration</label>
                                    <div className="flex gap-2 md:gap-3">
                                        <button
                                            type="button"
                                            onClick={() => setFormData({...formData, isDefault: true})}
                                            className={`flex-1 p-3 md:p-4 rounded-xl md:rounded-2xl font-black uppercase tracking-widest text-[9px] md:text-[11px] border-2 transition-all ${formData.isDefault ? 'bg-green-500 border-green-500 text-white shadow-lg shadow-green-500/30 ring-4 ring-green-50' : 'bg-white border-gray-100 text-gray-400 hover:border-gray-200 hover:bg-gray-50'}`}
                                        >
                                            YES, DEFAULT
                                        </button>
                                        <button
                                            type="button"
                                            onClick={() => setFormData({...formData, isDefault: false})}
                                            className={`flex-1 p-3 md:p-4 rounded-xl md:rounded-2xl font-black uppercase tracking-widest text-[9px] md:text-[11px] border-2 transition-all ${!formData.isDefault ? 'bg-slate-800 border-slate-800 text-white shadow-lg shadow-slate-900/30 ring-4 ring-slate-50' : 'bg-white border-gray-100 text-gray-400 hover:border-gray-200 hover:bg-gray-50'}`}
                                        >
                                            STANDARD
                                        </button>
                                    </div>
                                </div>
                            </div>
                            
                            <div className="flex justify-end pt-2 md:pt-4">
                               <Button type="submit" className="w-full md:w-auto md:min-w-[300px] py-4 md:py-6 text-base md:text-xl font-black rounded-xl md:rounded-[1.5rem] shadow-xl shadow-primary-500/20 hover:scale-[1.02] hover:-translate-y-1 transition-all mt-2 md:mt-4">
                                   {editingCurrency ? 'Save Changes' : 'Publish Currency'}
                               </Button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </DashboardLayout>
    );
}
