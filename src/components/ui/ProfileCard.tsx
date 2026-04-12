"use client";

import React, { useState, useRef } from 'react';
import { useAuth } from '@/context/AuthContext';
import { useToast } from '@/context/ToastContext';
import api from '@/utils/api';
import { Camera, Pencil, User, Phone, Mail, BookOpen, X, Check, Loader2 } from 'lucide-react';

// Premium cartoon avatars for students (using DiceBear)
const getStudentAvatar = (name: string) => {
  // Using 'avataaars' for a nice cartoon look. 
  // 'adventurer' or 'notionists' are also good options.
  const seed = encodeURIComponent(name || 'RuzannStudent');
  return `https://api.dicebear.com/7.x/avataaars/svg?seed=${seed}&backgroundColor=b6e3f4,c0aede,d1d4f9`;
};

interface ProfileCardProps {
  isTeacher?: boolean;
}

export default function ProfileCard({ isTeacher = false }: ProfileCardProps) {
  const { user, login } = useAuth();
  const { showToast } = useToast();
  const fileRef = useRef<HTMLInputElement>(null);

  const [editing, setEditing] = useState(false);
  const [saving, setSaving] = useState(false);
  const [preview, setPreview] = useState<string | null>(null);
  const [file, setFile] = useState<File | null>(null);

  const [form, setForm] = useState({
    name: user?.name || '',
    phone: (user as any)?.phone || '',
    bio: (user as any)?.bio || '',
    specialization: (user as any)?.specialization || '',
  });

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const f = e.target.files?.[0];
    if (!f) return;
    setFile(f);
    setPreview(URL.createObjectURL(f));
  };

  const handleSave = async () => {
    setSaving(true);
    try {
      const formData = new FormData();
      formData.append('name', form.name);
      formData.append('phone', form.phone);
      formData.append('bio', form.bio);
      if (isTeacher) formData.append('specialization', form.specialization);
      if (file) formData.append('profilePicture', file);

      const res = await api.put('/api/users/me', formData, {
        headers: { 'Content-Type': 'multipart/form-data' }
      });

      if (res.data.success) {
        // Update auth context with new user data (reuse existing token)
        const token = localStorage.getItem('token') || '';
        login(token, { ...user, ...res.data.data });
        showToast('Profile updated successfully!', 'success');
        setEditing(false);
        setPreview(null);
        setFile(null);
      }
    } catch (err: any) {
      showToast(err.response?.data?.message || 'Failed to update profile.', 'error');
    } finally {
      setSaving(false);
    }
  };

  const handleCancel = () => {
    setEditing(false);
    setPreview(null);
    setFile(null);
    setForm({
      name: user?.name || '',
      phone: (user as any)?.phone || '',
      bio: (user as any)?.bio || '',
      specialization: (user as any)?.specialization || '',
    });
  };

  const profilePic = preview || (user as any)?.profilePicture;
  const hasProfilePic = !!profilePic;

  return (
    <div className="bg-white rounded-[2rem] shadow-sm border border-gray-100 overflow-hidden">
      {/* Header Banner */}
      <div className={`h-20 ${isTeacher ? 'bg-gradient-to-r from-emerald-400 to-teal-500' : 'bg-gradient-to-r from-primary-400 to-purple-500'} relative`}>
        <div className="absolute inset-0 opacity-20" style={{ backgroundImage: 'radial-gradient(circle, white 1px, transparent 1px)', backgroundSize: '20px 20px' }} />
      </div>

      <div className="px-6 pb-6">
        {/* Avatar */}
        <div className="flex items-end justify-between -mt-10 mb-4">
          <div className="relative">
            {hasProfilePic ? (
              <img
                src={profilePic}
                alt={user?.name}
                className="w-20 h-20 rounded-2xl object-cover border-4 border-white shadow-lg"
              />
            ) : isTeacher ? (
              <div className="w-20 h-20 rounded-2xl bg-gradient-to-br from-emerald-100 to-teal-100 border-4 border-white shadow-lg flex items-center justify-center">
                <User className="w-10 h-10 text-emerald-500" />
              </div>
            ) : (
              <img 
                src={getStudentAvatar(user?.name || '')}
                alt="Avatar"
                className="w-20 h-20 rounded-2xl border-4 border-white shadow-lg bg-white"
              />
            )}

            {/* Camera button */}
            {editing && (
              <button
                onClick={() => fileRef.current?.click()}
                className="absolute -bottom-1 -right-1 w-7 h-7 bg-gray-900 rounded-xl flex items-center justify-center shadow-lg hover:bg-gray-700 transition-colors"
              >
                <Camera className="w-3.5 h-3.5 text-white" />
              </button>
            )}
            <input ref={fileRef} type="file" accept="image/*" className="hidden" onChange={handleFileChange} />
          </div>

          {/* Edit / Save buttons */}
          <div className="flex gap-2 mt-10">
            {!editing ? (
              <button
                onClick={() => setEditing(true)}
                className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-gray-100 hover:bg-gray-200 text-gray-700 font-bold text-sm transition-all"
              >
                <Pencil className="w-3.5 h-3.5" /> Edit Profile
              </button>
            ) : (
              <>
                <button onClick={handleCancel} className="flex items-center gap-1 px-3 py-2 rounded-xl border-2 border-gray-200 text-gray-500 font-bold text-sm hover:bg-gray-50 transition-all">
                  <X className="w-3.5 h-3.5" /> Cancel
                </button>
                <button
                  onClick={handleSave}
                  disabled={saving}
                  className={`flex items-center gap-1 px-4 py-2 rounded-xl font-bold text-sm text-white transition-all ${isTeacher ? 'bg-emerald-500 hover:bg-emerald-600' : 'bg-primary-500 hover:bg-primary-600'}`}
                >
                  {saving ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <Check className="w-3.5 h-3.5" />}
                  {saving ? 'Saving...' : 'Save'}
                </button>
              </>
            )}
          </div>
        </div>

        {/* Name */}
        {editing ? (
          <input
            value={form.name}
            onChange={e => setForm({ ...form, name: e.target.value })}
            className="text-xl font-black text-gray-900 w-full border-b-2 border-primary-300 focus:outline-none bg-transparent mb-1 pb-1"
            placeholder="Your name"
          />
        ) : (
          <h3 className="text-xl font-black text-gray-900 mb-0.5">{user?.name}</h3>
        )}

        <span className={`inline-block text-[10px] font-black uppercase tracking-widest px-2.5 py-1 rounded-full mb-3 ${isTeacher ? 'bg-emerald-100 text-emerald-700' : 'bg-primary-100 text-primary-700'}`}>
          {isTeacher ? '👩‍🏫 Teacher' : '🎓 Student'}
        </span>

        {/* Fields */}
        <div className="space-y-3">
          {/* Email (read-only always) */}
          <div className="flex items-center gap-3 text-sm">
            <div className="w-8 h-8 bg-gray-50 rounded-xl flex items-center justify-center flex-shrink-0">
              <Mail className="w-4 h-4 text-gray-400" />
            </div>
            <span className="text-gray-500 font-medium">{user?.email}</span>
          </div>

          {/* Phone */}
          <div className="flex items-center gap-3 text-sm">
            <div className="w-8 h-8 bg-gray-50 rounded-xl flex items-center justify-center flex-shrink-0">
              <Phone className="w-4 h-4 text-gray-400" />
            </div>
            {editing ? (
              <input
                value={form.phone}
                maxLength={10}
                onChange={e => setForm({ ...form, phone: e.target.value.replace(/\D/g, '').slice(0, 10) })}
                className="flex-1 border-b border-gray-200 focus:outline-none focus:border-primary-400 text-gray-700 font-medium bg-transparent text-sm py-0.5"
                placeholder="10-digit mobile number"
              />
            ) : (
              <span className="text-gray-700 font-medium">{(user as any)?.phone || <span className="text-gray-300 italic">Not set</span>}</span>
            )}
          </div>

          {/* Bio */}
          <div className="flex items-start gap-3 text-sm">
            <div className="w-8 h-8 bg-gray-50 rounded-xl flex items-center justify-center flex-shrink-0 mt-0.5">
              <BookOpen className="w-4 h-4 text-gray-400" />
            </div>
            {editing ? (
              <textarea
                value={form.bio}
                onChange={e => setForm({ ...form, bio: e.target.value })}
                rows={2}
                className="flex-1 border border-gray-200 rounded-xl focus:outline-none focus:border-primary-400 text-gray-700 font-medium bg-gray-50 text-sm p-2 resize-none"
                placeholder={isTeacher ? 'About yourself...' : 'Tell something cool about yourself!'}
              />
            ) : (
              <span className="text-gray-600 font-medium leading-relaxed">
                {(user as any)?.bio || <span className="text-gray-300 italic">{isTeacher ? 'No bio yet.' : 'No bio yet. Add one!'}</span>}
              </span>
            )}
          </div>

          {/* Specialization — teacher only */}
          {isTeacher && (
            <div className="flex items-center gap-3 text-sm">
              <div className="w-8 h-8 bg-gray-50 rounded-xl flex items-center justify-center flex-shrink-0">
                <span className="text-base">🧠</span>
              </div>
              {editing ? (
                <input
                  value={form.specialization}
                  onChange={e => setForm({ ...form, specialization: e.target.value })}
                  className="flex-1 border-b border-gray-200 focus:outline-none focus:border-emerald-400 text-gray-700 font-medium bg-transparent text-sm py-0.5"
                  placeholder="e.g. Coding, Math, Robotics"
                />
              ) : (
                <span className="text-gray-700 font-medium">
                  {(user as any)?.specialization || <span className="text-gray-300 italic">No specialization set</span>}
                </span>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
