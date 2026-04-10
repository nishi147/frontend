'use client'

import Script from 'next/script';
import { useEffect, useRef } from 'react';

/**
 * AdSense Configuration and Helper
 */
export default function AdSense() {
  const clientId = process.env.NEXT_PUBLIC_ADSENSE_CLIENT_ID;

  if (!clientId) return null;

  return (
    <Script
      async
      src={`https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=${clientId}`}
      crossOrigin="anonymous"
      strategy="afterInteractive"
    />
  );
}

/**
 * Reusable Ad Unit Component
 */
interface AdUnitProps {
  slot: string;
  format?: 'auto' | 'fluid' | 'rectangle';
  style?: React.CSSProperties;
  className?: string;
}

export function AdUnit({ slot, format = 'auto', style, className }: AdUnitProps) {
  const clientId = process.env.NEXT_PUBLIC_ADSENSE_CLIENT_ID;
  const adRef = useRef<HTMLModElement>(null);

  useEffect(() => {
    if (!clientId) return;

    let timeoutId: NodeJS.Timeout;
    let attempts = 0;

    const pushAd = () => {
      // Only push the ad if the element is visible in the DOM (has width > 0)
      if (adRef.current && adRef.current.offsetWidth > 0) {
        try {
          ((window as any).adsbygoogle = (window as any).adsbygoogle || []).push({});
        } catch (e) {
          console.error('AdSense error:', e);
        }
      } else if (attempts < 5) {
        // Give the DOM a moment to paint/render. Limit retries to prevent infinite loops for hidden elements.
        attempts++;
        timeoutId = setTimeout(pushAd, 250);
      }
    };

    pushAd();

    return () => clearTimeout(timeoutId);
  }, [clientId]);

  if (!clientId) return null;

  return (
    <div className={`ad-container my-8 overflow-hidden flex justify-center ${className || ''}`}>
      <ins
        ref={adRef}
        className="adsbygoogle"
        style={{ display: 'block', ...style }}
        data-ad-client={clientId}
        data-ad-slot={slot}
        data-ad-format={format}
        data-full-width-responsive="true"
      />
    </div>
  );
}
