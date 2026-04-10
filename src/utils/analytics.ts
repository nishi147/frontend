import posthog from 'posthog-js';
import { sendGAEvent } from '@next/third-parties/google';

/**
 * Unified event tracking function for GA4, Meta Pixel, and PostHog.
 * 
 * @param eventName Name of the event to track
 * @param params Additional event parameters/properties
 */
export const trackEvent = (eventName: string, params: Record<string, unknown> = {}) => {
  // 1. Google Analytics (GA4)
  try {
    sendGAEvent({ event: eventName, value: params });
  } catch (error) {
    console.error('GA4 Event Tracking Error:', error);
  }

  // 2. PostHog
  try {
    posthog.capture(eventName, params);
  } catch (error) {
    console.error('PostHog Event Tracking Error:', error);
  }

  // 3. Meta Pixel (Facebook)
  try {
    const win = typeof window !== 'undefined' ? (window as unknown as { fbq?: (action: string, event: string, params?: object) => void }) : null;
    if (win?.fbq) {
      win.fbq('track', eventName, params as object);
    }
  } catch (error) {
    console.error('Meta Pixel Event Tracking Error:', error);
  }
};

/**
 * Specifically track standard Meta Pixel events which might have different naming/params
 */
export const trackMetaEvent = (eventName: string, params: Record<string, unknown> = {}) => {
  try {
    const win = typeof window !== 'undefined' ? (window as unknown as { fbq?: (action: string, event: string, params?: object) => void }) : null;
    if (win?.fbq) {
      win.fbq('track', eventName, params as object);
    }
  } catch (error) {
    console.error('Meta Pixel Event Tracking Error:', error);
  }
};
