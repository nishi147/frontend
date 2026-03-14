"use client";

import React, { createContext, useContext, useState, useCallback, ReactNode } from 'react';
import Toast, { ToastType } from '@/components/ui/Toast';
import { ConfirmationModal } from '@/components/ui/ConfirmationModal';

interface ConfirmationConfig {
  title: string;
  message: string;
  resolve: (value: boolean) => void;
  confirmText?: string;
  cancelText?: string;
  variant?: 'danger' | 'warning' | 'info';
}

interface ToastContextType {
  showToast: (message: string, type?: ToastType) => void;
  confirm: (title: string, message: string, options?: Partial<Pick<ConfirmationConfig, 'confirmText' | 'cancelText' | 'variant'>>) => Promise<boolean>;
}

const ToastContext = createContext<ToastContextType | undefined>(undefined);

export const ToastProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [toast, setToast] = useState<{ message: string; type: ToastType } | null>(null);
  const [confirmConfig, setConfirmConfig] = useState<ConfirmationConfig | null>(null);

  const showToast = useCallback((message: string, type: ToastType = 'info') => {
    setToast({ message, type });
  }, []);

  const hideToast = useCallback(() => {
    setToast(null);
  }, []);

  const showConfirm = useCallback((title: string, message: string, options?: any) => {
    return new Promise<boolean>((resolve) => {
      setConfirmConfig({
        title,
        message,
        resolve,
        ...options
      });
    });
  }, []);

  const handleConfirm = useCallback(() => {
    if (confirmConfig) {
      confirmConfig.resolve(true);
      setConfirmConfig(null);
    }
  }, [confirmConfig]);

  const handleCancel = useCallback(() => {
    if (confirmConfig) {
      confirmConfig.resolve(false);
      setConfirmConfig(null);
    }
  }, [confirmConfig]);

  return (
    <ToastContext.Provider value={{ showToast, confirm: showConfirm }}>
      {children}
      {toast && (
        <Toast
          message={toast.message}
          type={toast.type}
          onClose={hideToast}
        />
      )}
      {confirmConfig && (
        <ConfirmationModal
          isOpen={true}
          title={confirmConfig.title}
          message={confirmConfig.message}
          confirmText={confirmConfig.confirmText}
          cancelText={confirmConfig.cancelText}
          variant={confirmConfig.variant}
          onConfirm={handleConfirm}
          onCancel={handleCancel}
        />
      )}
    </ToastContext.Provider>
  );
};

export const useToast = () => {
  const context = useContext(ToastContext);
  if (!context) {
    throw new Error('useToast must be used within a ToastProvider');
  }
  return context;
};
