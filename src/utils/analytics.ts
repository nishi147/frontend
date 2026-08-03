// Centralized tracking utility for Meta Pixel and Google Analytics

export const META_PIXEL_ID = process.env.NEXT_PUBLIC_META_PIXEL_ID || '1210254384412672';
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
 * Tracks AddToCart — fired when user clicks Enroll/Book button
 */
export const trackAddToCart = (params: {
  content_name?: string;
  content_category?: string;
  content_ids?: string[];
  content_type?: string;
  value?: number;
  currency?: string;
  [key: string]: any;
}) => {
  if (typeof window === 'undefined') return;
  if ((window as any).fbq) {
    (window as any).fbq('track', 'AddToCart', params);
  }
  if ((window as any).gtag) {
    (window as any).gtag('event', 'add_to_cart', {
      currency: params.currency || 'INR',
      value: params.value,
      items: [{ item_name: params.content_name, item_category: params.content_category }]
    });
  }
};

/**
 * Tracks InitiateCheckout — fired just before Razorpay widget opens
 */
export const trackInitiateCheckout = (params: {
  content_name?: string;
  num_items?: number;
  value?: number;
  currency?: string;
  [key: string]: any;
}) => {
  if (typeof window === 'undefined') return;
  if ((window as any).fbq) {
    (window as any).fbq('track', 'InitiateCheckout', params);
  }
  if ((window as any).gtag) {
    (window as any).gtag('event', 'begin_checkout', {
      currency: params.currency || 'INR',
      value: params.value,
    });
  }
};

/**
 * Tracks Purchase — fired after payment is successfully verified
 * Includes eventID matching for Meta Conversions API (CAPI) deduplication
 */
export const trackPurchase = (params: {
  value: number;
  currency?: string;
  content_name?: string;
  content_ids?: string[];
  content_type?: string;
  transaction_id?: string;
  [key: string]: any;
}) => {
  if (typeof window === 'undefined') return;

  const eventId = params.transaction_id || params.order_id;
  const pixelData = {
    value: params.value,
    currency: params.currency || 'INR',
    content_name: params.content_name,
    content_ids: params.content_ids,
    content_type: params.content_type || 'product',
  };

  if ((window as any).fbq) {
    if (eventId) {
      // Pass eventID as 4th parameter for Meta Pixel & CAPI deduplication
      (window as any).fbq('track', 'Purchase', pixelData, { eventID: eventId });
    } else {
      (window as any).fbq('track', 'Purchase', pixelData);
    }
  }

  if ((window as any).gtag) {
    (window as any).gtag('event', 'purchase', {
      transaction_id: eventId || Date.now().toString(),
      currency: params.currency || 'INR',
      value: params.value,
      items: [{ item_name: params.content_name }]
    });
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
 * Tracks PageView for Google Analytics SPA route changes
 * (Meta Pixel PageView is handled automatically via MetaPixel.tsx on route change)
 */
export const trackPageView = (url: string) => {
  if (typeof window === 'undefined') return;

  // GA4 Config
  if ((window as any).gtag) {
    (window as any).gtag('config', GA_MEASUREMENT_ID, {
      page_path: url,
    });
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

