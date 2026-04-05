"use client";

import React, { useEffect, useState } from 'react';
import { DashboardLayout } from '@/components/layout/DashboardLayout';
import { Card, CardContent } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import api from '@/utils/api';
import { Calendar, MapPin, Tag, Link as LinkIcon, Clock, Sparkles, Rocket } from 'lucide-react';
import Link from 'next/link';

export default function StudentBootcamps() {
  const [bootcampBookings, setBootcampBookings] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchMyBootcamps = async () => {
      try {
        const res = await api.get('/api/bootcamps/my-bootcamps');
        if (res.data.success) {
          setBootcampBookings(res.data.data);
        }
      } catch (error) {
        console.error("Error fetching my bootcamps:", error);
      } finally {
        setIsLoading(false);
      }
    };
    fetchMyBootcamps();
  }, []);

  return (
    <DashboardLayout allowedRoles={['student']}>
      <div className="mb-10">
        <h1 className="text-3xl md:text-4xl font-black text-slate-800">My Bootcamps 🎓</h1>
        <p className="text-slate-500 font-bold">Your intense learning journeys and upcoming sessions.</p>
      </div>

      {isLoading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
           {[1, 2, 3].map(i => <div key={i} className="h-64 rounded-[2.5rem] bg-slate-100 animate-pulse" />)}
        </div>
      ) : bootcampBookings.length === 0 ? (
        <Card className="bg-white border-2 border-dashed border-slate-200 rounded-[3rem] p-16 text-center">
           <div className="text-6xl mb-6">🚀</div>
           <h3 className="text-2xl font-black text-slate-800 mb-2">No Bootcamps Joined Yet</h3>
           <p className="text-slate-500 font-bold mb-8">Ready to take your skills to the next level?</p>
           <Link href="/#bootcamps">
             <Button className="bg-indigo-600 hover:bg-indigo-700 px-10 py-6 rounded-2xl font-black text-lg shadow-xl shadow-indigo-100">
                Explore Bootcamps →
             </Button>
           </Link>
        </Card>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {bootcampBookings.map((booking: any) => {
            const bc = booking.bootcamp;
            if (!bc) return null;

            return (
              <Card key={booking._id} className="relative group overflow-hidden border-none shadow-sm hover:shadow-xl rounded-[2.5rem] transition-all duration-500 bg-white">
                <div className="h-40 bg-indigo-600 relative flex items-center justify-center overflow-hidden">
                   <div className="text-white opacity-10 font-black text-6xl uppercase tracking-tighter">ENROLLED</div>
                   <div className="absolute inset-0 flex items-center justify-center text-7xl group-hover:scale-110 transition-transform duration-500">🎓</div>
                </div>

                <CardContent className="p-8">
                   <div className="flex items-center gap-2 mb-3">
                      <span className="px-3 py-1 bg-green-50 text-green-600 rounded-full text-[10px] font-black uppercase tracking-widest border border-green-100">Active Enrollment</span>
                   </div>
                   <h3 className="text-xl font-black text-slate-800 uppercase tracking-wide mb-1 leading-tight">{bc.title}</h3>
                   <p className="text-slate-400 font-bold text-[10px] uppercase tracking-widest mb-6">By {bc.instructor?.name || 'Top Mentor'}</p>

                   <div className="space-y-4 mb-8">
                      <div className="flex items-center gap-4 text-slate-600">
                        <div className="w-10 h-10 rounded-full bg-slate-50 flex items-center justify-center shrink-0">
                           <Calendar size={18} className="text-slate-400" />
                        </div>
                        <div>
                           <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Duration</p>
                           <p className="font-bold text-sm">{new Date(bc.date).toLocaleDateString()} - {new Date(bc.endDate).toLocaleDateString()}</p>
                        </div>
                      </div>
                      <div className="flex items-center gap-4 text-slate-600">
                        <div className="w-10 h-10 rounded-full bg-slate-50 flex items-center justify-center shrink-0">
                           <MapPin size={18} className="text-slate-400" />
                        </div>
                        <div>
                           <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Venue</p>
                           <p className="font-bold text-sm uppercase">{bc.venue}</p>
                        </div>
                      </div>
                   </div>

                   {bc.meetingLink ? (
                      <a href={bc.meetingLink} target="_blank" rel="noopener noreferrer" className="block">
                         <Button className="w-full py-6 rounded-2xl font-black text-lg bg-indigo-600 hover:bg-indigo-700 shadow-xl shadow-indigo-100 flex items-center justify-center gap-2">
                            <LinkIcon size={20} /> Join Session
                         </Button>
                      </a>
                   ) : (
                      <Button disabled className="w-full py-6 rounded-2xl font-black text-lg bg-slate-100 text-slate-400 border-none">
                         Link Not Ready Yet
                      </Button>
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
