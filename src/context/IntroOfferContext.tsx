"use client";

import React, { createContext, useContext, useState } from 'react';
import axios from 'axios';
import { useRouter } from 'next/navigation';

interface IntroOfferContextType {
  isModalOpen: boolean;
  openIntroModal: () => void;
  closeIntroModal: () => void;
  isProcessing: boolean;
  handleClaimOffer: (introData: any) => Promise<void>;
}

const IntroOfferContext = createContext<IntroOfferContextType | undefined>(undefined);

export const IntroOfferProvider = ({ children }: { children: React.ReactNode }) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const router = useRouter();

  const openIntroModal = () => setIsModalOpen(true);
  const closeIntroModal = () => setIsModalOpen(false);

  const handleClaimOffer = async (introData: any) => {
    setIsProcessing(true);
    try {
      // 1. Create Order on Backend (Using absolute API URL)
      const res = await axios.post(`${process.env.NEXT_PUBLIC_API_URL}/api/payments/intro-order`, introData);
      
      const { id: orderId, amount, currency } = res.data.data;

      const key = process.env.NEXT_PUBLIC_RAZORPAY_KEY || 'rzp_test_SPPoz25OmAiMsD';

      // 2. Open Razorpay Checkout
      const options = {
        key: key,
        amount: amount,
        currency: currency,
        name: "RUZANN EdTech",
        description: "₹1 Introductory Offer",
        order_id: orderId,
        handler: async function (response: any) {
          try {
            const verifyRes = await axios.post(`${process.env.NEXT_PUBLIC_API_URL}/api/payments/intro-verify`, {
              ...response,
              ...introData
            });
            if (verifyRes.data.success) {
              router.push('/payment-success');
              setIsModalOpen(false);
            }
          } catch (err) {
            console.error(err);
            alert("Verification failed. Please contact support.");
          }
        },
        prefill: {
          name: introData.parentName,
          email: introData.email,
          contact: introData.phone,
        },
        theme: {
          color: "#FF9F1C",
        },
      };

      const rzp1 = new (window as any).Razorpay(options);
      rzp1.open();
    } catch (error: any) {
      console.error(error);
      alert(error.response?.data?.message || "Failed to initiate payment. Please try again.");
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <IntroOfferContext.Provider value={{ isModalOpen, openIntroModal, closeIntroModal, isProcessing, handleClaimOffer }}>
      {children}
    </IntroOfferContext.Provider>
  );
};

export const useIntroOffer = () => {
  const context = useContext(IntroOfferContext);
  if (context === undefined) {
    throw new Error('useIntroOffer must be used within an IntroOfferProvider');
  }
  return context;
};
