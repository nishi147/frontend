"use client";

import React, { useState, useEffect } from 'react';
import { DashboardLayout } from '@/components/layout/DashboardLayout';
import { Card, CardContent } from '@/components/ui/Card';
import axios from 'axios';
import { Calendar, MapPin, Link as LinkIcon } from 'lucide-react';

export default function StudentWorkshops() {
  const { token, logout } = useAuth();
  const [bookings, setBookings] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchMyWorkshops = async () => {
      if (!token) {
          setLoading(false);
          return;
      }

      try {
        const res = await axios.get(`${process.env.NEXT_PUBLIC_API_URL}/api/workshops/my-workshops`, {
          headers: {
            Authorization: `Bearer ${token}`
          }
        });
        if (res.data.success) {
          setBookings(res.data.data);
        }
      } catch (error: any) {
        console.error("Error fetching my workshops:", error);
        if (error.response?.status === 401) {
          logout();
        }
      } finally {
        setLoading(false);
      }
    };
    fetchMyWorkshops();
  }, [token]);

  return (
    <DashboardLayout allowedRoles={['student']}>
      <div className="mb-8">
        <h1 className="text-3xl md:text-4xl font-black text-slate-800">My Workshops 🎟️</h1>
        <p className="text-gray-500 font-bold mt-2">Access your booked live events, bootcamps, and joining links here.</p>
      </div>

      {loading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {[1, 2, 3].map(i => (
            <div key={i} className="h-80 rounded-[2.5rem] bg-gray-200 animate-pulse" />
          ))}
        </div>
      ) : bookings.length === 0 ? (
        <Card className="p-16 text-center border-none shadow-[0_8px_30px_rgb(0,0,0,0.06)] rounded-[2.5rem] bg-white">
          <div className="text-6xl mb-6">🎪</div>
          <h2 className="text-2xl font-black text-slate-800 mb-2">No Workshops Yet</h2>
          <p className="text-gray-500 font-bold mb-8">You haven't booked any workshops or bootcamps yet.</p>
        </Card>
      ) : (
        <div className="grid grid-cols-1 xl:grid-cols-2 2xl:grid-cols-3 gap-8">
          {bookings.map((booking: any) => {
            const ws = booking.workshop;
            if (!ws) return null; // Defensive check if workshop was deleted

            return (
              <Card key={booking._id} className="relative group overflow-visible border-none shadow-[0_8px_30px_rgb(0,0,0,0.06)] hover:shadow-[0_8px_30px_rgb(0,0,0,0.12)] rounded-[2.5rem] transition-all duration-500 bg-white">
                <div className={`h-40 relative overflow-hidden flex flex-col items-center justify-center p-6 transition-all duration-700 ${booking.isTrial ? 'bg-gradient-to-br from-[#FF9F43] to-[#FF6B6B]' : 'bg-gradient-to-br from-[#6C5CE7] to-[#FD79A8]'} rounded-t-[2.5rem]`}>
                  <div className="relative z-10 flex flex-col items-center text-center transform group-hover:scale-105 transition-transform duration-500">
                    <div className="text-5xl mb-2 filter drop-shadow-[0_8px_8px_rgba(0,0,0,0.3)]">
                      {booking.isTrial ? '✨' : 
                       ws.title.toLowerCase().includes('space') ? '🚀' : 
                       ws.title.toLowerCase().includes('robot') ? '🤖' : 
                       ws.title.toLowerCase().includes('art') ? '🎨' : '🎟️'}
                    </div>
                    <div className="flex gap-2">
                        <div className="px-3 py-1 bg-white/20 backdrop-blur-md rounded-xl border border-white/20">
                            <span className="text-[10px] font-black text-white uppercase tracking-[0.2em]">{booking.status || 'Active'}</span>
                        </div>
                        {booking.isTrial && (
                            <div className="px-3 py-1 bg-yellow-400 rounded-xl shadow-lg border border-yellow-300">
                                <span className="text-[10px] font-black text-slate-800 uppercase tracking-[0.2em]">Trial Session</span>
                            </div>
                        )}
                    </div>
                  </div>
                </div>

                <CardContent className="p-8">
                  <h3 className="text-xl font-black text-slate-800 uppercase tracking-wide mb-1 line-clamp-1">{ws.title}</h3>
                  <p className="text-gray-500 font-bold text-xs uppercase tracking-widest mb-6 line-clamp-1">Purchased on {new Date(booking.createdAt).toLocaleDateString()}</p>
                  
                  <div className="space-y-4 mb-8">
                    <div className="flex items-center gap-4 text-slate-700">
                      <div className="w-10 h-10 rounded-full bg-teal-50 flex items-center justify-center shrink-0">
                        <Calendar size={18} className="text-teal-600" />
                      </div>
                      <div>
                        <p className="text-[10px] text-gray-400 font-bold uppercase tracking-wider">Date</p>
                        <p className="font-black text-[14px]">{new Date(ws.date).toLocaleDateString('en-IN', { day: 'numeric', month: 'long', year: 'numeric' })}</p>
                      </div>
                    </div>

                    <div className="flex items-center gap-4 text-slate-700">
                      <div className="w-10 h-10 rounded-full bg-teal-50 flex items-center justify-center shrink-0">
                        <MapPin size={18} className="text-teal-600" />
                      </div>
                      <div>
                        <p className="text-[10px] text-gray-400 font-bold uppercase tracking-wider">Venue</p>
                        <p className="font-black text-[14px] uppercase line-clamp-1">{ws.venue}</p>
                      </div>
                    </div>
                  </div>

                  {ws.meetingLink ? (
                    <a 
                      href={ws.meetingLink} 
                      target="_blank" 
                      rel="noopener noreferrer" 
                      className="w-full py-4 rounded-full font-black text-[15px] bg-[#6C5CE7] hover:bg-indigo-600 text-white shadow-lg shadow-indigo-500/30 transition-all flex items-center justify-center gap-2"
                    >
                      <LinkIcon size={18} /> Join Meeting Now
                    </a>
                  ) : (
                    <div className="w-full py-4 rounded-full font-black text-[14px] bg-gray-50 text-gray-400 border-2 border-dashed border-gray-200 flex items-center justify-center gap-2">
                      <LinkIcon size={18} /> No link provided yet
                    </div>
                  )}
                </CardContent>
              </Card>
            );
          })}
        </div>
      )}
    </DashboardLayout>
  );
}
