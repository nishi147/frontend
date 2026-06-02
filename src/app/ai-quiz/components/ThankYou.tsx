import React from 'react';
import { motion } from 'framer-motion';
import { CheckCircle2, MailCheck, Calendar, PhoneCall, MessageSquare } from 'lucide-react';
import { useIntroOffer } from '@/context/IntroOfferContext';
import { useCurrency } from '@/context/CurrencyContext';

interface ThankYouProps {
  studentName: string;
  parentName: string;
  mobile: string;
  email: string;
  score: number;
  category: string;
  recommendedProgram: string;
  onViewReport: () => void;
}

export default function ThankYou({
  studentName,
  parentName,
  mobile,
  email,
  score,
  category,
  recommendedProgram,
  onViewReport
}: ThankYouProps) {
  const { handleClaimOffer, isProcessing } = useIntroOffer();
  const { formatPrice } = useCurrency();

  const handleBookDemo = async () => {
    const bookingDetails = {
      parentName,
      studentName,
      email: email || `${mobile}@ruzann.com`,
      phone: mobile,
      age: 10 // Default or dynamic if saved
    };
    await handleClaimOffer(bookingDetails);
  };

  const getWhatsAppLink = (type: 'counselor' | 'chat') => {
    const defaultNumber = "919960559894";
    const message = `Hello RUZANN! I completed the AI Readiness Assessment for ${studentName}. Score: ${score}/100. Category: ${category}. I'd like to ${type === 'counselor' ? 'speak to a counselor' : 'chat on WhatsApp'} about the recommended program: ${recommendedProgram}.`;
    return `https://wa.me/${defaultNumber}?text=${encodeURIComponent(message)}`;
  };

  return (
    <section className="py-16 md:py-24 px-4 bg-gradient-to-b from-[#f8fafc] to-white flex-1 flex items-center justify-center">
      <div className="max-w-xl w-full bg-white rounded-3xl border border-gray-100 p-8 sm:p-10 shadow-lg text-center flex flex-col items-center">
        
        {/* Animated Celebration Icon */}
        <motion.div
          initial={{ scale: 0.5, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ type: "spring", stiffness: 100, damping: 10 }}
          className="w-20 h-20 bg-green-50 border border-green-100 rounded-full flex items-center justify-center text-green-500 mb-6"
        >
          <CheckCircle2 size={44} />
        </motion.div>

        {/* Headline */}
        <h2 className="font-baloo font-black text-3xl text-navy-900 leading-tight">
          Assessment Completed Successfully! 🎉
        </h2>
        
        {/* Subtext */}
        <p className="text-gray-500 font-semibold text-sm sm:text-base mt-4 leading-relaxed">
          Awesome work! We have analyzed {studentName}'s answers and calculated their AI Readiness Score.
        </p>

        {/* Email Alert Banner */}
        {email ? (
          <div className="bg-[#E8FFF5] border border-[#C2FFDF] rounded-2xl p-4 flex gap-3 items-center text-left w-full mt-6">
            <MailCheck size={24} className="text-[#00B894] shrink-0" />
            <div>
              <h4 className="text-xs font-black text-navy-900">Report Dispatched!</h4>
              <p className="text-gray-500 font-bold text-[10px] sm:text-xs">
                A personalized PDF report has been sent to <strong>{email}</strong>.
              </p>
            </div>
          </div>
        ) : (
          <div className="bg-gray-50 border border-gray-100 rounded-2xl p-4 flex gap-3 items-center text-left w-full mt-6">
            <MailCheck size={24} className="text-gray-400 shrink-0" />
            <div>
              <h4 className="text-xs font-black text-navy-900">Report Generated Successfully</h4>
              <p className="text-gray-500 font-bold text-[10px] sm:text-xs">
                You can view the full diagnostic report card directly on this screen.
              </p>
            </div>
          </div>
        )}

        {/* Recommended program summary */}
        <div className="mt-8 bg-gray-50 rounded-2xl p-6 border border-gray-100 w-full text-left">
          <span className="text-[10px] font-black text-gray-400 uppercase tracking-widest block mb-1">
            Student Classification
          </span>
          <div className="flex justify-between items-center mb-4">
            <h4 className="font-baloo font-bold text-navy-900 text-lg">
              🏆 {category}
            </h4>
            <span className="font-baloo font-black text-[#EF4444] text-lg bg-[#FFEBEF] px-3 py-1 rounded-full">
              Score: {score}/100
            </span>
          </div>

          <span className="text-[10px] font-black text-gray-400 uppercase tracking-widest block mb-1">
            Recommended Action
          </span>
          <p className="text-gray-600 font-bold text-sm leading-relaxed">
            Enroll {studentName} in the <strong>{recommendedProgram}</strong> to build their logical thinking, AI awareness, and hands-on coding.
          </p>
        </div>

        {/* CTA Buttons */}
        <div className="mt-10 flex flex-col gap-3 w-full">
          <button
            onClick={onViewReport}
            className="w-full py-4 rounded-xl bg-[#6C5CE7] hover:bg-[#5B4BCB] text-white font-black text-sm uppercase tracking-wider transition-colors cursor-pointer"
          >
            📊 View Full Diagnostic Report Card
          </button>

          <button
            onClick={handleBookDemo}
            disabled={isProcessing}
            className="w-full py-4 rounded-xl bg-[#EF4444] hover:bg-[#DC2626] disabled:opacity-75 text-white font-black text-sm uppercase tracking-wider transition-all flex items-center justify-center gap-2 cursor-pointer shadow-md shadow-[#EF444420]"
          >
            {isProcessing ? (
              <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
            ) : (
              <>
                <Calendar size={16} /> RESERVE DEMO CLASS – {formatPrice(99)} ONLY
              </>
            )}
          </button>

          <div className="grid grid-cols-2 gap-3">
            <a
              href={getWhatsAppLink('counselor')}
              target="_blank"
              rel="noreferrer"
              className="py-3.5 rounded-xl border-2 border-gray-200 hover:border-gray-300 text-gray-600 font-black text-xs uppercase tracking-wide flex items-center justify-center gap-2 transition-colors cursor-pointer"
            >
              <PhoneCall size={14} /> Talk to Counselor
            </a>

            <a
              href={getWhatsAppLink('chat')}
              target="_blank"
              rel="noreferrer"
              className="py-3.5 rounded-xl bg-[#25D366] hover:bg-[#20BA5A] text-white font-black text-xs uppercase tracking-wide flex items-center justify-center gap-2 transition-colors cursor-pointer shadow-sm"
            >
              <MessageSquare size={14} /> WhatsApp Support
            </a>
          </div>
        </div>

      </div>
    </section>
  );
}
