'use client';
import { useState } from 'react';
import { site } from '@/lib/site';
import { GADS_ID } from '@/components/GoogleAds';

// Floating WhatsApp widget with pre-qualification step.
// Fires the Google Ads conversion (secondary action to start — same rule as before)
// directly on click, no GTM needed.
const OPTIONS = [
  { label: 'Loft conversion', msg: "Hi Jason, I'd like a quote for a loft conversion." },
  { label: 'Extension', msg: "Hi Jason, I'd like a quote for an extension." },
  { label: 'Something else', msg: 'Hi Jason, I have a building project to discuss.' },
];

declare global { interface Window { gtag?: (...args: unknown[]) => void } }

export default function WhatsAppWidget() {
  const [open, setOpen] = useState(false);

  function go(msg: string) {
    const label = process.env.NEXT_PUBLIC_GADS_WHATSAPP_LABEL;
    if (window.gtag && label) {
      window.gtag('event', 'conversion', { send_to: `${GADS_ID}/${label}` });
    }
    window.open(`https://wa.me/${site.whatsapp}?text=${encodeURIComponent(msg)}`, '_blank');
    setOpen(false);
  }

  return (
    <div className="fixed bottom-[5.25rem] right-4 z-50 flex flex-col items-end md:bottom-5 md:right-5">
      {open && (
        <div className="mb-3 w-64 rounded-lg border border-pine/15 bg-white p-4 shadow-xl">
          <p className="text-sm font-semibold">What's the project?</p>
          <div className="mt-3 flex flex-col gap-2">
            {OPTIONS.map((o) => (
              <button key={o.label} onClick={() => go(o.msg)}
                className="rounded border border-pine/20 px-3 py-2 text-left text-sm hover:border-whatsapp hover:bg-whatsapp/10">
                {o.label}
              </button>
            ))}
          </div>
        </div>
      )}
      <button onClick={() => setOpen(!open)} aria-label="Chat on WhatsApp"
        className="block h-14 w-14 shrink-0 rounded-full shadow-lg hover:scale-105 transition-transform">
        <img src="/images/whatsapp-icon.webp" alt="" className="h-full w-full rounded-full" width={56} height={56} />
      </button>
    </div>
  );
}
