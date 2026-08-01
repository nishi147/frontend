"use client";

import React, { createContext, useContext, useState } from 'react';
import api from '@/utils/api';
import { useRouter } from 'next/navigation';
import { useToast } from '@/context/ToastContext';
import { useCurrency } from '@/context/CurrencyContext';
import { trackAddToCart, trackInitiateCheckout, trackPurchase } from '@/utils/analytics';

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
  const { showToast } = useToast();
  const { currency, formatPrice } = useCurrency();

  const openIntroModal = () => setIsModalOpen(true);
  const closeIntroModal = () => setIsModalOpen(false);

  const handleClaimOffer = async (introData: any) => {
    // Meta Pixel AddToCart
    trackAddToCart({
      content_name: 'Introductory Offer',
      content_category: 'IntroOffer',
      value: 99,
      currency: 'INR'
    });

    setIsProcessing(true);
    try {
      // 1. Create Order on Backend
      const res = await api.post('/api/payments/intro-order', {
        ...introData,
        currency: currency
      });
      
      const { id: orderId, amount, currency: orderCurrency } = res.data.data;

      const key = process.env.NEXT_PUBLIC_RAZORPAY_KEY || 'rzp_test_SPPoz25OmAiMsD';

      // 2. Open Razorpay Checkout
      const options = {
        key: key,
        amount: amount,
        currency: orderCurrency,
        name: "RUZANN EdTech",
        description: `${formatPrice(99)} Introductory Offer`,
        order_id: orderId,
        handler: async function (response: any) {
          try {
            const verifyRes = await api.post('/api/payments/intro-verify', {
              ...response,
              ...introData
            });
            if (verifyRes.data.success) {
              // Meta Pixel Purchase Event
              trackPurchase({
                value: 99,
                currency: 'INR',
                content_name: 'Introductory Offer',
                content_type: 'product',
              });
              router.push('/payment-success');
              setIsModalOpen(false);
            }
          } catch (err) {
            console.error(err);
            showToast("Verification failed. Please contact support.", "error");
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

      // Meta Pixel InitiateCheckout
      trackInitiateCheckout({
        content_name: 'Introductory Offer',
        value: 99,
        currency: 'INR'
      });

      rzp1.open();
    } catch (error: any) {
      console.error(error);
      showToast(error.response?.data?.message || "Failed to initiate payment. Please try again.", "error");
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
