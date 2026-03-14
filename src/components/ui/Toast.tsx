"use client";

import React, { useEffect, useState } from 'react';
import { CheckCircle, XCircle, AlertCircle, X } from 'lucide-react';

export type ToastType = 'success' | 'error' | 'info';

interface ToastProps {
  message: string;
  type: ToastType;
  onClose: () => void;
  duration?: number;
}

const Toast: React.FC<ToastProps> = ({ message, type, onClose, duration = 5000 }) => {
  const [isExiting, setIsExiting] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => {
      handleClose();
    }, duration);

    return () => clearTimeout(timer);
  }, [duration]);

  const handleClose = () => {
    setIsExiting(true);
    setTimeout(onClose, 300); // Match animation duration
  };

  const icons = {
    success: <CheckCircle className="w-5 h-5 text-green-500" />,
    error: <XCircle className="w-5 h-5 text-red-500" />,
    info: <AlertCircle className="w-5 h-5 text-blue-500" />,
  };

  const bgColors = {
    success: 'bg-green-50 border-green-200',
    error: 'bg-red-50 border-red-200',
    info: 'bg-blue-50 border-blue-200',
  };

  return (
    <div
      className={`
        fixed bottom-4 right-4 z-[9999] flex items-center gap-3 px-4 py-3 rounded-2xl border-2 shadow-lg
        transition-all duration-300 transform
        ${bgColors[type]}
        ${isExiting ? 'opacity-0 translate-y-2 scale-95' : 'opacity-100 translate-y-0 scale-100'}
        animate-in fade-in slide-in-from-bottom-2
      `}
    >
      <div className="flex-shrink-0">
        {icons[type]}
      </div>
      <p className="text-gray-800 font-bold text-sm">
        {message}
      </p>
      <button
        onClick={handleClose}
        className="ml-2 p-1 hover:bg-black/5 rounded-full transition-colors"
      >
        <X className="w-4 h-4 text-gray-500" />
      </button>
    </div>
  );
};

export default Toast;
