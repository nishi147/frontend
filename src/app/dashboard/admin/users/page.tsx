"use client";

import React, { useEffect, useState } from 'react';
import { useAuth } from '@/context/AuthContext';
import { Header } from '@/components/layout/Header';
import { DashboardLayout } from '@/components/layout/DashboardLayout';
import { Card, CardContent } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import axios from 'axios';
import { UserCheck, UserX, Trash2, Mail, Shield } from 'lucide-react';
import { useToast } from '@/context/ToastContext';

export default function UserManagement() {
  const { user, loading } = useAuth();
  const [users, setUsers] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const { showToast } = useToast();

  const fetchUsers = async () => {
    try {
      const res = await axios.get('/api/users');
      if (res.data.success) {
        setUsers(res.data.data);
      }
    } catch (err) {
      console.error("Failed to fetch users", err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (user?.role === 'admin') {
      fetchUsers();
    }
  }, [user]);

  const approveTeacher = async (id: string) => {
    try {
      await axios.put(`/api/users/approve-teacher/${id}`);
      showToast("Teacher approved successfully!", "success");
      fetchUsers();
    } catch (err) {
      showToast("Action failed.", "error");
    }
  };

  const approveStudent = async (id: string) => {
    try {
      const res = await axios.put(`/api/users/approve-student/${id}`);
      if (res.data.success) {
        showToast("Student approved successfully!", "success");
        fetchUsers();
      }
    } catch (err: any) {
      console.error("Student approval failed:", err.response?.data || err.message);
      showToast(`Action failed: ${err.response?.data?.message || err.message}`, "error");
    }
  };

  const deleteUser = async (id: string) => {
    if (!window.confirm("Are you sure you want to delete this user? This action cannot be undone.")) return;
    try {
      const res = await axios.delete(`/api/users/${id}`);
      if (res.data.success) {
        showToast("User deleted successfully!", "success");
        fetchUsers();
      }
    } catch (err: any) {
      showToast(`Delete failed: ${err.response?.data?.message || err.message}`, "error");
    }
  };

  if (loading || isLoading) return <div className="p-20 text-center font-bold text-accent-500 text-2xl animate-pulse">Managing Souls... 🧙</div>;

  return (
    <DashboardLayout>
      <div className="flex flex-col md:flex-row items-start md:items-center justify-between mb-8 gap-4 px-2 sm:px-0">
        <div>
          <h1 className="text-3xl md:text-4xl font-black text-gray-800 tracking-tight">User <span className="text-primary-500">Management</span> 👥</h1>
          <p className="text-gray-400 font-bold mt-1 uppercase text-[10px] tracking-[0.2em]">Verified Platform Access</p>
        </div>
        <div className="bg-primary-50 text-primary-600 px-6 py-2.5 rounded-2xl font-black text-sm uppercase w-full md:w-auto text-center border-2 border-primary-100/50">
          Total Souls: {users.length}
        </div>
      </div>

      {/* Desktop Table View */}
      <div className="hidden md:block bg-white rounded-[2rem] shadow-2xl overflow-hidden border border-gray-100 mb-12 transform hover:scale-[1.005] transition-all duration-500">
        <div className="overflow-x-auto scrollbar-hide font-sans">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-gray-50/80 border-b border-gray-100 font-black text-gray-400 uppercase text-xs tracking-[0.2em] px-8">
                <th className="px-8 py-6">Identity</th>
                <th className="px-8 py-6">Privileges</th>
                <th className="px-8 py-6">Verification</th>
                <th className="px-8 py-6 text-right">Actions</th>
              </tr>
            </thead>
            <tbody>
              {users.map((u: any) => (
                <tr key={u._id} className="border-b border-gray-50 hover:bg-primary-50/30 transition-all group">
                  <td className="px-8 py-6">
                    <div className="flex items-center gap-4">
                      <div className={`w-12 h-12 rounded-2xl flex items-center justify-center text-white font-black text-lg ${u.role === 'teacher' ? 'bg-secondary-500' : u.role === 'admin' ? 'bg-accent-500' : 'bg-primary-500'}`}>
                        {u.name[0]}
                      </div>
                      <div className="min-w-0">
                        <p className="font-black text-gray-800 truncate">{u.name}</p>
                        <p className="text-gray-400 flex items-center gap-1 text-sm font-bold truncate tracking-tight"><Mail className="w-3 h-3" /> {u.email}</p>
                      </div>
                    </div>
                  </td>
                  <td className="px-8 py-6 font-bold uppercase tracking-widest text-xs">
                     <span className={`px-4 py-1.5 rounded-xl font-black ${u.role === 'teacher' ? 'text-secondary-600 bg-secondary-50' : u.role === 'admin' ? 'text-accent-600 bg-accent-50' : 'text-primary-600 bg-primary-50'}`}>
                        {u.role}
                     </span>
                  </td>
                  <td className="px-8 py-6 font-black">
                    {u.role === 'teacher' ? (
                      u.isApprovedTeacher ? (
                        <span className="text-green-500 flex items-center gap-2"><UserCheck className="w-4 h-4" /> Rooted</span>
                      ) : (
                        <span className="text-amber-500 flex items-center gap-2 animate-pulse"><UserX className="w-4 h-4" /> Pending</span>
                      )
                    ) : u.role === 'student' ? (
                      u.isApprovedStudent ? (
                        <span className="text-green-500 flex items-center gap-2"><UserCheck className="w-4 h-4" /> Approved</span>
                      ) : (
                        <span className="text-amber-500 flex items-center gap-2 animate-pulse"><UserX className="w-4 h-4" /> Waitlist</span>
                      )
                    ) : (
                      <span className="text-gray-400">—</span>
                    )}
                  </td>
                  <td className="px-8 py-6 text-right">
                    <div className="flex items-center justify-end gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                      {u.role === 'teacher' && !u.isApprovedTeacher && (
                        <Button size="sm" variant="secondary" onClick={() => approveTeacher(u._id)} className="font-black text-[10px] uppercase px-4 py-2">Approve</Button>
                      )}
                      {u.role === 'student' && !u.isApprovedStudent && (
                        <Button size="sm" variant="primary" onClick={() => approveStudent(u._id)} className="font-black text-[10px] uppercase px-4 py-2">Approve</Button>
                      )}
                      <Button size="sm" variant="outline" onClick={() => deleteUser(u._id)} className="text-red-500 border-red-100 hover:bg-red-50 p-2"><Trash2 className="w-4 h-4" /></Button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Mobile Card View */}
      <div className="md:hidden space-y-4 mb-12 px-2">
        {users.map((u: any) => (
          <div key={u._id} className="bg-white p-6 rounded-[2rem] shadow-xl border border-gray-50 flex flex-col gap-5">
             <div className="flex items-center gap-4">
                <div className={`w-14 h-14 rounded-2xl flex items-center justify-center text-white font-black text-xl flex-shrink-0 ${u.role === 'teacher' ? 'bg-secondary-500 shadow-lg' : u.role === 'admin' ? 'bg-accent-500 shadow-lg' : 'bg-primary-500 shadow-lg'}`}>
                  {u.name[0]}
                </div>
                <div className="min-w-0">
                  <p className="font-black text-gray-800 text-lg truncate">{u.name}</p>
                  <p className="text-gray-400 text-xs font-bold truncate tracking-tight">{u.email}</p>
                </div>
             </div>
             
             <div className="flex flex-wrap items-center justify-between gap-3 border-t border-gray-50 pt-5">
                <span className={`px-4 py-1.5 rounded-xl font-black uppercase text-[10px] tracking-widest ${u.role === 'teacher' ? 'text-secondary-600 bg-secondary-50' : u.role === 'admin' ? 'text-accent-600 bg-accent-50' : 'text-primary-600 bg-primary-50'}`}>
                  {u.role}
                </span>
                
                <div className="flex items-center gap-2">
                  {!u.isApprovedTeacher && u.role === 'teacher' && (
                    <Button size="sm" variant="secondary" onClick={() => approveTeacher(u._id)} className="font-black text-[10px] uppercase px-3 py-2">Verify</Button>
                  )}
                  {!u.isApprovedStudent && u.role === 'student' && (
                    <Button size="sm" variant="primary" onClick={() => approveStudent(u._id)} className="font-black text-[10px] uppercase px-3 py-2">Approve</Button>
                  )}
                  <Button size="sm" variant="outline" onClick={() => deleteUser(u._id)} className="text-red-500 border-red-100 p-2"><Trash2 className="w-4 h-4" /></Button>
                </div>
             </div>

             <div className="bg-gray-50/50 p-3 rounded-2xl">
                {u.role === 'teacher' ? (
                  u.isApprovedTeacher ? (
                    <span className="text-green-600 font-bold text-[11px] flex items-center gap-2 px-1"><UserCheck className="w-3.5 h-3.5" /> Identity fully rooted in system.</span>
                  ) : (
                    <span className="text-amber-600 font-bold text-[11px] flex items-center gap-2 px-1 animate-pulse"><UserX className="w-3.5 h-3.5" /> Verification pending approval.</span>
                  )
                ) : u.role === 'student' ? (
                  u.isApprovedStudent ? (
                    <span className="text-green-600 font-bold text-[11px] flex items-center gap-2 px-1"><UserCheck className="w-3.5 h-3.5" /> Profile verified and active.</span>
                  ) : (
                    <span className="text-amber-600 font-bold text-[11px] flex items-center gap-2 px-1 animate-pulse"><UserX className="w-3.5 h-3.5" /> Waiting for admin approval.</span>
                  )
                ) : (
                  <span className="text-gray-400 font-bold text-[11px] px-1">Administrative Master Account</span>
                )}
             </div>
          </div>
        ))}
      </div>
    </DashboardLayout>
  );
}
