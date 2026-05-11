"use client";

import React, { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { Header } from '@/components/layout/Header';
import { Footer } from '@/components/layout/Footer';
import { Button } from '@/components/ui/Button';
import { Card, CardContent } from '@/components/ui/Card';
import { ScrollToTop } from '@/components/ui/ScrollToTop';
import api from '@/utils/api';
import { getThumbnailUrl } from '@/utils/image';
import { Star, BookOpen, Mail, Award, ArrowLeft, Calendar, MapPin, Rocket, Sparkles } from 'lucide-react';
import CourseCard from '@/components/ui/CourseCard';
import Link from 'next/link';

export default function TeacherDetailPage() {
  const { id } = useParams();
  const router = useRouter();
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchTeacherDetail = async () => {
      try {
        const res = await api.get(`/api/mentors/${id}`);
        if (res.data.success) {
          setData(res.data.data);
        } else {
          setError("Failed to load mentor details");
        }
      } catch (err: any) {
        console.error("Error fetching mentor detail:", err);
        setError(err.response?.data?.message || "Something went wrong while fetching mentor details");
      } finally {
        setLoading(false);
      }
    };

    if (id) fetchTeacherDetail();
  }, [id]);

  if (loading) {
    return (
      <div className="min-h-screen bg-white">
        <Header />
        <div className="max-w-7xl mx-auto px-4 py-20 animate-pulse">
           <div className="h-96 bg-gray-100 rounded-[3rem] mb-12" />
           <div className="h-64 bg-gray-50 rounded-[2.5rem] mb-12" />
           <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {[1,2,3].map(i => <div key={i} className="h-80 bg-gray-50 rounded-[2rem]" />)}
           </div>
        </div>
        <Footer />
      </div>
    );
  }

  if (error || !data) {
    return (
      <div className="min-h-screen bg-white flex flex-col">
        <Header />
        <div className="flex-1 flex flex-col items-center justify-center p-4 text-center">
           <div className="text-6xl mb-6">🔍</div>
           <h1 className="text-3xl font-black text-slate-800 mb-4">{error || "Mentor Not Found"}</h1>
           <p className="text-slate-500 font-bold mb-8">The mentor you're looking for might have vanished into a different dimension!</p>
           <Button onClick={() => router.push('/teachers')} className="rounded-2xl px-10 py-6 bg-primary-500 text-white font-black">
              Back to Mentors
           </Button>
        </div>
        <Footer />
      </div>
    );
  }

  const { profile, courses, workshops, bootcamps } = data;
  const bgColors = ['bg-blue-50', 'bg-purple-50', 'bg-green-50', 'bg-yellow-50', 'bg-red-50', 'bg-orange-50'];
  const bgColor = bgColors[Math.floor(Math.random() * bgColors.length)];

  return (
    <div className="min-h-screen bg-white flex flex-col font-sans overflow-hidden">
      <Header />
      
      <main className="flex-1">
        {/* Profile Header */}
        <section className={`relative pt-12 pb-24 px-4 ${bgColor} overflow-hidden`}>
           {/* Decorative Elements */}
           <div className="absolute top-0 right-0 w-96 h-96 bg-white/20 rounded-full blur-3xl -mr-48 -mt-48" />
           <div className="absolute bottom-0 left-0 w-96 h-96 bg-primary-200/20 rounded-full blur-3xl -ml-48 -mb-48" />
           
           <div className="max-w-6xl mx-auto relative z-10">
              <button 
                onClick={() => router.back()}
                className="flex items-center gap-2 font-black text-slate-500 hover:text-primary-600 transition-colors mb-8 group"
              >
                <ArrowLeft size={20} className="group-hover:-translate-x-1 transition-transform" /> Back
              </button>

              <div className="flex flex-col lg:flex-row items-center gap-12">
                 <div className="relative">
                    <div className="w-48 h-48 md:w-64 md:h-64 rounded-[3rem] bg-white p-2 shadow-2xl rotate-3">
                       <div className="w-full h-full rounded-[2.5rem] overflow-hidden bg-slate-100 flex items-center justify-center relative">
                          {profile.profilePicture ? (
                            <img 
                              src={getThumbnailUrl(profile.profilePicture)} 
                              alt={profile.name} 
                              className="w-full h-full object-cover" 
                            />
                          ) : (
                            <span className="text-7xl font-black text-primary-500 font-baloo">{profile.name[0]}</span>
                          )}
                       </div>
                    </div>
                    {/* Badge */}
                    <div className="absolute -bottom-4 -right-4 bg-yellow-400 text-white p-4 rounded-3xl shadow-xl -rotate-12 animate-wiggle">
                       <Award size={32} />
                    </div>
                 </div>

                 <div className="flex-1 text-center lg:text-left">
                    <div className="inline-block px-4 py-2 bg-white rounded-full text-primary-600 text-xs font-black uppercase tracking-widest shadow-sm mb-4">
                       Verified Expert Mentor
                    </div>
                    <h1 className="text-4xl md:text-7xl font-black text-slate-900 mb-4 tracking-tight leading-tight">
                       {profile.name}
                    </h1>
                    <p className="text-xl md:text-2xl font-bold text-slate-600 mb-8 max-w-2xl leading-relaxed">
                       {profile.specialization || "Magic Learning Guide"}
                    </p>
                    
                     {/* Stats will be shown when real data is available via admin/student reviews */}
                     <div className="flex flex-wrap justify-center lg:justify-start gap-4">
                        {courses.length > 0 && (
                           <div className="flex items-center gap-3 bg-white/60 backdrop-blur-sm px-6 py-4 rounded-3xl border border-white/40 shadow-sm">
                              <BookOpen className="text-secondary-500" />
                              <div className="text-left">
                                 <p className="text-xs font-black text-slate-400 uppercase tracking-tighter">Courses</p>
                                 <p className="text-lg font-black text-slate-900">{courses.length}</p>
                              </div>
                           </div>
                        )}
                        {profile.specialization && (
                           <div className="flex items-center gap-3 bg-white/60 backdrop-blur-sm px-6 py-4 rounded-3xl border border-white/40 shadow-sm">
                              <Star className="text-yellow-400" fill="currentColor" />
                              <div className="text-left">
                                 <p className="text-xs font-black text-slate-400 uppercase tracking-tighter">Expertise</p>
                                 <p className="text-lg font-black text-slate-900">{profile.specialization}</p>
                              </div>
                           </div>
                        )}
                     </div>
                 </div>
              </div>
           </div>
        </section>

        {/* Bio Section */}
        <section className="py-20 px-4 max-w-4xl mx-auto">
           <div className="bg-white p-8 md:p-12 rounded-[3rem] border border-slate-50 shadow-xl shadow-slate-100/50 relative">
              <div className="absolute -top-10 left-12 w-20 h-20 bg-primary-500 rounded-3xl flex items-center justify-center text-white text-4xl shadow-xl">
                 ✨
              </div>
              <h2 className="text-3xl font-black text-slate-900 mb-8 tracking-tight">Meet the Expert!</h2>
              <div className="text-lg md:text-xl text-slate-600 font-bold leading-relaxed space-y-6">
                 {profile.bio ? (
                    profile.bio.split('\n').map((para: string, i: number) => (
                       <p key={i}>{para}</p>
                    ))
                 ) : (
                    <p>Welcome! I'm {profile.name}, a passionate mentor dedicated to helping young minds explore the wonders of technology and creativity. Join me in my sessions to start your magical learning journey!</p>
                 )}
              </div>
           </div>
        </section>

        {/* Courses Section */}
        {courses.length > 0 && (
           <section className="py-20 px-4 bg-slate-50">
              <div className="max-w-7xl mx-auto">
                 <div className="flex items-end justify-between mb-12">
                    <div>
                       <h2 className="text-3xl md:text-5xl font-black text-slate-900 tracking-tight mb-4">Courses by <span className="text-primary-500">{profile.name.split(' ')[0]}</span></h2>
                       <p className="text-slate-500 font-bold text-lg">Detailed long-term programs created by this expert.</p>
                    </div>
                    <Link href="/courses">
                       <Button variant="outline" className="hidden md:flex rounded-2xl font-black border-2">Explore All Courses</Button>
                    </Link>
                 </div>
                 
                 <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                    {courses.map((course: any) => (
                       <CourseCard key={course._id} course={course} className="hover:-translate-y-2 transition-transform duration-300" />
                    ))}
                 </div>
              </div>
           </section>
        )}

        {/* Workshops & Bootcamps Section */}
        {(workshops.length > 0 || bootcamps.length > 0) && (
           <section className="py-24 px-4 max-w-7xl mx-auto">
              <div className="text-center mb-16">
                 <h2 className="text-3xl md:text-5xl font-black text-slate-900 tracking-tight mb-4">Upcoming <span className="text-secondary-500">Live</span> Events 🎟️</h2>
                 <p className="text-slate-500 font-bold text-lg">Join live sessions and interactive bootcamps hosted by {profile.name}.</p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                 {bootcamps.map((bc: any) => (
                    <Link key={bc._id} href="/#bootcamps" className="block group">
                     <Card className="h-full border border-gray-100 rounded-[2.5rem] shadow-sm hover:shadow-2xl transition-all duration-500 flex flex-col bg-white overflow-hidden relative border-t-8 border-t-indigo-500 hover:-translate-y-2 cursor-pointer">
                        <CardContent className="p-8 flex flex-col h-full">
                           <div className="flex justify-between items-start mb-6">
                              <div className="w-16 h-16 bg-indigo-50 rounded-2xl flex items-center justify-center text-4xl">
                                 🚀
                              </div>
                              <div className="bg-indigo-100 text-indigo-700 px-3 py-1.5 rounded-full text-[10px] font-black uppercase tracking-widest">
                                 Bootcamp
                              </div>
                           </div>
                           
                           <h3 className="text-2xl font-black text-slate-900 mb-4 line-clamp-2">{bc.title}</h3>
                           <div className="space-y-3 mb-8 text-slate-500 font-bold">
                              <div className="flex items-center gap-3">
                                 <Calendar size={18} className="text-indigo-400" />
                                 <span>{new Date(bc.date).toLocaleDateString('en-IN', { day: 'numeric', month: 'long' })}</span>
                              </div>
                              <div className="flex items-center gap-3 text-sm">
                                 <Rocket size={18} className="text-indigo-400" />
                                 <span>Intensive Masterclass</span>
                              </div>
                           </div>

                           <div className="mt-auto pt-6 border-t border-slate-50 flex items-center justify-between">
                              <div className="text-2xl font-black text-slate-900">₹{bc.price}</div>
                              <div className="bg-primary-500 text-white px-4 py-2 rounded-2xl font-black text-sm group-hover:bg-primary-600 transition-colors">Go Live →</div>
                           </div>
                        </CardContent>
                     </Card>
                    </Link>
                 ))}

                 {workshops.map((ws: any) => (
                    <Link key={ws._id} href="/#workshops" className="block group">
                     <Card className="h-full border border-gray-100 rounded-[2.5rem] shadow-sm hover:shadow-2xl transition-all duration-500 flex flex-col bg-white overflow-hidden relative border-t-8 border-t-accent-500 hover:-translate-y-2 cursor-pointer">
                        <CardContent className="p-8 flex flex-col h-full">
                           <div className="flex justify-between items-start mb-6">
                              <div className="w-16 h-16 bg-accent-50 rounded-2xl flex items-center justify-center text-4xl">
                                 🎟️
                              </div>
                              <div className="bg-accent-100 text-accent-700 px-3 py-1.5 rounded-full text-[10px] font-black uppercase tracking-widest">
                                 Workshop
                              </div>
                           </div>
                           
                           <h3 className="text-2xl font-black text-slate-900 mb-4 line-clamp-2">{ws.title}</h3>
                           <div className="space-y-3 mb-8 text-slate-500 font-bold">
                              <div className="flex items-center gap-3">
                                 <Calendar size={18} className="text-accent-400" />
                                 <span>{new Date(ws.date).toLocaleDateString('en-IN', { day: 'numeric', month: 'long' })}</span>
                              </div>
                              <div className="flex items-center gap-3">
                                 <MapPin size={18} className="text-accent-400" />
                                 <span>{ws.venue}</span>
                              </div>
                           </div>

                           <div className="mt-auto pt-6 border-t border-slate-50 flex items-center justify-between">
                              <div className="text-2xl font-black text-slate-900">₹{ws.price}</div>
                              <div className="bg-primary-500 text-white px-4 py-2 rounded-2xl font-black text-sm group-hover:bg-primary-600 transition-colors">Book Seat →</div>
                           </div>
                        </CardContent>
                     </Card>
                    </Link>
                 ))}
              </div>
           </section>
        )}

        {/* CTA Section */}
        <section className="py-24 px-4">
           <div className="max-w-5xl mx-auto bg-navy-900 rounded-[4rem] p-12 md:p-20 text-center relative overflow-hidden shadow-2xl">
              <div className="absolute top-0 right-0 w-96 h-96 bg-primary-600/20 rounded-full blur-3xl -mr-48 -mt-48" />
              <div className="absolute bottom-0 left-0 w-96 h-96 bg-secondary-600/20 rounded-full blur-3xl -ml-48 -mb-48" />
              
              <div className="relative z-10">
                 <h2 className="text-3xl md:text-6xl font-black text-white mb-6 leading-tight">
                    Want to learn from <br/><span className="text-primary-400 font-baloo">{profile.name}</span>?
                 </h2>
                 <p className="text-xl text-slate-400 font-bold mb-10 max-w-2xl mx-auto leading-relaxed">
                    Book a free demo session today and experience the magic of learning with our verified experts.
                 </p>
                 <Link href="/courses">
                    <Button className="bg-primary-500 hover:bg-primary-600 text-white rounded-3xl px-12 py-8 text-2xl font-black shadow-xl shadow-primary-500/30 transition-all hover:scale-105">
                       Start Your Adventure! 🚀
                    </Button>
                 </Link>
              </div>
           </div>
        </section>
      </main>

      <Footer />
      <ScrollToTop />
    </div>
  );
}
