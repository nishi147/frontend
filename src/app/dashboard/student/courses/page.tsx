"use client";

import React from 'react';
import { DashboardLayout } from '@/components/layout/DashboardLayout';
import { Card, CardTitle, CardContent } from '@/components/ui/Card';

export default function MyCoursesPage() {
    return (
        <DashboardLayout allowedRoles={['student']}>
            <div className="max-w-6xl mx-auto text-center py-20">
                <div className="text-8xl mb-8">📚</div>
                <h1 className="text-4xl font-black text-gray-800 mb-4">You haven't joined any courses yet!</h1>
                <p className="text-xl text-gray-500 font-bold mb-10">Start your adventure by picking a fun course from our library.</p>
                <a href="/courses" className="bg-primary-500 text-white px-10 py-4 rounded-2xl font-black text-xl shadow-lg shadow-primary-200 hover:scale-105 transition-transform inline-block">
                    Explore Courses 🚀
                </a>
            </div>
        </DashboardLayout>
    );
}
