// Centralized tracking utility for Meta Pixel and Google Analytics

export const META_PIXEL_ID = '1210254384412672';
export const GA_MEASUREMENT_ID = 'G-JK7E9ELJNE';

/**
 * Tracks a custom event in Meta Pixel and Google Analytics
 * @param eventName - Name of the event
 * @param params - Optional parameters for the event
 */
export const trackEvent = (eventName: string, params: Record<string, any> = {}) => {
  if (typeof window === 'undefined') return;

  // Google Analytics
  if ((window as any).gtag) {
    (window as any).gtag('event', eventName, params);
  }

  // Meta Pixel
  if ((window as any).fbq) {
    (window as any).fbq('trackCustom', eventName, params);
  }
};

/**
 * Specifically tracks a Lead - triggered when users show intent to enroll
 */
export const trackLead = (params: Record<string, any> = {}) => {
  if (typeof window === 'undefined') return;

  // Meta Pixel Standard Event
  if ((window as any).fbq) {
    (window as any).fbq('track', 'Lead', params);
  }

  // GA4 Recommended Event
  if ((window as any).gtag) {
    (window as any).gtag('event', 'generate_lead', params);
  }
};

/**
 * Specifically tracks a Contact - triggered when contact form is submitted
 */
export const trackContact = (params: Record<string, any> = {}) => {
  if (typeof window === 'undefined') return;

  // Meta Pixel Standard Event
  if ((window as any).fbq) {
    (window as any).fbq('track', 'Contact', params);
  }

  // GA4 Recommended Event
  if ((window as any).gtag) {
    (window as any).gtag('event', 'contact', params);
  }
};

/**
 * Tracks PageView - especially for SPA route changes
 */
export const trackPageView = (url: string) => {
  if (typeof window === 'undefined') return;

  // GA4 Config
  if ((window as any).gtag) {
    (window as any).gtag('config', GA_MEASUREMENT_ID, {
      page_path: url,
    });
  }

  // Meta Pixel
  if ((window as any).fbq) {
    (window as any).fbq('track', 'PageView');
  }
};

// ---------------------------------------------------------------------------
// Klaviyo Client-Side Helpers
// Uses the window._learnq push API loaded by the Klaviyo JS snippet
// ---------------------------------------------------------------------------

/**
 * Identifies a user in Klaviyo (call after login / signup / form submit)
 * @param profile - User profile data
 */
export const klaviyoIdentify = (profile: {
  email: string;
  firstName?: string;
  lastName?: string;
  phone?: string;
  [key: string]: any;
}) => {
  if (typeof window === 'undefined') return;
  const learnq = (window as any)._learnq;
  if (!learnq) return;

  learnq.push(['identify', {
    $email: profile.email,
    ...(profile.firstName && { $first_name: profile.firstName }),
    ...(profile.lastName && { $last_name: profile.lastName }),
    ...(profile.phone && { $phone_number: profile.phone }),
    // Any extra properties
    ...Object.fromEntries(
      Object.entries(profile).filter(([k]) => !['email', 'firstName', 'lastName', 'phone'].includes(k))
    ),
  }]);
};

/**
 * Tracks a custom Klaviyo event client-side
 * @param eventName - Name of the event (e.g. "Viewed Course", "Started Trial")
 * @param properties - Event properties
 */
export const klaviyoTrack = (eventName: string, properties: Record<string, any> = {}) => {
  if (typeof window === 'undefined') return;
  const learnq = (window as any)._learnq;
  if (!learnq) return;

  learnq.push(['track', eventName, properties]);
};

