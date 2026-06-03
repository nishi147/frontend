"use client";

import React, { useEffect, useState, useMemo } from 'react';
import Link from 'next/link';
import { DashboardLayout } from '@/components/layout/DashboardLayout';
import { Card, CardContent } from '@/components/ui/Card';
import api from '@/utils/api';
import { questions, Question } from '@/app/ai-quiz/components/questions';
import {
  Brain,
  GraduationCap,
  Target,
  Users,
  Search,
  Filter,
  ChevronLeft,
  ChevronRight,
  Phone,
  Mail,
  MapPin,
  Sparkles,
  Award,
  TrendingUp,
  X,
  Clock,
  ArrowUpRight,
  ExternalLink,
  CheckCircle2,
  Calendar,
  Layers,
  HelpCircle
} from 'lucide-react';
import { useToast } from '@/context/ToastContext';

interface TimelineDataPoint {
  _id: string;
  count: number;
  avgScore: number;
}

interface AssessmentSubmissionData {
  _id: string;
  parentName: string;
  mobile: string;
  email?: string;
  studentName: string;
  age: number;
  class: string;
  city: string;
  answers: Record<string, string>;
  score: number;
  category: 'Future Innovator' | 'AI Explorer' | 'Creative Problem Solver' | 'Future Starter';
  recommendedProgram: string;
  submittedAt: string;
}

interface AnalyticsData {
  totalSubmissions: number;
  averageScore: number;
  highPotentialCount: number;
  categoryStats: { _id: string; count: number }[];
  programStats: { _id: string; count: number }[];
  classStats: { _id: string; count: number }[];
  cityStats: { _id: string; count: number }[];
  ageStats: { _id: number; count: number }[];
  timelineStats: TimelineDataPoint[];
}

