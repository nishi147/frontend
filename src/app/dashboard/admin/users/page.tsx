"use client";

import React, { useEffect, useState } from 'react';
import { useAuth } from '@/context/AuthContext';
import { Header } from '@/components/layout/Header';
import { Card, CardContent } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import axios from 'axios';
import { UserCheck, UserX, Trash2, Mail, Shield } from 'lucide-react';

export default function UserManagement() {
  const { user, loading } = useAuth();
  const [users, setUsers] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  const fetchUsers = async () => {
    try {
      const res = await axios.get('https://backend-1-5cs8.onrender.com/api/users');
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
      await axios.put(`https://backend-1-5cs8.onrender.com/api/users/approve-teacher/${id}`);
      alert("Teacher approved successfully!");
      fetchUsers();
    } catch (err) {
      alert("Action failed.");
    }
  };

  if (loading || isLoading) return <div className="p-20 text-center font-bold text-accent-500 text-2xl animate-pulse">Managing Souls... 🧙</div>;

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col font-sans">
      <Header />
      <main className="flex-1 container mx-auto px-4 py-8">
        <div className="flex items-center justify-between mb-8">
          <h1 className="text-4xl font-black text-gray-800">User Management 👥</h1>
          <div className="bg-primary-100 text-primary-700 px-6 py-2 rounded-full font-black text-sm uppercase">
            Total Users: {users.length}
          </div>
        </div>

        <div className="bg-white rounded-3xl shadow-xl overflow-hidden border border-gray-100">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-gray-50 border-b border-gray-100 font-black text-gray-400 uppercase text-xs tracking-widest">
                <th className="px-8 py-6">User</th>
                <th className="px-8 py-6">Role</th>
                <th className="px-8 py-6">Status</th>
                <th className="px-8 py-6 text-right">Actions</th>
              </tr>
            </thead>
            <tbody>
              {users.map((u: any) => (
                <tr key={u._id} className="border-b border-gray-50 hover:bg-gray-50/50 transition-colors group">
                  <td className="px-8 py-6">
                    <div className="flex items-center gap-4">
                      <div className={`w-12 h-12 rounded-2xl flex items-center justify-center text-white font-black text-lg ${u.role === 'teacher' ? 'bg-secondary-500' : u.role === 'admin' ? 'bg-accent-500' : 'bg-primary-500'}`}>
                        {u.name[0]}
                      </div>
                      <div>
                        <p className="font-black text-gray-800">{u.name}</p>
                        <p className="text-gray-400 flex items-center gap-1 text-sm"><Mail className="w-3 h-3" /> {u.email}</p>
                      </div>
                    </div>
                  </td>
                  <td className="px-8 py-6 font-bold uppercase tracking-widest text-xs">
                     <span className={`px-4 py-1 rounded-full ${u.role === 'teacher' ? 'text-secondary-600 bg-secondary-50' : u.role === 'admin' ? 'text-accent-600 bg-accent-50' : 'text-primary-600 bg-primary-50'}`}>
                        {u.role}
                     </span>
                  </td>
                  <td className="px-8 py-6 font-bold">
                    {u.role === 'teacher' ? (
                      u.isApprovedTeacher ? (
                        <span className="text-green-500 flex items-center gap-2"><UserCheck className="w-4 h-4" /> Approved</span>
                      ) : (
                        <span className="text-amber-500 flex items-center gap-2 animate-pulse"><UserX className="w-4 h-4" /> Pending</span>
                      )
                    ) : (
                      <span className="text-gray-400">—</span>
                    )}
                  </td>
                  <td className="px-8 py-6 text-right">
                    <div className="flex items-center justify-end gap-3 opacity-0 group-hover:opacity-100 transition-opacity">
                      {u.role === 'teacher' && !u.isApprovedTeacher && (
                        <Button size="sm" variant="secondary" onClick={() => approveTeacher(u._id)} className="font-black text-xs uppercase px-4">Approve</Button>
                      )}
                      <Button size="sm" variant="outline" className="text-red-500 border-red-500 hover:bg-red-50 p-2"><Trash2 className="w-4 h-4" /></Button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </main>
    </div>
  );
}
