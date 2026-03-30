"use client";

import React, { useState } from 'react';
import { Header } from '@/components/layout/Header';
import { Footer } from '@/components/layout/Footer';
import Link from 'next/link';
import api from '@/utils/api';
import { Mail, Phone, MapPin, Send, CheckCircle } from 'lucide-react';

export default function ContactPage() {
  const [form, setForm] = useState({ name: '', email: '', phone: '', subject: '', message: '', referralCode: '' });
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState('');

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    try {
      await api.post('/api/leads', {
        name: form.name,
        email: form.email,
        phone: form.phone || 'Not provided',
        source: 'Website',
        referralCode: form.referralCode,
        notes: [{ text: `Subject: ${form.subject}\nMessage: ${form.message}` }]
      });
      setSuccess(true);
      setForm({ name: '', email: '', phone: '', subject: '', message: '', referralCode: '' });
    } catch (err: any) {
      console.error(err);
      setError('Something went wrong. Please try again later.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      <Header />

      {/* Hero */}
      <section className="bg-gradient-to-br from-[#6C5CE7] to-[#a29bfe] py-14 px-4 text-white text-center">
        <div className="max-w-2xl mx-auto">
          <h1 className="text-4xl md:text-5xl font-black mb-3">Get in <span className="text-yellow-300">Touch</span></h1>
          <p className="text-lg font-bold text-white/80">We'd love to hear from you. Fill in the form and we'll get back to you!</p>
        </div>
      </section>

      {/* Main Content */}
      <section className="py-14 px-4 flex-1">
        <div className="max-w-6xl mx-auto grid grid-cols-1 lg:grid-cols-3 gap-10">

          {/* Contact Info Cards */}
          <div className="flex flex-col gap-5">
            <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100 flex items-start gap-4">
              <div className="w-12 h-12 rounded-xl bg-[#EEE8FF] flex items-center justify-center flex-shrink-0">
                <Phone size={22} className="text-[#6C5CE7]" />
              </div>
              <div>
                <h3 className="font-black text-gray-800 mb-1">Call Us</h3>
                <p className="text-gray-500 font-bold text-sm">+91 9960559894</p>
                <p className="text-gray-400 text-xs mt-1">Mon–Sat, 9am–7pm IST</p>
              </div>
            </div>

            <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100 flex items-start gap-4">
              <div className="w-12 h-12 rounded-xl bg-[#FFF5E6] flex items-center justify-center flex-shrink-0">
                <Mail size={22} className="text-[#FF7F50]" />
              </div>
              <div>
                <h3 className="font-black text-gray-800 mb-1">Email Us</h3>
                <p className="text-gray-500 font-bold text-sm">support@ruzann.com</p>
                <p className="text-gray-400 text-xs mt-1">We reply within 24 hours</p>
              </div>
            </div>

            <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100 flex items-start gap-4">
              <div className="w-12 h-12 rounded-xl bg-[#E8FFF5] flex items-center justify-center flex-shrink-0">
                <MapPin size={22} className="text-[#00B894]" />
              </div>
              <div>
                <h3 className="font-black text-gray-800 mb-1">Visit Us</h3>
                <p className="text-gray-500 font-bold text-sm">Pune, Maharashtra</p>
                <p className="text-gray-400 text-xs mt-1">India – 411001</p>
              </div>
            </div>

            <div className="bg-gradient-to-br from-[#6C5CE7] to-[#a29bfe] rounded-2xl p-6 text-white">
              <h3 className="font-black text-lg mb-2">🎯 Book a Free Trial</h3>
              <p className="text-white/80 font-bold text-sm mb-4">Start your child's learning journey for just ₹1. No commitment needed!</p>
              <Link href="/register" className="block w-full text-center py-3 rounded-xl bg-white text-[#6C5CE7] font-black hover:bg-yellow-300 transition-all">
                Claim ₹1 Trial
              </Link>
            </div>
          </div>

          {/* Contact Form */}
          <div className="lg:col-span-2 bg-white rounded-2xl shadow-sm border border-gray-100 p-8">
            {success ? (
              <div className="flex flex-col items-center justify-center h-full py-16 text-center">
                <div className="w-20 h-20 rounded-full bg-green-100 flex items-center justify-center mb-6">
                  <CheckCircle size={44} className="text-green-500" />
                </div>
                <h2 className="text-2xl font-black text-gray-800 mb-2">Thanks! Our team will contact you soon 🎉</h2>
                <p className="text-gray-500 font-bold mb-6">We have received your details safely.</p>
                <button
                  onClick={() => setSuccess(false)}
                  className="px-8 py-3 rounded-xl bg-[#6C5CE7] text-white font-black hover:bg-[#5B4BCB] transition-all"
                >
                  Send Another Message
                </button>
              </div>
            ) : (
              <>
                <h2 className="text-2xl font-black text-gray-800 mb-6">Send Us a Message</h2>
                <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-5">
                  <div className="flex flex-col gap-1">
                    <label className="text-sm font-bold text-gray-600">Your Name *</label>
                    <input
                      required
                      name="name"
                      type="text"
                      value={form.name}
                      onChange={handleChange}
                      placeholder="John Doe"
                      className="px-4 py-3 rounded-xl border-2 border-gray-100 focus:border-[#6C5CE7] focus:outline-none font-semibold text-gray-800 transition-colors"
                    />
                  </div>

                  <div className="flex flex-col gap-1">
                    <label className="text-sm font-bold text-gray-600">Email Address *</label>
                    <input
                      required
                      name="email"
                      type="email"
                      value={form.email}
                      onChange={handleChange}
                      placeholder="john@example.com"
                      className="px-4 py-3 rounded-xl border-2 border-gray-100 focus:border-[#6C5CE7] focus:outline-none font-semibold text-gray-800 transition-colors"
                    />
                  </div>

                  <div className="flex flex-col gap-1">
                    <label className="text-sm font-bold text-gray-600">Phone Number</label>
                    <input
                      name="phone"
                      type="tel"
                      value={form.phone}
                      onChange={handleChange}
                      placeholder="+91 00000 00000"
                      className="px-4 py-3 rounded-xl border-2 border-gray-100 focus:border-[#6C5CE7] focus:outline-none font-semibold text-gray-800 transition-colors"
                    />
                  </div>

                  <div className="flex flex-col gap-1">
                    <label className="text-sm font-bold text-gray-600">Subject *</label>
                    <select
                      required
                      name="subject"
                      value={form.subject}
                      onChange={handleChange}
                      className="px-4 py-3 rounded-xl border-2 border-gray-100 focus:border-[#6C5CE7] focus:outline-none font-semibold text-gray-800 transition-colors bg-white"
                    >
                      <option value="">Select a subject</option>
                      <option value="course-enquiry">Course Enquiry</option>
                      <option value="trial-class">Book a Trial Class</option>
                      <option value="billing">Billing & Payments</option>
                      <option value="technical">Technical Support</option>
                      <option value="partnership">Partnership</option>
                      <option value="other">Other</option>
                    </select>
                  </div>

                  <div className="flex flex-col gap-1 md:col-span-1">
                    <label className="text-sm font-bold text-gray-600">Referral Code (Optional)</label>
                    <input
                      name="referralCode"
                      type="text"
                      value={form.referralCode}
                      onChange={handleChange}
                      placeholder="e.g. RUZ-X4K"
                      className="px-4 py-3 rounded-xl border-2 border-gray-100 focus:border-[#6C5CE7] focus:outline-none font-semibold text-gray-800 transition-colors uppercase"
                    />
                  </div>

                  <div className="flex flex-col gap-1 md:col-span-2">
                    <label className="text-sm font-bold text-gray-600">Your Message *</label>
                    <textarea
                      required
                      name="message"
                      value={form.message}
                      onChange={handleChange}
                      rows={5}
                      placeholder="Tell us how we can help you..."
                      className="px-4 py-3 rounded-xl border-2 border-gray-100 focus:border-[#6C5CE7] focus:outline-none font-semibold text-gray-800 resize-none transition-colors"
                    />
                  </div>

                  {error && (
                    <div className="md:col-span-2 text-red-500 font-bold text-sm bg-red-50 px-4 py-3 rounded-xl">
                      {error}
                    </div>
                  )}

                  <div className="md:col-span-2">
                    <button
                      type="submit"
                      disabled={loading}
                      className="w-full py-4 rounded-xl bg-[#6C5CE7] hover:bg-[#5B4BCB] disabled:opacity-70 text-white font-black text-lg flex items-center justify-center gap-3 transition-all shadow-lg shadow-[#6C5CE720]"
                    >
                      {loading ? (
                        <div className="w-6 h-6 border-3 border-white border-t-transparent rounded-full animate-spin" />
                      ) : (
                        <>
                          <Send size={20} /> Send Message
                        </>
                      )}
                    </button>
                  </div>
                </form>
              </>
            )}
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}
