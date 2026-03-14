"use client";

import React from 'react';
import { Card, CardContent } from './Card';
import { Button } from './Button';
import { AlertTriangle, X } from 'lucide-react';

interface ConfirmationModalProps {
  isOpen: boolean;
  title: string;
  message: string;
  onConfirm: () => void;
  onCancel: () => void;
  confirmText?: string;
  cancelText?: string;
  variant?: 'danger' | 'warning' | 'info';
}

export const ConfirmationModal: React.FC<ConfirmationModalProps> = ({
  isOpen,
  title,
  message,
  onConfirm,
  onCancel,
  confirmText = "Yes, Continue",
  cancelText = "Cancel",
  variant = 'warning'
}) => {
  if (!isOpen) return null;

  const colors = {
    danger: 'bg-red-500',
    warning: 'bg-amber-500',
    info: 'bg-primary-500'
  };

  const ringColors = {
    danger: 'ring-red-100',
    warning: 'ring-amber-100',
    info: 'ring-primary-100'
  };

  return (
    <div className="fixed inset-0 z-[10000] flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in duration-300">
      <Card className="w-full max-w-md bg-white rounded-[2.5rem] overflow-hidden shadow-2xl transform animate-in zoom-in-95 slide-in-from-bottom-4 duration-300">
        <div className="relative p-8 text-center">
          <button 
            onClick={onCancel}
            className="absolute top-6 right-6 p-2 hover:bg-gray-100 rounded-full transition-colors text-gray-400"
          >
            <X className="w-5 h-5" />
          </button>

          <div className={`mx-auto w-20 h-20 rounded-3xl ${colors[variant]} flex items-center justify-center mb-6 ring-8 ${ringColors[variant]} transition-all`}>
            <AlertTriangle className="w-10 h-10 text-white" />
          </div>

          <h3 className="text-2xl font-black text-gray-800 mb-3 uppercase tracking-tight">
            {title}
          </h3>
          <p className="text-gray-500 font-bold mb-8 leading-relaxed px-4">
            {message}
          </p>

          <div className="flex flex-col gap-3">
            <Button 
              variant={variant === 'danger' ? 'primary' : 'secondary'} 
              size="lg" 
              className={`w-full font-black text-lg py-4 rounded-2xl shadow-lg ${variant === 'danger' ? 'bg-red-500 hover:bg-red-600 shadow-red-200' : ''}`}
              onClick={onConfirm}
            >
              {confirmText}
            </Button>
            <Button 
              variant="outline" 
              size="lg" 
              className="w-full font-black text-lg py-4 border-2 border-gray-100 text-gray-400 hover:bg-gray-50 rounded-2xl"
              onClick={onCancel}
            >
              {cancelText}
            </Button>
          </div>
        </div>
      </Card>
    </div>
  );
};
