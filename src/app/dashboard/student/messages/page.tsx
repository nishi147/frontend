"use client";

import React, { useEffect, useState } from 'react';
import { DashboardLayout } from '@/components/layout/DashboardLayout';
import { Card, CardTitle, CardContent } from '@/components/ui/Card';
import { useAuth } from '@/context/AuthContext';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import axios from 'axios';
import { MessageSquare, Send, User, Search } from 'lucide-react';

export default function MessagesPage() {
  const { user } = useAuth();
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState('');
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchMessages = async () => {
      try {
        const res = await axios.get('/api/messages');
        if (res.data.success) {
          setMessages(res.data.data);
        }
      } catch (e) {
        console.error(e);
      } finally {
        setIsLoading(false);
      }
    };
    fetchMessages();
  }, []);

  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newMessage.trim()) return;

    try {
      // For demo, sending to a mock teacher ID if none selected
      const res = await axios.post('/api/messages', {
        receiverId: 'teacher_id_here', 
        content: newMessage
      });
      if (res.data.success) {
        setMessages([...messages, res.data.data]);
        setNewMessage('');
      }
    } catch (e) {
      console.error(e);
    }
  };

  return (
    <DashboardLayout allowedRoles={['student']}>
      <div className="flex flex-col h-[calc(100vh-12rem)] gap-4">
        <div className="flex justify-between items-center">
          <h1 className="text-3xl font-extrabold text-primary-600">Messages 💬</h1>
        </div>

        <div className="flex flex-1 gap-6 overflow-hidden">
          {/* Contacts Sidebar */}
          <div className="hidden md:flex flex-col w-80 bg-white rounded-3xl shadow-lg overflow-hidden border border-gray-100">
            <div className="p-4 border-b">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                <Input className="pl-10 bg-gray-50 border-none rounded-xl" placeholder="Search tutors..." />
              </div>
            </div>
            <div className="flex-1 overflow-y-auto p-2">
               <div className="p-4 bg-primary-50 rounded-2xl flex items-center gap-3 cursor-pointer border-2 border-primary-200">
                  <div className="w-12 h-12 bg-primary-500 rounded-full flex items-center justify-center text-white font-bold">ST</div>
                  <div>
                    <p className="font-bold text-gray-800">Support Team</p>
                    <p className="text-xs text-primary-600 font-bold">Online</p>
                  </div>
               </div>
            </div>
          </div>

          {/* Chat Area */}
          <div className="flex-1 flex flex-col bg-white rounded-3xl shadow-lg overflow-hidden border border-gray-100">
            {/* Chat Header */}
            <div className="p-4 border-b flex items-center gap-3">
               <div className="w-10 h-10 bg-gray-200 rounded-full flex items-center justify-center text-gray-600 font-bold">ST</div>
               <p className="font-bold text-gray-800">Support Team</p>
            </div>

            {/* Messages Area */}
            <div className="flex-1 overflow-y-auto p-6 flex flex-col gap-4 bg-gray-50/30">
              {messages.length === 0 ? (
                <div className="flex flex-col items-center justify-center h-full text-gray-400">
                  <MessageSquare className="w-12 h-12 mb-2 opacity-20" />
                  <p className="font-bold">No messages yet. Say hello!</p>
                </div>
              ) : (
                messages.map((m: any) => (
                  <div 
                    key={m._id} 
                    className={`max-w-[80%] p-4 rounded-2xl font-medium shadow-sm ${
                      m.sender._id === user?._id 
                        ? 'self-end bg-primary-600 text-white rounded-tr-none' 
                        : 'self-start bg-white text-gray-800 rounded-tl-none border border-gray-100'
                    }`}
                  >
                    {m.content}
                    <p className={`text-[10px] mt-1 opacity-70 ${m.sender._id === user?._id ? 'text-right' : 'text-left'}`}>
                      {new Date(m.sentAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                    </p>
                  </div>
                ))
              )}
            </div>

            {/* Input Area */}
            <form onSubmit={handleSendMessage} className="p-4 border-t flex gap-2 bg-white">
              <Input 
                value={newMessage}
                onChange={(e) => setNewMessage(e.target.value)}
                placeholder="Type your message..." 
                className="flex-1 rounded-xl border-gray-200 focus:border-primary-500"
              />
              <Button type="submit" className="rounded-xl px-6">
                <Send className="w-4 h-4" />
              </Button>
            </form>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}
