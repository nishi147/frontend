"use client";

import React from 'react';
import { DashboardLayout } from '@/components/layout/DashboardLayout';

export default function AdminSettingsPage() {
    return (
        <DashboardLayout allowedRoles={['admin']}>
            <div className="max-w-6xl mx-auto text-center py-20">
                <div className="text-8xl mb-8">⚙️</div>
                <h1 className="text-4xl font-black text-gray-800 mb-4">Platform Control Center</h1>
                <p className="text-xl text-gray-500 font-bold mb-10">Configure global site settings, currencies, and security policies.</p>
                <div className="bg-white p-10 rounded-[3rem] shadow-xl border-4 border-dashed border-gray-200">
                    <p className="text-gray-400 font-bold text-2xl">Admin Wizards are calibrating these gears... 🧙‍♂️</p>
                </div>
            </div>
        </DashboardLayout>
    );
}
