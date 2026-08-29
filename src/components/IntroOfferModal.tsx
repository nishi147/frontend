"use client";

import React, { useState, useEffect } from 'react';
import { useIntroOffer } from '@/context/IntroOfferContext';
import { FreeDemoModal } from '@/components/modals/FreeDemoModal';

export const IntroOfferModal = () => {
  const { isModalOpen, closeIntroModal } = useIntroOffer();
  const [isDemoModalOpen, setIsDemoModalOpen] = useState(false);

  useEffect(() => {
    const handleOpenDemo = () => setIsDemoModalOpen(true);
    window.addEventListener('open-free-demo-modal', handleOpenDemo);
    return () => window.removeEventListener('open-free-demo-modal', handleOpenDemo);
  }, []);

  const handleClose = () => {
    closeIntroModal();
    setIsDemoModalOpen(false);
  };

  return (
    <FreeDemoModal 
      isOpen={isModalOpen || isDemoModalOpen} 
      onClose={handleClose} 
    />
  );
};

