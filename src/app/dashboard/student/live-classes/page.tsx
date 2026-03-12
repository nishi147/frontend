"use client";

import React from 'react';
import { DashboardLayout } from '@/components/layout/DashboardLayout';
import { Card, CardTitle, CardContent } from '@/components/ui/Card';

export default function StudentLiveClassesPage() {
    return (
        <DashboardLayout allowedRoles={['student']}>
            <div className="max-w-6xl mx-auto text-center py-20">
                <div className="text-8xl mb-8">📹</div>
                <h1 className="text-4xl font-black text-gray-800 mb-4">No Live Classes Scheduled</h1>
                <p className="text-xl text-gray-500 font-bold mb-10">We'll notify you when your teachers schedule a new magic session!</p>
            </div>
        </DashboardLayout>
    );
}
