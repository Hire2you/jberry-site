export const GADS_ID = process.env.NEXT_PUBLIC_GADS_ID || 'AW-18381433323';

/** One Google Ads conversion action per lead channel, so each can be valued and
 *  reported separately. A blank label means the action isn't live yet — nothing fires. */
export const CONVERSIONS = {
  form: {
    label: process.env.NEXT_PUBLIC_GADS_FORM_LABEL || 'vC-HCJ77ht8cEOvT-bxE',
    value: 1.0,
  },
  phone: {
    label: process.env.NEXT_PUBLIC_GADS_PHONE_LABEL || 'S1GsCPGG_OQcEOvT-bxE',
    value: 1.0,
  },
  whatsapp: {
    label: process.env.NEXT_PUBLIC_GADS_WHATSAPP_LABEL || 'ZSSICL7T8eQcEOvT-bxE',
    value: 1.0,
  },
} as const;

export type ConversionKey = keyof typeof CONVERSIONS;

declare global {
  interface Window {
    gtag?: (...args: unknown[]) => void;
  }
}

/** gtag.js loads with afterInteractive, so a click or mount can beat it. Wait for
 *  window.gtag rather than queueing on dataLayer, which guarantees the config call
 *  has already run and the event is attributed. */
function withGtag(fn: (gtag: NonNullable<Window['gtag']>) => void, attempt = 0) {
  if (typeof window === 'undefined') return;
  if (window.gtag) {
    fn(window.gtag);
    return;
  }
  if (attempt > 40) return;
  window.setTimeout(() => withGtag(fn, attempt + 1), 250);
}

export function trackConversion(key: ConversionKey) {
  const { label, value } = CONVERSIONS[key];
  if (!label) return;
  withGtag((gtag) => {
    gtag('event', 'conversion', {
      send_to: `${GADS_ID}/${label}`,
      value,
      currency: 'GBP',
    });
  });
}
