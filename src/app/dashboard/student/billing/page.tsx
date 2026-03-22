"use client";

import React, { useEffect, useState } from 'react';
import { DashboardLayout } from '@/components/layout/DashboardLayout';
import { Card, CardTitle, CardContent } from '@/components/ui/Card';
import { useAuth } from '@/context/AuthContext';
import { Button } from '@/components/ui/Button';
import axios from 'axios';
import { CreditCard, Download, ExternalLink, Calendar, CheckCircle2 } from 'lucide-react';

export default function BillingPage() {
  const { user } = useAuth();
  const [payments, setPayments] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchPayments = async () => {
      try {
        const res = await axios.get('/api/payments/my-payments');
        if (res.data.success) {
          setPayments(res.data.data);
        }
      } catch (e) {
        console.error(e);
      } finally {
        setIsLoading(false);
      }
    };
    fetchPayments();
  }, []);

  return (
    <DashboardLayout allowedRoles={['student']}>
      <div className="flex flex-col gap-8">
        <div>
          <h1 className="text-3xl md:text-4xl font-extrabold text-primary-600 mb-2">Billing & Invoices 💳</h1>
          <p className="text-lg text-gray-500 font-bold">Manage your payments and download receipts.</p>
        </div>

        {isLoading ? (
          <div className="text-center py-20">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600 mx-auto"></div>
          </div>
        ) : payments.length === 0 ? (
          <Card className="bg-white/50 border-dashed border-4 border-gray-300 text-center py-12">
            <CreditCard className="w-16 h-16 text-gray-300 mx-auto mb-4" />
            <p className="text-xl text-gray-500 font-bold">No payment history found.</p>
          </Card>
        ) : (
          <div className="flex flex-col gap-4">
             <div className="hidden md:grid grid-cols-5 gap-4 px-6 py-4 bg-gray-50 rounded-2xl font-black text-gray-500 text-sm uppercase tracking-wider">
               <span>Date</span>
               <span>Description</span>
               <span>Amount</span>
               <span>Status</span>
               <span className="text-right">Actions</span>
             </div>

             {payments.map((payment: any) => (
                <Card key={payment._id} hoverEffect className="bg-white border-none shadow-sm hover:shadow-md transition-all">
                  <div className="grid grid-cols-1 md:grid-cols-5 gap-4 items-center p-6">
                    <div className="flex items-center gap-3">
                      <Calendar className="w-5 h-5 text-gray-400" />
                      <span className="font-bold text-gray-700">{new Date(payment.createdAt).toLocaleDateString()}</span>
                    </div>
                    
                    <div className="font-bold text-gray-800">
                      {payment.course?.title || 'Course Enrollment'}
                    </div>

                    <div className="text-xl font-black text-primary-600">
                      ₹{payment.amount}
                    </div>

                    <div>
                      <span className={`px-4 py-1.5 rounded-full text-xs font-black uppercase tracking-widest ${
                        payment.status === 'captured' || payment.status === 'success'
                          ? 'bg-green-100 text-green-700'
                          : 'bg-yellow-100 text-yellow-700'
                      }`}>
                        {payment.status}
                      </span>
                    </div>

                    <div className="flex justify-end gap-2">
                       <Button size="sm" variant="outline" className="flex gap-2">
                          <Download className="w-4 h-4" /> Invoice
                       </Button>
                    </div>
                  </div>
                </Card>
             ))}
          </div>
        )}
      </div>
    </DashboardLayout>
  );
}
