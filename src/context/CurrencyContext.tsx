"use client";

import React, { createContext, useContext, useState, useEffect } from 'react';
import api from '@/utils/api';

type Currency = string;

interface CurrencyContextType {
  currency: Currency;
  setCurrency: (c: Currency) => void;
  formatPrice: (price: number) => string;
  availableCurrencies: string[];
}

const CurrencyContext = createContext<CurrencyContextType | undefined>(undefined);

export function CurrencyProvider({ children }: { children: React.ReactNode }) {
  const [currency, setCurrency] = useState<Currency>('INR');
  const [rates, setRates] = useState<Record<string, number>>({ INR: 1 });
  const [symbols, setSymbols] = useState<Record<string, string>>({ INR: '₹' });
  const [availableCurrencies, setAvailableCurrencies] = useState<string[]>(['INR']);

  useEffect(() => {
    const fetchLiveRates = async () => {
      try {
        const res = await api.get('/api/currencies');
        if (res.data.success && res.data.data.length > 0) {
          const newRates: Record<string, number> = {};
          const newSymbols: Record<string, string> = {};
          const available: string[] = [];
          
          let defaultCurr = 'INR';

          res.data.data.forEach((curr: any) => {
             newRates[curr.code] = curr.exchangeRate;
             newSymbols[curr.code] = curr.symbol;
             available.push(curr.code);
             if (curr.isDefault) defaultCurr = curr.code;
          });

          setRates(newRates);
          setSymbols(newSymbols);
          setAvailableCurrencies(available);

          // Only apply default if memory doesn't have a saved one yet OR saved is invalid
          const saved = localStorage.getItem('ruzann_currency') as Currency;
          if (saved && available.includes(saved)) {
            setCurrency(saved);
          } else {
            setCurrency(defaultCurr as Currency);
            localStorage.setItem('ruzann_currency', defaultCurr);
          }
        }
      } catch (err) {
        console.error("Failed to load live currency rates", err);
        // Fallback to saved
        const saved = localStorage.getItem('ruzann_currency') as Currency;
        if (saved) setCurrency(saved);
      }
    };
    fetchLiveRates();
  }, []);

  const handleSetCurrency = (c: Currency) => {
    setCurrency(c);
    localStorage.setItem('ruzann_currency', c);
  };

  const formatPrice = (price: number) => {
    const rate = rates[currency] || 1;
    const sym = symbols[currency] || '₹';
    const converted = price * rate;
    return `${sym}${converted.toLocaleString(undefined, { maximumFractionDigits: 0 })}`;
  };

  return (
    <CurrencyContext.Provider value={{ currency, setCurrency: handleSetCurrency, formatPrice, availableCurrencies }}>
      {children}
    </CurrencyContext.Provider>
  );
}

export function useCurrency() {
  const context = useContext(CurrencyContext);
  if (!context) throw new Error("useCurrency must be used within CurrencyProvider");
  return context;
}
