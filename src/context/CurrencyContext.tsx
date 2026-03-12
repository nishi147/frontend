"use client";

import React, { createContext, useContext, useState, useEffect } from 'react';

type Currency = 'INR' | 'USD' | 'EUR' | 'GBP';

interface CurrencyContextType {
  currency: Currency;
  setCurrency: (c: Currency) => void;
  formatPrice: (price: number) => string;
}

const CurrencyContext = createContext<CurrencyContextType | undefined>(undefined);

const rates = {
  INR: 1,
  USD: 0.012,
  EUR: 0.011,
  GBP: 0.0095,
};

const symbols = {
  INR: '₹',
  USD: '$',
  EUR: '€',
  GBP: '£',
};

export function CurrencyProvider({ children }: { children: React.ReactNode }) {
  const [currency, setCurrency] = useState<Currency>('INR');

  useEffect(() => {
    const saved = localStorage.getItem('ruzann_currency') as Currency;
    if (saved) setCurrency(saved);
  }, []);

  const handleSetCurrency = (c: Currency) => {
    setCurrency(c);
    localStorage.setItem('ruzann_currency', c);
  };

  const formatPrice = (price: number) => {
    const converted = price * rates[currency];
    return `${symbols[currency]}${converted.toLocaleString(undefined, { maximumFractionDigits: 0 })}`;
  };

  return (
    <CurrencyContext.Provider value={{ currency, setCurrency: handleSetCurrency, formatPrice }}>
      {children}
    </CurrencyContext.Provider>
  );
}

export function useCurrency() {
  const context = useContext(CurrencyContext);
  if (!context) throw new Error("useCurrency must be used within CurrencyProvider");
  return context;
}