export default function AIQuizAnalyticsPage() {
  const { showToast } = useToast();
  const [analytics, setAnalytics] = useState<AnalyticsData | null>(null);
  const [submissions, setSubmissions] = useState<AssessmentSubmissionData[]>([]);
  const [loadingAnalytics, setLoadingAnalytics] = useState(true);
  const [loadingSubmissions, setLoadingSubmissions] = useState(true);
  
  // Search & Filter state
  const [search, setSearch] = useState('');
  const [debouncedSearch, setDebouncedSearch] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('');
  const [programFilter, setProgramFilter] = useState('');
  const [classFilter, setClassFilter] = useState('');
  const [scoreRange, setScoreRange] = useState('');

  // Pagination state
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalSubmissionsList, setTotalSubmissionsList] = useState(0);

  // Modal / Detail state
  const [selectedSubmission, setSelectedSubmission] = useState<AssessmentSubmissionData | null>(null);
  const [showDetailModal, setShowDetailModal] = useState(false);

  // Debounce search input
  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearch(search);
      setPage(1);
    }, 400);
    return () => clearTimeout(timer);
  }, [search]);

  // Fetch aggregate analytics
  const fetchAnalytics = async () => {
    try {
      setLoadingAnalytics(true);
      const res = await api.get('/api/assessment-submissions/analytics');
      if (res.data.success) {
        setAnalytics(res.data.data);
      }
    } catch (err) {
      console.error("Failed to fetch assessment analytics", err);
      showToast('Could not load quiz analytics metrics.', 'error');
    } finally {
      setLoadingAnalytics(false);
    }
  };

  // Fetch submissions list with filters
  const fetchSubmissions = async () => {
    try {
      setLoadingSubmissions(true);
      
      const params: Record<string, any> = {
        page,
        limit: 10,
        search: debouncedSearch || undefined,
        category: categoryFilter || undefined,
        recommendedProgram: programFilter || undefined,
        class: classFilter || undefined,
      };

      if (scoreRange === 'high') {
        params.minScore = 75;
      } else if (scoreRange === 'medium') {
        params.minScore = 50;
        params.maxScore = 74;
      } else if (scoreRange === 'low') {
        params.maxScore = 49;
      }

      const res = await api.get('/api/assessment-submissions', { params });
      if (res.data.success) {
        setSubmissions(res.data.data);
        setTotalPages(res.data.pages);
        setTotalSubmissionsList(res.data.total);
      }
    } catch (err) {
      console.error("Failed to fetch submissions list", err);
      showToast('Could not fetch quiz submissions list.', 'error');
    } finally {
      setLoadingSubmissions(false);
    }
  };

  useEffect(() => {
    fetchAnalytics();
  }, []);

  useEffect(() => {
    fetchSubmissions();
  }, [page, debouncedSearch, categoryFilter, programFilter, classFilter, scoreRange]);

  const handleResetFilters = () => {
    setSearch('');
    setCategoryFilter('');
    setProgramFilter('');
    setClassFilter('');
    setScoreRange('');
    setPage(1);
  };

  // Render SVG Line / Area chart for Submissions Timeline
  const timelineChartData = useMemo(() => {
    if (!analytics?.timelineStats || analytics.timelineStats.length === 0) return [];
    
    // Sort timeline stats by date
    const sorted = [...analytics.timelineStats].sort((a, b) => a._id.localeCompare(b._id));
    return sorted;
  }, [analytics]);

  const maxCountValue = useMemo(() => {
    if (timelineChartData.length === 0) return 5;
    return Math.max(...timelineChartData.map(d => d.count), 5);
  }, [timelineChartData]);

  // Color mapping utilities
  const getCategoryColor = (category: string) => {
    switch (category) {
      case 'Future Innovator':
        return 'text-rose-600 bg-rose-50 border-rose-200';
      case 'AI Explorer':
        return 'text-indigo-600 bg-indigo-50 border-indigo-200';
      case 'Creative Problem Solver':
        return 'text-amber-600 bg-amber-50 border-amber-200';
      default: // Future Starter
        return 'text-emerald-600 bg-emerald-50 border-emerald-200';
    }
  };

  const getCategoryGradient = (category: string) => {
    switch (category) {
      case 'Future Innovator':
        return 'from-rose-500 to-pink-500';
      case 'AI Explorer':
        return 'from-indigo-500 to-violet-500';
      case 'Creative Problem Solver':
        return 'from-amber-500 to-orange-500';
      default: // Future Starter
        return 'from-emerald-500 to-teal-500';
    }
  };

  return (
    <DashboardLayout allowedRoles={['admin', 'sales']}>
      <div className="flex flex-col gap-10">
        
        {/* Header Breadcrumbs */}
        <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-6 px-2 sm:px-0">
          <div className="animate-in slide-in-from-left duration-700">
             <div className="flex items-center gap-2 mb-2 text-xs font-bold text-gray-400 uppercase tracking-widest">
               <Link href="/dashboard/admin" className="hover:text-primary-500 transition-colors">Admin Dashboard</Link>
               <span>/</span>
               <span className="text-gray-600">AI Quiz Funnel</span>
             </div>
             <h1 className="text-4xl md:text-5xl font-black text-gray-800 tracking-tighter leading-none">
               AI Quiz <span className="text-primary-500">Analytics</span> 📊
             </h1>
             <p className="text-gray-500 font-bold mt-2 text-sm md:text-base">
               Monitor lead captures, technological adaptation scores, and program pathways.
             </p>
          </div>
          <div className="bg-white px-6 py-4 rounded-3xl shadow-lg border border-gray-100 flex items-center gap-4 w-full lg:w-auto">
             <div className="w-3.5 h-3.5 rounded-full bg-primary-500 animate-pulse"></div>
             <span className="font-black text-gray-700 uppercase tracking-widest text-xs">
               Marketing Funnel Live
             </span>
          </div>
        </div>

        {/* KPI Grid */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-6 px-2 sm:px-0">
          <StatCard 
            title="Total submissions" 
            value={loadingAnalytics ? "..." : analytics?.totalSubmissions || 0} 
            icon={<Users className="w-7 h-7 text-indigo-500" />} 
            description="Completed assessments"
            color="bg-indigo-50"
          />
          <StatCard 
            title="Avg. Readiness Score" 
            value={loadingAnalytics ? "..." : `${analytics?.averageScore || 0}%`} 
            icon={<Brain className="w-7 h-7 text-rose-500" />} 
            description="Overall tech adaptation"
            color="bg-rose-50"
          />
          <StatCard 
            title="High-Potential Leads" 
            value={loadingAnalytics ? "..." : analytics?.highPotentialCount || 0} 
            icon={<Target className="w-7 h-7 text-amber-500" />} 
            description="Score >= 75 (Immediate Follow-up)"
            color="bg-amber-50"
          />
          <StatCard 
            title="Avg Lead Potential" 
            value={loadingAnalytics ? "..." : `${(((analytics?.highPotentialCount || 0) / (analytics?.totalSubmissions || 1)) * 100).toFixed(1)}%`} 
            icon={<TrendingUp className="w-7 h-7 text-emerald-500" />} 
            description="High potential lead ratio"
            color="bg-emerald-50"
          />
        </div>

        {/* Custom Visualizations Panel */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 px-2 sm:px-0">
          
          {/* Submissions Daily Timeline */}
          <div className="lg:col-span-2 bg-white p-8 rounded-[2.5rem] shadow-xl border border-gray-50 flex flex-col justify-between min-h-[380px]">
            <div className="flex justify-between items-center mb-6">
              <div>
                <h2 className="text-xl font-black text-gray-800 tracking-tight flex items-center gap-2">
                  <Calendar className="text-primary-500" /> Submissions Activity Timeline
                </h2>
                <p className="text-gray-400 font-bold text-xs mt-0.5">Quiz volume over the last 30 days</p>
              </div>
              <span className="bg-gray-100 text-gray-600 text-[10px] font-black px-3 py-1 rounded-full uppercase tracking-wider">
                Timeline (Count)
              </span>
            </div>

            <div className="flex-1 min-h-[200px] flex items-center justify-center relative">
              {loadingAnalytics ? (
                <div className="w-12 h-12 border-4 border-primary-500 border-t-transparent rounded-full animate-spin"></div>
              ) : (
                <div className="w-full h-full pb-6">
                  {timelineChartData.length === 0 ? (
                    <div className="h-64 flex items-center justify-center text-gray-400 font-bold uppercase tracking-widest text-xs">
                      No submissions recorded in the last 30 days
                    </div>
                  ) : (
                    <svg viewBox="0 0 600 240" className="w-full h-full overflow-visible">
                      <defs>
                        <linearGradient id="areaGradient" x1="0" y1="0" x2="0" y2="1">
                          <stop offset="0%" stopColor="#ef4444" stopOpacity="0.2" />
                          <stop offset="100%" stopColor="#ef4444" stopOpacity="0.0" />
                        </linearGradient>
                      </defs>

                      {/* Y-axis gridlines */}
                      {[0, 0.25, 0.5, 0.75, 1].map((ratio, i) => {
                        const y = 30 + ratio * 150;
                        const labelValue = Math.round(maxCountValue * (1 - ratio));
                        return (
                          <g key={i} className="opacity-40">
                            <line x1="50" y1={y} x2="560" y2={y} stroke="#f1f5f9" strokeWidth="1" strokeDasharray="4 4" />
                            <text x="35" y={y + 4} textAnchor="end" className="text-[10px] font-black fill-gray-400">{labelValue}</text>
                          </g>
                        );
                      })}

                      {/* X and Y coordinates compute */}
                      {(() => {
                        const points = timelineChartData.map((d, index) => {
                          const x = 50 + (index / (timelineChartData.length - 1 || 1)) * 510;
                          const y = 30 + 150 - (d.count / maxCountValue) * 150;
                          return { x, y, ...d };
                        });

                        const linePath = points.map((p, i) => `${i === 0 ? 'M' : 'L'} ${p.x} ${p.y}`).join(' ');
                        const areaPath = points.length > 0 
                          ? `${linePath} L ${points[points.length - 1].x} 180 L ${points[0].x} 180 Z`
                          : '';

                        return (
                          <>
                            {/* Area Fill */}
                            {areaPath && <path d={areaPath} fill="url(#areaGradient)" />}

                            {/* Main Line */}
                            {linePath && <path d={linePath} fill="none" stroke="#ef4444" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" className="drop-shadow-md" />}

                            {/* Data Point Circles */}
                            {points.map((p, i) => {
                              const dateObj = new Date(p._id);
                              const dateString = dateObj.toLocaleDateString('en-US', { day: 'numeric', month: 'short' });
                              return (
                                <g key={i} className="group cursor-pointer">
                                  <circle cx={p.x} cy={p.y} r="4.5" className="fill-white stroke-[#ef4444] stroke-2 hover:r-6 hover:stroke-width-3 transition-all" />
                                  <title>{`${dateString}: ${p.count} submissions (Avg Score: ${p.avgScore.toFixed(0)}%)`}</title>
                                </g>
                              );
                            })}

                            {/* X-axis date labels */}
                            {points.length > 1 && [0, Math.floor(points.length / 2), points.length - 1].map((index) => {
                              const p = points[index];
                              if (!p) return null;
                              const dateObj = new Date(p._id);
                              const formattedDate = dateObj.toLocaleDateString('en-US', { day: 'numeric', month: 'short' });
                              return (
                                <text key={index} x={p.x} y="205" textAnchor="middle" className="text-[10px] font-black fill-gray-400 uppercase tracking-widest">
                                  {formattedDate}
                                </text>
                              );
                            })}
                          </>
                        );
                      })()}
                    </svg>
                  )}
                </div>
              )}
            </div>
          </div>

          {/* Categories Distribution */}
          <div className="bg-white p-8 rounded-[2.5rem] shadow-xl border border-gray-50 flex flex-col justify-between">
            <div>
              <h2 className="text-xl font-black text-gray-800 tracking-tight flex items-center gap-2 mb-1">
                <Award className="text-primary-500" /> Categories Distribution
              </h2>
              <p className="text-gray-400 font-bold text-xs">Readiness brackets breakdown</p>
            </div>

            <div className="flex-1 mt-6 space-y-5">
              {loadingAnalytics ? (
                <div className="h-48 flex items-center justify-center"><div className="w-8 h-8 border-3 border-primary-500 border-t-transparent rounded-full animate-spin"></div></div>
              ) : (
                (() => {
                  const categoriesOrder = ['Future Innovator', 'AI Explorer', 'Creative Problem Solver', 'Future Starter'];
                  const total = analytics?.totalSubmissions || 1;
                  
                  return categoriesOrder.map((cat) => {
                    const stats = analytics?.categoryStats.find(s => s._id === cat);
                    const count = stats?.count || 0;
                    const percentage = ((count / total) * 100);

                    return (
                      <div key={cat} className="space-y-1.5">
                        <div className="flex justify-between items-center text-xs font-black">
                          <span className="text-gray-700 tracking-tight">{cat}</span>
                          <span className="text-gray-400 uppercase tracking-wider">{count} ({percentage.toFixed(0)}%)</span>
                        </div>
                        <div className="w-full h-3 bg-gray-50 rounded-full overflow-hidden relative">
                          <div 
                            className={`h-full bg-gradient-to-r ${getCategoryGradient(cat)} rounded-full`}
                            style={{ width: `${percentage}%` }}
                          />
                        </div>
                      </div>
                    );
                  });
                })()
              )}
            </div>
          </div>

        </div>

        {/* Secondary Analytics Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 px-2 sm:px-0">
          
          {/* Recommended Program */}
          <div className="bg-white p-8 rounded-[2.5rem] shadow-xl border border-gray-50">
             <h2 className="text-lg font-black text-gray-800 tracking-tight flex items-center gap-2 mb-4">
               <Target className="text-indigo-500" /> Program Path Recommendations
             </h2>
             <div className="space-y-4">
                {loadingAnalytics ? (
                  <div className="py-8 text-center"><div className="w-8 h-8 border-3 border-indigo-500 border-t-transparent rounded-full animate-spin mx-auto"></div></div>
                ) : (
                  (() => {
                    const programs = ['AI Explorer Program', 'Future Coder Program', 'AI Creator Program'];
                    const total = analytics?.totalSubmissions || 1;

                    return programs.map(prog => {
                      const stat = analytics?.programStats.find(s => s._id === prog);
                      const count = stat?.count || 0;
                      const pct = (count / total) * 100;
                      return (
                        <div key={prog} className="flex flex-col gap-1 p-3 bg-gray-50/50 rounded-2xl border border-gray-100">
                          <div className="flex justify-between text-xs font-bold text-gray-700">
                            <span>{prog}</span>
                            <span className="font-black text-indigo-600">{count} Leads ({pct.toFixed(0)}%)</span>
                          </div>
                          <div className="w-full h-2 bg-gray-100 rounded-full overflow-hidden mt-1">
                            <div className="h-full bg-indigo-500 rounded-full" style={{ width: `${pct}%` }} />
                          </div>
                        </div>
                      );
                    });
                  })()
                )}
             </div>
          </div>

          {/* Age Distribution */}
          <div className="bg-white p-8 rounded-[2.5rem] shadow-xl border border-gray-50">
             <h2 className="text-lg font-black text-gray-800 tracking-tight flex items-center gap-2 mb-4">
               <Layers className="text-rose-500" /> Student Age Demographics
             </h2>
             <div className="flex items-end justify-between h-40 gap-2 border-b border-gray-100 pb-2">
                {loadingAnalytics ? (
                  <div className="w-full h-full flex items-center justify-center"><div className="w-8 h-8 border-3 border-rose-500 border-t-transparent rounded-full animate-spin"></div></div>
                ) : (
                  (() => {
                    const ageBuckets = [6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18];
                    const maxAgeCount = Math.max(...(analytics?.ageStats.map(s => s.count) || []), 1);

                    return ageBuckets.map(age => {
                      const stat = analytics?.ageStats.find(s => s._id === age);
                      const count = stat?.count || 0;
                      const heightPercent = (count / maxAgeCount) * 100;

                      return (
                        <div key={age} className="flex-1 flex flex-col items-center h-full justify-end group cursor-pointer relative">
                          <div className="absolute -top-6 bg-gray-800 text-white font-black text-[9px] px-1.5 py-0.5 rounded opacity-0 group-hover:opacity-100 transition-opacity">
                            {count}
                          </div>
                          <div 
                            className="w-full bg-rose-400 group-hover:bg-rose-500 rounded-t-lg transition-all"
                            style={{ height: `${Math.max(heightPercent, 4)}%` }}
                          />
                          <span className="text-[9px] font-black text-gray-400 mt-1">{age}</span>
                        </div>
                      );
                    });
                  })()
                )}
             </div>
          </div>

          {/* Top Cities */}
          <div className="bg-white p-8 rounded-[2.5rem] shadow-xl border border-gray-50">
             <h2 className="text-lg font-black text-gray-800 tracking-tight flex items-center gap-2 mb-4">
               <MapPin className="text-emerald-500" /> Geography (Top Cities)
             </h2>
             <div className="space-y-3 max-h-40 overflow-y-auto scrollbar-thin">
                {loadingAnalytics ? (
                  <div className="text-center"><div className="w-8 h-8 border-3 border-emerald-500 border-t-transparent rounded-full animate-spin mx-auto"></div></div>
                ) : (
                  analytics?.cityStats && analytics.cityStats.length > 0 ? (
                    analytics.cityStats.map((city, idx) => {
                      const maxCityCount = analytics.cityStats[0]?.count || 1;
                      const pct = (city.count / maxCityCount) * 100;
                      return (
                        <div key={idx} className="flex items-center gap-3">
                          <span className="w-5 font-black text-[10px] text-gray-400">{idx + 1}.</span>
                          <span className="w-20 truncate font-bold text-xs text-gray-700 capitalize">{city._id}</span>
                          <div className="flex-1 h-2 bg-gray-50 rounded-full overflow-hidden">
                            <div className="h-full bg-emerald-500 rounded-full" style={{ width: `${pct}%` }} />
                          </div>
                          <span className="font-black text-xs text-gray-600">{city.count}</span>
                        </div>
                      );
                    })
                  ) : (
                    <div className="text-center py-8 text-gray-400 font-bold uppercase tracking-widest text-xs">No geographic data</div>
                  )
                )}
             </div>
          </div>

        </div>

        {/* Main Grid List Section */}
        <div className="space-y-6 px-2 sm:px-0">
          <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
             <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-2xl bg-gray-800 flex items-center justify-center text-white shadow-lg shadow-gray-200">
                   <Brain size={22} />
                </div>
                <div>
                  <h2 className="text-2xl font-black text-gray-800 tracking-tight">Quiz Leads Pipeline</h2>
                  <p className="text-gray-400 font-bold text-xs">Manage submissions, view response dossiers, and trigger callbacks.</p>
                </div>
             </div>
             
             <div className="flex items-center gap-2">
                <button 
                  onClick={handleResetFilters}
                  className="px-4 py-2 border border-gray-200 hover:border-gray-300 text-gray-500 hover:text-gray-700 rounded-xl text-xs font-bold transition-all hover:bg-gray-50"
                >
                  Reset Filters
                </button>
             </div>
          </div>

          {/* Search & Filters Controls */}
          <div className="bg-white p-6 rounded-[2rem] shadow-xl border border-gray-50/80 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
             {/* Search Input */}
             <div className="relative">
                <Search className="w-4 h-4 text-gray-400 absolute left-4 top-1/2 -translate-y-1/2" />
                <input 
                  type="text" 
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  placeholder="Search student, parent, phone..."
                  className="w-full pl-11 pr-4 py-3 border border-gray-100 rounded-2xl text-xs font-bold text-gray-800 bg-gray-50/50 focus:bg-white focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-all"
                />
             </div>

             {/* Category Filter */}
             <div className="relative">
                <select 
                  value={categoryFilter}
                  onChange={(e) => { setCategoryFilter(e.target.value); setPage(1); }}
                  className="w-full px-4 py-3 border border-gray-100 rounded-2xl text-xs font-bold text-gray-600 bg-gray-50/50 focus:bg-white focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-all appearance-none cursor-pointer"
                >
                  <option value="">All Categories</option>
                  <option value="Future Innovator">Future Innovator</option>
                  <option value="AI Explorer">AI Explorer</option>
                  <option value="Creative Problem Solver">Creative Problem Solver</option>
                  <option value="Future Starter">Future Starter</option>
                </select>
                <Filter className="w-3.5 h-3.5 text-gray-400 absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none" />
             </div>

             {/* Recommended Program Filter */}
             <div className="relative">
                <select 
                  value={programFilter}
                  onChange={(e) => { setProgramFilter(e.target.value); setPage(1); }}
                  className="w-full px-4 py-3 border border-gray-100 rounded-2xl text-xs font-bold text-gray-600 bg-gray-50/50 focus:bg-white focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-all appearance-none cursor-pointer"
                >
                  <option value="">All Recommended Programs</option>
                  <option value="AI Explorer Program">AI Explorer Program</option>
                  <option value="Future Coder Program">Future Coder Program</option>
                  <option value="AI Creator Program">AI Creator Program</option>
                </select>
                <Filter className="w-3.5 h-3.5 text-gray-400 absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none" />
             </div>

             {/* Class/Grade Filter */}
             <div className="relative">
                <select 
                  value={classFilter}
                  onChange={(e) => { setClassFilter(e.target.value); setPage(1); }}
                  className="w-full px-4 py-3 border border-gray-100 rounded-2xl text-xs font-bold text-gray-600 bg-gray-50/50 focus:bg-white focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-all appearance-none cursor-pointer"
                >
                  <option value="">All Grades</option>
                  {[...Array(12)].map((_, i) => (
                    <option key={i + 1} value={`Class ${i + 1}`}>Grade {i + 1}</option>
                  ))}
                  <option value="Other">Other</option>
                </select>
                <Filter className="w-3.5 h-3.5 text-gray-400 absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none" />
             </div>

             {/* Score Range Filter */}
             <div className="relative">
                <select 
                  value={scoreRange}
                  onChange={(e) => { setScoreRange(e.target.value); setPage(1); }}
                  className="w-full px-4 py-3 border border-gray-100 rounded-2xl text-xs font-bold text-gray-600 bg-gray-50/50 focus:bg-white focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-all appearance-none cursor-pointer"
                >
                  <option value="">All Scores</option>
                  <option value="high">High Potential (75+)</option>
                  <option value="medium">Average (50 - 74)</option>
                  <option value="low">Developing (Under 50)</option>
                </select>
                <Filter className="w-3.5 h-3.5 text-gray-400 absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none" />
             </div>
          </div>

          {/* Table Container */}
          {loadingSubmissions ? (
            <div className="bg-white rounded-[2rem] shadow-2xl p-16 text-center border border-gray-50">
               <div className="w-12 h-12 border-4 border-primary-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
               <p className="text-gray-400 font-bold text-xs uppercase tracking-widest">Querying Pipeline Submissions...</p>
            </div>
          ) : submissions.length === 0 ? (
            <div className="bg-white rounded-[2rem] shadow-2xl p-16 text-center border border-gray-50/80">
               <Brain size={48} className="text-gray-200 mx-auto mb-4 animate-bounce" />
               <h3 className="font-black text-gray-800 text-lg mb-1">No Leads Located</h3>
               <p className="text-gray-400 text-xs font-bold max-w-sm mx-auto">Try refining your search queries or resetting filters to view all assessment submissions.</p>
            </div>
          ) : (
            <div className="bg-white rounded-[2rem] shadow-2xl overflow-hidden border border-gray-50 mx-1">
              
              {/* Desktop view */}
              <div className="hidden md:block overflow-x-auto scrollbar-hide">
                <table className="w-full text-left border-collapse">
                  <thead>
                    <tr className="bg-gray-50 border-b border-gray-100 font-black text-gray-400 uppercase text-[10px] tracking-[0.2em] px-8">
                      <th className="px-8 py-5">Date</th>
                      <th className="px-8 py-5">Student / Parent</th>
                      <th className="px-8 py-5">Score & Category</th>
                      <th className="px-8 py-5">Recommended Program</th>
                      <th className="px-8 py-5">City</th>
                      <th className="px-8 py-5 text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {submissions.map((sub) => {
                      const isHigh = sub.score >= 75;
                      const subDate = new Date(sub.submittedAt).toLocaleDateString('en-IN', {
                        day: '2-digit',
                        month: 'short',
                        hour: '2-digit',
                        minute: '2-digit'
                      });

                      return (
                        <tr key={sub._id} className="border-b border-gray-50 hover:bg-gray-50/40 transition-colors group">
                          <td className="px-8 py-5 text-xs font-bold text-gray-400 whitespace-nowrap">
                            {subDate}
                          </td>
                          <td className="px-8 py-5">
                            <div className="flex flex-col">
                              <span className="font-black text-gray-800 text-sm">{sub.studentName}</span>
                              <span className="text-[10px] font-bold text-gray-400 mt-0.5">Parent: {sub.parentName}</span>
                              <span className="text-[10px] font-bold text-gray-400 flex items-center gap-1 mt-0.5"><Phone className="w-2.5 h-2.5" /> {sub.mobile}</span>
                            </div>
                          </td>
                          <td className="px-8 py-5">
                            <div className="flex items-center gap-2">
                              <span className={`w-10 h-8 rounded-lg flex items-center justify-center font-black text-sm text-white ${isHigh ? 'bg-[#ef4444]' : 'bg-[#6C5CE7]'}`}>
                                {sub.score}
                              </span>
                              <span className={`px-2.5 py-1 rounded-full text-[10px] font-black uppercase tracking-wider border ${getCategoryColor(sub.category)}`}>
                                {sub.category}
                              </span>
                            </div>
                          </td>
                          <td className="px-8 py-5">
                            <div className="flex flex-col">
                              <span className="font-black text-gray-700 text-xs">{sub.recommendedProgram}</span>
                              <span className="text-[9px] font-black text-indigo-500 uppercase tracking-widest mt-0.5">
                                {sub.class} (Age {sub.age})
                              </span>
                            </div>
                          </td>
                          <td className="px-8 py-5">
                            <span className="font-black text-gray-600 text-xs capitalize flex items-center gap-1">
                              <MapPin className="w-3.5 h-3.5 text-gray-400" /> {sub.city}
                            </span>
                          </td>
                          <td className="px-8 py-5 text-right whitespace-nowrap">
                            <button
                              onClick={() => { setSelectedSubmission(sub); setShowDetailModal(true); }}
                              className="px-4 py-2 bg-gray-50 border border-gray-100 hover:border-gray-200 text-gray-700 hover:text-primary-500 hover:bg-white rounded-xl text-xs font-black transition-all flex items-center gap-1.5 ml-auto shadow-sm"
                            >
                              View Dossier <ExternalLink size={12} />
                            </button>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>

              {/* Mobile View Card Grid */}
              <div className="md:hidden p-4 space-y-4">
                {submissions.map((sub) => {
                  const isHigh = sub.score >= 75;
                  const subDate = new Date(sub.submittedAt).toLocaleDateString('en-IN', {
                    day: '2-digit',
                    month: 'short',
                    hour: '2-digit',
                    minute: '2-digit'
                  });

                  return (
                    <div key={sub._id} className="bg-white border border-gray-100 rounded-3xl p-5 shadow-sm space-y-4">
                      <div className="flex justify-between items-start">
                         <div className="text-[10px] font-bold text-gray-400 flex items-center gap-1"><Clock size={11} /> {subDate}</div>
                         <span className={`w-10 h-8 rounded-lg flex items-center justify-center font-black text-sm text-white ${isHigh ? 'bg-[#ef4444]' : 'bg-[#6C5CE7]'}`}>
                           {sub.score}
                         </span>
                      </div>
                      <div className="flex flex-col gap-0.5">
                         <h4 className="font-black text-gray-800 text-base">{sub.studentName}</h4>
                         <p className="text-xs text-gray-400 font-bold">Parent: {sub.parentName}</p>
                         <p className="text-[11px] text-gray-500 font-bold flex items-center gap-1"><Phone size={12} /> {sub.mobile}</p>
                      </div>
                      
                      <div className="border-t border-gray-50 pt-3 flex flex-wrap gap-2 justify-between items-center">
                         <div className="flex flex-col">
                            <span className="text-xs font-black text-gray-600">{sub.recommendedProgram}</span>
                            <span className="text-[9px] font-bold text-gray-400">{sub.class} (Age {sub.age})</span>
                         </div>
                         <span className={`px-2 py-0.5 rounded-full text-[9px] font-black uppercase tracking-wider border ${getCategoryColor(sub.category)}`}>
                            {sub.category}
                         </span>
                      </div>

                      <div className="pt-2">
                        <button
                          onClick={() => { setSelectedSubmission(sub); setShowDetailModal(true); }}
                          className="w-full py-2.5 bg-gray-50 border border-gray-100 text-gray-700 text-xs font-black rounded-xl hover:bg-gray-100 text-center"
                        >
                          View Answers Dossier
                        </button>
                      </div>
                    </div>
                  );
                })}
              </div>

              {/* Table Pagination */}
              <div className="bg-gray-50/50 px-8 py-5 border-t border-gray-50 flex items-center justify-between text-xs">
                 <span className="font-bold text-gray-400 uppercase tracking-widest">
                   Showing {submissions.length} of {totalSubmissionsList} entries
                 </span>
                 <div className="flex items-center gap-3">
                    <button
                      onClick={() => setPage(prev => Math.max(prev - 1, 1))}
                      disabled={page === 1}
                      className="w-8 h-8 rounded-xl border border-gray-200 flex items-center justify-center text-gray-600 hover:bg-white disabled:opacity-50 disabled:cursor-not-allowed transition-all"
                    >
                      <ChevronLeft size={16} />
                    </button>
                    <span className="font-black text-gray-700 font-baloo">Page {page} of {totalPages}</span>
                    <button
                      onClick={() => setPage(prev => Math.min(prev + 1, totalPages))}
                      disabled={page === totalPages}
                      className="w-8 h-8 rounded-xl border border-gray-200 flex items-center justify-center text-gray-600 hover:bg-white disabled:opacity-50 disabled:cursor-not-allowed transition-all"
                    >
                      <ChevronRight size={16} />
                    </button>
                 </div>
              </div>

            </div>
          )}

        </div>

        {/* Responses / Dossier Slide-out Modal */}
        {showDetailModal && selectedSubmission && (
          <div className="fixed inset-0 z-50 flex items-center justify-end bg-navy-950/40 backdrop-blur-sm animate-in fade-in duration-300">
             
             {/* Backdrop Click */}
             <div className="absolute inset-0" onClick={() => setShowDetailModal(false)}></div>
             
             {/* Slide drawer container */}
             <div className="relative w-full max-w-2xl h-screen bg-white shadow-2xl flex flex-col justify-between animate-in slide-in-from-right duration-300 ease-out border-l border-gray-100">
                
                {/* Modal Header */}
                <div className="p-6 md:p-8 border-b border-gray-100 flex items-center justify-between">
                   <div className="flex items-center gap-3">
                      <div className="w-10 h-10 bg-rose-50 text-rose-500 rounded-xl flex items-center justify-center">
                         <Brain size={20} />
                      </div>
                      <div>
                        <h3 className="text-xl font-black text-gray-800 tracking-tight">Student Assessment Dossier</h3>
                        <p className="text-[10px] text-gray-400 font-bold uppercase tracking-widest mt-0.5">Submitted at: {new Date(selectedSubmission.submittedAt).toLocaleString()}</p>
                      </div>
                   </div>
                   <button 
                     onClick={() => setShowDetailModal(false)}
                     className="w-10 h-10 rounded-full hover:bg-gray-50 flex items-center justify-center text-gray-400 hover:text-gray-600 transition-colors"
                   >
                     <X size={20} />
                   </button>
                </div>

                {/* Modal Scroll Content */}
                <div className="flex-1 overflow-y-auto p-6 md:p-8 space-y-8 scrollbar-thin">
                   
                   {/* Profile Header Card */}
                   <div className="bg-gray-50 border border-gray-100 p-6 rounded-3xl relative overflow-hidden flex flex-col gap-6">
                      <div className="absolute top-0 right-0 bg-primary-100 text-primary-700 font-black text-[10px] px-4 py-1.5 rounded-bl-2xl uppercase tracking-widest">
                        Funnel Lead
                      </div>

                      {/* Header row */}
                      <div className="flex items-start gap-4">
                         <div className={`w-14 h-14 rounded-2xl flex items-center justify-center text-white font-black text-2xl ${selectedSubmission.score >= 75 ? 'bg-rose-500 shadow-md shadow-rose-100' : 'bg-indigo-500 shadow-md shadow-indigo-100'}`}>
                           {selectedSubmission.studentName[0]}
                         </div>
                         <div>
                            <h4 className="text-2xl font-black text-gray-800">{selectedSubmission.studentName}</h4>
                            <p className="text-xs font-bold text-gray-500 mt-1 flex items-center gap-1.5">
                              <span>Age {selectedSubmission.age}</span>
                              <span className="w-1.5 h-1.5 rounded-full bg-gray-300"></span>
                              <span className="font-black text-indigo-500 uppercase tracking-wide">{selectedSubmission.class}</span>
                              <span className="w-1.5 h-1.5 rounded-full bg-gray-300"></span>
                              <span className="capitalize flex items-center gap-0.5"><MapPin size={11} /> {selectedSubmission.city}</span>
                            </p>
                         </div>
                      </div>

                      {/* Contact metadata grid */}
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 border-t border-gray-200/50 pt-4 text-xs font-bold text-gray-600">
                         <div className="flex items-center gap-2">
                           <Phone size={14} className="text-gray-400" />
                           <span className="text-gray-700 font-black">{selectedSubmission.mobile}</span>
                         </div>
                         <div className="flex items-center gap-2">
                           <Mail size={14} className="text-gray-400" />
                           <span className="text-gray-700 font-black">{selectedSubmission.email || 'No email provided'}</span>
                         </div>
                         <div className="flex items-center gap-2">
                           <Users size={14} className="text-gray-400" />
                           <span>Parent Contact: <strong className="text-gray-800 font-black">{selectedSubmission.parentName}</strong></span>
                         </div>
                      </div>

                      {/* Result metrics */}
                      <div className="grid grid-cols-2 gap-4 border-t border-gray-200/50 pt-4">
                         <div className="bg-white p-4 border border-gray-100 rounded-2xl text-center">
                            <span className="text-[10px] font-black text-gray-400 uppercase tracking-widest block mb-0.5">Adaptability Index</span>
                            <div className="text-3xl font-black text-rose-500">{selectedSubmission.score}<span className="text-sm font-bold text-gray-400">/100</span></div>
                            <span className={`inline-block px-2.5 py-0.5 rounded-full text-[8.5px] font-black uppercase tracking-wider border mt-2 ${getCategoryColor(selectedSubmission.category)}`}>
                              {selectedSubmission.category}
                            </span>
                         </div>
                         <div className="bg-white p-4 border border-gray-100 rounded-2xl text-center flex flex-col justify-center">
                            <span className="text-[10px] font-black text-gray-400 uppercase tracking-widest block mb-1">Recommended Pathway</span>
                            <span className="text-sm font-black text-indigo-700 tracking-tight block">{selectedSubmission.recommendedProgram}</span>
                            <p className="text-[9.5px] font-bold text-gray-400 leading-normal mt-1.5">Aged {selectedSubmission.age} specific roadmap</p>
                         </div>
                      </div>
                   </div>

                   {/* Quiz Answers Detailed Dossier */}
                   <div className="space-y-5">
                      <div className="flex items-center gap-2 pb-1 border-b border-gray-100">
                         <HelpCircle size={18} className="text-primary-500" />
                         <h5 className="text-base font-black text-gray-800">Q&amp;A Response Dossier</h5>
                         <span className="bg-primary-50 text-primary-700 text-[10px] font-black px-2.5 py-0.5 rounded-full uppercase tracking-wider ml-auto">
                            20/20 Answered
                         </span>
                      </div>

                      <div className="space-y-4">
                         {questions.map((q) => {
                            const studentAnswer = selectedSubmission.answers[`Q${q.id}`];
                            const matchingOption = q.options.find(opt => opt.text === studentAnswer);
                            const weight = matchingOption?.weight || 0;
                            
                            // Color weight mapping
                            const getWeightBadge = (w: number) => {
                              if (w === 4) return 'bg-emerald-50 text-emerald-700 border-emerald-100';
                              if (w === 3) return 'bg-blue-50 text-blue-700 border-blue-100';
                              if (w === 2) return 'bg-amber-50 text-amber-700 border-amber-100';
                              return 'bg-gray-50 text-gray-500 border-gray-200';
                            };

                            return (
                              <div key={q.id} className="p-5 border border-gray-100 rounded-2.5xl space-y-3 hover:border-gray-200 transition-colors bg-white">
                                 
                                 {/* Question title row */}
                                 <div className="flex items-start justify-between gap-3">
                                    <div className="flex items-start gap-2.5">
                                       <span className="w-6 h-6 rounded-lg bg-gray-100 flex items-center justify-center font-baloo font-black text-[11px] text-gray-500 shrink-0 mt-0.5">
                                          Q{q.id}
                                       </span>
                                       <span className="text-[10px] font-black bg-indigo-50 text-indigo-600 px-2 py-0.5 rounded uppercase tracking-wider shrink-0 mt-1">
                                          {q.categoryLabel}
                                       </span>
                                    </div>
                                    <span className={`px-2.5 py-0.5 rounded-md text-[9px] font-black border uppercase tracking-wider ${getWeightBadge(weight)}`}>
                                       Adaptation: Level {weight}
                                    </span>
                                 </div>

                                 <h6 className="font-bold text-gray-800 text-xs sm:text-sm leading-relaxed">
                                    {q.text}
                                 </h6>

                                 {/* Options selection */}
                                 <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 pt-1.5">
                                    {q.options.map((opt, optIdx) => {
                                       const isSelected = opt.text === studentAnswer;
                                       return (
                                         <div 
                                           key={optIdx} 
                                           className={`px-3.5 py-2.5 rounded-xl border text-[11px] font-bold flex items-center gap-2.5 transition-all ${
                                             isSelected
                                               ? 'border-[#6C5CE7] bg-[#EEE8FF]/20 text-[#6C5CE7] font-black'
                                               : 'border-gray-50 bg-gray-50/20 text-gray-400 opacity-60'
                                           }`}
                                         >
                                            <span className={`w-5 h-5 rounded-md flex items-center justify-center font-baloo font-black text-[9px] ${
                                              isSelected ? 'bg-[#6C5CE7] text-white' : 'bg-gray-100 text-gray-400'
                                            }`}>
                                               {opt.label}
                                            </span>
                                            <span className="truncate">{opt.text}</span>
                                         </div>
                                       );
                                    })}
                                 </div>

                              </div>
                            );
                         })}
                      </div>
                   </div>

                </div>

                {/* Modal Footer Controls */}
                <div className="p-6 md:p-8 border-t border-gray-100 bg-gray-50/40 flex flex-col sm:flex-row gap-4 items-center justify-between">
                   <div className="flex items-center gap-2.5 text-xs font-bold text-gray-400">
                      <CheckCircle2 className="w-4 h-4 text-emerald-500" /> Lead profile matches Sales CRM
                   </div>
                   <div className="flex items-center gap-3 w-full sm:w-auto">
                      <button 
                        onClick={() => setShowDetailModal(false)}
                        className="flex-1 sm:flex-none px-5 py-3 border border-gray-200 hover:border-gray-300 text-gray-600 font-black rounded-xl text-xs uppercase tracking-wide bg-white"
                      >
                         Dismiss
                      </button>
                      <Link 
                        href={`/sales-dashboard?search=${selectedSubmission.mobile}`}
                        className="flex-1 sm:flex-none px-6 py-3 bg-[#ef4444] hover:bg-[#dc2626] text-white font-black rounded-xl text-xs uppercase tracking-wider flex items-center justify-center gap-2 shadow-lg shadow-red-100"
                        onClick={() => setShowDetailModal(false)}
                      >
                         Open in CRM <ExternalLink size={13} />
                      </Link>
                   </div>
                </div>

             </div>
          </div>
        )}

      </div>
    </DashboardLayout>
  );
}

// Stats Card Utility Component
function StatCard({ title, value, icon, description, color }: { title: string; value: string | number; icon: any; description: string; color: string }) {
  return (
    <Card className="border-none shadow-md overflow-hidden bg-white hover:-translate-y-1 transition-all duration-300 group">
      <CardContent className="p-6 flex items-start gap-4">
        <div className={`${color} p-4 rounded-2xl group-hover:scale-110 transition-transform`}>
          {icon}
        </div>
        <div className="flex flex-col gap-0.5">
          <span className="text-gray-400 font-black text-[10px] uppercase tracking-widest">{title}</span>
          <span className="text-2xl md:text-3xl font-black text-gray-800 leading-tight">{value}</span>
          <span className="text-[10px] font-bold text-gray-400 mt-1 leading-normal">{description}</span>
        </div>
      </CardContent>
    </Card>
  );
}
