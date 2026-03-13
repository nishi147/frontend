"use client";

import React, { useState } from 'react';
import { Card, CardContent } from './ui/Card';
import { Button } from './ui/Button';
import { useIntroOffer } from '@/context/IntroOfferContext';

export const IntroOfferModal = () => {
  const { isModalOpen, closeIntroModal, isProcessing, handleClaimOffer } = useIntroOffer();
  const [introData, setIntroData] = useState({
    studentName: '',
    parentName: '',
    email: '',
    phone: '',
    age: ''
  });

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    await handleClaimOffer(introData);
  };

  if (!isModalOpen) return null;

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/60 backdrop-blur-md">
      <Card className="w-full max-w-xl bg-white overflow-hidden animate-bounce-in">
        <div className="bg-gradient-to-r from-accent-400 to-accent-500 p-8 text-white relative">
          <button 
            onClick={closeIntroModal}
            className="absolute top-4 right-4 text-white/80 hover:text-white font-black text-2xl"
          >✕</button>
          <h2 className="text-3xl font-black mb-2">Start Learning at ₹1 Only! 🐝</h2>
          <p className="font-bold text-accent-100">Book Your Seat for a magical future.</p>
        </div>
        <CardContent className="p-8">
          <form onSubmit={onSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="flex flex-col gap-1">
              <label className="text-sm font-bold text-gray-600 ml-1">Student Name</label>
              <input 
                required
                type="text"
                className="w-full px-4 py-3 rounded-xl border-2 border-gray-100 focus:border-accent-400 focus:outline-none font-semibold"
                placeholder="Kid's Name"
                value={introData.studentName}
                onChange={e => setIntroData({...introData, studentName: e.target.value})}
              />
            </div>
            <div className="flex flex-col gap-1">
              <label className="text-sm font-bold text-gray-600 ml-1">Parent Name</label>
              <input 
                required
                type="text"
                className="w-full px-4 py-3 rounded-xl border-2 border-gray-100 focus:border-accent-400 focus:outline-none font-semibold"
                placeholder="Guardian's Name"
                value={introData.parentName}
                onChange={e => setIntroData({...introData, parentName: e.target.value})}
              />
            </div>
            <div className="flex flex-col gap-1">
              <label className="text-sm font-bold text-gray-600 ml-1">Email</label>
              <input 
                required
                type="email"
                className="w-full px-4 py-3 rounded-xl border-2 border-gray-100 focus:border-accent-400 focus:outline-none font-semibold"
                placeholder="parent@email.com"
                value={introData.email}
                onChange={e => setIntroData({...introData, email: e.target.value})}
              />
            </div>
            <div className="flex flex-col gap-1">
              <label className="text-sm font-bold text-gray-600 ml-1">Phone Number</label>
              <input 
                required
                type="tel"
                className="w-full px-4 py-3 rounded-xl border-2 border-gray-100 focus:border-accent-400 focus:outline-none font-semibold"
                placeholder="+91 00000 00000"
                value={introData.phone}
                onChange={e => setIntroData({...introData, phone: e.target.value})}
              />
            </div>
            <div className="flex flex-col gap-1 md:col-span-2">
              <label className="text-sm font-bold text-gray-600 ml-1">Student Age</label>
              <input 
                required
                type="number"
                min="5"
                max="18"
                className="w-full px-4 py-3 rounded-xl border-2 border-gray-100 focus:border-accent-400 focus:outline-none font-semibold"
                placeholder="Age (5-18)"
                value={introData.age}
                onChange={e => setIntroData({...introData, age: e.target.value})}
              />
            </div>
            <Button 
              type="submit" 
              className="md:col-span-2 mt-4 bg-accent-500 hover:bg-accent-600 text-white border-none py-6 rounded-2xl text-xl font-black shadow-lg shadow-accent-200"
              isLoading={isProcessing}
            >
              Pay ₹1 & Start Adventure 🚀
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
};
